#!/usr/bin/env python3
"""Crawl blog.123greetings.com and collect per-page SEO, content and link data.

Outputs (in ./data):
  pages.json   - one record per crawled HTML page
  links.json   - one record per unique link/image target with HTTP status
"""
import json
import re
import sys
import time
import threading
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urljoin, urlparse, urldefrag

import requests
from bs4 import BeautifulSoup

BASE = "https://blog.123greetings.com/"
HOST = urlparse(BASE).netloc
UA = "Mozilla/5.0 (compatible; 123GreetingsSiteAudit/1.0; +https://blog.123greetings.com/)"
OUT = "data"
MAX_PAGES = 3000
WORKERS = 6

SKIP_PATH = re.compile(
    r"^/(wp-content|wp-json|wp-admin|wp-includes|xmlrpc\.php|feed|comments/feed|_jb_static|wp-login\.php)"
    r"|/feed/?$|/embed/?$|\.(jpe?g|png|gif|webp|svg|pdf|zip|mp4|mp3|css|js|xml|ico)$",
    re.I,
)

local = threading.local()


def session():
    if not hasattr(local, "s"):
        s = requests.Session()
        s.headers["User-Agent"] = UA
        s.headers["Accept-Language"] = "en-US,en;q=0.9"
        local.s = s
    return local.s


def get(url, method="GET", **kw):
    last = None
    for attempt in range(6):
        try:
            r = session().request(method, url, timeout=25, allow_redirects=True, **kw)
            if r.status_code == 429 and attempt < 5:
                # WordPress.com rate limit: back off and retry
                time.sleep(int(r.headers.get("retry-after") or 0) or 5 * (attempt + 1))
                continue
            return r
        except requests.RequestException as e:
            last = e
            time.sleep(1.5 * (attempt + 1))
    raise last


def norm(url):
    url, _ = urldefrag(url)
    p = urlparse(url)
    if p.netloc == HOST and p.path and not p.path.endswith("/") and "." not in p.path.rsplit("/", 1)[-1]:
        url = url.replace(p.path, p.path + "/", 1) if not p.query else url
    return url


def sitemap_urls():
    urls = {}
    idx = get(BASE + "sitemap_index.xml").text
    for sm in re.findall(r"<loc>([^<]+)</loc>", idx):
        kind = sm.rsplit("/", 1)[-1].replace("-sitemap.xml", "")
        body = get(sm).text
        for u in re.findall(r"<url>\s*<loc>([^<]+)</loc>(?:\s*<lastmod>([^<]+)</lastmod>)?", body):
            urls[u[0]] = {"sitemap": kind, "lastmod": u[1]}
    return urls


BLOCK_TAGS = ["p", "li", "div", "h1", "h2", "h3", "h4", "h5", "h6", "tr", "td", "th", "blockquote", "ul", "ol", "summary", "details", "section", "article"]


def text_of(el):
    """Visible text with inline elements joined naturally (no stray space before
    punctuation after a link) and block elements separated by a space."""
    if el is None:
        return ""
    el = BeautifulSoup(str(el), "lxml")
    for br in el.find_all("br"):
        br.replace_with(" ")
    for t in el.find_all(BLOCK_TAGS):
        t.append(" ")
        t.insert(0, " ")
    return re.sub(r"\s+", " ", el.get_text("")).strip()


HIDE_ALL = {"elementor-hidden-desktop", "elementor-hidden-tablet", "elementor-hidden-mobile"}


def is_hidden(el):
    """True when el sits in an Elementor element hidden on every breakpoint
    (still in the HTML that search engines read, but never shown to visitors)."""
    for a in [el] + list(el.parents):
        if hasattr(a, "get") and HIDE_ALL.issubset(set(a.get("class") or [])):
            return True
    return False


def main_content(soup):
    for sel in (
        ".elementor[data-elementor-type=wp-page]",
        ".inner-post-entry",
        ".entry-content",
        "#main",
    ):
        el = soup.select_one(sel)
        if el:
            return el, sel
    return soup.body, "body"


