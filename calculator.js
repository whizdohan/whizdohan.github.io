const CATEGORIES = {
  financial: { name: "Financial", total: 56, code: "FIN", color: "#c7a662" },
  pmc: { name: "PMC Personnel", total: 57, code: "PMC", color: "#b97b70" },
  project: { name: "Project", total: 61, code: "PRJ", color: "#71a2a3" },
  blueprints: { name: "Blueprints", total: 56, code: "BLU", color: "#7892ba" },
  test: { name: "Test", total: 54, code: "TST", color: "#9e8bb2" },
  user: { name: "User", total: 87, code: "USR", color: "#8faa74" },
  medical: { name: "Medical", total: 67, code: "MED", color: "#b66f76" },
  technical: { name: "Technical", total: 63, code: "TEC", color: "#d1ac61" }
};

const PAGES = [
  { total: 15, rewards: [
    ["Dogtag", { financial: 1 }],
    ["TarCoins 50", { project: 2, blueprints: 1 }],
    ["Burn Poster", { test: 2, user: 1 }],
    ["Black Division Gear Crate", { financial: 1, blueprints: 2 }],
    ["Black Wood Ceiling", { project: 2, user: 2, medical: 1 }]
  ]},
  { total: 20, rewards: [
    ["Gentex Ops-Core SOTR Respirator", { blueprints: 2, medical: 2 }],
    ["Red Hawaii", { financial: 3, project: 3, medical: 1 }],
    ["Black Division Gear Crate", { test: 3 }],
    ["Scorpion Target", { pmc: 1, user: 1, blueprints: 1 }],
    ["TarCoins 50", { financial: 2, project: 1 }]
  ]},
  { total: 25, rewards: [
    ["Mystery Ranch Nice Frame Load Sling", { financial: 1, pmc: 1, user: 2 }],
    ["Black Division Gear Crate", { pmc: 2, test: 2, user: 1 }],
    ["Black Herringbone", { blueprints: 2, test: 2, user: 2, technical: 1 }],
    ["TarCoins 50", { financial: 2, project: 2, technical: 1 }],
    ["Heart", { financial: 1, pmc: 1, medical: 2 }]
  ]},
  { total: 30, rewards: [
    ["Dogtag", { financial: 1, project: 2, blueprints: 2 }],
    ["Microtech Jagdkommando Knife", { financial: 2, pmc: 1, user: 4, technical: 3 }],
    ["TarCoins 50", { user: 2, technical: 3 }],
    ["Beware the Bear Poster", { pmc: 1, test: 2, user: 2 }],
    ["Black Division Gear Crate", { pmc: 1, blueprints: 2, medical: 2 }]
  ]},
  { total: 35, rewards: [
    ["Orange Hawaii", { financial: 3, project: 2, blueprints: 1, medical: 2, technical: 2 }],
    ["TarCoins 50", { financial: 1, blueprints: 4, user: 1, technical: 1 }],
    ["Black Division Target", { pmc: 2, user: 1, medical: 2 }],
    ["Black Division Gear Crate", { test: 3, user: 1, technical: 2 }],
    ["Ferro Concepts FCPC V5 (Black Division)", { project: 3, user: 2, technical: 2 }]
  ]},
  { total: 36, rewards: [
    ["Knyazev", { pmc: 4, test: 2, medical: 3, technical: 4 }],
    ["O'Connor", { pmc: 3, blueprints: 3, user: 4, technical: 2 }],
    ["Howa Type 20 5.56x45", { pmc: 2, project: 2, user: 1, technical: 6 }]
  ]},
  { total: 45, rewards: [
    ["Dogtag", { financial: 2, project: 5, user: 3 }],
    ["TarCoins 50", { financial: 4, test: 3, medical: 2 }],
    ["Scorpion Upper", { financial: 3, blueprints: 3, user: 5, technical: 2 }],
    ["Scorpion Lower", { pmc: 3, project: 2, blueprints: 5, user: 3 }]
  ]},
  { total: 43, rewards: [
    ["Black Division Gear Crate", { test: 2, user: 2, medical: 2 }],
    ["TarCoins 50", { financial: 4, project: 4, test: 5, technical: 1 }],
    ["White Accent Walls", { pmc: 3, blueprints: 6, user: 2, technical: 2 }],
    ["Arch", { pmc: 1, project: 3, medical: 2 }],
    ["Dome", { project: 1, blueprints: 2, test: 1 }]
  ]},
  { total: 50, rewards: [
    ["Spiritus Systems LV-119 (Black Division V2)", { blueprints: 2, test: 2, medical: 4, technical: 4 }],
    ["TarCoins 50", { project: 2, blueprints: 3, technical: 1 }],
    ["Tasmanian Tiger Modular Pack 45 Plus", { financial: 2, project: 2, user: 5 }],
    ["Black Division Gear Crate", { project: 1, test: 2, medical: 2 }],
    ["Server Room", { financial: 4, pmc: 4, blueprints: 2, user: 2, technical: 6 }]
  ]},
  { total: 60, rewards: [
    ["Anton", { financial: 2, pmc: 5, test: 6, user: 5, medical: 2 }],
    ["Garrett", { project: 2, blueprints: 5, test: 6, user: 2, technical: 5 }],
    ["Black Division Gear Crate", { financial: 3, medical: 3, technical: 1 }],
    ["TarCoins 100", { pmc: 2, project: 2, user: 5, medical: 4 }]
  ]},
  { total: 65, rewards: [
    ["Dogtag", { financial: 2, pmc: 4, test: 2, user: 3 }],
    ["TarCoins 150", { financial: 5, test: 3, user: 3, medical: 5 }],
    ["Knyazev (After Battle)", { financial: 3, blueprints: 3, user: 5, medical: 5, technical: 3 }],
    ["O'Connor (After Battle)", { pmc: 3, test: 5, user: 3, medical: 5, technical: 3 }]
  ]},
  { total: 77, rewards: [
    ["Norinco QBZ-191 5.8x42", { pmc: 5, project: 7, blueprints: 5, user: 6, medical: 6 }],
    ["Nocturnal Upper", { financial: 4, pmc: 3, project: 5, test: 1, user: 1, medical: 6, technical: 5 }],
    ["Nocturnal Lower", { pmc: 5, project: 6, user: 5, medical: 4, technical: 3 }]
  ]}
].map((page, pageIndex) => ({
  ...page,
  number: pageIndex + 1,
  cumulative: 0,
  rewards: page.rewards.map(([name, cost], rewardIndex) => ({
    id: `P${pageIndex + 1}-${rewardIndex + 1}`,
    name,
    cost,
    total: Object.values(cost).reduce((sum, value) => sum + value, 0)
  }))
}));

