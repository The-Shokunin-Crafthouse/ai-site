# MOBILE-UPDATE-SPEC.md

## DECISIONS LOG — 2026-05-21 (Phase 2 → Phase 3)

Approvals received from owner. Implementation proceeds with these locked.

**Desktop callouts:**
- §6.1 Remove `.tabbar` CSS + `tabbar-h-mobile` padding-bottom calcs — **APPROVED**
- §6.2 Dark mode border→fill cascades (§4.1–§4.5) — **DEFERRED**; frame IDs pending. Skip implementation, leave `TODO(dark-fill-pending)` comments in code at intended sites.
- §6.3 Hero CTA radius — **BLOCKED**; owner is updating Figma to pill. Code keeps existing `--radius-full`. No change.
- §6.4 Hero `padding-block` 64 → 40 mobile — **APPROVED**
- §6.5 Overview row mobile font 22/28 → 20/24 — **APPROVED**
- §6.6 Hiring tab horizontal scroll mobile — **APPROVED**

**Popmotion:** vendor UMD at `./scripts/popmotion.min.js` — **APPROVED**

**Sheet spec:** definitive values supplied (see §3.1 below — values replaced). Tap-scale spring: apply to **all** interactive tier elements (any element with desktop hover-scale gets mobile spring). Uncertain elements: include + flag with TODO.

**§4.6 Dark mode card bg fill — RESOLVED + APPROVED CASCADE TO DESKTOP:**
- Active/tapped card (any mode), dark theme: `background: #121110`, no border.
- Inactive/collapsed cards, dark theme: `border: 1px solid #1c1a18`, no fill.
- State distinction, not static. Cascades to desktop.
- New token: `--bg-card-dark: #121110`. `--border-subtle` in `.dark` already `#1c1a18` (matches).

**Deferred — pending frame IDs (148:7358–151:18015):**
- §4.1 step-badge dark fill
- §4.2 criteria-weight chip dark fill
- §4.3 gates panel dark fill
- §4.4 learning card dark fill
- §4.5 criteria/defaults card dark fill
- Sibling expanded-state frames (per-section spacing deltas in §1.6) — owner confirms sheet spec is consistent across Steps/Structure/Tools, no block. Section-specific structural deltas: TODO in code.

---

