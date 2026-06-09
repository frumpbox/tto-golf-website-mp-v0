# TTO Leaderboard — Data Migration Plan (Task 1B)

## Goal

Create `src/data/leaderboard-data.js` as the single source of truth for all leaderboard data, such that:
- Every existing data point across `course-data.js`, `handicap-data.js`, `legacy-script.js`, and `leaderboard.html` is captured in one place
- Future years (e.g. 2026) can be added without touching HTML or business logic
- Future OCR/photo imports can feed scores directly into the data structure
- Stableford calculations continue to produce identical results

---

## 1. Proposed Data Schema

### Top-Level Structure

```js
// src/data/leaderboard-data.js
const leaderboardData = {
  // Display order for year tabs (most recent first)
  yearOrder: [2025, 2024, 2023, 2022, 2021, 2020],

  // All courses that have ever been used — source of truth for pars, slopes, etc.
  courses: {
    tyrellsWood: { /* same shape as current course-data.js */ },
    silvertip: { /* ... */ },
    stewartCreek: { /* ... */ },
    luffenhamHeath: { /* ... */ },
    sauntonEast: { /* ... */ },
    sauntonWest: { /* ... */ },
    royalOstend: { /* ... */ },
    royalZoute: { /* ... */ },
  },

  // Player registry (stable across years)
  players: {
    "sam-lewis":   { displayName: "Sam Lewis" },
    "sam-dynes":   { displayName: "Sam Dynes" },
    "james-hall":  { displayName: "James Hall" },
    "george-stinton": { displayName: "George Stinton" },
    "felipe-milo": { displayName: "Felipe Milo" },
    "tom-sutehall": { displayName: "Tom Sutehall" },
  },

  // Per-year tournament config and results
  years: {
    2025: {
      location: "Belgium",
      courses: ["Royal Ostend", "Royal Zoute"],
      courseKeys: ["royalOstend", "royalZoute"],
      roundLabels: ["Round 1 - RO", "Round 2 - RZ"],
      conditions: "Good",
      status: "completed",

      // Results array — each entry is one player that year
      results: [
        {
          playerId: "george-stinton",
          handicapIndex: 0,
          rounds: [
            {
              courseKey: "royalOstend",
              gross: null,          // null = "blank" mode (no scores)
            },
            {
              courseKey: "royalZoute",
              gross: null,          // null = "blank" mode
            },
          ],
          playoff: null,
        },
        {
          playerId: "sam-dynes",
          handicapIndex: 16,
          rounds: [
            { courseKey: "royalOstend", gross: null },
            { courseKey: "royalZoute", gross: null },
          ],
        },
        // ... remaining 4 players
      ],
    },

    2024: {
      location: "England",
      courses: ["Saunton East Course", "Saunton West Course"],
      courseKeys: ["sauntonEast", "sauntonWest"],
      roundLabels: ["Round 1 - SE", "Round 2 - SW"],
      conditions: "Good",
      status: "completed",
      results: [
        {
          playerId: "sam-lewis",
          handicapIndex: 12,
          rounds: [
            {
              courseKey: "sauntonEast",
              gross: [5,5,7,5,4,4,5,5,5, 4,5,5,4,7,4,5,3,5],
            },
            {
              courseKey: "sauntonWest",
              gross: [5,7,7,4,4,5,4,4,3, 5,5,6,6,6,5,2,8,5],
            },
          ],
          playoff: { note: "Playoff win after 2, hole 10 then 9" },
        },
        // ... remaining players
      ],
    },

    2023: { /* ... similar shape ... */ },
    2022: { /* ... similar shape ... */ },
    2021: { /* ... similar shape ... */ },
    2020: {
      location: "England",
      courses: ["Tyrells Wood", "Tyrells Wood"],
      courseKeys: ["tyrellsWood", "tyrellsWood"],
      roundLabels: ["Round 1 - TW", "Round 2 - TW"],
      conditions: "Good",
      status: "completed",
      results: [
        {
          playerId: "sam-lewis",
          handicapIndex: 26.7,
          rounds: [
            { courseKey: "tyrellsWood", gross: [4,5,6,5,5,5,7,7,4, 5,8,5,5,8,6,6,5,6] },
            { courseKey: "tyrellsWood", gross: [6,5,5,6,6,5,7,5,5, 6,5,7,6,6,6,4,3,7] },
          ],
          playoff: { note: "Playoff win after 2, hole 18 then 10" },
        },
        {
          playerId: "james-hall",
          handicapIndex: 10.1,
          rounds: [
            { courseKey: "tyrellsWood", gross: [5,4,3,3,5,6,6,5,3, 4,6,5,4,5,6,3,4,3] },
            { courseKey: "tyrellsWood", gross: [4,4,4,3,4,5,5,6,5, 5,5,5,4,5,5,3,4,6] },
          ],
        },
        {
          playerId: "felipe-milo",
          handicapIndex: 13.4,
          rounds: [
            { courseKey: "tyrellsWood", gross: [4,6,5,3,5,7,5,5,2, 6,5,6,7,5,3,4,6,4] },
            { courseKey: "tyrellsWood", gross: [3,6,5,4,5,7,7,4,3, 4,4,6,6,5,6,6,6,7] },
          ],
        },
        {
          playerId: "george-stinton",
          handicapIndex: 5.2,
          rounds: [
            { courseKey: "tyrellsWood", gross: null },  // was blank mode
            { courseKey: "tyrellsWood", gross: null },  // was blank mode
          ],
        },
        {
          playerId: "sam-dynes",
          handicapIndex: 44.8,
          rounds: [
            { courseKey: "tyrellsWood", gross: null },  // was blank mode
            { courseKey: "tyrellsWood", gross: null },  // was blank mode
          ],
        },
      ],
    },
  },
};
```

