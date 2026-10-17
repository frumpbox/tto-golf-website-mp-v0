# Championship Journal — Builder's release report

James has now explicitly approved publication of the previewed six-page version.
Earlier local-only status below records the exploration/preview stages. Release
commit, independent review, CI and deployment outcomes are recorded in the PR
and task handoff; production is not claimed complete until verified.

## Request and result

James approved extending the homepage's visual direction through the other five
pages, retaining the two-golfer shield image as a concept, and requested a preview
link. The entire site is now available locally with consistent championship
navigation, corrected crest, editorial typography, ivory/forest surfaces and a
shared footer. The homepage caption explicitly says that its concept photograph
does not depict the Sam–James playoff.

- About Us: group-photo opening and portrait roster with the existing expandable
  profiles, original names, roles, order and deep links.
- Leaderboard: compact editorial introduction, year jump links, readable tables,
  keyboard-focusable horizontal scrolling and restyled existing scorecards.
- Course Ratings: photographic editorial introduction, course index and retained
  factual/subjective details. Course selection now has native keyboard-operable
  buttons and expanded-state feedback. Unverified course images are not invented.
- Year in Review: typographic annual covers, readable champion/runner-up summaries,
  selected-year state and reading layouts. Existing full articles are retained.
  Missing articles and verified year photos are described honestly.
- Shop: a crest identity study and clearly labelled proposed collection. No
  products, checkout, prices or purchasing functionality are fabricated.

## Preview and publication boundary

Local preview: `http://127.0.0.1:5174/` on the development computer. All six links
work inside the preview. The server binds only to localhost. To restart:

```bash
cd /tmp/tto-homepage-journal
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

A localhost URL will not open this computer's server from an iPhone. Mobile and
desktop screenshots are provided in the Codex task. James subsequently explicitly requested an iPhone-accessible preview. A temporary
HTTPS preview is now available at `https://67fd3d65de6618.lhr.life/` through
localhost.run, forwarding only the built `dist/` website from a localhost-only
static server on port 5180. Repository files, originals and Git metadata are not
served. It is a public temporary review link, dependent on the server and SSH
connection remaining running, with no guaranteed expiry time or persistence.
The homepage and mobile navigation to the leaderboard were verified externally.
Netlify, GitHub publication and the live website remain untouched.

Checkout: `/tmp/tto-homepage-journal`.
Branch: `feat/homepage-championship-journal`.
Base: remote `main`, `092b7571bd07c822dedd45c23942be4695ca4f7a`.
This continues the authorised isolated prototype, preserving its homepage work.
No commits, pushes, pull requests, merges or deployment hooks were used.

## Personal review steps

1. Open the homepage and follow all five main navigation links. Expect the same
   identity and footer, with page-specific editorial layouts.
2. About Us: select James Hall, then close his profile. A `?player=james-hall`
   link should open the same existing profile directly.
3. Leaderboard: jump to 2026 and expand Sam Lewis's scorecards. Expect 43/33/76,
   unchanged handicaps and readable gross-score symbols. Scroll scorecards and
   annual tables horizontally on narrow screens.
4. Course Ratings: select Hollinwell using mouse, touch or keyboard Enter. Expect
   its 83/100 rating, factual card and facility/hole breakdown. Select it again
   to close. Coxmoor remains intentionally incomplete and unrated.
5. Year in Review: switch between 2020 and 2026. Expect the complete existing 2020
   article, the 2026 champion Sam Lewis and runner-up George Stinton, and a clear
   note that the 2026 article has not yet been added.
6. Shop: inspect the crest-led concept and four proposed product categories.
   Nothing should appear purchasable.
7. On a narrow viewport, Menu should open by keyboard or touch. Escape closes it
   and returns focus. Review the concept photo caption on the homepage.

## Verification and baseline comparison

| Check | Before extension | Final |
| --- | --- | --- |
| Build | PASS | PASS |
| Leaderboard | 863 PASS / 7 WARNING / 12 UNKNOWN / 0 FAIL | Identical |
| Course data | 28 complete / 1 unresolved / 0 failures | Identical |
| Course ratings | 25 rated / 4 unrated / 0 failures | Identical |
| Regression tests | 12 passed / 0 failed | Identical |

All three validator log outputs match the pre-extension baseline byte-for-byte.
Warnings and unknown checks are historical and pre-existing. Coxmoor's unresolved
factual fields remain unknown. No historical evidence or validation was altered.

Browser checks cover all five linked pages at 320, 390, 768 and 1440px. A 320px
Year in Review headline overflow and faint inherited scorecard symbols were
corrected. Native course-button Enter, scorecard disclosure, profile open/close,
query-string year selection and mobile-menu Enter/Escape/focus return were tested.
The original data, scoring, `main.js`, legacy renderers, `legacy.css` and Netlify
configuration were compared against the base and remain unchanged. Whitespace
validation passes.

Limitations: tests use Chromium viewport sizes, not a physical iPhone/Safari.
Reduced-motion styles are retained but an active OS preference was not exercised.
No screen-reader audit, Lighthouse benchmark or independent review is claimed.
The existing annual metadata and article wording are preserved; this design work
is not a separate historical editorial reconciliation. Photography is still a
small library with unverified locations/years. External Google Fonts retain
fallbacks. The temporary public preview was separately authorised by James's follow-up request; it is not a production deployment.

## Files and TODO

This extension modifies all five destination HTML files plus the homepage's
concept-photo caption and the architecture/Phase 1 handoff documentation. It adds
`src/journal-pages.js`, `src/styles/championship.css` and this report. The earlier
homepage assets, stylesheet and module are retained.

`docs/todo.md` is unchanged. The wider final QA checkbox remains open because
physical-device, screen-reader and independent review are still outstanding.
Publication status: source remains local and uncommitted; the separately
authorised temporary HTTPS preview serves its build for visual review. No
production deployment, GitHub push or Netlify action occurred.

## Preview repair

The initial command-session static server and tunnel were no longer running when
James reported that the link failed. The replacement HTTPS link was verified in
the browser. It is served by transient user services `tto-preview-static` and
`tto-preview-tunnel`, independent of the chat command sessions, with a maximum
runtime of six hours. No existing preview services were present before creation.
The static server still serves only `dist/` on loopback port 5180; Netlify and
GitHub remain untouched. The tunnel may end earlier if its connection fails.
To stop the preview early: `systemctl --user stop tto-preview-tunnel tto-preview-static`.

## Publication approval and rollback reference

James's latest instruction is to push the previewed version to the main site.
The release preserves the old site in the Git history at
`092b7571bd07c822dedd45c23942be4695ca4f7a`. A separate old-version preview can be
recreated from that commit without changing production. The release does not
change deployment settings or scoring datasets. Known content gaps and cosmetic
issues remain as accepted in the prototype; material regressions must be fixed
before merging. The final PR must receive independent review of its exact head.