Source of truth: Figma file [AI Levi Bahn — Production Rebuild](https://www.figma.com/design/4KITzxRtNbH4PXBHWBvrIF/AI-Levi-Bahn-%E2%80%94-Production-Rebuild?node-id=142-4354).

Anchor frame: `142:4354` (Mobile — 375 — Light - OnLoad). 19 sibling frames (section-expanded + tier-3 sheet variants, both modes) live on the same page but were not enumerable via the MCP `get_metadata` page-walk (page query timed out; sequential-id sweep failed). **See PHASE 2 — UNRESOLVED.** All values below trace to the OnLoad frame nodes or the explicit preservation/interaction rules in the task brief. Items needing expanded-frame confirmation are flagged inline as `[NEEDS-FRAME-ID]`.

Target scope: `@media (max-width: 767px)` unless a DESKTOP CALLOUT below is approved.

---

## 1 — SPACING CHANGES

Figma node-ids cited under `Trace:`. Live values read from [styles/app.css](styles/app.css) + [styles/tokens.css](styles/tokens.css).

### 1.1 Hero (mobile)

| Element | Old (live) | New (Figma) | Trace |
|---|---|---|---|
| `.hero` padding-block | `space-16` (64px) top + `calc(tabbar-h + space-12)` bottom (= 64 + 48 + 64) | `space-10` (40px) top + `space-10` (40px) bottom — tabbar gone | `142:4357` Hero/Mobile px-24 py-40 |
| `.hero` padding-inline | `--pad-h` (24px) | `--layout/pad-h` (24px) — unchanged | `142:4357` |
| `.hero__inner` row gap | `space-12` (48px) | `space-12` (48px) — unchanged | `I142:4357;14:20` Hero/Inner gap-48 |
| `.hero__copy` internal gap (block stack) | `space-4` (16px) eyebrow→headline + `space-2` (8px) headline→subline + `space-6` (24px) subline→actions | `space-6` (24px) between eyebrow, headline group, actions | `I142:4357;14:21` Hero/Copy gap-24 |
| `.hero__eyebrow` → headline | `margin-bottom: var(--space-4)` (16px) | use parent `gap-24` instead → drop margin on mobile | `I142:4357;14:22` |
| Headline → subline (inside headline group) | `margin-bottom: var(--space-2)` (8px) | `space-2` (8px) — unchanged | `I142:4357;142:4335` gap-8 |
| Subline → actions | `margin-bottom: var(--space-6)` (24px) | replace with parent `gap-24` | `I142:4357;14:27` Hero/CTAs |
| Hero CTA padding | `space-3 space-4` (12 / 16) | `space-3 space-4` (12 / 16) — unchanged | `I142:4357;14:28` py-12 px-16 |
| Hero CTA border radius | `--radius-full` (9999px, pill) | `--radius-md` (8px) | `I142:4357;14:28` rounded-md |

### 1.2 Overview rows (mobile)

| Element | Old | New | Trace |
|---|---|---|---|
| `.overview-row` padding-block | `space-6` (24px, current mobile rule line 2136) | `space-5` (20px, equivalent of 22 head + 1 divider stack) | `142:4361` OverviewRow/Head 22 + 24 padding inside 68px head |
| `.overview-row` column-gap | `space-4` (16px) | `space-4` (16px) — unchanged | `142:4361` gap 12 between number + main |
| `.overview-row__index` size | `24px` (current mobile override) | `24px` line-height auto — unchanged | `142:4362` size 20×24 |
| `.overview-row__title` size | `22px / 28px` | `20px / 24px` (display-mobile) | `142:4372` size 24×295 |
| Row dividers | full-bleed `100vw` ::after | full-bleed `100vw` ::after — unchanged | `142:4360`, `142:4418`, etc. 1px dividers |

### 1.3 Hiring (mobile)

| Element | Old | New | Trace |
|---|---|---|---|
| `.section--hiring` padding-top | `space-12` (48px) | `space-12` (48px) — unchanged | `142:4698` y=706 over OverviewBottom y=706 = 0 offset |
| `.section--hiring .section__header` margin-bottom | `space-6` (24px) | `space-6` (24px) — unchanged | `142:4699` height 94, gap 28 to tabs at y=170 |
| `.hiring__tabs` margin-bottom | `space-8` (32px) | `space-8` (32px) — unchanged | `142:4702` tabs y=170 → panel y=234 (64px includes 36 tab + 28 gap) |
| `.hiring__tab` padding | `space-3 space-5` (12 / 20) | `space-2 space-4` (8 / 16) — mobile tab shows `5–30 Startup` in 116×36 box | `142:4703` size 116×36, padding 16/10 |

### 1.4 Footer (mobile)

| Element | Old | New | Trace |
|---|---|---|---|
| `.page-footer` padding-block | `space-6` (24px) | `space-6` (24px) — unchanged | `142:4744` y=1020, h=92 |
| Footer crumb font-size | body-sm 12px | body-sm 12px — unchanged | `142:4746` 27×14 |

### 1.5 Section/Overview block (the 4 numbered rows as a unit)

| Element | Old | New | Trace |
|---|---|---|---|
| Section padding-block | inherited `0` (`.section--overview` rule) | `0` — unchanged; row-internal pad governs | `142:4358` y=405 to y=706 = 301 height for 4 rows + 1 divider |
| Each row height (collapsed) | varies 68–96 | 68 (rows 01/02/04) / 92 (row 03) | `142:4359`/`142:4403`/`142:4417`/`142:4431` heights 69/69/93/69 — row 03 wraps to 2 lines |

### 1.6 Tier-2 / Tier-3 expanded states `[NEEDS-FRAME-ID]`

The sibling frames for each section's expanded state (Workflow / Brain / Tools / Hiring tab-panel) and tier-3 sheet variants were not enumerable via MCP. Hidden expanded structure within `142:4354` (e.g., `142:4446` Section/Workflow, `142:4517` Section/Gates, `142:4555` Section/Brain, `142:4609` Section/Tools — all `hidden="true"`) gives us the *content* but not the *sheet container* spec. Per-section sheet content padding/gap deltas captured in OnLoad metadata are listed below; container spec is in §3.

Workflow steps (sheet content):
- `.step__head` padding-block: live `space-5` (20px) mobile, `space-6` (24px) desktop. Figma `142:4469` Step/01 head: 125 height, internal 18 top + 24 head + 6 + 19 meta = consistent with `space-5`. No change.
- Prompt panel padding: live `space-6` (24px). Figma `142:4484` Prompt 327×186, `14 14` inset = `space-3` (14px ≈ between space-3 12 and space-4 16). **Change:** prompt inset → 14px (add `--space-3-5` token, see §2).

Brain rows (sheet content):
- `.brain-row__head` padding-block: live `space-5` (20px). Figma `142:4570` head 60 height, num/title at y=18 → `space-4` (16px, slightly tighter on mobile). **Change:** mobile head padding → `space-4`.
- Body learnings list gap: live `space-5` (20px). Figma `142:4577` Learnings 519 height ÷ 3 cards = 158 + 14 gap = `space-3-5` (14px). **Change:** learnings gap → 14px on mobile.

Tools rows (sheet content):
- `.tools-row__head` padding-block: live `space-5` (20px). Figma `142:4624` head 60, same `space-4` (16px) on mobile. **Change:** mobile head padding → `space-4`.
- Tool table row padding: live `space-4` (16px). Figma `142:4629` ToolRow 160 height, 12 top + 18 label + 12 + 18 value + 12 + 12 + 34 = `space-3` (12px) row gaps. **Change:** mobile tool-row padding → `space-3 0`.

Gates (`142:4517` hidden):
- `.gates` padding: live `space-8 space-6` (32 / 24) mobile. Figma `142:4523` Gate/01 padding 16. **Change:** mobile gates padding → `space-4` (16px) all sides, internal items use `space-2` row-gap.

Hiring tabs (mobile):
- Tab gap: live `space-2` (8px). Figma `142:4702` tabs at x=0,124,269 → gaps 8, 8 — unchanged.
- Panel scroll: tabs row uses Tabs/Scroll suffix in name → horizontal scroll on mobile (new). See §3.

---

## 2 — TOKEN ADDITIONS

### 2.1 New primitive tokens

| Token | Value | Reason |
|---|---|---|
| `--space-3-5` | `14px` | Figma prompt-panel + learnings + tab-panel padding (14px appears repeatedly: `142:4484` `142:4582` `142:4703`). Half-step between existing `--space-3` (12) and `--space-4` (16). |
| `--space-10` | `40px` | Hero mobile padding-block (Figma `space/10` var resolved 40). Currently missing from the 4pt scale jump (32 → 48). |

### 2.2 New semantic tokens (DEFINITIVE — supplied by owner 2026-05-21)

| Token | Value (light / dark) | Where used |
|---|---|---|
| `--surface-sheet-bg` | `var(--bg-base)` / `var(--bg-base)` | Tier-3 sheet container fill — same as page bg |
| `--surface-sheet-overlay` | `rgba(13, 12, 10, 0.40)` / `rgba(13, 12, 10, 0.60)` | Scrim behind sheet. **INFERRED — pending Figma confirm.** |
| `--sheet-handle-color` | `#ffffff` / `var(--fg-secondary)` (#98938d) | Drag handle bar |
| `--sheet-handle-width` | `34px` | Definitive |
| `--sheet-handle-height` | `5px` | Definitive |
| `--sheet-handle-radius` | `8px` | Definitive |
| `--sheet-radius` | `var(--radius-lg)` (16px) | Top-left + top-right only; bottom 0 |
| `--sheet-snap-initial` | `33vh` (Figma: top-562 on 844 viewport = 282 from bottom ≈ 33%) | Definitive |
| `--sheet-snap-max` | `85vh` | Definitive |
| `--sheet-pad-top` | `12px` | Definitive |
| `--sheet-pad-bottom` | `32px` | Definitive |
| `--sheet-pad-inline` | `24px` | Definitive |
| `--sheet-gap` | `var(--space-6)` (24px) | Internal stack gap |
| `--sheet-shadow` | `drop-shadow(0 -2px 5px rgba(40, 24, 0, 0.08))` | Definitive — top edge only |
| `--sheet-stats-divider` | `#1c1a18` (both modes) | Sheet stats section divider — intentionally uses dark palette in both modes |
| `--sheet-stats-num` | `#d0ceca` (both modes) | Sheet stats large numerals — dark palette both modes |
| `--sheet-stats-label` | `var(--semantic/text/muted)` → `--fg-tertiary` (#7d7d77 light / #545352 dark) | Sheet stats labels |
| `--bg-card-dark` | `#121110` | Active/tapped card fill in dark — §4.6 resolved |

**INFERRED — PENDING FIGMA CONFIRM** subsection:
- `--surface-sheet-overlay` — scrim opacity. Owner verify against actual frames.

### 2.3 Hero radius override (mobile)

Replace `--radius-full` on `.hero__skip` mobile with `var(--radius-md)` — confirmed Figma `I142:4357;14:28` `rounded-[var(--radius/md,8px)]`. No new token, but documented here so it doesn't get caught as a raw value.

### 2.4 Popmotion — IMPORT METHOD RECOMMENDATION

**Recommended:** vendor `popmotion@11.0.5` (or current stable) as a single-file build at `./scripts/popmotion.min.js`, loaded via `<script src="./scripts/popmotion.min.js" defer></script>` before `app.js`.

Rationale:
- Static site on Hostinger — no build step, no npm. Vendoring keeps zero new tooling.
- CDN alternative (`unpkg`, `jsdelivr`) introduces a third-party runtime dependency on every page-load and is blockable by network filters. Vendoring eliminates that surface.
- Single-file build is ~25 kB gzipped — within the existing JS budget (`scripts/grain.js` + inline scripts are smaller, but page already preloads font woff2 and Phosphor sprite without complaint).
- Pinning the version in the file avoids silent upgrades that could break spring tuning.

Implementation note: only the `animate({ from, to, type: "spring", stiffness, damping, velocity })` and `inertia({ velocity, ... })` APIs are needed for the sheet drag-and-release behavior. Tree-shaking is not available without a bundler, so the full umd build is acceptable.

**Approval needed in Phase 2 gate.**

---

## 3 — INTERACTION CHANGES

### 3.1 Tier-3 bottom sheets (mobile only)

**Where:** every element that expands inline as Tier 2 on desktop. Concretely:
- Overview row → opens its tier-2 inline panel on desktop. On mobile (≤ 767px), instead render the tier-2 content (workflow steps / brain rows / tools rows / card-detail templates) inside a bottom sheet.
- Inside a tier-2 panel, a tier-3 expansion (e.g., individual workflow step expanded, brain row expanded, tools row expanded, card detail drawer) on desktop also surfaces as a sheet on mobile.

**Sheet anatomy (DEFINITIVE):**
- Slides from `translateY(100%)` to resting snap via `spring({ stiffness: 300, damping: 30 })` on the sheet's `transform: translateY()`.
- Initial snap point: `--sheet-snap-initial` (33vh).
- Max snap point: `--sheet-snap-max` (85vh).
- Width: `100vw`.
- Handle bar: 34×5px, `--sheet-handle-radius` 8px, color `--sheet-handle-color` (#fff light / #98938d dark), top-centered.
- Background: `--surface-sheet-bg` (= page bg).
- Top corners: `--sheet-radius` (16px); bottom 0.
- Padding: `12px 24px 32px` (top / inline / bottom).
- Internal gap: `--sheet-gap` (24px).
- Drop shadow: `drop-shadow(0 -2px 5px rgba(40, 24, 0, 0.08))` (top edge).
- Behind: full-viewport overlay `--surface-sheet-overlay`; tap-outside triggers dismiss spring. **INFERRED — overlay opacity pending Figma confirm.**
- Inside content scrolls (`overflow-y: auto`) once `data-sheet-snap="max"`.
- Z-index: `--z-overlay` (50) for overlay, 51 for sheet.
- Stats section inside sheet (intentional dark palette both modes): dividers `#1c1a18`, numerals `#d0ceca`, labels `--fg-tertiary`.

**Drag interaction:**
- Pointerdown on handle area → capture pointer, store initial Y + sheet's current translateY.
- Pointermove → update translateY; if user drags above current snap, allow up to max snap; below initial snap, allow toward dismiss.
- Pointerup → measure release velocity (px/ms).
  - If `velocity > +0.5` (downward) AND sheet below initial snap → animate dismiss with `inertia({ velocity, ... })` chained into spring decay.
  - If `velocity < -0.5` (upward) AND sheet is between snaps → snap to max via `spring({ stiffness: 300, damping: 30 })`.
  - Else → snap back to last stable position (initial or max) via the same spring.

**Tap scale on tier elements:**
- Spring on `transform: scale()` from 1 to `--press-scale-tap` (0.92) and back via `spring({ stiffness: 400, damping: 25 })`.
- Duration ceiling 220ms — clamp the spring resolution at `var(--dur-standard)` if not settled.
- Triggered by pointerdown on any `[data-tap-scale]` element (apply to overview rows, cards, brain rows, tools rows, hiring tabs, gate items).

### 3.2 Non-spring CSS transitions (unchanged behaviorally; documented for completeness)

- Tier 2 inline expand (desktop): `ease-out 220ms` — already `--dur-standard var(--ease-standard)`. No change.
- Yellow tap highlight (mobile): `ease-out 120ms` — wire via `--dur-micro var(--ease-out-strong)` on `background-color` + `color` flicker. Element: tier-2 row pressed → momentary `background: color-mix(in srgb, var(--accent-primary) 18%, transparent)` then fades. Applied as `[data-tap-flash]` class added on pointerdown, removed 120ms later.
- Scroll-driven transitions (nav reveal, toggle slide) — unchanged.

### 3.3 Bottom navigation removal (mobile)

- Remove `.tabbar` from `[index.html](index.html)` *only* if the element renders on desktop too — but currently `.tabbar` has no markup in [index.html](index.html), only CSS in [styles/app.css:198-256](styles/app.css:198). The CSS describes a `position: fixed` bar visible at `< 768px`.
- **Action:** delete the `.tabbar`-prefixed CSS block (lines 198–256) and remove `padding-bottom: calc(var(--tabbar-h-mobile) + …)` references from `.hero`, `.section:last-of-type`, `.placeholder:last-child`, `.back-to-top` (mobile). The token `--tabbar-h-mobile` itself can stay until a separate cleanup.
- See DESKTOP CALLOUTS §6.1 — the CSS is mobile-only, so this does not touch desktop layout.

### 3.4 Comet / cursor removal on touch

- Detect via `@media (hover: none) and (pointer: coarse)` — disable `.hover-trace`, suppress `hover-trace` JS in [scripts/](scripts/) (need to verify presence — `[NEEDS-CONFIRMATION]`).
- Replace with mobile-only tap interactions:
  - Yellow tap highlight (see §3.2) on tier elements.
  - Spring tap scale (see §3.1) on tier elements.
- All `hover-trace--button-orbit` instances suppressed on touch.

### 3.5 Hiring tabs scroll (mobile, new)

Figma node `142:4702` is named `Hiring/Tabs/Scroll`. The three tab pills (`5–30 Startup` 116×36 at x=0, `50–500 Mid-size` 137×36 at x=124, `1000+ Enterprise` 141×36 at x=269) span 410px total — wider than the 327px content column. **Mobile change:** wrap `.hiring__tabs` in `overflow-x: auto` with `scroll-snap-type: x mandatory` and `scroll-snap-align: start` on each tab. No scrollbar styling beyond Webkit hide.

---

## 4 — DARK MODE CHANGES

**`[NEEDS-FRAME-ID]`** — dark variants of expanded states were not directly readable. The task brief specifies: "for any element where Figma shows a background-color fill in dark mode that currently uses a border in the live build → update to background-color in dark mode" and "these MUST cascade to desktop — flag each one individually for sign-off."

Candidate elements (from current code, all currently border-only in dark):

| # | Element | Current dark treatment | Suspected Figma dark treatment | DESKTOP CALLOUT |
|---|---|---|---|---|
| 4.1 | `.step__badge` (You/Prompt/Mixed pills) | `border: 1px solid var(--badge-*)` | Filled chip (background = `--badge-*` at low opacity, fg = primary) | **CALLOUT — needs sign-off** |
| 4.2 | `.criteria__weight` chip | `border: 1px solid var(--border-subtle)` | Filled chip | **CALLOUT — needs sign-off** |
| 4.3 | `.gates` panel | `border: 1px solid var(--border-subtle)` (`.dark .gates`) | Already filled via `--bg-subtle` in light; dark currently keeps the border. Switch to filled (`--bg-callout` or `--bg-recessed`)? | **CALLOUT — needs sign-off** |
| 4.4 | `.learning` cards | `border: 1px solid var(--border-subtle)` | Filled card (`--bg-callout`) | **CALLOUT — needs sign-off** |
| 4.5 | `.criteria > li`, `.defaults > li` | `border: 1px solid var(--border-subtle)` | Filled card (`--bg-callout`) | **CALLOUT — needs sign-off** |
| 4.6 | `.card` (Overview cards) — **RESOLVED 2026-05-21** | `border: 1px solid var(--border-subtle)` (single static treatment) | **State-dependent:** active/tapped → `bg: #121110`, no border. Inactive → `border: 1px solid #1c1a18`, no fill. **Cascades to desktop.** | **APPROVED — implement** |
| 4.7 | `.hero__skip` button | `border: 1px solid var(--border-button)` | Stay border in both modes (matches Figma `142:4357` border-solid) | **NO CHANGE** |
| 4.8 | `.hiring__tab` | `border: 1px solid var(--border-button)` | Stay border (active state uses accent border per Figma `142:4703`) | **NO CHANGE** |
| 4.9 | `.hiring__cta-link` | `border: 1px solid var(--border-button)` | Stay border (matches Figma button convention) | **NO CHANGE** |

**Block on all 4.1–4.6 until user provides the dark-variant frame node-ids OR explicit confirmation that the heuristic above is correct.**

---

## 5 — COPY CHANGES

### 5.1 Hero CTA (mobile only)

| Live | Figma `I142:4357;14:28` |
|---|---|
| `Skip to: How I'd apply this at your company` | `See it at your company →` |

**Implementation:** add a mobile-only span via `@media (max-width: 767px)`. Either:
- Two-element approach: `<span class="hero__skip-label hero__skip-label--desktop">Skip to: How I'd apply this at your company</span><span class="hero__skip-label hero__skip-label--mobile">See it at your company</span>`, toggled via media query `display`.
- Or use `data-` attribute + `::before` swap, but `aria-label` will need overriding — two-span approach is cleaner.

Arrow icon `→` already exists as `.hero__arrow` SVG — no copy change needed for the arrow.

### 5.2 Other copy

All other strings in the OnLoad frame match the live site (verified against `[index.html](index.html)` for hero headline, hero subline, overview row titles, hiring eyebrow, hiring title, hiring tab labels, footer crumbs). No additional copy changes detected at the OnLoad layer. Expanded-state copy (workflow steps, brain rows, tools rows) was readable in OnLoad metadata and matches `[index.html](index.html)` — no deltas.

---

## 6 — DESKTOP CALLOUTS

Every change below would touch desktop if cascaded naively. **BLOCKED until explicit sign-off.**

### 6.1 Bottom nav removal scope
- **Recommendation:** APPROVE — remove the `.tabbar` CSS entirely. Justification: `.tabbar` is gated behind `@media (min-width: 768px) { display: none }` already, so it's *visually* mobile-only, but the CSS block exists in the global stylesheet. The task brief says "Fixed bottom nav is completely removed on mobile" and "Do NOT remove it on desktop." Since desktop already doesn't render it, "do not remove on desktop" effectively means the *desktop sticky nav* `.nav` (lines 80–98 of [index.html](index.html)) — which is unrelated. Removing the `.tabbar` CSS only deletes dead-on-desktop code.
- **Risk:** the `padding-bottom: calc(var(--tabbar-h-mobile) + …)` in `.hero` / `.section:last-of-type` / `.placeholder:last-child` / `.back-to-top` currently inflates mobile space to clear a tabbar that has no markup. Removing those calcs *does* alter mobile spacing — but the desktop branch of each rule is untouched.
- **Verdict:** safe to approve as desktop-neutral.

### 6.2 Dark mode border → fill cascades (4.1–4.6 above)
- **Recommendation:** BLOCK per-item until expanded-frame node-ids are confirmed.
- Items 4.7–4.9 explicitly **NO CHANGE** (button borders preserved per Figma button convention).

### 6.3 Hero CTA radius change (`--radius-full` → `--radius-md`)
- **Recommendation:** **BLOCK — verify desktop intent.** The OnLoad frame is the mobile composite. Figma may use pill (`--radius-full`) on desktop and rounded-md (8px) on mobile. Live currently uses pill on both. Without seeing the desktop frame, do not cascade.
- **Action:** scope the radius change to `@media (max-width: 767px)` only. Desktop stays pill until confirmed.

### 6.4 Hero padding-block (mobile 64 → 40)
- **Recommendation:** APPROVE as mobile-only — `.hero` rule line 370 already has a `@media (min-width: 768px)` override, so reducing the mobile branch does not cascade to desktop.

### 6.5 Overview row mobile font-size (22/28 → 20/24)
- **Recommendation:** APPROVE as mobile-only — current rule is already in `@media (max-width: 767px)` (line 2133).

### 6.6 Hiring tab scroll behavior
- **Recommendation:** APPROVE as mobile-only — wrap in `@media (max-width: 767px)`. Desktop tabs row fits the 1440 layout already.

---

## PRESERVATION RULES (verified, no change)

- Hiring Manager tab subcopy slant values on the "1 word" element: locked. `--text-emphasis-slant: -5` + `font-variation-settings: "slnt" var(--text-emphasis-slant)` on `.hiring__role-mark` ([styles/app.css:1660](styles/app.css:1660)) — untouched.
- Markdown filename code-tag backgrounds (`.step__body-text code`, `.brain-row__desc code`, `.brain-row__prompt code`, `.gates__lede code`, `.hiring__brain-text code`): all preserve their `background: var(--bg-subtle)` or transparent treatment. Untouched.
- All desktop layout, spacing, interactions, and copy: scoped via `@media (max-width: 767px)` only.

---

## PHASE 2 — GATE OUTPUT

1. **Spacing changes found:** 16 (10 in primary tables §1.1–§1.4 + 6 in §1.6 tier-2/3 content).
2. **DESKTOP CALLOUTS requiring approval:**
   - §6.1 Bottom nav removal — **recommend APPROVE** (desktop-neutral).
   - §6.2 Dark mode border→fill cascades — **recommend BLOCK** until §4.1–§4.6 frame IDs are provided.
   - §6.3 Hero CTA radius cascade — **recommend BLOCK**; scope to mobile only.
   - §6.4 Hero padding-block mobile reduction — **recommend APPROVE** (mobile-only).
   - §6.5 Overview row mobile font-size — **recommend APPROVE** (mobile-only).
   - §6.6 Hiring tab scroll — **recommend APPROVE** (mobile-only).
3. **Popmotion import method recommendation:** vendor `popmotion` umd build at `./scripts/popmotion.min.js`, included via `<script defer>`. Reasoning in §2.4.
4. **Unresolved Figma values (require additional frame node-ids before implementation):**
   - All 19 sibling frames (section-expanded variants, tier-3 sheet open states, dark-mode variants).
   - Exact tier-3 sheet container spec: bg color, overlay opacity, sheet corner radius, handle styling, shadow value — currently inferred from convention.
   - Per-element dark-mode border→fill mapping (§4.1–§4.6).
   - Desktop hero CTA radius (pill vs 8px).
   - Whether tap-scale spring applies to *all* tier elements equally, or only specific ones (e.g., row vs nested element).

**Awaiting written approval before any implementation file is touched.**
