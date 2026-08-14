const MAP_ASSET_ROOT="../assets/maps-jpg/";
const MAP_SOURCE_ROOT="https://tarkov.dev/maps/";
const MAP_TRANSLATION_KEYS={"customs":"customs","ground-zero":"groundZero","factory":"factory","woods":"woods","reserve":"reserve","shoreline":"shoreline","interchange":"interchange","lighthouse":"lighthouse","streets":"streets","laboratory":"laboratory","icebreaker":"icebreaker","labyrinth":"labyrinth"};
const MAPS=[
  {id:"customs",name:"Customs",code:"CST",file:"customs-2d.jpg",width:2200,height:1153},
  {id:"ground-zero",name:"Ground Zero",code:"GZ",file:"ground-zero-2d.jpg",width:2200,height:2200},
  {id:"factory",name:"Factory",code:"FCT",file:"factory-2d.jpg",width:2200,height:1090},
  {id:"woods",name:"Woods",code:"WDS",file:"woods-2d.jpg",width:2200,height:2153},
  {id:"reserve",name:"Reserve",code:"RSV",file:"reserve-2d.jpg",width:2200,height:1304},
  {id:"shoreline",name:"Shoreline",code:"SHR",file:"shoreline-2d.jpg",width:2200,height:1507},
  {id:"interchange",name:"Interchange",code:"INT",file:"interchange-2d.jpg",width:2400,height:1350,source:"https://reemr.se/interchange/",sourceLabel:"RE3MR"},
  {id:"lighthouse",name:"Lighthouse",code:"LHT",file:"lighthouse-2d.jpg",width:1267,height:2200},
  {id:"streets",name:"Streets of Tarkov",code:"SOT",file:"streets-2d.jpg",width:2200,height:1697},
  {id:"laboratory",name:"The Lab",code:"LAB",file:"labs-2d.jpg",width:2200,height:1140},
  {id:"icebreaker",name:"Icebreaker",code:"ICE",file:"icebreaker-2d.jpg",width:2400,height:1350,source:"https://reemr.se/icebreaker/",sourceLabel:"RE3MR"},
  {id:"labyrinth",name:"The Labyrinth",code:"LBY",file:"labyrinth-2d.jpg",width:2400,height:2160,source:"https://reemr.se/labyrinth/",sourceLabel:"RE3MR"}
].map(map=>({...map,image:`${MAP_ASSET_ROOT}${map.file}`,source:map.source||`${MAP_SOURCE_ROOT}${map.file}`,sourceLabel:map.sourceLabel||"tarkov.dev"}));

const DOCUMENT_ICON_ROOT="../assets/document-icons/";
const CATEGORIES={
  technical:{name:"Technical Documents",required:56,color:"#d3a759",icon:"equipment.webp"},pmc:{name:"PMC Personnel Files",required:47,color:"#bd7469",icon:"pmc-personnel.webp"},
  project:{name:"Project Files",required:49,color:"#70a0a7",icon:"project.webp"},blueprints:{name:"Blueprints",required:54,color:"#738db5",icon:"blueprints-technical.webp"},
  test:{name:"Test Documents",required:78,color:"#a08ab4",icon:"test.webp"},user:{name:"User Documents",required:59,color:"#8caa70",icon:"user.webp"},
  medical:{name:"Medical Documents",required:60,color:"#b06c73",icon:"medical.webp"},financial:{name:"Financial Documents",required:98,color:"#b99a62",icon:"accounting.webp"}
};

const locations=Array.isArray(window.DOCUMENT_LOCATIONS)?window.DOCUMENT_LOCATIONS:[];
const query=new URLSearchParams(location.search);
const supportedLanguages=["en","ko","ja"];
const currentLanguage=supportedLanguages.includes(query.get("lang"))?query.get("lang"):"en";
let messages={};
const embedded=query.get("embedded")==="1";
if(embedded)document.body.classList.add("embedded");
else if(window.top===window.self)location.replace("../");

