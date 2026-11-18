"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Locale, UI } from "@/lib/i18n";
import { useRequest } from "./RequestProvider";
import { Icon } from "./Icon";
import { cx, href } from "@/lib/href";

type Quiz = {
  hello: string; q1: { key: string; label: string }[]; q2: string; a2: { key: string; label: string }[];
  result: string; after: string; fallback: string; objectLabels: Record<string, string>;
};
type Rec = { label: string; path: string; note: string };
type Msg = { from: "draft" | "me"; text: string; links?: { label: string; path: string; note?: string }[]; options?: { key: string; label: string }[]; step?: 1 | 2; actions?: boolean };

function recommend(obj: string, need: string): Rec[] {
  const centum = { label: "Melke Centum", path: "okna/centum", note: "80 / 100 мм, 6 / 7 камер" };
  const evo = { label: "Melke Evolution", path: "okna/evolution", note: "70 мм, 5 камер" };
  const smart = { label: "Melke Smart Ultra", path: "okna/smart-ultra", note: "65 мм, 4 камеры" };
  const lite = { label: "Melke Lite 60", path: "resheniya/melke-lite-60", note: "60 мм, 3 камеры" };
  const balcony = { label: "Балконы и лоджии", path: "resheniya/balkony-i-lodzhii", note: "Тёплое и холодное остекление" };
  const alu = { label: "Алюминиевое остекление", path: "resheniya/alyuminievoe-osteklenie", note: "Террасы, порталы, крыши" };
  const hst = { label: "Двери HST", path: "resheniya/dveri-hst", note: "Порталы до 6,5 м" };
  if (obj === "terrace") return need === "warm" ? [hst, alu] : [alu, hst];
  if (obj === "balcony") return need === "warm" ? [balcony, evo] : [balcony, lite];
  if (obj === "house") return need === "price" ? [evo, smart] : need === "look" ? [centum, smart] : [centum, evo];
  return need === "warm" || need === "quiet" ? [evo, centum] : need === "price" ? [smart, evo] : [evo, smart];
}

