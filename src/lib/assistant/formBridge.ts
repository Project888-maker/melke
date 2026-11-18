/**
 * A thin bridge between the request form and Draft. The form that is on screen
 * registers itself here; the assistant can then fill it in for the visitor and
 * send it once the visitor has confirmed the details. The newest form wins,
 * so the modal takes precedence over a form that is part of the page.
 */
export type FormFill = { name?: string; phone?: string; comment?: string; system?: string; count?: number };
export type FormState = { name: string; phone: string; phoneValid: boolean; nameValid: boolean };
export type SubmitResult = { ok: true } | { ok: false; reason: "name" | "phone" | "consent" | "send" };
export type FormApi = { modal: boolean; fill: (f: FormFill) => FormState; submit: () => Promise<SubmitResult>; state: () => FormState };

const stack: FormApi[] = [];

export function registerForm(api: FormApi) {
  stack.push(api);
  return () => {
    const i = stack.indexOf(api);
    if (i >= 0) stack.splice(i, 1);
  };
}

export const currentForm = (): FormApi | null => stack[stack.length - 1] ?? null;
