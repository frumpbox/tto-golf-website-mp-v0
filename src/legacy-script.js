import { renderHistoricalLeaderboards, renderOverallLeaderboard } from "./leaderboard-renderer.js";

// Function to build scorecard detail from the resolved leaderboard round.
function buildScorecardTable(courseName, playerName, year, options = {}) {
  const courseData = getCourseData(courseName);
  if (!courseData) return null;
  const handicap = options.handicapOverride ?? null;
  const grossMode = "blank";
  const grossOverrides = options.grossOverrides;
  const grossAnnotations = Array.isArray(options.grossAnnotations) ? options.grossAnnotations : [];
  const pointsOverrides = Array.isArray(options.pointsOverrides) ? options.pointsOverrides : null;
  const blankMode = grossMode === "blank" && !grossOverrides;
  // Accept overrides as either 18-hole arrays or legacy 21-length arrays (with Out/In/Tot).
  const normalizeGrossOverrides = (overrides) => {
    if (!Array.isArray(overrides)) return null;
    const scores = new Array(holeLabels.length).fill(null);
    let hasValue = false;

    if (overrides.length >= holeLabels.length) {
      // Legacy shape: pick values where the header is a hole number; ignore supplied Out/In/Tot.
      holeLabels.forEach((label, idx) => {
        if (typeof label === "number") {
          const n = Number(overrides[idx]);
          if (Number.isFinite(n)) {
            scores[idx] = n;
            hasValue = true;
          }
        }
      });
    } else {
      // 18-hole shape: consume sequentially across numbered holes.
      let holePtr = 0;
      holeLabels.forEach((label, idx) => {
        if (typeof label === "number" && holePtr < overrides.length) {
          const n = Number(overrides[holePtr]);
          if (Number.isFinite(n)) {
            scores[idx] = n;
            hasValue = true;
          }
          holePtr += 1;
        }
      });
    }

    if (!hasValue) return null;

    const sumRange = (start, end) =>
      scores
        .slice(start, end + 1)
        .map((n) => Number(n) || 0)
        .reduce((a, b) => a + b, 0);
    scores[9] = sumRange(0, 8);
    scores[19] = sumRange(10, 18);
    scores[20] = scores[9] + scores[19];
    return scores;
  };
  const normalizedOverrides = normalizeGrossOverrides(grossOverrides);

  const table = document.createElement("table");
  table.className = "scorecard-table";
  table.style.marginTop = "8px";

  // Build thead
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headerCell = document.createElement("th");
  headerCell.textContent = "";
  headerRow.appendChild(headerCell);

  for (let i = 0; i < holeLabels.length; i++) {
    const th = document.createElement("th");
    th.textContent = holeLabels[i];
    headerRow.appendChild(th);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Build tbody
  const tbody = document.createElement("tbody");

  // Distance row (first row)
  const distRow = document.createElement("tr");
  const distLabel = document.createElement("th");
  distLabel.textContent = "Distance (yds)";
  distRow.appendChild(distLabel);
  courseData.distance.forEach((value) => {
    const td = document.createElement("td");
    td.textContent = value;
    distRow.appendChild(td);
  });
  tbody.appendChild(distRow);

  // Par row
  const parRow = document.createElement("tr");
  const parLabel = document.createElement("th");
  parLabel.textContent = "Par";
  parRow.appendChild(parLabel);
  courseData.par.forEach((value) => {
    const td = document.createElement("td");
    td.textContent = value;
    parRow.appendChild(td);
  });
  tbody.appendChild(parRow);

  // Stroke Index row
  const siRow = document.createElement("tr");
  const siLabel = document.createElement("th");
  siLabel.textContent = "Stroke Index";
  siRow.appendChild(siLabel);
  courseData.strokeIndex.forEach((value) => {
    const td = document.createElement("td");
    td.textContent = value || "";
    siRow.appendChild(td);
  });
  tbody.appendChild(siRow);

  // Gross Score row (blank)
  const scoreRow = document.createElement("tr");
  const scoreLabel = document.createElement("th");
  scoreLabel.textContent = "Gross Score";
  scoreRow.appendChild(scoreLabel);
  let grossScores = normalizedOverrides || new Array(holeLabels.length).fill(null);
  for (let i = 0; i < holeLabels.length; i++) {
    const td = document.createElement("td");
    td.className = "gross-score";
    scoreRow.appendChild(td);
  }

  // Compute Out/In/Tot gross sums when we have numbers
  if (!normalizedOverrides && !blankMode) {
    for (let i = 0; i < holeLabels.length; i++) {
      let val = grossScores[i];
      if (val === null || val === undefined) {
        val = courseData.par[i] || "";
        if (Number.isInteger(i) && i !== 9 && i !== 19 && i !== 20) {
          if (grossMode === "bogey" && typeof courseData.par[i] === "number") {
            val = courseData.par[i] + 1;
          } else {
            val = courseData.par[i] || "";
          }
        }
      }
      grossScores[i] = blankMode ? null : val;
    }

    const sumRange = (start, end) =>
      grossScores
        .slice(start, end + 1)
        .map((n) => Number(n) || 0)
        .reduce((a, b) => a + b, 0);
    grossScores[9] = sumRange(0, 8);
    grossScores[19] = sumRange(10, 18);
    grossScores[20] = grossScores[9] + grossScores[19];
  } else if (blankMode && !normalizedOverrides) {
    grossScores[9] = null;
    grossScores[19] = null;
    grossScores[20] = null;
  }

  // Write computed gross scores back into the row
  for (let i = 0; i < holeLabels.length; i++) {
    const td = scoreRow.children[i + 1];
    const val = grossScores[i];
    td.textContent = val === 0 || val === null ? "" : val;
    const annotation = grossAnnotations.find((item) => item.hole === holeLabels[i]);
    if (annotation && val !== null && val !== 0) {
      const marker = document.createElement("span");
      marker.className = "gross-score-marker";
      marker.textContent = annotation.marker;
      marker.setAttribute("aria-label", " historically adjusted");
      td.appendChild(marker);
    }
    if (val !== null && val !== 0 && i !== 9 && i !== 19 && i !== 20 && typeof courseData.par[i] === 'number') {
      const diff = val - courseData.par[i];
      if (diff < 0) td.classList.add('under-par');
      else if (diff > 0) td.classList.add('over-par');
    }
  }
  tbody.appendChild(scoreRow);

  // Points row (blank)
  const pointsRow = document.createElement("tr");
  const pointsLabel = document.createElement("th");
  pointsLabel.textContent = "Points";
  pointsRow.appendChild(pointsLabel);
  let outPoints = 0;
  let inPoints = 0;
  let totalPoints = 0;

  for (let i = 0; i < holeLabels.length; i++) {
    const td = document.createElement("td");
    td.className = "points-hole";

    // Only calculate points for actual holes (not Out/In/Tot) when we have data
    const strokeIndex = courseData.strokeIndex[i];
    const parValue = courseData.par[i];
    const grossValue = parseInt(
      scoreRow.children[i + 1] && scoreRow.children[i + 1].textContent,
      10
    );

    if (
      handicap !== null &&
      strokeIndex !== null &&
      strokeIndex !== undefined &&
      !Number.isNaN(grossValue) &&
      parValue !== undefined
    ) {
      const baseShots = Math.floor(handicap / 18);
      const extraShots = handicap % 18;
      const shotsReceived = baseShots + (strokeIndex <= extraShots ? 1 : 0);

      const netScore = grossValue - shotsReceived;
      const diffFromPar = netScore - parValue;

      let points = 0;
      if (diffFromPar <= -3) points = 5; // albatross or better
      else if (diffFromPar === -2) points = 4; // eagle
      else if (diffFromPar === -1) points = 3; // birdie
      else if (diffFromPar === 0) points = 2; // par
      else if (diffFromPar === 1) points = 1; // bogey
      else points = 0; // double bogey or worse

      const holeNumber = holeLabels[i];
      const annotation = grossAnnotations.find((item) => item.hole === holeNumber);
      if (annotation?.grossDisplayAdjustment && pointsOverrides && typeof holeNumber === "number") {
        points = pointsOverrides[holeNumber - 1];
      }

      td.textContent = points;
      if (points === 3) td.classList.add('point-birdie');
      else if (points === 4) td.classList.add('point-eagle');
      else if (points === 5) td.classList.add('point-albatross');
      else if (points === 1) td.classList.add('point-bogey');
      else if (points === 0) td.classList.add('point-double');
      if (i <= 8) outPoints += points;
      if (i >= 10 && i <= 18) inPoints += points;
      totalPoints += points;
    } else {
      td.textContent = "";
    }

    if (holeLabels[i] === "Out") {
      td.textContent = outPoints || "";
    } else if (holeLabels[i] === "In") {
      td.textContent = inPoints || "";
    } else if (holeLabels[i] === "Tot") {
      td.textContent = totalPoints || "";
    }
    pointsRow.appendChild(td);
  }
  tbody.appendChild(pointsRow);

  table.appendChild(tbody);
  table.dataset.outPoints = outPoints;
  table.dataset.inPoints = inPoints;
  table.dataset.totalPoints = totalPoints;
  return table;
}

function renderResolvedScorecards(year, rowData, detailRow) {
  const container = detailRow.querySelector(`[id="scorecard-${year}-${rowData.playerId}"]`);
  if (!container) return;
  container.replaceChildren();

  const panels = rowData.rounds.map((round, roundIndex) => {
    let panel;
    if (Array.isArray(round.gross)) {
      const table = buildScorecardTable(round.courseKey, rowData.member, year, {
        handicapOverride: round.courseHandicap,
        grossOverrides: round.gross,
        grossAnnotations: round.grossAnnotations,
        pointsOverrides: round.holeStableford,
      });
      if (round.grossAnnotations?.some((item) => item.type === "historical-par-normalisation")) {
        panel = document.createElement("div");
        panel.className = "scorecard-with-note";
        panel.appendChild(table);
        const note = document.createElement("p");
        note.className = "scorecard-historical-note";
        note.textContent = "* Hole 14 was played as a par 3 during the 2022 TTO. The gross score shown has been adjusted +2 to align with the current par-5 course representation; Stableford points are unchanged.";
        panel.appendChild(note);
      } else {
        panel = table;
      }
    } else {
      panel = document.createElement("p");
      panel.className = "scorecard-unavailable";
      panel.textContent = "Detailed scorecard unavailable for this round.";
    }

    panel.dataset.round = String(roundIndex + 1);
    panel.hidden = roundIndex !== 0;
    container.appendChild(panel);
    return panel;
  });

  const buttons = detailRow.querySelectorAll(".round-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.round !== button.dataset.round;
      });
    });
  });
}

