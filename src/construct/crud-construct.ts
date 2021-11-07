import { join } from 'path';
import { Table } from '@aws-cdk/aws-dynamodb';
import { Role } from '@aws-cdk/aws-iam';
import { Function } from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Construct } from '@aws-cdk/core';

export interface CURDConstructProps {
  /**
     * @Table table The DynamoDB table to CURD.
     */
  table: Table;
  /**
     * @Role tableRole The IAM role with the policy to access the previous DynamoBD
     */
  tableRole: Role;
}

/**
 * A construct having CURD lambda functions.
 */
export class CURDConstruct extends Construct {
  /**
     * @Function The lambda function to get a specific item.
     */
  public readonly getOne: Function;
  /**
     * @Function The lambda function to get all items.
     */
  public readonly getAll: Function;
  /**
     * @Function The lambda function to create one item.
     */
  public readonly createOne: Function;
  /**
     * @Function The lambda function to update a specific item.
     */
  public readonly updateOne: Function;
  /**
     * @Function The lambda function to delete a specific item.
     */
  public readonly deleteOne: Function;

  /**
     * A construct having CURD lambda functions.
     * @param scope
     * @param id
     * @param props The props containing the DynamoDB Table to access and the IAM Role with accessibility.
     */
  constructor(scope: Construct, id: string, props: CURDConstructProps) {
    super(scope, id);

    this.getOne = new NodejsFunction(this, 'getOneItemFunction', {
      entry: `${process.env.APPS_PATH}/data/getone/index.js`,
      handler: 'handler',
      depsLockFilePath: `${process.env.APPS_PATH}/../package-lock.json`,
      environment: {
        TABLE_NAME: props.table.tableName,
        PRIMARY_KEY: 'itemId',
      },
      role: props.tableRole,
    });

    this.getAll = new NodejsFunction(this, 'getAllItemsFunction', {
      entry: `${process.env.APPS_PATH}/data/getall/index.js`,
      handler: 'handler',
      depsLockFilePath: `${process.env.APPS_PATH}/../package-lock.json`,
      environment: {
        TABLE_NAME: props.table.tableName,
        PRIMARY_KEY: 'itemId',
      },
      role: props.tableRole,
    });

    this.createOne = new NodejsFunction(this, 'createItemFunction', {
      entry: `${process.env.APPS_PATH}/data/create/index.js`,
      handler: 'handler',
      depsLockFilePath: `${process.env.APPS_PATH}/../package-lock.json`,
      environment: {
        TABLE_NAME: props.table.tableName,
        PRIMARY_KEY: 'itemId',
      },
      role: props.tableRole,
    });

    this.updateOne = new NodejsFunction(this, 'updateItemFunction', {
      entry: `${process.env.APPS_PATH}/data/update/index.js`,
      handler: 'handler',
      depsLockFilePath: `${process.env.APPS_PATH}/../package-lock.json`,
      environment: {
        TABLE_NAME: props.table.tableName,
        PRIMARY_KEY: 'itemId',
      },
      role: props.tableRole,
    });

    this.deleteOne = new NodejsFunction(this, 'deleteItemFunction', {
      entry: `${process.env.APPS_PATH}/data/delete/index.js`,
      handler: 'handler',
      depsLockFilePath: `${process.env.APPS_PATH}/../package-lock.json`,
      environment: {
        TABLE_NAME: props.table.tableName,
        PRIMARY_KEY: 'itemId',
      },
      role: props.tableRole,
    });
  }
}