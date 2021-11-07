import { App } from '@aws-cdk/core';
import { ScuAppStack } from './scu_app-stack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new ScuAppStack(app, 'ScuAppStack-dev', { env: devEnv });
// new ScuAppStack(app, 'ScuAppStack-prod', { env: prodEnv });

app.synth();