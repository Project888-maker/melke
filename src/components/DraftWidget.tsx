"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Locale, UI } from "@/lib/i18n";
import type { AssistantAction } from "@/lib/assistant/brain";
import { useRequest } from "./RequestProvider";
import { Icon } from "./Icon";
import { cx, href } from "@/lib/href";
import { useSiteActions } from "./assistant/useSiteActions";
import { useVoice, type Transcript } from "./assistant/useVoice";

type Quiz = { q1: { key: string; label: string }[]; fallback: string; objectLabels: Record<string, string> };
type Chip = { label: string; path: string; note?: string };
type Msg = {
  id: string; from: "draft" | "me"; text: string;
  links?: Chip[]; options?: { key: string; label: string }[]; actions?: boolean; pending?: boolean; voice?: boolean;
};

let seq = 0;
const uid = () => `m${Date.now().toString(36)}${(seq++).toString(36)}`;
const CALL_LANGS: [Locale, string][] = [["ru", "Русский"], ["en", "English"], ["de", "Deutsch"]];
const isPhone = () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

function Avatar({ src, className }: { src: string; className?: string }) {
  return (
    <span className={cx("relative block shrink-0 overflow-hidden rounded-full bg-linear-to-br from-[#0fd6f5] to-[#7eeafc]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="size-full object-cover" />
    </span>
  );
}

/** Animated orb for the voice call: breathes with the sound level. */
function Orb({ level, state, size = 56 }: { level: number; state: string; size?: number }) {
  const s = 1 + Math.min(0.5, level * 2.2);
  return (
    <span className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }} aria-hidden>
      <span className="absolute inset-0 rounded-full bg-cyan/30 transition-transform duration-150" style={{ transform: `scale(${s + 0.18})` }} />
      <span className="absolute inset-[10%] rounded-full bg-cyan/50 transition-transform duration-100" style={{ transform: `scale(${s})` }} />
      <span className={cx("relative grid size-[62%] place-items-center rounded-full bg-linear-to-br from-[#0fd6f5] to-[#49e6ff] text-ink shadow-lift", state === "thinking" && "animate-pulse")}>
        <Icon name={state === "speaking" ? "wave" : "mic"} className="size-[46%]" strokeWidth={2} />
      </span>
    </span>
  );
}

