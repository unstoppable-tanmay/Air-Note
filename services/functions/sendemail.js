const aws = require("aws-sdk");

const ses = new aws.SES();

export const handler = (event, context, callback) => {
  console.log(event);

  if (event.request.userAttributes.email) {
    sendEmail(
      event.request.userAttributes.email,
      "Welcome to Not-Taking-App",
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
        ToAddresses: ["tanmaypanda752@gcekbpatana.ac.in"]
    },
    Message: {
        Body: {
            Html: {
                Charset: 'UTF-8',
                Data: 'in any problem you can mail us -> : <a class="ulink" href="https://github.com/mdhelaluddin-ctg-bd/ses-email-nodejs" target="_blank">Check here</a>.'
            },
            Text: {
                Charset: 'UTF-8',
                Data: 'Making the world paper free to save world'
            }
        },
        Subject: {
            Charset: 'UTF-8',
            Data: 'Welcome to AirNote'
        }
    },
    ReturnPath: "tanmaypanda752@gmail.com",
    Source: "tanmaypanda752@gmail.com"
}

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