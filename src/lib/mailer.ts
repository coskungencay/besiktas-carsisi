import "server-only";

import { smtpConfig } from "@/lib/env";

export type ContactMailPayload = {
  siteName: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * SMTP env'i doluysa iletisim mesajini mail olarak gonderir.
 * Env eksikse veya gonderim hata verirse sessizce false doner —
 * mesaj zaten veritabanina yazilmis oluyor, form asla patlamamali.
 */
export async function sendContactMail(
  payload: ContactMailPayload,
): Promise<boolean> {
  const config = smtpConfig();
  if (!config) return false;

  try {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.user ? { user: config.user, pass: config.pass } : undefined,
    });

    const lines = [
      ["Ad Soyad", payload.name],
      ["Telefon", payload.phone || "-"],
      ["E-posta", payload.email || "-"],
    ];

    await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: payload.email || undefined,
      subject: `[${payload.siteName}] Yeni iletişim mesajı — ${payload.name}`,
      text: [
        ...lines.map(([k, v]) => `${k}: ${v}`),
        "",
        payload.message,
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,sans-serif;line-height:1.6">
          <h2 style="margin:0 0 12px">${escapeHtml(payload.siteName)} — yeni mesaj</h2>
          <table cellpadding="4" style="border-collapse:collapse">
            ${lines
              .map(
                ([k, v]) =>
                  `<tr><td><strong>${escapeHtml(k ?? "")}</strong></td><td>${escapeHtml(v ?? "")}</td></tr>`,
              )
              .join("")}
          </table>
          <p style="white-space:pre-wrap;margin-top:16px">${escapeHtml(payload.message)}</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("[mailer] Mail gönderilemedi:", error);
    return false;
  }
}
