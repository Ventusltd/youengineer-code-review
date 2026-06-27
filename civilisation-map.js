'use strict';

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;
const SVG_NS = 'http://www.w3.org/2000/svg';

const atlas = {
  layers: window.CIVILISATION_LAYER_CONFIG || [],
  geojson: window.CIVILISATION_GEOJSON || { type: 'FeatureCollection', features: [] },
  visibleLayers: new Set(),
  selectedId: null,
  search: '',
  unescoOnly: false,
  viewBox: [0, 0, MAP_WIDTH, MAP_HEIGHT]
};

const elements = {
  map: document.getElementById('worldMap'),
  graticule: document.getElementById('graticuleLayer'),
  land: document.getElementById('landLayer'),
  markers: document.getElementById('markerLayer'),
  labels: document.getElementById('labelLayer'),
  layerList: document.getElementById('layerList'),
  siteList: document.getElementById('siteList'),
  searchInput: document.getElementById('siteSearch'),
  unescoOnly: document.getElementById('unescoOnly'),
  totalCount: document.getElementById('totalCount'),
  visibleCount: document.getElementById('visibleCount'),
  unescoCount: document.getElementById('unescoCount'),
  selectedTitle: document.getElementById('selectedTitle'),
  selectedBody: document.getElementById('selectedBody'),
  selectedMeta: document.getElementById('selectedMeta'),
  selectedPrompt: document.getElementById('selectedPrompt'),
  tooltipCard: document.getElementById('tooltipCard'),
  resetButton: document.getElementById('resetMap'),
  randomButton: document.getElementById('randomSite')
};

function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function projectLonLat(lon, lat) {
  const x = ((lon + 180) / 360) * MAP_WIDTH;
  const y = ((90 - lat) / 180) * MAP_HEIGHT;
  return { x, y };
}

function haversineKm(a, b) {
  const radiusKm = 6371;
  const toRad = Math.PI / 180;
  const lon1 = a.geometry.coordinates[0] * toRad;
  const lat1 = a.geometry.coordinates[1] * toRad;
  const lon2 = b.geometry.coordinates[0] * toRad;
  const lat2 = b.geometry.coordinates[1] * toRad;
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return radiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function createSvgElement(tag, attributes = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

function getLayerConfig(layerId) {
  return atlas.layers.find((layer) => layer.id === layerId) || atlas.layers[0];
}

function getFeatureText(feature) {
  const p = feature.properties;
  return [p.name, p.layer, p.civilisation, p.country, p.period, p.siteType, p.focus, p.studentPrompt].join(' ').toLowerCase();
}

function getVisibleFeatures() {
  return atlas.geojson.features.filter((feature) => {
    const p = feature.properties;
    const layerIsVisible = atlas.visibleLayers.has(p.layer);
    const searchMatches = !atlas.search || getFeatureText(feature).includes(atlas.search);
    const unescoMatches = !atlas.unescoOnly || p.unesco;
    return layerIsVisible && searchMatches && unescoMatches;
  });
}

function drawGraticule() {
  elements.graticule.innerHTML = '';

  for (let lon = -180; lon <= 180; lon += 30) {
    const { x } = projectLonLat(lon, 0);
    elements.graticule.appendChild(createSvgElement('line', { x1: x, y1: 0, x2: x, y2: MAP_HEIGHT }));
  }

  for (let lat = -60; lat <= 60; lat += 30) {
    const { y } = projectLonLat(0, lat);
    elements.graticule.appendChild(createSvgElement('line', { x1: 0, y1: y, x2: MAP_WIDTH, y2: y }));
  }

  [-120, -60, 0, 60, 120].forEach((lon) => {
    const { x } = projectLonLat(lon, -76);
    const label = createSvgElement('text', { x, y: MAP_HEIGHT - 12, 'text-anchor': 'middle' });
    label.textContent = `${lon}°`;
    elements.graticule.appendChild(label);
  });
}

function drawSimpleContinents() {
  const shapes = [
    'M130 120 C85 155 75 220 118 275 C155 330 118 395 165 440 C215 405 228 332 212 278 C250 238 238 167 190 133 Z',
    'M250 120 C285 105 330 125 342 170 C314 210 320 254 355 292 C338 344 297 380 260 365 C278 302 235 254 240 200 Z',
    'M450 130 C500 80 600 75 675 115 C735 150 785 190 770 250 C710 262 690 310 626 298 C586 340 512 318 506 260 C460 245 420 190 450 130 Z',
    'M500 255 C548 250 585 288 590 345 C595 398 557 445 520 430 C500 383 472 342 483 292 Z',
    'M720 300 C770 286 815 318 842 360 C804 383 760 382 726 350 Z',
    'M805 150 C842 126 900 132 930 170 C900 198 842 198 810 178 Z'
  ];

  elements.land.innerHTML = '';
  shapes.forEach((d) => {
    elements.land.appendChild(createSvgElement('path', { d, class: 'land-shape' }));
  });
}

function buildLayerControls() {
  elements.layerList.innerHTML = '';

  atlas.layers.forEach((layer) => {
    atlas.visibleLayers.add(layer.id);

    const label = document.createElement('label');
    label.className = 'layer-toggle';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.dataset.layerId = layer.id;

    const text = document.createElement('span');
    text.textContent = `${layer.icon} ${layer.label}`;

    const swatch = document.createElement('span');
    swatch.className = 'layer-swatch';
    swatch.style.background = layer.colour;

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        atlas.visibleLayers.add(layer.id);
      } else {
        atlas.visibleLayers.delete(layer.id);
      }
      if (atlas.selectedId && !getVisibleFeatures().some((feature) => feature.properties.id === atlas.selectedId)) {
        atlas.selectedId = null;
      }
      renderAtlas();
    });

    label.appendChild(checkbox);
    label.appendChild(text);
    label.appendChild(swatch);
    elements.layerList.appendChild(label);
  });
}

