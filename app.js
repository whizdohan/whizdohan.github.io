const MAP_ASSET_ROOT="https://raw.githubusercontent.com/TarkovTracker/tarkovdata/master/maps/";
const MAPS=[
  {id:"customs",name:"Customs",code:"CST",file:"Customs.svg",width:1062.4827,height:535.17401},
  {id:"ground-zero",name:"Ground Zero",code:"GZ",file:"GroundZero.svg",width:348.92543,height:488.44792},
  {id:"factory",name:"Factory",code:"FCT",file:"Factory.svg",width:131.57087,height:141.80041},
  {id:"woods",name:"Woods",code:"WDS",file:"Woods.svg",width:1401.8693,height:1420.5972},
  {id:"reserve",name:"Reserve",code:"RSV",file:"Reserve.svg",width:827.28742,height:761.16437},
  {id:"shoreline",name:"Shoreline",code:"SHR",file:"Shoreline.svg",width:1559.5717,height:1032.4935},
  {id:"interchange",name:"Interchange",code:"INT",file:"Interchange.svg",width:977.09998,height:977.09998},
  {id:"lighthouse",name:"Lighthouse",code:"LHT",file:"Lighthouse.svg",width:1059.3752,height:1722.9499},
  {id:"streets",name:"Streets of Tarkov",code:"SOT",file:"StreetsOfTarkov.svg",width:605.32395,height:831.57753},
  {id:"laboratory",name:"The Lab",code:"LAB",file:"Labs.svg",width:720,height:586}
].map(map=>({...map,image:`${MAP_ASSET_ROOT}${map.file}`,source:`https://github.com/TarkovTracker/tarkovdata/blob/master/maps/${map.file}`}));

const CATEGORIES={
  technical:{name:"Technical Documents",required:61,color:"#d3a759"},pmc:{name:"PMC Personnel Files",required:71,color:"#bd7469"},
  project:{name:"Project Files",required:49,color:"#70a0a7"},blueprints:{name:"Blueprints",required:51,color:"#738db5"},
  test:{name:"Test Documents",required:61,color:"#a08ab4"},user:{name:"User Documents",required:58,color:"#8caa70"},
  medical:{name:"Medical Documents",required:47,color:"#b06c73"},financial:{name:"Financial Documents",required:103,color:"#b99a62"}
};

const locations=Array.isArray(window.DOCUMENT_LOCATIONS)?window.DOCUMENT_LOCATIONS:[];
const query=new URLSearchParams(location.search);
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
  mapSource:document.querySelector("#map-source")
};

let leafletMap;
let imageLayer;
let markerLayer;
let activeMap;

function init(){
  MAPS.forEach(map=>els.mapSelect.add(new Option(map.name,map.id)));
  els.mapSelect.value=state.map;
  renderCategories();
  bindEvents();
  if(!window.L){showMapError("INTERACTIVE MAP UNAVAILABLE","Leaflet could not be loaded. Refresh the page to try again.");return}
  leafletMap=L.map("leaflet-map",{crs:L.CRS.Simple,minZoom:-3,maxZoom:4,zoomSnap:.25,zoomDelta:.5,attributionControl:true});
  leafletMap.attributionControl.setPrefix('<a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer">Leaflet</a>');
  markerLayer=L.layerGroup().addTo(leafletMap);
  leafletMap.on("mousemove",updateCoordinate);
  updateMap();
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
  els.currentMapName.textContent=activeMap.name;
  els.mapSelect.value=activeMap.id;
  els.mapSource.href=activeMap.source;
  els.mapSource.textContent=`tarkov.dev community data · ${activeMap.name} SVG`;
  els.mapSource.setAttribute("aria-label",`Open the ${activeMap.name} SVG source`);
  showLoading();
  if(imageLayer)leafletMap.removeLayer(imageLayer);
  leafletMap.closePopup();
  leafletMap.setMaxBounds(null);
  markerLayer.clearLayers();
  const bounds=L.latLngBounds([[0,0],[activeMap.height,activeMap.width]]);
  imageLayer=L.imageOverlay(activeMap.image,bounds,{alt:`${activeMap.name} SVG map from tarkov.dev community data`,interactive:false,opacity:1});
  imageLayer.on("load",()=>{if(activeMap.id!==requested.id)return;els.emptyState.hidden=true;leafletMap.invalidateSize();leafletMap.fitBounds(bounds,{padding:[18,18],animate:false});leafletMap.setMaxBounds(bounds.pad(.45))});
  imageLayer.on("error",()=>{if(activeMap.id!==requested.id)return;showMapError("MAP COULD NOT BE LOADED",`Open the ${requested.name} source map to view it directly.`,requested.source)});
  imageLayer.addTo(leafletMap);
  renderMarkers();
}

function renderMarkers(){
  if(!markerLayer||!activeMap)return;
  markerLayer.clearLayers();
  const filtered=locations.filter(item=>item.map===activeMap.id&&state.filters.includes(item.category));
  filtered.forEach(item=>{
    const category=CATEGORIES[item.category]||CATEGORIES.technical;
    const icon=L.divIcon({className:"document-marker-shell",html:`<span class="document-marker" style="--marker:${category.color}"></span>`,iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-13]});
    const marker=L.marker(percentToLatLng(item.x,item.y),{icon,title:item.title||"Document location",keyboard:true});
    marker.bindPopup(buildPhotoPopup(item,category),{className:"document-photo-popup",maxWidth:300,minWidth:220,closeButton:true});
    marker.addTo(markerLayer);
  });
  els.visibleCount.textContent=`${filtered.length} LOCATIONS VISIBLE`;
}

function buildPhotoPopup(item,category){
  const card=document.createElement("article");
  card.className="location-popup-card";
  const label=document.createElement("small");
  label.textContent=category.name;
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
    placeholder.textContent="LOCATION PHOTO COMING SOON";
    card.append(placeholder);
  }
  const title=document.createElement("strong");
  title.textContent=item.title||"Document location";
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

function showLoading(){
  els.emptyState.hidden=false;
  els.emptyState.innerHTML='<span class="map-loader" aria-hidden="true"></span><strong>LOADING SVG MAP</strong><p>The interactive map may take a moment to appear.</p>';
}

function showMapError(title,copy,source){
  els.emptyState.hidden=false;
  els.emptyState.innerHTML="";
  const icon=document.createElement("span");icon.className="empty-icon";icon.textContent="!";
  const heading=document.createElement("strong");heading.textContent=title;
  const message=document.createElement("p");message.textContent=copy;
  els.emptyState.append(icon,heading,message);
  if(source){const link=document.createElement("a");link.href=source;link.target="_blank";link.rel="noopener noreferrer";link.textContent="OPEN SVG SOURCE";els.emptyState.append(link)}
}

function openDetail(id){
  const item=locations.find(location=>location.id===id);if(!item)return;
  const category=CATEGORIES[item.category];
  document.querySelector("#detail-category").textContent=category?.name||"DOCUMENT LOCATION";
  document.querySelector("#detail-title").textContent=item.title||"LOCATION DETAILS";
  document.querySelector("#detail-description").textContent=item.description||"No detailed description is available yet.";
  const image=item.detailImage||item.previewImage;
  const container=document.querySelector("#detail-image");
  container.replaceChildren();
  if(image){const photo=document.createElement("img");photo.src=safeImageUrl(image);photo.alt=item.title||"Location details";container.append(photo)}
  else container.textContent="IMAGE COMING SOON";
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
