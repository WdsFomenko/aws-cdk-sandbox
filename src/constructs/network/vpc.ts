import { Construct } from 'constructs';
import { CfnVPC } from 'aws-cdk-lib/aws-ec2';
import { IVpcConstructParams } from '../../types/constructs';
import * as cdk from 'aws-cdk-lib/core';
import { RESOURCE_CFN_VPC, VPC_CONSTRUCT } from '../../constants';

export class Vpc extends Construct {
  private readonly attrVpcId: string;

  constructor(scope: Construct, params: IVpcConstructParams) {
    super(scope, VPC_CONSTRUCT);
    const cidrBlock = `10.${params.classB}.0.0/16`;

    const vpc = new CfnVPC(this, RESOURCE_CFN_VPC, {
      cidrBlock,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      instanceTenancy: 'default',
      tags: [
        {
          key: 'Name',
          value: cidrBlock,
        } as cdk.CfnTag,
      ],
    });

    this.attrVpcId = vpc.attrVpcId;
  }

  public getAttrVpcId() {
    return this.attrVpcId;
  }
}
