import nodemailer from "nodemailer";
import { env } from "../env/server.mjs";
import type Mail from "nodemailer/lib/mailer";

export async function sendMailAsync(
  mailOptions: Mail.Options
): Promise<string> {
  return new Promise((resolve) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(`Error: ${error.message}`);
      } else {
        resolve(`Success: ${info.response}`);
      }
    });
  });
}
