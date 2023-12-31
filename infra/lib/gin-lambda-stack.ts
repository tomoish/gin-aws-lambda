import {
  aws_s3_assets as assets,
  aws_lambda as lambda,
  aws_apigateway as gateway,
  Stack,
  StackProps,
  Duration,
} from "aws-cdk-lib";
import * as path from "path";
import { Construct } from "constructs";

export class GinLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaAsset = new assets.Asset(this, "GinServerAsset", {
      path: path.join(__dirname, "../../gin/bin"),
    });

    const lambdaFn = new lambda.Function(this, "GinServer", {
      code: lambda.Code.fromBucket(lambdaAsset.bucket, lambdaAsset.s3ObjectKey),
      timeout: Duration.minutes(5),
      runtime: lambda.Runtime.PROVIDED_AL2,
      handler: "main",
    });

    new gateway.LambdaRestApi(
      this,
      "GinServerLambdaEndpoint",
      {
        handler: lambdaFn,
      }
    )
  }
}
