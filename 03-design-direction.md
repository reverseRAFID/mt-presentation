# 03 — Design direction

## The problem to avoid

Two defaults are waiting to swallow this deck.

The first is the **mission-control HUD**: near-black background, one acid orange accent, tracked-out all-caps eyebrow labels, monospace everywhere, `01 / 02 / 03` numbering, telemetry-style chrome. Mongol-Tori's own website already does exactly this. Every student space team on earth does exactly this. Reproducing it makes a genuinely unusual story look generic.

The second is the **default AI deck**: warm cream ground, high-contrast serif display, terracotta accent, identical rounded cards with soft grey shadows.

Neither is used here.

Practical reason the dark HUD is also wrong: a fair projector in a lit room. Dark backgrounds wash to mud. This deck runs light-on-dark nowhere except slide 9.

## The direction: drawing sheet × jamdani

Two things in this story are visually specific and belong to nobody else.

**One:** the rover is a machined object with real dimensions, born as a CAD drawing. **Two:** its aluminium shell is etched with jamdani motifs — a Bengali handloom tradition whose geometry is built from discrete units plotted on a grid, worked on the diagonal.

Those are the same grid. A technical drawing sheet and a jamdani draft are both content plotted on a modular lattice. That coincidence is the whole design.

So: **every slide is a drawing sheet.** Visible construction grid, thin leader lines connecting labels to the things they label, a small title block in the lower corner carrying slide number and section. Dimension callouts are used where the content genuinely is a dimension — slide 4's specs, slide 8's 3.3 km range. Jamdani supplies the lattice geometry and one repeating motif used as the progress marker across the nine slides.

This is not decoration. Structural devices here encode real information: the grid is the measurement system, the leader lines point at actual parts, the motif fills as the talk advances.

## Tokens

### Colour — five values, all pulled from the subject

```
--muslin     #E4E2DC   jamdani cotton ground · slide background
--graphite   #22252A   drawing line and body text
--oxide      #A6432B   oxidised iron in Utah sandstone · the one accent
--indigo     #26355C   Bengali indigo · data marks, chart, motif
--aluminium  #8E9399   the rover's own material · rules, secondary type, grid
```

Notes for the builder:
- `--muslin` is deliberately cool and grey. Do not warm it toward cream.
- `--oxide` is deeper and browner than the terracotta that shows up in every generated deck. Do not lighten it.
- One accent only. `--oxide` marks the single most important thing on a slide and nothing else. If two things on a slide are oxide, one of them is wrong.
- `--indigo` carries data. The rank chart, the motif, numeric marks.
- Slide 9 inverts: full-bleed photograph, type in `--muslin` over it.

### Type

```
Display    Archivo          600 / 700, tight tracking
Body       IBM Plex Sans    400 / 500
Callouts   IBM Plex Mono    400 — dimension annotations ONLY
Bangla     Noto Serif Bengali — for মঙ্গল তরী on slide 3
```

IBM Plex has genuine engineering heritage and is not the default this kind of deck reaches for.

**The mono rule matters.** IBM Plex Mono appears only where the content is a measured value attached to a drawing — `50 kg`, `120×120×120 cm`, `3.3 km`, `7-DOF`. It never becomes a general small-label face. Monospace-as-label-styling is the exact tell this direction is avoiding.

Type scale, on a 1920×1080 frame, following a 1.5 ratio:

```
slide statement   88px / 0.95 / -0.02em    Archivo 700
slide heading     56px / 1.05 / -0.01em    Archivo 600
lead body         34px / 1.35              Plex Sans 400
list item         28px / 1.4               Plex Sans 400
dimension         22px / 1.2 / 0.02em      Plex Mono 400
title block       16px / 1.2               Plex Sans 500
```

Nothing below 22px. A projector and a standing audience are the constraint, not the design frame.

**Do not** accent a single word in a headline in a different colour or weight. **Do not** set labels in all caps. **Do not** put a typographic eyebrow above every heading — the title block already carries that information.

### Layout

12-column grid, 96px margins, 32px gutter. Content is left-aligned on the grid. Nothing centred except slide 1 and slide 9.

```
┌────────────────────────────────────────────────────┐
│ ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  │  grid dots, --aluminium @ 20%
│                                                    │
│   Slide statement runs to about                    │
│   two lines, never three                           │
│   ────────────────                                 │  --oxide rule, 1 unit wide
│                                                    │
│   ┌ ─ ─ ─ ─ ─ ─ ─ ┐        content ····· 50 kg     │  leader line + mono callout
│   │   drawing /   │        content ····· 7-DOF     │
│   │   photograph  │        content                 │
│   └ ─ ─ ─ ─ ─ ─ ─ ┘                                │
│                                                    │
│ ◈◈◈◇◇◇◇◇◇                          04 / SYSTEMS   │  motif progress + title block
└────────────────────────────────────────────────────┘
```

The progress motif in the lower left is a single jamdani unit repeated nine times, filling in `--indigo` as slides advance. It is the only persistent chrome besides the title block.

### Motion

**One orchestrated moment in the whole deck**, on slide 6: the rank line draws itself left to right over about 1.2 seconds, pauses on the 2024 point, then completes. That pause is the argument of the talk rendered as motion.

Everything else is a hard cut. No fade-and-slide-up on entering elements. No hover transitions. Respect `prefers-reduced-motion` by rendering slide 6's line complete.

### Where the boldness goes

Slide 9. Full-bleed macro photograph of the jamdani etching on the aluminium, no grid, no title block, no chrome at all — the only slide that breaks the drawing-sheet system. It reads as the drawing becoming the object. Everything else stays quiet so this lands.

## Build requirements

- React, 16:9, designed at 1920×1080 and scaled to the viewport. Never reflow the layout responsively mid-talk — scale it.
- Arrow keys / space to advance. `f` for fullscreen. `s` toggles presenter view.
- Presenter view shows: current slide, next slide, speaker notes from `01-slides.md`, elapsed time, and the per-slide budget from the timing table so the presenter can see if they are behind.
- Fonts bundled locally. No runtime network dependency — assume the venue wifi does not work.
- Body text contrast ratio ≥ 7:1 against `--muslin`.
- Visible keyboard focus on the QR link in slide 9.
- The whole thing must survive being opened cold on a stranger's laptop.
