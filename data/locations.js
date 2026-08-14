/*
 * Add only verified locations to the array below.
 * x and y are percentage coordinates from 0 to 100 across the map.
 * provider and comment are displayed with the document name in the marker popup.
 * previewImage should be a small thumbnail for fast popup loading. detailImage
 * is the larger image used by the optional details dialog.
 *
 * Example:
 * { id: "factory-001", map: "factory", category: "technical", x: 42.5, y: 61.2,
 *   title: "Second-floor office shelf", description: "On the metal shelf opposite the safe",
 *   previewImage: "assets/locations/factory-001.webp" }
 */
window.DOCUMENT_LOCATIONS = [
  {
    id: "woods-financial-060-081",
    map: "woods",
    category: "financial",
    x: 60.0,
    y: 80.8,
    title: "재정 문서",
    provider: "위즈",
    comment: "캠프 내부 바닥에 놓여 있습니다.",
    previewImage: "../assets/locations/woods-financial-060-081-thumb.webp",
    detailImage: "../assets/locations/woods-financial-060-081.webp"
  }
];
