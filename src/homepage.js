import { leaderboardData } from './data/leaderboard-data.js';
import { courses } from './data/course-data.js';

// Read the same resolved sources as the existing site; never calculate or mutate results.
const counts = { years: Object.keys(leaderboardData.years).length, courses: Object.keys(courses).length, players: Object.keys(leaderboardData.players).length };
for (const [key, value] of Object.entries(counts)) {
  document.querySelector(`[data-count="${key}"]`).textContent = value;
}
const results = [...leaderboardData.years[2026].results].sort((a, b) => a.position - b.position);
const tbody = document.getElementById('latest-results');
const value = (number) => number == null ? '–' : String(number);
const fragment = document.createDocumentFragment();
for (const result of results) {
  const tr = document.createElement('tr');
  const pos = document.createElement('td');
  pos.textContent = result.position == null ? '–' : String(result.position).padStart(2, '0');
  const name = document.createElement('th');
  name.scope = 'row';
  const link = document.createElement('a');
  link.href = `about.html?player=${result.playerId}`;
  link.textContent = leaderboardData.players[result.playerId].displayName;
  name.append(link);
  if (result.position === 1) {
    const label = document.createElement('small');
    label.textContent = 'Champion';
    name.append(label);
  }
  tr.append(pos, name);
  for (const points of [result.rounds[0].stablefordPoints, result.rounds[1].stablefordPoints, result.points]) {
    const cell = document.createElement('td');
    cell.textContent = value(points);
    tr.append(cell);
  }
  fragment.append(tr);
}
tbody.replaceChildren(fragment);
document.getElementById('champion-points').textContent = value(results[0].points);

const masthead = document.querySelector('.masthead');
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('primary-menu');
const mobile = matchMedia('(max-width: 700px)');
function setMenu(open, returnFocus = false) {
  toggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
  masthead.classList.toggle('menu-open', open);
  if (returnFocus) toggle.focus();
}
function syncMenu() {
  setMenu(false);
  toggle.hidden = !mobile.matches;
}
masthead.classList.add('menu-enabled');
syncMenu();
mobile.addEventListener('change', syncMenu);
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', (event) => {
  if (!masthead.contains(event.target)) setMenu(false);
});
masthead.addEventListener('focusout', () => {
  requestAnimationFrame(() => { if (!masthead.contains(document.activeElement)) setMenu(false); });
});

// Only animate position, once per section; all content remains visible without JS.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('journal-arrival');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.latest-grid, .story-intro, .archive-grid, .courses-grid, .field-grid').forEach((section) => observer.observe(section));
}
