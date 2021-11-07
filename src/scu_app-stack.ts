import * as path from 'path';
import { Role, ServicePrincipal, ManagedPolicy, PolicyDocument } from '@aws-cdk/aws-iam';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { ItemsAPI } from './construct/api-construct';
import { CURDConstruct } from './construct/crud-construct';
import { ItemTable } from './construct/db-construct';


export class ScuAppStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        process.env.BASE_PATH = __dirname;
        process.env.APPS_PATH = path.resolve(process.env.BASE_PATH, 'apps', 'src');

        const table = new ItemTable(this, 'ItemTable', {
            tableName: 'items',
            primaryKeyName: 'itemId',
        });

        const role = new Role(this, 'nRole2', {
            roleName: 'nRole2',
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName(
                    'service-role/AWSLambdaBasicExecutionRole'),
            ],
            inlinePolicies: {
                dbAccess: new PolicyDocument({
                    statements: [table.getAccessPolicy()],
                }),
            },
        });

        const curdConstruct = new CURDConstruct(this, `${id}-CURDConstruct`, {
            table: table,
            tableRole: role,
        });

        const itemsAPI = new ItemsAPI(this, 'APIConstruct', {
            restApiName: 'Items Service',
            generalLambdaFunctions: {
                GET: curdConstruct.getAll,
                POST: curdConstruct.createOne,
            },
            specificLambdaFunctions: {
                GET: curdConstruct.getOne,
                PUT: curdConstruct.updateOne,
                DELETE: curdConstruct.deleteOne,
            },
        });
    }
}