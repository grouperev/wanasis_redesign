import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import { frTypo } from "@/lib/format";
import type { Block } from "./posts";

/** "Label : text" -> bold label. Same shape the content script uses to recognise labelled items. */
const LABELLED = /^([A-ZÀ-ÖÉÈ][^.:!?,]{1,60}?\s?:)\s+(\S[\s\S]*)$/;

function Inline({ text }: { text: string }) {
  const m = LABELLED.exec(text);
  if (!m) return <>{frTypo(text)}</>;
  return (
    <>
      <strong className="font-semibold text-ink">{frTypo(m[1])}</strong> {frTypo(m[2])}
    </>
  );
}

function Blocks({ blocks, lead }: { blocks: Block[]; lead: boolean }) {
  const leadAt = lead ? blocks.findIndex((b) => b.type === "p") : -1;
  return (
    <>
      {blocks.map((b, i) => {
        const prev = blocks[i - 1]?.type;
        const afterHeading = prev === "h2" || prev === "h3";
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} className={`text-h2 ${i === 0 ? "" : "mt-16 lg:mt-20"}`}>
                {frTypo(b.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className={`text-h3 ${i === 0 ? "" : "mt-12"} ${prev === "h2" ? "!mt-8" : ""}`}>
                {frTypo(b.text)}
              </h3>
            );
          case "p": {
            const isLead = i === leadAt;
            return (
              <p key={i} className={`${afterHeading ? "mt-5" : i === 0 ? "" : "mt-6"} ${isLead ? "text-lead text-ink-2" : ""}`}>
                {isLead ? frTypo(b.text) : <Inline text={b.text} />}
              </p>
            );
          }
          case "ul":
            return (
              <ul key={i} className={`${afterHeading ? "mt-5" : "mt-6"} space-y-3`}>
                {b.items.map((it, k) => (
                  <li key={k} className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-[1px] before:bg-teal-ink">
                    {b.hrefs?.[k] ? (
                      <Link href={b.hrefs[k]} className="link">
                        {it}
                      </Link>
                    ) : (
                      <Inline text={it} />
                    )}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className={`${afterHeading ? "mt-5" : "mt-6"} list-decimal space-y-3 pl-6 marker:font-display marker:text-teal-ink`}>
                {b.items.map((it, k) => (
                  <li key={k} className="pl-2">
                    <Inline text={it} />
                  </li>
                ))}
              </ol>
            );
          case "img":
            return (
              <figure key={i} className="my-12">
                <Picture
                  src={b.src}
                  alt={b.alt}
                  sizes="(min-width: 768px) 720px, 100vw"
                  className="block"
                  imgClassName="h-auto w-full rounded-md bg-surface-2"
                />
              </figure>
            );
        }
      })}
    </>
  );
}

/**
 * Article body. The closing "À propos de Wanasis" / "Pour en savoir plus" blocks sit in a quiet panel
 * so the reading column ends on the conclusion.
 */
export function PostBody({ blocks }: { blocks: Block[] }) {
  const aboutAt = blocks.findIndex((b) => b.type === "h2" && b.text === "À propos de Wanasis");
  const moreAt = blocks.findIndex((b) => b.type === "p" && b.text.startsWith("Pour en savoir plus"));
  const split = aboutAt >= 0 ? aboutAt : moreAt;
  const main = split >= 0 ? blocks.slice(0, split) : blocks;
  const aside = split >= 0 ? blocks.slice(split) : [];
  return (
    <div className="measure mx-auto">
      <Blocks blocks={main} lead />
      {aside.length > 0 && (
        <aside className="mt-16 rounded-md bg-surface-2 p-6 sm:p-8 [&_h2]:text-h3 [&_p]:text-ink-2">
          <Blocks blocks={aside} lead={false} />
        </aside>
      )}
    </div>
  );
}
