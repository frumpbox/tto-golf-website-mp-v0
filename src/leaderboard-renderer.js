import { leaderboardData } from "./data/leaderboard-data.js";

const displayValue = (value) => value === null || value === undefined ? "–" : String(value);

function formatPosition(position) {
  if (position === null || position === undefined) return "–";
  const mod10 = position % 10;
  const mod100 = position % 100;
  if (mod10 === 1 && mod100 !== 11) return `${position}st`;
  if (mod10 === 2 && mod100 !== 12) return `${position}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${position}rd`;
  return `${position}th`;
}

export function getOverallLeaderboardRows() {
  const rows = Object.entries(leaderboardData.players).map(([playerId, player], sourceOrder) => {
    const yearsAttended = [];
    const rankedFinishes = [];

    for (const yearKey of leaderboardData.yearOrder) {
      const year = leaderboardData.years[yearKey];
      if (year.attendees.includes(playerId)) yearsAttended.push(yearKey);

      const result = year.results.find((item) => item.playerId === playerId);
      if (result?.position !== null && result?.position !== undefined) {
        rankedFinishes.push({ year: yearKey, position: result.position });
      }
    }

    const rankScore = rankedFinishes.reduce((total, finish) => total + finish.position, 0);
    const averageRank = rankedFinishes.length ? rankScore / rankedFinishes.length : null;

    return {
      sourceOrder,
      playerId,
      member: player.displayName,
      yearsAttended,
      rankedFinishes,
      played: yearsAttended.length,
      rankScore: rankedFinishes.length ? rankScore : null,
      averageRank,
    };
  });

  return rows
    .sort((a, b) => {
      if (a.averageRank === null && b.averageRank === null) return a.sourceOrder - b.sourceOrder;
      if (a.averageRank === null) return 1;
      if (b.averageRank === null) return -1;
      return a.averageRank - b.averageRank || a.sourceOrder - b.sourceOrder;
    })
    .map((row, index) => ({ ...row, overallPosition: index + 1 }));
}

export function getResolvedHistoricalRows(yearKey) {
  const year = leaderboardData.years[yearKey];
  if (!year) return [];

  return year.results
    .map((result, sourceOrder) => ({
      sourceOrder,
      playerId: result.playerId,
      member: leaderboardData.players[result.playerId].displayName,
      position: result.position,
      handicapIndex: result.handicapIndex,
      round1Handicap: result.rounds[0].courseHandicap,
      round2Handicap: result.rounds[1].courseHandicap,
      points: result.points,
      round1Points: result.rounds[0].stablefordPoints,
      round2Points: result.rounds[1].stablefordPoints,
      rounds: result.rounds,
      playoff: result.playoff,
    }))
    .sort((a, b) => {
      if (a.position === null && b.position === null) return a.sourceOrder - b.sourceOrder;
      if (a.position === null) return 1;
      if (b.position === null) return -1;
      return a.position - b.position || a.sourceOrder - b.sourceOrder;
    });
}

function setCell(row, selector, value) {
  const cell = row.querySelector(selector);
  if (cell) cell.textContent = displayValue(value);
}

export function renderHistoricalLeaderboards(renderScorecards) {
  for (const yearKey of leaderboardData.yearOrder) {
    const tbody = document.querySelector(`#table-${yearKey} tbody`);
    if (!tbody) continue;

    const groups = new Map();
    for (const summary of tbody.querySelectorAll("tr.details-toggle")) {
      const targetId = summary.dataset.target;
      const playerId = targetId?.replace(`details-${yearKey}-`, "");
      const detail = targetId ? document.getElementById(targetId) : null;
      if (playerId) groups.set(playerId, { summary, detail });
    }

    for (const rowData of getResolvedHistoricalRows(yearKey)) {
      const group = groups.get(rowData.playerId);
      if (!group) continue;

      const cells = group.summary.cells;
      cells[0].textContent = formatPosition(rowData.position);
      const memberLink = document.createElement("a");
      memberLink.className = "leaderboard-player-link";
      memberLink.href = `about.html?player=${rowData.playerId}`;
      memberLink.textContent = rowData.member;
      memberLink.addEventListener("click", (event) => event.stopPropagation());
      cells[1].replaceChildren(memberLink);
      setCell(group.summary, ".handicap-index", rowData.handicapIndex);
      setCell(group.summary, ".handicap", rowData.round1Handicap);
      setCell(group.summary, ".handicap-r2", rowData.round2Handicap);
      setCell(group.summary, ".points", rowData.points);
      setCell(group.summary, ".r1-points", rowData.round1Points);
      setCell(group.summary, ".r2-points", rowData.round2Points);

      group.summary.dataset.playerId = rowData.playerId;
      tbody.appendChild(group.summary);
      if (group.detail) {
        tbody.appendChild(group.detail);
        renderScorecards?.(yearKey, rowData, group.detail);
      }
    }
  }
}

export function renderOverallLeaderboard() {
  const tbody = document.querySelector("#overall-leaderboard tbody");
  if (!tbody) return;

  const rows = getOverallLeaderboardRows().map((row) => {
    const tr = document.createElement("tr");
    const values = [
      formatPosition(row.overallPosition),
      row.member,
      row.played,
      row.rankScore,
      row.averageRank === null ? null : row.averageRank.toFixed(2),
    ];

    values.forEach((value, index) => {
      const td = document.createElement("td");
      if (index === 1) {
        const link = document.createElement("a");
        link.className = "leaderboard-player-link";
        link.href = `about.html?player=${row.playerId}`;
        link.textContent = row.member;
        td.appendChild(link);
      } else {
        td.textContent = displayValue(value);
      }
      tr.appendChild(td);
    });

    return tr;
  });

  tbody.replaceChildren(...rows);
}
