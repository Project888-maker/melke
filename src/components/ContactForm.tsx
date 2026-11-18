"use client";
import { useRequest } from "./RequestProvider";
import { LeadForm } from "./LeadForm";

export function ContactForm() {
  const { ui, lang, systems, objects } = useRequest();
  return <LeadForm ui={ui} lang={lang} preset={{ kind: "consult" }} systems={systems} objects={objects} />;
}
