"""Replace the flat chroma-green phone screens of the A-* shots with a petrol→teal screen.
Run after scripts/finalize-generated.py (which re-exports the chosen candidates)."""
import pathlib
import numpy as np
from PIL import Image, ImageFilter

GEN = pathlib.Path(__file__).resolve().parent.parent / "assets/generated"
for slug, v in [("a-view", "a"), ("a-link", "a"), ("a-pick", "a"), ("a-ship", "b")]:
    im = Image.open(GEN / "_candidates" / f"{slug}-{v}.png").convert("RGB")
    a = np.asarray(im).astype(np.int16)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mask = ((g > 150) & (g - r > 70) & (g - b > 70)).astype(np.uint8) * 255
    m = Image.fromarray(mask).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(1.2))
    ys, _ = np.nonzero(mask)
    h, w = im.size[1], im.size[0]
    t = np.clip((np.arange(h) - ys.min()) / max(1, ys.max() - ys.min()), 0, 1)[:, None, None]
    teal, depth = np.array([14, 118, 128]), np.array([0, 50, 75])
    fill = np.broadcast_to(teal * (1 - t) * 0.5 + depth * (1 - (1 - t) * 0.5), (h, w, 3)).astype(np.uint8)
    Image.composite(Image.fromarray(fill), im, m).save(GEN / f"{slug}.webp", quality=86)
    print(slug, "keyed")
