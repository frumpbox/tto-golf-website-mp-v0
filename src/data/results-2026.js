import { courses } from './course-data.js';
import { calculateRoundStableford } from '../scoring.js';

// James's authoritative transcription, supplied 14 October 2026.
// null gross entries are explicitly identified as PU, never zero strokes.
const cards = [
  {
    playerId: 'james-hall', handicapIndex: 5.4, handicaps: [9, 6],
    gross: [
      [4,5,4,6,4,5,4,4,3,4,5,5,2,6,5,4,5,null],
      [null,3,5,6,4,7,3,5,4,3,4,8,5,4,9,5,4,5],
    ],
  },
  {
    playerId: 'sam-dynes', handicapIndex: 14.3, handicaps: [21, 17],
    gross: [
      [4,7,8,null,4,6,4,8,3,7,null,null,4,5,6,3,6,6],
      [7,4,5,4,5,6,5,5,4,5,5,7,5,4,5,6,3,7],
    ],
  },
  {
    playerId: 'felipe-milo', handicapIndex: 7.1, handicaps: [12, 8],
    gross: [
      [5,6,8,4,6,6,5,6,4,6,6,4,3,null,4,5,4,6],
      [4,4,5,4,5,5,2,5,4,3,5,5,5,6,6,5,2,5],
    ],
  },
  {
    playerId: 'george-stinton', handicapIndex: 0.6, handicaps: [3, 1],
    gross: [
      [4,4,4,5,4,6,4,4,4,4,4,5,3,5,4,4,4,6],
      [3,3,3,5,5,6,3,6,4,3,4,4,4,4,4,4,3,4],
    ],
  },
  {
    playerId: 'fraser-hall', handicapIndex: null, handicapIndexLabel: 'Scratch',
    handicapOverride: { type: 'recorded-playing-handicap', reason: 'James explicitly confirmed playing handicaps 2 and 1; do not derive from a numeric index.' },
    handicaps: [2, 1],
    gross: [
      [4,4,4,4,4,5,4,4,4,4,4,5,2,4,5,4,6,4],
      [5,4,4,4,4,7,4,3,4,3,4,6,7,4,null,null,2,5],
    ],
  },
  {
    playerId: 'tom-sutehall', handicapIndex: 12.0, handicaps: [18, 14],
    gross: [
      [6,8,6,6,4,7,3,7,6,5,4,4,4,6,7,4,4,6],
      [5,5,7,5,5,8,3,7,4,2,4,5,4,9,4,9,3,null],
    ],
  },
  {
    playerId: 'sam-lewis', handicapIndex: 6.5, handicaps: [11, 8],
    gross: [
      [5,4,5,4,3,5,4,3,3,5,5,4,2,4,4,4,7,5],
      [5,3,5,4,4,5,4,5,4,4,5,6,5,6,5,5,4,5],
    ],
  },
];

export function create2026Results() {
  const results = cards.map(({ handicaps, gross, ...player }) => {
    const rounds = ['hollinwell', 'coxmoor'].map((courseKey, index) => {
      const round = {
        courseKey, courseHandicap: handicaps[index], courseHandicapSource: 'recorded',
        gross: [...gross[index]], grossSource: 'known',
        pickedUpHoles: gross[index].flatMap((score, hole) => score === null ? [hole + 1] : []),
        holeStablefordSource: 'derived', stablefordPointsSource: 'derived',
      };
      round.holeStableford = calculateRoundStableford(round, courses[courseKey], { maxPoints: null });
      round.stablefordPoints = round.holeStableford.reduce((sum, points) => sum + points, 0);
      return round;
    });
    return {
      ...player, handicapIndexSource: 'recorded',
      handicapConsistency: player.handicapOverride ? 'manual-override' : 'unknown',
      rounds, points: rounds.reduce((sum, round) => sum + round.stablefordPoints, 0),
      pointsSource: 'derived', positionSource: 'derived', playoff: null,
    };
  });
  const ordered = [...results].sort((a, b) => b.points - a.points);
  for (const result of results) result.position = ordered.findIndex((other) => other.points === result.points) + 1;
  return results;
}