function initializeDetailToggles() {
  document.querySelectorAll(".details-toggle").forEach((row) => {
    row.style.cursor = "pointer";
    row.addEventListener("click", () => {
      const detailsRow = document.getElementById(row.dataset.target);
      if (!detailsRow) return;
      const isHidden = detailsRow.style.display === "none" || detailsRow.style.display === "";
      detailsRow.style.display = isHidden ? "table-row" : "none";
    });
  });
}

// Initialize scorecards on page load
document.addEventListener("DOMContentLoaded", function () {
  renderOverallLeaderboard();
  renderHistoricalLeaderboards(renderResolvedScorecards);
  initializeDetailToggles();
  return;

  initYear({
    year: 2020,
    courseNames: ["tyrrellsWood", "tyrrellsWood"],
    players: [
      "Sam Lewis",
      "James Hall",
      "Felipe Milo",
      "George Stinton",
      "Samuel 'Dynesy' Dynes",
    ],
  });

  initYear({
    year: 2021,
    courseNames: ["tyrrellsWood", "tyrrellsWood"],
    players: ["Samuel 'Dynesy' Dynes", "Sam Lewis", "George Stinton", "James Hall"],
  });

  initYear({
    year: 2022,
    courseNames: ["silvertip", "stewartCreek"],
    players: [
      "Felipe Milo",
      "Samuel 'Dynesy' Dynes",
      "Sam Lewis",
      "James Hall",
      "George Stinton",
    ],
    roundLabels: { 1: "Round 1 - ST", 2: "Round 2 - SC" },
  });

  initYear({
    year: 2023,
    courseNames: ["luffenhamHeath", "luffenhamHeath"],
    players: [
      "Sam Lewis",
      "Tom Sutehall",
      "George Stinton",
      "Felipe Milo",
      "James Hall",
      "Samuel 'Dynesy' Dynes",
    ],
    roundLabels: { 1: "Round 1 - LH", 2: "Round 2 - LH" },
  });

  initYear({
    year: 2024,
    courseNames: ["sauntonEast", "sauntonWest"],
    players: [
      "Sam Lewis",
      "James Hall",
      "Samuel 'Dynesy' Dynes",
      "George Stinton",
      "Felipe Milo",
    ],
    roundLabels: { 1: "Round 1 - SE", 2: "Round 2 - SW" },
  });

  initYear({
    year: 2025,
    courseNames: ["royalOstend", "royalZoute"],
    players: [
      "George Stinton",
      "Samuel 'Dynesy' Dynes",
      "James Hall",
      "Felipe Milo",
      "Sam Lewis",
      "Tom Sutehall",
    ],
    roundLabels: { 1: "Round 1 - RO", 2: "Round 2 - RZ" },
  });

  // Add click handlers for toggles
  document.querySelectorAll(".details-toggle").forEach(function (row) {
    row.style.cursor = "pointer";

    row.addEventListener("click", function () {
      const targetId = row.getAttribute("data-target");
      const detailsRow = document.getElementById(targetId);
      if (detailsRow) {
        const isHidden =
          detailsRow.style.display === "none" ||
          detailsRow.style.display === "";
        detailsRow.style.display = isHidden ? "table-row" : "none";
      }
    });
  });
});

