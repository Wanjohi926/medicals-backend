// // src/utils/mailer.ts
// import nodemailer from "nodemailer";
// // import nodemailer = require("nodemailer");


// export const sendEmail = async (
//   email: string,
//   subject: string,
//   message: string,
//   html: string
// ) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       service: 'gmail',
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//       }
//     });

//     const mailOptions: nodemailer.SendMailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject,
//       text: message,
//       html
//     };

//     const mailRes = await transporter.sendMail(mailOptions);
//     console.log('mailRes', mailRes);

//     if (mailRes.accepted.length > 0) return 'Email sent successfully';
//     if (mailRes.rejected.length > 0) return 'Email not sent';
//     return 'Email server error';

//   } catch (error: any) {
//     return JSON.stringify(error.message, null, 500);
//   }
// };
