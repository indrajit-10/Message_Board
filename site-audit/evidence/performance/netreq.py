import json,sys
from urllib.parse import urlparse
from collections import defaultdict
f=sys.argv[1]
r=json.load(open(f)); a=r['audits']
items=a['network-requests']['details']['items']
print('requests',len(items),'transfer KiB',round(sum(i.get('transferSize',0) for i in items)/1024),'resource KiB',round(sum(i.get('resourceSize',0) for i in items)/1024))
byhost=defaultdict(lambda:[0,0]); bytype=defaultdict(lambda:[0,0])
for i in items:
    h=urlparse(i['url']).netloc; byhost[h][0]+=1; byhost[h][1]+=i.get('transferSize',0)
    t=i.get('resourceType'); bytype[t][0]+=1; bytype[t][1]+=i.get('transferSize',0)
for h,(n,b) in sorted(byhost.items(), key=lambda x:-x[1][1]): print(f'  {h:45s} {n:4d} {b/1024:8.1f} KiB')
print()
for h,(n,b) in sorted(bytype.items(), key=lambda x:-x[1][1]): print(f'  {str(h):20s} {n:4d} {b/1024:8.1f} KiB')
if len(sys.argv)>2:
    for i in sorted(items,key=lambda i:-i.get('transferSize',0))[:int(sys.argv[2])]:
        print(f"  {i.get('transferSize',0)/1024:7.1f}K {i.get('resourceType')} {i.get('statusCode')} {i.get('priority')} {i['url'][:140]}")
