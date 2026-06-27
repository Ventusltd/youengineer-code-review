"use strict";

function getAllFeatures() {
  return atlasState.currentGeoJSON.features || [];
}

function populateSelect(selectElement, values, allLabel) {
  selectElement.innerHTML = "";
  [allLabel, ...values].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });
}

function populateFilters() {
  const features = getAllFeatures();
  const civilisations = uniqueSorted(features.map((feature) => feature.properties.civilisation));
  const regions = uniqueSorted(features.map((feature) => feature.properties.region));

  populateSelect($("civilisationSelect"), civilisations, "All");
  populateSelect($("regionSelect"), regions, "All");
}

function featurePassesLayerFilter(feature) {
  const layer = feature.properties.layer;

  if (layer === "heritage") {
    return atlasState.filters.showHeritage;
  }

  if (layer === "classical") {
    return atlasState.filters.showClassical;
  }

  return true;
}

function applyFilters() {
  const filters = atlasState.filters;
  const searchTerm = normalise(filters.search);

  atlasState.filteredFeatures = getAllFeatures().filter((feature) => {
    const p = feature.properties || {};
    const matchesSearch = !searchTerm || normalise(featureText(feature)).includes(searchTerm);
    const matchesCivilisation = filters.civilisation === "All" || p.civilisation === filters.civilisation;
    const matchesRegion = filters.region === "All" || p.region === filters.region;
    const matchesLayer = featurePassesLayerFilter(feature);

    return matchesSearch && matchesCivilisation && matchesRegion && matchesLayer;
  });

  if (!atlasState.filteredFeatures.some((feature) => feature.properties.id === atlasState.selectedFeatureId)) {
    atlasState.selectedFeatureId = atlasState.filteredFeatures[0]?.properties.id || null;
  }
}

function updateCount() {
  const total = getAllFeatures().length;
  const visible = atlasState.filteredFeatures.length;
  $("visibleCount").textContent = `${visible} of ${total} sites visible`;
}

function renderSelectedFeature() {
  const feature = getAllFeatures().find((item) => item.properties.id === atlasState.selectedFeatureId);

  if (!feature) {
    $("selectedType").textContent = "No site selected";
    $("selectedName").textContent = "No matching sites";
    $("selectedSummary").textContent = "Try resetting the filters or searching a broader term.";
    $("selectedCivilisation").textContent = "—";
    $("selectedRegion").textContent = "—";
    $("selectedPeriod").textContent = "—";
    $("selectedCoordinates").textContent = "—";
    $("selectedQuest").textContent = "No quest available until a site is selected.";
    return;
  }

  const p = feature.properties;
  $("selectedType").textContent = p.unesco ? "UNESCO-tagged starter site" : "Classical civilisation starter site";
  $("selectedName").textContent = p.name;
  $("selectedSummary").textContent = p.summary;
  $("selectedCivilisation").textContent = p.civilisation;
  $("selectedRegion").textContent = p.region;
  $("selectedPeriod").textContent = p.period;
  $("selectedCoordinates").textContent = formatCoordinates(feature.geometry.coordinates);
  $("selectedQuest").textContent = atlasState.filters.showQuests ? p.quest : "Quest prompts are currently hidden.";
}

function refreshAtlas() {
  applyFilters();
  updateCount();
  renderSelectedFeature();
  renderMap();
}

function selectFeature(featureId) {
  atlasState.selectedFeatureId = featureId;
  renderSelectedFeature();
  renderMap();
}

function selectRandomFeature() {
  if (!atlasState.filteredFeatures.length) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * atlasState.filteredFeatures.length);
  selectFeature(atlasState.filteredFeatures[randomIndex].properties.id);
}

function resetFilters() {
  atlasState.filters.search = "";
  atlasState.filters.civilisation = "All";
  atlasState.filters.region = "All";
  atlasState.filters.showClassical = true;
  atlasState.filters.showHeritage = true;
  atlasState.filters.showQuests = true;

  $("searchInput").value = "";
  $("civilisationSelect").value = "All";
  $("regionSelect").value = "All";
  $("layerCivilisations").checked = true;
  $("layerWorldHeritage").checked = true;
  $("layerQuests").checked = true;

  refreshAtlas();
}

function wireControls() {
  $("searchInput").addEventListener("input", (event) => {
    atlasState.filters.search = event.target.value;
    refreshAtlas();
  });

  $("civilisationSelect").addEventListener("change", (event) => {
    atlasState.filters.civilisation = event.target.value;
    refreshAtlas();
  });

  $("regionSelect").addEventListener("change", (event) => {
    atlasState.filters.region = event.target.value;
    refreshAtlas();
  });

  $("layerCivilisations").addEventListener("change", (event) => {
    atlasState.filters.showClassical = event.target.checked;
    refreshAtlas();
  });

  $("layerWorldHeritage").addEventListener("change", (event) => {
    atlasState.filters.showHeritage = event.target.checked;
    refreshAtlas();
  });

  $("layerQuests").addEventListener("change", (event) => {
    atlasState.filters.showQuests = event.target.checked;
    refreshAtlas();
  });

  $("randomSiteButton").addEventListener("click", selectRandomFeature);
  $("resetButton").addEventListener("click", resetFilters);
}

function bootAtlas() {
  populateFilters();
  applyFilters();
  atlasState.selectedFeatureId = atlasState.filteredFeatures[0]?.properties.id || null;
  initialiseMap();
  wireControls();
  updateCount();
  renderSelectedFeature();
}

bootAtlas();