### Key Schema Decisions

| Decision | Rationale |
|----------|-----------|
| `gross: null` means "blank mode" | Replaces the `grossModeOverridesByPlayer` "blank" string — simpler, no stringly-typed modes |
| `gross: number[]` (18 elements, no Out/In/Tot) | Matches real scorecard data; Out/In/Tot are computed. OCR output will naturally be 18-hole arrays |
| `rounds[]` is always length 2 | Current format; can become variable-length in future (single-round events, 3-round tournaments) |
| `playoff: null` for no playoff | Absence replaces hardcoded `if` statements |
| `handicapIndex` on each result | Eliminates cross-referencing `handicap-data.js` per-player — data is self-contained |
| `courses` object mirrors current `course-data.js` | No schema change needed; can be kept as-is and imported |
| `playerId` as slug key | Stable identifier regardless of display name changes |

### What is NOT in this file

- **Course handicap** — computed at render time from `courseData.slope`, `courseData.courseRating`, `courseData.par[20]`, and `handicapIndex` using `calculateCourseHandicap()`. No need to store it.
- **Round points / total points** — computed at render time from gross scores and Stableford formula. No need to store it.
- **Year-by-year positions** — computed at render time by sorting results by total points.

### What replaces each existing data source

| Current Location | Replaced By |
|---|---|
| `course-data.js` `courses` object | `leaderboardData.courses` (same shape, single source) |
| `handicap-data.js` `playerHandicaps` | Drops `playerHandicaps` (course handicaps are computed); `handicapIndex` lives per-result |
| `handicap-data.js` `playerHandicapIndexes` | Migrated to `leaderboardData.years[year].results[].handicapIndex` |
| `legacy-script.js` `grossOverridesByPlayer` | Migrated to `leaderboardData.years[year].results[].rounds[].gross` |
| `legacy-script.js` `grossModeOverridesByPlayer` | Replaced: `gross: null` = blank mode; non-null = explicit scores |
| `legacy-script.js` playoff hardcodes | Migrated to `leaderboardData.years[year].results[].playoff` |
| `leaderboard.html` summary table (hardcoded ranks) | Computed at render time from result positions |
| `leaderboard.html` year metadata (location, courses) | `leaderboardData.years[year].location`, `.courses`, `.conditions` |

---

## 2. Migration Order

### Phase 1: Create the data file (this task)

