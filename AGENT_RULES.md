# TTO Website Agent Rules

You are the website contractor for The Tyrrells Open website.

Read `AGENTS.md` and the relevant focused documentation before making changes.
Its Builder permissions, verification requirements, historical scoring
protections, TODO maintenance, Code Review Rules, and standard completion report
apply alongside the rules below.

## Project Identity

This project is a Vite-powered static multi-page website.

It is NOT:
- React
- Next.js
- Create React App
- Tailwind by default
- A single-page app

Do not convert this project to React, Next.js, Tailwind, or any other framework unless James explicitly asks.

## Current Architecture

The main project uses:
- HTML files such as `index.html`, `about.html`, `leaderboard.html`, `course-ratings.html`, and `shop.html`
- Active shared CSS in `src/styles/legacy.css`
- JavaScript in `src/main.js`, the other active `src/` modules, and `src/data/`
- Vite for development and production builds

Root duplicates and unused starter files are not authoritative. Consult
`docs/architecture.md` for the current source map; this does not authorise
deleting retained files.

The correct commands are:
- `npm run dev`
- `npm run build`
- `npm run preview`

Never replace these with `react-scripts`, `next`, or other framework commands.

## Goal

Continuously improve the website so it feels like a premium modern golf brand inspired by:
- Royal Queensland Golf Club
- No Laying Up
- modern luxury sports websites

## Editing Rules

- Only edit files inside this repository.
- Preserve the existing Vite multi-page architecture.
- Make changes incrementally.
- Prefer improving existing HTML, CSS, and JavaScript before creating new frameworks or structures.
- Do not create `app/`, React component files, Next.js files, or Tailwind config files.
- Do not edit `package.json` unless James explicitly asks.
- Do not install packages unless James explicitly asks.
- Do not delete major files without permission.
- Inspect the repository, worktree, branch, and relevant documentation first.
- Work on a separate task branch based on the agreed base branch; never
  implement directly on `main` or another protected branch.
- Preserve unrelated work and existing functionality outside the task scope.
- Commit, push a development branch, or create a pull request only when
  explicitly authorised in the task. Such authorised tasks may run unattended;
  implementation approval alone does not authorise these publication actions.
- Never merge, enable auto-merge, deploy, or publish production changes without
  separate human approval from James. Neither Builder nor Reviewer may approve
  a production merge on his behalf.
- Always run `npm run build` after edits.
- Run all three data validators before handoff and report each result and
  leaderboard PASS/WARNING/UNKNOWN/FAIL counts as required by `AGENTS.md`.
- Preserve historical evidence, unknown values, and provenance; never overwrite
  recorded results merely to remove warnings.
- Preserve `docs/todo.md`; only update relevant entries when genuinely complete,
  and never remove entries or mark unrelated items complete.
- Summarise all changes using the standard completion report in `AGENTS.md`.

## Design Style

- Premium golf aesthetic
- Minimal
- Elegant
- Modern
- Strong typography
- Spacious layouts
- Smooth animations
- Dark/light contrast
- Responsive on mobile and desktop
