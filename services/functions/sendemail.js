// const params = {
//     Destination: {
//         ToAddresses: ["tanmaypanda752@gcekbpatana.ac.in"]
//     },
//     Message: {
//         Body: {
//             Html: {
//                 Charset: 'UTF-8',
//                 Data: 'An example of sending email with ses and aws-sdk on Node.js : <a class="ulink" href="https://github.com/mdhelaluddin-ctg-bd/ses-email-nodejs" target="_blank">Check here</a>.'
//             },
//             Text: {
//                 Charset: 'UTF-8',
//                 Data: 'An example of sending email with ses and aws-sdk on Node.js.'
//             }
//         },
//         Subject: {
//             Charset: 'UTF-8',
//             Data: 'Test email from code'
//         }
//     },
//     ReturnPath: "tanmaypanda752@gmail.com",
//     Source: "tanmaypanda752@gmail.com"
// }
const aws = require("aws-sdk");

const ses = new aws.SES();

export const handler = (event, context, callback) => {
  console.log(event);

  if (event.request.userAttributes.email) {
    sendEmail(
      event.request.userAttributes.email,
      "Welcome to AirNote",
      function (status) {
        callback(null, event);
      }
    );
  } else {
    callback(null, event);
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
            Data: '<a class="ulink" href="https://air-note.netlify.app" target="_blank">Check here</a>. Here to connect to us'
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

  const email = ses.sendEmail(eParams, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("===EMAIL SENT===");
    }
    completedCallback("Email sent");
  });
  console.log("EMAIL CODE END");
}