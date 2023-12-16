import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NetworkingNestedStack } from './nested';
import { ITestOrgStagingEnvParameters } from '../types/parameters';
import { ENetworkingNestedStackParams } from '../types/stacks';

/**
 * https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.NestedStack.html
 * This file showcases how to split up Resources and Methods across nested stacks.
 */
export class TestOrgCommonEnvRootStack extends Stack {
  constructor(scope: Construct, params: ITestOrgStagingEnvParameters) {
    super(scope, undefined, { stackName: params.stackName });

    // networking
    const networkingStack = new NetworkingNestedStack(this, params);
    networkingStack.setParameter(ENetworkingNestedStackParams.VpcName, params.vpcName);
    networkingStack.setParameter(ENetworkingNestedStackParams.ClassB, params.classB);

    // secrets, config store

    // iam

    // storage

    // database

    // compute

    // analytics

    // ssm

    // security, compliance

    // cost and usage

    // ci/cd
  }
}
