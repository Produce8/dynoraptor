#!/usr/bin/env node

import clc from 'cli-color';
import yargs from 'yargs';
import {cosmiconfigSync} from 'cosmiconfig';

import migrate from './commands/migrate';
import migrateUndo from './commands/migrate-undo';
import migrateUndoAll from './commands/migrate-undo-all';
import migrationGenerate from './commands/migration-generate';
import logger from './helpers/logger';
import version from './helpers/version';

const moduleName = 'dynoraptor';
const versions = [
  'Node: ' + version.getNodeVersion(),
  'CLI: '  + version.getCliVersion(),
];

logger.log();
logger.log(clc.underline(`DynamoDB migrations tool CLI [${versions.join(', ')}]`));
logger.log();

const cli = yargs
  .help().alias('h', 'help')
  .version().alias('v', 'version')
  .command('migrate', 'Run pending migrations', migrate)
  .command('migrate:status', 'List the status of all migrations', migrate)
  .command('migrate:undo', 'Reverts a migration', migrateUndo)
  .command('migrate:undo:all', 'Revert all migrations ran', migrateUndoAll)
  .command(['migrate:generate', 'migrate:create'], 'Generates a new migration file', migrationGenerate)
  .wrap(yargs.terminalWidth())
  .strict();

const cosminstance = cosmiconfigSync(moduleName);
const cosmic = cosminstance.search();

if (cosmic?.config) {
  cli.config(cosmic.config);
}

const args = cli.argv;

// if no command then show help
if (!args._[0]) {
  cli.showHelp();
}
