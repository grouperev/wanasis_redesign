import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { duration, ease, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const SELECTOR = "[data-reveal]:not([data-motion-done]), [data-scramble]:not([data-motion-done])";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SCRAMBLE_DURATION = 0.7;

/**
 * Attribute-driven motion, the engine behind MotionRoot (lazy-loaded, so pages without these attributes ship none of it).
 *  - [data-reveal]   word-by-word reveal (SplitText words, opacity .2 -> 1 and y .4em -> 0, ~0.8s total).
 *                    On h1 it plays at once; on any other element it plays once on scroll-in.
 *  - [data-scramble] dual-scramble (teal pass, then resolves to the inherited text color) once on scroll-in.
 * Text is always in the SSR HTML. Under prefers-reduced-motion this is a no-op.
 */
export function createMotion() {
  const done: HTMLElement[] = [];
  const restore: Array<() => void> = [];
  const ctx = gsap.context(() => {});

  function reveal(el: HTMLElement) {
    const run = () => {
      const split = SplitText.create(el, { type: "words", aria: "auto" });
      const words = split.words;
      if (!words.length) {
        el.setAttribute("data-revealed", "");
        return;
      }
      restore.push(() => split.revert());
      const d = Math.min(0.5, duration.reveal * 0.62);
      const step = words.length > 1 ? Math.min(0.12, (duration.reveal - d) / (words.length - 1)) : 0;
      gsap.set(words, { opacity: 0.2, y: "0.4em" });
      // The element itself returns to full opacity in the same frame the words take over the dimmed state.
      el.setAttribute("data-revealed", "");
      gsap.to(words, {
        opacity: 1,
        y: 0,
        duration: d,
        stagger: step,
        ease,
        clearProps: "transform,opacity",
        onComplete: () => split.revert(),
      });
    };
    if (el.tagName === "H1") run();
    else ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: run });
  }

  function scramble(el: HTMLElement) {
    const original = (el.textContent ?? "").trim();
    if (!original) return;
    const hideFromAT = el.getAttribute("aria-hidden") === "true";
    el.textContent = "";
    el.classList.add("mr-scr");
    if (!hideFromAT) {
      const sr = document.createElement("span");
      sr.className = "mr-sr";
      sr.textContent = original;
      el.appendChild(sr);
    }
    const spacer = document.createElement("span");
    spacer.className = "mr-scr-spacer";
    spacer.setAttribute("aria-hidden", "true");
    spacer.textContent = original;
    const layer = document.createElement("span");
    layer.className = "mr-scr-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.textContent = original;
    el.append(spacer, layer);
    restore.push(() => {
      el.classList.remove("mr-scr");
      el.textContent = original;
    });

    const random = original.replace(/\S/g, () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]);
    const letters = original.replace(/\s/g, "").length || 1;
    const play = () => {
      const tl = gsap.timeline({ onComplete: () => (layer.textContent = original) });
      tl.to(layer, {
        duration: SCRAMBLE_DURATION,
        ease: "none",
        scrambleText: { text: random, chars: SCRAMBLE_CHARS, speed: 1, revealDelay: 0.1, oldClass: "mr-scr-final", newClass: "mr-scr-accent" },
      });
      tl.to(
        layer,
        {
          duration: SCRAMBLE_DURATION,
          ease: "none",
          scrambleText: { text: original, chars: SCRAMBLE_CHARS, speed: 1, revealDelay: 0.1, oldClass: "mr-scr-accent", newClass: "mr-scr-final" },
        },
        SCRAMBLE_DURATION / letters,
      );
    };
    ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: play });
  }

  function scan(root: ParentNode = document) {
    if (prefersReducedMotion()) {
      // Final state, nothing to run: make sure a pre-hidden h1 is shown.
      root.querySelectorAll<HTMLElement>("h1[data-reveal]").forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR));
    if (!nodes.length) return;
    ctx.add(() => {
      nodes.forEach((el) => {
        el.setAttribute("data-motion-done", "");
        done.push(el);
        if (el.hasAttribute("data-reveal")) reveal(el);
        else scramble(el);
      });
    });
  }

  function destroy() {
    ctx.revert();
    restore.splice(0).forEach((fn) => fn());
    done.splice(0).forEach((el) => {
      el.removeAttribute("data-motion-done");
      if (el.hasAttribute("data-reveal")) el.setAttribute("data-revealed", "");
    });
  }

  return { scan, destroy };
}
