const MAP_ASSET_ROOT="../assets/maps-jpg/";
const MAP_SOURCE_ROOT="https://tarkov.dev/maps/";
const MAP_TRANSLATION_KEYS={"customs":"customs","ground-zero":"groundZero","factory":"factory","woods":"woods","reserve":"reserve","shoreline":"shoreline","interchange":"interchange","lighthouse":"lighthouse","streets":"streets","laboratory":"laboratory"};
const MAPS=[
  {id:"customs",name:"Customs",code:"CST",file:"customs-2d.jpg",width:2200,height:1153},
  {id:"ground-zero",name:"Ground Zero",code:"GZ",file:"ground-zero-2d.jpg",width:2200,height:2200},
  {id:"factory",name:"Factory",code:"FCT",file:"factory-2d.jpg",width:2200,height:1090},
  {id:"woods",name:"Woods",code:"WDS",file:"woods-2d.jpg",width:2200,height:2153},
  {id:"reserve",name:"Reserve",code:"RSV",file:"reserve-2d.jpg",width:2200,height:1304},
  {id:"shoreline",name:"Shoreline",code:"SHR",file:"shoreline-2d.jpg",width:2200,height:1507},
  {id:"interchange",name:"Interchange",code:"INT",file:"interchange-2d.jpg",width:2000,height:1106},
  {id:"lighthouse",name:"Lighthouse",code:"LHT",file:"lighthouse-2d.jpg",width:1267,height:2200},
  {id:"streets",name:"Streets of Tarkov",code:"SOT",file:"streets-2d.jpg",width:2200,height:1697},
  {id:"laboratory",name:"The Lab",code:"LAB",file:"labs-2d.jpg",width:2200,height:1140}
].map(map=>({...map,image:`${MAP_ASSET_ROOT}${map.file}`,source:`${MAP_SOURCE_ROOT}${map.file}`}));

const CATEGORIES={
  technical:{name:"Technical Documents",required:61,color:"#d3a759"},pmc:{name:"PMC Personnel Files",required:71,color:"#bd7469"},
  project:{name:"Project Files",required:49,color:"#70a0a7"},blueprints:{name:"Blueprints",required:51,color:"#738db5"},
  test:{name:"Test Documents",required:61,color:"#a08ab4"},user:{name:"User Documents",required:58,color:"#8caa70"},
  medical:{name:"Medical Documents",required:47,color:"#b06c73"},financial:{name:"Financial Documents",required:103,color:"#b99a62"}
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
  coordinateToast:document.querySelector("#coordinate-toast")
};

let leafletMap;
let imageLayer;
let markerLayer;
let activeMap;
let selectedCoordinateMarker;
let coordinateToastTimer;

async function init(){
  await loadLanguage();
  MAPS.forEach(map=>els.mapSelect.add(new Option(mapName(map),map.id)));
  els.mapSelect.value=state.map;
  renderCategories();
  bindEvents();
  prepareStaticMap();
  if(!window.L)return;
  leafletMap=L.map("leaflet-map",{crs:L.CRS.Simple,minZoom:-3,maxZoom:4,zoomSnap:.25,zoomDelta:.5,wheelPxPerZoomLevel:60,scrollWheelZoom:true,boxZoom:true,doubleClickZoom:true,touchZoom:true,attributionControl:true});
  leafletMap.setView([activeMap.height/2,activeMap.width/2],-2,{animate:false});
  leafletMap.attributionControl.setPrefix('<a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer">Leaflet</a>');
  markerLayer=L.layerGroup().addTo(leafletMap);
  leafletMap.on("mousemove",updateCoordinate);
  leafletMap.on("click",selectCoordinate);
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
  els.mapSource.textContent=`tarkov.dev · ${mapName(activeMap)} 2D JPG`;
  els.fallbackImage.alt=`${activeMap.name} 2D map`;
  els.fallbackImage.onload=()=>{if(els.fallbackImage.dataset.map===activeMap.id)els.emptyState.hidden=true};
  els.fallbackImage.onerror=()=>{if(els.fallbackImage.dataset.map===activeMap.id)showMapError(t("mapViewer.loadFailed"),mapName(activeMap),activeMap.source)};
  els.fallbackImage.dataset.map=activeMap.id;
  els.fallbackImage.src=`${activeMap.image}?v=2`;
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
  els.mapSource.textContent=`tarkov.dev · ${mapName(activeMap)} 2D JPG`;
  els.mapSource.setAttribute("aria-label",`Open the ${activeMap.name} map image`);
  showLoading();
  if(imageLayer)leafletMap.removeLayer(imageLayer);
  leafletMap.closePopup();
  leafletMap.setMaxBounds(null);
  markerLayer.clearLayers();
  selectedCoordinateMarker=null;
  const bounds=L.latLngBounds([[0,0],[requested.height,requested.width]]);
  imageLayer=L.imageOverlay(requested.image,bounds,{alt:`${requested.name} 2D map from tarkov.dev`,interactive:false,opacity:1});
  imageLayer.on("load",()=>{
    if(activeMap.id!==requested.id)return;
    els.emptyState.hidden=true;
    leafletMap.invalidateSize();
    alignMapTopLeft(bounds);
    leafletMap.setMaxBounds(bounds.pad(.45));
    renderMarkers();
  });
  imageLayer.on("error",()=>{if(activeMap.id===requested.id)showMapError(t("mapViewer.loadFailed"),mapName(requested),requested.source)});
  imageLayer.addTo(leafletMap);
}

