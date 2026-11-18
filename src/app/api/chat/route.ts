import { instructions, toolDefs, siteMap, type AssistantAction } from "@/lib/assistant/brain";
import { fallbackAnswer } from "@/lib/assistant/fallback";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * Draft's text chat. Talks to any OpenAI-compatible chat completions endpoint:
 *   LLM_BASE_URL  e.g. https://host/v1
 *   LLM_API_KEY
 *   LLM_MODEL
 * The reply is streamed as newline-delimited JSON:
 *   {"t":"delta","v":"text"}  {"t":"action","name":..,"args":..}  {"t":"kb",..}  {"t":"done"}
 * Tools are visual: the browser performs them (open a page, scroll, open a form).
 */
export const runtime = "nodejs";
export const maxDuration = 60;

type ChatMsg = { role: "system" | "user" | "assistant" | "tool"; content: string | null; tool_calls?: ToolCall[]; tool_call_id?: string };
type ToolCall = { id: string; type: "function"; function: { name: string; arguments: string } };

const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 5 * 60_000) { hits.set(ip, { n: 1, t: now }); return false; }
  h.n += 1;
  return h.n > 40;
}

function toolResult(lang: Locale, a: AssistantAction): string {
  if (a.name === "show_page") {
    const page = siteMap(lang).find((p) => p.path === a.args.path);
    return page ? `Opened "${page.title}"${a.args.section ? `, section ${a.args.section}` : ""}. The visitor sees it now.` : "No such page. Use a path from the site map.";
  }
  if (a.name === "scroll_page") return "Scrolled.";
  if (a.name === "open_request_form") return "The request form is open on the visitor's screen. They fill in name and phone themselves.";
  return "The consultation form is open with your summary. A manager will call back during working hours (Mon–Fri 9:00–17:00).";
}

/** One model round. Streams text deltas through onDelta and returns the full message. */
async function round(messages: ChatMsg[], tools: unknown, onDelta: (v: string) => void, signal: AbortSignal) {
  const call = (limits: Record<string, unknown>) =>
    fetch(`${process.env.LLM_BASE_URL!.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      signal,
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.LLM_API_KEY}` },
      body: JSON.stringify({ model: process.env.LLM_MODEL, messages, tools, tool_choice: "auto", stream: true, ...limits }),
    });
  let res = await call({ temperature: 0.4, max_tokens: 600 });
  // Newer reasoning models reject max_tokens / temperature; retry in their dialect.
  if (res.status === 400) {
    const why = await res.text();
    if (!/max_tokens|temperature/i.test(why)) throw new Error(`LLM 400: ${why.slice(0, 300)}`);
    res = await call({ max_completion_tokens: 1200 });
  }
  if (!res.ok) throw new Error(`LLM ${res.status}: ${(await res.text()).slice(0, 300)}`);

  let content = "";
  const calls: ToolCall[] = [];
  const type = res.headers.get("content-type") ?? "";
  if (!type.includes("event-stream") || !res.body) {
    const j = await res.json();
    const m = j.choices?.[0]?.message ?? {};
    content = m.content ?? "";
    if (content) onDelta(content);
    return { content, calls: (m.tool_calls ?? []) as ToolCall[] };
  }

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      let j: { choices?: { delta?: { content?: string; tool_calls?: { index?: number; id?: string; function?: { name?: string; arguments?: string } }[] } }[] };
      try { j = JSON.parse(data); } catch { continue; }
      const d = j.choices?.[0]?.delta;
      if (!d) continue;
      if (d.content) { content += d.content; onDelta(d.content); }
      for (const tc of d.tool_calls ?? []) {
        const i = tc.index ?? 0;
        calls[i] ??= { id: tc.id ?? `call_${i}`, type: "function", function: { name: "", arguments: "" } };
        if (tc.id) calls[i].id = tc.id;
        if (tc.function?.name) calls[i].function.name += tc.function.name;
        if (tc.function?.arguments) calls[i].function.arguments += tc.function.arguments;
      }
    }
  }
  return { content, calls: calls.filter(Boolean) };
}

export async function POST(request: Request) {
  let body: { lang?: string; messages?: { role: string; content: string }[]; page?: string };
  try { body = await request.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }

  const lang: Locale = body.lang && isLocale(body.lang) ? body.lang : "ru";
  const history = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-16)
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, 1200) }));
  const last = [...history].reverse().find((m) => m.role === "user");
  if (!last) return Response.json({ ok: false }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const enc = new TextEncoder();
  const configured = !!(process.env.LLM_BASE_URL && process.env.LLM_API_KEY && process.env.LLM_MODEL);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (o: unknown) => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      const offline = () => send({ t: "kb", ...fallbackAnswer(last.content) });
      let said = false;
      try {
        if (!configured || limited(ip)) { offline(); return; }
        const page = typeof body.page === "string" ? body.page.slice(0, 120) : "";
        const messages: ChatMsg[] = [
          { role: "system", content: instructions(lang, "text") + (page ? `\n\n# Right now\nThe visitor is looking at the page "${page}".` : "") },
          ...history,
        ];
        const tools = toolDefs(lang);
        for (let i = 0; i < 4; i++) {
          const { content, calls } = await round(messages, tools, (v) => { said = true; send({ t: "delta", v }); }, request.signal);
          if (!calls.length) break;
          messages.push({ role: "assistant", content: content || null, tool_calls: calls });
          for (const call of calls) {
            let args: Record<string, unknown> = {};
            try { args = JSON.parse(call.function.arguments || "{}"); } catch { /* malformed arguments are ignored */ }
            const action = { name: call.function.name, args } as AssistantAction;
            if (action.name === "show_page" && typeof args.path === "string") args.path = args.path.replace(/^\/+|\/+$/g, "").replace(/^(ru|en|de)(\/|$)/, "");
            const label = action.name === "show_page" ? siteMap(lang).find((p) => p.path === action.args.path)?.title : undefined;
            const known = ["show_page", "scroll_page", "open_request_form", "handoff_to_manager"].includes(action.name) && (action.name !== "show_page" || label !== undefined);
            if (known) send({ t: "action", name: action.name, args, label });
            messages.push({ role: "tool", tool_call_id: call.id, content: known ? toolResult(lang, action) : action.name === "show_page" ? "No such page. Use a path from the site map." : "Unknown tool." });
          }
          if (content) send({ t: "delta", v: "\n" });
        }
        if (!said) offline();
      } catch (e) {
        console.error("[chat]", e instanceof Error ? e.message : e);
        if (!said) offline();
      } finally {
        send({ t: "done" });
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" } });
}
