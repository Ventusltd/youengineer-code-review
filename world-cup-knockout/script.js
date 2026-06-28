"use strict";

const STORAGE_KEY = "youengineer-world-cup-knockout-picks-v1";

const baseMatches = [
  [{ name: "South Africa", flag: "🇿🇦" }, { name: "Canada", flag: "🇨🇦" }, "Today", "FT"],
  [{ name: "Netherlands", flag: "🇳🇱" }, { name: "Morocco", flag: "🇲🇦" }, "Tue 30 Jun, 02:00", "R32"],
  [{ name: "Germany", flag: "🇩🇪" }, { name: "Paraguay", flag: "🇵🇾" }, "Tomorrow, 21:30", "R32"],
  [{ name: "France", flag: "🇫🇷" }, { name: "Sweden", flag: "🇸🇪" }, "Tue 30 Jun, 22:00", "R32"],
  [{ name: "Belgium", flag: "🇧🇪" }, { name: "Senegal", flag: "🇸🇳" }, "Wed 1 Jul, 21:00", "R32"],
  [{ name: "USA", flag: "🇺🇸" }, { name: "Colombia", flag: "🇨🇴" }, "Thu 2 Jul, 01:00", "R32"],
  [{ name: "England", flag: "🏴" }, { name: "Japan", flag: "🇯🇵" }, "Thu 2 Jul, 18:00", "R32"],
  [{ name: "Portugal", flag: "🇵🇹" }, { name: "Ghana", flag: "🇬🇭" }, "Thu 2 Jul, 22:00", "R32"],
  [{ name: "Spain", flag: "🇪🇸" }, { name: "Uruguay", flag: "🇺🇾" }, "Fri 3 Jul, 18:00", "R32"],
  [{ name: "Argentina", flag: "🇦🇷" }, { name: "Denmark", flag: "🇩🇰" }, "Fri 3 Jul, 22:00", "R32"],
  [{ name: "Brazil", flag: "🇧🇷" }, { name: "Mexico", flag: "🇲🇽" }, "Sat 4 Jul, 18:00", "R32"],
  [{ name: "Italy", flag: "🇮🇹" }, { name: "Nigeria", flag: "🇳🇬" }, "Sat 4 Jul, 22:00", "R32"],
  [{ name: "Croatia", flag: "🇭🇷" }, { name: "Australia", flag: "🇦🇺" }, "Sun 5 Jul, 18:00", "R32"],
  [{ name: "Switzerland", flag: "🇨🇭" }, { name: "South Korea", flag: "🇰🇷" }, "Sun 5 Jul, 22:00", "R32"],
  [{ name: "Ivory Coast", flag: "🇨🇮" }, { name: "Poland", flag: "🇵🇱" }, "Mon 6 Jul, 18:00", "R32"],
  [{ name: "Turkey", flag: "🇹🇷" }, { name: "Norway", flag: "🇳🇴" }, "Mon 6 Jul, 22:00", "R32"]
];

const roundMeta = [
  { id: "round-32", title: "Round of 32", count: 16 },
  { id: "round-16", title: "Round of 16", count: 8 },
  { id: "quarter-finals", title: "Quarter-finals", count: 4 },
  { id: "semi-finals", title: "Semi-finals", count: 2 },
  { id: "final", title: "Final", count: 1 }
];

let picks = loadPicks();

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
  for (const match of baseMatches) {
    for (const team of [match[0], match[1]]) {
      if (teamKey(team) === key) return team;
    }
  }
  return null;
}

function getTeamsForMatch(roundIndex, matchIndex) {
  if (roundIndex === 0) {
    const match = baseMatches[matchIndex];
    return [match[0], match[1]];
  }

  const leftWinner = teamFromKey(picks[matchId(roundIndex - 1, matchIndex * 2)]);
  const rightWinner = teamFromKey(picks[matchId(roundIndex - 1, matchIndex * 2 + 1)]);
  return [leftWinner, rightWinner];
}

function pruneAfter(roundIndex) {
  Object.keys(picks).forEach((id) => {
    const pickedRound = Number(id.match(/^r(\d+)-/)?.[1]);
    if (pickedRound > roundIndex) delete picks[id];
  });
}

function selectWinner(roundIndex, matchIndex, team) {
  if (!team) return;
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

function renderTeamButton(roundIndex, matchIndex, team, selectedKey) {
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

  const selected = selectedKey === teamKey(team);
  if (selected) button.classList.add("selected");
  button.innerHTML = `<span class="flag">${team.flag}</span><span class="team-name">${team.name}</span><span class="pick-indicator">${selected ? "✓" : "›"}</span>`;
  button.addEventListener("click", () => selectWinner(roundIndex, matchIndex, team));
  wrapper.appendChild(button);
  wrapper.appendChild(renderTeamTools(team));
  return wrapper;
}

function renderMatch(roundIndex, matchIndex) {
  const [teamA, teamB] = getTeamsForMatch(roundIndex, matchIndex);
  const selectedKey = picks[matchId(roundIndex, matchIndex)];
  const card = document.createElement("article");
  card.className = "match-card";

  if (roundIndex === 4) card.classList.add("champion-card");

  const meta = document.createElement("div");
  meta.className = "match-meta";
  const source = baseMatches[matchIndex] || [];
  meta.innerHTML = `<span>${roundIndex === 0 ? source[2] : "Predict"}</span><span>${roundIndex === 0 ? source[3] : "TBD"}</span>`;
  card.appendChild(meta);
  card.appendChild(renderTeamButton(roundIndex, matchIndex, teamA, selectedKey));
  card.appendChild(renderTeamButton(roundIndex, matchIndex, teamB, selectedKey));
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

  const champion = teamFromKey(picks[matchId(4, 0)]);
  document.getElementById("championName").textContent = champion ? `${champion.flag} ${champion.name}` : "TBD";
  document.getElementById("selectionCount").textContent = `${Object.keys(picks).length} / 31`;
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

document.getElementById("resetButton").addEventListener("click", () => {
  picks = {};
  savePicks();
  render();
});

document.getElementById("fullscreenButton").addEventListener("click", () => {
  const root = document.documentElement;
  if (!document.fullscreenElement && root.requestFullscreen) {
    root.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
});

document.querySelector(".round-nav").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-round]");
  if (button) scrollToRound(button.dataset.round);
});

document.querySelector(".bracket-wrap").addEventListener("scroll", updateNavState, { passive: true });

render();
