import * as cdk from '@aws-cdk/core';
import * as verifier_service from '../lib/verifier_service';


export class CdkCaaspiLpStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new verifier_service.VerifierService(this, 'Widgets');
  }
}
