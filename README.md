# BRACU Mongol-Tori — 5-minute deck (EMK Center / U.S. Embassy STEM fair)

Source package for building the React presentation. Read in this order:

| File | What it is | Who uses it |
|---|---|---|
| `00-brief.md` | Audience, goal, constraints, timing budget | You + Claude Code |
| `01-slides.md` | Slide-by-slide content and the spoken script | Claude Code (this is the content of record) |
| `02-facts.md` | Every number with its source and confidence level | Claude Code — **do not invent figures outside this file** |
| `03-design-direction.md` | Visual brief for the React build | Claude Code (with the Taste skill) |
| `04-gaps-and-decisions.md` | Unresolved conflicts, missing assets, things only you can answer | You, before the build |

## Rules for the build

1. `01-slides.md` is authoritative for content. `02-facts.md` is authoritative for numbers. Where a fact is marked `⚠️ unverified`, it must not appear on a slide.
2. Nine slides. One idea per slide. Speaker notes carry the detail; slides carry the evidence.
3. Do not add slides. If something feels missing, it goes in speaker notes.
4. Assets referenced in `01-slides.md` are placeholders until the list in `04-gaps-and-decisions.md` is resolved.

## Pipeline

```
markdown (this package)
  → Claude Code + Taste skill
  → React presentation (keyboard-driven, 16:9, projector-safe)
```
