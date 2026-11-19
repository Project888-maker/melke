import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Delivery channels, each switched on by its environment variables:
 *   Telegram: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (several ids separated by commas).
 *             The chat id is shown at /api/lead/telegram after the recipient presses Start in the bot.
 *   Email:    SMTP_HOST + SMTP_USER + SMTP_PASS (SMTP_PORT, default 465), or RESEND_API_KEY + LEAD_EMAIL_FROM.
 *             LEAD_EMAIL_TO (default eurotexno@mail.ru, several separated by commas), LEAD_EMAIL_FROM (default SMTP_USER).
 *   Webhook:  LEAD_WEBHOOK_URL.
 */
export const runtime = "nodejs";

type Lead = {
  kind?: string; topic?: string; name?: string; phone?: string; message?: string;
  object?: string; system?: string; count?: string; page?: string; lang?: string; consent?: boolean; website?: string;
};

const clean = (v: unknown, max = 600) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Receives requests from every form on the site and forwards them to the team. */
export async function POST(request: Request) {
  let body: Lead;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  // Honeypot field: real visitors never fill it in.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 40);
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2) return NextResponse.json({ ok: false, error: "name" }, { status: 422 });
  if (digits.length < 10 || digits.length > 15) return NextResponse.json({ ok: false, error: "phone" }, { status: 422 });
  if (body.consent !== true) return NextResponse.json({ ok: false, error: "consent" }, { status: 422 });

  const rows: [string, string][] = [
    ["Тип заявки", clean(body.kind, 40)],
    ["Тема", clean(body.topic, 160)],
    ["Имя", name],
    ["Телефон", phone],
    ["Объект", clean(body.object, 80)],
    ["Система", clean(body.system, 80)],
    ["Количество окон", clean(body.count, 20)],
    ["Комментарий", clean(body.message)],
    ["Страница", clean(body.page, 200)],
    ["Язык", clean(body.lang, 5)],
  ];
  const text = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
  const subject = `Заявка с сайта: ${name}, ${phone}`;

  const sent: string[] = [];
  const failed: string[] = [];

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, RESEND_API_KEY, LEAD_EMAIL_TO, LEAD_EMAIL_FROM, LEAD_WEBHOOK_URL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const list = (v?: string) => (v ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const emailTo = list(LEAD_EMAIL_TO).length ? list(LEAD_EMAIL_TO) : ["eurotexno@mail.ru"];

  if (TELEGRAM_BOT_TOKEN && list(TELEGRAM_CHAT_ID).length) {
    // One message per recipient; the channel counts as working if at least one got it.
    const results = await Promise.all(
      list(TELEGRAM_CHAT_ID).map((chat_id) =>
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ chat_id, text: `${subject}\n\n${text}` }),
        }).then((r) => r.ok, () => false),
      ),
    );
    (results.some(Boolean) ? sent : failed).push("telegram");
  }
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const port = Number(SMTP_PORT) || 465;
      const mail = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS }, connectionTimeout: 8000, socketTimeout: 8000 });
      await mail.sendMail({ from: LEAD_EMAIL_FROM || `"Сайт ET" <${SMTP_USER}>`, to: emailTo, subject, text });
      sent.push("email");
    } catch (e) {
      console.error("[lead] smtp failed", e instanceof Error ? e.message : e);
      failed.push("email");
    }
  } else if (RESEND_API_KEY && LEAD_EMAIL_FROM) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ from: LEAD_EMAIL_FROM, to: emailTo, subject, text }),
      });
      (r.ok ? sent : failed).push("email");
    } catch {
      failed.push("email");
    }
  }
  if (LEAD_WEBHOOK_URL) {
    try {
      const r = await fetch(LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subject, text, fields: Object.fromEntries(rows) }),
      });
      (r.ok ? sent : failed).push("webhook");
    } catch {
      failed.push("webhook");
    }
  }

  const configured = sent.length + failed.length > 0;
  if (failed.length) console.error("[lead] delivery failed", failed, "delivered", sent);
  if (configured && sent.length === 0) {
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }
  if (!configured) {
    // No delivery channel is configured yet: keep the request in the server log so it is not lost.
    console.warn("[lead] no delivery channel configured\n" + text);
  }
  return NextResponse.json({ ok: true, delivered: sent });
}
