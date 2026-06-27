# TTO Website — Formatting Audit

Audited: 27 June 2026
Files examined: `index.html`, `about.html`, `leaderboard.html`, `course-ratings.html`, `year-in-review.html`, `shop.html`, `style.css` (root), `src/styles/legacy.css`, `src/style.css`, `src/main.js`

---

## Priority Legend

| Icon | Meaning |
|------|---------|
| 🔴 | **High** — visual breakage or obvious inconsistency to any visitor |
| 🟠 | **Medium** — inconsistency that detracts from premium feel |
| 🟡 | **Low** — nice-to-have polish |

---

## 1. Nav / Header Spacing & Title Consistency 🟠

### 1.1 Nav title mismatch
`about.html:17` uses `"The Tyrells Open – TTO"` while every other page uses `"The Tyrells Open"`. This is the only page with a different nav title.

### 1.2 Homepage lacks CSS `<link>` tag
`index.html:7` loads CSS only via `main.js` (Vite JS import). This risks a flash of unstyled content (FOUC). All other pages have an explicit `<link rel="stylesheet" href="/src/styles/legacy.css" />`.

### 1.3 Nav lacks active-page indicator
No page highlights its own link in the nav. On a 6-page site this is noticeable.

### 1.4 No mobile hamburger menu
The nav list is always visible. On `< 600px` the links become cramped/tiny. All 6 pages affected.

### 1.5 Crest logo size mismatch between CSS files
- `style.css:165` (root): `.crest-logo` = 44px (mobile 36px)
- `legacy.css:165`: `.crest-logo` = 56px (mobile 44px)
The root `style.css` is not loaded by any page, so this is dormant — but it's a sign of drift.

---

## 2. Page Title Hierarchy & Hero Styles 🔴

### 2.1 Three different hero patterns
| Page | Hero class | Eyebrow | Title tag | Subtitle |
|------|-----------|---------|-----------|----------|
| `index.html` | `.hero` / `.hero-title` (p) | — | Homepage hero | hero-subtitle |
| `course-ratings.html` | `.yir-hero` / `.yir-hero-title` (h2) | yes | Course Ratings | yes |
| `year-in-review.html` | `.yir-hero` / `.yir-hero-title` (h2) | yes | Year in Review | yes |
| `shop.html` | `.shop-hero` / `.shop-hero-title` (h2) | yes | Shop | yes |
| `about.html` | None | — | Plain `<h2>About Us</h2>` in main | — |
| `leaderboard.html` | None | — | Plain `<h2>Season Rankings</h2>` in main | — |

**Issues:**
- Course Ratings uses `yir-hero` class (copied from Year in Review). Should have its own or a shared hero class.
- Shop duplicates `yir-hero` styles verbatim under `shop-hero` (same rules, different class name). Unnecessary copy.
- About Us and Leaderboard have **no hero section at all** — they jump straight into `<main>` with a plain `<h2>`.
- Homepage hero uses `<p>` for title; other heroes use `<h2>` — semantic mismatch.
- Homepage has no eyebrow text; the other hero-based pages do.

### 2.2 `h2` styling cascade confusion
`legacy.css` defines `h2` twice:
1. **Line 53**: Generic `margin-top: 25px`, `margin-bottom: 10px`
2. **Line 437**: Override with `font-family: 'Inter'`, `font-weight: 700`, `font-size: 1.1rem`, `letter-spacing: 0.1em`, `text-transform: uppercase`, gold bottom border, `margin-top: 44px`, `margin-bottom: 16px`

The override wins for pages loading `legacy.css`. But about.html's `<h2>About Us</h2>` uses these tight uppercase styles — which clashes with the hero-based title approach on other pages.

---

## 3. Homepage Bottom Cards vs Premium Dark Style 🔴

### 3.1 Homepage cards are old-style
Homepage section cards (`.card-link`, line 66 of `legacy.css`):
- Background: `#14542a` (medium bright green)
- Border-radius: 8px
- Hover: `translateY(-3px)`, shadow change

Shop cards, YIR player cards, and course-ratings panels all use:
- Background: `linear-gradient(135deg, #111811 0%, #0d130d 100%)` (dark near-black green)
- Border-radius: 12px
- Border: `1px solid rgba(255, 255, 255, 0.06)`
- Hover: gold border accent + `translateY(-4px)`

The homepage cards look visually separate from the "premium" rest of the site.

### 3.2 No gold accents on homepage cards
Shop cards have `.shop-card-badge` with gold styling, YIR has gold-accented winner cards. Homepage cards are plain green with no gold accent.

### 3.3 Grid layout mismatch
Homepage `.grid` uses `minmax(180px, 1fr)`. On large screens (1000px container) this gives ~3 columns max. The 5 card links wrap into a 3+2 layout. Consider `minmax(160px, 1fr)` or a different approach for 5 items.

---

## 4. Font Choices 🟠

