/*
|-------------------------------------------
| Email Configratio Here
|-------------------------------------------
*/
const {
    MAIL_DRIVER,
    MAIL_HOST,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    MAIL_FROM_ADDRESS
} = require('./config');
const ejs = require("ejs");
const { createTransport } = require('nodemailer');

const Mailer = createTransport({
    host: 'smtp',
    port : 1200,
    secure : false,
    requireTLS : true,
    service : 'gmail',
    auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD
    }
});

class NodeMailer {
    constructor(param) {
        if (param.email && param.subject && param.template) {
            this.subject = param.subject;
            this.email = param.email;
            this.data = param.data;
            this.template = param.template;
        } else {
            throw Error('please check the parameters');
        }
    }

    async sentMail() {
        const html = await ejs.renderFile(__dirname + "/../public/" + this.template, this.data)
        const mainOptions = {
            from: MAIL_FROM_ADDRESS,
            to: this.email,
            subject: this.subject,
            html: html
        };
        const check = await Mailer.sendMail(mainOptions);
        if (!check) {
            return false;
        }
        return true;
    }
}

module.exports = { NodeMailer }