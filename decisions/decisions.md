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

## 2026-05-20 — Inter Variable: self-hosted (Google Fonts strips slnt axis)
**Stage:** 03-build
**Status:** accepted

**Context.** Earlier this sprint we swapped Inter delivery to a Google
Fonts axis-range URL — `family=Inter:slnt,wght@-10..0,100..900` — so the
role-mark `font-variation-settings: "slnt" -5` would resolve and the
hiring title could move off 200 weight. DevTools inspection showed the
title computed `font-weight: 200` even after a 300 rule landed; system
font fallback (single weight) was masquerading as Inter. Curling the
Google Fonts CSS endpoint returned `"Missing font family — Requested:
Inter (slnt=[-10.0,0.0], wght=[100.0,900.0])"`. Google Fonts only exposes
Inter's `wght` axis. The slnt request silently failed → no Inter
@font-face served → everything fell back to system-ui, where every
`font-weight` rendered identically.

**Decision.** Self-host Inter Variable. Ship `fonts/InterVariable.woff2`
(rsms.me/inter, ~344KB unsubsetted) and declare it locally:

```css
@font-face {
  font-family: "Inter";
  font-style: oblique 0deg 10deg;
  font-weight: 100 900;
  font-display: swap;
  src: url("../fonts/InterVariable.woff2") format("woff2-variations");
}
```

Drop Inter from the Google Fonts `<link>` (Cascadia Mono still served
there). Add `<link rel="preload" as="font" type="font/woff2" crossorigin>`
for the variable file so the fetch starts with the HTML, not after CSS
parse.

**Consequences.**
- Full `wght` axis (100..900) and `slnt` axis (-10..0) both resolve.
  Hiring title weight 300 now renders. Role-mark `slnt -5` now renders.
- One extra asset on the critical path (~344KB woff2), offset by:
  removing two third-party DNS hops (fonts.googleapis.com,
  fonts.gstatic.com) for Inter, and serving one file instead of
  per-weight static instances. Net real-world delta is ≤100ms either
  direction on warm networks; on cold connects self-host typically wins
  by skipping the third-party TLS handshake.
- `font-display: swap` (not `optional`) so a brief FOUT is preferred
  over a permanent fallback when the woff2 misses the early window —
  Inter is the primary typeface and locking out the variable axes via
  fallback would defeat the whole point of self-hosting.
- The Hostinger rsync deploy already copies `fonts/` — no workflow
  change needed.

**Alternatives considered.**
- **Stay on Google Fonts, drop slnt, revert role-mark to `skewX(-5deg)`.**
  Rejected — skew shears glyphs, which is the exact reason we switched
  to slnt. Restoring it would re-introduce the distortion the slnt
  swap was meant to remove.
- **Subset Inter Variable to latin only (~80–100KB).** Deferred — worth
  doing if Lighthouse flags font weight as a regression, but not worth
  the build-step complexity right now. The asset is cacheable for the
  full domain lifetime; first-paint is the only hit.
- **Use rsms.me CDN-hosted Inter Variable.** Rejected — third-party
  font CDN reintroduces the DNS hop we're trying to remove, and
  rsms.me has no uptime SLA.

## 2026-05-20 — Hiring title: letter-spacing -1px applied in both modes
**Stage:** 03-build
**Status:** accepted (second deliberate dark-mode change inside the
otherwise light-only feat/lightmode-yellow-ui-updates sprint, on top of
the role-mark slnt+underline carve-out)

**Context.** Light-only review of the hiring section showed the title
"How I'd apply this at your company." reading slightly slack at the
base display tracking (-0.01em ≈ -0.31px at 31px Inter ExtraLight). On
Inter 200 the counters open up enough that the line wants a touch more
optical tightening than the rest of the display titles. Held side-by-
side against dark, the same observation applies — both modes share the
type stack and font, so the slack is identical and the tighter setting
reads correctly in both.

**Decision.** Apply `letter-spacing: var(--tracking-hiring-title)` =
-1px on `.section--hiring .section__title` in both modes (no
`:not(.dark *)` guard). New semantic token `--tracking-hiring-title`
sits in tokens.css next to the other tracking tokens.