const requestedMap=query.get("map");
const state={map:MAPS.some(map=>map.id===requestedMap)?requestedMap:"factory",filters:Object.keys(CATEGORIES)};
const els={
  mapSelect:document.querySelector("#map-select"),currentMapName:document.querySelector("#current-map-name"),
  categoryList:document.querySelector("#category-list"),emptyState:document.querySelector("#empty-state"),
  visibleCount:document.querySelector("#visible-count"),coordinate:document.querySelector("#coordinate"),
  detailDialog:document.querySelector("#detail-dialog"),sidebar:document.querySelector("#sidebar"),
  backdrop:document.querySelector("#sidebar-backdrop"),menuButton:document.querySelector("#menu-button"),
  mapSource:document.querySelector("#map-source"),fallbackImage:document.querySelector("#map-image-fallback"),
  mapDocumentFilters:document.querySelector("#map-document-filters")
};

let leafletMap;
let imageLayer;
let markerLayer;
let activeMap;
let activeBounds;

async function init(){
  await loadLanguage();
  MAPS.forEach(map=>els.mapSelect.add(new Option(mapName(map),map.id)));
  els.mapSelect.value=state.map;
  renderCategories();
  bindEvents();
  prepareStaticMap();
  if(!window.L)return;
  leafletMap=L.map("leaflet-map",{crs:L.CRS.Simple,minZoom:-3,maxZoom:4,zoomSnap:.25,zoomDelta:.5,wheelPxPerZoomLevel:60,scrollWheelZoom:true,boxZoom:true,doubleClickZoom:true,touchZoom:true,maxBoundsViscosity:1,attributionControl:true});
  leafletMap.setView([activeMap.height/2,activeMap.width/2],-2,{animate:false});
  leafletMap.attributionControl.setPrefix('<a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer">Leaflet</a>');
  markerLayer=L.layerGroup().addTo(leafletMap);
  leafletMap.on("mousemove",updateCoordinate);
  leafletMap.on("click",copyCoordinate);
  leafletMap.on("zoomend",keepMapTopAligned);
  leafletMap.scrollWheelZoom.enable();
  updateMap();
}

async function loadLanguage(){
  try{const response=await fetch(`../locales/${currentLanguage}.json?v=7`);if(!response.ok)throw new Error(String(response.status));messages=await response.json();document.documentElement.lang=currentLanguage}catch(error){console.error("Map language file could not be loaded",error)}
}
function t(key){return key.split(".").reduce((value,part)=>value?.[part],messages)||key}
function mapName(map){return t(`maps.${MAP_TRANSLATION_KEYS[map.id]}`)||map.name}

function prepareStaticMap(){
  activeMap=MAPS.find(item=>item.id===state.map)||MAPS[2];
  els.currentMapName.textContent=mapName(activeMap);
  els.mapSelect.value=activeMap.id;
  els.mapSource.href=activeMap.source;
  els.mapSource.textContent=`${activeMap.sourceLabel} · ${mapName(activeMap)} 2D JPG`;
  els.fallbackImage.alt=`${activeMap.name} 2D map`;
  els.fallbackImage.hidden=false;
  els.fallbackImage.onload=()=>{if(els.fallbackImage.dataset.map===activeMap.id)els.emptyState.hidden=true};
  els.fallbackImage.onerror=()=>{if(els.fallbackImage.dataset.map===activeMap.id)showMapError(t("mapViewer.loadFailed"),mapName(activeMap),activeMap.source)};
  els.fallbackImage.dataset.map=activeMap.id;
  els.fallbackImage.src=`${activeMap.image}?v=3`;
}

function renderCategories(){
  els.categoryList.innerHTML=Object.entries(CATEGORIES).map(([key,category])=>`
    <label class="category-row"><input type="checkbox" value="${key}" ${state.filters.includes(key)?"checked":""}/>
    <span><i class="category-swatch" style="--swatch:${category.color}"></i><strong>${category.name}</strong></span>
    </label>`).join("");
}

