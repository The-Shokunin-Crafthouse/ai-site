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
