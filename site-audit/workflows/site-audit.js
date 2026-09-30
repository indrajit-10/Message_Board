export const meta = {
  name: 'blog-site-audit',
  description: 'Site-wide audits of blog.123greetings.com (functionality, performance, technical SEO, accessibility, content strategy), each adversarially verified, then a completeness critic',
  phases: [
    { title: 'Site audits', detail: 'five specialist auditors working from crawl data + live browser tests' },
    { title: 'Site verify', detail: 'adversarial re-check of every site-level finding against the live site' },
    { title: 'Completeness', detail: 'critic looks for audit areas nobody covered' },
  ],
}

const ROOT = '/home/user/Message_Board/site-audit'

const COMMON = `You are part of an audit of https://blog.123greetings.com — a WordPress.com-hosted (Atomic) blog using Elementor 4.3 + the Soledad ("Penci") theme, Yoast SEO, Contact Form 7 with reCAPTCHA v3, Jetpack, Google Tag Manager, GPT/prebid ads and a truereach ad script. It publishes greeting-card message pages (e.g. /birthday-messages-for-mom/) and blog posts. Today is 2026-09-30.

Available data (already collected — reuse it, don't re-crawl the site):
- ${ROOT}/data/pages.json: dict url -> record with keys status, final_url, redirects, type (page/post/tag/category/author/404/other), title, meta_description, robots, canonical, og, lang, viewport, schema_types, datePublished, dateModified, headings (main content), h1_all, message_blocks [{heading,text}], faqs [{q,a}], word_count, paragraphs, side_nav [{text,href}], images [{src,alt,in_main,width,height}], links [{href,abs,text,rel,target,in_main}], iframes, forms, mixed_content, ids_dup, inlinks (internal pages linking here), sitemap (which sitemap listed it or null), lastmod, elapsed_ms, html_bytes, x_cache. 668 URLs: 247+7 pages, 49 posts, 354 tag pages, category/author archives + pagination.
- ${ROOT}/data/links.json: every unique link/image target [{url,status,final_url,redirects,refs:[{page,text,in_main,kind}]}].
- ${ROOT}/data/browser.json: an earlier Playwright pass over 19 pages (desktop+mobile): console errors, HTTP errors, timings, transfer size, overflow, tap targets, interaction checks. Caution: 429 responses in it were probably caused by our own concurrent crawler — re-test before blaming the site.
- ${ROOT}/data/languagetool.json: automated grammar hits per URL (content reviewers handle these; ignore unless relevant to you).

Browser: Node + Playwright are available. Put scripts and screenshots in ${ROOT}/agent-work/<your-area>/ (create it). Scripts there can "import { chromium } from 'playwright'" only if run from inside ${ROOT} (a node_modules symlink lives there) — e.g. write ${ROOT}/agent-work/<area>/x.mjs and run "cd ${ROOT} && node agent-work/<area>/x.mjs". Launch with chromium.launch({ channel: 'chromium' }) (this build trusts the sandbox proxy's CA; the default headless shell does not). Python 3 with requests/bs4/lxml is available.
Be gentle with the live server: sequential requests, pauses between page loads, and at most ~60 browser page loads in total. NEVER submit forms or post comments; never create accounts.

Report only things you actually observed or measured, with exact URLs, numbers and reproduction steps. Each finding needs: a short title, area, severity (critical/high/medium/low), affected URLs (or "sitewide" plus a count), evidence (what you saw/measured), and a concrete fix. Prefer fewer, well-evidenced findings over speculation, but be exhaustive within your area.`

