"""Builds lib/content/*.json from the verbatim crawl in content/*.json.

Only these edits are applied to the copy (client rulings of 26 Oct 2026, see open-questions.md):
  - OQ-1  experience: "17 ans" → "plus de 20 ans"
  - OQ-2  product name: WanaERP / Wanasis ERP → Fusion ERP (never inside testimonials)
  - OQ-15 typos: "De part sa" → "De par sa", "Directuer" → "Directeur"
Run: python3 scripts/build-content.py
"""
import json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "content"
OUT = ROOT / "lib" / "content"


def ruled(text: str) -> str:
    text = text.replace("De part sa longue expérience, de 17 ans", "De par sa longue expérience, de plus de 20 ans")
    text = re.sub(r"\bWanaERP\b", "Fusion ERP", text)
    text = re.sub(r"\bWanasis ERP\b", "Fusion ERP", text)
    text = text.replace("Fusion ERP Fusion ERP", "Fusion ERP")
    return text


def load(slug):
    return json.loads((SRC / f"{slug}.json").read_text())


def paragraphs(body: str):
    return [p.strip() for p in body.split("\n") if p.strip()]


# ---------- Fusion ERP ----------
fusion = load("wanasis-fusion-erp-modules")
hero_body = paragraphs(fusion["sections"][0]["body"])
# hero_body: [0] "Vous êtes unique," [1] tagline [2] intro [3] "Une Solution Complète…" + module paragraphs…
intro = ruled(hero_body[2])
complete = hero_body[3]
assert complete.startswith("Une Solution Complète et Modulaire")
module_paras = [ruled(p) for p in hero_body[4:]]
assert len(module_paras) == 13, len(module_paras)
# Page order of paragraphs: CRM, Vente, SAV, Trésorerie, Comptabilité, Production, MRP, Maintenance,
# Importation, Achat, Logistique, Gestion des coûts, MRP (duplicate — dropped).
assert module_paras[6] == module_paras[12]
para = dict(zip(
    ["crm", "vente", "sav", "tresorerie", "comptabilite", "production", "mrp", "maintenance",
     "importation", "achat", "logistique", "gestion-des-couts"], module_paras[:12]))

# (slug, name, family, original tile color from erp-modules.png, source photo)
MODULES = [
    ("crm", "CRM", "commercial", "#E46C0A", "erp-module-crm.jpg"),
    ("vente", "Vente", "commercial", "#FFC000", "erp-module-vente.jpg"),
    ("sav", "SAV", "commercial", "#D99694", "erp-module-SAV.jpg"),
    ("appels-d-offre", "Appels d’offre", "commercial", "#376092", None),
    ("distribution", "Distribution", "commercial", "#93CDDD", None),
    ("e-commerce", "E-Commerce", "commercial", "#4F6228", None),
    ("comptabilite", "Comptabilité", "finance", "#604A7B", "erp-module-compta.jpg"),
    ("tresorerie", "Trésorerie", "finance", None, "erp-module-tresorerie.jpg"),
    ("gestion-des-couts", "Gestion des coûts", "finance", "#948A54", "erp-module-gestion-cout.jpg"),
    ("immo", "Immo.", "finance", "#558ED5", None),
    ("production", "Production", "supply", "#77933C", "erp-module-production.jpg"),
    ("bom", "BOM", "supply", "#4A452A", "erp-module-BOM.jpg"),
    ("mrp", "MRP", "supply", "#9BBB59", "erp-module-MRP.jpg"),
    ("maintenance", "Maintenance", "supply", "#215968", "erp-module-maintenance.jpg"),
    ("achat", "Achat", "supply", "#002060", "erp-module-achat.jpg"),
    ("importation", "Importation", "supply", "#953735", "erp-module-importation.jpg"),
    ("logistique", "Logistique", "supply", "#31859C", "erp-module-logistique.jpg"),
    ("parc-roulant", "Parc roulant", "supply", "#7F7F7F", None),
    ("grh", "GRH", "rh", "#C4BD97", None),
    ("paie", "Paie", "rh", "#B3A2C7", None),
    ("projet", "Projet", "rh", "#376092", None),
    ("generateur-d-etats", "Générateur d’états", "rh", "#4BACC6", None),
    ("edi", "EDI", "digital", "#F79646", None),
    ("messaging", "Messaging", "digital", "#0D0D0D", None),
    ("web", "Web", "digital", "#7F7F7F", None),
    ("mobile", "Mobile", "digital", "#A6A6A6", None),
]

apps_section = next(s for s in fusion["sections"] if (s.get("heading") or "").startswith("Applications mobiles"))
app_paras = [p.replace(" En savoir plus", "") for p in paragraphs(apps_section["body"])]
APPS = [
    ("view", "View", "/mobile-view/", app_paras[0], "app-view-img.jpg"),
    ("link", "Link", "/mobile-link/", ruled(app_paras[1]), "app-link-img.jpg"),
    ("pick", "Pick", "/mobile-pick/", app_paras[2], "app-pick-img.jpg"),
    ("ship", "Ship", "/mobile-ship/", app_paras[3], "app-ship-img.jpg"),
]