const SPRITE_COLUMNS = 8;
const SPRITE_ROWS = 7;
const REWARD_SPRITES = Object.fromEntries(PAGES.flatMap(page => page.rewards).map((reward, index) => [reward.id, {
  x: index % SPRITE_COLUMNS,
  y: Math.floor(index / SPRITE_COLUMNS)
}]));

function spriteStyle(rewardId) {
  const sprite = REWARD_SPRITES[rewardId];
  if (!sprite) return "";
  const x = sprite.x / (SPRITE_COLUMNS - 1) * 100;
  const y = sprite.y / (SPRITE_ROWS - 1) * 100;
  return `background-position:${x}% ${y}%`;
}

let runningTotal = 0;
PAGES.forEach(page => { runningTotal += page.total; page.cumulative = runningTotal; });

const STORAGE_KEY = "tarkov-document-map:v1";
const SELECTION_KEY = "tarkov-battle-pass:selected:v2";
const LANGUAGE_KEY = "tarkov-tools:language:v1";
const SUPPORTED_LANGUAGES = ["en", "ko", "ja"];
const MAP_VIEWER_VERSION = "17";
const REPORT_DB_NAME = "tarkov-location-reports";
const REPORT_STORE_NAME = "reports";
const REPORT_PHOTO_LIMIT = 10 * 1024 * 1024;
const MAP_TRANSLATION_KEYS = { customs: "customs", "ground-zero": "groundZero", factory: "factory", woods: "woods", reserve: "reserve", shoreline: "shoreline", interchange: "interchange", lighthouse: "lighthouse", streets: "streets", laboratory: "laboratory", icebreaker: "icebreaker", labyrinth: "labyrinth" };
const categoryKeys = Object.keys(CATEGORIES);
let messages = {};
let currentLanguage = "en";

