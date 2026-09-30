from common import *
from urllib.parse import urldefrag
L = {l['url']: l for l in json.load(open('../../data/links.json'))}
targets = defaultdict(list)
for u, r in P.items():
    for l in r['links']:
        if l['abs']:
            targets[urldefrag(l['abs'])[0]].append((u, l['text'], l['in_main']))
    for im in r['images']:
        if im['src'] and not im['src'].startswith('data:'):
            targets[im['src']].append((u, im.get('alt'), im['in_main']))
unchecked = [t for t in targets if t not in L and t not in P_ALL]
print('targets from fresh pages.json', len(targets), 'unchecked', len(unchecked))
for t in unchecked: print('  ', t, len(targets[t]), targets[t][:2])
json.dump({t: v for t, v in targets.items()}, open('targets.json', 'w'))
