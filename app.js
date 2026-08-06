const MAPS = [
  ["customs", "Customs", "세관", "CST"],
  ["ground-zero", "Ground Zero", "그라운드 제로", "GZ"],
  ["factory", "Factory", "공장", "FCT"],
  ["woods", "Woods", "삼림", "WDS"],
  ["reserve", "Reserve", "리저브", "RSV"],
  ["shoreline", "Shoreline", "해안선", "SHR"],
  ["interchange", "Interchange", "인터체인지", "INT"],
  ["lighthouse", "Lighthouse", "등대", "LHT"],
  ["streets", "Streets of Tarkov", "타르코프 시내", "SOT"],
  ["laboratory", "The Lab", "연구소", "LAB"],
  ["labyrinth", "The Labyrinth", "미궁", "LBY"]
].map(([id, name, ko, code]) => ({ id, name, ko, code }));

const CATEGORIES = {
  technical: { name: "Technical", required: 86, color: "#d3a759" },
  pmc: { name: "PMC", required: 39, color: "#bd7469" },
  project: { name: "Project", required: 55, color: "#70a0a7" },
  blueprints: { name: "Blueprints", required: 81, color: "#738db5" },
  test: { name: "Test", required: 48, color: "#a08ab4" },
  user: { name: "User", required: 40, color: "#8caa70" },
  medical: { name: "Medical", required: 67, color: "#b06c73" },
  financial: { name: "Financial", required: 83, color: "#b99a62" }
};

const STORAGE_KEY = "tarkov-document-map:v1";
const state = loadState();
const locations = Array.isArray(window.DOCUMENT_LOCATIONS) ? window.DOCUMENT_LOCATIONS : [];

const els = {
  mapSelect: document.querySelector("#map-select"),
  currentMapName: document.querySelector("#current-map-name"),
  mapCode: document.querySelector("#map-code"),
  categoryList: document.querySelector("#category-list"),
  markerLayer: document.querySelector("#marker-layer"),
  emptyState: document.querySelector("#empty-state"),
  visibleCount: document.querySelector("#visible-count"),
  coordinate: document.querySelector("#coordinate"),
  totalOwned: document.querySelector("#total-owned"),
  totalRequired: document.querySelector("#total-required"),
  totalProgressBar: document.querySelector("#total-progress-bar"),
  totalProgressPercent: document.querySelector("#total-progress-percent"),
  progressDialog: document.querySelector("#progress-dialog"),
  progressEditor: document.querySelector("#progress-editor"),
  detailDialog: document.querySelector("#detail-dialog"),
  sidebar: document.querySelector("#sidebar"),
  backdrop: document.querySelector("#sidebar-backdrop"),
  menuButton: document.querySelector("#menu-button")
};

function defaultState() {
  return {
    map: "factory",
    filters: Object.keys(CATEGORIES),
    owned: Object.fromEntries(Object.keys(CATEGORIES).map(key => [key, 0])),
    found: []
  };
}