function alignMapTopLeft(bounds){
  const zoom=leafletMap.getBoundsZoom(bounds,false,L.point(0,0));
  const topLeft=leafletMap.project(bounds.getNorthWest(),zoom);
  const centerPoint=topLeft.add(leafletMap.getSize().divideBy(2));
  leafletMap.setView(leafletMap.unproject(centerPoint,zoom),zoom,{animate:false});
}

function renderMarkers(){
  if(!markerLayer||!activeMap)return;
  markerLayer.clearLayers();
  const filtered=locations.filter(item=>item.map===activeMap.id&&state.filters.includes(item.category));
  filtered.forEach(item=>{
    const category=CATEGORIES[item.category]||CATEGORIES.technical;
    const icon=L.divIcon({className:"document-marker-shell",html:`<span class="document-marker" style="--marker:${category.color}"></span>`,iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-13]});
    const marker=L.marker(percentToLatLng(item.x,item.y),{icon,title:item.title||t("mapViewer.location"),keyboard:true});
    marker.bindPopup(buildPhotoPopup(item,category),{className:"document-photo-popup",maxWidth:300,minWidth:220,closeButton:true});
    marker.addTo(markerLayer);
  });
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

function updateCoordinate(event){
  if(!activeMap)return;
  const x=clamp(event.latlng.lng/activeMap.width*100,0,100);
  const y=clamp((1-event.latlng.lat/activeMap.height)*100,0,100);
  els.coordinate.textContent=`X ${x.toFixed(1).padStart(5,"0")} · Y ${y.toFixed(1).padStart(5,"0")}`;
}

function coordinateFromLatLng(latlng){
  return {x:clamp(latlng.lng/activeMap.width*100,0,100),y:clamp((1-latlng.lat/activeMap.height)*100,0,100)};
}

async function selectCoordinate(event){
  if(!activeMap)return;
  const point=coordinateFromLatLng(event.latlng);
  const x=Number(point.x.toFixed(1));
  const y=Number(point.y.toFixed(1));
  const coordinate=`X ${x.toFixed(1)} · Y ${y.toFixed(1)}`;
  els.coordinate.textContent=coordinate;
  if(selectedCoordinateMarker)leafletMap.removeLayer(selectedCoordinateMarker);
  const icon=L.divIcon({className:"selected-coordinate-shell",html:'<span class="selected-coordinate-pin"></span>',iconSize:[28,28],iconAnchor:[14,14]});
  selectedCoordinateMarker=L.marker(event.latlng,{icon,interactive:false}).addTo(leafletMap);
  try{await navigator.clipboard.writeText(coordinate)}catch{}
  showCoordinateToast(t("mapViewer.coordinateCopied"));
  window.parent.postMessage({type:"map-coordinate",map:activeMap.id,x,y,coordinate},location.origin);
}

function showCoordinateToast(copy){
  clearTimeout(coordinateToastTimer);
  els.coordinateToast.textContent=copy;
  els.coordinateToast.classList.add("visible");
  coordinateToastTimer=setTimeout(()=>els.coordinateToast.classList.remove("visible"),1800);
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
  document.querySelector("#detail-description").textContent=item.description||t("mapViewer.noDetails");
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
  document.querySelector("#toggle-all").addEventListener("click",event=>{const allEnabled=state.filters.length===Object.keys(CATEGORIES).length;state.filters=allEnabled?[]:Object.keys(CATEGORIES);renderCategories();renderMarkers();event.currentTarget.textContent=allEnabled?"SELECT ALL":"CLEAR ALL"});
  document.querySelector("#detail-close").addEventListener("click",()=>els.detailDialog.close());
  els.menuButton.addEventListener("click",()=>{const open=!els.sidebar.classList.contains("open");els.sidebar.classList.toggle("open",open);els.backdrop.classList.toggle("open",open);els.menuButton.setAttribute("aria-expanded",String(open))});
  els.backdrop.addEventListener("click",closeSidebar);
  window.addEventListener("resize",()=>leafletMap?.invalidateSize());
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
