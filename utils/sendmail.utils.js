import { createTransport } from "nodemailer";

async function sendEmail(email, sub, msg) {
  const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'mckayla.west6@ethereal.email',
      pass: 'SNhU8BcmeeHRdKq2SM'
    }
  });
  const info = transporter.sendMail({
    from: 'rku.430@gmail.com',
    to: email,
    subject: sub,
    text: msg,
  }, function (error, info) {
    if (error) throw Error(error);
    console.log("Message sent ", info.messageId);
    return info;
  });
  // console.log("Message sent ", info.messageId);
  return info;
}
export default sendEmail;