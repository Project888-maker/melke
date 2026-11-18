"use client";
import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { AssistantAction, FormArgs } from "@/lib/assistant/brain";
import { currentForm } from "@/lib/assistant/formBridge";
import { href } from "@/lib/href";
import { useRequest } from "../RequestProvider";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function until<T>(get: () => T | null | undefined | false, ms = 4000): Promise<T | null> {
  const end = Date.now() + ms;
  for (;;) {
    const v = get();
    if (v) return v;
    if (Date.now() > end) return null;
    await wait(80);
  }
}

/** Scrolls to an element below the sticky header and puts a soft spotlight on it. */
function spotlight(el: HTMLElement) {
  const top = el.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  el.classList.remove("draft-spot");
  void el.offsetWidth;
  el.classList.add("draft-spot");
  setTimeout(() => el.classList.remove("draft-spot"), 2600);
}

/**
 * Performs what Draft asks for on the visitor's screen: open a page, scroll,
 * open a form. Used by the text chat and by the voice agent (over LiveKit RPC).
 * Returns a short English result that goes back to the model.
 */
export function useSiteActions(lang: Locale) {
  const router = useRouter();
  const { open, close, systems } = useRequest();
  const shown = useRef<string | null>(null);

  return useCallback(
    async (a: AssistantAction): Promise<string> => {
      if (a.name === "show_page") {
        const path = String(a.args.path ?? "").replace(/^\/+|\/+$/g, "");
        const target = href(lang, path);
        const same = window.location.pathname.replace(/\/$/, "") === target.replace(/\/$/, "");
        if (!same) {
          router.push(target);
          const arrived = await until(() => window.location.pathname.replace(/\/$/, "") === target.replace(/\/$/, ""));
          if (!arrived) return "The page did not open.";
          await wait(450);
        }
        if (a.args.section) {
          const el = await until(() => document.getElementById(String(a.args.section)), 2500);
          if (el) spotlight(el);
          else return "Page opened, but that section was not found.";
        } else if (same) window.scrollTo({ top: 0, behavior: "smooth" });
        return "Page is open.";
      }
      if (a.name === "scroll_page") {
        const to = String(a.args.to ?? "down");
        const step = Math.round(window.innerHeight * 0.8);
        if (to === "down") window.scrollBy({ top: step, behavior: "smooth" });
        else if (to === "up") window.scrollBy({ top: -step, behavior: "smooth" });
        else if (to === "top") window.scrollTo({ top: 0, behavior: "smooth" });
        else if (to === "bottom") window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        else {
          const el = document.getElementById(to);
          if (!el) return "No such section on this page.";
          spotlight(el);
        }
        return "Scrolled.";
      }
      if (a.name === "open_request_form") {
        const kind = (["measure", "calc", "consult", "office"] as const).includes(a.args.kind) ? a.args.kind : "consult";
        // Only the quote form has a system field; elsewhere the product goes into the note for the manager.
        const wanted = a.args.system?.trim().toLowerCase();
        const system = wanted ? systems.find((s) => s.toLowerCase() === wanted || s.toLowerCase().endsWith(wanted)) : undefined;
        const inField = kind === "calc" && system;
        const topic = [inField ? null : (system ?? a.args.system), a.args.note].filter(Boolean).join(" · ") || undefined;
        open({ kind, system: inField ? system : undefined, topic });
        return "The form is open.";
      }
      if (a.name === "fill_request_form" || a.name === "submit_request_form") {
        const args = a.args as FormArgs;
        const kind = (["measure", "calc", "consult", "office"] as const).includes(args.kind) ? args.kind : "consult";
        // Use the form that is already on screen; otherwise open the modal one and wait for it.
        let form = currentForm();
        if (!form?.modal || shown.current !== kind) {
          if (!form?.modal) { open({ kind, topic: args.system }); shown.current = kind; }
          form = await until(() => { const f = currentForm(); return f?.modal ? f : null; }, 2500);
          if (!form) return "The form did not open. Ask the visitor to press the request button on the page.";
          await wait(350);
        }
        const st = form.fill({ name: args.name, phone: args.phone, comment: args.comment, system: args.system, count: args.count });
        const said = `name "${st.name}"${st.nameValid ? "" : " (missing or too short)"}, phone "${st.phone}"${st.phoneValid ? "" : " (incomplete: 11 digits needed)"}`;
        if (a.name === "fill_request_form") {
          return `The form is on the visitor's screen, filled in: ${said}. ${st.nameValid && st.phoneValid ? "Repeat the name and phone back and ask if they are correct; send only after a yes." : "Ask for what is missing."}`;
        }
        await wait(600);
        const res = await form.submit();
        if (res.ok) {
          shown.current = null;
          setTimeout(close, 4500);
          return "Sent. The visitor sees the confirmation. A manager will call back during working hours (Mon–Fri 9:00–17:00).";
        }
        if (res.reason === "send") return "The request could not be sent because of a technical error. Apologise and suggest calling the office.";
        if (res.reason === "consent") return "Not sent: the visitor unticked the consent box. Ask them to tick it.";
        return `Not sent: ${said}. Ask the visitor again for the ${res.reason === "name" ? "name" : "phone number"}.`;
      }
      if (a.name === "handoff_to_manager") {
        open({ kind: "consult", topic: a.args.summary });
        return "The consultation form is open.";
      }
      return "Unknown action.";
    },
    [lang, open, close, router, systems],
  );
}
