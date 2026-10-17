# Homepage prototype — Phase 1 Builder's report

17 October 2026. Local only. This records the completed homepage-only phase.
James subsequently approved extending its style across the other five pages;
see `site-journal-prototype.md` for the current scope and verification.
Statements below about unchanged destination pages describe the Phase 1 baseline.

## Request and implementation

James approved a working Championship Journal homepage using the seven supplied
photographs. Only the homepage has been redesigned. The six existing URLs,
corrected crest, player deep links and historical functionality remain available.

The page now has a mountain landscape hero, full 2026 standings, an editorial
introduction with the group photograph, a 2020 archive feature, a course collection
feature, a linked seven-player roster and a complete footer. Forest green, warm
ivory, restrained gold, Instrument Serif and DM Sans establish the new direction.
Subtle one-time section movements, link transitions, keyboard focus and an
accessible mobile disclosure menu provide the interactions. Reduced-motion
preferences disable motion. Main content, results and navigation remain available
without JavaScript; JavaScript enhances the menu and reads resolved data.

## Isolation and publication status

- Checkout: `/tmp/tto-homepage-journal`.
- Branch: `feat/homepage-championship-journal`.
- Base: remote `main`, `092b7571bd07c822dedd45c23942be4695ca4f7a`.
- Remote main was checked through GitHub and fetched locally before creating the
  branch. The older dirty checkout and all existing worktrees were preserved.
- The pending-batch notes predate PR #11's merge. James's new task explicitly
  authorises this isolated homepage checkout instead.
- No commits, pushes, PRs, merges, hosted previews or deployments. Netlify
  configuration is unchanged. No production change is authorised or implied.
- No dependencies were installed; the existing dependency directory is linked
  locally. `package.json` and its lockfile are unchanged.

## Photographs and provenance

All seven supplied JPEGs were decoded and inspected before implementation, then
preserved byte-for-byte in `assets/homepage-originals/`. They are outside the public
build output. Optimised WebP derivatives live in `public/images/journal/`.
Responsive image selection, intrinsic dimensions, lazy loading below the hero and
priority loading of the hero reduce loading and layout shifts. The mobile hero is
about 99 KB; the desktop hero about 333 KB. Existing player portraits have small
homepage-only WebP derivatives; original portraits remain unchanged.

| Supplied image | Use and rationale |
| --- | --- |
| 01 Golden landscape | Tall course feature; warm contrast with the mountain hero. |
| 02 Mountain landscape | Main hero; strongest landscape composition and dramatic depth. Mobile uses an 800px derivative and a separate focal position. |
| 03 Group photograph | Story section; wide desktop view, closer mobile composition retaining all seven people. |
| 04 Individual with shield | Preserved, not displayed: foreground obstruction and weaker fit for this composition. |
| 05 Two golfers with shield | Archive visual celebrating the shared shield. Explicitly captioned as year unconfirmed, not evidence of the 2020 event. |
| 06 Bunker action | Player section; action and humour alongside the roster. |
| 07 Golfer towards clubhouse | Small supporting course detail on desktop; omitted on mobile to keep the page focused. |

No stock or generated imagery is used. Photo locations, dates and identities are
not inferred. The 2020 text summarises existing content and resolved results;
its quotation comes from the existing Year in Review article. The 2026 table
reads existing resolved results and does not recalculate or modify scoring.
The course count is labelled as the collection, not as 29 championship venues.

Useful additions: Fraser Hall's portrait; a high-resolution shield/engraving
close-up; a verified 2026 winner photograph; dated tournament photographs; and
higher-resolution landscape originals for very large screens.

## How James can review

The local development server is `http://127.0.0.1:5174/` on the development
computer. If stopped, run:

```bash
cd /tmp/tto-homepage-journal
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

Screenshots and validation logs are in `/tmp/tto-homepage-review/`. Desktop and
mobile screenshots are also attached through the Codex task. A localhost link
on an iPhone refers to the phone, so it cannot reach the computer's local server.
Use the attached images for phone review. A same-network server could be enabled
later if requested; no network-exposed or publicly hosted preview was created.

Personally inspect:

1. Hero imagery, headline, crest and text contrast on desktop and phone screenshots.
2. Scroll through results, group photo, archive, courses and players. Expect varied
   layouts, intact subjects and readable text without sideways page scrolling.
3. On mobile, open Menu, navigate with keyboard or touch, and close with Escape.
   Escape should return focus to Menu; selecting a destination opens an existing page.
4. Choose full results: expect 2026 standings and existing expandable scorecards.
5. Choose a player: expect that player's existing expanded profile. Read the archive
   feature: expect the 2020 article. Course collection should open Course Ratings.
6. Review the wording and visual direction before any work on the other five pages.

The original homepage was dark and centred, with a large crest, summary counts
and directory cards. The prototype uses photography, an asymmetric masthead and
headline, alternating editorial surfaces, visible championship results and real
stories. Baseline full-page screenshots are retained for comparison.

## Verification

| Check | Pre-change | Final |
| --- | --- | --- |
| `npm run build` | PASS | PASS |
| Leaderboard validator | 863 PASS / 7 WARNING / 12 UNKNOWN / 0 FAIL | Identical |
| Course data validator | 29 courses; 28 complete; Coxmoor unresolved; 0 failures | Identical |
| Course ratings validator | 25 rated / 4 unrated; 0 failures | Identical |
| `node --test tests/*.test.js` | 12 PASS / 0 FAIL | Identical |

All three validator log contents match the baseline byte-for-byte. The seven
historical handicap-methodology warnings and twelve unknown checks are
pre-existing; no historical evidence was changed to remove them. Unknown checks
comprise six missing gross cards and six unavailable course rating/slope checks.

Additional checks:

- Original seven image bytes match the uploaded ZIP exactly.
- Other five HTML pages, shared CSS/JS, scoring, underlying data and existing
  Netlify configuration match the base exactly.
- `git diff --check` passes.
- Browser layouts inspected at 320, 390, 768, 1024 and 1440px. No horizontal page
  overflow at the final checked small-phone and desktop widths.
- Mobile menu click, keyboard Enter, Escape and focus return verified.
- Hero anchor, leaderboard navigation, scorecard expansion, player profile deep
  link, 2020 article link and course collection link verified in the browser.
- Final screenshots captured with loaded visible images, including below-fold
  lazy-loaded photographs. Browser error log checked with no errors observed.

Limitations: responsive checks use Chromium, not a physical iPhone/Safari.
Reduced-motion support was inspected in CSS/JS but not tested with an active OS
preference. No screen-reader audit, Lighthouse benchmark or independent code
review has been completed. Fonts use Google Fonts with local serif/sans fallbacks.
The six other page destinations retain the old design intentionally.

## Files and checklist

Modified: `index.html`, `docs/architecture.md`.
Added: `src/homepage.js`, `src/styles/homepage.css`, this report,
`assets/homepage-originals/` (seven originals), and `public/images/journal/`
(responsive WebPs and small portrait derivatives).

`docs/todo.md` is unchanged: the wider six-page QA and content tasks remain open.
Independent review is not claimed. Stop here for James's homepage visual review;
implementation approval does not grant publication approval.
