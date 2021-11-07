import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import { Construct, RemovalPolicy } from '@aws-cdk/core';

export interface ItemTableProps {
  tableName: string;
  primaryKeyName: string;
}

export class ItemTable extends Table {
  constructor(scope: Construct, id: string, props: ItemTableProps) {
    super(scope, id, {
      partitionKey: {
        name: props.primaryKeyName,
        type: AttributeType.STRING,
      },
      tableName: props.tableName,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
  getAccessPolicy(): PolicyStatement {
    return new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
        'dynamodb:GetItem',
        'dynamodb:Query',
        'dynamodb:Scan',
      ],
      resources: [this.tableArn],
    });
  }
}