export function DraftWidget({ lang, ui, quiz, avatar }: { lang: Locale; ui: UI; quiz: Quiz; avatar: string }) {
  const { open: openRequest } = useRequest();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [obj, setObj] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  const start = () => {
    setObj(null);
    setMsgs([{ from: "draft", text: quiz.hello, options: quiz.q1, step: 1 }]);
  };

  useEffect(() => {
    const onOpen = () => { setOpen(true); };
    window.addEventListener("draft:open", onOpen);
    const t = setTimeout(() => setHint(true), 3500);
    return () => { window.removeEventListener("draft:open", onOpen); clearTimeout(t); };
  }, []);
  useEffect(() => { if (open && msgs.length === 0) start(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [open]);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" }); }, [msgs, typing]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const say = (m: Msg, delay = 650) => {
    setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs((prev) => [...prev, m]); }, delay);
  };

  const pick = (step: 1 | 2, o: { key: string; label: string }) => {
    setMsgs((prev) => [...prev.map((m) => ({ ...m, options: undefined })), { from: "me", text: o.label }]);
    if (step === 1) {
      setObj(o.key);
      say({ from: "draft", text: quiz.q2, options: quiz.a2, step: 2 });
    } else {
      const recs = recommend(obj ?? "flat", o.key);
      say({ from: "draft", text: quiz.result, links: recs });
      setTimeout(() => say({ from: "draft", text: quiz.after, actions: true }, 500), 900);
    }
  };

  async function ask(e: FormEvent) {
    e.preventDefault();
    const q = text.trim();
    if (!q) return;
    setText("");
    setMsgs((prev) => [...prev.map((m) => ({ ...m, options: undefined })), { from: "me", text: q }]);
    setTyping(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: q, lang }) });
      const j = await r.json();
      setTyping(false);
      setMsgs((prev) => [...prev, j.matched ? { from: "draft", text: j.answer, links: j.links, actions: true } : { from: "draft", text: quiz.fallback, links: j.links, actions: true }]);
    } catch {
      setTyping(false);
      setMsgs((prev) => [...prev, { from: "draft", text: quiz.fallback, actions: true }]);
    }
  }

  return (
    <>
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
                  <span className="block font-semibold">{ui.draft.online}</span>
                  <span className="text-muted">{ui.draft.ask}</span>
                </motion.button>
              )}
            </AnimatePresence>
            <button type="button" onClick={() => setOpen(true)} aria-label={ui.draft.online} className="group relative size-16 rounded-full">
              <span aria-hidden className="absolute inset-0 rounded-full bg-cyan animate-pulse-ring" />
              <span className="relative block size-16 overflow-hidden rounded-full bg-linear-to-br from-[#0fd6f5] to-[#7eeafc] shadow-lift ring-2 ring-white transition-transform duration-300 group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt="" className="size-full object-cover object-[38%_18%] scale-150" />
              </span>
              <span aria-hidden className="absolute right-0.5 top-0.5 size-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog" aria-label={ui.draft.title}
            initial={{ opacity: 0, y: 32, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[70] flex h-[min(680px,92dvh)] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-line sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:rounded-3xl"
          >
            <div className="night flex items-center gap-3 px-5 py-4 text-white">
              <span className="relative block size-12 shrink-0 overflow-hidden rounded-full bg-linear-to-br from-[#0fd6f5] to-[#7eeafc]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt="" className="size-full object-cover object-[38%_18%] scale-150" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-tight">{ui.draft.title}</span>
                <span className="block truncate text-[13px] text-white/65">{ui.draft.subtitle}</span>
              </span>
              <button type="button" onClick={start} aria-label={ui.draft.restart} className="grid size-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">
                <Icon name="restart" className="size-[18px]" />
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label={ui.form.close} className="grid size-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">
                <Icon name="x" />
              </button>
            </div>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-mist px-4 py-5" aria-live="polite">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={cx("flex flex-col gap-2", m.from === "me" ? "items-end" : "items-start")}>
                  <div className={cx("max-w-[86%] rounded-2xl px-4 py-2.5 text-[15px] leading-snug", m.from === "me" ? "rounded-br-sm bg-ink text-white" : "rounded-bl-sm bg-white shadow-[0_1px_2px_rgb(13_27_39/0.06)]")}>
                    {m.text}
                  </div>
                  {m.links && m.links.length > 0 && (
                    <div className="grid w-[86%] gap-2">
                      {m.links.map((l) => (
                        <Link key={l.path} href={href(lang, l.path)} onClick={() => setOpen(false)} className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3 transition hover:border-cyan">
                          <span>
                            <span className="block text-[15px] font-semibold">{l.label}</span>
                            {l.note && <span className="block text-[13px] text-muted">{l.note}</span>}
                          </span>
                          <Icon name="arrow" className="size-4 text-cyan-deep transition-transform group-hover:translate-x-1" />
                        </Link>
                      ))}
                    </div>
                  )}
                  {m.options && (
                    <div className="flex flex-wrap gap-2">
                      {m.options.map((o) => (
                        <button key={o.key} type="button" onClick={() => pick(m.step ?? 1, o)} className="rounded-full border border-cyan/60 bg-white px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-cyan hover:shadow-lift">
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {m.actions && (
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => openRequest({ kind: "measure", object: obj ? quiz.objectLabels[obj] : undefined })} className="rounded-full bg-linear-to-r from-[#0fd6f5] to-[#49e6ff] px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lift">
                        {ui.cta.measure}
                      </button>
                      <button type="button" onClick={() => openRequest({ kind: "consult" })} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium transition hover:border-cyan">
                        {ui.form.titles.consult}
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <div className="flex w-16 items-center justify-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="size-1.5 rounded-full bg-muted" animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={ask} className="flex items-center gap-2 border-t border-line bg-white p-3">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder={ui.draft.placeholder} aria-label={ui.draft.placeholder} className="h-12 min-w-0 flex-1 rounded-xl bg-mist px-4 text-[15px] outline-none transition focus:shadow-[0_0_0_3px_rgb(19_216_246/0.25)]" />
              <button type="submit" aria-label={ui.draft.send} className="grid size-12 shrink-0 place-items-center rounded-xl bg-linear-to-r from-[#0fd6f5] to-[#49e6ff] text-ink transition hover:-translate-y-0.5 hover:shadow-lift">
                <Icon name="send" className="size-[18px]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
