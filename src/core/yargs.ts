import { pick } from 'ramda';
import { Arguments, Argv } from 'yargs';

import { Migrator } from './migrator';

import dotenv from 'dotenv';

dotenv.config();

export interface BaseCliOptions {
  optionsPath: string;
  migrationsPath: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  endpointUrl: string;
  tableName: string;
  attributeName: string;
  typescript: boolean;
}

const envVariables = {
  migrationsPath: process.env.MIGRATIONS_PATH || 'migrations',
  accessKeyId: process.env.AWS_ACCESS_KEY || '',
  secretKey: process.env.AWS_SECRET_KEY || '',
  region: process.env.AWS_REGION || 'us-west-2',
  endpointUrl: process.env.DYNAMO_ENDPOINT_URL || '',
  migrationTableName: process.env.MIGRATION_TABLE_NAME || 'migrations',
  attributeName: process.env.MIGRATION_PRIMARY_KEY || 'name',
  typscript: process.env.TYPESCRIPT || false,
};

export function baseOptions(yargs: Argv<BaseCliOptions>) {
  return yargs
    .option('migrations-path', {
      describe: 'The path to the migrations folder',
      default: envVariables.migrationsPath,
      type: 'string'
    })
    .option('access-key-id', {
      describe: 'AWS access key id',
      default: envVariables.accessKeyId,
      type: 'string'
    })
    .option('secret-access-key', {
      describe: 'AWS secret access key',
      default: envVariables.secretKey,
      type: 'string'
    })
    .option('region', {
      describe: 'AWS service region',
      default: envVariables.region,
      type: 'string'
    })
    .option('endpoint-url', {
      describe: 'The DynamoDB endpoint url to use. The DynamoDB local instance url could be specified here.',
      default: envVariables.endpointUrl,
      type: 'string'
    })
    .option('table-name', {
      describe: 'The DynamoDB table name',
      default: envVariables.migrationTableName,
      type: 'string'
    })
    .option('attribute-name', {
      describe: 'The DynamoDB primaryKey attribute name',
      default: envVariables.attributeName,
      type: 'string'
    })
    .option('typescript', {
      describe: 'Create migration file as typescript',
      default: envVariables.typscript,
      type: 'boolean',
      alias: 'ts'
    });
}

export function baseHandler<T extends BaseCliOptions>(callback: (args: Arguments<T>, migrator: Migrator) => void) {
  return (args: Arguments<T>): void => {
    const migrator = new Migrator({
      ...pick(['region', 'accessKeyId', 'secretAccessKey', 'endpointUrl', 'typescript'], args),
      tableName: args.tableName,
      attributeName: args.attributeName,
      migrationsPath: args.migrationsPath,
    });

    callback(args, migrator);
  };
}
