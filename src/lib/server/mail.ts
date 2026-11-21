import "server-only";
import nodemailer from "nodemailer";

// Envoi d'e-mails via le serveur SMTP (la boîte contact@e-team.fr chez Hostinger).
// Variables : SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM.
// Sans configuration SMTP (tests en local), l'e-mail est affiché dans la console du serveur.

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Version HTML simple aux couleurs d'e-team (les liens deviennent cliquables). */
function toHtml(text: string) {
  const body = escape(text)
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color:#5a33f0;font-weight:bold">$1</a>')
    .replace(/\n/g, "<br>");
  return `<div style="font-family:Arial,sans-serif;background:#f6f4ff;padding:24px">
  <div style="max-width:560px;margin:auto;background:#fff;border-radius:16px;padding:28px;color:#0e0b26;font-size:15px;line-height:1.6">
    <p style="font-size:20px;font-weight:800;margin:0 0 16px;color:#5a33f0">e-team · La Torah Connectée</p>
    ${body}
  </div></div>`;
}

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
  await transporter.sendMail({ from: MAIL_FROM ?? `e-team <${SMTP_USER}>`, to, subject, text, html: toHtml(text) });
}

/** Envoi « best effort » : une panne d'e-mail ne bloque jamais l'action de l'utilisateur. */
export async function notify(to: string | string[], subject: string, text: string) {
  for (const address of Array.isArray(to) ? to : [to]) {
    try {
      await sendMail(address, subject, text);
    } catch (err) {
      console.error(`[e-team] échec d'envoi d'e-mail à ${address} :`, err);
    }
  }
}

export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
}

export function siteUrl() {
  return (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
