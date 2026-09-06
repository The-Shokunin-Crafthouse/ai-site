# AI.LEVIBAHN.COM — CONTENT AUDIT
**Last updated:** 2026-09-06
**Purpose:** Canonical content record for ai.levibahn.com. Use this file for future content audits, placement analysis, and copy updates. Reflects all edits through 2026-09-06 including the sc-hygiene and sc-premortem Tools Row 02 rows, the council/orchestration-layer pipeline row, the Gate 4 security/load-test line, the four-tier model roster, the folded-back 2026-07-25 sweep items, the fullscreen TUI tip, Concise output style, `/design`, restricted mode, Remote Control GA, the Fable 5.1 rename, and `/skill-doctor`.

**Change log:**
- 2026-09-06 (v29) — sc-content-sync nested pass under COO audit 2026-09-06 item 6 (packet JLB), scope: the 2026-08-29 report's one still-unapplied item plus the 08-29→09-06 accrual. (1) New Tools Row 02 row "Check Gate-3 tokens and dead code before a PR" for `sc-hygiene` (`drift_check` + `deadcode_check`, shipped 2026-08-16) — the 08-29 report's item 7, never folded in by the 09-05 XSB pass. (2) New Tools Row 02 row "Stress-test a plan before work starts" for `sc-premortem` (ADR-070, ships since a `sc-council` PROCEED verdict now runs it automatically) — zero prior site hits, same gap shape as sc-hygiene. (3) Learnings #191–211 accrual (20 new since the last full count check, including today's own promotions #210–211): covered by the "∞ accumulated learnings" stat, no numeric surface to update — same judgment as every prior sync. (4) Governance ADRs #066–071 land with no site-facing surface — process/harness internals, no claim the site's Workflow/Tools/Brain surfaces would restate, same class as ADR-063/064/065 in the 08-29 report. Brain Row 01 Learning 3 rotation (still showing #114 since 07-22, now 46 days) remains flagged editorial-only, no automated change. Archived pre-edit state → `_archive/site-content-audit-2026-09-06.md`.
- 2026-09-05 (v28) — Weekly sweep, three additions from `_pending/weekly-update-2026-09-05.md` (approved "all" via `_pending/coo.notify-ai-site-weekly-2026-09-05.approval`): (1) Fable 5 -> Fable 5.1 on all seven live routing surfaces (model-confirm gate line, Planner body, Evaluator body, Tools Row 01 budget row, Tools Row 01 "Tune instructions" row, Tools Row 02 Turn-a-brief and Grade-a-sprint rows) - verified against Anthropic's 2026-09-01 Fable 5.1/Mythos 5.1 launch announcement before applying, given the studio's own history of a false "Opus 5" claim earlier this window (COO 2026-08-13 item 1); historical changelog mentions above left as written, append-only record; (2) removed the stale "promo pricing through Aug 31" parenthetical from the Sonnet 5 budget row (date had passed); (3) new Tools Row 02 row "Prune unused skills from a loaded session" for `/skill-doctor` (v2.1.261). Skipped (low relevance): Function Hooks preview (behind flag), PreModelSwitch/PostModelSwitch hooks, timeFormat/timeZone settings, bashOutputMaxChars/taskOutputMaxChars, --append-subagent-system-prompt-file, Figma animated/interactive shaders + MCP editing, Figma community/org shader publishing. Archived pre-edit state -> `_archive/site-content-audit-2026-09-05-v27.md`.
- 2026-09-05 (v27) — Weekly sweep, four additions from `_pending/weekly-update-2026-08-28.md` (approved "all" via `_pending/coo.notify-ai-site-weekly-2026-08-28.approval`): (1) new Tools Row 01 row "Cut Claude's response verbosity" for the Concise output style (`outputStyle`, v2.1.237); (2) new Tools Row 02 row "Draft UI artboard options from the terminal" for `/design <brief>` (research preview, v2.1.233+); (3) Agent View row gains a sentence on `claude remote-control` reaching GA (device card on the mobile Code tab, tap to start a session or change effort remotely); (4) new Tools Row 01 row "Lock down tool surface for automated tasks" for `CLAUDE_CODE_RESTRICTED=1` / `--restricted` (v2.1.248). Skipped (low relevance): Karpathy LLM wiki/idea-file pattern, auto-continue at usage limit, `experimental.cacheTtl` agent frontmatter, `/goal` loop token breakdown, Figma agent chat panel detachable, Figma auto layout spacing options, `ANTHROPIC_DEFAULT_MODEL` env var, spellcheck/keybindingFlavor/GitLab MR badge. Archived pre-edit state → `_archive/site-content-audit-2026-09-05-v26.md`.
- 2026-09-05 (v26) — Weekly sweep, one addition from `_pending/weekly-update-2026-08-29.md` (approved "all" via `_pending/coo.notify-ai-site-weekly-2026-08-29.approval`): new Tools Row 01 row "Work fullscreen in a large terminal" for `/tui fullscreen`, `CLAUDE_CODE_SCROLL_SPEED`, and `Ctrl+O` transcript mode (Claude Code docs). Light week, skipped (low relevance): no new bcherny/karpathy posts, no new Figma releases, CC v2.1.250 still latest. Archived pre-edit state → `_archive/site-content-audit-2026-09-05-v25.md`.
- 2026-09-05 (v25) — sc-content-sync nested pass under COO audit 2026-08-13 item 10 (packet XSB), approved 2026-09-05 via `content-sync.notify-content-sync-2026-08-13` (numbers: all; full sub-report `_pending/content-sync-2026-08-13.md`). Studio-side sync, not a weekly external-news sweep — folder had drifted 205 commits / 32 files since the last sync (2026-07-12). (1) Reconciliation: folded back 3 of 4 orphaned 2026-07-25 sweep items — `/code-review` row gains "runs as a background subagent by default and never fills the active conversation"; Agent View row gains the subagent depth-3 default (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`) + `workflowSizeGuideline` advisory sentence; "Translate Figma into code" row gains the variable-binding + auto-layout-on-sync sentence. The 4th item ("Opus 5 replaces Opus 4.8") was **not** folded in — confirmed factually wrong at the time (no such model existed), independently reconciled since via business-runbook.md's 2026-08-16 changelog entry (Opus 5 is now current). (2) New Tools Row 02 row "Vet a new idea before committing to it" for the studio's intake → council → commission → orchestrate pipeline (10 skills, previously 0 site hits); new sentence on Card 03 body naming this second layer above the per-sprint triad. Routed through `sc-brand-voice` pre-write. (3) Gate 04 (Delivery) cell gains the ADR-048/049 security-pass + load-test line. (4) Card 04 body: "Opus and Sonnet" → "Opus, Sonnet, and Haiku", Haiku clause added, matching business-runbook.md's four-tier routing table. (5) Global-instructions mirror (Cowork/claude.ai Settings paste) refreshed and written to `studio-memory/_coo-pending/global-instructions-mirror-2026-09-05.md` for manual paste — source `studio-memory.md` and `learnings/INDEX.md` had already moved past the report's #166–170 ask to #199 by the time this ran; mirror reflects current state, not the stale 2026-08-13 snapshot. (6, flag only) Brain Row 01 Learning 3 rotation — surfaced for editorial judgment, no automated change. Archived pre-edit state → `_archive/site-content-audit-2026-09-05.md`.
- 2026-08-15 (v24) — Weekly sweep, three additions from `_pending/weekly-update-2026-08-15.md` (approved "1 2 3" via `_pending/coo.notify-ai-site-weekly-2026-08-15.approval`, code E4B): (1) new Tools Row 01 row "Tune instructions for Claude 5 models" — shorter CLAUDE.md files and skills outperform verbose ones on Sonnet 5, Fable 5, and Mythos 5+; Anthropic cut Claude Code's own system prompt 80% (800→164 tokens) with no measured performance loss (claude.com/blog, 2026-08-13), placed after "Keep budget low by default"; (2) Tools Row 02 Agent View row: `/fork` sentence updated to note it inherits the full conversation plus prompt cache by default, non-teammate subagents spawned in interactive sessions now run in background by default, `/code-review` at high/xhigh/max effort now runs as a background agent too, and a new closing sentence on cross-session `@` mentions routing through `SendMessage` with no confirm step; (3) Tools Row 02 Figma Agent (beta) row gains a sentence on the community skills library — 50+ design workflow skills, and the agent can create new ones from context in the active file. Skipped (low relevance): Cowork @-import change (flagged as an operational check, not a site edit — verify separately), Figma Weave MCP Server Support, Write tool unread-file overwrite, security hardening patches, ListAgents offline/cloud labels, plugin marketplace command sources, MCP OAuth Slack fix. Both surfaces edited in the same pass, audit and `index.html`. Archived pre-edit state → `_archive/site-content-audit-2026-08-15.md` and `_archive/index-2026-08-15.html`.
- 2026-08-08 (v23) — Weekly sweep, five additions from `_pending/weekly-update-2026-08-08.md` (approved "all" via `_pending/coo.notify-ai-site-weekly-2026-08-08.approval`, code SDN): (1) new Tools Row 02 row "Generate or remix a design inside Figma" for Figma Agent (beta), the canvas-embedded design agent that respects an existing design system out of the box, gradual beta on Full seats across Professional/Organization/Enterprise, no credits consumed during beta; (2) Tools Row 02 "Translate Figma into code" row gains a sentence on Code Connect in MCP giving the agent production component context during design-to-code, fewer tokens and less generic output (Figma blog, 2026-08-05); (3) Tools Row 02 Agent View row: the 200-spawn subagent cap sentence rewritten, the cap was removed in v2.1.224 (concurrency and depth limits still apply) and the 200-call WebSearch cap stated separately, plus a new sentence on cross-session `SendMessage` + `ListAgents` reaching sessions by name across machines (v2.1.224/225); (4) same Agent View row: the v2.1.198 always-auto-draft-PR sentence replaced, background sessions now follow CLAUDE.md git instructions and open a draft PR only when the task calls for one (v2.1.221); (5) new Tools Row 01 row for `claude self-hosted-runner` (v2.1.224, Team/Enterprise), CC sessions on your own machines or containers with internal network access and compliance controls. Both surfaces edited in the same pass, audit and `index.html`. Skipped (low relevance): VSCode Focus view, `/review` alias + effort memory, archive plugin source, Bash invisible-char security fix, worktree isolation fix, Figma Make skills/voice/question cards/version history, nested folders GA, Grid GA, Figma Slides sections, bcherny hidden-features thread, bcherny CC-rewrites-Claude-app, Karpathy Sequoia Ascent. DRIFT FLAGGED, not fixed in this pass (see `_coo-pending` / apply report): `index.html` never received four Tools Row 02 rows the audit records as landed (`/simplify`+`/batch`, `/code-review` multi-agent, `/checkup`, MCP 2026-07-28 spec) and the entire 2026-07-25 weekly sweep (4 items, reported applied in `_pending/approved-2026-07-25.md`) is absent from this audit with no v-entry, its commit never landed. Archived pre-edit state → `_archive/site-content-audit-2026-08-08.md` and `_archive/index-2026-08-08.html`.
- 2026-08-01 (v22) — Weekly sweep, two additions from `_pending/weekly-update-2026-08-01.md` (approved "all" via `_pending/coo.notify-ai-site-weekly-2026-08-01.approval`): (1) Tools Row 02 `/doctor` row renamed to `/checkup` and expanded from the single CLAUDE.md-trim capability to all five: nested CLAUDE.md splitting, dedup of local vs. checked-in CLAUDE.md, removal of unused MCPs/skills/plugins, disabling slow hooks, enabling auto mode (bcherny, Jul 28); (2) new Tools Row 02 row added for the MCP 2026-07-28 spec — stateless protocol shift + MCP Apps/Tasks extensions, Figma named as launch partner. Skipped (low relevance): Figma Make properties panel + annotations, Figma auto layout CSS alignment, voice mode Opus/Sonnet + MCP tools. Archived pre-edit state → `_archive/site-content-audit-2026-08-01.md`.
- 2026-07-22 (v21) — sc-reference-review: one studio-scoped learning adopted from an ICM afternoon-tea session on second brains (transcript reviewed in-session; member-gated video, no public URL). Added learning #114 "Raw session media is processed once — read the derivative, never re-read the transcript" to studio-memory learnings/INDEX.md + detail file; logged as studio ADR-032 (refines ADR-030 transcript filing: the council ADR carries the verdict, the full transcript files as a linked raw artifact). Brain Row 01 Learning 3 rotated to showcase #114 (replacing #100, showcased since v19 — audit-side only; drift fix: index.html Learning 3 was still showing #61 from v12, the v19 rotation never landed in markup — both surfaces now aligned on #114). Watch: ICM deployment platform/marketplace launch; local models for the mechanical tier (revisit at the ADR-027 October review). Skipped: Obsidian graph front-end, layer-ladder self-diagnosis, SharePoint permission scaling. Archived pre-edit state → `_archive/site-content-audit-2026-07-22.md`.
- 2026-07-21 (v20) — Weekly sweep, three additions from `_pending/weekly-update-2026-07-18.md` (approved "all" via `_pending/coo.notify-ai-site-weekly-2026-07-21.approval`, the notification's report field pointed to a non-existent `weekly-update-2026-07-21.md`; the notify body and pending recommendations both matched the 2026-07-18 report, which had no prior `approved-*.md`, so that file is the one actually applied): (1) Tools Row 02 Agent View row gets a sentence distinguishing the renamed commands, `/fork` now spawns a background session with its own row in Agent View rather than an in-session subagent, `/subtask` is the new command for launching a subagent inside the current session (CC v2.1.212); (2) Tools Row 01 `Tool(param:value)` permission row gets a sentence on two breaking scope/deprecation changes, `dir/**` allow rules now match only `<cwd>/dir` (use `**/dir/**` for the old any-depth match), and `Write(path)`/`Glob(path)` rules now show a startup deprecation warning (use `Edit(path)`/`Read(path)` instead) (CC v2.1.210/214); (3) same Agent View row gets a sentence noting the new default 200-call WebSearch cap and 200-spawn subagent cap per session, tunable if a workflow needs more (CC v2.1.212). Archived pre-edit state → `_archive/site-content-audit-2026-07-21.md`.
- 2026-07-12 (v19) — sc-content-sync, nested pass off COO audit 2026-07-12 (item 6): Brain Row 01 Learning 3 rotated to showcase learning #100 "Cross-repo dispatch needs a fine-grained PAT; submodule consumers need `--remote`" (replacing #46, showcased since v16). Judgment on the other flagged learnings: #101 (odd-metric bores) and #102 (concealed-transition split) are physical-fabrication lessons from tarones-castle with no matching site surface; #103–109 (promoted this same COO pass) are covered by the "∞ accumulated learnings" stat, no count surface to change. Archived pre-edit state → `_archive/site-content-audit-2026-07-12.md`.
- 2026-07-11 (v18) — Weekly sweep, three additions from `_pending/approved-2026-07-11.md` (all mapped to Tools Row 02, the site's closest equivalent to "Skills/Tools/Tips" — no standalone sections by those names exist in markup): (1) `/simplify` and `/batch` row added — reduces PR complexity / runs a change across many files; (2) `/code-review` multi-agent row added — background-agent team reviews every PR; (3) `/doctor` CLAUDE.md-hygiene row added — proposes trimming derivable content (CC v2.1.205–206). Archived pre-edit state → `_archive/site-content-audit-2026-07-11.md`.
- 2026-07-05 (v17) — sc-content-sync, motion philosophy system propagated (studio-memory PR #71, merged; ADR-026). Surfaced the new system on the two surfaces the sync flagged. Brain Row 04 "Springs over curves" retold to mirror the merged `creative-defaults.md` cross-ref: springs are the Systemic Restraint default, not a universal law, and Cinematic Direction and Experiential projects select their own easing. New Tools Row 02 row "Choose a project's motion language" (`sc-motion`) surfaces the five-skill family, the three philosophies, the shared procedural-animation library, and the Gate-1 ADR selection. No numeric motion-standard surface existed to change; the old 120 / 220 / 450 line was never mirrored into the audit. Archived pre-edit state → `_archive/site-content-audit-2026-07-05-motion.md`.
- 2026-07-05 (v16) — sc-content-sync, nested pass off COO audit 2026-07-05 (item 10): resolved a drift state where `content/` held two live audit copies (this file, stalled at v13/2026-06-21, and a `-v15` stray that had already absorbed the June 27 and July 4 weekly sweeps) — folded the stray's content in as canonical and archived the pre-fold state. Added two missing learnings flagged by COO Sweep 7: (1) learning #44 "Confirm Claude Code Desktop is on main before every session" added as a new paragraph under Step section Planning Context, alongside the existing main-sync-gate paragraph; (2) learning #46 "Separate auth-failure from response-shape-failure before debugging an integration" rotated into Brain Row 01 Learning 3 (replacing learning #49, which had been showcased since v11). Archived pre-fold state → `_archive/site-content-audit-2026-07-05.md`.
- 2026-07-04 (v15) — Weekly sweep, five additions from `_pending/approved-2026-07-04.md`: (1) "Keep budget low" row updated for the Sonnet 5 CC default (1M context, promo pricing through Aug 31) — CC v2.1.197; (2) background-agent auto-commit/push/draft-PR-on-completion sentence added to the Agent View row (CC v2.1.198); (3) new `Notification` hook row (`agent_needs_input` / `agent_completed`) added to Tools Row 01 (CC v2.1.198); (4) Karpathy ten-rule loop-level self-monitoring sentence added to Card 03 Agents body (circulated Jun 28); (5) `/dataviz` chart/dashboard skill row added to Tools Row 02 (CC v2.1.198). Archived pre-edit state → `_archive/site-content-audit-v14-2026-07-04.md`.
- 2026-06-27 (v14) — Weekly sweep, four additions from `_pending/approved-2026-06-27.md`: (1) `/rewind` session-recovery row added to Tools Row 02 (CC v2.1.191); (2) `!` bash auto-respond behavior row added to Tools Row 01 (CC v2.1.186); (3) auto mode safety guardrails sentence added to Step 09 autonomy-contract paragraph (CC v2.1.183); (4) Figma Motion MCP-compatibility sentence added to the Figma MCP row in Tools Row 02 (Config 2026, June 24). Archived pre-edit state → `_archive/site-content-audit-2026-06-27.md`.
- 2026-06-21 (v13) — Weekly sweep, four additions from `_pending/approved-2026-06-21.md`: (1) `Tool(param:value)` parameter-level permission row added to Tools Row 01 (Claude Code v2.1.178; `Agent(model:opus)` blocks Opus subagents, `Bash(command:rm*)` blocks destructive shell commands); (2) FigJam MCP row (Tools Row 02) updated for the June 16 Figma MCP server expansion — Slides, FigJam, Make, the Figma design agent, and `download_assets` for production-asset export; (3) `/config key=value` inline-session-config row added to Tools Row 02 (v2.1.181); (4) CC Artifacts row added to Tools Row 02 — session output as a shareable HTML page at a private URL (Team/Enterprise beta). Resync: the Tools tables in index.html had drifted to the v9 state, so the v10 (2026-06-13) FigJam and PostToolUse Tools rows were backfilled into the page so the site mirrors the audit.
- 2026-06-20 (v12) — sc-reference-review: two studio-scoped learnings adopted from "Claude Code's NEW Open Source Repo Builds Effective AI Agents in MINUTES!" (WorldofAI, reviewing github.com/wshobson/agents). Added learnings #61 (PluginEval-style skill self-eval before promotion) and #62 (one job, 2–8 components per plugin) to studio-memory learnings/INDEX.md; logged as studio ADR-020. Brain Row 01 Learning 3 rotated to showcase Learning #61 (skill self-eval). Watch: per-agent three-tier model assignment, Agent Teams parallel review. Skipped: installing the wshobson marketplace, Conductor, Gemini multi-harness. Archived pre-edit state → `_archive/site-content-audit-2026-06-20.md`.
- 2026-06-14 (v11) — sc-reference-review: two new learnings adopted from "I Cancelled Higgsfield & Built This Claude Skill Instead" (Systems by Vic). Added learnings #49 (Playwright MCP as agent hands) and #50 (SESSION-RESUME.md crash recovery) to studio-memory learnings/INDEX.md. Brain Row 01 Learning 3 rotated to showcase Learning #49. Archived pre-edit state → `_archive/site-content-audit-2026-06-14.md`.
- 2026-06-13 (v10) — Weekly sweep (2026-06-13). Five additions approved: (1) PostToolUse format-on-save hook + conditional `if` field added to Tools Row 01; (2) CLAUDE.md-via-PR-comment pattern added to Brain Row 01 Studio Memory desc; (3) FigJam MCP skills (`figma-use-figjam`, `generate-project-plan`, `get_figjam`) added as new row in Tools Row 02; (4) Combined with item 1. (5) "Agentic engineering" framing from Karpathy added to Card 03 Agents body. Archived pre-edit state → `_archive/site-content-audit-2026-06-13.md`.
- 2026-06-13 (v10) — Playwright functional testing added to sprint workflow. Generator writes tests per sprint (tests/[section-name].spec.ts) and runs them against the live preview before opening the PR — failures are fixed and retested before the PR opens. CI test.yml workflow added (Workflow 4 in Step 05) blocks merge until tests pass. Evaluator (Step 10) reads the test file and fails Functionality on missing or shallow tests. Step 04 scaffold adds @playwright/test, playwright.config.ts, tests/ directory, and "test" npm script to every new project. Decision logged in decisions/decisions.md.
- 2026-06-11 (v9) — `sc-design-crit` evaluation lens library propagated (studio-memory `bc40b32`, PR #37) plus two post-v8 workflow facts. New skill: the Evaluator now grades criteria 2–4 through a named lens library (Nielsen, Gestalt, Gerhardt-Powals, Norman, et al.) and every finding cites its lens — added to Step 10 body, Step 10 Evaluator prompt (read line), Brain Row 03 Quality-system desc, and Tools Row 02 Grade-a-sprint Why. Evaluator Originality criterion hardened (v2.5): Step 10 prompt criterion 1 now gates on slop-blocklist match plus POV-directive execution before scoring, with a Step 10 body sentence to match. Smallest preview breakpoint corrected 360 → 390 in four places (preview-script body, scaffold-prompt viewport + `390.png` filename, Step 09 build-prompt breakpoint line). New-copy em dashes set to comma/colon per the no-em-dash rule. Archived pre-sync state → `_archive/site-content-audit-2026-06-11-pre-sc-design-crit.md`.
- 2026-06-11 (v8) — §6 model-confirm pre-session gate propagated (studio-memory `a5c87a6`): model-confirm rule added to Workflow section intro — confirm the selected model before the first prompt of every session, Fable 5 is Planner/Evaluator-only, never the default. Archived v7 → `_archive/site-content-audit-2026-06-11.md`.
- 2026-06-11 (v7) — Fable 5 model-assignment pass plus runbook copy edits (branch `copy/fable-runbook-updates`). Fable 5 assigned to the Planner and Evaluator seats only: Card 04 (Sonnet/Opus/Fable split), Tools Row 01 "Keep budget low" Why, Tools Row 02 Turn-a-brief (`Claude.ai Planner (Fable 5)`) and Grade-a-sprint cells, Step 02 body, Step 10 body. Generator stays Opus 4.8; Sonnet 4.6 remains default. Step 09: `/effort xhigh` removed from body and prompt (retired). Step 10 "Never put a `/goal` on this session" → "`/goal` or `/loop`", with Card 03 and the Tools Row 02 Grade-a-sprint Why aligned to match. New Tools Row 02 `/loop` row added after `/goal` (session-scoped cron, v2.1.71+, in-session monitoring only, never on the Evaluator). For Hiring Managers: "Opus for the judgment work" → "Fable for the judgment work". Em dashes in all touched copy converted to comma/colon per the no-em-dash rule. Decision logged in `decisions/decisions.md` (2026-06-11). Archived v6 → `_archive/site-content-audit-v6-2026-06-07.md`.
- 2026-06-07 (v6) — Planning Context Rules §6 propagated (studio-memory `047ec2f`): pre-session main-sync gate added to the Workflow section intro — sync `main` and confirm up to date before any branch or worktree, ahead of every Claude Code session (scaffold, build, evaluate). New §6 surface; no prior audit mention. Archived v5 → `_archive/site-content-audit-v5-2026-06-06.md`. [auto-sync]
- 2026-06-06 (v5) — Workflow Contract v1 restructure propagated (studio-memory `1682408..3765125`). Card 01 body, Brain Row 01 desc + eyebrow, and Tools Row 01 retold for the split memory: ≤100-line core always loaded, learnings/ (37 files + INDEX.md), playbooks/. Step 13 rewritten to the sc-learn two-tier model — old Part A/B prompt replaced (it cited sections Phase 1 removed). Step 09 body gains the autonomy-contract paragraph (decide-and-log via sc-adr, sc-verify pre-PR, one gate packet). Step 10 body gains the sc-verify-vs-Evaluator distinction. Approval Gates lede §7 → §5; Brain Row 04 source §9 → playbooks/creative-defaults.md; Step 02 “only surface” claim corrected to the mirror model. Reconciliation: content/ v1–v3 strays removed per the 2026-06-03 canonical-file decision; the v4 lineage won the 2026-05-30 retelling conflict; root v2 stray deleted, its archive copy committed.
- 2026-06-05 (v4) — Shared Design System Infrastructure decision propagated (studio-memory `3493459`): shared-system carve-outs added to Step 07 body, Tools Row 02 `/sync-figma-token` row, Card 04 Figma paragraph, and Brain Row 02 desc; kickoff gate sentence added to Step 02 body; canonical-template propagation sentence added to Step 05 body. Mapping manifest bootstrapped at `_config/content-map.md`.
- 2026-05-30 (v3) — Three surgical updates: Opus 4.7 → 4.8 in Card 04, Tools Row 02, and Step 09; Dynamic Workflows (v2.1.154+) note added to Tools Row 02 Agent View row; `/code-review --fix` sentence added to Step 10 body.
- 2026-05-23 (v1) — Added `claude agents --json` scripting note to Tools Row 02 Agent View row (v2.1.145+). CLAUDE.md changes (item 1: `/simplify` → `/code-review`; item 2: `/goal` workflow note; item 3: `--json` flag) handed off to Claude Code via `_pending/approved-2026-05-23.md`.
- 2026-05-23 — Opus 4.7 additions. Step 09: `/effort xhigh` added to body and prompt as recommended effort tier for Generator sprint sessions. Step 10: `/ultrareview` added as pre-Evaluator code review step — parallel cloud reviewer agents, independently verified findings, code correctness only.
- 2026-05-23 — ICM layered context loading applied. Five-layer chain (CLAUDE.md → WORKSPACE.md → sprint CONTEXT.md → references/ → output/) replaces "read studio-memory.md before anything else" across Card 01, Card 03 Generator, Brain Row 01, Tools Row 01, Step 09 prompt, Step 10 prompt. Card 01 stats updated 3 → 5 memory layers. Brain Row 02 stages tree expanded to show per-stage CONTEXT.md / references/ / output/ structure. Step 13 split into build-log.md (every sprint) + studio-memory.md (standing standards only). Sprint contract now a versioned file at `stages/03-build/[sprint-name]/CONTEXT.md` — Step 09 summary/body/prompt/goal note and Step 10 prompt updated accordingly. Step 02 clarified that claude.ai project knowledge is the only surface where studio-memory.md loads as a single file.
- 2026-05-21 — Added user testing tooling (Maze / Lyssna / Dscout) across Tools Row 02, Step 10, Studio Brain Row 03, Approval Gates Gate 03, and all three For Hiring Managers tabs. Added derivative update to Card 02.

---

## NAVIGATION
Levi Bahn / AI
Overview → Workflow → Studio Brain → Tools → For Hiring Managers

Skip link: "Skip to: How I'd apply this at your company"

---

## SECTION 1 — HERO

**Eyebrow:** MEMORY // CONTEXT // SKILLS

**Headline:** I don't theorize about AI in design. I run a studio on it. This is how.

**Subline:** Studio memory that compounds, agents that hand off, approval gates that stay human. This is the working system, not a concept deck.

**CTA:** Skip to: How I'd apply this at your company →

---

## SECTION 2 — OVERVIEW (4 rows, each with title + lede)

**Row 01 (Overview)**
- Title: The system, in 90 seconds.
- Lede: Four pieces. They depend on each other. Tap a card to see how it works.
- Contains four expandable cards (Brain, Workflow, Agents, Tools)

**Row 02 (Workflow)**
- Title: Thirteen steps from brief to ship
- Lede: Thirteen steps, four human gates. Brief, plan, design, build, evaluate, ship.

**Row 03 (Studio Brain)**
- Title: Structure is the brain. Tools are the hands.
- Lede: Studio memory, workspace files, quality gates. The system that compounds.

**Row 04 (Tools)**
- Title: Right tool, right phase.
- Lede: Three quick-reference tables. Two callouts: Claude Design and Cowork.

---

## SECTION 2A — OVERVIEW CARDS (collapsed + expanded)

### Card 01 — The Brain (collapsed)
**Summary:** Studio memory that compounds. Every session starts smarter than the last.

### Card 01 — The Brain (EXPANDED)
Drag-to-rotate brain media. Hint: "Drag to rotate"

Every Claude Code session loads context in five layers, in order: root `CLAUDE.md` → project `WORKSPACE.md` → sprint `CONTEXT.md` → `references/` → `output/`. Studio identity, principles, and gates live in `studio-memory.md` — a core capped at 100 lines, loaded whole at every session start because it is small enough to afford. Everything deeper — accumulated learnings, code standards, creative defaults — loads on demand, named by the sprint CONTEXT.md Inputs table.

The sprint CONTEXT.md is the layer that does the work. It names the exact files (and sections) to load, the contract Claude is held to, and the audit checklist run before the PR opens. `references/` carry stable inputs for the sprint; `output/` carries this-run artifacts.

The memory grows. After each shipped project, `sc-learn` captures real learnings — the Next.js `trailingSlash` trap, the Supabase service-role GRANT lesson, the CSS-only layout reflow pattern — each one a file in `learnings/`, indexed in a single line. The next sprint starts with that knowledge already addressable. CLAUDE.md updates work in team contexts too — tag `@claude` in a GitHub PR review comment with a proposed rule and Claude applies the change to CLAUDE.md automatically, keeping institutional memory current without a separate commit workflow.

Stats: 5 memory layers · 7 design principles · ∞ accumulated learnings

Link: "See the full Studio Brain →"

---

### Card 02 — The Workflow (collapsed)
**Summary:** Brief, plan, design, build, evaluate, ship. Every gate is human.

### Card 02 — The Workflow (EXPANDED)
Media hint: "13 steps · 4 gates"

Thirteen steps, in order. I write a brief. The Planner expands it into a spec. I create the Figma file. The Generator scaffolds the project, sets up deploy and preview workflows, and waits. I design the brand system and pages in Figma. The Generator builds one section per sprint. The Evaluator grades each sprint against the four Shokunin criteria. In a team context, user testing runs here before the merge decision. I review the live preview on desktop and mobile, then merge.

Four approval gates protect the work: Concept (after Planner), Design (after Figma), Development (after Evaluator pass), Delivery (after final review). Nothing crosses a gate without me.

Goal Mode (`/goal`) only runs *between* gates. It collapses the per-turn prompting inside an authorized phase. It never replaces a gate.

Stats: 13 steps · 4 approval gates · 5 tools touched

Link: "Open the 13 steps →"

---

### Card 03 — The Agents (collapsed)
**Summary:** Planner, Generator, Evaluator. AI executes. I direct, review, and merge.

### Card 03 — The Agents (EXPANDED)
Media: PLAN / GEN / EVAL nodes + center "ME" node. Hint: "3 agents · 1 human"

The **Planner** turns a one-paragraph brief into a full product spec with sprint breakdown. Runs in Claude.ai with the studio project active. Cheap. One pass.

The **Generator** builds the sprint. Reads the layered chain — `CLAUDE.md` → `WORKSPACE.md` → the sprint's `CONTEXT.md` — and loads only the files named in that CONTEXT.md's Inputs table. Implements one section, runs the CONTEXT.md audit checklist before opening the PR, ships a PR with a live preview URL and four breakpoint snapshots. Dispatched as a background session in Agent View so it runs without my attention.

The **Evaluator** grades the sprint against Originality, Design Quality, Craft, and Functionality. Skeptical by design. Catches issues before I review. Single-pass: never put a `/goal` or `/loop` on it.

I do four things: brief, approve, review, merge. I am the only one who pushes to main. This is agentic engineering — orchestrating agents with the oversight and quality discipline of engineering, not casual prompting. A circulating ten-rule extension adds six runtime rules for loop-level self-monitoring — Verification (test before fixing), Debugging discipline, Dependency hygiene, Communication (actionable uncertainty), and four named failure modes (Kitchen Sink, Wrong Abstraction, Optimistic Path, Runaway Refactor) the agent should recognize and stop. Above that per-sprint loop, I run a second layer that decides what gets built at all: intake, a five-seat blind council, commissioning, and a night-runner queue that dispatches and verifies work on its own.

Stats: 3 AI agents · 1 human approver · 0 merges without me

Link: "See where each agent reads from →"

---

### Card 04 — The Tools (collapsed)
**Summary:** Claude, Figma, GitHub. Right tool, right phase.

### Card 04 — The Tools (EXPANDED)
Media: MAX, DESIGN, COWORK, FIGMA quadrants. Hint: "4 surfaces · 1 token pool"

**Claude Max** ($100/mo) gives me Opus, Sonnet, and Haiku on a shared token pool. Sonnet for content and scaffolding; Opus for sprint builds; Haiku for high-volume mechanical passes; Fable for planning and evaluator passes.

**Claude Design** runs on Opus 4.8 with its own independent weekly limit that does not touch the Max pool. I use it for visual inspiration before committing anything to Figma.

**Cowork** is the Desktop app's third tab. File-based knowledge work — briefs, memory updates, deliverable organization. Same connectors as chat. Remote dispatch from iPhone. Not Claude Code, not Agent View.

**Figma + Figma MCP** are the design system and the agent's interface to it. Sandbox is creative workspace; Production is canonical. `generate_figma_design` writes approved frames straight to the Production canvas — no manual promotion step. `/sync-figma-token` pulls tokens from Sandbox into `token-map.md` — for projects with their own token set; branded properties consume the shared system instead.

**GitHub Actions + Hostinger** handle deploys. Every PR opens a live preview at a real URL.

Stats: 4 surfaces · ~$120 per month · 1 token pool

Link: "See the full tool tables →"

---

## SECTION 3 — WORKFLOW (13 STEPS)

**Section title:** Thirteen steps from brief to ship.
**Lede:** Every step says exactly which tool, which prompt, and which approval gate. I do five of them. AI does the rest.

**Toolbar:** Expand all / Collapse all · "0 of 13 explored" progress bar

**Planning context — sync main before every session.** Before any Claude Code session in the workflow below — scaffold, build, evaluate — the local repo is synced to `main` (`git checkout main && git pull origin main`) and confirmed up to date with remote before any branch or worktree is created. A required pre-session gate from `studio-memory.md` §6 — not optional, not skipped because a change "looks small."

**Confirm the selected model before the first prompt of every session.** Fable 5.1 is never the default — it runs only on Planner and Evaluator passes.

**Confirm Claude Code Desktop is on main before every session.** CC Desktop auto-spawns a worktree off the active branch; confirm the primary checkout is on `main` (no `.claude/worktrees/` in the path) before pasting a prompt, or edits never reach the running server. Clean up a stray worktree with `git worktree remove`, never `rm -rf`.

### STEP 01 — Write the brief
- Badge: You do · Tool: Notes
- Summary: Four sentences. Who is the visitor, what do they need, what makes this different.
- Body: The brief is direction, not detail. The Planner expands it into a full product spec in the next step. I keep this short on purpose because length here makes the spec rigid downstream.
- **What I write:** what the site is for, who the visitor is, what they need to do or understand, what makes it different from every other site in the category.
- Prompt:
  > I'm starting a new project and need help sharpening my brief to 1–4 sentences.
  >
  > Here are my rough notes: [paste your notes]
  >
  > Apply the Shokunin Crafthouse lens — the brief should define who the visitor is, what they need to accomplish, and what makes this different. No fluff. Give me 2–3 brief options to choose from.

### STEP 02 — Run the Planner
- Badge: Prompt Claude · Tool: Claude.ai
- Summary: Brief in, full product spec out. Sprint breakdown, success criteria, tech stack.
- Body: The Planner runs on Fable 5.1 in the Shokunin Crafthouse project on Claude.ai. Project knowledge carries a verbatim mirror of the studio core plus the learnings index — canonical lives in the folder, and the mirror is never edited in place. Every Claude Code session uses the layered loader instead (Steps 09 and 10). Here, the full studio context informs spec generation in one shot.
- **What it returns:** project overview, complete deliverables list, design direction tied to the seven Shokunin principles, technical stack, three to six sprints, and specific success criteria per sprint.
- **Approval gate one — Concept.** I read the spec carefully and edit anything I disagree with before moving on.
- Before any design work starts, one more decision is logged in `decisions/decisions.md`: does this project consume the Shokunin shared design system? Branded properties link it and skip token extraction in Step 07. Client work self-hosts. A branded property that bypasses the shared system needs a written reason — logged, not assumed.
- Prompt:
  > You are the Planner agent for The Shokunin Crafthouse.
  > Read studio-memory.md from project knowledge.
  >
  > My brief: [your 1–4 sentences from Step 1]
  >
  > Produce a complete product spec including:
  > 1. Project overview and purpose
  > 2. Complete deliverables list (all pages or pieces)
  > 3. Design direction referencing the 7 Shokunin principles
  > 4. Technical stack and architecture decisions
  > 5. Sprint breakdown — 3–6 sprints, each a self-contained deliverable
  > 6. Success criteria per sprint — specific and testable, not vague
  >
  > Be ambitious. Look for opportunities where AI-native features would serve the product. Do not over-specify implementation — let the Generator figure out the path.

### STEP 03 — Create the Figma file
- Badge: You do · Tool: Figma
- Summary: Four pages: Sandbox, Brand System, Components, Production.
- Body: Figma MCP cannot create files. This step is always manual. I name the file, set up the four pages, and grab the file URL for the scaffold prompt.
- **The Sandbox rule:** Sandbox is creative workspace, Production is canonical. Claude reads from Sandbox and writes approved frames into Production via `generate_figma_design`. No manual promotion step.
- No prompt.

### STEP 04 — Scaffold the project
- Badge: Prompt Claude · Tool: Claude Code
- Summary: Workspace template, private GitHub repo, branch protection, Playwright preview script.
- Body: Claude Code clones the workspace template, creates a private GitHub repo under the studio org, populates `WORKSPACE.md` with project identity, wires in the Figma file URL, and confirms all four Figma pages exist via MCP.
- It also adds a Playwright preview script that captures screenshots at 390, 768, 1024, and 1440 so every PR carries a snapshot record. Optional `/goal` drives this through to a green build without per-turn prompting.
- Prompt:
  > Scaffold a new Shokunin Crafthouse project called [project name].
  >
  > 1. Clone the workspace template from
  >    ~/Projects/shokunin-crafthouse/studio-memory/templates/project-template/
  >    into a new folder called [repo-name]
  > 2. Create a new private GitHub repo called [repo-name] under
  >    the shokunin-crafthouse org
  > 3. Populate WORKSPACE.md with:
  >    - Project name: [project name]
  >    - Purpose: [1 sentence]
  >    - Client: [client name] or "Internal — Shokunin Crafthouse"
  >    - Primary deliverable: [e.g. "Wedding website with RSVP"]
  >    - Tech stack: [e.g. "Next.js, Tailwind, Hostinger shared hosting"]
  >    - Key design constraints: [paste from your brief]
  >    - Production domain: [domain or "TBD — previews disabled until set"]
  > 4. Add the Figma file URL to _config/design-system/figma-links.md:
  >    [paste Figma URL from Step 3]
  > 5. Fetch Figma file metadata via MCP to confirm all four pages exist:
  >    Sandbox, Brand System, Components, Production
  > 6. Create a PR build check workflow at .github/workflows/pr-check.yml
  >    that runs `npm ci && npm run build` on pull_request events targeting main.
  > 7. Add Playwright as a dev dependency and create scripts/preview.mjs that:
  >    - Accepts a sprint name as its only argument
  >    - Builds the project to its static output directory
  >    - Serves the build on a local port
  >    - Captures full-page screenshots at viewports 390, 768, 1024, and 1440
  >    - Saves PNGs to /previews/[sprint-name]/ as 390.png, 768.png, etc.
  >    - If dark mode is in scope, captures both modes (8 PNGs total)
  >    - Tears the server down on completion or failure (use try/finally)
  >    Add an npm script: "preview": "node scripts/preview.mjs"
  > 8. Add @playwright/test as a dev dependency. Create playwright.config.ts at
  >    the repo root with:
  >    - testDir: './tests'
  >    - BASE_URL read from process.env.BASE_URL (no default — must be supplied)
  >    - One project: chromium only (CI runs headless; local runs can add browsers)
  >    - Timeout: 30s per test, 60s per expect
  >    Create a tests/ directory with a .gitkeep so it commits empty.
  >    Add an npm script: "test": "playwright test"
  > 9. Track /previews/ and /tests/ in the repo (do NOT add either to .gitignore).
  > 10. Initialize git, commit everything, and push to main on GitHub.
  >
  > Report the GitHub URL when done.

### STEP 05 — Wire deploy and preview workflows
- Badge: Prompt Claude · Tool: Claude Code
- Summary: Four GitHub Actions: production deploy, PR preview, preview cleanup, Playwright tests.
- Body: Push to main triggers an rsync to Hostinger production. Every PR triggers a preview build at `/_previews/[pr-number]/` with a sticky comment dropping the live URL into the PR. Close the PR and the cleanup workflow tears the directory down. A fourth workflow (test.yml) runs Playwright tests against the live preview and must pass before merge is allowed — it is added to the branch protection required status checks after committing.
- Claude Code prints the predicted preview URL directly in chat and runs `gh run watch` to confirm the deploy succeeded. No GitHub round-trip to find a URL.
- I review desktop and mobile from the live URL, not screenshots. The PR closes and the preview tears down on its own.
- The workflow files themselves are sourced from the canonical templates in studio memory — updated once there and propagated, never edited repo by repo.
- Prompt:
  > Create four GitHub Actions workflows for this project. The domain for this project is: [your domain]
  >
  > WORKFLOW 1 — Production deploy
  > File: .github/workflows/deploy.yml
  > - Trigger: push to main branch
  > - Action: burnett01/rsync-deployments@7.0.1
  > - Switches: -avzr --delete
  > - remote_host: ${{ secrets.HOSTINGER_HOST }}
  > - remote_port: 65002
  > - remote_user: ${{ secrets.HOSTINGER_USER }}
  > - remote_key: ${{ secrets.HOSTINGER_SSH_KEY }}
  > - remote_path: ~/domains/[your domain]/public_html/
  >
  > WORKFLOW 2 — PR preview deploy
  > File: .github/workflows/preview-deploy.yml
  > - Trigger: pull_request, types [opened, synchronize, reopened], targeting main
  > - Steps: checkout PR head; setup Node 20 + npm ci; build with BASE_PATH=/_previews/${{ github.event.pull_request.number }};
  >   write robots.txt blocking indexing into the build output; rsync to ~/domains/[your domain]/public_html/_previews/${{ github.event.pull_request.number }}/;
  >   post (or update) a sticky PR comment containing the preview URL with a 🔗 icon, bold "Preview ready", and a clickable link.
  >
  > WORKFLOW 3 — PR preview cleanup
  > File: .github/workflows/preview-cleanup.yml
  > - Trigger: pull_request, types [closed], targeting main
  > - Steps: ssh in via appleboy/ssh-action@v1 and `rm -rf ~/domains/[your domain]/public_html/_previews/${{ github.event.pull_request.number }}/`; post a confirmation comment on the PR.
  >
  > WORKFLOW 4 — Playwright functional tests
  > File: .github/workflows/test.yml
  > - Trigger: pull_request, types [opened, synchronize, reopened], targeting main
  > - needs: preview-deploy (wait for the preview to be live before running tests)
  > - Steps:
  >   - Checkout PR head
  >   - Setup Node 20 + npm ci
  >   - Install Playwright browsers: npx playwright install --with-deps chromium
  >   - Run tests: BASE_URL=https://[your domain]/_previews/${{ github.event.pull_request.number }} npm test
  >   - On failure: upload test-results/ as an artifact named playwright-report
  > - This workflow must pass before merge is allowed. Add it to the branch
  >   protection required status checks for main after committing.
  >
  > For Next.js: also update next.config.js to read basePath and assetPrefix from process.env.BASE_PATH (defaulting to '').
  > For HTML+CSS: ensure all asset paths are relative (./images/ not /images/).
  >
  > Commit all four workflow files plus any framework config changes to a new branch called add-deploy-and-preview-workflows, and push to GitHub.

### STEP 06 — Explore visual direction in Claude Design
- Badge: You + Claude · Tool: Claude Design
- Summary: Two opposing directions. A choice a principal designer would recognize as deliberate.
- Body: Claude Design runs on Opus 4.8 with its own independent weekly limit that does not touch the Max pool. I treat it as a free creative resource for exploration before committing anything to Figma.
- The pattern is two opposing directions: my instinct, then its opposite. The contrast forces a decision about point of view. Output saves to `stages/02-design/claude-design/`.
- Prompt (two prompts):
  > # Prompt 1 — Direction 1 (your instinct)
  >
  > I'm designing [what the site is] for [who the visitor is].
  >
  > WHAT'S LOCKED
  > [list anything already decided — colors, illustration style, etc. If nothing is locked, say "Nothing locked — full exploration."]
  >
  > WHAT NEEDS EXPLORING
  > [list what's still open — typography, layout language, illustration style, graphic details, etc.]
  >
  > BRIEF
  > [paste your 1–4 sentence brief]
  >
  > Apply Shokunin Crafthouse design principles from studio-memory.md: one clear point of view, restraint as a creative act, originality over safety, no template layouts.
  >
  > Generate Direction 1: your interpretation of this brief taken somewhere unexpected — a choice a principal designer would look at and see intent. Use real typography, real color. No generic gradients, no stock illustration style, no purple-on-white card layouts.
  >
  >
  > # Prompt 2 — Direction 2 (the opposite)
  >
  > Generate Direction 2 for the same project.
  >
  > Direction 1 was [describe it in one sentence]. Direction 2 should be its opposite — if Direction 1 leaned warm and expressive, Direction 2 should be cool and architectural. If Direction 1 was organic, Direction 2 should be precise. Same brief, completely different point of view. Same locked constraints.
  >
  > Show the same type of layout. Real typography, real hierarchy. A choice a principal designer would recognize as deliberate.

### STEP 07 — Build the brand system in Figma
- Badge: You + Claude · Tool: Figma + MCP
- Summary: Tokens first, components second. Extract to token-map.md before any code.
- Body: I build color styles, the type scale, the spacing scale, and base components on the Sandbox page. Type is solved before anything else because changing typefaces later is a redesign.
- Then Claude Code reads the Figma file via MCP and writes `_config/design-system/token-map.md`. That file becomes the source of truth — no color, font, or spacing value gets used in code unless it lives there. Shokunin-branded properties skip this extraction entirely — their tokens and fonts come from the shared design system at brand.shokunincrafthouse.com, decided once at project kickoff. Only projects with an isolated token set run the extraction.
- **Approval gate two — Design.** Token map approved before any sprint starts.
- Prompt (two prompts):
  > # Prompt 1 — Claude.ai · Checklist + copy
  >
  > Read the approved product spec. [paste spec or attach file]
  >
  > Before I open Figma, give me two things:
  >
  > 1. BRAND SYSTEM CHECKLIST — what specifically do I need to define in Figma for this project? List:
  >    - Color token names I should create (not hex values — I'll pick those)
  >    - Type scale stops I'll need (display, heading sizes, body, labels, captions)
  >    - Spacing scale stops
  >    - Component list for this specific site
  >    Be specific to this project, not a generic list.
  >
  > 2. COPY FOR MOCKUPS — write production-intent copy for every text element on [primary page — e.g. homepage]:
  >    - Headline, subheadline, all body copy sections
  >    - All CTA button labels
  >    - Navigation labels
  >    - Footer copy
  >    Write it as if it's shipping tomorrow. No lorem ipsum.
  >    Tone: [describe or paste from _config/voice/]
  >
  >
  > # Prompt 2 — Claude Code · Extract tokens to token-map.md
  >
  > The brand system on the Figma Sandbox page is approved.
  > Read the Figma file using Figma MCP: [paste Figma file URL]
  >
  > Extract from the Sandbox page:
  > 1. All color styles and their hex values
  > 2. Typography styles and their full properties (family, size, weight, line height, letter spacing)
  > 3. Any component variants defined
  >
  > Save as token-map.md in _config/design-system/ in the current project folder.
  >
  > This file is the source of truth for all implementation. No color, font, or spacing value gets used in code unless it's in this file.

### STEP 08 — Design pages in the Figma Sandbox
- Badge: You do · Tool: Figma
- Summary: One section at a time. Four breakpoints. Five interaction states.
- Body: One section, designed completely, before the next one starts. Every breakpoint is drawn, never assumed. Every interactive element has all five states: default, hover, focus, active, disabled.
- Motion decisions are written into `decisions/decisions.md`, not just prototyped. Dark mode is either fully designed or formally deferred — the decision is logged.
- No prompt.

### STEP 09 — Build the sprint
- Badge: Prompt Claude · Tool: Claude Code
- Summary: Contract file first. Then implementation. PR opens with a live preview URL.
- Body: The Generator reads the layered chain (`CLAUDE.md` → `WORKSPACE.md` → the sprint `CONTEXT.md` at `stages/03-build/[sprint-name]/CONTEXT.md`), loads only what the CONTEXT.md Inputs table names, pulls the Sandbox frames via Figma MCP, and proposes a contract. Once I approve, Claude writes the approved contract into the CONTEXT.md Contract field, updates Status to `approved`, and commits the file before any code lands.
- Implementation is mobile-first across all four breakpoints. Asset paths must work both at root and at `/_previews/[N]/`. Before opening the PR, Claude runs every item in the CONTEXT.md Audit checklist and updates Status to `complete`. The PR opens with four snapshot screenshots embedded and a sticky comment carrying the live preview URL.
- Dispatched via Agent View as a background session, so the build runs without my attention. Optional `/goal` drives it through to a ready-to-review PR after the contract file is approved and committed.
- The build runs under the autonomy contract. Any call that is reversible, within studio standards, and within scope gets made and logged to `decisions/decisions.md` via `sc-adr` — not asked. Before the PR opens, `sc-verify` runs the Gate-3 self-check; failures are fixed or flagged, never silently presented. The PR, preview URL, decisions since the last gate, and verify report arrive together as one gate packet. Scope changes, money, live services, and brand direction still come to me. Always. Auto mode (v2.1.183+) enforces additional guardrails in unattended sessions: `git reset --hard`, `git clean -fd`, `git stash drop`, `git commit --amend` (on commits not made this session), and infrastructure teardown commands (`terraform destroy`, `pulumi destroy`, `cdk destroy`) are blocked unless the prompt explicitly requests the destructive action — the agent pauses rather than proceeds.
- Prompt:
  > /caveman
  >
  > Read WORKSPACE.md first. Then read the sprint CONTEXT.md at:
  > stages/03-build/[sprint-name]/CONTEXT.md
  >
  > Load only the files listed in the Inputs table — do not load studio-memory.md in full. The Inputs table specifies exactly which sections are needed for this sprint.
  >
  > Using Figma MCP, read the [section or page name] frames on the Sandbox page of this Figma file: [paste Figma URL]
  >
  > Before writing any code:
  > 1. Propose a sprint contract — exactly what you will build and the specific criteria I will use to verify it's complete
  > 2. Stop and wait for my approval of the contract
  > 3. After I approve, write the approved contract into the "Contract" section of stages/03-build/[sprint-name]/CONTEXT.md, update Status to "approved", and commit the file
  > 4. Only begin implementation after the file is committed
  >
  > Implementation requirements:
  > - Framework: [Next.js / HTML+CSS / React — pick one]
  > - All values must come from token-map.md — do not invent any color, font, or spacing not in that file
  > - Mobile-first, all four breakpoints: 390, 768, 1024, 1440
  > - Asset paths must work both at root (production) and at a subpath (PR previews). Use relative paths or read BASE_PATH from env. Do NOT hardcode absolute asset paths like /images/foo.png.
  >
  > When implementation is complete:
  > 1. Write Playwright tests in tests/[section-name].spec.ts covering:
  >    - Primary user flows complete without error (navigation works, CTAs are reachable, forms submit or are correctly gated)
  >    - All interactive elements are reachable at keyboard (tab order, focus states present in DOM)
  >    - No broken assets (images and fonts return 200, checked via request interception)
  >    - No console errors on load
  >    - Page renders without horizontal overflow at 390 and 1440 viewport widths
  >    Tests run against BASE_URL from env — do not hardcode any URL or localhost.
  > 2. Create a feature branch called feat/[section-name] and push it
  > 3. Open a draft PR so the preview-deploy workflow runs and the live preview URL is available
  > 4. Run `gh run watch --exit-status` on preview-deploy.yml and wait for it to complete
  > 5. Run the Playwright tests against the live preview:
  >    BASE_URL=https://[domain]/_previews/[pr-number]/ npm test
  >    If any test fails: fix the failure, push to the branch, wait for preview to redeploy, rerun tests. Do not proceed until all tests pass against the live preview.
  > 6. Run `npm run preview [section-name]` to generate snapshot screenshots at all four breakpoints into /previews/[section-name]/
  > 7. Run through every item in the Audit section of stages/03-build/[sprint-name]/CONTEXT.md. Check each item explicitly. If any item fails, fix it first. Update Status to "complete" after all audit items pass.
  > 8. Convert the draft PR to ready for review. Update the PR body with: summary, "## Live Preview" with the clickable URL, "## Snapshots" with 4 embedded images, "## Test results" confirming all Playwright tests passed with the test names listed.
  > 9. Print the preview URL in chat as a raw cmd-clickable line: 📱 Preview URL: https://[domain]/_previews/[pr-number]/
  > 10. Run `gh run watch --exit-status` on test.yml to confirm CI tests also pass and print ✅ on success / ❌ + failure logs on fail
  > 11. Stop and wait — do not proceed to the next section without my approval

### STEP 10 — Evaluate the sprint
- Badge: Prompt Claude · Tool: Claude Code
- Summary: Fresh session. Single pass. Four criteria scored. PASS or FAIL.
- Body: If the Generator needs to apply targeted cleanup before the Evaluator runs, `/code-review --fix` (v2.1.152+) writes review findings directly to the working tree in one pass. Before the Evaluator session, run `/ultrareview` on the open PR branch. It spins up parallel cloud reviewer agents against the diff, independently verifies every finding, and surfaces only confirmed bugs — catching code-level issues before design review begins. It reviews code correctness only; the Evaluator session runs after.
- `sc-verify` (the Generator's self-check, Step 09) and the Evaluator are complementary, not redundant. Self-verify first — cheap, catches the builder's own obvious failures. Independent audit second — catches what the builder is blind to. A sprint that passes `sc-verify` can still fail the Evaluator. That is the system working.
- The Evaluator does not grade on taste. It applies a named lens library, the `sc-design-crit` skill, that maps each criterion to established frameworks: Nielsen and Norman for Functionality, Gestalt and visual hierarchy for Design Quality, Gerhardt-Powals for Craft judgment, peak-end and Zeigarnik for Originality. Every finding cites its lens and carries a severity, so "this feels off" becomes a defect with a fix instead of an opinion.
- A fresh Claude Code session on Fable 5.1, deliberately uncontaminated by the build context. It reads the snapshots, fetches the live preview to confirm structural integrity, then audits the code for token discipline and accessibility patterns.
- Grades against Originality, Design Quality, Craft, Functionality. Craft and Functionality are required passes — sprints cannot ship with failures there. Skeptical by design: uncertainty equals fail. Originality is gated before it is scored: a slop-blocklist match or an unexecuted POV directive fails it outright.
- In a team context, the Evaluator pass is necessary but not sufficient. The AI grades Functionality against code and visual snapshots — not against observed behavior. User testing runs here, between the Evaluator result and the merge decision. Which tool depends on company stage.
- **Never put a `/goal` or `/loop` on this session.** The Evaluator is single-pass by design; a goal would loop it on itself and defeat the audit.
- Prompt:
  > /caveman
  >
  > You are the Evaluator for The Shokunin Crafthouse.
  > Read WORKSPACE.md first. Then read the sprint CONTEXT.md at:
  > stages/03-build/[sprint-name]/CONTEXT.md
  >
  > The CONTEXT.md contains the approved sprint contract, the Inputs table (what the Generator was supposed to load), and the pre-output audit checklist (what the Generator was supposed to verify before opening the PR). Read all three sections before grading.
  >
  > Also apply the `sc-design-crit` lens library when grading criteria 2–4, and cite each lens by name in your findings.
  >
  > The Generator just completed Sprint [N].
  > Live preview URL: [paste the URL from the bot comment on the PR]
  >
  > Evaluation order:
  > 1. First, open /previews/[section-name]/ and grade design quality, craft, originality, and functionality from the snapshot images across breakpoints. These are the canonical visual surface — what a real visitor would experience.
  > 2. Second, fetch the live preview URL to confirm: the page returns 200, copy matches the snapshots, asset paths resolve, and there is no obvious structural breakage in the raw HTML. Note: WebFetch returns text only — do not use it to grade any visual criterion.
  > 3. Third, read the code to verify token discipline (every color, font, spacing value comes from token-map.md), accessibility patterns, and that asset paths work both at root and under /_previews/[N]/.
  > 4. Fourth, read tests/[section-name].spec.ts. Verify the tests cover the primary flows, not just trivial assertions. Flag shallow tests (e.g. "page loads" with no behavioral assertion, tests that always pass regardless of implementation) as a Functionality failure. A test file that does not exist is an automatic Functionality FAIL.
  >
  > Do NOT spin up a local dev server. The live preview URL is already running on Hostinger.
  >
  > Grade against our 4 criteria:
  > 1. Originality — two hard gates, then judgment (score out of 10): (a) any match against the slop-blocklist fails this criterion outright; (b) every POV directive for the sprint must be executed, or it fails; (c) only if both pass, judge deliberate creative decisions beyond the POV.
  > 2. Design Quality — coherent whole, distinct mood, not a template (score out of 10)
  > 3. Craft — typography, spacing, color harmony, contrast ratios (REQUIRED PASS — cannot ship with craft failures)
  > 4. Functionality — users can complete tasks without confusion, Playwright tests exist and are non-trivial (REQUIRED PASS — cannot ship with broken flows or missing/shallow tests)
  >
  > Be skeptical. Uncertainty = fail. Do not praise mediocre work.
  >
  > Output:
  > - Score and specific finding for each criterion
  > - PASS (ready to merge) or FAIL (list exact fixes required before merging)

### STEP 11 — Merge and deploy
- Badge: You do · Tool: GitHub
- Summary: I am the only one who pushes to main. Production rsyncs in ~30 seconds.
- Body: Final desktop and phone review on the preview URL. Click Merge. The production deploy workflow rsyncs to Hostinger in seconds; the cleanup workflow tears down the preview directory in parallel.
- Then `generate_figma_design` writes the approved Sandbox frames to the Production page in Figma. No manual promotion step.
- **Approval gate three — Development.** Sprint passes only after preview review, evaluator PASS, and final visual check.
- No prompt.

### STEP 12 — Repeat for each section
- Badge: You do · Tool: Workflow
- Summary: Design, build, evaluate, merge, promote. One section at a time.
- Body: One section at a time. I do not design everything before building anything. The loop produces fast feedback: each shipped section informs the next, and the studio memory grows project-by-project rather than at the end.
- No prompt.

### STEP 13 — Update the studio memory
- Badge: Prompt Claude · Tool: Claude Code
- Summary: One skill. `sc-learn` captures every sprint automatically. I approve only what compounds.
- Body: At sprint close `sc-learn` runs three captures without hand-holding. The repo's own `LEARNINGS.md` takes project-specific lessons — quirks, gotchas, stack-specific fixes — so each repo gets smarter about itself. `build-log.md` takes the sprint record; it is never loaded as agent context. Studio promotion stays deliberate: candidates that pass the compounding test — *will this change how an unrelated future project is built?* — are drafted for my approval, and approved entries land as files in `learnings/` with a one-line index entry. Nothing is appended to the core — it is capped at 100 lines, and noise there degrades every future session.
- **Approval gate four — Delivery.** Repo learnings captured, build-log appended, promotions approved only where they earn their place. The project closes.
- Prompt:
  > Run sc-learn for this sprint. Capture repo learnings to LEARNINGS.md, write the
  > build-log entry, and draft studio-promotion candidates per the §8 compounding test.
  > Show me the promotion candidates before promoting any to studio-memory/learnings/.

---

### APPROVAL GATES TABLE (callout)
**Eyebrow:** Four approval gates
**Title:** Every gate is human. AI waits at each one.
**Lede:** From `studio-memory.md` §5. Gate failures stop the sprint. No exceptions.

| Gate | After | What must be true |
|------|-------|-------------------|
| 01 Concept | Planner | Direction agreed, references aligned, scope written down. |
| 02 Design | Brand system in Figma | Type system resolved, tokens defined, responsive behavior specified at every breakpoint, motion principles stated. |
| 03 Development | Evaluator pass | All interaction states implemented, Core Web Vitals met, keyboard and screen-reader verified, reduced-motion working, Chrome/Firefox/Safari verified. User testing completed, or formally skipped with documented rationale. |
| 04 Delivery | Production deploy | Staging review signed off, analytics live, error monitoring on, metadata and redirects confirmed, legal artifacts in place, security pass run (scanners everywhere, adversarial authz where credentials, data, or payments are held), load tested at realistic concurrency on any server or database surface. |

---

## SECTION 4 — STUDIO BRAIN

**Title:** Structure is the brain. Tools are the hands.
**Lede:** These are the files Claude reads at the start of every session. The studio gets smarter with every project because this memory persists.

### Brain Row 01 — Studio Memory
**Desc:** `studio-memory.md` is the studio's core institutional memory — identity, design principles, quality criteria, stack defaults, and approval gates, capped at 100 lines and loaded at the start of every session. Depth lives beside it, not inside it: accumulated learnings in `learnings/` (one file per lesson, indexed one line each), code standards and creative defaults in `playbooks/`. Sessions read a detail file only when the work calls for it. The next sprint starts with the relevant learnings already addressable, without paying for the rest in context tokens.

**Eyebrow:** Three real entries from `learnings/`

**Learning 1 — 2026-05-09**
**Next.js `trailingSlash: true` needs `skipTrailingSlashRedirect: true` for POST routes.**
POST requests get 308-redirected and never reach the handler. Stripe webhooks fail silently. Always pair the two settings, or the URL convention quietly breaks server integrations.

**Learning 2 — 2026-05-09**
**Supabase service role needs explicit `GRANT` even with RLS disabled.**
Disabling row-level security does not grant table access. Backend writes fail with permission errors until `grant all on table … to service_role;` is added in every table-creation migration.

**Learning 3 — 2026-07-22**
**Raw session media is processed once — read the derivative, never the transcript.**
Transcripts and recordings are write-once inputs. One processing pass produces the derived artifact — the verdict, the brief, the package — and folder structure routes every future session to that derivative. Re-reading raw media burns tokens on already-extracted signal and invites re-deciding what was already decided.

### Brain Row 02 — Workspace architecture
**Desc:** Every project clones from the same template. `WORKSPACE.md` defines the project. `WORKFLOW.md` defines the stages and approval gates. `token-map.md` is the design system source of truth for projects with an isolated token set; Shokunin-branded properties consume the shared system at brand.shokunincrafthouse.com. Stages live in numbered folders so the lifecycle is visible at a glance.

**Eyebrow:** Open any folder below to see what's inside

**File tree:**
- `[project-name]/` — project root
  - `WORKSPACE.md` — Read first. Project identity.
  - `WORKFLOW.md` — Stage flow + approval gates.
  - `workspace.manifest.yaml` — Machine-readable index.
  - `adapters/` — Model-specific bootstraps.
    - `claude/CLAUDE.md` — Points Claude Code at WORKSPACE.md.
    - `generic/BOOTSTRAP.md` — Model-neutral entry.
  - `_config/` — Project-specific configuration.
    - `brand/` — Colors, logos, type pairings.
    - `voice/` — Tone, copy direction.
    - `design-system/` — Source of truth for implementation.
      - `figma-links.md` — Canonical Figma URLs.
      - `token-map.md` — Extracted Figma tokens.
      - `ui-rules.md` — Component + layout rules.
  - `stages/` — Five stages, numbered. Each stage holds `CONTEXT.md` + `references/` + `output/`.
    - `01-brief/`
      - `CONTEXT.md` — Stage contract: Inputs, Process, Outputs, Audit.
      - `references/` — Stable inputs the stage consumes (brief, scope).
      - `output/` — Stage deliverables (approved spec).
    - `02-design/`
      - `CONTEXT.md`, `references/`, `output/` (plus `figma/`, `claude-design/`).
    - `03-build/`
      - `CONTEXT.md` — Top-level build stage contract.
      - `[sprint-name]/` — One folder per sprint, each with its own `CONTEXT.md` (Inputs table, approved contract, audit checklist), `references/`, `output/` (snapshots, evaluator report).
    - `04-review/`
      - `CONTEXT.md`, `references/`, `output/`.
    - `05-launch/`
      - `CONTEXT.md`, `references/`, `output/`.
  - `decisions/` — Rationale log.
    - `decisions.md` — Why we chose what we chose.

### Brain Row 03 — Quality system
**Desc:** Quality is systematic, not subjective. Each criterion is graded through a named lens library (the `sc-design-crit` skill), so every finding cites an established framework rather than a reviewer's taste. The Evaluator grades every sprint against four criteria. Two are required passes — sprints cannot ship with failures there. The four approval gates protect the system from drift.

**Eyebrow:** The four criteria

- **Originality** (Highest weight) — Evidence of deliberate creative decisions. No AI-default patterns. A human designer should see intent.
- **Design quality** (Highest weight) — Coherent whole. Color, type, layout, imagery, and interaction combine into a distinct mood, not a collection of parts.
- **Craft** (Required pass) — Typography hierarchy, spacing consistency, color harmony, contrast ratios. The competence floor. Failures here are disqualifying.
- **Functionality** (Required pass) — Users understand what the interface does, find primary actions, and complete tasks without guessing. The AI Evaluator approximates this from code and snapshots. User testing confirms it from real behavior.

### Brain Row 04 — Creative defaults
**Desc:** These are the defaults I've encoded so every session starts with a point of view, not a blank canvas. From `playbooks/creative-defaults.md`. Override with intent and reason, never by accident.

- **Start monochromatic.** One accent, introduced late, with purpose. Three colors is usually one too many.
- **Springs over curves.** Springs feel physical; cubic-beziers feel digital. In the studio's motion philosophy system they are the Systemic Restraint default: Cinematic and Experiential projects choose their own easing, and choreographed timelines still use curves.
- **One typeface family, full range.** Two families only if they refuse to compete. Display vs. body, sharp hierarchy, no overlap.
- **Grid as premise, not prison.** Break the grid rarely and with force. The break works only because the grid exists.
- **Know the register.** Dense UIs read as capable. Sparse UIs read as premium. Pick deliberately. Do not default to sparse because it is easier.
- **Detail is the craft, not the polish.** Scrollbar, favicon, empty state, 404, loading skeleton, form-error copy. These are the work, not the finishing touches.
- **Copy ships, never lorem.** Button labels, error copy, placeholders, onboarding. All design decisions. Production text is written, never filler.

---

## SECTION 5 — TOOLS

**Title:** Right tool, right phase.
**Lede:** Three tables. Designed to scan, not read. Claude Design and Cowork get their own callouts because they're often misunderstood.

### Tools Row 01 — Studio Setup

| If I need to… | Use this | Why |
|---------------|----------|-----|
| Persist studio identity across every session | `studio-memory.md` + Claude Project | The ≤100-line core loads whole at session start; learnings and playbooks load on demand via the sprint Inputs table. The studio compounds without paying full-file context cost each sprint. |
| Build with the agent | Claude Code (terminal) | All code work — scaffold, build, deploy. Background sessions in Agent View. |
| Protect main from accidents | GitHub branch ruleset | PR required, force-pushes blocked, deletions restricted. I am the only approver. |
| Constrain Claude's reach | `~/.claude/settings.json` | Allowed paths only. SSH, keychains, personal docs blocked. |
| Block specific tool inputs or subagent models | `Tool(param:value)` permission syntax (v2.1.178) | Parameter-level matching. `Agent(model:opus)` blocks Opus subagents; `Bash(command:rm*)` blocks destructive shell commands. More surgical than blocking the tool entirely. `dir/**` allow rules now match only `<cwd>/dir`, use `**/dir/**` for the old any-depth match; `Write(path)`/`Glob(path)` rules show a startup deprecation warning, use `Edit(path)`/`Read(path)` instead. |
| Automate post-write actions or scope hooks to specific tools | PostToolUse hook + `if` field | A PostToolUse hook fires after every tool call — use it for format-on-save after file writes without IDE dependency. Scope hooks to specific tool patterns with the `if` field: `"if": "Bash(git *)"` fires only on Bash calls matching `git *`. Reduces overhead; hooks run only where they're needed. |
| Notify an external system when a background agent needs input or finishes | `Notification` hook (v2.1.198) | The `Notification` hook fires on `agent_needs_input` and `agent_completed` events — the bridge between a background Claude Code session and any external notification system (iMessage dispatch, Cowork remote, a webhook). |
| Run a shell command and have Claude analyze the output | `!` bash prefix (v2.1.186) | Prefix any command with `!` to run it in bash and have Claude automatically respond to the output — not just add it to context. Opt out with `"respondToBashCommands": false` in `settings.json` to restore the previous context-only behavior. |
| Run Claude Code against private infrastructure | `claude self-hosted-runner` (v2.1.224, Team/Enterprise) | Runs Claude Code web, mobile, and desktop sessions on your own machines or containers instead of Anthropic's. The session gets internal network access and whatever custom tooling lives on that box, and the whole execution environment stays inside your own compliance boundary. The path to using an agent against infrastructure that was never going to be reachable from the outside. |
| Keep budget low by default | Sonnet 5 | Sonnet 5 default (1M context). Opus 4.8 for sprint builds. Fable 5.1 only for Planner and Evaluator passes, the two judgment seats. |
| Tune instructions for Claude 5 models | Prune, don't expand | Shorter CLAUDE.md files and skills outperform verbose ones on Sonnet 5, Fable 5.1, and Mythos 5+. Anthropic cut Claude Code's own system prompt 80% (800 → 164 tokens) with no measured performance loss (claude.com/blog, 2026-08-13). The finding inverts the instinct to add more guidance — prune and distill existing instructions rather than expanding them. |
| Work fullscreen in a large terminal | `/tui fullscreen` | Renders Claude Code across the whole terminal window instead of the default inline view. `CLAUDE_CODE_SCROLL_SPEED` tunes scroll sensitivity; `Ctrl+O` opens transcript mode to review the full session history without leaving the pane. |
| Cut Claude's response verbosity | `"outputStyle": "Concise"` (settings.json or `/config`) | Claude leads with the result and skips narration. Errors and destructive-action warnings still get full content. v2.1.237. |
| Lock down tool surface for automated tasks | `CLAUDE_CODE_RESTRICTED=1` or `--restricted` (v2.1.248) | Removes Bash, code-execution, and WebFetch tools unless explicitly named, restricts file tools to the working directory, and ignores user, project, and local settings files. Right-sized for headless pipelines and cron-driven sessions. |

### Tools Row 02 — Project Workflow

| If I need to… | Use this | Why |
|---------------|----------|-----|
| Vet a new idea before committing to it | Council pipeline (`sc-intake` → `sc-council` → `sc-commission` → `sc-orchestrate`) | Five blind seats (market, craft, ops, risk, finance) review the brief anonymized, debate, and return a verdict: proceed, proceed with conditions, park, or kill, logged as a decision record. An approved idea gets mapped to templates and skills, commissioned into a brief and contracts, then dispatched and verified by a queue-driven runner that works unattended between my sign-offs. |
| Draft UI artboard options from the terminal | `/design <brief>` (research preview, Pro/Max/Team/Enterprise, v2.1.233+) | Publishes a canvas of editable artboards as an artifact straight from a CLI prompt. I pick one and tell Claude to implement it. Bridges Gate 1 ideation and Gate 2 Figma work without opening a browser. |
| Turn a brief into a spec | Claude.ai Planner (Fable 5.1) | Studio context already in project knowledge. One pass. |
| Prune unused skills from a loaded session | `/skill-doctor` (v2.1.261) | Lists every loaded skill that went unused in the session and how many tokens each consumed. Prune the plugin inventory with data instead of guessing. |
| Explore visual direction | Claude Design (Opus 4.8) ★ | Separate weekly limit. Does not draw from Max pool. Free creative resource within its own cap. |
| Choose a project's motion language | `sc-motion` | Selects one of three motion philosophies, Systemic Restraint, Cinematic Direction, or Experiential, plus a shared procedural-animation library, and pins the choice as an ADR at Gate 1. One language per project, held to the end. The invariants hold across all three: reduced-motion stays functional, nothing animates without cause, focus and contrast rules stay untouched. |
| Generate or remix a design inside Figma | Figma Agent (beta) | Figma's purpose-built design agent, embedded in the canvas rather than bolted on as a sidebar chat. It generates and remixes designs against an existing design system out of the box, so output lands on the studio's own tokens and components instead of generic defaults, and it absorbs the rote construction work between direction and comp. Gradual beta for Full seats on Professional, Organization, and Enterprise plans; no credits consumed while it is in beta. A community skills library now has 50+ design workflow skills (research, design systems, handoff); the agent can also create a new skill based on context in the active file. |
| Translate Figma into code | Claude Code + Figma MCP | Reads Sandbox, writes code. `generate_figma_design` also writes approved frames to the Figma Production page. Figma Motion (June 2026) is MCP-compatible: animated frames are inspectable in Dev Mode and can be passed directly to a coding agent for implementation; copy animation code as CSS, JSON, or framework-ready React. Code Connect in MCP is what keeps that output specific: it hands the agent production component context during design-to-code, so the agent reaches for the real component instead of regenerating a generic one, and spends fewer tokens doing it (Figma, 2026-08-05). Figma MCP now binds variables and applies auto layout directly on the code-to-canvas sync, so a design pushed from code lands on live tokens and a real layout system instead of static values. |
| Map a project plan or architecture in FigJam | `figma-use-figjam` MCP skill | Three tools: `figma-use-figjam` writes content into FigJam, `generate-project-plan` builds a structured plan diagram, `get_figjam` reads an existing board. Architecture diagram → FigJam → coding agent: sketch the system structure, then the Generator reads the board as sprint context. Figma MCP server expanded June 16 to cover Slides, FigJam, Make, and the Figma design agent. `download_assets` exports production assets directly from any Figma file. |
| Sync Figma tokens into the repo | `/sync-figma-token` | Reads the Sandbox page, extracts tokens, syncs to `_config/design-system/token-map.md`. First run is clean; later runs show ADDED / REMOVED / CHANGED before overwriting. Bypassed for Shokunin-branded properties, which link the shared CSS from brand.shokunincrafthouse.com instead. |
| Get a live preview on every PR | GitHub Actions preview workflow | Real URL per PR plus snapshot screenshots in the PR body. |
| Run unattended within a phase | `/goal` after contract approval | Claude Code 2.1.139+. Sets a session-scoped completion condition; Haiku checks every turn. Use for Step 4 scaffold and Step 9 sprints. Never on the Evaluator. Always cap with *or stop after N turns*. |
| Re-run a check on an interval in-session | `/loop` (Claude Code v2.1.71+) | Session-scoped cron. Re-runs a prompt or slash command on an interval; tasks auto-expire after 3 days. In-session monitoring only: CI watch, preview re-checks. Never on the Evaluator. Not a replacement for Cowork scheduled tasks, which persist. |
| Design a chart or dashboard color system | `/dataviz` (v2.1.198) | Built-in skill for chart and dashboard design guidance. Ships a runnable color-palette validator — confirms the palette meets contrast requirements before code lands. |
| Monitor multiple sprints at once | Agent View (`claude agents`) | Claude Code 2.1.139+. One screen for every background session — running, waiting, completed, failed. `claude agents --json` (v2.1.145+) outputs live sessions as JSON for scripting into tmux status bars or session pickers. I cap parallel sessions at 2–3. For larger orchestrated flows, Dynamic Workflows (v2.1.154+) fans work out across tens to hundreds of background agents via `/workflows`. Background sessions follow the repo's CLAUDE.md git instructions: since v2.1.221 they commit and push to preserve work but open a draft PR only when the task calls for one, not on every completion, which retires the v2.1.198 always-draft-PR behavior and the noise it made on unattended runs. `/fork` now spawns a background session with its own row here, not an in-session subagent, and inherits the full conversation plus prompt cache by default, cutting context-rebuild cost for branched work; `/subtask` is the new command for launching a subagent within the current session, and non-teammate subagents spawned in interactive sessions now run in the background by default. `/code-review` at high, xhigh, or max effort now runs as a background agent too, not just at lower effort levels. Sessions still default to a 200-call cap on WebSearch, but the 200-spawn subagent cap was removed in v2.1.224, so a long orchestration run no longer hits a wall mid-batch; concurrency and depth limits still apply. Sessions can also message each other across machines via `SendMessage` and `ListAgents` (v2.1.224/225), so a Remote Control session is reachable by name from another machine instead of only when it initiates contact. Typing `@` in the prompt mentions another live session by name and routes the message via `SendMessage` directly, no confirm step. Subagents default to a nesting depth of 3 (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`), and a `workflowSizeGuideline` setting advises when a workflow is getting too large to run in one pass. Remote Control is now GA (`claude remote-control`): my machine appears as a device card at the top of the Code tab on mobile, tap to pick a directory and start a session there, or change the effort level and it applies to the running session. |
| Grade a sprint | Evaluator, fresh Claude Code session on Fable 5.1 | Single-pass audit. Never put `/goal` or `/loop` on it. Grades through the `sc-design-crit` lens library; findings cite named frameworks. |
| Check Gate-3 tokens and dead code before a PR | `sc-hygiene` (drift + deadcode checkers) | Two zero-dependency checkers referenced from `sc-verify`'s own Gate-3 pass. `drift_check` flags styling values that bypass the token file — raw hex, off-grid spacing, magic z-index — across CSS, SCSS, CSS Modules, CSS-in-JS, and Tailwind arbitrary values. `deadcode_check` finds unused exports, unused files, and import cycles, grading every finding proven or unproven so only a proof gates a PR. |
| Stress-test a plan before work starts | `sc-premortem` | Assumes the plan already failed and works backward to graded failure modes, hidden assumptions, owners, early-warning signals, and kill criteria. Runs automatically on every `sc-council` PROCEED / PROCEED-WITH-CONDITIONS verdict, and on demand for any other plan. |
| Change any session setting mid-session | `/config key=value` (v2.1.181) | Set any config inline: `/config thinking=false`, `/config effort=low`. `/config --help` lists all keys. Faster than menus; takes effect immediately. |
| Recover context lost to `/clear` | `/rewind` (v2.1.191) | Resumes the conversation from before the last `/clear` was run. No need to re-establish context manually when a clear was premature. |
| Share session output as a live page | CC Artifacts (beta, Team/Enterprise) | Turns a Claude Code session into a shareable HTML page at a private URL. PR walkthroughs, dashboards, release checklists. |
| Validate decisions with real users | Maze / Lyssna / Dscout | The AI Evaluator grades Functionality from code and snapshots. It cannot replace a real user. Tool scales to company stage — see For Hiring Managers. |
| Cut PR complexity or apply one change across many files | `/simplify` + `/batch` | `/simplify` reduces PR complexity before review; `/batch` runs a single change across many files in one pass. First-party CC skills. |
| Have a team of agents review every PR | `/code-review` (multi-agent) | Runs a background team of agents against every PR rather than a single reviewer pass — the pattern behind Anthropic's internally reported ~200% code output. It runs as a background subagent by default and never fills the active conversation. |
| Run a full project-health checkup | `/checkup` (renamed from `/doctor`, v2.1.205–206) | Splits a bloated root CLAUDE.md into nested files plus skills automatically, deduplicates the local CLAUDE.md against the checked-in version, removes unused MCPs/skills/plugins, disables slow hooks, and enables auto mode — five checks in one periodic run, not just the CLAUDE.md-trim piece. |
| Add or coordinate an MCP server without stateful session overhead | MCP spec 2026-07-28 (stateless protocol + Apps/Tasks) | Largest MCP revision since launch: servers move from stateful sessions to stateless request/response, so they can run serverless. New MCP Apps/Tasks extensions standardize richer UI and long-running-task integrations. Figma is a named launch partner — directly affects the studio's Figma MCP connection as it rolls out to Claude products over the coming weeks. |

### Tools Row 03 — Knowledge work

| If I need to… | Use this | Why |
|---------------|----------|-----|
| Sharpen a rough brief | Cowork | File-based, multi-step. Reads `cowork-context.md` on every task. |
| Close out a sprint's learnings | `sc-learn` | Captures repo lessons and the build-log entry automatically; drafts studio promotions for approval. Appends, never rewrites. |
| Organize deliverables before handoff | Cowork | Renames, sorts, flags WIPs. Proposes the structure before changing anything. |
| Synthesize research into a design brief | Cowork + Claude for Chrome | Full browser control. Fewer screen interactions, faster execution. |
| Dispatch a task from iPhone | Cowork remote dispatch | iOS app → Mac runs the task. Mac stays awake. |
| Run a scheduled morning briefing | Cowork scheduled task | Reads `WORKSPACE.md` across all active projects. Unattended. |

**Note on callouts:** The lede mentions "Two callouts: Claude Design and Cowork" — these are not separate aside elements in the current HTML. Claude Design appears as a starred (★) row inside Tools Row 02. Cowork appears as the dominant tool across Tools Row 03. No standalone callout blocks exist in markup at the moment.

---

## SECTION 6 — FOR HIRING MANAGERS

**Eyebrow:** For Hiring Managers
**Title:** How I'd apply this at your company.

### Tab — Startup (5–30)
**Eyebrow:** It's ~~rocket~~ AI science
**Role line:** I **am** the design team.

**What I build first:** A `WORKSPACE.md` for your product, a `studio-memory.md` for your design patterns, and a sprint workflow tuned to your ship cadence.

- This system is how one designer ships at the pace of three.
- Studio memory means day-one context on your product, users, and patterns. No ramp-up amnesia between sprints.
- The Planner turns a founder's rough brief into a structured spec in one session. No weeks of requirements gathering.
- The Evaluator catches quality issues before they reach stakeholders. Design review without the headcount.
- Maze runs unmoderated tests in hours from a Figma prototype. Zero recruitment overhead, zero extra budget against the $120/mo baseline. The step I skip in solo studio sprints is a half-hour setup on a team.
- Tooling cost: ~$120/mo. The ROI is output velocity with zero quality compromise.

### Tab — Mid-size (50–500)
**Eyebrow:** It's ~~rocket~~ AI science
**Role line:** I **lead** a design team.

**What I build first:** A design quality framework, a team-wide memory system, and an AI-assisted sprint workflow that integrates with your existing engineering cadence.

- This system is how I multiply their output without multiplying headcount.
- Studio memory becomes the team's shared design intelligence. Onboarding accelerates, decisions compound, institutional knowledge survives turnover.
- The Planner-Generator-Evaluator loop standardizes quality without standardizing creativity. Every designer still owns their craft. The system owns the consistency.
- At this stage the research function exists or is forming. Lyssna sits between guerrilla testing and enterprise contracts — quantitative benchmarking, custom panels, moderated sessions, no six-figure procurement. It runs after the Evaluator and before Gate 03.
- Sprint contracts and approval gates create the accountability structure design teams at this stage need, without adding process overhead.
- The token strategy translates to a team budget: Sonnet for the volume work, Fable for the judgment work, Claude Design as a free creative resource on its own clock.

### Tab — Enterprise (1000+)
**Eyebrow:** It's ~~rocket~~ AI science
**Role line:** I lead a design **function**.

**What I build first:** A pilot with one product team. Prove the model. Measure velocity, quality scores, and designer satisfaction. Then scale with a governance framework that gives teams autonomy within guardrails.

- This system is the governance model that scales craft across business units without creating a bureaucracy.
- Studio memory at this scale is a design knowledge graph. Principles, patterns, component decisions, and accumulated learnings any team in the org can query.
- The agent architecture maps to enterprise roles: Planner is strategic design, Generator is the production team, Evaluator is the design quality function. AI makes each layer faster without collapsing the separation of concerns.
- Approval gates align naturally with enterprise review cadences. Design review, accessibility audit, brand compliance, legal. No new sequential bottlenecks.
- At this scale, user research is a governance problem, not a tooling problem. Dscout replaces the standard UserTesting and UserZoom stack with diary studies and longitudinal on-demand research. Behavioral signals over time, not just session recordings. It maps to the design knowledge graph the way the Evaluator maps to internal design review.
- The token model translates directly to enterprise AI budgeting. Right-size the model to the task. Preserve capacity for high-judgment work.

### CTA (revealed after tab pick)
"If any of this maps to a role you're hiring for, the next move is short."
Button: Get in touch →
Links to: levibahn.com/#contact

---

## FOOTER
Crumb: Craft → Systems → Teams → Transformation
© 2026

## MOBILE TAB BAR
Overview · Workflow · Brain · Tools · Hiring

---

## KNOWN GAPS (flagged during audit)

1. **"Two callouts: Claude Design and Cowork"** — lede promise in Tools section. No standalone callout markup exists. Claude Design = starred row in table 2; Cowork = dominant tool in table 3. Mismatch between lede and actual surfaces. Not addressed in this update.
2. **Step 09 + Step 10 prompts** lead with `/caveman` slash command. Verify this is intentional in shipped copy.
