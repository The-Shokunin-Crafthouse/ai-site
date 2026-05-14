# Claude Code Build Prompt — ai.levibahn.com

> Paste this entire document into Claude Code as a single prompt at session start.
> Alternatively, save as `SPEC.md` in the project root and reference it with `/goal`.

---

## PROJECT BRIEF

Build a subdomain site at `ai.levibahn.com` that presents how I (Levi Bahn) use AI as a design leader. My workflow, my tooling, and my studio operating system. The audience is hiring managers and design leadership peers evaluating me during job interviews. The site converts three internal Markdown documents (Business Runbook, New Project Setup Guide, Cowork Setup Guide) into a polished, interactive web experience that demonstrates I don't just talk about AI. I've built a production system around it.

The site must feel like a product, not a document dump. It lives as a subdomain of levibahn.com and inherits that site's design system while extending it with motion, interactivity, and progressive disclosure. The goal is to make a hiring manager spend 90 seconds on the overview and think "this person has already built what we're trying to figure out."

---

## CONTEXT FILES — READ BEFORE ANYTHING ELSE

Read these files in this order. Do not begin design or code until all are loaded:

1. `studio-memory.md` — Studio identity, design principles, code standards, technology stack, accumulated learnings. This governs every decision.
2. `Business_Runbook_Claude_Max_v1_4.md` — The full studio operating system. Source content for the site.
3. `New_Project_Setup_Guide_v1_9.md` — The step-by-step project workflow. Source content.
4. `Cowork_Setup_Guide_v1_1.md` — The knowledge-work surface. Source content.

The design system has already been extracted from `https://levibahn.com` and is specified in full below. Do not fetch the live site. All tokens are in this document.

---

## DESIGN SYSTEM SPECIFICATION

### Inherited from levibahn.com

#### Typography — font families

```css
--font-body:    "Inter", "Inter Fallback", system-ui, sans-serif;
--font-display: "Gentona", "Gentona Fallback", system-ui, sans-serif;
--font-mono:    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

- **Inter** is served self-hosted as `woff2` via Next.js `next/font` with full unicode-range subsetting, `font-display: swap`, weights **400 / 500 / 600**. Fallback metrics tuned to Arial (`ascent-override: 90.49%`, `descent-override: 22.56%`, `line-gap-override: 0%`, `size-adjust: 107.06%`). No CLS on first paint.
- **Gentona** is a paid commercial typeface (Rene Bieder), self-hosted `woff2`, weights **100 (light)** and **500 (medium)**. Used for display only. Fallback to Arial with `ascent-override: 75.25%`, `descent-override: 23.08%`, `line-gap-override: 22.07%`, `size-adjust: 99.67%`.
- **JetBrains Mono** (new for subdomain). Self-hosted woff2, weights 400/500/600 to match Inter's loaded set (~30KB total subset). Apache 2.0. Selected for x-height compatibility with Inter (~510/1000 vs ~520/1000, within 2%).
- Neither body nor display family is a variable font; static weights only.
- Body: `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `font-synthesis: none`, `font-optical-sizing: none`, `letter-spacing: 0` (global).

**JetBrains Mono use cases on subdomain:** code blocks, monospaced number tabulars in tools tables, keyboard shortcut chips, terminal-style transcript blocks. Do NOT use mono for UI labels; Inter handles those.

#### Typography — type scale

| Token | Size / Line-height | Weight | Use |
|---|---|---|---|
| `text-hero-desktop` | 69px / 71px | 100 (Gentona light) | Hero, >=768px |
| `text-hero-mobile` | 31px / 35px | 100 | Hero, <768px |
| `text-display-desktop` | 48px / 55.2px | 100 | Section display |
| `text-display-mobile` | 31px / 38.75px | 100 | Section display, <768px |
| `text-title-project-desktop` | 32px / 40px | 500 | Project titles >=768px |
| `text-title-project-mobile` | 13px / 18.2px | 500 | Project titles <768px |
| `text-quote-desktop` | 39px / 46.8px | 100 | Pulled quotes >=1440px |
| `text-quote-mobile` | 25px / 32.5px | 100 | Pulled quotes |
| `text-body-lg` | 18px / 25.6px | 400 | Lead paragraphs |
| `text-body-base` | 16px / 24px | 400 | Body copy |
| `text-body-sm` | 13px / 19.5px | 400 | Captions, footer |
| `text-body-sm-mobile` | 12px / 19.5px | 400 | Captions, <768px |
| `text-link-sm` | 14px / 24px | 500 | Inline links, nav |

