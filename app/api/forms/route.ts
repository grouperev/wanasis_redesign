import { NextResponse } from "next/server";
import { CONSENT, FORMS, HONEYPOT, validate, type FormId } from "@/components/forms/definitions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 60_000;
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 6;
// Best-effort per-instance throttle (serverless instances don't share memory); the honeypot and
// validation do the rest. Put a WAF / Vercel Firewall rule in front for real abuse.
const hits = new Map<string, number[]>();

function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

async function readValues(req: Request): Promise<Record<string, string>> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await req.json()) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(body).map(([k, v]) => [k, typeof v === "string" ? v : ""]));
  }
  const fd = await req.formData();
  return Object.fromEntries([...fd.entries()].map(([k, v]) => [k, typeof v === "string" ? v : ""]));
}

export async function POST(req: Request) {
  const wantsJson = (req.headers.get("accept") ?? "").includes("application/json");
  const respond = (path: string | null, ok: boolean, status: number, body: Record<string, unknown>) => {
    if (wantsJson || !path) return NextResponse.json({ ok, ...body }, { status });
    // No-JS submission: send the visitor back to the page, which shows #envoye / #erreur via :target.
    return NextResponse.redirect(new URL(`${path}?${ok ? "envoye" : "erreur"}=1#${ok ? "envoye" : "erreur"}`, req.url), 303);
  };

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return respond(null, false, 413, { reason: "too_large" });

  let values: Record<string, string>;
  try {
    values = await readValues(req);
  } catch {
    return respond(null, false, 400, { reason: "invalid_body" });
  }

  const id = values.formulaire as FormId;
  if (!Object.hasOwn(FORMS, id)) return respond(null, false, 400, { reason: "unknown_form" });
  const def = FORMS[id];

  // Bots fill the hidden field: answer as if it worked, send nothing.
  if (values[HONEYPOT]) return respond(def.path, true, 200, {});

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) return respond(def.path, false, 429, { reason: "rate_limited" });

  const errors = validate(id, values);
  if (Object.keys(errors).length) return respond(def.path, false, 400, { errors });

  const key = process.env.RESEND_API_KEY;
  if (!key) return respond(def.path, false, 503, { reason: "not_configured" });

  const lines = [...def.fields.map((f) => `${f.name}: ${(values[f.name] ?? "").trim()}`), `${CONSENT}: oui`];
  const who = oneLine(values.nom || values.societe || values.email);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.FORMS_FROM || "Wanasis <noreply@wanasis.dz>",
        to: [process.env.FORMS_TO || "contact@wanasis.dz"],
        reply_to: oneLine(values.email),
        subject: oneLine(`[wanasis.dz] ${def.label} — ${who}`).slice(0, 200),
        text: lines.join("\n\n"),
      }),
    });
    if (!res.ok) return respond(def.path, false, 502, { reason: "send_failed" });
  } catch {
    return respond(def.path, false, 502, { reason: "send_failed" });
  }
  return respond(def.path, true, 200, {});
}
