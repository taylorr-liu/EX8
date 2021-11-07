import '@aws-cdk/assert/jest';
import { App } from '@aws-cdk/core';
import { ScuAppStack } from '../scu_app-stack';

test('Snapshot', () => {
  const app = new App();
  const stack = new ScuAppStack(app, 'stack');

  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
  expect(stack).toHaveResource('AWS::DynamoDB::Table');
  expect(stack).toHaveResource('AWS::ApiGateway::RestApi');
  expect(stack).toCountResources('AWS::ApiGateway::Method', 5);
  expect(stack).toCountResources('AWS::Lambda::Function', 5);
});