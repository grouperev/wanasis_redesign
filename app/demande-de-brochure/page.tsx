import { Form } from "@/components/forms/Form";
import { pageMetadata } from "@/components/news/meta";
import content from "@/lib/content/contact.json";
import { frTypo } from "@/lib/format";

const b = content.brochure;
export const metadata = pageMetadata({ title: b.meta.title, route: b.meta.route, description: b.meta.description });

export default function BrochurePage() {
  return (
    <>
      <section className="brand-mesh-light bg-surface">
        <div className="container-x pb-6 pt-16 lg:pt-24">
          <h1 data-reveal className="font-display text-h1">
            {frTypo(b.h1)}
          </h1>
        </div>
      </section>
      <section className="container-x pb-[var(--section-y)] pt-10">
        <div className="max-w-2xl">
          <Form id="brochure" labels={b.labels} submit={b.submit} />
        </div>
      </section>
    </>
  );
}