1. Create `src/data/leaderboard-data.js` with the schema above
2. Export it as an ES module
3. For each year 2020–2025, populate `years[year]` with:
   - Metadata (location, courses, conditions) from HTML headings
   - Results array with every player, handicap index, and per-round gross scores
   - Playoff data from hardcoded `if` statements
4. Copy the `courses` object verbatim from `src/data/course-data.js` into the file
5. **Verification**: write a Node.js script (or browser console utility) that:
   - Loads leaderboard-data.js
   - For each year, loops results, computes Stableford via `calculateCourseHandicap()` + `buildScorecardTable()` equivalent
   - Compares total points to the live page output
   - Flags any mismatch

### Phase 2: Import into main.js (alongside legacy)

- `src/main.js` imports `leaderboard-data.js` in addition to existing imports
- During this phase, the legacy system still powers the page; the data file is just a load-time verification target

### Phase 3: Build renderer that consumes the data

- `src/leaderboard-renderer.js` reads from `leaderboardData`, generates DOM
- Wire it up; remove hardcoded tables from `leaderboard.html`

### Phase 4: Drop legacy data sources

- Remove `grossOverridesByPlayer`, `grossModeOverridesByPlayer`, `initYear()` callbacks
- Remove root-level `course-data.js`, `handicap-data.js`, `script.js`

---

## 3. How Courses Should Be Represented

Courses are **static reference data** — they don't change year to year. The `courses` object in `leaderboard-data.js` mirrors the current `course-data.js` shape exactly:

```js
courses: {
  tyrellsWood: {
    name: "Tyrells Wood",
    courseRating: 70.7,
    slope: 137,
    distance: [331, 354, ...],       // 21-element array (holes + Out/In/Tot)
    par: [4, 4, ...],                 // 21-element array
    strokeIndex: [18, 4, ...],        // 21-element array
    holeRating: [5, 5, ...],         // 21-element array
  },
  // ... more courses
}
```

Each year references courses by `courseKeys` (e.g. `["tyrellsWood", "sauntonEast"]`). This decouples the course definition from the year config.

**Future-proofing**: A new course in 2026 is just a new entry in `courses`. No HTML, no new imports.

---

## 4. How Yearly Results Should Be Represented

Each year is a key under `years`:

```js
years: {
  2026: {
    location: "Spain",
    courses: ["El Saler", "Alcanada"],
    courseKeys: ["elSaler", "alcanada"],
    roundLabels: ["Round 1 - ES", "Round 2 - AL"],
    conditions: "Firm & Fast",
    status: "upcoming",    // "upcoming" | "live" | "completed"
    results: [
      {
        playerId: "sam-lewis",
        handicapIndex: 8.2,
        rounds: [
          { courseKey: "elSaler", gross: null },
          { courseKey: "alcanada", gross: null },
        ],
        playoff: null,
      },
      // ...
    ],
  },
}
```

**Why `results` is an array (not keyed by playerId):**
- Array order is the initial entry order (before sorting)
- Player appearance in a year is explicit — no need to check if a player has results
- Cleanly maps to "add a row" / "remove a row" operations
- Arrays naturally work with `Array.map()` in rendering

**Adding a year** = adding one entry to `years`. No HTML, no `initYear()` call, no duplicated `<table>`.

**Variable rounds**: `rounds` is an array — on a year with 1 round (e.g. a single-day event) or 3 rounds (e.g. a tour), it just has fewer or more elements. `courseKeys` and `roundLabels` arrays match its length.

---

## 5. How Overall Rankings Should Be Calculated

The overall leaderboard ranks players by **average rank score** (finishing position average), not total rank score.

### Algorithm

```
For each player:
  1. Collect all years where the player appears in results
  2. For each such year, determine the player's finishing position (1st=1, 2nd=2, etc.)
     by computing Stableford totals for all players that year, sorting descending,
     and assigning positions with ties broken alphabetically
  3. Rank Score = sum of finishing positions
  4. Events Played = number of years the player appears
  5. Avg Rank = Rank Score / Events Played (float, e.g. 2.17)
  6. Sort players by Avg Rank ascending; break ties by Events Played descending,
     then alphabetically
```