Weight tokens: `font-light: 100`, `font-regular: 400`, `font-medium: 500`, `font-semibold: 600`.

#### Color — light (`:root`, PRIMARY)

```css
--bg-base:        #fdfdfc;
--bg-subtle:      #f5f5f5;
--bg-surface-2:   #ebebe9;
--bg-surface-3:   #e2e2df;
--bg-inverse:     #21201c;
--fg-primary:     #21201c;
--fg-secondary:   #595959;
--fg-tertiary:    #7d7d77;
--fg-muted:       #999999;
--fg-footer:      #62615a;
--fg-link:        #0071ec;
--fg-on-accent:   #21201c;
--border-subtle:  #c9c8c0;
--border-strong:  #0a0a0a;
--accent-primary: #daff60;
--fg-accent:      #ca4541;
--hover-accent:   #daff60;
--hover-mint:     #58f5d2;
--hover-row:      #f5f4f4;
--bg-tooltip:     #ffffff;
--fg-tooltip:     #21201c;
--shadow-tooltip: 0 8px 4px rgba(0,0,0,0.07);
--decoration-fg-primary: rgba(0,0,0,0.4);
```

#### Color — dark (`.dark`)

The subdomain extends the main site's dark mode one register deeper for the technical/AI context while staying warm (not slate-blue) for visual continuity.

```css
--bg-base:        #0e0e10;
--bg-surface:     #18181b;
--bg-elevated:    #1f1f23;
--bg-code:        #131316;
--bg-inverse:     #fdfdfc;
--fg-primary:     #e8e8ea;
--fg-secondary:   #a8a8ac;
--fg-tertiary:    #85858a;
--fg-muted:       #6a6a6e;
--fg-legal:       #9c9ca0;
--fg-link:        #5aa3ff;
--fg-on-accent:   #0e0e10;
--accent-primary: #daff60;
--accent-hover:   #e5ff7a;
--accent-mint:    #58f5d2;
--accent-error:   #c14d49;
--border-subtle:  #2a2a2e;
--border-strong:  #3d3d42;
--border-focus:   #e8e8ea;
--shadow-overlay: 0 16px 32px rgba(0,0,0,0.45);
```

Contrast verified against `#0e0e10`: `#e8e8ea` body 16.4:1 AAA, `#a8a8ac` secondary 9.2:1 AAA, `#9c9ca0` legal 7.9:1 AAA, `#6a6a6e` muted 4.2:1 AA large only, `#daff60` accent 17.0:1 AAA, `#58f5d2` mint 13.9:1 AAA.

**Color mode rule:** Light mode is the default for direct visits. Dark mode is fully implemented using the extended dark palette above.

**Toggle and persistence:** Use the same dark mode toggle component, entrance logic, and motion from levibahn.com. Both sites share a cookie set on `.levibahn.com` (parent domain) so the preference persists across the subdomain boundary. If a visitor arrives from levibahn.com with dark mode active, the subdomain honors that preference and loads dark. If a visitor goes directly to ai.levibahn.com with no stored preference, default to light. The toggle must be visually identical to the main site's toggle and placed in the same position (likely the sticky nav). On toggle, write the preference to the shared `.levibahn.com` cookie so returning to the main site also reflects the change.

**Implementation:** Do NOT use `prefers-color-scheme` as the only signal. The cookie is the source of truth. Fall back to `prefers-color-scheme: dark` only when no cookie exists and the visitor has no referrer from levibahn.com. Apply the `.dark` class to `<html>` on load (before first paint to avoid flash). The entrance animation and class-toggle logic should be lifted directly from levibahn.com's source.

