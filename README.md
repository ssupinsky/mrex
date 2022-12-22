# mrex
Run commands for every package in a monorepo workspace, with respect to the order of inclusion.
 

##### Usage:
`npm run mrx <command>`

or

`yarn mrx <command>`

or

`pnpm mrx <command>`

##### For example:
`yarn mrx build` - runs a `build` script in every package, starting with the ones that are required by other packages. 

**mrex** will detect `npm`, `yarn` or `pnpm` workspaces and run the command with the proper package manager.
