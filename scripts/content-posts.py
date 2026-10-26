"""Builds lib/content/{posts-full,reference,contact}.json and image-lists/{news,reference}.json (builder C).

The crawl keeps post bodies as flat text (bold/list markup is gone), so block types are recovered from the shape
of each line. Words are never rewritten: the only edits are whitespace artefacts left by stripped inline markup
(" ," -> ","), the leading "- " / "N." markers of list items, and the content_rules.ruled() rulings.
Run: python3 scripts/content-posts.py
"""
import json
import re

from content_rules import OUT, ROOT, load, paragraphs, ruled, write

META = json.loads((ROOT / "docs/redesign/crawl/meta.json").read_text())
POSTS = json.loads((OUT / "posts.json").read_text())

TERMINAL = tuple(".;,!)»”…?")
HEAD_TERM = tuple(".;,!»”…")
NUM = re.compile(r"^(\d+)\.\s+\S")
LET = re.compile(r"^([a-e])\.\s+\S")
LABEL = re.compile(r"^[A-ZÀ-ÖÉÈ«“\"(][^.:!?,]{1,60}?\s?:\s+\S")
CLOSER = re.compile(r"^(Cela|Cette|Ces|Ceci|Une fois|Les tests|Ainsi|Dans cette|C’est|Pour |Enfin|Cependant|Il est|En conclusion)")
ABOUT = "À propos de Wanasis Wanasis est"
LINKS = {"Wanasis Fusion": "/wanasis-fusion-erp-modules/", "Wanasis Life HIS": "/wanasis-life-his/"}

# Inline headings glued to their paragraph in the crawl: slug -> list of headings (each is a prefix of a line).
GLUED = {
    "pervasive-bi-strategies-de-bi-propulsees-par-erp": [
        "Centralisation et Consolidation des Données",
        "Accès en Temps Réel ou Quasi-Réel aux Données",
        "Distribution des Données à Tous les Niveaux de l’Entreprise",
        "Autonomisation par le BI en Libre-Service",
        "Scalabilité et Flexibilité",
        "Efficacité Opérationnelle et Alignement Stratégique",
    ],
    "garantir-la-conformite-comptable-en-algerie-grace-a-un-erp": ["3. Centralisation et traçabilité des données"],
}
FORCE_HEADING = {"Cas d’Usage : L’Approche Agile chez un Distributeur de Produits Pharmaceutiques"}
INLINE_NUM_H2 = {"les-etapes-cles-dun-projet-erp-reussi"}
LEVEL_OVERRIDE = {("les-etapes-cles-dun-projet-erp-reussi", "Contexte"): "h3", ("les-etapes-cles-dun-projet-erp-reussi", "Approche"): "h3"}
HIS = "limportance-de-lintegration-des-erp-au-systeme-dinformation-hospitalier-his"


def clean(t: str) -> str:
    t = ruled(t)
    t = re.sub(r"\s+([,.])", r"\1", t)
    t = re.sub(r"(?<=[dDlLjJnNsScCmMtT])’\s+(?=\w)", "’", t)
    return re.sub(r"[ \t]{2,}", " ", t).strip()


def is_heading(l: str) -> bool:
    if not l or len(l) > 100 or l[0].islower() or l.endswith(HEAD_TERM) or not l[0].isalnum() or LABEL.match(l):
        return False
    if l.endswith("?") and len(l) > 100:
        return False
    if l.endswith(":"):
        return len(l) <= 69 and l.endswith(" :")
    return True


def is_numbered_heading(l: str) -> bool:
    return bool((NUM.match(l) or LET.match(l)) and len(l) <= 100 and not l.endswith((".", ";", ",", "!")) and not LABEL.match(strip_marker(l)))


def strip_marker(l: str) -> str:
    l = re.sub(r"^[–-]\s+", "", l)
    return re.sub(r"^(\d+|[a-e])\.\s+", "", l)


class Ctx:
    def __init__(self, slug, has_sections):
        self.slug, self.has_sections, self.parent_open = slug, has_sections, False
        self.blocks = []


def heading_level(ctx: Ctx, text: str, inline: bool) -> str:
    if (ctx.slug, text) in LEVEL_OVERRIDE:
        return LEVEL_OVERRIDE[(ctx.slug, text)]
    if text == "Conclusion":
        return "h2"
    if re.match(r"^\d+\.\d+\.", text) or LET.match(text):
        return "h3"
    if NUM.match(text):
        if inline and ctx.slug in INLINE_NUM_H2:
            return "h2"
        return "h3" if ctx.parent_open else "h2"
    if inline and ctx.has_sections:
        return "h3"
    return "h2"


