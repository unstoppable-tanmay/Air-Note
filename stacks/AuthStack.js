import * as iam from "aws-cdk-lib/aws-iam";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Auth, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";
import { ApiStack } from "./ApiStack";

export function AuthStack({ stack, app }) {
  const { bucket } = use(StorageStack);
  const { api } = use(ApiStack);
  const auth = new Auth(stack, "Auth", {
    login: ["email"],
    identityPoolFederation: {
      facebook: { appId: "598159221932510" },
      google: {
        clientId:
          "754590198923-p4mruoc1644d0g8k9lq6nsrm86r2f8c6.apps.googleusercontent.com",
      },
      twitter: {
        consumerKey: "gyMbPOiwefr6x63SjIW8NN0d1",
        consumerSecret: "qxld8zic5c2eyahqK3gjGLGQaOTogGfAgHh17MYOIcOUR9l2Nz",
      },
    },
    cdk: {
      userPoolClient: {
        supportedIdentityProviders: [
          cognito.UserPoolClientIdentityProvider.GOOGLE,
        ],
        oAuth: {
          callbackUrls: ["https://air-note.netlify.app"],
          logoutUrls: ["https://air-note.netlify.app"],
        },
      },
    },
  });

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
    throw new Error("Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET");
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET)
    throw new Error("Please set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET");

  const provider = new cognito.UserPoolIdentityProviderGoogle(
    stack,
     "Google", {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    userPool: auth.cdk.userPool,
    scopes: ["profile", "email", "openid"],
    attributeMapping: {
      email: cognito.ProviderAttribute.GOOGLE_EMAIL,
      givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
      familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
      profilePicture: cognito.ProviderAttribute.GOOGLE_PICTURE,
    },
  },
);
const providerfb = new cognito.UserPoolIdentityProviderFacebook(
  stack,
  "Facebook",
  {
    clientId: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    userPool: auth.cdk.userPool,
    attributeMapping: {
      email: cognito.ProviderAttribute.FACEBOOK_EMAIL,
      givenName: cognito.ProviderAttribute.FACEBOOK_NAME,
    },
  }
);
auth.cdk.userPoolClient.node.addDependency(provider);
auth.cdk.userPoolClient.node.addDependency(providerfb);


  auth.attachPermissionsForAuthUsers(stack, [
    api,
    new iam.PolicyStatement({
      actions: ["s3:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        bucket.bucketArn + "/private/${cognito-identity.amazonaws.com:sub}/*",
      ],
    }),
  ]);
  stack.addOutputs({
    ApiEndpoint: api.url,
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId,
    UserPoolClientId: auth.userPoolClientId,
  });

  return {
    auth,
  };
}


// aws cognito-identity get-id --identity-pool-id "us-east-1:9509fd27-c072-402e-8b69-4c7e23491cf7" --logins graph.facebook.com="EAAIgBcvxQd4BABnFPNEPmVHZAoxBPSg1ZBD0WuVq2wO9WZC7M5UHfZCSyIvZC9Fbt8D8xMZAfAgzryxroESrH2yYndIBRAInqXSSdaKHHagAZB9ZBqKQOk2CtNTqfVZCpXL7cDRPqQVtKFpqWjzZBLLpCb6nCaVicYwrGJTZAxM0ZBqoLT3unloJ1AbioAjVHE3XUMhZAse7uRYA58QZDZD"