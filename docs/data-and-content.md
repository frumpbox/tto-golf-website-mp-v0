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

The existing verifier currently reports **ten failures**: five 2024 total
failures and five 2023 total failures. The canonical Luffenham Heath update
added the George Stinton 2023 mismatch; historical points remain authoritative
pending separately identified scorecard reconstruction work.

Last verified: 23 August 2026

## Course Ratings

The authoritative source for subjective Course Ratings is
`data/import/course-ratings.xlsx`. Validated component values are imported into
the live dataset at `src/data/course-data.js`; spreadsheet formulas are not
used by the website.

Course entries can contain:

- identity, location, tee, years played, website, description, and photos;
- course rating, slope, distance, par, and stroke index;
- a top-level hole count;
- an explicit rated or unrated subjective-rating status;
- one subjective tier value per hole for rated courses; and
- six facility components.

Each course has one deliberately selected canonical factual scorecard: the
latest authoritative published configuration chosen for the website. TTO does
not retain a separate course configuration for each historical event year.
Course Ratings, leaderboard scorecards, and handicap/Stableford calculations
may consume the same canonical card, while historical leaderboard points and
results remain authoritative. Any future reconstructed gross scorecard must be
identified internally as reconstructed rather than presented as original.

Subjective totals are derived rather than stored. The official tiers are Gravy
(+3), Good (+2), Salt & Vinegar (+1), Meh (0), and Busy's Teeth (-1). The
facility maximum is 46. Eighteen-hole courses use `/54 + /46 = /100`; nine-hole
courses use `/27 + /46 = /73`.

The website contains 28 course records: the 23 previous records plus
Broadstone, Hayling, Aldeburgh, Hollinwell, and Pastures. The workbook
represents 26 courses; 25 are rated and Royal Zoute is explicitly unrated.
Stewart Creek and Silvertip are website-only and remain unrated. Pastures is
currently the only nine-hole course. Fifteen previously unrated website
courses received authoritative workbook ratings in this import.

Descriptions, photos, scorecards, websites, and played-year metadata remain
incomplete for various courses. The five added courses contain only the
authoritative subjective rating data and name/hole count; unknown metadata was
not invented. Canonical factual validation is underway. Tyrrells Wood, Stewart
Creek, Luffenham Heath, Saunton East, Saunton West, Royal Ostend, and Royal
Zoute have deliberately selected canonical cards; Silvertip still requires
final factual verification, as do the remaining non-historical courses.

Last verified: 23 August 2026

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
