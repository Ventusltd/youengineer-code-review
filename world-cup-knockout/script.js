"use strict";

const STORAGE_KEY = "youengineer-world-cup-knockout-picks-v2";

const teams = {
  rsa: { name: "South Africa", flag: "🇿🇦" },
  can: { name: "Canada", flag: "🇨🇦" },
  ned: { name: "Netherlands", flag: "🇳🇱" },
  mar: { name: "Morocco", flag: "🇲🇦" },
  ger: { name: "Germany", flag: "🇩🇪" },
  par: { name: "Paraguay", flag: "🇵🇾" },
  fra: { name: "France", flag: "🇫🇷" },
  swe: { name: "Sweden", flag: "🇸🇪" },
  por: { name: "Portugal", flag: "🇵🇹" },
  cro: { name: "Croatia", flag: "🇭🇷" },
  esp: { name: "Spain", flag: "🇪🇸" },
  aut: { name: "Austria", flag: "🇦🇹" },
  usa: { name: "United States", flag: "🇺🇸" },
  bih: { name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  bel: { name: "Belgium", flag: "🇧🇪" },
  sen: { name: "Senegal", flag: "🇸🇳" },
  bra: { name: "Brazil", flag: "🇧🇷" },
  jpn: { name: "Japan", flag: "🇯🇵" },
  civ: { name: "Ivory Coast", flag: "🇨🇮" },
  nor: { name: "Norway", flag: "🇳🇴" },
  mex: { name: "Mexico", flag: "🇲🇽" },
  ecu: { name: "Ecuador", flag: "🇪🇨" },
  eng: { name: "England", flag: "🏴" },
  cod: { name: "DR Congo", flag: "🇨🇩" },
  arg: { name: "Argentina", flag: "🇦🇷" },
  cpv: { name: "Cape Verde", flag: "🇨🇻" },
  aus: { name: "Australia", flag: "🇦🇺" },
  egy: { name: "Egypt", flag: "🇪🇬" },
  sui: { name: "Switzerland", flag: "🇨🇭" },
  dza: { name: "Algeria", flag: "🇩🇿" },
  col: { name: "Colombia", flag: "🇨🇴" },
  gha: { name: "Ghana", flag: "🇬🇭" }
};

const baseMatches = [
  { teams: [teams.rsa, teams.can], time: "Sun 28 Jun, 20:00", status: "FT", score: [0, 1], officialWinner: teamKey(teams.can) },
  { teams: [teams.ned, teams.mar], time: "Tue 30 Jun, 02:00", status: "R32" },
  { teams: [teams.ger, teams.par], time: "Mon 29 Jun, 21:30", status: "R32" },
  { teams: [teams.fra, teams.swe], time: "Tue 30 Jun, 22:00", status: "R32" },
  { teams: [teams.por, teams.cro], time: "Fri 3 Jul, 00:00", status: "R32" },
  { teams: [teams.esp, teams.aut], time: "Thu 2 Jul, 20:00", status: "R32" },
  { teams: [teams.usa, teams.bih], time: "Thu 2 Jul, 01:00", status: "R32" },
  { teams: [teams.bel, teams.sen], time: "Wed 1 Jul, 21:00", status: "R32" },
  { teams: [teams.bra, teams.jpn], time: "Mon 29 Jun, 18:00", status: "R32" },
  { teams: [teams.civ, teams.nor], time: "Tue 30 Jun, 18:00", status: "R32" },
  { teams: [teams.mex, teams.ecu], time: "Wed 1 Jul, 02:00", status: "R32" },
  { teams: [teams.eng, teams.cod], time: "Wed 1 Jul, 17:00", status: "R32" },
  { teams: [teams.arg, teams.cpv], time: "Fri 3 Jul, 23:00", status: "R32" },
  { teams: [teams.aus, teams.egy], time: "Fri 3 Jul, 19:00", status: "R32" },
  { teams: [teams.sui, teams.dza], time: "Fri 3 Jul, 04:00", status: "R32" },
  { teams: [teams.col, teams.gha], time: "Sat 4 Jul, 02:30", status: "R32" }
];

const roundMeta = [
  { id: "round-32", title: "Round of 32", count: 16, times: baseMatches.map((match) => match.time) },
  { id: "round-16", title: "Round of 16", count: 8, times: ["Sat 4 Jul, 18:00", "Sat 4 Jul, 22:00", "Mon 6 Jul, 20:00", "Tue 7 Jul, 01:00", "Sun 5 Jul, 21:00", "Mon 6 Jul, 01:00", "Tue 7 Jul, 17:00", "Tue 7 Jul, 21:00"] },
  { id: "quarter-finals", title: "Quarter-finals", count: 4, times: ["Thu 9 Jul, 21:00", "Fri 10 Jul, 20:00", "Sat 11 Jul, 22:00", "Sun 12 Jul, 02:00"] },
  { id: "semi-finals", title: "Semi-finals", count: 2, times: ["Tue 14 Jul, 20:00", "Wed 15 Jul, 20:00"] },
  { id: "final", title: "Final", count: 1, times: ["Sun 19 Jul, 20:00"] }
];

let picks = loadPicks();
let focusMode = false;

function matchId(roundIndex, matchIndex) {
  return `r${roundIndex}-m${matchIndex}`;
}

function teamKey(team) {
  return team ? `${team.flag} ${team.name}` : "";
}

function loadPicks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function savePicks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(picks));
}

