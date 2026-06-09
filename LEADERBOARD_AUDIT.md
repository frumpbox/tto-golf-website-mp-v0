# TTO Leaderboard — Architecture Audit

## 1. How the Leaderboard Currently Works

The leaderboard has two layers:

### Layer 1 — Static HTML (hardcoded)
- `leaderboard.html` contains ~1,387 lines of manually written HTML
- A **summary table** at the top is hardcoded with ranks, names, games played, rank scores, and avg ranks
- Six **year-by-year detail tables** (`table-2020` through `table-2025`) with per-player rows
- Each player row has a hidden **detail row** (`details-row`) containing round-toggle buttons and a `<div>` for a generated scorecard
- Every detail row, every toggle button, every scorecard container is hardcoded in HTML

### Layer 2 — JavaScript (dynamic population)
- `src/legacy-script.js` (duplicated as `script.js` at root) contains all the runtime logic
- On `DOMContentLoaded`, `initYear()` is called manually for each year (2020–2025)
- Each call:
  1. Looks up the player's handicap index from `handicap-data.js`
  2. Computes per-round course handicap using `calculateCourseHandicap()`
  3. Calls `buildScorecardTable()` which creates a full 18-hole scorecard table with Distance, Par, Stroke Index, Gross Score, and Points rows
  4. Calculates stableford points per hole using course handicap and stroke index
  5. Writes totals (R1 points, R2 points, combined points) into the summary row's cells
  6. Hardcodes playoff markers for specific player/year combos
  7. Sorts rows by total points within each year's table (`sortTableByPoints`)
  8. Rewrites position ordinals (`updatePositions`)

### Layer 3 — Vite module entry
- `src/main.js` imports `course-data.js` and `handicap-data.js` (from `src/data/`), exposes them to `window`, then imports `src/legacy-script.js`
- `leaderboard.html` also loads root-level `course-data.js` and `handicap-data.js` as classic `<script>` tags before the module script

### How data flows

```
course-data.js ──► window.courses, window.getCourseData
handicap-data.js ──► window.playerHandicaps, window.getPlayerHandicap, etc.
legacy-script.js ──► reads from window.*, builds DOM
```

## 2. What Is Broken or Fragile

### CRITICAL: Root course-data.js will throw a syntax error
- `course-data.js` at the project root starts with `export const courses = {`
- `leaderboard.html` loads it with `<script src="course-data.js">` (classic script, no `type="module"`)
- `export` is invalid in classic scripts — this causes `SyntaxError: Unexpected token 'export'`
- The page only works because Vite's dev server or build process may serve it differently, or the module script path (`src/main.js`) independently imports everything it needs
- If loaded directly in a browser without Vite, the page silently breaks

### Massive HTML duplication
- Every year (6 of them) has an identical `<table>` structure manually duplicated
- Every player's detail row, toggle buttons, and scorecard container is hardcoded
- Adding 2026 means copy-pasting another ~200 lines of HTML and writing a new `initYear()` call

### Data duplication across files
- Course data is duplicated in `course-data.js` (root) and `src/data/course-data.js`
- Handicap data is duplicated in `handicap-data.js` (root) and `src/data/handicap-data.js`
- Score override logic is duplicated in `script.js` (root) and `src/legacy-script.js`
- Any update must be made in parallel files — inevitable drift

### Hardcoded special cases
```js
const needsPlayoff =
  (year === 2020 && player === "Sam Lewis") ||
  (year === 2024 && player === "Sam Lewis");
```
Playoff info is baked into business logic with magic numbers. Adding a 2026 playoff means editing code.

### Summary table is completely static
- The top "overall leaderboard" table (with Rank Score, Avg Rank) is hardcoded HTML
- It does NOT recalculate from actual score data
- If you change scores in the data, the summary table stays the same

### `initYear()` calls are manual
```js
initYear({ year: 2020, courseNames: ["tyrellsWood", "tyrellsWood"], players: [...] });
initYear({ year: 2021, courseNames: ["tyrellsWood", "tyrellsWood"], players: [...] });
// ...6 calls total
```
Adding a year = adding another manual call. Years are not iterated from a data structure.

### Gross override data is incomplete
- Some players have score overrides for round 1 but not round 2 (e.g., 2023 James Hall only has round 1)
- Some players have both rounds, some have neither
- The logic falls back to `grossMode` ("par" or "bogey" or "blank") when overrides are missing
- This inconsistency makes the data hard to maintain

### No source-of-truth for players
- Players are listed in 3+ places: HTML markup, `initYear()` call, handicap data, gross overrides
- A player added to one but not the others creates silent failures

## 3. Current Data Structures

### Course data
```js
// course-data.js
{
  [courseKey: string]: {
    name: string,
    courseRating: number,    // e.g. 70.7
    slope: number,            // e.g. 137
    distance: number[],       // 21 elements: holes 1-9, Out(9), holes 10-18, In(19), Tot(20)
    par: (number|null)[],     // same 21-element shape
    strokeIndex: (number|null)[],
    holeRating: (number|null)[],
  }
}
```

### Handicap data
```js
// handicap-data.js
playerHandicaps = {
  [year: number]: {
    [playerName: string]: number  // course handicap (or null for unknowns)
  }
}
playerHandicapIndexes = {
  [year: number]: {
    [playerName: string]: number  // WHS handicap index
  }
}
```

