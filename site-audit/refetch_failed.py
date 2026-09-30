#!/usr/bin/env python3
"""Re-fetch (slowly, sequentially) any URL in data/pages.json that did not
return a final status (e.g. 429 rate limiting) and merge the new records.
With --content, re-fetch every page/post instead."""
import json
import time

import crawler

P = json.load(open("data/pages.json"))
import sys
if "--content" in sys.argv:
    # re-parse every page/post (e.g. after adding a new field to crawler.parse)
    todo = [u for u, r in P.items() if r.get("type") in ("page", "post") and u.startswith("https://")]
else:
    todo = [u for u, r in P.items() if r.get("status") in (None, 429, 500, 502, 503, 504)]
print(len(todo), "to refetch")
for i, u in enumerate(todo):
    rec = crawler.fetch_page(u)
    rec["sitemap"] = P[u].get("sitemap")
    rec["lastmod"] = P[u].get("lastmod")
    rec["inlinks"] = P[u].get("inlinks", [])
    P[u] = rec
    print(i, rec.get("status"), u, flush=True)
    time.sleep(1.0)
json.dump(P, open("data/pages.json", "w"))
