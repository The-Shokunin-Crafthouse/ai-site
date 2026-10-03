# COWORK TASK — ai.levibahn.com Weekly Update
> Scheduled task. Runs weekly. Read this file at the start of every run.

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
Fetch note: the engineering index shows dates; read the top 6 and diff titles. On claude.com/blog keep only posts that name Claude Code, mods, plugins, skills, hooks, or agents; skip enterprise and announcement posts.
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

## STEP 2 — FETCH EACH SOURCE

For each source in SOURCES:

1. Fetch each URL listed
2. Run each search query listed
3. Collect all posts, articles, changelog entries, or doc changes accessible from results
4. For X/Twitter: use search snippets and cached results — use what's publicly accessible
5. For docs and blogs: read the page content directly, look for recent additions or changed sections
6. If a source block carries a `Fetch note:` line, follow it: it names which feed to use, what to filter out, or what to scrape when the site has no feed

Extract from each item:
- A one-line summary distinct enough to match against the snapshot
- The actionable content (tip, feature, pattern, workflow change)
- A link if available

---

## STEP 3 — DIFF AGAINST SNAPSHOTS

For each source, compare extracted summaries against `seenItems` in its snapshot file.

Only carry forward items not already seen. If a source has nothing new, note it and move on.

---

## STEP 4 — SCORE RELEVANCE

For each new item across all sources, apply the rating scale from RELEVANCE PROFILE.

Flag items as optimization opportunities even if the feature is already in use — if the source suggests a meaningfully better way to use it, that is a 🔴 or 🟡.

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

---

## Sources checked
- Boris Cherny (@bcherny): [N new / nothing new]
- Andrej Karpathy (@karpathy): [N new / nothing new]
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

_Generated: YYYY-MM-DD_
```

---

## STEP 6 — UPDATE SNAPSHOTS

For each source, write an updated snapshot file:
- `lastChecked`: today's date (ISO 8601)
- `seenItems`: full merged list of all summaries seen so far (old + new)

---

## STEP 7 — GENERATE RECOMMENDATIONS

Read the report just written. For each 🔴 and 🟡 item, evaluate whether it requires a content change to ai.levibahn.com.

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
Effort: [Low / Medium / High]

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
   (e.g. `⚪ also seen: …`) or be omitted.
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
