console.log('Agent test patch');
console.log('Agent test patch');
import './styles/legacy.css';

import { courses, holeLabels, getHoleLabels, getCourseData, getAllCourses } from './data/course-data.js';

window.courses = courses;
window.holeLabels = holeLabels;
window.getHoleLabels = getHoleLabels;
window.getCourseData = getCourseData;
window.getAllCourses = getAllCourses;

import { getPlayerHandicap, getPlayerHandicapIndex } from './data/handicap-data.js';

window.getPlayerHandicap = getPlayerHandicap;
window.getPlayerHandicapIndex = getPlayerHandicapIndex;

import { leaderboardData } from './data/leaderboard-data.js';
import { players } from './data/player-data.js';

import './legacy-script.js';

// Active navigation indicator
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Link leaderboard member names to their stable player profiles without
// changing the table data or its score calculation behaviour.
if (currentPage === 'leaderboard.html') {
  const playerIdsByName = new Map(players.map(({ id, displayName }) => [displayName, id]));
  document.querySelectorAll('table tbody td').forEach((cell) => {
    const playerId = playerIdsByName.get(cell.textContent.trim());
    if (!playerId || cell.querySelector('a')) return;
    const link = document.createElement('a');
    link.className = 'leaderboard-player-link';
    link.href = `about.html?player=${playerId}`;
    link.textContent = cell.textContent.trim();
    link.addEventListener('click', (event) => event.stopPropagation());
    cell.replaceChildren(link);
  });
}
document.querySelectorAll('nav ul li a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

// Homepage stats strip
const statYears = document.getElementById('stat-years');
const statCourses = document.getElementById('stat-courses');
const statPlayers = document.getElementById('stat-players');

if (statYears && leaderboardData) {
  const yearCount = Object.keys(leaderboardData.years).length;
  const courseCount = Object.keys(courses).length;
  const playerCount = Object.keys(leaderboardData.players).length;
  statYears.textContent = yearCount;
  statCourses.textContent = courseCount;
  statPlayers.textContent = playerCount;
}

// Mobile hamburger toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('nav ul');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isOpen);
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
    });
  });
}
