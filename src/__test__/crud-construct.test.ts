import '@aws-cdk/assert/jest';
import * as path from 'path';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import { CURDConstruct } from '../construct/crud-construct';

test('curd-construct', () => {
  const app = new App();
  const stack = new Stack(app, 'test');

  process.env.APPS_PATH = path.resolve(__dirname, '..', 'apps', 'src');
  new CURDConstruct(stack, 'CURDConsturct', {
    table: new Table(stack, 'test-table', {
      partitionKey: {
        name: 'items',
        type: AttributeType.STRING,
      },
    }),
    tableRole: new Role(stack, 'IAMFunctionRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    }),
  });
  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
  expect(stack).toCountResources('AWS::Lambda::Function', 5);

});