const AUDITS = [
  {
    key: 'functionality',
    prompt: `${COMMON}

YOUR AREA: functionality & UX, desktop (1366x900) and mobile (390x844, isMobile, hasTouch). Test and report on:
- header navigation and mega menu: every top-level item and mega-menu link works (no "#" dead links), hover/click behaviour, keyboard access; mobile hamburger opens/closes and its links work;
- the left "Emotions" jump menu on message pages (e.g. /birthday-messages-for-mom/, /be-an-angel-day-messages/, /national-tap-dance-day-messages/): does each item scroll to an existing section? are there dead "#" anchors or items for sections that don't exist? is it visible/usable on mobile?
- empty message blocks rendering as empty quote marks “” (screenshot one), duplicate H1 visibility, layout gaps;
- calls to action: links to www.123greetings.com eCards (do they land on the right occasion category? any 404s — note links.json already found several 404s on www.123greetings.com/events/... and /blog/what-to-write-in-a-card), copy/share buttons if any, "Read more" links;
- search: is there ANY visible search UI on desktop or mobile? Does /?s=birthday return message pages or only posts? empty-results state (/?s=zzqx);
- archive (/archive/), category, tag and author pagination (page/2/ etc.), related-posts blocks on posts, previous/next links;
- comment forms on posts (inspect only), contact form /contact-us/ client-side validation (type invalid email / leave required empty and click submit ONLY if the form blocks client-side; if it would send, don't click);
- cookie consent banner (appears? dismissable? reappears? covers content on mobile?), sticky header / ads / sticky elements covering content on mobile, intrusive interstitials, layout shift from ads, back-to-top button;
- JavaScript errors: re-check the homepage error "TypeError: Cannot read properties of undefined (reading 'initialise')" seen earlier (find the source script and cause), and any other console errors on a clean, slow, sequential load;
- 404 page (/this-does-not-exist/) usefulness (search box? links?), redirects of old URLs;
- footer links, social profile links, About/Contact pages, /upcoming-events/ (earlier data shows 0 words of content — what does a visitor actually see?).
Save screenshots of every visual problem.`,
  },
  {
    key: 'performance',
    prompt: `${COMMON}

YOUR AREA: performance & Core Web Vitals. Try Lighthouse first: cd ${ROOT}/agent-work/performance && npx -y lighthouse@12 <url> --output=json --output-path=./<name>.json --quiet --chrome-path=/opt/pw-browsers/chromium-1194/chrome-linux/chrome --chrome-flags="--headless=new --no-sandbox" (mobile default; also run one with --preset=desktop). If Lighthouse cannot run, measure with Playwright (PerformanceObserver for LCP/CLS, long tasks for TBT, resource timing) under mobile emulation with CPU throttling via CDP (Emulation.setCPUThrottlingRate 4) and network throttling.
Pages: /, /birthday-messages/, /birthday-messages-for-mom/, /mothers-day-messages/ (large), /mothers-day-messages-for-wife-what-she-actually-wants/ (post), /archive/, /tag/alps/.
Also measure: TTFB cached vs uncached (curl -w "%{time_starttransfer}" with and without a cache-busting query string, several samples), total page weight and request count, render-blocking CSS/JS, unused JS/CSS, reCAPTCHA v3 and Contact Form 7 scripts loaded on every page (only /contact-us/ needs them), third-party cost (GTM, GPT/prebid, truereach, stats.wp.com, bilmur), image delivery (Jetpack Photon i0.wp.com sizes vs rendered size, formats, lazy-loading of above-the-fold LCP image, missing width/height), web fonts (Google Fonts via Elementor: how many families/weights, font-display), caching headers (cache-control max-age=300 on HTML; static assets), compression, DOM size (Elementor nesting). Quantify everything and give the top fixes ranked by impact.`,
  },
  {
    key: 'seo',
    prompt: `${COMMON}

YOUR AREA: technical SEO & indexing. Analyse pages.json/links.json with Python and check the live site where needed. Cover, with counts and full URL lists when under ~40 items (else counts + 10 examples):
- robots.txt, sitemap_index.xml and child sitemaps: what is included that shouldn't be (penci-block/mega-menu and penci-block/footer templates, the author archive, 347 tag pages, anything noindex), what indexable pages are missing, lastmod accuracy;
- status codes & redirects: 404s linked internally (e.g. /encouragement-inspiration-messages/ linked from /happiness-happens-day-messages/), internal links using http:// or missing trailing slash (on /what-to-write-in-a-card/ and elsewhere), redirect chains; broken outbound links to www.123greetings.com (list each with the pages and anchor texts that use it);
- titles: >60 chars, the very long default suffix " - 123Greetings Blog - Free eCards, Card Message Ideas & What to Write in Any Greeting Card" (count pages using it), duplicates (e.g. all the "Five Minutes With Bob" posts), leftovers such as "Meta Title", inconsistent separators/brand;
- meta descriptions: missing, duplicate, <70 or >160 chars, typos/space-before-punctuation;
- H1s: missing, multiple, identical across pages, H1 vs title mismatch; heading hierarchy;
- canonicals (self-referencing? pointing to http? mismatched), noindex usage, pagination handling;
- structured data: validate JSON-LD, which types are present; FAQ accordions without FAQPage schema (105 pages have FAQs); Article/BlogPosting on posts; BreadcrumbList; author/publisher; dates;
- images: missing/empty/generic alt (e.g. "arrow"), oversized, missing dimensions;
- internal linking: orphan pages (no inlinks from crawled pages), pages with very few inlinks, hub pages (/birthday-messages/, /anniversary-messages/, /what-to-write-in-a-card/) and whether they link to all their children; tag pages with only 1 post (thin/duplicate), paginated tag/author/category archives;
- the author archive slug "iblog123greetingsgmail-com" (derived from an email address) and author display name;
- URL hygiene: inconsistent slugs (birthday-message-for-dad singular, thankyou vs thank-you, "bosss", "friendship-week" / "just-because-day" / "working-parents-day" without "-messages"), keyword cannibalisation between similar pages;
- Open Graph/Twitter cards, og:image presence, lang attribute, hreflang;
- E-E-A-T signals: author info on posts, About page, contact info.
Write your analysis script(s) to ${ROOT}/agent-work/seo/.`,
  },
  {
    key: 'accessibility',
    prompt: `${COMMON}

YOUR AREA: accessibility (WCAG 2.2 AA). Run axe-core via Playwright on ~10 representative pages at desktop and mobile widths: /, /birthday-messages/, /birthday-messages-for-mom/, /be-an-angel-day-messages/, /sympathy-condolences-messages/, a post (/mothers-day-messages-for-wife-what-she-actually-wants/), /archive/, /tag/alps/, /contact-us/, the 404 page. Load axe with page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js' }) (or npm install axe-core inside ${ROOT}/agent-work/accessibility). Then manual checks: keyboard-only navigation through the header and mega menu, visible focus, skip link, landmarks (<main>, <nav>, <header>, <footer>), heading order, duplicate IDs, the empty “” message blocks and duplicated H1 as read by a screen reader, link purpose ("Read more", icon-only links), image alt (e.g. alt="arrow" on every jump-menu item), colour contrast of the orange/red heading colour #c8401e and body text, form labels and error messages on /contact-us/ (do not submit), zoom/reflow at 320 CSS px, reduced motion, cookie banner focus trap, ads. Report each issue with the WCAG success criterion, affected pages/count, the element (selector), and the fix.`,
  },
  {
    key: 'content-strategy',
    prompt: `${COMMON}

YOUR AREA: content strategy, gaps and thin content at the site level (a separate team is reviewing each page's wording line by line — you focus on the site as a whole). Answer with evidence:
1. Title-promise gap: for every page whose <title> claims a count ("50+", "100+", "500+"...), compare to the actual number of non-empty messages (message_blocks where text stripped of quotes is non-empty). Produce the full sorted table (url, claimed, actual, shortfall) and the total number of messages needed to honour every title. Note hub pages that claim hundreds but hold none themselves (/birthday-messages/ "500+", /anniversary-messages/ "250+").
2. Thin pages: rank all pages/posts by usefulness (word_count, message count, FAQs, intro presence); list the thinnest 40 with what each is missing. Identify the "template" families (e.g. zodiac birthday pages, milestone birthdays, anniversary-by-year, anniversary-by-relationship, national days) and what each family consistently lacks.
3. Coverage gaps: which major greeting-card occasions, holidays and relationships are missing entirely? Before claiming something is missing, check likely slugs on the live site with curl (e.g. /christmas-messages/, /new-year-messages/, /valentines-day-messages/, /diwali-messages/, /hanukkah-messages/, /eid-messages/, /st-patricks-day-messages/, /retirement-messages/, /good-luck-messages/, /new-job-messages/, /housewarming-messages/, /baby-shower-messages/, /bridal-shower-messages/, /miss-you-messages/, /good-morning-messages/, /good-night-messages/, /pet-sympathy-messages/, /birthday-messages-for-cousin/, /birthday-messages-for-friend/, /birthday-messages-for-kids/, /memorial-day-messages/, /juneteenth-messages/, /womens-day-messages/, /nurses-day-messages/, /secretary-day or administrative professionals day, /grandparents-day exists?, /christmas-messages-for-*/ ...) and also try the site search (/?s=christmas). Prioritise by seasonality: list what should be published or refreshed before each upcoming occasion in the next 4 months from 2026-09-30 (verify 2026 dates: Diwali, Halloween, Day of the Dead, Veterans Day, Thanksgiving (US Nov 26 2026), Hanukkah, Christmas, Kwanzaa, New Year, Valentine's Day) and whether the existing seasonal pages (/halloween-messages/, /thanksgiving-day-messages/, /canadian-thanksgiving-messages/, /veterans-day-messages/, /day-of-the-dead-messages/, /all-saints-day-messages/, /fall-messages/ ...) are strong enough.
4. Cannibalisation/duplication between pages: e.g. /thank-you-messages/ vs /thankyou-messages/ vs /national-thank-you-day-messages/ vs /thank-you-day-messages/; /dance-day-messages/ vs /national-tap-dance-day-messages/; /work-anniversary-messages/ vs /anniversary-messages-for-co-worker/ vs /anniversary-messages-for-employee/ vs /anniversary-messages-for-boss/; /wedding-anniversary-messages/ vs /anniversary-messages/; /friendship-week/ vs /friendship-day-messages/ vs /friendship-messages/; /inspiration-messages*/ vs /national-day-of-encouragement-messages/; /business-anniversary-messages/ vs /company-anniversary-messages/ vs /anniversary-messages-for-customers/. Recommend merge / 301 / differentiate for each group.
5. Cross-page duplicate messages: using message_blocks, find messages that appear verbatim on 2+ pages; list the most-reused ones and the pages; flag generic filler that doesn't fit the page it's on.
6. Hubs & internal linking: do hub pages (/, /what-to-write-in-a-card/, /birthday-messages/, /anniversary-messages/, /wedding-messages/, /friendship-messages/, /thankyou-messages/, /inspiration-messages/) link to every child page? Which message pages are orphaned or reachable only via one link? Do the long-form posts link to the relevant message pages and eCards?
7. Posts: the ~33 "Bob" daily/weekly posts ("Five Minutes With Bob", "Wake Up With Bob", "Your Weekly Bobcast") — duplicate titles/H1s, thinness, value for search, tagging (tags like "alps" with one post); the Mother's Day story posts — useful? interlinked?
8. Freshness & trust: pages referencing past years/dates, /upcoming-events/ (earlier crawl found 0 words — what's there?), author bylines, publish/modified dates, About page claims.
Deliver prioritised, concrete recommendations (what to write/merge/redirect/noindex, in what order).`,
  },
]

