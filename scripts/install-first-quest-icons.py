#!/usr/bin/env python3
"""Install verified quest-object icons into the local image inventory."""
import json
import pathlib
import urllib.request

root=pathlib.Path(__file__).resolve().parents[1]
assets=root/"assets"/"game"
items={
    "Case with military equipment":"6a671d87ff6f8a0b080b6bf3",
    "Therapist's message":"6a6101b09b3e38f37a0dc67e",
}
installed={}
missing={}
for name,identifier in items.items():
    dest=assets/(identifier+"-icon.webp")
    if not dest.exists():
        for filename in (identifier+"-icon.webp",identifier+".webp",identifier+"-512.webp"):
            try:
                request=urllib.request.Request("https://assets.tarkov.dev/"+filename,headers={"User-Agent":"AGIT-Season-Hub/1.0"})
                with urllib.request.urlopen(request,timeout=20) as response: body=response.read()
                if body[:4]==b"RIFF" and body[8:12]==b"WEBP":
                    dest.write_bytes(body)
                    break
            except Exception:
                continue
    if dest.exists() and dest.stat().st_size>100:
        installed[name]=identifier
    else:
        missing[name]=identifier
manifest_path=assets/"manifest.json"
manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
manifest["available"]=sorted(set(manifest["available"])|{identifier+"-icon.webp" for identifier in installed.values()})
manifest["matchedIds"].update(installed)
manifest["unavailable"]=sorted(set(manifest["unavailable"])-{identifier+"-icon.webp" for identifier in installed.values()})
manifest_path.write_text(json.dumps(manifest,indent=2,ensure_ascii=False),encoding="utf-8")
icon_path=root/"tarkov"/"dev-item-icons.js"
text=icon_path.read_text(encoding="utf-8")
p=text.index("const ids={")
end=text.index("};",p)
for name,identifier in installed.items():
    if json.dumps(name)+":" not in text[p:end]:
        text=text.replace("const ids={","const ids={\n  "+json.dumps(name)+": "+json.dumps(identifier)+",",1)
icon_path.write_text(text,encoding="utf-8")
available=manifest["available"]
(root/"tarkov"/"local-assets.js").write_text("window.TARKOV_LOCAL_ASSETS=new Set("+json.dumps(available)+");\n"
"window.tarkovLocalIcon=function(url){try{const x=new URL(url,location.origin);"
"if(x.hostname==='assets.tarkov.dev'||x.origin===location.origin){"
"const filename=x.pathname.split('/').pop();"
"return window.TARKOV_LOCAL_ASSETS.has(filename)?'/assets/game/'+filename:'';}"
"return '';}catch{return '';}};\n",encoding="utf-8")
(assets/"initial-icon-check.json").write_text(json.dumps({"installed":installed,"unavailable":missing},indent=2),encoding="utf-8")
print("installed",len(installed),"unavailable",len(missing))
