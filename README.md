# YouEngineer Code Review

A code review repository for practising GitHub workflow, documentation, HTML, CSS and JavaScript.

## Task List

1. Connect ChatGPT to GitHub successfully.
2. Create the first YouEngineer repositories manually.
3. Open the mini projects and inspect the HTML, CSS and JavaScript.
4. Make one small visual change and commit it with a clear message.
5. Ask for a code review before making the next change.

## Mini Project 01: Medusa's Time Temple

This repo contains a classical civilisation inspired calendar, clock and mythology reader:

```text
index.html
styles.css
script.js
myths.js
myth-reader.js
myths.css
.nojekyll
```

## Mini Project 02: Civilisation Atlas V8

This repo now contains a V8-style MapLibre atlas shell based on the GlobalGrid atlas format:

```text
civilisation-atlas-v8/index.html
civilisation-atlas-v8/ventusv8.css
civilisation-atlas-v8/ventus-corev8engine.js
civilisation-atlas-v8/data/*.geojson
civilisation-atlas-v8/README.md
```

The V8 atlas starts with zero visible layers. Visitors switch on local classical civilisation GeoJSON layers from the SCADA-style layer keys.

The app imports none of the original GlobalGrid data layers.

Current layer groups:

```text
Classical Civilisations
Heritage Starter Layers
Mythic Geography and Routes
```

The map supports:

```text
MapLibre basemap
Layer toggles
Keyword search over visible loaded layers
CSV export of visible loaded features
Fullscreen mode
Reset view
Clear layers
Local GeoJSON datasets
```

## How to Run Locally

Download or clone the repo, then open `index.html` or `civilisation-atlas-v8/index.html` in a browser.

## How to Publish with GitHub Pages

Go to repository Settings, then Pages, then choose:

```text
Source: Deploy from a branch
Branch: main
Folder: /(root)
```

Then save. GitHub Pages should use `index.html` as the entry page.

## Working Principle

Small commits. Clear pull requests. Calm reviews. Professional standards from day one.
