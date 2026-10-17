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

- `src/homepage.js` is the homepage entry; `src/styles/homepage.css` supplies its
  Championship Journal presentation.
- `src/journal-pages.js` is the other five pages' entry. It imports `src/main.js`,
  the shared Journal styling and `src/styles/championship.css` adapters.
- `src/main.js` retains the shared legacy behavior. It imports data,
  exposes selected helpers on `window`, manages active navigation and the
  mobile menu, supplies homepage counts, and loads the legacy leaderboard
  behavior.
- `src/styles/legacy.css` is retained for the existing page renderers; Journal
  styles adapt them without changing data or scoring.
- `src/leaderboard-renderer.js` renders the overall and annual leaderboards from
  the consolidated resolved historical data.
- `src/legacy-script.js` retains scorecard-detail behavior for rounds with
  available gross cards; annual summary values are no longer calculated there.
  Each available round has its own keyboard-focusable horizontal scroll region;
  historical notes sit outside that region and wrap within the mobile panel.
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

## Local homepage Championship Journal prototype — 17 October 2026

The isolated `feat/homepage-championship-journal` branch redesigns only
`index.html`. Its entry is `src/homepage.js` and stylesheet is
`src/styles/homepage.css`; it intentionally does not load the legacy shared
entry or stylesheet. The other five pages retain their existing implementation.
Homepage counts and the 2026 results read the existing resolved datasets without
changing them. Static accurate HTML remains available before JavaScript loads.
Responsive derivatives live in `public/images/journal/`; all seven supplied
originals are retained byte-for-byte in `assets/homepage-originals/`, outside
Vite's public output. See `docs/homepage-prototype.md` for local review details.
This records the initial local prototype phase. James subsequently approved
publication of the six-page redesign; see the release note below.

## Local site-wide Championship Journal extension

James subsequently approved carrying the homepage style through the other five
pages. They now use `src/journal-pages.js`, which imports the retained `main.js`
behaviour and the Journal presentation styles. `src/styles/championship.css` adapts
the existing roster, results, course detail and annual renderers; `legacy.css` is
retained unchanged. Navigation and footers match the homepage. The inline Course
Ratings renderer adds real keyboard-operable selection buttons and honest
photography empty states. Year in Review uses a typographic year cover and an
accessible selected-year button state. Shop remains a non-purchasable concept.
All original scoring and data files are unchanged. The same isolated local branch
and checkout are reused. See `docs/site-journal-prototype.md` for current review
instructions; no Git or hosting publication is authorised by the local work.

## Championship Journal release approval

James approved publishing the six-page version after previewing it. The release
uses the existing GitHub PR, independent-review and Netlify production workflow,
with no deployment-setting changes. The previous live design is preserved at
`092b7571bd07c822dedd45c23942be4695ca4f7a` for comparison or recovery.
See `docs/site-journal-prototype.md` and the release PR for validation and known
limitations. Publication approval does not authorise unrelated content fixes.
