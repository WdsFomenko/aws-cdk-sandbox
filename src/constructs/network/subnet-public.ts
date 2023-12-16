import { Construct } from 'constructs';
import { IVpcConstructParams } from '../../types/constructs';
import {
  PUBLIC_SUBNET_CONSTRUCT,
  RESOURCE_CFN_INTERNET_GATEWAY,
  RESOURCE_CFN_NETWORK_ACL,
  RESOURCE_CFN_NETWORK_ACL_ENTRY,
  RESOURCE_CFN_ROUTE,
  RESOURCE_CFN_ROUTE_TABLE,
  RESOURCE_CFN_ROUTE_TABLE_ASSOCIATION,
  RESOURCE_CFN_SUBNET,
  RESOURCE_CFN_SUBNET_NETWORK_ACL_ASSOCIATION,
  RESOURCE_CFN_VPC_GATEWAY_ATTACHMENT,
} from '../../constants';
import * as cdk from 'aws-cdk-lib/core';
import {
  CfnInternetGateway,
  CfnNetworkAcl,
  CfnNetworkAclEntry,
  CfnRoute,
  CfnRouteTable,
  CfnSubnet,
  CfnSubnetNetworkAclAssociation,
  CfnSubnetRouteTableAssociation,
  CfnVPCGatewayAttachment,
} from 'aws-cdk-lib/aws-ec2';

export class SubnetPublic extends Construct {
  constructor(scope: Construct, params: IVpcConstructParams, attrVpcId: string) {
    super(scope, PUBLIC_SUBNET_CONSTRUCT);

    const azs = cdk.Fn.getAzs();
    const cidrBlock = `10.${params.classB}.0.0/16`;

    const internetGateway = new CfnInternetGateway(this, RESOURCE_CFN_INTERNET_GATEWAY, {
      tags: [
        {
          key: 'Name',
          value: cidrBlock,
        } as cdk.CfnTag,
      ],
    });

    const vpcGatewayAttachment = new CfnVPCGatewayAttachment(this, RESOURCE_CFN_VPC_GATEWAY_ATTACHMENT, {
      vpcId: attrVpcId,
      internetGatewayId: internetGateway.attrInternetGatewayId,
    });

    const publicNetworkAcl = new CfnNetworkAcl(this, `${RESOURCE_CFN_NETWORK_ACL}-public`, {
      vpcId: attrVpcId,
      tags: [{ key: 'Name', value: `${cidrBlock}-public` }],
    });
    new CfnNetworkAclEntry(this, `${RESOURCE_CFN_NETWORK_ACL_ENTRY}-NetworkAclEntryInPublicAllowAll`, {
      networkAclId: publicNetworkAcl.attrId,
      ruleNumber: 99,
      protocol: -1,
      ruleAction: 'allow',
      egress: false,
      cidrBlock: '0.0.0.0/0',
    });
    new CfnNetworkAclEntry(this, `${RESOURCE_CFN_NETWORK_ACL_ENTRY}-NetworkAclEntryOutPublicAllowAll`, {
      networkAclId: publicNetworkAcl.attrId,
      ruleNumber: 99,
      protocol: -1,
      ruleAction: 'allow',
      egress: true,
      cidrBlock: '0.0.0.0/0',
    });
    for (let subnetPos = 0; subnetPos < params.publicSubnets.length; subnetPos++) {
      const pointer = subnetPos;

      const subnet = new CfnSubnet(this, `${RESOURCE_CFN_SUBNET}-${pointer}`, {
        availabilityZone: cdk.Fn.select(subnetPos, azs),
        cidrBlock: `10.${params.classB}.${pointer * 16}.0/20`,
        mapPublicIpOnLaunch: false,
        vpcId: attrVpcId,
        tags: [
          { key: 'Name', value: params.publicSubnets[subnetPos] },
          { key: 'Reach', value: 'Public' },
        ],
      });

      const routeTable = new CfnRouteTable(this, `${RESOURCE_CFN_ROUTE_TABLE}-${pointer}`, {
        vpcId: attrVpcId,
        tags: [
          { key: 'Name', value: params.publicSubnets[subnetPos] },
          { key: 'Reach', value: 'Public' },
        ],
      });

      new CfnSubnetRouteTableAssociation(this, `${RESOURCE_CFN_ROUTE_TABLE_ASSOCIATION}-${pointer}`, {
        subnetId: subnet.attrSubnetId,
        routeTableId: routeTable.attrRouteTableId,
      });

      new CfnRoute(this, `${RESOURCE_CFN_ROUTE}-${pointer}`, {
        routeTableId: routeTable.attrRouteTableId,
        destinationCidrBlock: '0.0.0.0/0',
        gatewayId: internetGateway.attrInternetGatewayId,
      }).addDependency(vpcGatewayAttachment);

      new CfnSubnetNetworkAclAssociation(this, `${RESOURCE_CFN_SUBNET_NETWORK_ACL_ASSOCIATION}-${pointer}`, {
        subnetId: subnet.attrSubnetId,
        networkAclId: publicNetworkAcl.attrId,
      });
    }
  }
}
