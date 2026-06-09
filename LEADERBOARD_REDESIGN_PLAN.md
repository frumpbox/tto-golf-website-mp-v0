# TTO Leaderboard — PGA Tour‑Inspired Redesign Plan

## Design Vision

A single‑page leaderboard that feels like a premium golf broadcast overlay — clean, minimal, data‑rich. Inspired by PGA Tour's leaderboard, PGA Tour Fantasy, and NLU branding.

| Element | Inspiration |
|---------|-------------|
| Dark header bar with year tabs | PGA Tour "season" selector |
| Monospace scorecells | Broadcast leaderboards |
| Coloured shapes for birdie/eagle/bogey | PGA Tour scorecard markers |
| Expandable scorecards (accordion) | Existing UX, polished |
| Computed overall standings | FedEx Cup style points table |

---

## 1. Data Structure — Single Source of Truth

```js
// src/data/leaderboard-data.js
const leaderboardData = {
  yearOrder: [2026, 2025, 2024, 2023, 2022, 2021, 2020],

  players: {
    "sam-lewis":   { displayName: "Sam Lewis" },
    "sam-dynes":   { displayName: "Sam Dynes" },
    "james-hall":  { displayName: "James Hall" },
    "george-stinton": { displayName: "George Stinton" },
    "felipe-milo": { displayName: "Felipe Milo" },
    "tom-sutehall": { displayName: "Tom Sutehall" },
  },

  years: {
    2020: {
      location: "England",
      country: "England",
      courses: ["Tyrells Wood", "Tyrells Wood"],
      courseKeys: ["tyrellsWood", "tyrellsWood"],
      roundLabels: ["Round 1 - TW", "Round 2 - TW"],
      conditions: "Good",
      results: [
        {
          playerId: "sam-lewis",
          handicapIndex: 26.7,
          rounds: [
            { score: [4,5,6,5,5,5,7,7,4, 5,8,5,5,8,6,6,5,6] },
            { score: [6,5,5,6,6,5,7,5,5, 6,5,7,6,6,6,4,3,7] },
          ],
          playoff: { note: "Won on 18th then 10th" },
        },
        // ...more players
      ],
      status: "completed",   // "completed" | "upcoming" | "live"
    },
    // ...more years
  },
};
```

**Key properties per year:**
- `location`, `country`, `courses`, `courseKeys`, `roundLabels`, `conditions`
- `status` — enables future "live" or "upcoming" visual states
- `results[]` — array eliminates duplicate player data across separate files
- Each `result.rounds[].score` is an 18‑hole array (no more null/Out/In/Tot padding)
- `playoff` only present when applicable — no more `if` statements in business logic

**How to add 2026:**
```js
years: {
  ...existing,
  2026: {
    location: "Spain",
    country: "Spain",
    courses: ["El Saler", "Alcanada"],
    courseKeys: ["elSaler", "alcanada"],
    roundLabels: ["Round 1 - ES", "Round 2 - AL"],
    conditions: "Firm & Fast",
    results: [
      { playerId: "sam-lewis", handicapIndex: 8.2, rounds: [...] },
      // ...
    ],
  },
},
```
No HTML, no manual `initYear()` calls, no override files.

---

## 2. Page Layout

```
┌──────────────────────────────────────────────────┐
│  [TTO crest]         The Tyrells Open            │  nav
│  Home │ About │ Leaderboard │ Courses │ Shop     │
├──────────────────────────────────────────────────┤
│  2020 │ 2021 │ 2022 │ 2023 │ 2024 │ 2025 │ 2026  │  year tabs
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─ OVERALL LEADERBOARD ──────────────────────┐  │
│  │  Pos │ Player    │ Played │ Rank Score │ Avg│  │
│  │  1st │ Sam Lewis │    6   │    13      │2.17│  │
│  │  2nd │ Sam Dynes │    6   │    19      │3.17│  │
│  └─────────────────────────────────────────────┘  │
│                                                  │
│  ┌─ 2025 — Belgium — Royal Ostend, Royal Zoute ┐ │
│  │  Conditions: Good                            │ │
│  │  Pos │ Player     │ HCP │ R1 │ R2 │ Total  │ │
│  │  1st │ G. Stinton │  0  │ 43 │ 44 │  87   │ │
│  │      │ [⏷ scorecard]                       │ │
│  │  2nd │ S. Dynes   │ 24  │ 36 │ 35 │  71   │ │
│  │      │ [⏷ scorecard]                       │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  *Lower rank score is better                     │
└──────────────────────────────────────────────────┘
```

### 2.1 Year Selector (Tabs)
- Horizontal tab bar below nav
- Each tab = year label (`2025`, `2024`, etc.)
- Active tab highlighted (underline + bold, PGA Tour style)
- Clicking a tab filters the view to show:
  - The overall leaderboard (always visible)
  - Only that year's results table
- Default: most recent year selected

