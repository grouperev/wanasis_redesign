import { PhotoHero } from "@/components/ui/PhotoHero";
import { Form } from "@/components/forms/Form";
import { pageMetadata } from "@/components/news/meta";
import content from "@/lib/content/contact.json";
import { frTypo } from "@/lib/format";
import { SITE } from "@/lib/site";

const c = content.contact;
export const metadata = pageMetadata({ title: c.meta.title, route: c.meta.route, description: c.meta.description });

const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;

export default function ContactPage() {
  return (
    <>
      <PhotoHero shot="CT" label="CT · accueil des bureaux">
        <h1 data-reveal className="font-display text-h1">
          {frTypo(c.h1)}
        </h1>
      </PhotoHero>

      <section className="container-x grid gap-16 pb-[var(--section-y)] pt-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Form id="contact" labels={c.labels} submit={c.submit} />
        </div>

        <aside aria-labelledby="coordonnees" className="lg:col-span-4 lg:col-start-9">
          <div className="rounded-md bg-surface-2 p-6 sm:p-8">
            <h2 id="coordonnees" className="text-h3">
              {frTypo(c.coordinates)}
            </h2>
            <address className="mt-6 space-y-5 not-italic">
              <p>{SITE.address}</p>
              <p>
                {SITE.phones.map((p) => (
                  <a key={p} href={tel(p)} className="block py-1 hover:text-teal-ink">
                    {p}
                  </a>
                ))}
              </p>
              <p>
                <a href={`mailto:${SITE.email}`} className="link">
                  {SITE.email}
                </a>
              </p>
              <p className="text-ink-2">{SITE.hours}</p>
            </address>
            <ul className="mt-6 flex gap-6 border-t border-hairline pt-6">
              <li>
                <a href={SITE.social.facebook} rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-teal-ink">
                  Facebook
                </a>
              </li>
              <li>
                <a href={SITE.social.linkedin} rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-teal-ink">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
