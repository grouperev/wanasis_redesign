"""Builds lib/content/{life,societe,fusion-algerie,mobile}.json and image-lists/products.json
from the verbatim crawl in content/*.json (builder B, products + Société).

Edits applied beyond content_rules.ruled(): invisible zero-width spaces are removed, the trailing
"En savoir plus" / "LinkedIn" crawl artefacts are dropped, and a trailing ":" is removed from Life HIS
row titles (the colon only introduced a list that the page no longer shows as a list).
Run: python3 scripts/content-products.py
"""
import json
import re
import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from content_rules import ruled, load, paragraphs, write, ROOT, OUT  # noqa: E402

META = json.loads((ROOT / "docs/redesign/crawl/meta.json").read_text())
FUSION = json.loads((OUT / "fusion.json").read_text())
HOME = json.loads((OUT / "home.json").read_text())


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("​", " ")).strip()


def meta(route: str) -> dict:
    m = META[route]
    out = {"title": m["title"].replace("l\"", "l’"), "canonical": route}  # OQ-15 typo: l"Algérie
    if m.get("meta_description"):
        out["description"] = m["meta_description"]
    return out


# ---------------------------------------------------------------- Life HIS
life_src = load("wanasis-life-his")
hero = life_src["sections"][0]
ps = [clean(p) for p in paragraphs(hero["body"])]
assert len(ps) == 51, len(ps)

# Page order from index 3: heading, detail, heading, detail, ... (24 pairs). OQ-8 grouping (proposal).
MEDICAL = {3, 5, 7, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29}
# 37 (achats) and 41 (restauration) are not in the OQ-8 list; placed in Managérial, flagged in the report.
groups = {"medical": [], "managerial": []}
dropped = []
for k in range(3, len(ps), 2):
    title = ruled(ps[k]).rstrip(":").strip()
    raw_detail = ps[k + 1] if k + 1 < len(ps) else ""
    detail = ruled(raw_detail) if raw_detail else None
    # The crawl pastes Fusion ERP (CRM / Vente / SAV) text under three Life HIS blurbs. Not Life HIS copy: held back.
    if raw_detail and re.search(r"WanaERP|Wanasis ERP", raw_detail):
        dropped.append(k)
        detail = None
    groups["medical" if k in MEDICAL else "managerial"].append({"id": f"b{k}", "title": title, "detail": detail})

testimonial = next(t for t in HOME["testimonials"]["items"] if t["company"] == "Clinique Avicenne")

write("life", {
    "meta": meta("/wanasis-life-his/"),
    "hero": {"title": ruled(hero["heading"]), "lead": ruled(ps[0]), "intro": [ruled(ps[1]), ruled(ps[2])]},
    "groups": [
        {"id": "medical", "label": "Médical", "items": groups["medical"]},
        {"id": "managerial", "label": "Managérial", "items": groups["managerial"]},
    ],
    "testimonial": testimonial,
    "brochure": {"text": hero["cta"][0]["text"], "url": "/demande-de-brochure/"},
    "_held_back_blurbs": dropped,
})

# ---------------------------------------------------------------- Société
soc = load("erp-agerie-team")
S = soc["sections"]
by_head = {s["heading"]: s for s in S}
partner = next(s for s in S if s["heading"].startswith("Wanasis Solutions"))
LINKEDIN = {  # facts.md §8
    "amar": "https://www.linkedin.com/in/zemerliamarcherif/",
    "hamza": "https://www.linkedin.com/in/hamza-khanfouf",
    "redha": "https://www.linkedin.com/in/redha-rezkoun-a1a01633/",
}
# crawl layout: [name banner][title+bio banner] per person
people = [("amar", "Amar Cherif Zemerli", "Directeur général"),
          ("hamza", "Hamza Khanfouf", "Directeur de projet"),
          ("redha", "Redha Rezkoun", "Directeur technique et R&D")]
directors = []
for slug, name, title in people:
    assert name in by_head, name
    sec = by_head[title]
    bio = [p for p in paragraphs(sec["body"]) if p != "LinkedIn"]
    assert len(bio) == 1
    directors.append({"slug": slug, "name": name, "title": ruled(title), "bio": ruled(bio[0]),
                      "portrait": f"{slug}.jpg", "linkedin": LINKEDIN[slug]})

write("societe", {
    "meta": meta("/erp-agerie-team/"),
    "quote": S[0]["heading"],  # verbatim, never ruled (quote)
    "intro": soc["meta_description"],
    "echo": "ENSEMBLE",  # word prescribed by the W2 spec (site tagline "Ensemble, construisons l'avenir")
    "directors": directors,
    "partner": {"title": ruled(partner["heading"]), "paras": [ruled(p) for p in paragraphs(partner["body"])]},
})

# ---------------------------------------------------------------- /erp-algerie-fusion/
alg = load("erp-algerie-fusion")
h = alg["sections"][0]
hp = paragraphs(h["body"])
write("fusion-algerie", {
    "meta": meta("/erp-algerie-fusion/"),
    "hero": {"title": ruled(h["heading"]), "lead": ruled(hp[0]),
             "body": ruled(hp[1].replace(" En savoir plus", ""))},
    "brochure": {"text": h["cta"][0]["text"], "url": "/demande-de-brochure/"},
    "apps": {"title": alg["sections"][1]["heading"], "items": FUSION["apps"]["items"]},
})

# ---------------------------------------------------------------- Mobile apps
mobile = {}
NAMES = {"view": "View", "link": "Link", "pick": "Pick", "ship": "Ship"}
for slug, name in NAMES.items():
    src = load(f"mobile-{slug}")
    route = f"/mobile-{slug}/"
    app = next(a for a in FUSION["apps"]["items"] if a["slug"] == slug)
    page = {"slug": slug, "name": name, "meta": meta(route), "back": "/wanasis-fusion-erp-modules/#apps-mobiles"}
    secs = src["sections"]
    if not secs:
        # OQ-12: no page copy in the crawl. The app paragraph from the Fusion page is real, shipped copy.
        page.update({"h1": f"Mobile {name}", "lead": None, "blocks": [], "fallback": app["body"]})
    elif slug == "view":
        page.update({"h1": ruled(secs[0]["heading"]), "lead": None, "fallback": None,
                     "blocks": [{"heading": ruled(s["heading"]), "body": ruled(s["body"])} for s in secs[1:]]})
    else:  # link
        h0 = paragraphs(secs[0]["body"])
        s1 = paragraphs(secs[1]["body"])
        page.update({"h1": ruled(secs[0]["heading"]), "lead": ruled(h0[0]), "fallback": None,
                     "leadList": [ruled(x) for x in h0[1:]],
                     "blocks": [{"heading": ruled(secs[1]["heading"]), "body": ruled(s1[0]),
                                 "list": [ruled(x) for x in s1[1:]]}]})
    mobile[slug] = page
write("mobile", mobile)

# ---------------------------------------------------------------- images
(OUT / "image-lists").mkdir(exist_ok=True)
(OUT / "image-lists" / "products.json").write_text(json.dumps(
    [["amar.jpg", [180]], ["hamza.jpg", [180]], ["redha.jpg", [180]],
     ["life-his.png", [160, 320]], ["fusion-erp.png", [160, 320]]], ensure_ascii=False) + "\n")
print("held back Life HIS details at blurb indexes:", dropped)
