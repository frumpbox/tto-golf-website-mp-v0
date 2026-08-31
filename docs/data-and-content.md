# Data and content

Last verified: 6 August 2026

## Current source-of-truth map

| Area | Live source | Transitional or reference source |
| --- | --- | --- |
| Leaderboard structure | `leaderboard.html`, `src/leaderboard-renderer.js` | Table shells remain in HTML |
| Historical leaderboard results | `src/data/leaderboard-data.js` | `src/tools/verify-leaderboard-data.js` validates resolved data |
| Course and rating data | `src/data/course-data.js` | Root `course-data.js` is divergent |
| Handicap data | `src/data/handicap-data.js` | Root `handicap-data.js` is divergent |
| Player profiles | `src/data/player-data.js` | Supplied Player Profile DOCX files |
| Year in Review | `src/data/year-review-data.js` | `yir/*.docx` source/reference files |

## Leaderboard

### Live implementation

`leaderboard.html` contains the overall and repeated annual table shells.
`src/leaderboard-renderer.js` fills and orders overall and annual summaries
directly from resolved `src/data/leaderboard-data.js` values. It does not
recalculate historical HCP, Stableford totals, Points, or positions. Unknown
values remain `null` in data and display as an en dash; genuine zero values
remain visible.

`src/legacy-script.js` builds optional scorecard details only when a resolved
round has a gross card. Missing gross cards show an unavailable message and do
not affect the annual summary.

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

Overall Rank Score is the sum of known resolved annual positions and Avg Rank
divides that score by known finishes only. Unknown positions do not contribute.
Played remains the independently recorded event-attendance count. Overall rows
sort by Avg Rank, retaining player source order when averages are equal.

Annual rows are sorted by resolved position, retaining source order for genuine
ties and placing unknown positions last. Playoff-adjusted positions therefore
come directly from the reviewed historical data.

The bypassed legacy path contains historical par, bogey, and blank fallback
modes. The active annual renderer does not use those fallbacks: missing gross
rounds remain unavailable.

### Consolidated migration dataset

`src/data/leaderboard-data.js` is the consolidated source for annual leaderboard
players, years, courses, rounds, results, and playoff metadata. It renders the
live annual summaries, supplies homepage counts, and supports standalone
verification.

It still contains null rounds, placeholder handicap indexes, incomplete
summaries, and discrepancies with the legacy implementation. The consolidated
dataset cannot replace the live source until verification passes.

Historical leaderboard expectations are normalized from the authoritative
`~/Downloads/TTO Workbook.xlsx` source into
`src/data/historical-leaderboard-data.js`. Recorded round course handicaps take
priority over recalculation from an uncertain handicap index. The verifier
checks result integrity, historical scoring, handicap consistency, and
playoff-derived positions independently using PASS, WARNING, UNKNOWN, and FAIL.
Unknown results are stored as `null`, including Felipe Milo's 2024 second round
and final result, and every 2025 first round and final result. Approved
populated-card corrections are marked `reconstructed`; unchanged cards with
uncertain origin remain `existing-provenance-unknown`. George Stinton's known
2023 HI is 2.7 and derives HCP 6 for both Luffenham rounds. Approved 2024
evidence-based HIs and HCPs are marked `estimated`. Sam Lewis's reconstructed
2022 R1 hole-18 point is separately documented because the workbook holes
totalled 41 while the authoritative round total is 42. High-confidence missing
gross cards may be reconstructed only when the canonical course, agreed round
HCP, all 18 hole Stableford values, and authoritative round total are present.
For a positive hole value, gross is derived as canonical par plus allocated
strokes plus two, minus Stableford points. For a zero-point hole, reconstruction
uses canonical par plus allocated strokes plus two: the minimum gross score
that produces zero under the application rules. Reconstructed cards retain the
agreed historical HCP and are marked `reconstructed`; rounds without complete
hole-level scoring remain unresolved.

### 2020 plausible synthetic scorecards

Three 2020 scorecards are plausible synthetic reconstructions, not recorded or
original historical gross cards: George Stinton R1, George Stinton R2, and
Samuel 'Dynesy' Dynes R1. Their authoritative historical facts remain the
recorded HI, course HCP, round Stableford totals, final Points, and positions.
Only the exact hole-by-hole gross scores and the resulting hole Stableford
patterns are reconstructed supporting detail.