function updateMap(){
  activeMap=MAPS.find(item=>item.id===state.map)||MAPS[2];
  const requested=activeMap;
  prepareStaticMap();
  els.currentMapName.textContent=mapName(activeMap);
  els.mapSelect.value=activeMap.id;
  els.mapSource.href=activeMap.source;
  els.mapSource.textContent=`${activeMap.sourceLabel} · ${mapName(activeMap)} 2D JPG`;
  els.mapSource.setAttribute("aria-label",`Open the ${activeMap.name} map image`);
  showLoading();
  if(imageLayer)leafletMap.removeLayer(imageLayer);
  leafletMap.closePopup();
  leafletMap.setMaxBounds(null);
  markerLayer.clearLayers();
  const bounds=L.latLngBounds([[0,0],[requested.height,requested.width]]);
  activeBounds=bounds;
  imageLayer=L.imageOverlay(requested.image,bounds,{alt:`${requested.name} 2D map from ${requested.sourceLabel}`,interactive:false,opacity:1});
  imageLayer.on("load",()=>{
    if(activeMap.id!==requested.id)return;
    els.emptyState.hidden=true;
    els.fallbackImage.hidden=true;
    leafletMap.invalidateSize();
    const minimumZoom=minimumWidthZoom(requested);
    leafletMap.setMinZoom(minimumZoom);
    constrainMapToTop(requested,minimumZoom);
    alignMapTopLeft(bounds,minimumZoom);
    renderMarkers();
  });
  imageLayer.on("error",()=>{if(activeMap.id===requested.id)showMapError(t("mapViewer.loadFailed"),mapName(requested),requested.source)});
  imageLayer.addTo(leafletMap);
}

function minimumWidthZoom(map){
  const width=Math.max(leafletMap.getSize().x,1);
  const rawZoom=Math.log2(width/map.width);
  return Math.ceil(rawZoom/leafletMap.options.zoomSnap)*leafletMap.options.zoomSnap;
}

function alignMapTopLeft(bounds,zoom){
  const topLeft=leafletMap.project(bounds.getNorthWest(),zoom);
  const centerPoint=topLeft.add(leafletMap.getSize().divideBy(2));
  leafletMap.setView(leafletMap.unproject(centerPoint,zoom),zoom,{animate:false});
}

function constrainMapToTop(map,zoom){
  const scale=leafletMap.options.crs.scale(zoom);
  const viewport=leafletMap.getSize();
  const visibleWidth=viewport.x/scale;
  const visibleHeight=viewport.y/scale;
  const south=Math.min(0,map.height-visibleHeight);
  const east=Math.max(map.width,visibleWidth);
  leafletMap.setMaxBounds([[south,0],[map.height,east]]);
}

function mapFitsVertically(map,zoom){
  const top=leafletMap.project([map.height,0],zoom);
  const bottom=leafletMap.project([0,0],zoom);
  return Math.abs(bottom.y-top.y)<=leafletMap.getSize().y+1;
}

function keepMapTopAligned(){
  if(!activeBounds||!activeMap)return;
  const zoom=leafletMap.getZoom();
  constrainMapToTop(activeMap,zoom);
  if(Math.abs(zoom-leafletMap.getMinZoom())<.001&&mapFitsVertically(activeMap,zoom))alignMapTopLeft(activeBounds,zoom);
}

function documentIconUrl(categoryKey){
  return `${DOCUMENT_ICON_ROOT}${(CATEGORIES[categoryKey]||CATEGORIES.technical).icon}?v=1`;
}

function renderMapDocumentFilters(){
  if(!els.mapDocumentFilters||!activeMap)return;
  const available=Object.keys(CATEGORIES).filter(key=>locations.some(item=>item.map===activeMap.id&&item.category===key));
  els.mapDocumentFilters.hidden=!available.length;
  els.mapDocumentFilters.innerHTML=available.map(key=>{
    const category=CATEGORIES[key];
    const enabled=state.filters.includes(key);
    const label=t(`categories.${key}`)||category.name;
    return `<button type="button" class="map-document-filter ${enabled?"active":""}" data-map-filter="${key}" aria-pressed="${enabled}" title="${label}"><img src="${documentIconUrl(key)}" alt="" /><span>${label}</span></button>`;
  }).join("");
}

