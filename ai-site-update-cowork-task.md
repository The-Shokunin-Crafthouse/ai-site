# COWORK TASK — ai.levibahn.com Weekly Update
> Scheduled task. Runs weekly. Read this file at the start of every run.

---

## RUN STRUCTURE (model routing, ADR-028)
> One scheduled task, two tiers. The scheduled task itself runs on **Fable 5.1** and acts as
> orchestrator and evaluator. It never fetches a source itself. Fetching, extracting and
> diffing are dispatched to **Sonnet 5 subagents**, one batch of sources each. Scoring,
> the report, and the recommendations stay in the Fable session, which has read the
> FACT BASE below before it judges anything.

| Step | Who runs it | Model | Why (ADR-028 class) |
|---|---|---|---|
| 1 Check snapshots | Fable session | Fable 5.1 | trivial read; stays with the orchestrator |
| 2 Fetch each source | subagents, 3-4 sources per batch | Sonnet 5 | content extraction and sync |
| 3 Diff against snapshots | inside each fetch subagent, re-checked by the Fable session | Sonnet 5 / Fable 5.1 | mechanical, with one cheap guard |
| 4 Score relevance | Fable session | Fable 5.1 | evaluation against the studio's current setup |
| 5 Write the report | Fable session | Fable 5.1 | evaluation output |
| 6 Update snapshots | Fable session | Fable 5.1 | file write of merged lists |
| 7 Recommendations | Fable session | Fable 5.1 | evaluation; weighs consequences |
| 8 Notify | Fable session | Fable 5.1 | sentinel write |

The report's footer logs this routing (`task → model → why`, one line per tier) so the run is
auditable the way ADRs are. If the Agent tool is unavailable in a run, the Fable session fetches
the sources itself and the footer says so; it never downgrades Steps 4 or 7.

---

## SOURCES
> This is the only section you need to edit to add or remove sources.
> Add a new block below to include a new source. Remove a block to stop monitoring it.

