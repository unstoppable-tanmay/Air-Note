import handler from "../util/handler";
import dynamoDb from "../util/dynamodb";

export const main = handler(async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    KeyConditionExpression: "userId = :userId",
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the id of the author
    ExpressionAttributeValues: {
      // ":userId": "123",
      ":userId": event.requestContext.authorizer.iam.cognitoIdentity.identityId,
    },
  };

  const result = await dynamoDb.query(params);

  // Return the matching list of items in response body
  return result.Items;
});


// npx aws-api-gateway-cli-test --username='tanmaypanda752@gmail.com' --password='Tanmay@123' --user-pool-id='us-east-1_3L8ZTHyyd' --app-client-id='4gafru7hej1749nn278c0ukabb' --cognito-region='us-east-1' --identity-pool-id='us-east-1:9509fd27-c072-402e-8b69-4c7e23491cf7' --invoke-url='https://t48ylb3j8f.execute-api.us-east-1.amazonaws.com' --api-gateway-region='us-east-1' --path-template='/billing' --method='POST' --body='{\"source\":\"tok_visa\",\"storage\":21}'