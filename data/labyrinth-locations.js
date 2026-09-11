/* The Labyrinth document locations. Coordinates use the site's 0-100 map scale. */
(function(){
  const labyrinthLocations = [];

  if(!Array.isArray(window.DOCUMENT_LOCATIONS)) window.DOCUMENT_LOCATIONS=[];
  window.DOCUMENT_LOCATIONS.push(...labyrinthLocations);
})();