### 4.1 Google Fonts loading inconsistency
| Page | Inter | Playfair Display |
|------|-------|-----------------|
| `index.html` | No (falls back to system) | No |
| `about.html` | No (falls back to system) | No |
| `leaderboard.html` | Yes | No |
| `course-ratings.html` | Yes | Yes |
| `year-in-review.html` | Yes | Yes |
| `shop.html` | Yes | Yes |

Only leaderboard, course-ratings, YIR, and shop load Inter via Google Fonts. The homepage and About Us rely on the system-ui fallback in `legacy.css:431` (`font-family: 'Inter', system-ui, ...`). If Inter hasn't loaded, they fall back gracefully — but there's a visible font mismatch on first paint.

### 4.2 Playfair Display used selectively
Playfair Display is used for hero titles on course-ratings, YIR, and shop, and for `.cr-ratings-caption` and `.course-feature-name`. The homepage hero uses `.hero-title` with no Playfair — it uses `font-weight: 800` in the system font stack. This makes the homepage hero feel typographically different.

### 4.3 Body font declared twice
`legacy.css:3-7` sets `font-family: system-ui, ...` then `legacy.css:429-433` overrides with `font-family: 'Inter', system-ui, ...`. The override wins, but it means the body is set twice.

---

## 5. Buttons & Links 🟠

### 5.1 Hero buttons vs page buttons
- Homepage hero: `.btn` / `.btn-primary` / `.btn-outline` (classes)
- YIR footer link: `.yir-lb-link` (gold border, uppercase)
- Course Ratings: `.course-feature-link` (gold border, uppercase — identical to `.yir-lb-link`)
- No shared button component across the site.

### 5.2 YIR link on leaderboard headings
`.yir-link` (gold filled badge, inline) is a one-off style only used on leaderboard `<h2>` year headings.

### 5.3 Link hover styles inconsistent
Nav links use `text-decoration: underline` on hover. All other styled links use background/border colour transitions.

---

## 6. Cards, Tables & Borders 🔴

### 6.1 Table style override cascade
In `legacy.css`:
- First declaration (line 112-119): `background: #14542a`, `border-radius: 8px`, `overflow: hidden`
- Second declaration (line 464-470): `background: #111811`, `border: 1px solid rgba(255,255,255,0.06)`, `border-radius: 10px`

The second (more specific rules about `table`) takes precedence. This means tables look dark/premium, which is good — but the earlier dead code should be cleaned up.

### 6.2 About Us member cards are old-style
`.member-row` uses `background: #14542a` (medium green, line 182). This doesn't match the dark premium style of shop/YIR cards. The member cards should use the dark `#111811` gradient with gold accents.

### 6.3 Course ratings table hover state
`#course-summary-body tr.details-toggle.selected td` has gold background tint — good. But unselected rows use the default table hover (`.details-toggle:hover` at line 489) which is subtle. The selected state colour change is nice, but there's no hover cursor indicator on the summary table rows (though `summaryRow.style.cursor = "pointer"` is set inline in JS).

### 6.4 Shop cards missing hover gold border
`.shop-card` has a hover effect (`border-color: rgba(201,168,76,0.15)`) and YIR player cards also have hover border changes. But homepage `.card-link` doesn't use gold accents on hover — only a green-on-green lift.

---

## 7. Mobile Responsiveness 🟠

### 7.1 No nav hamburger/collapse
At `< 600px` the nav links become small and the layout wraps. With 6 links, they either wrap to multiple lines or get squished. No hamburger menu exists.

### 7.2 Inconsistent mobile hero heights
- Homepage: `min-height: 90vh` (desktop), `80vh` (mobile)
- YIR/CR/Shop: `min-height: 40vh` (desktop), `30vh` (mobile)
- About Us / Leaderboard: no hero

### 7.3 Single breakpoint
All responsive rules use `@media (max-width: 600px)`. There's no tablet breakpoint. Cards/grids jump directly from desktop layout to mobile.

### 7.4 Homepage grid on mobile
`minmax(180px, 1fr)` on a < 600px screen gives 1 column, which is fine — but the `gap: 20px` and `padding: 20px` mean cards take full width with generous spacing, which works.

### 7.5 Leaderboard tables on mobile
At `< 600px`, leaderboard tables have `padding: 8px 6px` and `font-size: 0.76rem`. This makes the wide tables (up to 8 columns) very tight. The round-toggle buttons stack vertically, which helps, but the table columns are still numerous.

### 7.6 YIR tabs on mobile
`.yir-tab` padding reduces from `10px 22px` to `8px 16px`. Font goes from `0.85rem` to `0.78rem`. This is fine, but with many years the tabs could wrap to 2+ rows.

---

## 8. Duplicate / Dead Code 🟡

### 8.1 Root `style.css` is unused
No HTML page links to `style.css` at the root. It's a copy of the original styles before the YIR premium redesign. All styles come from `legacy.css`. This file should be removed once confirmed unused.

