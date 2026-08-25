import { courses } from "../data/course-data.js";

const completeCourseKeys = new Set([
  "tyrrellsWood",
  "stewartCreek",
  "silvertip",
  "luffenhamHeath",
  "sauntonEast",
  "sauntonWest",
  "royalOstend",
  "royalZoute",
  "eastBrighton",
  "chobham",
  "hindhead",
  "camberleyHeath",
  "royalStDavids",
  "royalAshdown",
  "swinleyForest",
  "westHill",
  "theGlades",
  "broadstone",
  "hayling",
  "aldeburgh",
  "hollinwell",
  "carbrook",
  "pastures",
  "westSussex",
  "pleasington",
  "byronBay",
  "brookwater",
  "royalQueensland",
]);

const unresolvedCourseKeys = new Set([]);

const failures = [];
const fail = (key, message) => failures.push(`${key}: ${message}`);
const sum = (values, indexes) => indexes.reduce((total, index) => total + values[index], 0);

for (const [key, course] of Object.entries(courses)) {
  if (completeCourseKeys.has(key)) {
    console.log(`COMPLETE: ${key} (${course.name})`);

    if (![9, 18].includes(course.holeCount)) fail(key, "complete factual card must have holeCount 9 or 18");
    if (course.distanceUnit !== "yards") fail(key, 'distanceUnit must be exactly "yards"');
    if (typeof course.teePlayed !== "string" || !course.teePlayed.trim()) fail(key, "teePlayed is missing");
    if (typeof course.courseRating !== "number" || !Number.isFinite(course.courseRating)) fail(key, "courseRating must be numeric");
    if (typeof course.slope !== "number" || !Number.isFinite(course.slope)) fail(key, "slope must be numeric");

    const expectedLength = course.holeCount === 9 ? 10 : 21;
    const holeIndexes = course.holeCount === 9
      ? [0, 1, 2, 3, 4, 5, 6, 7, 8]
      : [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    for (const field of ["distance", "par", "strokeIndex"]) {
      if (!Array.isArray(course[field]) || course[field].length !== expectedLength) {
        fail(key, `${field} must use the ${expectedLength}-position layout`);
      }
    }
    if (![course.distance, course.par, course.strokeIndex].every((values) => Array.isArray(values) && values.length === expectedLength)) continue;

    if (holeIndexes.some((index) => !Number.isInteger(course.distance[index]) || course.distance[index] <= 0)) {
      fail(key, "all 18 hole distances must be positive integers");
    }
    if (holeIndexes.some((index) => !Number.isInteger(course.par[index]) || course.par[index] <= 0)) {
      fail(key, "all 18 hole pars must be positive integers");
    }

    const strokeIndexes = holeIndexes.map((index) => course.strokeIndex[index]);
    if (strokeIndexes.some((value) => !Number.isInteger(value) || value < 1 || value > 18)) {
      fail(key, "stroke indexes must be integers from 1 to 18");
    }
    if (new Set(strokeIndexes).size !== course.holeCount) {
      fail(key, "published stroke indexes must be unique");
    }
    if (course.holeCount === 18 && [...strokeIndexes].sort((a, b) => a - b).some((value, index) => value !== index + 1)) {
      fail(key, "18-hole stroke indexes must contain each integer from 1 to 18 exactly once");
    }
    const aggregateIndexes = course.holeCount === 9 ? [9] : [9, 19, 20];
    if (aggregateIndexes.some((index) => course.strokeIndex[index] !== null)) {
      fail(key, "stroke-index aggregate positions must be null");
    }

    if (course.holeCount === 9) {
      const totalDistance = sum(course.distance, holeIndexes);
      const totalPar = sum(course.par, holeIndexes);
      if (course.distance[9] !== totalDistance) fail(key, `total distance ${course.distance[9]} does not equal ${totalDistance}`);
      if (course.par[9] !== totalPar) fail(key, `total par ${course.par[9]} does not equal ${totalPar}`);
      continue;
    }

    const frontIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const backIndexes = [10, 11, 12, 13, 14, 15, 16, 17, 18];
    const frontDistance = sum(course.distance, frontIndexes);
    const backDistance = sum(course.distance, backIndexes);
    const frontPar = sum(course.par, frontIndexes);
    const backPar = sum(course.par, backIndexes);

    if (course.distance[9] !== frontDistance) fail(key, `front distance ${course.distance[9]} does not equal ${frontDistance}`);
    if (course.distance[19] !== backDistance) fail(key, `back distance ${course.distance[19]} does not equal ${backDistance}`);
    if (course.distance[20] !== frontDistance + backDistance) fail(key, `total distance ${course.distance[20]} does not reconcile`);
    if (course.par[9] !== frontPar) fail(key, `front par ${course.par[9]} does not equal ${frontPar}`);
    if (course.par[19] !== backPar) fail(key, `back par ${course.par[19]} does not equal ${backPar}`);
    if (course.par[20] !== frontPar + backPar) fail(key, `total par ${course.par[20]} does not reconcile`);
  } else if (unresolvedCourseKeys.has(key)) {
    console.log(`UNRESOLVED: ${key} (${course.name})`);

    const hasScorecardValues = [course.distance, course.par, course.strokeIndex].some(
      (values) => Array.isArray(values) && values.some((value) => value !== null),
    );
    if (hasScorecardValues) fail(key, "intentionally unresolved course has partial scorecard values");
  } else {
    fail(key, "course is not classified as complete or intentionally unresolved");
  }
}

for (const key of [...completeCourseKeys, ...unresolvedCourseKeys]) {
  if (!courses[key]) fail(key, "classified course does not exist");
}

const totalCount = Object.keys(courses).length;
const completeCount = Object.keys(courses).filter((key) => completeCourseKeys.has(key)).length;
const unresolvedCount = Object.keys(courses).filter((key) => unresolvedCourseKeys.has(key)).length;

if (totalCount !== 28) failures.push(`dataset: expected 28 total courses; found ${totalCount}`);
if (completeCount !== 28) failures.push(`dataset: expected 28 complete factual courses; found ${completeCount}`);
if (unresolvedCount !== 0) failures.push(`dataset: expected 0 unresolved factual courses; found ${unresolvedCount}`);

console.log("");
console.log(`Total courses: ${totalCount}`);
console.log(`Complete factual courses: ${completeCount}`);
console.log(`Unresolved factual courses: ${unresolvedCount}`);
console.log(`Validation failures: ${failures.length}`);

if (failures.length) {
  console.error("");
  console.error("Factual course-data verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Factual course-data verification passed.");
}
