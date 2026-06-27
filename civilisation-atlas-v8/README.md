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
satellite mode
CSV export
local GeoJSON layers
```

## What Was Removed

The app imports no original atlas data layers.

## Layer Principle

All layers are off by default. The first page load is a blank global base map. Visitors then choose which classical civilisation layers to switch on.

## Satellite Mode

The Satellite button switches on imagery so visitors can inspect the real-world location behind the local GeoJSON markers.

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
