"use strict";

const LAND_HINTS = [
  "M 120 132 C 155 92 250 82 325 118 C 380 145 365 190 315 205 C 250 225 160 205 115 178 Z",
  "M 448 108 C 520 72 640 78 760 132 C 835 165 858 230 790 260 C 705 300 575 268 500 236 C 442 210 395 150 448 108 Z",
  "M 500 246 C 555 248 598 300 585 375 C 565 455 498 442 465 370 C 436 305 445 260 500 246 Z",
  "M 630 296 C 704 278 800 310 820 370 C 845 445 745 454 690 422 C 642 394 595 322 630 296 Z",
  "M 245 250 C 308 252 344 304 330 380 C 310 462 248 505 214 445 C 182 390 186 300 245 250 Z",
  "M 186 178 C 224 178 258 210 250 252 C 238 315 184 330 156 270 C 132 222 148 184 186 178 Z",
  "M 826 184 C 864 172 904 184 918 214 C 930 250 900 278 850 265 C 812 252 792 200 826 184 Z",
  "M 493 42 C 535 28 585 38 606 68 C 564 76 523 75 493 42 Z"
];

function drawGraticule() {
  const graticuleLayer = $("graticuleLayer");
  graticuleLayer.innerHTML = "";

  for (let lon = -180; lon <= 180; lon += 30) {
    const start = lonLatToPoint([lon, -80]);
    const end = lonLatToPoint([lon, 80]);
    graticuleLayer.appendChild(makeSvgElement("line", {
      class: "graticule",
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    }));
  }

  for (let lat = -60; lat <= 60; lat += 30) {
    const start = lonLatToPoint([-180, lat]);
    const end = lonLatToPoint([180, lat]);
    graticuleLayer.appendChild(makeSvgElement("line", {
      class: "graticule",
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    }));
  }
}

function drawLandHints() {
  const landHintLayer = $("landHintLayer");
  landHintLayer.innerHTML = "";
  LAND_HINTS.forEach((path) => {
    landHintLayer.appendChild(makeSvgElement("path", {
      class: "land-hint",
      d: path
    }));
  });
}

function drawRoutes() {
  const routeLayer = $("routeLayer");
  routeLayer.innerHTML = "";

  if (!atlasState.filters.showQuests) {
    return;
  }

  (window.ATLAS_ROUTES || []).forEach((route) => {
    const points = route.coordinates.map((coordinates) => lonLatToPoint(coordinates));
    const d = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
    routeLayer.appendChild(makeSvgElement("path", {
      class: "route-line",
      d,
      "aria-label": route.name
    }));
  });
}

function getMarkerClass(feature) {
  const p = feature.properties || {};
  if (p.layer === "heritage") {
    return "marker-heritage";
  }
  if (atlasState.filters.showQuests) {
    return "marker-quest";
  }
  return "marker-classical";
}

function drawSites() {
  const siteLayer = $("siteLayer");
  siteLayer.innerHTML = "";

  atlasState.filteredFeatures.forEach((feature) => {
    const p = feature.properties || {};
    const point = lonLatToPoint(feature.geometry.coordinates);
    const group = makeSvgElement("g", {
      class: `marker-group ${p.id === atlasState.selectedFeatureId ? "active" : ""}`,
      tabindex: "0",
      role: "button",
      "aria-label": p.name
    });

    const marker = makeSvgElement("circle", {
      class: `site-marker ${getMarkerClass(feature)} ${p.id === atlasState.selectedFeatureId ? "active" : ""}`,
      cx: point.x,
      cy: point.y,
      r: p.layer === "heritage" ? 6 : 5,
      "data-site-id": p.id
    });

    const label = makeSvgElement("text", {
      class: "site-label",
      x: point.x + 9,
      y: point.y - 9
    });
    label.textContent = p.name;

    group.appendChild(marker);
    group.appendChild(label);

    group.addEventListener("click", () => selectFeature(p.id));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectFeature(p.id);
      }
    });

    siteLayer.appendChild(group);
  });
}

function drawLegend() {
  const legend = $("legend");
  legend.innerHTML = "";

  const items = [
    { label: "Classical starter site", className: "marker-classical" },
    { label: "UNESCO-tagged starter", className: "marker-heritage" },
    { label: "Quest layer active", className: "marker-quest" }
  ];

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "legend-item";

    const dot = document.createElement("span");
    dot.className = `legend-dot ${item.className}`;

    const text = document.createElement("span");
    text.textContent = item.label;

    row.appendChild(dot);
    row.appendChild(text);
    legend.appendChild(row);
  });
}

function renderMap() {
  drawRoutes();
  drawSites();
  drawLegend();
}

function initialiseMap() {
  drawGraticule();
  drawLandHints();
  renderMap();
}
