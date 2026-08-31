import { leaderboardData } from '../data/leaderboard-data.js';

const STATUS = Object.freeze({ PASS: 'PASS', WARNING: 'WARNING', UNKNOWN: 'UNKNOWN', FAIL: 'FAIL' });
const GENERAL_SOURCES = new Set(['exact', 'recorded', 'derived', 'estimated', 'reconstructed', 'restored-legacy', 'unknown']);
const GROSS_SOURCES = new Set(['known', 'existing-provenance-unknown', 'reconstructed', 'missing']);
const checks = [];

function record(status, label, detail = '') { checks.push({ status, label, detail }); }

function calculateCourseHandicap(handicapIndex, course) {
  if (handicapIndex === null || !course) return null;
  const par = Array.isArray(course.par) ? course.par[course.par.length - 1] : course.par;
  return Math.round(handicapIndex * course.slope / 113 + course.courseRating - par);
}

function calculateHoleStableford(gross, course, courseHandicap) {
  if (!Array.isArray(gross) || courseHandicap === null) return null;
  return gross.map((grossScore, holeIndex) => {
    const dataIndex = holeIndex < 9 ? holeIndex : holeIndex + 1;
    const strokeIndex = course.strokeIndex[dataIndex];
    const par = course.par[dataIndex];
    const baseStrokes = Math.floor(courseHandicap / 18);
    const extraStrokes = courseHandicap % 18;
    const strokesReceived = baseStrokes + (strokeIndex <= extraStrokes ? 1 : 0);
    const differenceFromPar = grossScore - strokesReceived - par;
    if (differenceFromPar <= -3) return 5;
    if (differenceFromPar === -2) return 4;
    if (differenceFromPar === -1) return 3;
    if (differenceFromPar === 0) return 2;
    if (differenceFromPar === 1) return 1;
    return 0;
  });
}

function validateSource(value, allowed, label) {
  record(allowed.has(value) ? STATUS.PASS : STATUS.FAIL, label,
    allowed.has(value) ? value : `unsupported source: ${value}`);
}

function derivePositions(results) {
  const known = results.filter((result) => result.points !== null)
    .sort((a, b) => b.points - a.points);
  const positions = new Map();
  for (let index = 0; index < known.length;) {
    const points = known[index].points;
    const tied = [];
    while (index < known.length && known[index].points === points) {
      tied.push(known[index]);
      index += 1;
    }
    const basePosition = index - tied.length + 1;
    if (tied.length === 2) {
      const playoff = tied.map((result) => result.playoff).find(Boolean);
      if (playoff?.winner && playoff?.runnerUp) {
        positions.set(playoff.winner, basePosition);
        positions.set(playoff.runnerUp, basePosition + 1);
        continue;
      }
    }
    tied.forEach((result) => positions.set(result.playerId, basePosition));
  }
  return positions;
}

