🧨 Bobolink
==============

The DynamoDB Migrations Tool Command Line Interface (CLI).

<!-- [![Build Status](https://img.shields.io/github/workflow/status/Produce8/dynoraptor/release)](https://github.com/Produce8/dynoraptor/actions)
[![Coverage Status](https://coveralls.io/repos/github/Produce8/dynoraptor/badge.svg?branch=master)](https://coveralls.io/github/Produce8/dynoraptor?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) -->


Table of Contents
-----------------
- [Installation](#installation)
- [Documentation](#documentation)


Installation
------------

Make sure you have [AWS-SDK](https://aws.amazon.com/sdk-for-node-js/) installed and configured properly. Then install the Dynamit CLI to be used in your project with

```bash
$ npm install --save-dev dynoraptor
```

And then you should be able to run the CLI with

```bash
$ npx dynoraptor --help
```

Migration records are supposed to be stored in the DynamoDB table with the `table-name` (`"migrations"` by default) and primary key `attribute-name` (`"name"` by default) defined as optional cli options. The tool cannot create the table for you yet, so make sure you created it properly. See [Creating a Table Developer Guide](https://docs.amazonaws.cn/en_us/amazondynamodb/latest/developerguide/WorkingWithTables.Basics.html#WorkingWithTables.Basics.CreateTable)


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
