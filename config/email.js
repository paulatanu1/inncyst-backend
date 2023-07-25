const nodemailer = require("nodemailer");

// let smtpTransport = nodemailer.createTransport({
//     pool: true,
//     host: "gmail",
//     port: parseInt(config.sampleSMTPport),
//     secure: false, // use TLS,
//     auth: {
//         user: config.sampleSMTPUser,
//         pass: config.sampleSMTPpass,
//     },
//     tls: {
//         rejectUnauthorized: false
//     },
//     debug: true
// });

// const sendEmail = () => {
//     console.log("Sending mail...")
// }

const transporter = nodemailer.createTransport({
    host: 'smtp',
    port : 1200,
    secure : false,
    requireTLS : true,
    service : 'gmail',
    auth:{
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

module.exports = { transporter };