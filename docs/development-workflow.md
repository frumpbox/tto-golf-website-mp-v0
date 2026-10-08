# Development workflow

The Tyrrells Open (TTO) must remain independently maintainable without
Frumpbox, Discord, or another automation service. Direct repository
development is the primary path.

## Standard workflow

```text
idea
→ short task specification
→ Codex inspection
→ proposed plan
→ task approval with explicit permissions
→ Builder implementation on a separate task branch
→ build and all data validators
→ relevant visual/interaction checks where possible
→ authorised development-branch commit, push, and GitHub pull request
→ independent Codex Code Review of the final PR revision
→ revisions, verification, and another review if changes are made
→ James's human approval
→ separately authorised merge/deployment/production publication
```

Without task authorisation for commits, development-branch pushes, or PR
creation, prepare and report the local changes for James's review. Do not
publish them. An explicitly authorised task may run unattended within its scope;
do not request again permissions already granted for that task.

## Before implementation

- Agree on the intended result and task boundary.
- Read the relevant focused documentation.
- Read `AGENTS.md`, `AGENT_RULES.md`, `docs/decisions.md`, and `docs/todo.md`,
  plus any applicable nested agent instructions.
- Inspect the current source and identify affected files and data.
- Inspect the worktree and branch, preserve unrelated work, and create a
  separate task branch based on the agreed base branch. Never implement
  directly on `main` or another protected branch.
- Record the pre-change verification baseline so existing warnings and failures
  can be distinguished from issues introduced by the task.
- Present a short plan before substantial or structurally meaningful work.

## Implementation

- Make focused, incremental changes.
- Preserve the Vite static multi-page architecture and existing page URLs.
- Avoid unrelated cleanup, broad refactors, and framework introduction.
- Keep normal TTO development independent from Frumpbox-specific behavior.
- Update relevant documentation when architecture, data, content, workflow, or
  roadmap facts materially change.
- Preserve existing functionality outside the approved scope and all historical
  data restrictions in `docs/decisions.md` and `docs/data-and-content.md`.
  Never overwrite recorded results merely to remove validation warnings;
  preserve unknown values, original scores, handicap evidence, and provenance.
- Preserve `docs/todo.md` as the living checklist. Only update task-relevant
  entries when genuinely complete and verified. Leave partial work open; never
  remove entries or mark unrelated items complete.

## Local commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

Package installation still requires James's explicit instruction under
`AGENT_RULES.md`.

Before handing off implementation, run all four commands against the final
changes:

```bash
npm run build
node src/tools/verify-leaderboard-data.js
node src/tools/verify-course-data.js
node src/tools/verify-course-ratings-data.js
```

Report outcomes individually, including leaderboard PASS, WARNING, UNKNOWN,
and FAIL counts, and compare them with the pre-change baseline. Distinguish
pre-existing warnings or failures from new issues; exit code zero alone does
not establish complete historical verification. Fix issues introduced by the
task before declaring it complete, or report blocked/incomplete work. Never
weaken validators or change historical evidence to obtain a pass.

For relevant UI changes, use a local development server or production preview
for visual and interaction checks on desktop and mobile where possible.
Explicitly report anything that could not be tested or verified.

## Review and publication

Commits, development-branch pushes, and PR creation require explicit task
authorisation. Approval to implement alone grants none of these permissions.
Existing safeguards against unapproved resets and other external actions remain
in force.

The independent Reviewer follows `AGENTS.md`'s Code Review Rules and reviews
the final PR revision, recording its head commit. New changes after review
require another review before human approval. Resolve findings within the
approved scope and rerun the required checks against the final changes after
revisions.

Never merge, enable auto-merge, deploy, or publish production changes without
separate human approval from James. Development-branch publication does not
authorise production publication. Neither Builder nor Reviewer may approve a
production merge on James's behalf, and code review approval does not replace
human approval.

Use the standard completion report and Builder PR handoff in `AGENTS.md` for
every development task and PR handoff.

Never execute or use `agent/agent.js`.

## Builder PR summary and independent review

Every Builder PR must use `.github/pull_request_template.md`. Complete its
seven Builder summary sections in plain English so James can understand the
change without reading code: what was asked for, what changed, what he should
inspect or test, how to see the changes, tests and results, limitations/issues/
risks, and TODO checklist changes. Give concrete inspection steps and expected
results. Include a preview link when available; otherwise explain why there is
no preview and provide access instructions, such as links to rendered documents
for a documentation-only task. State `None` or `Not applicable` with a reason
where appropriate. Include modified files, task branch/base, and the PR link or
publication status, and update the handoff after revisions.

The Builder summary and test results are the Builder's report. Actual
independent Codex Reviewer findings belong in the separate review section,
linked to the Reviewer's GitHub review or comments and the reviewed head commit.
Leave review status pending until it finishes; no findings yet does not mean
review passed. If the PR changes afterward, state that another review is
pending for the new revision. The existing review and human approval gates
above still apply.

## Safe treatment of `dist/`

`dist/` is generated, ignored Vite output. It may be stale between builds:

- do not edit it as source;
- do not infer current behavior from it instead of source files;
- regenerate it with `npm run build`;
- do not move or delete it outside an agreed task.

