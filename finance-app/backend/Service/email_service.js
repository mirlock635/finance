const nodemailer = require('nodemailer');

const Mailtrap_SMTP_server='sandbox.smtp.mailtrap.io';
const Brevo_SMTP_server="smtp-relay.brevo.com";
console.log(process.env.my_SMTP_EMAIL)
const transporter = nodemailer.createTransport({
    host: Brevo_SMTP_server,  // instead of Mailtrap
    port: 587,
    auth: {
        user: process.env.my_SMTP_EMAIL,
        pass: process.env.my_SMTP_PASSWORD
    } 
    ,tls: { rejectUnauthorized: false }
  });

let email_data={
  "reset": {
    url:"http://127.0.0.1:3000/auth/reset_pass.html",
    subject:'reset',
    text:"Click this link to reset your Password"

}
  ,"verification": {
  url:"http://127.0.0.1:3000/auth/verify",
  subject:'verification',
  text:"Click this link to verify your account"
}
}
async function send_email(email,token,type){
    const resetLink = `${email_data[type].url}?token=${token}`;

    await transporter.sendMail({
      from: `"Finance_app" <${process.env.my_EMAIL}>`,  
      replyTo: process.env.my_EMAIL, 
      to: email,
      subject: email_data[type].subject,
      text: `${email_data[type].text}: 
      ${resetLink}`,
    });
}

module.exports=send_email