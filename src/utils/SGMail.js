const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const SendMail = async ({email,subject, text, html}) => {

    sgMail.setApiKey(process.env.SEND_GRID);


    try{

        const msg = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: subject,
            text: text,
            html
        };
        return sgMail.send(msg)
    }catch(err){
        console.log("[-] Sending e-mail failed with error", err)
        throw new Error(err)
    }
}

module.exports = {SendMail}