function renderMarkers(features) {
  elements.markers.innerHTML = '';
  elements.labels.innerHTML = '';

  features.forEach((feature) => {
    const p = feature.properties;
    const layer = getLayerConfig(p.layer);
    const [lon, lat] = feature.geometry.coordinates;
    const { x, y } = projectLonLat(lon, lat);

    const group = createSvgElement('g', {
      class: `site-marker ${atlas.selectedId === p.id ? 'is-selected' : ''}`,
      tabindex: '0',
      role: 'button',
      'aria-label': p.name
    });

    group.appendChild(createSvgElement('circle', {
      cx: x,
      cy: y,
      r: atlas.selectedId === p.id ? 10 : 7,
      fill: layer.colour
    }));

    const icon = createSvgElement('text', { x, y: y + 0.5 });
    icon.textContent = layer.icon;
    group.appendChild(icon);

    const title = createSvgElement('title');
    title.textContent = `${p.name} — ${p.civilisation}`;
    group.appendChild(title);

    group.addEventListener('click', () => selectFeature(p.id));
    group.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectFeature(p.id);
      }
    });

    elements.markers.appendChild(group);

    if (atlas.selectedId === p.id) {
      const label = createSvgElement('text', { x: x + 14, y: y - 12, class: 'site-label' });
      label.textContent = p.name;
      elements.labels.appendChild(label);
    }
  });
}

function renderSiteList(features) {
  elements.siteList.innerHTML = '';

  features
    .slice()
    .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
    .forEach((feature) => {
      const p = feature.properties;
      const layer = getLayerConfig(p.layer);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = atlas.selectedId === p.id ? 'is-active' : '';
      button.innerHTML = `${escapeHTML(layer.icon)} <strong>${escapeHTML(p.name)}</strong><br><span class="small-note">${escapeHTML(p.civilisation)} · ${escapeHTML(p.country)}</span>`;
      button.addEventListener('click', () => selectFeature(p.id, true));
      elements.siteList.appendChild(button);
    });
}

function renderInfoPanel(features) {
  const selected = atlas.geojson.features.find((feature) => feature.properties.id === atlas.selectedId) || features[0];

  if (!selected) {
    elements.selectedTitle.textContent = 'No visible sites';
    elements.selectedBody.textContent = 'Switch on a layer or clear the search filter.';
    elements.selectedMeta.innerHTML = '';
    elements.selectedPrompt.textContent = '';
    elements.tooltipCard.hidden = true;
    return;
  }

  atlas.selectedId = selected.properties.id;
  const p = selected.properties;
  const layer = getLayerConfig(p.layer);

  elements.selectedTitle.textContent = p.name;
  elements.selectedBody.textContent = `${p.civilisation}. ${p.siteType}. Focus: ${p.focus}.`;
  elements.selectedMeta.innerHTML = '';

  [
    `${layer.icon} ${layer.label}`,
    p.country,
    p.period,
    p.unesco ? 'UNESCO starter layer' : 'Non-UNESCO inspiration layer'
  ].forEach((text) => {
    const chip = document.createElement('span');
    chip.className = 'site-chip';
    chip.textContent = text;
    elements.selectedMeta.appendChild(chip);
  });

  const nearest = getNearestFeature(selected);
  const distanceLine = nearest ? ` Nearest visible neighbour: ${nearest.feature.properties.name}, about ${Math.round(nearest.distanceKm).toLocaleString('en-GB')} km away.` : '';
  elements.selectedPrompt.textContent = `${p.studentPrompt}${distanceLine}`;

  elements.tooltipCard.hidden = false;
  elements.tooltipCard.innerHTML = `<p><strong>${escapeHTML(p.name)}</strong>${escapeHTML(p.civilisation)} · ${escapeHTML(p.country)}</p>`;
}

