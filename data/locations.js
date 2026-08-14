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
  },
  {
    id: "woods-technical-0611-0817",
    map: "woods",
    category: "technical",
    x: 61.1,
    y: 81.7,
    title: "기술 문서",
    provider: "위즈",
    comment: "천막 아래 나무 상자 위에 놓여 있습니다.",
    previewImage: "../assets/locations/woods-technical-0611-0817.webp",
    detailImage: "../assets/locations/woods-technical-0611-0817.webp"
  },
  {
    id: "factory-blueprints-0688-0461",
    map: "factory",
    category: "blueprints",
    x: 68.8,
    y: 46.1,
    title: "설계도",
    provider: "위즈",
    comment: "금속 캐비닛 위에 놓여 있습니다.",
    previewImage: "../assets/locations/factory-blueprints-0688-0461.webp",
    detailImage: "../assets/locations/factory-blueprints-0688-0461.webp"
  },
  {
    id: "factory-project-0055-0361",
    map: "factory",
    category: "project",
    x: 5.5,
    y: 36.1,
    title: "프로젝트 문서",
    provider: "위즈",
    comment: "지게차 옆 창가 턱 위에 놓여 있습니다."
  },
  {
    id: "reserve-pmc-0296-0323",
    map: "reserve",
    category: "pmc",
    x: 29.6,
    y: 32.3,
    title: "PMC 인사 문서",
    provider: "위즈",
    comment: "콘크리트 방벽 옆 상자 위에 놓여 있습니다."
  }
];
