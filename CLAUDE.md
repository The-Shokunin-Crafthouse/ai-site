# Claude Code — Adapter (ai-site)

You are working inside a Shokunin Crafthouse project workspace. Studio standards load globally (`~/.claude/CLAUDE.md` → studio-memory core and the `process` learnings). This file carries only what is specific to this repo.

## Learnings index (by surface)

This project's `workspace.manifest.yaml` declares `surface: "web-static"`. The import below loads the web learnings a static site needs (no `web-app` lines: Prisma, Supabase, OAuth, Stripe, R2, Clerk, server actions, managed Node; ADR-121). Never import `INDEX-process.md` or `INDEX.md` here (a line would load twice). To look up a learning outside this surface, grep `studio-memory/learnings/INDEX.md`.

@/Users/bahnfiya/Projects/shokunin-crafthouse/studio-memory/learnings/INDEX-web-static.md

## Repo identity

ai.levibahn.com — a static HTML/CSS/JS site on Hostinger, updated through the weekly loop in `ai-site-update-cowork-task.md` (see `LEARNINGS.md`). No build step, no server, no data layer. `content/` holds exactly one `site-content-audit-v*.md`, the canonical content record.
