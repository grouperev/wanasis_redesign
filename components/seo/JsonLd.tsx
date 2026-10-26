import { SITE } from "@/lib/site";

/** Organization + the two products. Rendered once in the root layout. */
export function SiteJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/brand/wanasis-logo-640.webp`,
        email: SITE.email,
        telephone: SITE.phones[0],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Cité El-hej Ahmed N°52, Sidi Mabrouk",
          addressLocality: "Constantine",
          addressCountry: "DZ",
        },
        sameAs: [SITE.social.facebook, SITE.social.linkedin],
      },
      {
        "@type": "SoftwareApplication",
        name: "Fusion ERP",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `${SITE.url}/wanasis-fusion-erp-modules/`,
        publisher: { "@id": `${SITE.url}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        name: "Life HIS",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        url: `${SITE.url}/wanasis-life-his/`,
        publisher: { "@id": `${SITE.url}/#organization` },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />;
}
