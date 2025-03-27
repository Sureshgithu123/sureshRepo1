const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to,
      from: process.env.EMAIL_FROM, 
      subject,
      text,
      html,
    };
    await sgMail.send(msg);

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
