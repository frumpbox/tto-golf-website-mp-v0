import { leaderboardData } from '../data/leaderboard-data.js';

function calculateCourseHandicap(handicapIndex, slope, courseRating, par) {
  const slopeFactor = slope / 113;
  return Math.round(handicapIndex * slopeFactor + (courseRating - par));
}

function computeRoundPoints(grossScores, courseData, courseHandicap) {
  let totalPoints = 0;
  if (grossScores === null) return 0;
  for (let h = 0; h < 18; h++) {
    const idx = h < 9 ? h : h + 1;
    const strokeIndex = courseData.strokeIndex[idx];
    const parValue = courseData.par[idx];
    const gross = grossScores[h];
    if (gross == null || strokeIndex == null || parValue == null) continue;
    const baseShots = Math.floor(courseHandicap / 18);
    const extraShots = courseHandicap % 18;
    const shotsReceived = baseShots + (strokeIndex <= extraShots ? 1 : 0);
    const netScore = gross - shotsReceived;
    const diff = netScore - parValue;
    let points = 0;
    if (diff <= -3) points = 5;
    else if (diff === -2) points = 4;
    else if (diff === -1) points = 3;
    else if (diff === 0) points = 2;
    else if (diff === 1) points = 1;
    else points = 0;
    totalPoints += points;
  }
  return totalPoints;
}

const failures = [];

// ----------------------------------------------------------------
// 2025 verification
// ----------------------------------------------------------------
const year2025 = leaderboardData.years[2025];

if (!year2025) failures.push("2025 year missing");
if (year2025.location !== "Belgium") failures.push("2025 location mismatch");
if (year2025.courseKeys.length !== 2) failures.push("2025 should have 2 courseKeys");
if (year2025.results.length !== 6) failures.push("2025 should have 6 results, got " + year2025.results.length);
if (year2025.status !== "completed") failures.push("2025 status should be completed");
if (!year2025.summary) failures.push("2025 summary missing");
if (!year2025.summary.winner) failures.push("2025 summary.winner missing");
if (!year2025.summary.runnerUp) failures.push("2025 summary.runnerUp missing");

const expectedPlayers = ["sam-lewis", "sam-dynes", "james-hall", "george-stinton", "felipe-milo", "tom-sutehall"];
for (const pid of expectedPlayers) {
  if (!leaderboardData.players[pid]) failures.push(`Player ${pid} missing from registry`);
  if (!leaderboardData.years[2025].attendees.includes(pid)) failures.push(`Player ${pid} missing from 2025 attendees`);
}

const allExpectedPlayers = ["sam-lewis", "sam-dynes", "james-hall", "george-stinton", "felipe-milo", "tom-sutehall"];
for (const pid of allExpectedPlayers) {
  if (!leaderboardData.players[pid]) failures.push(`Player ${pid} missing from registry`);
}

if (!leaderboardData.yearOrder.includes(2025)) failures.push("2025 not in yearOrder");

const courseKeys = ["tyrellsWood", "silvertip", "stewartCreek", "luffenhamHeath", "sauntonEast", "sauntonWest", "royalOstend", "royalZoute"];
for (const key of courseKeys) {
  if (!leaderboardData.courses[key]) failures.push(`Course ${key} missing`);
}

for (const result of year2025.results) {
  if (!result.playerId) failures.push("Result missing playerId");
  if (!Array.isArray(result.rounds)) failures.push(`${result.playerId} missing rounds array`);
  if (result.rounds.length !== 2) failures.push(`${result.playerId} should have 2 rounds`);

  let yearTotal = 0;
  result.rounds.forEach((round, rIdx) => {
    if (!round.courseKey) failures.push(`${result.playerId} round ${rIdx + 1} missing courseKey`);
    if (round.gross !== null) failures.push(`${result.playerId} round ${rIdx + 1} gross should be null`);
    if (round.gross == null) return;
    const courseData = leaderboardData.courses[round.courseKey];
    if (!courseData) {
      failures.push(`${result.playerId} round ${rIdx + 1}: unknown course ${round.courseKey}`);
      return;
    }
    const parTotal = courseData.par[courseData.par.length - 1];
    const courseHcp = calculateCourseHandicap(
      result.handicapIndex, courseData.slope, courseData.courseRating, parTotal
    );
    const roundPts = computeRoundPoints(round.gross, courseData, courseHcp);
    yearTotal += roundPts;
  });

  if (yearTotal !== 0) {
    failures.push(`${result.playerId} 2025: expected 0 total points (all null gross), got ${yearTotal}`);
  }
}

// ----------------------------------------------------------------
// 2020 verification
// ----------------------------------------------------------------
const year2020 = leaderboardData.years[2020];

if (!year2020) failures.push("2020 year missing");
if (year2020.location !== "England") failures.push("2020 location mismatch");
if (year2020.courseKeys.length !== 2) failures.push("2020 should have 2 courseKeys");
if (year2020.courseKeys[0] !== "tyrellsWood" || year2020.courseKeys[1] !== "tyrellsWood") {
  failures.push("2020 both rounds should be tyrellsWood");
}
if (year2020.results.length !== 5) failures.push("2020 should have 5 results, got " + year2020.results.length);
if (year2020.status !== "completed") failures.push("2020 status should be completed");
if (!year2020.summary) failures.push("2020 summary missing");
if (!year2020.summary.winner) failures.push("2020 summary.winner missing");
if (!year2020.summary.runnerUp) failures.push("2020 summary.runnerUp missing");
if (year2020.summary.winner !== "sam-lewis") failures.push("2020 winner should be sam-lewis");
if (year2020.summary.runnerUp !== "james-hall") failures.push("2020 runnerUp should be james-hall");

