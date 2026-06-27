# Course Ratings Rebuild Plan

Match the professional Year in Review aesthetic (Playfair Display headings, gold accents, dark elegant cards, smooth transitions).

---

## Stage 1 — Data Enrichment

### 1a. Add rating fields to each course in `src/data/course-data.js`

Add a `ratings` object to every course entry:

```js
ratings: {
  courseRating54: 0,     // /54
  golfFacilities: 0,     // /9
  clubhouse: 0,          // /9
  postRoundVibes: 0,     // /9
  valueForMoney: 0,      // /9
  location: 0,           // /9
  courseMap: 0,          // /1
  total: 0,              // /100 — computed if desired
}
```

Also add optional fields for the feature section (below summary table):

```js
website: "",                // official course URL
description: "",            // paragraph text
photos: ["", "", "", ""],   // 4 photo paths/placeholders
```

### 1b. Duplicate data in root `course-data.js`

Mirror the same additions so the non-module script keeps working.

---

## Stage 2 — HTML Template (`course-ratings.html`)

### 2a. Upgrade `<head>`

- Add Google Fonts preconnect + link for `Inter` and `Playfair Display` (same as `year-in-review.html`)
- Keep `<link rel="stylesheet" href="/src/styles/legacy.css" />`

### 2b. Hero section (above main container)

Replace the current `<h2>` heading with a hero matching YIR:

```html
<section class="yir-hero">
  <div class="yir-hero-overlay"></div>
  <div class="yir-hero-content">
    <p class="yir-hero-eyebrow">The Tyrells Open</p>
    <h2 class="yir-hero-title">Course Ratings</h2>
    <p class="yir-hero-subtitle">Every course we've played, rated and reviewed.</p>
  </div>
</section>
```

### 2c. Summary table (kept, columns updated)

Headers: **Course | Par | Distance | Rating | Slope | Overall Rating**

- Replace "Avg Hole Rating" column with "Overall Rating"
- The overall rating is a new computed field — initially derive from the `ratings.total` field once data is populated, or show `—` as placeholder
- Maintain click-to-expand behavior on summary rows

### 2d. Expanded scorecard area — add sub-ratings section

Inside the expanded detail cell (below the scorecard table), render a sub-ratings block:

**Course Scorecard**

[scorecard table as now]

**Course Ratings**

| Category | Score |
|---|---|
| Course Rating | X /54 |
| Golf Facilities | X /9 |
| Clubhouse | X /9 |
| Post Round Vibes | X /9 |
| Value for Money | X /9 |
| Location | X /9 |
| Course Map | X /1 |
| **Total** | **X /100** |

Style this as an elegant dark card with gold accents.

### 2e. Course feature sections (below the summary table)

After the closing `</tbody></table>`, add one section per course:

```html
<section class="course-feature" id="course-feature-{key}">
  <h3 class="course-feature-name">{course.name}</h3>
  <div class="course-feature-photos">
    <div class="course-photo-placeholder">Photo 1</div>
    <div class="course-photo-placeholder">Photo 2</div>
    <div class="course-photo-placeholder">Photo 3</div>
    <div class="course-photo-placeholder">Photo 4</div>
  </div>
  <div class="course-feature-description">
    <p><!-- description text or placeholder --></p>
  </div>
  <a class="course-feature-link" href="#" target="_blank">Official Website →</a>
</section>
```

These sections sit below the table, one after another. Style them as spacious cards matching YIR article/gallery sections.

---

## Stage 3 — CSS (`src/styles/legacy.css`)

### 3a. Course Ratings hero (reuse YIR hero classes)

The hero already uses `.yir-hero`, `.yir-hero-overlay`, `.yir-hero-content`, `.yir-hero-eyebrow`, `.yir-hero-title`, `.yir-hero-subtitle` — no new CSS needed.

### 3b. Sub-ratings table

```css
.cr-ratings-table { /* dark card, gold border-left on total row, compact */ }
.cr-ratings-table th,
.cr-ratings-table td { /* consistent padding, gold accent for label column */ }
.cr-ratings-table .cr-total-row { /* bolder, gold tint */ }
```

### 3c. Course feature sections

```css
.course-feature { /* dark card, border, rounded, margin-bottom 32px */ }
.course-feature-name { /* Playfair Display, gold, large */ }
.course-feature-photos { /* grid of 4, aspect-ratio 4/3 */ }
.course-photo-placeholder { /* dashed border, centered text, subtle */ }
.course-feature-description { /* flowing prose, max-width 720px */ }
.course-feature-link { /* gold link/button like .yir-lb-link */ }
```

---

## Stage 4 — JavaScript (inline in `course-ratings.html`)

### 4a. Compute overall rating per course

Build a new function or inline logic:

```js
function getOverallRating(course) {
  const r = course.ratings;
  if (!r) return "—";
  return r.total || "—";
}
```

### 4b. Render sub-ratings in expanded detail

After generating the scorecard table, append a second table:

```js
function renderSubRatings(course) { /* builds the /54, /9, etc. table */ }
```

### 4c. Render course feature sections

After all summary rows are built, render feature sections below the table (or hardcode them in HTML and populate from JS).

---

## Stage 5 — Verification

- Run `npm run build` and verify no errors
- Open `course-ratings.html` in dev server
- Check: hero renders, summary table shows all courses with new Overall Rating column
- Click a course: scorecard + sub-ratings expand
- Scroll below table: feature sections visible with placeholders
- Mobile responsive matches YIR breakpoints

---

## Files to modify (in order)

| Step | File | Change |
|---|---|---|
| 1 | `src/data/course-data.js` | Add `ratings` object + `website`, `description`, `photos` |
| 2 | `course-data.js` | Mirror same additions |
| 3 | `course-ratings.html` | Replace head, add hero, update table columns, add sub-ratings render, add feature sections markup, update inline JS |
| 4 | `src/styles/legacy.css` | Add .cr-ratings-*, .course-feature-* styles |

**Do not modify:** `package.json`, `vite.config.*`, or any unrelated pages.
