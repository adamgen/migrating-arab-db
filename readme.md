# Migrating from a large mdb to mysql

_\*Note that this is not a guide or example, just a memo to my future self about the techniques that I've used for migrating this DB_

## The problem

The mdb export file was corrupted, so I've exported a csv and parsed it instead.

## The solution, [csv.mjs](./lib/csv.mjs)

Most of the code is just a boilerplate for csv.mjs.

The util function are:

- **intify** - Solves the bad types that mdb has.

- **readFileLines** - The readFileLines function is pretty awesome, and can be improved by executing after each line read. Not needed in my use case. [stackoverflow credit](https://stackoverflow.com/a/32599033/1641334).
