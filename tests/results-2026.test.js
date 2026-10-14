import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { leaderboardData } from '../src/data/leaderboard-data.js';
import { getResolvedHistoricalRows, getOverallLeaderboardRows } from '../src/leaderboard-renderer.js';
import { calculateStablefordHole, calculateRoundStableford } from '../src/scoring.js';
const year = leaderboardData.years[2026];
const expected = {
  'james-hall': [5.4,9,6,35,28,63,4],
  'sam-dynes': [14.3,21,17,26,34,60,6],
  'felipe-milo': [7.1,12,8,27,37,64,3],
  'george-stinton': [0.6,3,1,33,38,71,2],
  'fraser-hall': [null,2,1,35,27,62,5],
  'tom-sutehall': [12,18,14,30,29,59,7],
  'sam-lewis': [6.5,11,8,43,33,76,1],
};
const pars = [[4,4,5,4,3,5,4,4,3,4,4,4,3,4,4,4,5,4],[4,3,5,4,4,5,3,4,4,3,4,4,5,4,4,5,3,5]];
const indexes = [[9,5,13,1,15,7,3,11,17,14,8,2,16,10,4,12,18,6],[4,11,18,14,2,8,16,6,12,13,7,1,17,3,15,5,10,9]];

test('seven existing identities, two White-tee rounds and exactly 252 hole entries', () => {
  assert.deepEqual([...year.attendees].sort(), Object.keys(expected).sort());
  assert.equal(new Set(year.results.map(r => r.playerId)).size,7);
  assert.equal(year.results.length,7);
  assert.deepEqual(year.roundTees.map(t => [t.name,t.confirmed]), [['White',true],['White',true]]);
  assert.equal(year.handicapAllowance,100);
  assert.equal(year.scoring,'individual-stableford');
  let count=0;
  for (const result of year.results) {
    assert.equal(result.rounds.length,2);
    result.rounds.forEach((round,i) => {
      assert.equal(round.courseKey,year.courseKeys[i]);
      assert.equal(round.gross.length,18);count+=round.gross.length;
      assert.equal(round.holeStableford.length,18);
    });
  }
  assert.equal(count,252);
});

test('canonical par and SI exactly match supplied 2026 cards, totaling 72/73', () => {
  year.courseKeys.forEach((key,i) => {
    const c=leaderboardData.courses[key];
    assert.deepEqual(c.par.filter((_,j)=>![9,19,20].includes(j)),pars[i]);
    assert.deepEqual(c.strokeIndex.filter((_,j)=>![9,19,20].includes(j)),indexes[i]);
    assert.equal(pars[i].reduce((a,b)=>a+b),[72,73][i]);
  });
});

test('independent per-hole allocation verifies every point and all expected totals', () => {
  for (const r of year.results) {
    const e=expected[r.playerId];
    assert.equal(r.handicapIndex,e[0]);
    r.rounds.forEach((round,i) => {
      assert.equal(round.courseHandicap,e[i+1]);
      assert.equal(round.courseHandicapSource,'recorded');
      const independent = round.gross.map((gross,hole) => {
        // Independently distribute one stroke at a time rather than use the app helper.
        let received=0;
        for(let stroke=indexes[i][hole];stroke<=e[i+1];stroke+=18) received++;
        return gross===null ? 0 : Math.max(0,2+pars[i][hole]-gross+received);
      });
      assert.deepEqual(round.holeStableford,independent,`${r.playerId} R${i+1}`);
      assert.equal(independent.reduce((a,b)=>a+b),e[i+3]);
      assert.equal(round.stablefordPoints,e[i+3]);
    });
    assert.equal(r.points,e[5]);assert.equal(r.position,e[6]);
  }
});

test('PU remains null gross, zero points and explicitly listed; never zero strokes', () => {
  let pickedUp=0;
  for (const r of year.results) for (const round of r.rounds) {
    assert.ok(!round.gross.includes(0));
    const missing=round.gross.flatMap((score,i)=>score===null?[i+1]:[]);
    assert.deepEqual(round.pickedUpHoles,missing);
    for (const hole of missing) { pickedUp++;assert.equal(round.holeStableford[hole-1],0); }
  }
  assert.equal(pickedUp,9);
  assert.equal(calculateStablefordHole(null,4,1,9,{pickedUp:true}),0);
  assert.equal(calculateStablefordHole(null,4,1,9),null);
});

test('Fraser Scratch label is separate from numeric index and preserves manual HCP 2/1', () => {
  const r=year.results.find(r=>r.playerId==='fraser-hall');
  assert.equal(r.handicapIndex,null);assert.equal(r.handicapIndexLabel,'Scratch');
  assert.equal(r.handicapOverride.type,'recorded-playing-handicap');
  assert.equal(r.handicapConsistency,'manual-override');
  const displayed=getResolvedHistoricalRows(2026).find(r=>r.playerId==='fraser-hall');
  assert.equal(displayed.handicapIndexLabel,'Scratch');
  assert.deepEqual([displayed.round1Handicap,displayed.round2Handicap],[2,1]);
  const fel=getResolvedHistoricalRows(2026).find(r=>r.playerId==='felipe-milo');
  assert.deepEqual([fel.handicapIndex,fel.round1Handicap,fel.round2Handicap],[7.1,12,8]);
  for (const other of year.results.filter(r=>r.playerId!=='fraser-hall')) assert.equal(other.handicapOverride,undefined);
});

test('recorded HCP drives scoring even when course rating and slope change', () => {
  for (const r of year.results) for (const round of r.rounds) {
    const modified={...leaderboardData.courses[round.courseKey],slope:55,courseRating:60};
    assert.deepEqual(calculateRoundStableford(round,modified,{maxPoints:null}),round.holeStableford);
  }
  for (const handicap of [2,9,18,21]) {
    let total=0;
    for(let si=1;si<=18;si++) total+=calculateStablefordHole(4,4,si,handicap,{maxPoints:null})-2;
    assert.equal(total,handicap);
  }
  assert.equal(calculateStablefordHole(1,5,1,36,{maxPoints:null}),8);
  assert.equal(calculateStablefordHole(1,5,1,36),5,'historical cap preserved');
});

test('previous years are byte-equivalent resolved records to pre-change placeholder-branch baseline', () => {
  const hashes=JSON.parse(fs.readFileSync(new URL('./fixtures/historical-results-sha256.json',import.meta.url)));
  for (const [y,hash] of Object.entries(hashes)) {
    assert.equal(createHash('sha256').update(JSON.stringify(leaderboardData.years[y])).digest('hex'),hash,`year ${y}`);
  }
});

test('2026 annual order and overall rankings include all seven finishes', () => {
  assert.deepEqual(getResolvedHistoricalRows(2026).map(r=>r.playerId),['sam-lewis','george-stinton','felipe-milo','james-hall','fraser-hall','sam-dynes','tom-sutehall']);
  for(const r of getOverallLeaderboardRows()) assert.equal(r.rankedFinishes.find(f=>f.year===2026).position,expected[r.playerId][6]);
});
