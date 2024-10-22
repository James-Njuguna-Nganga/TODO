import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, text) => {
  await transport.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  });
};

export const generateResetUrl = (token) => {
  return `${process.env.RESET_BASE_URL}?token=${token}`;
};
