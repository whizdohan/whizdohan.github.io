#!/usr/bin/env python3
"""Inspect seasonal game item identifiers and test icon availability."""
import json,re,urllib.request,urllib.error,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
out=root/"assets"/"game"/"quest-icon-audit.json"
targets=["Case with military equipment","Therapist's message","FCPC V5 Black Division","LV-119 Black Division V2","LV-119 MultiCam Black","Black Division encryption keys","Modular Pack 45 Plus","NICE Frame Load Sling","SOTR respirator","Briefcase with documents","14-4 KORD SSD","Laptop from an unknown facility","Black Division rugged laptop","Data from Black Division laptop"]
aliases={"FCPC V5 Black Division":["Ferro Concepts FCPC V5 Plate Carrier (Black Division)"],"LV-119 Black Division V2":["Spiritus Systems LV-119 Plate Carrier (Black Division V2)"],"LV-119 MultiCam Black":["Spiritus Systems LV-119 Plate Carrier (MultiCam Black)"],"Modular Pack 45 Plus":["Tasmanian Tiger Modular Pack 45 Plus (MultiCam Black)"],"NICE Frame Load Sling":["Mystery Ranch NICE Frame Load Sling"],"SOTR respirator":["Gentex Ops-Core SOTR respirator"],"Black Division encryption keys":["Black Division encryption key"]}
def norm(v):return re.sub(r"[^a-z0-9]","",str(v).lower())
def fetch(url):
 req=urllib.request.Request(url,headers={"User-Agent":"SeasonHub/1.0"})
 with urllib.request.urlopen(req,timeout=35) as r:return json.load(r)
def record(obj,store,prefix=""):
 if isinstance(obj,dict):
  name=obj.get("name") or obj.get("Name") or obj.get("normalizedName")
  itemid=obj.get("id") or obj.get("_id")
  if isinstance(name,str) and re.fullmatch(r"[a-f0-9]{24}",str(itemid or "")):
   store.append({"name":name,"id":itemid,"iconLink":obj.get("iconLink"),"source":prefix})
  if len(obj)<150000:
   for k,v in obj.items():
    if isinstance(v,(dict,list)):record(v,store,prefix)
 elif isinstance(obj,list):
  for v in obj:record(v,store,prefix)
def shape(v,depth=0):
 if depth>3:return type(v).__name__
 if isinstance(v,dict):return {"count":len(v),"sample":{str(k):shape(val,depth+1) for k,val in list(v.items())[:3]}}
 if isinstance(v,list):return {"count":len(v),"first":shape(v[0],depth+1) if v else None}
 return str(v)[:100]
def main():
 report={"endpoints":{},"matches":{},"names":targets}
 items=[];translations={}
 for mode in ("pvp-season","pve","regular"):
  for endpoint in ("items","items_en","tasks","tasks_en"):
   url=f"https://json.tarkov.dev/{mode}/{endpoint}"
   try:
    data=fetch(url)
    report["endpoints"][mode+"/"+endpoint]={"type":type(data).__name__,"keys":list(data)[:14] if isinstance(data,dict) else [],"count":len(data),"shape":shape(data)}
    if endpoint.endswith("_en"):
     if isinstance(data,dict):
      translated=data.get("data",data)
      if isinstance(translated,dict):
       for key,value in translated.items():
        if isinstance(value,str) and re.search(r"[a-f0-9]{24}",key):translations[key]=value
    else:record(data,items,mode+"/"+endpoint)
   except Exception as e:report["endpoints"][mode+"/"+endpoint]={"error":str(e)[:150]}
 for name in targets:
  aliasesFor=[name]+aliases.get(name,[])
  keys={norm(s) for s in aliasesFor}
  entries=[x for x in items if norm(x["name"]) in keys]
  for key,value in translations.items():
   if not (key.lower().endswith(" name") or key.lower().endswith(" shortname")) or norm(value) not in keys:continue
   itemid=key[:24]
   if re.fullmatch(r"[a-f0-9]{24}",itemid):
    entries.append({"name":value,"id":itemid,"source":"translation"})
  dedup=list({x["id"]:x for x in entries}.values())
  report["matches"][name]=dedup
 out.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
 print("Record count:",len(items),"Translations:",len(translations),"Matches:",sum(bool(v) for v in report["matches"].values()))
if __name__=="__main__":main()
