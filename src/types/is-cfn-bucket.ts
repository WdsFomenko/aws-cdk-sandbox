import { CfnBucket } from 'aws-cdk-lib/aws-s3';

export function isCfnBucket(node: CfnBucket | unknown): node is CfnBucket {
  return !!(node as CfnBucket).versioningConfiguration;
}