```
SOURCE: Boris Cherny
Type: X/Twitter profile
Handle: @bcherny
URLs: https://x.com/bcherny
Search queries:
  - site:x.com/bcherny claude
  - "bcherny" claude code twitter OR x.com
  - Boris Cherny claude code tips
  - from:bcherny claude
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/bcherny.json
Focus: Claude Code tips, workflow optimizations, CLAUDE.md patterns, hooks, MCP usage, sub-agents

SOURCE: Felix Rieseberg
Type: X/Twitter profile + GitHub profile (Claude updates posted from either)
Handle: @felixrieseberg (X); github.com/felixrieseberg (GitHub)
URLs:
  - https://x.com/felixrieseberg
  - https://github.com/felixrieseberg
Search queries:
  - site:x.com/felixrieseberg claude
  - "felixrieseberg" claude code OR cowork OR claude desktop
  - from:felixrieseberg claude
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/felixrieseberg.json
Fetch note: X blocks direct fetches (robots); use search snippets and cached results. On GitHub, check recent activity on Claude-related repos only. Skip personal or non-Claude posts.
Focus: Claude desktop app and Cowork updates, Claude Code releases, agent and desktop workflow changes, plugin or mod guidance

SOURCE: Andrej Karpathy
Type: X/Twitter profile
Handle: @karpathy
URLs: https://x.com/karpathy
Search queries:
  - site:x.com/karpathy claude
  - "karpathy" claude code OR AI workflow twitter OR x.com
  - from:karpathy claude code
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/karpathy.json
Focus: AI workflow patterns, coding with LLMs, prompt engineering, agentic patterns

SOURCE: trq212
Type: X/Twitter profile
Handle: @trq212
URLs: https://x.com/trq212
Search queries:
  - site:x.com/trq212 claude
  - "trq212" claude code twitter OR x.com
  - from:trq212 claude
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/trq212.json
Fetch note: X blocks direct fetches (robots); use search snippets and cached results. Skip personal or non-Claude posts.
Focus: Claude Code tips, skills, hooks, agent and workflow patterns

SOURCE: Figma Blog
Type: Blog
URLs:
  - https://www.figma.com/blog/
  - https://developers.figma.com/
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/figma-blog.json
Focus: New Figma features, MCP updates, Dev Mode changes, plugin API changes, design token tooling

SOURCE: Claude Code Docs
Type: Documentation
URLs:
  - https://code.claude.com/docs/en/overview
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/claude-code-docs.json
Focus: New features, new flags, new slash commands, hooks, skills, sub-agents, CLAUDE.md guidance

SOURCE: Luke Wroblewski
Type: Blog (RSS)
URLs:
  - https://www.lukew.com/ff/
  - https://www.lukew.com/ff/rss.asp
Search queries:
  - site:lukew.com agents design system
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/lukew.json
Focus: Design systems as a steering layer for agent-generated code, AGENTS.md patterns, agent UX findings from shipped builds, prompting styles for design work. About 8 posts a month, all on topic.

SOURCE: Nathan Curtis
Type: Newsletter (Substack, RSS)
URLs:
  - https://nathanacurtis.substack.com/
  - https://nathanacurtis.substack.com/feed
Search queries:
  - site:nathanacurtis.substack.com
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/nathan-curtis.json
Focus: Spec-driven component development, Figma + code + agent handoff, component specs as data, design-system governance for agents. About 2 posts a month. Maps to Tools Row 02 (Figma MCP, tokens) and Workflow Step 07.

SOURCE: Emil Kowalski
Type: Blog (no feed; scrape the homepage list) + GitHub skills repo
URLs:
  - https://emilkowal.ski
  - https://github.com/emilkowalski/skills
Search queries:
  - site:emilkowal.ski
  - emilkowalski skills claude code
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/emil-kowalski.json
Fetch note: no RSS and no dates on the page. Diff the ordered title list on the homepage against seenItems; a new title at the top is a new post. Also diff the skills repo commit list.
Focus: Motion taste encoded as Claude Code skill files, animation duration and easing rules, when NOT to animate, component craft. About 1 post every 2 months, every one usable.

SOURCE: Hamel Husain
Type: Blog (RSS)
URLs:
  - https://hamel.dev
  - https://hamel.dev/index.xml
Search queries:
  - site:hamel.dev evals
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/hamel-husain.json
Focus: Evals for coding agents and skills, error analysis before writing evals, critiques of auto-eval tooling, LLM-as-judge limits. About 1 post a month. Feeds the Evaluator (Step 10) and the measure-before-you-change-a-skill rule.

SOURCE: Simon Willison
Type: Blog (Atom, long-form entries only)
URLs:
  - https://simonwillison.net/atom/entries/
Search queries:
  - site:simonwillison.net "Claude Code"
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/simon-willison.json
Fetch note: use /atom/entries/ only. The /atom/everything/ feed is 40+ items a month of links and quotes and will flood the report.
Focus: Claude Code behavior changes, agent sandboxing and permission safety, model release analysis, agent tooling patterns. About 4-6 long-form posts a month.

SOURCE: Jesse Vincent (Superpowers)
Type: Blog (RSS)
URLs:
  - https://blog.fsck.com
  - https://blog.fsck.com/feed/feed.xml
Search queries:
  - site:blog.fsck.com superpowers
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/jesse-vincent.json
Focus: Skill library design for Claude Code (Superpowers), skill-update patterns, agent memory, build-in-public experiments. About 2 posts a month. Closest public analogue to the studio's skills + memory system.

SOURCE: Anthropic Engineering + Claude Code posts on claude.com/blog
Type: Blog index (no feed on either; fetch the index pages)
URLs:
  - https://www.anthropic.com/engineering
  - https://claude.com/blog
Search queries:
  - site:anthropic.com/engineering
  - site:claude.com/blog "Claude Code"
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/anthropic-engineering.json
Fetch note: the engineering index shows dates; read the top 6 and diff titles. On claude.com/blog keep only posts that name Claude Code, Cowork, Claude Desktop, mods, plugins, skills, hooks, or agents; skip other enterprise and announcement posts. (Cowork and Claude Desktop added 2026-10-28, packet S89: the Sep 16 Cowork-and-chat merge post was invisible to six sweeps.)
Focus: Harness design for long-running agents, auto mode safety, eval noise, Claude Code quality reports, mods and plugin guidance. Primary source for the Agents and Tools sections.

SOURCE: Adrian Roselli
Type: Blog (RSS rate-limits; fetch the year archive page instead)
URLs:
  - https://adrianroselli.com/2026
Search queries:
  - site:adrianroselli.com
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/adrian-roselli.json
Fetch note: /feed/ returned HTTP 429 on repeated attempts. Fetch the dated archive page and diff titles. Roll the year in the URL each January.
Focus: Screen-reader-tested accessibility with WCAG citations, dialog and focus behavior, success-criterion interpretation, overlay-vendor warnings. About 2 posts a month. Feeds Gate 3 and the Quality system row.

SOURCE: Maggie Appleton
Type: Blog (RSS)
URLs:
  - https://maggieappleton.com
  - https://maggieappleton.com/rss.xml
Search queries:
  - site:maggieappleton.com agents
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/maggie-appleton.json
Focus: Planning interfaces for coding agents, boundary objects instead of text plans, agent UX theory with built prototypes. About 1 post every 2 months. Feeds Step 02 (Planner) and the Agents card.

SOURCE: Birgitta Böckeler (Thoughtworks, "Exploring Gen AI" on martinfowler.com)
Type: Blog (Atom; filter to the series)
URLs:
  - https://martinfowler.com/feed.atom
  - https://martinfowler.com/articles/exploring-gen-ai.html
Search queries:
  - site:martinfowler.com/articles/exploring-gen-ai
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/exploring-gen-ai.json
Fetch note: the feed carries all of martinfowler.com. Keep only items whose URL contains /articles/exploring-gen-ai. Other authors now write in the series too; keep them.
Focus: Measured experiments on agentic coding, TDD inside the agent loop, local models for coding. About 1 post a month across the series. Credible citation for the hiring-manager section.

SOURCE: Dex Horthy / HumanLayer
Type: Blog index (no feed; scrape)
URLs:
  - https://www.humanlayer.dev/blog
Search queries:
  - site:humanlayer.dev/blog
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/humanlayer.json
Fetch note: the index page shows dated post cards; diff titles. Skip the "All Resources" chronology entry.
Focus: Context engineering for coding agents, getting Claude to read CLAUDE.md, context forking, harness-engineering skills. About 1 post a month, irregular. Vendor blog; take the pattern, skip the product pitch.

SOURCE: Armin Ronacher
Type: Blog (Atom; filter)
URLs:
  - https://lucumr.pocoo.org
  - https://lucumr.pocoo.org/feed.atom
Search queries:
  - site:lucumr.pocoo.org agent
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/armin-ronacher.json
Fetch note: about half the posts are Rust internals. Skip those by title; keep anything on agents, coding with LLMs, or tooling.
Focus: Skeptical, specific essays on agentic coding and agent harnesses (co-founder of Earendil, which ships the pi coding agent). About 2-3 posts a month.

SOURCE: Drew Breunig
Type: Blog (RSS)
URLs:
  - https://www.dbreunig.com
  - https://www.dbreunig.com/feed.xml
Search queries:
  - site:dbreunig.com harness
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/drew-breunig.json
Focus: Taxonomy of agent harness layers, system-prompt analysis, how harness products differ. About 1-2 posts a month. Analyst rather than builder; clear and sourced.

SOURCE: Ahmad Shadeed
Type: Blog (RSS)
URLs:
  - https://ishadeed.com
  - https://ishadeed.com/feed.xml
Search queries:
  - site:ishadeed.com
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/ahmad-shadeed.json
Focus: Visual, worked CSS layout articles (container queries, subgrid, the lh unit, overlap detection). About 1-2 posts a month. Feeds Creative defaults and the CSS token layer.

SOURCE: Josh W. Comeau
Type: Blog (RSS)
URLs:
  - https://www.joshwcomeau.com
  - https://www.joshwcomeau.com/rss.xml
Search queries:
  - site:joshwcomeau.com
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/josh-comeau.json
Focus: Interactive deep dives on CSS, scroll-driven animation, anchor positioning, with fallbacks and browser-support numbers. About 1 post every 6 weeks. Feeds Motion and Creative defaults.

SOURCE: Una Kravets
Type: Blog (RSS)
URLs:
  - https://una.im
  - https://una.im/rss.xml
Search queries:
  - site:una.im
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/una-kravets.json
Focus: Platform CSS for theming and accessible color (light-dark(), contrast-color(), style queries). About 1 post a month, quiet since June 2026. Feeds tokens and Gate 3 contrast.

SOURCE: Maxime Heckel
Type: Blog (RSS)
URLs:
  - https://blog.maximeheckel.com
  - https://blog.maximeheckel.com/rss.xml
Search queries:
  - site:blog.maximeheckel.com
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/maxime-heckel.json
Focus: Long React Three Fiber, TSL and WebGPU shader essays with live demos. About 1 post a quarter. The strongest WebGL writer active in 2026. Feeds Three.js work and Motion.

SOURCE: Motion blog (Matt Perry)
Type: Blog (RSS; filter)
URLs:
  - https://motion.dev/blog
  - https://motion.dev/magazine/rss.xml
Search queries:
  - site:motion.dev
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/motion-blog.json
Fetch note: skip product-launch posts (titles starting "Introducing"). Keep the engineering posts.
Focus: Animation engineering for the Framer Motion stack (View Transitions, hover detection, performance). About 1 post every 2 months.

SOURCE: Matt Ström-Awn
Type: Blog (Atom)
URLs:
  - https://mattstromawn.com
  - https://mattstromawn.com/feed.xml
Search queries:
  - site:mattstromawn.com
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/matt-strom-awn.json
Focus: Measured design engineering (categorical color algorithms with benchmarks, design quality, strategy). About 1 post a quarter. Feeds Creative defaults.

SOURCE: Nielsen Norman Group
Type: Blog (RSS)
URLs:
  - https://www.nngroup.com/articles/
  - https://www.nngroup.com/feed/rss/
Search queries:
  - site:nngroup.com AI
Snapshot file: ~/Projects/shokunin-crafthouse/ai-site/_snapshots/nngroup.json
Fetch note: keep AI, agent, and design-process articles; skip course and event announcements.
Focus: Research-backed AI UX frameworks (disclosure, evaluating AI output, prototyping with AI). About 6 posts a month, nearly all AI now. Quotable for the hiring-manager section.
```

