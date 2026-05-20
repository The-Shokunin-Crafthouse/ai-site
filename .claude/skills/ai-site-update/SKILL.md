# SKILL — ai.levibahn.com Content Update
> Invoke when Levi says: "read `_pending/approved-[date].md` and execute"
> or when the Cowork notification arrives.

---

## WHAT THIS SKILL DOES

Reads the approved content handoff file from Cowork, fetches the live site, identifies drift between approved markdown and live content, implements the minimal changes required, and opens a PR for Levi's review.

This skill does not deploy. It opens a PR. Levi merges.

---

## STACK

Plain static HTML site. No framework, no build step.

```
index.html
styles/
scripts/
docs/
SPEC.md       ← source of truth for site intent and content structure
```

There is no `WORKSPACE.md`. Read `SPEC.md` at session start instead.
There is no `npm run build`. Verification is a live preview URL — see Step 6.

---

## STEP 1 — READ THE HANDOFF

Read `~/Projects/shokunin-crafthouse/ai-site/_pending/approved-[date].md`.

If the file does not exist, stop: "No approved handoff file found. Run the Cowork task first or confirm the date."

Confirm the modified files list and the summary before proceeding.

---

## STEP 2 — READ SPEC.MD

Read `SPEC.md` in the repo root.

If `SPEC.md` does not exist, stop and report: "SPEC.md missing. Cannot confirm content intent before editing."

Use SPEC.md as the authority on what content is correct and in scope. If any approved change contradicts SPEC.md, flag it before implementing: "This change conflicts with SPEC.md — confirm before proceeding."

---

## STEP 3 — READ THE UPDATED MARKDOWN

Read each file listed under `## Files Modified` in the handoff.
Hold the updated content in context — this is the source of truth for what the site should say.

---

## STEP 4 — FETCH THE LIVE SITE

```bash
curl -s https://ai.levibahn.com
```

Parse the live HTML. Extract the text content of each section that corresponds to the modified markdown files.

---

## STEP 5 — DIFF AND SCOPE

Compare live content against updated markdown.

For each difference found:
- Identify the exact element in `index.html` or associated files that drives the live text
- Confirm the change is content-only (copy, links, metadata) — not structural or design
- If a change is structural (layout, new section, new component), stop and flag it: "This update requires a design decision before implementation. Flagging for Levi."

Content-only changes proceed. Structural changes require a separate Gate 1.

Also note any doc path mismatches (e.g. references inside `docs/source/` that point to stale filenames). Do not fix these automatically — list them under a `## Out of Scope` section in the PR body.

---

## STEP 6 — IMPLEMENT

Branch naming convention: `copy/[short-description]`

```bash
git checkout -b copy/[short-description]
```

Make the minimal edits required — targeted find-and-replace in `index.html` and any directly referenced files. Do not refactor, do not improve, do not touch CSS or JS, do not touch anything outside the scoped diff.

No build step. Skip straight to pushing the branch.

```bash
git add -A
git commit -m "Content: [short description of what changed]"
git push origin copy/[short-description]
```

---

## STEP 7 — OPEN A PR

```bash
gh pr create \
  --title "Content: [short description]" \
  --body "$(cat ~/Projects/shokunin-crafthouse/ai-site/_pending/approved-[date].md)"
```

The PR body is the handoff file. Levi has full context inline.

After the PR opens, the preview deploy workflow triggers automatically on `pull_request`. Wait for it to complete:

```bash
gh run watch --exit-status
```

On success, compute and print the preview URL as a raw clickable line:

```
Preview: https://ai.levibahn.com/_previews/[pr-number]/
```

On failure, print the error output:

```bash
gh run view --log-failed
```

Do not report success until the preview URL is confirmed live.

---

## STEP 8 — REPORT

Output this exactly, nothing more:

```
Done.

Changed: [bullet list — one line per file modified, what changed]
Out of scope: [bullet list from Step 5, or "none"]
Preview: https://ai.levibahn.com/_previews/[pr-number]/
PR: [PR URL]

Open the preview in Chrome. When satisfied, merge the PR.
```

---

## RULES

- Never push directly to `main`. Branch and PR only.
- Branch names follow `copy/[short-description]` convention.
- Never change CSS, JS, layout, motion, or document structure in this skill.
- Never modify anything outside the files listed in the handoff.
- If the live site returns a non-200, stop and report: "Live site unreachable. Check ai.levibahn.com before proceeding."
- If the handoff file has no `## Files Modified` entries, stop: "Handoff file has no changes. Nothing to implement."
- No build step exists. Do not attempt `npm run build` or any equivalent.
- Flag doc path mismatches as out of scope. Do not fix them silently.

---

## CLEANUP (after PR merge)

Once Levi confirms the PR is merged, run:

```bash
# Archive the handoff file
mv ~/Projects/shokunin-crafthouse/ai-site/_pending/approved-[date].md \
   ~/Projects/shokunin-crafthouse/ai-site/_archive/approved-[date]-merged.md

# Delete the feature branch
git branch -d copy/[short-description]
git push origin --delete copy/[short-description]
```

Note: Claude.ai project file sync remains manual. After a successful merge, drag the updated files from `~/Projects/shokunin-crafthouse/ai-site/content/` into the Claude project knowledge and remove the old versions. This takes under two minutes and is the only step in the entire workflow that cannot be automated.
