import { Construct } from 'constructs';
import { NAT_CONSTRUCT, RESOURCE_CFN_EIP, RESOURCE_CFN_ROUTE, RESOURCE_CFN_ROUTE_TABLE } from '../../constants';
import { IVpcConstructParams } from '../../types/constructs';
import { CfnEIP, CfnNatGateway, CfnRoute } from 'aws-cdk-lib/aws-ec2';

export class Nat extends Construct {
  constructor(
    scope: Construct,
    params: IVpcConstructParams,
    publicSubnetIds: string[],
    privateRouteTablesIds: string[],
  ) {
    super(scope, NAT_CONSTRUCT);

    const eip = new CfnEIP(this, RESOURCE_CFN_EIP, {
      domain: 'vpc',
      tags: [{ key: 'Name', value: `${params.vpcName}-eip` }],
    });

    const natGw = new CfnNatGateway(this, RESOURCE_CFN_ROUTE_TABLE, {
      allocationId: eip.attrAllocationId,
      subnetId: publicSubnetIds[0],
      tags: [{ key: 'Name', value: `${params.vpcName}-ngw` }],
    });

    for (let tablePos = 0; tablePos < privateRouteTablesIds.length; tablePos++) {
      new CfnRoute(this, `${RESOURCE_CFN_ROUTE}-${tablePos}`, {
        destinationCidrBlock: '0.0.0.0/0',
        natGatewayId: natGw.attrNatGatewayId,
        routeTableId: privateRouteTablesIds[tablePos],
      });
    }
  }
}
