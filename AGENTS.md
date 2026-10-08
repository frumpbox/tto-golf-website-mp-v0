# TTO Repository Instructions

This repository contains **The Tyrrells Open (TTO)** website. Always use that
exact name and spelling.

## Before substantial work

- Read `AGENT_RULES.md` and `docs/todo.md`, and inspect any applicable nested
  agent instructions.
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
- Preserve existing functionality outside the approved task scope.
- Do not delete an old or duplicated file solely because it appears unused.

## Builder branch and permissions

- Inspect the worktree and branch before editing. Work on a separate task
  branch based on the agreed base branch; never implement directly on `main`
  or another protected branch.
- An explicitly authorised task may run unattended within its agreed scope.
  Commits, development-branch pushes, and GitHub pull-request creation are
  allowed only when explicitly authorised in the task. Implementation approval
  alone grants none of these permissions.
- Never merge, enable auto-merge, deploy, or publish production changes without
  separate human approval from James. Development-branch publication and code
  review do not grant production approval.

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
- Before handing off implementation, run all four commands against the final
  changes:

  ```bash
  npm run build
  node src/tools/verify-leaderboard-data.js
  node src/tools/verify-course-data.js
  node src/tools/verify-course-ratings-data.js
  ```

- Report each outcome individually, including leaderboard PASS, WARNING,
  UNKNOWN, and FAIL counts. Compare with the task's pre-change baseline and
  distinguish pre-existing warnings or failures from new issues. A successful
  exit code does not mean every historical value is verified.
- Fix issues introduced by the task before declaring it complete, or explicitly
  report the blocked or incomplete work. Never weaken validation or alter
  historical evidence merely to obtain a passing check.
- For relevant UI changes, perform visual and interaction checks on desktop
  and mobile using a local preview when practical.
- Report checks that could not be completed.
- Update relevant documentation after meaningful architectural, data, content,
  workflow, or roadmap changes.

## Historical scoring protection

- Retain all historical-data restrictions in `docs/decisions.md` and
  `docs/data-and-content.md`. Historical corrections and reconstructions must
  be within explicitly approved scope and meet the existing evidence rules.
- Recorded results must not be overwritten merely to remove validation
  warnings. Preserve original scores, recorded handicap evidence, playoff
  results, and provenance; recorded playing handicaps take priority over
  modern canonical recalculation.
- Preserve unknown values as `null` and genuine zeros as zero. Do not invent
  missing values. Keep reconstructed, estimated, and synthetic supporting data
  distinguishable from original historical evidence.

## TODO maintenance

- Preserve `docs/todo.md` as the living project checklist and retain its entries.
- Only update task-relevant entries when the work is genuinely complete and
  verified. Leave partially completed items open and report partial progress.
- Never remove entries or mark unrelated items complete; preserve unrelated
  wording, ordering, and checkbox states.

## Code Review Rules

- The independent Codex Code Review Agent must examine the final PR revision
  and identify the reviewed head commit. Any changes after review require
  another review of the updated revision before human approval.
- Look for:
  - regressions in existing functionality;
  - incorrect scoring calculations;
  - unauthorised changes to historical results;
  - missing or misleading data provenance;
  - serious security or privacy concerns;
  - important missing verification for changed functionality; and
  - changes exceeding the approved task scope.
- Report actionable findings and verification limitations. Builder
  self-assessment does not replace independent review.
- Neither the Builder nor Reviewer may approve a production merge on James's
  behalf. Review approval is not human merge, deployment, or production
  publication approval.

## Standard completion report

For every development task, report:

- what was requested;
- what changed;
- files modified;
- task branch and base branch;
- build and individual validation results, including leaderboard status counts
  and any changes from the baseline;
- TODO checklist updates, or explicitly state that none were made;
- outstanding concerns;
- anything not tested or verified; and
- the pull request link, if created, otherwise its publication status.

