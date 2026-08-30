import { courses } from './course-data.js';
import { historicalLeaderboardRecords } from './historical-leaderboard-data.js';

const players = {
  "sam-lewis": { displayName: "Sam Lewis" },
  "sam-dynes": { displayName: "Samuel 'Dynesy' Dynes" },
  "james-hall": { displayName: "James Hall" },
  "george-stinton": { displayName: "George Stinton" },
  "felipe-milo": { displayName: "Felipe Milo" },
  "tom-sutehall": { displayName: "Tom Sutehall" },
};

const years = {
  2020: {
    location: "England",
    courses: ["Tyrrells Wood", "Tyrrells Wood"],
    courseKeys: ["tyrrellsWood", "tyrrellsWood"],
    roundLabels: ["Round 1 - TW", "Round 2 - TW"],
    conditions: "Good",
    status: "completed",
    results: [
      {
        playerId: "sam-lewis",
        handicapIndex: 26.7,
        rounds: [
          {
            courseKey: "tyrrellsWood",
            gross: [4,5,6,5,5,5,7,7,4,5,8,5,5,8,5,6,6,6],
            grossSource: "reconstructed",
          },
          {
            courseKey: "tyrrellsWood",
            gross: [6,5,5,6,6,5,7,5,5,6,5,7,6,6,5,4,4,7],
            grossSource: "reconstructed",
          },
        ],
        playoff: {
          type: "sudden-death",
          holes: [18, 10],
          winner: "sam-lewis",
        },
      },
      {
        playerId: "james-hall",
        handicapIndex: 10.1,
        rounds: [
          {
            courseKey: "tyrrellsWood",
            gross: [5,4,3,3,5,6,6,5,3,4,6,5,4,5,5,3,5,3],
            grossSource: "reconstructed",
          },
          {
            courseKey: "tyrrellsWood",
            gross: [4,4,4,3,4,5,5,6,5,5,5,5,4,5,4,3,5,6],
            grossSource: "reconstructed",
          },
        ],
        playoff: {
          type: "sudden-death",
          holes: [18, 10],
          loser: "james-hall",
        },
      },
      {
        playerId: "felipe-milo",
        handicapIndex: 13.4,
        rounds: [
          {
            courseKey: "tyrrellsWood",
            gross: [4,6,5,3,5,7,5,5,2,6,5,6,7,5,3,4,6,4],
          },
          {
            courseKey: "tyrrellsWood",
            gross: [3,6,5,4,5,7,7,4,3,4,4,6,6,5,6,6,6,7],
          },
        ],
        playoff: null,
      },
      {
        playerId: "george-stinton",
        handicapIndex: 5.2,
        rounds: [
          { courseKey: "tyrrellsWood", gross: null },
          { courseKey: "tyrrellsWood", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "sam-dynes",
        handicapIndex: 44.8,
        rounds: [
          { courseKey: "tyrrellsWood", gross: null },
          { courseKey: "tyrrellsWood", gross: [9,6,7,5,8,9,6,7,4,8,5,9,8,8,8,7,9,8], grossSource: "reconstructed" },
        ],
        playoff: null,
      },
    ],
    attendees: [
      "sam-lewis",
      "james-hall",
      "felipe-milo",
      "george-stinton",
      "sam-dynes",
    ],
    summary: {
      winner: "sam-lewis",
      runnerUp: "james-hall",
      margin: "Playoff",
      writeup: "The 2020 Tyrrels Open was held at Tyrrells Wood in England.",
      photos: [],
    },
  },
  2021: {
    location: "England",
    courses: ["Tyrrells Wood", "Tyrrells Wood"],
    courseKeys: ["tyrrellsWood", "tyrrellsWood"],
    roundLabels: ["Round 1 - TW", "Round 2 - TW"],
    conditions: "Good",
    status: "completed",
    results: [
      {
        playerId: "sam-dynes",
        handicapIndex: 36.5,
        rounds: [
          { courseKey: "tyrrellsWood", gross: [5,8,6,6,5,6,9,4,5,6,7,9,6,8,6,5,5,7] },
          { courseKey: "tyrrellsWood", gross: [6,5,6,4,6,7,9,4,5,7,6,6,6,6,5,5,7,7] },
        ],
        playoff: null,
      },
      {
        playerId: "sam-lewis",
        handicapIndex: 19.2,
        rounds: [
          { courseKey: "tyrrellsWood", gross: [4,4,5,4,5,6,6,5,4,6,3,7,5,5,7,5,5,7] },
          { courseKey: "tyrrellsWood", gross: [5,8,5,4,6,7,6,4,3,5,5,6,5,4,4,3,6,7], grossSource: "reconstructed" },
        ],
        playoff: null,
      },
      {
        playerId: "george-stinton",
        handicapIndex: 3.5,
        rounds: [
          { courseKey: "tyrrellsWood", gross: [6,6,6,3,4,3,5,5,3,4,5,5,6,3,4,2,3,5] },
          { courseKey: "tyrrellsWood", gross: [4,4,4,3,4,4,5,4,3,3,5,5,5,5,7,2,3,4] },
        ],
        playoff: null,
      },
      {
        playerId: "james-hall",
        handicapIndex: 10.1,
        rounds: [
          { courseKey: "tyrrellsWood", gross: [4,6,5,4,5,7,8,7,3,5,5,7,4,5,4,3,5,5] },
          { courseKey: "tyrrellsWood", gross: [4,4,5,5,5,5,7,4,4,5,5,6,4,5,5,4,7,3] },
        ],
        playoff: null,
      },
    ],
    attendees: ["sam-dynes", "sam-lewis", "george-stinton", "james-hall"],
    summary: {
      winner: "sam-dynes",
      runnerUp: "sam-lewis",
      margin: "4 points",
      writeup: "The 2021 Tyrrels Open was held at Tyrrells Wood in England.",
      photos: [],
    },
  },
  2022: {
    location: "Canada",
    courses: ["Silvertip", "Stewart Creek"],
    courseKeys: ["silvertip", "stewartCreek"],
    roundLabels: ["Round 1 - ST", "Round 2 - SC"],
    conditions: "Good",
    status: "completed",
    results: [
      {
        playerId: "felipe-milo",
        handicapIndex: 16.8,
        rounds: [
          { courseKey: "silvertip", gross: [4,4,4,4,4,4,5,7,7,5,7,3,4,3,4,5,3,4], grossSource: "reconstructed" },
          { courseKey: "stewartCreek", gross: [4,6,5,5,4,5,5,3,4,5,6,5,5,3,5,4,3,6], grossSource: "reconstructed" },
        ],
        playoff: null,
      },
      {
        playerId: "sam-dynes",
        handicapIndex: 31.1,
        rounds: [
          { courseKey: "silvertip", gross: [5,8,6,7,3,6,5,8,5,6,5,3,6,6,6,4,5,6], grossSource: "reconstructed" },
          { courseKey: "stewartCreek", gross: [6,9,6,7,6,7,6,4,4,6,8,5,6,5,5,4,4,9], grossSource: "reconstructed" },
        ],
        playoff: null,
      },
      {
        playerId: "sam-lewis",
        handicapIndex: 16.8,
        rounds: [
          { courseKey: "silvertip", gross: [4,6,3,5,4,3,5,6,5,5,5,4,6,3,3,6,3,6], grossSource: "reconstructed" },
          { courseKey: "stewartCreek", gross: [5,6,4,5,7,5,5,3,5,5,6,3,5,6,4,3,4,7], grossSource: "reconstructed" },
        ],
        playoff: null,
      },
      {
        playerId: "james-hall",
        handicapIndex: 12.8,
        rounds: [
          { courseKey: "silvertip", gross: [4,5,4,4,4,3,7,8,6,7,4,4,6,3,3,7,5,6], grossSource: "reconstructed" },
          { courseKey: "stewartCreek", gross: [6,5,4,5,5,5,5,2,4,5,5,5,6,5,4,4,4,5], grossSource: "reconstructed" },
        ],
        playoff: null,
      },
      {
        playerId: "george-stinton",
        handicapIndex: 4.9,
        rounds: [
          { courseKey: "silvertip", gross: [5,5,5,6,4,3,4,5,4,4,4,2,5,3,3,4,3,5], grossSource: "reconstructed" },
          { courseKey: "stewartCreek", gross: [4,5,4,4,5,5,4,5,3,5,4,4,5,6,4,4,3,4], grossSource: "reconstructed" },
        ],
        playoff: null,
      },
    ],
    attendees: ["felipe-milo", "sam-dynes", "sam-lewis", "james-hall", "george-stinton"],
    summary: {
      winner: "felipe-milo",
      runnerUp: "sam-dynes",
      margin: "TBD",
      writeup: "The 2022 Tyrrels Open was held in Canada at Silvertip and Stewart Creek.",
      photos: [],
    },
  },
  2023: {
    location: "England",
    courses: ["Luffenham Heath", "Luffenham Heath"],
    courseKeys: ["luffenhamHeath", "luffenhamHeath"],
    roundLabels: ["Round 1 - LH", "Round 2 - LH"],
    conditions: "Good",
    status: "completed",
    results: [
      {
        playerId: "sam-lewis",
        handicapIndex: 9.5,
        rounds: [
          { courseKey: "luffenhamHeath", gross: [5,6,4,7,5,5,4,4,4,4,3,3,5,4,5,5,4,8], grossSource: "reconstructed" },
          { courseKey: "luffenhamHeath", gross: [6,6,7,5,3,5,3,5,4,5,5,4,5,5,4,5,4,7], grossSource: "reconstructed" },
        ],
        playoff: null,
      },
      {
        playerId: "tom-sutehall",
        handicapIndex: 13.8,
        rounds: [
          { courseKey: "luffenhamHeath", gross: [6,7,7,5,3,6,7,5,3,6,7,4,5,5,6,4,5,7], grossSource: "reconstructed" },
          { courseKey: "luffenhamHeath", gross: [4,6,5,3,2,6,4,4,4,5,7,5,7,4,5,4,5,4], grossSource: "reconstructed" },
        ],
        playoff: null,
      },
      {
        playerId: "george-stinton",
        handicapIndex: 0.9,
        rounds: [
          { courseKey: "luffenhamHeath", gross: [6,4,4,7,5,8,5,4,3,5,4,3,5,4,4,7,4,4], grossSource: "reconstructed" },
          { courseKey: "luffenhamHeath", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "felipe-milo",
        handicapIndex: 8.8,
        rounds: [
          { courseKey: "luffenhamHeath", gross: [7,6,4,5,5,8,6,4,4,5,4,3,6,7,4,5,3,4], grossSource: "reconstructed" },
          { courseKey: "luffenhamHeath", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "james-hall",
        handicapIndex: 8.1,
        rounds: [
          { courseKey: "luffenhamHeath", gross: [6,5,3,5,5,8,4,5,3,5,6,3,6,5,7,7,2,6], grossSource: "reconstructed" },
          { courseKey: "luffenhamHeath", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "sam-dynes",
        handicapIndex: 20.6,
        rounds: [
          { courseKey: "luffenhamHeath", gross: [8,6,6,5,4,6,8,7,7,8,4,4,6,6,8,8,4,9], grossSource: "reconstructed" },
          { courseKey: "luffenhamHeath", gross: [8,8,7,8,6,9,6,6,5,8,6,6,8,6,6,4,4,9], grossSource: "reconstructed" },
        ],
        playoff: null,
      },
    ],
    attendees: ["sam-lewis", "tom-sutehall", "george-stinton", "felipe-milo", "james-hall", "sam-dynes"],
    summary: {
      winner: "sam-lewis",
      runnerUp: "tom-sutehall",
      margin: "TBD",
      writeup: "The 2023 Tyrrels Open was held at Luffenham Heath in England.",
      photos: [],
    },
  },
  2024: {
    location: "England",
    courses: ["Saunton East", "Saunton West"],
    courseKeys: ["sauntonEast", "sauntonWest"],
    roundLabels: ["Round 1 - SE", "Round 2 - SW"],
    conditions: "Good",
    status: "completed",
    results: [
      {
        playerId: "sam-lewis",
        handicapIndex: 12, // PLACEHOLDER — real handicap index not yet known; preserves current course handicap and Stableford total
        rounds: [
          { courseKey: "sauntonEast", gross: [5,5,7,5,4,4,5,5,5,4,5,5,4,7,4,5,3,5] },
          { courseKey: "sauntonWest", gross: [5,7,7,4,4,5,4,4,3,5,5,6,6,6,5,2,8,5] },
        ],
        playoff: {
          type: "sudden-death",
          holes: [10, 9],
          winner: "sam-lewis",
        },
      },
      {
        playerId: "james-hall",
        handicapIndex: 9, // PLACEHOLDER — real handicap index not yet known; preserves current course handicap and Stableford total
        rounds: [
          { courseKey: "sauntonEast", gross: [5,6,4,5,3,5,5,4,4,5,5,4,5,4,6,5,4,5] },
          { courseKey: "sauntonWest", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "sam-dynes",
        handicapIndex: 21, // PLACEHOLDER — real handicap index not yet known; preserves current course handicap and Stableford total
        rounds: [
          { courseKey: "sauntonEast", gross: [7,6,6,5,3,4,5,4,5,7,5,4,4,5,5,7,6,6] },
          { courseKey: "sauntonWest", gross: [5,7,7,4,6,7,6,4,3,6,6,4,7,7,7,4,8,4], grossSource: "reconstructed" },
        ],
        playoff: null,
      },
      {
        playerId: "felipe-milo",
        handicapIndex: 12, // PLACEHOLDER — real handicap index not yet known; preserves current course handicap and Stableford total
        rounds: [
          { courseKey: "sauntonEast", gross: [5,5,7,6,2,6,5,7,4,5,4,4,4,5,7,6,3,5] },
          { courseKey: "sauntonWest", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "george-stinton",
        handicapIndex: 3, // PLACEHOLDER — real handicap index not yet known; preserves current course handicap and Stableford total
        rounds: [
          { courseKey: "sauntonEast", gross: [4,7,5,4,5,3,4,4,4,3,4,7,2,4,5,4,3,4] },
          { courseKey: "sauntonWest", gross: [5,5,7,4,5,5,5,6,4,5,3,7,4,7,4,4,7,5] },
        ],
        playoff: null,
      },
    ],
    attendees: ["sam-lewis", "james-hall", "sam-dynes", "felipe-milo", "george-stinton"],
    summary: {
      winner: "sam-lewis",
      runnerUp: "sam-dynes",
      margin: "Playoff",
      writeup: "The 2024 Tyrrels Open was held at Saunton in England.",
      photos: [],
    },
  },
  2025: {
    location: "Belgium",
    courses: ["Royal Ostend", "Royal Zoute"],
    courseKeys: ["royalOstend", "royalZoute"],
    roundLabels: ["Round 1 - RO", "Round 2 - RZ"],
    conditions: "Good",
    status: "completed",
    results: [
      {
        playerId: "george-stinton",
        handicapIndex: 0, // PLACEHOLDER — real handicap index not yet known; preserves current course handicap and Stableford total
        rounds: [
          { courseKey: "royalOstend", gross: null },
          { courseKey: "royalZoute", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "sam-dynes",
        handicapIndex: 16, // PLACEHOLDER — real handicap index not yet known; preserves current course handicap and Stableford total
        rounds: [
          { courseKey: "royalOstend", gross: null },
          { courseKey: "royalZoute", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "james-hall",
        handicapIndex: 6, // PLACEHOLDER — real handicap index not yet known; preserves current course handicap and Stableford total
        rounds: [
          { courseKey: "royalOstend", gross: null },
          { courseKey: "royalZoute", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "felipe-milo",
        handicapIndex: 8, // PLACEHOLDER — real handicap index not yet known; preserves current course handicap and Stableford total
        rounds: [
          { courseKey: "royalOstend", gross: null },
          { courseKey: "royalZoute", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "sam-lewis",
        handicapIndex: 9, // PLACEHOLDER — real handicap index not yet known; preserves current course handicap and Stableford total
        rounds: [
          { courseKey: "royalOstend", gross: null },
          { courseKey: "royalZoute", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "tom-sutehall",
        handicapIndex: 14, // PLACEHOLDER — real handicap index not yet known; preserves current course handicap and Stableford total
        rounds: [
          { courseKey: "royalOstend", gross: null },
          { courseKey: "royalZoute", gross: null },
        ],
        playoff: null,
      },
    ],
    attendees: [
      "sam-lewis",
      "sam-dynes",
      "james-hall",
      "george-stinton",
      "felipe-milo",
      "tom-sutehall",
    ],
    summary: {
      winner: "george-stinton",
      runnerUp: "sam-dynes",
      margin: "TBD",
      writeup: "The 2025 Tyrrels Open was held in Belgium at Royal Ostend and Royal Zoute.",
      photos: [],
    },
  },
};

function calculateCourseHandicap(handicapIndex, course) {
  if (handicapIndex === null || handicapIndex === undefined || !course) return null;
  const par = course.par[course.par.length - 1];
  return Math.round(
    handicapIndex * course.slope / 113 + course.courseRating - par
  );
}

// Merge workbook-authoritative historical results into the migrated score data.
// Existing gross arrays are deliberately preserved for later reconstruction.
for (const [yearKey, records] of Object.entries(historicalLeaderboardRecords)) {
  const year = years[yearKey];
  if (!year) continue;

  for (const result of year.results) {
    const historical = records[result.playerId];
    if (!historical) continue;

    result.handicapIndex = historical.handicapIndex;
    result.handicapIndexSource = historical.handicapIndexSource;
    result.points = historical.points;
    result.pointsSource = historical.pointsSource;
    result.position = historical.position;
    result.positionSource = historical.positionSource;
    result.playoff = historical.playoff;

    result.rounds.forEach((round, roundIndex) => {
      const historicalRound = historical.rounds[roundIndex];
      if (!historicalRound) return;

      let courseHandicap = historicalRound.courseHandicap;
      let courseHandicapSource = historicalRound.courseHandicapSource;
      if (courseHandicap === null && result.handicapIndex !== null) {
        courseHandicap = calculateCourseHandicap(
          result.handicapIndex,
          courses[round.courseKey]
        );
        courseHandicapSource = "derived";
      }

      Object.assign(round, historicalRound, {
        courseHandicap,
        courseHandicapSource: courseHandicapSource || "unknown",
        grossSource: round.grossSource || (round.gross === null
          ? "missing"
          : "existing-provenance-unknown"),
      });
    });

    const hcpChecks = result.rounds.map((round) => {
      if (result.handicapIndex === null || round.courseHandicap === null) return null;
      return calculateCourseHandicap(
        result.handicapIndex,
        courses[round.courseKey]
      ) === round.courseHandicap;
    });
    result.handicapConsistency = hcpChecks.some((value) => value === null)
      ? "unknown"
      : hcpChecks.every(Boolean)
        ? "pass"
        : "warning";
  }
}

years[2020].summary.winner = "sam-lewis";
years[2020].summary.runnerUp = "james-hall";
years[2021].summary.winner = "sam-dynes";
years[2021].summary.runnerUp = "sam-lewis";
years[2022].summary.winner = "felipe-milo";
years[2022].summary.runnerUp = "sam-lewis";
years[2023].summary.winner = "sam-lewis";
years[2023].summary.runnerUp = "tom-sutehall";
years[2024].summary.winner = "sam-lewis";
years[2024].summary.runnerUp = "james-hall";
years[2025].summary.winner = null;
years[2025].summary.runnerUp = null;

const yearOrder = [2020, 2021, 2022, 2023, 2024, 2025];

export const leaderboardData = {
  yearOrder,
  courses,
  players,
  years,
};

export default leaderboardData;
