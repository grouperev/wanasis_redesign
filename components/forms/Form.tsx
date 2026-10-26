"use client";

import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { SITE } from "@/lib/site";
import { CONSENT, CONSENT_LABEL, FORMS, HONEYPOT, MSG, validate, type FormId } from "./definitions";

type Status = "idle" | "sending" | "success" | "error";

const subscribe = () => () => {};
const input =
  "mt-2 block min-h-12 w-full rounded-xs border bg-surface px-4 py-3 text-ink placeholder:text-ink-2 hover:border-ink aria-[invalid=true]:border-action";

/**
 * Contact / brochure form. Works without JS (native validation + POST /api/forms + redirect to #envoye);
 * with JS it validates inline, announces errors, submits with fetch and shows the result in place.
 */
export function Form({ id, labels, submit }: { id: FormId; labels: Record<string, string>; submit: string }) {
  const def = FORMS[id];
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  function focusFirst(errs: Record<string, string>) {
    const name = [...def.fields.map((f) => f.name), CONSENT].find((n) => errs[n]);
    if (name) formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
    const errs = validate(id, values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus("idle");
      focusFirst(errs);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/forms/", { method: "POST", body: fd, headers: { Accept: "application/json" } });
      if (res.ok) {
        setStatus("success");
        requestAnimationFrame(() => resultRef.current?.focus());
        return;
      }
      if (res.status === 400) {
        const body = (await res.json().catch(() => null)) as { errors?: Record<string, string> } | null;
        if (body?.errors) {
          setErrors(body.errors);
          setStatus("idle");
          focusFirst(body.errors);
          return;
        }
      }
      throw new Error(String(res.status));
    } catch {
      setStatus("error");
      requestAnimationFrame(() => resultRef.current?.focus());
    }
  }

  if (status === "success") {
    return (
      <div ref={resultRef} role="status" tabIndex={-1} className="rounded-md bg-surface-2 p-6 text-lead outline-offset-4">
        {MSG.success}
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;
  return (
    <form ref={formRef} action="/api/forms/" method="post" noValidate={hydrated} onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="formulaire" value={id} />

      {/* Honeypot: off-screen, out of the tab order and the accessibility tree. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          {HONEYPOT}
          <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {/* Static, shown by :target after the no-JS redirect (/…?envoye=1#envoye). */}
      <p id="envoye" role="status" className="hidden rounded-md bg-surface-2 p-6 text-lead target:block">
        {MSG.success}
      </p>
      <p id="erreur" role="alert" className="hidden rounded-md border border-action p-6 target:block">
        {MSG.error} <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      {errorCount > 0 && (
        <p role="alert" className="rounded-md border border-action px-4 py-3 text-action">
          {MSG.summary}
        </p>
      )}

      {def.fields.map((f) => {
        const fid = `${id}-${f.name}`;
        const err = errors[f.name];
        const common = {
          id: fid,
          name: f.name,
          required: f.required,
          maxLength: f.max,
          autoComplete: f.autoComplete,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${fid}-err` : undefined,
          className: `${input} ${err ? "border-action" : "border-ink/30"}`,
        } as const;
        return (
          <div key={f.name}>
            <label htmlFor={fid} className="font-medium">
              {labels[f.name]}
            </label>
            {f.kind === "textarea" ? (
              <textarea {...common} rows={7} />
            ) : (
              <input {...common} type={f.kind === "url" ? "text" : f.kind} inputMode={f.inputMode} />
            )}
            {err && (
              <p id={`${fid}-err`} className="mt-2 text-small text-action">
                {err}
              </p>
            )}
          </div>
        );
      })}

      <div>
        <div className="flex items-start gap-3">
          <input
            id={`${id}-${CONSENT}`}
            type="checkbox"
            name={CONSENT}
            value="oui"
            required
            aria-invalid={errors[CONSENT] ? true : undefined}
            aria-describedby={errors[CONSENT] ? `${id}-${CONSENT}-err` : undefined}
            className="mt-1 size-5 shrink-0 accent-[var(--color-depth)]"
          />
          <label htmlFor={`${id}-${CONSENT}`}>{CONSENT_LABEL}</label>
        </div>
        {errors[CONSENT] && (
          <p id={`${id}-${CONSENT}-err`} className="mt-2 text-small text-action">
            {errors[CONSENT]}
          </p>
        )}
      </div>

      {status === "error" && (
        <div ref={resultRef} role="alert" tabIndex={-1} className="rounded-md border border-action p-4">
          {MSG.error} <a className="link" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {status === "sending" ? MSG.sending : ""}
      </p>

      <button type="submit" disabled={status === "sending"} className="btn btn-action disabled:opacity-70">
        {status === "sending" ? MSG.sending : submit}
      </button>
    </form>
  );
}
