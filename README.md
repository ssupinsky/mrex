# mrex

**mrex** is short for **monorepo exec**

Run package scripts for every package in a monorepo that uses workspaces, with respect to the order of inclusion.

## Motivation

Assume a monorepo with a structure like this:
```
some-monorepo
-- packages
---- packageA
---- packageB
---- packageC
```
where
- *packageA* depends on *packageB* and *packageC*,  
- *packageB* depends on *packageC*

Then the correct order for running, let's say, a build command, would be
- *packageC*
- *packageB*
- *packageA*

But older `yarn` versions [don't account](https://github.com/hfour/wsrun) for dependencies between packages in a workspace.
This package was created to solve this problem.

## Installation
```
npm i -D mrex
```
or
```
yarn add -D mrex
```
or
```
pnpm i -D mrex
```


## Usage:
```
npm run mrex <command>
```
or
```
yarn mrex <command>
```
or
```
pnpm mrex <command>
```

### For example:

```
yarn mrex build
```

Runs a `build` script in every package, in correct order. 

**mrex** will detect `npm`, `yarn` or `pnpm` workspaces and run the command with the proper package manager.
