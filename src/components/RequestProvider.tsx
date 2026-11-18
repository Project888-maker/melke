"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Locale, UI } from "@/lib/i18n";
import { LeadForm, type LeadPreset } from "./LeadForm";
import { btn, BtnInner, type Size, type Variant } from "./Button";
import { Icon } from "./Icon";
import { cx } from "@/lib/href";

type Ctx = { open: (preset: LeadPreset) => void; ui: UI; lang: Locale; systems: string[]; objects: string[] };
const RequestContext = createContext<Ctx | null>(null);

export const useRequest = () => {
  const ctx = useContext(RequestContext);
  if (!ctx) throw new Error("RequestProvider is missing");
  return ctx;
};

export function RequestProvider({
  children, ui, lang, systems, objects,
}: { children: ReactNode; ui: UI; lang: Locale; systems: string[]; objects: string[] }) {
  const [preset, setPreset] = useState<LeadPreset | null>(null);
  const open = useCallback((p: LeadPreset) => setPreset(p), []);
  const close = useCallback(() => setPreset(null), []);
  const value = useMemo(() => ({ open, ui, lang, systems, objects }), [open, ui, lang, systems, objects]);

  useEffect(() => {
    if (!preset) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [preset, close]);

  return (
    <RequestContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {preset && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <button type="button" aria-label={ui.form.close} onClick={close} className="absolute inset-0 cursor-default bg-navy/70 backdrop-blur-md" />
            <motion.div
              role="dialog" aria-modal="true" aria-labelledby="request-title"
              initial={{ opacity: 0, y: 48, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 32, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[94dvh] w-full max-w-[640px] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-9"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#0fd6f5] via-[#7eeafc] to-[#0fd6f5]" />
              <button type="button" onClick={close} aria-label={ui.form.close} className="absolute right-4 top-5 grid size-10 place-items-center rounded-full text-muted transition hover:bg-mist hover:text-ink">
                <Icon name="x" />
              </button>
              <h2 id="request-title" className="pr-10 text-[26px] font-bold tracking-tight sm:text-3xl">{ui.form.titles[preset.kind]}</h2>
              <p className="mt-2 text-muted">{ui.form.leads[preset.kind]}</p>
              {preset.topic && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan/12 px-3.5 py-1.5 text-sm font-medium">
                  <span className="size-1.5 rounded-full bg-cyan-deep" />
                  {preset.topic}
                </p>
              )}
              <div className="mt-6">
                <LeadForm ui={ui} lang={lang} preset={preset} systems={systems} objects={objects} onDone={close} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </RequestContext.Provider>
  );
}

/** Any button that opens the request form. */
export function RequestButton({
  kind = "consult", topic, system, object, variant = "primary", size = "md", block, arrow = true, className, children,
}: Partial<LeadPreset> & { variant?: Variant; size?: Size; block?: boolean; arrow?: boolean; className?: string; children: ReactNode }) {
  const { open } = useRequest();
  return (
    <button type="button" onClick={() => open({ kind, topic, system, object })} className={cx(btn(variant, size, block), className)}>
      <BtnInner arrow={arrow} variant={variant}>{children}</BtnInner>
    </button>
  );
}

/** Button that opens the Draft helper. */
export function DraftButton({
  variant = "primary", size = "md", block, className, children,
}: { variant?: Variant; size?: Size; block?: boolean; className?: string; children: ReactNode }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("draft:open"))} className={cx(btn(variant, size, block), className)}>
      <BtnInner variant={variant}>{children}</BtnInner>
    </button>
  );
}
