# New Project Setup Guide — Shokunin Crafthouse
# Website Projects

**Use this guide every time you start a new website project.**
Every step tells you exactly which app to be in, what to do, and what to expect.

Labels used throughout:
- **YOU DO** — you do this manually
- **PROMPT CLAUDE** — copy/paste this into the specified tool
- **AUTOMATED** — happens on its own, nothing to do

---

## Overview — The Full Sequence

```
Step 1: Brief → Step 2: Planner → Step 3: Figma File → Step 4: Scaffold
→ Step 5: Deploy + Preview Workflows → Step 6: Claude Design → Step 7: Brand System
→ Step 8: Page Design → Step 9: Build → Step 10: Evaluate
→ Step 11: Merge + Deploy → Step 12: Repeat → Step 13: Update Studio Memory
```

You direct and approve at every gate. Claude builds between them.

---

## Reference — GitHub Secrets Cheatsheet

Add these to every new repo. Values never change — same across all projects.

| Secret Name | Value | Where to get it |
|---|---|---|
| `HOSTINGER_SSH_KEY` | Your private SSH key | Run `cat ~/.ssh/hostinger_deploy \| pbcopy` in Terminal |
| `HOSTINGER_HOST` | `<hostinger-server-ip>` | Your Hostinger server IP |
| `HOSTINGER_USER` | Your Hostinger SSH username | hPanel → SSH Access |

**How to add secrets to a repo:**
1. Go to your repo on github.com
2. Click **Settings** (top nav of the repo, not your account)
3. Click **Secrets and variables → Actions** in the left sidebar
4. Click **New repository secret**
5. Enter the name exactly as shown above (case sensitive)
6. Paste the value
7. Click **Add secret**
8. Repeat for all three

---

## Reference — Main Branch Ruleset

Apply this to every new repo after pushing the first commit.

