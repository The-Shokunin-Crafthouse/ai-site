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

## 2026-05-19 — Light --bg-base shifted to #f7f7f5; nav and tooltip derive
**Stage:** 03-build
**Status:** accepted (value superseded 2026-05-19 — see Light ground darkened to #e0dfdc below; the var()-indirection split for nav/tooltip stands)

**Context.** Light mode page background was #fdfdfc — near-pure white with a
sub-perceptual warm tilt. Two other tokens (--bg-nav, --bg-tooltip) hardcoded
the same hex independently, so any future shift to the page ground required
three coordinated edits and risked silent drift. Sprint-15 had already warm-
anchored the ladder but kept the top of the light scale at near-white.

**Decision.** Set --bg-base to #f7f7f5 (warmer near-white, closer to the rest
of the warm light ladder). Convert --bg-nav and --bg-tooltip to var(--bg-base)
so they propagate with the page ground.

**Consequences.**
- Page ground, nav surface, and tooltip surface now share one source of truth.
  Future shifts to the light ground require one edit, not three.
- Light mode no longer reads as "white with a tint" — it reads as a quiet warm
  paper. Nav and tooltip follow automatically and stay flush with the page.
- Dark mode untouched — change scoped strictly to light tokens.
- Contrast against --fg-primary (#21201c) remains well above WCAG AA at this
  ground (luminance drop is sub-1%).

## 2026-05-19 — Light --border-subtle → #e5e2db; split button borders into --border-button
**Stage:** 03-build
**Status:** accepted (value superseded 2026-05-19 — see Light ground darkened to #e0dfdc below; the --border-button split stands)

**Context.** Light --border-subtle had been #c9c8c0 (Sprint-15 baseline) and
was briefly stepped warm to #c9c6c0 earlier in this sprint. That value still
read darker than the new warm light ground (#f7f7f5) wanted, and it was
serving two distinct roles: structural dividers (page-section rules, brain
rows, footer) and the resting outline of pill/tab buttons. One token, two
behaviors — every future tweak for one role risked dragging the other.

**Decision.** Lift --border-subtle to #e5e2db (lighter, warmer divider that
sits flush with the new bg-base). Introduce --border-button as a semantic
role token that derives via var(--border-subtle). Repoint the five button
surfaces — .hero__skip, .timeline__show-all, .hiring__tab, .hiring__cta-link,
.back-to-top — to --border-button. Cards, list items, chips (.step__badge,
.criteria__weight), and the .gates container keep --border-subtle directly.

**Consequences.**
- Future button-border shifts (e.g. darker resting outline for stronger
  affordance) can move --border-button without disturbing dividers.
- Dark mode inherits the indirection at zero cost — --border-button resolves
  to dark's --border-subtle (#1c1a18) via the same var() chain.
- Two role names where there was one. Choosing between them is now a
  judgment call (is this thing a button or a surface?). Calibration above
  documents the current split.

## 2026-05-19 — Light ground darkened to #e0dfdc; --border-subtle → #d4d0ca
**Stage:** 03-build
**Status:** accepted (supersedes the value choices in the two earlier
2026-05-19 ADRs; the var()-indirection architecture from those entries
— --bg-nav/--bg-tooltip via var(--bg-base), and the --border-button split —
remains in force)

**Context.** The first warm shift moved --bg-base from #fdfdfc to #f7f7f5 and
--border-subtle to #e5e2db. Reading the result on actual hardware in light
ambient, the ground still read closer to "off-white paper" than to the
recessed, slightly absorbent plane the dark composite has at #0e0c0b. Plane
separation against text and elevated surfaces was weaker than intended — the
hierarchy from page → card felt tinted rather than stepped.

**Decision.** Drop --bg-base to #e0dfdc (a noticeable, not perceptual, step
darker). Step --border-subtle down in lockstep to #d4d0ca so dividers stay
proportionally quieter than the new ground (~7 L* below page, similar gap
to before).

**Consequences.**
- Page reads as a quieter warm stone instead of paper. Stronger plane
  separation against --bg-recessed (#f7f5f3) and --bg-surface-2/3 — those
  now feel like genuinely lighter surfaces rather than near-identical tints.
  May want to reconcile those next so the elevation ladder steps consistently.
- --fg-primary (#21201c) contrast against the new ground stays well above
  WCAG AA (luminance ratio drops only ~1 point from the prior value).
- --border-button (derives from --border-subtle) follows automatically —
  button outlines stay perceptually quiet against the new ground.
- Dark mode untouched.
- Two prior 2026-05-19 ADR values are no longer current. Their architectural
  contributions (var() indirection for nav/tooltip; --border-button split)
  remain — only the hex choices were superseded.

## 2026-05-19 — Light surface ladder: --bg-subtle / --bg-recessed / --bg-callout → #ebeae6
**Stage:** 03-build
**Status:** accepted

**Context.** After dropping --bg-base to #e0dfdc, the three light tokens still
sitting at #f7f5f3 (--bg-subtle, --bg-recessed, --bg-callout) flipped from
"sit below the page" to "sit above the page." Their original role — quieter
recessed surfaces — no longer matched the new ground; .gates and any other
elevated surface using these tokens needed a single coherent value above the
new base, not three near-identical near-whites.

**Decision.** Step all three tokens together to #ebeae6 (one notch above the
new --bg-base #e0dfdc, ~5 L* delta — enough for plane separation on real
hardware without competing with --bg-surface-2/3 elevation steps above).

**Consequences.**
- .gates, .bg-callout, anything riding --bg-recessed all read as one
  coherent "raised" surface. Hierarchy now steps base → subtle → surface-2
  → surface-3 in monotonic warm light.
- Three tokens still carry the same value. Future split (if --bg-callout
  needs to diverge from --bg-subtle) can happen without breaking siblings.
  Not consolidated to a single token yet — keeping role semantics intact.
- Dark mode untouched.

## 2026-05-19 — --bg-prompt becomes mode-following (light #ebeae6, dark unchanged)
**Stage:** 03-build
**Status:** accepted (modifies the always-dark contract from 2026-05-16 Sprint-15)

**Context.** Studio Brain's prompt surface (Figma 55:9705 "CC Prompt") was
locked as always-dark in both modes — Sprint-15 set --bg-prompt to
--border-strong (#0d0c0a) in :root with no dark override, on the premise
that the code/prompt context wanted the dark composite regardless of page
mode. With the page ground now genuinely light (#e0dfdc) the dark prompt
panel read as a foreign object dropped into the light page — too much
visual weight for what is, in practice, a content panel not a code
terminal.

**Decision.** Make --bg-prompt mode-following: #ebeae6 in light (matches
the surface ladder above), --bg-base (#0e0c0b) in dark. Move the
.brain-row__prompt internal dark-palette variable overrides (--fg-primary,
--fg-secondary, --fg-tertiary, --fg-quiet, --fg-muted, --border-subtle,
--bg-subtle) from the base rule into a scoped .dark .brain-row__prompt
block so they apply only in dark.

**Consequences.**
- Section 3 prompt panels read as raised light surfaces in light mode,
  consistent with .gates and the rest of the surface ladder. Dark mode
  is byte-for-byte identical to prior behavior.
- Inline code chips inside .brain-row__prompt currently resolve to the
  same light surface color as the panel itself (code uses var(--bg-subtle)
  which is #ebeae6 in light, matching --bg-prompt). Flagged as a follow-up
  for next sprint's UI pass.
- The Sprint-15-era "always-dark" contract for the prompt surface no
  longer holds. Anyone reading the Sprint-15 ADR should note this entry
  amends it.

## 2026-05-19 — Section 3 criteria/defaults cards: outline-only fill
**Stage:** 03-build
**Status:** accepted

**Context.** .criteria > li and .defaults > li (rows 03 Quality system and
04 Creative defaults) used background: var(--bg-base) — a deliberate
elevated card on the page ground from Sprint-15. After the light page
ground dropped to #e0dfdc, those cards now sat darker than the prompt
panel surface (#ebeae6) they live inside — inverted elevation, reading
as "sunken cards on a raised panel." .learning cards in row 01 already
used background: transparent and read correctly.

**Decision.** Standardize all three inner-card patterns on transparent
fill with hairline outline (--border-subtle). Match .learning's behavior:
the card is a container drawn by its border, not by its fill.

**Consequences.**
- Three card patterns share one visual rule. Easier to evolve as one.
- Removes the inverted-elevation reading inside the prompt panel.
- Dark mode unaffected — border-subtle resolves to dark's #1c1a18 inside
  the prompt panel scope, same as before.

## 2026-05-19 — Light .gates: drop hairline border
**Stage:** 03-build
**Status:** accepted

**Context.** .gates carried both a background (--bg-subtle, now #ebeae6)
and a 1px --border-subtle outline. On the new light ground (#e0dfdc),
the bg-subtle/bg-base contrast alone is enough plane separation — the
outline doubled up the boundary and read as a stylistic afterthought
rather than an intentional containment cue. In dark, the bg-subtle
value (#0e0c0b) equals --bg-base, so the outline is the only
separation cue — must stay.

**Decision.** Remove the base-rule border on .gates. Scope a
.dark .gates { border: 1px solid var(--border-subtle); } override so
dark keeps the existing outline.

**Consequences.**
- Light .gates reads as a quieter raised surface, no outline noise.
- Dark .gates byte-for-byte identical to prior behavior.
- One more example of a component pattern where dark and light need
  different treatments because of the equal/unequal --bg-subtle vs
  --bg-base relationship across modes. Worth watching for similar
  cases in next sprint's UI pass.

## 2026-05-19 — Light hover signal: stays yellow (mint experiment reverted)
**Stage:** 03-build
**Status:** accepted

**Context.** Mid-sprint, light --hover-accent was shifted from #daff60 to
mint (#58f5d2 via --hover-mint) on the premise that yellow lacked contrast
on the lighter warm ground. The shift cascaded through ~20 interaction
sites (hover/active/selected/expanded surfaces) plus the comet system
(divider trail, button orbit, glow rgba). The change was reviewed on
hardware and the studio voted against it: yellow is the brand interaction
signal, and the teal departure read off-brand even when the contrast math
favored it. The light ground was darkened to #e0dfdc in the same sprint,
which improved yellow contrast enough that the original concern no
longer applied.

**Decision.** Revert both mint commits (interaction signal + comet).
--hover-accent stays #daff60 in light. --fg-link stays var(--accent-primary).
--hover-comet-glow stays the yellow rgba. .brain-row__prompt no longer
needs a scoped --fg-link override (none exists post-revert).

**Consequences.**
- Brand consistency preserved: yellow is the only interaction color in
  either mode.
- ~20 interaction call sites and the comet system stay on --accent-primary
  / yellow rgbas directly. The --hover-accent token is retained but
  currently has no light-vs-dark divergence — kept available as a hook
  in case a future sprint legitimately needs to split the signal.
- The new --hover-comet-trail-fade and --hover-comet-drop-shadow tokens
  introduced by the comet shift were removed by the revert.

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

## 2026-05-20 — Grain overlay: dark opacity re-anchored 0.011 → 0.01; light set to 0.4 with soft-light blend; mode source switched to site theme class
**Stage:** 03-build
**Status:** accepted (supersedes 2026-05-19 — Grain overlay dark-mode parameters locked; that ADR's coupled-knob policy still stands for SCALE, frame cadence, and blur)
**File:** scripts/grain.js
**Branch / PR:** feat/grain-overlay — PR #21

**Context.** After ADR-2026-05-19 locked dark grain on `prefers-color-scheme: dark` at
opacity 0.011 / screen, light-mode tuning surfaced two problems: (1) the in-site theme
toggle adds/removes `class="dark"` on `<html>` but cannot change the OS-level media
query, so grain never followed the site toggle — light page with grain still using
dark branch and reading invisible; (2) live light-mode iteration on `#e0dfdc` warm
ground showed 0.011 was unreadable in light regardless of blend, and the prior dark
value itself read fractionally heavier than needed once the new light tuning made the
canvas legibility-tested in both modes side-by-side.

**Decision.** Make three coupled changes, treated as one ADR because they unblock each
other:

1. Switch mode source from `prefers-color-scheme` media query to `document.documentElement.classList.contains('dark')`. Watch via `MutationObserver` on `<html>` class. Drop the OS media query and its listener entirely — site toggle is now the single source of truth.
2. Re-anchor dark opacity to `0.01` (was `0.011`). Sub-perceptual delta on dark composite; tested side-by-side with the new light branch.
3. Set light branch to `mixBlendMode: 'soft-light'` and `opacity: '0.4'`. `soft-light` against full 0–255 grayscale noise + 0.4 opacity reads as quiet film grain on the warm light ground without competing with type or surfaces.

**Locked values (post-change).**
- `canvas.style.mixBlendMode = dark ? 'screen' : 'soft-light'`
- `canvas.style.opacity = dark ? '0.01' : '0.4'`
- `const dark = document.documentElement.classList.contains('dark')`
- `const SCALE = 2` (unchanged, still coupled)
- `if (frame++ % 2 === 0)` redraw cadence (unchanged, still coupled)
- `'filter: blur(0.6px)'` (unchanged, still coupled)
- Full 0–255 random pixel range, no mode branch (unchanged)

**Consequences.**
- Grain follows the site theme toggle in real time. OS-level dark preference no longer
  affects the overlay — intentional: the site treats its own toggle as truth in every
  other token system, grain now matches.
- The previously "always-on dark" debug console log is retained (`console.log('applyColorMode —', { dark, opacity })`) for the remainder of light-mode iteration. Remove before merge.
- Light-mode tuning is no longer in scope as an "open question" — values are accepted.
  Further changes to either branch require a new ADR.
- Dark opacity moved by 0.001. Documented for traceability; no perceptual regression.

**Alternatives considered.**
- **Listen to both `prefers-color-scheme` AND the `dark` class (union)** — Rejected. Half of users would see grain that disagrees with the visible page mode when their OS preference and site toggle diverge. Single source eliminates the ambiguity.
- **Keep dark at 0.011, only tune light** — Considered. The 0.011 → 0.01 step is small enough to be defensible without re-tuning, and matching the round number reads cleaner in the diff. Both readings reviewed on hardware.
- **Per-mode SCALE or blur** — Deferred. Light grain at SCALE=2 / blur(0.6px) reads correctly; no need to split. The coupled-knob policy from the prior ADR still stands.

## 2026-05-20 — Grain overlay: light opacity finalized at 0.12; frame cadence relaxed to every 5th frame
**Stage:** 03-build
**Status:** accepted (supersedes 2026-05-20 — grain re-anchor light value of 0.4; relaxes the coupled-knob lock from 2026-05-19 on frame cadence specifically — SCALE and blur remain coupled and locked)
**File:** scripts/grain.js
**Branch / PR:** feat/grain-overlay — PR #21

**Context.** After the 2026-05-20 re-anchor set light to `soft-light` / `0.4`, side-by-side
review on the warm light ground (`#e0dfdc`) showed 0.4 was perceptibly heavier than
intended — grain read as deliberate texture rather than as a barely-there film overlay,
and competed with type rhythm on dense sections. Iterative tuning in this session walked
the light branch down 0.4 → 0.2 → 0.16 → 0.14 → 0.12. 0.12 reads as the studio's intended
register: noise visible on solid surfaces, invisible behind type, sub-perceptual at a
glance. Separately, the every-other-frame redraw cadence (`frame % 2`) was changed to
`frame % 5` to reduce perceived animation while still keeping the noise from feeling
frozen — at SCALE=2 across a full viewport, 30fps regeneration was over-active for the
opacity range we settled on.

**Decision.**
1. Set light opacity to `0.12` (final). Light blend remains `soft-light`. Dark branch
   unchanged from prior ADR (`screen` / `0.01`).
2. Change redraw cadence from `frame++ % 2 === 0` to `frame++ % 5 === 0`. Grain
   regenerates every 5th `requestAnimationFrame` tick (~12fps on a 60Hz display) rather
   than every other tick (~30fps). Visually identical noise pattern; quieter motion.

**Locked values (post-change).**
- `canvas.style.mixBlendMode = dark ? 'screen' : 'soft-light'`
- `canvas.style.opacity = dark ? '0.01' : '0.12'`
- `const dark = document.documentElement.classList.contains('dark')`
- `const SCALE = 2` (unchanged, still coupled-locked)
- `if (frame++ % 5 === 0)` redraw cadence (this ADR — was `% 2` in prior lock; now
  decoupled from the dark lock per this ADR)
- `'filter: blur(0.6px)'` (unchanged, still coupled-locked)
- Full 0–255 random pixel range, no mode branch (unchanged)

**Consequences.**
- Light grain at 0.12 finalizes the light-mode tuning. Both branches now accepted as
  the studio-final values for v1 of the overlay.
- Frame cadence change applies to both modes (still shared). Dark grain redraws at ~12fps
  instead of ~30fps — reviewed on hardware, dark register is unchanged perceptually.
- Coupled-knob policy from 2026-05-19 explicitly relaxes for frame cadence only. SCALE
  and blur stay coupled-locked. Cadence is now a "tuned but not coupled" value — future
  cadence changes do not require splitting canvases or per-mode branching.
- Perf budget improves measurably: ~2.5× fewer `createImageData` + `putImageData` calls
  per second. Battery / GPU headroom on mobile improves.
- The debug `console.log('applyColorMode —', { dark, opacity })` remains in code.
  Removal is a pre-merge task — flagged on PR #21.

**Alternatives considered.**
- **Stop at 0.14** — Considered. 0.14 was readable but still competed faintly with
  type on the densest text columns; 0.12 cleared that on review.
- **Drop to 0.10 or below** — Tried earlier in the iteration (0.04–0.1 range). Below
  0.12 the grain reads as absent on hardware in average ambient — undershoots the
  studio register.
- **Keep cadence at every-other-frame** — Rejected. With the lower opacity the
  per-frame regen feels frizzy rather than filmic. Slower cadence reads as film
  grain rather than digital noise.
- **Per-mode cadence** — Deferred. Single shared cadence is the simpler primitive.
  Revisit only if dark and light register diverge on the shared value.

## 2026-05-20 — Hiring role-mark: underline + slant applied in both modes
**Stage:** 03-build
**Status:** accepted (intentional dark-mode change inside the otherwise
light-only feat/lightmode-yellow-ui-updates sprint)

**Context.** The hiring section's role line carries an emphasis on one
word per panel — `am` (Startup), `lead` (Mid), `function` (Enterprise).
Light mode landed a 2px / 1px-radius accent underline 5px below the
baseline plus a -5 Inter `slnt` lean on the marked word. The original
plan kept the treatment light-only via `:not(.dark *)` so the active
sprint stayed inside its light-mode contract. Reviewed on hardware:
the marked word reads as the focal anchor of the role line. Dropping
it in dark left dark feeling under-emphasized for the same content.

**Decision.** Apply the emphasis underline and the slnt slant in dark
mode too. The font color stays unchanged in dark — only the underline
and the glyph slant cross the mode boundary. The sprint branch is
otherwise still light-only; this is the single deliberate dark change
on `feat/lightmode-yellow-ui-updates`.

**Consequences.**
- `.hiring__role-mark` rule and its `::after` no longer carry the
  `:not(.dark *)` guard.
- Tokens stay shared (no dark override needed) — `--accent-primary`
  already resolves the same yellow in both modes, and the slnt token
  is a font-axis value, not a color.
- Inter Variable continues to serve both modes (font URL already
  switched to axis ranges in the prior commit).
- Light-only sprint contract is breached by one rule, deliberately.
  Logged here so future audits of the branch don't read it as drift.

**Alternatives considered.**
- **Keep dark untouched.** Rejected — left dark feeling visually
  under-emphasized on the same content.
- **Flip dark to use a different accent.** Rejected — both modes
  share `--accent-primary` for emphasis surfaces; a per-mode mark
  color would split the treatment for one component only.
- **Underline only, no slant in dark.** Rejected — the slnt lean is
  what makes the mark feel like emphasis vs decoration. Halving it
  loses the intent.
