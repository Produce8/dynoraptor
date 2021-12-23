import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import nodePlop from 'node-plop';
import path from 'path';
import { pick } from 'ramda';
import Umzug from 'umzug';
import { customTimeout } from '../helpers/eventHelpers';

import logger from '../helpers/logger';
import { getCurrentYYYYMMDDHHmms } from '../helpers/path';
import DynamoDBStorage from '../storages/dynamodb';

import fs from 'fs';

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
  typescript?: boolean;
}

export type schemaKeyDefinition = {
  AttributeName: string;
  KeyType: string;
};

export type schemaAttributeDefinition = {
  AttributeName: string;
  AttributeType: string;
};

export type dynamoSchemaType = {
  TableName: string;
  KeySchema: schemaKeyDefinition[];
  AttributeDefinitions: schemaAttributeDefinition[];
  BillingMode: string;
};

interface Generator {
  generate(migrationName: string): Promise<void>;
}

export class Migrator extends Umzug implements Generator {
  private generator;
  private migrationsPath: string;
  private region: string;
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
    // eslint-disable-next-line prefer-const
    let { dynamodb, tableName, attributeName, migrationsPath, region, typescript } = options;

    dynamodb = dynamodb || new DocumentClient(pick(['region', 'accessKeyId', 'secretAccessKey', 'endpointUrl'], options));
    tableName = tableName || 'migrations';
    attributeName = attributeName || 'name';
    migrationsPath = migrationsPath || 'migrations';
    region = region || 'us-west-2';

    super({
      storage: new DynamoDBStorage({ dynamodb, tableName, attributeName, timestamp: true }),
      migrations: {
        params: [dynamodb, options],
        path: migrationsPath,
      },
      logging: logger.log
    });

    const plopFile = typescript ? '../../.plop/plopfilets.js' : '../../.plop/plopfile.js';
    const plop = nodePlop(path.join(__dirname, plopFile));
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

  private async _validateMigrationsPathExistence() {
      try {
        await fs.promises.mkdir(this.migrationsPath);
    } catch (error) {
        console.log(error);
    }
  }

  private async _handleTableCreation(client: AWS.DynamoDB, params: dynamoSchemaType) {
    const tablesResult = await client.listTables().promise();
    const tables = tablesResult.TableNames;
    if (tables.length > 0 && !tables.includes(this.tableName)) {
      await client.createTable(params).promise();
    }
  }

  private async _awaitTableActiveStatus(client: AWS.DynamoDB, retries = 10) {
    let active = false;
    let status;
    for (let i = 0; i < retries; i++) {
      if(active === false) {
        const describeResult = await client.describeTable({TableName:this.tableName}).promise();
        if (describeResult.Table.TableStatus === 'ACTIVE') {
          active = true;
          status = describeResult.Table.TableStatus;
        }
        await customTimeout(i * 1000);
      }
    }
    if (!active) {
      throw `Migration table is in ${status} status after ${retries} retries`;
    }
  }

  async prepare() {
    AWS.config.update(
      {
        region: this.region,
      }
    );
    const params: dynamoSchemaType = {
      TableName : this.tableName,
      KeySchema: [       
          { AttributeName: this.attributeName, KeyType: 'HASH'},
      ],
      AttributeDefinitions: [
          { AttributeName: this.attributeName, AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    };
    const dbClient = new AWS.DynamoDB();
    await this._validateMigrationsPathExistence();
    await this._handleTableCreation(dbClient, params);
    await this._awaitTableActiveStatus(dbClient);
  }
}

/**
 * Migrator instance with options by default.
 */
export const defaultMigrator: Migrator = new Migrator();
