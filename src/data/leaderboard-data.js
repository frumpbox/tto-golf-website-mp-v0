import { courses } from './course-data.js';

const players = {
  "sam-lewis": { displayName: "Sam Lewis" },
  "sam-dynes": { displayName: "Sam Dynes" },
  "james-hall": { displayName: "James Hall" },
  "george-stinton": { displayName: "George Stinton" },
  "felipe-milo": { displayName: "Felipe Milo" },
  "tom-sutehall": { displayName: "Tom Sutehall" },
};

const years = {
  2020: {
    location: "England",
    courses: ["Tyrells Wood", "Tyrells Wood"],
    courseKeys: ["tyrellsWood", "tyrellsWood"],
    roundLabels: ["Round 1 - TW", "Round 2 - TW"],
    conditions: "Good",
    status: "completed",
    results: [
      {
        playerId: "sam-lewis",
        handicapIndex: 26.7,
        rounds: [
          {
            courseKey: "tyrellsWood",
            gross: [4,5,6,5,5,5,7,7,4,5,8,5,5,8,6,6,5,6],
          },
          {
            courseKey: "tyrellsWood",
            gross: [6,5,5,6,6,5,7,5,5,6,5,7,6,6,6,4,3,7],
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
            courseKey: "tyrellsWood",
            gross: [5,4,3,3,5,6,6,5,3,4,6,5,4,5,6,3,4,3],
          },
          {
            courseKey: "tyrellsWood",
            gross: [4,4,4,3,4,5,5,6,5,5,5,5,4,5,5,3,4,6],
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
            courseKey: "tyrellsWood",
            gross: [4,6,5,3,5,7,5,5,2,6,5,6,7,5,3,4,6,4],
          },
          {
            courseKey: "tyrellsWood",
            gross: [3,6,5,4,5,7,7,4,3,4,4,6,6,5,6,6,6,7],
          },
        ],
        playoff: null,
      },
      {
        playerId: "george-stinton",
        handicapIndex: 5.2,
        rounds: [
          { courseKey: "tyrellsWood", gross: null },
          { courseKey: "tyrellsWood", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "sam-dynes",
        handicapIndex: 44.8,
        rounds: [
          { courseKey: "tyrellsWood", gross: null },
          { courseKey: "tyrellsWood", gross: null },
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
      writeup: "The 2020 Tyrells Open was held at Tyrells Wood in England.",
      photos: [],
    },
  },
  2021: {
    location: "England",
    courses: ["Tyrells Wood", "Tyrells Wood"],
    courseKeys: ["tyrellsWood", "tyrellsWood"],
    roundLabels: ["Round 1 - TW", "Round 2 - TW"],
    conditions: "Good",
    status: "completed",
    results: [
      {
        playerId: "sam-dynes",
        handicapIndex: 36.5,
        rounds: [
          { courseKey: "tyrellsWood", gross: [5,8,6,6,5,6,9,4,5,6,7,9,6,8,6,5,5,7] },
          { courseKey: "tyrellsWood", gross: [6,5,6,4,6,7,9,4,5,7,6,6,6,6,5,5,7,7] },
        ],
        playoff: null,
      },
      {
        playerId: "sam-lewis",
        handicapIndex: 19.2,
        rounds: [
          { courseKey: "tyrellsWood", gross: [4,4,5,4,5,6,6,5,4,6,3,7,5,5,7,5,5,7] },
          { courseKey: "tyrellsWood", gross: [5,8,5,4,6,7,6,4,3,5,5,6,5,4,4,4,5,7] },
        ],
        playoff: null,
      },
      {
        playerId: "george-stinton",
        handicapIndex: 3.5,
        rounds: [
          { courseKey: "tyrellsWood", gross: [6,6,6,3,4,3,5,5,3,4,5,5,6,3,4,2,3,5] },
          { courseKey: "tyrellsWood", gross: [4,4,4,3,4,4,5,4,3,3,5,5,5,5,7,2,3,4] },
        ],
        playoff: null,
      },
      {
        playerId: "james-hall",
        handicapIndex: 10.1,
        rounds: [
          { courseKey: "tyrellsWood", gross: [4,6,5,4,5,7,8,7,3,5,5,7,4,5,4,3,5,5] },
          { courseKey: "tyrellsWood", gross: [4,4,5,5,5,5,7,4,4,5,5,6,4,5,5,4,7,3] },
        ],
        playoff: null,
      },
    ],
    attendees: ["sam-dynes", "sam-lewis", "george-stinton", "james-hall"],
    summary: {
      winner: "sam-dynes",
      runnerUp: "sam-lewis",
      margin: "4 points",
      writeup: "The 2021 Tyrells Open was held at Tyrells Wood in England.",
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
        handicapIndex: 12,
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
        handicapIndex: 9,
        rounds: [
          { courseKey: "sauntonEast", gross: [5,6,4,5,3,5,5,4,4,5,5,4,5,4,6,5,4,5] },
          { courseKey: "sauntonWest", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "sam-dynes",
        handicapIndex: 21,
        rounds: [
          { courseKey: "sauntonEast", gross: [7,6,6,5,3,4,5,4,5,7,5,4,4,5,5,7,6,6] },
          { courseKey: "sauntonWest", gross: [5,7,7,4,6,7,6,4,3,7,6,4,7,7,7,4,8,4] },
        ],
        playoff: null,
      },
      {
        playerId: "felipe-milo",
        handicapIndex: 12,
        rounds: [
          { courseKey: "sauntonEast", gross: [5,5,7,6,2,6,5,7,4,5,4,4,4,5,7,6,3,5] },
          { courseKey: "sauntonWest", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "george-stinton",
        handicapIndex: 3,
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
      writeup: "The 2024 Tyrells Open was held at Saunton in England.",
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
        handicapIndex: 0,
        rounds: [
          { courseKey: "royalOstend", gross: null },
          { courseKey: "royalZoute", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "sam-dynes",
        handicapIndex: 16,
        rounds: [
          { courseKey: "royalOstend", gross: null },
          { courseKey: "royalZoute", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "james-hall",
        handicapIndex: 6,
        rounds: [
          { courseKey: "royalOstend", gross: null },
          { courseKey: "royalZoute", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "felipe-milo",
        handicapIndex: 8,
        rounds: [
          { courseKey: "royalOstend", gross: null },
          { courseKey: "royalZoute", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "sam-lewis",
        handicapIndex: 9,
        rounds: [
          { courseKey: "royalOstend", gross: null },
          { courseKey: "royalZoute", gross: null },
        ],
        playoff: null,
      },
      {
        playerId: "tom-sutehall",
        handicapIndex: 14,
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
      writeup: "The 2025 Tyrells Open was held in Belgium at Royal Ostend and Royal Zoute.",
      photos: [],
    },
  },
};

const yearOrder = [2020, 2021, 2024, 2025];

export const leaderboardData = {
  yearOrder,
  courses,
  players,
  years,
};

export default leaderboardData;
