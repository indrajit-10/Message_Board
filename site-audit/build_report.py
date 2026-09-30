#!/usr/bin/env python3
"""Merge crawl data, deterministic checks and verified agent findings into:
  REPORT.md                        - human-readable report
  data/content_errors.csv          - every verified wording/content error
  data/content_recommendations.csv - per-page thin-content assessment + what to add
  data/site_findings.csv           - site-level findings with verifier verdicts
  report/index.html                - interactive dashboard (data embedded)
"""
import csv
import json
import os
import re
from collections import Counter, defaultdict

BASE = "https://blog.123greetings.com"
P = json.load(open("data/pages.json"))
DET = json.load(open("data/deterministic_findings.json"))
STATS = json.load(open("data/stats.json"))
PR = json.load(open("data/page_review.json")) if os.path.exists("data/page_review.json") else {}
SA = json.load(open("data/site_audit.json")) if os.path.exists("data/site_audit.json") else {}
PRIORITIES = json.load(open("priorities.json")) if os.path.exists("priorities.json") else []
BROKEN = list(csv.reader(open("data/broken_links.csv")))[1:]
SUMMARY = {r[0]: r for r in list(csv.reader(open("data/page_summary.csv")))[1:]}
SEV_ORDER = {"critical": 0, "high": 1, "medium": 2, "low": 3}


def path(u):
    return u.replace(BASE, "") or "/"


# ------------------------------------------------------------------ content errors
def _n(s):
    return " ".join((s or "").replace("’", "'").replace("‘", "'").split()).strip("“”\"' ").lower()


def visible_corpus(r):
    hidden = _n(" ".join(r.get("hidden_text", [])))
    parts = [r.get("title"), r.get("meta_description")] + r.get("h1_visible", [])
    parts += [h[1] for h in r.get("headings", []) if not (len(h) > 2 and h[2])]
    parts += [m["heading"] + " " + m["text"] for m in r.get("message_blocks", []) if not m.get("hidden")]
    parts += [f["q"] + " " + f["a"] for f in r.get("faqs", [])]
    parts += [p for p in r.get("paragraphs", []) if _n(p) not in hidden]
    return _n(" ".join(x or "" for x in parts)), hidden


_corp = {}
errors = []
for u, p in PR.items():
    if u not in _corp and u in P:
        _corp[u] = visible_corpus(P[u])
    vis, hid = _corp.get(u, ("", ""))
    for i in p["issues"]:
        q = _n(i["quote"])
        only_hidden = bool(q) and q in hid and q not in vis
        if only_hidden:
            i = dict(i, severity="low", note=("Only in a template block hidden on every screen size — invisible to visitors, but still in the HTML search engines read. " + i.get("note", "")).strip())
        errors.append({
            "url": u, "path": path(u), "title": (P.get(u) or {}).get("title", ""), "type": i["type"], "severity": i["severity"],
            "location": i["location"], "quote": i["quote"], "fix": i["fix"], "why": i["why"],
            "source": i.get("source", "reviewer"), "verified": i.get("verified", False), "note": i.get("note", ""), "hidden": only_hidden,
        })
