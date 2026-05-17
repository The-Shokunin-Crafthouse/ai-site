# Token Map

Semantic-token reference for `ai.levibahn.com`. Source of truth: `styles/tokens.css`. This file documents roles, not values — when a value drifts from the token file, fix the token file.

## Surfaces

- `--bg-base` — page background. Default surface for all top-level layout.
- `--bg-nav` — navigation bar background. Matches `--bg-base` in both modes. Declared as an explicit token for future nav-specific overrides.
- `--bg-subtle` — one register deeper than base. Section dividers, alternating rows.
- `--bg-surface-2` — elevated card surface.
- `--bg-surface-3` — deepest elevated surface in the ladder.
- `--bg-inverse` — opposite-mode base. Used for inverted strips and tooltip swaps.

## Foreground

- `--fg-primary` — primary text. Body, headings, default link state when not semantic.
- `--fg-secondary` — secondary text. Subheads, captions, supporting copy.
- `--fg-tertiary` — tertiary text. Metadata, timestamps, low-emphasis labels.
- `--fg-quiet` — quietest legible text, nav micro-labels and separators. Intentional AA trade-off (same register as `--fg-muted`). Dark: `#545352` / Light: `#9c9997`.
- `--fg-muted` — muted text. Disabled states, placeholder copy. Intentional AA trade-off in dark.
- `--fg-footer` — footer text. Slightly warmer/lighter than `--fg-secondary` to recede.
- `--fg-on-accent` — text color drawn on `--accent-primary`. Reads dark in both modes by design.

## Contextual

- `--fg-link` — inline link affordance. Cool blue in both modes — semantic, not styling. Dark: `#5aa3ff` / Light: `#0071ec`.
- `--fg-tag` — section-2 tag label color. Warm beige. Not used for inline links. Dark: `#8e7d65` / Light: `#c1b29c`.
- `--fg-accent` — emphatic accent foreground (e.g. crit callouts). Warm red.

## Borders

- `--border-subtle` — hairline divider. Read as separation, not enclosure.
- `--border-strong` — strong border. Mirrors `--fg-primary` to read as an extension of text rhythm.

## Accent + interaction

- `--accent-primary` — brand accent. Lime/chartreuse.
- `--hover-accent` — accent hover state. Matches `--accent-primary` (no shift on hover by design).
- `--hover-mint` — secondary hover, cool mint.
- `--hover-row` — row-level hover surface. Mirrors `--bg-subtle`.

## Tooltip + decoration

- `--bg-tooltip` — tooltip background. Mirrors `--bg-base` light / `--fg-primary` dark for inversion.
- `--fg-tooltip` — tooltip text.
- `--shadow-tooltip` — tooltip drop shadow.
- `--shadow-elevated` — generic elevated-surface shadow.
- `--decoration-fg-primary` — 40% alpha of `--fg-primary`. Underlines, dividers, ornamental rules.
