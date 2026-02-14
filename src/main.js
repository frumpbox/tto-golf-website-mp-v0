console.log('Agent test patch');
import './styles/legacy.css';

import { courses, holeLabels, getCourseData, getAllCourses } from './data/course-data.js';

window.courses = courses;
window.holeLabels = holeLabels;
window.getCourseData = getCourseData;
window.getAllCourses = getAllCourses;

import './legacy-script.js';

