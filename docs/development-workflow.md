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
→ approval
→ implementation
→ npm run build
→ local preview
→ James review
→ revisions
→ approved commit/publication
```

## Before implementation

- Agree on the intended result and task boundary.
- Read the relevant focused documentation.
- Inspect the current source and identify affected files and data.
- Present a short plan before substantial or structurally meaningful work.

## Implementation

- Make focused, incremental changes.
- Preserve the Vite static multi-page architecture and existing page URLs.
- Avoid unrelated cleanup, broad refactors, and framework introduction.
- Keep normal TTO development independent from Frumpbox-specific behavior.
- Update relevant documentation when architecture, data, content, workflow, or
  roadmap facts materially change.

## Local commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` is required before implementation work is declared complete.
Use a local development server or production preview to inspect visual and
interaction changes. Run focused data validation when the task affects a
validated dataset, and report checks that could not be completed.

## Review and publication

James reviews the local result before publication. Approval to implement does
not grant approval to commit, push, deploy, or publish. Each of those actions
remains approval-controlled.

Never execute or use `agent/agent.js`.

## Safe treatment of `dist/`

`dist/` is generated, ignored Vite output. It may be stale between builds:

- do not edit it as source;
- do not infer current behavior from it instead of source files;
- regenerate it with `npm run build`;
- do not move or delete it outside an agreed task.