function initYear({ year, courseNames, players, roundLabels }) {
  players.forEach(function (player) {
    const slug = player.toLowerCase().replace(/\s+/g, "-");
    const round1Course = courseNames && courseNames[0] ? courseNames[0] : null;
    const round2Course =
      courseNames && courseNames[1] ? courseNames[1] : round1Course;
    const handicapValue =
      typeof getPlayerHandicap === "function"
        ? getPlayerHandicap(year, player)
        : null;
    const handicapIndexValue =
      typeof getPlayerHandicapIndex === "function"
        ? getPlayerHandicapIndex(year, player)
        : null;
    const computeRoundHandicap = (courseName) => {
      if (!courseName || handicapIndexValue === null) return handicapValue;
      const courseData =
        typeof getCourseData === "function" ? getCourseData(courseName) : null;
      if (!courseData) return handicapValue;
      const parValue =
        Array.isArray(courseData.par) && courseData.par.length
          ? courseData.par[courseData.par.length - 1]
          : null;
      const computed = calculateCourseHandicap(
        handicapIndexValue,
        courseData.slope,
        courseData.courseRating,
        parValue
      );
      return computed !== null ? computed : handicapValue;
    };
    const round1Handicap = computeRoundHandicap(round1Course);
    const round2Handicap = computeRoundHandicap(round2Course);
    const playerOverrides =
      grossOverridesByPlayer[year] && grossOverridesByPlayer[year][player]
        ? grossOverridesByPlayer[year][player]
        : {};
    const modeOverrides =
      grossModeOverridesByPlayer[year] &&
      grossModeOverridesByPlayer[year][player]
        ? grossModeOverridesByPlayer[year][player]
        : {};
    const round1 = buildScorecardTable(round1Course, player, year, {
      handicapOverride: round1Handicap,
      grossMode: modeOverrides[1] || "par",
      grossOverrides: playerOverrides[1],
    });
    const round2 = buildScorecardTable(round2Course, player, year, {
      handicapOverride: round2Handicap,
      grossMode: modeOverrides[2] || "bogey",
      grossOverrides: playerOverrides[2],
    });
    if (round1 && round2) {
      const id = `scorecard-${year}-${slug}`;
      const container = document.getElementById(id);
      if (container) {
        round1.dataset.round = "1";
        round2.dataset.round = "2";
        round2.style.display = "none";
        container.appendChild(round1);
        container.appendChild(round2);

        const buttons = document.querySelectorAll(
          `.round-btn[data-player="${slug}"][data-year="${year}"]`
        );
        buttons.forEach((btn) => {
          if (roundLabels && roundLabels[btn.dataset.round]) {
            btn.textContent = roundLabels[btn.dataset.round];
          }
          btn.addEventListener("click", function () {
            buttons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const desiredRound = btn.dataset.round;
            [round1, round2].forEach((card) => {
              card.style.display =
                card.dataset.round === desiredRound ? "table" : "none";
            });
          });
        });
      }

      const summaryRow = document.querySelector(
        `.details-toggle[data-target="details-${year}-${slug}"]`
      );
      const r1Points = Number(round1.dataset.totalPoints || 0);
      const r2Points = Number(round2.dataset.totalPoints || 0);
      const totalPoints = r1Points + r2Points;
      if (summaryRow) {
        const handicapR1Cell = summaryRow.querySelector(".handicap");
        const handicapR2Cell = summaryRow.querySelector(".handicap-r2");
        if (handicapR1Cell && round1Handicap !== null) {
          handicapR1Cell.textContent = round1Handicap;
        }
        if (handicapR2Cell && round2Handicap !== null) {
          handicapR2Cell.textContent = round2Handicap;
        }
        const handicapIndexCell = summaryRow.querySelector(
          ".handicap-index"
        );
        if (handicapIndexCell && handicapIndexValue !== null) {
          handicapIndexCell.textContent = handicapIndexValue;
        }
        const pointsCell = summaryRow.querySelector(".points");
        const r1Cell = summaryRow.querySelector(".r1-points");
        const r2Cell = summaryRow.querySelector(".r2-points");
        if (pointsCell) {
          pointsCell.textContent = totalPoints;
          const needsPlayoff =
            (year === 2020 && player === "Sam Lewis") ||
            (year === 2024 && player === "Sam Lewis");
          if (needsPlayoff) {
            const sup = document.createElement("sup");
            sup.textContent = "P";
            sup.title =
              year === 2020
                ? "Playoff win after 2, hole 18 then 10"
                : "Playoff win after 2, hole 10 then 9";
            pointsCell.appendChild(sup);
          }
        }
        if (r1Cell) r1Cell.textContent = r1Points;
        if (r2Cell) r2Cell.textContent = r2Points;
      }
    }
  });

  sortTableByPoints(`table-${year}`);
  updatePositions(`table-${year}`);
}

