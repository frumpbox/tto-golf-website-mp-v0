console.log('Agent test patch');
console.log('Agent test patch');
import './styles/legacy.css';

import { courses, holeLabels, getCourseData, getAllCourses } from './data/course-data.js';

window.courses = courses;
window.holeLabels = holeLabels;
window.getCourseData = getCourseData;
window.getAllCourses = getAllCourses;

import { getPlayerHandicap, getPlayerHandicapIndex } from './data/handicap-data.js';

window.getPlayerHandicap = getPlayerHandicap;
window.getPlayerHandicapIndex = getPlayerHandicapIndex;

import { leaderboardData } from './data/leaderboard-data.js';

import './legacy-script.js';

// Active navigation indicator
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
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

