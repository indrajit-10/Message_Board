#!/usr/bin/env python3
"""Collect the review/audit agents' structured results from the workflow
journals and merge them into:
  data/page_review.json   - per URL: verified issues, rejected count, content assessment
  data/site_audit.json    - per area: findings joined with verifier verdicts, plus critic findings
Usage: python3 collect_agent_results.py <page-review journal.jsonl> <site-audit journal.jsonl>
"""
import json
import sys
from collections import defaultdict


def read_journal(path):
    labels, out = {}, {}
    for line in open(path):
        e = json.loads(line)
        if e["type"] == "started":
            labels[e["agentId"]] = e["label"]
        elif e["type"] == "result" and e.get("result") is not None:
            out[labels.get(e["agentId"], e["agentId"])] = e["result"]
    return out


def norm(s):
    return " ".join((s or "").split()).strip("“”\"' ").lower()


def pages(journal):
    res = read_journal(journal)
    merged = {}
    for label, r in res.items():
        if not label.startswith("review:"):
            continue
        chunk = label.split(":", 1)[1]
        ver = res.get(f"verify:{chunk}")
        ver_by_url = {p["url"]: p for p in ver["pages"]} if ver else {}
        for p in r["pages"]:
            url = p["url"]
            v = ver_by_url.get(url)
            if v is not None:
                issues = [dict(i, verified=True) for i in v["confirmed"]]
                rejected = v["rejected"]
            else:
                issues = [dict(i, source="reviewer", verified=False) for i in p["issues"]]
                rejected = []
            seen, uniq = set(), []
            for i in issues:
                k = (i["type"], norm(i["quote"]))
                if k in seen:
                    continue
                seen.add(k)
                uniq.append(i)
            merged[url] = {
                "url": url,
                "chunk": chunk,
                "verified": v is not None,
                "issues": uniq,
                "reviewer_issue_count": len(p["issues"]),
                "rejected": rejected,
                "content": p["content"],
            }
        # verifier may list URLs the reviewer skipped
        for url, v in ver_by_url.items():
            if url not in merged:
                merged[url] = {"url": url, "chunk": chunk, "verified": True, "issues": [dict(i, verified=True) for i in v["confirmed"]], "reviewer_issue_count": 0, "rejected": v["rejected"], "content": None}
    return merged


def site(journal):
    res = read_journal(journal)
    areas = {}
    for label, r in res.items():
        if not label.startswith("audit:"):
            continue
        key = label.split(":", 1)[1]
        ver = res.get(f"verify:{key}")
        verdicts = {v["title"]: v for v in ver["verdicts"]} if ver else {}
        out = []
        for f in r["findings"]:
            v = verdicts.get(f["title"])
            f = dict(f)
            if v:
                f["verdict"] = v["verdict"]
                f["verify_reason"] = v.get("reason")
                f["severity"] = v.get("severity") or f["severity"]
                if v.get("corrected_evidence"):
                    f["evidence"] = f["evidence"] + "\n[Verifier] " + v["corrected_evidence"]
                if v.get("corrected_fix"):
                    f["fix"] = v["corrected_fix"]
            else:
                f["verdict"] = "unverified" if not ver else "not-assessed"
            f["source"] = "auditor"
            out.append(f)
        for m in (ver or {}).get("missed", []):
            out.append(dict(m, verdict="verifier-found", source="verifier"))
        areas[key] = {"findings": out, "tables": r.get("tables", []), "notes": r.get("notes")}
    critic = res.get("completeness-critic")
    if critic:
        areas["completeness"] = {"findings": [dict(f, verdict="critic-verified", source="critic") for f in critic["findings"]], "tables": critic.get("tables", []), "notes": critic.get("notes")}
    return areas


if __name__ == "__main__":
    pr = pages(sys.argv[1])
    json.dump(pr, open("data/page_review.json", "w"), indent=1)
    n = sum(len(p["issues"]) for p in pr.values())
    print(f"page review: {len(pr)} pages, {n} issues, verified pages {sum(p['verified'] for p in pr.values())}")
    if len(sys.argv) > 2:
        sa = site(sys.argv[2])
        json.dump(sa, open("data/site_audit.json", "w"), indent=1)
        for k, a in sa.items():
            c = defaultdict(int)
            for f in a["findings"]:
                c[f["verdict"]] += 1
            print(k, len(a["findings"]), dict(c))