// Sort helper: sorts a tbody containing summary/detail row pairs by points desc
function sortTableByPoints(tableId) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;

  const rows = Array.from(tbody.children);
  const groups = [];
  for (let i = 0; i < rows.length; i++) {
    const summary = rows[i];
    const detail =
      i + 1 < rows.length && rows[i + 1].classList.contains("details-row")
        ? rows[i + 1]
        : null;
    const pointsCell = summary.querySelector(".points");
    const baseText =
      pointsCell && pointsCell.firstChild && pointsCell.firstChild.textContent
        ? pointsCell.firstChild.textContent.trim()
        : pointsCell
        ? pointsCell.textContent.trim()
        : "";
    const points = baseText ? Number(baseText) || -Infinity : -Infinity;
    const hasPlayoffWin =
      pointsCell && pointsCell.querySelector("sup") ? 1 : 0;
    groups.push({ summary, detail, points, hasPlayoffWin });
    if (detail) i++;
  }

  groups
    .sort((a, b) => {
      if (b.hasPlayoffWin !== a.hasPlayoffWin) {
        return b.hasPlayoffWin - a.hasPlayoffWin;
      }
      return b.points - a.points;
    })
    .forEach(({ summary, detail }) => {
      tbody.appendChild(summary);
      if (detail) tbody.appendChild(detail);
    });
}

