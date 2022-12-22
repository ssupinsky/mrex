# mrex
Run package scripts for every package in a monorepo workspace, with respect to the order of inclusion.

**mrex** is short for **monorepo exec**
 

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

Runs a `build` script in every package, starting with the ones that are required by other packages. 

**mrex** will detect `npm`, `yarn` or `pnpm` workspaces and run the command with the proper package manager.
