import { NextResponse } from "next/server";

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

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, RESEND_API_KEY, LEAD_EMAIL_TO, LEAD_EMAIL_FROM, LEAD_WEBHOOK_URL } = process.env;

  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `${subject}\n\n${text}` }),
      });
      (r.ok ? sent : failed).push("telegram");
    } catch {
      failed.push("telegram");
    }
  }
  if (RESEND_API_KEY && LEAD_EMAIL_FROM) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({ from: LEAD_EMAIL_FROM, to: [LEAD_EMAIL_TO ?? "eurotexno@mail.ru"], subject, text }),
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
  if (configured && sent.length === 0) {
    console.error("[lead] delivery failed", failed);
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
  }
  if (!configured) {
    // No delivery channel is configured yet: keep the request in the server log so it is not lost.
    console.warn("[lead] no delivery channel configured\n" + text);
  }
  return NextResponse.json({ ok: true, delivered: sent });
}
