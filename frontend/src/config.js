const config = {
    SENTRY_DSN: "https://a3556990f9b0418db514912e5533bc25@o1329796.ingest.sentry.io/6592073",
    MAX_ATTACHMENT_SIZE: 5000000,
    // Backend config
    s3: {
      REGION: "us-east-1",
      BUCKET: "y-notes-storagestack-uploadsbucketc4b27cc7-1gezgub28i80d",
    },
    apiGateway: {
      REGION: "us-east-1",
      URL:  "https://t48ylb3j8f.execute-api.us-east-1.amazonaws.com",
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_3L8ZTHyy",
      APP_CLIENT_ID: "4gafru7hej1749nn278c0ukabb",
      IDENTITY_POOL_ID: "us-east-1:9509fd27-c072-402e-8b69-4c7e23491cf7",
    },
    social: {
      FB: "598159221932510"
    }
  };
  
  export default config;