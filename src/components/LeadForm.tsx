"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import type { Locale, UI } from "@/lib/i18n";
import { btn, BtnInner } from "./Button";
import { Icon } from "./Icon";
import { cx, href } from "@/lib/href";
import { registerForm, type FormFill, type FormState, type SubmitResult } from "@/lib/assistant/formBridge";

export type LeadKind = "calc" | "measure" | "consult" | "office";
export type LeadPreset = { kind: LeadKind; topic?: string; system?: string; object?: string };

const field =
  "h-13 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink placeholder:text-muted/70 outline-none transition-[border-color,box-shadow] duration-200 focus:border-cyan focus:shadow-[0_0_0_4px_rgb(19_216_246/0.18)]";

function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (!d) return "";
  if (d[0] === "8") d = "7" + d.slice(1);
  if (d[0] === "9") d = "7" + d;
  if (d[0] !== "7") return "+" + d.slice(0, 15);
  d = d.slice(0, 11);
  let out = "+7";
  if (d.length > 1) out += " (" + d.slice(1, 4);
  if (d.length >= 5) out += ") " + d.slice(4, 7);
  if (d.length >= 8) out += "-" + d.slice(7, 9);
  if (d.length >= 10) out += "-" + d.slice(9, 11);
  return out;
}

export function LeadForm({
  ui, lang, preset, systems, objects, onDone, compact = false, modal = false,
}: {
  ui: UI; lang: Locale; preset: LeadPreset; systems: string[]; objects: string[]; onDone?: () => void; compact?: boolean; modal?: boolean;
}) {
  const f = ui.form;
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState("");
  const showDetails = preset.kind === "calc";

  const form = useRef<HTMLFormElement>(null);
  const phoneNow = useRef("");
  useEffect(() => { phoneNow.current = phone; }, [phone]);

  /** Validates and sends whatever is in the form right now. */
  async function send(el: HTMLFormElement): Promise<SubmitResult> {
    const data = Object.fromEntries(new FormData(el)) as Record<string, string>;
    const tel = phoneNow.current;
    const errs: Record<string, string> = {};
    if ((data.name ?? "").trim().length < 2) errs.name = f.errName;
    if (tel.replace(/\D/g, "").length < 11) errs.phone = f.errPhone;
    if (!data.consent) errs.consent = f.errConsent;
    setErrors(errs);
    if (errs.name) return { ok: false, reason: "name" };
    if (errs.phone) return { ok: false, reason: "phone" };
    if (errs.consent) return { ok: false, reason: "consent" };
    setStatus("sending");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, phone: tel, consent: true, kind: preset.kind, topic: preset.topic, page: pathname, lang }),
      });
      const j = await r.json().catch(() => ({}));
      const ok = r.ok && j.ok;
      setStatus(ok ? "ok" : "error");
      return ok ? { ok: true } : { ok: false, reason: "send" };
    } catch {
      setStatus("error");
      return { ok: false, reason: "send" };
    }
  }

  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); void send(e.currentTarget); };

  // Lets Draft fill in and send this form for the visitor (see formBridge).
  useEffect(() => {
    const state = (): FormState => {
      const name = (form.current?.elements.namedItem("name") as HTMLInputElement | null)?.value ?? "";
      const tel = phoneNow.current;
      return { name, phone: tel, nameValid: name.trim().length >= 2, phoneValid: tel.replace(/\D/g, "").length >= 11 };
    };
    const set = (field: string, value: string) => {
      const el = form.current?.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (el) el.value = value;
    };
    return registerForm({
      modal,
      state,
      fill(v: FormFill) {
        if (v.name !== undefined) set("name", v.name.trim().slice(0, 80));
        if (v.phone !== undefined) { const p = formatPhone(v.phone); phoneNow.current = p; setPhone(p); }
        if (v.comment !== undefined) set("message", v.comment.trim().slice(0, 1000));
        if (v.count !== undefined && Number.isFinite(v.count)) set("count", String(Math.max(1, Math.min(500, Math.round(v.count)))));
        if (v.system) {
          const wanted = v.system.trim().toLowerCase();
          const hit = systems.find((x) => x.toLowerCase() === wanted || x.toLowerCase().endsWith(wanted));
          if (hit) set("system", hit);
        }
        setErrors({});
        return state();
      },
      submit: async () => (form.current ? send(form.current) : { ok: false, reason: "send" }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, systems]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "ok" ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center py-8 text-center"
          role="status"
        >
          <motion.span
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
            className="grid size-18 place-items-center rounded-full bg-linear-to-br from-[#0fd6f5] to-[#7eeafc] text-ink shadow-lift"
          >
            <Icon name="check" className="size-9" strokeWidth={2.4} />
          </motion.span>
          <h3 className="mt-6 text-2xl font-bold tracking-tight">{f.okTitle}</h3>
          <p className="mt-2 max-w-xs text-muted">{f.okText}</p>
          {onDone && (
            <button type="button" onClick={onDone} className={cx(btn("outline"), "mt-7")}>
              {f.close}
            </button>
          )}
        </motion.div>
      ) : (
        <motion.form key="form" ref={form} onSubmit={submit} noValidate exit={{ opacity: 0, y: -12 }} className="grid gap-3.5">
          <div className={cx("grid gap-3.5", !compact && "sm:grid-cols-2")}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">{f.name}</span>
              <input name="name" autoComplete="name" className={cx(field, errors.name && "border-red-400")} aria-invalid={!!errors.name} />
              {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">{f.phone}</span>
              <input
                name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__"
                value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))}
                className={cx(field, errors.phone && "border-red-400")} aria-invalid={!!errors.phone}
              />
              {errors.phone && <span className="mt-1 block text-xs text-red-600">{errors.phone}</span>}
            </label>
          </div>
          {showDetails && (
            <div className="grid gap-3.5 sm:grid-cols-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">{f.object}</span>
                <select name="object" defaultValue={preset.object ?? ""} className={field}>
                  <option value="">{f.any}</option>
                  {objects.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">{f.system}</span>
                <select name="system" defaultValue={preset.system ?? ""} className={field}>
                  <option value="">{f.any}</option>
                  {systems.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">{f.count}</span>
                <input name="count" type="number" min={1} max={500} inputMode="numeric" className={field} />
              </label>
            </div>
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">{f.message}</span>
            <textarea name="message" rows={compact ? 2 : 3} placeholder={f.messagePh} className={cx(field, "h-auto resize-none py-3")} />
          </label>
          <input name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] size-px opacity-0" aria-hidden />
          <label className="flex items-start gap-3 text-sm text-muted">
            <input name="consent" type="checkbox" defaultChecked className="mt-0.5 size-4.5 shrink-0 accent-[#00b6d6]" />
            <span>
              {f.consent}.{" "}
              <Link href={href(lang, "politika")} className="text-ink underline decoration-cyan decoration-2 underline-offset-4 hover:text-cyan-deep">
                {f.policy}
              </Link>
              {errors.consent && <span className="mt-1 block text-xs text-red-600">{errors.consent}</span>}
            </span>
          </label>
          {status === "error" && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{f.errSend}</p>}
          <button type="submit" disabled={status === "sending"} className={cx(btn("primary", "lg", true), "mt-1 disabled:opacity-70")}>
            <BtnInner arrow={status !== "sending"}>{status === "sending" ? f.sending : f.send}</BtnInner>
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
