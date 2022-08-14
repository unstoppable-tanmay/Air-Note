const aws = require("aws-sdk");

const ses = new aws.SES();

export const handler = (event, context, callback) => {
  console.log(event);

  if (event.request.userAttributes.email) {
    sendEmail(event.request.userAttributes.email,"Welcome to AirNote",
      function (status) {
        callback(null, event);
      }
    );
  } else {
    callback(null, event);
    alert("error");
  }
};

function sendEmail(to, body, completedCallback) {
  const eParams = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
            Charset: 'UTF-8',
            Data: 'Thank you for Joining Us\n & if any problem then <a class="ulink" href="https://air-note.netlify.app" target="_blank">Check here</a>. Here to connect to us'
        },
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: "Thank You . . .\n For Joining us",
      },
    },

    Source: "tanmaypanda752@gmail.com",
  };

  ses.sendEmail(eParams, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("completed");
    }
    completedCallback("email sent");
  });
}