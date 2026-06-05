# CONTENT MAP — studio-memory ↔ site content audit
> Maintained by the sc-content-sync skill. An index of where folder facts surface in the site content audit — a starting point for drift checks, never the boundary of one. Add rows as new mappings are discovered. Update the SHAs after every applied sync.

**Canonical audit file:** the single `site-content-audit-v*.md` in `ai-site/content/` (highest version; same rule as the weekly update task)

**Last synced:**
- studio-memory: `3493459` (2026-06-05 — shared design system decision)
- ai-site: `599095b` (working tree as of 2026-06-05 sync; v4 minted in the sync commit that follows)

---

## Mappings

| Folder source | Site surfaces | Notes |
|---|---|---|
| `studio-memory.md` §1 Studio Identity | Hero; Card summaries; Hiring Managers tabs (tone) | Editorial retelling, not quotation |
| `studio-memory.md` §2 Design Principles | Card 01 stats ("7 design principles"); Step 02 prompt ("7 Shokunin principles"); Step 02 body ("seven Shokunin principles"); Step 06 prompts | Principle COUNT is load-bearing in two prompts |
| `studio-memory.md` §7 Approval Gates | Approval Gates table; Card 02 body + stats ("4 approval gates"); Steps 02/07/11/13 gate callouts | Gate wording in table paraphrases §7. Gate 03 user-testing clause is site-only — open item 6 in the 2026-06-03 report |
| `studio-memory.md` §8 Accumulated Learnings | Brain Row 01 (3 featured entries); Card 01 body (names 3 example learnings) | Which 3 are featured is an editorial choice — new learnings don't force a swap, but stale featured ones should be flagged |
| `studio-memory.md` §9 Creative Defaults | Brain Row 04 (lists 7 defaults); Card 01 stats | §9 now holds 11 defaults — Row 04 lag is open item 3 in the 2026-06-03 report |
| `studio-memory.md` §5 Technology Stack | Card 04 body; Tools Rows 01–03 | Site also documents tools beyond §5 (Claude Design, Cowork, Agent View) — those facts live in runbooks, not studio-memory.md |
| `templates/project-template/` file tree | Brain Row 02 file tree; Step 04 prompt (template path + WORKSPACE.md fields) | Tree on site must match template reality. sync-figma-token + figma-skills additions are open item 4 in the 2026-06-03 report |
| `build-log.md` (existence + purpose) | Step 13 body + prompt; Card 01 body ("the memory grows") | Append-only contract restated on site |
| `Business_Runbook_Claude_Max_v1_8.md` | Card 04 (pricing, token pool); Tools rows; Hiring tabs ("~$120/mo") | Verified 2026-06-03: §19 totals ~$119–121/mo without VPS — matches all "$120" mentions |
| `New_Project_Setup_Guide_v2_5.md` | Steps 03–05 (scaffold, deploy, preview workflows) | Verified 2026-06-03: step prompts match guide conventions |
| Workflow definition (13 steps) | Section 3 Steps 01–13; Card 02 ("13 steps"); Row 02 lede; mobile tab bar | Folder-side source of the 13-step list needs pinning — likely WORKFLOW.md in template + runbook. Guide Steps 2B/2C are deliberately NOT site steps — site is an editorial retelling; gate facts land as sentences, not new steps |
| Model/version facts (Opus x.y, Claude Code vN) | Card 04; Tools Row 02; Steps 09–10 bodies and prompts | Highest-churn facts on the site; check every sync |
| `$120/mo` cost figure | Card 04 stats; Startup tab (×2 mentions) | Restated in different words — grep "120" |
| Shared Design System decision (Runbook §20; Setup Guide Step 2C; `studio-memory.md` §8 2026-06-05 entries) | Step 02 body (kickoff gate sentence); Step 05 body (template propagation sentence); Step 07 body (extraction carve-out); Tools Row 02 `/sync-figma-token` row; Card 04 Figma paragraph; Brain Row 02 desc | Copy states the standing RULE — it does not claim brand.shokunincrafthouse.com is live. If/when the endpoint ships, a weekly update can strengthen the claims |
| Canonical template location (`studio-memory/templates/`) for cross-repo workflows/configs | Step 05 body | Update-once-propagate rule; never edited repo by repo |
