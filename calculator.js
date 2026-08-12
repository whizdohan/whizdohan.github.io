const CATEGORIES = {
  financial: { name: "Financial", total: 100, code: "FIN", color: "#c7a662" },
  pmc: { name: "PMC Personnel", total: 68, code: "PMC", color: "#b97b70" },
  project: { name: "Project", total: 68, code: "PRJ", color: "#71a2a3" },
  blueprints: { name: "Blueprints", total: 65, code: "BLU", color: "#7892ba" },
  test: { name: "Test", total: 43, code: "TST", color: "#9e8bb2" },
  user: { name: "User", total: 37, code: "USR", color: "#8faa74" },
  medical: { name: "Medical", total: 59, code: "MED", color: "#b66f76" },
  technical: { name: "Technical", total: 61, code: "TEC", color: "#d1ac61" }
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
    ["Scorpion Target", { pmc: 1, user: 1, technical: 1 }],
    ["TarCoins 50", { project: 1, blueprints: 2 }]
  ]},
  { total: 25, rewards: [
    ["Mystery Ranch Nice Frame Load Sling", { financial: 1, pmc: 1, user: 2 }],
    ["Black Division Gear Crate", { pmc: 2, user: 1, technical: 2 }],
    ["Black Herringbone", { pmc: 2, blueprints: 2, test: 2, technical: 1 }],
    ["TarCoins 50", { financial: 2, project: 2, medical: 1 }],
    ["Heart", { project: 1, test: 1, medical: 2 }]
  ]},
  { total: 30, rewards: [
    ["Dogtag", { financial: 1, project: 2, blueprints: 2 }],
    ["Microtech Jagdkommando Knife", { financial: 2, pmc: 1, user: 4, medical: 3 }],
    ["TarCoins 50", { medical: 2, technical: 3 }],
    ["Beware the Bear Poster", { financial: 1, blueprints: 2, test: 2 }],
    ["Black Division Gear Crate", { financial: 2, pmc: 1, medical: 2 }]
  ]},
  { total: 35, rewards: [
    ["Orange Hawaii", { financial: 3, project: 2, user: 2, medical: 1, technical: 2 }],
    ["TarCoins 50", { financial: 1, blueprints: 4, test: 1, medical: 1 }],
    ["Black Division Target", { pmc: 2, blueprints: 1, medical: 2 }],
    ["Black Division Gear Crate", { project: 1, test: 3, technical: 2 }],
    ["Ferro Concepts FCPC V5 (Black Division)", { project: 3, blueprints: 2, user: 2 }]
  ]},
  { total: 36, rewards: [
    ["Knyazev", { test: 2, user: 4, medical: 3, technical: 4 }],
    ["O'Connor", { financial: 4, pmc: 3, blueprints: 3, technical: 2 }],
    ["Howa Type 20 5.56x45", { pmc: 2, project: 2, user: 1, medical: 6 }]
  ]},
  { total: 45, rewards: [
    ["Dogtag", { financial: 5, project: 2, technical: 3 }],
    ["TarCoins 50", { test: 3, medical: 2, technical: 4 }],
    ["Scorpion Upper", { financial: 3, pmc: 5, blueprints: 3, technical: 2 }],
    ["Scorpion Lower", { pmc: 3, project: 2, user: 3, medical: 5 }]
  ]},
  { total: 43, rewards: [
    ["Black Division Gear Crate", { financial: 2, project: 2, test: 2 }],
    ["TarCoins 50", { financial: 4, blueprints: 5, test: 1, medical: 4 }],
    ["White Accent Walls", { pmc: 3, blueprints: 6, user: 2, technical: 2 }],
    ["Arch", { pmc: 1, project: 3, medical: 2 }],
    ["Dome", { financial: 1, project: 1, blueprints: 2 }]
  ]},
  { total: 50, rewards: [
    ["Spiritus Systems LV-119 (Black Division V2)", { blueprints: 2, test: 2, medical: 4, technical: 4 }],
    ["TarCoins 50", { financial: 3, blueprints: 2, technical: 1 }],
    ["Tasmanian Tiger Modular Pack 45 Plus", { financial: 2, pmc: 5, project: 2 }],
    ["Black Division Gear Crate", { financial: 2, project: 1, blueprints: 2 }],
    ["Server Room", { pmc: 4, test: 2, user: 2, medical: 4, technical: 6 }]
  ]},
  { total: 60, rewards: [
    ["Anton", { financial: 2, pmc: 6, project: 5, blueprints: 5, medical: 2 }],
    ["Garrett", { financial: 5, pmc: 6, project: 2, user: 2, technical: 5 }],
    ["Black Division Gear Crate", { project: 3, test: 3, technical: 1 }],
    ["TarCoins 100", { financial: 4, pmc: 2, project: 5, test: 2 }]
  ]},
  { total: 65, rewards: [
    ["Dogtag", { pmc: 3, project: 4, test: 2, technical: 2 }],
    ["TarCoins 150", { financial: 5, blueprints: 3, medical: 3, technical: 5 }],
    ["Knyazev (After Battle)", { financial: 3, pmc: 5, test: 3, user: 5, technical: 3 }],
    ["O'Connor (After Battle)", { pmc: 5, project: 5, blueprints: 3, test: 3, technical: 3 }]
  ]},
  { total: 77, rewards: [
    ["Norinco QBZ-191 5.8x42", { financial: 29 }],
    ["Nocturnal Upper", { financial: 2, project: 5, blueprints: 5, test: 4, medical: 6, technical: 3 }],
    ["Nocturnal Lower", { financial: 6, pmc: 5, project: 5, blueprints: 4, user: 3 }]
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
const categoryKeys = Object.keys(CATEGORIES);
let messages = {};

function nestedValue(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function t(key, variables = {}) {
  const template = nestedValue(messages, key) || key;
  return Object.entries(variables).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
}

async function loadLanguage() {
  try {
    const response = await fetch("locales/en.json?v=5");
    if (!response.ok) throw new Error(`Language file: ${response.status}`);
    messages = await response.json();
  } catch (error) {
    console.error(error);
    return;
  }
  document.documentElement.lang = "en";
  document.title = t("meta.title");
  document.querySelector('meta[name="description"]').content = t("meta.description");
  document.querySelectorAll("[data-i18n]").forEach(element => { element.textContent = t(element.dataset.i18n); });
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
  mapSelector: document.querySelector("#map-selector-list")
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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

function renderTabs() {
  elements.pageTabs.innerHTML = PAGES.map(page => `<button type="button" data-page="${page.number}" class="page-tab ${page.number === selectionState.page ? "active" : ""}" aria-current="${page.number === selectionState.page ? "page" : "false"}"><span>${String(page.number).padStart(2, "0")}</span><small>${page.total}</small></button>`).join("");
}

function renderRewards() {
  const page = pageByNumber(selectionState.page);
  document.querySelector("#current-page").textContent = String(page.number).padStart(2, "0");
  elements.rewardTrack.innerHTML = page.rewards.map(reward => {
    const selected = selectionState.selected.has(reward.id);
    return `<button type="button" class="reward-card ${selected ? "selected" : ""}" data-reward="${reward.id}" aria-pressed="${selected}">
      <span class="reward-index">${reward.id}</span>
      <span class="reward-visual has-image"><span class="reward-sprite" style="${spriteStyle(reward.id)}"></span></span>
      <span class="reward-name">${reward.name}</span>
      <span class="reward-required">REQUIRED DOCS: <b>${reward.total}</b></span>
      <span class="selected-mark">✓ COMPLETE</span>
    </button>`;
  }).join("");
}

function renderDocumentBelt(requirements = remainingRequirements()) {
  elements.documentBelt.innerHTML = categoryKeys.map(key => {
    const category = CATEGORIES[key];
    const needed = requirements[key];
    const owned = clamp(Number(sharedState.owned[key]) || 0, 0, category.total);
    return `<div class="belt-item ${needed ? "active" : ""}" style="--color:${category.color}"><small>${t(`categories.${key}`)}</small><b>${owned}/${needed}</b></div>`;
  }).join("");
}

function renderProgress() {
  const requirements = remainingRequirements();
  const total = Object.values(requirements).reduce((sum, value) => sum + value, 0);
  const completedTotal = 501 - total;
  const percent = Math.round(completedTotal / 501 * 100);

  document.querySelector("#inventory-total").textContent = total;
  document.querySelector("#overall-progress-percent").textContent = `${percent}%`;
  document.querySelector("#overall-progress-bar").style.width = `${percent}%`;
  document.querySelector("#overall-progress-copy").textContent = `${completedTotal} / 501 DOCUMENTS`;
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
  elements.mapFrame.contentWindow?.postMessage({ type: "select-map", map: button.dataset.map }, location.origin);
});

async function init() {
  await loadLanguage();
  renderAll();
}

init();
