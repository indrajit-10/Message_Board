#!/usr/bin/env python3
"""Run LanguageTool over every content page and write per-chunk review bundles
(data/bundles/chunk_NN.md) that the review agents read."""
import json
import os
import re
from collections import defaultdict

import language_tool_python

P = json.load(open("data/pages.json"))
BASE = "https://blog.123greetings.com"
CHUNK = 30

# Words LanguageTool flags that are correct in this context.
ALLOW = {
    "123greetings", "ecard", "ecards", "e-card", "e-cards", "bobcast", "rakhi", "raksha", "bandhan",
    "samhain", "sukkot", "rosh", "hashanah", "shana", "tova", "tovah", "pumpkinfest", "whatsapp",
    "bff", "bffs", "fiance", "fiancee", "stepmom", "stepdad", "grandpa", "grandma", "sis", "bro",
    "hbd", "lol", "xoxo", "instagram", "selfie", "selfies", "besties", "bestie", "yay", "hehe",
}


def is_content(r):
    return r.get("status") == 200 and r.get("type") in ("page", "post") and r["url"].startswith("https://")


pages = sorted([r for r in P.values() if is_content(r)], key=lambda r: r["url"])
print(len(pages), "content pages")

tool = language_tool_python.LanguageTool("en-US")
lt = {}
for i, r in enumerate(pages):
    msgs = [m["text"] for m in r["message_blocks"] if m["text"].strip("“”\"' ")]
    texts = [r["title"] or "", r.get("meta_description") or ""] + [h[1] for h in r["headings"]]
    texts += [f["q"] for f in r.get("faqs", [])]
    # messages plus any other body paragraphs (intros, FAQ answers, post text)
    texts += msgs + [p for p in r["paragraphs"] if p not in msgs]
    found = []
    for t in dict.fromkeys(t for t in texts if t):
        for m in tool.check(t):
            bad = t[m.offset:m.offset + m.error_length]
            if m.rule_id in ("WHITESPACE_RULE", "EN_QUOTES", "DASH_RULE", "PUNCTUATION_PARAGRAPH_END", "UPPERCASE_SENTENCE_START", "ELLIPSIS"):
                continue
            if bad.lower().strip("’'") in ALLOW:
                continue
            found.append({
                "rule": m.rule_id,
                "category": m.category,
                "message": m.message,
                "bad": bad,
                "suggest": m.replacements[:3],
                "context": t[max(0, m.offset - 60): m.offset + m.error_length + 60],
            })
    lt[r["url"]] = found
    if i % 25 == 0:
        print(i, r["url"], len(found), flush=True)
tool.close()
json.dump(lt, open("data/languagetool.json", "w"), indent=1)

# message text -> pages it appears on (cross-page duplication)
where = defaultdict(set)
for r in pages:
    for m in r["message_blocks"]:
        t = m["text"].strip()
        if len(t.strip("“”\"' ")) > 20:
            where[t].add(r["url"])

os.makedirs("data/bundles", exist_ok=True)
review_pages = [r for r in pages if r["url"] != BASE + "/penci-block/footer/"]
chunks = [review_pages[i:i + CHUNK] for i in range(0, len(review_pages), CHUNK)]
index = []
for ci, chunk in enumerate(chunks):
    out = []
    for r in chunk:
        path = r["url"].replace(BASE, "")
        msgs = r["message_blocks"]
        real = [m for m in msgs if m["text"].strip("“”\"' ")]
        claim = re.search(r"(\d+)\+", r["title"] or "")
        out.append(f"\n\n==================== PAGE: {r['url']}")
        out.append(f"type: {r['type']} | words in main content: {r['word_count']} | real messages: {len(real)} | empty message blocks: {len(msgs) - len(real)} | title claims: {claim.group(0) if claim else 'n/a'}")
        out.append(f"<title>: {r['title']}")
        out.append(f"meta description: {r.get('meta_description')}")
        out.append(f"H1s on page: {r['h1_all']}")
        out.append(f"published: {r.get('datePublished')} | modified: {r.get('dateModified')}")
        if r["side_nav"]:
            out.append("side nav items: " + " | ".join(f"{s['text']} -> {s['href']}" for s in r["side_nav"]))
        out.append("headings (main): " + " || ".join(f"{h[0]}:{h[1]}" for h in r["headings"][:40]))
        if msgs:
            out.append("MESSAGE BLOCKS (in page order; [section heading] shown when the block has one):")
            for i, m in enumerate(msgs, 1):
                dup = len(where.get(m["text"].strip(), ())) - 1
                tag = f" [ALSO ON {dup} OTHER PAGE(S)]" if dup > 0 else ""
                head = f"[{m['heading']}] " if m["heading"] else ""
                out.append(f"  {i}. {head}{m['text'] or '(EMPTY)'}{tag}")
            faq_a = {f["a"] for f in r.get("faqs", [])}
            others = [p for p in r["paragraphs"] if p not in {m['text'] for m in msgs} and p not in faq_a]
            if others:
                out.append("OTHER BODY TEXT:")
                out.extend("  " + p for p in others[:80])
        else:
            out.append("BODY TEXT (paragraphs/list items):")
            out.extend("  " + p for p in r["paragraphs"][:200])
        if r.get("faqs"):
            out.append("FAQ ACCORDION (question -> answer):")
            for f in r["faqs"]:
                out.append(f"  Q: {f['q']}\n     A: {f['a']}")
        if lt.get(r["url"]):
            out.append("LANGUAGETOOL CANDIDATES (automated, may be false positives):")
            for m in lt[r["url"]][:60]:
                out.append(f"  - [{m['rule']}] '{m['bad']}' -> {m['suggest']} :: {m['message']} :: …{m['context']}…")
    fn = f"data/bundles/chunk_{ci:02d}.md"
    open(fn, "w").write("\n".join(out))
    index.append({"file": fn, "urls": [r["url"] for r in chunk]})
json.dump(index, open("data/bundles/index.json", "w"), indent=1)
print(len(chunks), "chunks written")
