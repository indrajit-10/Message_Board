#!/usr/bin/env python3
"""Deterministic checks over the crawl data.

Reads data/pages.json, data/links.json, data/languagetool.json (+ fetches tag
post-counts from the WP REST API once, cached in data/tags.json) and writes:
  data/deterministic_findings.json  - list of {check, severity, url, detail}
  data/page_summary.csv             - one row per crawled URL
  data/cross_page_duplicates.csv    - messages that appear on 2+ pages
  data/broken_links.csv             - every 4xx/5xx/unreachable link target + where it is used
"""
import csv
import json
import os
import re
from collections import Counter, defaultdict

import requests

BASE = "https://blog.123greetings.com"
P = json.load(open("data/pages.json"))
L = json.load(open("data/links.json"))

findings = []

# link targets that are crawled pages take the page's final (re-fetched) status
for _l in L:
    _r = P.get(_l["url"])
    if _r and _r.get("status"):
        _l["status"] = _r["status"]

# recompute inlinks from the final page records (crawl-time inlinks miss links
# on pages that were re-fetched after rate limiting)
_in = defaultdict(set)
for _u, _r in P.items():
    for _l in _r.get("links", []):
        if _l.get("abs"):
            _t = _l["abs"].split("#")[0]
            if _t.startswith(BASE) and not _t.endswith("/") and "?" not in _t:
                _t += "/"
            if _t != _u:
                _in[_t].add(_u)
for _u, _r in P.items():
    _r["inlinks"] = sorted(_in.get(_u, ()))


def add(check, severity, url, detail):
    findings.append({"check": check, "severity": severity, "url": url, "detail": detail})


def short(u):
    return u.replace(BASE, "") or "/"


def real_msgs(r):
    """Non-empty messages a visitor can actually see."""
    return [m for m in r.get("message_blocks", []) if m["text"].strip("“”\"' ") and not m.get("hidden")]


ok = {u: r for u, r in P.items() if r.get("status") == 200 and u.startswith("https://")}
content = {u: r for u, r in ok.items() if r.get("type") in ("page", "post")}

# ---------------------------------------------------------------- HTTP / links
for u, r in P.items():
    if r.get("status") != 200 and r.get("type") != "404" or r.get("status") == 404:
        add("page-status", "high", u, f"HTTP {r.get('status')} — linked from {len(r.get('inlinks', []))} page(s): {', '.join(short(x) for x in r.get('inlinks', [])[:5])}")

broken_rows = []
for l in L:
    st = l.get("status")
    if st is None or st >= 400:
        pages = sorted({x["page"] for x in l["refs"]})
        texts = sorted({x["text"] or "" for x in l["refs"]})
        internal = l["url"].startswith(BASE)
        broken_rows.append([l["url"], st or l.get("error", "unreachable"), len(l["refs"]), len(pages), " | ".join(short(p) for p in pages), " | ".join(texts)])
        for p in pages:
            add("broken-link-internal" if internal else "broken-link-external", "high", p, f"links to {l['url']} (HTTP {st or l.get('error')}) — anchor: {', '.join(texts)[:120]}")
    elif l.get("redirects") and l["url"].startswith(("http://blog.123greetings.com", BASE)):
        for p in sorted({x["page"] for x in l["refs"]}):
            add("internal-link-redirects", "low", p, f"links to {l['url']} which redirects to {l.get('final_url')} (use the final https URL with trailing slash)")
    elif l.get("redirects") and "123greetings.com" in l["url"]:
        for p in sorted({x["page"] for x in l["refs"]}):
            add("ecard-link-redirects", "low", p, f"links to {l['url']} which redirects to {l.get('final_url')}")

for u, r in content.items():
    if r.get("mixed_content"):
        add("http-links", "low", u, f"{len(r['mixed_content'])} http:// URL(s) in page: {', '.join(r['mixed_content'][:4])}")
    hidden_nav = {x["text"] for x in r.get("side_nav", []) if x.get("hidden")}
    dead = [l for l in r.get("links", []) if l["in_main"] and (l["href"] in ("", "#")) and l["text"] and l["text"] not in ("Emotions", "Load More Posts") and l["text"] not in hidden_nav]
    if dead:
        add("dead-anchor-links", "medium", u, f"{len(dead)} link(s) in the content with href='#' or empty: {', '.join(d['text'][:30] for d in dead[:6])}")

