"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Room } from "livekit-client";
import type { Locale } from "@/lib/i18n";
import type { AssistantAction } from "@/lib/assistant/brain";

export type VoiceState = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "error";
export type VoiceError = "mic" | "unavailable" | null;
export type Transcript = { id: string; from: "draft" | "me"; text: string; final: boolean };

const MAX_CALL_MS = 10 * 60_000;
/** Draft greets within a few seconds; a cold start can take up to about 13. Longer than this means the voice service is down. */
const GREETING_MS = 22_000;

/**
 * Live voice call with Draft over LiveKit. The agent hears the visitor,
 * answers aloud, and drives the page through the "site.action" RPC method.
 */
export function useVoice({
  lang, onAction, onTranscript,
}: { lang: Locale; onAction: (a: AssistantAction) => Promise<string>; onTranscript: (t: Transcript) => void }) {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState<VoiceError>(null);
  const [muted, setMuted] = useState(false);
  const [level, setLevel] = useState(0);
  const room = useRef<Room | null>(null);
  const audio = useRef<HTMLAudioElement[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greet = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heard = useRef(false);
  const raf = useRef(0);
  const cb = useRef({ onAction, onTranscript });
  cb.current = { onAction, onTranscript };

  useEffect(() => {
    let alive = true;
    fetch("/api/voice/token").then((r) => r.json()).then((j) => alive && setEnabled(!!j.enabled)).catch(() => {});
    return () => { alive = false; };
  }, []);

  const stop = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    if (greet.current) clearTimeout(greet.current);
    cancelAnimationFrame(raf.current);
    audio.current.forEach((el) => el.remove());
    audio.current = [];
    const r = room.current;
    room.current = null;
    setState("idle");
    setMuted(false);
    setLevel(0);
    if (r) await r.disconnect().catch(() => {});
  }, []);

  /** The call broke on the service side: end it and say so, instead of leaving the visitor in silence. */
  const fail = useCallback(async () => {
    await stop();
    setError("unavailable");
    setState("error");
  }, [stop]);

  const start = useCallback(async () => {
    if (room.current) return;
    heard.current = false;
    setError(null);
    setState("connecting");
    try {
      const res = await fetch("/api/voice/token", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lang, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error("unavailable");
      const { url, token } = await res.json();
      const { Room: LKRoom, RoomEvent, Track } = await import("livekit-client");
      const r = new LKRoom({ adaptiveStream: false, dynacast: false });
      room.current = r;

      r.registerRpcMethod("site.action", async (data) => {
        try {
          return await cb.current.onAction(JSON.parse(data.payload) as AssistantAction);
        } catch {
          return "The action failed.";
        }
      });

      r.registerTextStreamHandler("lk.transcription", async (reader, who) => {
        const attrs = reader.info.attributes ?? {};
        const mine = who.identity === r.localParticipant.identity;
        const id = `${mine ? "me" : "draft"}-${attrs["lk.segment_id"] ?? reader.info.id}`;
        if (!mine) heard.current = true;
        let text = "";
        try {
          for await (const chunk of reader) {
            text += chunk;
            cb.current.onTranscript({ id, from: mine ? "me" : "draft", text, final: false });
          }
        } catch { /* stream cut short: keep what arrived */ }
        const final = mine ? attrs["lk.transcription_final"] !== "false" : true;
        if (text.trim()) cb.current.onTranscript({ id, from: mine ? "me" : "draft", text, final });
      });

      r.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind !== Track.Kind.Audio) return;
        const el = track.attach();
        el.style.display = "none";
        document.body.appendChild(el);
        audio.current.push(el);
      });
      r.on(RoomEvent.ParticipantAttributesChanged, (changed) => {
        const s = changed["lk.agent.state"];
        if (s === "speaking") heard.current = true;
        if (s === "listening" || s === "thinking" || s === "speaking") setState(s);
      });
      // Draft leaving or the room dropping while the call is on means the voice service failed.
      r.on(RoomEvent.ParticipantDisconnected, (p) => { if (room.current === r && p.isAgent) void fail(); });
      r.on(RoomEvent.Disconnected, () => { if (room.current === r) void fail(); });

      await r.connect(url, token);
      try {
        await r.localParticipant.setMicrophoneEnabled(true, { echoCancellation: true, noiseSuppression: true, autoGainControl: true });
      } catch {
        setError("mic");
        throw new Error("mic");
      }
      await r.startAudio().catch(() => {});

      // Meter for the animated orb: the louder of the visitor and Draft.
      const tick = () => {
        const cur = room.current;
        if (!cur) return;
        let v = cur.localParticipant.audioLevel ?? 0;
        cur.remoteParticipants.forEach((p) => { v = Math.max(v, p.audioLevel ?? 0); });
        setLevel((prev) => prev * 0.7 + v * 0.3);
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);

      setState((s) => (s === "connecting" ? "listening" : s));
      timer.current = setTimeout(() => void stop(), MAX_CALL_MS);
      greet.current = setTimeout(() => { if (room.current === r && !heard.current) void fail(); }, GREETING_MS);
    } catch (e) {
      const mic = e instanceof Error && e.message === "mic";
      await stop();
      setError(mic ? "mic" : "unavailable");
      setState("error");
    }
  }, [lang, stop, fail]);

  const toggleMute = useCallback(async () => {
    const r = room.current;
    if (!r) return;
    const next = !muted;
    await r.localParticipant.setMicrophoneEnabled(!next);
    setMuted(next);
  }, [muted]);

  /** Lets the agent know when the visitor moves to another page on their own. */
  const reportPage = useCallback((path: string) => {
    void room.current?.localParticipant.setAttributes({ page: path }).catch(() => {});
  }, []);

  useEffect(() => () => { void stop(); }, [stop]);

  return { enabled, state, error, muted, level, active: state !== "idle" && state !== "error", start, stop, toggleMute, reportPage };
}