function loadState() {
  try {
    return { ...defaultState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function init() {
  MAPS.forEach(map => els.mapSelect.add(new Option(`${map.name} · ${map.ko}`, map.id)));
  els.mapSelect.value = state.map;
  renderCategories();
  renderProgressEditor();
  updateMap();
  updateProgress();
  bindEvents();
}

function renderCategories() {
  els.categoryList.innerHTML = Object.entries(CATEGORIES).map(([key, category]) => `
    <label class="category-row">
      <input type="checkbox" value="${key}" ${state.filters.includes(key) ? "checked" : ""} />
      <span><i class="category-swatch" style="--swatch:${category.color}"></i><strong>${category.name}</strong></span>
      <small>${category.required}개</small>
    </label>
  `).join("");
}

function renderProgressEditor() {
  els.progressEditor.innerHTML = Object.entries(CATEGORIES).map(([key, category]) => {
    const owned = clamp(Number(state.owned[key]) || 0, 0, category.required);
    return `
      <div class="progress-row">
        <i class="category-swatch" style="--swatch:${category.color}"></i>
        <label for="owned-${key}">${category.name}</label>
        <input id="owned-${key}" data-category="${key}" type="number" min="0" max="${category.required}" value="${owned}" />
        <output>잔여 ${category.required - owned}개</output>
      </div>
    `;
  }).join("");
}

function updateMap() {
  const map = MAPS.find(item => item.id === state.map) || MAPS[2];
  els.currentMapName.textContent = `${map.name} · ${map.ko}`;
  els.mapCode.textContent = map.code;
  els.mapSelect.value = map.id;

  const filtered = locations.filter(location => location.map === map.id && state.filters.includes(location.category));
  els.markerLayer.innerHTML = filtered.map(location => {
    const category = CATEGORIES[location.category] || CATEGORIES.technical;
    const found = state.found.includes(location.id);
    return `<button class="map-marker ${found ? "found" : ""}" data-id="${location.id}" style="left:${location.x}%;top:${location.y}%;--marker:${category.color}" aria-label="${escapeHtml(location.title || "문서 위치")}"></button>`;
  }).join("");

  els.emptyState.hidden = filtered.length > 0;
  els.visibleCount.textContent = `표시 위치 ${filtered.length}개`;
  saveState();
}

function updateProgress() {
  const required = Object.values(CATEGORIES).reduce((sum, item) => sum + item.required, 0);
  const owned = Object.entries(CATEGORIES).reduce((sum, [key, item]) => sum + clamp(Number(state.owned[key]) || 0, 0, item.required), 0);
  const percent = Math.round((owned / required) * 100);
  els.totalRequired.textContent = required;
  els.totalOwned.textContent = owned;
  els.totalProgressPercent.textContent = `${percent}%`;
  els.totalProgressBar.style.width = `${percent}%`;
  saveState();
}

function openDetail(id) {
  const location = locations.find(item => item.id === id);
  if (!location) return;
  const category = CATEGORIES[location.category];
  document.querySelector("#detail-category").textContent = category?.name || "DOCUMENT LOCATION";
  document.querySelector("#detail-title").textContent = location.title || "위치 상세";
  document.querySelector("#detail-description").textContent = location.description || "상세 설명이 아직 등록되지 않았습니다.";
  const image = location.detailImage || location.previewImage;
  document.querySelector("#detail-image").innerHTML = image ? `<img src="${image}" alt="${escapeHtml(location.title || "위치 상세")}" />` : "이미지 준비 중";
  const button = document.querySelector("#found-button");
  button.dataset.id = id;
  button.textContent = state.found.includes(id) ? "발견 표시 해제" : "발견 완료로 표시";
  els.detailDialog.showModal();
}

function bindEvents() {
  els.mapSelect.addEventListener("change", event => {
    state.map = event.target.value;
    updateMap();
    closeSidebar();
  });

  els.categoryList.addEventListener("change", event => {
    const key = event.target.value;
    state.filters = event.target.checked ? [...new Set([...state.filters, key])] : state.filters.filter(item => item !== key);
    updateMap();
  });

  document.querySelector("#toggle-all").addEventListener("click", event => {
    const allEnabled = state.filters.length === Object.keys(CATEGORIES).length;
    state.filters = allEnabled ? [] : Object.keys(CATEGORIES);
    renderCategories();
    updateMap();
    event.currentTarget.textContent = allEnabled ? "전체 선택" : "전체 해제";
  });

  document.querySelector("#progress-button").addEventListener("click", () => {
    renderProgressEditor();
    els.progressDialog.showModal();
  });

  els.progressEditor.addEventListener("input", event => {
    if (!event.target.matches("input[data-category]")) return;
    const key = event.target.dataset.category;
    const max = CATEGORIES[key].required;
    const value = clamp(Number(event.target.value) || 0, 0, max);
    state.owned[key] = value;
    event.target.nextElementSibling.textContent = `잔여 ${max - value}개`;
    updateProgress();
  });

  document.querySelector("#reset-progress").addEventListener("click", () => {
    if (!confirm("보유량과 발견 체크를 모두 초기화할까요?")) return;
    const fresh = defaultState();
    state.owned = fresh.owned;
    state.found = fresh.found;
    state.filters = fresh.filters;
    renderCategories();
    updateMap();
    updateProgress();
  });

  els.markerLayer.addEventListener("click", event => {
    const marker = event.target.closest("[data-id]");
    if (marker) openDetail(marker.dataset.id);
  });

  document.querySelector("#detail-close").addEventListener("click", () => els.detailDialog.close());
  document.querySelector("#found-button").addEventListener("click", event => {
    const id = event.currentTarget.dataset.id;
    state.found = state.found.includes(id) ? state.found.filter(item => item !== id) : [...state.found, id];
    saveState();
    els.detailDialog.close();
    updateMap();
  });

  document.querySelector("#map-stage").addEventListener("pointermove", event => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 1000);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 1000);
    els.coordinate.textContent = `X ${String(x).padStart(3, "0")} · Y ${String(y).padStart(3, "0")}`;
  });

  els.menuButton.addEventListener("click", () => {
    const open = !els.sidebar.classList.contains("open");
    els.sidebar.classList.toggle("open", open);
    els.backdrop.classList.toggle("open", open);
    els.menuButton.setAttribute("aria-expanded", String(open));
  });
  els.backdrop.addEventListener("click", closeSidebar);
}

function closeSidebar() {
  els.sidebar.classList.remove("open");
  els.backdrop.classList.remove("open");
  els.menuButton.setAttribute("aria-expanded", "false");
}

function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]); }

init();
