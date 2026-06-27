const mythSearch = document.getElementById("mythSearch");
const mythGroup = document.getElementById("mythGroup");
const mythSelect = document.getElementById("mythSelect");
const randomMythButton = document.getElementById("randomMyth");
const mythCount = document.getElementById("mythCount");
const mythSymbol = document.getElementById("mythSymbol");
const mythCategory = document.getElementById("mythCategory");
const mythName = document.getElementById("mythName");
const mythSummary = document.getElementById("mythSummary");
const mythStory = document.getElementById("mythStory");
const mythLesson = document.getElementById("mythLesson");
const mythTags = document.getElementById("mythTags");

const greekMyths = Array.isArray(window.GREEK_MYTHS) ? window.GREEK_MYTHS : [];
let activeMyths = [...greekMyths];

function normaliseText(value) {
  return String(value || "").toLowerCase().trim();
}

function getSearchableText(myth) {
  return [
    myth.name,
    myth.category,
    myth.summary,
    myth.story,
    myth.lesson,
    ...(myth.tags || [])
  ].join(" ");
}

function getFilteredMyths() {
  const searchTerm = normaliseText(mythSearch?.value);
  const selectedGroup = mythGroup?.value || "All";

  return greekMyths.filter((myth) => {
    const matchesGroup = selectedGroup === "All" || myth.category === selectedGroup;
    const matchesSearch = !searchTerm || normaliseText(getSearchableText(myth)).includes(searchTerm);
    return matchesGroup && matchesSearch;
  });
}

function populateGroupSelect() {
  if (!mythGroup) {
    return;
  }

  const groups = ["All", ...new Set(greekMyths.map((myth) => myth.category))].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return a.localeCompare(b);
  });

  mythGroup.innerHTML = "";

  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    mythGroup.appendChild(option);
  });
}

function populateMythSelect(preferredId) {
  if (!mythSelect) {
    return;
  }

  activeMyths = getFilteredMyths();
  mythSelect.innerHTML = "";

  if (!activeMyths.length) {
    const option = document.createElement("option");
    option.textContent = "No myths found";
    option.value = "";
    mythSelect.appendChild(option);
    renderEmptyState();
    return;
  }

  activeMyths.forEach((myth) => {
    const option = document.createElement("option");
    option.value = myth.id;
    option.textContent = `${myth.name} · ${myth.category}`;
    mythSelect.appendChild(option);
  });

  const selectedMyth = activeMyths.find((myth) => myth.id === preferredId) || activeMyths[0];
  mythSelect.value = selectedMyth.id;
  renderMyth(selectedMyth);
}

function renderEmptyState() {
  if (mythCount) {
    mythCount.textContent = "0 entries";
  }
  if (mythSymbol) mythSymbol.textContent = "🏛️";
  if (mythCategory) mythCategory.textContent = "No match";
  if (mythName) mythName.textContent = "No myth found";
  if (mythSummary) mythSummary.textContent = "Try a broader search or choose another theme.";
  if (mythStory) mythStory.textContent = "";
  if (mythLesson) mythLesson.textContent = "Search is part of the interface logic. Inspect how filtering works in myth-reader.js.";
  if (mythTags) mythTags.innerHTML = "";
}

function renderMyth(myth) {
  if (!myth) {
    renderEmptyState();
    return;
  }

  if (mythCount) {
    mythCount.textContent = `${activeMyths.length} of ${greekMyths.length} entries`;
  }
  if (mythSymbol) mythSymbol.textContent = myth.symbol;
  if (mythCategory) mythCategory.textContent = myth.category;
  if (mythName) mythName.textContent = myth.name;
  if (mythSummary) mythSummary.textContent = myth.summary;
  if (mythStory) mythStory.textContent = myth.story;
  if (mythLesson) mythLesson.textContent = myth.lesson;

  if (mythTags) {
    mythTags.innerHTML = "";
    (myth.tags || []).forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "myth-tag";
      tagElement.textContent = tag;
      mythTags.appendChild(tagElement);
    });
  }
}

function selectRandomMyth() {
  if (!activeMyths.length) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * activeMyths.length);
  const myth = activeMyths[randomIndex];
  mythSelect.value = myth.id;
  renderMyth(myth);
}

function initialiseMythLibrary() {
  if (!mythSelect || !greekMyths.length) {
    return;
  }

  populateGroupSelect();
  populateMythSelect("medusa");

  mythSelect.addEventListener("change", () => {
    const selectedMyth = activeMyths.find((myth) => myth.id === mythSelect.value);
    renderMyth(selectedMyth);
  });

  mythGroup.addEventListener("change", () => {
    populateMythSelect();
  });

  mythSearch.addEventListener("input", () => {
    populateMythSelect(mythSelect.value);
  });

  randomMythButton.addEventListener("click", selectRandomMyth);
}

initialiseMythLibrary();
