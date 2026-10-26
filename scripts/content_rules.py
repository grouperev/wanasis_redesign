"""Shared copy rulings for every content script (client decisions of 26 Oct 2026, open-questions.md).

Only these edits are allowed on crawled copy. Testimonials and quotes are never passed through ruled().
"""
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "content"
OUT = ROOT / "lib" / "content"


def ruled(text: str) -> str:
    # OQ-1 experience → +20 ans
    text = text.replace("De part sa longue expérience, de 17 ans", "De par sa longue expérience, de plus de 20 ans")
    # OQ-2 product name → Fusion ERP
    text = re.sub(r"\bWanaERP\b", "Fusion ERP", text)
    text = re.sub(r"\bWanasis ERP\b", "Fusion ERP", text)
    text = text.replace("Fusion ERP Fusion ERP", "Fusion ERP")
    # OQ-15 typos
    text = text.replace("De part sa", "De par sa").replace("Directuer", "Directeur")
    text = text.replace("Posted on", "Publié le")
    return text


def load(slug: str) -> dict:
    return json.loads((SRC / f"{slug}.json").read_text())


def paragraphs(body: str | None) -> list[str]:
    return [p.strip() for p in (body or "").split("\n") if p.strip()]


def write(name: str, data) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"{name}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