---

## RELEVANCE PROFILE
> Used to score every item found across all sources.

**Stack in use:**
- Plain static HTML site at ai.levibahn.com (index.html, styles/, scripts/)
- Next.js App Router, Tailwind, Framer Motion, GSAP, Three.js / React Three Fiber (other projects)
- Node.js, Postgres via Supabase/Neon, Prisma ORM, Clerk auth, Sanity CMS, MDX
- Vercel + Hostinger hosting, Cloudinary, PostHog

**Claude surfaces actively in use:**
- Cowork desktop app, Claude Code CLI, Claude in Chrome, VS Code extension
- MCP servers (Figma MCP connected), hooks, skills, CLAUDE.md, scheduled tasks

**Rating scale:**
- 🔴 Adopt now — directly improves a daily workflow, actionable this week
- 🟡 Worth exploring — useful, adjacent to current use, worth a deliberate try
- ⚪ Noted — interesting but doesn't apply right now

---

## FACT BASE
> Read in full by the Fable session **before Step 4**, never by a fetch subagent. A score or a
> recommendation that was not weighed against these files is a guess (studio learning #123:
> an answer is capped by the fact base it is handed).

Resolve `studio-memory` by folder name next to `ai-site` (fallback `~/Projects/shokunin-crafthouse/studio-memory/`).

