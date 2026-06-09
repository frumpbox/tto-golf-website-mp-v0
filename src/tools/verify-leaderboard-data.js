import { leaderboardData } from '../data/leaderboard-data.js';

function calculateCourseHandicap(handicapIndex, slope, courseRating, par) {
  const slopeFactor = slope / 113;
  return Math.round(handicapIndex * slopeFactor + (courseRating - par));
}

function computeRoundPoints(grossScores, courseData, courseHandicap) {
  let totalPoints = 0;
  if (grossScores === null) return 0;
  for (let i = 0; i < 18; i++) {
    const strokeIndex = courseData.strokeIndex[i];
    const parValue = courseData.par[i];
    const gross = grossScores[i];
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

if (!leaderboardData.yearOrder.includes(2025)) failures.push("2025 not in yearOrder");
if (leaderboardData.yearOrder.length !== 1) failures.push("yearOrder should only contain 2025 in Phase 1");

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

if (failures.length > 0) {
  console.error("\n  VERIFICATION FAILURES:");
  for (const f of failures) {
    console.error("    ✗ " + f);
  }
  process.exit(1);
} else {
  console.log("\n  ✅ 2025 leaderboard data verified successfully.");
  console.log("     Players in registry: " + Object.keys(leaderboardData.players).length);
  console.log("     Courses imported:    " + Object.keys(leaderboardData.courses).length);
  console.log("     2025 attendees:      " + leaderboardData.years[2025].attendees.length);
  console.log("     Year order:          " + leaderboardData.yearOrder.join(", "));
  console.log("     2025 results:        " + year2025.results.length + " players");
  console.log("     2025 summary:        winner=" + year2025.summary.winner + ", runnerUp=" + year2025.summary.runnerUp);
  console.log("     All Stableford computations produce 0 (no gross scores in 2025).\n");
}
