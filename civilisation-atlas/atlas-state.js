"use strict";

window.atlasState = {
  currentGeoJSON: window.ATLAS_GEOJSON || { type: "FeatureCollection", features: [] },
  filteredFeatures: [],
  selectedFeatureId: null,
  filters: {
    search: "",
    civilisation: "All",
    region: "All",
    showClassical: true,
    showHeritage: true,
    showQuests: true
  }
};
