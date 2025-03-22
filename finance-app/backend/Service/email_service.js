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
async function send_reset_email(email,token){
    const resetLink = `http://127.0.0.1:3000/auth/reset_pass.html?token=${token}`;
  
    await transporter.sendMail({
      from: `"Finance_app" <${process.env.my_EMAIL}>`,  
      replyTo: process.env.my_EMAIL, 
      to: email,
      subject: 'Password Reset',
      text: `Click this link to reset your password: 
      ${resetLink}`,
    });
}

module.exports=send_reset_email