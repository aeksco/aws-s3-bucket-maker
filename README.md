# aws-s3-bucket-maker

:mag: Builds a self-destructing S3 bucket and associated IAM Role for temporary file transfer workflows. Built with AWS CDK + TypeScript.

![S3 Bucket Maker Diagram](https://i.imgur.com/X1wQ6m1.png "S3 Bucket Maker Diagram")

<!-- https://app.cloudcraft.co/blueprint/1202bf1e-7678-4db6-8e01-cf863e4f41c8 -->

**Getting Started**

Run the following commands to install dependencies, build the CDK stack, and deploy the CDK Stack to AWS.

```
yarn install
yarn build
cdk bootstrap
cdk deploy
```

Note that `EMAIL_SOURCE`, `EMAIL_ADMIN`, and `EMAIL_RECIPIENT` environment variables must be defined for `cdk bootstrap` and `cdk deploy`:

- `EMAIL_SOURCE` - the email being used by SES to send messages to `EMAIL_ADMIN` and `EMAIL_RECIPIENT`.
- `EMAIL_ADMIN` - the email of the administrator creating the S3 bucket and IAM user
- `EMAIL_RECIPIENT` - the email of the recipient of the S3 bucket read + write credentials

The simplest way to inject these variables into the environment is simply by defining them before invoking `cdk bootstrap` or `cdk deploy`:

```
EMAIL_SOURCE=source@test.com EMAIL_ADMIN=admin@test.com EMAIL_RECIPIENT=recipient@test.com cdk deploy
```

### Overview

The following is an overview of each process performed by this CDK stack:

- Create S3 bucket
- Create IAM Role
- Create IAM Policies
- Send email to admin with login credentials
- Send email to recipient user with login credentials
- Send delete reminder after 29 days
- Delete everything after 30 days
- Send delete confirmation email

### Scripts

- `yarn install` - installs dependencies
- `yarn build` - builds the production-ready CDK Stack
- `yarn test` - runs Jest
- `cdk bootstrap` - bootstraps AWS Cloudformation for your CDK deploy
- `cdk deploy` - deploys the CDK stack to AWS

**Notes**

- Includes tests with Jest.

- Recommended to use `Visual Studio Code` with the `Format on Save` setting turned on.

**Built with**

- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io)
- [AWS CDK](https://aws.amazon.com/cdk/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [AWS S3](https://aws.amazon.com/s3/)
- [AWS SES](https://aws.amazon.com/ses/)
- [AWS IAM](https://aws.amazon.com/iam/)

**Additional Resources**

- [CDK API Reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html)
- [CDK TypeScript Reference](https://docs.aws.amazon.com/cdk/api/latest/typescript/api/index.html)
- [CDK Assertion Package](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/assert)
- [awesome-cdk repo](https://github.com/eladb/awesome-cdk)
- [aws-pdf-textract-pipeline](https://github.com/aeksco/aws-pdf-textract-pipeline)

**License**

Opensourced under the MIT License.

Built with :heart: &nbsp;by [aeksco](https://twitter.com/aeksco)