function getNearestFeature(selected) {
  const visible = getVisibleFeatures().filter((feature) => feature.properties.id !== selected.properties.id);
  if (!visible.length) {
    return null;
  }

  return visible
    .map((feature) => ({ feature, distanceKm: haversineKm(selected, feature) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];
}

function selectFeature(id, zoomToFeature = false) {
  atlas.selectedId = id;
  if (zoomToFeature) {
    const feature = atlas.geojson.features.find((item) => item.properties.id === id);
    if (feature) {
      setViewForFeatures([feature], 150);
    }
  }
  renderAtlas();
}

function setViewForFeatures(features, padding = 55) {
  if (!features.length) {
    setRegion('world');
    return;
  }

  const points = features.map((feature) => projectLonLat(...feature.geometry.coordinates));
  const minX = Math.max(0, Math.min(...points.map((point) => point.x)) - padding);
  const minY = Math.max(0, Math.min(...points.map((point) => point.y)) - padding);
  const maxX = Math.min(MAP_WIDTH, Math.max(...points.map((point) => point.x)) + padding);
  const maxY = Math.min(MAP_HEIGHT, Math.max(...points.map((point) => point.y)) + padding);

  const width = Math.max(120, maxX - minX);
  const height = Math.max(90, maxY - minY);
  atlas.viewBox = [minX, minY, width, height];
  elements.map.setAttribute('viewBox', atlas.viewBox.join(' '));
}

function setRegion(region) {
  const boxes = {
    world: [0, 0, MAP_WIDTH, MAP_HEIGHT],
    mediterranean: [485, 120, 185, 95],
    africa: [430, 175, 235, 220],
    asia: [560, 95, 320, 220],
    americas: [100, 90, 300, 330],
    pacific: [720, 120, 260, 310]
  };

  atlas.viewBox = boxes[region] || boxes.world;
  elements.map.setAttribute('viewBox', atlas.viewBox.join(' '));
}

function updateStats(features) {
  elements.totalCount.textContent = atlas.geojson.features.length;
  elements.visibleCount.textContent = features.length;
  elements.unescoCount.textContent = features.filter((feature) => feature.properties.unesco).length;
}

function renderAtlas() {
  const features = getVisibleFeatures();
  updateStats(features);
  renderMarkers(features);
  renderSiteList(features);
  renderInfoPanel(features);
}

function chooseRandomSite() {
  const features = getVisibleFeatures();
  if (!features.length) {
    return;
  }
  const index = Math.floor(Math.random() * features.length);
  selectFeature(features[index].properties.id, true);
}

function resetMap() {
  atlas.search = '';
  atlas.unescoOnly = false;
  elements.searchInput.value = '';
  elements.unescoOnly.checked = false;
  setRegion('world');
  renderAtlas();
}

function initAtlas() {
  buildLayerControls();
  drawGraticule();
  drawSimpleContinents();
  setRegion('world');
  atlas.selectedId = 'acropolis-athens';

  elements.searchInput.addEventListener('input', () => {
    atlas.search = elements.searchInput.value.trim().toLowerCase();
    renderAtlas();
  });

  elements.unescoOnly.addEventListener('change', () => {
    atlas.unescoOnly = elements.unescoOnly.checked;
    renderAtlas();
  });

  elements.resetButton.addEventListener('click', resetMap);
  elements.randomButton.addEventListener('click', chooseRandomSite);

  document.querySelectorAll('[data-region]').forEach((button) => {
    button.addEventListener('click', () => setRegion(button.dataset.region));
  });

  renderAtlas();
}

initAtlas();