// Update position column based on current order
function updatePositions(tableId) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;
  let rank = 1;
  tbody.querySelectorAll("tr.details-toggle").forEach((row) => {
    const firstCell = row.querySelector("td");
    if (firstCell) firstCell.textContent = formatOrdinal(rank);
    rank += 1;
  });
}

function formatOrdinal(n) {
  const j = n % 10,
    k = n % 100;
  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}

// Compute WHS course handicap with no allowance
function calculateCourseHandicap(handicapIndex, slopeRating, courseRating, par) {
  const inputs = [handicapIndex, slopeRating, courseRating, par];
  if (
    inputs.some(
      (v) => v === null || v === undefined || Number.isNaN(Number(v))
    )
  ) {
    return null;
  }
  const slopeFactor = Number(slopeRating) / 113;
  const courseHandicap =
    Number(handicapIndex) * slopeFactor + (Number(courseRating) - Number(par));
  return Math.round(courseHandicap);
}

// Optional gross overrides per player/year/round
const grossOverridesByPlayer = {
  2020: {
    "James Hall": {
      1: [5, 4, 3, 3, 5, 6, 6, 5, 3, 4, 6, 5, 4, 5, 6, 3, 4, 3],
      2: [4, 4, 4, 3, 4, 5, 5, 6, 5, 5, 5, 5, 4, 5, 5, 3, 4, 6],
    },
    "Sam Lewis": {
      1: [4, 5, 6, 5, 5, 5, 7, 7, 4, 5, 8, 5, 5, 8, 6, 6, 5, 6],
      2: [6, 5, 5, 6, 6, 5, 7, 5, 5, 6, 5, 7, 6, 6, 6, 4, 3, 7],
    },
    "Felipe Milo": {
      1: [4, 6, 5, 3, 5, 7, 5, 5, 2, 6, 5, 6, 7, 5, 3, 4, 6, 4],
      2: [3, 6, 5, 4, 5, 7, 7, 4, 3, 4, 4, 6, 6, 5, 6, 6, 6, 7],
    },
  },
  2021: {
    "Samuel 'Dynesy' Dynes": {
      1: [5, 8, 6, 6, 5, 6, 9, 4, 5, 6, 7, 9, 6, 8, 6, 5, 5, 7],
      2: [6, 5, 6, 4, 6, 7, 9, 4, 5, 7, 6, 6, 6, 6, 5, 5, 7, 7],
    },
    "James Hall": {
      1: [4, 6, 5, 4, 5, 7, 8, 7, 3, 5, 5, 7, 4, 5, 4, 3, 5, 5],
      2: [4, 4, 5, 5, 5, 5, 7, 4, 4, 5, 5, 6, 4, 5, 5, 4, 7, 3],
    },
    "Sam Lewis": {
      1: [4, 4, 5, 4, 5, 6, 6, 5, 4, 6, 3, 7, 5, 5, 7, 5, 5, 7],
      2: [5, 8, 5, 4, 6, 7, 6, 4, 3, 5, 5, 6, 5, 4, 4, 4, 5, 7],
    },
    "George Stinton": {
      1: [6, 6, 6, 3, 4, 3, 5, 5, 3, 4, 5, 5, 6, 3, 4, 2, 3, 5],
      2: [4, 4, 4, 3, 4, 4, 5, 4, 3, 3, 5, 5, 5, 5, 7, 2, 3, 4],
    },
  },
  2022: {
    "Samuel 'Dynesy' Dynes": {
      1: [5, 8, 6, 7, 3, 6, 5, 8, 5, 6, 5, 3, 6, 7, 6, 4, 5, 6],
      2: [6, 9, 6, 7, 6, 7, 6, 5, 3, 6, 9, 4, 6, 5, 5, 5, 3, 9],
    },
    "James Hall": {
      1: [4, 5, 4, 4, 4, 3, 7, 8, 6, 7, 4, 4, 6, 3, 3, 7, 5, 6],
      2: [6, 5, 4, 5, 5, 5, 5, 2, 4, 5, 6, 4, 6, 4, 4, 5, 3, 6],
    },
    "Sam Lewis": {
      1: [4, 6, 4, 5, 4, 3, 5, 6, 5, 5, 5, 4, 6, 3, 3, 6, 3, 7],
      2: [5, 6, 3, 5, 7, 5, 5, 4, 5, 5, 6, 2, 5, 6, 4, 4, 4, 7],
    },
    "Felipe Milo": {
      1: [4, 4, 4, 4, 4, 4, 5, 7, 7, 5, 7, 3, 4, 3, 4, 5, 3, 4],
      2: [4, 6, 4, 5, 4, 5, 5, 4, 4, 5, 6, 4, 5, 3, 5, 4, 3, 6],
    },
    "George Stinton": {
      1: [5, 5, 5, 6, 4, 3, 4, 5, 4, 4, 4, 2, 5, 3, 3, 4, 3, 5],
      2: [4, 5, 4, 4, 5, 5, 4, 5, 3, 5, 4, 5, 5, 5, 4, 4, 3, 4],
    },
  },
  2023: {
    "Samuel 'Dynesy' Dynes": {
      1: [7, 6, 7, 5, 4, 6, 8, 7, 6, 7, 4, 4, 6, 5, 8, 8, 5, 8],
      2: [7, 8, 7, 7, 6, 9, 6, 6, 4, 7, 6, 6, 8, 5, 6, 4, 4, 8],
    },
    "James Hall": {
      1: [6, 5, 4, 4, 5, 8, 4, 5, 3, 5, 6, 3, 6, 5, 7, 7, 3, 6],
    },
    "Sam Lewis": {
      1: [5, 6, 4, 6, 5, 5, 4, 4, 4, 4, 3, 3, 5, 4, 5, 5, 6, 5],
      2: [6, 6, 7, 4, 3, 5, 3, 5, 4, 5, 5, 4, 5, 4, 4, 5, 4, 6],
    },
    "George Stinton": {
      1: [6, 3, 4, 6, 5, 8, 4, 4, 3, 5, 3, 3, 5, 4, 4, 6, 4, 4],
    },
    "Tom Sutehall": {
      1: [6, 7, 7, 5, 4, 6, 7, 4, 3, 6, 7, 4, 5, 5, 6, 4, 5, 7],
      2: [4, 6, 5, 3, 3, 6, 4, 3, 4, 5, 7, 5, 7, 4, 5, 4, 5, 4],
    },
  },
  2024: {
    "Samuel 'Dynesy' Dynes": {
      1: [7, 6, 6, 5, 3, 4, 5, 4, 5, 7, 5, 4, 4, 5, 5, 7, 6, 6],
      2: [5, 7, 7, 4, 6, 7, 6, 4, 3, 7, 6, 4, 7, 7, 7, 4, 8, 4],
    },
    "James Hall": {
      1: [5, 6, 4, 5, 3, 5, 5, 4, 4, 5, 5, 4, 5, 4, 6, 5, 4, 5],
    },
    "Sam Lewis": {
      1: [5, 5, 7, 5, 4, 4, 5, 5, 5, 4, 5, 5, 4, 7, 4, 5, 3, 5],
      2: [5, 7, 7, 4, 4, 5, 4, 4, 3, 5, 5, 6, 6, 6, 5, 2, 8, 5],
    },
    "Felipe Milo": {
      1: [5, 5, 7, 6, 2, 6, 5, 7, 4, 5, 4, 4, 4, 5, 7, 6, 3, 5],
    },
    "George Stinton": {
      1: [4, 7, 5, 4, 5, 3, 4, 4, 4, 3, 4, 7, 2, 4, 5, 4, 3, 4],
      2: [5, 5, 7, 4, 5, 5, 5, 6, 4, 5, 3, 7, 4, 7, 4, 4, 7, 5],
    },
  },
};

