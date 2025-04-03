const nodemailer = require('nodemailer');

// const Mailtrap_SMTP_server='sandbox.smtp.mailtrap.io';

const Brevo_SMTP_server="smtp-relay.brevo.com";

const transporter = nodemailer.createTransport({
    host: Brevo_SMTP_server,  // brevo mail
    port: 587,
    auth: {
        user: process.env.my_SMTP_EMAIL,
        pass: process.env.my_SMTP_PASSWORD
    } 
    ,tls: { rejectUnauthorized: false }
  });

const emails_details={
  "reset": {
    url:"http://127.0.0.1:3000/auth/reset_pass.html",
    subject:'reset',
    text:"Click this link to reset your Password"

}
  ,"verification": {
  url:"http://127.0.0.1:3000/auth/user_verification",
  subject:'verification',
  text:"Click this link to verify your account"}
}
async function send_email(email,token,type){
    let email_data=emails_details[type]
    const resetLink = `${email_data.url}?token=${token}`;

    await transporter.sendMail({
      from: `"Finance_app" <${process.env.my_EMAIL}>`,  
      replyTo: process.env.my_EMAIL, 
      to: email,
      subject: email_data.subject,
      text: `${email_data.text}: 
      ${resetLink}`,
    });
}

module.exports=send_email