const expected2020Players = ["sam-lewis", "james-hall", "felipe-milo", "george-stinton", "sam-dynes"];
for (const pid of expected2020Players) {
  if (!leaderboardData.years[2020].attendees.includes(pid)) failures.push(`Player ${pid} missing from 2020 attendees`);
}

if (!leaderboardData.yearOrder.includes(2020)) failures.push("2020 not in yearOrder");

// 2020 computed Stableford verification against legacy
const EXPECTED_2020_TOTALS = {
  "sam-lewis":   { r1: 37, r2: 39, total: 76 },
  "james-hall":  { r1: 39, r2: 37, total: 76 },
  "felipe-milo": { r1: 35, r2: 29, total: 64 },
  "george-stinton": { r1: 0, r2: 0, total: 0 },
  "sam-dynes":   { r1: 0, r2: 0, total: 0 },
};

const course2020 = leaderboardData.courses.tyrellsWood;

for (const result of year2020.results) {
  if (!result.playerId) failures.push("2020 result missing playerId");
  if (!Array.isArray(result.rounds)) failures.push(`2020 ${result.playerId} missing rounds array`);
  if (result.rounds.length !== 2) failures.push(`2020 ${result.playerId} should have 2 rounds`);

  let computedTotal = 0;
  result.rounds.forEach((round, rIdx) => {
    if (!round.courseKey) failures.push(`2020 ${result.playerId} round ${rIdx + 1} missing courseKey`);
    const parTotal = course2020.par[course2020.par.length - 1];
    const courseHcp = calculateCourseHandicap(
      result.handicapIndex, course2020.slope, course2020.courseRating, parTotal
    );
    const roundPts = computeRoundPoints(round.gross, course2020, courseHcp);
    computedTotal += roundPts;
  });

  const expected = EXPECTED_2020_TOTALS[result.playerId];
  if (!expected) {
    failures.push(`2020 ${result.playerId}: no expected values defined`);
    continue;
  }
  if (computedTotal !== expected.total) {
    failures.push(`2020 ${result.playerId}: expected ${expected.total} total points, got ${computedTotal}`);
  }
}

// Verify playoff data
const samLewis = year2020.results.find(r => r.playerId === "sam-lewis");
const jamesHall = year2020.results.find(r => r.playerId === "james-hall");

if (!samLewis) failures.push("2020 sam-lewis result missing");
if (!jamesHall) failures.push("2020 james-hall result missing");

if (samLewis) {
  if (!samLewis.playoff) failures.push("2020 sam-lewis should have playoff data");
  else {
    if (samLewis.playoff.type !== "sudden-death") failures.push("2020 sam-lewis playoff type should be sudden-death");
    if (!Array.isArray(samLewis.playoff.holes)) failures.push("2020 sam-lewis playoff holes should be an array");
    if (samLewis.playoff.holes.length !== 2) failures.push("2020 sam-lewis playoff should have 2 holes");
    if (samLewis.playoff.holes[0] !== 18) failures.push("2020 sam-lewis playoff first hole should be 18");
    if (samLewis.playoff.holes[1] !== 10) failures.push("2020 sam-lewis playoff second hole should be 10");
    if (samLewis.playoff.winner !== "sam-lewis") failures.push("2020 sam-lewis playoff.winner should be sam-lewis");
  }
}

if (jamesHall) {
  if (!jamesHall.playoff) failures.push("2020 james-hall should have playoff data (as loser)");
  else {
    if (jamesHall.playoff.type !== "sudden-death") failures.push("2020 james-hall playoff type should be sudden-death");
    if (jamesHall.playoff.loser !== "james-hall") failures.push("2020 james-hall playoff.loser should be james-hall");
  }
}

// Summary
if (failures.length > 0) {
  console.error("\n  VERIFICATION FAILURES:");
  for (const f of failures) {
    console.error("    ✗ " + f);
  }
  process.exit(1);
} else {
  const y2025 = leaderboardData.years[2025];
  const y2020 = leaderboardData.years[2020];
  console.log("\n  ✅ All leaderboard data verified successfully.");
  console.log("     Players in registry: " + Object.keys(leaderboardData.players).length);
  console.log("     Courses imported:    " + Object.keys(leaderboardData.courses).length);
  console.log("     Year order:          " + leaderboardData.yearOrder.join(", "));
  console.log("     2025 results:        " + y2025.results.length + " players (all null gross)");
  console.log("     2025 summary:        winner=" + y2025.summary.winner + ", runnerUp=" + y2025.summary.runnerUp);
  console.log("     2020 results:        " + y2020.results.length + " players");
  console.log("     2020 Stableford:     sam-lewis=76 (playoff), james-hall=76 (runnerUp), felipe-milo=64, george-stinton=0, sam-dynes=0");
  console.log("     2020 playoff:        sam-lewis def. james-hall on hole 10 (SD: 18 -> 10)");
  console.log("     2020 summary:        winner=" + y2020.summary.winner + ", runnerUp=" + y2020.summary.runnerUp + "\n");
}
