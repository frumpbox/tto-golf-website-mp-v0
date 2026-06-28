# V1 Polish Audit

Audited: all 6 HTML pages + `src/styles/legacy.css`
Focus: visible website quality only — no content additions, no package changes.

---

## HIGH

### H1 — Playfair Display font not loaded on leaderboard.html
- `leaderboard.html` imports only Inter from Google Fonts (line 9).
- The page hero uses `.page-hero-title` which has `font-family: 'Playfair Display', Georgia, serif`.
- The heading will fall back to Georgia instead of the intended display serif.
- **Fix:** Add `&family=Playfair+Display:ital,wght@0,700;1,700` to the leaderboard Google Fonts URL.

### H2 — No active nav link on any page
- `legacy.css` has a full `.active` class for nav links (line 1586–1590): gold color + gold bottom border.
- None of the 6 pages assign `class="active"` to the current page's `<a>` tag in the nav.
- Users get no visual feedback for which page they're on.
- **Fix:** Add `class="active"` to the matching nav link on each page (or use JS to set it dynamically).

### H3 — Redundant "Welcome" h2 on homepage
- The homepage hero already displays "The Tyrells Open" in large Playfair Display.
- Below it, `<main>` starts with `<h2>Welcome to The Tyrells Open</h2>` styled as a tiny uppercase section header (1.1rem, Inter, gold border).
- This feels redundant and visually weak after the bold full-screen hero.
- **Fix:** Either remove the h2 or rewrite it as a different subtitle (e.g., "The history, the courses, the champions") and style it as body text.

### H4 — year-in-review.html does not load `/src/main.js`
- All other pages load `<script type="module" src="/src/main.js">`.
- Year in Review uses its own inline module script and skips main.js entirely.
- If `main.js` contains shared bootstrap (nav highlight, global handlers), it's missing here.
- **Fix:** Add the same module script tag.

### H5 — Nav overflows on mobile, no responsive collapse
- The nav has: crest (56px) + h1 + 6 link items in a flex row.
- No `flex-wrap`, no hamburger, no media query breakpoint for nav beyond crest size.
- At 600px viewport width (with 20px container padding = 560px available), all elements compete for space and will overflow or shrink text illegibly.
- **Fix:** Add a responsive nav breakpoint with either a hamburger toggle or stacked layout below ~700px.

---

## MEDIUM

### M1 — Excessive leaderboard heading-to-table spacing
- The cascade: `h2` (margin-bottom: 16px) → `.conditions-note` (margin: -12px 0 12px) → `table` (margin-top: 15px).
- Net gap between h2 and table content is ~27px, but the negative margin on conditions-note creates an uneven visual rhythm.
- **Fix:** Consolidate margin values so the conditions-note sits tighter to the table.

### M2 — Inconsistent script placement
- `index.html` loads `/src/main.js` inside `<head>` (deferred via module).
- `about.html`, `leaderboard.html`, `course-ratings.html`, `shop.html` load it at the end of `<body>`.
- Minor functional difference (module scripts are deferred by default), but inconsistent.
- **Fix:** Standardise on one placement (end of `<body>` is safer for DOM-dependent code).

### M3 — Course ratings detail panel cramped on tablet
- `.course-panel-top` uses `grid-template-columns: 1fr 1fr`, collapsing to 1fr only at ≤600px.
- Between 601–900px the two-column layout with photo grid + ratings table + description can feel cramped.
- **Fix:** Raise the collapse breakpoint to ~800px, or simplify the panel layout.

### M4 — Hero scale jumps between pages
- Homepage hero: `min-height: 90vh`, large crest (180px), big Playfair title.
- Subpage heroes: `min-height: 40vh`, no crest, smaller scale.
- The 50vh difference is intentional (homepage needs impact) but the transition is abrupt when navigating between pages.
- **Fix:** Consider a consistent hero scale (e.g., 50–60vh on all pages) with the homepage getting the extra crest + stats as premium additions.

### M5 — Leaderboard hero title says "Season Rankings"
- Inner pages use the page name as hero title: "About Us", "Course Ratings", "Year in Review", "Shop".
- Leaderboard hero title is "Season Rankings" with subtitle "The Tyrells Open — Overall Leaderboard".
- Slight naming inconsistency — the page is called "Leaderboard" everywhere else.
- **Fix:** Change hero title to "Leaderboard" or "All-Time Leaderboard" to match the page name.

---

## LOW

### L1 — Shop card icons are emoji characters
- Trophy (🏆), shirt (🕹️ via `&#128089;` — actually a graduation cap icon was used), sweater (🦺), notebook (📄).
- Emoji rendering varies across OS/browser and looks low-effort compared to the premium card styling.
- **Fix:** Replace with SVG icons or remove entirely (product photos are "coming soon" anyway).

### L2 — "[photo]" and "Photo N" placeholders look unfinished
- About page member cards show `[photo]` as raw text in `.member-card-photo`.
- Course ratings photo spots show "Photo 1", "Photo 2" etc.
- These look like unfilled templates rather than deliberate placeholders.
- **Fix:** Use a muted camera/gallery SVG icon or a dashed photo frame with "Add photo" text.

### L3 — Homepage grid min-width too small on wide screens
- `.grid` uses `repeat(auto-fit, minmax(160px, 1fr))`, so 5 cards stretch very wide on large viewports (each card >190px wide).
- Cards look stretched; 160px minimum was designed for a tighter layout.
- **Fix:** Increase `minmax` to `200px` or `220px` so cards cap at a more natural width.

### L4 — No footer on any page
- All pages end after `</main>` or the closing script tag, with no `<footer>`.
- No copyright, back-to-top link, or site nav in the footer area.
- Not urgent, but noticeable on longer pages (leaderboard, course ratings).
- **Fix:** Add a minimal footer (copyright, social, back-to-top).

### L5 — Brand name uses different fonts in nav vs hero
- Nav `<h1>` inherits Inter (from body). Hero `.hero-title` uses Playfair Display.
- Same brand name ("The Tyrells Open") rendered in two different typefaces on the same page.
- **Fix:** Use Playfair Display for the nav h1 too, or accept this as intentional hierarchy.

---

## Summary

| Priority | Count |
|----------|-------|
| HIGH     | 5     |
| MEDIUM   | 5     |
| LOW      | 5     |
| **Total**| **15**|
