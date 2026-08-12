# Tarkov Season Tools

A static GitHub Pages site for locating Escape from Tarkov season battle pass documents and tracking reward requirements.

## Public page

- `/` — Combined Battle Pass reward tracker, document map, and remaining document calculator

The `/document-map/` route is used internally by the embedded map. The legacy `/battlepass/` route redirects to the home page.

## Features

- Switch between 10 tarkov.dev 2D map images, including The Lab
- Pan and zoom local map images with Leaflet controls, double-click, touch, and the mouse wheel
- Show live image-relative percentage coordinates while the pointer moves over the map
- Save location reports and attached photos in the current browser with IndexedDB
- Review and delete locally saved reports from the report list
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

The interactive viewer uses Leaflet 1.9.4 with local cached copies of the public 2D JPG map images provided by [tarkov.dev](https://tarkov.dev/). Each map is loaded once as a same-origin image overlay, avoiding browser SVG rendering failures and third-party request blocking while preserving pan, zoom, markers, and photo popups. Source attribution remains visible inside the viewer and in the site footer.

## Credits and original sources

This fan project is possible because of the work shared by the Escape from Tarkov and open-source communities.

- **Game and original assets:** *Escape from Tarkov*, its trademarks, names, reward artwork, screenshots, and other game assets belong to [Battlestate Games](https://www.escapefromtarkov.com/). This project is not affiliated with or endorsed by Battlestate Games.
- **Map distribution and community data:** The local map files were obtained from [tarkov.dev](https://tarkov.dev/) and its open-source project, maintained by [The Hideout](https://github.com/the-hideout). The tarkov.dev source is released under the [MIT License](https://github.com/the-hideout/tarkov-dev/blob/main/LICENSE), with copyright attributed there to Oskar Risberg.
- **Original vector map project:** The cached JPG files are optimized derivatives of maps from the [Escape from Tarkov SVG Maps Project](https://github.com/the-hideout/tarkov-dev-svg-maps). The map work is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) and remains credited to its community creators and contributors.
- **Interactive map library:** [Leaflet 1.9.4](https://leafletjs.com/) was created by [Volodymyr Agafonkin](https://agafonkin.com/) and is maintained by the Leaflet contributors. It is used under the [BSD 2-Clause License](https://github.com/Leaflet/Leaflet/blob/main/LICENSE).

### Map creator credits

The contributor names below are based on the upstream commit history for each original SVG map. Links point to the corresponding source files.

| Map | Original source | Credited contributors |
| --- | --- | --- |
| Customs | [Customs.svg](https://github.com/the-hideout/tarkov-dev-svg-maps/blob/main/Customs.svg) | [Shebuka](https://github.com/Shebuka), [thaddeus](https://github.com/thaddeus) |
| Factory | [Factory.svg](https://github.com/the-hideout/tarkov-dev-svg-maps/blob/main/Factory.svg) | [Shebuka](https://github.com/Shebuka), [thaddeus](https://github.com/thaddeus), [Hanzik](https://github.com/Hanzik) |
| Ground Zero | [GroundZero.svg](https://github.com/the-hideout/tarkov-dev-svg-maps/blob/main/GroundZero.svg) | [Shebuka](https://github.com/Shebuka) |
| Interchange | [Interchange.svg](https://github.com/the-hideout/tarkov-dev-svg-maps/blob/main/Interchange.svg) | [Shebuka](https://github.com/Shebuka), [Razzmatazzz](https://github.com/Razzmatazzz), [thaddeus](https://github.com/thaddeus) |
| The Lab | [Labs.svg](https://github.com/the-hideout/tarkov-dev-svg-maps/blob/main/Labs.svg) | [Razzmatazzz](https://github.com/Razzmatazzz), [Shebuka](https://github.com/Shebuka) |
| Lighthouse | [Lighthouse.svg](https://github.com/the-hideout/tarkov-dev-svg-maps/blob/main/Lighthouse.svg) | [Shebuka](https://github.com/Shebuka), [Razzmatazzz](https://github.com/Razzmatazzz), [thaddeus](https://github.com/thaddeus) |
| Reserve | [Reserve.svg](https://github.com/the-hideout/tarkov-dev-svg-maps/blob/main/Reserve.svg) | [Shebuka](https://github.com/Shebuka), [Razzmatazzz](https://github.com/Razzmatazzz), [thaddeus](https://github.com/thaddeus), [LuccaAnthoine](https://github.com/LuccaAnthoine), [TheGlu3guy](https://github.com/TheGlu3guy) |
| Shoreline | [Shoreline.svg](https://github.com/the-hideout/tarkov-dev-svg-maps/blob/main/Shoreline.svg) | [Shebuka](https://github.com/Shebuka), [Razzmatazzz](https://github.com/Razzmatazzz), [thaddeus](https://github.com/thaddeus) |
| Streets of Tarkov | [StreetsOfTarkov.svg](https://github.com/the-hideout/tarkov-dev-svg-maps/blob/main/StreetsOfTarkov.svg) | [Shebuka](https://github.com/Shebuka), [Razzmatazzz](https://github.com/Razzmatazzz) |
| Woods | [Woods.svg](https://github.com/the-hideout/tarkov-dev-svg-maps/blob/main/Woods.svg) | [Shebuka](https://github.com/Shebuka), [thaddeus](https://github.com/thaddeus), [Razzmatazzz](https://github.com/Razzmatazzz), [Hanzik](https://github.com/Hanzik) |

For the complete and continuously updated contributor list, see the [SVG Maps Project contributors](https://github.com/the-hideout/tarkov-dev-svg-maps/graphs/contributors) and [tarkov.dev contributors](https://github.com/the-hideout/tarkov-dev/graphs/contributors).

The interface supports English, Korean, and Japanese. The selected language is stored in the browser and restored on later visits.

Location reports are private browser data. GitHub Pages has no report backend, so reports and photos are not uploaded or shared between devices.
The report interface is currently hidden from the header while its browser-local implementation remains available in the source.

This is an unofficial fan-made project. Escape from Tarkov trademarks and game assets belong to Battlestate Games.
