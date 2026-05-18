# Business Setup Runbook — The Shokunin Crafthouse
# Claude Max $100/mo — Design Studio Configuration

**Timestamp:** 2026-05-13
**Status:** v1.4 — Agent View (`claude agents`) added to Section 8 (Agent Architecture) and Section 9 (Long-Running Session Harness)

---

## What This Runbook Is

This is your step-by-step guide to activating and configuring Claude Max as the complete creative and engineering studio for The Shokunin Crafthouse LLC. You are a web designer by trade. You do not write code beyond HTML and CSS. Claude does the building. You do the directing, reviewing, and approving.

Every step is marked:

- **YOU DO** — requires your action (account creation, approval, identity, billing, judgment)
- **PROMPT CLAUDE** — copy the exact prompt provided and send it to Claude
- **AUTOMATED** — happens without action once configured

---

## Quick Reference

| Component | Value |
|---|---|
| Plan | Claude Max $100/month |
| Primary interface | claude.ai (web + desktop) + Claude Code (terminal) |
| GitHub | New org: The Shokunin Crafthouse (separate from personal) |
| Design | Figma Professional (existing account) + Claude Design |
| Hosting | Hostinger shared (static sites) + Hostinger VPS (web app) |
| iOS development | Claude Code + Xcode (Apple Developer account: when needed) |
| File architecture | WORKSPACE.md model-neutral system |
| Studio memory | `studio-memory.md` (long-term) + Claude Project (interactive) |
| Token strategy | Wait for reset; do not pay overage |

---

## Core Philosophy — Read Before Anything Else

Your file architecture is your most valuable asset. Not the tools. Not the subscriptions. The process documents, role files, WORKSPACE.md, and studio-memory.md that Claude reads on every session are what make your studio compounding rather than starting from scratch each time.

Jack Van Clief's insight from the transcript you shared: the brain must be separate from the hands. The hands (Claude Code, Figma MCP, GitHub, Hostinger) are interchangeable. The brain — your WORKSPACE.md, studio-memory.md, design principles, project structure — is what persists and gets smarter over time.

Every hour you invest in writing better context files is worth more than any tool upgrade.

---

## The Shokunin Crafthouse Design Identity

This is the most important section in the entire runbook. It lives in your WORKSPACE.md and shapes every creative output Claude produces — from brand identity to website layout to iOS app UI.

### Studio synthesis: what you're building from

Your reference studios and what The Shokunin Crafthouse inherits from each:

**Rally Interactive** → Beautifully-designed software that solves real problems. Form and function inseparable. No fluff. Everything built to be useful enough that people keep coming back. The discipline of a small team that refuses mediocre work.

**Red Antler** → Brand architecture for challenger products. The boldest ideas come from the most unexpected places. Design as business strategy, not decoration. Building brand identity that feels like a founding partner, not a vendor.

**Pentagram** → Partner-led authorship. Every project has a distinct creative voice and point of view. Design decisions tied to the designer, not to layers of process. The conviction that great design cannot happen without personal commitment.

**Clay Global** → Silicon Valley product thinking with European sensibility. Interfaces that combine beautiful visuals with seamless user flows. Design systems that scale without losing their soul.

**ustwo** → Pioneering product studio that builds things for people and for the world. Design that creates genuine impact, not just impressive portfolios. The willingness to take creative risk in the service of something worth making.

**Metalab** → The belief that a website should feel more like a native product than a website. Clarity and function over surface-level polish. "Show, don't tell." The work speaks. No Frankenstein design — one clear point of view, not a merger of concepts.

**Cuberto** → Striking, highly interactive design systems. Motion and interaction as a design language, not decoration. Conversion-focused without feeling transactional.

**Instrument** → Product strategy, UI/UX, and interface development at the intersection of clarity and function. Research-grounded, not taste-driven alone.

**Area17** → Premium digital experiences built for cultural and creative institutions. Typography as architecture. Spatial thinking applied to the screen.

**Fantasy** → Bespoke digital products with cinematic craft. Every detail considered. The kind of work where you can tell a human made it.

**Basic Agency** → Confidence through restraint. The best design is often what you remove, not what you add. Systems that work elegantly without announcing themselves.

**Apple** → The ultimate standard for hardware-software integration, motion, typography at scale, and the feeling that technology should disappear into the experience. Every pixel earns its place.

### The Shokunin Crafthouse design principles

*Shokunin* (職人) is the Japanese concept of the craftsman who pursues mastery not for recognition but because the work demands it. These principles define your studio's creative voice:

**1. Craft is the baseline, not the ceiling**
Technical execution — typography hierarchy, spacing, color harmony, contrast — is never optional. This is the floor. Every project clears it before creative ambition begins.

**2. One clear point of view**
No Frankenstein. No trying to do everything. Every project has a creative direction that holds from first pixel to final deploy. If it lacks a point of view, it is not finished.

**3. Function first, then beauty — together**
Design that is beautiful but doesn't work is a portfolio piece. Design that works but isn't beautiful is engineering. The Shokunin standard is both, inseparable.

**4. Restraint as a creative act**
What you remove is as important as what you add. Empty space is not wasted space. Simplicity achieved through reduction is harder than complexity achieved through addition.

**5. Products, not pages**
Every website should feel like a native product, not a brochure. Interactions should feel considered. Motion should serve meaning. The experience should make the visitor think "a human made this."

**6. Authorship over process**
Decisions come from creative conviction, not from committee. You direct. Claude executes. You approve. No design by compromise.

**7. Originality over safety**
Template layouts, stock patterns, and AI defaults are disqualified before the project starts. Every project should produce at least one decision a principle designer would recognize as deliberate.

### Design quality grading criteria

These four criteria are used by Claude's evaluator agent when reviewing any design output:

| Criterion | What it means | Weight |
|---|---|---|
| **Originality** | Evidence of deliberate creative decisions. No AI-slop patterns (purple gradients over white cards, stock illustration bundles, generic sans-serif grids). A human designer should see intent. | Highest |
| **Design quality** | Coherent whole. Colors, typography, layout, imagery, and interaction combine to create a distinct mood and identity, not a collection of parts. | Highest |
| **Craft** | Typography hierarchy, spacing consistency, color harmony, contrast ratios. The competence check. Failures here are disqualifying, not just penalizing. | Required pass |
| **Functionality** | Usability independent of aesthetics. Users understand what the interface does, find primary actions, and complete tasks without guessing. | Required pass |

---

## 1) Claude Max Subscription

