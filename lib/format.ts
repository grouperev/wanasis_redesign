const fr = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Algiers" });

/** "9 février 2026" */
export const formatDate = (iso: string) => fr.format(new Date(iso));

/** First n sentences, for leads whose full text stays available in a disclosure. */
export function firstSentences(text: string, n: number): [string, string] {
  const parts = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text];
  const head = parts.slice(0, n).join("").trim();
  return [head, text.slice(head.length).trim()];
}

/** French typography: narrow no-break space before : ; ! ? and inside « ». */
export const frTypo = (s: string) =>
  s.replace(/\s+([:;!?»])/g, " $1").replace(/«\s+/g, "« ");
