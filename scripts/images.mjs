// Builds responsive AVIF/WebP derivatives into public/img and a manifest at lib/content/images.json.
// Sources are looked up by basename in assets/generated (preferred) then assets/source.
// Usage: node scripts/images.mjs            (idempotent — skips outputs that already exist)
import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/img");
const MANIFEST = path.join(ROOT, "lib/content/images.json");
const read = async (p) => JSON.parse(await readFile(path.join(ROOT, p), "utf8"));

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const index = new Map();
for (const dir of ["assets/source", "assets/generated"]) {
  for (const f of await walk(path.join(ROOT, dir))) index.set(path.basename(f), f); // generated wins
}

const fusion = await read("lib/content/fusion.json");
const home = await read("lib/content/home.json");
const posts = await read("lib/content/posts.json");
const clients = await read("lib/content/clients.json");

// name → widths. Logos stay small; photos get the full ladder.
const PHOTO = [640, 960, 1280, 1920];
const LOGO = [160, 320];
const jobs = new Map();
const add = (file, widths) => file && jobs.set(file, widths);

for (const f of new Set([...clients, ...home.clients.logos])) add(f, LOGO);
for (const p of posts) add(p.cover, [480, 960, 1280]);
for (const m of fusion.modules) add(m.photo, PHOTO);
for (const a of fusion.apps.items) add(a.photo, [480, 960]);
for (const f of (await read("lib/content/generated.json").catch(() => []))) add(f, PHOTO);
// Extra lists registered by page builders: lib/content/image-lists/<area>.json = [[file, [widths…]], …]
for (const f of await readdir(path.join(ROOT, "lib/content/image-lists")).catch(() => [])) {
  if (f.endsWith(".json")) for (const [file, widths] of await read(`lib/content/image-lists/${f}`)) add(file, widths);
}

const slug = (f) => f.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
const manifest = {};
await mkdir(OUT, { recursive: true });

for (const [file, ladder] of jobs) {
  const src = index.get(file);
  if (!src) {
    console.warn("missing source:", file);
    continue;
  }
  const img = sharp(src, { failOn: "none" });
  const meta = await img.metadata();
  const widths = [...new Set(ladder.map((w) => Math.min(w, meta.width)))];
  const name = slug(file);
  for (const w of widths) {
    for (const fmt of ["avif", "webp"]) {
      const dest = path.join(OUT, `${name}-${w}.${fmt}`);
      if (await stat(dest).catch(() => null)) continue;
      const pipe = sharp(src, { failOn: "none" }).resize({ width: w, withoutEnlargement: true });
      await (fmt === "avif" ? pipe.avif({ quality: 55, effort: 4 }) : pipe.webp({ quality: 78 })).toFile(dest);
    }
  }
  const lqip = await sharp(src, { failOn: "none" }).resize(16).webp({ quality: 40 }).toBuffer();
  manifest[file] = {
    name,
    width: meta.width,
    height: meta.height,
    widths,
    lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
  };
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`images: ${Object.keys(manifest).length} sources → public/img`);
