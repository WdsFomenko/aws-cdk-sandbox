import { IConstruct } from 'constructs/lib/construct';

export interface IVpcConstructParams extends Omit<IConstruct, 'node'> {
  vpcName: string;
  classB: string;
  publicSubnets: string[];
  privateSubnets: string[];
}
