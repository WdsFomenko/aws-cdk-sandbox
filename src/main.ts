import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TestOrgCommonEnvRootStack } from './stacks';
import { TestOrgStagingEnvParameters } from './parameters/test-org.staging-env.parameters';

const app = new cdk.App();

new TestOrgCommonEnvRootStack(app, TestOrgStagingEnvParameters);

// new TestOrgCommonEnvRootStack(app, TestOrgUatEnvParameters);
// new TestOrgCommonEnvRootStack(app, TestOrgProdEnvParameters);
