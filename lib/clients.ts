// Readable client names from logo filenames, for alt text. Draft — to be confirmed with the client list.
const OVERRIDES: Record<string, string> = {
  globaldistrimed: "Global Distri Med",
  "bnm-parapharm": "BNM Parapharm",
  "chark-pharm": "Chark Pharm",
  "chark-cos": "Chark Cos",
  "bcd-pharma": "BCD Pharma",
  "minou-pharm": "Minou Pharm",
  "umc-lab": "UMC Lab",
  "aqua-medic": "Aqua Medic",
  "el-thika": "El Thika",
};

export function clientName(file: string) {
  const key = file.replace(/\.[^.]+$/, "").replace(/[_\s]+/g, "-").replace(/-\d+$/, "").replace(/^logo-/, "").replace(/-logo$/, "").toLowerCase();
  if (OVERRIDES[key]) return OVERRIDES[key];
  return key.length <= 4 ? key.toUpperCase() : key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Background-removed logos that came out clean (reviewed on assets/generated/logos/_sheet.jpg).
// The others keep their original tile until the client supplies vector logos (OQ-17).
const CLEAN = new Set(
  "aadl abpharmaceutical acsmed amdp aqua-medic attiryak aylan bcd-pharma bcos biomest chark-pharm commune-alger cpm cvm el-thika esthelab evexia-logo gpsk6 ibn_zohr ilys innova-parapharm jsm logo-arab logo-bnsd2 logo-genis-1 logo-mondo3 logo-setifmedic-2 mbn medicalsys mima-pharm minou-pharm pharmeline-logo physiopharm slimane-pharm tarros umc-lab veno-pharm2 yazan yougara zenith".split(" "),
);

/** The file to render for a client logo: the clean transparent cut-out when one exists, else the original. */
export function logoFile(file: string) {
  const stem = file.replace(/\.[^.]+$/, "");
  return CLEAN.has(stem) ? `${stem}.png` : file;
}
