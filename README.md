# Ognjen Badivuk — Developer Portfolio

A single-page portfolio built with **React 18 + Vite 5 + Tailwind CSS 3 + Framer Motion 11**,
with inertial smooth scrolling via **Lenis**. All content is transcribed from
`Ognjen_Badivuk_CV.pdf`.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173. `npm run build` produces a static `dist/` you can drop on
Netlify, Vercel, GitHub Pages or any static host; `npm run preview` serves that build locally.

> Node 18 is what's installed on this machine, so the stack is pinned to Vite 5 / Tailwind 3
> (Vite 7 and Tailwind 4 both require Node 20+). If you upgrade Node, those can be bumped.

## Where the content lives

**`src/data/resume.js` is the single source of truth.** Name, tagline, summary, stats,
experience bullets, projects, skills, education, certifications and nav links all come from
that one file — no copy is hard-coded in components. Edit it and every section updates.

One note on accuracy: the CV has no "Projects" section, so the six entries in `projects`
are **synthesised from the achievement bullets in your Experience section** (the scraping
framework, the validation layer, the REST integrations, the decorator transformation core,
the Laravel schema work and the regex ID parser). Metrics are the real numbers from the CV.
Rewrite or delete any that you'd rather not present as standalone projects.

## Images

The originals live in `src/img/` and are never served — they're 5448×3376 and 5–7 MB each.
`scripts/build-images.py` derives the optimized assets in `public/`:

| Output | Size | Used for |
| --- | --- | --- |
| `ognjen-portrait.webp` (1000²) | 122 KB | the circular hero disc |
| `ognjen-portrait-sm.webp` (520²) | 37 KB | same, small viewports |
| `ognjen-backdrop.webp` (2000w) | 82 KB | the faint hero parallax plate |
| `ognjen-backdrop-sm.webp` (1100w) | 32 KB | same, small viewports |

Regenerate after swapping a source photo:

```bash
python3 scripts/build-images.py
```

If you replace the cutout, re-derive the square crop window (`LEFT`, `TOP`, `SIDE` at the
top of the script) from the new alpha bounding box — the comment in the file explains how.
Both `<img>` tags fall back to a styled placeholder if a file is missing, so the layout
never collapses.

## Motion architecture

`src/lib/motion.js` holds the shared easing curves and variants. The signature curve is
expo-out `[0.16, 1, 0.3, 1]`; retime the whole site by editing that one file.

| Piece | What it does |
| --- | --- |
| `components/Background.jsx` | One canvas: a dot grid that swells near the cursor + drifting particles that draw constellation lines. DPR-aware, pauses on tab blur. |
| `components/CustomCursor.jsx` | Dot tracking 1:1 + ring lagging on a spring. Any element with `data-cursor="hover" / "view" / "text"` changes its shape. Auto-disabled on touch. |
| `components/ui/Magnetic.jsx` | `<Magnetic>` wrapper and `<MagneticButton>` — lean toward the cursor, inner content leads the shell. |
| `components/ui/TiltCard.jsx` | 3D tilt + cursor-tracking spotlight + animated conic glow border. |
| `components/ui/Reveal.jsx` | `<Reveal>` / `<Reveal stagger>` for scroll-triggered entrances. |
| `components/Portrait.jsx` | The circular disc: rotating conic accent ring, two counter-rotating orbits, halo pulse, continuous float, 3D tilt with inner parallax. |
| `components/HeroBackdrop.jsx` | The original photo as a blurred, green-duotoned, radially-feathered parallax plate. |
| `hooks/useSmoothScroll.js` | Lenis setup; exposes `window.__lenis` so nav links use `scrollTo` instead of fighting it. |

Everything honours `prefers-reduced-motion`: Lenis, the canvas loop, the preloader, the tilt
and the float all switch off, and `index.css` collapses remaining transitions.

## Two implementation notes worth knowing

**Why the hero name's gradient is per-character.** An element with `perspective`, or with a
3D transform, gets its own paint layer — and `background-clip: text` on an *ancestor* cannot
reach into it, so the word renders completely invisible. The gradient therefore lives on each
character span (`.char-gradient` in `index.css`), and the ramp is vertical: every glyph shares
the same line-box height, so a per-character vertical gradient is pixel-identical to a
per-word one. The 3D tip-up uses Framer's `transformPerspective` rather than a wrapper.

**Why the mobile menu doesn't use `body { overflow: hidden }`.** Body overflow propagates to
the viewport, and several browsers reset scroll position to 0 when it does — the page silently
jumps to the top when the menu closes. `Navbar.jsx` pauses Lenis instead, and only falls back
to `overflow` (capturing and restoring the offset by hand) when Lenis is off.

## The contact form

It's front-end only: it validates, then hands the message to the visitor's mail client via a
`mailto:` URL. To make it send server-side, replace the marked block in
`src/components/Contact.jsx` (`handleSubmit`) with a POST — e.g. Formspree:

```js
await fetch('https://formspree.io/f/<your-id>', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(form),
})
```

The `sending` → `sent` states are already wired, so only the network call changes.

## Palette

| Token | Hex | Tailwind |
| --- | --- | --- |
| Background | `#111613` | `bg-ink` |
| Card / surface | `#1B2420` | `bg-surface` |
| Accent | `#4E9F3D` | `text-accent`, `bg-accent` |
| Text primary | `#FFFFFF` | `text-white` |
| Text secondary / borders | `#A3C1AD` | `text-sage`, `border-sage/10` |

Defined in `tailwind.config.js` alongside `accent-soft` (`#6FBF5C`) and `accent-deep`
(`#2F6B24`), which are used for gradient ramps and glows.

## Structure

```
public/                    served assets (images, CV pdf)
scripts/build-images.py    regenerates the optimized images
src/
  data/resume.js           ← all content
  lib/motion.js            ← all easing + variants
  hooks/                   smooth scroll, touch detection, active section
  components/
    ui/                    Reveal, Magnetic, TiltCard, SectionHeading, Counter
    Background, CustomCursor, ScrollProgress, Preloader
    Navbar, Hero, HeroBackdrop, Portrait,
    About, Experience, Projects, Skills, Contact, Footer
```
