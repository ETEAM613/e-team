import "server-only";
import nodemailer from "nodemailer";

// Envoi d'e-mails via le serveur SMTP (par ex. la boîte e-mail Hostinger du domaine).
// Variables : SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM.
// Sans configuration SMTP (tests en local), l'e-mail est affiché dans la console du serveur.

export async function sendMail(to: string, subject: string, text: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log(`[e-team] (e-mail non envoyé, SMTP non configuré)\nÀ : ${to}\nObjet : ${subject}\n${text}`);
    return;
  }
  const port = Number(SMTP_PORT ?? 465);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transporter.sendMail({ from: MAIL_FROM ?? `e-team <${SMTP_USER}>`, to, subject, text });
}

export function siteUrl() {
  return (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
