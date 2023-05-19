const { createTransport } = require("nodemailer");
const sendEmail = async (email, text, subject) => {
  // create reusable transporter object using the default SMTP transport
  var transport = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  // send mail with defined transport object
  await transport.sendMail({
    to: email, // receiver's email
    subject: subject, // Subject line
    text: text, // plain text body
  });
};

module.exports = sendEmail;