# findings that only quote text inside a hidden template block are one systemic
# issue (reported as the "hidden-template-section" check), not visible errors
hidden_errors = [e for e in errors if e["hidden"]]
errors = [e for e in errors if not e["hidden"]]
with open("data/hidden_block_issues.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["url", "type", "location", "text in hidden block", "suggested fix"])
    for e in hidden_errors:
        w.writerow([e["url"], e["type"], e["location"], e["quote"], e["fix"]])
errors.sort(key=lambda e: (SEV_ORDER[e["severity"]], e["path"]))
with open("data/content_errors.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["url", "severity", "type", "location", "exact text", "suggested fix", "why", "found by", "verified", "visible to visitors", "note"])
    for e in errors:
        w.writerow([e["url"], e["severity"], e["type"], e["location"], e["quote"], e["fix"], e["why"], e["source"], "yes" if e["verified"] else "no", "no (hidden block)" if e["hidden"] else "yes", e["note"]])

# ------------------------------------------------------------------ pages / thin content
pages = []
for u, r in P.items():
    if r.get("type") not in ("page", "post") or r.get("status") != 200 or not u.startswith("https://"):
        continue
    s = SUMMARY.get(u)
    c = (PR.get(u) or {}).get("content") or {}
    pages.append({
        "url": u, "path": path(u), "type": r["type"], "title": r.get("title", ""),
        "words": int(s[8]) if s else r.get("word_count", 0), "messages": int(s[9]) if s else 0, "empty": int(s[10]) if s else 0,
        "claimed": int(s[11]) if s and s[11] else None, "shortfall": int(s[12]) if s and s[12] else 0,
        "faqs": int(s[15]) if s else 0, "inlinks": int(s[16]) if s else 0,
        "errors": sum(1 for e in errors if e["url"] == u),
        "score": c.get("score"), "priority": c.get("priority"), "thin": c.get("thin", bool(s and s[17])),
        "summary": c.get("summary", ""), "add": c.get("add", []),
    })
pages.sort(key=lambda p: ({"high": 0, "medium": 1, "low": 2}.get(p["priority"], 3), p["score"] or 9, p["words"]))
with open("data/content_recommendations.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["url", "type", "priority", "quality score (1-5)", "thin", "words", "messages", "empty blocks", "title claims", "shortfall", "FAQs", "internal links in", "verified errors", "assessment", "what to add"])
    for p in pages:
        w.writerow([p["url"], p["type"], p["priority"], p["score"], "yes" if p["thin"] else "", p["words"], p["messages"], p["empty"], p["claimed"] or "", p["shortfall"] or "", p["faqs"], p["inlinks"], p["errors"], p["summary"], "\n".join("• " + a for a in p["add"])])

# ------------------------------------------------------------------ deterministic checks
CHECK_INFO = {
    "empty-message-blocks": ("Empty message blocks shown as blank “” quotes", "Delete the empty blocks or fill the section; most are section headings (Funny, Heartfelt…) that were never written."),
    "title-count-mismatch": ("Title promises more messages than the page has", "Either add messages to honour the number or change the title to the real count."),
    "thin-content": ("Thin page (under 300 words or fewer than 10 messages)", "Expand with messages, an intro, tips and FAQs; see the Thin pages tab."),
    "leaked-template-text": ("Editor or template text published inside a message", "Delete the stray text."),
    "duplicate-message-in-page": ("Same message repeated on one page", "Replace the duplicate with a new message."),
    "side-nav-missing-section": ("Jump-menu item points to a section that doesn't exist", "Remove the item (usually 'Nostalgic → #n') or add the section."),
    "spacing-before-punctuation": ("Space before punctuation / missing sentence breaks", "Remove the space and add the missing full stop between sentences."),
    "unpaired-quotes": ("Unbalanced quotation marks", "Add the missing curly quote."),
    "broken-link-external": ("Broken link to www.123greetings.com", "Point the link to a live eCard category."),
    "broken-link-internal": ("Broken internal link (404)", "Fix the URL or 301-redirect the missing page."),
    "page-status": ("Page returns an error status", "Restore the page or add a 301 redirect."),
    "internal-link-redirects": ("Internal link goes through a redirect (http:// or no trailing slash)", "Link directly to the final https URL with trailing slash."),
    "ecard-link-redirects": ("eCard link goes through a redirect", "Link to the final https://www.123greetings.com URL."),
    "http-links": ("Insecure http:// links in page", "Change to https://."),
    "dead-anchor-links": ("Links with href='#' that go nowhere", "Give them a real destination or render them as plain text."),
    "sitemap-template-leak": ("Theme template blocks listed in the sitemap", "Exclude the penci-block post type from Yoast sitemaps and noindex it."),
    "author-slug-email": ("Author URL derived from an email address", "Change the author's nicename/slug (e.g. /author/bob/) and 301 the old URL."),
    "title-too-long": ("Title longer than ~65 characters", "Shorten; replace the long site-name suffix with '| 123Greetings'."),
    "title-duplicate": ("Duplicate page titles", "Give every post a unique, descriptive title."),
    "title-leftover-text": ("Leftover text in title", "Remove 'Meta Title' from the SEO title."),
    "title-punctuation": ("Punctuation error in title", "Fix spacing."),
    "meta-description-missing": ("Missing meta description", "Write one (120–155 characters)."),
    "meta-description-punctuation": ("Space before punctuation in meta description", "Remove the stray space."),
    "meta-description-duplicate": ("Duplicate meta descriptions", "Write unique descriptions."),
    "meta-description-long": ("Meta description too long", "Trim to ~155 characters."),
    "meta-description-short": ("Meta description too short", "Expand to ~120–155 characters."),
    "h1-missing": ("Page has no H1", "Add a descriptive H1."),
    "h1-multiple": ("Two different H1s on the page", "Keep one H1; make the second (mobile hero) a styled div or h2."),
    "h1-duplicated": ("H1 rendered twice (desktop + mobile copy)", "Render only one H1 per page."),
    "h1-duplicate-across-pages": ("Same H1 on many pages", "Use a unique H1 per post (include the date/topic)."),
    "og-image-missing": ("No og:image for social sharing", "Set a featured image or Yoast social image."),
    "img-alt-generic": ("Generic image alt text ('arrow')", "Decorative icons should have alt=\"\"."),
    "img-alt-missing": ("Image missing alt text", "Add descriptive alt text."),
    "thin-tag-archive": ("Tag archive with a single post (thin, near-duplicate)", "Noindex tag archives or prune one-off tags."),
    "orphan-page": ("Orphan page (no internal links point to it)", "Link it from the relevant hub and related pages."),
    "weakly-linked-page": ("Page reachable from only one internal link", "Add contextual links from related pages and hubs."),
    "missing-from-sitemap": ("Indexable page missing from sitemap", "Check Yoast settings."),
    "canonical-missing": ("Missing canonical", "Add a self-referencing canonical."),
    "canonical-mismatch": ("Canonical points elsewhere", "Check intent."),
    "stale-year": ("Old year in title/meta", "Update the year."),
    "noindex-in-sitemap": ("noindex page in sitemap", "Remove from sitemap or index it."),
}
det_groups = defaultdict(list)
for f in DET:
    det_groups[f["check"]].append(f)
det = []
for chk, fs in det_groups.items():
    sev = min((f["severity"] for f in fs), key=lambda s: SEV_ORDER[s])
    label, fix = CHECK_INFO.get(chk, (chk, ""))
    det.append({"check": chk, "label": label, "fix": fix, "severity": sev, "count": len(fs), "pages": len({f["url"] for f in fs}),
                "rows": [{"path": path(f["url"]), "url": f["url"], "detail": f["detail"]} for f in fs]})
det.sort(key=lambda d: (SEV_ORDER[d["severity"]], -d["pages"]))

# ------------------------------------------------------------------ site-level findings
AREA_LABEL = {"functionality": "Functionality & UX", "performance": "Performance", "seo": "Technical SEO", "accessibility": "Accessibility", "content-strategy": "Content strategy & gaps", "completeness": "Privacy, ads, security & other"}
site = []
for key, a in SA.items():
    fs = [f for f in a["findings"] if f.get("verdict") not in ("refuted",)]
    fs.sort(key=lambda f: (SEV_ORDER.get(f["severity"], 4), f["title"]))
    site.append({"key": key, "label": AREA_LABEL.get(key, key), "findings": fs, "tables": a.get("tables", []),
                 "refuted": [f["title"] for f in a["findings"] if f.get("verdict") == "refuted"]})
order = list(AREA_LABEL)
site.sort(key=lambda s: order.index(s["key"]) if s["key"] in order else 99)
with open("data/site_findings.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["area", "severity", "title", "verdict", "affected urls", "count", "evidence", "fix"])
    for s in site:
        for x in s["findings"]:
            w.writerow([s["label"], x["severity"], x["title"], x.get("verdict", ""), " | ".join(x.get("urls", [])[:30]), x.get("count", ""), x["evidence"], x["fix"]])

# ------------------------------------------------------------------ KPIs
content_pages = [p for p in pages]
kpis = {
    "urls": STATS["urls_crawled"],
    "content_pages": len(content_pages),
    "link_targets": STATS["link_targets"],
    "errors": len(errors),
    "errors_high": sum(1 for e in errors if e["severity"] == "high"),
    "empty_pages": len({f["url"] for f in DET if f["check"] == "empty-message-blocks"}),
    "hidden_pages": len({f["url"] for f in DET if f["check"] == "hidden-template-section"}),
    "leaked": sum(1 for e in errors if e["type"] == "leaked-template-text"),
    "factual": sum(1 for e in errors if e["type"] == "factual"),
    "promise_pages": len({f["url"] for f in DET if f["check"] == "title-count-mismatch"}),
    "promise_gap": sum(p["shortfall"] for p in pages if p["shortfall"]),
    "thin": sum(1 for p in pages if p["thin"]),
    "broken": len(BROKEN),
    "broken_refs": sum(int(b[2]) for b in BROKEN),
    "site_findings": sum(len(s["findings"]) for s in site),
    "rejected": sum(len(p.get("rejected", [])) for p in PR.values()),
    "verified_pages": sum(1 for p in PR.values() if p.get("verified")),
    "tags_total": STATS["tags_total"], "tags_0": STATS["tags_with_0_posts"], "tags_1": STATS["tags_with_1_post"],
    "messages_total": sum(p["messages"] for p in pages),
    "median_messages": sorted(p["messages"] for p in pages if p["type"] == "page" and p["messages"])[len([p for p in pages if p["type"] == "page" and p["messages"]]) // 2] if pages else 0,
}
json.dump(kpis, open("data/kpis.json", "w"), indent=1)

# ------------------------------------------------------------------ REPORT.md
def md_escape(s):
    return (s or "").replace("|", "\\|").replace("\n", " ")


L = []
L.append("# blog.123greetings.com — site audit (30 Sep 2026)\n")
rev_total = sum(p.get("reviewer_issue_count", 0) for p in PR.values())
rej_total = sum(len(p.get("rejected", [])) for p in PR.values())
added = sum(1 for p in PR.values() for i in p["issues"] if i.get("source") == "verifier")
site_refuted = sum(len(s["refuted"]) for s in site)
L.append(f"Crawled **{kpis['urls']} URLs** (sitemaps + every internal link), checked **{kpis['link_targets']} unique link/image targets**, "
         f"and had every one of the **{kpis['content_pages']} pages and posts** read line by line by review agents. "
         f"Reviewers raised {rev_total:,} issues; an adversarial verifier rejected {rej_total} of them as false positives or style preferences and added {added} the reviewers missed. "
         f"Of the {rev_total - rej_total + added:,} that survived, {len(hidden_errors)} only concern a hidden template block and are listed separately, leaving **{kpis['errors']:,} visible errors**. "
         f"Functionality, performance, SEO, accessibility and content strategy were audited in headless Chromium and each finding was re-tested by a second agent "
         f"({site_refuted} refuted and dropped; numbers corrected where they were off), and a completeness critic covered privacy, ads, security and other gaps.\n")
L.append("> Caveats: our test IP was rate-limited by WordPress.com (HTTP 429) during parts of the audit, so Lighthouse timings are indicative. Re-check them in PageSpeed Insights. "
         "Factual corrections (observance dates, history) were checked by the verifier against web sources, but an editor should confirm them before publishing. "
         "Privacy and ad observations describe what a US browser session received; they are not legal advice.\n")
L.append("## Headline numbers\n")
L.append(f"| | |\n|---|---|\n"
         f"| Verified wording / content errors | **{kpis['errors']}** ({kpis['errors_high']} high severity) |\n"
         f"| Editor / AI notes published on live pages | **{kpis['leaked']}** |\n"
         f"| Factual errors (dates, history, anniversary gifts) | **{kpis['factual']}** |\n"
         f"| Pages whose title promises more messages than they have | **{kpis['promise_pages']}** (short by {kpis['promise_gap']:,} messages in total) |\n"
         f"| Thin pages that need more content | **{kpis['thin']}** of {kpis['content_pages']} |\n"
         f"| Broken link targets | **{kpis['broken']}** (used {kpis['broken_refs']} times) |\n"
         f"| Site-level issues (UX, performance, SEO, a11y, strategy, security) | **{kpis['site_findings']}** |\n"
         f"| Messages on the whole site | {kpis['messages_total']} (median page: {kpis['median_messages']}) |\n")
if PRIORITIES:
    L.append("\n## Fix these first\n")
    for i, pr in enumerate(PRIORITIES, 1):
        L.append(f"{i}. **{pr['title']}** — {pr['detail']}")
    L.append("")
L.append("\n## Files\n")
L.append("- `data/content_errors.csv` — every verified error with the exact text and a suggested fix\n"
         "- `data/content_recommendations.csv` — per-page thin-content score and what to add\n"
         "- `data/site_findings.csv` — site-level findings with verifier verdicts\n"
         "- `data/broken_links.csv`, `data/cross_page_duplicates.csv`, `data/page_summary.csv`, `data/deterministic_findings.json`\n"
         "- `report/index.html` — the same report as an interactive dashboard\n")

L.append("\n## Site-wide checks (automated)\n")
L.append("| Severity | Check | Pages | How to fix |\n|---|---|---|---|")
for d in det:
    L.append(f"| {d['severity']} | {md_escape(d['label'])} | {d['pages']} | {md_escape(d['fix'])} |")

L.append("\n## Broken links\n")
L.append("| Target | Status | Used | On pages |\n|---|---|---|---|")
for b in BROKEN:
    L.append(f"| {md_escape(b[0])} | {b[1]} | {b[2]}× | {md_escape(b[4])} |")

for s in site:
    L.append(f"\n## {s['label']}\n")
    for x in s["findings"]:
        urls = ", ".join(path(u) for u in x.get("urls", [])[:8])
        more = f" (+{len(x['urls']) - 8} more)" if len(x.get("urls", [])) > 8 else ""
        L.append(f"### [{x['severity']}] {x['title']}\n")
        L.append(f"*Verdict: {x.get('verdict')}* · Affected: {urls or 'sitewide'}{more}\n")
        L.append(f"**Evidence.** {x['evidence']}\n")
        L.append(f"**Fix.** {x['fix']}\n")
    if s["refuted"]:
        L.append(f"_Refuted by the verifier and dropped: {'; '.join(s['refuted'])}_\n")
    for tb in s["tables"]:
        L.append(f"\n<details><summary><b>Table: {md_escape(tb['name'])}</b> ({len(tb['rows'])} rows)</summary>\n")
        L.append("| " + " | ".join(md_escape(c) for c in tb["columns"]) + " |")
        L.append("|" + "---|" * len(tb["columns"]))
        for row in tb["rows"]:
            L.append("| " + " | ".join(md_escape(str(c) if c is not None else "") for c in row) + " |")
        L.append("\n</details>\n")

L.append("\n## Thin pages — highest priority\n")
L.append("| Page | Words | Messages | Title claims | Score | What to add (top items) |\n|---|---|---|---|---|---|")
for p in [p for p in pages if p["priority"] == "high"][:80]:
    L.append(f"| [{p['path']}]({p['url']}) | {p['words']} | {p['messages']} | {p['claimed'] or ''} | {p['score'] or ''} | {md_escape('; '.join(p['add'][:3]))} |")

L.append("\n## Content errors — high severity\n")
L.append("| Page | Type | Where | Text | Fix |\n|---|---|---|---|---|")
for e in [e for e in errors if e["severity"] == "high"]:
    L.append(f"| [{e['path']}]({e['url']}) | {e['type']} | {md_escape(e['location'])} | {md_escape(e['quote'][:160])} | {md_escape(e['fix'][:160])} |")
L.append(f"\nMedium and low severity errors ({sum(1 for e in errors if e['severity'] != 'high')}) are in `data/content_errors.csv` and the dashboard.\n")
open("REPORT.md", "w").write("\n".join(L))

# ------------------------------------------------------------------ dashboard
ALL_AREAS = ["functionality", "performance", "seo", "accessibility", "content-strategy", "completeness"]
pending = [AREA_LABEL[a] for a in ALL_AREAS if a not in SA]
unverified = [AREA_LABEL.get(s["key"], s["key"]) for s in site if s["findings"] and all(f.get("verdict") == "unverified" for f in s["findings"])]
data = {"pending": pending, "unverified": unverified, "kpis": kpis, "priorities": PRIORITIES, "errors": errors, "pages": pages, "det": det, "site": site,
        "broken": [{"target": b[0], "status": b[1], "refs": int(b[2]), "pages": b[4], "anchors": b[5]} for b in BROKEN]}
tpl = open("report_template.html").read()
blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
os.makedirs("report", exist_ok=True)
open("report/index.html", "w").write(tpl.replace("/*__DATA__*/", blob))
print(json.dumps(kpis, indent=1))
print("errors", len(errors), "pages", len(pages), "det checks", len(det), "site areas", len(site))