### YOU DO: Activate Claude Max

1. Go to [claude.ai/upgrade](https://claude.ai/upgrade)
2. Select **Max — $100/month**
3. Use the same account you already have
4. Confirm billing — no overage charges on this plan; Claude stops and waits when limits are reached
5. This is what you want: when you hit the limit, you wait. Do not enable extra usage.

### What you get at this tier

- Claude Code in the terminal
- ~88,000 tokens per 5-hour window (5x Pro)
- Opus 4.6 access (best reasoning and coding model)
- Sonnet 4.6 access (use for lighter tasks to preserve budget)
- Priority access during peak hours
- All MCP connectors
- Agent View (`claude agents`) for managing multiple background sessions from one screen — see Section 8

### Token management strategy

Claude and Claude Code share the same token pool. This is the single most important thing to understand about running on Max.

**High-cost activities** (burn tokens fast):
- Long Claude Code sessions reading large codebases
- Multi-agent harness runs (planner + generator + evaluator)
- Uploading and analyzing large Figma files

**Claude Design is a separate budget entirely** — it has its own weekly usage limit that resets independently and does not draw from your Max token pool. Heavy Claude Design sessions have no impact on your chat or Claude Code budget. Treat it as a free creative resource within its own weekly cap.

**Low-cost activities** (preserve budget):
- Planning and scoping conversations in Claude.ai
- Writing and reviewing content
- Single-file edits in Claude Code
- WORKSPACE.md and memory file updates

**Rules for your workflow:**
- Use **Sonnet 4.6** for: research, content, quick questions, file reading, simple edits
- Use **Opus 4.6** for: complex builds, multi-agent sessions, architecture decisions, design grading
- **Always start a new Claude Code session by running `/status`** to check remaining usage before a long session
- **Use Caveman mode for long sessions** — 75% token reduction on output with zero accuracy loss
- **Plan before you build** — spend 10 minutes scoping in Claude.ai before opening Claude Code; those planning tokens are cheap, the building tokens are not

---

## 2) Claude Project Setup

### YOU DO: Create The Shokunin Crafthouse Project

1. Open [claude.ai](https://claude.ai)
2. Click **Projects** → **New Project**
3. Name: `The Shokunin Crafthouse`
4. This project persists context across every session — you never re-explain your identity

### PROMPT CLAUDE: Initialize the project with your studio identity

Copy and send this as your first message inside the project:

```
You are working inside The Shokunin Crafthouse studio project. This is a persistent workspace — you will maintain context across our sessions here.

I am Levi Bahn, designer and founder. My studio builds websites, web apps, and iOS apps. I am a designer by trade and can read HTML and CSS but do not write code. You handle all implementation. I direct, review, and approve.

Here is our studio's design philosophy:

SHOKUNIN CRAFTHOUSE DESIGN PRINCIPLES:
1. Craft is the baseline, not the ceiling — technical execution is never optional
2. One clear point of view — no Frankenstein design, no trying to do everything
3. Function first, then beauty — together, inseparable
4. Restraint as a creative act — what you remove matters as much as what you add
5. Products, not pages — every website should feel like a native product
6. Authorship over process — decisions come from creative conviction
7. Originality over safety — template layouts and AI defaults are disqualified before the project starts

DESIGN QUALITY GRADING (apply to all creative work):
- Originality: deliberate creative decisions, no AI-slop patterns — HIGHEST weight
- Design quality: coherent whole, distinct mood and identity — HIGHEST weight
- Craft: typography, spacing, color harmony, contrast — REQUIRED PASS
- Functionality: users can complete tasks without guessing — REQUIRED PASS

REFERENCE STUDIOS (synthesized, not copied):
Rally Interactive (form/function discipline), Red Antler (brand as strategy), Pentagram (authorship), Clay Global (product polish), ustwo (impact-driven), Metalab (product-feel web), Cuberto (interactive systems), Instrument (clarity), Area17 (typographic architecture), Fantasy (cinematic craft), Basic Agency (restraint), Apple (the standard).

My technology stack: Claude Code for building, Figma Professional + Figma MCP for design, Claude Design for brand exploration, GitHub (Shokunin Crafthouse org), Hostinger for hosting, WORKSPACE.md file architecture.

Acknowledge this context and confirm you will maintain it across our sessions in this project.
```

---

## 3) GitHub Organization

### YOU DO: Create The Shokunin Crafthouse GitHub org

Your personal GitHub stays personal. All LLC work lives under a dedicated org.

1. Go to [github.com/organizations/new](https://github.com/organizations/new)
2. Choose **Free** plan to start
3. Organization name: `shokunin-crafthouse` (or closest available)
4. Your personal account becomes an owner
5. Billing email: your business email

### YOU DO: Configure org defaults

1. Go to **Organization Settings → Member privileges**
2. Base permissions: **None** (most restrictive)
3. Repository creation: **Private** by default
4. Enable: Require two-factor authentication

### YOU DO: Create initial repositories

Create these repos under the org before anything else:

| Repo name | Purpose | Visibility |
|---|---|---|
| `portfolio-site` | Your existing portfolio (migrate from wherever it lives) | Private |
| `shokunin-crafthouse-site` | The Shokunin Crafthouse LLC website | Private |
| `workspace-template` | Reusable project template | Private |
| `studio-memory` | Studio memory and principles (not code) | Private |

### Default branch protection for every repo

Before any agent pushes code, set this on every repo:

1. **Settings → Branches → Add branch protection rule**
2. Branch name pattern: `main`
3. Enable: Require pull request before merging
4. Enable: Require at least 1 approval
5. Enable: Block force pushes
6. Enable: Restrict deletions

You are the only approver. Nothing merges without your explicit approval.

---

## 4) Install Claude Code

### YOU DO: Install from terminal

Open Terminal on your MacBook Pro (from your Levi-Admin account):

```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version

# Authenticate with your Claude Max account
claude auth login
```

Follow the browser prompt to authenticate. Use the same account as your Claude Max subscription.

### YOU DO: Install Karpathy skills globally

These four principles become global behavior for Claude Code across all your projects:

```bash
# Add the marketplace and install Karpathy guidelines
/plugin marketplace add forrestchang/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills
```

**What this gives you permanently:**
- Claude asks clarifying questions before building instead of assuming
- Minimum code that solves the problem — no bloat, no speculation
- Surgical edits — only touches what's needed for your request
- Goal-driven execution with verifiable success criteria

This is especially valuable given you can't read code — these principles prevent Claude from overcomplicating things you can't audit.

### YOU DO: Install Caveman skill

```bash
claude install-skill JuliusBrussee/caveman
```

**When to use it:** Type `/caveman` or "caveman mode" at the start of any long Claude Code session. 75% reduction in output tokens. Full technical accuracy preserved. Turn off with "stop caveman" when you need full explanations.

**Use it for:** Long build sessions, iterative coding, any session where you're watching Claude work rather than reading explanations.

**Don't use it for:** When you need Claude to explain something, teach you something, or walk you through a decision.

### YOU DO: Install Emil Kowalski design-engineering skill

```bash
npx skills add emilkowalski/skill
```

**What this is:** Emil Kowalski is known for exceptionally crafted UI motion, micro-interactions, and performance-conscious frontend implementation. This skill loads his design-engineering approach — the kind of detail work that makes interfaces feel alive rather than static.

**When to load it:** Only when working on UI polish, animations, transitions, or interaction design. Load it for a session, then unload when done. It's expensive context to carry on every task.

**When not to load it:** Structural coding, backend work, deployment, documentation.

### YOU DO: Configure Claude Code defaults

Create a global config file:

```bash
mkdir -p ~/.claude
cat > ~/.claude/settings.json << 'EOF'
{
  "defaultModel": "claude-sonnet-4-6",
  "opus": {
    "triggers": ["architecture", "multi-agent", "harness", "full build", "design review"]
  },
  "permissions": {
    "allowedPaths": ["~/Projects/shokunin-crafthouse"],
    "blockedPaths": [
      "~/.ssh",
      "~/Library/Keychains",
      "~/Documents/Personal"
    ]
  }
}
EOF
```

**Key setting:** Default model is Sonnet (cheaper). Opus only when you explicitly need it. Blocked paths ensure Claude Code never reads your personal files, SSH keys, or credentials.

---

## 5) Workspace File Architecture

This is your studio's brain. Every project inherits from these files. The better these files are, the better every Claude session becomes.

### The two-layer memory system

**Layer 1 — `studio-memory.md`** (long-term institutional memory)
Lives at the root of your `studio-memory` GitHub repo. Claude Code reads it at the start of every session. Grows over time as Claude appends learnings. This is what makes your studio compounding.

**Layer 2 — Claude Project** (interactive session memory)
Already set up in Section 2. Used for conversation, creative direction, and review. Persists context without re-uploading files.

### File naming convention

Following the model-neutral conventions established in your earlier sessions:

| File | Purpose |
|---|---|
| `WORKSPACE.md` | Root identity — what this workspace is, how it's organized, what to read next |
| `WORKFLOW.md` | Stage flow, approval gates, handoff rules |
| `STAGE.md` | Per-stage instructions (lives inside each stage folder) |
| `workspace.manifest.yaml` | Machine-readable workspace index |
| `studio-memory.md` | Studio's accumulated knowledge, preferences, and patterns |
| `adapters/claude/CLAUDE.md` | Claude-specific bootstrap (points to WORKSPACE.md) |

### YOU DO: Create the studio memory repository

1. In your GitHub org, the `studio-memory` repo is already created
2. Clone it locally:

```bash
cd ~/Projects/shokunin-crafthouse
git clone git@github.com:shokunin-crafthouse/studio-memory.git
cd studio-memory
```

### PROMPT CLAUDE: Create the studio memory file

Open Claude Code in the `studio-memory` directory and send this prompt:

```
Create a studio-memory.md file for The Shokunin Crafthouse. This file is read by Claude Code at the start of every project session. It is our studio's institutional memory — it grows over time as we learn what works.

Structure it with these sections:

1. STUDIO IDENTITY — who we are, what we build, our standards
2. DESIGN PRINCIPLES — the 7 Shokunin principles (I'll paste them below)
3. DESIGN QUALITY CRITERIA — the 4-point grading system (paste below)
4. REFERENCE STUDIOS — synthesis of our 12 reference studios and what we inherit from each
5. TECHNOLOGY STACK — our tools and how they fit together
6. CODE STANDARDS — what good code looks like in our studio (clean, minimal, Karpathy-aligned)
7. APPROVAL GATES — what requires my explicit approval before Claude proceeds
8. ACCUMULATED LEARNINGS — empty section to start, Claude appends here as we work together
9. CREATIVE PREFERENCES — empty section to start, I'll add to this as patterns emerge

Design Principles:
[paste the 7 principles from Section "The Shokunin Crafthouse Design Identity" above]

Grading Criteria:
[paste the 4-point criteria table]

Reference Studios:
[paste the studio synthesis]

The file should be written as instructions Claude reads, not as a document for humans. Dense, directive, no filler.
```

### PROMPT CLAUDE: Create the workspace template

```
In the studio-memory repo, create a workspace template at ./templates/project-template/ that every new Shokunin Crafthouse project will clone from.

Structure:
- WORKSPACE.md (model-neutral root identity file with self-describing header)
- WORKFLOW.md (stage flow with approval gates)
- workspace.manifest.yaml (parseable index of canonical paths and roles)
- adapters/
  - claude/CLAUDE.md (points to WORKSPACE.md, bootstraps Claude Code)
  - generic/BOOTSTRAP.md (model-neutral bootstrap)
- _config/
  - brand/ (empty, populated per project)
  - voice/ (empty, populated per project)
  - design-system/
    - figma-links.md
    - token-map.md
    - ui-rules.md
- stages/
  - 01-brief/ (STAGE.md, references/, output/)
  - 02-design/ (STAGE.md, figma/, claude-design/, output/)
  - 03-build/ (STAGE.md, references/, output/)
  - 04-review/ (STAGE.md, references/, output/)
  - 05-launch/ (STAGE.md, references/, output/)
- decisions/ (decisions.md)
- .gitignore (includes node_modules, .env, secrets)

WORKSPACE.md must open with a self-describing header stating: what this file is, what the model should do with it, and what to read next. Same for WORKFLOW.md and each STAGE.md.

Populate WORKSPACE.md with a generic Shokunin Crafthouse template that any project can customize. Make it dense, directive, and model-neutral.
```

---

## 6) Figma MCP Setup

You need Figma MCP in two places, one for each context where you use Claude: the claude.ai chat interface, and Claude Code in the terminal. They're connected two different ways and both are required if you work in both contexts.

### Important capability note — read this first

Figma's MCP server is **file-scoped**, not workspace-scoped. It cannot list your teams, projects, or files. Every tool call requires a specific Figma file URL passed in. Plan your workflows around bringing a URL to Claude, not asking Claude to browse for one.

Available Figma MCP tools (same in both contexts):
- `get_metadata` — file structure and layer info
- `get_design_context` — design details for a file or specific node
- `get_screenshot` — render a frame or node as an image
- `get_variable_defs` — color, typography, spacing tokens
- `get_code_connect_map` — design-to-code bindings
- `generate_diagram` — create a diagram from Figma content

The available tools are read-oriented. Treat all creation, editing, and sandbox-to-production promotion in Figma as manual steps you perform yourself. Claude's job is to read designs and convert them into code or documentation.

For a full inventory of your Figma files (teams, projects, files), use Figma's web app file browser or the Figma REST API (`/v1/me` → `/v1/teams/:id/projects` → `/v1/projects/:id/files`) — not MCP.

---

### 6A) Claude.ai connector — for chat sessions

This is how you connect Figma for browser and desktop Claude sessions on claude.ai.

### YOU DO: Connect Figma via the connector directory

1. Open [claude.ai](https://claude.ai) and start any chat
2. Open the tools/connector menu and search for **Figma**
3. Click **Connect**
4. Sign in with your Figma Pro account when prompted
5. Authorize the OAuth scopes Figma requests

This uses OAuth — no personal access token, no config file edits. Authentication is handled between Anthropic and Figma directly.

### PROMPT CLAUDE: Verify claude.ai Figma connection

```
Test the Figma MCP connection. Fetch the metadata for this file: [paste any Figma file URL]. Do not create or modify anything. Confirm read access is working and report what you can see.
```

---

### 6B) Claude Code MCP — for terminal sessions

This is separate from the claude.ai connector and required if you want Claude Code to read Figma files during terminal builds.

### YOU DO: Generate a Figma access token

1. Log into Figma at [figma.com](https://figma.com) from your Levi-Admin account
2. Click your avatar → **Settings → Security**
3. Under **Personal access tokens**, click **Generate new token**
4. Name: `Claude-Code-MCP`
5. Scope: **File content** (read) — read is sufficient; Claude does not write to Figma files
6. Expiration: set to 1 year
7. Copy the token — store it in your password manager immediately
8. You will not see it again

### YOU DO: Configure Figma MCP in Claude Code

```bash
# Add to your Claude Code MCP config
cat >> ~/.claude/settings.json << 'EOF'
,
"mcpServers": {
  "figma": {
    "command": "npx",
    "args": ["-y", "@figma/mcp-server"],
    "env": {
      "FIGMA_API_KEY": "REPLACE_WITH_YOUR_TOKEN"
    }
  }
}
EOF
```

Replace `REPLACE_WITH_YOUR_TOKEN` with the token you generated.

### PROMPT CLAUDE: Verify Claude Code Figma connection

In Claude Code, run:

```
Test the Figma MCP connection. Fetch the metadata for this file: [paste any Figma file URL]. Do not create or modify anything. Confirm read access is working and report what you can see.
```

---

### Figma sandbox workflow — the rule

Every project has two layers in Figma:

**Sandbox page** — Your creative workspace. Claude reads from here to understand what you want built. Iterate freely.

**Production pages** — The approved, canonical version of the design. Claude reads from here only to reference the current state.

All creation, editing, and promotion between pages happens **manually in Figma** — Claude does not write to your files. The division is about your workflow discipline, not Claude's permissions.

**The prompt to use after manually promoting an item to production:**
```
I've manually promoted the [component/layout/screen name] from the Sandbox page to the [page name] Production page. Read the Production page via Figma MCP and confirm the new item is present with the same properties as the Sandbox version. Report any inconsistencies.
```

---

## 7) Hostinger Setup

### YOU DO: Migrate from Bluehost to Hostinger

You'll need two Hostinger products:

| Product | Use | Why |
|---|---|---|
| Shared Hosting | Portfolio site + Shokunin Crafthouse site | Static/simple sites, cheap, GitHub auto-deploy |
| VPS (KVM 2 recommended) | LLM web app | Needs Node.js backend + database for user auth |

**Timing:** Set up shared hosting first for the static sites. Only set up the VPS when you start building the web app. Don't pay for VPS infrastructure you're not using yet.

#### Shared hosting setup

1. Create a Hostinger account at [hostinger.com](https://hostinger.com)
2. Purchase a **Web Hosting** plan (Business or higher for multiple sites)
3. Add your domain(s) from Bluehost to Hostinger
4. Do not cancel Bluehost until Hostinger is verified working

#### YOU DO: Set up GitHub Actions auto-deploy

Hostinger's built-in Git integration requires public repos or deploy keys. Since your org policy disables deploy keys, use GitHub Actions with rsync over SSH instead. This is more reliable and gives you full control.

**Step 1 — Generate an SSH key pair**

```bash
ssh-keygen -t ed25519 -C "hostinger-deploy" -f ~/.ssh/hostinger_deploy
```

Hit enter twice (no passphrase). Creates:
- `~/.ssh/hostinger_deploy` — private key (goes to GitHub)
- `~/.ssh/hostinger_deploy.pub` — public key (goes to Hostinger)

**Step 2 — Add the public key to Hostinger**

```bash
cat ~/.ssh/hostinger_deploy.pub | pbcopy
```

In hPanel: **Hosting → Manage → SSH Access → Add SSH Key** → paste and save.

**Step 3 — Add secrets to your GitHub repo**

Go to repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret name | Value |
|---|---|
| `HOSTINGER_SSH_KEY` | Full private key — run `cat ~/.ssh/hostinger_deploy \| pbcopy` to copy including the `-----BEGIN` and `-----END` lines |
| `HOSTINGER_HOST` | Your Hostinger server IP (found in hPanel → SSH Access) |
| `HOSTINGER_USER` | Your Hostinger SSH username (same page) |

Note the port number from your SSH connection string (after `-p`) — you'll need it in the workflow file.

**Step 4 — Create the workflow file**

Create `.github/workflows/deploy.yml` in your repo:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy via rsync
        uses: burnett01/rsync-deployments@7.0.1
        with:
          switches: -avzr --delete
          path: ./
          remote_path: ~/domains/yourdomain.com/public_html/
          remote_host: ${{ secrets.HOSTINGER_HOST }}
          remote_port: YOUR_SSH_PORT
          remote_user: ${{ secrets.HOSTINGER_USER }}
          remote_key: ${{ secrets.HOSTINGER_SSH_KEY }}
```

Replace `yourdomain.com` with your actual domain and `YOUR_SSH_PORT` with the port number from your SSH string.

**Step 5 — Commit, push to main, verify**

Go to repo → **Actions** tab. Green checkmark = deployed. Every future merge to `main` triggers automatic deployment.

Now every merge to `main` automatically deploys to Hostinger. Claude Code pushes to GitHub; your approval merges to main; GitHub Actions deploys to Hostinger automatically.

### Hostinger MCP — not needed

The Hostinger MCP was intended for deploying from Claude Code and managing DNS. Deployment is now handled by GitHub Actions. DNS management is done manually in hPanel — safer for a one-person studio and appropriate for the complexity level. Skip the MCP installation.

### VPS setup — do this later, not now

**Do not set up the VPS until you are ready to start building the web app.** The VPS costs money monthly whether you use it or not.

When you're ready, come back to this section:

**YOU DO: Create VPS**
1. In hPanel → **VPS → Create New VPS**
2. Plan: **KVM 2** ($8-12/month — sufficient for early-stage web app)
3. OS: Ubuntu 22.04
4. Location: nearest to your primary users (US Central or US East for now)
5. Enable **Kodee** (Hostinger's AI agent for VPS management)

**PROMPT CLAUDE (when VPS is ready):**
```
I have a new Hostinger VPS running Ubuntu 22.04. I'm going to build a web app that lets users link their LLM account and have a chat experience with a new UX/UI approach. Set up the VPS environment for a Next.js frontend + Node.js backend + PostgreSQL database stack. Install Node.js 20, PostgreSQL, nginx, and PM2. Configure nginx as a reverse proxy. Set up basic firewall rules. Document everything you do.
```

---

## 8) Your Agent Architecture

You have four agents. Think of them as studio employees who work across all projects and accumulate expertise over time.

### The Planner

**What it does:** Takes your brief (1-4 sentences) and expands it into a complete product spec with features, design direction, technical approach, and sprint structure.

**When to use it:** At the start of every meaningful project or feature. Never let the Generator start without a Planner spec.

**Token cost:** Low (one focused session, produces a document)

### The Generator (Designer + Builder)

**What it does:** Implements the spec sprint by sprint. Builds designs in Figma, writes code in Claude Code, deploys via GitHub + Hostinger. Works from Figma specs, not from raw instructions.

**When to use it:** After Planner spec is approved. After Figma design is approved. Sprint by sprint.

**Token cost:** High (this is where most of your budget goes)

### The Evaluator (Design + Code Reviewer)

**What it does:** Reviews Generator output against the sprint contract and Shokunin design criteria. Uses Playwright to interact with live pages. Grades against the 4-point design criteria. Catches bugs and design failures before you see them.

**When to use it:** After each generator sprint. Before you review anything yourself.

**Token cost:** Medium (one thorough pass per sprint)

### You

**What you do:** Brief → review Planner spec → approve → review Figma sandbox → approve to production → review Evaluator report → merge PR or send back for revision → done.

You are the only one who merges to main. You are the only one who approves sandbox → production promotions. Everything else flows without you.

### Multi-session control plane — Agent View (NEW in v1.4)

In Claude Code v2.1.139+, you can monitor multiple Generator and Evaluator sessions from one screen via [Agent View](https://code.claude.com/docs/en/agent-view). Run `claude agents` in any terminal to see every background session grouped by state (working, needs input, completed, failed). Dispatch new sessions with `claude --bg "<prompt>"` or send an existing interactive session to the background with `/bg`.

In practice, this replaces the v1.3 pattern of running Generator and Evaluator in separate terminal tabs. You launch both as background sessions and check on them via Agent View instead of switching tabs. Two important rules for our stack:

- **Worktrees auto-isolate write-capable sessions.** A Generator dispatched from Agent View is blocked from writing to your working directory until it moves into `.claude/worktrees/[name]/`. Claude handles this automatically. The catch: deleting the session deletes the worktree. Merge or push the branch before closing the row.
- **Evaluator sessions don't need a worktree.** The Evaluator is read-only — it audits, doesn't edit. Dispatch it with `claude --bg` and it runs against the project root, no isolation needed.

See the New Project Setup Guide v1.9+ for the specific dispatch prompts in Steps 9 and 10. Agent View does not replace any approval gate — it only consolidates session visibility.

---

## 9) Long-Running Session Harness

Based on Anthropic's published research, this is how you structure multi-hour Claude Code sessions to prevent context drift and get the best results.

### When to use the harness

Use this for:
- Building a new website from scratch
- Building a new feature in your web app
- Any session you expect to run longer than 45 minutes
- Any session with more than one major component

Don't use it for:
- Quick edits and fixes
- Content updates
- Single-file changes

### The three-phase flow

**Phase 1 — Plan (5-10 minutes, low token cost)**

Open Claude.ai (not Claude Code) and run the Planner:

```
You are the Planner agent for The Shokunin Crafthouse. Read our studio identity from studio-memory.md [paste content or attach file].

My brief: [1-4 sentences describing what you want to build]

Produce a complete product spec including:
1. Project overview and purpose
2. Complete feature list
3. Design direction (reference our 7 Shokunin principles)
4. Technical stack and architecture decisions
5. Sprint breakdown (3-6 sprints, each a self-contained deliverable)
6. Success criteria per sprint (specific, testable, not vague)

Be ambitious about scope. Focus on product context and high-level technical design. Do not over-specify implementation details — let the Generator figure out the path.

Look for opportunities to include AI-native features where they serve the product.
```

**YOU DO:** Read the spec. Edit it. Approve it. This is your creative direction. The Generator follows this document.

**Phase 2 — Build (long session, high token cost)**

Open Claude Code in your project directory. Start with:

```bash
claude --model claude-opus-4-6
```

Then send:

```
/caveman

Read WORKSPACE.md and studio-memory.md first. Then read the attached product spec: [paste spec or attach file].

We are building sprint by sprint. Start with Sprint 1.

Before writing any code for Sprint 1:
1. Propose a sprint contract — exactly what you will build and how I will verify it's complete
2. Wait for my approval of the contract
3. Only then begin implementation

When Sprint 1 is complete, stop and wait for Evaluator review before proceeding to Sprint 2.
```

**Phase 3 — Evaluate (medium session, medium token cost)**

After each sprint, open a new Claude Code session:

```bash
claude --model claude-opus-4-6
```

Send:

```
You are the Evaluator agent for The Shokunin Crafthouse. You grade work against our Shokunin design criteria.

The Generator just completed Sprint [N]. Review the following:
1. Does it meet the sprint contract? [paste contract]
2. Grade against our 4 criteria: Originality, Design Quality, Craft, Functionality
3. Use Playwright to interact with the live page if applicable
4. For each criterion: score out of 10, specific finding, what to fix

Be skeptical. If you're uncertain whether something passes, it fails. The Generator can always improve — do not praise mediocre work.

Output: PASS (proceed to Sprint N+1) or FAIL (list specific fixes required before proceeding)
```

**YOU DO:** Read the Evaluator report. If PASS, review the visual output yourself. If you agree, tell the Generator to proceed. If FAIL or you have your own feedback, send back for revision.

### Tracking the harness in Agent View (NEW in v1.4)

The three-phase flow above was originally written for two separate terminal tabs — one for the Generator session in Phase 2, another for the Evaluator session in Phase 3. As of Claude Code v2.1.139, dispatch each as a background session and monitor both from one screen:

```bash
# Phase 2 — Generator (write-capable, auto-isolates in a worktree):
claude --bg "[paste the Generator prompt above]"

# Phase 3 — Evaluator (read-only, no worktree needed):
claude --bg "[paste the Evaluator prompt above]"

# Monitor both:
claude agents
```

Each session shows as a row with its current activity. Press `Space` to peek at the latest turn, `Enter` to attach for the full conversation, `←` on an empty prompt to detach back to the table. Sessions persist across terminal closes — the [supervisor process](https://code.claude.com/docs/en/agent-view#how-background-sessions-are-hosted) keeps them running.

**Rules specific to this harness:**
- The Planner (Phase 1) runs in claude.ai, not Claude Code — Agent View does not see it.
- Don't delete the Generator's session before merging its PR. The worktree under `.claude/worktrees/` disappears with the row, and unmerged changes are gone.
- Rate limits apply per session. Two parallel sessions burn your Max quota twice as fast.

---

## 10) Project Setup Workflow

Every new project follows this exact sequence. No exceptions.

### YOU DO: Create the Figma file (before scaffolding)

Create the Figma file manually before prompting Claude to scaffold. Figma MCP cannot create files.

1. Open [figma.com](https://figma.com)
2. Create a new design file named `[Project Name]`
3. Add these pages inside the file:
   - `Sandbox`
   - `Brand System`
   - `Components`
   - `Production — [primary deliverable]`
4. Copy the file URL — you'll paste it into the scaffold prompt below

### PROMPT CLAUDE: Scaffold a new project

When starting any new project:

```
Scaffold a new Shokunin Crafthouse project called [project name] using our workspace template.

1. Clone the workspace template structure
2. Create a new GitHub repo called [repo-name] under the shokunin-crafthouse org
3. Populate WORKSPACE.md with project-specific identity:
   - Project name and purpose
   - Client (if applicable) or "Internal — Shokunin Crafthouse"
   - Primary deliverable
   - Tech stack for this project
   - Key design constraints
4. Add the Figma file URL I provide into _config/design-system/figma-links.md: [paste Figma file URL]
5. Fetch the Figma file metadata via MCP to verify structure — confirm Sandbox, Brand System, Components, and Production pages all exist. Report any missing pages.
6. Initialize git and push to GitHub with branch protection on main

Report the GitHub URL when done.
```

### Project folder structure (every project)

```
[project-name]/
├── WORKSPACE.md              ← Claude reads this first every session
├── WORKFLOW.md               ← Stage flow and approval gates
├── workspace.manifest.yaml   ← Machine-readable project index
├── adapters/
│   ├── claude/CLAUDE.md      ← Bootstrap for Claude Code
│   └── generic/BOOTSTRAP.md  ← Model-neutral bootstrap
├── _config/
│   ├── brand/                ← Colors, typography, logo files
│   ├── voice/                ← Tone, copy direction
│   └── design-system/
│       ├── figma-links.md    ← Canonical Figma file URLs
│       ├── token-map.md      ← Design token reference
│       └── ui-rules.md       ← Component and layout rules
├── stages/
│   ├── 01-brief/
│   ├── 02-design/
│   ├── 03-build/
│   ├── 04-review/
│   └── 05-launch/
└── decisions/
    └── decisions.md          ← Rationale log for major choices
```

---

## 11) Design Workflow (Figma → Code)

You design. Claude builds. This is the sequence that keeps quality high and prevents Claude from making aesthetic decisions it shouldn't.

### Stage 1: Exploration in Claude Design

**YOU DO:** Open Claude Design

Claude Design launched April 17, 2026 and is included with your Max plan at no extra cost. It runs on Claude Opus 4.7 and has its own independent weekly usage limit — it does not touch your Max token budget.

Claude Design is for brand exploration and visual direction. Use it to prototype layouts, generate mood directions, and explore visual identity before committing to Figma. It's significantly more capable than the earlier artifact-based approach — it understands design systems, can produce interactive prototypes, and has a direct handoff to Claude Code.

**What to do in Claude Design:**
- Explore 2-3 distinct visual directions for a new brand or project
- Generate interactive prototypes and wireframes to test layout decisions
- Experiment with typography pairings, color palettes, and visual texture
- Create pitch decks and one-pagers for early client or stakeholder review
- Use the web capture tool to grab elements from your live site for prototype consistency

**What not to do in Claude Design:**
- Treat output as production-ready — it's exploration and direction-setting
- Skip Figma — Claude Design doesn't replace the Figma design system; production components and tokens still live there

**Handoff:** When you find a direction you like, save the Claude Design output to `stages/02-design/claude-design/`. When a design is ready to build, Claude can package it into a handoff bundle for Claude Code — use the built-in handoff feature rather than screenshotting.

### Stage 2: Brand system in Figma

**YOU DO:** Open the Figma Sandbox page and build the brand system:
- Color tokens (primary, secondary, neutrals, semantic)
- Typography scale (heading sizes, body, labels, captions)
- Spacing system
- Component foundations (buttons, inputs, cards)

This stays in the Sandbox page until you're satisfied.

**PROMPT CLAUDE (when Figma brand system is ready):**
```
The brand system on the Figma Sandbox page is approved. Read the Figma file using the Figma MCP and extract the following from the Sandbox page:

1. All color styles and their values
2. Typography styles and their properties
3. Any component variants defined

Create a token-map.md in _config/design-system/ documenting every token. This becomes the source of truth for implementation.
```

### Stage 3: Page design in Figma Sandbox

**YOU DO:** Design the actual pages in the Figma Sandbox page. Use your approved brand system. Design freely here — this is your creative workspace.

When a page or section is ready for Claude to implement:

**PROMPT CLAUDE:**
```
Using the Figma MCP, read the [page/section name] frames on the Figma Sandbox page. Do not touch any Production pages.

Implement this design as [Next.js components / HTML+CSS / React] using our token-map.md as the source of truth for all values. Do not invent colors, fonts, or spacing that aren't in the token map.

Create a feature branch called [branch-name]. When complete, open a PR and paste a summary of what was implemented and any decisions made.
```

**YOU DO:** Review the implementation:
1. Open the preview URL
2. Compare against the Figma Sandbox design
3. If satisfied, approve the PR and merge to main
4. If changes needed, send feedback and have Claude revise before merging

**AFTER MERGE — YOU DO:** Promote approved work from Sandbox to Production in Figma:
1. Select the approved frames on the Sandbox page
2. Copy to the Production page

This is always a manual step you control.

---

## 12) Website Projects

### Project 1: Personal portfolio site

Your existing portfolio gets migrated to Hostinger and placed under version control.

**YOU DO:**
1. Export all files from current host
2. Create `portfolio-site` repo under your org (already done in Section 3)
3. Push existing files to the repo
4. Connect repo to Hostinger via GitHub Actions deploy workflow (Section 7)

**PROMPT CLAUDE:**
```
I have a portfolio site with existing HTML/CSS. I want to modernize it into a Next.js site that matches Shokunin Crafthouse standards.

Read WORKSPACE.md and studio-memory.md. Then:

1. Audit the existing site files and summarize what exists
2. Propose a modernization plan: what to keep, what to improve, what the new structure should be
3. Do NOT start building yet — I need to approve the plan first

Focus on: performance, clean code, Shokunin design quality criteria.
```

### Project 2: The Shokunin Crafthouse LLC website

This is your studio's public face. It should be the best thing you've made.

**PROMPT CLAUDE (Planner phase):**
```
Plan the Shokunin Crafthouse LLC website. This is our studio's public face — it must exemplify our own design principles.

My brief: A portfolio and studio website for The Shokunin Crafthouse design studio. Visitors are potential clients (startups, tech companies, founders). They need to understand who we are, see our work, and want to hire us.

Read our full design principles from studio-memory.md [attach file].

Produce a complete product spec. Be ambitious. This site should win FWA. It should feel like a native product, not a brochure. Apply our full Shokunin design criteria.
```

---

## 13) Web App Project — LLM Chat Experience

Your public web app: users link their LLM account and get a new UX/UI experience for chat.

### Architecture overview

This requires:
- **Frontend:** Next.js (React) — the UI/UX innovation you're bringing
- **Backend:** Node.js API — handles LLM routing and user sessions
- **Database:** PostgreSQL — user accounts, saved conversations
- **Auth:** OAuth — users connect their LLM accounts (OpenAI, Anthropic, etc.)
- **Hosting:** Hostinger VPS (not shared hosting)

### When to start the VPS

**Do not start this project until:**
1. Your portfolio site and Shokunin site are live
2. You have validated the concept (even in Figma only) and want to build
3. You are ready to commit time to this project

The VPS is ~$8-12/month. Don't run it until you're actively building.

### PROMPT CLAUDE (Planner phase — when ready):

```
Plan a public web app called [your chosen name]. 

My brief: A website where users can connect their LLM API account (OpenAI, Anthropic) and have a chat experience with a fundamentally new UX/UI approach that doesn't exist in the market.

Read our studio-memory.md [attach]. Apply our full Shokunin design criteria — this product's competitive advantage is the design and experience, not the technology.

Produce a complete product spec including:
1. User journey from landing to first conversation
2. Authentication and LLM account linking approach
3. The UX/UI differentiators (what makes this different from ChatGPT, Claude.ai, etc.)
4. Frontend architecture
5. Backend API design
6. Database schema
7. Sprint breakdown

Be specific about what makes the experience different. That's the product.
```

---

## 14) iOS App Projects

You are building two iOS apps eventually:
- **Public app** (App Store) — to be determined when you're ready
- **Personal macOS app** — Mission Control (already specced in personal runbook)

### Apple Developer account — when you actually need it

**You do NOT need an Apple Developer account yet.** It costs $99/year and is only required when you want to:
- Submit an app to the App Store
- Test on a physical iPhone (not the simulator)
- Distribute via TestFlight to external testers

**You DO need Xcode now** (it's free):

```bash
# Install Xcode from the Mac App Store
# Or via command line:
xcode-select --install
```

Xcode includes an iPhone simulator. Claude Code can build iOS apps and you can run them in the simulator without any developer account.

**When to create the Apple Developer account:**
When you have an app in the simulator that you're happy with and want to test on a real device or release. Come back to this section at that point.

### YOU DO: When ready for Apple Developer account

1. Go to [developer.apple.com/enroll](https://developer.apple.com/enroll)
2. Choose **Individual** enrollment (you're a solo founder)
3. Cost: $99/year — this enables TestFlight, real device testing, and App Store submission
4. You'll need a valid Apple ID (your personal one, not Gibbie's)
5. Enrollment takes up to 48 hours for identity verification

### PROMPT CLAUDE (when starting an iOS project):

```
I want to build an iOS app called [name]. 

Brief: [2-3 sentences describing the app]

Read our studio-memory.md [attach]. Apply Shokunin design principles — this should look and feel like it belongs on the App Store front page.

Produce a complete spec including:
1. App purpose and core user journey
2. Screen inventory
3. Native iOS components to use vs. custom
4. Data model
5. Key interactions and animations (apply Emil Kowalski principles for motion)
6. Sprint breakdown

Note: We are building for the iPhone simulator first. Apple Developer account is [active/not yet active].
```

---

## 15) Studio Memory — Updating Over Time

Your `studio-memory.md` is only valuable if it stays current. Use this prompt periodically to keep it growing:

### PROMPT CLAUDE: Update studio memory after any significant project

```
Update studio-memory.md with learnings from the [project name] project.

Add to the ACCUMULATED LEARNINGS section:
- What design approaches worked well
- What code patterns we established
- What mistakes to avoid next time
- Any decisions that should become standing studio standards

Add to CREATIVE PREFERENCES if anything emerged about my aesthetic preferences that should inform future work.

Do not rewrite existing content. Only append. Preserve everything that's already there.
```

### PROMPT CLAUDE: Update memory with new tool patterns

```
Add to studio-memory.md under TECHNOLOGY STACK:
- [tool name]: how we use it, any gotchas discovered, preferred patterns

Do not rewrite existing content. Only append.
```

---

## 16) Token Management — Practical Daily Guide

### Before starting any session

```bash
# Check remaining usage
/status

# If more than 30% remaining: proceed normally
# If less than 30% remaining: scope the session to fit, or wait for reset
```

### Choosing the right model

| Task | Model | Reason |
|---|---|---|
| Planning, scoping | Sonnet 4.6 | Low stakes, cheap |
| Content writing | Sonnet 4.6 | Not complex |
| Quick code edits | Sonnet 4.6 | Single-file, simple |
| Architecture decisions | Opus 4.6 | Needs deep reasoning |
| Full sprint builds | Opus 4.6 | Complex, multi-file |
| Design grading | Opus 4.6 | Needs taste and judgment |
| Figma reading | Sonnet 4.6 | Straightforward extraction |
| Debugging | Opus 4.6 | Requires tracing logic |

### Maximizing what you get from each session

**Start every Claude Code session with:**
```
Read WORKSPACE.md and studio-memory.md before anything else.
```

**This prevents Claude from asking questions that the files already answer, which burns tokens on clarification.**

**Use /compact when sessions get long:**
Claude Code has a `/compact` command that summarizes earlier parts of the conversation to free up context. Use it when sessions run long rather than starting over.

**Scope explicitly:**
Instead of "build the homepage," say "build the hero section of the homepage — just that section, nothing else." Scoped prompts produce focused output and use fewer tokens.

**Caveman for long builds:**
`/caveman` at the start of any build session. Turn off when reviewing output.

---

## 17) Validation Checklist

Complete all items before using the setup for real client or product work.

| Task | Expected | Done |
|---|---|---|
| Claude Max subscription active | Plan shows Max $100/mo | |
| Claude Project created and initialized | Studio identity confirmed | |
| GitHub org created | `shokunin-crafthouse` org exists | |
| Branch protection on all repos | PRs required, force push blocked | |
| Claude Code installed and authenticated | `claude --version` shows installed | |
| Karpathy skills installed globally | `/plugin list` shows installed | |
| Caveman skill installed | `/caveman` triggers in Claude Code | |
| Emil Kowalski skill installed | Available via `npx skills` | |
| Figma claude.ai connector active | OAuth connected via connector directory in chat tools menu | |
| Figma Claude Code MCP configured | Token pasted into `~/.claude/settings.json` under `mcpServers.figma` | |
| Figma MCP tested with real file | `get_metadata` returns file structure from a pasted file URL | |
| Figma sandbox workflow understood | Manual promotion Sandbox → Production; Claude reads only | |
| Hostinger account created | Shared hosting active | |
| GitHub Actions deploy workflow active | Push to main deploys automatically via rsync over SSH | |
| Hostinger MCP | Not needed — deployment via GitHub Actions, DNS managed manually in hPanel | N/A |
| `studio-memory.md` created | File exists in studio-memory repo | |
| Workspace template created | Template exists in studio-memory repo | |
| First project scaffolded | WORKSPACE.md, Figma file, GitHub repo exist | |
| Evaluator prompt tested | Returns graded feedback on a test output | |
| Token management understood | Know when to use Sonnet vs Opus | |

---

## 18) Quick Reference — Exact Prompts

Keep these handy. Copy-paste when needed.

### Start any session
```
Read WORKSPACE.md and studio-memory.md before anything else. Confirm you've read them and state the current project context.
```

### Start a caveman build session
```
/caveman
Read WORKSPACE.md and studio-memory.md. We are building [sprint/feature]. Propose a sprint contract before writing any code.
```

### Planner prompt
```
You are the Planner. My brief: [1-4 sentences]. Read studio-memory.md [attach]. Produce a full product spec with feature list, design direction, tech approach, and sprint breakdown. Be ambitious. Look for AI-native feature opportunities.
```

### Generator sprint start
```
Sprint [N] contract: [paste contract]. Implement this sprint. Use our token-map.md for all design values. Feature branch: [branch-name]. Open a PR when done.
```

### Evaluator review
```
You are the Evaluator. Grade Sprint [N] against our 4 Shokunin criteria. Use Playwright on the live page. Be skeptical. Score each criterion 1-10 with specific findings. Output: PASS or FAIL with required fixes.
```

### Figma sandbox approval
```
The [item] on the Figma Sandbox page is approved. Promote it to the [Production page]. Do not modify existing content on the Production page.
```

### Update studio memory
```
Update studio-memory.md with learnings from [project]. Append to ACCUMULATED LEARNINGS. Do not rewrite existing content.
```

### Load Emil Kowalski for UI polish
```
Load the Emil Kowalski design-engineering skill for this session. We are working on [UI animation/micro-interaction/motion design]. Apply his principles: considered motion, performance-conscious implementation, interactions that serve meaning.
```

### Scope a quick edit
```
/caveman
Make this specific change only: [exact change]. Touch nothing else. One file. One commit.
```

---

## 19) Monthly Cost Summary

| Item | Monthly cost |
|---|---|
| Claude Max | $100.00 |
| Figma Professional | $16.00 |
| Claude Design | Included with Max |
| Hostinger Shared Hosting | ~$3-5 |
| Hostinger VPS (when needed) | ~$8-12 |
| **Total (without VPS)** | **~$119-121/month** |
| **Total (with VPS active)** | **~$127-133/month** |

Apple Developer Program: $99/year (~$8.25/month) — add when you're ready to test on device or submit to App Store.

---

*End of Business Setup Runbook*
*v1.4 — 2026-05-13*
*Companion: Personal Agent Stack Runbook (Gibbie, Bree, Heather, Woody) · New Project Setup Guide v1.9 · Cowork Setup Guide v1.1*

*Changelog v1.3 → v1.4:*
*Added Agent View (`claude agents`) support in Claude Code v2.1.139+. Section 1 capability list now lists Agent View. Section 8 (Agent Architecture) gains a new subsection on the multi-session control plane — covering background dispatch (`claude --bg`), worktree auto-isolation for write-capable sessions, the read-only Evaluator exception, and the worktree-deletion rule. Section 9 (Long-Running Session Harness) updated to show how to dispatch the Generator and Evaluator phases as background sessions and monitor both from `claude agents` instead of separate terminal tabs. The Planner (Phase 1) still runs in claude.ai and is not visible to Agent View. No approval gates changed; Agent View only consolidates session visibility.*
