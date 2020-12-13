# aws-s3-bucket-maker

:mag: Builds a self-destructing S3 bucket and associated IAM Role for temporary file transfer workflows. Built with AWS CDK + TypeScript.

<!-- ![Example Extension Popup](https://i.imgur.com/3F89JQK.png "Example Extension Popup") -->
<!-- https://cloudcraft.co/view/e135397e-a673-411e-9ee7-05a5618052b2?key=R-OLiwplnkA9dtQxtkVqOw&interactive=true&embed=true -->

**Getting Started**

Run the following commands to install dependencies, build the CDK stack, and deploy the CDK Stack to AWS.

```
yarn install
yarn build
cdk bootstrap
cdk deploy
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
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- [AWS S3](https://aws.amazon.com/s3/)
- [AWS SES](https://aws.amazon.com/ses/)
- [AWS IAM](https://aws.amazon.com/iam/)

**Additional Resources**

- [CDK API Reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html)
- [CDK TypeScript Reference](https://docs.aws.amazon.com/cdk/api/latest/typescript/api/index.html)
- [CDK Assertion Package](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/assert)
- [awesome-cdk repo](https://github.com/eladb/awesome-cdk)

**License**

Opensourced under the MIT License.

Built with :heart: by [aeksco](https://twitter.com/aeksco)