function renderMarkers(){
  if(!markerLayer||!activeMap)return;
  markerLayer.clearLayers();
  const filtered=locations.filter(item=>item.map===activeMap.id&&state.filters.includes(item.category));
  filtered.forEach(item=>{
    const category=CATEGORIES[item.category]||CATEGORIES.technical;
    const label=t(`categories.${item.category}`)||category.name;
    const icon=L.divIcon({className:"document-marker-shell",html:`<span class="document-marker" style="--marker:${category.color}"><img src="${documentIconUrl(item.category)}" alt="" /></span>`,iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-13]});
    const marker=L.marker(percentToLatLng(item.x,item.y),{icon,title:item.title||label,keyboard:true});
    marker.bindPopup(buildPhotoPopup(item,category),{className:"document-photo-popup",maxWidth:300,minWidth:220,closeButton:true});
    marker.addTo(markerLayer);
  });
  renderMapDocumentFilters();
  els.visibleCount.textContent=`${filtered.length} ${t("mapViewer.locationsVisible")}`;
}

function buildPhotoPopup(item,category){
  const card=document.createElement("article");
  card.className="location-popup-card";
  const label=document.createElement("small");
  label.textContent=t(`categories.${item.category}`)||category.name;
  label.style.setProperty("--popup-color",category.color);
  card.append(label);
  if(item.previewImage){
    const image=document.createElement("img");
    image.src=safeImageUrl(item.previewImage);
    image.alt=item.title?`${item.title} location`:"Document location";
    image.loading="lazy";
    image.addEventListener("click",()=>openDetail(item.id));
    card.append(image);
  }else{
    const placeholder=document.createElement("div");
    placeholder.className="location-photo-placeholder";
    placeholder.textContent=t("mapViewer.photoSoon");
    card.append(placeholder);
  }
  const title=document.createElement("strong");
  title.textContent=item.title||t("mapViewer.location");
  card.append(title);
  if(item.description){const copy=document.createElement("p");copy.textContent=item.description;card.append(copy)}
  return card;
}

function percentToLatLng(x,y){
  const safeX=clamp(Number(x)||0,0,100);
  const safeY=clamp(Number(y)||0,0,100);
  return [activeMap.height*(1-safeY/100),activeMap.width*(safeX/100)];
}

function coordinateFromLatLng(latlng){
  const x=clamp(latlng.lng/activeMap.width*100,0,100);
  const y=clamp((1-latlng.lat/activeMap.height)*100,0,100);
  return {x,y,coordinate:`X ${x.toFixed(1).padStart(5,"0")} · Y ${y.toFixed(1).padStart(5,"0")}`};
}

function updateCoordinate(event){
  if(!activeMap)return;
  els.coordinate.textContent=coordinateFromLatLng(event.latlng).coordinate;
}

function fallbackCopy(value){
  const field=document.createElement("textarea");
  field.value=value;
  field.setAttribute("readonly","");
  field.style.position="fixed";
  field.style.left="-9999px";
  document.body.append(field);
  field.select();
  const copied=document.execCommand("copy");
  field.remove();
  return copied;
}

async function copyCoordinate(event){
  if(!activeMap)return;
  const data=coordinateFromLatLng(event.latlng);
  els.coordinate.textContent=data.coordinate;
  try{await navigator.clipboard.writeText(data.coordinate)}
  catch{fallbackCopy(data.coordinate)}
  if(embedded)window.parent.postMessage({type:"map-coordinate",map:activeMap.id,...data},location.origin);
  els.coordinate.textContent=`${data.coordinate} · ${t("mapViewer.coordinateCopied")}`;
  window.setTimeout(()=>{if(els.coordinate.textContent.includes(t("mapViewer.coordinateCopied")))els.coordinate.textContent=data.coordinate},1600);
}

function showLoading(){
  els.emptyState.hidden=false;
  els.emptyState.innerHTML=`<span class="map-loader" aria-hidden="true"></span><strong>${t("mapViewer.loading")}</strong><p>${t("mapViewer.loadingCopy")}</p>`;
}