# ---------------------------------------------------------------- sitemap / indexation
for u, r in ok.items():
    if r.get("sitemap") == "penci-block":
        add("sitemap-template-leak", "medium", u, "Theme template block (Penci mega-menu/footer) is listed in the sitemap and indexable")
    if r.get("type") == "author":
        slug = u.rstrip("/").split("/")[-1] if "/page/" not in u else u.split("/author/")[1].split("/")[0]
        if "gmail" in slug:
            add("author-slug-email", "medium", u, f"Author archive slug '{slug}' is derived from an email address")
    if r.get("robots") and "noindex" in r["robots"] and r.get("sitemap"):
        add("noindex-in-sitemap", "medium", u, f"robots={r['robots']} but listed in sitemap")
not_in_sitemap = [u for u, r in content.items() if not r.get("sitemap") and not u.startswith("http://")]
for u in not_in_sitemap:
    add("missing-from-sitemap", "low", u, "Indexable content page not listed in any sitemap")

# tag post counts (REST API)
if not os.path.exists("data/tags.json"):
    tags, page = [], 1
    while True:
        rr = requests.get(f"{BASE}/wp-json/wp/v2/tags", params={"per_page": 100, "page": page, "_fields": "id,name,slug,count"}, timeout=30)
        if rr.status_code != 200 or not rr.json():
            break
        tags += rr.json()
        page += 1
    json.dump(tags, open("data/tags.json", "w"))
tags = json.load(open("data/tags.json"))
tag_counts = Counter(t["count"] for t in tags)
tag_pages = [u for u, r in ok.items() if r.get("type") == "tag" and "/page/" not in u]
one_post_tags = [t for t in tags if t["count"] == 1]

# ---------------------------------------------------------------- titles / meta / headings
titles = defaultdict(list)
descs = defaultdict(list)
h1s = defaultdict(list)
LONG_SUFFIX = " - 123Greetings Blog - Free eCards, Card Message Ideas & What to Write in Any Greeting Card"
for u, r in ok.items():
    t = r.get("title") or ""
    titles[t].append(u)
    if not t:
        add("title-missing", "high", u, "No <title>")
    elif len(t) > 65:
        add("title-too-long", "low" if r.get("type") == "tag" else "medium", u, f"{len(t)} chars: {t}")
    if "meta title" in t.lower():
        add("title-leftover-text", "high", u, f"Title contains leftover label 'Meta Title': {t}")
    if re.search(r"\s[.,:!]\s|\s[.,]$", t):
        add("title-punctuation", "low", u, f"Space before punctuation / odd punctuation in title: {t}")
    d = r.get("meta_description")
    if r.get("type") in ("page", "post"):
        if not d:
            add("meta-description-missing", "medium", u, "No meta description")
        else:
            descs[d].append(u)
            if len(d) > 165:
                add("meta-description-long", "low", u, f"{len(d)} chars (truncated in SERPs): {d[:90]}…")
            if len(d) < 70:
                add("meta-description-short", "low", u, f"{len(d)} chars: {d}")
            sp = re.search(r".{0,40}\s[.,!?;:].{0,10}", d)
            if sp:
                add("meta-description-punctuation", "low", u, f"Space before punctuation: …{sp.group(0)}…")
    hs = [h for h in r.get("h1_visible", r.get("h1_all", [])) if h]
    if r.get("type") in ("page", "post"):
        if not hs:
            add("h1-missing", "medium", u, "No H1 on page")
        elif len(hs) > 1:
            if len(set(hs)) == 1:
                add("h1-duplicated", "low", u, f"Visible H1 rendered {len(hs)}× (same text '{hs[0]}')")
            else:
                add("h1-multiple", "medium", u, f"{len(hs)} different visible H1s: {hs[:4]}")
        if hs:
            h1s[hs[0]].append(u)
    if r.get("canonical") and r["canonical"] != u and r.get("type") in ("page", "post"):
        add("canonical-mismatch", "medium", u, f"canonical → {r['canonical']}")
    if r.get("type") in ("page", "post") and not r.get("canonical"):
        add("canonical-missing", "medium", u, "No canonical tag")
    if r.get("type") in ("page", "post") and not r.get("og", {}).get("og:image"):
        add("og-image-missing", "low", u, "No og:image (poor social sharing preview)")
for t, us in titles.items():
    if len(us) > 1 and t:
        for u in us:
            add("title-duplicate", "medium" if ok[u].get("type") in ("page", "post") else "low", u, f"Title shared by {len(us)} URLs: '{t[:80]}'")
for d, us in descs.items():
    if len(us) > 1:
        for u in us:
            add("meta-description-duplicate", "medium", u, f"Meta description shared by {len(us)} pages: '{d[:80]}'")