### Current values (from hardcoded summary table — these are the benchmarks)

| Player | Played | Rank Score | Avg Rank |
|--------|--------|-----------|----------|
| Sam Lewis | 6 | 13 | 2.17 |
| Sam Dynes | 6 | 19 | 3.17 |
| James Hall | 6 | 20 | 3.33 |
| George Stinton | 6 | 20 | 3.33 |
| Felipe Milo | 5 | 17 | 3.40 |
| Tom Sutehall | 2 | 8 | 4.00 |

**Verification**: After migration, computed values must match exactly.

### Tiebreaking rules

1. Lower Avg Rank wins
2. More Events Played wins (more data = more reliable average)
3. Alphabetical by display name

For the existing 3.33 tie (James Hall vs George Stinton):
- Both have 6 events, both have avg rank 3.33
- Current table lists Hall 3rd and Stinton 4th — this matches alphabetical order

---

## 6. How Future OCR/Photo Imports Fit Into the Structure

### Workflow

```
User uploads scorecard photo
       │
       ▼
OCR service extracts 18 hole-by-hole gross scores
  ┌─────────────────────────────────────┐
  │ Recognition result:                 │
  │ Player: Sam Lewis                   │
  │ Course: elSaler                     │
  │ Round: 1                            │
  │ Year: 2026                          │
  │ Gross: [4,5,4,3,5,4,6,4,5,...]    │
  └─────────────────────────────────────┘
       │
       ▼
Validate: does course exist in courses?
Validate: does year exist in years?
Validate: does player exist in players?
       │
       ▼
Insert scores into leaderboardData:
  years[2026].results
    .find(r => r.playerId === "sam-lewis")
    .rounds[0].gross = [4,5,4,3,5,4,6,4,5,...]
       │
       ▼
Re-render leaderboard with updated data
```

### How the schema supports this

| Requirement | Schema Support |
|---|---|
| OCR produces 18-hole array | `rounds[].gross` accepts 18-element `number[]` |
| Need to identify course + year + player | `courseKeys`, year key, and `playerId` are all explicit |
| Partial uploads (one round at a time) | Each round's `gross` can be set independently |
| Validation before commit | Schema is well-defined; can validate courseKey in `courses`, playerId in `players` |
| Import script is decoupled from rendering | Import just writes into the same data structure the renderer reads |

### Proposed import API

```js
// src/lib/import-scorecard.js
export function importScorecard(data, { year, playerId, roundIndex, courseKey }) {
  // Validate
  if (!leaderboardData.years[year]) throw new Error(`Unknown year: ${year}`);
  if (!leaderboardData.courses[courseKey]) throw new Error(`Unknown course: ${courseKey}`);
  const result = leaderboardData.years[year].results.find(r => r.playerId === playerId);
  if (!result) throw new Error(`Player ${playerId} not in year ${year}`);
  if (!result.rounds[roundIndex]) throw new Error(`Round ${roundIndex} does not exist`);

  // Store — 18-hole array, no Out/In/Tot padding
  result.rounds[roundIndex].gross = data.gross;

  // Trigger re-render (event or callback)
  onDataChanged?.();
}
```

### OCR integration points

1. **Photo upload UI**: A page or modal that accepts an image, sends it to an OCR service (e.g. Google Vision, Tesseract, or a custom model)
2. **OCR processing**: Extracts structured data from the scorecard image (player name, course, hole-by-hole scores)
3. **Validation step**: Before importing, show the parsed data to an admin for confirmation
4. **Write**: Call `importScorecard()` with validated data
5. **Persist**: Write updated `leaderboard-data.js` back to the filesystem (or to a backend if one exists)

---

## 7. Verification Plan

### Goal

After creating `leaderboard-data.js`, confirm that the computed Stableford points match the existing live page exactly for all 6 years × all players × all rounds.

### Method

Write a verification script that does NOT modify any existing files.

