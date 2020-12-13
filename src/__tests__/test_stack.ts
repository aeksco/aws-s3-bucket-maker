import { expect as expectCDK, countResources } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import { S3BucketBuilder } from "../stack";

// // // //

// Assign requisite process.env values
process.env.EMAIL_SOURCE = "EMAIL_SOURCE@test.com";
process.env.EMAIL_ADMIN = "EMAIL_ADMIN@test.com";
process.env.EMAIL_RECIPIENT = "EMAIL_RECIPIENT@test.com";

describe("S3BucketBuilder", () => {
  test("loads", () => {
    const app = new cdk.App();

    // Configures CDK stack
    const stack: cdk.Stack = new S3BucketBuilder(app, "S3BucketBuilder");

    // Checks stack resource count
    expectCDK(stack).to(countResources("AWS::Events::Rule", 5));
    expectCDK(stack).to(countResources("AWS::IAM::Policy", 5));
    expectCDK(stack).to(countResources("AWS::IAM::Role", 5));
    expectCDK(stack).to(countResources("AWS::Lambda::Function", 5));
    expectCDK(stack).to(countResources("AWS::Lambda::Permission", 6));
  });
});
