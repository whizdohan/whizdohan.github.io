# Tarkov Season Tools

A static GitHub Pages site for locating Escape from Tarkov season battle pass documents and tracking reward requirements.

## Public page

- `/` — Combined Battle Pass reward tracker, document map, and remaining document calculator

The `/document-map/` route is used internally by the embedded map. The legacy `/battlepass/` route redirects to the home page.

## Features

- Switch between 10 interactive tarkov.dev SVG maps, including The Lab
- Pan and zoom maps with Leaflet controls
- Open location photos and descriptions from document markers
- Filter eight document categories
- Mark completed rewards and subtract their costs from the current 501-document total
- Show per-reward document totals, completion progress, and missing document types
- Keep the document map focused on maps, locations, and category filters
- Use a responsive sidebar on mobile devices
- Show location images and descriptions in a details dialog
- Save battle pass selections and document inventory in the browser

## Adding location data

Add verified locations to `data/locations.js`. Coordinates use percentages relative to the map area (`x` and `y` range from 0 to 100).

## Interactive map source

The interactive viewer uses Leaflet 1.9.4 with SVG map files from the community-maintained [tarkovdata](https://github.com/TarkovTracker/tarkovdata) repository used by [tarkov.dev](https://tarkov.dev/). Local copies are stored under `assets/` to avoid runtime failures caused by unavailable third-party CDNs. Source attribution remains visible inside the viewer and in the site footer.

The interface supports English, Korean, and Japanese. The selected language is stored in the browser and restored on later visits.

This is an unofficial fan-made project. Escape from Tarkov trademarks and game assets belong to Battlestate Games.