for (const yearKey of leaderboardData.yearOrder) {
  const year = leaderboardData.years[yearKey];
  if (!year) { record(STATUS.FAIL, `${yearKey} year`, 'missing year record'); continue; }
  record(STATUS.PASS, `${yearKey} year`, `${year.results.length} participants`);
  const derivedPositions = derivePositions(year.results);

  for (const result of year.results) {
    const prefix = `${yearKey} ${result.playerId}`;
    validateSource(result.handicapIndexSource, GENERAL_SOURCES, `${prefix} handicapIndexSource`);
    validateSource(result.pointsSource, GENERAL_SOURCES, `${prefix} pointsSource`);
    validateSource(result.positionSource, GENERAL_SOURCES, `${prefix} positionSource`);
    record(result.handicapIndex === null ? STATUS.UNKNOWN : STATUS.PASS,
      `${prefix} handicap index`, result.handicapIndex === null ? 'historically unknown' : String(result.handicapIndex));

    result.rounds.forEach((round, roundIndex) => {
      const roundPrefix = `${prefix} R${roundIndex + 1}`;
      const course = leaderboardData.courses[round.courseKey];
      if (!course) { record(STATUS.FAIL, `${roundPrefix} course`, `unknown key: ${round.courseKey}`); return; }
      record(STATUS.PASS, `${roundPrefix} course`, round.courseKey);
      validateSource(round.courseHandicapSource, GENERAL_SOURCES, `${roundPrefix} courseHandicapSource`);
      validateSource(round.stablefordPointsSource, GENERAL_SOURCES, `${roundPrefix} stablefordPointsSource`);
      validateSource(round.holeStablefordSource, GENERAL_SOURCES, `${roundPrefix} holeStablefordSource`);
      validateSource(round.grossSource, GROSS_SOURCES, `${roundPrefix} grossSource`);

      if (result.handicapIndex === null || round.courseHandicap === null) {
        record(STATUS.UNKNOWN, `${roundPrefix} HI -> HCP`,
          result.handicapIndex === null ? 'handicap index unknown' : 'course handicap unknown');
      } else {
        const calculated = calculateCourseHandicap(result.handicapIndex, round.historicalTeeContext || course);
        if (calculated === round.courseHandicap) {
          record(STATUS.PASS, `${roundPrefix} HI -> HCP`, String(calculated));
        } else if (round.courseHandicapSource === 'derived') {
          record(STATUS.FAIL, `${roundPrefix} HI -> HCP`,
            `derived HCP ${round.courseHandicap}, calculated ${calculated}`);
        } else if (year.historicalHandicapMethodology?.type === 'pre-modern-playing-handicap') {
          record(STATUS.PASS, `${roundPrefix} HI -> historical playing HCP`,
            `preserved ${round.courseHandicap}; modern canonical comparison ${calculated} is not the historical competition methodology`);
        } else {
          record(STATUS.WARNING, `${roundPrefix} HI -> recorded HCP`,
            `recorded ${round.courseHandicap}, modern canonical calculation ${calculated}`);
        }
      }

      if (round.holeStableford === null) {
        record(STATUS.UNKNOWN, `${roundPrefix} hole points -> round total`, 'hole Stableford unknown');
      } else {
        const holeTotal = round.holeStableford.reduce((sum, points) => sum + points, 0);
        if (round.stablefordPoints === null) {
          record(STATUS.UNKNOWN, `${roundPrefix} hole points -> round total`,
            `hole total ${holeTotal}, authoritative round total unknown`);
        } else {
          record(holeTotal === round.stablefordPoints ? STATUS.PASS : STATUS.FAIL,
            `${roundPrefix} hole points -> round total`,
            `hole total ${holeTotal}, recorded ${round.stablefordPoints}`);
        }
      }

      if (round.gross === null || round.courseHandicap === null) {
        record(STATUS.UNKNOWN, `${roundPrefix} historical scoring`,
          round.gross === null ? 'gross card missing' : 'course handicap unknown');
      } else if (round.holeStableford === null) {
        record(STATUS.UNKNOWN, `${roundPrefix} historical scoring`, 'authoritative hole Stableford unknown');
      } else {
        const scoringGross = round.gross.map((score, holeIndex) => {
          const annotation = round.grossAnnotations?.find((item) => item.hole === holeIndex + 1);
          return score - (annotation?.grossDisplayAdjustment || 0);
        });
        const calculatedHoles = calculateHoleStableford(scoringGross, course, round.courseHandicap);
        const mismatchedHoles = calculatedHoles.map((points, holeIndex) =>
          points === round.holeStableford[holeIndex] ? null : holeIndex + 1).filter(Boolean);
        const calculatedTotal = calculatedHoles.reduce((sum, points) => sum + points, 0);
        const totalMatches = round.stablefordPoints === null || calculatedTotal === round.stablefordPoints;
        record(mismatchedHoles.length === 0 && totalMatches ? STATUS.PASS : STATUS.FAIL,
          `${roundPrefix} historical scoring`, mismatchedHoles.length
            ? `hole mismatches: ${mismatchedHoles.join(', ')}; calculated total ${calculatedTotal}, recorded ${round.stablefordPoints}`
            : `calculated total ${calculatedTotal}, recorded ${round.stablefordPoints}`);
      }
    });

    const consistencyChecks = result.rounds.map((round) => {
      const course = leaderboardData.courses[round.courseKey];
      if (result.handicapIndex === null || round.courseHandicap === null || !course) return null;
      return calculateCourseHandicap(result.handicapIndex, round.historicalTeeContext || course) === round.courseHandicap;
    });
    const expectedConsistency = consistencyChecks.some((value) => value === null)
      ? 'unknown'
      : consistencyChecks.every(Boolean)
        ? 'pass'
        : year.historicalHandicapMethodology?.type === 'pre-modern-playing-handicap'
          ? 'historical-context'
          : 'warning';
    record(
      result.handicapConsistency === expectedConsistency ? STATUS.PASS : STATUS.FAIL,
      `${prefix} handicapConsistency`,
      `stored ${result.handicapConsistency}, derived diagnostic ${expectedConsistency}`
    );

    const [round1, round2] = result.rounds;
    if (round1.stablefordPoints === null || round2.stablefordPoints === null || result.points === null) {
      record(STATUS.UNKNOWN, `${prefix} rounds -> Points`, 'one or more authoritative totals unknown');
    } else {
      const calculatedPoints = round1.stablefordPoints + round2.stablefordPoints;
      record(calculatedPoints === result.points ? STATUS.PASS : STATUS.FAIL,
        `${prefix} rounds -> Points`, `round sum ${calculatedPoints}, recorded ${result.points}`);
    }

    if (result.points === null || result.position === null) {
      record(STATUS.UNKNOWN, `${prefix} Points/playoff -> position`, 'Points or final position unknown');
    } else {
      const derived = derivedPositions.get(result.playerId);
      record(derived === result.position ? STATUS.PASS : STATUS.FAIL,
        `${prefix} Points/playoff -> position`, `derived ${derived}, recorded ${result.position}`);
    }
  }
}

const counts = Object.fromEntries(Object.values(STATUS).map((status) => [
  status, checks.filter((check) => check.status === status).length,
]));
console.log('\nHistorical leaderboard verification');
for (const status of Object.values(STATUS)) console.log(`  ${status.padEnd(7)} ${counts[status]}`);

for (const status of [STATUS.FAIL, STATUS.WARNING]) {
  const matching = checks.filter((check) => check.status === status);
  if (!matching.length) continue;
  console.log(`\n${status} checks:`);
  matching.forEach((check) => console.log(`  - ${check.label}: ${check.detail}`));
}

const unknownCategories = new Map();
checks.filter((check) => check.status === STATUS.UNKNOWN).forEach((check) => {
  unknownCategories.set(check.detail, (unknownCategories.get(check.detail) || 0) + 1);
});
if (unknownCategories.size) {
  console.log('\nUNKNOWN categories:');
  for (const [detail, count] of unknownCategories) console.log(`  - ${detail}: ${count}`);
}
if (counts.FAIL > 0) process.exitCode = 1;
