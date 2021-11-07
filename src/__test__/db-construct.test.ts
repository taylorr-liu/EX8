import '@aws-cdk/assert/jest';
import { App, Stack } from '@aws-cdk/core';
import { ItemTable } from '../construct/db-construct';

test('db-construct', () => {
  const app = new App();
  const stack = new Stack(app, 'test');
  const table = new ItemTable(stack, 'test-ItemTable', {
    tableName: 'items',
    primaryKeyName: 'itemId',
  });
  const policy = table.getAccessPolicy();

  expect(stack).toHaveResource('AWS::DynamoDB::Table');
  expect(policy.hasResource).toBeTruthy();
  [
    'dynamodb:PutItem',
    'dynamodb:UpdateItem',
    'dynamodb:DeleteItem',
    'dynamodb:GetItem',
    'dynamodb:Query',
    'dynamodb:Scan',
  ].forEach((action) => {
    expect(policy.toJSON().Action).toContain(action);
  });
  expect(app.synth().getStackArtifact(stack.artifactId).template)
    .toMatchSnapshot();
});