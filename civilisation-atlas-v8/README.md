# Civilisation Atlas V8

A clean educational adaptation of the GlobalGrid-style Atlas V8 pattern.

## Correct Scope

This app is intended to replicate the V8 atlas format:

```text
black HUD
MapLibre map
SCADA-style layer keys
search box
fullscreen mode
CSV export
local GeoJSON layers
```

## What Was Removed

The app imports no GlobalGrid2050 energy, grid, REPD, EV, transport, supermarket, cable or infrastructure datasets.

## Layer Principle

All layers are off by default. The first page load is a blank global base map. Visitors then choose which classical civilisation layers to switch on.

## Local Layer Groups

```text
Classical Civilisations
Heritage Starter Layers
Mythic Geography and Routes
```

## Main Files

```text
index.html
ventusv8.css
ventus-corev8engine.js
data/*.geojson
```

## Data Status

The GeoJSON files are curated starter layers for learning. They are not official complete heritage registers.
