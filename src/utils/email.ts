/**
 * Sends email
 * @param {Array} recipients
 * @param {String} subject
 * @param {String} template
 * @param {Array} ccRecipients
 */
import nodemailer from 'nodemailer';

let NODE_ENV = '';

NODE_ENV = 'production';
const REDIRECT_EMAIL = '';

export const sendEmail = (
  recipients: any[],
  subject: any,
  template: any,
  ccRecipients: any[]
) => {
  let destinationEmail: any = [];
  let ccDestinationEmail: any = [];

  if (NODE_ENV === 'production') {
    destinationEmail = recipients;
    ccDestinationEmail = ccRecipients;
  } else if (!REDIRECT_EMAIL && NODE_ENV !== 'production') {
    throw new Error(
      'REDIRECT_EMAIL is not defined for ' + NODE_ENV + ' environment.'
    );
  } else {
    destinationEmail = [REDIRECT_EMAIL];
    ccDestinationEmail = [REDIRECT_EMAIL];
  }

  return new Promise((resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'interviewSimdotcom@gmail.com',
          pass: 'uyck wvxq opkm vgif',
        },
      });

      const mailOptions = {
        from: 'interviewSimdotcom@gmail.com',
        to: destinationEmail,
        cc: ccDestinationEmail,
        subject: subject,
        html: template,
      };

      transporter.sendMail(mailOptions, (error: any, info: unknown) => {
        if (error) {
          return reject(error);
        }
        resolve(info);
      });
    } catch (error) {
      return reject(error);
    }
  });
};
