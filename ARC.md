## Deployment

Prior to your first deployment, you'll need to do a few things:

- Create a new [GitHub repo](https://repo.new)

- [Sign up](https://portal.aws.amazon.com/billing/signup#/start) and login to
  your AWS account

- Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to
  [your GitHub repo's secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).
  Go to your AWS
  [security credentials](https://console.aws.amazon.com/iam/home?region=us-west-2#/security_credentials)
  and click on the "Access keys" tab, and then click "Create New Access Key",
  then you can copy those and add them to your repo's secrets.

- Along with your AWS credentials, you'll also need to give your CloudFormation
  a `SESSION_SECRET` variable of its own for both staging and production
  environments, as well as an `ARC_APP_SECRET` for Arc itself.

  ```sh
  npx arc env --add --env staging ARC_APP_SECRET $(openssl rand -hex 32)
  npx arc env --add --env production ARC_APP_SECRET $(openssl rand -hex 32)
  ```

  If you don't have openssl installed, you can also use
  [1password](https://1password.com/password-generator) to generate a random
  secret, just replace `$(openssl rand -hex 32)` with the generated secret.



fly secrets set AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxx --app bookit
fly secrets set AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxx --app bookit-staging

fly secrets set ARC_ENV=staging --app bookit-staging
fly secrets set ARC_ENV=production --app bookit

fly secrets set AWS_REGION=ap-southeast-2 --app bookit-staging
fly secrets set AWS_REGION=ap-southeast-2 --app bookit