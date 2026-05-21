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

Send a remote dispatch notification to iOS:
> "Weekly report ready. [N] recommendations waiting in _pending/weekly-update-[date].md. Reply with the numbers to implement, or 'none'."

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
Commit to a feature branch, open a PR. Do not deploy directly to main.

## Approval gate
Levi must review and merge the PR before changes go live.
```

5. **Move processed reports.** Move the `_reports/weekly-report-[date].md` into `_archive/reports/`.

---

## STEP 10 — NOTIFY COMPLETION

Send a remote dispatch notification to iOS:
> "Files updated. Open Claude Code and run: read _pending/approved-[date].md and execute. Also upload site-content-audit-v[N].md to Claude project knowledge and delete the previous version."

---

## RULES

- Never modify `content/` files without archiving first.
- Never delete from `_archive/`.
- Never proceed past Step 8 without explicit approval from Levi.
- Never touch code, deployment config, or anything outside `~/Projects/shokunin-crafthouse/ai-site/`.
- One approval cycle per week. If Levi replies to an old notification, check the date before processing.
- If any file in `content/` is missing or unreadable, stop and report before proceeding.
