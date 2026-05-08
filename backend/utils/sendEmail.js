const nodemailer = require("nodemailer");

function getTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) return null;
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }
  });
}

async function sendEmail({ to, subject, text, html }) {
  const transporter = getTransporter();
  if (!transporter) return { skipped: true };
  const from = process.env.EMAIL_FROM || "FindAndLost <no-reply@findandlost.com>";
  await transporter.sendMail({ from, to, subject, text, html });
  return { skipped: false };
}

module.exports = { sendEmail };