def emit_heading(ctx: Ctx, text: str, inline: bool, body_empty=False):
    lvl = heading_level(ctx, text, inline)
    ctx.blocks.append({"type": lvl, "text": text})
    if not NUM.match(text) and not LET.match(text) and lvl == "h2":
        ctx.parent_open = body_empty or text.startswith("Phase ") or (inline and not ctx.has_sections)


def flush_list(ctx: Ctx, lst):
    if not lst or not lst["items"]:
        return
    items = lst["items"]
    if any(i.endswith((",", ";")) for i in items):
        items = [i.rstrip(".,;").rstrip() for i in items]
    block = {"type": "ol" if lst["ordered"] else "ul", "items": items}
    if all(i in LINKS for i in items):
        block["hrefs"] = [LINKS[i] for i in items]
    ctx.blocks.append(block)


def parse_lines(ctx: Ctx, lines: list[str], heading: str | None = None):
    lst = None  # open list: {items, ordered, short_ok}
    glued = GLUED.get(ctx.slug, [])
    i = 0
    n = len(lines)

    def item_ok(l: str, nxt: str = "") -> bool:
        if not l[0].isalnum() and not re.match(r"^[–-]\s+\S", l) and l[0] not in "«“\"(":
            return False
        if lst and lst.get("dash"):
            return bool(re.match(r"^[–-]\s+\S", l))
        if is_numbered_heading(l) or l.startswith(ABOUT):
            return False
        if re.match(r"^[–-]\s+\S", l):
            return True
        if (NUM.match(l) or LET.match(l)) and len(l) > 100:
            return True
        if len(l) <= 70 and not l.endswith(TERMINAL + ("?", ":")):
            nxt_short = bool(nxt) and len(nxt) <= 70 and not nxt.endswith(TERMINAL + (":",))
            return bool(lst and (lst["short_ok"] or (not lst["items"] and nxt_short)))
        if CLOSER.match(l) and not LABEL.match(l):
            return False
        if l.endswith(TERMINAL):
            return len(l) <= (300 if LABEL.match(l) else 260)
        return False

    while i < n:
        l = lines[i]
        nxt = lines[i + 1] if i + 1 < n else ""
        if lst is not None:
            if item_ok(l, nxt):
                if not lst["items"]:
                    lst["short_ok"] = len(l) <= 70 and not l.endswith(TERMINAL)
                    lst["ordered"] = bool(NUM.match(l) or LET.match(l))
                    lst["dash"] = bool(re.match(r"^[–-]\s+\S", l))
                lst["items"].append(strip_marker(l))
                i += 1
                continue
            flush_list(ctx, lst)
            lst = None
        # glued inline headings
        hit = next((g for g in glued if l.startswith(g) and l != g), None)
        if hit:
            emit_heading(ctx, hit, True)
            lines[i] = l[len(hit):].strip()
            continue
        if l.startswith(ABOUT):
            ctx.blocks.append({"type": "h2", "text": "À propos de Wanasis"})
            ctx.blocks.append({"type": "p", "text": l[len("À propos de Wanasis "):]})
            i += 1
            continue
        if l in FORCE_HEADING or is_numbered_heading(l) or is_heading(l):
            emit_heading(ctx, l, True)
            if l.endswith(":") and not (NUM.match(l) or LET.match(l)):
                lst = {"items": [], "ordered": False, "short_ok": False}
            i += 1
            continue
        short_run = bool(i == 0 and (heading or "").startswith("Avantages") and len(l) <= 120 and l.endswith(".") and i + 2 < n
                         and all(len(x) <= 120 and x.endswith(".") for x in lines[i : i + 3]))
        starts_list = short_run or bool(re.match(r"^[–-]\s+\S", l)) or ((NUM.match(l) or LET.match(l)) and len(l) > 100)
        label_run = bool(LABEL.match(l) and l.endswith(TERMINAL) and len(l) <= 300 and nxt
                         and LABEL.match(nxt) and nxt.endswith(TERMINAL) and len(nxt) <= 300)
        if starts_list or label_run:
            lst = {"items": [strip_marker(l)], "ordered": bool(NUM.match(l) or LET.match(l)), "short_ok": False,
                   "dash": bool(re.match(r"^[–-]\s+\S", l))}
            i += 1
            continue
        ctx.blocks.append({"type": "p", "text": l})
        if l.endswith(":"):
            lst = {"items": [], "ordered": False, "short_ok": False}
        i += 1
    flush_list(ctx, lst)