for h, us in h1s.items():
    if len(us) > 1:
        for u in us:
            add("h1-duplicate-across-pages", "medium", u, f"H1 '{h}' is used on {len(us)} pages")

# ---------------------------------------------------------------- images
for u, r in ok.items():
    imgs = [i for i in r.get("images", []) if i["in_main"]]
    noalt = [i for i in imgs if i["alt"] is None or not i["alt"].strip()]
    generic = [i for i in imgs if (i["alt"] or "").strip().lower() in ("arrow", "image", "img", "photo", "picture")]
    if noalt:
        add("img-alt-missing", "low", u, f"{len(noalt)} content image(s) without alt text")
    if generic and r.get("type") == "page":
        add("img-alt-generic", "low", u, f"{len(generic)} image(s) with generic alt ('{generic[0]['alt']}')")

# ---------------------------------------------------------------- message pages
where = defaultdict(set)
for u, r in content.items():
    for m in real_msgs(r):
        where[m["text"].strip()].add(u)

LEAK = re.compile(
    r"use (it )?as a card|as a caption|it travels well|meta title|meta description|\bhere are\b|as an ai|\bTODO\b|lorem ipsum|\[name\]|\[recipient|insert name|\{\{|}}|feel free to (use|copy)|copy and paste",
    re.I,
)
summary_rows = []
for u, r in sorted(ok.items()):
    msgs = r.get("message_blocks", [])
    real = real_msgs(r)
    empty = [m for m in msgs if not m["text"].strip("“”\"' ") and not m.get("hidden")]
    hidden_blocks = [m for m in msgs if m.get("hidden")]
    empty_sections = [m["heading"] for m in empty if m["heading"]]
    texts = [m["text"].strip() for m in real]
    within_dup = [t for t, c in Counter(texts).items() if c > 1]
    cross = [t for t in texts if len(where.get(t, ())) > 1]
    claim_m = re.search(r"(\d+)\+", r.get("title") or "")
    claim = int(claim_m.group(1)) if claim_m else None
    shortfall = claim - len(real) if claim else None
    if r.get("type") in ("page", "post"):
        if empty:
            add("empty-message-blocks", "high", u, f"{len(empty)} visible empty message block(s) render as blank “” quotes" + (f"; empty section(s): {', '.join(empty_sections)}" if empty_sections else ""))
        if r.get("hidden_text"):
            hidden_h1 = [h for h in r.get("h1_all", []) if h and h not in r.get("h1_visible", [])]
            add("hidden-template-section", "low", u,
                f"Leftover template section hidden on every breakpoint is still in the HTML: "
                + (f"extra H1 '{hidden_h1[0]}', " if hidden_h1 else "")
                + (f"{sum(1 for m in hidden_blocks if not m['text'].strip('“”') )} empty quote block(s), " if hidden_blocks else "")
                + ("'Emotions' jump menu (" + ", ".join(x["text"] for x in r.get("side_nav", []) if x.get("hidden") and x["text"] != "Emotions") + ")" if any(x.get("hidden") for x in r.get("side_nav", [])) else "").rstrip(", ").rstrip(":") + ("" if hidden_blocks or any(x.get("hidden") for x in r.get("side_nav", [])) else " (hidden: " + r["hidden_text"][0][:80] + ")"))
        if claim and shortfall and shortfall > 0:
            sev = "high" if len(real) < claim / 2 else "medium"
            add("title-count-mismatch", sev, u, f"Title promises {claim}+ messages but the page has {len(real)}")
        for t in within_dup:
            add("duplicate-message-in-page", "medium", u, f"Message appears {texts.count(t)}× on the page: {t[:100]}")
        for m in real:
            if LEAK.search(m["text"]):
                add("leaked-template-text", "high", u, f"Editor/template text inside a message: {m['text'][:160]}")
            t = m["text"].strip()
            if t.count("“") != t.count("”") or (t.startswith("“") != t.endswith("”")):
                add("unpaired-quotes", "low", u, f"Unbalanced curly quotes: {t[:100]}")
            if re.search(r"\s[,.!?;:](?!\.)", t) or re.search(r"\(\s", t) or re.search(r"\s\)", t):
                add("spacing-before-punctuation", "low", u, f"Space before punctuation/inside brackets: {t[:120]}")
        # side-nav items that name a section that isn't on the page
        heads = {h[1].strip().lower() for h in r.get("headings", [])} | {m["heading"].strip().lower() for m in msgs if m["heading"]}
        for s in r.get("side_nav", []):
            if not s.get("hidden") and s["text"] and s["text"] != "Emotions" and s["href"] and s["href"].startswith("#") and s["text"].strip().lower() not in heads and s["text"].strip().lower() not in (r.get("h1_all") or [""])[0].lower():
                add("side-nav-missing-section", "medium", u, f"Jump-menu item '{s['text']}' ({s['href']}) has no matching section on the page")
    words = r.get("word_count", 0)
    thin = r.get("type") in ("page", "post") and (words < 300 or (msgs and len(real) < 10))
    summary_rows.append([
        u, r.get("type"), r.get("status"), r.get("sitemap") or "", r.get("title"), len(r.get("title") or ""),
        len(r.get("meta_description") or ""), len(r.get("h1_all") or []), words, len(real), len(empty),
        claim or "", shortfall if shortfall and shortfall > 0 else "", len(within_dup), len(cross), len(r.get("faqs", [])),
        len(r.get("inlinks", [])), "yes" if thin else "", r.get("datePublished", ""), r.get("dateModified", ""),
    ])
    if thin and r.get("type") in ("page", "post") and u.startswith("https://") and u.rstrip("/") not in (BASE, BASE + "/contact-us", BASE + "/archive"):
        add("thin-content", "high" if words < 150 else "medium", u, f"{words} words, {len(real)} messages" + (f" (title promises {claim}+)" if claim else ""))

