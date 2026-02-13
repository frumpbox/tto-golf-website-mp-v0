// Player handicap data by year
const playerHandicaps = {
  2020: {
    "Sam Lewis": 0,
    "James Hall": 0,
    "Felipe Milo": 0,
    "George Stinton": 0,
    "Sam Dynes": 0,
  },
  2021: {
    "Sam Dynes": 44,
    "Sam Lewis": 23,
    "George Stinton": 4,
    "James Hall": 12,
  },
  2022: {
    "Sam Dynes": 32,
    "James Hall": 12,
    "Sam Lewis": 16,
    "Felipe Milo": 16,
    "George Stinton": 3,
  },
  2023: {
    "Sam Dynes": 20.6,
    "James Hall": 8.1,
    "Sam Lewis": 9.5,
    "Felipe Milo": 8.8,
    "George Stinton": 0.9,
    "Tom Sutehall": 13.8,
  },
  2024: {
    "Sam Dynes": 21,
    "James Hall": 9,
    "Sam Lewis": 12,
    "Felipe Milo": 12,
    "George Stinton": 3,
  },
  2025: {
    "Sam Dynes": 16,
    "James Hall": 6,
    "Sam Lewis": 9,
    "Felipe Milo": 8,
    "George Stinton": 0,
    "Tom Sutehall": 14,
  },
};

// Handicap indexes (for display/calculation) by year
const playerHandicapIndexes = {
  2020: {
    "Sam Lewis": 26.7,
    "James Hall": 10.1,
    "Felipe Milo": 13.4,
    "George Stinton": 5.2,
    "Sam Dynes": 44.8,
  },
  2021: {
    "Sam Dynes": 36.5,
    "Sam Lewis": 19.2,
    "George Stinton": 3.5,
    "James Hall": 10.1,
  },
  2022: {
    "Felipe Milo": 16.8,
    "Sam Dynes": 31.1,
    "Sam Lewis": 16.8,
    "George Stinton": 4.9,
    "James Hall": 12.8,
  },
};

function getPlayerHandicap(year, playerName) {
  if (
    playerHandicaps[year] &&
    playerHandicaps[year][playerName] !== undefined
  ) {
    return playerHandicaps[year][playerName];
  }
  return null;
}

function getPlayerHandicapIndex(year, playerName) {
  if (
    playerHandicapIndexes[year] &&
    playerHandicapIndexes[year][playerName] !== undefined
  ) {
    return playerHandicapIndexes[year][playerName];
  }
  return null;
}