**YOU DO:**
1. Go to your repo on github.com
2. Click **Settings → Rules → Rulesets** in the left sidebar
3. Click **New ruleset → New branch ruleset**
4. Name: `main protection`
5. Enforcement status: **Active**
6. Target branches: click **Add target → Include by pattern** → type `main`
7. Under Rules, enable:
   - **Restrict deletions** ✅
   - **Require a pull request before merging** — click **Hide additional settings** to expand, then set **Required approvals** dropdown to **0** (solo-friendly: protects against accidents but doesn't require self-review)
   - **Block force pushes** ✅
8. Click **Create**

⚠️ **Always verify after saving:** Go back into the ruleset and confirm Required approvals shows **0**, not **1**. Claude Code has been observed setting this to 1 when applying the ruleset automatically, which will block you from merging your own PRs. If it shows 1, change it to 0 and save again.

---

## Reference — Preview Deployments (NEW in v1.6)

Every PR opens a live preview at a real URL on your Hostinger server. You review the actual rendered site — desktop and mobile — not screenshots.

**The mechanism:**
- A `.github/workflows/preview-deploy.yml` workflow lives in every project (created during scaffold)
- It triggers on PR `opened`, `synchronize`, and `reopened`
- Builds the project and rsyncs the output to `~/domains/[domain]/public_html/_previews/[pr-number]/`
- A second job posts a comment on the PR with the URL: `https://[domain]/_previews/[pr-number]/`
- A cleanup workflow runs on PR `closed` (merged or not) and `rm -rf`s the preview directory
- A `robots.txt` deployed alongside the preview blocks search indexing

**How you use it:**
1. PR opens → Claude Code immediately prints the predicted preview URL in chat, then runs `gh run watch` to confirm the deploy succeeded
2. Cmd-click the URL in your terminal/Claude Code chat to open it on desktop (no GitHub round-trip needed)
3. Copy the URL → paste into iMessage to your own phone for mobile review (macOS Universal Clipboard makes this seamless if both devices are signed into the same Apple ID)
4. Resize the desktop browser to spot-check breakpoints between 360 and 1440

The bot still posts a sticky comment on the PR itself as a permanent record, but the chat is your primary surface — you should never have to switch to GitHub to find a URL.

**Snapshots travel with the PR too.** The preview-deploy workflow disappears on merge, but the PR description still embeds the four breakpoint PNGs from `/previews/[section-name]/` as a permanent record of what shipped.

**Caveats:**
- **Base paths.** A site built for `/` won't work served from `/_previews/42/` if assets use absolute paths. Next.js: set `basePath` from a `BASE_PATH` env var. HTML+CSS with relative paths: just works. The Step 9 build prompt instructs Claude to handle this.
- **Domain required.** Previews only work after Step 5 is done and the domain resolves. Pre-domain sprints fall back to screenshots-only.
- **Public URLs.** Previews are publicly reachable. Fine for studio work; for client NDA work, add HTTP basic auth to `_previews/` via `.htaccess`.
- **Disk usage.** Each preview is one full build. The cleanup workflow handles this — but if a workflow ever fails to run, SSH in and `rm -rf ~/domains/[domain]/public_html/_previews/` periodically.

---

## Reference — Visual Snapshots

Every sprint also produces rendered screenshots for the PR description. These are the historical record after the live preview is torn down.

The mechanism:
- A `scripts/preview.mjs` Playwright script lives in every project (created during scaffold)
- It builds the project, serves the static output, captures PNGs at **360, 768, 1024, 1440**, and tears the server down
- Output lands in `/previews/[sprint-name]/` and is committed to the PR
- The PR description embeds those screenshots inline

**Dark mode:** if dark mode is in scope per Step 7, the script captures both light and dark — 8 PNGs per sprint, not 4.

**Motion / hover states:** static PNGs miss these. The live preview URL is the primary tool for reviewing motion. For motion-heavy sprints you also want a permanent record of, extend the preview script to capture a short Playwright trace or 5-second video alongside the stills.

**First-time install:** Playwright pulls ~300MB of browser binaries. Pin versions in `package.json` so the cache reuses across projects.

---

## Reference — Goal Mode (`/goal`) (NEW in v1.8)

A slash command in Claude Code 2.1.139+ that sets a session-scoped completion condition. After every turn, [Haiku evaluates](https://code.claude.com/docs/en/goal) whether the condition holds against the conversation transcript. If not, Claude takes another turn. If yes, the goal clears and control returns to you. Boris Cherny describes it as ["the Ralph loop built into Claude Code"](https://howborisusesclaudecode.com/) — a packaged version of a pattern engineers were hand-rolling with custom Stop hooks.

**Use it for verifiable-end-state work where you'd otherwise be hitting Return after every turn:**
- **Step 4 scaffold** — strong fit. Clear pass/fail conditions, no creative judgment.
- **Step 9 build sprints** — selective fit. **Only set `/goal` after the sprint contract is approved**, never before. Setting it before approval will cause Claude to push past your contract gate.
- **Long-running maintenance** outside the sprint loop — dep upgrades, accessibility audits, image optimization passes, full-site migrations. Not part of this guide, but worth knowing it exists.

**Do NOT use it for:**
- **Step 10 Evaluator.** The evaluator is single-pass by design. A `/goal` here would loop the evaluator on itself, defeating the point of an independent audit.
- **Any sprint with an ambiguous contract.** `/goal` amplifies the contract — if the contract is fuzzy, you'll loop fuzziness.
- **Pre-domain projects** where Step 9 falls back to screenshots only — the preview-URL conditions won't be reachable.

**The turn-cap rule.** Always include `or stop after N turns` in every goal you set. `/goal` has no native budget cap; the turn clause is your only brake. Start with 8 turns for scaffolds, 15 for sprints, and adjust based on observed runs.

**Conditions the evaluator can actually verify.** Haiku reads the transcript only. It doesn't run commands or read files. Write conditions Claude's own output can demonstrate — exit codes printed, files listed by `ls`, URLs surfaced in chat. "Tests pass" is unverifiable unless Claude actually runs the tests and the result lands in the transcript.

**Status, clearing, resuming.**
- `/goal` with no argument shows turns spent, tokens spent, and the last evaluator reason
- `/goal clear` ends the goal early; `/clear` (new conversation) also clears it
- A goal that's still active when you exit Claude Code restores on `--resume`, but the turn and token counters reset

**Pairs with Agent View.** If you ever run multiple sprints in parallel (e.g. two feature branches via git worktrees), run `claude agents` in a separate terminal to see all sessions' goal status at a glance.

**Requirements.** Trusted workspace (Yes when prompted on first launch) and the default hooks system enabled. `/goal` is unavailable if `disableAllHooks` is set.

**What does not change.** `/goal` does not replace any approval gate in this guide. The sprint contract gate, the live preview gate, the Evaluator report gate, the PR merge gate, and the Figma promotion gate all stay manual. `/goal` only collapses the per-turn back-and-forth *within* a phase you've already authorized.

---

## Reference — Agent View (`claude agents`) (NEW in v1.9)

A CLI feature in Claude Code 2.1.139+ that opens [one screen for every background session](https://code.claude.com/docs/en/agent-view) on your machine — running, waiting for input, completed, or failed. Dispatch new sessions from the bottom input, peek at any row with `Space`, reply inline, or attach with `Enter`. Sessions run as detached processes under a per-user supervisor, so closing the terminal doesn't kill them.

This is the productized version of Boris Cherny's [numbered-terminal-tabs workflow](https://newsletter.pragmaticengineer.com/p/building-claude-code-with-boris-cherny) — one screen replaces the tmux grid. It pairs naturally with the Generator/Evaluator pattern in this guide because you already run two sessions per sprint; Agent View just puts them in the same view with status indicators.

**Use it for:**
- **Step 9 (Generator).** Dispatch as a background session with `claude --bg "<prompt>"` instead of foregrounding a second terminal. The build is long-running and doesn't need babysitting — combined with `/goal`, you only attach when the row turns green or red.
- **Step 10 (Evaluator).** Run as a second background session pointed at the same repo. Agent View groups by state so you see "Working" on the Generator and "Needs input" on the Evaluator at a glance.
- **Parallel sprints across projects.** Press `Ctrl+S` to group by directory. You can run a sprint on the studio site and a copy refresh on a client site simultaneously, each in its own row. Cap at 2–3 in parallel — your review capacity is the bottleneck, not Claude's throughput.

**Do NOT use it for:**
- **Single-session sprints where you're actively iterating.** If you're going turn-by-turn on creative direction, just run `claude` in the foreground. Agent View is for work you can leave alone.
- **The Evaluator if you've already started it foreground.** Don't background it mid-audit; the single-pass nature is the point.

**The worktree rule (important for our stack).** Sessions dispatched from Agent View are blocked from writing files until they move into an isolated git worktree under `.claude/worktrees/`. Claude handles this automatically. The catch: **deleting a session deletes the worktree**. If you abandon a sprint before merging, the work is gone. Merge or push the branch before pressing `Ctrl+X Ctrl+X` on a row.

**Hostinger preview cleanup gotcha.** Our preview-cleanup workflow (Step 5) only runs on PR `closed`. If you delete an Agent View session for a sprint whose PR you never opened or closed, the worktree disappears but no preview directory exists to clean. Fine. But if you abandon a sprint *after* the PR opened — and never close the PR — the preview directory stays on Hostinger indefinitely. Either close the PR or SSH in and `rm -rf ~/domains/[domain]/public_html/_previews/[pr-number]/` manually.

**The mobile-review gap.** Agent View is local-only. Sessions don't sync to your iPhone or to the Claude mobile app. Mobile review of preview URLs via iMessage still works exactly as before, but you can't check agent status from your phone.

**Rate limits apply per session.** Running 5 parallel agents burns your Max quota 5× faster. Worth knowing before you dispatch a sprint, the Evaluator, and a maintenance pass all at once.

**Recovery after sleep.** Background sessions stop when your Mac sleeps or shuts down. Run `claude respawn --all` to restart them from where they left off.

**Requirements.** Claude Code v2.1.139 or later (check with `claude --version`). Disabled if `disableAgentView` is set or `CLAUDE_CODE_DISABLE_AGENT_VIEW` is in your env.

**What does not change.** Agent View does not replace any approval gate. Sprint contract, live preview review, Evaluator report, PR merge, Figma promotion — all still manual. Agent View only consolidates session visibility and reduces terminal-tab clutter.

---

## Step 1 — Write Your Brief

**Where you are:** Anywhere — notes app, paper, this chat

**YOU DO:** Write 1–4 sentences answering:
- What is this site for?
- Who is the visitor?
- What do they need to do or understand?
- What makes this different from every other site in this category?

Keep it short. The Planner expands it into a full spec — your job is direction, not detail.

**Example:**
> The Shokunin Crafthouse LLC website. Our studio's public face — potential clients are startups and founders. They need to understand who we are, see our work, and want to hire us. It should feel like a product, not a brochure, and win FWA.

**Optional — PROMPT CLAUDE** (if you have rough notes but can't get it tight):

Open [claude.ai](https://claude.ai) → your studio project → new chat, and paste:

```
I'm starting a new project and need help sharpening my brief to 1–4 sentences.

Here are my rough notes: [paste your notes]

Apply the Shokunin Crafthouse lens — the brief should define who the visitor 
is, what they need to accomplish, and what makes this different. No fluff. 
Give me 2–3 brief options to choose from.
```

---

## Step 2 — Run the Planner

**Where you are:** claude.ai → The Shokunin Crafthouse project → new chat

**Important:** studio-memory.md must be uploaded to this project's knowledge before running the Planner. If you haven't done this yet:
1. Click the project name in the left sidebar
2. Click **Project knowledge → Add content**
3. Upload `studio-memory.md` from `~/Projects/shokunin-crafthouse/studio-memory/`
4. It stays there permanently — you only do this once per project

**PROMPT CLAUDE:**

```
You are the Planner agent for The Shokunin Crafthouse. 
Read studio-memory.md from project knowledge.

My brief: [your 1–4 sentences from Step 1]

Produce a complete product spec including:
1. Project overview and purpose
2. Complete deliverables list (all pages or pieces)
3. Design direction referencing the 7 Shokunin principles
4. Technical stack and architecture decisions
5. Sprint breakdown — 3–6 sprints, each a self-contained deliverable
6. Success criteria per sprint — specific and testable, not vague

Be ambitious. Look for opportunities where AI-native features would 
serve the product. Do not over-specify implementation — let the 
Generator figure out the path.
```

**YOU DO:** Read the spec carefully. Edit anything you disagree with. This is your creative direction — the Generator follows it exactly. Do not move to Step 3 until you're satisfied with the spec.

---

## Step 3 — Create the Figma File

**Where you are:** figma.com (browser or desktop app)

Figma MCP cannot create files — this is always manual.

**YOU DO:**
1. Open [figma.com](https://figma.com) and sign in with your Figma Pro account
2. Click **New design file** (the + button or from your drafts)
3. Double-click the file name at the top and rename it to your project name
4. You'll see one default page called "Page 1" — rename it by double-clicking:
   - Page 1 → `Sandbox`
5. Add three more pages by clicking the **+** next to the pages panel:
   - `Brand System`
   - `Components`
   - `Production — [primary deliverable]` (e.g. "Production — Homepage")
6. Copy the file URL from your browser address bar — you'll need this in Step 4

---

## Step 4 — Scaffold the Project

**Where you are:** Claude Code desktop app OR Terminal

**If using Terminal:**
```bash
cd ~/Projects/shokunin-crafthouse
claude
```

**Important — read before pasting anything:**
- When Claude Code asks "Is this a project you trust?" — select **Yes, I trust this folder**. This is safe because it's your own projects folder.
- Wait for the `>` prompt to appear before pasting the scaffold prompt below.
- Claude Code may launch a setup wizard if it detects a new session. If it does, answer its questions (project type: Site, branch protection: Solo-friendly) and let it finish — then paste the scaffold prompt.
- Do not paste the scaffold prompt into the wizard fields. Wait for the `>` prompt.

**Tip:** Set up the `sc` shortcut so Terminal always opens Claude Code in the right folder:
```bash
echo 'alias sc="cd ~/Projects/shokunin-crafthouse && claude"' >> ~/.zshrc
source ~/.zshrc
```
After this, just type `sc` to start every Claude Code session from the right place.

**Also set up a project-specific alias every time you scaffold a new project (do this once per project):**
```bash
echo 'alias [shortname]="cd ~/Projects/shokunin-crafthouse/[repo-name] && claude"' >> ~/.zshrc
source ~/.zshrc
```
Replace `[shortname]` with a 2–3 letter shortcut (e.g. `cq` for copper-and-quarts, `sc` is already taken for the studio root). After this, type your shortcut to open Claude Code directly in that project — no navigating required.

You cannot navigate between folders inside a running Claude Code session. Always close (`Ctrl+C` or `/exit`) and relaunch from the correct folder using your alias.

**PROMPT CLAUDE** (paste after the `>` prompt appears):

```
Scaffold a new Shokunin Crafthouse project called [project name].

1. Clone the workspace template from 
   ~/Projects/shokunin-crafthouse/studio-memory/templates/project-template/
   into a new folder called [repo-name]
2. Create a new private GitHub repo called [repo-name] under 
   the shokunin-crafthouse org
3. Populate WORKSPACE.md with:
   - Project name: [project name]
   - Purpose: [1 sentence]
   - Client: [client name] or "Internal — Shokunin Crafthouse"
   - Primary deliverable: [e.g. "Wedding website with RSVP"]
   - Tech stack: [e.g. "Next.js, Tailwind, Hostinger shared hosting"]
   - Key design constraints: [paste from your brief]
   - Production domain: [domain or "TBD — previews disabled until set"]
4. Add the Figma file URL to _config/design-system/figma-links.md: 
   [paste Figma URL from Step 3]
5. Fetch Figma file metadata via MCP to confirm all four pages exist:
   Sandbox, Brand System, Components, Production
6. Create a PR build check workflow at .github/workflows/pr-check.yml
   that runs `npm ci && npm run build` on pull_request events targeting main.
   This is separate from the deploy workflows — it validates the build only.
7. Add Playwright as a dev dependency and create scripts/preview.mjs that:
   - Accepts a sprint name as its only argument
   - Builds the project to its static output directory
   - Serves the build on a local port
   - Captures full-page screenshots at viewports 360, 768, 1024, and 1440
   - Saves PNGs to /previews/[sprint-name]/ as 360.png, 768.png, etc.
   - If dark mode is in scope, captures both modes (8 PNGs total)
   - Tears the server down on completion or failure (use try/finally)
   Add an npm script: "preview": "node scripts/preview.mjs"
   Pin Playwright browser versions in package.json so the cache reuses
   across projects.
8. Track /previews/ in the repo (do NOT add it to .gitignore) so 
   screenshots travel with their PRs.
9. Initialize git, commit everything, and push to main on GitHub

Report the GitHub URL when done.
```

**Optional — set a goal for unattended scaffolding (NEW in v1.8):**

Immediately after pasting the prompt above, you can set a `/goal` so Claude works through all 9 scaffold tasks without you hitting Return between them. Paste this as your next message:

```
/goal scaffold complete when:
- Git repo cloned from the project template and initialized
- WORKSPACE.md populated with all required fields
- _config/design-system/figma-links.md contains the Figma URL
- Figma MCP has confirmed all 4 pages exist (Sandbox, Brand System, Components, Production)
- .github/workflows/pr-check.yml exists
- scripts/preview.mjs exists with the npm "preview" script wired up
- Playwright browser versions pinned in package.json
- /previews/ is NOT listed in .gitignore
- First commit has been pushed to main on the new GitHub repo
- The GitHub repo URL has been printed in chat
or stop after 10 turns
```

Watch the `◎ /goal active` indicator. When it clears, the GitHub URL will be in the transcript.

**YOU DO after Claude finishes:**
- Go to the GitHub repo URL Claude reports
- Apply the main branch ruleset (see Reference section at top of this guide)

---

## Step 5 — Set Up Deploy and Preview Workflows

**Skip this step if:** you don't have a domain or Hostinger hosting set up for this project yet. Come back when you're ready to go live. Sprints in Step 9 will fall back to screenshots-only without live preview URLs.

**Where you are:** Two places — GitHub (browser) and Claude Code

**Part A — Add GitHub secrets (YOU DO in browser):**

Follow the secrets cheatsheet at the top of this guide. Add all three secrets to the new repo. The values are identical to every other project — you're just adding them to this specific repo.

**Part B — Create the deploy and preview workflows (PROMPT CLAUDE in Claude Code):**

Make sure you're in the project folder first:
```bash
cd ~/Projects/shokunin-crafthouse/[repo-name]
```

Then paste:

```
Create three GitHub Actions workflows for this project. The domain for 
this project is: [your domain]

WORKFLOW 1 — Production deploy
File: .github/workflows/deploy.yml
- Trigger: push to main branch
- Action: burnett01/rsync-deployments@7.0.1
- Switches: -avzr --delete
- remote_host: ${{ secrets.HOSTINGER_HOST }}
- remote_port: 65002
- remote_user: ${{ secrets.HOSTINGER_USER }}
- remote_key: ${{ secrets.HOSTINGER_SSH_KEY }}
- remote_path: ~/domains/[your domain]/public_html/

WORKFLOW 2 — PR preview deploy
File: .github/workflows/preview-deploy.yml
- Trigger: pull_request, types [opened, synchronize, reopened], 
  targeting main
- Steps:
  a) Checkout the PR head
  b) Setup Node 20, npm ci
  c) Build the project with BASE_PATH=/_previews/${{ github.event.pull_request.number }}
     set as an environment variable so absolute asset paths resolve correctly
  d) Write a robots.txt with "User-agent: *\nDisallow: /" into the build 
     output root before rsync
  e) Use burnett01/rsync-deployments@7.0.1 with same secrets as above, 
     but remote_path: ~/domains/[your domain]/public_html/_previews/${{ github.event.pull_request.number }}/
     Switches: -avzr --delete
  f) Use actions/github-script@v7 to post (or update) a sticky PR comment 
     containing the preview URL: 
     https://[your domain]/_previews/${{ github.event.pull_request.number }}/
     Format the comment so it's visually distinct — include a 🔗 icon, 
     bold "Preview ready", the URL as a clickable link, and a one-line 
     hint that the same URL can be opened on mobile.
     Use a marker comment to detect and update the existing sticky 
     comment on subsequent pushes rather than creating duplicates.

WORKFLOW 3 — PR preview cleanup
File: .github/workflows/preview-cleanup.yml
- Trigger: pull_request, types [closed], targeting main
- Steps:
  a) Use appleboy/ssh-action@v1 with the same Hostinger secrets
  b) Run: rm -rf ~/domains/[your domain]/public_html/_previews/${{ github.event.pull_request.number }}/
  c) Post a comment on the PR confirming the preview was torn down

For Next.js projects: also update next.config.js to read basePath and 
assetPrefix from process.env.BASE_PATH (defaulting to ''), so the same 
build runs unmodified at the root in production and at /_previews/[N]/ 
in previews.

For HTML+CSS projects: ensure all asset paths are relative (./images/ 
not /images/). If any absolute paths exist, fix them now.

Commit all three workflow files plus any framework config changes to 
a new branch called add-deploy-and-preview-workflows, and push to GitHub.
```

**Note:** The PR build check workflow (`.github/workflows/pr-check.yml`) was already created during Step 4 scaffolding. These three new workflows are separate — production deploy on merge, preview deploy on PR open, preview cleanup on PR close.

**YOU DO after Claude pushes:**
1. Go to your repo on github.com
2. Look for a yellow banner at the top — click **Compare & pull request** if you see it
3. If no banner appears, click the **Pull requests** tab → **New pull request** → set base to `main` and compare to `add-deploy-and-preview-workflows` → click **Create pull request**
4. **Verify the preview workflow itself works.** Back in Claude Code, paste:

```
The setup PR is now open. Capture the PR number with 
`gh pr view --json number -q .number`, compute the preview URL as 
https://[your domain]/_previews/[that number]/, and print it in chat 
prominently so I can click it directly from here.

Then run `gh run watch --exit-status` against the preview-deploy 
workflow run for this PR and report when it finishes.

If the workflow succeeds: confirm with the URL again and tell me to 
click it to verify a placeholder page renders.

If the workflow fails: run `gh run view --log-failed` and show me 
the relevant error so we can fix it before merging.
```

5. Cmd-click the URL Claude prints, confirm a placeholder page renders. If the URL 404s, the rsync target path is wrong — check the workflow file.
6. Click **Merge pull request → Confirm merge**
7. Go to the **Actions** tab — production deploy and preview cleanup will both run
8. Wait for the green checkmarks — pipeline is live

---

## Step 6 — Explore Visual Direction in Claude Design

**Where you are:** claude.ai → Claude Design (paint palette icon in the left sidebar)

Do this before opening Figma. Claude Design runs on a separate weekly budget — it doesn't touch your Max token allowance. Open it and attach your studio-memory.md and any reference images before pasting the prompts.

**PROMPT CLAUDE DESIGN** (Direction 1 — your instinct):

```
I'm designing [what the site is] for [who the visitor is].

WHAT'S LOCKED
[list anything already decided — colors, illustration style, etc.
If nothing is locked, say "Nothing locked — full exploration."]

WHAT NEEDS EXPLORING
[list what's still open — typography, layout language, illustration 
style, graphic details, etc.]

BRIEF
[paste your 1–4 sentence brief]

Apply Shokunin Crafthouse design principles from studio-memory.md: 
one clear point of view, restraint as a creative act, originality 
over safety, no template layouts.

Generate Direction 1: your interpretation of this brief taken somewhere 
unexpected — a choice a principal designer would look at and see intent. 
Use real typography, real color. No generic gradients, no stock 
illustration style, no purple-on-white card layouts.
```

**PROMPT CLAUDE DESIGN** (Direction 2 — the opposite):

```
Generate Direction 2 for the same project.

Direction 1 was [describe it in one sentence]. Direction 2 should be 
its opposite — if Direction 1 leaned warm and expressive, Direction 2 
should be cool and architectural. If Direction 1 was organic, Direction 2 
should be precise. Same brief, completely different point of view. 
Same locked constraints.

Show the same type of layout. Real typography, real hierarchy. A choice 
a principal designer would recognize as deliberate.
```

**YOU DO:**
- Apply your Shokunin filters to both directions:
  - Does it have a point of view, or could it be for anyone?
  - Does it practice restraint, or is it doing too much?
  - Could it have come from a template?
- Pick one direction — or prompt for a third that combines elements
- Save your chosen direction: in Claude Design, use the download/export button to save the output, then move it into `stages/02-design/claude-design/` in your local project folder

Note: Claude Design output informs what you build in Figma — it does not feed directly into Claude Code. The exploration ends here. The brand system in Figma (Step 7) is where the decisions get formalized.

---

## Step 7 — Build the Brand System in Figma

**Where you are:** First in claude.ai (chat), then in Figma

**Part A — Get your brand system checklist and copy (PROMPT CLAUDE in claude.ai project chat):**

```
Read the approved product spec. [paste spec or attach file]

Before I open Figma, give me two things:

1. BRAND SYSTEM CHECKLIST — what specifically do I need to define in 
   Figma for this project? List:
   - Color token names I should create (not hex values — I'll pick those)
   - Type scale stops I'll need (display, heading sizes, body, labels, captions)
   - Spacing scale stops
   - Component list for this specific site
   Be specific to this project, not a generic list.

2. COPY FOR MOCKUPS — write production-intent copy for every text 
   element on [primary page — e.g. homepage]:
   - Headline, subheadline, all body copy sections
   - All CTA button labels
   - Navigation labels
   - Footer copy
   Write it as if it's shipping tomorrow. No lorem ipsum. 
   Tone: [describe or paste from _config/voice/]
```

**Part B — Build the brand system in Figma (YOU DO):**

1. Open your Figma file → go to the **Sandbox** page
2. Use Claude's checklist to build:
   - Color styles (name them as tokens — no raw hex in designs)
   - Text styles (set up the full type scale)
   - Spacing guide frame
   - Base components
3. Paste Claude's copy directly into your mockup frames — no placeholders
4. Rules:
   - Solve type before anything else — changing typefaces later is a redesign
   - No raw hex anywhere — every color must be a named token
   - Dark mode: either fully designed or formally deferred — log the decision in decisions/decisions.md

Stay on the Sandbox page until you're satisfied. Nothing moves to Brand System or Components pages until you've approved it.

**Part C — Extract tokens to token-map.md (PROMPT CLAUDE):**

If running this in **Claude Code** — Claude will create and save the file directly to your project folder.

If running this in **claude.ai chat** — Claude will generate the content for you to copy. You'll need to paste it into a new file at `_config/design-system/token-map.md` manually using any text editor.

Recommended: run this in Claude Code for automatic file creation.

```
The brand system on the Figma Sandbox page is approved. 
Read the Figma file using Figma MCP: [paste Figma file URL]

Extract from the Sandbox page:
1. All color styles and their hex values
2. Typography styles and their full properties 
   (family, size, weight, line height, letter spacing)
3. Any component variants defined

Save as token-map.md in _config/design-system/ in the current project folder.

This file is the source of truth for all implementation. No color, 
font, or spacing value gets used in code unless it's in this file.
```

**YOU DO:** Open `_config/design-system/token-map.md` in your local project folder (use Finder or any text editor). Read through it and confirm the values match what you built in Figma. Fix anything before moving on.

---

## Step 8 — Design Pages in Figma Sandbox

**Where you are:** Figma → Sandbox page

**YOU DO:** Design your actual pages using the approved brand system.

Rules:
- Design one section or page at a time — don't design everything before building anything
- Every breakpoint is designed, not assumed — 360px, 768px, 1024px, 1440px
- Every interactive element has all five states: default, hover, focus, active, disabled
- Write real copy in all frames — use what Claude wrote in Step 7
- Motion decisions are written in decisions/decisions.md, not just prototyped
- Dark mode: either fully designed or formally deferred — log it

When a section or page is ready to build, move to Step 9.

---

## Step 9 — Build Each Section (Sprint Loop)

**Where you are:** Claude Code desktop app or Terminal, launched from inside the project folder

Claude Code sessions are tied to the folder they were launched from — you can't navigate between folders once it's running. Always launch from inside the project folder.

In Terminal:
```bash
cd ~/Projects/shokunin-crafthouse/[repo-name]
claude
```

Or add a project-specific alias (optional):
```bash
# Add to ~/.zshrc — replace with your actual project folder name
alias cq="cd ~/Projects/shokunin-crafthouse/copper-and-quarts && claude"
```

Then just type `cq` (or whatever alias you chose) to open Claude Code directly in that project.

**Optional — dispatch as a background session (NEW in v1.9):**

If you don't need to iterate with the Generator turn-by-turn, dispatch it to the background and check on it via Agent View. Two ways:

```bash
# From inside the project folder:
claude --bg "[paste the full prompt below]"
```

Or, if you already have an interactive Claude Code session open, run `/bg` inside it to send the current session to the background. Either way, open `claude agents` in another terminal to see the row update as the sprint progresses.

When dispatched this way, Claude auto-isolates the session in `.claude/worktrees/[name]/` — your main working directory stays untouched. **Reminder:** deleting the session deletes the worktree. Merge or push before pressing `Ctrl+X Ctrl+X` on the row.

**PROMPT CLAUDE** (paste after the `>` prompt, or use as the `claude --bg` argument):

```
/caveman

Read WORKSPACE.md, ~/Projects/shokunin-crafthouse/studio-memory/studio-memory.md, 
and _config/design-system/token-map.md before anything else.

Using Figma MCP, read the [section or page name] frames on the Sandbox 
page of this Figma file: [paste Figma URL]

Before writing any code:
1. Propose a sprint contract — exactly what you will build and the 
   specific criteria I will use to verify it's complete
2. Stop and wait for my approval of the contract
3. Only begin implementation after I confirm

Implementation requirements:
- Framework: [Next.js / HTML+CSS / React — pick one]
- All values must come from token-map.md — do not invent any color, 
  font, or spacing not in that file
- Mobile-first, all four breakpoints: 360, 768, 1024, 1440
- Asset paths must work both at root (production) and at a subpath 
  (PR previews). Use relative paths or read BASE_PATH from env. 
  Do NOT hardcode absolute asset paths like /images/foo.png.

When complete:
- Run `npm run preview [section-name]` to generate snapshot screenshots 
  at all four breakpoints into /previews/[section-name]/
- Verify the screenshots actually rendered the section — if any are blank, 
  blocked by errors, or showing a fallback state, fix the build before 
  doing anything else
- Create a feature branch called feat/[section-name] where [section-name] 
  is the section or component you just built in kebab-case 
  (e.g. feat/homepage-hero, feat/rsvp-form, feat/navigation, feat/about-section)
- Open a PR. Format the description in this exact order:
    1. One-paragraph summary of what was built and any decisions made
    2. A "## Live Preview" heading — leave a placeholder note saying 
       "URL will appear in a sticky comment below within ~30 seconds"
    3. A "## Snapshots" heading with the four breakpoint images embedded:
        ![360](previews/[section-name]/360.png)
        ![768](previews/[section-name]/768.png)
        ![1024](previews/[section-name]/1024.png)
        ![1440](previews/[section-name]/1440.png)
- Immediately after opening the PR, surface the preview URL in our chat 
  so I don't have to switch to GitHub to find it:
    a) Capture the PR number: gh pr view --json number -q .number
    b) Read the production domain from WORKSPACE.md
    c) Print this exact line in chat (no extra wrapping): 
       📱 Preview URL: https://[domain]/_previews/[pr-number]/
       (One line, raw URL — so my terminal renders it as cmd-clickable.)
    d) Run: gh run watch --exit-status \
              --workflow=preview-deploy.yml \
              $(gh run list --branch feat/[section-name] \
                            --workflow=preview-deploy.yml \
                            --limit 1 --json databaseId -q '.[0].databaseId')
       to block on the preview deploy
    e) When the run finishes, print one of:
       - On success: ✅ Preview deployed — open the URL above
       - On failure: ❌ Preview deploy failed. Followed by output of 
         gh run view --log-failed for the failed run, so I can see 
         the error without leaving Claude Code.
- Stop and wait — do not proceed to the next section without my approval
```

**YOU DO:** Read the sprint contract Claude proposes. Approve it or send back changes. Do not let Claude start coding until you've confirmed the contract in writing.

**Optional — set a goal after contract approval (NEW in v1.8):**

Once you've approved the contract in writing, you can set a `/goal` so Claude works the sprint through to a ready-to-review PR without you hitting Return between each turn (build → screenshots → PR → URL → workflow watch). Skip this if the contract has any ambiguity — `/goal` amplifies the contract, and looping a fuzzy contract just produces fuzzier output faster.

Paste this as your next message immediately after approving:

```
/goal sprint [section-name] complete when:
- Every acceptance criterion in the approved sprint contract is met
- `npm run build` exited 0 in the transcript
- `npm run preview [section-name]` exited 0 and /previews/[section-name]/
  contains 4 PNGs (or 8 if dark mode is in scope)
- Every PNG has been visually verified to show the rendered section,
  not a blank page or fallback state
- A feature branch feat/[section-name] has been pushed
- `gh pr create` has succeeded and the PR URL is in the transcript
- The PR description follows the required format (summary,
  Live Preview heading, Snapshots heading with 4 embedded images)
- The line "📱 Preview URL: https://[domain]/_previews/[N]/" has been
  printed in chat as a raw URL on its own line
- `gh run watch --exit-status` on preview-deploy.yml returned ✅
or stop after 15 turns
```

This goal is reached the moment the preview deploys cleanly. From that point your normal approval gates take over — desktop review, phone review, Evaluator session, PR merge. `/goal` does not bypass any of them.

If `gh run watch` returns ❌, Claude will dump the failure logs and the goal stays active. Either let Claude fix and retry within the turn cap, or run `/goal clear` and debug manually.

When the PR opens:
1. Claude Code prints `📱 Preview URL: https://[domain]/_previews/[N]/` directly in your chat — cmd-click it to open on desktop
2. Claude Code blocks on `gh run watch` and prints ✅ or ❌ when the workflow finishes (~30s). If ❌, the failure logs are in your chat — fix and push, no GitHub round-trip needed
3. Once ✅ appears: copy the URL → paste into iMessage to your phone (or use macOS Universal Clipboard) for mobile testing
4. Resize your desktop browser to spot-check 360, 768, 1024, 1440 breakpoints
5. The four snapshot images in the PR description are your permanent record — they'll still be there after the preview is torn down on merge

If the live preview looks right, move to Step 10. If it doesn't, send the fixes back to Claude Code without merging — each new push to the branch updates the same preview URL automatically (Claude Code will re-watch the workflow and reprint ✅/❌).

---

## Step 10 — Evaluate Each Sprint

**Where you are:** New Claude Code session (open a new terminal tab, restart Claude Code, or dispatch a background session via Agent View)

**Do not set a `/goal` in this session.** The Evaluator is single-pass by design — it reads, grades, and reports. A `/goal` here would loop the evaluator on itself, which defeats the point of an independent audit.

Start a fresh session so the Evaluator isn't biased by the build session:
```bash
cd ~/Projects/shokunin-crafthouse/[repo-name]
claude
```

**Or — dispatch via Agent View (NEW in v1.9):**

```bash
# From inside the project folder, no worktree needed (Evaluator is read-only):
claude --bg "[paste the Evaluator prompt below]"
```

Then run `claude agents` in any terminal to watch the Generator and Evaluator rows side by side. The Evaluator doesn't write files, so Agent View's auto-worktree behavior is harmless here — the read-only audit runs against the project root.

**PROMPT CLAUDE:**

```
/caveman

You are the Evaluator for The Shokunin Crafthouse.
Read WORKSPACE.md and ~/Projects/shokunin-crafthouse/studio-memory/studio-memory.md first.

The Generator just completed Sprint [N].

Sprint contract was: [paste the exact contract Claude proposed in Step 9]
Live preview URL: [paste the URL from the bot comment on the PR]

Evaluation order:
1. First, open /previews/[section-name]/ and grade design quality, craft,
   originality, and functionality from the snapshot images across breakpoints.
   These are the canonical visual surface — what a real visitor would experience.
2. Second, fetch the live preview URL to confirm: the page returns 200, copy
   matches the snapshots, asset paths resolve, and there is no obvious structural
   breakage in the raw HTML. Note: WebFetch returns text only — it cannot render
   the page visually. Do not use it to grade any visual criterion.
3. Third, read the code to verify token discipline (every color, font, spacing
   value comes from token-map.md), accessibility patterns, and that asset paths
   work both at root and under /_previews/[N]/.

Do NOT spin up a local dev server. The live preview URL is already
running on Hostinger. If snapshots are missing or incomplete, flag it
and request them before proceeding — do not attempt to substitute live
fetch as a visual reference.

Grade against our 4 criteria:
1. Originality — deliberate creative decisions, no AI default patterns
   (score out of 10) [snapshot-driven]
2. Design Quality — coherent whole, distinct mood, not a template
   (score out of 10) [snapshot-driven]
3. Craft — typography, spacing, color harmony, contrast ratios
   (REQUIRED PASS — cannot ship with craft failures)
   [snapshots for typography/spacing/harmony; code for contrast ratios]
4. Functionality — users can complete tasks without confusion
   (REQUIRED PASS — cannot ship with broken flows)
   [snapshots for UX flows; code for structural correctness]

Be skeptical. Uncertainty = fail. Do not praise mediocre work.

Output:
- Score and specific finding for each criterion
- PASS (ready to merge) or FAIL (list exact fixes required before merging)
```

**YOU DO:**
- Read the report
- Cross-check against your own desktop + mobile review of the live preview
- If PASS and you agree visually → go to Step 11
- If FAIL or you have your own feedback → tell Claude Code the specific fixes needed. Each push to the branch auto-updates the same preview URL — no need to refresh anything.

---

## Step 11 — Merge and Deploy

**Where you are:** github.com (browser), then Figma

**Part A — Merge the PR (YOU DO in browser):**
1. Go to your repo on github.com
2. Click the **Pull requests** tab
3. Open the PR Claude created
4. Final review: visit the live preview URL one more time, on desktop and phone
5. If satisfied — click **Merge pull request → Confirm merge**
6. Click the **Actions** tab — you'll see the production deploy and the preview cleanup workflows both run
7. Wait for the green checkmarks — your changes are live on Hostinger and the preview path has been torn down

**AUTOMATED:** GitHub Actions runs rsync to production → site updates within ~30 seconds of merge. The preview cleanup workflow `rm -rf`s the preview directory in parallel.

**Part B — Promote in Figma (YOU DO):**
1. Open your Figma file → go to the **Sandbox** page
2. Select the frames you just shipped
3. Copy them to the appropriate **Production** page
4. This is always manual — Claude does not write to your Figma files

---

## Step 12 — Repeat Steps 8–11 for Each Section

Design one section → build it → evaluate → merge → promote in Figma.

One section at a time. Do not design everything before building anything.

---

## Step 13 — Update Studio Memory

**Where you are:** Claude Code

Run this after the project ships:

```
Update the studio memory file at:
~/Projects/shokunin-crafthouse/studio-memory/studio-memory.md

Append to ACCUMULATED LEARNINGS:
- Design approaches that worked well on this project
- Code patterns we established
- Mistakes to avoid next time
- Any decisions that should become standing studio standards

Append to CREATIVE PREFERENCES if anything new emerged about aesthetic direction.
Append to TECHNOLOGY STACK if any new tool patterns were established.

Do not rewrite or remove any existing content. Only append.
Commit the updated file and push.
```

---

## Quick Reference — Which Tool For What

| Task | Tool | How to open it |
|---|---|---|
| Writing briefs, planning | Claude.ai chat | claude.ai → your project → new chat |
| Running the Planner | Claude.ai chat | claude.ai → your project → new chat |
| Scaffolding, building, evaluating | Claude Code | Terminal: type `sc`, or Claude Code desktop app |
| Visual exploration | Claude Design | claude.ai → paint palette icon in left sidebar |
| Design system, mockups | Figma | figma.com or Figma desktop app |
| Sprint live review (desktop + phone) | Claude Code chat | URL printed by Claude after PR opens — cmd-click for desktop, copy to iMessage for phone |
| Sprint snapshot record | GitHub PR description | github.com → your repo → Pull requests |
| Repo settings, secrets, PRs | GitHub | github.com → your repo |
| Hosting, DNS, SSH keys | hPanel | hpanel.hostinger.com |

---

## Quick Reference — Token Cost by Step

| Step | Tool | Model | Cost |
|---|---|---|---|
| Brief, Planner | Claude.ai | Sonnet | Low |
| Scaffold, token extraction, workflow setup | Claude Code | Sonnet | Low |
| Claude Design exploration | Claude Design | Opus 4.7 | Separate budget |
| Sprint build (incl. preview render) | Claude Code | Opus | High |
| Sprint evaluation | Claude Code | Opus | Medium |
| Memory update | Claude Code | Sonnet | Low |

**Rule:** Use Sonnet for everything except building and evaluating. Switch to Opus only when the task demands it.

---

## The Approval Gates — What You Control

| Gate | What you approve | What happens if you skip it |
|---|---|---|
| After Planner | Product spec and sprint list | Generator builds the wrong thing |
| After Claude Design | Visual direction into Figma | Brand system has no creative anchor |
| After brand system | Token map before any code | Tokens get invented, consistency breaks |
| Sprint contract | Exactly what Claude will build | Claude interprets the spec its own way |
| Live preview URL | Rendered site on desktop and phone | You'd evaluate code or static images instead of the real experience |
| Evaluator report | Whether sprint passes | Substandard work ships |
| PR merge | Nothing hits main without you | Broken code goes live |
| Figma promotion | Sandbox → Production | Production page drifts from what shipped |

---

*New Project Setup Guide — Shokunin Crafthouse*
*v1.9 — 2026-05-13*
*Companion: Business Setup Runbook v1.4*

*Changelog v1.8 → v1.9:*
*Added Agent View (`claude agents`) support throughout, scoped to where it earns its place. New top-of-file Reference section explains what Agent View is, when to use it (Steps 9 and 10, parallel sprints across projects), when NOT to use it (single-session iteration, mid-audit Evaluator), and the rules (worktrees auto-isolate write sessions and are deleted with the session, Hostinger preview directories don't auto-clean if a PR is abandoned, sessions don't sync to mobile, rate limits apply per session). Step 9 now includes an optional `claude --bg` dispatch path so the Generator runs as a background session with Agent View as the monitoring surface. Step 10 carries the same option — Evaluator can be dispatched as a second background session without a worktree (it's read-only). Approval Gates table unchanged: Agent View consolidates session visibility and reduces terminal-tab clutter; it does not replace any human gate. Companion runbook updates (Section 8 Agent Architecture, Section 9 Long-Running Session Harness, Section 1 Quick Reference) tracked separately in the Business Setup Runbook v1.4 update.*

*Changelog v1.7 → v1.8:*
*Added Goal Mode (`/goal`) support throughout, scoped to where it earns its place. New top-of-file Reference section explains what `/goal` is, when to use it, and the rules (always include a turn cap, conditions must be transcript-verifiable, only set after a human gate). Step 4 scaffold now includes an optional `/goal` block for unattended scaffolding through all 9 tasks. Step 9 build now includes an optional `/goal` block to paste **after** the sprint contract is approved — drives the build through to a ready-to-review PR with screenshots and a green preview deploy, without bypassing any downstream gate. Step 10 Evaluator carries an explicit "do not set `/goal` here" instruction. Approval Gates table unchanged: `/goal` does not replace any human gate, it only collapses per-turn prompting within an already-authorized phase. Companion runbook updates (slash command reference, completion-conditions subsection) tracked separately in the Business Setup Runbook v1.4 update.*

*Changelog v1.6 → v1.7:*
*Preview URL now surfaces directly in Claude Code chat — no GitHub round-trip required. After opening a PR, Claude Code computes the deterministic preview URL (https://[domain]/_previews/[pr-number]/), prints it as a raw cmd-clickable line in chat, and runs `gh run watch --exit-status` to block on the preview-deploy workflow. On success it prints ✅; on failure it dumps `gh run view --log-failed` so you see the error without leaving Claude Code. Step 5 verification updated to use the same flow when testing the workflow setup PR. Reference and Quick Reference sections updated to point at Claude Code chat as the primary surface for live preview URLs (the GitHub bot comment stays as a permanent record on the PR itself).*