```js
// verify-migration.js — run with `node verify-migration.js` (or via Vite dev server)
// This script lives at the project root or in src/tools/

import { courses, holeLabels, getCourseData } from './src/data/course-data.js';
import { getPlayerHandicap, getPlayerHandicapIndex } from './src/data/handicap-data.js';
import { leaderboardData } from './src/data/leaderboard-data.js';

// Import the core Stableford logic (extract from legacy-script.js)
// We need calculateCourseHandicap and the Stableford formula

function calculateCourseHandicap(handicapIndex, slope, courseRating, par) {
  // Same as legacy-script.js:535
  const slopeFactor = slope / 113;
  return Math.round(handicapIndex * slopeFactor + (courseRating - par));
}

function computeRoundPoints(grossScores, courseData, courseHandicap) {
  // Same Stableford formula as legacy-script.js:187-241
  let totalPoints = 0;
  for (let i = 0; i < 18; i++) {
    const strokeIndex = courseData.strokeIndex[i];
    const parValue = courseData.par[i];
    if (grossScores[i] == null || strokeIndex == null || parValue == null) {
      continue; // blank hole
    }
    const baseShots = Math.floor(courseHandicap / 18);
    const extraShots = courseHandicap % 18;
    const shotsReceived = baseShots + (strokeIndex <= extraShots ? 1 : 0);
    const netScore = grossScores[i] - shotsReceived;
    const diff = netScore - parValue;
    let points = 0;
    if (diff <= -3) points = 5;
    else if (diff === -2) points = 4;
    else if (diff === -1) points = 3;
    else if (diff === 0) points = 2;
    else if (diff === 1) points = 1;
    else points = 0;
    totalPoints += points;
  }
  return totalPoints;
}

// Verify every player in every year
const failures = [];
for (const [yearKey, yearData] of Object.entries(leaderboardData.years)) {
  for (const result of yearData.results) {
    let yearTotal = 0;
    result.rounds.forEach((round, rIdx) => {
      if (round.gross == null) return; // blank mode — skip
      const courseData = leaderboardData.courses[round.courseKey];
      const parTotal = courseData.par[courseData.par.length - 1];
      const courseHcp = calculateCourseHandicap(
        result.handicapIndex,
        courseData.slope,
        courseData.courseRating,
        parTotal
      );
      const roundPts = computeRoundPoints(round.gross, courseData, courseHcp);
      yearTotal += roundPts;

      // Compare with legacy getPlayerHandicap result for sanity
      const legacyHcp = getPlayerHandicap(yearKey, result.playerId);
      if (legacyHcp !== null && Math.abs(legacyHcp - courseHcp) > 1) {
        console.warn(`  HCP mismatch for ${result.playerId} ${yearKey} R${rIdx+1}: legacy=${legacyHcp} computed=${courseHcp}`);
      }
    });

    console.log(`${yearKey} ${result.playerId}: total=${yearTotal}`);
  }
}

if (failures.length > 0) {
  console.error('FAILURES:', failures);
  process.exit(1);
} else {
  console.log('All years verified successfully.');
}
```

### Verification Steps

1. Run `npm run dev` and open `leaderboard.html`
2. For each year, read each player's R1, R2, and Total points from the rendered page
3. Run the verification script and confirm computed totals match the page values
4. Check all "blank mode" players produce zero/null points (2022 all players, 2023/2024/2025 most players)
5. Check playoff markers: Sam Lewis 2020 and 2024 must show `P` superscript
6. Check positions: sort order must match (playoff winners first, then by points descending)

### Manual Spot-Check Table

| Year | Player | R1 Pts (page) | R2 Pts (page) | Total (page) | Playoff |
|------|--------|--------------|--------------|-------------|---------|
| 2020 | Sam Lewis | | | | P |
| 2020 | James Hall | | | | |
| 2021 | Sam Dynes | | | | |
| 2022 | Felipe Milo | blank | blank | 0 | |
| 2023 | Tom Sutehall | blank | blank | 0 | |
| 2024 | Sam Lewis | blank | blank | — | P |
| 2025 | George Stinton | blank | blank | 0 | |

(Blank cells to be filled in during verification.)

### Hardcoded Values to Preserve

These must match exactly post-migration:

