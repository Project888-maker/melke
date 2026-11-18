import { AccessToken, RoomAgentDispatch, RoomConfiguration } from "livekit-server-sdk";
import { isLocale } from "@/lib/i18n";

/**
 * Live voice with Draft. Issues a short-lived LiveKit token for a private room
 * and asks LiveKit to dispatch the "draft" voice agent into it.
 *   LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_AGENT_NAME (default "draft")
 */
export const runtime = "nodejs";

const configured = () => !!(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET);

const calls = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = calls.get(ip);
  if (!h || now - h.t > 10 * 60_000) { calls.set(ip, { n: 1, t: now }); return false; }
  h.n += 1;
  return h.n > 8;
}

/** Lets the site know whether to show the Speak button. */
export async function GET() {
  return Response.json({ enabled: configured() }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!configured()) return Response.json({ ok: false, reason: "not_configured" }, { status: 503 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return Response.json({ ok: false, reason: "busy" }, { status: 429 });

  let body: { lang?: string; page?: string } = {};
  try { body = await request.json(); } catch { /* defaults below */ }
  const lang = body.lang && isLocale(body.lang) ? body.lang : "ru";
  const page = typeof body.page === "string" ? body.page.slice(0, 120) : "";

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const token = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, { identity: `visitor-${id}`, name: "Visitor", ttl: "15m" });
  token.addGrant({ room: `draft-${id}`, roomJoin: true, canPublish: true, canSubscribe: true, canPublishData: true, canUpdateOwnMetadata: true });
  token.roomConfig = new RoomConfiguration({
    emptyTimeout: 30,
    departureTimeout: 10,
    agents: [new RoomAgentDispatch({ agentName: process.env.LIVEKIT_AGENT_NAME ?? "draft", metadata: JSON.stringify({ lang, page }) })],
  });
  return Response.json({ ok: true, url: process.env.LIVEKIT_URL, token: await token.toJwt() }, { headers: { "cache-control": "no-store" } });
}