function showMapError(title,copy,source){
  els.emptyState.hidden=false;
  els.emptyState.innerHTML="";
  const icon=document.createElement("span");icon.className="empty-icon";icon.textContent="!";
  const heading=document.createElement("strong");heading.textContent=title;
  const message=document.createElement("p");message.textContent=copy;
  els.emptyState.append(icon,heading,message);
  if(source){const link=document.createElement("a");link.href=source;link.target="_blank";link.rel="noopener noreferrer";link.textContent=t("mapViewer.openSource");els.emptyState.append(link)}
}

function openDetail(id){
  const item=locations.find(location=>location.id===id);if(!item)return;
  const category=CATEGORIES[item.category];
  document.querySelector("#detail-category").textContent=t(`categories.${item.category}`)||category?.name||t("mapViewer.location");
  document.querySelector("#detail-title").textContent=item.title||t("mapViewer.details");
  const detailDescription=document.querySelector("#detail-description");
  detailDescription.textContent=item.description||"";
  detailDescription.hidden=!item.description;
  const image=item.detailImage||item.previewImage;
  const container=document.querySelector("#detail-image");
  container.replaceChildren();
  if(image){const photo=document.createElement("img");photo.src=safeImageUrl(image);photo.alt=item.title||"Location details";container.append(photo)}
  else container.textContent=t("mapViewer.imageSoon");
  els.detailDialog.showModal();
}

function bindEvents(){
  els.mapSelect.addEventListener("change",event=>{state.map=event.target.value;updateMap();closeSidebar()});
  els.categoryList.addEventListener("change",event=>{const key=event.target.value;state.filters=event.target.checked?[...new Set([...state.filters,key])]:state.filters.filter(item=>item!==key);renderMarkers()});
  els.mapDocumentFilters.addEventListener("click",event=>{const button=event.target.closest("[data-map-filter]");if(!button)return;const key=button.dataset.mapFilter;state.filters=state.filters.includes(key)?state.filters.filter(item=>item!==key):[...state.filters,key];renderCategories();renderMarkers()});
  document.querySelector("#toggle-all").addEventListener("click",event=>{const allEnabled=state.filters.length===Object.keys(CATEGORIES).length;state.filters=allEnabled?[]:Object.keys(CATEGORIES);renderCategories();renderMarkers();event.currentTarget.textContent=allEnabled?"SELECT ALL":"CLEAR ALL"});
  document.querySelector("#detail-close").addEventListener("click",()=>els.detailDialog.close());
  els.menuButton.addEventListener("click",()=>{const open=!els.sidebar.classList.contains("open");els.sidebar.classList.toggle("open",open);els.backdrop.classList.toggle("open",open);els.menuButton.setAttribute("aria-expanded",String(open))});
  els.backdrop.addEventListener("click",closeSidebar);
  window.addEventListener("resize",()=>{
    if(!leafletMap)return;
    leafletMap.invalidateSize();
    if(!activeBounds||!activeMap)return;
    const minimumZoom=minimumWidthZoom(activeMap);
    leafletMap.setMinZoom(minimumZoom);
    const targetZoom=Math.max(leafletMap.getZoom(),minimumZoom);
    constrainMapToTop(activeMap,targetZoom);
    if(targetZoom===minimumZoom&&mapFitsVertically(activeMap,minimumZoom))alignMapTopLeft(activeBounds,minimumZoom);
  });
  window.addEventListener("message",event=>{
    if(event.origin!==location.origin||event.source!==window.parent)return;
    const map=MAPS.find(item=>item.id===event.data?.map);
    if(event.data?.type!=="select-map"||!map)return;
    state.map=map.id;updateMap();closeSidebar();
  });
}

function closeSidebar(){els.sidebar.classList.remove("open");els.backdrop.classList.remove("open");els.menuButton.setAttribute("aria-expanded","false")}
function safeImageUrl(value){try{const url=new URL(value,location.href);return ["http:","https:"].includes(url.protocol)?url.href:""}catch{return ""}}
function clamp(value,min,max){return Math.min(Math.max(value,min),max)}
init();
