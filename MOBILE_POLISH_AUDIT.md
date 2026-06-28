# TTO Mobile Polish Audit

Audited: 28 June 2026  
Scope: All 6 pages across breakpoints (320px–600px viewport width)

---

## Findings

### 1. Navigation / Header — Critical

| Issue | Severity | Details |
|-------|----------|---------|
| **No hamburger/collapse** | 🔴 High | 6 nav links + crest + title in one flex row. At 375px the nav links wrap to multiple lines, pushing content down and breaking the layout. |
| **Overflow on small phones** | 🔴 High | `nav-layout` uses `gap: 20px` with 6 inline links. Below ~400px the links overflow or wrap awkwardly. |
| **Touch targets undersized** | 🟡 Medium | Nav `<a>` has `font-size: 0.95rem` (~15px) with no extra padding. The tap target is only the text height, below the recommended 44px. |
| **Active indicator clips** | 🟢 Low | Bottom-border active state may be invisible on wrapped nav lines. |

### 2. Homepage Hero — Medium

| Issue | Severity | Details |
|-------|----------|---------|
| **Excessive min-height** | 🟡 Medium | `min-height: 80vh` on mobile leaves ~40–60px of content below the fold; users must scroll to see the cards. |
| **Crest image large** | 🟢 Low | `140px × 140px` crest in hero is large for a 375px screen (~37% width). |
| **Stats strip spacing** | 🟢 Low | `gap: 1rem` (16px) and `flex-wrap: wrap` works but stat numbers are still relatively large for the strip width. |

### 3. Homepage Cards — Good

| Issue | Severity | Details |
|-------|----------|---------|
| No critical issues | 🟢 None | Grid `minmax(160px, 1fr)` collapses well. Padding 20px is adequate. Touch targets are the full card. |

### 4. Leaderboard Tables — Critical

| Issue | Severity | Details |
|-------|----------|---------|
| **8-column tables overflow** | 🔴 High | Year tables have 8 columns (Pos, Member, HCP Index, R1 HCP, R2 HCP, Points, R1, R2). Below ~450px the table overflows the viewport. No `overflow-x: auto` wrapper. |
| **Horizontal scroll missing** | 🔴 High | No container has `overflow-x: auto` or `-webkit-overflow-scrolling: touch`. Users cannot reach right-hand columns. |
| **Scorecard tables unreadable** | 🔴 High | 18-hole scorecards rendered in `details-row` have 20+ columns (hole labels). These will overflow every mobile viewport. |
| **Tiny cell padding** | 🟡 Medium | `padding: 8px 6px` on mobile (`.legacy.css` media query) is small but workable if tables scroll. |
| **Round toggle stacks** | 🟢 Low | `round-toggle` uses `flex-direction: column` on mobile — fine, but buttons are small targets. |

### 5. Course Ratings — Medium

| Issue | Severity | Details |
|-------|----------|---------|
| **Scorecard overflow in panel** | 🔴 High | The `#selected-course-panel` renders a full 18-hole scorecard with 21+ columns. No overflow handling — will break layout on mobile. |
| **Panel padding on mobile** | 🟢 Low | `padding: 20px 16px` at ≤600px — adequate. |
| **Course-panel-top stacks** | 🟢 Low | Grid → single column at ≤600px — fine. |
| **Summary table fits** | 🟢 Low | 5 columns (Course, Country, Par, Distance, Overall) fit on most mobile screens. |

### 6. Year in Review — Good/Medium

| Issue | Severity | Details |
|-------|----------|---------|
| **Tabs wrap acceptably** | 🟢 Low | `flex-wrap: wrap` with `padding: 8px 16px`. Touch targets are borderline (~32px height) but functional. |
| **Article text size** | 🟢 Low | `font-size: 0.95rem` (~15px) on mobile with line-height 1.85 — readable. |
| **Player cards stack** | 🟢 Low | Single-column at ≤600px — works well. |
| **Gallery grid** | 🟢 Low | `minmax(120px, 1fr)` — fine on mobile. |

### 7. About — Good

| Issue | Severity | Details |
|-------|----------|---------|
| No critical issues | 🟢 None | Grid goes 3→2→1 column. Cards have 20px padding. Bio text at `0.82rem` (~13px) is borderline but acceptable for secondary text. |

### 8. Shop — Good