export function DraftWidget({ lang, ui, quiz, avatar, greeting }: { lang: Locale; ui: UI; quiz: Quiz; avatar: string; greeting: string }) {
  const d = ui.draft;
  const pathname = usePathname();
  const { open: openRequest, active: formOpen } = useRequest();
  const runAction = useSiteActions(lang);
  const [open, setOpen] = useState(false);
  const [mini, setMini] = useState(false);
  const [hint, setHint] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);
  const history = useRef<Msg[]>([]);
  history.current = msgs;

  const patch = useCallback((id: string, fn: (m: Msg) => Msg) => setMsgs((prev) => prev.map((m) => (m.id === id ? fn(m) : m))), []);

  /** One place for everything Draft does on the page, from chat or from voice. */
  const act = useCallback(
    async (a: AssistantAction, msgId?: string, label?: string) => {
      const result = await runAction(a);
      if (a.name === "show_page" || a.name === "scroll_page") {
        if (isPhone()) setMini(true);
        if (a.name === "show_page" && msgId && label) {
          const path = a.args.path + (a.args.section ? `#${a.args.section}` : "");
          patch(msgId, (m) => ({ ...m, links: [...(m.links ?? []).filter((l) => l.path !== path), { label, path, note: d.opened }] }));
        }
      } else {
        // Forms: the chat sits beside the form on wide screens and folds into the bar on narrow ones.
        if (isPhone() || window.innerWidth < 1024) setMini(true);
        if (msgId) patch(msgId, (m) => ({ ...m, actions: true }));
      }
      return result;
    },
    [runAction, patch, d.opened],
  );

  const onTranscript = useCallback((t: Transcript) => {
    setMsgs((prev) => {
      const i = prev.findIndex((m) => m.id === t.id);
      const next: Msg = { id: t.id, from: t.from, text: t.text, voice: true, pending: !t.final };
      if (i < 0) return [...prev.map((m) => ({ ...m, options: undefined })), next];
      const copy = prev.slice();
      copy[i] = { ...copy[i], ...next };
      return copy;
    });
  }, []);

  const voice = useVoice({ lang, onAction: (a) => act(a), onTranscript });

  const start = useCallback(() => {
    abort.current?.abort();
    setBusy(false);
    setMsgs([{ id: uid(), from: "draft", text: greeting, options: quiz.q1 }]);
  }, [greeting, quiz.q1]);

  useEffect(() => {
    const onOpen = () => { setOpen(true); setMini(false); };
    window.addEventListener("draft:open", onOpen);
    const t = setTimeout(() => setHint(true), 3500);
    return () => { window.removeEventListener("draft:open", onOpen); clearTimeout(t); };
  }, []);
  useEffect(() => { if (open && msgs.length === 0) start(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [open]);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [msgs, mini, voice.state]);
  // Lets the request form make room for the chat (see RequestProvider).
  useEffect(() => {
    document.documentElement.dataset.draftOpen = open ? (mini ? "mini" : "panel") : "";
    return () => { delete document.documentElement.dataset.draftOpen; };
  }, [open, mini]);
  useEffect(() => { voice.reportPage(pathname); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      // The request form sits on top and takes Escape first.
      if (e.key !== "Escape" || document.querySelector("[data-request-modal]")) return;
      if (voice.active) setMini(true);
      else setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, voice.active]);

  const close = () => { void voice.stop(); setOpen(false); setMini(false); };

  async function send(q: string) {
    q = q.trim();
    if (!q || busy) return;
    const mine: Msg = { id: uid(), from: "me", text: q };
    const reply: Msg = { id: uid(), from: "draft", text: "", pending: true };
    const past = history.current.filter((m) => m.text && !m.pending).map((m) => ({ role: m.from === "me" ? "user" : "assistant", content: m.text }));
    setMsgs((prev) => [...prev.map((m) => ({ ...m, options: undefined })), mine, reply]);
    setBusy(true);
    const ctrl = new AbortController();
    abort.current = ctrl;
    const fail = () => patch(reply.id, (m) => ({ ...m, text: m.text || quiz.fallback, actions: true, pending: false }));
    try {
      const res = await fetch("/api/chat", {
        method: "POST", signal: ctrl.signal, headers: { "content-type": "application/json" },
        body: JSON.stringify({ lang, page: pathname, messages: [...past, { role: "user", content: q }] }),
      });
      if (!res.ok || !res.body) throw new Error("chat");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (!line.trim()) continue;
          const ev = JSON.parse(line);
          if (ev.t === "delta") patch(reply.id, (m) => ({ ...m, text: (m.text + ev.v).replace(/^\s+/, "") }));
          else if (ev.t === "action") void act({ name: ev.name, args: ev.args } as AssistantAction, reply.id, ev.label);
          else if (ev.t === "kb") patch(reply.id, (m) => ({ ...m, text: ev.matched ? ev.answer : quiz.fallback, links: ev.links, actions: true }));
        }
      }
      patch(reply.id, (m) => ({ ...m, text: m.text.trim() || quiz.fallback, pending: false }));
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError")) fail();
    } finally {
      setBusy(false);
    }
  }

  const onSubmit = (e: FormEvent) => { e.preventDefault(); const q = text; setText(""); void send(q); };
  const lastDraft = [...msgs].reverse().find((m) => m.from === "draft" && m.text)?.text ?? greeting;
  const stateLabel = voice.state === "connecting" ? d.connecting : voice.state === "thinking" ? d.thinking : voice.state === "speaking" ? d.speaking : d.listening;

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className="fixed bottom-4 right-4 z-[60] flex items-end gap-3 sm:bottom-6 sm:right-6"
          >
            <AnimatePresence>
              {hint && (
                <motion.button
                  type="button" onClick={() => setOpen(true)}
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                  className="mb-2 hidden rounded-2xl rounded-br-sm bg-white px-4 py-2.5 text-left text-sm shadow-card ring-1 ring-line sm:block"
                >
                  <span className="block font-semibold">{d.online}</span>
                  <span className="text-muted">{d.ask}</span>
                </motion.button>
              )}
            </AnimatePresence>
            <button type="button" onClick={() => setOpen(true)} aria-label={d.online} data-draft="launcher" className="group relative size-16 rounded-full">
              <span aria-hidden className="absolute inset-0 rounded-full bg-cyan animate-pulse-ring" />
              <Avatar src={avatar} className="size-16 shadow-lift ring-2 ring-white transition-transform duration-300 group-hover:scale-105" />
              <span aria-hidden className="absolute right-0.5 top-0.5 size-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact bar: Draft stays with the visitor while the page is in view */}
      <AnimatePresence>
        {open && mini && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            data-draft="mini"
            className={cx(
              "fixed inset-x-3 flex items-center gap-3 rounded-2xl bg-navy p-3 text-white shadow-2xl ring-1 ring-white/10 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px]",
              // While a form is open Draft stays on top of it: above the sheet on phones, in the corner on larger screens.
              formOpen ? "top-3 z-[90] sm:top-auto" : "bottom-3 z-[70]",
            )}
          >
            {voice.active ? <Orb level={voice.level} state={voice.state} size={48} /> : <Avatar src={avatar} className="size-12" />}
            <button type="button" onClick={() => setMini(false)} className="min-w-0 flex-1 text-left" aria-label={d.expand}>
              <span className="block text-[13px] font-semibold text-cyan">{voice.active ? stateLabel : d.title}</span>
              <span className="line-clamp-2 text-[14px] leading-snug text-white/85">{lastDraft}</span>
            </button>
            {voice.active && (
              <button type="button" onClick={() => void voice.stop()} aria-label={d.end} className="grid size-11 shrink-0 place-items-center rounded-full bg-rose-500 text-white transition hover:bg-rose-600">
                <Icon name="hangup" className="size-[18px]" />
              </button>
            )}
            <button type="button" onClick={() => setMini(false)} aria-label={d.expand} className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20">
              <Icon name="up" className="size-[18px]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && !mini && (
          <motion.div
            role="dialog" aria-label={d.title} data-draft="panel"
            initial={{ opacity: 0, y: 32, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={cx("fixed inset-x-0 bottom-0 flex h-[min(680px,92dvh)] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-line sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:rounded-3xl", formOpen ? "z-[70] lg:z-[90]" : "z-[70]")}
          >
            <div className="night flex items-center gap-3 px-5 py-4 text-white">
              <Avatar src={avatar} className="size-12" />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-tight">{d.title}</span>
                <span className="block truncate text-[13px] text-white/65">{voice.active ? stateLabel : d.subtitle}</span>
              </span>
              <button type="button" onClick={start} aria-label={d.restart} className="grid size-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">
                <Icon name="restart" className="size-[18px]" />
              </button>
              <button type="button" onClick={() => setMini(true)} aria-label={d.minimize} className="grid size-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">
                <Icon name="chevron" className="size-[18px]" />
              </button>
              <button type="button" onClick={close} aria-label={ui.form.close} className="grid size-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">
                <Icon name="x" />
              </button>
            </div>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-mist px-4 py-5" aria-live="polite">
              {msgs.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={cx("flex flex-col gap-2", m.from === "me" ? "items-end" : "items-start")}>
                  {m.text ? (
                    <div data-from={m.from} className={cx("max-w-[86%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[15px] leading-snug", m.from === "me" ? "rounded-br-sm bg-ink text-white" : "rounded-bl-sm bg-white shadow-[0_1px_2px_rgb(13_27_39/0.06)]", m.pending && m.voice && "opacity-70")}>
                      {m.text}
                    </div>
                  ) : m.pending ? (
                    <div className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="size-1.5 rounded-full bg-muted" animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  ) : null}
                  {m.links && m.links.length > 0 && (
                    <div className="grid w-[86%] gap-2">
                      {m.links.map((l) => (
                        <Link key={l.path} href={href(lang, l.path)} onClick={() => isPhone() && setMini(true)} className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3 transition hover:border-cyan">
                          <span>
                            {l.note && <span className="block text-[12px] font-medium uppercase tracking-wide text-cyan-deep">{l.note}</span>}
                            <span className="block text-[15px] font-semibold">{l.label}</span>
                          </span>
                          <Icon name="arrow" className="size-4 text-cyan-deep transition-transform group-hover:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  )}
                  {m.options && (
                    <div className="flex flex-wrap gap-2">
                      {m.options.map((o) => (
                        <button key={o.key} type="button" onClick={() => void send(o.label)} className="rounded-full border border-cyan/60 bg-white px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-cyan hover:shadow-lift">
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {m.actions && (
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => openRequest({ kind: "measure" })} className="rounded-full bg-linear-to-r from-[#0fd6f5] to-[#49e6ff] px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lift">
                        {ui.cta.measure}
                      </button>
                      <button type="button" onClick={() => openRequest({ kind: "consult" })} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium transition hover:border-cyan">
                        {d.manager}
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
              {voice.state === "error" && (
                <p className="rounded-xl bg-amber-50 px-4 py-3 text-[14px] leading-snug text-amber-900 ring-1 ring-amber-200">{voice.error === "mic" ? d.micDenied : d.voiceDown}</p>
              )}
            </div>

            {voice.active ? (
              <div className="border-t border-line bg-white p-3" data-draft="call">
                <div className="flex items-center gap-3 rounded-2xl bg-navy p-3 text-white">
                  <Orb level={voice.level} state={voice.state} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-tight">{stateLabel}</span>
                    <span className="block text-[12px] leading-snug text-white/60">{d.voiceNote}</span>
                  </span>
                  <button type="button" onClick={() => void voice.toggleMute()} aria-label={voice.muted ? d.unmute : d.mute} aria-pressed={voice.muted} className={cx("grid size-11 shrink-0 place-items-center rounded-full transition", voice.muted ? "bg-white text-ink" : "bg-white/10 hover:bg-white/20")}>
                    <Icon name={voice.muted ? "micOff" : "mic"} className="size-[18px]" />
                  </button>
                  <button type="button" onClick={() => void voice.stop()} aria-label={d.end} className="grid size-11 shrink-0 place-items-center rounded-full bg-rose-500 transition hover:bg-rose-600">
                    <Icon name="hangup" className="size-[18px]" />
                  </button>
                </div>
                <div className="mt-2.5 flex items-center gap-2 px-1" data-draft="call-lang" role="group" aria-label={d.callLang}>
                  <span className="mr-auto text-[12px] text-muted">{d.callLang}</span>
                  {CALL_LANGS.map(([code, label]) => (
                    <button
                      key={code} type="button" onClick={() => voice.setLanguage(code)} aria-pressed={voice.speech === code}
                      className={cx("h-8 rounded-full px-3 text-[13px] font-medium transition", voice.speech === code ? "bg-navy text-white" : "bg-mist text-ink hover:bg-cyan/20")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line bg-white p-3">
                {voice.enabled && (
                  <button type="button" onClick={() => void voice.start()} aria-label={d.speak} title={d.speak} data-draft="speak" className="group relative flex h-12 shrink-0 items-center gap-2 rounded-xl bg-navy pl-3.5 pr-4 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lift">
                    <span className="relative grid size-6 place-items-center">
                      <span aria-hidden className="absolute inset-0 rounded-full bg-cyan/50 animate-pulse-ring" />
                      <Icon name="mic" className="relative size-5 text-cyan" strokeWidth={2} />
                    </span>
                    {d.speakShort}
                  </button>
                )}
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder={d.placeholder} aria-label={d.placeholder} maxLength={600} className="h-12 min-w-0 flex-1 rounded-xl bg-mist px-4 text-[15px] outline-none transition focus:shadow-[0_0_0_3px_rgb(19_216_246/0.25)]" />
                <button type="submit" disabled={busy} aria-label={d.send} className="grid size-12 shrink-0 place-items-center rounded-xl bg-linear-to-r from-[#0fd6f5] to-[#49e6ff] text-ink transition hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-50">
                  <Icon name="send" className="size-[18px]" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
