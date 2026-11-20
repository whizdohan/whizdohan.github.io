#!/usr/bin/env python3
"""Bundle approved non-map game icons, leaving map and photo assets untouched."""
from __future__ import annotations
import concurrent.futures
import json
import pathlib
import re
import urllib.error
import urllib.request

ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/"assets"/"game"
HOST="https://assets.tarkov.dev/"
SOURCE_FILES=[
    "index.html",
    "tarkov/hub.js",
    "tarkov/trait-icons.js",
    "tarkov/dev-item-icons.js",
    "tarkov/prestige/prestige.js",
]
BASENAME=re.compile(r"^[a-zA-Z0-9-]+\.webp$")
ID=re.compile(r"\b[0-9a-f]{24}\b")
REQ=urllib.request.Request
def fetch(url, data=None, headers=None):
    request=REQ(url,data=data,headers={"User-Agent":"AGIT-Hub-AssetBuilder/1.0",**(headers or {})})
    with urllib.request.urlopen(request,timeout=20) as r:
        return r.read()
def main():
    files={p:(ROOT/p).read_text(encoding="utf-8") for p in SOURCE_FILES}
    paths=set()
    # Existing direct image links, including achievement art and portraits.
    for text in files.values():
        paths.update(re.findall(r"https://assets\.tarkov\.dev/([A-Za-z0-9-]+\.webp)",text))
    # All mapped trait icons.
    trait=files["tarkov/trait-icons.js"]
    paths.update(m.group(1)+".webp" for m in re.finditer(r'"[^"]+":\s*"([0-9a-f]{24})"',trait))
    # Build well-defined icon variants for IDs declared in the hub and tools.
    hub=files["tarkov/hub.js"]
    for block in ["ALLERGY_ITEM_IDS","KAPPA_ITEMS"]:
        m=re.search(r"const "+block+r"=\x60(.*?)\x60",hub,re.S)
        if m: paths.update(x+"-icon.webp" for x in ID.findall(m.group(1)))
    for text in [hub,files["tarkov/prestige/prestige.js"],files["tarkov/dev-item-icons.js"]]:
        for i in set(ID.findall(text)):
            paths.add(i+"-icon.webp")
    # Large trade reward cards also request the 512px variant.
    for m in re.finditer(r'itemId:"([0-9a-f]{24})"',hub):
        paths.add(m.group(1)+"-512.webp")
    # Find exact-name item IDs for previously dynamic seasonal icons.
    manifest=files["tarkov/dev-item-icons.js"]
    names=re.findall(r'"([^"\n]+)":\s*\[',manifest)
    names+=re.findall(r'data-dev-item="([^"]+)"',files["index.html"])
    lookups=sorted(set(names))
    matched={}
    for name in lookups:
        try:
            query="{itemsByName(name:"+json.dumps(name)+"){id name}}"
            raw=fetch("https://api.tarkov.dev/graphql",json.dumps({"query":query}).encode(),{"Content-Type":"application/json"})
            body=json.loads(raw)
            norm=lambda x:re.sub(r"[^a-z0-9]","",x.lower())
            results=(body.get("data") or {}).get("itemsByName") or []
            found=next((x for x in results if norm(x.get("name",""))==norm(name) and ID.fullmatch(x.get("id",""))),None)
            if found:
                matched[name]=found["id"]
                paths.add(found["id"]+"-icon.webp")
        except (ValueError, KeyError, OSError, TimeoutError):
            pass
    OUT.mkdir(parents=True,exist_ok=True)
    files_to_get=sorted(p for p in paths if BASENAME.fullmatch(p))
    def download(path):
        dst=OUT/path
        if dst.exists() and dst.stat().st_size>100:
            return True
        try:
            content=fetch(HOST+path)
            if content[:4] != b"RIFF" or content[8:12]!=b"WEBP":
                return False
            dst.write_bytes(content)
            return True
        except (urllib.error.URLError, TimeoutError, OSError):
            return False
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        results=dict(zip(files_to_get,pool.map(download,files_to_get)))
    ok=sorted(p for p,success in results.items() if success)
    missing=sorted(p for p,success in results.items() if not success)
    # A client-side table makes the same paths available to API-fed items.
    (ROOT/"tarkov"/"local-assets.js").write_text(
        "window.TARKOV_LOCAL_ASSETS=new Set("+json.dumps(ok,ensure_ascii=False)+");\n"
        "window.tarkovLocalIcon=function(url){try{const x=new URL(url,location.origin);"
        "if(x.hostname==='assets.tarkov.dev'||x.origin===location.origin){"
        "const filename=x.pathname.split('/').pop();"
        "return window.TARKOV_LOCAL_ASSETS.has(filename)?'/assets/game/'+filename:'';}"
        "return '';}catch{return '';}};\n",
        encoding="utf-8")
    # Transform only remote game-asset literals. The map/photo directories are never modified.
    for path,text in files.items():
        old=text
        text=text.replace("https://assets.tarkov.dev/","/assets/game/")
        if text!=old:
            (ROOT/path).write_text(text,encoding="utf-8")
    # Resolve known seasonal names to precise IDs, preserving any original known mapping.
    p=ROOT/"tarkov/dev-item-icons.js"
    text=p.read_text(encoding="utf-8")
    for name,item_id in matched.items():
        if not re.search(r'^  '+re.escape(json.dumps(name,ensure_ascii=False))+r':',text,re.M):
            text=text.replace("const ids={","const ids={\n  "+json.dumps(name,ensure_ascii=False)+": "+json.dumps(item_id)+",",1)
    text=text.replace('const validURL=s=>','const validURL=s=>')
    text=text.replace('if(u.protocol!=="https:"||u.hostname!=="assets.tarkov.dev")', 'if(u.protocol!=="https:"||u.hostname!=="assets.tarkov.dev")')
    # Never display a remote image returned by the API unless there is a local copy.
    text=text.replace('const icon=name=>', 'const icon=name=>')
    text=text.replace('ready[name]||"";', 'window.tarkovLocalIcon?.(ready[name])||"";')
    p.write_text(text,encoding="utf-8")
    (ROOT/"assets"/"game"/"manifest.json").write_text(json.dumps({"available":ok,"unavailable":missing,"matchedIds":matched},indent=2),encoding="utf-8")
    print("Downloaded:",len(ok),"Missing:",len(missing),"Resolved names:",len(matched))
    if not ok:
        raise SystemExit("No image assets were downloaded; do not publish broken local paths")
if __name__=="__main__": main()
