export function handicapStrokesReceived(strokeIndex, playingHandicap) {
  return Math.floor(playingHandicap / 18) + (strokeIndex <= playingHandicap % 18 ? 1 : 0);
}

// Net double bogey is the lowest numeric gross score that earns zero points.
export function zeroPointGross(par, strokeIndex, playingHandicap) {
  return par + handicapStrokesReceived(strokeIndex, playingHandicap) + 2;
}

// Historical cards retain the established five-point cap. Events can explicitly
// opt into an uncapped Stableford formula without changing earlier years.
export function calculateStablefordHole(gross, par, strokeIndex, playingHandicap, { pickedUp = false, maxPoints = 5 } = {}) {
  if (pickedUp) return 0;
  if (![gross, par, strokeIndex, playingHandicap].every(Number.isFinite)) return null;
  const strokes = handicapStrokesReceived(strokeIndex, playingHandicap);
  return Math.min(maxPoints ?? Infinity, Math.max(0, 2 + par - (gross - strokes)));
}

export function calculateRoundStableford(round, course, { maxPoints = 5 } = {}) {
  return round.gross.map((gross, index) => {
    const cardIndex = index < 9 ? index : index + 1;
    return calculateStablefordHole(gross, course.par[cardIndex], course.strokeIndex[cardIndex], round.courseHandicap, {
      pickedUp: round.pickedUpHoles?.includes(index + 1), maxPoints,
    });
  });
}
