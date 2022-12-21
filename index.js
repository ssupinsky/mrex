#!/usr/bin/env node
import path from 'node:path';
import { loadJsonFile } from 'load-json-file';
import { loadYamlFile } from 'load-yaml-file';
import { findUp } from 'find-up';
import globAll from 'glob-all';
import Graph from 'graph-data-structure';
import { execaSync } from 'execa';
import { isNpm, isNpmOrYarn } from 'is-npm';


const main = async () => {
  const argv = process.argv.slice(2);
  const command = argv[0];

  if (!command) {
    console.error('\nPlease specify a command to run\n');
    process.exit(1);
  }

  const rootManifestPath = await findUp('package.json');
  const rootManifest = await loadJsonFile(rootManifestPath);

  let packageManager;
  let workspaces;
  if (isNpmOrYarn && Array.isArray(rootManifest.workspaces)) {
    packageManager = isNpm ? 'npm' : 'yarn';
    workspaces = rootManifest.workspaces;
  } else {
    try {
      const { packages } = await loadYamlFile(path.join(path.dirname(rootManifestPath), 'pnpm-workspace.yaml'));
      workspaces = packages;
      packageManager = 'pnpm';
    } catch (e) {
      console.error('No workspaces found');
      process.exit(1);
    }
  }

  const packagePaths = globAll.sync(workspaces).map(aPath => path.resolve(aPath));
  const packageManifests = await Promise.all(
    packagePaths.map(aPath => loadManifest(aPath))
  );
  const packagesByName = Object.assign({},
    ...packageManifests.map(manifestInfo => ({ [manifestInfo.manifest.name]: manifestInfo }))
  );
  const packageNames = Object.keys(packagesByName);

  const packageGraph = Graph();
  for (const name of packageNames) {
    for (const { manifest } of packageManifests) {
      if (allDependenciesFromManifest(manifest).includes(name)) {
        packageGraph.addEdge(name, manifest.name);
      } else {
        packageGraph.addNode(name);
      }
    }
  }

  const packageNamesSorted = packageGraph.topologicalSort();
  console.log(`[mrex] detected workspace packages:\n  ${packageNamesSorted.join('\n  ')}`);

  for (const name of packageNamesSorted) {
    const { pathToPackage } = packagesByName[name];
    console.log(`\n[mrex] running "${packageManager} run ${argv.join(' ')}" at ${pathToPackage}\n`);

    execaSync(packageManager, ['run', ...argv], {
      cwd: pathToPackage,
      stdio: "inherit",
    });
  }
}

const loadManifest = async (pathToPackage) => {
  const manifest = await loadJsonFile(path.join(pathToPackage, 'package.json'));
  return { pathToPackage, manifest };
}

const allDependenciesFromManifest = (manifest) => (
  Object.keys(manifest.dependencies || {}).concat(Object.keys(manifest.devDependencies || {}))
);

await main();
