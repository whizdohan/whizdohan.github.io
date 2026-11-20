/* Non-map item imagery: only match Tarkov.dev item records, never third-party images.
 * Verified item IDs are pinned; the remaining names require exact normalized match from Tarkov.dev.
 * The API may omit seasonal quest objects. In that case render the item name without an image.
 */
(function(){
"use strict";
const ids={
  "Siege-R Black Division": "68947a4be4bf255d1b0ca746",
  "LV-119 Black Division V1": "689479a4a733b1602007e2eb",
  "2 Day Assault Pack": "68947ab5a733b1602007e2fe",
  "M53A1 gas mask": "689b880fff8b4adc420f5b56",
  "Gatorz Specter glasses": "689b3fffa1295e322207a677",
  "Black Division gear crate": "6a4fa628b4831242f306e8cd"
};
const aliases={
  "Siege-R Black Division": [
    "First Spear Siege-R Optimized M.A.S.S. Plate Carrier (Black Division)"
  ],
  "LV-119 Black Division V1": [
    "Spiritus Systems LV-119 Plate Carrier (Black Division V1)"
  ],
  "LV-119 Black Division V2": [
    "Spiritus Systems LV-119 Plate Carrier (Black Division V2)"
  ],
  "FCPC V5 Black Division": [
    "Ferro Concepts FCPC V5 Plate Carrier (Black Division)"
  ],
  "LV-119 MultiCam Black": [
    "Spiritus Systems LV-119 Plate Carrier (MultiCam Black)"
  ],
  "Modular Pack 45 Plus": [
    "Tasmanian Tiger Modular Pack 45 Plus (MultiCam Black)"
  ],
  "2 Day Assault Pack": [
    "Mystery Ranch 2 Day Assault Pack (Black)"
  ],
  "NICE Frame Load Sling": [
    "Mystery Ranch NICE Frame Load Sling"
  ],
  "M53A1 gas mask": [
    "Avon M53A1 gas mask"
  ],
  "SOTR respirator": [
    "Gentex Ops-Core SOTR respirator"
  ],
  "Gatorz Specter glasses": [
    "Gatorz Specter MILSPEC ballistic glasses"
  ],
  "WI-FI Camera": [
    "WI-FI Camera"
  ],
  "14-4 KORD SSD": [
    "14-4 KORD SSD"
  ],
  "TP-200 TNT brick": [
    "TP-200 TNT brick",
    "TP-200 TNT Brick"
  ],
  "Black Division encryption keys": [
    "Black Division encryption key",
    "Black Division encryption keys"
  ],
  "Briefcase with documents": [
    "Briefcase with documents"
  ],
  "Case with military equipment": [
    "Case with military equipment"
  ],
  "Therapist's message": [
    "Therapist's message"
  ],
  "Laptop from an unknown facility": [
    "Laptop from an unknown facility"
  ],
  "Black Division rugged laptop": [
    "Black Division rugged laptop"
  ],
  "Data from Black Division laptop": [
    "Data from Black Division laptop"
  ]
};
const ready={};
let pending=null;
const norm=s=>String(s||"").toLowerCase().normalize("NFKC").replace(/[^a-z0-9]+/g,"");
const validURL=s=>{try{const u=new URL(s);return u.protocol==="https:"&&u.hostname==="assets.tarkov.dev"?u.href:null}catch{return null}};
const icon=name=>ids[name]?"https://assets.tarkov.dev/"+ids[name]+"-icon.webp":ready[name]||"";
const targets=()=>[...document.querySelectorAll("img[data-dev-item]")];
function paint(){
  for(const img of targets()){
    const url=icon(img.dataset.devItem);
    if(url&&img.getAttribute("src")!==url){img.src=url;img.hidden=false;img.onerror=()=>{img.hidden=true;img.removeAttribute("src")};}
    else if(!url){img.hidden=true;img.removeAttribute("src")}
  }
}
async function load(){
  if(pending)return pending;
  const desired=[...new Set(targets().map(img=>img.dataset.devItem).filter(n=>n&&!ids[n]))];
  if(!desired.length)return;
  pending=(async()=>{
    const lookups=[];
    for(const name of desired)for(const label of [name,...(aliases[name]||[])])if(!lookups.some(x=>x.label===label))lookups.push({label});
    const names=lookups.map((entry,i)=>{entry.key="q"+i;return entry.key+":itemsByName(name:"+JSON.stringify(entry.label)+"){id name iconLink}"});
    try{
      const response=await fetch("https://api.tarkov.dev/graphql",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({query:"query SeasonItemIcons { "+names.join(" ")+" }"})});
      if(!response.ok)return;
      const data=(await response.json()).data||{};
      for(const target of desired){
        const allowed=new Set([target,...(aliases[target]||[])].map(norm));
        let match=null;
        for(const entry of lookups){
          if(!allowed.has(norm(entry.label)))continue;
          for(const candidate of data[entry.key]||[]){
            if(!allowed.has(norm(candidate.name)))continue;
            const url=validURL(candidate.iconLink)||(candidate.id&&/^[0-9a-f]{24}$/.test(candidate.id)?"https://assets.tarkov.dev/"+candidate.id+"-icon.webp":null);
            if(url){match=url;break}
          }
          if(match)break;
        }
        if(match)ready[target]=match;
      }
    }catch{/* No unrelated or external image fallback. */}
  })().finally(()=>{pending=null;paint()});
  return pending;
}
function hydrate(){paint();if(targets().some(img=>!icon(img.dataset.devItem)))load()}
window.TARKOV_DEV_ITEM_ICONS={icon,hydrate};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",hydrate,{once:true});else hydrate();
})();
