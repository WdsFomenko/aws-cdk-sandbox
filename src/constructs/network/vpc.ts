import { Construct } from 'constructs';
import {
  CfnInternetGateway,
  CfnNetworkAcl,
  CfnNetworkAclEntry,
  CfnRoute,
  CfnRouteTable,
  CfnSubnet,
  CfnSubnetNetworkAclAssociation,
  CfnSubnetRouteTableAssociation,
  CfnVPC,
  CfnVPCGatewayAttachment,
} from 'aws-cdk-lib/aws-ec2';
import { IVpcConstructParams } from '../../types/constructs';
import * as cdk from 'aws-cdk-lib/core';
import {
  RESOURCE_CFN_INTERNET_GATEWAY,
  RESOURCE_CFN_NETWORK_ACL,
  RESOURCE_CFN_NETWORK_ACL_ENTRY,
  RESOURCE_CFN_ROUTE,
  RESOURCE_CFN_ROUTE_TABLE,
  RESOURCE_CFN_ROUTE_TABLE_ASSOCIATION,
  RESOURCE_CFN_SUBNET,
  RESOURCE_CFN_SUBNET_NETWORK_ACL_ASSOCIATION,
  RESOURCE_CFN_VPC,
  RESOURCE_CFN_VPC_GATEWAY_ATTACHMENT,
  VPC_CONSTRUCT,
} from '../../constants';

export class Vpc extends Construct {
  constructor(scope: Construct, params: IVpcConstructParams) {
    super(scope, VPC_CONSTRUCT);

    const azs = cdk.Fn.getAzs();
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

    const internetGateway = new CfnInternetGateway(this, RESOURCE_CFN_INTERNET_GATEWAY, {
      tags: [
        {
          key: 'Name',
          value: cidrBlock,
        } as cdk.CfnTag,
      ],
    });

    const vpcGatewayAttachment = new CfnVPCGatewayAttachment(this, RESOURCE_CFN_VPC_GATEWAY_ATTACHMENT, {
      vpcId: vpc.attrVpcId,
      internetGatewayId: internetGateway.attrInternetGatewayId,
    });

    const publicNetworkAcl = new CfnNetworkAcl(this, `${RESOURCE_CFN_NETWORK_ACL}-public`, {
      vpcId: vpc.attrVpcId,
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
        vpcId: vpc.attrVpcId,
        tags: [
          { key: 'Name', value: params.publicSubnets[subnetPos] },
          { key: 'Reach', value: 'Public' },
        ],
      });

      const routeTable = new CfnRouteTable(this, `${RESOURCE_CFN_ROUTE_TABLE}-${pointer}`, {
        vpcId: vpc.attrVpcId,
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

    const privateNetworkAcl = new CfnNetworkAcl(this, `${RESOURCE_CFN_NETWORK_ACL}-private`, {
      vpcId: vpc.attrVpcId,
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
        vpcId: vpc.attrVpcId,
        tags: [{ key: 'Name', value: params.privateSubnets[subnetPos] }],
      });

      const routeTable = new CfnRouteTable(this, `${RESOURCE_CFN_ROUTE_TABLE}-${pointer}`, {
        vpcId: vpc.attrVpcId,
        tags: [{ key: 'Name', value: params.privateSubnets[subnetPos] }],
      });

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
}
