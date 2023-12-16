import { Construct } from 'constructs';
import { IVpcConstructParams } from '../../types/constructs';
import {
  PRIVATE_SUBNET_CONSTRUCT,
  RESOURCE_CFN_NETWORK_ACL,
  RESOURCE_CFN_NETWORK_ACL_ENTRY,
  RESOURCE_CFN_ROUTE_TABLE,
  RESOURCE_CFN_ROUTE_TABLE_ASSOCIATION,
  RESOURCE_CFN_SUBNET,
  RESOURCE_CFN_SUBNET_NETWORK_ACL_ASSOCIATION,
} from '../../constants';
import * as cdk from 'aws-cdk-lib/core';
import {
  CfnNetworkAcl,
  CfnNetworkAclEntry,
  CfnRouteTable,
  CfnSubnet,
  CfnSubnetNetworkAclAssociation,
  CfnSubnetRouteTableAssociation,
} from 'aws-cdk-lib/aws-ec2';

export class SubnetsPrivate extends Construct {
  private readonly subnetIds: string[] = [];
  private readonly routeTableIds: string[] = [];

  constructor(scope: Construct, params: IVpcConstructParams, attrVpcId: string) {
    super(scope, PRIVATE_SUBNET_CONSTRUCT);

    const azs = cdk.Fn.getAzs();
    const cidrBlock = `10.${params.classB}.0.0/16`;

    const privateNetworkAcl = new CfnNetworkAcl(this, `${RESOURCE_CFN_NETWORK_ACL}-private`, {
      vpcId: attrVpcId,
      tags: [{ key: 'Name', value: `${cidrBlock}-private` }],
    });
    new CfnNetworkAclEntry(this, `${RESOURCE_CFN_NETWORK_ACL_ENTRY}-NetworkAclEntryInPrivateAllowVPC`, {
      networkAclId: privateNetworkAcl.attrId,
      ruleNumber: 99,
      protocol: -1,
      ruleAction: 'allow',
      egress: false,
      cidrBlock: '0.0.0.0/0',
    });
    new CfnNetworkAclEntry(this, `${RESOURCE_CFN_NETWORK_ACL_ENTRY}-NetworkAclEntryOutPrivateAllowVPC`, {
      networkAclId: privateNetworkAcl.attrId,
      ruleNumber: 99,
      protocol: -1,
      ruleAction: 'allow',
      egress: true,
      cidrBlock: '0.0.0.0/0',
    });
    for (let subnetPos = 0; subnetPos < params.privateSubnets.length; subnetPos++) {
      const pointer = subnetPos + params.publicSubnets.length;

      const subnet = new CfnSubnet(this, `${RESOURCE_CFN_SUBNET}-${pointer}`, {
        availabilityZone: cdk.Fn.select(subnetPos, azs),
        cidrBlock: `10.${params.classB}.${pointer * 16}.0/20`,
        mapPublicIpOnLaunch: false,
        vpcId: attrVpcId,
        tags: [{ key: 'Name', value: params.privateSubnets[subnetPos] }],
      });
      this.subnetIds.push(subnet.attrSubnetId);

      const routeTable = new CfnRouteTable(this, `${RESOURCE_CFN_ROUTE_TABLE}-${pointer}`, {
        vpcId: attrVpcId,
        tags: [{ key: 'Name', value: params.privateSubnets[subnetPos] }],
      });
      this.routeTableIds.push(routeTable.attrRouteTableId);

      new CfnSubnetRouteTableAssociation(this, `${RESOURCE_CFN_ROUTE_TABLE_ASSOCIATION}-${pointer}`, {
        subnetId: subnet.attrSubnetId,
        routeTableId: routeTable.attrRouteTableId,
      });

      new CfnSubnetNetworkAclAssociation(this, `${RESOURCE_CFN_SUBNET_NETWORK_ACL_ASSOCIATION}-${pointer}`, {
        subnetId: subnet.attrSubnetId,
        networkAclId: privateNetworkAcl.attrId,
      });
    }
  }

  public getSubnetIds() {
    return this.subnetIds;
  }

  public getRouteTableIds() {
    return this.routeTableIds;
  }
}