#### Spacing scale

4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128px. Use the base scale. Custom one-offs (14px, 22px) only if matching nav heights from the main site.

#### Layout and containers

- Outer max-widths: **1440px** (page container), **1035px** (wide content), **984px** (feature row), **686px** (prose column).
- Horizontal padding by breakpoint: 24px (mobile) -> 32px (sm) -> 48px/64px (md) -> 128px (lg).
- No grid system; flex + max-widths.

#### Breakpoints

```
default  0-767      (mobile)
sm       768+       (tablet)
md       1024+      (small desktop)
lg       1440+      (desktop, container caps here)
```

No 1920 breakpoint. The 1440px container centers with negative space at wider viewports. 1920 is a QA verification step (open once before deploy, confirm container centers, hero doesn't strand, footer doesn't orphan), not a styling breakpoint.

#### Border radius

`rounded-xs: 1px`, `rounded-sm: 3px`, `rounded-md: 8px`, `rounded-full: 9999px`.

#### Shadow

`--shadow-tooltip: 0 8px 4px rgba(0,0,0,0.07)` (light), `rgba(0,0,0,0.35)` (dark). Otherwise hairline borders and contrast, not elevation.

#### Z-index scale

`1, 2, 10, 20, 50`. Nothing higher.

### Motion and Animation

**Approach:** CSS transitions with hand-tuned cubic-bezier. Zero JS bundle for motion, hardware-accelerated, consistent with the main site's shipped patterns.

```css
--dur-micro:       120ms;
--dur-fast:        180ms;
--dur-standard:    220ms;
--dur-expand:      280ms;   /* drawer / accordion expand */
--dur-collapse:    220ms;   /* faster than expand */
--dur-link-click:  420ms;
--dur-reveal:      800ms;
--dur-orchestrated:900ms;
--stagger-section: 100ms;

--ease-out-strong:    cubic-bezier(0.23, 1.00, 0.32, 1.00);
--ease-spring:        cubic-bezier(0.34, 1.56, 0.64, 1.00);  /* overshoot/bounce */
--ease-in-out-strong: cubic-bezier(0.77, 0.00, 0.175, 1.00);
--ease-standard:      var(--ease-out-strong);
```

Patterns:
- Reveal on mount: `opacity` + `translateY(-8px to -12px)` at `--dur-reveal` with `--ease-spring`, staggered by `--stagger-section` x index.
- Hover arrow nudge: 4px translate at `--dur-fast`, `--ease-standard`.
- Active press: `scale(0.985)` for buttons, `scale(0.92)` for tap-targets.
- `:focus-visible`: 2px solid `var(--fg-primary)`, 2px offset.
- All motion respects `@media (prefers-reduced-motion: reduce)`: opacity-only at `--dur-fast`, no translates, no scales, no overshoot.

**Escalation rule:** If any future interaction needs interruptible springs (draggable, gesture-driven), add Motion One (`motion.dev`, ~3.8KB ESM). Do not hand-roll spring physics and do not adopt a full animation framework.

### Interaction Patterns

**Section 2 (4 cards) — Drawer overlays, one at a time.** Tap card -> drawer slides up from bottom (mobile) or in from right (desktop) at `--dur-expand` with `--ease-spring`. Opening a second card closes the first. Close via tap outside, swipe down (mobile), or Escape key.

**Section 3 (13 workflow steps) — Inline expand, multiple open allowed.** Each step expands inline at `--dur-expand`. "Expand all / Collapse all" affordance at the top of the section. Persist expand state in `sessionStorage` so refresh doesn't lose context.

**Section 4 (3 sub-sections) — Inline expand, multiple open allowed.** 3 items is low cognitive load. Natural reading flow is to expand sequentially, possibly leaving earlier ones open for comparison. No "expand all" needed.