def sections_for(slug: str, d: dict) -> list[dict]:
    secs = [dict(s) for s in d["sections"]]
    if slug == HIS:  # the crawl holds the article twice; keep one copy + the closing block
        first = secs[:6]
        lines = paragraphs(first[5]["body"])
        cut = next(k for k, ln in enumerate(lines) if ln.startswith("En conclusion"))
        first[5]["body"] = "\n".join(lines[: cut + 1])
        tail = paragraphs(secs[10]["body"])
        k = next(k for k, ln in enumerate(tail) if ln.startswith("À propos"))
        first.append({"heading": None, "body": "\n".join(tail[k:]), "images": []})
        return first
    return secs


def lead_of(blocks: list[dict]) -> str:
    p = next(b["text"] for b in blocks if b["type"] == "p")
    out = ""
    for s in re.findall(r"[^.!?]+[.!?]+(?:\s|$)", p) or [p]:
        if out and len(out) + len(s) > 210:
            break
        out += s
    return out.strip()


def build_post(p: dict) -> dict:
    slug = p["slug"]
    d = load(slug)
    secs = sections_for(slug, d)
    has_sections = any(s["heading"] for s in secs)
    ctx = Ctx(slug, has_sections)
    for s in secs:
        lines = [clean(x) for x in paragraphs(s["body"])]
        h = clean(s["heading"]) if s["heading"] else None
        if h:
            for g in GLUED.get(slug, []):
                if h.startswith(g) and h != g:
                    lines.insert(0, h[len(g):].strip())
                    h = g
            emit_heading(ctx, h, False, body_empty=not lines)
        start = len(ctx.blocks)
        parse_lines(ctx, lines, h)
        for im in s["images"]:
            blk = {"type": "img", "src": im["local"].split("/")[-1], "alt": im["alt"] or "", "w": im["w"], "h": im["h"]}
            # position inside the section is not in the crawl: after its first paragraph
            at = next((k + 1 for k in range(start, len(ctx.blocks)) if ctx.blocks[k]["type"] == "p"), len(ctx.blocks))
            ctx.blocks.insert(at, blk)
    m = META[p["route"]]
    return {
        "slug": slug,
        "route": p["route"],
        "title": ruled(p["title"]),
        "date": p["date"],
        "author": p["author"],
        "category": p["category"],
        "cover": p["cover"],
        "lead": lead_of(ctx.blocks),
        "description": m.get("meta_description"),
        "blocks": ctx.blocks,
    }


def page_meta(route: str) -> dict:
    m = META[route]
    return {"title": m["title"], "description": m.get("meta_description"), "route": route}


def main():
    posts = [build_post(p) for p in POSTS]
    assert len(posts) == 35
    body_imgs = sorted({b["src"] for p in posts for b in p["blocks"] if b["type"] == "img"})
    write("posts-full", {
        "perPage": 9,
        "pages": {
            "actualites": {**page_meta("/actualites/"), "h1": load("actualites")["title"]},
            "article": {**page_meta("/article/"), "h1": load("article")["sections"][0]["heading"]},
            "news": {**page_meta("/news/"), "h1": load("news")["sections"][0]["heading"]},
        },
        "posts": posts,
    })
    (OUT / "image-lists" / "news.json").write_text(
        json.dumps([[f, [640, 960, 1280]] for f in body_imgs], ensure_ascii=False, indent=2) + "\n")

    # Références
    ref = load("reference")
    logos = [im["local"].split("/")[-1] for s in ref["sections"] for im in s["images"]]
    assert len(logos) == 91 and set(logos) == set(json.loads((OUT / "clients.json").read_text()))
    write("reference", {
        "meta": page_meta("/reference/"),
        "h1": META["/reference/"]["h1"][0],
        "paragraphs": [ruled(x) for x in paragraphs(ref["sections"][0]["body"])],
        "logos": logos,
    })
    (OUT / "image-lists" / "reference.json").write_text(
        json.dumps([[f, [160, 320]] for f in logos], ensure_ascii=False, indent=2) + "\n")

    # Contact + brochure. Labels come from docs/redesign/stack.md; "sociéte" is corrected to "société".
    contact = load("contact")
    write("contact", {
        "contact": {
            "meta": page_meta("/contact/"),
            "h1": contact["sections"][0]["heading"],
            "coordinates": contact["sections"][1]["heading"],
            "labels": {"nom": "Votre nom *", "email": "Votre email *", "message": "Votre message *"},
            "submit": "Envoyer",
        },
        "brochure": {
            "meta": page_meta("/demande-de-brochure/"),
            "h1": META["/demande-de-brochure/"]["h1"][0],
            "labels": {
                "email": "Votre email *",
                "nom": "Votre nom",
                "telephone": "Votre téléphone",
                "societe": "Votre société *",
                "site_web": "Votre site web",
                "message": "Votre message",
            },
            "submit": "Envoyer",
        },
    })
    print("posts", len(posts), "body images", body_imgs, "logos", len(logos))


if __name__ == "__main__":
    main()
