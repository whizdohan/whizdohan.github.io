const MAPS=[
  ["customs","Customs","CST"],["ground-zero","Ground Zero","GZ"],
  ["factory","Factory","FCT"],["woods","Woods","WDS"],
  ["reserve","Reserve","RSV"],["shoreline","Shoreline","SHR"],
  ["interchange","Interchange","INT"],["lighthouse","Lighthouse","LHT"],
  ["streets","Streets of Tarkov","SOT"],["laboratory","The Lab","LAB"],
  ["labyrinth","The Labyrinth","LBY"]
].map(([id,name,code])=>({id,name,code}));

const CATEGORIES={
  technical:{name:"Technical Documents",required:61,color:"#d3a759"},pmc:{name:"PMC Personnel Files",required:71,color:"#bd7469"},
  project:{name:"Project Files",required:49,color:"#70a0a7"},blueprints:{name:"Blueprints",required:51,color:"#738db5"},
  test:{name:"Test Documents",required:61,color:"#a08ab4"},user:{name:"User Documents",required:58,color:"#8caa70"},
  medical:{name:"Medical Documents",required:47,color:"#b06c73"},financial:{name:"Financial Documents",required:103,color:"#b99a62"}
};

const locations=Array.isArray(window.DOCUMENT_LOCATIONS)?window.DOCUMENT_LOCATIONS:[];
if(new URLSearchParams(location.search).get("embedded")==="1")document.body.classList.add("embedded");
const state={map:"factory",filters:Object.keys(CATEGORIES)};
const els={
  mapSelect:document.querySelector("#map-select"),currentMapName:document.querySelector("#current-map-name"),
  mapCode:document.querySelector("#map-code"),categoryList:document.querySelector("#category-list"),
  markerLayer:document.querySelector("#marker-layer"),emptyState:document.querySelector("#empty-state"),
  visibleCount:document.querySelector("#visible-count"),coordinate:document.querySelector("#coordinate"),
  detailDialog:document.querySelector("#detail-dialog"),sidebar:document.querySelector("#sidebar"),
  backdrop:document.querySelector("#sidebar-backdrop"),menuButton:document.querySelector("#menu-button")
};

function init(){
  MAPS.forEach(map=>els.mapSelect.add(new Option(map.name,map.id)));
  els.mapSelect.value=state.map;renderCategories();updateMap();bindEvents();
}

function renderCategories(){
  els.categoryList.innerHTML=Object.entries(CATEGORIES).map(([key,category])=>`
    <label class="category-row"><input type="checkbox" value="${key}" ${state.filters.includes(key)?"checked":""}/>
    <span><i class="category-swatch" style="--swatch:${category.color}"></i><strong>${category.name}</strong></span>
    </label>`).join("");
}

function updateMap(){
  const map=MAPS.find(item=>item.id===state.map)||MAPS[2];
  els.currentMapName.textContent=map.name;els.mapCode.textContent=map.code;els.mapSelect.value=map.id;
  const filtered=locations.filter(location=>location.map===map.id&&state.filters.includes(location.category));
  els.markerLayer.innerHTML=filtered.map(location=>{const category=CATEGORIES[location.category]||CATEGORIES.technical;return `<button class="map-marker" data-id="${location.id}" style="left:${location.x}%;top:${location.y}%;--marker:${category.color}" aria-label="${escapeHtml(location.title||"Document location")}"></button>`}).join("");
  els.emptyState.hidden=filtered.length>0;els.visibleCount.textContent=`${filtered.length} LOCATIONS VISIBLE`;
}

function openDetail(id){
  const location=locations.find(item=>item.id===id);if(!location)return;
  const category=CATEGORIES[location.category];
  document.querySelector("#detail-category").textContent=category?.name||"DOCUMENT LOCATION";
  document.querySelector("#detail-title").textContent=location.title||"LOCATION DETAILS";
  document.querySelector("#detail-description").textContent=location.description||"No detailed description is available yet.";
  const image=location.detailImage||location.previewImage;
  document.querySelector("#detail-image").innerHTML=image?`<img src="${image}" alt="${escapeHtml(location.title||"Location details")}"/>`:"IMAGE COMING SOON";
  els.detailDialog.showModal();
}

function bindEvents(){
  els.mapSelect.addEventListener("change",event=>{state.map=event.target.value;updateMap();closeSidebar()});
  els.categoryList.addEventListener("change",event=>{const key=event.target.value;state.filters=event.target.checked?[...new Set([...state.filters,key])]:state.filters.filter(item=>item!==key);updateMap()});
  document.querySelector("#toggle-all").addEventListener("click",event=>{const allEnabled=state.filters.length===Object.keys(CATEGORIES).length;state.filters=allEnabled?[]:Object.keys(CATEGORIES);renderCategories();updateMap();event.currentTarget.textContent=allEnabled?"SELECT ALL":"CLEAR ALL"});
  els.markerLayer.addEventListener("click",event=>{const marker=event.target.closest("[data-id]");if(marker)openDetail(marker.dataset.id)});
  document.querySelector("#detail-close").addEventListener("click",()=>els.detailDialog.close());
  document.querySelector("#map-stage").addEventListener("pointermove",event=>{const rect=event.currentTarget.getBoundingClientRect();const x=Math.round((event.clientX-rect.left)/rect.width*1000);const y=Math.round((event.clientY-rect.top)/rect.height*1000);els.coordinate.textContent=`X ${String(x).padStart(3,"0")} · Y ${String(y).padStart(3,"0")}`});
  els.menuButton.addEventListener("click",()=>{const open=!els.sidebar.classList.contains("open");els.sidebar.classList.toggle("open",open);els.backdrop.classList.toggle("open",open);els.menuButton.setAttribute("aria-expanded",String(open))});
  els.backdrop.addEventListener("click",closeSidebar);
}

function closeSidebar(){els.sidebar.classList.remove("open");els.backdrop.classList.remove("open");els.menuButton.setAttribute("aria-expanded","false")}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char])}
init();