def parse(url, resp):
    soup = BeautifulSoup(resp.text, "lxml")
    rec = {"url": url, "final_url": resp.url, "status": resp.status_code}
    rec["redirects"] = [r.url for r in resp.history]
    rec["elapsed_ms"] = int(resp.elapsed.total_seconds() * 1000)
    rec["html_bytes"] = len(resp.content)
    body_cls = soup.body.get("class", []) if soup.body else []
    rec["body_class"] = " ".join(body_cls[:8])
    if "single-post" in body_cls:
        rec["type"] = "post"
    elif "page" in body_cls or "home" in body_cls:
        rec["type"] = "page"
    elif "tag" in body_cls:
        rec["type"] = "tag"
    elif "category" in body_cls:
        rec["type"] = "category"
    elif "author" in body_cls:
        rec["type"] = "author"
    elif "error404" in body_cls:
        rec["type"] = "404"
    else:
        rec["type"] = "other"

    head = soup.head or soup
    rec["title"] = text_of(soup.title)
    md = head.find("meta", attrs={"name": "description"})
    rec["meta_description"] = (md.get("content") or "").strip() if md else None
    rb = head.find("meta", attrs={"name": "robots"})
    rec["robots"] = rb.get("content") if rb else None
    can = head.find("link", rel="canonical")
    rec["canonical"] = can.get("href") if can else None
    og = {}
    for m in head.find_all("meta", property=re.compile("^og:")):
        og[m["property"]] = m.get("content")
    rec["og"] = og
    rec["lang"] = soup.html.get("lang") if soup.html else None
    vp = head.find("meta", attrs={"name": "viewport"})
    rec["viewport"] = vp.get("content") if vp else None

    ld = []
    for s in soup.find_all("script", type="application/ld+json"):
        try:
            ld.append(json.loads(s.string or ""))
        except Exception:
            rec.setdefault("ldjson_errors", 0)
            rec["ldjson_errors"] += 1
    types, dates = [], {}
    def walk(o):
        if isinstance(o, dict):
            t = o.get("@type")
            if t:
                types.extend(t if isinstance(t, list) else [t])
            for k in ("datePublished", "dateModified"):
                if k in o and k not in dates:
                    dates[k] = o[k]
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(ld)
    rec["schema_types"] = sorted(set(types))
    rec.update(dates)

    main, sel = main_content(soup)
    rec["main_selector"] = sel
    rec["headings"] = [[h.name, text_of(h), is_hidden(h)] for h in main.find_all(["h1", "h2", "h3", "h4"])]
    rec["h1_all"] = [text_of(h) for h in soup.find_all("h1")]
    rec["h1_visible"] = [text_of(h) for h in soup.find_all("h1") if not is_hidden(h)]
    hidden_blocks = [el for el in main.select(".elementor-hidden-desktop.elementor-hidden-tablet.elementor-hidden-mobile")]
    rec["hidden_text"] = [text_of(el) for el in hidden_blocks if not any(p in hidden_blocks for p in el.parents)]

    # message blocks (Elementor/Penci text widgets flagged with the "msgs" class)
    msgs = []
    for w in main.select(".msgs"):
        ed = w.select_one(".elementor-text-editor")
        heading = text_of(w.select_one("h1, h2, h3, h4"))
        t = text_of(ed)
        msgs.append({"heading": heading, "text": t, "hidden": is_hidden(w)})
    rec["message_blocks"] = msgs

    # FAQ accordions (Elementor nested accordion / accordion / toggle)
    faqs = []
    for item in main.select("details.e-n-accordion-item, .elementor-accordion-item, .elementor-toggle-item"):
        q = item.select_one(".e-n-accordion-item-title-text, .elementor-tab-title, summary")
        a = item.select_one("[role=region], .elementor-tab-content, .e-con")
        faqs.append({"q": text_of(q), "a": text_of(a)})
    rec["faqs"] = faqs

    # Plain body text of the main area, minus the side navigation list
    clone = BeautifulSoup(str(main), "lxml")
    for junk in clone.select(".sideCatMenu, .penci-sub-menu, script, style, .post-related, .penci-post-box-meta, .comments-area, #respond, .post-tags"):
        junk.decompose()
    body_text = text_of(clone)
    rec["main_text"] = body_text
    rec["word_count"] = len(body_text.split())
    paras = [text_of(p) for p in main.find_all(["p", "li"]) if text_of(p)]
    rec["paragraphs"] = paras

    # side nav items on message pages
    rec["side_nav"] = [
        {"text": text_of(a), "href": a.get("href"), "hidden": is_hidden(a)}
        for a in main.select(".sideCatMenu a")
    ]

    imgs = []
    for im in soup.find_all("img"):
        src = im.get("src") or im.get("data-src") or im.get("data-lazy-src") or ""
        if src.startswith("data:"):
            src = im.get("data-src") or im.get("data-lazy-src") or src
        imgs.append({
            "src": urljoin(url, src) if src and not src.startswith("data:") else src,
            "alt": im.get("alt"),
            "in_main": main in im.parents,
            "width": im.get("width"),
            "height": im.get("height"),
        })
    # background images set via data-bgset / style used by the theme
    for el in soup.select("[data-bgset], [data-bg]"):
        src = el.get("data-bgset") or el.get("data-bg")
        if src:
            imgs.append({"src": urljoin(url, src.split()[0]), "alt": "(background)", "in_main": main in el.parents, "width": None, "height": None})
    rec["images"] = imgs

    links = []
    for a in soup.find_all("a"):
        href = (a.get("href") or "").strip()
        links.append({
            "href": href,
            "abs": urljoin(url, href) if href and not href.startswith(("#", "javascript:", "mailto:", "tel:")) else None,
            "text": text_of(a)[:120],
            "rel": " ".join(a.get("rel") or []),
            "target": a.get("target"),
            "in_main": main in a.parents,
        })
    rec["links"] = links

    rec["iframes"] = [f.get("src") for f in soup.find_all("iframe")]
    rec["forms"] = [{"action": f.get("action"), "id": f.get("id"), "class": " ".join(f.get("class") or [])} for f in soup.find_all("form")]
    rec["mixed_content"] = sorted(set(re.findall(r'(?:src|href)=["\'](http://[^"\']+)', resp.text)))
    rec["ids_dup"] = [i for i, c in _count([t.get("id") for t in soup.find_all(id=True)]).items() if c > 1][:20]
    return rec


