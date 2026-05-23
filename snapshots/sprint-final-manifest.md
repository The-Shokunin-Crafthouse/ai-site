# Sprint Final — Snapshot Batch Manifest

Captured against `claude/zen-golick-3f425c` HEAD (post-token-cleanup commit).
Static preview server: `python3 -m http.server 4173`. Dark mode active in every frame.

## Viewports

- `360 × 800` — narrowest mainstream phone (under spec's mobile breakpoint).
- `768 × 1024` — first desktop pixel above the `@media (max-width: 767px)` mobile cascade. Sheet primitive does NOT fire here (intentional).

## Horizontal-overflow check at 360

| Metric | Value |
| --- | --- |
| `documentElement.scrollWidth` | 360 |
| `body.scrollWidth` | 360 |
| `innerWidth` | 360 |
| Page overflow | **none** |

Only nested overflow is the hiring tab strip (`.hiring__tabs`, `overflow-x: auto`, `scroll-snap-type: x mandatory`). Strip is 432 px wide on a 360 viewport — 72 px shy of fitting, scrolls horizontally inside its own container as designed (spec §6.6). Document body never overflows.

## 360 — six required artifacts

| Frame | State | Verification |
| --- | --- | --- |
| 360-01 landing collapsed | hero + 4 overview rows (01–04) | "See it at your company →" mobile CTA, eyebrow `MEMORY // CONTEXT // SKILLS`, 40 px py |
| 360-02 overview row sheet-open | row 02 "Thirteen steps from brief to ship" expanded inline | Section 1 LOCK pattern — overview rows expand inline on mobile, sheets are step-level. Counter `0 of 13 explored` at expand-time, progress bar left-aligned with header column. |
| 360-03 sec 3 workflow step expanded | step 01 "Write the brief" sheet open | Sheet number `01` + title + divider, body copy + prompt block. Counter bumped to `1 of 13 explored` (mobile `markExplored` wired). Single-line title → icon/num **center-aligned** (multi-line modifier not applied). |
| 360-04 sec 4 sub-section expanded | brain row "01 Studio Memory" sheet open | Same title treatment as sec 3 (number + title + divider). `studio-memory.md` chip rendered inside the body copy. |
| 360-05 hiring mid tab | `50+ Mid-size` active | Tabs scroll-snap strip clipped right of `1000+ Enterprise`; Mid-size pill in accent border + accent label color. Brain card shrunk to Figma spec, arrow-bullet list below, slant on "lead" via slnt axis. |
| 360-06 sec 5 tools table | overview row 04 "Right tool, right phase" expanded | Three tools rows revealed (01 Studio Setup / 02 Project Workflow / 03 Knowledge work). |

## 768 — six required artifacts

| Frame | State | Verification |
| --- | --- | --- |
| 768-01 landing collapsed | top nav (`Overview · Workflow · Studio Brain · Tools · For Hiring Managers`), longer "Skip to: How I'd apply this at your company" CTA, overview rows full-width | Desktop hero CTA copy diverges from mobile correctly. |
| 768-02 overview row sheet-open | row 02 expanded — desktop "Expand all / Collapse all" toolbar visible | Desktop pattern (sheets disabled). Steps render in 2-col grid (description + prompt). |
| 768-03 sec 3 workflow step expanded | step 01 "Write the brief" inline-expanded | Description left, prompt slab right with copy icon top-right. Gates table renders below ("Every gate is human. AI waits at each one."). |
| 768-04 sec 4 sub-section expanded | brain row "01 Studio Memory" expanded inline | Left: description + `studio-memory.md` chip. Right: 3 accumulated learnings (`trailingSlash`, Supabase RLS, container queries SVG) on `--bg-callout` fill, no border. |
| 768-05 hiring mid tab | `50+ Mid-size` active, all 3 tabs visible without scroll | Eyebrow uppercase at desktop ("IT'S ROCKET AI SCIENCE"), sentence-case at mobile. Slant rendered on "lead". |
| 768-06 sec 5 tools table | "01 Studio Setup" expanded — 3-col table | Columns: `IF I NEED TO… · USE THIS · WHY`. Five rows incl. inline mono chips (`studio-memory.md`, `~/.claude/settings.json`). |

## Sheet primitive — drag-dismiss stepped frames (360 only)

| Frame | State |
| --- | --- |
| sheet-1 open snap | sheet at initial 282 px snap, handle visible, "01 Write the brief" title, counter increments to `1 of 13` |
| sheet-2 mid drag | `translateY(180px)` applied to demonstrate drag state — backdrop content (rows 01–02, progress bar) re-exposed above the sheet |
| sheet-3 dismissed | sheet removed from DOM, page returns to default scroll, counter persists at `1 of 13` (sessionStorage Set retains the explored step) |

Grain canvas opacity = 0 throughout sheet lifecycle (verified via `data-sheet-open="true"` selector).

## Token / hex cleanup landed in this batch

| Was | Now |
| --- | --- |
| `app.css:269 background: #ffffff` | `var(--surface-toggle-knob)` in `tokens.css` |
| `app.css:2975 background: #080707` + `:not(.dark *)` swap | `var(--bg-prompt-deep)` in `tokens.css` (mode-following via `:root` + `.dark` blocks) |
| `app.css:1568-1574 .dark .brain-row__prompt { … }` block | Relocated to `tokens.css` under "Component-scoped token variants" |

Remaining `#xxxxxx` occurrences in `app.css` are all inside CSS comments documenting token values — verified via `grep -nE '#[0-9a-fA-F]{3,8}' styles/app.css | grep -v '/\*'` returning zero rule-context matches.
