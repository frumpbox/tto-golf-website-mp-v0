# Data and content

Last verified: 6 August 2026

## Current source-of-truth map

| Area | Live source | Transitional or reference source |
| --- | --- | --- |
| Leaderboard structure | `leaderboard.html` | `src/data/leaderboard-data.js` |
| Scores and calculations | `src/legacy-script.js` | `src/tools/verify-leaderboard-data.js` |
| Course and rating data | `src/data/course-data.js` | Root `course-data.js` is divergent |
| Handicap data | `src/data/handicap-data.js` | Root `handicap-data.js` is divergent |
| Year in Review | `src/data/year-review-data.js` | `yir/*.docx` source/reference files |

## Leaderboard

### Live implementation

`leaderboard.html` contains the hard-coded overall table and repeated annual
table shells. `src/legacy-script.js` fills scorecards, calculates points,
sorts annual results, and updates positions. It reads course information from
`src/data/course-data.js` and handicap information from
`src/data/handicap-data.js`.

Course handicap is calculated as:

```text
round(handicap index × slope / 113 + course rating − par)
```

Handicap strokes are assigned by stroke index. Stableford scoring is:

- net albatross or better: 5
- net eagle: 4
- net birdie: 3
- net par: 2
- net bogey: 1
- net double bogey or worse: 0

Annual rows are sorted by total points, with hard-coded playoff handling for
known ties. The overall ranking table is currently static rather than
calculated at runtime.

Some missing gross rounds use legacy par, bogey, or blank fallback modes.
Those generated values must not be mistaken for confirmed scorecards.

### Consolidated migration dataset

`src/data/leaderboard-data.js` is intended to become a consolidated source
for players, years, courses, rounds, results, and playoff metadata. It is
currently used for homepage counts and standalone verification, but it does
not render the live leaderboard.

It still contains null rounds, placeholder handicap indexes, incomplete
summaries, and discrepancies with the legacy implementation. The consolidated
dataset cannot replace the live source until verification passes.

The existing verifier currently reports **nine failures**: five 2024 total
failures and four 2023 total failures.

Last verified: 6 August 2026

## Course Ratings

The live source is `src/data/course-data.js`. Course entries can contain:

- identity, location, tee, years played, website, description, and photos;
- course rating, slope, distance, par, and stroke index;
- per-hole ratings and hole-tier summaries;
- a course score out of 54;
- facility category scores and a facilities score out of 46;
- an overall score out of 100.

There are currently 20 stored course entries. Five have a completed
`total100`: Tyrrells Wood, Luffenham Heath, Saunton East, Saunton West, and
Royal Ostend. Other overall ratings display `TBC`.

Hole-tier summaries currently use more than one data shape. Descriptions,
photos, ratings, scorecards, websites, and played-year metadata are incomplete
for various courses. Unknown values must not be invented.

Last verified: 6 August 2026

## Year in Review

Year in Review is already implemented in `year-in-review.html`, with tabs,
year selection through the query string, winner and runner-up cards, article
rendering, gallery support, and leaderboard links.

`src/data/year-review-data.js` contains full articles for 2020 and 2021.
Years 2022–2025 have basic event metadata but do not yet have full articles or
galleries. The Word documents under `yir/` are preserved source/reference
material for 2020 and 2021.

Last verified: 6 August 2026

## Known content gaps

- About member photos and biographies are placeholders.
- Most course photos and descriptions are missing.
- Many Course Ratings fields remain incomplete.
- Some leaderboard gross rounds and real handicap indexes are missing.
- Year in Review articles and galleries for 2022–2025 are incomplete.
- The Shop contains placeholders and no purchasable products.

Last verified: 6 August 2026

Before editing data, confirm which code currently consumes it. Divergent root
copies are not authoritative. Do not invent scores, handicaps, ratings,
biographies, images, or publication facts.

