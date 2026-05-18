# Cowork Setup Guide — The Shokunin Crafthouse
# Claude Desktop App · Agentic Knowledge Work

**Timestamp:** 2026-05-13
**Status:** v1.1 — Added Agent View disambiguation note
**Companion docs:** Business Setup Runbook v1.4 · New Project Setup Guide v1.9

Labels used throughout:
- **YOU DO** — requires your action
- **PROMPT CLAUDE** — copy/paste this into the specified tool
- **AUTOMATED** — happens without action once configured

---

## What Cowork Is (and Isn't) in Your Stack

Cowork is the third tab in the Claude Desktop app — alongside Chat and Code. It runs the same agentic architecture as Claude Code but without the terminal. You point it at a folder, describe the outcome you want, and it reads, edits, and creates files directly on your machine.

**The critical distinction:**

| Tool | What it's for in your stack |
|---|---|
| **Claude.ai (browser/desktop chat)** | Creative direction, planning, Planner agent, reviewing specs |
| **Claude Code (terminal)** | All code — scaffolding, building, debugging, deploying |
| **Cowork (Desktop app)** | Non-code file work — briefs, memory updates, reports, research synthesis, project documentation |

Cowork does not replace Claude Code. If the task touches a codebase, use Code. If the task is file-heavy knowledge work that doesn't require a terminal, use Cowork.

**Cowork ≠ Agent View.** Agent View (`claude agents`) is a CLI feature inside Claude Code for managing multiple parallel Claude Code sessions on one screen — see the New Project Setup Guide for that. It does not appear in the Desktop app, has no overlap with Cowork, and the two are not interchangeable. Cowork = file-based knowledge work in the Desktop app. Agent View = multi-session control plane in the terminal.

**What Cowork does that claude.ai chat cannot:**
- Reads, edits, and creates files directly in your local folders without copy-pasting
- Runs multi-step tasks autonomously — you describe the outcome, not the steps
- Scheduled tasks (daily briefings, weekly summaries) run unattended
- Remote dispatch — assign tasks from your iPhone while your Mac runs them

---

## Prerequisites

Before setup, confirm:

