import * as cdk from "@aws-cdk/core";
import { S3BucketBuilder } from "./src/stack";

// // // //

// Defines new CDK App
const app = new cdk.App();

// Instantiates the S3BucketBuilder + OnDeployedStack
new S3BucketBuilder(app, "S3BucketBuilder");
app.synth();
