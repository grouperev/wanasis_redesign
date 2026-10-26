"""Promote chosen candidates (assets/generated/_candidates/<slug>-<v>.png) to assets/generated/<slug>.webp
and rewrite assets/generated/manifest.json + lib/content/generated.json. Choices are the orchestrator's."""
import json, pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
GEN = ROOT / "assets/generated"
PICKS = {
  # slug: (variant, shot, alt_fr, rejected-reason)
  "h2-fusion-hero": ("b", "H2", "Équipe projet échangeant devant un grand écran dans un bureau de Constantine", "a: sujets trop petits, pilier occupe la moitié du cadre"),
  "h3-societe-puzzle": ("b", "H3", "Mains assemblant les pièces d'un puzzle aux couleurs bleu marine, turquoise et rouge", "a: trop de pièces rouges"),
  "m-achat": ("b", "M-achat", "Acheteur tenant un dossier, réunion d'équipe en arrière-plan", "a: équivalent, cadrage moins net"),
  "m-bom": ("b", "M-bom", "Responsable de laboratoire pharmaceutique en blouse blanche", "a: équivalent"),
  "m-comptabilite": ("b", "M-comptabilite", "Comptable travaillant sur son ordinateur portable", "a: décor moins local"),
  "m-crm": ("b", "M-crm", "Équipe commerciale souriante dans un bureau lumineux", "a: équipe moins diverse"),
  "m-gestion-des-couts": ("a", "M-gestion-des-couts", "Deux collègues analysant des coûts sur une tablette", "b: équivalent, lumière plus plate"),
  "m-importation": ("b", "M-importation", "Conteneurs empilés sur un quai portuaire", "a: pas de grue, moins lisible"),
  "m-logistique": ("b", "M-logistique", "Magasinier rangeant des cartons dans un entrepôt", "a: équivalent"),
  "m-maintenance": ("b", "M-maintenance", "Technicien de maintenance inspectant une machine de production", "a: équivalent"),
  "m-mrp": ("a", "M-mrp", "Planificateurs consultant une tablette dans l'entrepôt", "b: cadrage plus serré"),
  "m-production": ("b", "M-production", "Équipe de production pharmaceutique en blouse au laboratoire", "a: équivalent"),
  "m-sav": ("b", "M-sav", "Conseiller service après-vente avec casque au bureau", "a: équivalent"),
  "m-tresorerie": ("b", "M-tresorerie", "Responsable trésorerie au téléphone, consultant un graphique", "a: décor sans repère local"),
  "m-vente": ("a", "M-vente", "Poignée de main entre un commercial et un client en pharmacie", "b: équivalent"),
  "a-view": ("a", "A-view", "Dirigeant tenant un smartphone dans une salle de réunion", "b: sujet centré"),
  "a-link": ("a", "A-link", "Pharmacienne d'officine tenant un smartphone", "b: sujet petit dans le cadre"),
  "a-pick": ("a", "A-pick", "Préparatrice de commandes tenant un smartphone dans l'allée de l'entrepôt", "b: sujet coupé à droite"),
  "a-ship": ("b", "A-ship", "Livreur tenant un smartphone devant sa camionnette", "a: téléphone trop petit, tenu bas"),
  "l1-reception": ("b", "L1", "Accueil d'une clinique, une hôtesse renseigne un patient", "a: équivalent, décor moins local"),
  "l2-nurse-station": ("b", "L2", "Infirmière consultant une tablette au poste de soins", "a: équivalent"),
  "l3-pharmacy-store": ("a", "L3", "Pharmacien hospitalier vérifiant les étagères de la réserve", "b: sujet en bord de cadre"),
  "t1-distribution-hub": ("a", "T1", "", "b: rayonnages jusqu'au centre"),
  "t2-production-line": ("a", "T2", "", "b: machine dans la moitié droite"),
  "t3-logistics-dock": ("a", "T3", "", "b: équivalent"),
  "t4-clinic-corridor": ("a", "T4", "", "b: équivalent"),
}

manifest = [m for m in json.loads((GEN / "manifest.json").read_text()) if m["slug"] not in PICKS]
listed = [m["slug"] + ".webp" for m in manifest]
for slug, (v, shot, alt, rej) in PICKS.items():
    src = GEN / "_candidates" / f"{slug}-{v}.png"
    out = GEN / f"{slug}.webp"
    im = Image.open(src).convert("RGB")
    im.save(out, quality=86)
    prompt = f"garden-gpt-image-2/prompt/{slug}-20261026.md"
    head = (ROOT / prompt).read_text().splitlines()[0] if (ROOT / prompt).exists() else ""
    manifest.append({
        "slug": slug, "file": f"assets/generated/{slug}.webp", "shot": shot,
        "source": head, "prompt_file": prompt, "mode": "B",
        "tool": "Magnific images_generate · Nano Banana 2.1 · 2k",
        "variant_chosen": v, "rejected": rej, "approved_by": "orchestrator",
        "alt_fr": alt, "size": list(im.size),
    })
    listed.append(f"{slug}.webp")
(GEN / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
(ROOT / "lib/content/generated.json").write_text(json.dumps(sorted(set(listed)), indent=2) + "\n")
print(len(manifest), "approved images")
