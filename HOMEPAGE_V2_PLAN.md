# HOMEPAGE V2 — Premium Golf Brand Redesign Plan

**Inspired by:** Royal Queensland Golf Club (heritage, crest, dark green + gold)  
**Inspired by:** No Laying Up (bold editorial typography, minimal layouts, streetwear energy)  
**Target identity:** "The Tyrells Open — a modern amateur major"

---

## 1. Colour Palette

| Role | Hex | Notes |
|------|-----|-------|
| Primary background | `#0a1c10` | Deeper, richer green than current `#0b3b1a` |
| Secondary / card bg | `#0f2a16` | Subtle layered green |
| Accent gold | `#c9a84c` | Warm metallic — crest highlights, hover states, borders |
| Text primary | `#f0f0ea` | Warm white (not pure `#fff`) |
| Text muted | `#a8b3a0` | Subdued green-grey |
| Dark surface | `#060f08` | Off-black for hero overlays |
| Cream highlight | `#e8e0d0` | Accent backgrounds or pull quotes |

---

## 2. Typography

### Headings
- **Font:** Playfair Display (serif) — heritage, weight, elegance  
- **Weights:** 600–900, italic for flair  
- **Scale:** `clamp()` for fluid responsive sizing  

### Body & UI
- **Font:** Inter (sans-serif) — clean, modern, NLU-style  
- **Weights:** 300–600  
- **Fallback:** system-ui stack  

### Implementation
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&display=swap" rel="stylesheet" />
```

---

## 3. Hero Section

Full viewport, dark atmospheric background with a subtle pattern or gradient overlay.

**Structure:**
```
┌─────────────────────────────────┐
│  [nav]                          │
│                                 │
│        CREST (large)            │
│                                 │
│   "The Tyrells Open"            │  ← Playfair Display, 4–5rem
│   tagline / year                │  ← Inter, letter-spaced, gold
│                                 │
│   [Learn More] [Leaderboard]    │  ← outlined + filled CTA buttons
│                                 │
│  ───── scroll indicator ─────   │
└─────────────────────────────────┘
```

- Full-viewport height (`100vh` or `100dvh`)
- Gradient overlay (black → transparent) over background
- Hero can use a CSS gradient pattern (no image dependency): dark green radial vignette + subtle grid/texture
- Or use an actual image of a course (Tyrells Wood?) with dark overlay

---

## 4. Navigation

Premium refinements to the current nav:

- **Left:** Crest (small, ~40px) + "The Tyrells Open" wordmark
- **Right:** Navigation links
- Active page indicator: subtle gold underline
- Background: `rgba(6, 15, 8, 0.85)` with backdrop blur `blur(12px)`
- Sticky / fixed top
- **Mobile:** Hamburger → fullscreen overlay menu with large type

---

## 5. Crest / Logo Treatment

Current is a placeholder `[insert TTO crest]`. Recommendations:

- **SVG crest** — shield shape, TTO monogram, golf motif (flag, crossed clubs, or diamond)
- **Colours:** dark green `#0a1c10`, gold `#c9a84c`, cream `#e8e0d0`
- **Bordered** like current but with gold stroke
- **Responsive** — show crest + wordmark on desktop, crest-only on mobile
- Could commission or use a monogram style if SVG isn't available

Fallback while awaiting crest: stylised TTO monogram in Playfair Display with gold border.

---

## 6. Card Section (Current Grid)

Replace the basic cards with editorial-style panels:

- **Background:** `#0f2a16` with subtle top gold border (2px)
- **Hover:** translateY(-6px), gold border glow, smooth 0.3s ease
- **Icons or small illustrations** above each heading
- **Font:** Playfair Display for heading, Inter for description
- **Layout:** 2×2 grid on desktop → 1 column on mobile

Remove `box-shadow` — use layered depth instead (light border + subtle gradient).

---

## 7. Spacing & Layout

| Element | Desktop | Mobile |
|---------|---------|--------|
| Side padding | `6vw` | `1.5rem` |
| Section gap | `6rem` | `3rem` |
| Card padding | `2.5rem` | `1.5rem` |
| Hero bottom margin | `8rem` | `4rem` |

- Use `max-width: 1200px` for content (currently 1000px — tighter than ideal)
- Section max-width can be wider at `1280px`

---

## 8. Homepage Structure (Full)

```
1. NAV — sticky, transparent → solid on scroll
2. HERO — full viewport, crest, title, tagline, CTAs
3. ABOUT SNIPPET — 1–2 sentences about TTO + link to /about
4. FEATURED SECTIONS (current grid, upgraded)
   - About Us
   - Leaderboard & History
   - Course Ratings
   - Shop
5. LATEST / HIGHLIGHT — featured content (current champ, next event)
6. FOOTER — simple, crest + copyright
```

---

## 9. Responsiveness

| Breakpoint | Changes |
|------------|---------|
| < 480px | Single column cards, smaller hero type, hamburger nav |
| 480–768px | 2-column cards, medium hero |
| 768–1024px | Full 4-column cards, large hero |
| 1024px+ | Max-width container, generous spacing |

- Use `clamp()` for typography: `clamp(2.5rem, 5vw, 5rem)` for hero title
- Nav: hamburger `< 768px`, full menu `>= 768px`
- Hero: reduce vertical padding on mobile
- Touch targets: minimum 44px

---

## 10. Animations & Interactions

| Element | Animation |
|---------|-----------|
| Hero title | Fade-in + translateY on load (CSS @keyframes) |
| Cards | Stagger fade-in on scroll (Intersection Observer) |
| Nav background | Transition from transparent to solid on scroll |
| CTA buttons | Gold border fill on hover |
| Crest | Subtle rotation or glow on hover |
| Page transitions | Optional opacity fade between pages |

- All animations should be `prefers-reduced-motion: reduce` safe

---

## 11. Implementation Order

1. Add Google Fonts (Playfair Display + Inter) to `index.html`
2. Update colour variables in `style.css` (or add `:root` custom properties)
3. Redesign nav — sticky, backdrop blur, active states
4. Build hero section
5. Upgrade card grid with new styling
6. Add scroll-based nav background transition
7. Refine spacing and responsive breakpoints
8. Add crest SVG or styled monogram fallback
9. Test `npm run build`

---

## 12. Reference Links

- Royal Queensland GC: https://www.rqgc.com.au/ (dark green, gold accents, crest-driven)
- No Laying Up: https://nolayingup.com/ (bold serif headers, minimal, editorial)
- Inspiration: Strapped / Tourist Sauce series titles (sans-serif UI, serif headlines)
