/**
 * One-time setup helper for Telegram delivery.
 *
 * A bot cannot write to a person by @username: the person presses Start in the
 * bot, and the bot then knows their numeric chat id. This page lists the people
 * who pressed Start, so the id can be copied into TELEGRAM_CHAT_ID on Vercel.
 * Once TELEGRAM_CHAT_ID is set the page stops listing anything.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Update = { message?: { chat?: { id: number; type: string; username?: string; first_name?: string; title?: string } } };

const page = (body: string) =>
  new Response(`<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Telegram setup</title><body style="font:16px/1.5 system-ui;max-width:640px;margin:48px auto;padding:0 16px">${body}</body>`, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function GET() {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  if (!TELEGRAM_BOT_TOKEN) return page("<h1>Telegram is not connected</h1><p>Add <code>TELEGRAM_BOT_TOKEN</code> on Vercel and redeploy.</p>");
  if (TELEGRAM_CHAT_ID) return page("<h1>Telegram is set up</h1><p><code>TELEGRAM_CHAT_ID</code> is already set, requests are being delivered.</p>");

  let bot = "";
  let chats: NonNullable<NonNullable<Update["message"]>["chat"]>[] = [];
  try {
    const api = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
    const me = await fetch(`${api}/getMe`, { cache: "no-store" }).then((r) => r.json());
    if (!me.ok) return page("<h1>The bot token is not accepted</h1><p>Check <code>TELEGRAM_BOT_TOKEN</code> on Vercel.</p>");
    bot = me.result.username;
    const up = await fetch(`${api}/getUpdates`, { cache: "no-store" }).then((r) => r.json());
    const seen = new Map<number, (typeof chats)[number]>();
    for (const u of (up.result ?? []) as Update[]) if (u.message?.chat) seen.set(u.message.chat.id, u.message.chat);
    chats = [...seen.values()];
  } catch {
    return page("<h1>Telegram did not answer</h1><p>Try again in a minute.</p>");
  }

  const rows = chats.map((c) => `<tr><td style="padding:6px 16px 6px 0"><b>${esc(c.id)}</b></td><td>${esc(c.username ? "@" + c.username : c.title ?? c.first_name)} (${esc(c.type)})</td></tr>`).join("");
  return page(
    `<h1>Telegram setup</h1><p>Bot: <a href="https://t.me/${esc(bot)}">@${esc(bot)}</a></p>` +
      (rows
        ? `<p>Copy the number of the person or group that should receive requests into <code>TELEGRAM_CHAT_ID</code> on Vercel (several numbers separated by commas), then redeploy.</p><table>${rows}</table>`
        : `<p>Nobody has pressed Start yet. The recipient opens the bot link above, presses <b>Start</b>, then reload this page.</p>`),
  );
}
