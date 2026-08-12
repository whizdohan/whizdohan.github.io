const MAPS=[
  {id:"customs",name:"Customs",code:"CST",image:"https://maps.reemr.se/Customs/re3mrCustoms2.png",source:"https://reemr.se/customs/"},
  {id:"ground-zero",name:"Ground Zero",code:"GZ",image:"https://www.re3mr.com/maps/Groundzero/GroundZero.png",source:"https://reemr.se/ground-zero/"},
  {id:"factory",name:"Factory",code:"FCT",image:"https://www.re3mr.com/maps/Factory/FactorybyRe3mr.png",source:"https://reemr.se/Factory/"},
  {id:"woods",name:"Woods",code:"WDS",image:"https://www.reemr.se/maps/Woods/WoodsRe3mrPNG.png",source:"https://reemr.se/woods/"},
  {id:"reserve",name:"Reserve",code:"RSV",image:"https://reemr.se/maps/Reserve/Re3mrReserveLossless.png",source:"https://reemr.se/reserve/"},
  {id:"shoreline",name:"Shoreline",code:"SHR",image:"https://reemr.se/maps/Shoreline/re3mrShoreline2.png",source:"https://reemr.se/shoreline/"},
  {id:"interchange",name:"Interchange",code:"INT",image:"https://www.re3mr.com/maps/Interchange/re3mrInterchange.jpg",source:"https://reemr.se/interchange/"},
  {id:"lighthouse",name:"Lighthouse",code:"LHT",image:"https://reemr.se/maps/Lighthouse/re3mrLighthouseISO.png",source:"https://reemr.se/lighthouse/"},
  {id:"streets",name:"Streets of Tarkov",code:"SOT",image:"https://reemr.se/maps/Streets/re3mrStreetsofTarkov.png",source:"https://reemr.se/streetsoftarkov/"},
  {id:"labyrinth",name:"The Labyrinth",code:"LBY",image:"https://www.re3mr.com/maps/Labyrinth/re3mrLabyrinthPNG.png",source:"https://reemr.se/labyrinth/"}
];

const CATEGORIES={
  technical:{name:"Technical Documents",required:61,color:"#d3a759"},pmc:{name:"PMC Personnel Files",required:71,color:"#bd7469"},
  project:{name:"Project Files",required:49,color:"#70a0a7"},blueprints:{name:"Blueprints",required:51,color:"#738db5"},
  test:{name:"Test Documents",required:61,color:"#a08ab4"},user:{name:"User Documents",required:58,color:"#8caa70"},
  medical:{name:"Medical Documents",required:47,color:"#b06c73"},financial:{name:"Financial Documents",required:103,color:"#b99a62"}
};

const locations=Array.isArray(window.DOCUMENT_LOCATIONS)?window.DOCUMENT_LOCATIONS:[];
const embedded=new URLSearchParams(location.search).get("embedded")==="1";
if(embedded)document.body.classList.add("embedded");
else if(window.top===window.self)location.replace("../");
const requestedMap=new URLSearchParams(location.search).get("map");
const state={map:MAPS.some(map=>map.id===requestedMap)?requestedMap:"factory",filters:Object.keys(CATEGORIES)};
const els={
  mapSelect:document.querySelector("#map-select"),currentMapName:document.querySelector("#current-map-name"),
  mapCode:document.querySelector("#map-code"),categoryList:document.querySelector("#category-list"),
  markerLayer:document.querySelector("#marker-layer"),emptyState:document.querySelector("#empty-state"),
  mapStage:document.querySelector("#map-stage"),mapImage:document.querySelector("#map-image"),
  mapSource:document.querySelector("#map-source"),
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
  els.mapStage.classList.remove("has-map","map-error");
  els.mapImage.hidden=true;
  els.mapImage.alt=`${map.name} map artwork by re3mr`;
  els.mapSource.href=map.source;
  els.mapSource.setAttribute("aria-label",`Open the original ${map.name} map on RE3MR`);
  els.emptyState.hidden=false;
  els.emptyState.innerHTML='<span class="map-loader" aria-hidden="true"></span><strong>LOADING MAP</strong><p>The high-resolution map may take a moment to appear.</p>';
  els.mapImage.onload=()=>{
    if(els.mapImage.dataset.map!==map.id)return;
    els.mapImage.hidden=false;els.mapStage.classList.add("has-map");els.emptyState.hidden=true;
  };
  els.mapImage.onerror=()=>{
    if(els.mapImage.dataset.map!==map.id)return;
    els.mapStage.classList.add("map-error");
    els.emptyState.innerHTML=`<span class="empty-icon">!</span><strong>MAP COULD NOT BE LOADED</strong><p><a href="${map.source}" target="_blank" rel="noopener noreferrer">Open the original map on RE3MR</a></p>`;
  };
  els.mapImage.dataset.map=map.id;els.mapImage.src=map.image;
  const filtered=locations.filter(location=>location.map===map.id&&state.filters.includes(location.category));
  els.markerLayer.innerHTML=filtered.map(location=>{const category=CATEGORIES[location.category]||CATEGORIES.technical;return `<button class="map-marker" data-id="${location.id}" style="left:${location.x}%;top:${location.y}%;--marker:${category.color}" aria-label="${escapeHtml(location.title||"Document location")}"></button>`}).join("");
  els.visibleCount.textContent=`${filtered.length} LOCATIONS VISIBLE`;
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
  window.addEventListener("message",event=>{
    if(event.origin!==location.origin||event.source!==window.parent)return;
    const map=MAPS.find(item=>item.id===event.data?.map);
    if(event.data?.type!=="select-map"||!map)return;
    state.map=map.id;updateMap();closeSidebar();
  });
}

function closeSidebar(){els.sidebar.classList.remove("open");els.backdrop.classList.remove("open");els.menuButton.setAttribute("aria-expanded","false")}
function escapeHtml(value){return String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char])}
init();
