"use strict";

const $ = (id) => document.getElementById(id);

function normalise(value) {
  return String(value || "").toLowerCase().trim();
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function lonLatToPoint(coordinates) {
  const [lon, lat] = coordinates;
  const x = ((lon + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 520;
  return { x, y };
}

function formatCoordinates(coordinates) {
  const [lon, lat] = coordinates;
  const latSuffix = lat >= 0 ? "N" : "S";
  const lonSuffix = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(3)}°${latSuffix}, ${Math.abs(lon).toFixed(3)}°${lonSuffix}`;
}

function featureText(feature) {
  const p = feature.properties || {};
  return [p.name, p.civilisation, p.region, p.period, p.summary, p.quest].join(" ");
}

function makeSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}
