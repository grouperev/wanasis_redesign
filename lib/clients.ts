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