1. `ai-site/content/site-content-audit.md`: what the site currently claims, row by row, and the change log of past sweeps. Every recommendation names the row or card it would change.
2. `studio-memory/studio-memory.md`: the studio core: stack defaults, design criteria, gates, the model rule ("Fable is never the default").
3. `studio-memory/playbooks/business-runbook.md`, **Section 16 only** (the model-routing table): the current model pins. Do not read the rest of the file.
4. `studio-memory/decisions/decisions.md`, **the index table at the top only** (every row of the form `| [ADR-NNN](#adr-nnn) | ... |`). Read one ADR body only when an item touches that decision.
5. The four most recent `ai-site/_pending/weekly-update-*.md` files (check `_archive/` if fewer than four are in `_pending/`): what was recommended, approved or skipped in the last month.

Rules the fact base enforces:
- A claim about a model, version, price or product default becomes a recommendation only after it is checked against a primary source (the vendor's announcement or docs), not the post that reported it. The sweep once recommended "Opus 5 replaces Opus 4.8" against a deliberate pin, from a secondary mention.
- Anything that contradicts a pinned decision (an ADR, a model pin in Section 16, a stack default in the core) is never 🔴 or 🟡. It goes to **Needs ADR** in the report and the pending file, unnumbered, so a numbered reply cannot apply it. Levi decides it in a session.
- An item skipped in the last four weeks is not re-recommended unless the new post adds a fact the earlier skip did not have. Say which fact.

---

## STEP 1 — CHECK SNAPSHOTS

Create `~/Projects/shokunin-crafthouse/ai-site/_snapshots/` if it doesn't exist.

For each source in SOURCES, read its snapshot file. Schema:
```json
{
  "lastChecked": "<ISO date string>",
  "seenItems": ["<list of post/article summaries already reported>"]
}
```
If a snapshot file doesn't exist, treat everything found as new.

---

## STEP 2 — FETCH EACH SOURCE (Sonnet 5 subagents)

The Fable session does not fetch. Group the SOURCES into batches of 3-4 and dispatch one subagent per batch with the Agent tool, `model: sonnet`, all batches in parallel. Each dispatch carries:

- The full SOURCE blocks for its batch, verbatim (URLs, search queries, Fetch note, Focus)
- Each source's current `seenItems` list from Step 1 (or "no snapshot" if the file is missing)
- Today's date
- The fetch rules and the return format below

Fetch rules the subagent follows for each source in its batch:

1. Fetch each URL listed
2. Run each search query listed
3. Collect all posts, articles, changelog entries, or doc changes accessible from results
4. For X/Twitter: use search snippets and cached results — use what's publicly accessible
5. For docs and blogs: read the page content directly, look for recent additions or changed sections
6. If a source block carries a `Fetch note:` line, follow it: it names which feed to use, what to filter out, or what to scrape when the site has no feed
7. Diff against `seenItems` (Step 3) before returning: return only items not already seen

Extract from each new item:
- A one-line summary distinct enough to match against the snapshot
- The actionable content (tip, feature, pattern, workflow change), two to four sentences, with any number, version or command quoted exactly
- A link if available, and the post date if visible

Return format, one block per source, nothing else:
```
SOURCE: <name>
Fetched: <URLs that loaded> | Failed: <URL + HTTP status or error, or "none">
Items checked: <N> | New: <N>
- NEW: <one-line summary> | <date or "undated"> | <link>
  <actionable content>
```

The subagent returns only the blocks above. It does not score, does not rate, does not recommend, and does not write any file. A source whose every URL failed is reported as `Failed`, never as "nothing new" (studio learning #235: a bot checkpoint reads as an empty page).

---

## STEP 3 — DIFF AGAINST SNAPSHOTS

The fetch subagents already diffed against `seenItems`. The Fable session re-checks each returned `NEW` line against the snapshot once (a cheap guard against a subagent that ignored its list) and drops any match.

Only carry forward items not already seen. If a source has nothing new, note it and move on. If a source came back `Failed`, carry that forward to the "Sources checked" list as a fetch failure, not as "nothing new".

---

## STEP 4 — SCORE RELEVANCE (Fable session)

Read the FACT BASE in full first. Then, for each new item across all sources, apply the rating scale from RELEVANCE PROFILE.

Flag items as optimization opportunities even if the feature is already in use — if the source suggests a meaningfully better way to use it, that is a 🔴 or 🟡.

For every 🔴 and 🟡, write down before moving on:
- **Touches:** the site row or card (from the content audit) it would change, or "new row" plus where it belongs
- **Conflicts with:** the ADR, model pin, stack default or existing site claim it contradicts, or "none found" after checking
- **If adopted:** what else must change to stay consistent (another row, a skill, a runbook line, a scheduled task), or "nothing else"

An item whose "Conflicts with" names a pinned decision moves to **Needs ADR** regardless of how strong the post is. An item that rests on a model, version or price claim is held at ⚪ until the claim is checked against a primary source in this same run; if it checks out, score it; if it does not, say so in the report and leave it ⚪.

---

## STEP 5 — WRITE THE REPORT

Save one consolidated report to:
`~/Projects/shokunin-crafthouse/ai-site/_reports/weekly-report-[YYYY-MM-DD].md`

Format:
```markdown
# Weekly Update Report — YYYY-MM-DD

## 🔴 Adopt now
- **[Source] [One-line summary]** — What it is, why it matters, what to change. Link if available.

## 🟡 Worth exploring
- **[Source] [One-line summary]** — Brief explanation + link.

## ⚪ Noted
- **[Source] [One-line summary]**

## Needs ADR
- **[Source] [One-line summary]**: conflicts with [ADR-NNN / pin / site claim]. Not numbered; decide in a session.

---

## Sources checked
- Boris Cherny (@bcherny): [N new / nothing new]
- Andrej Karpathy (@karpathy): [N new / nothing new]
- trq212 (@trq212): [N new / nothing new]
- Felix Rieseberg (@felixrieseberg, GitHub): [N new / nothing new]
- Figma Blog: [N new / nothing new]
- Claude Code Docs: [N new / nothing new]
- Luke Wroblewski: [N new / nothing new]
- Nathan Curtis: [N new / nothing new]
- Emil Kowalski: [N new / nothing new]
- Hamel Husain: [N new / nothing new]
- Simon Willison: [N new / nothing new]
- Jesse Vincent (Superpowers): [N new / nothing new]
- Anthropic Engineering + claude.com/blog: [N new / nothing new]
- Adrian Roselli: [N new / nothing new]
- Maggie Appleton: [N new / nothing new]
- Birgitta Böckeler (Exploring Gen AI): [N new / nothing new]
- Dex Horthy / HumanLayer: [N new / nothing new]
- Armin Ronacher: [N new / nothing new]
- Drew Breunig: [N new / nothing new]
- Ahmad Shadeed: [N new / nothing new]
- Josh W. Comeau: [N new / nothing new]
- Una Kravets: [N new / nothing new]
- Maxime Heckel: [N new / nothing new]
- Motion blog: [N new / nothing new]
- Matt Ström-Awn: [N new / nothing new]
- Nielsen Norman Group: [N new / nothing new]

(A source whose fetch failed reads `[fetch failed: <status>]`, never `nothing new`.)

## Routing (ADR-028)
- Fetch, extract, diff → Sonnet 5 subagents ([N] dispatched, batches of [M]) → content extraction tier
- Score, report, recommendations, notify → Fable 5.1 (this session) → evaluation tier

_Generated: YYYY-MM-DD_
```

---

## STEP 6 — UPDATE SNAPSHOTS

For each source, write an updated snapshot file:
- `lastChecked`: today's date (ISO 8601)
- `seenItems`: full merged list of all summaries seen so far (old + new)

---

## STEP 7 — GENERATE RECOMMENDATIONS (Fable session)

Read the report just written. For each 🔴 and 🟡 item, evaluate whether it requires a content change to ai.levibahn.com. Carry the Touches / Conflicts with / If adopted lines from Step 4 into the pending file; they are what Levi reads before replying.

Write recommendations to:
`~/Projects/shokunin-crafthouse/ai-site/_pending/weekly-update-[YYYY-MM-DD].md`

Format:
```markdown
# Weekly Update — YYYY-MM-DD
> Review each item below. Reply with the numbers you want to implement, or "none".
> Example: "Implement 1, 3" or "none"

---

## Recommended

**[N]. [Feature or change name]**
Why it fits: [one sentence]
What changes: [one sentence describing the content edit needed]
Touches: [site row or card, from the content audit]
Conflicts with: [ADR / pin / site claim, or "none found"]
If adopted: [what else must change, or "nothing else"]
Effort: [Low / Medium / High]

---

## Needs ADR (not numbered; a reply cannot approve these)
- [item]: conflicts with [ADR-NNN / pin / claim]; [one sentence on what the decision would be]

---

## Skipped (low relevance to site content)
- [item]: [one-line reason]
```

If no items require a site content change, write:
```markdown
# Weekly Update — YYYY-MM-DD
Nothing this week requires a content change to ai.levibahn.com.
```

---

## STEP 8 — NOTIFY

Send the iMessage via the **two-file sentinel contract** (canonical spec:
`studio-memory/templates/imessage-notify.md`). Never osascript, never computer-use —
both fail in scheduled runs. This is TWO SEPARATE FILES:

1. Write the full message body to `_pending/coo.notify-ai-site-weekly-[YYYY-MM-DD].msg`:
   the categorized item list — one line per item, each tagged 🔴 / 🟡 / ⚪, header line
   with date + counts, closing line `Reply with numbers or "none".`
   **Numbering MUST match `_pending/weekly-update-[YYYY-MM-DD].md` exactly** — the
   reply is applied against that file's numbered recommendations, so only numbered
   recommendations get numbers in the text. Skipped findings may follow unnumbered
   (e.g. `⚪ also seen: …`) or be omitted. Needs-ADR items appear unnumbered as
   `⚪ needs ADR: …` so a numbered reply can never apply one.
2. Only after the `.msg` is confirmed written, create the trigger as an **empty file**:
   `_pending/coo.notify-ai-site-weekly-[YYYY-MM-DD]` (non-dotfile name, ends in the date).
3. Verify: `.msg` has the body, trigger is 0 bytes. `send-briefing.sh` (launchd) sends
   the `.msg` verbatim and stamps `.sent`. A trigger without a `.msg` sends a useless
   generic fallback text — that is a bug, not a degraded success.

**Stop here.** Do not proceed until Levi replies.

---

## STEP 9 — PROCESS APPROVAL

When Levi replies, parse which items were approved.

If "none" — log it in the pending file and stop.

If items approved:

1. **Archive first.** For every file in `content/` that will be modified, copy it to `_archive/[filename]-[YYYY-MM-DD].md` before writing changes.

2. **Version the site content audit.** If any approved change updates `site-content-audit`, do NOT overwrite the existing file. Instead:
   - Find the current highest-numbered version in `content/`:
     ```bash
     ls content/site-content-audit-v*.md 2>/dev/null | sort -V | tail -n 1
     ```
     If none exist, start at `v1`. Otherwise increment: e.g. `site-content-audit-v3.md` → next is `v4`.
   - Move the previous highest version to `_archive/site-content-audit-v[OLD_N]-[YYYY-MM-DD].md`. Do not delete it.
   - Save the updated content as `content/site-content-audit-v[NEW_N].md`.
   - Record the new filename in the handoff `## Files Modified` list.

3. **Update content files.** Apply only approved changes. Surgical edits only.

4. **Write the handoff file** to `_pending/approved-[YYYY-MM-DD].md`:

```markdown
# Approved Site Updates — YYYY-MM-DD
> Handoff to Claude Code. Do not edit manually.

## Summary
[1-2 sentences: what changed and why]

## Files Modified
- `content/[filename].md` — [what changed, one line]

## Live Site Check
Fetch https://ai.levibahn.com and compare current live content against the updated files above.
Identify sections where the live site does not match the updated markdown.
Generate the minimal code changes required to bring the live site into sync.

## Deploy (hands-off, 2026-06-21)
Commit the content + code changes, push, and let the deploy run. If `main` is
branch-protected, push a branch + open a PR + `gh pr merge --merge --admin` so it
still lands and deploys. No manual merge step.
```

5. **Move processed reports.** Move the `_reports/weekly-report-[date].md` into `_archive/reports/`.

6. **Upload reminder.** The site-content-audit version bump still needs to be mirrored
   into Claude project knowledge manually — note the new `v[N]` filename in the
   completion text.

---

## STEP 10 — NOTIFY COMPLETION

Send the completion text via the **two-file sentinel contract** (`studio-memory/templates/imessage-notify.md`; naming per `studio-memory/automation/apply.md` §4 — body to `_pending/coo-apply.notify-ai-site-weekly-apply-[YYYY-MM-DD].msg` FIRST, then the empty trigger `_pending/coo-apply.notify-ai-site-weekly-apply-[YYYY-MM-DD]`). Body:
> "Weekly ai-site apply complete — [N] items written, pushed & deploying. Upload site-content-audit-v[N].md to the Claude project and delete the previous version."

---

## RULES

- Never modify `content/` files without archiving first.
- Never delete from `_archive/`.
- Never proceed past Step 8 without approval. Levi's iMessage reply IS that approval (recorded by `automation/reply-watcher.sh`); the apply pass acts only on the approved numbers.
- Stay within `~/Projects/shokunin-crafthouse/ai-site/` for content and the site's own code/deploy. Do not touch other repos.
- One approval cycle per week. If Levi replies to an old notification, check the date before processing.
- If any file in `content/` is missing or unreadable, stop and report before proceeding.
- Steps 4 and 7 run in the Fable session, never in a subagent and never on a smaller model. Step 2 runs in Sonnet subagents whenever the Agent tool is available. The report footer records which tier did what.
- Step 4 starts only after the FACT BASE has been read in this run. A score written before that read is discarded and redone.