const SITE_FINDINGS = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          area: { type: 'string' },
          severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
          urls: { type: 'array', items: { type: 'string' } },
          count: { type: 'integer' },
          evidence: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['title', 'area', 'severity', 'urls', 'evidence', 'fix'],
      },
    },
    tables: {
      type: 'array',
      description: 'optional full data tables supporting findings (e.g. title-promise gap table, missing-occasion list, Lighthouse scores)',
      items: {
        type: 'object',
        properties: { name: { type: 'string' }, columns: { type: 'array', items: { type: 'string' } }, rows: { type: 'array', items: { type: 'array', items: { type: ['string', 'number', 'null'] } } } },
        required: ['name', 'columns', 'rows'],
      },
    },
    notes: { type: 'string' },
  },
  required: ['findings'],
}

const VERDICTS = {
  type: 'object',
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          verdict: { type: 'string', enum: ['confirmed', 'partly-confirmed', 'refuted', 'unverifiable'] },
          severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
          corrected_evidence: { type: 'string' },
          corrected_fix: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['title', 'verdict', 'severity', 'reason'],
      },
    },
    missed: {
      type: 'array',
      description: 'important findings in this area the auditor missed that you observed',
      items: SITE_FINDINGS.properties.findings.items,
    },
  },
  required: ['verdicts', 'missed'],
}

