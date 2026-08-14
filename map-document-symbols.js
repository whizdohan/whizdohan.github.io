const MAP_DOCUMENT_CATEGORIES = {
  customs: ["financial", "project"],
  "ground-zero": ["user", "medical"],
  factory: ["project", "blueprints"],
  woods: ["test", "technical"],
  reserve: ["project", "pmc"],
  shoreline: ["test", "technical"],
  interchange: ["financial", "blueprints"],
  lighthouse: ["pmc", "technical"],
  streets: ["user", "financial"],
  laboratory: ["user", "medical"],
  icebreaker: ["pmc", "test"],
  labyrinth: ["blueprints", "medical"]
};

renderMapDocumentSymbols = function renderMapDocumentSymbolsByMap() {
  elements.mapSelector.querySelectorAll("button[data-map]").forEach(button => {
    const label = button.querySelector(".map-choice-label")?.textContent.trim() || button.textContent.trim();
    const categories = MAP_DOCUMENT_CATEGORIES[button.dataset.map] || [];

    const labelElement = document.createElement("span");
    labelElement.className = "map-choice-label";
    labelElement.textContent = label;

    const symbols = document.createElement("span");
    symbols.className = "map-choice-documents";
    symbols.setAttribute("aria-label", categories.map(key => t(`categories.${key}`)).join(", "));

    categories.forEach(key => {
      const image = document.createElement("img");
      image.className = "map-choice-document-icon";
      image.src = `assets/document-icons/${DOCUMENT_ICON_FILES[key]}?v=1`;
      image.alt = "";
      image.title = t(`categories.${key}`);
      image.loading = "lazy";
      image.decoding = "async";
      symbols.append(image);
    });

    button.replaceChildren(symbols, labelElement);
  });
};

renderMapDocumentSymbols();
