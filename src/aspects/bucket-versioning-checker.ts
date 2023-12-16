import { Annotations, IAspect, Tokenization } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { isCfnBucket } from '../types/is-cfn-bucket';

export class BucketVersioningChecker implements IAspect {
  public visit(node: IConstruct): void {
    // See that we're dealing with a CfnBucket
    //node instanceof aws_s3.CfnBucket
    if (isCfnBucket(node)) {
      if (
        !node.versioningConfiguration ||
        (!Tokenization.isResolvable(node.versioningConfiguration) && node.versioningConfiguration.status !== 'Enabled')
      ) {
        Annotations.of(node).addError('Bucket versioning is not enabled');
      }
    }
  }
}
