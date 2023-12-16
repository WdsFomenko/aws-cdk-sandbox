import { Construct } from 'constructs';
import { CfnInternetGateway, CfnVPC } from 'aws-cdk-lib/aws-ec2';
import { IVpcConstructParams } from '../../types/constructs';
import * as cdk from 'aws-cdk-lib/core';
import { RESOURCE_CFN_INTERNET_GATEWAY, RESOURCE_CFN_VPC, VPC_CONSTRUCT } from '../../constants';

export class Vpc extends Construct {
  constructor(scope: Construct, params: IVpcConstructParams) {
    super(scope, VPC_CONSTRUCT);

    const vpcTags: Array<cdk.CfnTag> = [
      {
        key: 'Name',
        value: `10.${params.classB}.0.0/16`,
      } as cdk.CfnTag,
    ];
    new CfnVPC(this, RESOURCE_CFN_VPC, {
      cidrBlock: `10.${params.classB}.0.0/16`,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      instanceTenancy: 'default',
      tags: vpcTags,
    });

    new CfnInternetGateway(this, RESOURCE_CFN_INTERNET_GATEWAY, { tags: vpcTags });
  }
}