### 2.2 Overall Leaderboard
- Computed from all year results, not hardcoded
- Columns: Position | Player | Played (# events) | Rank Score* | Avg Rank
- Rank Score = sum of finishing positions (1st=1, 2nd=2, ...)
- Avg Rank = Rank Score / Played
- Sorted by Rank Score ascending
- Ties broken alphabetically

### 2.3 Yearly Results Table
- Generated entirely from data, no static HTML
- Columns: Position | Player | Handicap Index | R1 HCP | R2 HCP | R1 Pts | R2 Pts | Total Pts
- Playoff marker: `P` superscript next to total with tooltip
- Clicking a player row expands the scorecard accordion

### 2.4 Expandable Scorecard Accordion
- Same UX as current: click row → reveals round toggle + 18‑hole scorecard
- Round toggle buttons switch between R1 and R2 views
- Scorecard table: Distance | Par | Stroke Index | Gross Score | Stableford Points
- Same layout as current `buildScorecardTable()`, ported to read from data

---

## 3. Birdie / Eagle / Bogey Visual Markers

Each cell in the Gross Score row gets a coloured shape indicator:

| Score vs Par | Marker | Colour | Shape |
|-------------|--------|--------|-------|
| Eagle or better (−2+) | 🟢 3 | Green | Filled circle |
| Birdie (−1) | 🔵 4 | Blue | Filled circle |
| Par (0) | 5 | — | No marker |
| Bogey (+1) | 🟠 6 | Orange/Amber | Filled square |
| Double bogey or worse (+2+) | 🔴 8 | Red | Filled square |

Implementation:
- Each `<td>` in the Gross Score row gets a CSS class based on the diff from par
- Shapes via CSS pseudo-elements or inline SVG:
  - Circle: `border-radius: 50%` on a small inline element
  - Square: standard block with `border-radius: 2px`
- Or use unicode characters filled in the cell background
- Points cell also inherits a subtle tint from the same colour scale

This mirrors PGA Tour scorecard markers where coloured circles/squares indicate performance relative to par.

---

## 4. Staged Implementation

### Phase 0 — Create `src/data/leaderboard-data.js`
- Single authoritative file with all 6 years of data
- Migrate scores from `grossOverridesByPlayer` and `grossModeOverridesByPlayer`
- Migrate handicap indexes from `handicap-data.js`
- Migrate playoff info from hardcoded `if` statements
- Add `courseKeys`, `roundLabels`, `location`, `conditions`
- Verify against existing page output — totals must match exactly
- **Do not modify any existing files yet**

### Phase 1 — Generate Year Tables from Data
- Create `src/leaderboard-renderer.js`
  - `renderYearTable(yearData, yearKey)` — returns full `<table>` DOM
  - `renderPlayerRow(playerResult, yearKey)` — summary row + hidden detail row
  - `renderScorecard(result, yearKey, courseKey)` — 18‑hole table
- Replace hardcoded tables in `leaderboard.html` with `<div id="leaderboard-root"></div>`
- Import `leaderboard-renderer.js` in `src/main.js` (alongside existing legacy import for now)
- Render all years into the container (still shown stacked, like today)
- Legacy `script.js` and `initYear()` calls can coexist during migration

### Phase 2 — Port Scorecard Generation
- Replace `legacy-script.js` scorecard logic with new renderer
- New scorecard reads scores directly from `leaderboard-data.js` — no more `grossOverridesByPlayer` lookups
- Add birdie/eagle/bogey marker CSS classes
- Course handicap still computed via `calculateCourseHandicap()` (keep that function)
- Toggle behaviour (round buttons, show/hide) stays the same

### Phase 3 — Computed Overall Leaderboard
- `renderOverallLeaderboard()` — aggregates across all years
- Compute played count, rank score, avg rank from `leaderboardData.years`
- Replace the hardcoded summary `<table>` with the computed version
- Order of tiebreak: rank score → avg rank → alphabetical

### Phase 4 — Year Selector
- Render year tab bar above the tables
- On tab click: show overall leaderboard + selected year's table, hide others
- Smooth slide/fade transition
- Default to most recent year (highest key in `years`)
- Sticky tab bar on scroll

### Phase 5 — Visual Polish (PGA Tour aesthetic)
- Apply dark header with white text to year tabs
- Monospace font for score cells (e.g. `SF Mono`, `JetBrains Mono`)
- Birdie/eagle/bogey circle/square coloured markers via CSS
- Row hover effect (subtle highlight)
- Responsive: collapse to single column on mobile
- Add loading states and empty‑year fallback
- Footnotes styling consistent with PGA Tour's `*` notation

### Phase 6 — Cleanup
- Remove `script.js` (root), `course-data.js` (root), `handicap-data.js` (root)
- Remove `grossOverridesByPlayer` and `grossModeOverridesByPlayer` from `legacy-script.js`
- Remove classic `<script>` tags from `leaderboard.html`
- Remove `src/legacy-script.js` and `src/data/handicap-data.js` (data migrated)
- Remove `initYear()`, `sortTableByPoints()`, `updatePositions()` if no longer referenced
- Move `holeLabels` into course-data.js only (if not already)

---

## 5. New Files Summary

| File | Purpose |
|------|---------|
| `src/data/leaderboard-data.js` | Single source of truth for all scores, handicaps, courses, playoffs |
| `src/leaderboard-renderer.js` | DOM generation for tables, scorecards, overall standings |
| `src/leaderboard.css` | (optional) Styles specific to the new leaderboard components |

## 6. Modified Files

| File | Change |
|------|--------|
| `leaderboard.html` | Replace all year tables with `<div id="leaderboard-root">`; add year tab container; remove classic script tags |
| `src/main.js` | Import `leaderboard-data.js` and `leaderboard-renderer.js`; call render functions on DOMContentLoaded |

---

## 7. Risks

| Risk | Mitigation |
|------|-----------|
| Score data migration error — wrong totals | Phase 0: manually verify each year's points against live page |
| Legacy scripts still needed | Phases 1–3 keep legacy code intact alongside new code; Phase 6 removes only when verified |
| Bookmark breakage | Same URL (`leaderboard.html`), same page structure at top level |
| New year with different format (single round, 3 rounds) | Schema flexible: `rounds` is an array, `courseKeys` and `roundLabels` match its length |
