# BRACU Mongol-Tori · EMK Center STEM fair deck

A fourteen-slide presentation built as a React site, running about seven and a half
minutes. Every word lives in `src/content/deck.ts` and every number in
`src/content/facts.ts` — nothing goes on a slide that is not in those two files.

The arc: cover · who we are · the machine · why you need a benchmark · why URC ·
the four missions, one slide each · eight seasons · outreach · partners ·
what went wrong · close.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

For the venue laptop, build once and serve the static files. No network is needed after that:
fonts and images are bundled.

```bash
npm run build
npm run preview      # serves dist/ at http://localhost:4173
```

`dist/` can also be copied to any static host or served with `npx serve dist`.
It cannot be opened straight from `file://` because the browser blocks module scripts there.

## Keys

| Key | Does |
|---|---|
| `→` `Space` `Enter` `PageDown` | next slide |
| `←` `Backspace` `PageUp` | previous slide |
| `1` – `9`, or two digits (`1``2`) | jump to a slide |
| `f` | fullscreen |
| `s` | presenter panel: script, notes, clock, per-slide budget, next slide |
| `t` / `r` | start / reset the clock (it also starts on the first advance) |

Clicking the right three quarters of the slide advances, the left quarter goes back.
The slide number lives in the URL hash, so a reload lands on the same slide.

## Before the event

- **Drop in the missing photographs.** Any slide still showing a dashed box names the exact
  file it wants — save it into `public/img` under that name, then flip the slide over:
  the four mission slides take a `photoReady` prop (`<Mission id="science" photoReady />`),
  and slide 13 has a `READY` map at the top of `src/slides/S13Struggle.tsx`.
- **Set the join link.** `JOIN_URL` in `src/content/deck.ts` feeds the QR code on the last slide.
  Test that it scans from six metres.
- Open the deck on the actual laptop once. If the machine has no WebGL, the 3D rover is replaced
  by a 2D one automatically. If the machine is slow, open `?static` (e.g. `http://localhost:4173/?static#1`)
  to switch every animation off.

## How it is built

- Vite + React + TypeScript. Fixed 1920×1080 sheet scaled to the window, never reflowed.
- `motion` for the slide reveals, the flipping finalist board on slide 5, and the one
  orchestrated chart on slide 10.
- `three` + `@react-three/fiber` for the rover, which is also the progress bar: it parks at
  station `i` of the mission map drawn along the foot of every slide and drives to the next
  one when you advance. `src/rover/terrain.ts` is the map, `src/rover/motion.ts` the single
  motion engine, and `RoverCanvas.tsx` (3D) and `RoverSvg.tsx` (2D fallback) render the same
  frames. Content below about y=870 will be driven over — keep slides clear of the strip.
- Colours are the two logo inks (`#E82727`, `#FC9D2D`) and their tints on warm white; the text
  ink is the red shaded down. Tokens are in `src/styles/global.css`.
- Fonts: Archivo, IBM Plex Sans, IBM Plex Mono, Noto Serif Bengali, bundled via `@fontsource`.
- Images are optimised copies of `../img` in `public/img`.

## Partner logos

Logos arrive in `../img/partners/` as SVGs on a square 1080×1080 canvas with the mark floating in the
middle. Run

```sh
node scripts/crop-logos.mjs
```

(needs ImageMagick's `convert`) to crop each one to its artwork and write it to `public/img/partners/`
under a clean slug — three of the "myactuator copy" files are really K-Silver, Prolink and Logitech and are
renamed inside the script. Then list the slug in `src/content/facts.ts`: `PARTNERS` for a tile with an
outcome line, `SPONSORS` for the belt along the foot of slide 12. Brand colours are left as supplied.