- [ ] Claude Max $100/mo subscription active (Cowork is included, uses the shared Max token pool)
- [ ] Claude Desktop app installed and signed in — [claude.com/download](https://claude.com/download)
- [ ] macOS (Windows support not yet available as of this writing)
- [ ] Both Desktop and iOS apps at their latest versions (required for remote dispatch)

---

## Part 1 — Access Cowork

**YOU DO:**

1. Open the Claude Desktop app
2. At the top of the window, you'll see three tabs: **Chat · Cowork · Code**
3. Click **Cowork**
4. If you see a waitlist instead of a task interface, your plan qualifies — it may be rolling out. Check again within 24 hours or reach out to Anthropic support.

---

## Part 2 — Grant Folder Access

Cowork needs explicit permission to read and write to your project folders. It cannot access anything you haven't authorized.

**YOU DO:**

1. In Cowork, start a new task
2. Click the **Attach folder** button (folder icon, or it prompts on first task)
3. Navigate to `~/Projects/shokunin-crafthouse` and grant access
4. Also grant access to `~/Projects/shokunin-crafthouse/studio-memory` if it's not a subfolder

**Add these folders at minimum:**

| Folder | Why |
|---|---|
| `~/Projects/shokunin-crafthouse` | Studio root — all projects live here |
| `~/Projects/shokunin-crafthouse/studio-memory` | studio-memory.md access |
| `~/Desktop` | Scratch pad for incoming files |
| `~/Downloads` | File intake |

⚠️ **Do not grant access to `~/.ssh`, `~/Library/Keychains`, or `~/Documents/Personal`.** These are blocked in your Claude Code config for the same reason — keep the same rule here.

---

## Part 3 — Context Files (Critical)

Unlike claude.ai Projects, **Cowork sessions start fresh every time.** There is no persistent memory between tasks. This is by design — it keeps tasks clean and scoped.

The workaround is context files: small Markdown files that live in your working folder. Cowork reads them automatically at the start of every session in that folder. Think of them as the WORKSPACE.md pattern you already use in Claude Code, extended to Cowork.

You need two types:

### 3A — Studio-Level Context (read once, live in studio-memory repo)

You already have `studio-memory.md`. For Cowork, create a companion file that's formatted as a task briefing rather than a code session brief.

**YOU DO:** In `~/Projects/shokunin-crafthouse/studio-memory/`, create a new file called `cowork-context.md`.

**PROMPT CLAUDE** (in Cowork, with studio-memory folder attached):

```
Read studio-memory.md in this folder.

Create a new file called cowork-context.md. This file is read by Cowork 
at the start of every non-coding task session. Write it as a task briefing, 
not a code brief.

Include:
1. STUDIO IDENTITY — who we are, what we build (2–3 sentences max)
2. MY ROLE — I am Levi Bahn, designer and founder. I direct and approve. 
   I do not write code. Claude executes.
3. DESIGN PRINCIPLES — the 7 Shokunin principles, condensed to one line each
4. QUALITY BAR — the 4-point grading system as a compact checklist
5. FILE CONVENTIONS — WORKSPACE.md lives at project root, studio-memory.md 
   lives in studio-memory/, cowork-context.md is this file
6. APPROVAL GATES — list what requires my explicit approval before proceeding
7. OUTPUT DEFAULTS — all files in Markdown unless I specify otherwise. 
   No filler, no preamble. Dense and directive.
8. CURRENT WORKING PROJECTS — leave a blank section I'll fill in manually

Format as a briefing document Claude reads on task start, not as a reference 
for humans. Dense. No filler. Every line earns its place.
```

### 3B — Project-Level Context (one per project, lives in project root)

Each project already has `WORKSPACE.md` from your workspace template. Cowork reads this automatically when you attach that project's folder. No extra setup required — your existing architecture works.

**One addition:** Open `WORKSPACE.md` in each active project and add a `COWORK DEFAULTS` section at the bottom:

```markdown
## COWORK DEFAULTS

- Output format: Markdown unless specified
- File location: save all outputs inside this project folder unless directed otherwise
- Approval gate: stop and confirm before modifying any file that already exists
- Context to load: read cowork-context.md from ~/Projects/shokunin-crafthouse/studio-memory/ 
  at the start of every session
```

---

## Part 4 — Connect Figma

Cowork uses the same connector system as claude.ai chat. If you've already connected Figma via the connector directory in chat (Step 6A of the Business Runbook), it's available in Cowork too.

**YOU DO — verify:**

1. In Cowork, click the connector/tools icon
2. Confirm Figma shows as **Connected**
3. If not: search for Figma → Connect → OAuth flow (same as chat setup)

**Important capability note (same as Claude Code):** Figma MCP is file-scoped. You must bring a file URL to Cowork. It cannot browse your Figma workspace. Always paste the URL directly in your task description.

---

## Part 5 — Set Up Remote Dispatch (Phone → Desktop)

Remote dispatch lets you assign Cowork tasks from your iPhone while your Mac handles them. Useful for offloading tasks mid-day without sitting at your desk.

**YOU DO:**

1. Install the Claude iOS app (latest version)
2. Open Settings in the iOS app → **Pair Desktop**
3. Follow the pairing flow — both devices must be signed into the same Claude Max account
4. Your Mac must be awake and the Desktop app must be running for remote tasks to execute

**How it works:** Send a task from your iPhone the same way you'd type it in Cowork on your Mac. Claude picks up the task on your desktop, works through it, and sends you the result. You don't need to be at your computer.

---

## Part 6 — Install Claude in Chrome (for Web Research Tasks)

When Cowork needs to research something on the web, it can use the Claude in Chrome extension rather than a limited web search. This gives it full browser control — navigating, reading pages, pulling data.

**YOU DO:**

1. Install the Claude for Chrome extension from the Chrome Web Store
2. Sign in with your Claude Max account
3. In Cowork Settings → **Features** → enable **Claude in Chrome**

Cowork's priority order for reaching outside your local files: connector first → Chrome extension → computer use (screen) as last resort. Having Chrome connected means fewer screen interactions and faster task execution.

---

## Part 7 — Token Management for Cowork

**Cowork draws from the same Max token pool as Claude.ai chat and Claude Code.**

Cowork tasks are generally cheaper than Claude Code build sessions, but they can burn tokens quickly when:
- Tasks involve reading many large files
- You run long research or synthesis tasks
- Computer use (screen control) is triggered

**Rules for Cowork:**

| Task | Model to use |
|---|---|
| File organization, renaming, sorting | Sonnet — lightweight, cheap |
| Writing briefs, summaries, reports | Sonnet — content work doesn't need Opus |
| Research synthesis across multiple sources | Sonnet — straightforward extraction |
| Grading or evaluating creative work | Opus — needs taste and judgment |
| Running the Planner agent via Cowork | Opus — complex reasoning required |
| Memory updates (studio-memory.md) | Sonnet — appending, not reasoning |

**Before any long Cowork session:**

Check your remaining pool in Claude Code first:
```bash
/status
```
Same pool. Plan accordingly.

---

## Part 8 — What to Use Cowork For

### Use Cowork for:

| Task | Where in your workflow |
|---|---|
| Sharpening a brief from rough notes | Step 1 (replaces the optional claude.ai prompt) |
| Batch-updating WORKSPACE.md files across projects | Ongoing |
| Appending to studio-memory.md after a project ships | Step 13 |
| Compiling evaluator reports from multiple sprint reviews | After Step 10 |
| Writing project documentation or client-facing summaries | Anytime |
| Organizing and renaming deliverable files before handoff | Pre-launch |
| Synthesizing reference research into a design brief | Pre-Step 2 |
| Generating a daily/weekly studio status summary | Scheduled task |

### Do not use Cowork for:

- **Anything that touches code** → Claude Code
- **Creative direction, spec review, visual design feedback** → Claude.ai chat or Claude Design
- **Figma read → code generation** → Claude Code with Figma MCP
- **PR management, GitHub Actions, deploys** → Claude Code or github.com

---

## Part 9 — Key Prompts

Keep these. Copy-paste when needed.

### Start any Cowork session

```
Read WORKSPACE.md in this project folder and cowork-context.md from 
~/Projects/shokunin-crafthouse/studio-memory/ before anything else.

Confirm you've read them and state the current project context.
```

### Sharpen a brief (replaces Step 1 manual option)

```
Read cowork-context.md. I have rough notes for a new project brief. 
Sharpen them into 1–4 sentences that define who the visitor is, what they 
need to accomplish, and what makes this different.

My rough notes: [paste]

Give me 2–3 options. No filler.
```

### Update studio memory after a project ships (replaces Step 13)

```
Read studio-memory.md in ~/Projects/shokunin-crafthouse/studio-memory/.

Append to ACCUMULATED LEARNINGS:
[paste your notes on what worked, what to avoid, what became a standing standard]

Append to CREATIVE PREFERENCES if anything new emerged about aesthetic direction.
Append to TECHNOLOGY STACK if any new tool patterns were established.

Do not rewrite or remove anything. Only append. Save the file.
```

### Generate a project status summary

```
Read WORKSPACE.md and the decisions/decisions.md file in this project.

Write a project status summary covering:
- Current sprint and what's been completed
- What's in progress and what's blocked
- Next decision required from me
- Any risks worth flagging

Keep it to one page. No filler.
```

### Organize deliverable files before client handoff

```
Read WORKSPACE.md. I need to organize the files in [folder path] 
for client handoff.

Rename files to follow this convention: [your convention]
Group into subfolders by: [category — e.g. by page, by asset type]
Flag anything that looks like a draft or WIP that shouldn't be included.

Show me the proposed structure before making any changes. Wait for my approval.
```

### Research synthesis → design brief

```
Read cowork-context.md. I'm about to start the design phase for [project name].

Research [competitors / references / category]. Synthesize into a design brief covering:
- What the category looks like (be specific — name sites, patterns, aesthetics)
- Where the visual and interaction opportunities are
- What to deliberately avoid (what would make this look like everything else)

Apply the Shokunin lens. This should inform creative direction, not describe it.
```

### Scheduled morning briefing (set up once)

```
Every weekday at 8:00 AM, read WORKSPACE.md files across all active projects 
in ~/Projects/shokunin-crafthouse/.

Generate a morning briefing covering:
- What's in progress across all active projects
- Any PRs open on GitHub (if GitHub connector is available)
- What I said I'd do next in decisions.md for each project
- Token budget status if visible

Save as morning-briefing-[date].md in ~/Desktop/Briefings/.
```

---

## Part 10 — Validation Checklist

Complete before using Cowork for real work.

| Task | Expected | Done |
|---|---|---|
| Cowork tab visible in Desktop app | Three tabs: Chat · Cowork · Code | |
| Studio-memory folder attached | Cowork can read from it | |
| Projects folder attached | Cowork can read all project subfolders | |
| Sensitive folders blocked | ~/.ssh and personal docs NOT accessible | |
| cowork-context.md created | Lives in studio-memory/, has all 8 sections | |
| WORKSPACE.md updated | COWORK DEFAULTS section added to each active project | |
| Figma connector verified in Cowork | Shows Connected in connector list | |
| Claude in Chrome installed | Extension active, feature enabled in Cowork | |
| iOS app paired | Remote dispatch works (test with a simple task) | |
| Token pool understood | Cowork and Claude Code share the same Max pool | |
| First real task run | Ran a brief sharpening or memory update successfully | |

---

## Quick Reference — Cowork vs Chat vs Code

| If you need to… | Use |
|---|---|
| Write or sharpen a brief | Cowork |
| Run the Planner agent | claude.ai Chat (Shokunin Crafthouse project) |
| Explore visual direction | Claude Design |
| Scaffold a new project repo | Claude Code |
| Build any sprint | Claude Code |
| Evaluate a sprint | Claude Code (fresh session) |
| Update studio-memory.md | Cowork |
| Organize or rename files | Cowork |
| Write project documentation | Cowork |
| Merge a PR | github.com (browser) |
| Promote Sandbox → Production in Figma | Figma (manual, always) |

---

*Cowork Setup Guide — The Shokunin Crafthouse*
*v1.1 — 2026-05-13*
*Companion: Business Setup Runbook v1.4 · New Project Setup Guide v1.9*

*Changelog v1.0 → v1.1:*
*Added a disambiguation note near the top distinguishing Cowork from Agent View (Claude Code v2.1.139+). Agent View is a CLI multi-session control plane in Claude Code; Cowork is the file-based knowledge-work surface in the Desktop app. They do not overlap and are not interchangeable. Companion version references updated to current runbook and project guide versions.*