fusion_out = {
    "hero": {"title": hero_body[0], "tagline": hero_body[1], "intro": intro},
    "complete": {
        "title": "Une Solution Complète et Modulaire",
        "body": complete.replace("Une Solution Complète et Modulaire", "", 1).strip(),
    },
    "brochure": fusion["sections"][0]["cta"][0],
    "families": [
        {"id": "commercial", "label": "Commercial"},
        {"id": "finance", "label": "Finance"},
        {"id": "supply", "label": "Production & Supply"},
        {"id": "rh", "label": "RH & Admin"},
        {"id": "digital", "label": "Digital & Mobile"},
    ],
    "modules": [
        {"slug": s, "name": n, "family": f, "chip": c, "photo": ph, "body": para.get(s)}
        for s, n, f, c, ph in MODULES
    ],
    "apps": {
        "title": apps_section["heading"],
        "items": [{"slug": s, "name": n, "href": h, "body": b, "photo": ph} for s, n, h, b, ph in APPS],
    },
}
fusion_out["brochure"]["url"] = "/demande-de-brochure/"

# ---------- Home ----------
home = load("index")
S = {i: s for i, s in enumerate(home["sections"])}
mission = paragraphs(S[2]["body"])
solutions = paragraphs(S[3]["body"])
testimonials_raw = paragraphs(S[5]["body"])
T = []
for quote, sig in zip(testimonials_raw[0::2], testimonials_raw[1::2]):
    sig = sig.replace("Directuer", "Directeur")
    T.append({"quote": quote, "signature": sig})
# Split signatures into name / role / company — verified against facts.md.
SIGS = [
    ("Mr. ZENATI Driss", "Directeur général", "Groupe Attiryak"),
    ("Mr. HACENE Rabeh", "PDG", "Biogalenic"),
    ("Mr. CHAMLAL Maamar", "PDG", "Chark Pharm"),
    ("Dr. BENCHIKH LEFGOUN Abdel Madjid", "Directeur Général", "Clinique Avicenne"),
]
for t, (n, r, c) in zip(T, SIGS):
    assert t["signature"] == f"{n} {r} {c}", t["signature"]
    t.update(name=n, role=r, company=c)
    del t["signature"]

stats_lines = paragraphs(S[4]["body"])
home_out = {
    "hero": {"title": S[0]["heading"], "sub": S[1]["heading"]},
    "mission": {"title": S[2]["heading"], "body": mission},
    "solutions": {
        "title": "Nos Solutions ERP et HIS",
        "fusion": ruled(solutions[0].replace(" En savoir plus", "")),
        "life": solutions[1].replace(" En savoir plus", ""),
    },
    "stats": {
        "title": S[4]["heading"],
        "items": [{"value": v, "label": l} for v, l in zip(stats_lines[0::2], stats_lines[1::2])],
    },
    "testimonials": {"title": S[5]["heading"], "items": T},
    "clients": {"title": S[6]["heading"], "logos": [i["src"].split("/")[-1] for i in S[6]["images"]]},
    "news": {"title": S[7]["heading"]},
}

# ---------- Posts ----------
META = json.loads((ROOT / "docs/redesign/crawl/meta.json").read_text())
# Post covers live on the listing pages' news-grid cards, keyed by title.
covers = {}
for listing in ["index", "actualites"]:
    for s in load(listing)["sections"]:
        if s.get("type") == "news-grid" and s.get("images"):
            covers[s["heading"]] = s["images"][0]["src"].split("/")[-1]
posts = []
for f in sorted(SRC.glob("*.json")):
    d = json.loads(f.read_text())
    if f.stem in ("index", "actualites", "article", "news"):
        continue
    if d.get("date") and d.get("author"):
        posts.append({
            "slug": f.stem, "route": d["route"], "title": d["title"], "date": d["date"],
            "author": d["author"], "category": d.get("category"),
            "excerpt": (d.get("meta_description") or "")[:200],
            "cover": covers.get(d["title"]) or (META.get(d["route"], {}).get("og", {}).get("og:image") or "").split("/")[-1] or None,
        })
# Real event photography stays; every other post gets its own generated cover (no repeats, no stock/AI slop).
REAL_COVERS = {
    "retour-sur-le-salon-amtex-oran-2026-et-nos-rencontres-btob": "WANASIS-AMTEX.jpeg",
    "evexia-choisit-notre-solution-erp-pour-piloter-sa-croissance": "Evexia-ERP.jpg",
}
for post in posts:
    if post["slug"] in REAL_COVERS:
        post["cover"] = REAL_COVERS[post["slug"]]
    elif (ROOT / "assets/generated" / f"n-{post['slug']}.webp").exists():
        post["cover"] = f"n-{post['slug']}.webp"
for post in posts:
    if post["cover"]:
        post["cover"] = re.sub(r"-\d+x\d+(\.\w+)$", r"\1", post["cover"])
posts.sort(key=lambda p: p["date"], reverse=True)

# ---------- Clients ----------
ref = load("reference")
clients = sorted({i["src"].split("/")[-1] for s in ref["sections"] for i in s.get("images", [])})

OUT.mkdir(parents=True, exist_ok=True)
for name, data in [("fusion", fusion_out), ("home", home_out), ("posts", posts), ("clients", clients)]:
    (OUT / f"{name}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
print("fusion modules", len(fusion_out["modules"]), "| testimonials", len(T), "| posts", len(posts), "| client logos", len(clients))