function verifyPrompt(a, res) {
  return `${COMMON}

YOUR TASK: adversarially verify the "${a.key}" auditor's findings below. For EACH finding, independently re-check it against the live site and the data files (re-run the measurement, open the page, count again). Default to "refuted" when the evidence does not hold up, "partly-confirmed" when the direction is right but numbers/URLs/severity are off (give corrected_evidence), "unverifiable" if it cannot be reproduced now. Check that severities are proportionate and fixes are correct and specific to this WordPress/Elementor/WordPress.com setup. Then list important issues in this area that the auditor missed (in "missed"), with evidence. Keep "title" identical to the auditor's title so results can be joined.

AUDITOR FINDINGS:
${JSON.stringify(res.findings)}`
}

const results = await pipeline(
  AUDITS,
  (a) => agent(a.prompt, { label: `audit:${a.key}`, phase: 'Site audits', schema: SITE_FINDINGS }),
  (res, a) =>
    res
      ? agent(verifyPrompt(a, res), { label: `verify:${a.key}`, phase: 'Site verify', schema: VERDICTS }).then((v) => ({ key: a.key, audit: res, verify: v }))
      : null,
)

const done = results.filter(Boolean)
phase('Completeness')
const digest = done.map((r) => ({
  area: r.key,
  findings: r.audit.findings.map((f) => `${f.severity} | ${f.title}`),
  verdicts: r.verify ? r.verify.verdicts.map((v) => `${v.verdict}: ${v.title}`) : [],
  missed: r.verify ? r.verify.missed.map((m) => m.title) : [],
}))
const critic = await agent(
  `${COMMON}

YOUR TASK: completeness critic. Below is the digest of what the site-level audit found (functionality, performance, SEO, accessibility, content strategy). A separate line-by-line review of every page's wording (typos, grammar, wrong-recipient messages, leaked template text, factual errors, thin content per page) is being done elsewhere — don't duplicate that. What important aspects of this blog's quality, errors, or improvement opportunities did NOBODY check? Think: security headers & exposed info (e.g. author slug from an email, x-hacker header, WP REST API user enumeration /wp-json/wp/v2/users, xmlrpc), privacy/cookie compliance (GDPR/CCPA consent before GA/ads), legal pages (privacy policy, terms, disclosure), RSS feeds, favicon/manifest, print styles, social sharing previews, analytics setup, ads density/policy, comment spam, email capture, conversion paths to eCards, structured data for messages, internationalisation, and anything else. For each gap you identify, actually check it on the live site now (gently) and report it as a finding with evidence. Only report things you verified.

DIGEST:
${JSON.stringify(digest)}`,
  { label: 'completeness-critic', phase: 'Completeness', schema: SITE_FINDINGS },
)

return {
  areas: done.map((r) => ({
    key: r.key,
    findings: r.audit.findings.length,
    confirmed: r.verify ? r.verify.verdicts.filter((v) => v.verdict === 'confirmed' || v.verdict === 'partly-confirmed').length : null,
    refuted: r.verify ? r.verify.verdicts.filter((v) => v.verdict === 'refuted').length : null,
    missed: r.verify ? r.verify.missed.length : null,
  })),
  critic_findings: critic ? critic.findings.length : null,
}
