import * as events from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import { SelfDestruct } from "cdk-time-bomb";
import { RemovalPolicy } from "@aws-cdk/core";

// // // //

// Build CRON rule for CredentialsEmail
function getCreateConfirmationCron(): string {
  const date = new Date();
  const mins = String(date.getUTCMinutes() + 5).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const year = String(date.getUTCFullYear());
  const dayofmonth = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // NOTE - we increment by 1 here to match CRON expectations

  // Debug
  // console.log(`cron(${mins} ${hours} ${dayofmonth} ${month} ? ${year})`);
  return `cron(${mins} ${hours} ${dayofmonth} ${month} ? ${year})`;
}

// // // //

export class S3BucketBuilder extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    // Throw error if env variables aren't defined
    const EMAIL_SOURCE: string | undefined = process.env.EMAIL_SOURCE;
    const EMAIL_ADMIN: string | undefined = process.env.EMAIL_ADMIN;
    const EMAIL_RECIPIENT: string | undefined = process.env.EMAIL_RECIPIENT;

    // Throw error if required ENV variables aren't defined
    if (
      EMAIL_SOURCE === undefined ||
      EMAIL_ADMIN === undefined ||
      EMAIL_RECIPIENT === undefined
    ) {
      throw new Error(
        "Mising env variable - EMAIL_SOURCE, EMAIL_ADMIN, and EMAIL_RECIPIENT must be defined"
      );
    }

    // Provisions S3 bucket for downloaded PDFs
    // Doc: https://docs.aws.amazon.com/cdk/api/latest/docs/aws-s3-readme.html#logging-configuration
    const downloadsBucket: s3.Bucket = new s3.Bucket(this, "uploadsBucket", {
      removalPolicy: RemovalPolicy.DESTROY
    });

    // Defines the IAM user
    // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-iam/userprops.html#aws_iam_UserProps
    const user = new iam.User(this, "S3ServiceUser");

    // Configures self-destruct for 30 days from now
    const selfDestruct = new SelfDestruct(this, "selfDestructor", {
      timeToLive: cdk.Duration.minutes(30)
    });

    // Grants read/write access to the bucket
    downloadsBucket.grantReadWrite(user);

    // Adds self-destruct dependency
    user.node.addDependency(selfDestruct);

    const accessKey = new iam.CfnAccessKey(this, "myAccessKey", {
      userName: user.userName
    });

    // Pulls variables for lambda ENV
    const BUCKET_NAME = downloadsBucket.bucketName;
    const ACCESS_KEY_ID = accessKey.ref;
    const ACCESS_KEY_SECRET = accessKey.attrSecretAccessKey;

    // // // //
    // sendCreateConfirmationEmailLambda + policy + schedule
    const sendCreateConfirmationEmailLambda = new lambda.Function(
      this,
      "sendCreateConfirmationEmailLambda",
      {
        code: new lambda.AssetCode("src/send-create-confirmation-email"),
        handler: "lambda.handler",
        runtime: lambda.Runtime.NODEJS_10_X,
        environment: {
          EMAIL_SOURCE,
          EMAIL_ADMIN,
          EMAIL_RECIPIENT,
          BUCKET_NAME,
          ACCESS_KEY_ID,
          ACCESS_KEY_SECRET
        }
      }
    );

    // Adds policies for email lambdas
    sendCreateConfirmationEmailLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "SES:SendRawEmail"],
        resources: ["*"],
        effect: iam.Effect.ALLOW
      })
    );

    const sendCreateConfirmationEmailRule = new events.Rule(
      this,
      "SendCreateConfirmationEmailRule",
      {
        schedule: events.Schedule.expression(getCreateConfirmationCron())
      }
    );

    sendCreateConfirmationEmailRule.addTarget(
      new targets.LambdaFunction(sendCreateConfirmationEmailLambda)
    );

    // // // //
    // sendCredentialsEmailLambda + policy + schedule
    const sendCredentialsEmailLambda = new lambda.Function(
      this,
      "sendCredentialsEmailLambda",
      {
        code: new lambda.AssetCode("src/send-credentials-email"),
        handler: "lambda.handler",
        runtime: lambda.Runtime.NODEJS_10_X,
        environment: {
          EMAIL_SOURCE,
          EMAIL_ADMIN,
          EMAIL_RECIPIENT,
          BUCKET_NAME: BUCKET_NAME,
          ACCESS_KEY_ID: ACCESS_KEY_ID,
          ACCESS_KEY_SECRET: ACCESS_KEY_SECRET
        }
      }
    );

    // Adds policies for email lambdas
    sendCredentialsEmailLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "SES:SendRawEmail"],
        resources: ["*"],
        effect: iam.Effect.ALLOW
      })
    );

    const sendCredentialsEmailRule = new events.Rule(
      this,
      "SendCredentialsEmailRule",
      {
        schedule: events.Schedule.expression(getCreateConfirmationCron())
      }
    );

    sendCredentialsEmailRule.addTarget(
      new targets.LambdaFunction(sendCredentialsEmailLambda)
    );

    // // // //
    // sendDeleteReminderEmailLambda + policy + schedule
    const sendDeleteReminderEmailLambda = new lambda.Function(
      this,
      "sendDeleteReminderEmailLambda",
      {
        code: new lambda.AssetCode("src/send-credentials-email"),
        handler: "lambda.handler",
        runtime: lambda.Runtime.NODEJS_10_X,
        environment: {
          EMAIL_SOURCE,
          EMAIL_ADMIN,
          EMAIL_RECIPIENT,
          BUCKET_NAME: BUCKET_NAME,
          ACCESS_KEY_ID: ACCESS_KEY_ID,
          ACCESS_KEY_SECRET: ACCESS_KEY_SECRET
        }
      }
    );

    // Adds policies for email lambdas
    sendDeleteReminderEmailLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "SES:SendRawEmail"],
        resources: ["*"],
        effect: iam.Effect.ALLOW
      })
    );

    const sendDeleteReminderEmailRule = new events.Rule(
      this,
      "SendDeleteReminderEmailRule",
      {
        schedule: events.Schedule.expression(getCreateConfirmationCron())
      }
    );

    sendDeleteReminderEmailRule.addTarget(
      new targets.LambdaFunction(sendDeleteReminderEmailLambda)
    );

    // // // //
    // sendDeleteConfirmationEmailLambda + policy + schedule
    const sendDeleteConfirmationEmailLambda = new lambda.Function(
      this,
      "sendDeleteConfirmationEmailLambda",
      {
        code: new lambda.AssetCode("src/send-delete-confirmation-email"),
        handler: "lambda.handler",
        runtime: lambda.Runtime.NODEJS_10_X,
        environment: {
          EMAIL_ADMIN,
          EMAIL_SOURCE,
          EMAIL_RECIPIENT
        }
      }
    );

    sendDeleteConfirmationEmailLambda.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "SES:SendRawEmail"],
        resources: ["*"],
        effect: iam.Effect.ALLOW
      })
    );

    const sendDeleteConfirmatilEmailRule = new events.Rule(
      this,
      "SendDeleteConfirmatilEmailRule",
      {
        schedule: events.Schedule.expression("rate(10 minutes)")
      }
    );

    sendDeleteConfirmatilEmailRule.addTarget(
      new targets.LambdaFunction(sendDeleteConfirmationEmailLambda)
    );

    // // // //
    // Outputs
    // new cdk.CfnOutput(this, "userArn", {
    //   description: "userArn",
    //   value: user.userArn
    // });

    // new cdk.CfnOutput(this, "userName", {
    //   description: "userName",
    //   value: user.userName
    // });

    // new cdk.CfnOutput(this, "bucketArn", {
    //   description: "bucketArn",
    //   value: downloadsBucket.bucketArn
    // });

    // new cdk.CfnOutput(this, "bucketWebsiteUrl", {
    //   description: "bucketWebsiteUrl",
    //   value: downloadsBucket.bucketWebsiteUrl
    // });

    new cdk.CfnOutput(this, "bucketName", {
      description: "bucketName",
      value: downloadsBucket.bucketName
    });

    new cdk.CfnOutput(this, "accessKeyId", {
      description: "accessKeyId",
      value: accessKey.ref
    });

    new cdk.CfnOutput(this, "secretAccessKey", {
      description: "secretAccessKey",
      value: accessKey.attrSecretAccessKey
    });
  }
}
