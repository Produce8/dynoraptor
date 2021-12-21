import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import nodePlop from 'node-plop';
import path from 'path';
import { pick } from 'ramda';
import Umzug from 'umzug';

import logger from '../helpers/logger';
import { getCurrentYYYYMMDDHHmms } from '../helpers/path';
import DynamoDBStorage from '../storages/dynamodb';

export {DynamoDBStorage};

export interface MigratorOptions {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpointUrl?: string;
  dynamodb?: DocumentClient;
  tableName?: string;
  attributeName?: string;
  migrationsPath?: string;
}

interface Generator {
  generate(migrationName: string): Promise<void>;
}

export class Migrator extends Umzug implements Generator {
  private generator;
  private migrationsPath: string;
  private region: string;
  private accessKeyId: string;
  private tableName: string;
  private attributeName: string;


  /**
   * Migrator factory function, creates an umzug instance with dynamodb storage.
   * @param options
   * @param options.region - an AWS Region
   * @param options.dynamodb - a DynamoDB document client instance
   * @param options.endpointUrl - an optional endpoint URL for local DynamoDB instances
   * @param options.tableName - a name of migration table in DynamoDB
   * @param options.attributeName - name of the table primaryKey attribute in DynamoDB
   */
  constructor(options: MigratorOptions = {}) {
    let { dynamodb, tableName, attributeName, migrationsPath, region } = options;

    dynamodb = dynamodb || new DocumentClient(pick(['region', 'accessKeyId', 'secretAccessKey', 'endpointUrl'], options));
    tableName = tableName || 'migrations';
    attributeName = attributeName || 'name';
    migrationsPath = migrationsPath || 'migrations';
    region = region || 'us-west-2';

    super({
      storage: new DynamoDBStorage({ dynamodb, tableName, attributeName }),
      migrations: {
        params: [dynamodb, options],
        path: migrationsPath,
      },
      logging: logger.log
    });

    const plop = nodePlop(path.join(__dirname, '../../.plop/plopfile.js'));
    this.generator = plop.getGenerator('migration');
    this.migrationsPath = migrationsPath;
    this.region = region;
    this.tableName = tableName;
    this.attributeName = attributeName;
  }

  async generate(migrationName: string) {
    await this.generator.runActions({
      migrationsPath: this.migrationsPath,
      timestamp: getCurrentYYYYMMDDHHmms(),
      name: migrationName
    });
  }

  async prepare() {
    const params = {
      TableName : this.tableName,
      KeySchema: [       
          { AttributeName: this.attributeName, KeyType: 'HASH'},
      ],
      AttributeDefinitions: [
          { AttributeName: this.attributeName, AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    };
    AWS.config.update(
      {
        region: this.region,
      }
    );
    const dbClient = new AWS.DynamoDB();
    const tablesResult = await dbClient.listTables().promise();
    const tables = tablesResult.TableNames;
    if (tables.length > 0 && !tables.includes(this.tableName)) {
      await dbClient.createTable(params).promise();
    }
    let active = false;
    while (!active) {
      const describeResult = await dbClient.describeTable({TableName:this.tableName}).promise();
      if (describeResult.Table.TableStatus === 'ACTIVE') {
        active = true;
      }
    }
  }
}

/**
 * Migrator instance with options by default.
 */
export const defaultMigrator: Migrator = new Migrator();