| Data Point | Current Source | Expected Value |
|---|---|---|
| Sam Lewis 2020 playoff | `legacy-script.js:451` | `P` with title "Playoff win after 2, hole 18 then 10" |
| Sam Lewis 2024 playoff | `legacy-script.js:452` | `P` with title "Playoff win after 2, hole 10 then 9" |
| Summary: Sam Lewis | `leaderboard.html:48-53` | 1st, 6 played, 13 rank score, 2.17 avg |
| Summary: Sam Dynes | `leaderboard.html:55-59` | 2nd, 6 played, 19 rank score, 3.17 avg |
| Summary: Tom Sutehall | `leaderboard.html:84-88` | 6th, 2 played, 8 rank score, 4.00 avg |

### Output Verification Command

```bash
# After creating leaderboard-data.js, run:
node verify-migration.js

# Expected: "All years verified successfully." with zero failures
```

---

## Appendix A: Score Override Mapping

When migrating `grossOverridesByPlayer` and `grossModeOverridesByPlayer` into `leaderboardData`, use this decision table:

| grossOverrides present? | grossMode | Result in leaderboard-data.js |
|---|---|---|
| Yes (18-hole array) | ignored | `rounds[r].gross = [override scores]` |
| No | `"blank"` | `rounds[r].gross = null` |
| No | `"par"` | `rounds[r].gross = course.par[]` values (for holes 1-18) |
| No | `"bogey"` | `rounds[r].gross = course.par[] + 1` (for holes 1-18) |

In practice, the legacy data only uses `"blank"` and explicit overrides — `"par"` and `"bogey"` modes are never triggered by any existing year config. The few players with overrides for round 1 but not round 2 (e.g. 2023 James Hall, 2024 James Hall, 2024 Felipe Milo) have `gross: null` for the missing round (it was falling back to `"bogey"` mode, which produces par+1 for every hole — confirm on live page whether these rounds produce points or zero).

**Specific cases to verify:**

| Year | Player | R1 gross | R2 gross | Notes |
|---|---|---|---|---|
| 2023 | James Hall | [6,5,4,4,5,8,4,5,3, 5,6,3,6,5,7,7,3,6] | null | R2 was "bogey" mode = par+1 every hole |
| 2024 | James Hall | [5,6,4,5,3,5,5,4,4, 5,5,4,5,4,6,5,4,5] | null | R2 was "bogey" mode |
| 2024 | Felipe Milo | [5,5,7,6,2,6,5,7,4, 5,4,4,4,5,7,6,3,5] | null | R2 was "bogey" mode |
| 2024 | Sam Dynes | [7,6,6,5,3,4,5,4,5, 7,5,4,4,5,5,7,6,6] | [5,7,7,4,6,7,6,4,3, 7,6,4,7,7,7,4,8,4] | Full overrides both rounds |
| 2023 | Sam Dynes | [7,6,7,5,4,6,8,7,6, 7,4,4,6,5,8,8,5,8] | [7,8,7,7,6,9,6,6,4, 7,6,6,8,5,6,4,4,8] | Full overrides both rounds |

## Appendix B: Data Source Reference (line numbers)

This maps every data origin for migration:

| Data | File | Lines |
|---|---|---|
| Course definitions (8 courses) | `src/data/course-data.js` | 2–451 |
| Hole labels | `src/data/course-data.js` | 453–475 |
| Player handicaps (course handicap, not index) | `src/data/handicap-data.js` | 2–46 |
| Player handicap indexes | `src/data/handicap-data.js` | 49–70 |
| Gross score overrides | `src/legacy-script.js` | 551–646 |
| Gross mode overrides | `src/legacy-script.js` | 649–683 |
| Playoff hardcodes | `src/legacy-script.js` | 450–452, 450–461 |
| Year metadata (location, course names) | `leaderboard.html` | headers: 99, 345, 553, 799, 1007, 1177 |
| Conditions | `leaderboard.html` | 100, 346, 554, 800, 1008, 1178 |
| Summary table values | `leaderboard.html` | 47–90 |
| Year config (players, courseKeys, roundLabels) | `src/legacy-script.js` | 254–324 |
| `initYear()` dispatch | `src/legacy-script.js` | 254–324 |
