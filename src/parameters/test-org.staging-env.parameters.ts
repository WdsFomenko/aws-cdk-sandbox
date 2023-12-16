import { ITestOrgStagingEnvParameters } from '../types/parameters';

export const TestOrgStagingEnvParameters: ITestOrgStagingEnvParameters = {
  env: { account: process.env.AWS_ACCOUNT, region: process.env.AWS_REGION || process.env.AMAZON_REGION },
  stackName: 'test-org-staging-env-root',
  vpcName: 'staging',
  classB: '16',
  publicSubnets: ['public-one', 'public-two', 'public-three'],
  privateSubnets: ['private-one', 'private-two', 'private-three'],
};