**Mobile navigation — Bottom tab bar.** 5 items: Overview, Workflow, Studio Brain, Tools, Hiring. Bottom tab bar (not hamburger) because single-page scroll benefits from always-visible nav, active state tracks scroll via IntersectionObserver, 5 items fits thumb zone at 390px (~75px per tab), and the app-like register fits the AI subdomain. "For Hiring Managers" truncates to "Hiring" at mobile widths. The bar occupies ~64px; hide on scroll-down past 200px, reveal on scroll-up via `transform: translateY(100%)` at `--dur-fast`.

---

## SITE ARCHITECTURE — 6 SECTIONS

### Section 1: Hero / Elevator Pitch
**Psychology: Anchoring + Primacy Effect + Curiosity Gap**

One screen. No scroll required to get the thesis.

Content:
- **Headline:** Write 3 options in the register of "I built a design studio that runs on AI. Here's exactly how." Present all three for review before building. Real copy, not placeholder.
- **Subline:** 2 sentences, first-person, positioning this as a working system, not a concept deck.
- **Visual:** An animated schematic of the system. Claude Code takes the creative swing. The schematic communicates the workflow loop (Brief -> Plan -> Design -> Build -> Evaluate -> Ship) as a living, connected system rather than a static list. Use spring-based entrance animation (`--ease-spring`). Not a screenshot, not a static diagram, not a typographic lockup.
- **Skip link:** "Skip to: How I'd apply this at your company" anchor to Section 6 for hiring managers in a hurry.
- **Sticky nav** appears on scroll with section labels.

**Progressive disclosure:** Everything below the fold is earned. The hero makes them want to scroll.

---