function nestedValue(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function t(key, variables = {}) {
  const template = nestedValue(messages, key) || key;
  return Object.entries(variables).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
}

async function loadLanguage(language = localStorage.getItem(LANGUAGE_KEY) || navigator.language.slice(0, 2)) {
  currentLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : "en";
  try {
    const response = await fetch(`locales/${currentLanguage}.json?v=12`);
    if (!response.ok) throw new Error(`Language file: ${response.status}`);
    messages = await response.json();
  } catch (error) {
    console.error(error);
    return;
  }
  document.documentElement.lang = currentLanguage;
  localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  document.querySelector("#language-select").value = currentLanguage;
  document.title = t("meta.title");
  document.querySelector('meta[name="description"]').content = t("meta.description");
  document.querySelectorAll("[data-i18n]").forEach(element => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => { element.placeholder = t(element.dataset.i18nPlaceholder); });
  renderSeasonCountdown();
  refreshReportMapOptions();
  if (elements.reportList) await renderReports();
}

const SEASON_END_DATE = new Date(2026, 11, 7);
const DAY_MS = 24 * 60 * 60 * 1000;

function renderSeasonCountdown() {
  const element = document.querySelector("#season-countdown");
  if (!element) return;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.ceil((SEASON_END_DATE - today) / DAY_MS);
  element.textContent = days >= 0 ? t("seasonCountdown.active", { days }) : t("seasonCountdown.ended");
  element.classList.toggle("urgent", days >= 0 && days <= 7);
  element.classList.toggle("ended", days < 0);
}

function defaultOwned() {
  return Object.fromEntries(categoryKeys.map(key => [key, 0]));
}

function loadSharedState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { ...stored, owned: { ...defaultOwned(), ...(stored.owned || {}) } };
  } catch {
    return { owned: defaultOwned() };
  }
}

function loadSelection() {
  try {
    const stored = JSON.parse(localStorage.getItem(SELECTION_KEY) || "{}");
    return {
      page: Math.min(Math.max(Number(stored.page) || 1, 1), PAGES.length),
      selected: new Set(Array.isArray(stored.selected) ? stored.selected : [])
    };
  } catch {
    return { page: 1, selected: new Set() };
  }
}

const sharedState = loadSharedState();
const selectionState = loadSelection();

const elements = {
  pageTabs: document.querySelector("#page-tabs"),
  rewardTrack: document.querySelector("#reward-track"),
  documentBelt: document.querySelector("#document-belt"),
  mapFrame: document.querySelector("#document-map-frame"),
  mapSelector: document.querySelector("#map-selector-list"),
  reportButton: document.querySelector("#report-button"),
  reportDialog: document.querySelector("#report-dialog"),
  reportClose: document.querySelector("#report-close"),
  reportForm: document.querySelector("#report-form"),
  reportMap: document.querySelector("#report-map"),
  reportCoordinate: document.querySelector("#report-coordinate"),
  coordinateCopy: document.querySelector("#coordinate-copy"),
  reportPhoto: document.querySelector("#report-photo"),
  reportPhotoPreview: document.querySelector("#report-photo-preview"),
  reportNote: document.querySelector("#report-note"),
  reportList: document.querySelector("#report-list"),
  reportCount: document.querySelector("#report-count"),
  siteToast: document.querySelector("#site-toast")
};

let reportDbPromise;
let reportPreviewUrl;
let reportObjectUrls = [];
let siteToastTimer;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function mapViewerUrl(map) {
  return `document-map/?embedded=1&v=${MAP_VIEWER_VERSION}&map=${encodeURIComponent(map)}&lang=${currentLanguage}`;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedState));
  localStorage.setItem(SELECTION_KEY, JSON.stringify({ page: selectionState.page, selected: [...selectionState.selected] }));
}

function pageByNumber(number) {
  return PAGES[number - 1];
}

