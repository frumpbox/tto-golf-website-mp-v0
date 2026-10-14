import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { leaderboardData } from '../src/data/leaderboard-data.js';
import { getResolvedHistoricalRows, getOverallLeaderboardRows } from '../src/leaderboard-renderer.js';
import { yearReviews } from '../src/data/year-review-data.js';
const year=leaderboardData.years[2025];
const patterns={
  'sam-dynes':[2,1,3,2,2,1,2,3,2,1,2,2,0,3,2,1,2,3],
  'james-hall':[1,2,2,1,3,0,2,1,2,2,1,2,0,2,1,2,1,2],
  'sam-lewis':[2,1,3,2,1,2,0,2,2,3,1,2,2,1,2,0,2,2],
  'felipe-milo':[1,2,1,2,0,2,1,2,2,1,2,1,0,2,1,1,2,1],
  'george-stinton':[2,1,2,3,1,2,2,0,2,2,1,2,3,1,2,1,2,2],
  'tom-sutehall':[1,2,2,1,2,0,3,2,1,2,2,1,2,1,2,1,1,2],
};
const targets={
  'george-stinton':[31,28,59,1], 'james-hall':[27,30,57,2],
  'sam-dynes':[34,22,56,3], 'sam-lewis':[30,22,52,4],
  'felipe-milo':[24,26,50,5], 'tom-sutehall':[28,19,47,6],
};
test('all six R1 cards reproduce the approved hole patterns with synthetic provenance',()=>{
  assert.equal(year.results.length,6);
  for(const r of year.results){
    const round=r.rounds[0],course=leaderboardData.courses[round.courseKey];
    assert.equal(round.gross.length,18);
    assert.deepEqual(round.holeStableford,patterns[r.playerId]);
    assert.equal(round.grossSource,'reconstructed');
    assert.equal(round.holeStablefordSource,'reconstructed');
    assert.equal(round.grossReconstruction.type,'plausible-synthetic');
    const independentlyScored=round.gross.map((gross,h)=>{
      const i=h<9?h:h+1;
      let received=0;
      for(let stroke=course.strokeIndex[i];stroke<=round.courseHandicap;stroke+=18)received++;
      const points=Math.max(0,2+course.par[i]-gross+received);
      if(patterns[r.playerId][h]===0)assert.equal(gross,course.par[i]+received+2);
      return points;
    });
    assert.deepEqual(independentlyScored,patterns[r.playerId]);
  }
});
test('James uses estimated index 7.6 and derived 7/9 handicaps, separate from 2026',()=>{
  const james=year.results.find(r=>r.playerId==='james-hall');
  assert.equal(james.handicapIndex,7.6);
  assert.equal(james.handicapIndexSource,'estimated');
  assert.deepEqual(james.rounds.map(r=>r.courseHandicap),[7,9]);
  assert.ok(james.rounds.every(r=>r.courseHandicapSource==='derived'));
  for(const r of james.rounds){
    const c=leaderboardData.courses[r.courseKey];
    assert.equal(Math.round(7.6*c.slope/113+c.courseRating-c.par[20]),r.courseHandicap);
  }
  assert.equal(leaderboardData.years[2026].results.find(r=>r.playerId==='james-hall').handicapIndex,5.4);
});
test('recorded R2 points remain unchanged and missing gross cards are not invented',()=>{
  const recorded=JSON.parse(fs.readFileSync(new URL('./fixtures/2025-recorded-r2.json',import.meta.url)));
  for(const r of year.results){
    assert.equal(r.rounds[1].gross,null);
    assert.equal(r.rounds[1].grossSource,'missing');
    assert.deepEqual(r.rounds[1].holeStableford,recorded[r.playerId].holes);
    assert.equal(r.rounds[1].stablefordPoints,recorded[r.playerId].total);
  }
});
test('approved totals and places populate annual, overall and year-review results',()=>{
  for(const r of year.results){
    assert.deepEqual([r.rounds[0].stablefordPoints,r.rounds[1].stablefordPoints,r.points,r.position],targets[r.playerId]);
    const overall=getOverallLeaderboardRows().find(row=>row.playerId===r.playerId);
    assert.equal(overall.rankedFinishes.find(f=>f.year===2025).position,r.position);
  }
  assert.deepEqual(getResolvedHistoricalRows(2025).map(r=>r.playerId),Object.keys(targets));
  assert.equal(year.summary.winner,'george-stinton');
  assert.equal(year.summary.runnerUp,'james-hall');
  assert.equal(yearReviews[2025].winner,'George Stinton');
  assert.equal(yearReviews[2025].runnerUp,'James Hall');
  assert.equal(yearReviews[2025].margin,'2 points');
});
