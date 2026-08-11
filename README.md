# Tarkov Season Tools

A static GitHub Pages site for locating Escape from Tarkov season battle pass documents and tracking reward requirements.

## Public page

- `/` — Combined Battle Pass reward tracker, document map, and remaining document calculator

The `/document-map/` route is used internally by the embedded map. The legacy `/battlepass/` route redirects to the home page.

## Features

- Switch between 11 maps
- Filter eight document categories
- Mark completed rewards and subtract their costs from the current 501-document total
- Show per-reward document totals, completion progress, and missing document types
- Keep the document map focused on maps, locations, and category filters
- Use a responsive sidebar on mobile devices
- Show location images and descriptions in a details dialog
- Save battle pass selections and document inventory in the browser

## Adding location data

Add verified locations to `data/locations.js`. Coordinates use percentages relative to the map area (`x` and `y` range from 0 to 100). Only connect map images after confirming their copyright status and permission for reuse.

This is an unofficial fan-made project. Escape from Tarkov trademarks and game assets belong to Battlestate Games.
