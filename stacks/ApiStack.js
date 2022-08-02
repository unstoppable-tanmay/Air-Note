import { Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }) {
  const { table } = use(StorageStack);

  const api = new Api(stack, "Api", {
    defaults: {
        authorizer: "iam",
      function: {
        permissions: [table],
        environment: {
          TABLE_NAME: table.tableName,
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        },
      },
    },
    
    routes: {
      "POST /notes": "functions/create.main",
      "GET /notes/{id}": "functions/get.main",
      "GET /notes": "functions/list.main",
      "PUT /notes/{id}": "functions/update.main",
      "DELETE /notes/{id}": "functions/delete.main",
      "POST /billing": "functions/billing.main",    
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}


// npx aws-api-gateway-cli-test --username='tanmaypanda752@gmail.com' --password='Tanmay@123' --user-pool-id='us-east-1_3L8ZTHyyd' --app-client-id='4gafru7hej1749nn278c0ukabb' --cognito-region='us-east-1' --identity-pool-id='us-east-1:9509fd27-c072-402e-8b69-4c7e23491cf7' --invoke-url='https://t48ylb3j8f.execute-api.us-east-1.amazonaws.com' --api-gateway-region='us-east-1' --path-template='/notes' --method='POST' --body='{\"content\":\"Hello\",\"attachment\":\"new.png\"}'


// npx aws-api-gateway-cli-test --username='tanmaypanda752@gmail.com' --password='Tanmay@123' --user-pool-id='us-east-1_3L8ZTHyyd' --app-client-id='4gafru7hej1749nn278c0ukabb' --cognito-region='us-east-1' --identity-pool-id='us-east-1:9509fd27-c072-402e-8b69-4c7e23491cf7' --invoke-url='https://t48ylb3j8f.execute-api.us-east-1.amazonaws.com' --api-gateway-region='us-east-1' --path-template='/notes/c3bcf850-0b64-11ed-8070-ad7c9e6a77f9' --method='DELETE'

// npx aws-api-gateway-cli-test --username='tanmaypanda752@gmail.com' --password='Tanmay@123' --user-pool-id='us-east-1_3L8ZTHyyd' --app-client-id='4gafru7hej1749nn278c0ukabb' --cognito-region='us-east-1' --identity-pool-id='us-east-1:9509fd27-c072-402e-8b69-4c7e23491cf7' --invoke-url='https://t48ylb3j8f.execute-api.us-east-1.amazonaws.com' --api-gateway-region='us-east-1' --path-template='/notes/bd5bdcf0-0b65-11ed-8070-ad7c9e6a77f9' --method='GET'

// npx aws-api-gateway-cli-test --username='tanmaypanda752@gmail.com' --password='Tanmay@123' --user-pool-id='us-east-1_3L8ZTHyyd' --app-client-id='4gafru7hej1749nn278c0ukabb' --cognito-region='us-east-1' --identity-pool-id='us-east-1:9509fd27-c072-402e-8b69-4c7e23491cf7' --invoke-url='https://t48ylb3j8f.execute-api.us-east-1.amazonaws.com' --api-gateway-region='us-east-1' --path-template='/notes' --method='GET'


// npx aws-api-gateway-cli-test --username='tanmaypanda752@gmail.com' --password='Tanmay@123' --user-pool-id='us-east-1_3L8ZTHyyd' --app-client-id='4gafru7hej1749nn278c0ukabb' --cognito-region='us-east-1' --identity-pool-id='us-east-1:9509fd27-c072-402e-8b69-4c7e23491cf7' --invoke-url='https://t48ylb3j8f.execute-api.us-east-1.amazonaws.com' --api-gateway-region='us-east-1' --path-template='/notes/bd5bdcf0-0b65-11ed-8070-ad7c9e6a77f9' --method='PUT' --body='{\"content\":\"Hello\",\"attachment\":111111111}'