### Score overrides
```js
// legacy-script.js / script.js
grossOverridesByPlayer = {
  [year: number]: {
    [playerName: string]: {
      [round: 1|2]: number[]   // 18 hole-by-hole gross scores
    }
  }
}
grossModeOverridesByPlayer = {
  [year: number]: {
    [playerName: string]: {
      [round: 1|2]: "par" | "bogey" | "blank" | null
    }
  }
}
```

### Year config (passed to initYear)
```js
{
  year: 2025,
  courseNames: ["royalOstend", "royalZoute"],
  players: ["George Stinton", "Sam Dynes", ...],
  roundLabels: { 1: "Round 1 - RO", 2: "Round 2 - RZ" }
}
```

### Leaderboard data model (only in HTML)
```
Table "table-{year}":
  └─ Row .details-toggle ───┬─ td: Position (ordinal)
                              ├─ td: Member name
                              ├─ td.handicap-index: WHS index
                              ├─ td.handicap: round 1 course hcp
                              ├─ td.handicap-r2: round 2 course hcp
                              ├─ td.points: total points (+ playoff sup)
                              ├─ td.r1-points: round 1 points
                              └─ td.r2-points: round 2 points
  └─ Row .details-row (hidden) ─── button.round-btn (2x) ─── div#scorecard-{year}-{slug}
```

### Year event metadata (NOWHERE — it's only in `<h2>` text)
```
"2025 - Belgium - Royal Ostend, Royal Zoute"
"2024 - England - Saunton East Course, West Course"
...
```
Location, country, course names are embedded in HTML headings only. Not in any data structure.

## 4. Proposed Redesign

### Target: A single declarative config that drives all HTML generation

```js
// leaderboard-data.js — the single source of truth
const leaderboardData = {
  // Optional: year order for the summary/overview
  yearOrder: [2026, 2025, 2024, 2023, 2022, 2021, 2020],

  // Per-player identity (doesn't change yearly)
  players: {
    "Sam Lewis": { displayName: "Sam Lewis" },
    "James Hall": { displayName: "James Hall" },
    // ...
  },

  // Per-year tournament config
  years: {
    2020: {
      location: "England",
      courses: ["Tyrells Wood", "Tyrells Wood"],
      courseKeys: ["tyrellsWood", "tyrellsWood"],
      rounds: [
        { label: "Round 1 - TW" },
        { label: "Round 2 - TW" },
      ],
      conditions: "Good",
      results: [
        {
          player: "Sam Lewis",
          handicapIndex: 26.7,
          rounds: [
            { score: [4,5,6,5,5,5,7,7,4, 5,8,5,5,8,6,6,5,6] },
            { score: [6,5,5,6,6,5,7,5,5, 6,5,7,6,6,6,4,3,7] },
          ],
          playoff: { note: "Won on 18th then 10th" }
        },
        { player: "James Hall", handicapIndex: 10.1, ... },
      ]
    },
    2021: { /* same shape */ },
    // ...
  }
};
```

Key design principles:
- **No HTML repetition** — JavaScript generates all tables from config
- **No manual `initYear` calls** — iterate over `years` keys
- **No hardcoded special cases** — playoff info lives in the data, not in `if` statements
- **No data duplication** — single `course-data.js`, single `handicap-data.js`, single override file
- **Adding 2026** = adding one entry to the `years` object, zero HTML changes, zero code changes
- **Summary table** computed from the same data

## 5. Staged Implementation Plan

### Phase 0 — BEFORE touching the live page
- Create `src/data/leaderboard-data.js` with the full year config (scores, handicaps, courses, playoffs all in one place)
- Verify it contains every data point currently spread across the four files
- Do NOT modify `leaderboard.html` yet

### Phase 1 — Generate year tables from config
- Write a `renderYearTable(yearConfig)` function that generates the entire `<table>`, `<thead>`, `<tbody>` (summary rows + detail rows with toggle buttons + scorecard containers)
- Replace the 6 hardcoded `<table>` blocks in `leaderboard.html` with a single `<div id="leaderboard-container"></div>`
- Call `renderYearTable()` for each year in the config
- Remove the need for `grossOverridesByPlayer` and `grossModeOverridesByPlayer` — scores now live in the config

### Phase 2 — Generate scorecards from config scores
- Modify `buildScorecardTable()` (or replace it) to accept scores directly from the config instead of digging into `grossOverridesByPlayer`
- The config already has per-round 18-hole score arrays; no more "par" / "bogey" / "blank" mode hacks
- Drop `grossOverridesByPlayer` and `grossModeOverridesByPlayer` entirely

### Phase 3 — Compute the summary table from year data
- Replace the hardcoded summary table with computed data:
  - Total events played per player (from years they appear in)
  - Rank score = sum of finishing positions across all events
  - Average rank = rank score / events played
  - Sort by rank score ascending

### Phase 4 — Year selector / navigation
- Add tabs, a dropdown, or accordion UI to switch between years instead of showing all 6 at once
- Default to most recent year

### Phase 5 — Cleanup
- Delete `script.js` (root), `course-data.js` (root), `handicap-data.js` (root) — they are superseded by `src/` versions
- Delete `grossOverridesByPlayer` and `grossModeOverridesByPlayer` from `legacy-script.js`
- Remove the classic `<script>` tags from `leaderboard.html`
- Move `holeLabels` into course-data.js only (not duplicated)

### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Existing scores are spread across 4+ files with different schemas | Phase 0: validate every data point before replacing any source |
| `export` in root course-data.js breaks classic script loading | This is already broken — Phase 5 removes the root files entirely |
| Hardcoded playoff details may be missed | Data-driven playoff notes in the config |
| Users may have bookmarked leaderboard.html | Phase 1: page structure stays the same, only contents are generated |
