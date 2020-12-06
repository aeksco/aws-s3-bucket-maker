import * as AWS from "aws-sdk";
import * as Mail from "nodemailer";
const EMAIL_SOURCE = process.env.EMAIL_SOURCE || "";
const EMAIL_ADMIN = process.env.EMAIL_ADMIN || "";
const EMAIL_RECIPIENT = process.env.EMAIL_RECIPIENT || "";
const BUCKET_NAME = process.env.BUCKET_NAME || "";
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID || "";
const ACCESS_KEY_SECRET = process.env.ACCESS_KEY_SECRET || "";

// // // //

const BODY_HTML = `
<html>
    <head></head>
    <body>
      <h1>Hello!</h1>
      <p>The following S3 bucket was created for client: ${EMAIL_RECIPIENT}</p>
      <p>Bucket Name: ${BUCKET_NAME}</p>
      <p>Access Key: ${ACCESS_KEY_ID}</p>
      <p>Access Key Secret: ${ACCESS_KEY_SECRET}</p>
    </body>
</html>
`;

// // // //

/**
 * handler
 * @param event
 * Example `event` parameter:
 * {
 *   "version": "0",
 *   "id": "...",
 *   "detail-type": "Scheduled Event",
 *   "source": "aws.events",
 *   "account": "...",
 *   "time": "2020-12-03T18:59:30Z",
 *   "region": "us-east-1",
 *   "resources": [...],
 *   "detail": { }
 * }
 */
export const handler = async (event: any = {}): Promise<any> => {
  // Logs starting message
  console.log("send-create-confirmation-email - start");
  console.log(JSON.stringify(event, null, 4));

  // const ses = new AWS.SES({ region: "us-east-1" });

  // create Nodemailer SES transporter
  let transporter = Mail.createTransport({
    SES: new AWS.SES({
      apiVersion: "2010-12-01",
      region: "us-east-1"
    })
  });

  const params: Mail.SendMailOptions = {
    from: EMAIL_SOURCE, // NOTE - this must be an SES-verified email
    to: EMAIL_ADMIN,
    subject: "S3 Bucket - Create Confirmation Email",
    html: BODY_HTML
  };

  // Send the email
  await new Promise((resolve, reject) => {
    return transporter.sendMail(params, (err, info) => {
      if (err) {
        console.log("Send email err!");
        console.log(err);
        return reject(err);
      }
      console.log("info.envelope");
      console.log(info.envelope);
      console.log("info.messageId");
      console.log(info.messageId);
      return resolve(info);
    });
  });

  // Log ending message
  console.log("send-create-confirmation-email - end");
  return;
};
