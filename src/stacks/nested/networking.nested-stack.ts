import { CfnParameter, NestedStack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NETWORKING_NESTED_STACK_NAME } from '../../constants';
import { Vpc } from '../../constructs/network';
import { TNumber, TString } from '../../types/cloud-formation-types';
import { ENetworkingNestedStackParams, INetworkingNestedStackParams } from '../../types/stacks';
import { SubnetPublic } from '../../constructs/network/subnet-public';
import { SubnetsPrivate } from '../../constructs/network/subnets-private';

export class NetworkingNestedStack extends NestedStack {
  constructor(scope: Construct, params: INetworkingNestedStackParams) {
    super(scope, NETWORKING_NESTED_STACK_NAME);

    // 1. - Parameters
    const vpcName = new CfnParameter(this, ENetworkingNestedStackParams.VpcName, {
      type: TString,
      description: 'Ephemeral VPC name to be able identify resource',
      minLength: 3,
      maxLength: 64,
    });
    const classB = new CfnParameter(this, ENetworkingNestedStackParams.ClassB, {
      type: TNumber,
      description: 'Class B of VPC (10.XXX.0.0/16)',
      default: 0,
      constraintDescription: 'Must be in the range [0-255]',
      minValue: 0,
      maxValue: 255,
    });

    const constructParams = {
      vpcName: vpcName.valueAsString,
      classB: classB.valueAsString,
      publicSubnets: params.publicSubnets,
      privateSubnets: params.privateSubnets,
    };

    // 2. - Resources
    const vpcConstruct = new Vpc(this, constructParams);
    const subnetPublicConstruct = new SubnetPublic(this, constructParams, vpcConstruct.getAttrVpcId());
    const subnetPrivateConstruct = new SubnetsPrivate(this, constructParams, vpcConstruct.getAttrVpcId());

    // 3. - Outputs
  }
}