// Set per-player per-round gross modes (par/bogey/blank)
const grossModeOverridesByPlayer = {
  2020: {
    "George Stinton": { 1: "blank", 2: "blank" },
    "Samuel 'Dynesy' Dynes": { 1: "blank", 2: "blank" },
  },
  2022: {
    "Felipe Milo": { 1: "blank", 2: "blank" },
    "Samuel 'Dynesy' Dynes": { 1: null, 2: "blank" },
    "Sam Lewis": { 1: "blank", 2: "blank" },
    "James Hall": { 1: "blank", 2: "blank" },
    "George Stinton": { 1: "blank", 2: "blank" },
  },
  2023: {
    "Sam Lewis": { 1: "blank", 2: "blank" },
    "Tom Sutehall": { 1: "blank", 2: "blank" },
    "George Stinton": { 1: "blank", 2: "blank" },
    "Felipe Milo": { 1: "blank", 2: "blank" },
    "James Hall": { 1: "blank", 2: "blank" },
    "Samuel 'Dynesy' Dynes": { 1: "blank", 2: "blank" },
  },
  2024: {
    "Sam Lewis": { 1: "blank", 2: "blank" },
    "James Hall": { 1: "blank", 2: "blank" },
    "Samuel 'Dynesy' Dynes": { 1: "blank", 2: "blank" },
    "George Stinton": { 1: "blank", 2: "blank" },
    "Felipe Milo": { 1: "blank", 2: "blank" },
  },
  2025: {
    "George Stinton": { 1: "blank", 2: "blank" },
    "Samuel 'Dynesy' Dynes": { 1: "blank", 2: "blank" },
    "James Hall": { 1: "blank", 2: "blank" },
    "Felipe Milo": { 1: "blank", 2: "blank" },
    "Sam Lewis": { 1: "blank", 2: "blank" },
    "Tom Sutehall": { 1: "blank", 2: "blank" },
  },
};
