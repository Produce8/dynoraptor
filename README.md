Dynoraptor
==============

The DynamoDB Migrations Tool Command Line Interface (CLI).

Table of Contents
-----------------
- [Installation](#installation)
- [Setup](#Setup)
- [Usage](#Usage)
- [Documentation](#documentation)


Installation
------------

Make sure you have [AWS-SDK](https://aws.amazon.com/sdk-for-node-js/) installed and configured properly. Then install the Dynamit CLI to be used in your project with

```bash
$ npm install --save-dev @produce8/dynoraptor-cli
```

And then you should be able to run the CLI with

```bash
$ npx dynoraptor --help
```

Migration records are supposed to be stored in the DynamoDB table with the `table-name` (`"migrations"` by default) and primary key `attribute-name` (`"name"` by default) defined as optional cli options. The tool cannot create the table for you yet, so make sure you created it properly. See [Creating a Table Developer Guide](https://docs.amazonaws.cn/en_us/amazondynamodb/latest/developerguide/WorkingWithTables.Basics.html#WorkingWithTables.Basics.CreateTable)


Setup
-----

There are two patterns of use for this tool. Configuration can be provided via the command line arguments, or with the use of
a `.env` file. E.g:
```
MIGRATIONS_PATH=migrations
AWS_ACCESS_KEY=YOUR_AWS_ACCESS_KEY
AWS_SECRET_KEY=YOUR_AWS_SECRET_KEY
AWS_REGION=us-west-2
DYNAMO_ENDPOINT_URL=YOUR_DYNAMO_ENDPOINT
MIGRATION_TABLE_NAME=migrations
MIGRATION_PRIMARY_KEY=name
TYPESCRIPT=false
```

Usage
-----

```
npx dynoraptor [command]

Commands:
  dynoraptor migrate                        Run pending migrations
  dynoraptor migrate:status                 List the status of all migrations
  dynoraptor migrate:undo                   Reverts a migration
  dynoraptor migrate:undo:all               Revert all migrations ran
  dynoraptor migration:generate             Generates a new migration file       [aliases: migration:create]

Options:
  --version  Show version number                                         [boolean]
  --help     Show help                                                   [boolean]
```


Documentation
-------------

- [CLI Options](docs/README.md)
- [Frequently Asked Questions](docs/FAQ.md)