function remainingRequirements() {
  const requirements = Object.fromEntries(categoryKeys.map(key => [key, 0]));
  PAGES.flatMap(page => page.rewards).filter(reward => !selectionState.selected.has(reward.id)).forEach(reward => {
    Object.entries(reward.cost).forEach(([key, value]) => { requirements[key] += value; });
  });
  return requirements;
}

function rewardCostOverlay(reward) {
  const rows = Object.entries(reward.cost).map(([key, value]) => `
    <span class="reward-cost-row" data-document="${key}" style="--cost-color:${CATEGORIES[key].color}">
      <i></i><b>${t(`categories.${key}`)}</b><strong>${value}</strong>
    </span>`).join("");
  return `<span class="reward-cost-overlay" aria-hidden="true">
    <span class="reward-cost-title">${t("reward.requiredDocuments")}</span>
    <span class="reward-cost-list">${rows}</span>
    <span class="reward-cost-total">${t("reward.total")} <b>${reward.total}</b></span>
  </span>`;
}

function renderTabs() {
  elements.pageTabs.innerHTML = PAGES.map(page => `<button type="button" data-page="${page.number}" class="page-tab ${page.number === selectionState.page ? "active" : ""}" aria-current="${page.number === selectionState.page ? "page" : "false"}"><span>${String(page.number).padStart(2, "0")}</span><small>${page.total}</small></button>`).join("");
}

function renderRewards() {
  const page = pageByNumber(selectionState.page);
  elements.rewardTrack.innerHTML = page.rewards.map(reward => {
    const selected = selectionState.selected.has(reward.id);
    return `<button type="button" class="reward-card ${selected ? "selected" : ""}" data-reward="${reward.id}" aria-pressed="${selected}">
      <span class="reward-index">${reward.id}</span>
      <span class="reward-visual has-image"><span class="reward-sprite" style="${spriteStyle(reward.id)}"></span></span>
      <span class="reward-name">${reward.name}</span>
      <span class="reward-required">${t("reward.requiredDocs")}: <b>${reward.total}</b></span>
      ${rewardCostOverlay(reward)}
      <span class="selected-mark">✓ ${t("reward.complete")}</span>
    </button>`;
  }).join("");
}

function renderDocumentBelt(requirements = remainingRequirements()) {
  elements.documentBelt.innerHTML = categoryKeys.map(key => {
    const category = CATEGORIES[key];
    const needed = requirements[key];
    return `<div class="progress-document-item ${needed ? "active" : "complete"}" data-document="${key}" style="--color:${category.color}" title="${t(`categories.${key}`)}: ${needed}">
      <i class="document-icon"></i><span><small>${category.code}</small><b>${needed}</b></span>
    </div>`;
  }).join("");
}

function renderProgress() {
  const requirements = remainingRequirements();
  const total = Object.values(requirements).reduce((sum, value) => sum + value, 0);
  const completedTotal = 501 - total;
  const percent = Math.round(completedTotal / 501 * 100);

  document.querySelector("#overall-progress-percent").textContent = `${percent}%`;
  document.querySelector("#overall-progress-bar").style.width = `${percent}%`;
  document.querySelector("#overall-progress-copy").textContent = `${completedTotal} / 501 ${t("progress.documents")}`;
  renderDocumentBelt(requirements);
  save();
}

function renderAll() {
  renderTabs();
  renderRewards();
  renderProgress();
}

function goToPage(page) {
  selectionState.page = clamp(page, 1, PAGES.length);
  renderAll();
}

function activeMapId() {
  return elements.mapSelector.querySelector("button.active")?.dataset.map || "factory";
}

function refreshReportMapOptions() {
  if (!elements?.reportMap) return;
  const selected = elements.reportMap.value || activeMapId();
  elements.reportMap.innerHTML = Object.entries(MAP_TRANSLATION_KEYS).map(([id, key]) => `<option value="${id}">${t(`maps.${key}`)}</option>`).join("");
  elements.reportMap.value = selected;
}

