# Decisions — ai.levibahn.com

Architecture Decision Records, newest at bottom.

## 2026-05-16 — Sprint 15: dark theme re-anchored on Figma #0D0C0B warm ladder, supersedes Sprint-14 derivation
**Stage:** 03-build
**Status:** accepted (supersedes 2026-05-02 — Sprint 14)

**Context.** The Sprint-14 dark theme anchored on #1C1C1E (cool-neutral, macOS-aligned).
A read against the Figma file shows the design source defines a warm-brown ladder anchored
on #0D0C0B. The two theme intents had been diverging silently. Per WORKSPACE.md §4, Figma
is the source of truth. The discrepancy was resolved by adopting Figma values as locked
truth and re-deriving the dark ladder around them.

**Decision.** Re-anchor dark mode on #0D0C0B. Port all Figma-defined roles verbatim.
Re-derive orphan tokens warm (same lightness, R>G>B channel order). Drop Sprint-14
accent desaturation policy — full-saturation accents read correctly against the warmer,
more absorbent ground. Split --fg-link (retained cool blue #5aa3ff, semantic affordance)
from new --fg-tag (#8e7d65, warm Figma value, section-2 tags only).

**Consequences.**
- app/globals.css .dark block rewritten end-to-end. :root untouched except warm-tilts
  and three new tokens (--bg-nav, --fg-quiet, --fg-tag).
- --fg-tertiary, --fg-quiet, --fg-muted resolve to #545352 in dark (2.55:1 on --bg-base).
  Deliberate studio trade-off — intentional quiet register, not a legibility error.
  Same exception applied to light equivalents.
- --fg-tag introduced as a new role. Rebinds the warm Figma link color away from
  --fg-link, preserving blue as the semantic link affordance in both modes.
- Light mode derived proportionally from dark changes — sub-perceptual warm tilts
  on neutral tokens. Larger visual change in dark; light was already warm-anchored.

## 2026-05-19 — Grain overlay: dark-mode parameters locked
**Stage:** 03-build
**Status:** accepted (locked)
**File:** scripts/grain.js
**Branch / PR:** feat/grain-overlay — PR #21

**Context.** Animated film-grain canvas overlay added to index.html for textural depth
across both color modes. Dark-mode visual review passed after iterative tuning over
~10 commits on feat/grain-overlay — barely-there noise, no banding on near-black
grounds, no perf jank at 60fps. Light-mode tuning still in motion. Risk: continued
light-mode iteration silently drifts dark-mode values, and the dark register has to
be re-found by eye each time.

**Decision.** Freeze the four dark-mode-affecting parameters of scripts/grain.js.
Light-mode tuning continues; dark values are not in scope for further change without
a fresh ADR.

**Locked dark-mode values.**
- `canvas.style.mixBlendMode = 'screen'` (dark branch of ternary)
- `canvas.style.opacity = '0.011'` (dark branch of ternary)
- `const SCALE = 2` (shared with light — coupled, see Consequences)
- `if (frame++ % 2 === 0)` redraw cadence (shared with light — coupled)
- `'filter: blur(0.6px)'` in cssText array (shared with light — coupled)

**Consequences.**
- Light-mode tuning may only change: `mixBlendMode` light branch, `opacity` light
  branch. All other knobs are coupled to dark and locked.
- If light mode genuinely needs a different SCALE, frame cadence, or blur, the path
  is to split into two canvases (one per mode) or branch those values on `mq.matches`.
  Either move requires a new ADR — do not silently re-tune.
- Future Claude sessions iterating on grain should diff against these five values
  before pushing; any drift on dark is a regression.
- Perf at SCALE=2 with every-other-frame redraw verified acceptable on preview at
  https://ai.levibahn.com/_previews/21/ — do not lower SCALE below 2.

**Alternatives considered.**
- **Lock the whole file** — Rejected. Light mode still being dialed in; over-locking
  blocks active work.
- **Lock only opacity** — Rejected. SCALE, frame cadence, and blur all materially
  affect dark-mode perceived noise character; tuning any of them re-opens the dark
  decision.
- **Split into two canvases up front** — Deferred. Single canvas + per-mode blend/opacity
  is the simpler primitive and currently sufficient. Revisit only if light mode forces
  divergence on the coupled knobs.
