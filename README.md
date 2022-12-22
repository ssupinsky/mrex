# mrex
Run commands for every package in a monorepo workspace, with respect to the order of inclusion.
 

##### Usage:
`npm mrx <command>`
`yarn mrx <command>`
`pnpm mrx <command>`

##### For example:
`yarn mrx build`

**mrex** will detect npm yarn or pnpm workspaces and run the command with the proper package manager.
