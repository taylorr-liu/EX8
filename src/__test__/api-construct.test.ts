import '@aws-cdk/assert/jest';
//import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { InlineCode, Function, Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { ItemsAPI, ItemsAPIProps } from '../construct/api-construct';

test('api-construct-specific', () => {
  const app = new App();
  const stack = new Stack(app, 'stack');
  const testFunc = new Function(stack, 'testFunc', {
    runtime: Runtime.NODEJS_12_X,
    handler: 'index.handler',
    code: new InlineCode(`
      export async function handler() {
        return {
          statusCode: 200,
          body: ""
        };
      }
    `),
  });

  [
    {
      expectedMethods: ['GET'],
      expectedPaths: ['/items'],
      props: <ItemsAPIProps>{
        generalLambdaFunctions: {
          GET: testFunc,
        },
      },
    },
    {
      expectedMethods: ['POST'],
      expectedPaths: ['/items'],
      props: <ItemsAPIProps>{
        generalLambdaFunctions: {
          POST: testFunc,
        },
      },
    },
    {
      expectedMethods: ['PUT'],
      expectedPaths: ['/items'],
      props: <ItemsAPIProps>{
        generalLambdaFunctions: {
          PUT: testFunc,
        },
      },
    },
    {
      expectedMethods: ['DELETE'],
      expectedPaths: ['/items'],
      props: <ItemsAPIProps>{
        generalLambdaFunctions: {
          DELETE: testFunc,
        },
      },
    },
    {
      expectedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      expectedPaths: ['/items/{id}'],
      props: <ItemsAPIProps>{
        specificLambdaFunctions: {
          GET: testFunc,
          POST: testFunc,
          PUT: testFunc,
          DELETE: testFunc,
        },
      },
    },
  ].forEach((expected, i) => {
    const name = `APIConstruct${i}`;
    let expectedFuncs = expected.expectedPaths.map((path) =>
      expected.expectedMethods.map((method) => [path, method]))
      .reduce((pre, cur) => pre.concat(cur));

    new ItemsAPI(stack, name, expected.props)
      .methods.forEach((method) => {
        expectedFuncs = expectedFuncs.filter((pair) =>
          pair[0] != method.resource.path && pair[1] != method.httpMethod);
      });

    expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
    expect(stack).toHaveResource('AWS::ApiGateway::RestApi');
    expect(expectedFuncs).toStrictEqual([]);

    stack.tags.removeTag(name, 1);
  });
});