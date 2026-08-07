# TTO Repository Instructions

This repository contains **The Tyrrells Open (TTO)** website. Always use that
exact name and spelling.

## Before substantial work

- Read the documentation relevant to the task:
  - `docs/architecture.md` for site structure.
  - `docs/data-and-content.md` for data or editorial work.
  - `docs/development-workflow.md` for implementation and review.
  - `docs/roadmap.md` for sequencing.
  - `docs/decisions.md` for durable constraints.
  - `docs/frumpbox-context.md` for cross-project work.
- Inspect the current implementation before editing. Older root-level audits
  and plans may be historical, partially completed, or superseded.

## Architecture and scope

- Preserve the Vite static multi-page architecture and all six existing page
  URLs.
- Use plain HTML, CSS, and JavaScript. Do not migrate to React, Next.js, Vue,
  Tailwind, or another framework unless James explicitly approves a new
  architectural decision.
- Treat files under `src/` as the active implementation unless current
  documentation states otherwise. Divergent root duplicates are not
  authoritative.
- Keep changes inside the agreed task scope. Avoid broad unsolicited refactors.
- Preserve unrelated work in a dirty worktree.
- Do not delete an old or duplicated file solely because it appears unused.

## Safety and external actions

- Keep private data private. Do not expose secrets or personal context.
- Inspect existing state before changing configuration, automation, schedulers,
  or deployment settings; preserve and merge by default.
- Prefer recoverable actions and ask before destructive or uncertain work.
- Never execute or use `agent/agent.js`.
- Never deploy, push, reset, commit, or publish without James's explicit
  approval. Implementation approval does not imply publication approval.
- Do not send messages or perform other external actions without approval.

## Verification and documentation

- Run `npm run build` before declaring implementation work complete.
- Locally preview visual or interaction changes when practical.
- Report checks that could not be completed.
- Update relevant documentation after meaningful architectural, data, content,
  workflow, or roadmap changes.

