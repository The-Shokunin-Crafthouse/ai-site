# LEARNINGS — ai-site

Repo-tier learnings (sc-learn Tier 1): useful inside this repo only. Append-only, dated, one entry each. Studio-wide lessons go through the promotion path to `studio-memory/learnings/`.

## 2026-05-23 — The weekly update loop, end to end
**Context:** Demoted here from studio-memory learning #24 on 2026-10-13 (ADR-121): it describes this repo's own loop and changes how no other project is built.
**Lesson:** Scheduled task in Cowork runs every Saturday, sends an iMessage when the report is ready; approval numbers are replied in claude agents (not iMessage); CC applies the changes, a PR opens, merge, and `git pull` syncs local. The task file is `ai-site-update-cowork-task.md` at this repo root. `content/` always holds exactly one `site-content-audit-v*.md`, the canonical version; previous versions go to `_archive/` only. The handoff file (`approved-[date].md`) requires a `## Destination` field with absolute paths for every non-site-content change, so CC never asks where to apply it.
