"""Gentle, cached fetcher for the SEO audit (sequential, 1.5 s pause between live requests)."""
import hashlib, json, os, sys, time, requests
CACHE = os.path.join(os.path.dirname(__file__), "cache")
UA = "Mozilla/5.0 (compatible; 123GreetingsSiteAudit/1.0; SEO)"
_s = requests.Session(); _s.headers["User-Agent"] = UA
_last = [0.0]

def fetch(url, allow_redirects=True, method="GET", force=False, ua=None):
    key = hashlib.md5(f"{method} {url} {allow_redirects} {ua}".encode()).hexdigest()
    path = os.path.join(CACHE, key + ".json")
    if os.path.exists(path) and not force:
        return json.load(open(path))
    wait = 1.5 - (time.time() - _last[0])
    if wait > 0: time.sleep(wait)
    for attempt in range(4):
        headers = {"User-Agent": ua} if ua else {}
        r = _s.request(method, url, allow_redirects=allow_redirects, timeout=30, headers=headers)
        _last[0] = time.time()
        if r.status_code == 429:
            time.sleep(10 * (attempt + 1)); continue
        break
    rec = {"url": url, "status": r.status_code, "final_url": r.url,
           "history": [[h.status_code, h.url, h.headers.get("location")] for h in r.history],
           "headers": dict(r.headers), "text": r.text if method == "GET" else ""}
    json.dump(rec, open(path, "w"))
    return rec

if __name__ == "__main__":
    for u in sys.argv[1:]:
        r = fetch(u)
        print(r["status"], r["final_url"], r["history"])
