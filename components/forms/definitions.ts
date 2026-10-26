// Field schemas shared by the client form and POST /api/forms (labels live in lib/content/contact.json).
// Field names are the contract: contact = nom, email, message, consentement; brochure = email, nom, telephone,
// societe, site_web, message, consentement.

export type FieldDef = {
  name: string;
  kind: "text" | "email" | "tel" | "url" | "textarea";
  required: boolean;
  max: number;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url";
};

export type FormId = "contact" | "brochure";

export const FORMS: Record<FormId, { path: string; label: string; fields: FieldDef[] }> = {
  contact: {
    path: "/contact/",
    label: "Contact",
    fields: [
      { name: "nom", kind: "text", required: true, max: 120, autoComplete: "name" },
      { name: "email", kind: "email", required: true, max: 254, autoComplete: "email", inputMode: "email" },
      { name: "message", kind: "textarea", required: true, max: 5000 },
    ],
  },
  brochure: {
    path: "/demande-de-brochure/",
    label: "Demande de brochure",
    fields: [
      { name: "email", kind: "email", required: true, max: 254, autoComplete: "email", inputMode: "email" },
      { name: "nom", kind: "text", required: false, max: 120, autoComplete: "name" },
      { name: "telephone", kind: "tel", required: false, max: 40, autoComplete: "tel", inputMode: "tel" },
      { name: "societe", kind: "text", required: true, max: 160, autoComplete: "organization" },
      { name: "site_web", kind: "text", required: false, max: 200, autoComplete: "url", inputMode: "url" },
      { name: "message", kind: "textarea", required: false, max: 5000 },
    ],
  },
};

export const HONEYPOT = "website2";
export const CONSENT = "consentement";
export const CONSENT_LABEL = "J’accepte que mes données soient utilisées pour traiter ma demande.";

// Form-state micro-labels.
export const MSG = {
  required: "Ce champ est obligatoire.",
  email: "Saisissez une adresse e-mail valide.",
  max: (n: number) => `Ce champ est trop long (${n} caractères maximum).`,
  consent: "Cochez cette case pour envoyer votre demande.",
  summary: "Veuillez corriger les champs signalés.",
  sending: "Envoi en cours…",
  success: "Merci, votre message a bien été envoyé.",
  error: "Votre message n’a pas pu être envoyé. Vous pouvez nous écrire directement à",
} as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns {fieldName: message}; empty object when valid. Used on both sides. */
export function validate(id: FormId, values: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of FORMS[id].fields) {
    const v = (values[f.name] ?? "").trim();
    if (f.required && !v) errors[f.name] = MSG.required;
    else if (v.length > f.max) errors[f.name] = MSG.max(f.max);
    else if (v && f.kind === "email" && !EMAIL.test(v)) errors[f.name] = MSG.email;
  }
  if (!values[CONSENT]) errors[CONSENT] = MSG.consent;
  return errors;
}
