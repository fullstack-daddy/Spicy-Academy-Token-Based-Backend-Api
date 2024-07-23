import nodemailer from "nodemailer";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mailSender = async (email, title, body) => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      let info = await transporter.sendMail({
        from: '"Spicy Guitar Academy" <no-reply@spicyguitaracademy.com>',
        to: email,
        subject: title,
        html: body,
      });

      console.log("Email sent successfully: ", info.messageId);
      return info;
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed:`, error.message);
      
      if (retries === MAX_RETRIES - 1) {
        throw error; // Throw the error on the last retry
      }
      
      retries++;
      await wait(RETRY_DELAY * Math.pow(2, retries)); // Exponential backoff
    }
  }
};