function openReportDatabase() {
  if (!reportDbPromise) reportDbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(REPORT_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(REPORT_STORE_NAME)) {
        const store = database.createObjectStore(REPORT_STORE_NAME, { keyPath: "id", autoIncrement: true });
        store.createIndex("createdAt", "createdAt");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return reportDbPromise;
}

async function reportTransaction(mode, action) {
  const database = await openReportDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(REPORT_STORE_NAME, mode);
    const store = transaction.objectStore(REPORT_STORE_NAME);
    const request = action(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function saveReport(report) { return reportTransaction("readwrite", store => store.add(report)); }
function deleteReport(id) { return reportTransaction("readwrite", store => store.delete(id)); }
function getReports() { return reportTransaction("readonly", store => store.getAll()); }

function mapLabel(mapId) {
  return t(`maps.${MAP_TRANSLATION_KEYS[mapId] || "factory"}`);
}

function showSiteToast(copy) {
  clearTimeout(siteToastTimer);
  elements.siteToast.textContent = copy;
  elements.siteToast.classList.add("visible");
  siteToastTimer = setTimeout(() => elements.siteToast.classList.remove("visible"), 2200);
}

function setReportCoordinate(data) {
  elements.reportMap.value = data.map || activeMapId();
  elements.reportCoordinate.value = data.coordinate || `X ${Number(data.x).toFixed(1)} · Y ${Number(data.y).toFixed(1)}`;
  elements.reportCoordinate.dataset.x = String(data.x);
  elements.reportCoordinate.dataset.y = String(data.y);
}

async function copyReportCoordinate() {
  if (!elements.reportCoordinate.value) return showSiteToast(t("reports.clickMapFirst"));
  try {
    await navigator.clipboard.writeText(elements.reportCoordinate.value);
    showSiteToast(t("reports.copied"));
  } catch {
    elements.reportCoordinate.select();
    document.execCommand("copy");
    showSiteToast(t("reports.copied"));
  }
}

function clearReportPhotoPreview() {
  if (reportPreviewUrl) URL.revokeObjectURL(reportPreviewUrl);
  reportPreviewUrl = "";
  elements.reportPhotoPreview.removeAttribute("src");
  elements.reportPhotoPreview.hidden = true;
}

function resetReportForm() {
  elements.reportForm.reset();
  elements.reportMap.value = activeMapId();
  elements.reportCoordinate.value = "";
  delete elements.reportCoordinate.dataset.x;
  delete elements.reportCoordinate.dataset.y;
  clearReportPhotoPreview();
}

function reportDate(value) {
  try { return new Intl.DateTimeFormat(currentLanguage, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
  catch { return new Date(value).toLocaleString(); }
}

async function renderReports() {
  if (!elements.reportList || !window.indexedDB) return;
  reportObjectUrls.forEach(url => URL.revokeObjectURL(url));
  reportObjectUrls = [];
  let reports = [];
  try { reports = (await getReports()).sort((a, b) => b.createdAt - a.createdAt); }
  catch (error) { console.error("Local reports could not be loaded", error); }
  elements.reportCount.textContent = String(reports.length);
  if (!reports.length) {
    elements.reportList.innerHTML = `<p class="report-empty">${t("reports.empty")}</p>`;
    return;
  }
  elements.reportList.innerHTML = reports.map(report => {
    const photoUrl = URL.createObjectURL(report.photo);
    reportObjectUrls.push(photoUrl);
    return `<article class="saved-report" data-report-id="${report.id}">
      <img src="${photoUrl}" alt="${mapLabel(report.map)}" />
      <div><strong>${mapLabel(report.map)}</strong><b>${report.coordinate}</b><small>${reportDate(report.createdAt)}</small>${report.note ? `<p>${escapeHtml(report.note)}</p>` : ""}</div>
      <button type="button" data-delete-report="${report.id}" aria-label="${t("reports.delete")}">×</button>
    </article>`;
  }).join("");
}

function escapeHtml(value) {
  const node = document.createElement("span");
  node.textContent = value;
  return node.innerHTML;
}

elements.pageTabs.addEventListener("click", event => {
  const button = event.target.closest("[data-page]");
  if (button) goToPage(Number(button.dataset.page));
});

elements.rewardTrack.addEventListener("click", event => {
  const card = event.target.closest("[data-reward]");
  if (!card) return;
  const id = card.dataset.reward;
  selectionState.selected.has(id) ? selectionState.selected.delete(id) : selectionState.selected.add(id);
  renderRewards();
  renderProgress();
});

elements.mapSelector.addEventListener("click", event => {
  const button = event.target.closest("button[data-map]");
  if (!button) return;
  elements.mapSelector.querySelectorAll("button").forEach(item => item.classList.toggle("active", item === button));
  elements.mapFrame.src = mapViewerUrl(button.dataset.map);
  if (elements.reportMap) elements.reportMap.value = button.dataset.map;
  if (elements.reportCoordinate.dataset.map && elements.reportCoordinate.dataset.map !== button.dataset.map) {
    elements.reportCoordinate.value = "";
    delete elements.reportCoordinate.dataset.x;
    delete elements.reportCoordinate.dataset.y;
    delete elements.reportCoordinate.dataset.map;
  }
});

elements.reportButton.addEventListener("click", async () => {
  refreshReportMapOptions();
  elements.reportMap.value = activeMapId();
  await renderReports();
  elements.reportDialog.showModal();
});

elements.reportClose.addEventListener("click", () => elements.reportDialog.close());
elements.reportDialog.addEventListener("click", event => { if (event.target === elements.reportDialog) elements.reportDialog.close(); });
elements.coordinateCopy.addEventListener("click", copyReportCoordinate);
elements.reportMap.addEventListener("change", event => {
  const mapButton = elements.mapSelector.querySelector(`[data-map="${event.target.value}"]`);
  mapButton?.click();
});

elements.reportPhoto.addEventListener("change", () => {
  clearReportPhotoPreview();
  const photo = elements.reportPhoto.files[0];
  if (!photo) return;
  if (photo.size > REPORT_PHOTO_LIMIT) {
    elements.reportPhoto.value = "";
    showSiteToast(t("reports.photoTooLarge"));
    return;
  }
  reportPreviewUrl = URL.createObjectURL(photo);
  elements.reportPhotoPreview.src = reportPreviewUrl;
  elements.reportPhotoPreview.hidden = false;
});

elements.reportForm.addEventListener("submit", async event => {
  event.preventDefault();
  const photo = elements.reportPhoto.files[0];
  const x = Number(elements.reportCoordinate.dataset.x);
  const y = Number(elements.reportCoordinate.dataset.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return showSiteToast(t("reports.clickMapFirst"));
  if (!photo) return showSiteToast(t("reports.photoRequired"));
  if (photo.size > REPORT_PHOTO_LIMIT) return showSiteToast(t("reports.photoTooLarge"));
  try {
    await saveReport({
      map: elements.reportMap.value,
      x,
      y,
      coordinate: elements.reportCoordinate.value,
      note: elements.reportNote.value.trim(),
      photo,
      photoName: photo.name,
      createdAt: Date.now()
    });
    resetReportForm();
    await renderReports();
    showSiteToast(t("reports.saved"));
  } catch (error) {
    console.error("Report could not be saved", error);
    showSiteToast(t("reports.saveFailed"));
  }
});

elements.reportList.addEventListener("click", async event => {
  const button = event.target.closest("[data-delete-report]");
  if (!button || !confirm(t("reports.deleteConfirm"))) return;
  await deleteReport(Number(button.dataset.deleteReport));
  await renderReports();
  showSiteToast(t("reports.deleted"));
});

window.addEventListener("message", event => {
  if (event.origin !== location.origin || event.source !== elements.mapFrame.contentWindow || event.data?.type !== "map-coordinate") return;
  setReportCoordinate(event.data);
  elements.reportCoordinate.dataset.map = event.data.map;
  copyReportCoordinate();
});

document.querySelector("#language-select").addEventListener("change", async event => {
  await loadLanguage(event.target.value);
  renderAll();
  const selectedMap = elements.mapSelector.querySelector("button.active")?.dataset.map || "factory";
  elements.mapFrame.src = mapViewerUrl(selectedMap);
});

async function init() {
  await loadLanguage();
  renderAll();
  elements.mapFrame.src = mapViewerUrl("factory");
  setInterval(renderSeasonCountdown, 60 * 60 * 1000);
}

init();
