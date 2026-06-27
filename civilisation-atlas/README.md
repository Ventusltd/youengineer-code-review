# Civilisation Atlas

A static GIS-style world map for exploring classical civilisation, ancient sites and student-friendly heritage quests.

## Purpose

This app reuses the architectural discipline of a modular GIS project without importing energy APIs, energy datasets or commercial project data.

It is built as a public learning project using:

```text
HTML
CSS
JavaScript
GeoJSON-style data
SVG map rendering
```

## Files

```text
index.html
atlas.css
atlas-data.js
atlas-state.js
atlas-helpers.js
atlas-map.js
atlas-ui.js
```

## Design Rule

The site does not depend on third-party map APIs. Coordinates are plotted onto a simple equirectangular SVG world map.

## Layers

```text
Classical civilisation sites
UNESCO-tagged starter sites
Student quest prompts
Civilisation filters
Region filters
Search
```

## Data Note

This is a curated educational starter dataset, not an official complete world heritage register.

For a production version, import official public heritage datasets into local GeoJSON files and cite the source in the dataset metadata.
