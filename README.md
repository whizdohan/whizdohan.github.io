# Tarkov Season Tools

A static GitHub Pages site for locating Escape from Tarkov season battle pass documents and tracking reward requirements.

## Public page

- `/` — Combined Battle Pass reward tracker, document map, and remaining document calculator

The `/document-map/` route is used internally by the embedded map. The legacy `/battlepass/` route redirects to the home page.

## Features

- Switch between 10 RE3MR maps
- Filter eight document categories
- Mark completed rewards and subtract their costs from the current 501-document total
- Show per-reward document totals, completion progress, and missing document types
- Keep the document map focused on maps, locations, and category filters
- Use a responsive sidebar on mobile devices
- Show location images and descriptions in a details dialog
- Save battle pass selections and document inventory in the browser

## Adding location data

Add verified locations to `data/locations.js`. Coordinates use percentages relative to the map area (`x` and `y` range from 0 to 100).

## Map artwork and license

The map artwork is created by [re3mr](https://reemr.se/) and loaded from the creator's map servers. It is displayed at a reduced size for web use under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-nc-sa/4.0/). Individual map source pages are linked from the attribution overlay inside the map viewer.

This site must remain noncommercial while it uses this map artwork. Any adapted map artwork must be distributed under the same license, with attribution and a description of changes.

This is an unofficial fan-made project. Escape from Tarkov trademarks and game assets belong to Battlestate Games.