The original gross cards and hole-by-hole Stableford were unavailable. The
reconstructed cards use the canonical Tyrrells Wood par and stroke index with
the authoritative round HCP to generate plausible compatible scorecards that
reproduce the known round totals. George's cards were constrained to no gross
score better than birdie; Dynesy's card was constrained to no gross score
better than par. All three cards and their derived hole Stableford patterns are
marked `reconstructed` with synthetic reconstruction metadata in the dataset.

Last verified: 31 August 2026

### 2022 restored handicap and scorecard interpretation

The 2022 event predates The Tyrrells Open's use of modern WHS Handicap Index
and Course Handicap handling. The surviving legacy handicap values have been
restored as historically meaningful evidence, not asserted as independently
verified modern WHS Handicap Indexes: Felipe Milo 16.8, Sam Lewis 16.8, Samuel
'Dynesy' Dynes 31.1, George Stinton 4.9, and James Hall 12.8. Their provenance
is stored as `restored-legacy`.

Modern reconstruction uses round-specific historical tee context rather than
changing the global canonical course records: R1 Silvertip tee, par 72,
Course Rating 69.0, Slope 129; R2 Stewart Creek White tee, par 71, Course
Rating 68.7, Slope 123. This produces reconstructed modern R1/R2 HCPs of
16/16 for Felipe, 16/16 for Sam Lewis, 33/32 for Dynesy, 3/3 for George, and
12/12 for James. These calculations interpret the restored legacy values for
the website; they do not claim that the 2022 competition itself used the same
methodology.

Dynesy's reconstructed R1 HCP consequently changed from 32 to 33. Silvertip
Hole 12 has Stroke Index 15 and receives the extra stroke; its reconstructed
gross was increased from 3 to 4 so the net score and recorded Stableford value
remain unchanged.

Silvertip Hole 14 was played as a par 3 during the 2022 TTO, while the current
canonical scorecard represents it as par 5. Each of the five reconstructed R1
gross scores is stored and displayed with a +2 normalisation against the
current representation. Metadata adds an asterisk without changing the
numeric score, and an explanatory note appears below only those five R1
scorecards. The +2 is treated as a display normalisation when validating the
unchanged authoritative hole Stableford values.

The exact gross scorecards are reconstructed supporting detail, not original
historical cards. Neither adjustment changed any authoritative hole
Stableford value, round total, Points, or position. Sam Lewis's separate R1
Hole 18 reconciliation (workbook 0, reconstructed 1, authoritative R1 total
42) also remains unchanged.

Last verified: 31 August 2026

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

Canonical factual course distances are stored and displayed in yards. When an
authoritative scorecard is published in metres, each hole is converted with
`1 metre = 1.0936133 yards` and independently rounded to the nearest whole
yard. Out, In, and Total are then derived from those stored hole values; course
rating, scratch rating, ACR, and slope are not converted or recalculated.

`src/tools/verify-course-data.js` validates the separate factual-card dataset.
It classifies every course as complete or intentionally unresolved and checks
the 21-position 18-hole or 10-position 9-hole array layout, required fields,
yards-only storage, hole values, published stroke-index values, and
distance/par subtotals and totals. Subjective Course
Ratings remain independently validated by
`src/tools/verify-course-ratings-data.js`.

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
not invented. Canonical factual validation is complete: all 28 courses now
have deliberately selected and verified canonical factual cards. Pastures
remains a genuine nine-hole White - Front card; it is not duplicated into an
artificial 18-hole configuration. Missing-card historical leaderboard
reconstruction remains separate, unfinished work; the populated-data
leaderboard verifier currently has no FAIL checks.

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

## Player profiles

The six existing member cards on `about.html` retain their established names,
roles, labels, ordering, and visual design. Each card can open one expanded
player profile beneath the grid. Stable deep links use the existing player ID,
for example `about.html?player=sam-dynes`.

`src/data/player-data.js` is the normalized source for detailed public profile
content extracted from the supplied Player Profile DOCX documents. Unknown,
blank, and `XXX` source fields are stored as `null` and shown as a restrained
`TBC`; values are not inferred. The About Us card labels remain independent
and authoritative for the top-level cards.

Last verified: 23 August 2026

## Known content gaps

- About member cards have approved player photos; detailed biographies are
  available in the expanded profiles.
- Most course photos and descriptions are missing.
- Many Course Ratings fields remain incomplete.
- Some leaderboard gross rounds and real handicap indexes are missing.
- Year in Review articles and galleries for 2022–2025 are incomplete.
- The Shop contains placeholders and no purchasable products.

Last verified: 6 August 2026

Before editing data, confirm which code currently consumes it. Divergent root
copies are not authoritative. Do not invent scores, handicaps, ratings,
biographies, images, or publication facts.
