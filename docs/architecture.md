# Architecture

The Tyrrells Open (TTO) website is a Vite static multi-page site using plain
HTML, CSS, and JavaScript. It has no frontend framework, client-side router, or
application backend.

## User-facing entry points

| Page | Purpose |
| --- | --- |
| `index.html` | Home, site navigation, and summary statistics |
| `about.html` | Member profiles |
| `leaderboard.html` | Overall and year-by-year results |
| `course-ratings.html` | Course summaries, ratings, and details |
| `year-in-review.html` | Annual stories and galleries |
| `shop.html` | Merchandise placeholders |

These six page URLs are stable and should be preserved.

## Vite build inputs

`vite.config.js` registers these Rollup inputs:

- `index.html` as `main`
- `about.html` as `about`
- `leaderboard.html` as `leaderboard`
- `course-ratings.html` as `courseRatings`
- `shop.html` as `shop`
- `year-in-review.html` as `yearInReview`

## Active shared implementation

- `src/main.js` is the shared JavaScript module entry. It imports data,
  exposes selected helpers on `window`, manages active navigation and the
  mobile menu, supplies homepage counts, and loads the legacy leaderboard
  behavior.
- `src/styles/legacy.css` is the active shared stylesheet.
- `src/leaderboard-renderer.js` renders the overall and annual leaderboards from
  the consolidated resolved historical data.
- `src/legacy-script.js` retains scorecard-detail behavior for rounds with
  available gross cards; annual summary values are no longer calculated there.
- `src/player-profiles.js` adds the About Us profile accordion and handles
  stable player deep links.
- `src/data/` contains the active course, handicap, leaderboard migration,
  player profile, and Year in Review datasets.

## Transitional structure

The codebase is partway between legacy global DOM code and ES modules.
`src/main.js` imports the active modules and places course and handicap
helpers on `window`. `src/legacy-script.js` and the inline Course Ratings
script consume those globals.

The live leaderboard retains its hard-coded page shell and table templates,
while the overall and annual rows are populated from the consolidated data.
Course Ratings has a page-local inline renderer. Year in Review has a page-local
module renderer. This structure is a maintenance constraint, not a reason to
introduce a framework.

## Repeated page shells

Navigation, document-head markup, and hero structure are repeated across the
six HTML files. Active-link markup is hard-coded on each page and also checked
by `src/main.js`. Changes to shared page chrome currently need careful,
consistent edits across all affected HTML pages.

## Likely unused or duplicate files

The following appear unused, generated, or divergent from the active
implementation:

- `script.js`
- `course-data.js`
- `handicap-data.js`
- `style.css`
- `src/style.css`
- `src/counter.js`
- `src/javascript.svg`
- `public/vite.svg`

This list records current evidence only. It does not authorize deletion.
Confirm every consumer before any future cleanup.

## Generated output

`dist/` is ignored Vite build output. It may be stale and is not an
authoritative source. Edit source files and regenerate `dist/` through the
normal build.

Older root-level plans and audits may be historical, partially completed, or
superseded. Verify them against the current implementation.
