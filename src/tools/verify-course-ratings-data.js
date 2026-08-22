import { courses } from "../data/course-data.js";

const facilityKeys = [
  "locationEaseOfAccess",
  "valueForMoney",
  "postRoundVibes",
  "clubhouse",
  "golfFacilities",
  "courseMap",
];
const allowedHoleRatings = new Set([-1, 0, 1, 2, 3]);
const workbookCourseKeys = [
  "broadstone", "hayling", "aldeburgh", "tyrrellsWood", "luffenhamHeath",
  "sauntonEast", "sauntonWest", "royalOstend", "royalZoute", "westSussex",
  "eastBrighton", "chobham", "hindhead", "camberleyHeath", "royalStDavids",
  "royalAshdown", "westHill", "swinleyForest", "pleasington", "carbrook",
  "theGlades", "byronBay", "brookwater", "royalQueensland", "hollinwell",
  "pastures",
];
const addedCourseKeys = ["broadstone", "hayling", "aldeburgh", "hollinwell", "pastures"];
const requiredUnratedKeys = ["royalZoute", "stewartCreek", "silvertip"];
const expectedScores = {
  broadstone: [34, 32, 66], hayling: [35, 34, 69], aldeburgh: [33, 22, 55],
  tyrrellsWood: [29, 31, 60], luffenhamHeath: [30, 33, 63],
  sauntonEast: [37, 31, 68], sauntonWest: [28, 31, 59], royalOstend: [20, 34, 54],
  westSussex: [39, 26, 65], eastBrighton: [7, 19, 26], chobham: [6, 22, 28],
  hindhead: [34, 29, 63], camberleyHeath: [32, 28, 60], royalStDavids: [26, 36, 62],
  royalAshdown: [33, 28, 61], westHill: [39, 31, 70], swinleyForest: [36, 32, 68],
  pleasington: [33, 30, 63], carbrook: [7, 24, 31], theGlades: [30, 26, 56],
  byronBay: [30, 31, 61], brookwater: [43, 39, 82], royalQueensland: [40, 31, 71],
  hollinwell: [47, 36, 83], pastures: [14, 26, 40],
};

const failures = [];
const fail = (message) => failures.push(message);

if (Object.keys(courses).length !== 28) fail(`Expected 28 website courses; found ${Object.keys(courses).length}.`);

for (const key of workbookCourseKeys) {
  if (!courses[key]) fail(`Workbook course is missing: ${key}.`);
}
for (const key of addedCourseKeys) {
  if (!courses[key]) fail(`Required workbook-only course was not added: ${key}.`);
}

for (const [key, course] of Object.entries(courses)) {
  const ratings = course.ratings;
  if (![9, 18].includes(course.holeCount)) fail(`${key}: holeCount must be 9 or 18.`);
  if (!ratings || !["rated", "unrated"].includes(ratings.status)) {
    fail(`${key}: ratings.status must be rated or unrated.`);
    continue;
  }
  if (!Array.isArray(ratings.holeTierRatings)) fail(`${key}: holeTierRatings must be an array.`);
  if (!ratings.facilityRatings) {
    fail(`${key}: facilityRatings is missing.`);
    continue;
  }

  const values = facilityKeys.map((facilityKey) => ratings.facilityRatings[facilityKey]);
  if (ratings.status === "unrated") {
    if (ratings.holeTierRatings.length !== 0) fail(`${key}: unrated course has hole ratings.`);
    if (values.some((value) => value !== null)) fail(`${key}: unrated course has a non-null facility rating.`);
    continue;
  }

  if (ratings.holeTierRatings.length !== course.holeCount) {
    fail(`${key}: expected ${course.holeCount} hole ratings; found ${ratings.holeTierRatings.length}.`);
  }
  ratings.holeTierRatings.forEach((value, index) => {
    if (!allowedHoleRatings.has(value)) fail(`${key}: invalid hole ${index + 1} rating ${value}.`);
  });
  values.slice(0, 5).forEach((value, index) => {
    if (!Number.isInteger(value) || value < 0 || value > 9) {
      fail(`${key}: ${facilityKeys[index]} must be an integer from 0 to 9.`);
    }
  });
  if (!Number.isInteger(values[5]) || values[5] < 0 || values[5] > 1) {
    fail(`${key}: courseMap must be 0 or 1.`);
  }

  const holeScore = ratings.holeTierRatings.reduce((sum, value) => sum + value, 0);
  const facilityScore = values.reduce((sum, value) => sum + value, 0);
  const overallScore = holeScore + facilityScore;
  const holeMaximum = course.holeCount * 3;
  const overallMaximum = holeMaximum + 46;
  if ((course.holeCount === 18 && (holeMaximum !== 54 || overallMaximum !== 100)) ||
      (course.holeCount === 9 && (holeMaximum !== 27 || overallMaximum !== 73))) {
    fail(`${key}: incorrect derived maxima ${holeMaximum}/46/${overallMaximum}.`);
  }
  const expected = expectedScores[key];
  if (!expected) fail(`${key}: rated course has no authoritative expected totals.`);
  else if ([holeScore, facilityScore, overallScore].some((value, index) => value !== expected[index])) {
    fail(`${key}: calculated ${holeScore}/${facilityScore}/${overallScore}; expected ${expected.join("/")}.`);
  }
}

for (const key of requiredUnratedKeys) {
  if (courses[key]?.ratings.status !== "unrated") fail(`${key}: must remain explicitly unrated.`);
}
if (courses.royalZoute?.ratings.facilityRatings.courseMap !== null) {
  fail("royalZoute: workbook formula zero must not be treated as a rating.");
}
if (courses.pastures?.holeCount !== 9) fail("pastures: must be a 9-hole course.");

const ratedCount = Object.values(courses).filter((course) => course.ratings.status === "rated").length;
const unratedCount = Object.keys(courses).length - ratedCount;

if (failures.length) {
  console.error(`Course Ratings verification failed: ${failures.length} failure(s).`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Course Ratings verification passed.");
  console.log(`28 website courses: ${ratedCount} rated, ${unratedCount} unrated.`);
  console.log("26 authoritative workbook courses represented; 5 workbook-only courses added.");
  console.log("Derived systems verified: 18 holes /54 + /46 = /100; 9 holes /27 + /46 = /73.");
}
