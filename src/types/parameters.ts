import { ITestOrgCommonEnvRootStackParams } from './stacks';
import { StackProps } from 'aws-cdk-lib';

export interface ITestOrgStagingEnvParameters extends StackProps, ITestOrgCommonEnvRootStackParams {}
