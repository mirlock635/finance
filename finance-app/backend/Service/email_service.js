const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',  // This is Mailtrap's SMTP server
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },tls: { rejectUnauthorized: false }
  });
async function send_reset_email(email,token){
    const resetLink = `http://127.0.0.1:3000/reset_pass.html?token=${token}`;
  
    await transporter.sendMail({
      from: 'noreply@domain.com',
      to: email,
      subject: 'Password Reset',
      text: `Click this link to reset your password: ${resetLink}`,
    });
}

module.exports=send_reset_email