| Issue | Severity | Details |
|-------|----------|---------|
| **2-column grid tight** | 🟢 Low | `grid-template-columns: 1fr 1fr` with `gap: 14px`. Cards have 18px padding. At 320px width, 2 columns leave ~130px per card — functional but snug. |
| **Image placeholders useful** | 🟢 Low | Aspect-ratio boxes maintain consistency. |

### 9. Touch Target Sizes — Medium

| Issue | Severity | Details |
|-------|----------|---------|
| **Nav links** | 🟡 Medium | No padding on `<a>` elements. Touch target is just the text (~15px). WCAG recommends 44×44px minimum. |
| **Round buttons** | 🟡 Medium | `padding: 7px 10px` with `font-size: 0.65rem` on mobile. Small targets, especially in stacked layout. |
| **Detail toggle rows** | 🟢 Low | Full-width table rows are easy to tap despite small text. |
| **YIR tabs** | 🟢 Low | `padding: 8px 16px` — height ~34px, close to minimum. |

### 10. Horizontal Scrolling / Overflow — 🔴 Critical

| Issue | Severity | Details |
|-------|----------|---------|
| **Leaderboard year tables** | 🔴 High | No `overflow-x` wrapper. 8 columns exceed 375px viewport width. |
| **Scorecard tables** | 🔴 High | 21+ columns in detail rows and course-ratings panel. Guaranteed overflow. |
| **Nav overflow** | 🟡 Medium | Links wrap but don't technically overflow container — visual layout breaks instead. |

### 11. Font Sizes & Spacing — Medium

| Issue | Severity | Details |
|-------|----------|---------|
| **Table body text small** | 🟡 Medium | `0.76rem` (~12px) on mobile for table cells. Below recommended 16px for body text. |
| **Scorecard text tiny** | 🟡 Medium | `0.7rem` (~11px) on mobile. Hard to read. |
| **Conditions note** | 🟢 Low | `0.7rem` — acceptable for secondary metadata. |
| **Section heading (h2)** | 🟢 Low | `0.95rem` at ≤600px — fine for uppercase headings. |

---

## Prioritised Fix Checklist (Safe CSS-only changes)

**P0 — Must fix (layout-breaking)**

- [ ] Wrap every table in `<div class="table-wrapper" style="overflow-x: auto; -webkit-overflow-scrolling: touch;">` — applies to all `<table>` elements on leaderboard, course-ratings (including JS-generated scorecard tables)
- [ ] Add `overflow-x: auto` to the scorecard table wrapper in the course ratings JS-rendered panel
- [ ] Add `overflow-x: auto` to the leaderboard `.details-row > td` contents (scorecard tables inside expanded rows)

**P1 — Navigation**

- [ ] Add `flex-wrap: wrap` to `nav .container` or `nav ul` for graceful wrapping
- [ ] Increase nav link tap targets: add `padding: 8px 6px` or `min-height: 44px` to `nav a`
- [ ] Reduce `nav-layout` gap on mobile (`@media max-width: 600px`) from 20px to 10px
- [ ] Consider hiding `<h1>` in nav on very small screens or reducing `font-size` on mobile

**P2 — Hero**

- [ ] Reduce hero `min-height` to `60vh` on mobile (currently `80vh`)
- [ ] Reduce `hero-crest-img` from 140px to 100px on mobile
- [ ] Reduce hero stats gap further on small screens

**P3 — Tables & Text**

- [ ] Increase `td`/`th` `font-size` from `0.76rem` to `0.82rem` on mobile where tables scroll
- [ ] Increase scorecard `font-size` from `0.7rem` to `0.75rem` on mobile
- [ ] Increase nav link `font-size` from `0.95rem` to at least `1rem`

**P4 — Touch targets**

- [ ] Increase round-btn padding on mobile to `min-height: 44px`
- [ ] Ensure all interactive elements have at least 36px height on mobile

**P5 — Spacing**

- [ ] Reduce container padding from 20px to 16px on mobile for more content width
- [ ] Tighter homepage card grid gap on mobile (16px instead of 20px)

---

## Non-urgent / Future improvements

- **Hamburger menu**: The nav wrapping solution above is the CSS-only band-aid. A proper hamburger or select-menu for 6+ links on <400px screens would be ideal but requires JS/HTML changes.
- **Sticky nav**: Adding `position: sticky; top: 0; z-index: 100` to the nav would improve UX on long scrolling pages.
- **Condensed scorecards**: Consider showing only front/back 9 totals on mobile instead of all 18 holes.
- **Swipeable table hint**: Adding a subtle fade/gradient indicator on scrollable tables to hint at swipable content.