**Consequences.**
- Hiring title tightens from -0.31px to -1px in both modes — enough
  to close the slack on Inter 200 counters without crossing into a
  visibly different typographic register from the other display titles.
- Other display titles (`.t-display`, other `.section__title`) keep
  their existing -0.01em base tracking. The carve-out is local to the
  hiring section.
- Second deliberate dark-mode change on the light-only sprint branch
  after the role-mark slnt+underline. Logged so future audits can
  account for both.
- Token added (semantic, scoped name) instead of inline value, per the
  sprint's no-hardcoded-values rule.

**Alternatives considered.**
- **Apply in light only.** Rejected — the slack is identical in dark
  and looks wrong there too. Splitting it per mode would create a
  cross-mode inconsistency for no perceptible reason.
- **Tighten the base display token to -0.4px.** Rejected — would shift
  every `.t-display` and section title on the site. The Figma source
  has hero/display at -0.31px; touching the global is out of scope
  for a hiring-section tweak.
- **Use em instead of px.** Rejected — the rest of the tracking
  tokens are px (matching Figma's px-anchored spec); switching units
  for one token would create a unit mismatch.

## 2026-05-20 — Sprint: light-mode-only contract on feat/lightmode-yellow-ui-updates
**Stage:** 02-design / 03-build
**Status:** accepted

**Context.** Sprint scope was a pass over light-mode UI: hover states,
card surfaces, expanded-row text colors, the hiring section, active
crumb pill, display weights, and the role-mark emphasis. Dark mode had
just landed its own grain/tokens pass and was considered settled.

**Decision.** All component-level changes scoped to light via
`:not(.dark *)` guards or light-only token values. Dark mode left
untouched except where logged separately. Two deliberate dark-mode
carve-outs:
1. Hiring role-mark: underline + slnt slant applied in both modes
   (logged in its own ADR above).
2. Hiring title: letter-spacing -1px applied in both modes (logged
   above).

**Consequences.**
- `.section--hiring .section__title` and `.hiring__role-mark` are the
  only sprint rules that cross the mode boundary. Every other rule is
  either `:not(.dark *)`-guarded or scoped to a light-only token
  value.
- Future audits of this branch can use these two ADRs to account for
  the dark deltas without re-reading the diff.
- Inter Variable self-host (also logged) is infra, not a per-mode
  change — applies in both modes by definition.

## 2026-05-20 — Light hover pattern: drop yellow text flip, accent the ring
**Stage:** 03-build
**Status:** accepted

**Context.** Light mode previously flipped text color to
`--accent-primary` (yellow) on hover for: section 1 cards, section 2
timeline buttons, hiring tabs, the hiring CTA, and the expanded
row-title color shift across sections 2/3/4. Side-by-side review
showed the text flip read as a click confirmation, not a hover hint —
on light ground the yellow text on near-white lacked contrast and
muddied the affordance hierarchy.

**Decision.** Drop the text/color flip on hover in light mode. Use
the accent ring (border + 1px inset shadow = 2px effective) as the
sole hover signal. Dark mode keeps its existing color flip — yellow
text on the dark ground reads as the correct affordance.

**Consequences.**
- Applied across: `.card`, `.timeline__btn`, `.timeline__show-all`,
  `.hiring__tab`, `.hiring__cta-link`, and the expanded row-title
  rules (`.step__title`, `.brain-row__title`, `.tools-row__title`).
- Light hover affordance is uniform: ring on, text unchanged. The
  ring color is always `--accent-primary` — emphasis surface stays
  single-token across the page.
- Expanded-row active state in light: title stays `--fg-primary`,
  not yellow. Dark active state unchanged.

## 2026-05-20 — Hover ring pattern: 2px effective border via inset shadow (no layout shift)
**Stage:** 03-build
**Status:** accepted

**Context.** Section 1 cards, section 2 timeline buttons, and hiring
tabs all needed a 2px accent ring on hover. The naive approach —
`border: 2px` on hover — adds 1px of layout shift on every direction
because the default is 1px, which pushed neighbors around as the
cursor moved. The cards and tab rows are dense grids; any shift
flickered visibly.

**Decision.** Keep the 1px `border` declaration on every state.
Express the additional 1px on hover via `box-shadow: inset 0 0 0 1px
var(--accent-primary)`. The two layers stack into a visually-uniform
2px ring at the accent color. Layout never changes — the element's
border-box is the same on every state.

**Consequences.**
- Pattern reused across `.card:hover`, `.timeline__btn:hover`,
  `.timeline__show-all:hover`, `.hiring__tab:hover`. Border color
  shifts to `--accent-primary` on hover; the inset shadow fills the
  inner 1px so the ring reads as uniform thickness.
- Cheap, mode-agnostic, no calc() needed. The shadow can be tokenized
  later if we end up applying it in more places, but at four call
  sites inline value (`0 0 0 1px var(--accent-primary)`) is fine.
- Active and default states get their normal `border-color` — only
  the hover state stacks the shadow.

## 2026-05-20 — Section 1 cards: lift above grain overlay via z-index
**Stage:** 03-build
**Status:** accepted

**Context.** The animated grain canvas (`scripts/grain.js`) renders
fixed at `z-index: 9999` with `mix-blend-mode: soft-light`, painting
noise across the viewport. In light mode the section 1 cards had a
distinct background (`--bg-card: #ebeae6`, lighter than the page
ground); the grain blended over the card the same way it blended over
the page, smearing the surface distinction.

**Decision.** Promote `.card` to its own stacking context above the
grain:

```css
.card {
  position: relative;
  z-index: 10000;
}
```

The card's background now reads cleanly; grain still draws on the
page ground around it.

**Consequences.**
- Cards become the only surface that excludes grain. This is
  intentional — they're the primary content "tiles" of section 1
  and need to feel material, not textured.
- Other surfaces (hiring tabs, timeline buttons, prompt blocks) stay
  under the grain because their texture reads correctly with noise.
- If future surfaces need the same treatment, raising them above
  `z-index: 9999` is the recipe.

## 2026-05-20 — Active crumb pill: yellow surface, fg-primary text, caps-balanced padding
**Stage:** 03-build
**Status:** accepted

**Context.** Expanded-row crumb active state was yellow text on the
section ground. Light-mode review showed the active state reading as
a hover hint rather than a current-state lock. Wanted a pill surface
that feels like a tab.

**Decision.** Active crumb (`.overview-row__crumb.is-active`) becomes
a pill in light mode: `--accent-primary` background, `--fg-primary`
text, `var(--radius-sm)` corners, `line-height: 1`, padding `6px 6px
4px` (top/sides/bottom). New token `--space-1-5: 6px` added since
neither 4 nor 8 worked for the caps-only text — the text has no
descenders, so even padding looked top-heavy and required the
asymmetric top-vs-bottom values.

**Consequences.**
- New spacing token `--space-1-5: 6px` joins the existing scale
  (0.5/1/2/3/...). The half-step is justified by the optical-
  centering need; it's the smallest tweak unit that reads correctly
  for caps-only labels on a colored surface.
- Pattern is light-only via `:not(.dark *)`. Dark active state still
  uses the existing yellow text on dark ground (high contrast there).
- The `--space-0-5: 2px` token added in the same pass is currently
  used only by `--underline-emphasis-thickness` — kept because it
  belongs to the same fractional scale.

## 2026-05-20 — Display + section title: weight 100 → 200 in light mode
**Stage:** 03-build
**Status:** accepted

**Context.** Figma `57:11618` specifies Inter ExtraLight 200 for the
display titles. Earlier the site rendered them at 100 (Inter Thin)
because the `--font-light` token historically meant "the lightest
weight we use." On light ground, 100 disappeared into the warm gray
page bg — letters thinned to anti-aliased ghosts. Dark mode kept 100
for now because the deep ground holds Thin glyphs at a higher visual
weight than the light ground does.

**Decision.** Two rules added:

```css
.t-display:not(.dark *) { font-weight: var(--font-extralight); }
.section__title:not(.dark *) { font-weight: var(--font-extralight); }
```

Plus the hiring title's own override at 200 (already in the base
rule). New token `--font-extralight: 200` added next to the existing
`--font-light: 100`.

