import { ITestOrgStagingEnvParameters } from '../types/parameters';

export const TestOrgStagingEnvParameters: ITestOrgStagingEnvParameters = {
  env: { account: process.env.AWS_ACCOUNT, region: process.env.AWS_REGION },
  stackName: 'test-org-staging-env-root',
  vpcName: 'Staging',
  classB: '16',
  publicSubnets: [],
  privateSubnets: [],
};