### 8.2 `src/style.css` is Vite default boilerplate
The Vite-generated default `src/style.css` is unused by any page.

### 8.3 `.shop-hero-*` duplicates `.yir-hero-*`
The shop hero styles (lines 1371-1419 in legacy.css) are identical in structure to the YIR hero styles (lines 708-756). The only difference is class names. Should share a common hero class.

### 8.4 `.course-feature-link` duplicates `.yir-lb-link`
Same gold-bordered link pattern, same values, different class name.

### 8.5 First `body` declaration is overwritten
`legacy.css` lines 2-8 declare body then lines 429-434 re-declare it with the Inter font. The first block is dead code.

### 8.6 First `h2` declaration is overwritten
Lines 53-56 declare `h2`, then lines 437-448 override it completely.

### 8.7 First `table` declaration is overwritten
Lines 112-119 declare `table`, then lines 464-470 override it.

### 8.8 First `th, td` declaration is overwritten
Lines 121-126 declare `th, td`, then lines 472-477 override.

---

## 9. Semantic / HTML Issues 🟡

### 9.1 Homepage hero uses `<p>` for title
`.hero-title` is a `<p>` tag for what should semantically be an `<h1>` (or at least the page's primary heading). The nav also has an `<h1>`.

### 9.2 Multiple `<h1>` elements
The nav `<h1>` appears on every page. The hero on the homepage has a `<p>` acting as a title. On semantic grounds each page should have exactly one `<h1>`.

### 9.3 `about.html` missing viewport meta tag
Line 5 of about.html lacks `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`. This means it won't render properly on mobile.

### 9.4 Inline JS in course-ratings.html
Lines 59-296 contain a large inline `<script>` block. This should be extracted to a module for consistency with the rest of the site which uses `src/main.js`.

---

## 10. Staged Implementation Plan

### Phase 1 — Foundation (safe, no visual change)
| Step | Action | Risk |
|------|--------|------|
| 1.1 | Add viewport meta tag to `about.html` | None |
| 1.2 | Remove dead CSS: first `body`, `h2`, `table`, `th,td` declarations from `legacy.css` | Low |
| 1.3 | Remove root `style.css` (confirm unused) | Low |
| 1.4 | Remove `src/style.css` (Vite boilerplate) | None |
| 1.5 | Extract inline JS from `course-ratings.html` into a module file | Medium — test JS behaviour |

### Phase 2 — Homogenise Nav & Typography
| Step | Action | Risk |
|------|--------|------|
| 2.1 | Fix nav title: change `about.html` to match "The Tyrells Open" | None |
| 2.2 | Add explicit `<link href="...">` for legacy.css to `index.html` | Low — avoids FOUC |
| 2.3 | Load Google Fonts (Inter) consistently on all 6 pages | Low |
| 2.4 | Load Playfair Display on pages that use serif titles | Low |
| 2.5 | Add active-page class to nav via JS | Low |

### Phase 3 — Bring Homepage Cards to Premium Style
| Step | Action | Risk |
|------|--------|------|
| 3.1 | Update `.card-link` to use dark gradient (`#111811` / `#0d130d`) | Medium — visual change |
| 3.2 | Add border and gold-accent hover to `.card-link` | Low |
| 3.3 | Update grid column sizing for 5-card layout | Low |
| 3.4 | Add gold-bottom-border accent to `.card-link h3` | Low |

### Phase 4 — Unify Hero Sections
| Step | Action | Risk |
|------|--------|------|
| 4.1 | Create shared `.page-hero` class, replace `.yir-hero` and `.shop-hero` | Low — refactor only |
| 4.2 | Add hero sections to About Us and Leaderboard, matching the YIR/Shop pattern | Medium — new content |
| 4.3 | Homepage hero: consider adding eyebrow text for consistency | Low |
| 4.4 | Use `<h1>` or `<h2>` consistently across all heroes | Low |

### Phase 5 — Consistent Cards & Components
| Step | Action | Risk |
|------|--------|------|
| 5.1 | Update `.member-row` (About Us) to use dark gradient + 12px radius | Low |
| 5.2 | Create shared `.btn` variants for gold-outline links to replace `.yir-lb-link` and `.course-feature-link` | Low |
| 5.3 | Move shared colours (gold `#c9a84c`, dark bg `#111811`, etc.) to CSS custom properties | Low |
| 5.4 | Ensure all cards have consistent border-radius (12px), hover transitions, and gold accents | Low |

### Phase 6 — Mobile Responsiveness
| Step | Action | Risk |
|------|--------|------|
| 6.1 | Implement hamburger/collapsible nav for `< 768px` | Medium — JS needed |
| 6.2 | Add tablet breakpoint at 768px for grids | Low |
| 6.3 | Review leaderboard tables at mobile — consider horizontal scroll or column hiding | Medium |
| 6.4 | Standardise hero `min-height` across all pages (40vh desktop, 30vh mobile for subpages) | Low |
