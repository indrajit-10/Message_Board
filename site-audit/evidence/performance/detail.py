import json,sys
f=sys.argv[1]; keys=sys.argv[2:]
r=json.load(open(f)); a=r['audits']
def short(u): return u if len(u)<130 else u[:127]+'...'
for k in keys:
    x=a[k]; d=x.get('details') or {}
    print('####',k, x.get('displayValue',''), 'score', x.get('score'))
    items=d.get('items',[])
    if d.get('type')=='list':
        for sub in items:
            for it in sub.get('items',[]): print('  ', {kk:(short(v) if isinstance(v,str) else v) for kk,v in it.items() if kk!='node'})
        continue
    for it in items[:40]:
        row={}
        for kk,v in it.items():
            if kk in ('subItems','node','entity'): 
                if kk=='entity': row['entity']=v if isinstance(v,str) else v.get('text')
                continue
            if isinstance(v,dict): v=v.get('url') or v.get('text') or v.get('value') or str(v)[:80]
            if isinstance(v,float): v=round(v,1)
            if isinstance(v,str): v=short(v)
            row[kk]=v
        print('  ',row)
