import { IVpcConstructParams } from './constructs';

export enum ENetworkingNestedStackParams {
  'VpcName' = 'VpcName',
  'ClassB' = 'ClassB',
  'PublicSubnets' = 'PublicSubnets',
  'PrivateSubnets' = 'PrivateSubnets',
}

// interface should extend all involved Constructs
export interface INetworkingNestedStackParams extends IVpcConstructParams {}

// interface should extend all nested stacks parameters
export interface ITestOrgCommonEnvRootStackParams extends INetworkingNestedStackParams {}
