# blog.123greetings.com site audit

Crawler, checks and results for a full audit of https://blog.123greetings.com: errors and
mistakes, thin pages that need more content, and functionality/SEO/performance/accessibility
problems. The findings are in **[REPORT.md](REPORT.md)**; `report/index.html` is the same
report as a filterable dashboard.

## What's here

| Path | What it is |
|---|---|
| `REPORT.md` | The audit report |
| `data/content_errors.csv` | Every verified wording/content error: page, exact text, suggested fix |
| `data/content_recommendations.csv` | Per-page quality score, thin flag and what to add |
| `data/site_findings.csv` | Site-level findings (UX, performance, SEO, accessibility, strategy, security) with verifier verdicts |
| `data/deterministic_findings.json` | Output of the automated checks in `analyze.py` |
| `data/broken_links.csv` | Broken link targets and the pages that use them |
| `data/page_summary.csv` | One row per crawled URL (words, messages, title claim, FAQs, inlinks…) |
| `data/hidden_block_issues.csv` | Problems that sit only inside template blocks hidden on every screen size |
| `data/*.json.gz` | Raw crawl (`pages.json`, `links.json`) |
| `workflows/` | The multi-agent review workflows (page review, site audits) |

## How it was produced

1. `crawler.py` reads every sitemap, follows every internal link, parses each page
   (title, meta, headings, messages, FAQs, images, links, hidden template blocks) and requests
   every link/image target once.
2. `refetch_failed.py` re-fetches pages that hit WordPress.com rate limiting (429), slowly.
3. `prepare_review.py` runs LanguageTool over all page text and writes review bundles.
4. `analyze.py` runs the deterministic checks (broken links, title promises vs. message counts,
   duplicates, SEO tags, thin pages, orphan pages, tag archives…).
5. `workflows/page-review.js`: review agents read every page line by line, then an adversarial
   verifier re-checks each finding (and adds misses).
   `workflows/site-audit.js`: functionality, performance, SEO, accessibility and content-strategy
   auditors test the live site in headless Chromium, each verified by a second agent, then a
   completeness critic looks for anything nobody checked.
6. `collect_agent_results.py` + `build_report.py` merge everything into the report and CSVs.
   Findings that only quote text in hidden template blocks are split out into
   `data/hidden_block_issues.csv`.

`browser_check.mjs` is the first browser pass (console errors, timings, overflow, interactions).

## Re-running

```bash
pip install requests beautifulsoup4 lxml language_tool_python
gunzip -k data/pages.json.gz data/links.json.gz   # or re-crawl:
python3 crawler.py && python3 refetch_failed.py
python3 prepare_review.py && python3 analyze.py
python3 build_report.py
```
Be gentle with the site: WordPress.com starts returning 429 above a few requests per second.
