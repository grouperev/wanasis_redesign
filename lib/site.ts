// Site-wide copy and navigation. Labels and order are protected contracts (audit.md §4).
export const SITE = {
  name: "Wanasis Solutions",
  url: "https://wanasis.dz",
  tagline: "Ensemble, construisons l'avenir",
  email: "contact@wanasis.dz",
  address: "Cité El-hej Ahmed N°52 Sidi Mabrouk, Constantine",
  phones: ["+213 770 80 68 22", "+213 770 80 58 21", "+213 770 80 90 85"],
  hours: "Dim – Jeu : 8h00 – 17h00",
  social: {
    facebook: "https://www.facebook.com/people/Wanasis-Solutions/100051506447552/",
    linkedin: "https://www.linkedin.com/company/wanasis",
  },
} as const;

export type NavItem = { label: string; href: string; children?: { label: string; href: string; note?: string }[] };

export const NAV: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Société", href: "/erp-agerie-team/" },
  {
    label: "Solutions",
    href: "/wanasis-fusion-erp-modules/",
    children: [
      { label: "Fusion ERP", href: "/wanasis-fusion-erp-modules/", note: "Distribution et production pharmaceutique" },
      { label: "Life HIS", href: "/wanasis-life-his/", note: "Système d’information hospitalier" },
      { label: "Mobile View", href: "/mobile-view/" },
      { label: "Mobile Link", href: "/mobile-link/" },
      { label: "Mobile Pick", href: "/mobile-pick/" },
      { label: "Mobile Ship", href: "/mobile-ship/" },
    ],
  },
  { label: "Références", href: "/reference/" },
  { label: "Actualités", href: "/actualites/" },
  { label: "Contact", href: "/contact/" },
];

export const CTA = { label: "Nous contacter", href: "/contact/" } as const;