# low-value tag archives
for u in tag_pages:
    slug = u.rstrip("/").split("/")[-1]
    t = next((t for t in tags if t["slug"] == slug), None)
    if t and t["count"] <= 1:
        add("thin-tag-archive", "low", u, f"Tag '{t['name']}' has {t['count']} post — thin, near-duplicate archive page in the sitemap")

# orphans: content pages with no inlinks from any crawled page
for u, r in content.items():
    if u.startswith("https://") and not r.get("inlinks") and u != BASE + "/":
        add("orphan-page", "medium", u, "No internal links point to this page (only reachable via sitemap)")
    elif u.startswith("https://") and len(r.get("inlinks", [])) == 1 and r.get("type") == "page":
        add("weakly-linked-page", "low", u, f"Only one internal link points here (from {short(r['inlinks'][0])})")

# stale years
for u, r in content.items():
    for y in re.findall(r"\b(20(?:1\d|2[0-5]))\b", (r.get("title") or "") + " " + (r.get("meta_description") or "")):
        add("stale-year", "medium", u, f"Title/meta mentions {y}")

# slow uncached responses
slow = sorted(((r.get("elapsed_ms") or 0, u) for u, r in ok.items()), reverse=True)

# ---------------------------------------------------------------- write outputs
json.dump(findings, open("data/deterministic_findings.json", "w"), indent=1)
with open("data/page_summary.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["url", "type", "status", "sitemap", "title", "title_len", "meta_desc_len", "h1_count", "words", "messages", "empty_blocks", "title_claims", "shortfall", "dup_in_page", "msgs_also_on_other_pages", "faqs", "inlinks", "thin", "published", "modified"])
    w.writerows(summary_rows)
with open("data/cross_page_duplicates.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["pages", "message", "urls"])
    for t, us in sorted(where.items(), key=lambda x: -len(x[1])):
        if len(us) > 1:
            w.writerow([len(us), t, " | ".join(short(x) for x in sorted(us))])
with open("data/broken_links.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["target", "status", "references", "pages", "used_on", "anchor_texts"])
    w.writerows(broken_rows)

stats = {
    "urls_crawled": len(P),
    "by_type": Counter(r.get("type") for r in P.values()),
    "content_pages": len(content),
    "tags_total": len(tags),
    "tags_with_0_posts": tag_counts.get(0, 0),
    "tags_with_1_post": tag_counts.get(1, 0),
    "tag_archives_crawled": len(tag_pages),
    "link_targets": len(L),
    "broken_targets": len(broken_rows),
    "median_ms": sorted(r.get("elapsed_ms") or 0 for r in ok.values())[len(ok) // 2],
    "slowest": slow[:5],
    "title_suffix_pages": sum(1 for r in ok.values() if (r.get("title") or "").endswith(LONG_SUFFIX)),
    "cross_page_dup_messages": sum(1 for us in where.values() if len(us) > 1),
    "findings_by_check": Counter(f["check"] for f in findings),
}
json.dump(stats, open("data/stats.json", "w"), indent=1, default=list)
print(json.dumps(stats, indent=1, default=list))