**Consequences.**
- Light display headlines now match Figma spec (Inter ExtraLight).
  Dark stays at 100 by omission of a dark-side rule.
- The legacy `--font-light: 100` semantic is preserved (still
  Thin) — the new `--font-extralight: 200` is additive, not a rename,
  so existing rules referencing `--font-light` stay valid.
- The hiring title sits on the same weight (200) but with tighter
  tracking (-1px via `--tracking-hiring-title`, logged separately).

## 2026-05-20 — Light card surface: --bg-card #ebeae6 above page ground
**Stage:** 02-design / 03-build
**Status:** accepted

**Context.** Light mode page bg is `--bg-base: #e0dfdc` (warm gray
ground). Section 1 cards needed a distinct surface — lighter than the
ground — so they read as floating tiles, not painted regions. Hardcoding
the color in every card rule risked the page bg drift problem we have
already documented elsewhere.

**Decision.** New token `--bg-card: #ebeae6` in the light palette.
Dark resolves to `transparent` so cards inherit the dark ground (no
surface distinction wanted in dark — the grain + ground hierarchy
carries it). `.card` references `var(--bg-card)` in every state
(default / hover / active); the hover state changes the ring, not
the surface.

**Consequences.**
- Light surface ladder is now: `--bg-base` (#e0dfdc page) →
  `--bg-card` / `--bg-subtle` (#ebeae6 cards, prompts, expanded
  surfaces). Two-step ladder, tight value range, matches the
  prior "warm ground" decision (2026-05-20 light tokens ADR).
- `--bg-subtle` and `--bg-card` are the same value today. Kept
  separate tokens because the semantic intent diverges (one is the
  card surface, one is the recessed/prompt surface) — easy to drift
  them independently later without a refactor.
- The card rule combined with the z-index lift (see
  "Lift above grain overlay" ADR) gives cards both a distinct color
  and a grain-free render.

## 2026-05-20 — Hiring brain icon: --fg-brain-icon token retargeted to #AEA7A0 (light)
**Stage:** 03-build
**Status:** accepted

**Context.** The Phosphor brain icon in the hiring section used a
darker fg-tertiary color in light mode that competed with the title.
Wanted a softer mid-gray that reads as supporting, not focal.

**Decision.** Update `--fg-brain-icon` light value to `#AEA7A0`. Dark
value pinned to `#2b2722` (the prior dark value, now explicit on the
dark side so a future light update doesn't drag dark along).

**Consequences.**
- The token `--fg-brain-icon` is now bi-modal with explicit values
  per mode, instead of a single light value inherited cross-mode.
- Any other element referencing `--fg-brain-icon` shifts in light
  too — auditing the codebase showed the token is only consumed by
  the hiring brain icon, so the change is local in effect even though
  the token is global in scope. Logged for future readers.

## 2026-05-20 — Preview deploy: SSH timeouts bumped to 10m / 30m
**Stage:** 04-ship
**Status:** accepted

**Context.** PR preview deploys via `appleboy/ssh-action` to Hostinger
were failing intermittently with `i/o timeout` and `connect:
connection timed out` errors during the 2-minute default window —
specifically on first-connection cold paths. Re-runs always
succeeded; the failure mode was kernel-level TCP, not the deploy
itself.

**Decision.** Bump both preview workflow SSH steps:
`timeout: 10m` (app-level dial timeout) and `command_timeout: 30m`
(remote command timeout). Applied to both `preview-deploy.yml` and
`preview-cleanup.yml`.

**Consequences.**
- Cold-connect failures now have headroom to recover within a single
  run; no more "rerun the workflow" loop.
- Worst-case workflow latency goes up, but only on the failure path —
  the happy path still completes in ~15s.
- If failures recur even at 10m, the root cause is upstream (Hostinger
  SSH frontend), not workflow config — escalate there rather than
  bumping again.
