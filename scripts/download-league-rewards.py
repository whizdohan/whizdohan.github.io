#!/usr/bin/env python3
"""Download game reward icons identified by item template IDs."""
import json,pathlib,urllib.request
root=pathlib.Path(__file__).resolve().parents[1]
out=root/"assets"/"game"
manifest_path=out/"manifest.json"
manifest=json.loads(manifest_path.read_text())
items={
"recruit-bas-relief":["6a91b07d0265fb6a1f061a8a"],
"survivor-bas-relief":["6a91b4e323415d3f520ba458"],
"going-dark-poster":["6a42642fef6f4bbe8c0ccd4f"],
"veteran-bas-relief":["6a91b5142f7e57600b0a4ccc"],
"wedge-target":["6a3575e125f478c7a20f613d","6a357672ccc2c37fb91b3381"],
"ruthless-bas-relief":["6a91b58214210be75a0260d8"],
"red-accent-walls":["6a3bb5add4f941ec040cc3d9","6a3bbc12c0b3aa391aec2203"],
"reborn-bas-relief":["6a91b5d5ca420f299d08e325"],
"ka-bar-usmc-fighter-knife":["6a3935772db31ca1c800fe26"],
"ascended-bas-relief":["6a91b61314210be75a0260db","6a91b64352bb89bd3602742f"],
"double-dogtag":["6a3549435288a3fe6e085224","6a3548e72a963bcdd8098649"],
"mc-black-shirt":["6a3d258c49fe4bef39034610"],
"tactical-shorts":["6a3d251ed055f047a20fff5f"]
}
def fetch(url):
 request=urllib.request.Request(url,headers={"User-Agent":"AGIT-Season-Hub/1.0"})
 with urllib.request.urlopen(request,timeout=20) as response:return response.read()
result={}
for slug,ids in items.items():
 found=[]
 for id in ids:
  output=out/(id+"-icon.webp")
  if not output.exists():
   for variant in (id+"-icon.webp",id+".webp",id+"-512.webp"):
    try:
     body=fetch("https://assets.tarkov.dev/"+variant)
     if body[:4]==b"RIFF" and body[8:12]==b"WEBP":
      output.write_bytes(body)
      break
    except Exception:pass
  if output.exists() and output.stat().st_size>100:found.append(id+"-icon.webp")
 result[slug]=found
manifest["available"]=sorted(set(manifest["available"])|{name for names in result.values() for name in names})
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
available=manifest["available"]
(root/"tarkov"/"local-assets.js").write_text("window.TARKOV_LOCAL_ASSETS=new Set("+json.dumps(available)+");\n"
"window.tarkovLocalIcon=function(url){try{const x=new URL(url,location.origin);"
"if(x.hostname==='assets.tarkov.dev'||x.origin===location.origin){"
"const filename=x.pathname.split('/').pop();"
"return window.TARKOV_LOCAL_ASSETS.has(filename)?'/assets/game/'+filename:'';}"
"return '';}catch{return '';}};\n",encoding="utf-8")
(out/"league-reward-audit.json").write_text(json.dumps(result,indent=2),encoding="utf-8")
print("verified",sum(bool(x) for x in result.values()),"of",len(result),"reward types")
