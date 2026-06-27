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

The project uses plain HTML, CSS and JavaScript with no external libraries.

## Greek Mythology Library

The page includes 71 curated Greek mythology entries. The reader supports:

```text
Keyword search
Theme filtering
Figure and story selection
Random myth selection
Short story summaries
Learning prompts
```

The mythology content is stored locally in `myths.js`.

## Mini Project 02: Civilisation Atlas

This repo also contains a static GIS-style world map for classic civilisation and heritage learning:

```text
civilisation-map.html
civilisation-map.css
civilisation-map.js
civilisation-map-data.js
```

The atlas uses local GeoJSON-style feature data and a custom SVG map renderer. It does not use an external map API or imported energy data.

The map supports:

```text
Layer toggles
Keyword search
UNESCO starter-site filter
Random site selection
Region zoom buttons
Student prompts
Nearest visible neighbour distance
```

The structure follows a config-driven pattern: data and layer definitions sit in `civilisation-map-data.js`, while map rendering and interaction logic sit in `civilisation-map.js`.

## How to Run Locally

Download or clone the repo, then open `index.html` or `civilisation-map.html` in a browser.

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
