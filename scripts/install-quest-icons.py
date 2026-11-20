#!/usr/bin/env python3
"""Install verified matching seasonal item icons and refresh the local inventory."""
import json,pathlib,re,urllib.request,urllib.error
ROOT=pathlib.Path(__file__).resolve().parents[1]
DIR=ROOT/"assets"/"game"
audit=json.loads((DIR/"quest-icon-audit.json").read_text(encoding="utf-8"))
manifest_path=DIR/"manifest.json"
manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
images=set(manifest["available"])
installed={}
failed={}
def get(url):
 req=urllib.request.Request(url,headers={"User-Agent":"SeasonHub/1.0"})
 with urllib.request.urlopen(req,timeout=20) as response:
  return response.read()
for name,found in audit["matches"].items():
 if len(found)!=1:continue
 id=found[0]["id"]
 filename=f"{id}-icon.webp"
 if filename in images or (DIR/filename).exists():
  images.add(filename);installed[name]=id;continue
 for source in (f"{id}-icon.webp",f"{id}.webp",f"{id}-512.webp"):
  try:
   body=get("https://assets.tarkov.dev/"+source)
   if body[:4]!=b"RIFF" or body[8:12]!=b"WEBP":continue
   (DIR/filename).write_bytes(body)
   images.add(filename);installed[name]=id;break
  except (OSError,urllib.error.URLError):continue
 if name not in installed:failed[name]=id
# Add only verified downloaded icon IDs to the browser lookup map.
path=ROOT/"tarkov"/"dev-item-icons.js"
text=path.read_text(encoding="utf-8")
for name,id in installed.items():
 pair="  "+json.dumps(name,ensure_ascii=False)+": "+json.dumps(id)+",\n"
 if not re.search(r'^\s*'+re.escape(json.dumps(name,ensure_ascii=False))+r':',text,re.M):
  text=text.replace('const ids={\n','const ids={\n'+pair,1)
path.write_text(text,encoding="utf-8")
# Keep the browser-side local asset manifest synchronized.
ok=sorted(images)
manifest["available"]=ok
manifest["unavailable"]=sorted(set(manifest["unavailable"])-set(ok))
manifest["matchedIds"].update(installed)
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
local=ROOT/"tarkov"/"local-assets.js"
local.write_text("window.TARKOV_LOCAL_ASSETS=new Set("+json.dumps(ok,ensure_ascii=False)+");\n"
"window.tarkovLocalIcon=function(url){try{const x=new URL(url,location.origin);"
"if(x.hostname==='assets.tarkov.dev'||x.origin===location.origin){"
"const filename=x.pathname.split('/').pop();"
"return window.TARKOV_LOCAL_ASSETS.has(filename)?'/assets/game/'+filename:'';}"
"return '';}catch{return '';}};\n",encoding="utf-8")
(DIR/"quest-icon-install-status.json").write_text(json.dumps({"installed":installed,"unavailable":failed,"stillUnmatched":[name for name,result in audit["matches"].items() if not result]},indent=2),encoding="utf-8")
print("Installed:",len(installed),"Missing source images:",len(failed),"No ID:",sum(not x for x in audit["matches"].values()))