function teamFromKey(key) {
  if (!key) return null;
  return Object.values(teams).find((team) => teamKey(team) === key) || null;
}

function getOfficialWinnerKey(roundIndex, matchIndex) {
  if (roundIndex !== 0) return "";
  return baseMatches[matchIndex]?.officialWinner || "";
}

function getWinnerKey(roundIndex, matchIndex) {
  return getOfficialWinnerKey(roundIndex, matchIndex) || picks[matchId(roundIndex, matchIndex)] || "";
}

function getTeamsForMatch(roundIndex, matchIndex) {
  if (roundIndex === 0) {
    return baseMatches[matchIndex].teams;
  }

  const leftWinner = teamFromKey(getWinnerKey(roundIndex - 1, matchIndex * 2));
  const rightWinner = teamFromKey(getWinnerKey(roundIndex - 1, matchIndex * 2 + 1));
  return [leftWinner, rightWinner];
}

function pruneAfter(roundIndex) {
  Object.keys(picks).forEach((id) => {
    const pickedRound = Number(id.match(/^r(\d+)-/)?.[1]);
    if (pickedRound > roundIndex) delete picks[id];
  });
}

function selectWinner(roundIndex, matchIndex, team) {
  if (!team || getOfficialWinnerKey(roundIndex, matchIndex)) return;
  picks[matchId(roundIndex, matchIndex)] = teamKey(team);
  pruneAfter(roundIndex);
  savePicks();
  render();
}