### Section 2: The System Overview
**Psychology: Chunking (Miller's Law) + Visual Hierarchy + Serial Position Effect**

The 90-second scan. A hiring manager who reads only this section should walk away understanding the full picture.

Content — 4 cards:

**Card 1 — The Brain**
Studio memory, design principles, quality criteria. The institutional knowledge that compounds across projects. Key insight: every session starts smarter than the last because context files persist.

**Card 2 — The Workflow**
Brief -> Planner -> Design -> Build -> Evaluate -> Ship. 13 steps, 4 approval gates. Every gate is human. Emphasize: AI executes, the designer decides.

**Card 3 — The Agents**
Planner, Generator, Evaluator + You. Four roles, clear handoffs. The designer is the only one who merges to main.

**Card 4 — The Tools**
Claude Max, Claude Code, Claude Design, Cowork, Figma MCP, GitHub Actions, Hostinger. How they connect. Which tool for which job. The "right tool for the right phase" principle.

**Interaction pattern:** Cards start as summary-height tiles. Click/tap opens a drawer overlay (slides up from bottom on mobile, in from right on desktop). One drawer at a time. Drawer includes 2-3 paragraphs + a supporting diagram or list. Steps stay as single items even when the source document has sub-parts (e.g., Step 5 Parts A/B). Internal detail surfaces within the expanded step view, not as separate top-level steps.

**No dead ends:** Expanded drawers include a "See the full workflow ->" or "See this in action ->" link to the relevant deep-dive section.

---

### Section 3: Deep Dive — The Workflow
**Psychology: Goal Gradient Effect + Flow State + Feedback Loop**

The 13-step project lifecycle, presented as an interactive timeline or stepped sequence. Not a wall of text.

**Interaction pattern:**
- Steps collapsed by default showing: step number, title, which tool is used, one-line description
- Click/tap expands to reveal: full instructions, the exact prompts used, approval gate details, what success looks like
- A "YOU DO / PROMPT CLAUDE / AUTOMATED" badge system on each step, color-coded consistent with the runbook's labeling
- **Click-based progress indicator:** The bar tracks which steps the visitor has expanded, not scroll position. "5 of 13 explored" means they opened 5 steps. Serves as a subtle nudge to keep going. Multiple steps can be open simultaneously.
- "Expand all / Collapse all" affordance at the top
- Steps visually connect via a thread, line, or track
- Persist expand state in `sessionStorage`

**Content source:** New_Project_Setup_Guide_v1_9.md, Steps 1-13. Distill, don't dump. Each step summary is 1-2 sentences. The expanded view is 1-2 short paragraphs max, with the key prompt or gate highlighted.

**Detail level:** Every step should be as detailed as possible while also providing a summary so hiring managers can get the gist without diving in. First-person framing for the "why" layer. Example register: "I then have the Evaluator grade the sprint against our 4 criteria because catching quality issues before I review saves a full revision cycle."

**Features to highlight:**
- Goal Mode (`/goal`) — what it automates and what it doesn't bypass
- Agent View — the multi-session control plane. First-person: "I dispatch the Generator and Evaluator as background sessions and monitor both from one screen instead of switching terminal tabs."
- Preview deployments — live review URLs on every PR
- Visual snapshots — permanent screenshot record in PR descriptions
- The 4 approval gates table (Concept, Design, Development, Delivery from studio-memory.md) as a standalone, prominent element

---

### Section 4: Deep Dive — The Studio Brain
**Psychology: Commitment and Consistency + Endowment Effect**

How institutional memory works. Why the system compounds.

**Content — 4 sub-sections:**

**4A — Studio Memory**
What studio-memory.md is, what's in it (principles, code standards, accumulated learnings), and how it grows. Show the actual section structure as a clean outline. Key message: Claude reads this at the start of every session. The studio gets smarter with every project.

Include 2-3 concrete examples from the Accumulated Learnings section as proof the system actually compounds. Show real entries (the Next.js trailingSlash discovery, the Supabase service role GRANT lesson, the CSS-only layout reflow pattern). Present as: "Here's what the system learned on real projects." These are powerful credibility signals.

**4B — The Workspace Architecture**
WORKSPACE.md, WORKFLOW.md, token-map.md, the stage structure. An interactive collapsible folder-tree visualization showing the generic workspace template structure (not a specific project). Tree nodes expand/collapse on click. Source: the project folder structure from Business Runbook Section 10 (lines 872-895). Key message: structure is the brain, tools are the hands.

**4C — Quality System**
The 4-point grading criteria (Originality, Design Quality, Craft, Functionality). The 4 approval gates (Concept, Design, Development, Delivery from studio-memory.md). The Evaluator agent. Key message: quality is systematic, not subjective.

**4D — Creative Defaults**
Surface the creative defaults from studio-memory.md Section 9: start monochromatic, springs over curves, one typeface family, grid as premise not prison, know the register, detail is the craft. These are the "taste layer" that makes the system produce distinctive work rather than generic output. First-person framing: "These are the defaults I've encoded so every session starts with a point of view, not a blank canvas."

**Interaction pattern:** All 4 sub-sections expand independently (multiple can be open). 4 items is low cognitive load. No "expand all" needed.

---

### Section 5: Deep Dive — The Tools
**Psychology: Authority Bias + Aesthetic-Usability Effect**

Quick-reference for which tool does what. Designed for scanning, not reading.

**Interaction pattern:** Present as 3 separate quick-reference tables, each with its own context label:

1. **Studio setup tools** (from Business Runbook) — "If you need to... / Use this / Why"
2. **Project workflow tools** (from New Project Setup Guide) — "If you need to... / Use this / Why"
3. **Knowledge work tools** (from Cowork Setup Guide) — "If you need to... / Use this / Why"

Draw from the quick-reference tables in all three source documents. Keep as 3 separate tables, not consolidated.

**Claude Design — own row + callout:**
Claude Design gets its own prominent row in the project workflow table. Key detail: it runs on Opus 4.7 with its own independent weekly usage limit that does NOT draw from the Max token pool. First-person: "Claude Design is effectively a free creative resource within its own weekly cap. I use it for visual exploration before committing anything to Figma."

**Cowork — own callout card:**
Cowork gets its own callout card (not just a table row). Content: what it is (file-based knowledge work in the Desktop app, not code, not creative direction), what it replaces (manual steps of updating memory files, organizing deliverables, synthesizing research), and how it connects (same token pool, same Figma connector, remote dispatch from iPhone). Explicitly distinguish from Agent View.

**Also include:**
- Token management strategy — how Sonnet vs Opus decisions are made. Explicitly call out Claude Design's separate budget as a meaningful operational detail.
- Cost: ~$120/mo rounded for simplicity. The detail is in the source documents for anyone who wants it.

---

### Section 6: For Hiring Managers — "How I'd Apply This at Your Company"
**Psychology: Anchoring + Mental Model + Singularity Effect**

**THIS IS THE MOST IMPORTANT SECTION FOR THE JOB SEARCH USE CASE.**

Direct, scannable, no fluff.

**Interaction pattern:** Tab/toggle pattern. The visitor picks their company size (Startup / Mid-size / Enterprise) and sees only that card's content. On mobile this avoids a wall of text. On desktop the selected card is prominent with the other two as selectable tabs above it.

**Startup (5-30 people)**
- I am the design team. This system is how one designer ships at the pace of three.
- Studio memory means day-one context on your product, users, and patterns. No ramp-up amnesia between sprints.
- The Planner agent turns a founder's rough brief into a structured spec in one session. No weeks of requirements gathering.
- The Evaluator catches quality issues before they reach stakeholders. Design review without the headcount.
- Cost: ~$120/mo in tooling. The ROI is output velocity with zero quality compromise.
- What I'd build first: a WORKSPACE.md for your product, a studio-memory file for your design patterns, and a sprint workflow tuned to your ship cadence.

**Mid-size (50-500 people)**
- I lead a design team. This system is how I multiply their output without multiplying headcount.
- Studio memory becomes the team's shared design intelligence. Onboarding accelerates, decisions compound, and institutional knowledge survives turnover.
- The Planner-Generator-Evaluator loop standardizes quality without standardizing creativity. Every designer still owns their craft; the system owns the consistency.
- Sprint contracts and approval gates create the accountability structure that design teams at this stage desperately need, without adding process overhead.
- What I'd build first: a design quality framework, a team-wide memory system, and an AI-assisted sprint workflow that integrates with your existing eng cadence.

**Enterprise / Fortune 500 (1000+ people)**
- I lead a design function. This system is the governance model that scales craft across business units without creating a bureaucracy.
- Studio memory at this scale is a design knowledge graph. Principles, patterns, component decisions, and accumulated learnings that any team in the org can query.
- The agent architecture maps to enterprise roles: the Planner is strategic design, the Generator is the production team, the Evaluator is the design quality function. AI makes each layer faster without collapsing the separation of concerns.
- Approval gates align naturally with enterprise review cadences (design review, accessibility audit, brand compliance, legal) without adding sequential bottlenecks.
- The token management model translates directly to enterprise AI budgeting: right-size the model to the task, preserve capacity for high-judgment work.
- What I'd build first: a pilot with one product team. Prove the model. Measure velocity, quality scores, and designer satisfaction. Then scale it with a governance framework that gives teams autonomy within guardrails.

**Tone for this section:** Direct. Confident. No hedging. Each card is 6-8 short sentences max. A hiring manager reads their company size, sees exactly what I'd do, and either wants to talk or doesn't. That clarity is the point.

---

## NAVIGATION AND UX REQUIREMENTS

### Sticky navigation
- Appears after scrolling past the hero
- Section labels: Overview, Workflow, Studio Brain, Tools, For Hiring Managers
- Current section highlighted via IntersectionObserver
- Smooth scroll to anchors
- Dark mode toggle in the nav (same component as levibahn.com, see Color Mode Rule)
- Desktop: horizontal bar
- Mobile: bottom tab bar (see Interaction Patterns above). "For Hiring Managers" truncates to "Hiring" at mobile widths. Hides on scroll-down, reveals on scroll-up.

### No dead ends
- Every section ends with a contextual link to the next logical section
- The last section (For Hiring Managers) ends with a CTA linking to levibahn.com/contact or the contact section on the main site
- "Back to top" affordance available throughout

### Mobile best practices
- Touch targets: 44x44 minimum
- Progressive disclosure collapses are thumb-friendly: large tap targets, clear expand/collapse indicators
- The approval gates table and tool comparison tables reflow gracefully: no horizontal scroll
- Font sizes: body 16px minimum on mobile, never smaller
- Verify at 360, 768, 1024, 1440 breakpoints. QA check at 1920 (no layout breakpoint, just verify centering).

### Performance
- No layout shift (CLS < 0.1)
- Skeleton loading or instant content: no blank page states
- Animations respect `prefers-reduced-motion`
- Lazy load anything below the fold
- Total page weight under 600KB (excluding fonts)

---

## PSYCHOLOGY METHODS TO APPLY (from growth.design/psychology)

Apply these deliberately. Annotate in code comments where each is used.

| Principle | Where to apply |
|---|---|
| **Anchoring** | Hero headline sets the frame. Section 6 pricing ($120/mo) anchors value. |
| **Progressive Disclosure** | Drawers in Section 2. Collapsed steps in Section 3. Expandable sub-sections in Section 4. |
| **Serial Position Effect** | Most memorable content at start (hero) and end (hiring manager section). |
| **Chunking (Miller's Law)** | Never more than 4-5 items in a group. The 4 cards in Section 2. The 3 company sizes in Section 6. |
| **Goal Gradient Effect** | Click-based progress indicator in the workflow timeline (Section 3). |
| **Curiosity Gap** | Hero creates it. Each section summary creates it before the expand. |
| **Visual Hierarchy** | Clear typographic scale. Badge system. Color-coded labels. |
| **Social Proof** | Not heavy here, but the system's existence IS the proof. The detail is the credibility. |
| **Aesthetic-Usability Effect** | The site itself is the proof of craft. If the site presenting the workflow isn't beautiful, the workflow loses credibility. |
| **Hick's Law** | Limit navigation options. One CTA per section. Don't overwhelm with choices. |
| **Von Restorff Effect** | The "For Hiring Managers" section should be visually distinct: different background, different density, a clear break. |
| **Fitts's Law** | Large, easy-to-reach interactive targets. CTA buttons sized generously. |

---

## CONTENT RULES

- Write real copy. Not lorem ipsum, not "insert content here." Ship-ready text.
- Distill, don't dump. The source documents are 1300, 950, and 380 lines respectively. The site should feel like 1/10th that density with 100% of the insight.
- **Voice:** First-person ("I built," "I direct," "my workflow") for all copy describing me personally setting up the infrastructure, the planning, the reasoning behind decisions, and the value I seek from the system. When referencing the content inside the source documents (studio-memory.md, WORKSPACE.md, token-map.md, etc.), keep the information and phrasing from those documents as-is. The documents speak in studio voice; the site's framing copy speaks in my voice.
- **File references:** Use actual filenames (studio-memory.md, WORKSPACE.md, token-map.md, WORKFLOW.md, CLAUDE.md) when they are default Claude or Shokunin conventions. These make the system concrete and credible. Don't abstract them into generic labels.
- Tone matches levibahn.com: direct, confident, grounded. Not breathless about AI. Matter-of-fact about the system. The confidence comes from specificity, not hype.
- **No em dashes** in any first-person copy on the subdomain (summaries, framing text, value statements, section intros). Source document content referenced or displayed on the site retains its original punctuation, including em dashes where they exist in the source files.
- Load the `sc-brand-voice` skill and apply the Shokunin Crafthouse voice registers before writing any copy.

---

## TECHNICAL IMPLEMENTATION

- **Framework:** HTML + CSS + vanilla JS. No build step. No framework. This keeps the deploy pipeline simple (rsync static files). If a section's interactivity becomes unmanageable in vanilla JS, Claude Code can propose pulling in a micro-library or framework at that point, but the default assumption is plain HTML/CSS/JS.
- **Hosting:** Hostinger shared hosting, same as levibahn.com.
- **Deploy:** GitHub Actions rsync on push to main. Three workflows: production deploy, PR preview deploy to `ai.levibahn.com/_previews/[pr-number]/`, preview cleanup on PR close. Same pattern as all Shokunin projects.
- **rsync target:** `~/domains/levibahn.com/public_html/ai/`
- **Domain:** `ai.levibahn.com` subdomain. DNS configured in Hostinger hPanel.
- **Asset paths:** All paths must start with `./` or be bare references (no leading `/`). Root-relative paths (`/styles.css`) break in preview deployments because `/` resolves to `ai.levibahn.com/` not `ai.levibahn.com/_previews/3/`. No `BASE_PATH` logic needed. The sprint contract must call this out explicitly. Claude Code must never use root-relative paths.
- **Dark mode:** Light default, dark fully implemented. Shared `.levibahn.com` cookie for cross-subdomain persistence. See Color Mode Rule in Design System Specification above for full implementation details.
- **Fonts:** Self-host Inter, Gentona, and JetBrains Mono as woff2. Copy font files from levibahn.com's build for Inter and Gentona. Download JetBrains Mono subset separately.

---

## DEFINITION OF DONE

All of the following must be true:

1. Site renders at `ai.levibahn.com` (or localhost during dev) with all 6 sections complete
2. Every section has real, ship-ready copy: no placeholders
3. Progressive disclosure works: drawers expand/collapse in Section 2, workflow steps expand/collapse in Section 3, sub-sections expand/collapse in Section 4, tab/toggle works in Section 6
4. Sticky navigation works with smooth scroll and active-section highlighting
5. Mobile layout verified at 360px: all content accessible, no horizontal scroll, touch targets 44x44
6. Desktop verified at 1440px: layout uses the space, doesn't feel mobile-stretched
7. QA verified at 1920px: container centers, no stranding, no orphaned elements
8. Section 6 (For Hiring Managers) is complete with all three company-size cards in a tab/toggle pattern and real copy
9. All animations respect `prefers-reduced-motion`
10. Page weight under 600KB (excluding fonts)
11. No dead ends: every section has a forward path
12. The "Skip to: How I'd apply this at your company" link in the hero works
13. Code is clean, commented where psychology principles are applied, no magic numbers
14. Dark mode toggle works: same component as levibahn.com, shared cookie on `.levibahn.com`, defaults to light on direct visit, honors dark preference from main site
15. Click-based progress indicator in Section 3 tracks expanded steps, not scroll position
16. Bottom tab bar on mobile with scroll-hide/reveal behavior
17. A single Evaluator pass has been run against the complete site after Sprint 3. PASS required before delivery.

---

## PROCESS NOTES

**Figma phase: skipped.** The design system is already established at levibahn.com and extracted into this spec. Claude Code has creative liberty to extend it based on studio-memory.md and the reference studio examples (Rally Interactive through Apple, from the Business Runbook). No Figma mockups before code.

**Evaluator: once at the end.** Sprints 1-3 ship without per-sprint Evaluator passes. One final Evaluator session runs against the complete site after Sprint 3, before I review. This tests whether `/goal` and the spec together produce work that passes the quality bar without mid-build evaluation cycles.

**Reference studios for this build:** The Rally Interactive through Apple list in the Business Runbook (not the Linear/Vercel/Stripe list in studio-memory.md). The studio-memory file has been updated to reflect this.

---

## SPRINT CONTRACT

Before writing any code, propose a sprint contract covering:

1. Exactly what you'll build in what order
2. Sprint plan:
   - **Sprint 1:** Hero + sticky nav + bottom tab bar + dark mode toggle (foundation)
   - **Sprint 2:** Sections 2-5 (use `/goal` to run as a single unattended sprint)
   - **Sprint 3:** Section 6 + polish + final Evaluator pass
3. Any design decisions you're making and why
4. The `/goal` completion conditions for Sprint 2: all 4 sections render with real copy, all progressive disclosure works (drawers, expand/collapse, tabs), click-based progress indicator functional, all breakpoints verified, preview deploy succeeds
5. Note: Sprint 2 is deliberately large. We are testing `/goal`'s ability to handle multi-section builds in one unattended run. If it struggles, we split.

Stop and wait for my approval before implementation begins.