# Welcome to AWS CDK TypeScript project

### Conventional Commits
We are using a specification for adding human and machine readable meaning to commit messages.
- Example: `feat(TASK-XXXX): Title of related Users story here`

More details about the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)  
More details about the [Commit Lint](https://github.com/conventional-changelog/commitlint)

The `cdk.json` file tells the CDK Toolkit how to execute your app.

#### Quality Control Tools 

1. GitHub account with ssh key added
2. Installed [aws](https://aws.amazon.com/cli/) The AWS Command Line Interface (AWS CLI) is a unified tool to manage your AWS services. With just one tool to download and configure, you can control multiple AWS services from the command line and automate them through scripts.
3. Installed [rain](https://github.com/aws-cloudformation/rain) Rain is what happens when you have a lot of CloudFormation
4. Installed [cfn-lint](https://pypi.org/project/cfn-lint/0.2.1/) Validate CloudFormation yaml/json templates against the CloudFormation spec and additional checks. Includes checking valid values for resource properties and best practices.
5. Installed [cfn-nag](https://github.com/stelligent/cfn_nag) The cfn-nag tool looks for patterns in CloudFormation templates that may indicate insecure infrastructure.
   Roughly speaking, it will look for: IAM rules that are too permissive (wildcards), Security group rules that are too permissive (wildcards)
   Access logs that aren't enabled
   Encryption that isn't enabled
   Password literals

#### Building process command

1. Build an image from a Dockerfile `docker build -t aws-cdk-sandbox .`
2. Run CDK DEPLOY command in a new container `docker run -i -t -e AWS_ACCESS_KEY_ID=### -e AWS_SECRET_ACCESS_KEY=### -e AWS_REGION=eu-west-3 aws-cdk-sandbox npm run prod:deploy`
3. Run CDK DESTROY command in a new container `docker run -i -t -e AWS_ACCESS_KEY_ID=### -e AWS_SECRET_ACCESS_KEY=### -e AWS_REGION=eu-west-3 aws-cdk-sandbox npm run prod:destroy`

Note! Please do not forget to set your deployment IAM role credentials AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
