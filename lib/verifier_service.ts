import * as core from "@aws-cdk/core"
import * as apigateway from "@aws-cdk/aws-apigateway"
import * as lambda from "@aws-cdk/aws-lambda"
import * as dotenv from "dotenv"
import * as dynamodb from "@aws-cdk/aws-dynamodb"

dotenv.config()

export class VerifierService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id)

    const table = new dynamodb.Table(this, "Subs", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    const handler = new lambda.Function(this, "WidgetHandler", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "verifier.main",
      environment: {
        CAPTCHA_SERVER: process.env.CAPTCHA_SERVER || "",
        CAPTCHA_SECRET: process.env.CAPTCHA_SECRET || "",
        PRIMARY_KEY: "id",
        TABLE_NAME: table.tableName,
        SITE_URL: process.env.SITE_URL || "no site url",
      },
    })

    table.grantReadWriteData(handler)

    const api = new apigateway.RestApi(this, "widgets-api", {
      restApiName: "Lambda Verifier",
      description: "Stateless lambda verifier",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          "Access-Control-Allow-Origin",
          ...apigateway.Cors.DEFAULT_HEADERS,
        ],
      },
    })

    const getWidgetsIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    })

    api.root.addMethod("POST", getWidgetsIntegration) // POST /
  }
}