def _count(items):
    d = defaultdict(int)
    for i in items:
        d[i] += 1
    return d


def crawlable(u):
    p = urlparse(u)
    return p.scheme in ("http", "https") and p.netloc == HOST and not p.query and not SKIP_PATH.search(p.path)


def crawl():
    sm = sitemap_urls()
    print(f"sitemap urls: {len(sm)}", flush=True)
    seen = set()
    queue = list(sm)
    pages = {}
    inlinks = defaultdict(set)
    with ThreadPoolExecutor(WORKERS) as ex:
        while queue and len(seen) < MAX_PAGES:
            batch = [u for u in dict.fromkeys(queue) if u not in seen][: MAX_PAGES - len(seen)]
            queue = []
            seen.update(batch)
            futs = {ex.submit(fetch_page, u): u for u in batch}
            for f in as_completed(futs):
                u = futs[f]
                rec = f.result()
                rec["sitemap"] = sm.get(u, {}).get("sitemap")
                rec["lastmod"] = sm.get(u, {}).get("lastmod")
                pages[u] = rec
                for l in rec.get("links", []):
                    if l["abs"]:
                        t = norm(l["abs"])
                        if crawlable(t):
                            inlinks[t].add(u)
                            if t not in seen:
                                queue.append(t)
            print(f"crawled {len(pages)} pages, queue {len(set(queue) - seen)}", flush=True)
    for u, rec in pages.items():
        rec["inlinks"] = sorted(inlinks.get(u, ()))
    return pages


def fetch_page(u):
    try:
        r = get(u)
    except Exception as e:
        return {"url": u, "status": None, "error": str(e)}
    ctype = r.headers.get("content-type", "")
    if "html" not in ctype:
        return {"url": u, "status": r.status_code, "content_type": ctype, "final_url": r.url}
    try:
        rec = parse(u, r)
    except Exception as e:
        rec = {"url": u, "status": r.status_code, "parse_error": repr(e)}
    rec["x_cache"] = r.headers.get("x-ac") or r.headers.get("x-cache")
    return rec


def check_target(u):
    p = urlparse(u)
    if p.scheme not in ("http", "https"):
        return u, {"status": None, "error": "non-http"}
    try:
        r = session().head(u, timeout=20, allow_redirects=True)
        if r.status_code in (403, 405, 400, 404, 429, 500, 501, 503) or r.status_code >= 400:
            r = session().get(u, timeout=25, allow_redirects=True, stream=True)
            r.close()
        return u, {
            "status": r.status_code,
            "final_url": r.url,
            "redirects": len(r.history),
            "content_type": r.headers.get("content-type"),
            "bytes": int(r.headers.get("content-length") or 0),
        }
    except Exception as e:
        return u, {"status": None, "error": type(e).__name__ + ": " + str(e)[:200]}


def check_links(pages):
    targets = defaultdict(list)
    for u, rec in pages.items():
        for l in rec.get("links", []):
            if l["abs"]:
                t = urldefrag(l["abs"])[0]
                targets[t].append({"page": u, "text": l["text"], "in_main": l["in_main"], "kind": "a"})
        for im in rec.get("images", []):
            if im["src"] and not im["src"].startswith("data:"):
                targets[im["src"]].append({"page": u, "text": im.get("alt"), "in_main": im["in_main"], "kind": "img"})
    # pages already fetched don't need a second request
    results = {}
    todo = []
    for t in targets:
        if t in pages and pages[t].get("status"):
            results[t] = {"status": pages[t]["status"], "final_url": pages[t].get("final_url"), "redirects": len(pages[t].get("redirects", []))}
        else:
            todo.append(t)
    print(f"checking {len(todo)} link targets", flush=True)
    with ThreadPoolExecutor(WORKERS * 2) as ex:
        for i, (t, res) in enumerate(ex.map(check_target, todo)):
            results[t] = res
            if i % 200 == 0:
                print(f"  {i}/{len(todo)}", flush=True)
    out = []
    for t, refs in targets.items():
        out.append({"url": t, **results.get(t, {}), "refs": refs, "ref_count": len(refs)})
    return out


if __name__ == "__main__":
    import os
    os.makedirs(OUT, exist_ok=True)
    pages = crawl()
    with open(f"{OUT}/pages.json", "w") as f:
        json.dump(pages, f)
    links = check_links(pages)
    with open(f"{OUT}/links.json", "w") as f:
        json.dump(links, f)
    print("done", len(pages), "pages;", len(links), "link targets")
