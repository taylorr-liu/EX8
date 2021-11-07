const { AwsCdkTypeScriptApp } = require('projen');
const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.95.2',
  defaultReleaseBranch: 'main',
  name: 'scu_app',
  tsconfig: {
    compilerOptions: {
      noUnusedLocals: false,
      noUnusedParameters: false,
    },
  },
  devDeps: [
    'esbuild',
    'aws-sdk',
    'softchef-utility',
    'path',
    '@aws-cdk/assert',
  ],
  cdkDependencies: [
    '@aws-cdk/aws-apigateway',
    '@aws-cdk/core',
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-lambda-nodejs',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
  ],
});
project.synth();