function makeLink(label, href) {
  const a = document.createElement("a");
  a.textContent = label;
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

function renderTeamTools(team) {
  const tools = document.createElement("div");
  tools.className = "team-tools";
  if (!team) return tools;

  const q = encodeURIComponent(`${team.name} football team World Cup 2026`);
  const wiki = encodeURIComponent(`${team.name} national football team`);
  tools.appendChild(makeLink("News", `https://news.google.com/search?q=${q}`));
  tools.appendChild(makeLink("Wiki", `https://en.wikipedia.org/w/index.php?search=${wiki}`));
  tools.appendChild(makeLink("Images", `https://www.google.com/search?tbm=isch&q=${q}`));
  return tools;
}

function renderTeamButton(roundIndex, matchIndex, team, selectedKey, score) {
  const wrapper = document.createElement("div");
  const button = document.createElement("button");
  button.className = "team-button";
  button.type = "button";

  if (!team) {
    button.disabled = true;
    button.innerHTML = `<span class="flag">◇</span><span class="team-name">TBD</span><span></span>`;
    wrapper.appendChild(button);
    return wrapper;
  }

  const isOfficial = Boolean(getOfficialWinnerKey(roundIndex, matchIndex));
  const selected = selectedKey === teamKey(team);
  if (selected) button.classList.add("selected");
  if (isOfficial) button.classList.add("locked");
  if (isOfficial) button.disabled = true;

  const indicator = score !== undefined ? `${score}${selected ? " ✓" : ""}` : (selected ? "✓" : "›");
  button.innerHTML = `<span class="flag">${team.flag}</span><span class="team-name">${team.name}</span><span class="pick-indicator">${indicator}</span>`;
  button.addEventListener("click", () => selectWinner(roundIndex, matchIndex, team));
  wrapper.appendChild(button);
  wrapper.appendChild(renderTeamTools(team));
  return wrapper;
}

function renderMatch(roundIndex, matchIndex) {
  const [teamA, teamB] = getTeamsForMatch(roundIndex, matchIndex);
  const selectedKey = getWinnerKey(roundIndex, matchIndex);
  const card = document.createElement("article");
  card.className = "match-card";

  if (roundIndex === 4) card.classList.add("champion-card");

  const meta = document.createElement("div");
  meta.className = "match-meta";
  const base = baseMatches[matchIndex];
  const time = roundMeta[roundIndex].times[matchIndex] || "TBD";
  const status = roundIndex === 0 ? base.status : "Predict";
  meta.innerHTML = `<span>${time}</span><span>${status}</span>`;
  card.appendChild(meta);

  const scoreA = roundIndex === 0 ? base.score?.[0] : undefined;
  const scoreB = roundIndex === 0 ? base.score?.[1] : undefined;
  card.appendChild(renderTeamButton(roundIndex, matchIndex, teamA, selectedKey, scoreA));
  card.appendChild(renderTeamButton(roundIndex, matchIndex, teamB, selectedKey, scoreB));
  return card;
}

function render() {
  const bracket = document.getElementById("bracket");
  bracket.innerHTML = "";

  roundMeta.forEach((round, roundIndex) => {
    const column = document.createElement("section");
    column.className = "round-column";
    column.id = round.id;
    column.dataset.round = round.id;

    const title = document.createElement("h2");
    title.className = "round-title";
    title.textContent = round.title;
    column.appendChild(title);

    for (let i = 0; i < round.count; i++) {
      column.appendChild(renderMatch(roundIndex, i));
    }

    bracket.appendChild(column);
  });

  const champion = teamFromKey(getWinnerKey(4, 0));
  const officialCount = baseMatches.filter((match) => match.officialWinner).length;
  document.getElementById("championName").textContent = champion ? `${champion.flag} ${champion.name}` : "TBD";
  document.getElementById("selectionCount").textContent = `${Object.keys(picks).length + officialCount} / 31`;
  updateNavState();
}

function updateNavState() {
  const wrap = document.querySelector(".bracket-wrap");
  const columns = [...document.querySelectorAll(".round-column")];
  let activeId = columns[0]?.id;
  const left = wrap.scrollLeft;

  columns.forEach((column) => {
    if (column.offsetLeft - 80 <= left) activeId = column.id;
  });

  document.querySelectorAll(".round-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.round === activeId);
  });
}

function scrollToRound(roundId) {
  const wrap = document.querySelector(".bracket-wrap");
  const target = document.getElementById(roundId);
  if (!wrap || !target) return;
  wrap.scrollTo({ left: target.offsetLeft - 12, behavior: "smooth" });
}

function setFocusMode(active) {
  focusMode = active;
  document.body.classList.toggle("focus-mode", active);
  document.getElementById("fullscreenButton").textContent = active ? "Exit" : "Fullscreen";
  setTimeout(updateNavState, 120);
}

document.getElementById("resetButton").addEventListener("click", () => {
  picks = {};
  savePicks();
  render();
});

document.getElementById("fullscreenButton").addEventListener("click", async () => {
  if (focusMode) {
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen().catch(() => {});
    }
    setFocusMode(false);
    return;
  }

  setFocusMode(true);
  if (document.documentElement.requestFullscreen) {
    await document.documentElement.requestFullscreen().catch(() => {});
  }
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && focusMode) setFocusMode(false);
});

document.querySelector(".round-nav").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-round]");
  if (button) scrollToRound(button.dataset.round);
});

document.querySelector(".bracket-wrap").addEventListener("scroll", updateNavState, { passive: true });

render();
