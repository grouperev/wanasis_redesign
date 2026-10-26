export type FamilyId = "commercial" | "finance" | "supply" | "rh" | "digital";

export type Family = { id: FamilyId; label: string };

export type FusionModule = {
  slug: string;
  name: string;
  family: FamilyId;
  chip: string | null;
  photo: string | null;
  body: string | null;
};

/** Written out literally so Tailwind's scanner sees every class. */
export const FAMILY_BG: Record<FamilyId, string> = {
  commercial: "bg-fam-commercial",
  finance: "bg-fam-finance",
  supply: "bg-fam-supply",
  rh: "bg-fam-rh",
  digital: "bg-fam-digital",
};
