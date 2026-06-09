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

const yearOrder = [2025];

export const leaderboardData = {
  yearOrder,
  courses,
  players,
  years,
};

export default leaderboardData;
