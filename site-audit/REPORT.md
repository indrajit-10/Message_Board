# blog.123greetings.com — site audit (30 Sep 2026)

Crawled **668 URLs** (sitemaps + every internal link), checked **669 unique link/image targets**, and had every one of the **296 pages and posts** read line by line by review agents. Reviewers raised 1,698 issues; an adversarial verifier rejected 364 of them as false positives or style preferences and added 29 the reviewers missed. Of the 1,363 that survived, 112 only concern a hidden template block and are listed separately, leaving **1,251 visible errors**. Functionality, performance, SEO, accessibility and content strategy were audited in headless Chromium and each finding was re-tested by a second agent (0 refuted and dropped; numbers corrected where they were off), and a completeness critic covered privacy, ads, security and other gaps.

> Caveats: our test IP was rate-limited by WordPress.com (HTTP 429) during parts of the audit, so Lighthouse timings are indicative. Re-check them in PageSpeed Insights. Factual corrections (observance dates, history) were checked by the verifier against web sources, but an editor should confirm them before publishing. Privacy and ad observations describe what a US browser session received; they are not legal advice.

## Headline numbers

| | |
|---|---|
| Verified wording / content errors | **1251** (45 high severity) |
| Editor / AI notes published on live pages | **21** |
| Factual errors (dates, history, anniversary gifts) | **39** |
| Pages whose title promises more messages than they have | **125** (short by 7,589 messages in total) |
| Thin pages that need more content | **234** of 296 |
| Broken link targets | **8** (used 40 times) |
| Site-level issues (UX, performance, SEO, a11y, strategy, security) | **99** |
| Messages on the whole site | 2165 (median page: 5) |


## Fix these first

1. **Delete editor and AI notes that are live on the site** — 21 places, e.g. 'META TITLE: … META DESCRIPTION …' inside the Inspiration FAQ, 'Meta Title' at the end of the Anniversary-for-Brother page title, '(our #2 market)' on National Best Friends Day, 'Use as a card, a caption… It travels well.' in a Mom birthday message, '(in one line)/(next line)', 'Clever and Humours !', 'Value of this blog:' and '(Rotating Section Based on Categories)'. Filter the Content errors tab by type 'leaked-template-text'.
2. **Publish the holiday season before it arrives** — There is no Christmas, New Year, Hanukkah, Diwali, Kwanzaa or Valentine's Day page (84 likely URLs checked, all 404), and the calendar on /what-to-write-in-a-card/ links nothing for December to February. Suggested live-by dates: Diwali and Dussehra by 12–20 Oct, a Christmas hub by 31 Oct, Hanukkah by 13 Nov, New Year by 1 Dec. The existing autumn pages (Canadian Thanksgiving on 12 Oct, Halloween, US Thanksgiving) have about 5 messages each. The Content strategy tab has the full dated plan.
3. **Stop titles from over-promising** — 125 pages promise '50+', '100+' or even '500+' messages, but the typical message page has 5. Together they are 7,589 messages short. Change the titles to the real count today, then grow the pages (the Thin pages tab lists what to add to each).
4. **Fix messages written for the wrong occasion or person** — The Tap Dance Day page has only generic 'Dance Day' lines (one repeated). Work, customer and employee anniversary pages mix in wedding-anniversary wishes. Oatmeal Day mentions cornflakes, Sunflower Day says 'International Flower Day', and a bride's card says 'our journey'. Filter by 'wrong-topic' and 'wrong-recipient'.
5. **Repair broken eCard links and add a card link to every message page** — 7 dead links to www.123greetings.com (e.g. /blog/what-to-write-in-a-card, used 32 times on the Mother's Day posts) and 1 internal 404 (/encouragement-inspiration-messages/): 40 broken links on 13 pages. 22 message pages send people to the old search.123greetings.com search instead of the occasion's card category, and 141 of 235 message pages have no link to send a matching eCard at all.
6. **Correct factual errors** — 39 verified, e.g. wrong dates for Brothers Day, Orange Blossom Day, Sunflower Day, Say Hey Day and Clergy Appreciation Day; the invented 'established by the U.S. Congress in 1935' claim on Best Friends Day; 'Crystal to China' on both the 15th and 20th anniversary titles.
7. **Make the messages findable** — Most pages have no search box, and the site search returns only posts, never the 235 message pages. Message pages are dead ends: no breadcrumbs, related messages or in-content links on 227 of them. 215 of 247 pages have a single internal link pointing to them, the 49 posts can't be reached by links from the homepage, every post's 'You may also like' shows the same 10 Bob diary posts, and /upcoming-events/ is blank but in the sitemap.
8. **Speed up page loads** — Pages that miss the cache take about 2.2 s to generate, and about 1.3 s of that is WordPress starting up before the theme renders anything (plugins, autoloaded options). Every page makes 61–75 first-party requests (37–43 stylesheets). reCAPTCHA and the contact-form scripts (about 800 KB) load on every page, not just /contact-us/, and the ad and ID-sync stack is heavy for a single ad slot. Lighthouse times from this audit are indicative only, because our test IP was rate-limited: re-check in PageSpeed Insights and Search Console.
9. **Clean up templates and indexing** — 134 message pages carry a leftover section hidden on every screen size, with a second H1, empty “” quotes and a dead 'Emotions' menu. Search engines read it. 255 titles end in a 91-character site-name suffix, 20 'Bob' posts share two titles, and 347 thin tag archives plus two theme templates (/penci-block/…) are in the sitemap. 152 pages use a 16×16 arrow as their share image, and the author URL is built from an email address.
10. **Fix keyboard and screen-reader basics** — The theme removes the focus outline sitewide. Every message's copy button has no accessible name, the mobile menu button can't be reached by keyboard, and there is no <main> landmark or skip link. See the Accessibility tab.
11. **Review consent, the ad setup and exposed admin endpoints** — In a fresh US browser session, 17 cookies are set and ad ID-sync requests start about 4 s in, before anyone touches the notice-only cookie banner. The only ad is a full-screen interstitial requested on every page view, sympathy pages included, with no frequency cap, and every ad request hard-codes page_url to www.123greetings.com. The public REST index advertises Code Snippets, an MCP adapter and Elementor MCP endpoints, and no clickjacking or MIME-sniffing headers are sent. See the 'Privacy, ads, security & other' tab.
12. **Run the proofreading fixes** — 1,251 verified wording errors (45 high, 380 medium) with the exact text and a suggested correction for each, e.g. 'Have a Blast !', 'let go off', 'eCards I our 123Greetngso', and sentences run together without a full stop. Everything is in data/content_errors.csv and the Content errors tab.


## Files

- `data/content_errors.csv` — every verified error with the exact text and a suggested fix
- `data/content_recommendations.csv` — per-page thin-content score and what to add
- `data/site_findings.csv` — site-level findings with verifier verdicts
- `data/broken_links.csv`, `data/cross_page_duplicates.csv`, `data/page_summary.csv`, `data/deterministic_findings.json`
- `report/index.html` — the same report as an interactive dashboard


## Site-wide checks (automated)

| Severity | Check | Pages | How to fix |
|---|---|---|---|
| high | Thin page (under 300 words or fewer than 10 messages) | 198 | Expand with messages, an intro, tips and FAQs; see the Thin pages tab. |
| high | Title promises more messages than the page has | 125 | Either add messages to honour the number or change the title to the real count. |
| high | Broken link to www.123greetings.com | 12 | Point the link to a live eCard category. |
| high | Page returns an error status | 1 | Restore the page or add a 301 redirect. |
| high | Broken internal link (404) | 1 | Fix the URL or 301-redirect the missing page. |
| high | Leftover text in title | 1 | Remove 'Meta Title' from the SEO title. |
| high | Editor or template text published inside a message | 1 | Delete the stray text. |
| medium | Title longer than ~65 characters | 412 | Shorten; replace the long site-name suffix with '\| 123Greetings'. |
| medium | Same H1 on many pages | 23 | Use a unique H1 per post (include the date/topic). |
| medium | Duplicate page titles | 22 | Give every post a unique, descriptive title. |
| medium | Orphan page (no internal links point to it) | 8 | Link it from the relevant hub and related pages. |
| medium | Author URL derived from an email address | 5 | Change the author's nicename/slug (e.g. /author/bob/) and 301 the old URL. |
| medium | Links with href='#' that go nowhere | 4 | Give them a real destination or render them as plain text. |
| medium | Same message repeated on one page | 4 | Replace the duplicate with a new message. |
| medium | Theme template blocks listed in the sitemap | 2 | Exclude the penci-block post type from Yoast sitemaps and noindex it. |
| medium | Missing meta description | 2 | Write one (120–155 characters). |
| medium | Two different H1s on the page | 1 | Keep one H1; make the second (mobile hero) a styled div or h2. |
| medium | Page has no H1 | 1 | Add a descriptive H1. |
| low | Tag archive with a single post (thin, near-duplicate) | 317 | Noindex tag archives or prune one-off tags. |
| low | Page reachable from only one internal link | 212 | Add contextual links from related pages and hubs. |
| low | Generic image alt text ('arrow') | 152 | Decorative icons should have alt="". |
| low | hidden-template-section | 134 |  |
| low | No og:image for social sharing | 92 | Set a featured image or Yoast social image. |
| low | Space before punctuation / missing sentence breaks | 29 | Remove the space and add the missing full stop between sentences. |
| low | eCard link goes through a redirect | 3 | Link to the final https://www.123greetings.com URL. |
| low | Insecure http:// links in page | 3 | Change to https://. |
| low | Space before punctuation in meta description | 3 | Remove the stray space. |
| low | Internal link goes through a redirect (http:// or no trailing slash) | 1 | Link directly to the final https URL with trailing slash. |
| low | Punctuation error in title | 1 | Fix spacing. |
| low | Image missing alt text | 1 | Add descriptive alt text. |
| low | Unbalanced quotation marks | 1 | Add the missing curly quote. |

## Broken links

| Target | Status | Used | On pages |
|---|---|---|---|
| https://www.123greetings.com/blog/what-to-write-in-a-card | 404 | 32× | /happy-mothers-day-2026-messages-what-to-write-in-the-card/ \| /mothers-day-card-messages-for-grandma-funny-heartfelt/ \| /mothers-day-messages-for-mother-in-law-what-to-write/ \| /mothers-day-messages-for-someone-who-lost-their-mom/ \| /mothers-day-messages-for-wife-what-she-actually-wants/ \| /mothers-day-wishes-for-stepmom-50-heartfelt-card-messages/ |
| https://www.123greetings.com/events/sorry/ | 404 | 1× | /sorry-messages-for-coworkers-when-my-coworker-struggled-with-saying-sorry/ |
| https://www.123greetings.com/events/thank_you/ | 404 | 2× | /love-messages-for-wife-the-thank-you-i-owed-my-wife-for-two-years/ \| /thank-you-card-messages-when-my-father-in-law-said-the-quiet-thing-out-loud/ |
| https://www.123greetings.com/events/congratulations/ | 404 | 1× | /congratulations-card-messages-when-i-realized-id-quietly-let-an-old-friendship-drift/ |
| https://www.123greetings.com/events/national_vanilla_pudding_day/https://www.123greetings.com/events/national_vanilla_pudding_day/ | 404 | 1× | /19th-may-your-week-with-bob/ |
| https://www.123greetings.com/family/father/ | 404 | 1× | /thank-you-card-messages-when-my-father-in-law-said-the-quiet-thing-out-loud/ |
| https://blog.123greetings.com/encouragement-inspiration-messages/ | 404 | 1× | /happiness-happens-day-messages/ |
| https://www.123greetings.com/events/honey-month/ | 404 | 1× | /honey-month-messages/ |

## Functionality & UX

### [high] Message pages are dead ends: no breadcrumbs, no related messages, no in-content links

*Verdict: partly-confirmed* · Affected: /birthday-messages-for-mom/, /national-tap-dance-day-messages/, /be-an-angel-day-messages/, /anniversary-messages-for-boyfriend/, /messages-for-50th-anniversary/

**Evidence.** 234 of 242 message pages (pages.json, type=page with message blocks) have no link in the main content to any other blog page. Only 8 do: /everyday-messages/, /stepfamily-day-messages/, /happiness-happens-day-messages/, /national-relaxation-day-messages/, /national-day-of-encouragement-messages/, /wife-appreciation-day-messages/, /international-daughters-day-messages/, /congratulations-messages/.

Example: every link on /birthday-messages-for-mom/ is one of these:
- the 4 header items (repeated in 3 header copies and the off-canvas menu)
- the hidden side-nav anchors
- 6 legal footer links to www.123greetings.com

There are no breadcrumbs, no "more birthday messages", no link back to /birthday-messages/, and no eCard link. The page ends after 7 messages (shots/d_mom_full.png).

The header offers only Home, About Us, What to write in a card and Contact Us. The footer has only legal links. A visitor who arrives from search has to go back to the homepage or to /what-to-write-in-a-card/ to find a sibling page such as /birthday-message-for-dad/.
[Verifier] Recount of https-only records: 227 of 235 message pages have no main-content link to any other blog.123greetings.com URL. The 8 exceptions are exactly the ones listed.

Live /birthday-messages-for-mom/ has these link targets, and nothing else:
- 9× /
- 3× /about-us/, 3× /what-to-write-in-a-card/, 3× /contact-us/
- 6× '#'
- 1 empty href
- 6 legal links on www

There is no link to /birthday-messages/, even though that hub links to this page (inlinks: /, /birthday-messages/).

In the browser, no breadcrumb element is present (.penci-breadcrumb, #breadcrumbs, .yoast-breadcrumbs all absent). However, Yoast already outputs BreadcrumbList JSON-LD with only 2 items (Home › Birthday Messages for Mom), because the pages have no parent page and the URLs are flat.

**Fix.** 1. Turning on Yoast breadcrumbs alone renders "Home › Birthday Messages for Mom"; the hub level will not appear. To get Home › Birthday Messages › For Mom, use one of these:
   - Insert the hub through the wpseo_breadcrumb_links filter, mapping each page to its hub (e.g. by slug prefix or a custom field).
   - Assign parent pages. This changes the URLs to /birthday-messages/birthday-messages-for-mom/ and needs 301s.
2. Render the trail with Yoast's [wpseo_breadcrumb] shortcode (or Elementor Pro's Breadcrumbs widget) in the message-page template.
3. Keep the proposed "More [occasion] messages" block, linking the hub plus 4–8 siblings.

### [high] Most pages have no search box, and the site's own search skips all 242 message pages

*Verdict: partly-confirmed* · Affected: /?s=birthday, /?s=tap+dance, /?s=sympathy, /?s=birthday+messages+for+mom, /?s=zzqx, /this-does-not-exist/, /, /what-to-write-in-a-card/ (+1 more)

**Evidence.** The header has no search control at 1366px or at 390px: there is no search icon or form in the header DOM, and the off-canvas menu contains only 4 links. A search box is visible in only three places. (1) The homepage and (2) /what-to-write-in-a-card/ each have a Google Programmable Search box ("Search Messages", div.gcse-search). (3) 404 pages have the theme's WordPress search form (pc-searchform). I fetched 40 page HTMLs (38 message pages, 1 post, the homepage) and only the homepage contained a search widget. The crawl found pc-searchform only on the 404 template.

The WordPress search (the one the 404 page uses) returns posts only:
- /?s=birthday: 10 results per page (page 2 exists), all posts ("Five Minutes With Bob", "…Weekly Bobcast", etc.). /birthday-messages/ and /birthday-messages-for-mom/ are missing.
- /?s=tap+dance: 2 posts; /national-tap-dance-day-messages/ is missing.
- /?s=sympathy: 1 post; /sympathy-condolences-messages/ is missing.
- /?s=birthday+messages+for+mom: 10 Mother's Day posts; /birthday-messages-for-mom/ is missing.

The 404 page says "Please use search for help", but that search cannot return a message page.

The zero-results page (/?s=zzqx) shows only "Sorry, but nothing matched your search terms. Please try again with some different keywords." It has no search field, no suggestions and no links, and it capitalises the query as "Zzqx" (shots/d_search_empty.png).

The homepage Google search does find pages ("birthday mom" gives 4 results including /birthday-messages-for-mom/). However, every result shows an extra underlined "Structured data" link (shots/RATE_LIMITED_CSS_MISSING__d_home_cse_results.png; the site's own CSS was rate-limited in that capture, but the Google results block rendered normally).
[Verifier] Fresh HTML (agent-work/verify-functionality/html/) of /, /birthday-messages-for-mom/, /what-to-write-in-a-card/, a post, /?s=zzqx and the 404 page. None of them has a search element anywhere in the header containers or in #penci_off_canvas (which holds only logo, Home, About Us, What to write in a card, Contact Us).

Where search exists:
- Google Programmable Search (div.gcse-search, cx=b765cee8c32e74217) is only on / and /what-to-write-in-a-card/.
- form.pc-searchform appears on exactly 1 URL in the crawl, the 404 template.

WordPress search (live) returns 0 pages for every query:
- /?s=birthday: 10 posts, with a page 2.
- /?s=tap+dance: 2 posts.
- /?s=sympathy: 1 post.
- /?s=birthday+messages+for+mom: 10 posts (8 Mother's Day), with a page 2.

/?s=zzqx: body class search-no-results, 0 input fields. The H1 renders as "Zzqx" because of text-transform:capitalize.

Google search works:
- Homepage, "birthday mom": 4 results (/birthday-messages-for-mom/ first), each with a "Structured data" element (4 of 4).
- On /what-to-write-in-a-card/ it finds exactly the pages WordPress search misses: "tap dance" → /national-tap-dance-day-messages/, "sympathy" → /sympathy-condolences-messages/, "honey month" → /honey-month-messages/, "birthday messages for dad" → /birthday-message-for-dad/ (d2.json).

The unique message-page count is 235.

**Fix.** As proposed, plus the following.
1. Soledad's header builder has a Search element for the desktop and mobile rows. It submits to ?s=, so fix the engine first: include the page post type, or switch the 404 form and header to the Google engine, which already indexes the message pages.
2. Yoast's WebSite schema SearchAction also targets /?s={search_term_string}, so it points at the posts-only search as well.
3. Keep one engine only, so the homepage's Google box and the header box return the same results.

### [medium] "You may also like" on every post shows the same 10 unrelated 'Bob' diary posts

*Verdict: confirmed* · Affected: /mothers-day-messages-for-wife-what-she-actually-wants/, /mothers-day-messages-for-someone-who-lost-their-mom/, /birthday-card-messages-when-my-brother-and-i-stopped-talking-about-things-that-mattered/

**Evidence.** Every one of the 49 posts in pages.json has the same related-posts carousel (.penci-related-carousel) under "YOU MAY ALSO LIKE": 7× "Five Minutes With Bob" and 3× "Wake Up With Bob", i.e. the 10 most recent diary posts.

For example, the post "Mother's Day Messages for Wife" recommends "Five Minutes With Bob, August 2, 2026" and similar (shots/d_post_related.png, m_post_related.png).

The cause is that all posts are in the single category "123greetings", so relating posts by category just returns the latest posts. Previous/next links do work (e.g. "Heartfelt Mother's Day Messages…" / "What to Write in a Mother's Day Card…").
[Verifier] Live posts checked:
- /mothers-day-messages-for-wife-what-she-actually-wants/
- /birthday-card-messages-when-my-brother-and-i-stopped-talking-about-things-that-mattered/
- /five-minutes-with-bob/

Each shows "You may also like" (.penci-related-carousel) with 10 items: 7× "Five Minutes With Bob" and 3× "Wake Up With Bob". In pages.json, all 49 posts link the same Bob set, apart from self-exclusion and prev/next variation.

The only category archive is /category/123greetings/ (plus pagination). Prev/next links work, e.g. "Heartfelt Mother's Day Messages…" / "What to Write in a Mother's Day Card…".

**Fix.** As proposed. In the Soledad Customizer, under Single Post > Related Posts, switch "related posts based on" to tags. Move the Bob series into its own category and exclude it.

### [medium] 141 of 242 message pages have no link to send a matching eCard

*Verdict: partly-confirmed* · Affected: /birthday-messages-for-mom/, /national-tap-dance-day-messages/, /sympathy-condolences-messages/, /mothers-day-messages/, /thank-you-messages/, /graduation-messages/, /easter-messages/, /love-messages/

**Evidence.** pages.json: 141 of 242 message pages have no link in the main content to www.123greetings.com (the full list is in the "Message pages without eCard CTA" table). This includes the site's flagship pages:
- all 31 /anniversary-messages-for-*/ pages
- 37 /birthday-messages-for-*/ pages
- the milestone birthday and anniversary pages
- /mothers-day-messages/, /sympathy-condolences-messages/, /thank-you-messages/

In the browser, /birthday-messages-for-mom/ has 0 www.123greetings.com links in content on desktop and on mobile. Matching card categories do exist; for example, https://www.123greetings.com/events/national_tap_dance_day/ (200) is linked from a Bob post but not from /national-tap-dance-day-messages/.
[Verifier] https-only recount: 141 of 235 message pages have no main-content link to www.123greetings.com, 123greetings.com or search.123greetings.com. Counting www-only links gives 143, because /parents-day-messages/ and /cute-messages/ link only to the search.123greetings.com CGI.

By group:
- 39 of 39 /birthday-messages-for-*/ pages, including the 12 zodiac pages
- 31 of 31 /anniversary-messages-for-*/ pages
- 23 of 23 /messages-for-*/ milestone pages

Confirmed: /events/national_tap_dance_day/ returns 200 and is linked only from /24th-may-your-weekly-bobcast/ (as http://123greetings.com/…, one 301).

**Fix.** As proposed. Each message page is its own Elementor document, so a template-level CTA needs one of two routes:
- An Elementor Pro dynamic tag (or ACF field) for the target URL inside a saved global section.
- A per-page Button widget.
Prefer the dedicated /events/<occasion>/ category over the search CGI.

### [medium] Broken and mismatched card links (CTAs): 40 links on 13 pages return 404

*Verdict: partly-confirmed* · Affected: /mothers-day-messages-for-wife-what-she-actually-wants/, /mothers-day-messages-for-someone-who-lost-their-mom/, /mothers-day-messages-for-mother-in-law-what-to-write/, /happy-mothers-day-2026-messages-what-to-write-in-the-card/, /mothers-day-card-messages-for-grandma-funny-heartfelt/, /mothers-day-wishes-for-stepmom-50-heartfelt-card-messages/, /sorry-messages-for-coworkers-when-my-coworker-struggled-with-saying-sorry/, /love-messages-for-wife-the-thank-you-i-owed-my-wife-for-two-years/ (+8 more)

**Evidence.** links.json has 8 dead targets used 40 times across 13 pages. I re-checked the main ones live with curl.

Mother's Day posts: the "More Mother's Day Messages & Cards" block on 6 posts has 5–6 arrow links each ("→ Mother's Day messages for your wife", "→ …for grandma", etc.). All 32 of these point to the same URL, https://www.123greetings.com/blog/what-to-write-in-a-card, which returns 404; https://www.123greetings.com/blog/ is also 404 (shots/d_post_404_ctas.png).

Other dead targets (all 404):
- /events/sorry/
- /events/thank_you/ (2 pages)
- /events/congratulations/
- /family/father/
- /events/honey-month/ (the /events/honey_month/ variant is also 404)
- a doubled URL: /events/national_vanilla_pudding_day/https://www.123greetings.com/events/national_vanilla_pudding_day/
- internal link blog.123greetings.com/encouragement-inspiration-messages/

Working targets exist for several of these (all 200, checked live): /general/sorry/, /thank_you/, /congratulations/, /events/national_vanilla_pudding_day/, /events/sweetest_day/.

Mismatched links:
- /love-note-day-messages/: "Romantic Card" goes to /tags/romantic_birthday_cards.html, a birthday category.
- /sweetest-day-messages/: its only card link is /events/valentines_day/ ("Unlike Valentine's Day…"), although /events/sweetest_day/ exists.
- /st-francis-day-messages/: links to https://www.123greetings.com/?utm_source=chatgpt.com.

Redirect handling for old URLs is otherwise fine: http→https, missing trailing slash, ?p=8620 and a truncated slug all 301 once to the canonical URL.
[Verifier] links.json: 8 targets with status 404, 40 refs, 13 pages. Live curl, one at a time:
- 404: /blog/what-to-write-in-a-card (32 refs from 6 Mother's Day posts), /blog/, /events/sorry/, /events/thank_you/, /events/congratulations/, /family/father/, /events/honey-month/, /events/honey_month/, the doubled vanilla-pudding URL, and blog /encouragement-inspiration-messages/.
- 200: /general/sorry/, /thank_you/, /congratulations/, /events/national_vanilla_pudding_day/, /events/sweetest_day/, /events/national_tap_dance_day/, blog /inspiration-messages/.

Corrections:
(1) /sweetest-day-messages/ already links "Sweetest Day" → https://www.123greetings.com/events/sweetest_day/ (live HTML). The Valentine's link is only a comparison in the sentence "Unlike Valentine's Day, Sweetest Day isn't limited…", so fix step 4 is unnecessary.
(2) Missed on /honey-month-messages/: the anchor "Honey Month" goes to /events/hug_month/ (Hug Month, the wrong occasion), and "123Greetings" goes to the 404 /events/honey-month/. The correct category, https://www.123greetings.com/events/national_honey_month/, returns 200.
(3) /family/father/ has no suggested replacement; /family/ (200) and /events/fathers_day/ (200) exist.
(4) AI-tool UTMs, 8 links on 7 pages:
   - /st-francis-day-messages/
   - /national-day-of-encouragement-messages/ (internal link to /what-to-write-in-a-card/?utm_source=chatgpt.com)
   - /womens-friendship-day-messages/
   - /guardian-angel-day-messages/ (×2)
   - /samhain-messages/
   - /thanksgiving-day-messages/
   - /inspiration-messages-you-can-do-it/ (utm_source=gemini)

**Fix.** Replacements:
- 32 /blog/what-to-write-in-a-card links → the specific blog pages named in their anchors.
- 301 on www: /blog/* → https://blog.123greetings.com/*.
- /events/sorry/ → /general/sorry/
- /events/thank_you/ → /thank_you/
- /events/congratulations/ → /congratulations/
- /family/father/ → /events/fathers_day/ (or /family/)
- the vanilla-pudding URL → /events/national_vanilla_pudding_day/
- encouragement-inspiration-messages → /more-inspiration-messages/ or /inspiration-messages/

On /honey-month-messages/, point both links ("Honey Month", currently hug_month, and "123Greetings", currently 404) to /events/national_honey_month/.

Remove ?utm_source=chatgpt.com and ?utm_source=gemini from all 8 links. Leave /sweetest-day-messages/ as it is.

### [medium] Cookie banner covers 23% of the mobile screen and blocks search and back-to-top; closing with "x" counts as consent

*Verdict: confirmed* · Affected: /, /birthday-messages/, /about-us/, /contact-us/

**Evidence.** The banner appears on first visit on every tested page.
- Desktop: a 384x198 dialog at bottom-right.
- Mobile: a full-width 390x198 dialog, 23.4% of the 390x844 viewport, position:fixed, z-index 2147483646. It stays on screen while scrolling until dismissed.

What it covers on the mobile homepage:
- The "Search Messages" box, which sits at y=800, inside the banner area (y=646–844).
- The back-to-top button at (330,784). After scrolling to y=1500 I tapped back-to-top and the page did not move (scrollY stayed 1500), because the banner took the tap (shots/m_home_scrolled_1500.png, m_home_banner.png).

Dismissal:
- "Accept" sets cookieconsent_status=dismiss with a 1-year expiry. The banner did not reappear on the next pages (/about-us/ → /contact-us/).
- Tapping "x" sets cookieconsent_status=allow, so closing the banner is recorded as consent.
- There is no reject or settings option, and no revoke button (plugin config "revokable":"0").
- Google Analytics (GA4) collect requests fired before any choice was made (seen in the load log).
- If the plugin script fails, no banner shows at all (see the JavaScript finding).
[Verifier] Banner size and position:
- Mobile 390x844: .cc-window at [0,646,390,198], i.e. 23.5% of the viewport; position:fixed, z-index 2147483646.
- Desktop: [966,686,384,198].
- On the mobile homepage, the Google search box (.gsc-control-cse) sits at y=782–842, inside the banner area.

Back-to-top (m1.json, d1.json):
- After scrolling to 1500, back-to-top is at [330,784,40,40]. document.elementFromPoint at its centre (350,804) is A.cc-btn.cc-dismiss (the Accept button).
- A touch tap there left scrollY at 1500 and changed cookieconsent_status from unset to "dismiss". Only a second tap scrolled to 0.

Dismissal:
- "x" is span.cc-close[role=button], and it sets cookieconsent_status=allow with a 1-year expiry.
- Accept sets dismiss. The banner does not reappear on /about-us/.
- There is no .cc-revoke ('revokable':'0'). The config is type 'info', so the Deny, Save Settings and Technical/Marketing categories it defines are never shown.

Analytics: GA4 /g/collect (tid G-R56NTBBBCB) fires at 0.86–1.08s, before any choice, with gcd=13l3l3l3l1l1, meaning no Consent Mode state is set.

**Fix.** 1. On mobile, use a compact bar of 15% of the viewport or less.
2. Hide or raise .penci-go-to-top-floating while .cc-window is visible (e.g. body.cc-open .penci-go-to-top-floating{bottom:calc(198px + 16px)}), so a back-to-top tap can never land on Accept.
3. Make "x" dismiss without consent, add Reject, and enable revokable.
4. Implement Google Consent Mode v2 defaults (denied) in GTM before GA4 and ads load.

### [medium] Header has no mega menu or occasion links; the Soledad 'Mega Menu' and 'Footer' templates are public, indexable pages

*Verdict: confirmed* · Affected: /, /penci-block/mega-menu/, /penci-block/footer/, /thank-you-messages/, /thankyou-messages/, /archive/

**Evidence.** Header menu:
- 4 top-level items (Home, About Us, What to write in a card, Contact Us); all 4 return 200 and work.
- Every <li> has the class "ajax-mega-menu", but none has a submenu. Hovering each item at 1366px revealed no dropdown or mega-menu panel. There are no "#" dead links in the header.
- No header item leads to an occasion hub (Birthday, Anniversary, etc.). Hubs are reachable only from homepage tiles or from /what-to-write-in-a-card/.

Template pages:
- The Soledad block "Mega Menu" is a live page at /penci-block/mega-menu/: 200, meta robots "index, follow", showing 6 "Five Minutes With Bob" cards (shots/d_penci_block_mega_menu.png).
- /penci-block/footer/ is also a live 200 page.

Conflicting entry points: the homepage "Thank You" tile links to /thank-you-messages/ ("100+ Thank You Messages"), while "Thank You" on /what-to-write-in-a-card/ links to a different page, /thankyou-messages/ ("Heartfelt Thank You Messages, All Occasions").

Footer: only 6 legal links (Terms, Privacy, Cookie, Copyright, Do Not Sell, Opt In), all 200 on www.123greetings.com. There are no social-profile links anywhere on the site (links.json contains no facebook/instagram/pinterest URLs).

Archives: /archive/ ("All Posts – Card Messages & Wishes") has 0 inlinks and lists only Bob diary posts. Its "Load More Posts" button works (9 → 18 posts). Category pagination works (clicking "3" gives "Page 3 of 5" with 20 posts), author page 5 shows only a previous link, and /tag/bob/page/2–5 return 200.
[Verifier] Header menu: all 4 <li> have the class ajax-mega-menu, and hovering each at 1366px showed 0 visible submenus.

Template pages:
- /penci-block/mega-menu/ (body class single-penci-block, postid-1113): 200, robots "index, follow", self-canonical, 6 "Five Minutes With Bob" links.
- /penci-block/footer/ (postid-503): 200, index, follow, showing the 6 legal links.
- sitemap_index.xml lists penci-block-sitemap.xml, which contains both URLs.

Thank You hubs:
- The homepage links to /thank-you-messages/ twice ("100+ Thank You Messages"; inlinks: /, /national-relaxation-day-messages/).
- /what-to-write-in-a-card/ links to /thankyou-messages/ ("Heartfelt Thank You Messages, All Occasions"; its only inlink).

/archive/: 0 inlinks. It lists 9 Bob posts plus a Load More Posts button.

The crawl contains no social-profile links, only WhatsApp share links on posts.

**Fix.** As proposed. For the template pages, go to Yoast > Settings > Content types > Penci Blocks and turn off "Show in search results". This adds noindex and removes penci-block-sitemap.xml.

### [medium] Keyboard users get no visible focus, hit invisible menu links, and cannot open the mobile menu

*Verdict: confirmed* · Affected: /, /birthday-messages-for-mom/, sitewide (all templates)

**Evidence.** Desktop, tabbing from the top of the homepage:
- The order is logo → Home → About Us → What to write in a card → Contact Us.
- Then 5 more stops (logo, HOME, ABOUT US, WHAT TO WRITE IN A CARD, CONTACT US) land inside the closed off-canvas menu #penci_off_canvas, which sits off-screen at x=-310.
- Only after that does focus reach the content ("123Greetings", "Read More", the search box, trending links).

Every focused link had `outline:none` and no box-shadow. In shots/d_home_focus_tab3.png, "About Us" has focus and looks exactly like the other items. There is no skip link.

Mobile menu button: it is `<div class="button-menu-mobile header-builder">` with no role, tabindex, aria-label or aria-expanded, and it measures 24x31px. At mobile widths it cannot be reached or announced by assistive technology.

Other controls:
- Back-to-top is a non-focusable `<div class="penci-go-to-top-floating">`.
- The message copy buttons are `<button class="copy-icon-btn">` with no aria-label. Their only text is a visibility:hidden tooltip, so they have no accessible name. They are 18x22px with outline:none.
- The unused legacy #sidebar-nav contains focusable Facebook/Instagram/Whatsapp links with href="#" and target=_blank.

The hamburger itself works with touch: it opens a 330px panel, locks body scroll, the X closes it, and the About link navigates (shots/m_menu_open.png).
[Verifier] Homepage at 1366px, pressing Tab from the top (d1.json): logo → Home → About Us → What to write in a card → Contact Us. The next 5 stops are inside #penci_off_canvas, off-screen at x=-238/-310 (logo, HOME, ABOUT US, WHAT TO WRITE IN A CARD, CONTACT US). Focus then reaches 123Greetings → Read More → the search input → the trending tags.

All 18 stops computed outline-style none and box-shadow none. There is no skip link.

Other controls:
- Hamburger: div.button-menu-mobile, 24x31px at [356,14], with no tabindex and no role.
- Back-to-top: div.penci-go-to-top-floating.
- Copy buttons: 18x22px, no aria-label, and the tooltip stays visibility:hidden/opacity 0 on focus.
- #sidebar-nav holds 3 href="#" target=_blank links.

**Fix.** As proposed.

### [medium] Mobile jump menu: headings land under the sticky header, and the long menu pushes messages below the fold

*Verdict: confirmed* · Affected: /birthday-messages/, /fathers-day-messages/, /4th-of-july-messages/, /everyday-messages/, /congratulations-messages/, /more-inspiration-messages/, /birthday-messages-for-teacher/, /canada-day-messages/ (+1 more)

**Evidence.** 19 hub pages show a visible jump menu. In the fetched HTML, every one of its anchors points to an id that exists on the page. The menus on /more-inspiration-messages/ are the one case I didn't verify in the browser (see the jump-menu table).

Desktop (1366px) works:
- /birthday-messages/: all 6 items click through, update the URL hash, and land the section at 100px, below the 80px sticky header.
- /fathers-day-messages/: all 16 items do the same.
- The menu stays in view while scrolling.

Mobile (390x844):
- The menu becomes a plain block above the H1 and does not stick.
- On /fathers-day-messages/ it is 603px tall with 17 items. The H1 starts at y=774 and the first message at y=876, so no message is visible on the first screen (shots/m_fathers_day_top.png). 16 of the 17 items are 20px tall, under the 24px minimum target size.
- After tapping "By Milestone" on /birthday-messages/, the section top lands at 34px while the fixed header covers 0–66px, so the heading is cut off (shots/m_birthday_hub_after_jump.png).
- After tapping "Funny Wishes" on /fathers-day-messages/, the section top is again at 34px and the heading is completely hidden (shots/m_fathers_day_after_jump.png).
- The only way back to the menu is the back-to-top button.
[Verifier] Mobile 390x844 (m1.json):
- /fathers-day-messages/: 16 jump links, each 20px tall, in a static list from y=152, 537px tall. The H1 is at 774 and the first message at 876, so no message shows on the first screen.
- Tapping "Funny Wishes" (#fw): the heading sits at 34–61px, while the fixed navbar covers 0–66, so the heading is fully hidden (shots/m_fathers-day-messages_after_jump.png).
- /birthday-messages/, "By Milestone": the target top is at 34 and the heading at 54–73, so it is partly hidden.
- No anchor targets are missing on either page. scroll-padding-top is auto.

Tablet 820x1180 (t1.json): same mobile header, and "Funny Wishes" again lands at 34px under the 66px fixed header.

Desktop 1366: "By Milestone" lands at 100px, below the 80px sticky header, and the menu stays visible.

The mobile landing position (34) is exactly the desktop offset (100) minus the 66px header wrapper that collapses when .penci_navbar_mobile switches to position:fixed (see the layout-shift finding).

**Fix.** 1. Fix the header collapse first: keep a 66px placeholder, or use position:sticky instead of toggling to fixed. The existing scroll offset should then land headings at about 100px on mobile and tablet too.
2. Add scroll-margin-top:80px on the section containers as a fallback for native anchor jumps. html{scroll-padding-top} alone may not help if the theme computes the offset in JavaScript.
3. Below 1025px, collapse the 16-item list into a <details> "Jump to section" control or horizontal chips, with items at least 44px tall.

### [medium] Mobile: content jumps 66px when the header becomes sticky, and injected copy buttons shift text on load

*Verdict: partly-confirmed* · Affected: /birthday-messages-for-mom/, /halloween-messages/, /what-to-write-in-a-card/, /mothers-day-messages-for-wife-what-she-actually-wants/, /contact-us/

**Evidence.** Header jump (mobile, 390x844), measured on /birthday-messages-for-mom/:
- Scrolling from 60px to 70px switches .penci_navbar_mobile from position:static to fixed (adding the class "mobile-sticky").
- Its wrapper collapses from 66px to 0px, and the visible H1's position in the document moves from 121px to 55px. The whole page jumps up 66px.
- Each crossing records a 0.0782 layout shift. Three crossings gave a cumulative layout shift (CLS) of 0.2346 (shots/m_mom_scroll40_before_switch.png vs m_mom_scroll80_after_switch.png).
- The same 0.0782 shift appeared on /halloween-messages/, /what-to-write-in-a-card/, the Mother's Day wife post and /contact-us/, so this is sitewide on mobile.

Copy buttons: the inline "Click to Copy" snippet inserts a <button> before every message at DOMContentLoaded.
- On mobile this shifted text by 0.0823 on /birthday-messages-for-mom/ (at 1.19s) and 0.0411 on /halloween-messages/ (at 1.34s). The sources were div.elementor-text-editor and div.penci-block_content.
- Mobile CLS totals: 0.161 on /birthday-messages-for-mom/, 0.119 on /halloween-messages/, 0.101 on /what-to-write-in-a-card/.

On desktop, the same pages measured 0.003–0.028, because desktop uses a separate sticky clone that slides in. I saw no shifts caused by ads.
[Verifier] Header shift, /birthday-messages-for-mom/ at 390x844:
- .penci_navbar_mobile is static at scrollY 60 and fixed (class mobile-sticky) at 70.
- The wrapper .pc-wrapbuilder-header-inner goes from 66px to 0px, and the H1's document top moves from 121 to 55.
- Each crossing logs a 0.0782 layout shift (source div.elementor-element-9f23a66).
- The post /mothers-day-messages-for-wife-what-she-actually-wants/ gives the same 0.0782 (source div.penci-single-wrapper).

Copy buttons: on the first load, a 0.0823 shift at 1.68s (sources div.elementor-text-editor and div.penci-block_content). On a second load of the same page, the shift before any scroll was 0, so it depends on whether the page paints before DOMContentLoaded.

Under Web Vitals session windows (shifts less than 1s apart, window capped at 5s), a normal visit with one scroll scores about 0.08 (below the 0.1 "good" line). It exceeds 0.1 only if the scroll comes within 1s of the load shift, or the user crosses the 60–70px threshold repeatedly. Severity stays medium because the same collapse causes the jump-menu mis-landing.

**Fix.** 1. Keep the header's 66px space when it goes fixed (placeholder or min-height on .pc-wrapbuilder-header-inner), or use position:sticky.
2. Reserve the copy button's space in CSS with an absolutely positioned button and a fixed left padding on the message block, or output the button server-side.

### [low] /upcoming-events/ is a blank page but is listed in the sitemap

*Verdict: partly-confirmed* · Affected: /upcoming-events/

**Evidence.** The page returns 200 with the title "Upcoming Events". The content container is empty (innerHTML is 6 characters of whitespace), there is no H1, and the body text is only header and footer (259 characters).

What a visitor sees:
- Desktop: the header, then the footer directly underneath at y≈85, then a white screen (shots/d_upcoming_events.png).
- Mobile: the header, the footer, and about 1,300px of white (shots/m_upcoming_events.png).

The page is in the page sitemap and has 0 internal inlinks, so the only way in is from search engines.
[Verifier] Live: 200, title "Upcoming Events - 123Greetings Blog - …", robots "index, follow", self-canonical.
- No H1, #main is empty, word_count 0.
- No meta description.
- Listed in page-sitemap.xml (lastmod 2026-06-19).
- 0 pages in the crawl link to it.

**Fix.** As proposed: either build the list, or unpublish the page, 301 it to /what-to-write-in-a-card/, and let Yoast drop it from page-sitemap.xml.

### [low] A hidden 'Emotions' template block on 138 message pages holds a duplicate H1, empty “” quotes and dead '#' anchors

*Verdict: partly-confirmed* · Affected: /birthday-messages-for-mom/, /be-an-angel-day-messages/, /national-tap-dance-day-messages/, /thank-you-messages/, /at-work-messages/, /belated-anniversary-messages-for-sorry-i-forgot/

**Evidence.** Visitors never see this block. The container (e.g. elementor-element-396920a on /birthday-messages-for-mom/) has elementor-hidden-desktop, elementor-hidden-tablet and elementor-hidden-mobile, and only the mobile and tablet breakpoints are active in the Elementor settings, so it never renders.

In the browser on desktop and mobile, /birthday-messages-for-mom/, /be-an-angel-day-messages/ and /national-tap-dance-day-messages/ each show exactly 1 visible H1 and 0 visible empty “” blocks (shots/d_mom_full.png). 18 of 18 sampled pages were hidden the same way.

The HTML of each of the 138 pages still contains:
- a second H1 (e.g. "Birthday messages, for Mom")
- two empty “” paragraphs
- a one-item "Emotions" jump link that is either href="#" (101 pages) or points to an id that doesn't exist (#n on /be-an-angel-day-messages/ and /thank-you-day-messages/, #fe on /thank-you-messages/, #r on /at-work-messages/, #f on /anniversary-messages-for-friends/)
- placeholder labels such as "abc" (/belated-anniversary-messages-for-sorry-i-forgot/) and "Nostalgic" (/be-an-angel-day-messages/)

The copy-button script also attaches 2 invisible buttons to these empty blocks.
[Verifier] https-only pages.json:
- 133 pages have a hidden H1 (h1_all longer than h1_visible), the hidden "Emotions" side nav, and exactly 2 hidden empty “” message blocks each.
- Hidden nav targets: '#' on 101 pages, '#n' on 29 (label "Nostalgic" on 28), and '#r', '#fe', '#f' on one page each. Placeholder label 'abc' on 4 pages.
- Live HTML of /be-an-angel-day-messages/, /parents-day-messages/ and /thank-you-messages/ has no id="n" or id="fe". Each contains one container with elementor-hidden-desktop, elementor-hidden-tablet and elementor-hidden-mobile.
- In the browser, 9 copy buttons exist on /birthday-messages-for-mom/ and only 7 are visible.

**Fix.** Delete the hidden container. Each message page stores its own Elementor data, so this is a per-page edit on 133 pages (or a scripted edit of _elementor_data) unless the section comes from a saved template or global widget; check that first.

### [low] Contact and comment forms rely on placeholders instead of labels; reCAPTCHA badge hidden without the required notice

*Verdict: confirmed* · Affected: /contact-us/, /mothers-day-messages-for-wife-what-she-actually-wants/

**Evidence.** Contact form (/contact-us/, Contact Form 7):
- The form has `novalidate`. Fields have no <label>, only placeholders ("Name*", "Email*", "Subject", "Your Message"), and "required" is set only via aria-required.
- Validation happens in the browser when a field loses focus. Typing "not-an-email" and tabbing out showed "The e-mail address entered is invalid."; emptying Name showed "The field is required." (shots/d_contact_blur_validation.png).
- Submit was not clicked: the form posts via AJAX, so clicking would send a request.
- The reCAPTCHA v3 badge is present but visibility:hidden, and the page has no "protected by reCAPTCHA / Privacy Policy / Terms" text.

Comment form (#commentform, on all 49 posts):
- A textarea plus Name* and Email* inputs, placeholders only.
- The email field is type="text", and name/email have neither required nor aria-required.
- There is no cookies-consent checkbox. The heading reads "LEAVE A COMMENT" (shots/d_post_comment_form.png, m_post_comment_form.png).
[Verifier] /contact-us/ (form.wpcf7-form, novalidate):
- Name, Email, Subject and Message have placeholders only, and required is set via aria-required.
- The only <label> in the form wraps the hidden Akismet honeypot.
- .grecaptcha-badge computes visibility:hidden, set by `.grecaptcha-badge { visibility: hidden !important; }` in /wp-content/uploads/custom-css-js/1553.css (Simple Custom CSS & JS).
- No "protected by reCAPTCHA" text appears on the page.

#commentform on 3 of 3 posts checked: #email is type="text", and #author/#email have no required or aria-required.

**Fix.** 1. Add labels, type=email, autocomplete and required.
2. Either delete the rule in custom CSS #1553 or add Google's reCAPTCHA disclosure text under the contact form.

### [low] Copy-message button: copies the quote marks, gives no error feedback, and message pages have no share buttons

*Verdict: confirmed* · Affected: /birthday-messages-for-mom/, /mothers-day-messages-for-wife-what-she-actually-wants/

**Evidence.** Copying works both by desktop click and mobile tap: the icon turns into a checkmark with "COPIED" for 2 seconds (shots/d_mom_copy_clicked.png, m_mom_copy_tapped.png).

Issues:
- The clipboard text includes the typographic quotation marks. After clicking copy on the first message, the clipboard read `“Happy birthday to the woman who taught me everything I know, …`, starting with U+201C, so users paste the quote marks into their card.
- The "Copy" tooltip only shows on :hover, not on keyboard focus.
- The snippet calls navigator.clipboard.writeText() without awaiting it or catching errors, so "Copied" shows even if the write fails.
- 9 buttons are created on /birthday-messages-for-mom/ but only 7 are visible; 2 sit inside the hidden template block.
- Message pages have no share buttons.

Posts have a "Share" hover dropdown with only WhatsApp and Copy Link. Copy Link correctly copies the post URL and opens no new tab (shots/d_post_share_hover.png).
[Verifier] Tapping the first visible copy button on /birthday-messages-for-mom/ (mobile, clipboard permission granted) put this on the clipboard: "“Happy birthday to the woman who taught me everything I know, …Love you.”" It starts with U+201C and ends with U+201D.

The inline script calls `navigator.clipboard.writeText(message.innerText);` without await or catch, then swaps in the "Copied" markup regardless of the result.

9 buttons are created and 7 are visible. On focus the tooltip stays hidden. The message page has 0 share links.

**Fix.** As proposed.

### [low] The homepage 'initialise' error comes from the cookie plugin's inline script, which crashes when its library fails to load

*Verdict: confirmed* · Affected: /

**Evidence.** Clean loads: I loaded 22 URLs one at a time on desktop and mobile, with first-party files served through a local cache to avoid rate-limit (429) errors. There were 0 uncaught exceptions. The only console errors came from third parties: "requestStorageAccess: Permission denied." from a third-party iframe, and a 401 on google.com/recaptcha/api2/pat on mobile.

Root cause of the earlier homepage error: the inline script #nsc_bar_nice-cookie-consent_js-js-after runs `window.addEventListener("load",function(){ window.cookieconsent.initialise({...}) })` without checking that the Beautiful Cookie Consent 4.9.2 library, cookieNSCconsent.min.js, actually loaded. In browser.json that file had returned 429.

Reproduced by forcing a 429 for that one file: `TypeError: Cannot read properties of undefined (reading 'initialise') at nsc_bar_nice-cookie-consent_js-js-after:2:66`, window.cookieconsent is undefined, and no consent banner renders.

The same fragility showed during this audit when WordPress.com rate-limited static files while other audit agents shared our IP (25–47 static files returned 429 per homepage load). Missing files cascaded into more unguarded failures:
- "jQuery is not defined"
- "$(...).stickThis is not a function" (_jb_static/??c5f2f102a4:17, when jq-sticky-anything.min.js 429'd)
- "Cannot read properties of undefined (reading 'setLocaleData')" (wp-i18n-js-after)
- "wp is not defined"
- Contact Form 7 index.js: "reading 'i18n'"
- Elementor: "failed to load chunk background-video"

The homepage also assigns `window.onload = function(){…}` to set the search placeholder, which overwrites any other window.onload handler.
[Verifier] The inline script #nsc_bar_nice-cookie-consent_js-js-after is `window.addEventListener("load",function(){ window.cookieconsent.initialise({...})})` with no existence check. It loads cookieNSCconsent.min.js?ver=4.9.2.

With that one file forced to 429 (d1.json cookieFail):
- pageerror "Cannot read properties of undefined (reading 'initialise')"
- typeof window.cookieconsent === 'undefined'
- no .cc-window

Across 19 normal loads (desktop, mobile and tablet), there were 0 uncaught page errors. The only console error was the 401 from google.com/recaptcha/api2/pat. The homepage `window.onload = function(){…}` (search placeholder) is present.

**Fix.** As proposed. Guard with `if (window.cookieconsent && window.cookieconsent.initialise)`, and use addEventListener('load') instead of the window.onload assignment.

### [low] eCard CTAs on 22 message pages go to the old search.123greetings.com CGI instead of the occasion's card category

*Verdict: verifier-found* · Affected: /parents-day-messages/, /be-an-angel-day-messages/, /girlfriends-day-messages/, /hug-your-sweetheart-day-messages/, /true-love-forever-day-messages/, /friendship-week/, /national-coffee-day-messages/, /romance-awareness-month-messages/

**Evidence.** In pages.json (https only), 22 message pages link their card CTAs to https://search.123greetings.com/cgi-bin/search/search.pl?query=…. Some queries are malformed:
- 'romantic%2Becards' (double-encoded)
- 'Romance+Day+' (trailing space)
- '…&srch_button=Sea' (truncated parameter)

The search pages return 200. For example, 'parents day' finds "80 cards found", but the first results are "Send Anniversary Love To Parents!", "It Is A Baby Girl." and "On Diwali... Wish Your Parents!".

Dedicated category pages exist on www (checked live, 200, with occasion-specific titles):
- /events/parents_day/ ("Parents' Day Cards…")
- /events/be_an_angel_day/
- /events/girlfriends_day/
- /events/hug_your_sweetheart_day/
- /events/true_love_forever_day/
- /events/friendship_week/
- /events/national_coffee_day/

Some slugs don't exist: /events/cousins_day/ and /events/senior_citizens_day/ return the generic homepage title, and /events/raksha_bandhan/ is 404.

**Fix.** Where a www.123greetings.com/events/<occasion>/ category exists, link the CTA to it. That applies to at least parents_day, be_an_angel_day, girlfriends_day, hug_your_sweetheart_day, true_love_forever_day, friendship_week and national_coffee_day. Use the search CGI only when no category exists, and then with a clean, correctly encoded query (no %2B, trailing spaces or truncated srch_button parameters).


<details><summary><b>Table: Pages loaded in browser (clean renders): status, uncaught JS errors, measured CLS</b> (26 rows)</summary>

| viewport | url | status | uncaught_js_errors | cls | notes |
|---|---|---|---|---|---|
| desktop | / | 200 | 0 | 0.003 | Google search box present; cookie banner 384x198 bottom-right; 0 console errors |
| desktop | /birthday-messages/ | 200 | 0 | 0.028 | 6/6 jump anchors land at 100px below 80px header |
| desktop | /fathers-day-messages/ | 200 | 0 |  | 16/16 jump anchors OK; CLS polluted by scripted jumps (0.37) |
| desktop | /birthday-messages-for-mom/ | 200 | 0 | 0.009 | 1 visible H1, 0 visible empty quotes, 7/9 copy buttons visible, no eCard link |
| desktop | /be-an-angel-day-messages/ | 200 | 0 | 0.005 | hidden Emotions block not rendered |
| desktop | /national-tap-dance-day-messages/ | 200 | 0 | 0.003 | hidden Emotions block not rendered |
| desktop | /?s=birthday | 200 | 0 | 0.004 | 10 posts, 0 message pages, page 2 exists |
| desktop | /?s=zzqx | 200 | 0 | 0.005 | no search field on empty state |
| desktop | /archive/ | 200 | 0 |  | Load More 9->18, only Bob posts; CLS 0.10 after click |
| desktop | /category/123greetings/ -> page 3 | 200 | 0 | 0.002 | pagination works |
| desktop | /author/iblog123greetingsgmail-com/page/5/ | 200 | 0 | 0.008 | prev link only (last page) |
| desktop | /mothers-day-messages-for-wife-what-she-actually-wants/ | 200 | 0 | 0.007 | 5 CTAs to 404 URL; related = Bob posts; share: WhatsApp + Copy Link |
| desktop | /upcoming-events/ | 200 | 0 | 0.001 | blank content |
| desktop | /this-does-not-exist/ | 404 | 0 | 0.005 | search form + Back to home |
| desktop | /what-to-write-in-a-card/ | 200 | 0 | 0.015 | Google search box; TrueReach overlay hidden |
| desktop | /about-us/, /contact-us/ | 200 | 0 | 0.003 | Contact Form 7 validation on blur works |
| mobile | / | 200 | 0 | 0 | cookie banner 390x198 (23.4%); covers search at y=800 and back-to-top |
| mobile | /birthday-messages/ | 200 | 0 | 0 | nav 258px; jump target top 34px < 66px header |
| mobile | /fathers-day-messages/ | 200 | 0 | 0 | nav 603px/17 items; H1 at 774, first message at 876; items 20px |
| mobile | /birthday-messages-for-mom/ | 200 | 0 | 0.161 | 0.082 copy-button injection + 0.078 header switch; separate scroll probe 0.235 |
| mobile | /halloween-messages/ | 200 | 0 | 0.119 | one 300x250 GPT ad in content; no sticky/interstitial |
| mobile | /what-to-write-in-a-card/ | 200 | 0 | 0.101 | header switch 0.078 |
| mobile | /mothers-day-messages-for-wife-what-she-actually-wants/ | 200 | 0 | 0.078 | header switch |
| mobile | /contact-us/ | 200 | 0 | 0.078 | no labels; no reCAPTCHA notice |
| mobile | /this-does-not-exist/ | 404 | 0 | 0 | search visible |
| mobile | /upcoming-events/ | 200 | 0 | 0 | blank |

</details>


<details><summary><b>Table: Broken or mismatched card links (CTAs)</b> (11 rows)</summary>

| source_page | link_text | target | status | suggested_target |
|---|---|---|---|---|
| 6 Mother's Day posts (32 links) | → Mother's Day messages for your wife / …for mom / …for grandma / …for stepmom / What to write in a Mother's Day card | https://www.123greetings.com/blog/what-to-write-in-a-card | 404 | specific blog.123greetings.com pages; plus 301 www /blog/* -> blog subdomain |
| /sorry-messages-for-coworkers-when-my-coworker-struggled-with-saying-sorry/ | free sorry card collection | https://www.123greetings.com/events/sorry/ | 404 | https://www.123greetings.com/general/sorry/ (200) |
| /love-messages-for-wife-the-thank-you-i-owed-my-wife-for-two-years/; /thank-you-card-messages-when-my-father-in-law-said-the-quiet-thing-out-loud/ | Thank You collection | https://www.123greetings.com/events/thank_you/ | 404 | https://www.123greetings.com/thank_you/ (200) |
| /congratulations-card-messages-when-i-realized-id-quietly-let-an-old-friendship-drift/ | Congratulations card collection | https://www.123greetings.com/events/congratulations/ | 404 | https://www.123greetings.com/congratulations/ (200) |
| /thank-you-card-messages-when-my-father-in-law-said-the-quiet-thing-out-loud/ | Father card collection | https://www.123greetings.com/family/father/ | 404 | a valid father/family category (/family/dad/ also 404) |
| /19th-may-your-week-with-bob/ | Vanilla Pudding Day (May 22) | https://www.123greetings.com/events/national_vanilla_pudding_day/https://www.123greetings.com/events/national_vanilla_pudding_day/ | 404 | https://www.123greetings.com/events/national_vanilla_pudding_day/ (200) |
| /honey-month-messages/ | 123Greetings | https://www.123greetings.com/events/honey-month/ | 404 | /events/honey_month/ also 404 - use a valid category |
| /happiness-happens-day-messages/ | Encouragement Messages | https://blog.123greetings.com/encouragement-inspiration-messages/ | 404 | /inspiration-messages/ or /more-inspiration-messages/ |
| /love-note-day-messages/ | Romantic Card | https://www.123greetings.com/tags/romantic_birthday_cards.html | 200 | love/romance category (currently a birthday category) |
| /sweetest-day-messages/ | Valentine's Day (only card link) | https://www.123greetings.com/events/valentines_day/ | 200 | add https://www.123greetings.com/events/sweetest_day/ (200) |
| /st-francis-day-messages/ | 123Greetings | https://www.123greetings.com/?utm_source=chatgpt.com | 200 | remove chatgpt UTM |

</details>


<details><summary><b>Table: Jump-menu anchor check (visible menus on 19 hubs; hidden Emotions menus sampled)</b> (5 rows)</summary>

| page | items | visible | anchors_resolve | desktop_result | mobile_result |
|---|---|---|---|---|---|
| /birthday-messages/ | 6 | yes | 6/6 | lands at 100px, header 80px - OK | target top 34px under 66px header; nav 258px tall |
| /fathers-day-messages/ | 16 | yes | 16/16 | lands at 100px - OK | target top 34px (heading hidden); nav 603px, H1 at 774px |
| /4th-of-july-messages/, /everyday-messages/, /congratulations-messages/, /canada-day-messages/, /new-baby-messages/, /birthday-messages-for-teacher/, /summer-messages/, /bon-voyage-messages/, /get-well-soon-messages/, /sorry-messages/, /love-messages/, /anniversary-messages/, /more-wedding-messages/, /teachers-day-messages/, /family-messages/, /invitation-messages/ | 2-15 | yes | all resolve (static HTML check) | not individually clicked | same template: expect same header offset issue |
| /more-inspiration-messages/ | 7+7 (two lists) | yes | not verified | not clicked | not tested |
| 138 message pages (sampled 18: e.g. /birthday-messages-for-mom/, /be-an-angel-day-messages/, /national-tap-dance-day-messages/, /thank-you-messages/, /at-work-messages/) | 1 | no (hidden on desktop/tablet/mobile) | href '#' (101 pages) or missing id (#n, #fe, #r, #f) | not visible | not visible |

</details>


<details><summary><b>Table: Message pages without eCard CTA (141)</b> (141 rows)</summary>

| url |
|---|
| /always-live-better-than-yesterday-day-messages/ |
| /anniversary-messages-for-aunt/ |
| /anniversary-messages-for-boss/ |
| /anniversary-messages-for-boyfriend/ |
| /anniversary-messages-for-brother/ |
| /anniversary-messages-for-co-worker/ |
| /anniversary-messages-for-customers/ |
| /anniversary-messages-for-dad/ |
| /anniversary-messages-for-daughter/ |
| /anniversary-messages-for-employee/ |
| /anniversary-messages-for-fiance/ |
| /anniversary-messages-for-fiancee/ |
| /anniversary-messages-for-friends/ |
| /anniversary-messages-for-girlfriend/ |
| /anniversary-messages-for-granddaughter/ |
| /anniversary-messages-for-grandma/ |
| /anniversary-messages-for-grandpa/ |
| /anniversary-messages-for-grandparents/ |
| /anniversary-messages-for-grandson/ |
| /anniversary-messages-for-husband/ |
| /anniversary-messages-for-in-laws/ |
| /anniversary-messages-for-mom/ |
| /anniversary-messages-for-mother-in-law/ |
| /anniversary-messages-for-neighbours/ |
| /anniversary-messages-for-niece/ |
| /anniversary-messages-for-parents/ |
| /anniversary-messages-for-siblings/ |
| /anniversary-messages-for-sister/ |
| /anniversary-messages-for-son/ |
| /anniversary-messages-for-stepmother/ |
| /anniversary-messages-for-uncle/ |
| /anniversary-messages-for-wife/ |
| /april-fools-day-messages/ |
| /at-work-messages/ |
| /belated-anniversary-messages-for-her/ |
| /belated-anniversary-messages-for-him/ |
| /belated-anniversary-messages-for-sorry-i-forgot/ |
| /belated-birthday-messages-for-her/ |
| /belated-birthday-messages-for-him/ |
| /belated-birthday-messages-for-sorry-i-missed/ |
| /birthday-message-for-dad/ |
| /birthday-messages-for-across-the-miles/ |
| /birthday-messages-for-aquarius/ |
| /birthday-messages-for-aries/ |
| /birthday-messages-for-aunt/ |
| /birthday-messages-for-best-friend/ |
| /birthday-messages-for-boss/ |
| /birthday-messages-for-boyfriend/ |
| /birthday-messages-for-brother/ |
| /birthday-messages-for-cancer/ |
| /birthday-messages-for-capricorn/ |
| /birthday-messages-for-co-worker/ |
| /birthday-messages-for-daughter/ |
| /birthday-messages-for-father-in-law/ |
| /birthday-messages-for-gemini/ |
| /birthday-messages-for-girlfriend/ |
| /birthday-messages-for-granddaughter/ |
| /birthday-messages-for-grandma/ |
| /birthday-messages-for-grandpa/ |
| /birthday-messages-for-grandson/ |
| /birthday-messages-for-husband/ |
| /birthday-messages-for-leo/ |
| /birthday-messages-for-libra/ |
| /birthday-messages-for-mom/ |
| /birthday-messages-for-mother-in-law/ |
| /birthday-messages-for-nephew/ |
| /birthday-messages-for-niece/ |
| /birthday-messages-for-pisces/ |
| /birthday-messages-for-sagittarius/ |
| /birthday-messages-for-scorpio/ |
| /birthday-messages-for-sister/ |
| /birthday-messages-for-son/ |
| /birthday-messages-for-stepfather/ |
| /birthday-messages-for-stepmother/ |
| /birthday-messages-for-sweet-16/ |
| /birthday-messages-for-taurus/ |
| /birthday-messages-for-teacher/ |
| /birthday-messages-for-uncle/ |
| /birthday-messages-for-virgo/ |
| /birthday-messages-for-wife/ |
| /bon-voyage-messages/ |
| /business-anniversary-messages/ |
| /company-anniversary-messages/ |
| /congratulations-messages/ |
| /dance-day-messages/ |
| /dating-anniversary-messages/ |
| /earth-day-messages/ |
| /easter-messages/ |
| /engagement-messages/ |
| /everyday-messages/ |
| /fall-messages/ |
| /family-messages/ |
| /friendship-anniversary-messages/ |
| /friendship-messages-for-friends-forever/ |
| /funny-belated-birthday-messages/ |
| /get-well-soon-messages/ |
| /graduation-messages/ |
| /heartfelt-belated-birthday-messages/ |
| /hug-week-messages/ |
| /ice-cream-day-messages/ |
| /international-kissing-day-messages/ |
| /international-yoga-day-messages/ |
| /love-messages/ |
| /messages-for-100th-birthday/ |
| /messages-for-10th-anniversary/ |
| /messages-for-13th-birthday/ |
| /messages-for-15th-anniversary/ |
| /messages-for-18th-birthday/ |
| /messages-for-1st-anniversary/ |
| /messages-for-1st-birthday/ |
| /messages-for-20th-anniversary/ |
| /messages-for-21st-birthday/ |
| /messages-for-25th-anniversary/ |
| /messages-for-30th-anniversary/ |
| /messages-for-30th-birthday/ |
| /messages-for-40th-anniversary/ |
| /messages-for-40th-birthday/ |
| /messages-for-50th-anniversary/ |
| /messages-for-50th-birthday/ |
| /messages-for-5th-anniversary/ |
| /messages-for-60th-anniversary/ |
| /messages-for-60th-birthday/ |
| /messages-for-70th-birthday/ |
| /messages-for-75th-anniversary/ |
| /messages-for-80th-birthday/ |
| /messages-for-90th-birthday/ |
| /more-inspiration-messages/ |
| /mothers-day-messages/ |
| /national-blueberry-pie-day-messages/ |
| /national-childrens-day-messages/ |
| /national-tap-dance-day-messages/ |
| /red-rose-day-messages/ |
| /relationship-anniversary-messages/ |
| /sneak-a-kiss-day-messages/ |
| /sorry-messages/ |
| /spring-messages/ |
| /sympathy-condolences-messages/ |
| /teddy-bear-day-messages/ |
| /thank-you-messages/ |
| /wedding-anniversary-messages/ |
| /work-anniversary-messages/ |

</details>


## Performance

### [high] Message pages load a heavy ad and identity stack (truereach, GPT, Funding Choices, 7 ID-sync vendors) for one ad slot

*Verdict: confirmed* · Affected: /birthday-messages/, /birthday-messages-for-mom/, /mothers-day-messages/, all Elementor message pages (38 of 38 sampled HTML files include truereachAdRender.js; not on home, posts, archive or tag)

**Evidence.** What loads: 1437953666.rsc.cdn77.org/.../truereachAdRender.js (defer, cache max-age=600) injects securepubads gpt.js plus pubads_impl (213 KiB) and Funding Choices (15 requests, 106 KiB). It also pulls identity modules: cdn.id5-sync.com esp.js (35 KiB, 89% unused), static.criteo.net, tags.crwdcntrl.net, connectid.analytics.yahoo.com, dmp.im-apps.net, invstatic101.creativecdn.com (no-cache), esp.rtbhouse.com, and cdn.jsdelivr.net prebid pubcid.

Lighthouse mobile on /mothers-day-messages/:
- 44 ad/ID requests, 565 KiB
- DoubleClick: 436 ms main-thread, 282 ms blocking
- Funding Choices: 767 ms main-thread, 274 ms blocking
- 27 third-party scripts, against 8 on the post, archive and tag pages

Playwright after load and scroll: exactly one GPT slot (div-gpt-ad-1784526288594-0, /22081762831,46400095/123greetings_int). window.pbjs exists but has 0 adUnits.

A/B (mobile, 4x CPU, ad stack blocked) on /mothers-day-messages/:
- requests 125 -> 85
- TaskDuration 7,181 -> 5,240 ms
- ScriptDuration 4,002 -> 2,952 ms
- approx TBT 2,142 -> 1,003 ms

A second consent tool also loads on every page: beautiful-and-responsive-cookie-consent (17 KiB JS + CSS).
[Verifier] Scope:
- truereachAdRender.js appears on every full-width-template message page sampled (38 of 38 in static_html.json, plus /birthday-messages-for-wife/, /what-to-write-in-a-card/ and others). It is absent on home, contact, archive, posts, tag pages and the 404 page.
- pages.json has 254 full-width pages, so roughly 250 URLs are affected, not 38.

Lighthouse:
- 44 ad/ID requests of 553-609 KiB on /birthday-messages/, /birthday-messages-for-mom/ and /mothers-day-messages/, against 0 on the post, archive and tag.

Playwright:
- One GPT slot: div-gpt-ad-1784526288594-0 /22081762831,46400095/123greetings_int, sizes 300x250 to 300x600, getOutOfPage()=false. It is a normal in-page slot, not an interstitial.
- pbjs has 0 adUnits.
- The truereach loader is 23.9 KB gzip with cache-control max-age=600.

My A/B on /mothers-day-messages/ (mobile, 4x CPU; 2 baseline runs vs 1 with the ad stack blocked):

| Metric | Baseline | Ads blocked |
|---|---|---|
| Requests | 125-126 | 85 |
| Ad bytes | 511-593 KiB | 0 |
| ScriptDuration | 3,427 / 3,572 ms | 2,886 ms |
| TaskDuration | 6,213 / 6,615 ms | 4,831 ms |
| TBT (approx.) | 1,718 / 1,871 ms | 962 ms |

**Fix.** The auditor's fix stands, with one change in wording: the slot is an in-page ad, so lazy-load it (googletag.pubads().enableLazyLoad(), or load truereach on first scroll or idle) rather than treating it as an interstitial. Also drop uncontracted ID modules, ask for a longer loader TTL, and use a single CMP.

### [high] Render-blocking CSS: 34-40 stylesheets, a 1.3 MB main.css that is 98% unused, and 96 KB of inline CSS in every HTML page

*Verdict: partly-confirmed* · Affected: sitewide, /, /birthday-messages-for-mom/, /mothers-day-messages-for-wife-what-she-actually-wants/

**Evidence.** Lighthouse mobile:
- 38-44 render-blocking resources per page.
- Estimated savings 2,480 ms (/), 2,850 (/birthday-messages/), 2,550 (mom), 2,700 (mothers-day), 3,120 (post), 2,900 (archive), 1,650 (tag).
- jquery.min.js loads synchronously in <head> (656-954 ms estimated).

main.css (?ver=8.7.6):
- 176.5 KiB Brotli, 1,312 KB decoded, VeryHigh priority.
- Unused-css audit: 98.4% unused. A 352 ms long task is attributed to parsing and styling it on /.

Coverage on /birthday-messages-for-mom/ (Playwright, after full scroll):
- 71 stylesheets, 2,111 KB of CSS decoded, 70 KB used (3.3%).
- 0% used: roboto.css 100 KB, layout-grid 57.6 KB, inter.css 45 KB, robotoslab 23 KB, penci-recipe 22 KB, eicons 22 KB.
- 1% used: two Font Awesome 4 stylesheets, 30 KB (theme) and 28 KB (testimonial-free).

Inline CSS in HTML:
- Every sampled HTML (39 files) carries 95.7-96.4 KB of inline CSS in 29-30 <style> blocks. That is about 53% of a 173-180 KB document.
- Largest blocks: penci-custom-style 25.6 KB, global-styles 19.8 KB, header builder 10 KB, 7 Jetpack Search block styles about 22 KB.

Main-thread 'Style & Layout' is 542-1,434 ms on mobile. On / the LCP 'render delay' phase is 1,412 ms (30% of LCP).
[Verifier] Counts from 12 saved HTML files (home, tag, archive, post, contact, 404, 5 message pages):
- 37-43 <link rel=stylesheet> in <head>, all render-blocking (media all or empty), plus jquery.min.js loaded synchronously in <head>.
- Jetpack Boost concatenates JS (_jb_static) but not CSS.
- Inline CSS is 95.5-102.2 KB in 29-30 <style> blocks, 42-60% of the decoded HTML (the HTML is about 35 KB compressed on the wire). Jetpack Search block inline styles are 14 blocks totalling 28.3 KB.

main.css?ver=8.7.6:
- 180,113 B Brotli, 1,343,673 B decoded, max-age=315360000.
- Lighthouse unused-css reports 98.4% unused on the runs where it loaded (/, mom, mothers-day, post).

Where the auditor's numbers are off:
- Lighthouse 'Style & Layout' is 158-1,434 ms, not 542-1,434 ms.
- The render-blocking savings estimates (1,647-3,122 ms) are indicative only. In the /tag/alps/, /archive/ and /birthday-messages/ runs, main.css, style.css, Elementor frontend.min.css and/or post-8.css returned 429.
- The Playwright coverage figures (71 sheets, 2,111 KB, 3.3% used on the mom page) were measured with assets served from disk, and are valid.

**Fix.** The auditor's steps are fine, with these changes:
- In Elementor 4.x, 'Improved CSS Loading' and 'Inline Font Icons' may already be defaults. Check Elementor > Settings > Features, and turn off 'Load Font Awesome 4 Support' if nothing needs it.
- Enable Jetpack Boost 'Optimize CSS Loading' (critical CSS). Also consider Boost's CSS concatenation to cut the roughly 40 head requests.
- Dequeue unused plugin CSS and the Jetpack Search block styles.

### [high] Uncached HTML takes about 2.3 s to generate, and the edge cache keeps it for only 300 s, so mobile LCP is 3.9-6.8 s

*Verdict: partly-confirmed* · Affected: sitewide (HTML documents, 668 URLs), /, /birthday-messages/, /birthday-messages-for-mom/, /mothers-day-messages/, /mothers-day-messages-for-wife-what-she-actually-wants/, /tag/alps/

**Evidence.** curl samples, sequential with 2.5 s gaps and a Chrome navigation Accept header (script agent-work/performance/ttfb.sh, output ttfb.out). Uncached means a cache-busting ?perfaudit=<random> query string, or the first request after the page sat idle for about 5 minutes.
- 21 MISS responses: server-timing 'cache;desc=MISS;dur=' median 2,283 ms (min 1,905, p90 2,432, max 5,537 on the post). Client TTFB median 2.46 s, max 6.02 s. Header x-nananana: Batcache-Set.
- 15 edge HITs: dur 1-3 ms, TTFB median 169 ms (142-448).
- HTML header is 'cache-control: max-age=300, must-revalidate'. Static assets, by contrast, get max-age=31536000 or 315360000.
- The first request after about 3-7 minutes idle was a full MISS for 5 of 5 URLs: / 2,046 ms, /birthday-messages/ 2,011, /birthday-messages-for-mom/ 2,283, /mothers-day-messages/ 2,296, the post 2,424. /tag/alps/, requested about 3 minutes earlier, was a HIT.
- All 7 Lighthouse mobile runs measured server response 1,873-2,520 ms. LCP breakdown shows TTFB as 38-62% of LCP (/archive/ TTFB 2,407 of 3,856 ms; / 2,483 of 4,632 ms).
- The earlier crawl got x-ac STALE on 507 of 513 HTML responses and a fresh HIT on only 6, so pages are usually expired at the edge between visits.
- Once the HTML was cached, Lighthouse desktop runs measured server response 77-88 ms.
Repro: curl -s -o /dev/null -D - -H 'Accept: text/html' 'https://blog.123greetings.com/tag/alps/?x=123' | grep -i server-timing
[Verifier] Tested with curl, one request at a time with 2.5 s gaps, 12:05-12:30 UTC. Scripts and output are in agent-work/perf-verify/ (probe.sh, probe1.out, devsplit.out, bootstrap.out).

MISS timings:
- 16 MISS samples had server-timing dur 1,732-2,681 ms (median about 2,230) and client TTFB 2.0-2.7 s. An iPad UA took 4.19 s.
- Every page type is similar: tags 2,025-2,382 ms, message pages 1,732-2,681, post 2,318-2,439, 404 page 2,500.

WordPress bootstrap alone, with no theme rendering, costs 930-1,508 ms:
- /robots.txt?pv=<rand>: 1,343, 1,278 and 930 ms
- /wp-json/wp/v2/types?pv=: 1,508 and 1,228 ms
- /wp-json/?pv=: 1,452 ms
- /feed/?pv=: 1,416 ms
So about 55-65% of a page MISS happens before Elementor or Soledad render anything.

The '300 s' framing is wrong:
- After expiry the edge returns x-ac STALE (dur 1-8 ms, TTFB 150-390 ms) and refreshes in the background. /tag/important-decisions/, /tag/michelangelo/ and /belated-birthday-messages-for-her/ were STALE about 17 minutes after caching, and the next request was a HIT with new content.
- The crawl's 662 STALE of 667 200-OK pages had median elapsed 64 ms. That is the fast path, not evidence of slowness.

Causes of MISS I actually observed:
1. Eviction after hours without traffic. Tags that were STALE at the 09:37 crawl were full MISS at 12:05. All 5 upcoming-holiday hubs (/halloween-messages/, /diwali-messages/, /thanksgiving-messages/, /graduation-messages/, /retirement-messages/) were MISS for a mobile UA, and 4 of 5 were also MISS for desktop.
2. A separate edge copy per device class. On /tag/michelangelo/: desktop MISS, then Android MISS (dur 2,051), then iPhone Safari MISS (2,353), then iPad MISS (4.19 s). Other Android and Chrome UAs then got HITs. The desktop and mobile HTML differ only in the off-canvas logo file and the size of the post featured image. This explains why all 7 Lighthouse mobile runs were MISS (1,873-2,520 ms) while the later desktop runs got 77-88 ms.
3. Query strings. ?gclid= and arbitrary parameters cause a full MISS (2,270 ms). All utm_* values share one cached copy. ?fbclid= falls through to Batcache (23 ms).
4. Cookies such as _ga or consent cookies do NOT bypass the cache (HIT).

Other corrections:
- 'cache-control: max-age=300, must-revalidate' appears only on Batcache-Set/Hit responses. Most edge responses carry no Cache-Control at all.
- The LCP figures of 3.9-6.8 s come from Lighthouse runs in which 8-39 first-party assets returned 429 (including main.css on /archive/, /tag/alps/ and /birthday-messages/). Only the TTFB part of those numbers is solid.

**Fix.** 1. Cut WordPress bootstrap time first, since about 1.3 s of the 2.3 s is spent before the template runs.
   - Profile a cache-busted request that doesn't render the theme (/robots.txt?x=1 or a REST call) with Query Monitor.
   - Check the size of autoloaded options (wp option list --autoload=on --format=total_bytes).
   - Look for blocking HTTP API calls on init or plugins_loaded, and confirm the Atomic memcached object cache is being hit.
   - Deactivate plugins that aren't used: penci-recipe, penci-review, testimonial-free, wpforms-form-locker, layout-grid, search-in-place, and sticky-menu-or-anything (desktop only).
2. Then cut template time: turn on Elementor's Element Caching feature and trim per-request query widgets.
3. A longer max-age will not stop eviction of pages that get little traffic. The edge already serves stale copies.
   - Pre-warming would have to cover every device variant, every 1-2 h, so limit it to a few seasonal hubs before holidays.
   - Ask WordPress.com support whether device-class variance can be dropped (the theme is responsive) and whether click IDs such as gclid or msclkid can be ignored in the cache key.

### [high] reCAPTCHA v3 and Contact Form 7 assets load on every page (about 800 KiB and 0.75-1.9 s of main-thread time), but only /contact-us/ has a form

*Verdict: partly-confirmed* · Affected: sitewide (all page types: home, message pages, posts, archive, tag), /, /mothers-day-messages/, /archive/, /tag/alps/, /contact-us/

**Evidence.** Where the assets appear:
- 39 of 39 saved raw HTML pages include google.com/recaptcha/api.js?render=6LeP38UsAAAAABM9MCJQ8nD9Zbb8cqqchMQgKpNL plus 3 CF7 scripts (swv/index.js, includes/js/index.js, modules/recaptcha/index.js) and CF7 styles.css.
- In the crawl, only 1 of 513 200-OK pages contains a .wpcf7 form (/contact-us/).

Cost per page (Lighthouse mobile, all 7 tested pages):
- reCAPTCHA makes 9-12 requests totalling 764-770 KiB, plus 34.6 KiB of Roboto from fonts.gstatic.com pulled by its anchor iframe.
- recaptcha__en.js (347 KiB compressed, 828 KB decoded, 35% used per coverage) downloads twice: once in the page and once in the api2/anchor iframe (partitioned cache).
- That is 45-62% of the bytes Lighthouse recorded: /tag/alps/ 803 of 1,243 KiB, /archive/ 803 of 1,501 KiB, / 804 of 2,001 KiB.
- Main-thread time from reCAPTCHA is 753-1,886 ms per page, with 179-883 ms of it blocking. On / it is the single largest long-task source (541 ms task).

A/B with Playwright (mobile, 4x CPU, same page, CF7 and reCAPTCHA blocked) on /:
- ScriptDuration 2,046 -> 1,020 ms
- TaskDuration 4,388 -> 2,553 ms
- long tasks 17 -> 9
- approx TBT 1,243 -> 642 ms

Same A/B on /mothers-day-messages/: ScriptDuration 4,002 -> 3,189 ms, approx TBT 2,142 -> 1,645 ms.
[Verifier] Where the assets appear:
- recaptcha/api.js?render=6LeP38Us…, CF7 swv/index.js, includes/js/index.js, modules/recaptcha/index.js and CF7 styles.css are in every saved HTML I checked: tag, archive, home, post, message pages, 404 and contact.
- In pages.json, a .wpcf7 form is present only on /contact-us/ (1 of 667 200-OK pages).

Cost in Lighthouse mobile (7 runs):
- 9-12 reCAPTCHA requests, 764-770 KiB, plus 34.6 KiB of Roboto from fonts.gstatic.com.
- recaptcha__en.js is 347 KiB on the wire and 828 KB decoded, and downloads twice (page and anchor iframe).
- The 'Google CDN' entity uses 753-1,886 ms of main thread (179-883 ms blocking).
- As a share of recorded bytes it is 34-65%, not 45-62%, and inflated because 8-39 first-party requests per run were 429s.

My A/B (Playwright, mobile 412x823, 4x CPU, first-party static assets from disk; 2 baseline runs vs 1 run with recaptcha and contact-form-7 blocked):

| Page | Metric | Baseline | Blocked |
|---|---|---|---|
| / | ScriptDuration | 1,981 / 2,089 ms | 1,084 ms |
| / | TaskDuration | 4,206 / 4,341 ms | 2,644 ms |
| / | TBT (approx.) | 906-1,293 ms | 578 ms |
| /tag/alps/ | ScriptDuration | 1,735 / 1,718 ms | 780 ms |
| /tag/alps/ | TaskDuration | 3,118 / 3,513 ms | 1,784 ms |
| /tag/alps/ | TBT (approx.) | 737-1,002 ms | 284 ms |

These are main-frame numbers only. The anchor iframe runs out of process, so the real cost is higher.

**Fix.** 1. Keep the filters: add_filter('wpcf7_load_js','__return_false'); add_filter('wpcf7_load_css','__return_false');
2. In the contact-us template, call wpcf7_enqueue_scripts() and wpcf7_enqueue_styles().
3. CF7 hooks wpcf7_recaptcha_enqueue_scripts to wp_enqueue_scripts at priority 20. A dequeue at priority 20 from an mu-plugin registers earlier and runs BEFORE it, so it does nothing. Use either of these:
   - add_action('wp_enqueue_scripts', function(){ if (!is_page('contact-us')) { wp_dequeue_script('google-recaptcha'); wp_dequeue_script('wpcf7-recaptcha'); } }, 21);
   - On template_redirect: if (!is_page('contact-us')) remove_action('wp_enqueue_scripts','wpcf7_recaptcha_enqueue_scripts',20);
4. Optionally, inject api.js only when the contact form gets focus.

### [medium] Tag, archive, category and author pages lazy-load their LCP image with JavaScript (data-bgset background), so it can't start downloading until the end-of-body scripts run

*Verdict: verifier-found* · Affected: /tag/alps/, /tag/michelangelo/, /archive/, sitewide listing templates: 352 tag pages (347 in the sitemap, all index,follow), 5 category and 5 author archives

**Evidence.** Markup:
- The first grid thumbnail is <a class="penci-lazy penci-image-holder" data-bgset="https://i0.wp.com/…Bob_Img_30th_july_Blog.webp?resize=585%2C574">. It has no src or style URL until Soledad's lazy loader runs, and that loader sits behind 18-19 synchronous first-party scripts at the end of <body>.
- /archive/ has 9 such holders.

Measurements (Playwright mobile, 4x CPU, first-party assets from disk):
- The LCP element is that lazy holder: A.penci-lazy.penci-image-holder.lazyloaded, background Bob_Img_28th_july_Blog.webp.
- On /tag/alps/, FCP 1,148-1,384 ms and LCP 1,776-2,076 ms: a gap of 392-720 ms before any network cost for the scripts.
- On /archive/, FCP 1,216 ms and LCP 1,724 ms.
- On a real mobile network, all the synchronous JS must download before the image request starts.

The auditor flagged only the post template.

**Fix.** Exclude the first 1-2 listing thumbnails from lazy-loading. Use Soledad's lazy-load exclusion option, or add penci-disable-lazy (the class the single-post header already uses) to the first item in the archive loop. Render that item as an <img> with srcset, sizes and fetchpriority="high". Alternatively, print <link rel="preload" as="image" fetchpriority="high"> for the first post's thumbnail in wp_head when is_archive() or is_tag().

### [medium] The post template's LCP image is a CSS background, so the browser can't discover it early (mobile LCP 6.8 s)

*Verdict: confirmed* · Affected: /mothers-day-messages-for-wife-what-she-actually-wants/, likely all 49 posts using the Soledad single-post header (verified on this post)

**Evidence.** The LCP element is span.attachment-penci-full-thumb.penci-single-featured-img, with inline style background-image: url(https://i0.wp.com/.../2026/04/may4th-husband-to-wife.webp?fit=585%2C329&ssl=1) and padding-top: 56.24%. The HTML has no <link rel=preload>.

Lighthouse mobile LCP 6.82 s: TTFB 2,596 ms, load delay 3,343 ms (49%), load 812 ms, render 66 ms.
Lighthouse desktop LCP 1.2 s, with 801 ms of load delay.

The 585 px-wide image fills a 372 CSS-px slot on a 2.625 DPR phone (about 977 device px), so it is also blurry on mobile.
[Verifier] LCP element and markup:
- The Playwright LCP entry is SPAN.attachment-penci-full-thumb.penci-single-featured-img. Its URL is may4th-husband-to-wife.webp?fit=585,329, set in an inline style background-image.
- The same background span appears on 4 of 4 posts checked: the wife post, /wake-up-with-bob-14th-july/, /mothers-day-messages-for-someone-who-lost-their-mom/ and /24th-may-your-weekly-bobcast/.
- No <link rel=preload> exists on any page tested.

Image size:
- The mobile HTML requests fit=585, while the desktop HTML requests fit=1170. Soledad's wp_is_mobile output explains the soft image on 2.625-DPR phones.

**Fix.** Render the featured image as <img> with srcset/sizes, fetchpriority="high" and no lazy-loading. Soledad has single-post header options for this; the span already carries penci-disable-lazy. Alternatively, print <link rel="preload" as="image" imagesrcset=... fetchpriority="high"> for the featured image in wp_head on single posts.

### [medium] Unused JavaScript: Soledad library bundle 88% unused, two Swiper versions, 1st-party JS 75% unused

*Verdict: confirmed* · Affected: /birthday-messages-for-mom/, /mothers-day-messages/, sitewide (theme bundles)

**Evidence.** Playwright JS coverage on /birthday-messages-for-mom/:
- 70 scripts, 3.90 MB decoded, 35% executed.
- First-party: 32 scripts, 1.06 MB, 25% used.
- _jb_static/??43755b75c1 (98 KiB Brotli, 370 KB decoded) is 12% used. It bundles Swiper 11.0.5, Isotope, Jarallax, Magnific Popup, Theia sticky, Slick, imagesLoaded, fitvids, Masonry and a video controller.
- _jb_static/??34692c1620 (47 KiB, 180 KB decoded) is 4% used and carries a second Swiper (8.3.2, from testimonial-free).

Lighthouse bootup on /mothers-day-messages/: jquery.min.js accounts for 1,565 ms of script time (handlers run through jQuery). Most message pages have 20-25 first-party scripts, loaded synchronously at the end of body.

Also loaded everywhere: wp-emoji-release.min.js (5.8 KiB plus 3 KB inline module), wp-polyfill, comment-reply, and sticky-menu-or-anything (a third sticky implementation next to Soledad and Theia).
[Verifier] Bundles:
- _jb_static/??43755b75c1 (99,736 B Brotli, 370,040 B decoded) contains Swiper 11.0.5, Isotope, Jarallax, Magnific Popup, theiaStickySidebar, imagesLoaded, FitVids and Masonry. The 'Slick' match is only Soledad's slick_slider function.
- _jb_static/??34692c1620 (47,021 B, 179,937 B decoded) contains Swiper 8.3.2.
- Tag pages load the equivalent bundle ??4251e2f9f7 (399,501 B decoded, same libraries), so the problem is sitewide.

Script counts: message pages have 20 first-party external scripts, 19 of them synchronous; tag pages have 19 and 18.

Lighthouse bootup on /mothers-day-messages/: jquery.min.js 1,565 ms.

wp-emoji-release.min.js is fetched only when the browser fails the emoji support test (as headless Chrome does), so its real-world cost is smaller than stated.

**Fix.** In Soledad Performance settings, disable the features and libraries the site doesn't use (masonry/isotope, jarallax parallax, magnific lightbox, theia sticky sidebar, slick). Remove testimonial-free if no testimonials render (it adds Swiper 8, FA and fontello). Enable Jetpack Boost 'Defer non-essential JavaScript'. Disable emoji scripts (remove_action('wp_head','print_emoji_detection_script',7)). Remove the sticky-menu plugin if the theme's sticky header is used.

### [medium] Web fonts: 7 text families and 386-549 @font-face rules per page, only 4-10 faces used; theme fonts have no font-display

*Verdict: partly-confirmed* · Affected: sitewide

**Evidence.** Elementor local Google Fonts CSS (render-blocking, font-display: swap):
- roboto.css: 162 faces (weights 100-900 x normal/italic x 9 subsets), 100 KB decoded
- robotoslab.css: 63 faces
- inter.css: 126 faces
- albertsans.css: 36 faces (message pages)

Theme fonts via fonts-api.wp.com: two overlapping stylesheets (Montserrat 300-800 plus italics with 6 subsets, 60 faces; Montserrat and Poppins, 86 faces) plus Oswald 400 (5 faces). None has font-display. Lighthouse flags fonts.wp.com Montserrat/Poppins woff2 as invisible-text risk (475-602 ms each).

Playwright document.fonts: 386-549 FontFace objects declared per page, 4-10 actually loaded. On /mothers-day-messages/ only FontAwesome, Montserrat 600, Poppins 400 and penciicon load. Roboto, Roboto Slab and Oswald are never used on the pages tested. Coverage shows 0% usage of roboto.css, robotoslab.css and inter.css on the mom page.

Icon fonts: three Font Awesome builds (theme FA 4.7 with 75.9 KiB woff2, testimonial-free FA 4.6.3 CSS, Elementor FA5 CSS 57 KB decoded plus fa-regular 13.5 KiB), plus eicons, fontello, swiper-icons and penciicon. penci-icon.min.css lists the TTF before WOFF2, so the 20.5 KiB TTF downloads instead of the 16.9 KiB WOFF2.

Preconnect hints point at fonts.googleapis.com and fonts.gstatic.com, which no page font uses. fonts.wp.com (the woff2 host) gets no hint.

Font swaps cause shifts: Lighthouse desktop mom page 0.0275 + 0.0076 + 0.0006 attributed to 'Web font loaded'.
[Verifier] Confirmed:
- @font-face counts: roboto.css 162, robotoslab 63, inter 126, albertsans 36. All of these already use font-display: swap.
- fonts-api.wp.com stylesheets: 60, 86 and 5 faces, with no font-display.
- Playwright document.fonts: 386-549 FontFace objects declared, 4-10 loaded.
- Preconnects go to fonts.googleapis.com and fonts.gstatic.com. fonts.wp.com gets no hint.

Wrong:
- Roboto 400 and Inter 400/500/600/700 are loaded on /.
- Inter 400 loads on /mothers-day-messages/ and /birthday-messages/.
- Albert Sans 500 loads on /birthday-messages/, and Kristi on /archive/.

What these files actually cost:
- The four Elementor font CSS files are about 5.6 KiB on the wire (roboto.css is 2.5 KiB Brotli). Their cost is 4 extra render-blocking requests and about 190 KB of CSS to parse.

The real costs:
- Poppins (body text) and Montserrat come from fonts-api.wp.com with no font-display. Lighthouse flags 454-514 ms of invisible text for each woff2.
- Icon fonts: FontAwesome 4.7 woff2 (75.9 KiB) loads on every page, FA5 solid woff2 (78 KB, font-display: block) loads on /birthday-messages/, and penciicon.ttf (20.5 KiB) is picked because the TTF is listed first.
- The shift that Lighthouse attributes to fonts.gstatic.com Roboto is likely mis-attributed. That font loads inside the reCAPTCHA iframe, and that run had 15 first-party 429s.

**Fix.** 1. Consolidate the families rather than deleting them.
   - Set Elementor Site Settings > Global Fonts to the theme's Poppins and Montserrat, so the Elementor kit (post-8.css) stops requesting Roboto and Roboto Slab.
   - Move the few widgets that use Inter, Albert Sans or Kristi to those families, or keep a single weight of each.
   - 'Google Fonts Load = Swap' is already in effect and changes nothing.
2. Add &display=swap to the penci-fonts-css and penci-header-builder-fonts-css URLs, via a style_loader_src filter or Soledad's font setting. Merge the two Montserrat requests into one.
3. Preconnect to fonts.wp.com.
4. Keep one icon font. Reorder the penciicon src list so woff2 comes first.

### [low] Homepage loads Google Programmable Search (CSE) upfront, and every page carries Jetpack Search CSS

*Verdict: partly-confirmed* · Affected: /

**Evidence.** Lighthouse mobile on /:
- cse.google.com/cse.js, cse_element__en.js (127 KiB, 55% unused), adsense/search/async-ads.js (45 KiB, 73% unused), default_v6 CSS and more: 7 requests, 195 KiB.
- 426 ms main-thread, 112 ms blocking.
- Pulls adtrafficquality/sodar (about 23 KiB).
- The CSE widget holds the deepest DOM on the page (depth 25, nested tables).

Every page also inlines 7 Jetpack Search block styles, about 22 KB.
[Verifier] CSE (cse.js?cx=b765cee8c32e74217 with div.gcse-search) is on / and also on /what-to-write-in-a-card/.

Lighthouse mobile on /:
- 7 CSE requests, about 197 KiB (cse_element__en.js 126.9 KiB, async-ads.js 45 KiB).
- 5 more requests to adtrafficquality/sodar, about 23 KiB.
- 'Other Google APIs/SDKs': 426 ms main-thread, 112 ms blocking.

Jetpack Search inline styles are 14 <style> blocks totalling 28.3 KB on every page (not 7 blocks and 22 KB), plus the linked jetpack-search results-list.css.

**Fix.** Load CSE only when the search box gets focus or is clicked, or use the site's own search. Dequeue Jetpack Search block styles if Jetpack Search isn't used.

### [low] Layout shifts: the sticky mobile header shifts content by 0.08 on first scroll on every page, and the logo has empty width/height

*Verdict: partly-confirmed* · Affected: sitewide (sticky header, 7 of 7 tested pages), /birthday-messages/, /archive/, /tag/alps/, /

**Evidence.** Sticky header (Playwright mobile 412x823, probe_cls.mjs):
- On / and /tag/alps/, a layout-shift entry of 0.0802 (hadRecentInput=false) fires at scrollY=67.
- Its sources are DIV.container (rect y 65 -> 0), DIV.container.penci-breadcrumb and SECTION.penci-section. The 66 px header DIV.penci_mobile_midbar.sticky-enable drops out of flow without a placeholder.
- The same 0.08 shift appeared during scrolling on all 7 pages in the inventory pass.
- Real-user CLS counts scroll-triggered shifts, because scrolling is not input.

Logo: img.penci-mainlogo has width="" and height="" with CSS width/height auto and max-width 280px. On /birthday-messages/, Lighthouse mobile CLS is 0.136, of which 0.132 is a shift of div.container-single-page caused by this image ('Media element lacking an explicit size').

Lighthouse load-only CLS: /archive/ 0.156, /tag/alps/ 0.156, /birthday-messages/ 0.136, / desktop 0.094 (hero plus font swaps). Adding the 0.08 scroll shift puts most pages above the 0.1 'good' threshold.
[Verifier] Scroll shift (Playwright mobile 412x823, verify.mjs, runs.jsonl):
- A 0.0802 shift at scrollY=69, hadRecentInput=false, appears on 6 of 6 pages: /, /tag/alps/, /archive/, /birthday-messages/, /mothers-day-messages/ and the post.
- On /tag/alps/, the sources are DIV.container (y 63 -> 0), .penci-breadcrumb and SECTION.penci-section.
- The cause is Soledad's .penci_mobile_midbar.sticky-enable. The sticky-anything plugin is limited to min width 768 px, so it isn't involved on mobile.

Load CLS with all CSS present:

| Page | Load CLS |
|---|---|
| / | 0.0001 |
| /tag/alps/ | 0.008 |
| /archive/ | 0.012 |
| /birthday-messages/ | 0.022 |
| post | 0.033 |
| /mothers-day-messages/ | 0.051 (message-text blocks; the shift persists with ads blocked) |

The Lighthouse values of 0.136 and 0.156 came from runs where main.css and style.css returned 429. The unstyled page showed the 280x96 desktop logo on mobile.

Logo test (logo_delay.mjs): with the logo delayed by 3 s, it caused only a 0.0087 shift on mobile and 0.0142 on desktop (horizontal nav reflow). CSS already fixes its height at 45, 50 or 60 px.

**Fix.** Reserve the header's height when it becomes fixed. Either give the mobile header wrapper min-height: 66px (the mobile header height), or use position: sticky. Adding width="700" height="240" to the logo is a small, low-value tidy-up.

### [low] Oversized logo (2 copies) and a 37 KB JPEG favicon at high priority on every page

*Verdict: confirmed* · Affected: sitewide

**Evidence.** The logo /wp-content/uploads/2026/04/123greetings.webp (39.7 KB, 700x240) comes straight from origin, not Photon, with no srcset. It appears twice in the header and renders at 131-146 CSS px wide on mobile (Lighthouse layout: 280 px), about 1.8-2x larger than needed at DPR 2.625.

cropped-favicon.jpg is a 37.2 KiB JPEG fetched at High priority on every uncached visit.

Apart from these, images are in good shape:
- 60-140 KiB of images per page
- 3,440 of 3,731 crawled image references are WebP
- the homepage hero uses loading=eager, fetchpriority=high and width/height
- Photon serves WebP with a 2-year cache
[Verifier] Logo:
- 123greetings.webp is 700x240 and 39,748 B.
- It is referenced by 4 img.penci-mainlogo tags with width="" and height="", plus a fifth lazy off-canvas logo. Because they share one URL, it downloads once.
- It renders at 131x45 and 146x50 CSS px on mobile and 175x60 on desktop. A 2.625-DPR phone needs about 384 px.

Favicon:
- cropped-favicon.jpg is a 512x512 JPEG of 37,527 B.
- The same file is used for sizes=32x32, sizes=192x192 and apple-touch-icon.

**Fix.** Export the logo at about 300x103 (about 2x rendered size) or serve it through Photon with srcset. Add width/height (see the CLS finding). Replace the favicon with a 32/48 px PNG or ICO under 5 KB, plus an SVG icon.

### [low] The WP.com edge returned 429 for about a third of first-party assets on a single isolated page load. This invalidates this audit's Lighthouse numbers and should be checked for crawlers.

*Verdict: verifier-found* · Affected: /tag/alps/, all Lighthouse runs in agent-work/performance/*.json

**Evidence.** The auditor's Lighthouse JSONs:
- Every run has 8-39 first-party requests with status 429. Examples: tag-mobile 39 (main.css, style.css, Elementor frontend.min.css, post-8.css, jquery.min.js); bdaymsgs-mobile 34; archive-mobile 21; post-mobile 20.
- mothersday-mobile-no3p failed outright: ERRORED_DOCUMENT_REQUEST 429.

My re-test:
- One page load of /tag/alps/ at about 12:27 UTC (probe429.mjs, no other crawler running in this container) got 19 of 61 first-party responses as 429.
- Server was nginx, server-timing 'a8c-cdn … cache;desc=BYPASS', body '429 Too Many Requests'. The first 429 came 1.8 s after navigation start.

The cause is most likely a rate limit on the sandbox's shared egress IP, not something real visitors would hit. I could not confirm that either way.

Each first view makes about 61-75 first-party requests: 37-43 CSS files, about 20 JS files, plus fonts and images.

**Fix.** 1. Treat the Lighthouse-derived LCP, CLS and savings figures as indicative. Re-run from a clean IP or PageSpeed Insights (the anonymous PSI quota was exhausted during this audit).
2. In Search Console > Settings > Crawl stats > By response, check whether Googlebot receives 429s for CSS or JS. If it does, raise it with WordPress.com support.
3. Reduce per-page first-party requests by dequeuing unused plugin CSS and JS and enabling Jetpack Boost CSS concatenation.

### [low] Three analytics beacons: GA4 gtag.js (173 KiB), Jetpack Stats and WP.com bilmur

*Verdict: confirmed* · Affected: sitewide

**Evidence.** www.googletagmanager.com/gtag/js?id=G-R56NTBBBCB is 173 KiB compressed and 517 KB decoded (49% used). Lighthouse mobile: 278-577 ms main-thread and 147-418 ms blocking per page (/archive/ 577/418, / 545/394).

stats.wp.com e-202640.js, s0.wp.com bilmur.min.js and pixel.wp.com are cheap together: 3 requests, 7.8 KiB, under 3 ms blocking.

**Fix.** Delay gtag until after load or idle (or load through the consent tool once consent is given). Configure GA4 so it doesn't also run enhanced-measurement features the site doesn't use. Keep Jetpack Stats only if it's used.


<details><summary><b>Table: Lighthouse 12 results (mobile = simulated Moto G Power, Slow 4G, 4x CPU; desktop preset)</b> (10 rows)</summary>

| page | form factor | perf score | FCP s | LCP s | TBT ms | CLS | Speed Index s | server response ms | requests | transfer KiB (raw / corrected for 429s) | DOM elements | render-blocking resources |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| / | mobile | 41 | 4.3 | 4.6 | 1455 | 0.038 | 9.1 | 2301 | 116 | 2001 / >=2251 | 455 | 44 |
| /birthday-messages/ | mobile | 44 | 3.9 | 4.5 | 830 | 0.136 | 8.9 | 2006 | 131 | 2045 / >=2405 | 801 | 42 |
| /birthday-messages-for-mom/ | mobile | 47 | 4 | 4 | 1168 | 0.025 | 8.8 | 1873 | 134 | 2207 / >=2575 | 364 | 40 |
| /mothers-day-messages/ | mobile | 47 | 4.1 | 4.1 | 1034 | 0.058 | 10.5 | 2520 | 136 | 2371 / >=2449 | 616 | 40 |
| /mothers-day-messages-for-wife-what-she-actually-wants/ | mobile | 48 | 4.6 | 6.8 | 442 | 0.038 | 9.4 | 2234 | 91 | 1768 / >=1923 | 486 | 39 |
| /archive/ | mobile | 53 | 3.9 | 3.9 | 517 | 0.156 | 8.1 | 2215 | 85 | 1501 / >=1817 | 389 | 38 |
| /tag/alps/ | mobile | 65 | 2.5 | 2.6 | 632 | 0.156 | 6.8 | 1899 | 85 | 1243 / >=1790 | 339 | 39 |
| / | desktop | 88 | 1.3 | 1.4 | 0 | 0.094 | 1.9 | 77 | 107 | 1886 / >=2099 | 447 | 44 |
| /birthday-messages-for-mom/ | desktop | 86 | 1.3 | 1.3 | 77 | 0.037 | 2.6 | 80 | 136 | 2308 / >=2541 | 364 | 40 |
| /mothers-day-messages-for-wife-what-she-actually-wants/ | desktop | 88 | 1 | 1.2 | 167 | 0.06 | 1.8 | 88 | 88 | 1795 / >=1900 | 459 | 39 |

</details>


<details><summary><b>Table: TTFB: cached vs uncached (curl, mobile UA, Chrome Accept header, 2.5 s between requests)</b> (2 rows)</summary>

| condition | samples | server-timing dur median ms | min ms | p90 ms | max ms | client TTFB median ms |
|---|---|---|---|---|---|---|
| edge MISS (cache-busted query or first hit after ~5 min idle) | 21 | 2283 | 1905 | 2432 | 5537 | 2465 |
| edge HIT | 15 | 2 | 1 | 2 | 3 | 169 |

</details>


<details><summary><b>Table: Third-party / component cost per page (Lighthouse mobile)</b> (6 rows)</summary>

| component | pages | requests | transfer KiB | main-thread ms | blocking ms |
|---|---|---|---|---|---|
| reCAPTCHA v3 (+ Roboto via its iframe) | all 7 tested | 9-12 (+1) | 764-770 (+34.6) | 753-1886 | 179-883 |
| Contact Form 7 JS+CSS | all 7 tested | 4 | 2-10 | small | small |
| Ad stack: truereach, GPT, Funding Choices, ID vendors | message pages | 44 on /mothers-day-messages/ | 565 | ~1,200 (DoubleClick 436 + Funding Choices 767) | ~556 |
| GA4 gtag.js | all | 1 | 173 | 278-577 | 147-418 |
| Google CSE | home only | 7 | 195 | 426 | 112 |
| Jetpack Stats + bilmur + pixel | all | 3 | 7.8 | ~20 | <3 |

</details>


<details><summary><b>Table: Font inventory (per page)</b> (3 rows)</summary>

| source | families / faces declared | font-display | actually used (document.fonts loaded) |
|---|---|---|---|
| Elementor local Google Fonts (4 render-blocking CSS) | Roboto 162, Roboto Slab 63, Inter 126, Albert Sans 36 | swap | Inter 400-700 on home; Albert Sans 500 on /birthday-messages/; Roboto 400 on home only |
| fonts-api.wp.com (theme) | Montserrat 60+50 (2 overlapping CSS), Poppins 36, Oswald 5 | none | Montserrat 600 (+500 on post), Poppins 400 (+500/700/italics on post) |
| Icon fonts | FA 4.7 (theme), FA 4.6.3 (testimonial-free), FA5 Elementor, eicons, fontello, penciicon, swiper-icons | mixed | FontAwesome 4, penciicon (TTF instead of woff2), FA5 400/900 on some pages |

</details>


<details><summary><b>Table: A/B main-thread cost (Playwright, mobile 412x823, 4x CPU, first-party assets from disk cache, single runs)</b> (5 rows)</summary>

| page | condition | ScriptDuration ms | TaskDuration ms | long tasks | approx TBT ms | requests |
|---|---|---|---|---|---|---|
| / | baseline | 2046 | 4388 | 17 | 1243 | 109 |
| / | reCAPTCHA + CF7 blocked | 1020 | 2553 | 9 | 642 | 107 |
| /mothers-day-messages/ | baseline | 4002 | 7181 | 16 | 2142 | 125 |
| /mothers-day-messages/ | reCAPTCHA + CF7 blocked | 3189 | 6213 | 13 | 1645 | 126 |
| /mothers-day-messages/ | ad and ID stack blocked | 2952 | 5240 | 16 | 1003 | 85 |

</details>


<details><summary><b>Table: Top fixes ranked by impact</b> (7 rows)</summary>

| rank | fix | main metric improved | estimated gain |
|---|---|---|---|
| 1 | Cut uncached PHP render time (about 2.3 s) and lengthen or warm HTML edge caching (max-age=300 today) | TTFB / FCP / LCP | ~2 s on every edge-expired page view |
| 2 | Load reCAPTCHA + CF7 only on /contact-us/ | bytes / TBT / INP | -800 KiB, -0.75 to 1.9 s main thread on 667 of 668 URLs |
| 3 | Critical CSS plus removing unused plugin/theme CSS (main.css 1.3 MB, 98% unused; 34-40 stylesheets) | FCP / LCP render delay | Lighthouse estimates 1.65-3.1 s |
| 4 | Delay truereach/GPT/Funding Choices and drop ID-sync vendors | TBT / INP | -40 requests, -565 KiB, ~-1 s TBT on message pages |
| 5 | Font diet: drop unused families and subsets, add font-display to theme fonts, one icon set | FCP / CLS | -4 render-blocking CSS files, no invisible text |
| 6 | Fix sticky-header and logo CLS; make the post hero an <img> with fetchpriority | CLS / LCP (posts) | -0.08 to 0.13 CLS; about -3 s LCP load delay on posts (mobile) |
| 7 | Trim JS bundles (Soledad libs 12% used, duplicate Swiper), defer jQuery, lazy-load CSE, delay gtag | TBT | several hundred ms of main-thread time |

</details>


## Technical SEO

### [high] 124 message pages promise a number of messages in the title and meta description ('500+', '115+', '75+'); none delivers it and 119 have fewer than half

*Verdict: confirmed* · Affected: /birthday-messages/, /anniversary-messages/, /engagement-messages/, /easter-messages/, /messages-for-5th-anniversary/, /birthday-messages-for-wife/, /anniversary-messages-for-brother/, /birthday-messages-for-mom/ (+2 more)

**Evidence.** 124 pages have 'N+' in the <title>. I counted quoted messages (“...”, at least 15 characters) in the main content. The median claim is 55 messages; the median found is 6. 0 pages meet their claim and 119 have fewer than half. Examples (claim / messages found / words): /birthday-messages/ 500+ / 0 / 189; /anniversary-messages/ 250+ / 0 / 135; /engagement-messages/ 100+ / 1 / 45; /messages-for-5th-anniversary/ 50+ / 1 / 30; /easter-messages/ 75+ / 2 / 31; /birthday-messages-for-wife/ 150+ / 4; /anniversary-messages-for-brother/ 100+ / 3; /birthday-messages-for-mom/ 115+ / 7 (its meta description also says 'Browse 115+'). This is not hidden JavaScript content: rendered in Chromium after networkidle and a full scroll, /easter-messages/ shows 26 words and 2 messages and /birthday-messages-for-mom/ shows 292 words and 7 messages, the same as the raw HTML. Only 5 pages come near their claim: /4th-of-july-messages/ 77/100, /congratulations-messages/ 62/75, /more-inspiration-messages/ 60/80, /summer-messages/ 39/50, /anniversary-messages-for-customers/ 21/40. Script: s5_h1.py and render_check.mjs.
[Verifier] 87 pages (not 89) have fewer than 10 messages. One post also over-promises: /mothers-day-wishes-for-stepmom-50-heartfelt-card-messages/ claims 50+ and has 10. The hub /anniversary-messages/ (250+) is defensible as an aggregate: the 52 child pages it links hold 406 messages in total. So it's a weaker example than the hubs below, even though the page itself shows 0. /birthday-messages/ (500+) is not defensible: its 57 linked child pages hold 361 messages in total.

**Fix.** Until the messages are added, remove the counts from titles and meta descriptions or change them to the real number. Title and snippet claims the page doesn't meet raise bounce-back to search results and fall under Google's helpful-content and misleading-snippet guidance. Longer term, fill the 89 pages that have fewer than 10 messages. Content reviewers are covering the thinness itself; this finding is about the SERP promise.

### [high] All 49 blog posts and every archive can't be reached by following links from the home page; search engines can only find them through the sitemap

*Verdict: confirmed* · Affected: /, /archive/, /mothers-day-messages-for-mom-what-to-write-when-she-saved-it-all/, /heartfelt-mothers-day-messages-that-prove-you-were-paying-attention/, /what-to-write-in-a-mothers-day-card-shell-actually-keep/, /birthday-card-messages-when-my-brother-and-i-stopped-talking-about-things-that-mattered/, /13th-july-your-weekly-bobcast/, /five-minutes-with-bob-27th-july/ (+4 more)

**Evidence.** A breadth-first search over every <a href> in pages.json, starting at https://blog.123greetings.com/, reaches 244 of the 660 crawled URLs. Unreachable: all 49 posts, 352 tag archives, 5 category, 5 author and 2 penci-block URLs, plus /archive/, /at-work-messages/ and /upcoming-events/. Live check: the raw home HTML has 0 hrefs to any post slug and 0 to /archive/, /category/, /author/ or /tag/. The home page rendered in Chromium (1366px, every nav item hovered, scrolled to the bottom) has 31 unique links (23 internal) and 0 go to posts or archives. The header nav is only Home, About Us, What to write in a card and Contact Us. /what-to-write-in-a-card/ and all 247 pages link to 0 posts inside their content. Posts link only to each other (related posts) and to the author archive. The category archive is linked only from its own pages 2-5. /archive/, the one page that lists posts, has 0 inlinks. Script: agent-work/seo/s15_reach.py and home_links.mjs.
[Verifier] Same as the auditor's, with one addition. /archive/ exposes only 9 of the 49 posts in HTML. It uses Soledad's penci-latest-posts widget with a 'LOAD MORE POSTS' button (<a class="penci-ajax-more-button" href="#" data-number="9" data-offset="9">). The next posts arrive only through a JS POST to /wp-admin/admin-ajax.php (action=penci_more_post_ajax). I verified this in Chromium: 9 post links before the click and 18 after. /category/123greetings/ has real /page/2/../page/5/ links.

**Fix.** The nav link should go to /category/123greetings/ (renamed, e.g. 'Stories'), which has crawlable paginated links. If you point it at /archive/ instead, change the penci-latest-posts widget's pagination from 'Load More Posts' to numbered page navigation; otherwise crawlers see only 9 posts. Elementor Pro is not active (no elementor-pro assets on /, /archive/ or /birthday-messages-for-mom/), so the Elementor 'Posts'/'Loop Grid' widgets aren't available. Use Soledad's 'Penci Latest Posts' widget, already used on /archive/, for a 'Latest from Bob' block on the home page and the hub. Keep the page<->post cross-links as proposed.

### [medium] /archive/ shows only 9 of the 49 posts to crawlers; the rest load only through a JavaScript 'Load More Posts' button

*Verdict: verifier-found* · Affected: /archive/, /category/123greetings/

**Evidence.** The raw HTML of /archive/ contains 9 post links (five-minutes-with-bob-2nd-august through wake-up-with-bob-25th-july) and <a class="penci-ajax-more-button" href="#" data-number="9" data-offset="9" data-query=…>LOAD MORE POSTS</a> from Soledad's penci-latest-posts Elementor widget. No /page/2/ link exists. In Chromium: 9 post links before clicking. After the click, the page sent POST https://blog.123greetings.com/wp-admin/admin-ajax.php (action=penci_more_post_ajax, posts_per_page=9) and showed 18. Crawlers don't click buttons or send POSTs, so posts 10-49 can't be reached from /archive/ even if it gets linked. The auditor recommends /archive/ as the nav target in two findings. By contrast, /category/123greetings/ has real <a href> pagination to /page/2/, /page/3/ and /page/5/, with 10 posts per page.

**Fix.** In the Elementor editor for /archive/, set the Penci Latest Posts widget's pagination to numbered page navigation instead of 'Load More Posts'. Alternatively, use /category/123greetings/ (renamed, with a description) as the linked post archive and noindex /archive/, or 301 it to the category. Then confirm with a raw-HTML fetch that all 49 posts can be reached through <a href> links.

### [medium] 12 in-post links point to #anchors that don't exist on /what-to-write-in-a-card/, so specific anchors like 'Birthday messages for brothers' land on the top of the generic hub

*Verdict: verifier-found* · Affected: /mothers-day-messages-for-mom-what-to-write-when-she-saved-it-all/, /mothers-day-card-ideas-12-things-my-mom-used-to-say-that-finally-make-sense-now/, /graduation-card-messages-when-my-dad-struggled-with-saying-he-was-proud-of-me/, /love-messages-for-wife-the-thank-you-i-owed-my-wife-for-two-years/, /birthday-card-messages-when-my-brother-and-i-stopped-talking-about-things-that-mattered/, /congratulations-card-messages-when-i-realized-id-quietly-let-an-old-friendship-drift/, /what-to-write-in-a-card/

**Evidence.** The two Mother's Day posts each link to /what-to-write-in-a-card/#mdmmSec ('→ What to write in a Mother’s Day card'), #hmdmSec ('→ Heartfelt Mother’s Day messages for mom'), #fmdmSec ('→ Funny Mother’s Day messages') and #smsmSec ('→ Short Mother’s Day wishes'). The graduation post links to #gmp ('→ Graduation messages from parents'), the love-for-wife post to #awwSec ('→ Anniversary messages for wife'), the brother post to #bdayBroSec ('→ Birthday messages for brothers') and the congratulations post to #tymSec ('→ Thinking-of-you messages for friends'). The live raw HTML of /what-to-write-in-a-card/ has 0 occurrences of any of these ids. The links are still present when the post is rendered in Chromium. These fragment links, plus plain hub links, are the only in-content links from posts to pages: 47 links from 12 posts, all to the generic hub. Meanwhile the specific target pages exist and return 200: /mothers-day-messages/, /anniversary-messages-for-wife/, /birthday-messages-for-brother/, /graduation-messages/, /friendship-messages/. By contrast, the fragments #gm, #hagd and #tou on /everyday-messages/ do exist. The ids look copied from the old www.123greetings.com/blog/what-to-write-in-a-card page, which is the dead target in the broken-links finding. Script: agent-work/seo-verify/ (fragment check inline).

**Fix.** Edit the 6 posts and point each anchor at its specific page: the 8 Mother's Day links -> /mothers-day-messages/ (or the matching Mother's Day posts); '→ Graduation messages from parents' -> /graduation-messages/; '→ Anniversary messages for wife' -> /anniversary-messages-for-wife/; '→ Birthday messages for brothers' -> /birthday-messages-for-brother/; '→ Thinking-of-you messages for friends' -> /friendship-messages/ (or a real thinking-of-you page). This also supplies the page<->post cross-links recommended in the discoverability and dead-end findings. Add fragment targets to the pre-publish link check.

### [medium] 3 orphan pages sit in the sitemap with no internal links; /upcoming-events/ is an empty indexable page

*Verdict: confirmed* · Affected: /upcoming-events/, /archive/, /at-work-messages/

**Evidence.** No crawled page links to these three (after normalising http/https and trailing slashes); the live home page, /what-to-write-in-a-card/, /birthday-messages/ and /anniversary-messages/ contain none of their slugs. /upcoming-events/ (lastmod 2026-06-19): 0 content words, no H1, no meta description, no og:image, title 'Upcoming Events - 123Greetings Blog - Free eCards…'. Rendered in Chromium, it shows only nav and footer (58 words). /archive/ ('All Posts – Card Messages & Wishes | 123Greetings Blog', H1 'Our Archive') is the only page that lists the 49 posts, yet nothing links to it. /at-work-messages/ ('50+ Workplace Messages — Professional Wishes for Colleagues', 188 words, 2 messages) isn't linked from /what-to-write-in-a-card/ or any hub. The earlier analyze.py count of 8 orphans also included 5 pages whose only link is the http:// one from the hub (see the link-hygiene finding).

**Fix.** Linking /archive/ exposes only 9 posts to crawlers: its penci-latest-posts widget uses an AJAX 'LOAD MORE POSTS' button (href="#") for the other 40. Either switch that widget's pagination to numbered links, or link /category/123greetings/, which has real /page/N/ links. Link /at-work-messages/ from the hub. Build out, unpublish or noindex /upcoming-events/.

### [medium] Broken outbound links to www.123greetings.com: 7 dead URLs, 39 links on 12 pages, 32 of them in 6 Mother's Day posts

*Verdict: partly-confirmed* · Affected: /mothers-day-messages-for-wife-what-she-actually-wants/, /mothers-day-messages-for-someone-who-lost-their-mom/, /mothers-day-messages-for-mother-in-law-what-to-write/, /happy-mothers-day-2026-messages-what-to-write-in-the-card/, /mothers-day-card-messages-for-grandma-funny-heartfelt/, /mothers-day-wishes-for-stepmom-50-heartfelt-card-messages/, /sorry-messages-for-coworkers-when-my-coworker-struggled-with-saying-sorry/, /love-messages-for-wife-the-thank-you-i-owed-my-wife-for-two-years/ (+4 more)

**Evidence.** Each target was re-requested live today, one at a time, and every one returned 404 with the title '404 - Page not found! - 123Greetings'. (1) https://www.123greetings.com/blog/what-to-write-in-a-card has 32 links from 6 posts (the first 6 URLs listed). Anchors: '→ Heartfelt Mother’s Day messages for mom' x5, '→ What to write in a Mother’s Day card' x5, '→ Mother’s Day messages for your wife' x4, '→ Mother’s Day messages for grandma' x4, '→ Mother’s Day messages for stepmom' x4, '→ Funny Mother’s Day messages for mom' x3, and once each: '→ Funny Mother’s Day messages', '→ Mother’s Day messages for mom', '→ Thinking of you messages', '→ Sympathy cards and messages', '→ What to say to someone grieving', '→ Heartfelt messages for hard days', 'library of message ideas organized by relationship and mood'. These anchors describe blog pages that exist, but every one points to the same dead URL on the main site. (2) /events/sorry/ ('free sorry card collection', sorry-messages-for-coworkers post). (3) /events/thank_you/ ('Thank You collection', love-messages-for-wife and thank-you-card-messages posts). (4) /events/congratulations/ ('Congratulations card collection', congratulations-card-messages post). (5) https://www.123greetings.com/events/national_vanilla_pudding_day/https://www.123greetings.com/events/national_vanilla_pudding_day/, a URL pasted twice ('Vanilla Pudding Day (May 22)', /19th-may-your-week-with-bob/). (6) /family/father/ ('Father card collection', thank-you-card-messages post). (7) /events/honey-month/ ('123Greetings', /honey-month-messages/). Working replacements checked live (200): https://www.123greetings.com/sorry/, /thank_you/, /congratulations/, /events/national_vanilla_pudding_day/, /events/national_honey_month/, /family/.
[Verifier] Reproduced exactly (agent-work/seo-verify/v2_broken.py, v2b.py): 39 links on 12 pages to 7 URLs, all 404 live on 2026-09-30.

**Fix.** The auditor's fix is correct. Also fix the related broken #anchors in 6 other posts (see the missed finding).

### [medium] Duplicate titles and H1s: 20 'Bob' diary posts share two titles, 23 posts share two H1s, and the tag and category '123greetings' archives share a title

*Verdict: confirmed* · Affected: /wake-up-with-bob-14th-july/, /wake-up-with-bob-15th-july/, /wake-up-with-bob-26th-july/, /five-minutes-with-bob/, /five-minutes-with-bob-13th-july/, /five-minutes-with-bob-27th-july/, /five-minutes-with-bob-31st-july/, /tag/123greetings/ (+1 more)

**Evidence.** The exact <title> 'Wake Up With Bob - 123Greetings Blog - Free eCards…' is used by 13 posts: /wake-up-with-bob-14th-july/ through /wake-up-with-bob-26th-july/. 'Five Minutes With Bob - 123Greetings Blog…' is used by 7 posts: /five-minutes-with-bob/, -13th-july, -27th-july, -28th-july, -29th-july, -30th-july, -31st-july. '123greetings Archives - …' is used by /tag/123greetings/ and /category/123greetings/. The H1 'Wake Up With Bob' appears on 13 posts and 'Five Minutes With Bob' on 10: the 7 above plus -11th-july, -1st-august and -2nd-august, which do have distinct titles ('A Couple of Minutes | Five Minutes With Bob', 'Aunt Helen's 50th Birthday | …', 'An Unusual Luxury | …'). The meta descriptions of these posts are unique, so Google can't tell the pages apart from the title and H1 alone, and none of them targets a query.

**Fix.** Give each diary post a descriptive, searchable title and H1 and keep the series name as a kicker, following the pattern the 1st and 2nd August posts already use. Examples: 'Why Listening Twice as Much Matters | Five Minutes With Bob' for /five-minutes-with-bob/, and 'The Promotion I Didn't Get | Wake Up With Bob' for 16 July. Rename the category (see the tag-archive finding) so its title no longer equals the tag's.

### [medium] H1 problems: 133 pages have a second, hidden H1 (85 of them with a stray comma), one post has two visible H1s, one page has none, and the home and hub H1s carry no keywords

*Verdict: confirmed* · Affected: /birthday-messages-for-mom/, /anniversary-messages-for-brother/, /messages-for-75th-anniversary/, /belated-birthday-messages-for-sorry-i-missed/, /easter-messages/, /19th-may-your-week-with-bob/, /upcoming-events/, / (+4 more)

**Evidence.** 133 of 296 content pages have 2 H1s in the HTML. The first sits inside an Elementor section with elementor-hidden-desktop, -tablet and -mobile together, so no visitor sees it, but crawlers read it. Together with a hidden H2 and empty quote marks “”, this block becomes the first text of the page and of the theme's JSON-LD description. In 85 of those pages the hidden H1 has a stray comma: 'Birthday messages, for Mom', 'Messages, for 75th Anniversary', 'Anniversary messages, for Brother'. /belated-birthday-messages-for-sorry-i-missed/ has hidden 'Birthday messages, for Sorry I Missed' and visible 'Belated Birthday messages for Sorry I Missed'. /19th-may-your-week-with-bob/ has two visible H1s: '19th May: Your Week With Bob' and 'Congratulations Princess Marcus'. /upcoming-events/ has no H1. The home page H1 is a 158-character sentence: 'The message you write on a card is often the icing on the cake. A beautiful card captures the moment, but the words inside make it truly personal and memorable.' The main hub's H1 is 'Every relationship is worthy of a special message', which doesn't contain 'what to write in a card'. Awkward visible H1s: 'Just Because day Messages', 'Always Live Better than yesterday Day Messages', 'Belated anniversary messages for Sorry I Forgot', 'Birthday messages for Across the Miles', 'Thankyou Messages', 'Invitation: Thankyou Messages', 'More inspiration Messages', 'Ice-cream Day Messages'. 67 page H1s use 'X messages for Y' and 143 use 'X Messages'.
[Verifier] The home H1 is 160 characters, not 158. Everything else reproduced.

**Fix.** Delete the hidden-everywhere template section from the 133 pages. It is a leftover of the Elementor template; the hidden-block report lists all of them. Or change its heading tags to div/p if it has to stay. Remove the second H1 on /19th-may-your-week-with-bob/ (make it an H2). Home: make the H1 'Card Messages & What to Write in a Card' and turn the sentence into a paragraph. /what-to-write-in-a-card/: H1 'What to Write in a Card: Messages for Every Relationship'. Normalise H1 casing to title case and rewrite the 'for Sorry I Forgot' / 'for Across the Miles' H1s as natural phrases ('Belated Anniversary Messages: Sorry I Forgot', 'Long-Distance Birthday Messages').

### [medium] Message pages are dead ends: 267 of 296 content pages have no in-content link to another page or post, and 215 pages have exactly one inlink, from their hub

*Verdict: confirmed* · Affected: /birthday-messages-for-mom/, /birthday-messages-for-aquarius/, /anniversary-messages-for-dad/, /messages-for-40th-birthday/, /birthday-messages/, /anniversary-messages/, /what-to-write-in-a-card/

**Evidence.** The site is a 2-level tree: home and nav -> /what-to-write-in-a-card/ (111 unique internal targets) -> category hubs (/birthday-messages/ links 57 of 58 birthday pages; /anniversary-messages/ links 52 of 52 anniversary pages; /thankyou-messages/, /friendship-messages/, /wedding-messages/, /inspiration-messages/) -> leaf pages. 215 pages get exactly one link from any page or post: 93 only from /what-to-write-in-a-card/, 52 only from /anniversary-messages/, 51 only from /birthday-messages/. 267 content pages (230 pages, 37 posts) have no in-content link to another page or post. /birthday-messages-for-mom/'s only in-content links are '' ('Emotions') and '#' ('For Mom'), both hidden. The leaves don't link back to their hub, to siblings (mom -> dad -> grandma) or to related occasions. The nav only offers Home, About Us, What to write in a card and Contact Us. There is no visible breadcrumb on pages (only on posts and archives), and the schema breadcrumbs skip the hub. Median inlinks per content page: 1. Click depth is still shallow (207 pages at depth 2, 14 at depth 3), so the issue is weak link equity and no topical clustering, not depth.

**Fix.** The goal is right, but Elementor Pro doesn't appear to be active: no elementor-pro assets load, and the widgets in use are free Elementor plus penci-*. So 'Elementor Loop Grid filtered by parent' isn't available without buying Pro. Options: add a static 'More birthday messages' Icon List or Text block to each message template (it can be a global widget, so one edit updates every page), or use Soledad's penci widgets. Add the visible breadcrumb with the [wpseo_breadcrumb] shortcode in an Elementor Shortcode widget. Also repoint the posts' 47 in-content links from the generic hub to the specific pages (see the missed #anchor finding).

### [medium] Share and preview images are broken: 152 pages use a 16x16 arrow icon as og:image, 92 pages have none, and only 3 of 247 pages have a real image

*Verdict: confirmed* · Affected: /birthday-messages/, /anniversary-messages/, /birthday-messages-for-mom/, /easter-messages/, /national-best-friends-day-messages/, /what-to-write-in-a-card/, /halloween-messages/, /wedding-messages/ (+4 more)

**Evidence.** og:image on the 247 pages: 152 use arrow-rm9xyqqs6f0h111j0ry2vfvif7n1swqtzuohoasof4.png, which I fetched and measured at 16x16 px, 396 bytes. That is below Facebook's 200x200 minimum, so WhatsApp, Facebook and Pinterest shares show no preview image. 92 pages have no og:image, including the hub /what-to-write-in-a-card/ and seasonal pages due now (halloween, thanksgiving-day, veterans-day, columbus-day, day-of-the-dead, sweetest-day, bosss-day). Only /, /about-us/ (Blog-About.webp) and /contact-us/ (email-2.png icon) have real images. All 49 posts have proper 1200-1500px images. twitter:card is 'summary_large_image' on every page, with no twitter:image (it falls back to og:image) and no twitter:site. og:site_name is the 91-character tagline. Tag, category and penci-block pages have no og:image or og:description.
[Verifier] Only 2 pages have a usable share image. /contact-us/'s email-2.png is a 64x64 icon, also below Facebook's 200x200 minimum; only / (Happy_faces.webp, 1080x1080) and /about-us/ (Blog-About.webp, 512x512) are usable. The penci-block pages DO have og:description (the mega-menu demo text), but they have no og:image. Also note: Yoast's Site image fallback applies only when no image is found in the content. It won't replace the arrow on the 152 pages until the arrow <img> is removed or a featured image is set, as the fix already says.

**Fix.** Upload a 1200x630 share image for each hub and seasonal page, or at least one branded default, and set it in Yoast > Settings > Site basics > Site image (the default og:image). Set a Featured Image on each page; Yoast prefers it over the first content image. Stop Yoast from picking the arrow by making the arrows CSS/SVG icons rather than <img> (see the images finding). Optionally set the X/Twitter username in Yoast > Site representation. Check afterwards with the Facebook Sharing Debugger on /birthday-messages/.

### [medium] Tag archives are thin, duplicate and orphaned (347 indexable, 317 with a single post, 345 with no internal link), and 739 empty tags return 200 'index'

*Verdict: confirmed* · Affected: /tag/alps/, /tag/anonymous/, /tag/apartment/, /tag/bought/, /tag/astonishing/, /tag/23/, /tag/12-dates-in-1-day/, /tag/123greetings/ (+2 more)

**Evidence.** 347 tag archives are indexable and in the sitemap. The median is 18 words of main text and the maximum is 21. 317 tags (91%) have exactly 1 post, and those 317 pages show only 43 distinct listings: up to 17 tag pages show the identical single-post teaser (for example /tag/anonymous/, /tag/apartment/, /tag/butterflies/, /tag/dependable/, /tag/effortlessly/, /tag/genuine/ ...). 345 of the 347 have 0 inlinks; posts don't display their tags (0 post->tag links in the crawl). The only linked ones are /tag/123greetings/ and /tag/bob/, from their own pagination. Junk and near-duplicate tags: 'bought', 'blurry', 'brief', 'capable', 'astonishing', '23', 'bank accountrelationships'; anthropologist/anthropologists, friendship/friendships, mothers-day-card/mothers-day-cards, neighbour/neighbours, stranger/strangers. 1,086 tags exist and 739 have 0 posts. A live check of /tag/12-dates-in-1-day/ (0 posts) returns 200, robots 'index, follow', a self-canonical and only the text 'Tag: 12 Dates in 1 Day'. /tag/123greetings/ and /category/123greetings/ share the identical title '123greetings Archives - 123Greetings Blog - Free eCards…'. Author archive = category archive (same 49 posts on pages 1-5), and /tag/bob/ (44 posts, 5 pages) duplicates both.
[Verifier] Add /category/uncategorized/: it has 0 posts per /wp-json/wp/v2/categories, yet returns 200 with 'index, follow' and a self-canonical (live).

**Fix.** Do NOT run 'wp term delete post_tag $(wp term list post_tag --count=0 --field=term_id)'. wp term list passes --<field> filters to get_terms(), where 'count' means 'return a count' and does not filter by post count. Because WP-CLI defaults hide_empty to false, that command lists every tag and so deletes all 1,086, including the 347 in use. Filter explicitly instead: wp term list post_tag --fields=term_id,count --format=csv | awk -F, 'NR>1 && $2==0 {print $1}' | xargs -r wp term delete post_tag (dry-run it first without the delete). Or use Posts > Tags sorted by Count with bulk delete. Keep the rest of the fix: noindex tags in Yoast, merge the near-duplicate tags, and rename or describe the category.

### [medium] The Soledad theme outputs a second, invalid set of JSON-LD on every page: lowercase 'organization' type, a duplicate WebSite, and a WebPage/BlogPosting with junk description, placeholder image, the wrong author and an invalid 'datemodified'

*Verdict: confirmed* · Affected: /, /birthday-messages-for-mom/, /birthday-messages/, /national-best-friends-day-messages/, /about-us/, /mothers-day-messages-for-mom-what-to-write-when-she-saved-it-all/, /13th-july-your-weekly-bobcast/, /penci-block/mega-menu/

**Evidence.** I validated 22 sampled URLs live with s13_sample.py; the results are in sample_live.json. Every page has 3 or 4 JSON-LD blocks: the Yoast @graph plus theme blocks without a class. pages.json confirms the pattern on all 660 URLs. (1) {"@type":"organization","@id":"#organization"}: 'organization' is not a schema.org type (types are case-sensitive) and the @id is relative. Present on 660/660. (2) A second, unlinked WebSite entity whose alternateName is 'Card Messages &amp; Wishes for Every Occasion.' (literal &amp;). (3) On the 246 non-home pages, an extra WebPage. Its description is the raw text excerpt, which on the 133 pages with hidden template blocks starts with hidden text, for example /birthday-messages-for-mom/: 'Emotions For Mom Birthday messages, for Mom “” For Mom “” Birthday messages for Mom…' and /birthday-messages/: 'Birthdays For Her For Him For Anyone By Milestone Zodiac…'. Its image is the theme placeholder wp-content/themes/soledad/images/no-image.jpg. Its author is {"name":"Andrea gomes","url":"/author/blog123greetings/"}, an author archive that is noindex and has 0 posts. It also uses the invalid property 'datemodified' (lowercase). (4) On all 49 posts, a duplicate BlogPosting next to Yoast's Article, with 'datemodified' earlier than datePublished: /13th-july-your-weekly-bobcast/ published 2026-07-12T15:30:18+05:30 but 'datemodified' 2026-07-11T18:16:46+05:30; /mothers-day-messages-for-mom-.../ 2026-05-01 vs 2026-04-30. For the same reason, Yoast omits dateModified on 33 of 49 posts (the posts were edited before their scheduled publish time). (5) The penci-block templates carry a BlogPosting dated 2022-07-26/27. No blocks failed JSON parsing. There is no FAQPage anywhere.

**Fix.** Keep Yoast as the only schema source. Turn off Soledad's schema output: Customizer > General > 'Disable Schema Markup' / the penci schema options. If no toggle covers every block, dequeue it in a child theme; the blocks are printed in wp_head without a class, so find the Soledad function that echoes '"@type": "organization"' and remove_action it. Then re-test /, one message page and one post in the Rich Results Test and the Schema Markup Validator; expect a single @graph with WebPage/Article, BreadcrumbList, WebSite, Organization and Person.

### [medium] The XML sitemaps are 54% templates and thin archives: 2 penci-block template posts, the author archive, the category and 347 tag archives

*Verdict: confirmed* · Affected: /sitemap_index.xml, /penci-block-sitemap.xml, /penci-block/footer/, /penci-block/mega-menu/, /author-sitemap.xml, /author/iblog123greetingsgmail-com/, /post_tag-sitemap.xml, /category-sitemap.xml (+1 more)

**Evidence.** sitemap_index.xml (fetched live) lists 6 child sitemaps with 647 URLs: post 49, page 247, penci-block 2, category 1, post_tag 347, author 1. 351 of the 647 (54%) are not content. The penci-block entries are theme template posts (Soledad header/footer blocks). They return 200 with robots 'index, follow', a self-canonical and no H1. /penci-block/footer/ has 26 words of footer text. /penci-block/mega-menu/ has og:description 'How To Cook And Bake With Kitchen Scraps July 25, 2022 11 Ways to Upcycle Food Scraps…', leftover demo content, and theme JSON-LD BlogPosting datePublished 2022-07-27. The author archive in the author sitemap lists exactly the same posts as /category/123greetings/ on all 5 pages (compared set by set). Of the 347 tags, 317 have 1 post, 16 have 2 and only 14 have 3 or more. The page sitemap also contains /upcoming-events/, an empty page (0 content words; rendered in Chromium it shows only the nav and footer). The page sitemap has 287 <image:loc> entries and 280 of them are the same 16x16 arrow icon, arrow-rm9xyqqs6f0h111j0ry2vfvif7n1swqtzuohoasof4.png. Nothing noindexed or non-canonical is in the sitemaps, and no indexable page or post is missing. lastmod matches JSON-LD dateModified on 647/647 URLs.

**Fix.** In Yoast > Settings > Content types, set 'Penci Block' 'Show in search results' to Off (this removes the sitemap and adds noindex). In Yoast > Settings > Advanced > Author archives, disable them or set them to noindex (single author, duplicate of the category). In Yoast > Settings > Taxonomies > Tags, set 'Show in search results' to Off. Remove the 280 arrow images from the page sitemap by making the arrow a CSS icon rather than an <img> (see the images finding). Unpublish /upcoming-events/ or give it content. Resubmit sitemap_index.xml in Search Console.

### [medium] The Yoast schema graph has no Organization or publisher, WebSite.name is the 91-character tagline with a literal '&amp;', and primaryImageOfPage is a 16px arrow on 152 pages

*Verdict: confirmed* · Affected: /, /birthday-messages-for-mom/, /mothers-day-messages-for-mom-what-to-write-when-she-saved-it-all/

**Evidence.** The Yoast @graph on the home page is WebPage, ImageObject, BreadcrumbList and WebSite, with no Organization node. On posts, Article has an author (Person 'Bob' with only name and url) but no publisher, and WebSite has no publisher either. WebSite.name is '123Greetings Blog - Free eCards, Card Message Ideas &amp; What to Write in Any Greeting Card', which contains the literal characters '&amp;'. Google reads WebSite.name for the site name shown in results. On 152 message pages, WebPage.primaryImageOfPage and thumbnailUrl point to https://blog.123greetings.com/wp-content/uploads/elementor/thumbs/arrow-rm9xyqqs6f0h111j0ry2vfvif7n1swqtzuohoasof4.png, which I measured at 16x16 px and 396 bytes. BreadcrumbList on every message page is flat (Home > page name) with no hub level. /birthday-messages-for-mom/ is 'Home > Birthday Messages for Mom', not Home > Birthday Messages > For Mom.
[Verifier] The site name is 88 characters, 92 with '&amp;'. Everything else reproduced.

**Fix.** In Yoast > Settings > Site representation, choose Organization, name '123Greetings', logo (at least 112x112, the 123greetings logo), and sameAs profiles (Facebook, Instagram, Pinterest, the www.123greetings.com site). In Settings > General, set Site Title to '123Greetings Blog' and Yoast 'Website name' to '123Greetings Blog' with alternate name '123Greetings'. This removes the '&' so no entity is stored. Set a default featured image per page (fixes primaryImageOfPage; see the Open Graph finding). Make the message pages children of their hubs (Page Attributes > Parent), or use Yoast breadcrumb settings, so the breadcrumbs gain the hub level. Changing the parent changes URLs unless the permalink structure keeps slugs flat, so test on staging first, or add the breadcrumb level with the wpseo_breadcrumb_links filter instead.

### [medium] The site title is the 91-character tagline, so 412 titles end in ' - 123Greetings Blog - Free eCards, Card Message Ideas & What to Write in Any Greeting Card' (up to 179 characters)

*Verdict: confirmed* · Affected: /birthday-card-messages-when-my-brother-and-i-stopped-talking-about-things-that-mattered/, /congratulations-card-messages-when-i-realized-id-quietly-let-an-old-friendship-drift/, /13th-july-your-weekly-bobcast/, /wake-up-with-bob-17th-july/, /upcoming-events/, /inspiration-messages/, /tag/alps/, /category/123greetings/ (+2 more)

**Evidence.** 407 titles end with that exact suffix: 46 of 49 posts, all 352 tag pages, 5 category pages, 2 pages (/upcoming-events/, /inspiration-messages/) and 2 penci-block templates. The 5 author pages use 'Bob, Author at 123Greetings Blog - Free eCards, Card Message Ideas & What to Write in Any Greeting Card', up to 117 characters with '- Page 5 of 5'. 420 of 660 titles are longer than 60 characters. The longest are posts: 179 characters for /birthday-card-messages-when-my-brother-.../ and 177 for /congratulations-card-messages-when-i-realized-.../. The suffix is Yoast's %%sitename%%, so the WordPress Site Title is the whole tagline. The same string is WebSite.name, og:site_name and the 404 page title. The 245 pages with custom Yoast titles avoid it, which creates the brand inconsistency covered in the title-formatting finding.
[Verifier] The site name is 88 characters (91 including ' - '). 407 titles end with the suffix and 5 more (the author archives) contain it: 412 in total.

**Fix.** Settings > General: set Site Title to '123Greetings Blog' and Tagline to 'Card Messages & Wishes for Every Occasion'. Yoast > Settings > Content types > Posts: set the SEO title template to '%%title%% %%sep%% %%sitename%%' with the separator '|' or '–'. Give the 3 posts that already have custom titles a consistent pattern too. Titles then become, for example, 'Mother’s Day Messages for Mom: What to Write When She Saved It All | 123Greetings Blog' (84 characters; shorten post titles to about 55 characters where possible).

### [medium] Weak trust (E-E-A-T) signals: the author is a first-name-only persona with no bio, the About page names no people or editorial process, and Contact is just an email

*Verdict: confirmed* · Affected: /about-us/, /contact-us/, /author/iblog123greetingsgmail-com/, /birthday-messages-for-mom/

**Evidence.** Posts are first-person diaries by 'Bob' (byline 'by Bob'; twitter:data1 'Bob'). There is no author box on posts and the author page has 0 bio words. /about-us/ (343 words) describes the service and history ('helping people convey the right emotion since 1997') and quotes 4 customer-support testimonials (Mary Donaldson, Gladys Wares, Fran Lucas, Myrtle Marie Charanza), but it doesn't say who writes or reviews the messages, doesn't mention Bob, has no editorial or AI-use policy, and its only links go to https://www.123greetings.com/. Its meta description is truncated mid-thought: 'Since 1997, 123Greetings has helped millions find the right words to express.' /contact-us/ (86 words) offers only a CF7 form and bob@123greetings-inc.com, with no company name, address or link to corporate contact. Its meta description is garbled: 'Drop us a line every post on this blog exists.' The 247 message pages show no author, reviewer or date. The only Organization markup is the invalid theme block (the Yoast graph has none). 7 links carry utm_source=chatgpt.com, which exposes AI-assisted drafting.

**Fix.** Add an author box (Soledad: Customizer > Single Post > Show author box) with Bob's real role, a photo and a 2-3 sentence bio, or clearly frame 'Bob' as a brand columnist written by a named team. Rewrite /about-us/ with the editorial team, how messages are written and reviewed, a publishing and AI policy, the link to the parent company, and Organization schema with sameAs (see the Yoast finding). Add 'Written by / Reviewed by' and a last-updated date to message page templates. Fix the two meta descriptions: About ('…find the right words to express themselves.') and Contact ('…Drop us a line—every post on this blog exists because someone asked.').

### [low] 100 pages have visible FAQ accordions (503 Q&As) but no FAQPage markup

*Verdict: confirmed* · Affected: /national-best-friends-day-messages/, /4th-of-july-messages/, /fathers-day-messages/, /canada-day-messages/, /halloween-messages/, /thanksgiving-day-messages/, /bosss-day-messages/, /be-an-angel-day-messages/ (+2 more)

**Evidence.** 100 unique https URLs (107 crawl records including 7 http:// duplicates) have Elementor accordions (details.e-n-accordion-item) holding 503 question/answer pairs, for example /national-best-friends-day-messages/ with 17 ('When is National Best Friends Day 2026?' …). None of the 660 pages has FAQPage, Question or Answer in its JSON-LD. /wedding-messages-for-the-groom/ repeats the same question twice ('What is a short wedding wish for the groom?'). Since August 2023 Google shows FAQ rich results only for authoritative government and health sites, so markup won't bring SERP accordions here. It still helps Bing and AI answer engines.

**Fix.** The Yoast FAQ block works only in the block editor, not on Elementor pages. Elementor's accordion 'FAQ Schema' switch prints its own standalone JSON-LD and can't be merged into Yoast's @graph. If markup is wanted, use the Elementor switch and accept a separate block, or add the markup with the wpseo_schema_graph filter in a small plugin or child theme. Remove the duplicate groom question either way.

### [low] Images: 280 decorative arrow icons carry alt='arrow' and no dimensions, post hero images are CSS backgrounds with no alt, and one image has no alt

*Verdict: confirmed* · Affected: /birthday-messages-for-mom/, /4th-of-july-messages/, /contact-us/, /mothers-day-messages-for-mom-what-to-write-when-she-saved-it-all/, /five-minutes-with-bob-27th-july/, /

**Evidence.** On content pages there are 288 in-content <img> but only 9 distinct files. 280 are i0.wp.com/.../uploads/2026/04/arrow.png?fit=16%2C16 with alt='arrow' and no width/height, on 152 pages. The same arrow's Elementor thumbnail becomes og:image and the sitemap image. /contact-us/ email-2.png has no alt attribute and no dimensions. Home date badges have inconsistent alts ('02 Oct', '4th Oct', '11 oct', '31oct'). Post hero images are rendered as <span class="penci-single-featured-img" style="background-image:url(...May-1st.webp...)">. This is the case on all 4 posts I checked live (bg_featured=true) and the Soledad single template is the same for every post, so Google Images can't index the hero image and the alt/caption in the media library ('A small burgundy velvet pouch sits on a messy, sunlit bed…') never reaches the page. The images are otherwise not oversized: the largest is Happy_faces.webp on the home page at 195 KB. Two posts use 'Untitled-design-9.webp' / 'Untitled-design-10.webp' as their share image filenames.
[Verifier] Content pages (pages and posts) have 297 in-content <img> using 18 distinct files (296 and 17 for pages only), not 288 and 9. Doesn't change the finding.

**Fix.** Replace the arrow <img> in the Elementor message template with a CSS or SVG icon, or give it alt='' and width/height=16. Add alt text to email-2.png (or alt='' if decorative). In Soledad Customizer > Single Post, switch the featured-image style to one that outputs <img> (not 'penci-header-text-white' background), or add the image to the post body. Use descriptive filenames when uploading.

### [low] Inconsistent URL slugs: singular 'message', 'thankyou' vs 'thank-you', a 'bosss' typo, missing '-messages', and date-slugs that don't match publish dates

*Verdict: partly-confirmed* · Affected: /birthday-message-for-dad/, /bosss-day-messages/, /friendship-week/, /just-because-day/, /working-parents-day/, /thankyou-messages/, /birthday-thankyou-messages/, /anniversary-messages-for-neighbours/ (+4 more)

**Evidence.** Of 247 page slugs: /birthday-message-for-dad/ is singular while the 57 other birthday pages use 'birthday-messages-for-…' (the hub links it twice). /bosss-day-messages/ has a triple 's'. 7 slugs use 'thankyou' (thankyou-, birthday-thankyou-, love-thankyou-, dailies-thankyou-, colleagues-thankyou-, invitation-thankyou-, congratulations-thankyou-messages) against 3 with 'thank-you'. /friendship-week/, /just-because-day/ and /working-parents-day/ lack the '-messages' suffix used by about 150 '-day-messages' pages. Milestones use the reversed pattern messages-for-40th-birthday while others use birthday-messages-for-X. Non-descriptive 'more-' slugs: more-inspiration-messages, more-wedding-messages. /anniversary-messages-for-neighbours/ uses British spelling while titles and other pages use US English. Post slugs mix '-your-weekly-bobcast', '-your-week-with-bob' and an undated '/five-minutes-with-bob/'. Slug dates don't match publish dates: /13th-july-your-weekly-bobcast/ was published 2026-07-12, /15th-june-…/ 06-14, /22nd-june-…/ 06-21, /29th-june-…/ 06-28, /6th-july-…/ 07-05. Mixed-case and slash-less variants are handled correctly (/Birthday-Messages-For-Mom/ is 200 with canonical to lowercase; the slash-less form 301s).
[Verifier] 39 page slugs use 'birthday-messages-for-' (not 57), and 67 slugs end in '-day-messages' (not about 150).

**Fix.** Rename only where it pays off, and always with a 301 plus an update of internal links: /bosss-day-messages/ -> /bosses-day-messages/, /birthday-message-for-dad/ -> /birthday-messages-for-dad/, the 7 'thankyou' slugs -> 'thank-you'. Leave the other existing slugs alone but set a slug convention for new pages ('<occasion>-messages[-for-<recipient>]', US spelling, no 'more-'). Undated, descriptive slugs suit evergreen posts better than dates.

### [low] Internal link hygiene: 1 internal 404, 7 http:// links and 1 slash-less link on the main hub, and 7 links tagged utm_source=chatgpt.com

*Verdict: partly-confirmed* · Affected: /happiness-happens-day-messages/, /what-to-write-in-a-card/, /national-day-of-encouragement-messages/, /womens-friendship-day-messages/, /st-francis-day-messages/, /guardian-angel-day-messages/, /samhain-messages/, /thanksgiving-day-messages/

**Evidence.** (1) /happiness-happens-day-messages/ links 'Encouragement Messages' to https://blog.123greetings.com/encouragement-inspiration-messages/, which returns 404 live (noindex 404 template). The matching page is /more-inspiration-messages/ ('80+ Words of Encouragement'). (2) /what-to-write-in-a-card/, re-verified live after today's 06:20 edit, links 7 pages over http://: smile-month-messages ('Smile Month'), true-love-forever-day-messages, just-because-day ('Just Because day'), senior-citizen-day-messages, be-an-angel-day-messages, girlfriends-day-messages and thank-you-day-messages. Each 301s to https in one hop. For all 7 pages, this redirecting link is their only inlink anywhere on the site. The same hub links https://blog.123greetings.com/canada-day-messages without a trailing slash, which WordPress 301s to /canada-day-messages/. (3) Links copied from ChatGPT carry ?utm_source=chatgpt.com, so clicks show up in analytics as ChatGPT referrals: /national-day-of-encouragement-messages/ -> /what-to-write-in-a-card/?utm_source=chatgpt.com (internal; returns 200 and canonicalises to the clean URL); /womens-friendship-day-messages/ -> www.123greetings.com/friendship/?utm_source=chatgpt.com; /st-francis-day-messages/ -> www.123greetings.com/?utm_source=chatgpt.com; /guardian-angel-day-messages/ -> /events/guardian_angels_day/?utm_source=chatgpt.com (x2); /samhain-messages/ -> /events/samhain/?utm_source=chatgpt.com; /thanksgiving-day-messages/ -> /events/thanksgiving/home.html?utm_source=chatgpt.com. Outbound links to http://123greetings.com/events/international_yoga_day/ (/15th-june-your-weekly-bobcast/), http://123greetings.com/events/national_tap_dance_day/ (/24th-may-your-weekly-bobcast/) and https://123greetings.com/events/national_pineapple_day/?utm_... (/22nd-june-your-weekly-bobcast/) each take one 301 to www. There are no redirect chains longer than one hop anywhere.
[Verifier] Only 5 of the 7 http-linked pages have that link as their only inlink: just-because-day, senior-citizen-day, be-an-angel-day, girlfriends-day and thank-you-day. smile-month and true-love-forever-day each have a second https inlink.

**Fix.** On /what-to-write-in-a-card/, change the 7 http:// hrefs to https:// and add the slash to /canada-day-messages/. On /happiness-happens-day-messages/, point 'Encouragement Messages' to /more-inspiration-messages/. Strip ?utm_source=chatgpt.com from the 7 links; use the blog's own utm_source=blog scheme for main-site links. Link to https://www.123greetings.com/... directly. Add a pre-publish check for 'chatgpt.com' and 'http://' in content, for example a search-replace in the editor.

### [low] Keyword cannibalisation between near-identical pages: thank you, work anniversary, inspiration/encouragement, wedding, Mother's Day, and home vs hub

*Verdict: partly-confirmed* · Affected: /thank-you-messages/, /thankyou-messages/, /thank-you-day-messages/, /national-thank-you-day-messages/, /work-anniversary-messages/, /anniversary-messages-for-co-worker/, /anniversary-messages-for-employee/, /business-anniversary-messages/ (+10 more)

**Evidence.** Thank you: /thank-you-messages/ ('100+ Thank You Messages — Heartfelt Words of Gratitude', H1 'Thank You Messages', 611 words) vs /thankyou-messages/ ('Heartfelt Thank You Messages, All Occasions', H1 'Thankyou Messages', 394 words). /thank-you-day-messages/ and /national-thank-you-day-messages/ open with near-identical messages ('Thank you for showing up in all the little ways you probably thought went unnoticed. I noticed every one of them.' vs 'Thank you for all the small ways you showed up for me… I noticed'). Work anniversary: /work-anniversary-messages/ ('Work Anniversary Messages & Wishes', 105 words) vs /anniversary-messages-for-co-worker/ ('Work Anniversary Messages for Coworker…') vs /anniversary-messages-for-employee/ ('…: Work Anniversary Wishes'); /business-anniversary-messages/ (98 words) vs /company-anniversary-messages/ (114 words). Encouragement: /inspiration-messages/, /more-inspiration-messages/ (title '80+ Words of Encouragement', H1 'More inspiration Messages'), /inspiration-messages-motivation/, /inspiration-messages-you-can-do-it/, /national-day-of-encouragement-messages/. Wedding: /wedding-messages/ ('Wedding Wishes: Beautiful Messages for the Happy Couple') vs /more-wedding-messages/ ('More Wedding Messages For Every Mood') vs /wedding-messages-to-congratulate-the-couple/ ('Congratulations to the Couple | Wedding Wishes & Messages'). Mother's Day: /mothers-day-messages/ ('125+ Mother's Day Messages…', 1,462 words) competes with 12 unlinked posts such as 'Happy Mother’s Day 2026 Messages: What to Write in the Card' and 'Heartfelt Mother’s Day Messages That Prove You Were Paying Attention', with no links in either direction. Home ('Card Messages & What to Write in a Card | 123Greetings Blog') and /what-to-write-in-a-card/ ('What to Write in a Card - Messages for Every Occasion.') target the same head term. Title templates are cloned across milestones: /messages-for-30th-anniversary/ = /messages-for-40th-anniversary/ except the number ('…Wishes for a Special Celebration | 123Greetings'); 15th and 20th both '— Crystal to China'; 60th and 75th both '— Diamond Jubilee Messages'. Script: s14_cannibal.py.
[Verifier] Confirmed overlaps: thank-you vs thankyou, thank-you-day vs national-thank-you-day, business vs company anniversary, home vs /what-to-write-in-a-card/, plus the cloned milestone titles. The work-anniversary, wedding-subtopic and Mother's Day post pairs are related pages, not near-duplicates. Confirm any cannibalisation in Search Console (queries with 2 or more of the site's URLs ranking) before merging.

**Fix.** Choose one canonical target per intent and consolidate. Merge /thankyou-messages/ into /thank-you-messages/ (or make /thankyou-messages/ the 'thank you by occasion' hub with a distinct title) and 301 the loser. Merge /thank-you-day-messages/ into /national-thank-you-day-messages/. Make /work-anniversary-messages/ the hub, have co-worker and employee link to it with distinct angles ('for a coworker', 'from a manager'), and merge business with company. Merge /more-inspiration-messages/ and /more-wedding-messages/ into their parents or retitle them around distinct intents ('Words of Encouragement'). De-optimise the home title away from 'What to Write in a Card' (for example '123Greetings Blog: Card Messages & Wishes for Every Occasion'). Cross-link the Mother's Day posts and page. Give milestone pages their own titles (15th = Crystal, 20th = China, 30th = Pearl, 40th = Ruby, 75th = Diamond/Platinum).

### [low] Meta descriptions are missing on 366 URLs (2 real pages plus every archive and template); 5 have typos or garbled text

*Verdict: confirmed* · Affected: /upcoming-events/, /inspiration-messages/, /be-an-angel-day-messages/, /new-baby-messages/, /love-thankyou-messages/, /contact-us/, /about-us/, /category/123greetings/ (+1 more)

**Evidence.** Missing: /upcoming-events/ and /inspiration-messages/ (a hub with 489 words and 7 children), both penci-block templates, all 352 tag pages, the 5 category pages and the 5 author pages. Of the 294 URLs with a description, none is duplicated, none is under 70 characters and none is over 160, and og:description matches in every case. Text problems: /be-an-angel-day-messages/ '…for their kindness . Perfect for…' (space before the period); /new-baby-messages/ '…to wish the arrival of a new born baby !' (space before '!', 'new born'); /love-thankyou-messages/ 'Thank You Love ; sweet…' (space before ';'); /contact-us/ '…Drop us a line every post on this blog exists.' (garbled); /about-us/ '…find the right words to express.' (truncated).

**Fix.** Write descriptions for /inspiration-messages/ and /upcoming-events/ (or noindex the latter). Add a Yoast template for the category archive and a custom description for whichever post archive you keep indexed. Tags and author archives are best noindexed rather than described. Fix the 5 texts in the Yoast meta box, for example 'Discover heartfelt, sweet messages to welcome a newborn baby!'.

### [low] The author archive slug comes from an email address ('iblog123greetingsgmail-com'), authorship is inconsistent ('Bob' on posts, 'Andrea gomes' in page schema), and the REST API lists both users

*Verdict: partly-confirmed* · Affected: /author/iblog123greetingsgmail-com/, /author/blog123greetings/, /wp-json/wp/v2/users

**Evidence.** All 49 posts' bylines ('by <a class="author-url" href="/author/iblog123greetingsgmail-com/">Bob</a>') and the Yoast/theme Person nodes link to /author/iblog123greetingsgmail-com/. The slug is the sanitised login email ([account email] pattern). It is indexable, in author-sitemap.xml, and has 260 inlinks. Its title is 'Bob, Author at 123Greetings Blog - Free eCards…', its H1 is 'Bob', it has no meta description, no bio text (author description empty) and a default Gravatar identicon as og:image. Its 5 paginated pages list exactly the same posts as /category/123greetings/. Live GET /wp-json/wp/v2/users returns 2 users: id 272191372 'Andrea gomes' (slug blog123greetings, url http://blog123greetings.wordpress.com, description '') and id 272191379 'Bob' (slug iblog123greetingsgmail-com, description ''). /author/blog123greetings/ returns 200 with noindex and 0 posts, yet the theme JSON-LD on all 246 pages names 'Andrea gomes' (lowercase surname) as the author and links to it. Pages themselves show no author.

**Fix.** As proposed. One caveat for WordPress.com: these are WordPress.com accounts (the 9-digit IDs are WP.com user IDs). If account sync resets a locally changed user_nicename, create a WordPress.com user with the username 'bob' (or a named editor), reassign the 49 posts to it (Users > Delete > Attribute all content, or 'wp post update'), and 301 /author/iblog123greetingsgmail-com/ (and its /page/N/ URLs) to the new author URL.

### [low] Title leftovers and inconsistencies: 'Meta Title' left in a title, a space before a colon, '|123Greetings', 5 different separators and 6 brand patterns

*Verdict: confirmed* · Affected: /anniversary-messages-for-brother/, /national-oatmeal-day-messages/, /columbus-day-messages/, /what-to-write-in-a-card/, /messages-for-40th-anniversary/, /messages-for-30th-anniversary/, /day-of-the-dead-messages/, /cousins-day-messages/ (+5 more)

**Evidence.** '100+ Anniversary Wishes for Brother, Heartfelt & Warm Meta Title' (/anniversary-messages-for-brother/, 64 characters; the page actually has 3 messages). 'National Oatmeal Day Messages : Grainy, Crunchy & Nutritious' (space before colon). 'Columbus Day Messages & Wishes |123Greetings' (missing space). 'What to Write in a Card - Messages for Every Occasion.' (trailing period on the main hub). Separators across 296 content titles: ' — ' 113, ': ' 53, ' | ' 37, ' – ' 8, ' - ' 3. Brand: 220 content titles have no brand, 48 the long suffix, 23 '| 123Greetings', 2 '| 123Greetings Blog', 1 '|123Greetings', and 2 put the brand mid-title. 8 page titles are over 60 characters even without the suffix: 40th and 30th anniversary (64), anniversary-for-brother (64), day-of-the-dead (63), cousins-day (62), september-flower-month (61), cute-messages (61), belated-anniversary-for-sorry-i-forgot (61). Evergreen titles hard-code '(2026)' and will read as stale from 1 Jan 2027: /birthday-messages-for-son/, /birthday-messages-for-boss/, /messages-for-40th-birthday/, /messages-for-10th-anniversary/; also 'You Go Girl Day 2026' and 'Say Hey Day 2026'. Post titles shout the month: '13th JULY: Your Weekly Bobcast!', '15th JUNE…', '1st JUNE…' vs '19th May…'.

**Fix.** Fix the 4 typo titles now. Pick one pattern ('Primary Keyword — Modifier | 123Greetings') and apply it to the 23 + 2 + 1 variants. Replace hard-coded years with Yoast's %%currentyear%% variable or remove them. Trim the 8 long titles to 60 characters or fewer.

### [low] Weak heading structure: 137 content pages have no visible H2, and 14 pages jump from H1 to H3

*Verdict: confirmed* · Affected: /birthday-messages-for-mom/, /easter-messages/, /, /wedding-messages/, /friendship-messages/, /thankyou-messages/, /inspiration-messages/, /24th-may-your-weekly-bobcast/ (+1 more)

**Evidence.** On 137 content pages the only visible heading in the main content is the H1. /birthday-messages-for-mom/'s visible outline is just 'H1: Birthday messages for Mom' (confirmed in rendered Chromium), even though its title promises 'Heartfelt, Funny & Sweet' groups. 14 pages skip from H1 to H3: the home page (H3 'Birthday', 'Anniversary'… before any H2), /wedding-messages/ (H3 'For the Bride'), /friendship-messages/ ('For Best Friends'), /inspiration-messages/ ('You can do it'), /thankyou-messages/ ('Dailies'), 4 bobcast posts and 4 'five-minutes' posts (H3 'Related' or a quote as H4 after H2).
[Verifier] The 14 pages are 5 hubs or home (H1 to H3), 3 bobcast and 4 Five Minutes posts (H1 to H3), and 2 Five Minutes posts (H2 to H4). The auditor's split of 4 bobcast and 4 Five Minutes is slightly off.

**Fix.** Group messages under H2s that match the search modifiers in the title ('Heartfelt Birthday Messages for Mom', 'Funny Birthday Messages for Mom', 'Short Birthday Wishes for Mom'). Promote the hub card headings to H2, or add an H2 above them ('Browse by occasion').

### [low] robots.txt works but carries a leftover WPForms group (the site uses Contact Form 7) and two separate 'User-agent: *' groups

*Verdict: confirmed* · Affected: /robots.txt

**Evidence.** Live robots.txt (200, text/plain) has two groups: '# START WPFORMS BLOCK / User-agent: * / Disallow: /wp-content/uploads/wpforms/' and a Yoast block 'User-agent: * / Disallow: (empty) / Sitemap: https://blog.123greetings.com/sitemap_index.xml'. Google merges identical user-agent groups, so nothing important is blocked. The WPForms rule refers to a plugin the site doesn't use for its forms (CF7 with reCAPTCHA v3). Internal search (/?s=), date archives (/2026/05/) and the empty author archive are correctly noindexed via meta robots (checked live and in cached search pages). Attachment URLs 301 to the media file.

**Fix.** Deactivate and delete WPForms and its Form Locker and User Journey addons if nothing uses them. That removes the robots.txt block (written by WPForms) and the sitewide CSS/JS. Otherwise the cleanup is optional.


<details><summary><b>Table: Broken or redirecting link targets (re-verified live 2026-09-30)</b> (14 rows)</summary>

| target | status | linked from | links | anchor text(s) | suggested replacement |
|---|---|---|---|---|---|
| https://www.123greetings.com/blog/what-to-write-in-a-card | 404 | 6 Mother's Day posts (wife, someone-who-lost-their-mom, mother-in-law, happy-mothers-day-2026, grandma, stepmom) | 32 | → Heartfelt Mother’s Day messages for mom (5); → What to write in a Mother’s Day card (5); → …for your wife (4); → …for grandma (4); → …for stepmom (4); → Funny … for mom (3); +7 others | internal blog pages per anchor (see finding) |
| https://www.123greetings.com/events/sorry/ | 404 | /sorry-messages-for-coworkers-when-my-coworker-struggled-with-saying-sorry/ | 1 | free sorry card collection | https://www.123greetings.com/sorry/ (200) |
| https://www.123greetings.com/events/thank_you/ | 404 | /love-messages-for-wife-the-thank-you-i-owed-my-wife-for-two-years/, /thank-you-card-messages-when-my-father-in-law-said-the-quiet-thing-out-loud/ | 2 | Thank You collection | https://www.123greetings.com/thank_you/ (200) |
| https://www.123greetings.com/events/congratulations/ | 404 | /congratulations-card-messages-when-i-realized-id-quietly-let-an-old-friendship-drift/ | 1 | Congratulations card collection | https://www.123greetings.com/congratulations/ (200) |
| https://www.123greetings.com/events/national_vanilla_pudding_day/https://www.123greetings.com/events/national_vanilla_pudding_day/ | 404 | /19th-may-your-week-with-bob/ | 1 | Vanilla Pudding Day (May 22) | https://www.123greetings.com/events/national_vanilla_pudding_day/ (200) |
| https://www.123greetings.com/family/father/ | 404 | /thank-you-card-messages-when-my-father-in-law-said-the-quiet-thing-out-loud/ | 1 | Father card collection | https://www.123greetings.com/family/ (200) or /events/fathers_day/ |
| https://www.123greetings.com/events/honey-month/ | 404 | /honey-month-messages/ | 1 | 123Greetings | https://www.123greetings.com/events/national_honey_month/ (200) |
| https://blog.123greetings.com/encouragement-inspiration-messages/ | 404 | /happiness-happens-day-messages/ | 1 | Encouragement Messages | /more-inspiration-messages/ |
| http://blog.123greetings.com/{smile-month,true-love-forever-day,senior-citizen-day,be-an-angel-day,girlfriends-day,thank-you-day}-messages/ + /just-because-day/ | 301 -> https | /what-to-write-in-a-card/ | 7 | Smile Month; True Love Forever Day; Just Because day; Senior Citizen Day; Be an Angel Day; Girlfriend's Day; Thank You Day | same URL with https:// |
| https://blog.123greetings.com/canada-day-messages | 301 -> trailing slash | /what-to-write-in-a-card/ | 1 | Canada Day | /canada-day-messages/ |
| https://blog.123greetings.com/what-to-write-in-a-card/?utm_source=chatgpt.com | 200 (canonicalised) | /national-day-of-encouragement-messages/ | 1 | What to Write in a Card – 123Greetings Blog | /what-to-write-in-a-card/ |
| http://123greetings.com/events/international_yoga_day/ | 301 -> www (1 hop) | /15th-june-your-weekly-bobcast/ | 1 | International Yoga Day (June 21) | https://www.123greetings.com/events/international_yoga_day/ |
| http://123greetings.com/events/national_tap_dance_day/ | 301 -> www (1 hop) | /24th-may-your-weekly-bobcast/ | 1 | National Tap Dance Day (May 25) | https://www.123greetings.com/events/national_tap_dance_day/ |
| https://123greetings.com/events/national_pineapple_day/?utm_… | 301 -> www (1 hop) | /22nd-june-your-weekly-bobcast/ | 1 | National Pineapple Day (June 27th) | https://www.123greetings.com/events/national_pineapple_day/?utm_… |

</details>


<details><summary><b>Table: Sitemap composition (live sitemap_index.xml)</b> (7 rows)</summary>

| sitemap | URLs | what it is | recommended |
|---|---|---|---|
| post-sitemap.xml | 49 | blog posts (49 image entries, all real) | keep |
| page-sitemap.xml | 247 | message pages, hubs, about/contact, /archive/, /upcoming-events/ (empty); 287 image entries, 280 = 16px arrow | keep; remove the empty page; fix arrow images |
| penci-block-sitemap.xml | 2 | Soledad footer and mega-menu template posts (indexable, 2022 demo text) | remove + noindex CPT |
| category-sitemap.xml | 1 | /category/123greetings/ (lists all 49 posts; duplicate of author archive) | keep one post archive, rename category |
| post_tag-sitemap.xml | 347 | 317 single-post tags, 16 with 2 posts, 14 with 3 or more; 345 have 0 inlinks | remove + noindex tags |
| author-sitemap.xml | 1 | /author/iblog123greetingsgmail-com/ (email-derived slug, duplicate of category) | remove + noindex / rename slug |
| TOTAL | 647 | 351 (54%) non-content | ~296 after cleanup |

</details>


<details><summary><b>Table: Title count claims vs messages found (worst 15 of 119)</b> (15 rows)</summary>

| url | claimed | quoted messages found | words in main content |
|---|---|---|---|
| /birthday-messages/ | 500 | 0 | 189 |
| /anniversary-messages/ | 250 | 0 | 135 |
| /engagement-messages/ | 100 | 1 | 45 |
| /messages-for-5th-anniversary/ | 50 | 1 | 30 |
| /easter-messages/ | 75 | 2 | 31 |
| /birthday-messages-for-wife/ | 150 | 4 | 140 |
| /anniversary-messages-for-brother/ | 100 | 3 | 84 |
| /april-fools-day-messages/ | 50 | 2 | 44 |
| /international-yoga-day-messages/ | 50 | 2 | 44 |
| /messages-for-1st-birthday/ | 80 | 4 | 76 |
| /birthday-messages-for-husband/ | 120 | 6 | 171 |
| /birthday-messages-for-girlfriend/ | 120 | 6 | 124 |
| /birthday-messages-for-boyfriend/ | 100 | 5 | 102 |
| /birthday-messages-for-brother/ | 100 | 5 | 167 |
| /birthday-messages-for-best-friend/ | 100 | 5 | 143 |

</details>


<details><summary><b>Table: Duplicate titles / H1s</b> (4 rows)</summary>

| title or H1 | type | URLs | count |
|---|---|---|---|
| Wake Up With Bob - 123Greetings Blog - … | title + H1 | /wake-up-with-bob-14th-july/ … /wake-up-with-bob-26th-july/ (14th-26th July) | 13 |
| Five Minutes With Bob - 123Greetings Blog - … | title | /five-minutes-with-bob/, -13th-july, -27th-july, -28th-july, -29th-july, -30th-july, -31st-july | 7 |
| Five Minutes With Bob | H1 | the 7 above + -11th-july, -1st-august, -2nd-august | 10 |
| 123greetings Archives - 123Greetings Blog - … | title | /tag/123greetings/, /category/123greetings/ | 2 |

</details>


<details><summary><b>Table: Live JSON-LD validation sample (22 URLs, s13_sample.py)</b> (11 rows)</summary>

| url | blocks | invalid type / relative @id | theme author | theme description (start) | theme image |
|---|---|---|---|---|---|
| / | Yoast(WebPage,ImageObject,BreadcrumbList,WebSite) + organization + WebSite | organization / #organization | - | - | - |
| /birthday-messages/ | Yoast + organization + WebSite + WebPage | organization / #organization, #person-Andreagomes; datemodified | Andrea gomes | Birthdays For Her For Him For Anyone By Milestone Zodiac… | no-image.jpg |
| /birthday-messages-for-mom/ | Yoast + organization + WebSite + WebPage | same | Andrea gomes | Emotions For Mom Birthday messages, for Mom “” For Mom “”… | no-image.jpg |
| /national-best-friends-day-messages/ | Yoast + organization + WebSite + WebPage | same | Andrea gomes | Emotions National Best Friends Day National Best Friends Day Messages “” … | no-image.jpg |
| /about-us/ | Yoast + organization + WebSite + WebPage | same | Andrea gomes | About Us Every feeling has a card…&hellip; | no-image.jpg |
| /what-to-write-in-a-card/ | Yoast(no ImageObject) + organization + WebSite + WebPage | same | Andrea gomes | Every relationship is worthy… We&#8217;ll help… | no-image.jpg |
| /mothers-day-messages-for-mom-…/ | Yoast(Article,…,Person) + organization + WebSite + BlogPosting | organization; datemodified 2026-04-30 < datePublished 2026-05-01 | Bob | I borrowed socks from my mom’s drawer… | May-1st.webp |
| /13th-july-your-weekly-bobcast/ | Yoast(Article…) + organization + WebSite + BlogPosting | datemodified 2026-07-11 < datePublished 2026-07-12 | Bob | This morning, my still half-asleep girlfriend… | Bob_Img_13th_July_Blog.webp |
| /tag/bob/ | Yoast(CollectionPage…) + organization + WebSite | organization / #organization | - | - | - |
| /author/iblog123greetingsgmail-com/ | Yoast(ProfilePage…,Person) + organization + WebSite | organization / #organization | - | - | - |
| /penci-block/mega-menu/ | Yoast(WebPage…) + organization + WebSite + BlogPosting | organization; datePublished 2022-07-27 | Andrea gomes | How To Cook And Bake With Kitchen Scraps July 25, 2022… | no-image.jpg |

</details>


<details><summary><b>Table: Orphan and weakly linked pages</b> (12 rows)</summary>

| url | inlinks (any page) | note |
|---|---|---|
| /archive/ | 0 | only page listing posts; not in nav |
| /at-work-messages/ | 0 | not linked from any hub |
| /upcoming-events/ | 0 | empty page (0 words, no H1) in sitemap |
| /smile-month-messages/ | 1 | only via http:// link on /what-to-write-in-a-card/ |
| /true-love-forever-day-messages/ | 1 | only via http:// link |
| /just-because-day/ | 1 | only via http:// link |
| /senior-citizen-day-messages/ | 1 | only via http:// link |
| /be-an-angel-day-messages/ | 1 | only via http:// link |
| /girlfriends-day-messages/ | 1 | only via http:// link |
| /thank-you-day-messages/ | 1 | only via http:// link |
| (215 pages) | 1 | single inlink from a hub: 93 from /what-to-write-in-a-card/, 52 from /anniversary-messages/, 51 from /birthday-messages/, 19 others |
| (49 posts, 352 tags, 5 category, 5 author, 2 penci-block) | n/a | not reachable from home by any link path (sitemap only) |

</details>


<details><summary><b>Table: og:image on content pages</b> (4 rows)</summary>

| type | og:image | pages | examples |
|---|---|---|---|
| page | 16x16 arrow icon (396 bytes) | 152 | /birthday-messages/, /anniversary-messages/, /birthday-messages-for-mom/, /easter-messages/, /4th-of-july-messages/ |
| page | none | 92 | /what-to-write-in-a-card/, /halloween-messages/, /thanksgiving-day-messages/, /veterans-day-messages/, /wedding-messages/, /friendship-messages/, /labor-day-messages/ |
| page | real image | 3 | / (Happy_faces.webp), /about-us/ (Blog-About.webp), /contact-us/ (email-2.png icon) |
| post | real image 1200-1500px | 49 | all posts |

</details>


<details><summary><b>Table: Title length (>60 chars)</b> (8 rows)</summary>

| group | count | example (chars) |
|---|---|---|
| tag archives with long suffix | 352 | Alps Archives - 123Greetings Blog - Free eCards… (≈104) |
| posts with long suffix | 46 | /birthday-card-messages-when-my-brother-… (179) |
| category pages | 5 | 123greetings Archives - Page 3 of 5 - …  |
| author pages | 5 | Bob, Author at 123Greetings Blog - … - Page 5 of 5 (117) |
| pages with long suffix | 2 | /upcoming-events/, /inspiration-messages/ |
| penci-block templates | 2 | Footer - 123Greetings Blog - … |
| pages >60 without suffix | 8 | /messages-for-40th-anniversary/ (64), /messages-for-30th-anniversary/ (64), /anniversary-messages-for-brother/ (64), /day-of-the-dead-messages/ (63), /cousins-day-messages/ (62), /september-flower-month-messages/ (61), /cute-messages/ (61), /belated-anniversary-messages-for-sorry-i-forgot/ (61) |
| TOTAL | 420 | of 660 URLs |

</details>


## Accessibility

### [high] Every message's copy button has no accessible name and gives no announced confirmation (WCAG 4.1.2 Name, Role, Value, A; 4.1.3 Status Messages, AA)

*Verdict: confirmed* · Affected: /birthday-messages-for-mom/, /be-an-angel-day-messages/, /sympathy-condolences-messages/, sitewide on message pages: 242 pages / 2,227 visible .msgs blocks in the crawl

**Evidence.** axe-core 4.10.2 reports button-name (impact critical, wcag412) at both desktop and mobile: 7 nodes on /birthday-messages-for-mom/, 5 on /be-an-angel-day-messages/ and 10 on /sympathy-condolences-messages/. Selector: `.msgs .penci-block_content > button.copy-icon-btn`. An inline script inserts `<button class="copy-icon-btn"><span class="copy-tooltip">Copy</span><svg …></svg></button>` before every `.msgs .elementor-text-editor`. The inline CSS sets `.msgs .copy-tooltip{opacity:0;visibility:hidden}` and reveals it only on `.copy-icon-btn:hover`. So the accessible name is empty: the Chromium AX tree shows role button with name "", and screen readers announce just "button" before every message. Keyboard focus shows neither the tooltip nor any style change (tab walk on /birthday-messages-for-mom/, stops 11-17). On click, the script swaps the tooltip text to "Copied" for 2 s, but it stays visibility:hidden, so nothing is announced and keyboard users see no confirmation. The button is 18x22 CSS px. It passes 2.5.8 only through the spacing exception, because buttons are about 78 px apart. The script appears on every page with .msgs blocks that I sampled (3 fetched pages plus 5 in the SEO agent's HTML cache). The crawl counts 2,227 visible message blocks on 242 pages.

**Fix.** When creating the button, set `button.type='button'` and `button.setAttribute('aria-label','Copy message')`. Better still, show visible text ('Copy'). Add `aria-hidden="true" focusable="false"` to the SVG. Show the tooltip on `:focus-visible` as well as `:hover`, and let Escape dismiss it. Add one visually hidden live region to the page (`<div role="status" aria-live="polite" class="screen-reader-text"></div>`) and set its text to 'Message copied to clipboard' after `navigator.clipboard.writeText()` resolves, or an error message if it rejects. Give the button a visible focus style and a minimum size of 24x24 px.

### [high] Keyboard focus indicator is removed sitewide by the theme CSS (WCAG 2.4.7 Focus Visible, AA)

*Verdict: confirmed* · Affected: sitewide (all 667 crawled 200-status URLs share wp-content/themes/soledad/main.css?ver=8.7.6), /, /birthday-messages-for-mom/, /mothers-day-messages-for-wife-what-she-actually-wants/, /this-page-does-not-exist-a11y-check/

**Evidence.** Root cause, in the cached https://blog.123greetings.com/wp-content/themes/soledad/main.css?ver=8.7.6: `* { box-sizing:border-box; …; outline: 0 }` and `a { text-decoration:none; color:var(--pcaccent-cl); transition:color .3s; outline:0; cursor:pointer }`, plus `input[type=text]:focus,…,textarea:focus{outline:0}` and `#respond input:focus,.wpcf7 input:focus{outline:0}`. Author styles override Chromium's default :focus-visible ring. How it was measured: Playwright/Chromium at 1366x900 and 390x844 on 10 pages. On each page I pressed Tab 22-30 times, compared the focused element's computed style with the same element after blur(), and slowed down so transitions could finish. Every focused link had outline-style 'none' and box-shadow 'none' in the focused state. The only computed change was outline-offset 0px->1px, which draws nothing. button.copy-icon-btn, the Google CSE input #gsc-i-id1, the contact/comment fields, the cookie 'x' span and the comment Submit button showed no computed change at all. Screenshot /home/user/Message_Board/site-audit/agent-work/accessibility/shots/desktop_home_tab03.png shows 'About Us' focused with nothing marking it. To reproduce: open https://blog.123greetings.com/ and press Tab 3 times; focus is on 'About Us' but nothing shows it.
[Verifier] Same as reported, with one nuance: the CSE search input (#gsc-i-id1) does change visibly on focus (placeholder removed, caret shown), so it is the one arguable exception. Links, buttons, the copy buttons and the cookie controls show no visible change at all (pixel diff 0). Pixel-diff pairs: /home/user/Message_Board/site-audit/agent-work/a11y-verify/shots/home_t03_f.png vs home_t03_u.png.

**Fix.** Don't edit the parent Soledad main.css, because theme updates overwrite it. On this WordPress.com (Atomic) site, add the rule in Appearance > Customize > Additional CSS, or in Elementor > Site Settings > Custom CSS: `:focus-visible{outline:2px solid #00537B !important;outline-offset:2px !important}` plus `#footer-section-container :focus-visible,.onHoverTitleWhite :focus-visible{outline-color:#fff !important}`. The !important is needed because `.wpcf7 input:focus` (0,2,1) and `#respond input:focus`/`#respond textarea:focus` (1,1,1) outrank a plain :focus-visible. The suggested `*{outline:revert}` step is unnecessary, and on its own it would not bring back the ring on the copy buttons, because `button{outline:0}` (0,0,1) beats `*` (0,0,0).

### [high] Mobile menu button is a non-focusable div, and the opened drawer has no focus management (WCAG 2.1.1 Keyboard, A; 4.1.2, A; 2.4.3 Focus Order, A)

*Verdict: confirmed* · Affected: sitewide (header template), verified on all 10 tested pages at 390x844, /birthday-messages-for-mom/

**Evidence.** The menu button is `div.pc-button-define-customize.navigation.mobile-menu > div.button-menu-mobile.header-builder`, SVG only, drawn at 24x31 px at x=356,y=14 on a 390 px viewport. It has tabIndex -1, no role, no aria-label and no aria-expanded. Calling element.focus() does not focus it, and 22 Tab presses never reach it on any page. It is the only visible way to open navigation whenever the mobile header is shown, which includes 320 CSS px (the 400% zoom case). On /birthday-messages-for-mom/ I tapped it. #penci_off_canvas slid to left:0 and body gained .open-mobile-builder-sidebar-nav, but document.activeElement stayed <body>. Tab then went: a.close-mobile-menu-builder ('Close') -> logo -> HOME -> ABOUT US -> WHAT TO WRITE IN A CARD -> CONTACT US -> button.copy-icon-btn in the page behind the drawer. elementFromPoint showed #penci_off_canvas covering that button at 3/3 sample points, so focus leaves the dialog. Pressing Escape left the drawer open (left:0) with focus hidden behind it. The close control is a link, `a.close-mobile-menu-builder[href="#"][aria-label="Close"]`, not a button. Screenshot: /home/user/Message_Board/site-audit/agent-work/accessibility/shots/mobile_menu_open.png.
[Verifier] Scope is wider than phones. Resizing /contact-us/ showed 4 desktop nav links at 1366, 1200 and 1024 px, while at 900, 768, 480 and 320 px only this hamburger is shown. So it applies to every viewport below 1024 CSS px: tablets, and desktop browser zoom of roughly 150% and up on a 1366 px screen. One nuance: while the drawer is closed, its 5 links stay in the tab order (off-screen at x=-310). A keyboard user can still activate HOME…CONTACT US without seeing them. What fails is opening and seeing the menu (2.1.1 for the open function, 2.4.7 for the unseen links), not reaching the pages at all.

**Fix.** Replace the div with `<button type="button" aria-label="Menu" aria-controls="penci_off_canvas" aria-expanded="false">` in a child-theme copy of the Soledad header-builder template. If that is impractical on WordPress.com, add a sitewide script through Elementor Pro > Custom Code (or WPCode) that adds role/tabindex/aria to .button-menu-mobile, handles Enter and Space, toggles aria-expanded, moves focus into #penci_off_canvas, closes on Escape and returns focus to the button. Ship this together with, or before, the off-canvas visibility fix. If the closed drawer is hidden first, keyboard users below 1024 px lose even the unseen path to the navigation.

### [medium] Closed off-canvas menus stay in the tab order and the accessibility tree while off-screen (WCAG 2.4.7 Focus Visible, AA; 2.4.3 Focus Order, A)

*Verdict: confirmed* · Affected: sitewide (header template), verified on all 10 tested pages, desktop and mobile, /, /contact-us/

**Evidence.** Desktop (1366x900), on every tested page tab stops 6-10 land on invisible links: `#penci_off_canvas .pb-logo-sidebar-mobile a` at x=-238, then `#menu-my-main-header-2 a` for HOME, ABOUT US, WHAT TO WRITE IN A CARD and CONTACT US at x=-310, width 290, entirely off-screen. That is 5 blind Tab presses before any content. Mobile (390x844): tab stops 2-6 are the same invisible links. After the footer, focus goes on to `nav#sidebar-nav`: its logo at x=-230 and the placeholder social links Facebook, Instagram and Whatsapp (`a[href="#"][target=_blank]`, 8-12 px wide, at x=-168/-143/-114), then another HOME at x=-250. Both drawers are moved off-screen with a transform only (no visibility:hidden, display:none or inert). Screen readers therefore also get a second, unnamed copy of the navigation: the Chromium AX tree lists 2 unnamed 'navigation' landmarks, and axe landmark-unique fires on all 20 runs.
[Verifier] On desktop, nav#sidebar-nav is display:none, so the extra sidebar-nav stops only occur in the tablet/mobile layout (below 1024 px). #penci_off_canvas is in the tab order at every width.

**Fix.** As proposed (visibility:hidden or inert while closed, remove or hide nav#sidebar-nav and its href="#" social placeholders, add aria-labels to the navs), but release it in the same change as the hamburger button fix. Otherwise keyboard users below 1024 px lose all access to the menu links.

### [medium] Contact and comment forms use placeholders as labels and have no autocomplete (WCAG 3.3.2 Labels or Instructions, A; 1.3.5 Identify Input Purpose, AA; 1.3.1, A)

*Verdict: confirmed* · Affected: /contact-us/, all 49 posts (WordPress comment form #commentform), e.g. /mothers-day-messages-for-wife-what-she-actually-wants/

**Evidence.** /contact-us/ (Contact Form 7 6.1.7, form aria-label 'Contact form'): input[name=your-name] placeholder 'Name*', input[name=your-email] 'Email*', input[name=your-subject] 'Subject' and textarea[name=your-message] 'Your Message'. None has a <label>, aria-label or id (input.labels.length = 0), so the name comes only from the placeholder, which disappears as soon as the user types. The required marker '*' exists only inside the placeholder. your-message is aria-required="true" but has no '*'. There is no autocomplete attribute on the name or email fields. The comment form on posts has #comment 'Your Comment', #author 'Name*' and #email 'Email*' (type=text, not email): no labels, no autocomplete, and #author/#email have no aria-required despite the '*'. Placeholder colour #757575 on white is 4.61:1 (passes). I did not test error handling because that requires submitting: CF7's client-side check did not fire on change (data-status stayed 'init'). Statically, CF7 6.1.7 marks errors with aria-invalid=true plus aria-describedby pointing at a screen-reader list, and the red tip #dc3232 is 4.62:1 on white.

**Fix.** CF7 supports the autocomplete option and wrapped labels: `<label>Name *[text* your-name autocomplete:name]</label>`, `<label>Email *[email* your-email autocomplete:email]</label>`, `<label>Subject[text your-subject]</label>`, `<label>Your message *[textarea* your-message]</label>`, plus a '* required' note. For comments, Soledad replaces the core fields. Filter `comment_form_default_fields` in a child theme or code-snippet plugin (plugins are allowed on WordPress.com Atomic/Business) to output labelled fields with autocomplete="name"/"email" and type="email".

### [medium] Cookie banner covers focused content, fills 77% of the screen at 400% zoom, and uses fake buttons (WCAG 2.4.11 Focus Not Obscured (Minimum), AA; 1.4.10 Reflow, AA; 4.1.2, A)

*Verdict: partly-confirmed* · Affected: sitewide (nsc_bar cookie consent loads on every page), /contact-us/, /birthday-messages-for-mom/, /birthday-messages/, /tag/alps/

**Evidence.** `div.cc-window.cc-floating.cc-type-info[role=dialog][aria-label="cookieconsent"]` is fixed at the bottom right, 384x198 on desktop and full width 390x198 on mobile. It is the last element in the DOM and does not take focus, so it stays open while users tab through the page. Desktop: footer links 'Copyright Policy', 'Do Not Sell My Info' and 'Request Opt In' are covered at 2-3 of 3 sample points when focused, both with Tab and with Shift+Tab (/birthday-messages/, /birthday-messages-for-mom/, 404). Mobile /contact-us/: the focused Name, Email, Subject and Message fields are each covered at 3/3 points. At 320x256 CSS px (1280x1024 at 400%) the banner is 320x198 with top at y=58, covering 77% of the viewport, so only the header is visible (screenshot /home/user/Message_Board/site-audit/agent-work/accessibility/shots/reflow320_contact.png). The 'Accept' control is `<a role="button" tabindex="0" class="cc-btn cc-dismiss">` with no href, and 'x' is `<span role="button" tabindex="0" aria-label="x cookie" class="cc-close">` at 13x19 px. Space does nothing on either (verified on /birthday-messages/ and /tag/alps/); only Enter works. After dismissing, focus drops to <body>. The 'Cookie Policy.' link carries role="button" although it navigates to a new tab. The dialog's accessible name is the machine string 'cookieconsent'.
[Verifier] Fraction of the focused element's box covered by div.cc-window:
- Desktop /birthday-messages/, Shift+Tab from the footer: 'Do Not Sell My Info' 100% (a full 2.4.11 failure), 'Copyright Policy' 63%.
- Mobile /contact-us/ (banner 390x198 at y=646): Subject 100%, Your Message 100%, Name 95%, Email 95%, and all 6 footer links 100%. The browser does not scroll these fields clear because they count as inside the viewport. Screenshot: /home/user/Message_Board/site-audit/agent-work/a11y-verify/shots/mobile_contact_obscured_8.png
- At 320x256 the banner is 320x198 at y=58, covering 77% of the viewport.
- On / (desktop), Space on Accept (`<a role=button tabindex=0>`, no href) left the banner visible, Enter dismissed it, and focus went to <body>.
- The banner is element 448 of 454 in <body>.
- It also covers the desktop go-to-top control (1306,854, 40x40), so clicking that control hits the banner.

**Fix.** The markup comes from the 'Beautiful and responsive cookie consent' plugin 4.9.2 (Osano cookieconsent). Real <button> elements, proper naming and returning focus after dismissal need a plugin setting, a replacement plugin, or a small JS patch (for example, Space keydown → click, and removing role=button from the policy link). The covering can be fixed with Additional CSS. Use WCAG technique C43 (`html{scroll-padding-bottom:210px}` while the banner is shown) so focused fields scroll clear, and use a compact bar (≤25vh), e.g. `@media (max-height:400px){.cc-window{max-height:40vh;overflow:auto}}`.

### [medium] Homepage category-card titles turn white on a cream card when focused, making them nearly invisible (WCAG 1.4.3 Contrast (Minimum), AA; 2.4.7, AA)

*Verdict: confirmed* · Affected: /

**Evidence.** On focus, the card title links Anniversary, Thank You, Get Well Soon, Friendship and Family (h3.elementor-icon-box-title a) change their computed color from rgb(0,83,123) to rgb(255,255,255). The white 'title on hover' style is applied, but the card background stays #faf6ee because the blue hover background only applies on :hover. Contrast is 1.08:1. Measured by focusing each title in Chromium at 1366x900; screenshot /home/user/Message_Board/site-audit/agent-work/accessibility/shots/desktop_home_focus_Anniversary.png shows the word barely visible. The blue Birthday card, `.onHoverTitleWhite`, is unaffected (white on rgba(0,83,123,.93)). The Love card was not measured but uses the same widget.
[Verifier] All 6 cream cards are affected (count 6 is correct). Screenshot: /home/user/Message_Board/site-audit/agent-work/a11y-verify/shots/home_card1_Anniversary.png

**Fix.** Elementor 4 emits the widget's Title hover colour for both :has(:hover) and :has(:focus), but the widget's Advanced > Background > Hover emits only :hover. Fix it once for all 6 widgets in Additional CSS: `.elementor-7608 .elementor-widget-icon-box:not(.onHoverTitleWhite):focus-within{background-color:#00537B}`. The alternative is per widget in Advanced > Custom CSS (Elementor Pro): `selector:focus-within{background-color:#00537B}`. Pair it with the sitewide :focus-visible ring.

### [medium] Icon-only Previous/Next pagination links have no accessible name on paginated archives (WCAG 2.4.4 Link Purpose, A; 4.1.2 Name, Role, Value, A)

*Verdict: verifier-found* · Affected: /category/123greetings/, /category/123greetings/page/2/, /category/123greetings/page/3/, /category/123greetings/page/4/, /category/123greetings/page/5/, /author/iblog123greetingsgmail-com/, /author/iblog123greetingsgmail-com/page/2/ … /page/5/, /tag/bob/ and /tag/bob/page/2/ … /page/5/ (+3 more)

**Evidence.** Live axe run (desktop, 2026-09-30) reports link-name (serious) on /category/123greetings/ and /author/iblog123greetingsgmail-com/. The node is `<a class="next page-numbers" href="…/page/2/"><i class="penci-faicon fa fa-angle-right"></i></a>`, with no text, aria-label or title, so screen readers announce only 'link' or the URL. The crawl has icon-only /page/N/ links (next, and also prev on middle pages) on 18 URLs: 8 tag, 5 category and 5 author. Reproduce: open /category/123greetings/, inspect the pagination arrow under the post list, or check its name in DevTools > Accessibility (empty).

**Fix.** Give the arrows a text name. The simplest fix on WordPress.com is a code snippet using the core `paginate_links_output` filter that adds `aria-label="Next page"`/`aria-label="Previous page"` to `a.next.page-numbers`/`a.prev.page-numbers`. Alternatively, change Soledad's prev_text/next_text to include `<span class="screen-reader-text">Next page</span>`, and add aria-hidden="true" to the <i> icon.

### [medium] Low-contrast grey meta text: breadcrumbs, dates, post navigation labels, 'Load More Posts' (WCAG 1.4.3 Contrast (Minimum), AA)

*Verdict: confirmed* · Affected: /tag/alps/ (template for 352 tag archives), /mothers-day-messages-for-wife-what-she-actually-wants/ (template for 49 posts), /archive/

**Evidence.** axe color-contrast (serious), identical at desktop and mobile. /tag/alps/: breadcrumb 'Home' link and `.breadcrumb_last` (13px) and `.otherl-date > time` (14px) are #888888 on #ffffff = 3.54:1. Post: `.prev-post-title > span` 'previous post', `.next-post-title > span` 'next post', related-post `time.entry-date` (13px) and `.single-comment-o` '0 comments' (15px) are #888888 on #fff = 3.54:1 (6 nodes desktop, 4 mobile). /archive/: `span.ajax-more-text` 'Load More Posts' (12px/600) is #999999 on #fff = 2.85:1. All need 4.5:1. Category and author archives use the same Soledad archive template but were not browser-tested.
[Verifier] The template also fails on the archives the auditor had not browser-tested. /category/123greetings/ and /author/iblog123greetingsgmail-com/ each have 12 axe color-contrast nodes: breadcrumb Home, .breadcrumb_last and 10 .otherl-date times, all #888888 at 3.54:1. Scope is 352 tags + 49 posts + /archive/ + 5 category + 5 author pages = about 412 URLs.

**Fix.** The theme drives this colour through a variable: main.css sets `--pcmeta-cl:#888888` and the Customizer's inline CSS sets `--pcmeta-cl:#999999`. In Additional CSS add `:root{--pcmeta-cl:#595959}` plus `.tags-share-box .single-comment-o{color:#595959}` (that rule is hard-coded #888), and give `.penci-ajax-more-button .ajax-more-text` a colour of #595959 or darker. Alternatively change the meta colour in the Soledad Customizer.

### [medium] No <main>, <header> or <footer> landmarks and no skip link; the 404 page has no bypass mechanism at all (WCAG 1.3.1 Info and Relationships, A; 2.4.1 Bypass Blocks, A)

*Verdict: partly-confirmed* · Affected: sitewide (theme template), verified on all 10 tested pages, /this-page-does-not-exist-a11y-check/, /mothers-day-messages-for-wife-what-she-actually-wants/

**Evidence.** The raw HTML of all 10 pages has 0 <main>, 0 <header>, 0 <footer>, 0 role=main/banner/contentinfo, and no skip link. The content wrapper is `div#main.penci-main-single-page-default` and the footer is `div#footer-section-container`. The Chromium AX tree lists only 2 unnamed 'navigation' landmarks, plus 'search' on the 404, 'form' on /contact-us/ and FAQ 'region's on /be-an-angel-day-messages/. axe 'region' flags 5-77 content nodes outside landmarks per page (77 on the post, 41 on /archive/), and 'landmark-unique' fires on every run. Keyboard users need 10 Tab presses on desktop (logo, 4 menu links, 5 invisible off-canvas links) before the first content link. Most pages still offer heading navigation, but the 404 page has no headings and no main landmark; axe 'bypass' returns 'needs review' there.
[Verifier] axe 'region' counts: 15 on /, 78 on the post, 41 on /archive/ before Load More and 87 after. The 404 AX tree has no headings but does have a 'search' landmark and a 'Back to Home Page' link. The auditor's own desktop /contact-us/ axe run was on a 429 'Whoops!' error page (that is where its html-has-lang and landmark-one-main hits came from). My live re-run of /contact-us/ returned 200, with image-alt 1, landmark-unique 1 and region 6.

**Fix.** In the Soledad header/footer templates, wrap the header builder in `<header>`, turn `div#main` into `<main id="main">` (or add role="main"), and wrap the footer in `<footer>`. Add `<a class="skip-link screen-reader-text" href="#main">Skip to content</a>` as the first focusable element, visible on focus. Give each nav a unique aria-label.

### [low] 578 generic 'Read more' links on archive pages (WCAG 2.4.4 Link Purpose (In Context), A: passes via the preceding heading; fails 2.4.9, AAA)

*Verdict: confirmed* · Affected: /archive/, /tag/alps/, 352 tag archives, 5 category archives, 5 author archives

**Evidence.** The crawl finds the link text 'Read more' 578 times on 364 URLs: 471 on tag pages, 49 on category, 49 on author and 9 on /archive/. The markup is `a.penci-btn-readmore` 'Read more' plus an fa-angle-double-right icon inside each `article.item`. /archive/ has 9 identical 'Read more' links, so a screen-reader links list shows nine indistinguishable entries. Each follows an `h2.grid-title` link to the same post, which counts as programmatic context (technique H80), so AA is met. There are also 30 'Browse Messages →' links on the homepage and hub pages, each under its card heading. The thumbnail link `a.penci-image-holder` has only a title attribute for its name.

**Fix.** Add the post title to each button's accessible name while keeping the visible text, e.g. `Read more<span class="screen-reader-text"> about Five Minutes With Bob</span>`, or `aria-label="Read more: Five Minutes With Bob"` (the visible words must stay at the start for 2.5.3). Alternatively hide the duplicate thumbnail and 'Read more' links from AT (aria-hidden plus tabindex=-1) so each post has a single title link.

### [low] Heading structure: 404 has no headings, homepage H1 is a full sentence, and some levels are skipped (WCAG 1.3.1, A; 2.4.6 Headings and Labels, AA)

*Verdict: confirmed* · Affected: /this-page-does-not-exist-a11y-check/, /, /wedding-messages/, /friendship-messages/, /inspiration-messages/, /thankyou-messages/, /mothers-day-messages-for-wife-what-she-actually-wants/ (post template, 49 posts), /19th-may-your-week-with-bob/

**Evidence.** 404 (all 404 URLs): the AX tree has 0 headings. 'OOPS! Page you're looking for doesn't exist' is a `p.sub-heading-text-404`, and the only other content is img alt '404'. Homepage: the H1 is a 26-word sentence ('The message you write on a card is often the icing on the cake. A beautiful card captures the moment, but the words inside…'). The category cards are H3 directly under it (axe heading-order), and the H2 'COMING UP THIS MONTH' has a Font Awesome private-use glyph U+F005 in its accessible name. The crawl shows the same H1->H3 skip on /wedding-messages/, /friendship-messages/, /inspiration-messages/ and /thankyou-messages/, and H2->H4 on 2 posts. On posts, prev/next titles are `h5.prev-title` after H2 content headings (axe heading-order), followed by 'LEAVE A COMMENT' H3 -> 'YOU MAY ALSO LIKE' H4 -> related-post H3s. The crawl also shows 2 visible H1s on /19th-may-your-week-with-bob/; the browser re-check got a 429, so this is not browser-verified. Checked and cleared: the duplicate H1 and the empty “” message blocks on 140 pages are inside containers with elementor-hidden-desktop/tablet/mobile (display:none at all 3 active breakpoints). The AX tree on /birthday-messages-for-mom/, /be-an-angel-day-messages/ and /sympathy-condolences-messages/ shows exactly 1 H1 and 0 “” text nodes at desktop and mobile, so screen readers do not read them.
[Verifier] - The homepage H1 is 30 words, not 26, and it is styled as 14px/600 body text, so visually it does not read as a heading at all.
- /19th-may-your-week-with-bob/ is now browser-verified (200): 2 visible H1s, the post title '19th May: Your Week With Bob' and 'Congratulations Princess Marcus' inside .inner-post-entry.
- The author archive also has H1 'Bob' → H5 'Bob' (axe heading-order).
- Besides the '404' image, the 404 page also has a search form and a 'Back to Home Page' link.

**Fix.** 404 template: make the message an `<h1>` ('Page not found') and give the search input a real label. Homepage: use a short H1 (e.g. 'Card messages & what to write in a card'), turn the sentence into a paragraph, and make the card titles H2 (or add an H2 above them). Hide the decorative star with aria-hidden. Post template: change prev/next `h5` to non-heading text or H2/H3 in sequence, and use a consistent level for the comment and related-post headings. Delete the always-hidden template containers to cut DOM weight.

### [low] Image alt text problems: alt="arrow" in jump-menu link names, alt-less email icon, date-badge alts, SEO-string logo alt (WCAG 1.1.1 Non-text Content, A; 2.4.4 Link Purpose, A)

*Verdict: confirmed* · Affected: /birthday-messages/, /contact-us/, /, 159 pages contain alt="arrow" images (26 pages visibly, e.g. /fathers-day-messages/, /everyday-messages/, /4th-of-july-messages/)

**Evidence.** The jump menu `ul.penci-sub-menu.mega-menu-list a[href^="#"] > img[alt="arrow"][title="arrow"]` (arrow.png, 16px) gives link names 'arrow For Her', 'arrow For Him', 'arrow For Anyone', 'arrow By Milestone', 'arrow Zodiac Birthday' and 'arrow Belated Birthday' in the Chromium AX tree on /birthday-messages/. The crawl has 287 such images on 159 pages; about 154 jump links on 26 pages are visible, and the rest sit in hidden template blocks. /contact-us/: `div.imgtxt > img` (email-2.png) has no alt attribute (axe image-alt, impact critical, both viewports) next to the plain-text address bob@123greetings-inc.com. Homepage 'Coming up' badges `figure.elementor-image-box-img a[tabindex=-1] > img` use alt '31oct', '4th Oct', '02 Oct' and '11 oct', which screen readers expose as extra links duplicating the title links. The logo link's only name is its 90-character alt '123Greetings Blog – Free eCards, Card Message Ideas & What to Write in Any Greeting Card', repeated in 5 logo copies per page.
[Verifier] Minor corrections: the logo alt is 88 characters, not 90. There are 5 img elements with that alt per page, but only 2 are rendered: the header logo and the off-canvas drawer logo at x=-238.

**Fix.** Give decorative icons empty alt and no title: alt="" on arrow.png (or draw the arrow in CSS ::before) and on email-2.png. For the date badges use alt="" (the title link already names the destination) or a real date such as 'October 31'. Set the logo alt to '123Greetings Blog home' (or '123Greetings Blog'), and hide the duplicate off-canvas and sidebar logos from assistive tech along with their drawers.

### [low] Link-based custom controls: 'Load More Posts' name mismatch and silent loading, 'Read More' toggle without state, mouse-only go-to-top (WCAG 2.5.3 Label in Name, A; 4.1.2, A; 4.1.3, AA)

*Verdict: confirmed* · Affected: /archive/, /, sitewide (go-to-top: every page)

**Evidence.** /archive/: `a.penci-ajax-more-button[href="#"][aria-label="More Posts"]` shows the text 'Load More Posts'. The aria-label replaces the visible text, so speech-input users saying 'click Load More Posts' get no match (2.5.3). Pressing Enter loaded 9 more posts (9 -> 18 articles), but focus stayed on the button and no live region announced anything. The only live region on the page is the cookie banner. Homepage: `a.read-toggle[href="#"]` 'Read More' expands 4 `.hidden-content` blocks (height 0 -> 63/84/63/42 px). It has no aria-expanded or aria-controls, and pressing Space on it scrolled the page by 787 px instead of toggling. The collapsed text (max-height:0; overflow:hidden) is still read by screen readers, so the toggle does nothing useful for them. `div.penci-go-to-top-floating` is a div with an icon: tabIndex -1, no role, no name, mouse-only (keyboard users have Home/Ctrl+Home, so this is a minor gap).

**Fix.** Load More: drop the aria-label (or make it 'Load more posts'), make it a `<button type="button">`, and after loading announce 'N more posts loaded' in a polite status region or move focus to the first new post's heading. Read More: use `<button type="button" aria-expanded="false" aria-controls="home-intro-more">`, flip aria-expanded, and collapse with `hidden`/display:none rather than max-height so the state matches for screen readers. Go-to-top: use `<button aria-label="Back to top">` or `<a href="#top">`.

### [low] Links inside post paragraphs are set apart mainly by colour (1.63:1 against body text, no underline) (WCAG 1.4.1 Use of Color, A, borderline)

*Verdict: verifier-found* · Affected: /mothers-day-messages-for-wife-what-she-actually-wants/, all 49 posts (sitewide rule a{text-decoration:none} in Soledad main.css)

**Evidence.** On /mothers-day-messages-for-wife-what-she-actually-wants/ the in-paragraph link 'free Mother’s Day card collection' is rgb(0,83,123), Poppins 500, text-decoration none. The surrounding paragraph text is rgb(46,46,46), Poppins 400. Link-to-text contrast is 1.63:1, well under the 3:1 needed for colour-only differentiation (G183). An underline appears only on hover, together with a colour change to rgb(255,138,101). The only non-colour cue is the 500 vs 400 weight, which is subtle in Poppins (screenshot /home/user/Message_Board/site-audit/agent-work/a11y-verify/shots/post_inline_link.png). axe link-in-text-block passes it because of that weight difference, so this is a judgement call, not an automated failure.

**Fix.** Underline links in body copy with Additional CSS: `.inner-post-entry p a, .inner-post-entry li a, .elementor-widget-text-editor p a{text-decoration:underline;text-underline-offset:2px}`. Keep the hover/focus colour change as an extra cue.

### [low] Share icons on Load-More posts are 12-13 px wide and packed together (WCAG 2.5.8 Target Size (Minimum), AA)

*Verdict: verifier-found* · Affected: /archive/

**Evidence.** Live /archive/ (desktop): after pressing Enter on 'Load More Posts' (9 → 18 articles), axe target-size reports 18 nodes, 2 on each of the 9 newly loaded cards. They are `a.post-share-item.post-share-whatsapp[aria-label="Share on Whatsapp"]` at 12x21 px and `a.post-share-item.post-share-link[aria-label="Copy Post Link"]` at 13x21 px, too close together for the 24 px spacing exception. The initially rendered cards and the tag, category and author archives did not trigger it.

**Fix.** Enlarge the hit area without changing the icon, e.g. `.penci-post-share-box .post-share-item{display:inline-flex;align-items:center;justify-content:center;min-width:24px;min-height:24px}`. Also check why the AJAX-loaded card markup or CSS differs from the server-rendered cards.


<details><summary><b>Table: axe-core 4.10.2 violations per page (tags wcag2a/aa, wcag21a/aa, wcag22aa, best-practice)</b> (20 rows)</summary>

| path | viewport | button-name (4.1.2) | color-contrast (1.4.3) | image-alt (1.1.1) | heading-order (bp) | landmark-unique (bp) | region (bp) nodes | other / note |
|---|---|---|---|---|---|---|---|---|
| / | desktop | 0 | 0 | 0 | 1 | 1 | 14 |  |
| /birthday-messages/ | desktop | 0 | 0 | 0 | 0 | 1 | 5 |  |
| /birthday-messages-for-mom/ | desktop | 7 | 0 | 0 | 0 | 1 | 11 |  |
| /be-an-angel-day-messages/ | desktop | 5 | 0 | 0 | 0 | 1 | 10 |  |
| /sympathy-condolences-messages/ | desktop | 10 | 0 | 0 | 0 | 1 | 14 |  |
| /mothers-day-messages-for-wife-what-she-actually-wants/ | desktop | 0 | 6 | 0 | 1 | 1 | 77 |  |
| /archive/ | desktop | 0 | 1 | 0 | 0 | 1 | 41 |  |
| /tag/alps/ | desktop | 0 | 3 | 0 | 0 | 1 | 9 |  |
| /contact-us/ | desktop | 0 | 0 | 1 | 0 | 1 | 6 | re-run (first load returned 429) |
| /this-page-does-not-exist-a11y-check/ | desktop | 0 | 0 | 0 | 0 | 1 | 6 | bypass: needs review |
| / | mobile | 0 | 0 | 0 | 1 | 1 | 14 |  |
| /birthday-messages/ | mobile | 0 | 0 | 0 | 0 | 1 | 5 |  |
| /birthday-messages-for-mom/ | mobile | 7 | 0 | 0 | 0 | 1 | 11 |  |
| /be-an-angel-day-messages/ | mobile | 5 | 0 | 0 | 0 | 1 | 10 |  |
| /sympathy-condolences-messages/ | mobile | 10 | 0 | 0 | 0 | 1 | 14 |  |
| /mothers-day-messages-for-wife-what-she-actually-wants/ | mobile | 0 | 4 | 0 | 1 | 1 | 77 |  |
| /archive/ | mobile | 0 | 1 | 0 | 0 | 1 | 41 |  |
| /tag/alps/ | mobile | 0 | 3 | 0 | 0 | 1 | 9 |  |
| /contact-us/ | mobile | 0 | 0 | 1 | 0 | 1 | 6 |  |
| /this-page-does-not-exist-a11y-check/ | mobile | 0 | 0 | 0 | 0 | 1 | 6 |  |

</details>


<details><summary><b>Table: Colour contrast measured (computed colours, WCAG 2.x formula)</b> (10 rows)</summary>

| foreground | background | size/weight | where | ratio | required | result |
|---|---|---|---|---|---|---|
| #c8401e | #ffffff | 32px/600 heading; 15px/700 link | /be-an-angel-day-messages/ 'Be an Angel Day', 'Be an Angel Day cards' | 4.99 | 4.5 | pass |
| #c8401e | #faf6ee | 32px/600 heading | hub/message page intros ('wishes & card ideas') on birthday, mom, angel, sympathy | 4.63 | 3.0 (large) | pass |
| #c8401e | #1a1614 | 34px/400 | /birthday-messages/ 'you writing to?' | 3.6 | 3.0 (large) | pass |
| #2e2e2e | #ffffff | 16px/400 body | all pages | 13.58 | 4.5 | pass |
| #888888 | #ffffff | 13-15px/400 | breadcrumbs, dates, 'previous/next post', '0 comments' (tag archives, posts) | 3.54 | 4.5 | FAIL |
| #999999 | #ffffff | 12px/600 | 'Load More Posts' on /archive/ | 2.85 | 4.5 | FAIL |
| #ffffff | #faf6ee | ~27px italic | homepage card titles when focused | 1.08 | 3.0 (large) | FAIL |
| #757575 | #ffffff | placeholder | contact/comment form placeholders (the only labels) | 4.61 | 4.5 | pass |
| #dc3232 | #ffffff | CF7 error tip | /contact-us/ (static CSS) | 4.62 | 4.5 | pass |
| #ffffff | #00537b | 14.4px/700 | cookie 'Accept' button | 8.32 | 4.5 | pass |

</details>


<details><summary><b>Table: Keyboard tab order, homepage desktop 1366x900 (first 13 stops)</b> (13 rows)</summary>

| stop | element | accessible name | position (x,y,w,h) | visible? | focus indicator |
|---|---|---|---|---|---|
| 1 | .pc-logo-desktop a | 123Greetings Blog – Free eCards, … | 98,13,175,23 | yes | none |
| 2 | #menu-my-main-header-1 a | Home | 779,22,50,40 | yes | none |
| 3 | #menu-my-main-header-1 a | About Us | 859,22,75,40 | yes | none (shots/desktop_home_tab03.png) |
| 4 | #menu-my-main-header-1 a | What to write in a card | 964,22,185,40 | yes | none |
| 5 | #menu-my-main-header-1 a | Contact Us | 1179,22,89,40 | yes | none |
| 6 | #penci_off_canvas .pb-logo-sidebar-mobile a | 123Greetings Blog – … | -238,31,146,23 | NO (off-screen) | n/a |
| 7 | #menu-my-main-header-2 a | HOME | -310,100,290,43 | NO (off-screen) | n/a |
| 8 | #menu-my-main-header-2 a | ABOUT US | -310,144,290,43 | NO (off-screen) | n/a |
| 9 | #menu-my-main-header-2 a | WHAT TO WRITE IN A CARD | -310,188,290,43 | NO (off-screen) | n/a |
| 10 | #menu-my-main-header-2 a | CONTACT US | -310,232,290,43 | NO (off-screen) | n/a |
| 11 | .read-more-content a | 123Greetings | 111,205,91,17 | yes | none |
| 12 | a.read-toggle | Read More | 93,276,78,23 | yes | none |
| 13 | input#gsc-i-id1 | search | 151,336,532,24 | yes | none (caret only) |

</details>


## Content strategy & gaps

### [critical] No Christmas, New Year, Hanukkah, Kwanzaa, Diwali, Valentine's Day or Lunar New Year content in the 4 months that matter most for greeting cards

*Verdict: confirmed* · Affected: /christmas-messages/, /new-year-messages/, /hanukkah-messages/, /kwanzaa-messages/, /diwali-messages/, /valentines-day-messages/, /lunar-new-year-messages/, /remembrance-day-messages/ (+2 more)

**Evidence.** I requested 84 candidate slugs with sequential curl, 1 s apart. Every seasonal one returned 404, including christmas-messages, christmas-wishes, merry-christmas-messages, christmas-messages-for-family/-friends/-coworkers/-boss, christmas-card-messages, holiday-messages, season-greetings-messages, new-year(s)-messages, happy-new-year-messages, valentines-day-messages, valentine-messages, diwali-messages, dussehra-messages, karva-chauth-messages, bhai-dooj-messages, hanukkah-messages, kwanzaa-messages, lunar-/chinese-new-year-messages, remembrance-day-messages, boxing-day-messages, winter-messages, mlk-day-messages, friendsgiving-messages, black-friday-messages and world-kindness-day-messages. The WordPress REST API (/wp-json/wp/v2/pages, 247 pages) has no slug containing christmas, xmas, holiday, new-year, valentine, diwali, hanukkah, kwanzaa, eid, ramadan, lunar or winter. Site search: /?s=christmas returns only an unrelated brother-birthday post, and /?s=diwali and /?s=valentine return 'Sorry, but nothing matched'. The 12-month calendar on /what-to-write-in-a-card/ (parsed from live HTML) links to 0 pages under December, 0 under January, 0 under February and 2 under March. Verified 2026-27 dates: Dussehra Tue 20 Oct; Diwali (Lakshmi Puja) Sun 8 Nov (Dhanteras 6 Nov, Bhai Dooj 11 Nov); Veterans/Remembrance Day Wed 11 Nov; US Thanksgiving Thu 26 Nov; Hanukkah from sundown Fri 4 Dec to Sat 12 Dec; Christmas Fri 25 Dec; Kwanzaa 26 Dec-1 Jan; New Year Fri 1 Jan; MLK Day Mon 18 Jan; Lunar New Year Sat 6 Feb; Valentine's Day Sun 14 Feb 2027. Meanwhile, of the 90 pages published since 2026-08-01 (REST API dates), 32 are micro-observances such as Oatmeal Day, Candy Corn Day, Chocolate Milk Day and Pumpkinfest Tennessee, and new pages have a median of 5 messages. The audience is clearly interested in these festivals: Raksha Bandhan (21 messages), Rosh Hashanah (21) and Sukkot pages already exist.

**Fix.** Keep the auditor's publishing order and dates. Change the Valentine's step: /red-rose-day-messages/ targets Jun 12 (in its title), /international-kissing-day-messages/ Jul 6, /teddy-bear-day-messages/ Sep 9 (its FAQ says so), /hug-week-messages/ is filed under July and /chocolate-day-messages/ under July and October. Don't relabel them as Valentine's Week children. Build dedicated Rose/Propose/Chocolate/Teddy/Promise/Hug/Kiss Day (7-14 Feb) sections or pages under a /valentines-day-messages/ hub, and cross-link the summer pages only as 'related'. Publish Diwali and Dussehra now: Dussehra is 20 Oct, so a '12-20 Oct' target is too late for that one.

### [high] Core evergreen occasions and relationships are missing, and the only retirement content is hidden in a mislabelled orphan page

*Verdict: partly-confirmed* · Affected: /retirement-messages/, /at-work-messages/, /good-luck-messages/, /new-job-messages/, /farewell-messages/, /housewarming-messages/, /baby-shower-messages/, /bridal-shower-messages/ (+9 more)

**Evidence.** These slugs all returned 404 live on 2026-09-30: retirement-, good-luck-, new-job-, promotion-, farewell-, goodbye-, welcome-, housewarming-, new-home-, baby-shower-, bridal-shower-, miss-you-, thinking-of-you-, good-morning-, good-night-, pet-sympathy-, loss-of-mother-sympathy-, encouragement-, funny-birthday-, religious-birthday-messages; birthday-messages-for-friend/-kids/-cousin/-twins/-dog/-employee/-sister-in-law/-brother-in-law/-daughter-in-law/-son-in-law; anniversary-messages-for-couple/-sister-in-law. Also missing: memorial-day-, juneteenth-, womens-day/international-womens-day-, nurses-day-, administrative-professionals-day-/secretary-day-, eid-, eid-mubarak-, ramadan-, st-patricks-day-, holi-, navratri-, passover-messages. /birthday-messages-for-girl/ and /birthday-messages-for-boy/ are 301-redirected by WordPress's slug guessing to /birthday-messages-for-girlfriend/ and /birthday-messages-for-boyfriend/, so a parent looking for a child's birthday message lands on romantic wishes. The only retirement content is /at-work-messages/, titled '50+ Workplace Messages — Professional Wishes for Colleagues': all 6 of its messages are retirement wishes ('Happy retirement! You've officially graduated from deadlines…'), and no page links to it. /happiness-happens-day-messages/ links to 'Encouragement Messages' at /encouragement-inspiration-messages/, which is a 404.
[Verifier] Dedicated URLs are missing (404) for retirement, good luck, new job, promotion, farewell, housewarming, thinking of you, miss you, good morning/night, birthday for friend/kids, and the others listed. Several topics do exist as H2 sections live on 2026-09-30. /congratulations-messages/: Retirement 3, New Job 3, Promotions & Career Success 5, Housewarming 6. /everyday-messages/: Good Morning 29, Good Night 13, Good Luck 11, Miss You 9, Thinking of You 4. /sympathy-condolences-messages/ has 1 pet-loss message. /at-work-messages/ (6 retirement messages, 0 inlinks) is therefore a second retirement page, not the only one.

**Fix.** Build the dedicated pages by seeding them from the existing sections rather than from scratch. /retirement-messages/ merges the 6 /at-work-messages/ messages with the 3 Retirement messages on /congratulations-messages/. /good-morning-messages/ starts from 29, /good-night-messages/ from 13, /good-luck-messages/ from 11 and /miss-you-messages/ from 9 on /everyday-messages/. Expand each to 40+. Keep a short excerpt plus a link on the source pages so they become hubs. For /at-work-messages/, add an explicit 301 with the Redirection plugin (available on Atomic) or the Yoast Premium redirect manager. WordPress only records old-slug redirects for non-hierarchical post types, so renaming a page slug creates no redirect. Replace WordPress's slug-guess redirect for -girl/-boy with real kids' birthday pages or explicit redirects. The remaining gaps (in-laws, cousin, pet sympathy, spring backlog) stand as written.

### [high] Internal linking is a single thread: 215 of 247 pages have exactly one in-content inbound link, 5 have none, and the hubs skip sibling pages

*Verdict: confirmed* · Affected: /what-to-write-in-a-card/, /birthday-messages/, /anniversary-messages/, /thankyou-messages/, /friendship-messages/, /inspiration-messages/, /wedding-messages/, /at-work-messages/ (+2 more)

**Evidence.** I built a link graph from the in-content (in_main) links of all 668 crawled URLs, normalising http and trailing slashes. Of 247 pages, 215 have exactly 1 in-content inbound link and 5 have 0 (/at-work-messages/, /archive/, /upcoming-events/, plus /about-us/ and /contact-us/, which are nav-only). The single source is /what-to-write-in-a-card/ for 93 pages (most sit inside the month tabs, and only the current month is expanded), /anniversary-messages/ for 52, /birthday-messages/ for 51, /thankyou-messages/ for 6, /friendship-messages/ for 5, /wedding-messages/ for 5 and /inspiration-messages/ for 3. The birthday hub (57 children) and anniversary hub (52) do link every child in their families. The others miss siblings. /thankyou-messages/ doesn't link /thank-you-messages/, /national-thank-you-day-messages/ or /thank-you-day-messages/. /friendship-messages/ doesn't link /friendship-day-messages/, /friendship-week/, /national-best-friends-day-messages/, /womens-friendship-day-messages/, /friendship-anniversary-messages/, /birthday-messages-for-best-friend/ or /keep-in-touch-messages/. /inspiration-messages/ doesn't link /national-day-of-encouragement-messages/ or /positive-thinking-day-messages/. /wedding-messages/ doesn't link /engagement-messages/, /wedding-anniversary-messages/ or /messages-for-1st-anniversary/. 227 of 235 message pages link to no other blog page, so there are no links back to their hub or across to siblings. /what-to-write-in-a-card/ links 7 pages over http:// (be-an-angel, girlfriends-day, just-because-day, senior-citizen, smile-month, thank-you-day, true-love-forever) and /canada-day-messages without a trailing slash, which adds redirect hops.

**Fix.** Add a template-level 'Related messages' block to every message page: a link up to its hub (breadcrumb), 4-6 siblings from the same family, and 2 cross-family links (e.g. birthday for mom ↔ anniversary for mom ↔ Mother's Day). Have each hub link every page in its topic, including the day and observance pages listed here. Add a 'Browse all occasions A-Z' block so pages don't depend on a collapsed tab. Fix the 8 http and no-slash links. Link /retirement-messages/ (ex-/at-work-messages/) from the hub. Either build /upcoming-events/ or remove it (see the freshness finding).

### [high] The autumn and winter holiday pages that do exist use a 5-message template and are much weaker than the summer holiday pages

*Verdict: partly-confirmed* · Affected: /thanksgiving-day-messages/, /canadian-thanksgiving-messages/, /halloween-messages/, /veterans-day-messages/, /day-of-the-dead-messages/, /all-saints-day-messages/, /bosss-day-messages/, /sweetest-day-messages/ (+6 more)

**Evidence.** Messages and words per pages.json: Thanksgiving (26 Nov) 5 messages, 312 words, published 2026-09-30; Veterans Day (11 Nov) 5 messages, 317 words; Canadian Thanksgiving (12 Oct, 12 days away) 5 messages; Boss's Day (16 Oct) 5; Sweetest Day (17 Oct) 5; Day of the Dead 5; All Saints' Day 5; Guy Fawkes 5; Samhain 5; Halloween 11 messages, 356 words; Fall 10 messages with no eCard link; National Children's Day (filed under November) 3 messages, 53 words, no FAQ. Summer holidays for comparison: 4th of July 77 messages and 1,737 words, Father's Day 47 and 1,872, Canada Day 28 and 712, Mother's Day 29 and 1,462. None of the autumn pages has an intro paragraph (text goes straight from the H1 to the messages) or links to another blog page. Halloween, Samhain, Candy Corn Day, Pumpkin Day and Day of the Dead don't link to each other, and Thanksgiving doesn't link to Canadian Thanksgiving, Fall or the thank-you pages. The homepage 'Trending today' strip (Chromium render, 2026-09-30) still lists 'Summer', and lists 'Birthday' twice.
[Verifier] As stated, except: the homepage 'Trending today' strip (live, 2026-09-30) is Halloween, Anniversary, Birthday, Summer, Sympathy, so Birthday appears once and only 'Summer' is stale. No winter holiday pages exist at all.

**Fix.** As the auditor proposed. For the homepage strip, drop only 'Summer' and swap in upcoming occasions (Canadian Thanksgiving, Boss's Day, Halloween).

### [high] Thin template families: 122 of 235 message pages have 5 or fewer messages, 230 have no intro, and 227 link to no other blog page

*Verdict: confirmed* · Affected: /engagement-messages/, /messages-for-5th-anniversary/, /easter-messages/, /april-fools-day-messages/, /international-yoga-day-messages/, /national-blueberry-pie-day-messages/, /birthday-messages-for-taurus/, /messages-for-80th-birthday/ (+2 more)

**Evidence.** I scored 235 message pages (all 247 pages minus 6 hubs and /, about, contact, archive, what-to-write, upcoming-events) as 10 × messages + intro words/10 + 5 × FAQs + 5 for an eCard link + 5 for any internal link. Message-count distribution: 1 message on 2 pages, 2 on 4, 3 on 4, 4 on 8, 5 on 104, 6 on 33. 122 pages have 5 or fewer, 182 have fewer than 10, and 99 have under 200 words. 230 have no intro paragraph of 30+ words, 138 have no FAQ, 159 have no in-content link to a 123greetings.com eCard category, and 227 link to no other blog page. The 40 thinnest pages and a per-family breakdown are in the tables below. Every family has the same gaps. Zodiac (12 pages) has exactly 5 messages each, 98-149 words, and no sign dates or traits (those appear only on the hub). Milestone birthdays (13) have 4-11 messages, and 4 of them open with the same generic lead message. Milestone anniversaries (11) have 1-8 messages and no gift-tradition content; the 15th and 20th titles both read 'Crystal to China' and the 60th and 75th both read 'Diamond Jubilee'. Anniversary-by-relationship (31) has a median of 7 messages, with 0 FAQs, 0 eCard links and 0 internal links. Birthday-by-relationship (27) has a median of 6 and all 27 titles claim 40-150+. National days (62) follow the 5-messages-plus-5-FAQs template, while 12 older June-July pages have only 2-6 messages and no FAQ.

**Fix.** Per family. Zodiac: add a 60-word intro (dates and traits) and bring each sign to 20+ messages, including sign-trait jokes and ones for a partner, friend or mom; link the neighbouring signs and the hub. Milestone birthday and anniversary: write an intro specific to the age or year (what it means, traditional gift and colour for anniversaries), make every message mention the number, and split sections for spouse vs couple and funny vs heartfelt. Relationship pages: at least 30 messages in tone sections (heartfelt, funny, short, religious) plus 3 FAQs. Micro-days with 2-4 messages (yoga, blueberry pie, tap dance, red rose, sneak-a-kiss, kissing day, children's day): expand them, merge them into a sibling, or noindex them until they are expanded. /engagement-messages/ (1 message), /easter-messages/ (2) and /messages-for-5th-anniversary/ (1) are linked from the main hubs and should be the first rewrites. Every page gets a 'related messages' module listing its hub and 4-6 siblings.

### [high] Title-promise gap: none of the 125 titles that claim a count delivers it. Claimed 8,840 messages, delivered 1,251, short by 7,589

*Verdict: partly-confirmed* · Affected: /birthday-messages/, /anniversary-messages/, /birthday-messages-for-wife/, /birthday-messages-for-girlfriend/, /birthday-messages-for-husband/, /birthday-messages-for-mom/, /engagement-messages/, /anniversary-messages-for-brother/ (+3 more)

**Evidence.** Method: pages.json message_blocks whose text is non-empty once quotes are stripped, compared with the first 'N+' in <title>. 125 of the 296 pages and posts have a count in the title and all 125 fall short. The full table is below. Totals: 8,840 claimed, 1,251 present, 7,589 missing. Hubs claim hundreds but hold no messages themselves: /birthday-messages/ says '500+' with 0 on the page, and its 57 child pages hold only 362 between them (the children's titles claim 3,850). /anniversary-messages/ says '250+' with 0 on the page (406 across 52 children). The /friendship-messages/ meta description claims '80+' but its 5 children hold 37. Worst single pages: /birthday-messages-for-wife/ claims 150+ and has 4; /engagement-messages/ 100+ has 1; /anniversary-messages-for-brother/ 100+ has 3; /easter-messages/ 75+ has 2; /messages-for-5th-anniversary/ 50+ has 1; /birthday-messages-for-mom/ 115+ has 7. The post 'Mother's Day Wishes for Stepmom: 50+ Heartfelt Card Messages' contains 3 example card lines. I re-checked live with curl on 2026-09-30 and got the same counts: wife 4, engagement 1, 5th anniversary 1, Easter 2. No 'load more' or AJAX-loaded messages exist.
[Verifier] Reproduced exactly: 125 titles with 'N+' (124 pages and 1 post); 8,840 claimed, 1,251 present, 0 pages meet the claim, median 10% delivered. Live 2026-09-30: /birthday-messages-for-wife/ 4 (Chromium, after full scroll, no load-more), /birthday-messages-for-mom/ 7, /engagement-messages/ 1, /messages-for-5th-anniversary/ 1, /easter-messages/ 2, /anniversary-messages-for-brother/ 3, /birthday-messages/ 0. The stepmom post actually has 3 example lines (counted as 0), and /national-best-friends-day-messages/ has about 10 message-like quotes (5 counted).

**Fix.** Step 1, this week: take the numbers out of every title, meta description and H1 (use a template such as 'Birthday Messages for Wife: Romantic & Heart-Touching Wishes'), or state the true count. Put a count back only once a page actually holds it. Step 2: fill the 20 highest-intent pages to at least 40-60 real messages each. Start with the ones the homepage links to (mom, wife, husband, dad, daughter, son) and then sister, brother, best friend, girlfriend, boyfriend, sympathy, get well, thank you, sorry, graduation and engagement. Honouring every current title would take 7,589 new messages, so trimming the claims is the realistic first step. Step 3: give the hubs their own content (e.g. 2-3 top messages per child card, 60-150 in total) or remove the hub numbers. Add a pre-publish check so a title count can never exceed the number of messages on the page.

### [medium] Cannibalising and near-duplicate page groups: 11 groups need a merge or 301, or a clear difference in scope

*Verdict: partly-confirmed* · Affected: /thank-you-messages/, /thankyou-messages/, /national-thank-you-day-messages/, /thank-you-day-messages/, /dance-day-messages/, /national-tap-dance-day-messages/, /wedding-anniversary-messages/, /relationship-anniversary-messages/ (+9 more)

**Evidence.** Full group table below. Key cases. (1) /thank-you-messages/ ('100+ Thank You Messages', 23 messages, linked from the homepage) competes with the hub /thankyou-messages/ ('Heartfelt Thank You Messages, All Occasions', H1 'Thankyou Messages', 0 messages, linked from /what-to-write-in-a-card/). Neither links to the other. (2) /national-thank-you-day-messages/ and /thank-you-day-messages/ each have 5 messages that paraphrase each other ('I don't say it often enough, but I'm grateful for you' vs 'I don't say it nearly enough, but I'm so grateful for you'). Their message vocabulary overlaps 0.39 (Jaccard), the highest of any pair checked; the next highest is 0.32. Neither page states a date. (3) /national-tap-dance-day-messages/ has 4 messages that all say 'Dance Day' and one is repeated. /dance-day-messages/ (International Dance Day) has 6 romantic 'my love' messages. (4) /wedding-anniversary-messages/, /relationship-anniversary-messages/ and /dating-anniversary-messages/ were all published 2026-08-22 with 5 messages each (vocabulary Jaccard 0.20-0.32), while the /anniversary-messages/ hub holds none. (5) /business-anniversary-messages/ and /company-anniversary-messages/ were both published 2026-08-25 with 5 messages each (Jaccard 0.22). (6) /more-inspiration-messages/ is titled '80+ Words of Encouragement' but its H1 is 'More inspiration Messages'. It overlaps /inspiration-messages-motivation/ (0.30) and /national-day-of-encouragement-messages/, and the encouragement link on /happiness-happens-day-messages/ is a 404. (7) The fiancé and fiancée anniversary pages have 14 messages each, and only 1 of the 28 names the fiancé(e). (8) There are 5 belated-birthday pages with 4-6 messages each and no /belated-birthday-messages/ pillar.
[Verifier] As stated, with these corrections. The tap-dance page has 4 messages; 3 say 'Dance Day' and one is repeated. The fiancé(e) pages have 14 messages each; 7 of 28 reference the engagement or wedding, and 2 on /anniversary-messages-for-fiance/ address an engaged couple ('Happy Anniversary to a wonderful couple! May your engagement…') instead of the reader's own fiancé. The thank-you-day Jaccard is about 0.39-0.40.

**Fix.** As proposed, plus two changes. Rewrite the 2 couple-addressed fiancé messages (or move them to an engagement page). Implement every 301 as an explicit redirect with the Redirection plugin or Yoast Premium: WordPress creates no old-slug redirect when a page's slug changes or a page is deleted. After each 301, update the source links on /what-to-write-in-a-card/, the hubs and the homepage cards.

### [medium] Half of the occasion pages never say when the occasion is, and the month calendar misfiles some of them

*Verdict: verifier-found* · Affected: /bosss-day-messages/, /candy-corn-day-messages/, /national-cat-day-messages/, /samhain-messages/, /thanksgiving-day-messages/, /grandparents-day-messages/, /rosh-hashanah-messages/, /mothers-day-messages/ (+5 more)

**Evidence.** I took the 85 day/week/month/holiday pages in pages.json (birthday pages excluded) and pattern-searched title, meta description, body and FAQ text for a calendar date ('Oct 16', '16th October'), a weekday rule ('fourth Thursday') or 'in/every <Month>'. 42 pages have none. They include every imminent October-November page except Canadian Thanksgiving, Halloween and Veterans Day: Boss's Day (Fri 16 Oct; FAQ 'What is Boss's Day?' gives no date), Candy Corn Day (30 Oct), National Cat Day (29 Oct), Samhain (31 Oct-1 Nov) and Thanksgiving (Thu 26 Nov; none of its 5 FAQs gives the date). Grandparents Day, Rosh Hashanah, Mother's Day, both thank-you-day pages and about 30 micro-days also lack one. 'When is X day' is the main informational query for these observances. The live /what-to-write-in-a-card/ calendar also misfiles pages. /dance-day-messages/, titled '30+ International Dance Day Messages & Wishes (Apr 29)', sits only in the July tab and is absent from April. /national-childrens-day-messages/ (published 10 Jun; US National Children's Day is the 2nd Sunday of June) sits only in November and doesn't say which Children's Day it covers. /chocolate-day-messages/ sits in both July and October, has romantic 'my love' messages and gives no date.

**Fix.** Add a one-line 'When is it?' statement under each H1, giving the recurring rule plus the next date (e.g. "Boss's Day is 16 October each year (observed the nearest weekday). Next: Friday 16 October 2026."). Add a 'When is X?' FAQ as the first accordion item. Keep the next-date values in the annual refresh sheet the auditor proposed, so they don't go stale the way the 2026 FAQs have. Re-file the calendar to match: Dance Day under April, Children's Day in June (and add India's 14 Nov / Universal 20 Nov only if the page covers them), and give Chocolate Day an explicit scope (World Chocolate Day 7 Jul vs National Chocolate Day 28 Oct vs Valentine's Week 9 Feb).

### [medium] High-demand evergreen intents are buried as sections of two catch-all pages with no dedicated URL

*Verdict: verifier-found* · Affected: /everyday-messages/, /congratulations-messages/, /good-morning-messages/, /good-luck-messages/, /retirement-messages/, /new-job-messages/

**Evidence.** Live on 2026-09-30, I counted H2 sections and .msgs paragraphs. /everyday-messages/ ('Everyday Messages & Wishes — Brighten Someone's Day') has 111 messages, the most of any page on the site: Good Morning 29, Good Night 13, Enjoy the Weekend 12, Good Luck 11, Miss You 9, Sorry 8, Monday Motivation 7, Have a Great Day 6, You are Welcome 6, Thinking of You 4, Get Well Soon 4, Monday Blues 2. Its only inlinks are /what-to-write-in-a-card/, /happiness-happens-day-messages/ and /national-relaxation-day-messages/. It isn't on the homepage, and its title matches none of those intents. /congratulations-messages/ (62 messages, 1 inlink, from /what-to-write-in-a-card/) bundles General Achievement 12, Housewarming 6, New Baby 5, Promotions & Career Success 5, Graduation 4, New Job 3 and Retirement 3, plus 5 tone sections. The matching dedicated slugs (good-morning-, good-night-, good-luck-, miss-you-, thinking-of-you-, retirement-, new-job-, promotion-, housewarming-messages) all return 404. The auditor treated these topics as absent. In practice the site's largest message collection is filed under a non-query title, and several sections duplicate standalone pages (Get Well Soon vs /get-well-soon-messages/ with 18 messages, Sorry vs /sorry-messages/ with 15, New Baby vs /new-baby-messages/ with 40).

**Fix.** Split the sections into dedicated pages, seeded from the existing messages and expanded to 40+ each. Start with Good Morning (29), Good Night (13), Good Luck (11), Miss You (9) and Retirement (3 here plus 6 on /at-work-messages/), then New Job/Promotion and Housewarming. Keep /everyday-messages/ and /congratulations-messages/ as hubs: 2-3 sample messages per section with a 'See all good morning messages' link. For sections that duplicate existing pages (Get Well, Sorry, New Baby), link to those pages instead of keeping a second copy. Link the new pages from the homepage cards and the /what-to-write-in-a-card/ evergreen block. These are new URLs, so no redirects are needed.

### [medium] Stale and empty pages: /upcoming-events/ is blank, 2026 dates are baked into titles and FAQs, and the blog stopped on 2 Aug

*Verdict: partly-confirmed* · Affected: /upcoming-events/, /birthday-messages-for-boss/, /birthday-messages-for-son/, /messages-for-10th-anniversary/, /messages-for-40th-birthday/, /say-hey-day-messages/, /you-go-girl-day-messages/, /happy-mothers-day-2026-messages-what-to-write-in-the-card/ (+5 more)

**Evidence.** /upcoming-events/ was published 2026-06-19, is 'index, follow', is in the page sitemap and has 0 inlinks. Rendered in Chromium (agent-work/content-strategy/upcoming.png) it shows only the header and footer: 0 characters of content and 259 body characters in total. 7 titles contain '2026' and will look out of date on 1 Jan 2027: /birthday-messages-for-boss/ '(2026)', /birthday-messages-for-son/ '(2026)', /messages-for-10th-anniversary/ '(2026)', /messages-for-40th-birthday/ '(2026)', 'Say Hey Day 2026', 'You Go Girl Day 2026', and the post 'Happy Mother's Day 2026 Messages'. FAQs give 2026 dates for events that have already passed: Father's Day 'June 21, 2026', Best Friends Day 'Monday, June 8, 2026', Labor Day 'September 7', Senior Citizen Day 'observed each year on August 21, 2026', Sukkot 'September 25', and the Mother's Day posts 'Sunday, May 10, 2026'. The dates I checked are correct for 2026 (e.g. Canadian Thanksgiving 12 Oct, Sweetest Day 17 Oct, Pumpkin Day Mon 26 Oct, Dessert Day Wed 14 Oct); the issue is that none of them has an annual refresh process. On 2026-09-30 the homepage 'Trending today' strip still shows 'Summer'. The last post is dated 2026-08-02. The hub /inspiration-messages/ shows 'META TITLE: … META DESCRIPTION: … KEY PHRASE: You can do it messages' as visible text and uses the default WordPress title, and the /anniversary-messages-for-brother/ title ends with 'Meta Title'.
[Verifier] As stated, except: the META text on /inspiration-messages/ is inside the collapsed 5th FAQ answer (visible on expand, present in the HTML). And posts stopped on 2026-08-02, but pages kept being published (45 in September, the latest on 2026-09-30).

**Fix.** As proposed. Remove the META TITLE, META DESCRIPTION and KEY PHRASE lines from the 5th accordion item's text-editor widget on /inspiration-messages/, and put them in that page's Yoast SEO title and meta description fields (the title currently uses the default template).

### [medium] Tag sprawl: 1,086 tags, 739 unused and 317 used once, with 347 thin tag archives indexable and in the sitemap

*Verdict: confirmed* · Affected: /tag/alps/, /tag/your-banking-credentials/, /tag/your-google-password/, /tag/bacteria/, /tag/bank-accountrelationships/, /tag/23/

**Evidence.** tags.json has 1,086 tags: 739 with 0 posts, 317 with 1 post, 16 with 2, 4 with 3, 3 with 4 and 7 with 6 or more (the largest are 'bob' with 44 and wake-up-with-bob with 13). 352 tag archives were crawled: all are 'index, follow', 347 are in the post_tag sitemap, and the median has 18.5 words. 318 of them list a single post; /tag/alps/, for example, lists only /five-minutes-with-bob-28th-july/. Many tags are nonsense or risky: your-banking-credentials, your-google-password, bacteria, dark-circles, good-hygiene, '23', bank-accountrelationships (a typo), surprisingly, bought, countless, natural, important. Several posts are mis-tagged (see the story-posts finding). All 49 posts sit in a single category, '123greetings'.

**Fix.** In Yoast, set tag archives to noindex and drop them from the sitemap. Delete the 739 empty tags. Replace free tagging with a controlled list of about 15 topic tags that mirror the message hubs (birthday, anniversary, mother's day, sympathy, friendship, thank you, seasonal…), at most 3-5 per post, and 301 retired tag URLs that have links to the matching hub. Create 3-4 real categories (Stories & Guides, Bob's Journal, Seasonal).

### [medium] The 17 story posts never link to the matching message pages; their 'More … messages' links go to a generic hub, dead anchors or a 404

*Verdict: confirmed* · Affected: /mothers-day-wishes-for-stepmom-50-heartfelt-card-messages/, /mothers-day-messages-for-wife-what-she-actually-wants/, /mothers-day-card-messages-for-grandma-funny-heartfelt/, /birthday-card-messages-when-my-brother-and-i-stopped-talking-about-things-that-mattered/, /graduation-card-messages-when-my-dad-struggled-with-saying-he-was-proud-of-me/, /sorry-messages-for-coworkers-when-my-coworker-struggled-with-saying-sorry/, /love-messages-for-wife-the-thank-you-i-owed-my-wife-for-two-years/, /mothers-day-messages/

**Evidence.** There are 11 Mother's Day posts (30 Apr-10 May 2026, 1,163-1,548 words) and 6 'when my…' story posts (11-16 May, 862-964 words). All 17 link to eCard categories on www.123greetings.com. Their 'More X Messages' arrows point either to /what-to-write-in-a-card/, sometimes with anchors that don't exist on that page (#bdayBroSec, #awwSec, #gmp, #mdmmSec, #hmdmSec, #tymSec), or, on 6 posts, to https://www.123greetings.com/blog/what-to-write-in-a-card, which returns 404 (32 links). Matching pages exist but get no links: '→ Birthday messages for brothers' could go to /birthday-messages-for-brother/, '→ Anniversary messages for wife' to /anniversary-messages-for-wife/, '→ Graduation messages from parents' to /graduation-messages/, and the sorry and thank-you arrows to /sorry-messages/ and /thank-you-messages/. '→ Mother's Day messages for grandma/stepmom/your wife' point at the 404 even though sibling posts on exactly those topics exist. No post links to /mothers-day-messages/, and that page links to none of the 11 posts. The posts target 'Mother's Day messages for X' searches but contain only 0-7 quoted messages each. The stepmom post's title promises 50+ and it has 3. Tagging is wrong too: the sorry-for-coworkers post is tagged mothers-day, mom, happy-mothers-day, mothers-day-cards and mothers-day-ecards, and the grandma post is tagged thanksgiving, national-holiday and gps.

**Fix.** Map each arrow to a real URL. Birthday brother goes to /birthday-messages-for-brother/, graduation to /graduation-messages/, sorry to /sorry-messages/, thank-you to /thank-you-messages/ and /birthday-messages-for-father-in-law/, love-for-wife to /anniversary-messages-for-wife/ and /love-messages/, congratulations to /congratulations-messages/ and /keep-in-touch-messages/, lost-mom to /sympathy-condolences-messages/. The Mother's Day arrows go to /mothers-day-messages/ and to the sibling posts. Add a 'Guides & stories' block on /mothers-day-messages/ linking the 11 posts. Retitle the stepmom post without '50+', or add 50 messages. Refresh all 11 posts in April 2027 for Mother's Day on Sun 9 May 2027: the text says 'May 10 this year' / '2026', and one slug contains 2026.

### [medium] The 32 'Bob' posts duplicate each other's titles and H1s, stopped on 2 Aug, and don't lead readers to messages or eCards

*Verdict: confirmed* · Affected: /wake-up-with-bob-15th-july/, /wake-up-with-bob-14th-july/, /five-minutes-with-bob-28th-july/, /five-minutes-with-bob/, /13th-july-your-weekly-bobcast/, /19th-may-your-week-with-bob/, /author/iblog123greetingsgmail-com/, /archive/

**Evidence.** The series are 13 'Wake Up With Bob' (14-26 Jul), 10 'Five Minutes With Bob' (11 Jul-2 Aug) and 9 weekly Bobcast/'Week With Bob' posts (19 May-13 Jul). All 13 Wake Up posts share the title 'Wake Up With Bob - 123Greetings Blog - …' and the H1 'Wake Up With Bob'. 7 Five Minutes posts share one title and 10 share the H1 'Five Minutes With Bob'. Daily posts run 216-455 words and are personal reflections ('never outsource your happiness', buying a new car) with no greeting-card intent. The 23 daily posts contain 0 in-content links to message pages or eCards. Weekly posts are round-ups of events for May-July 2026 (Bastille Day, Ice Cream Day and so on) with 6-12 UTM-tagged eCard links each, and they are now out of date. The /wake-up-with-bob-23rd-july/ meta description says 'In today's Five Minutes with Bob'. Slug dates don't match publish dates (/13th-july-your-weekly-bobcast/ was published 12 Jul). No post has appeared since 2026-08-02. /archive/ (H1 'Our Archive', in the sitemap, 0 inlinks) lists only Bob posts. The author 'Bob' has no bio: his archive page has 10 words and its slug comes from an email address.

**Fix.** Choose one of two routes. (a) Keep the series as 'Bob's Journal': give every post a unique descriptive title and H1 ('Never Outsource Your Happiness | Wake Up With Bob'), close each one with a relevant message page and eCard (e.g. the old-friend post links to /keep-in-touch-messages/), and write a real author bio. (b) Otherwise noindex the daily posts and take them out of the post sitemap. Either way, retire the dated weekly Bobcasts: noindex them and fold the 'this week's occasions' idea into a maintained /upcoming-events/ calendar. Put writing effort into seasonal message pages first (see the gaps finding); only then resume a weekly post that links 5-10 message pages for the coming week.

### [medium] Weak trust signals: no visible author or date on any message page, empty author profiles, and an About page that names no people

*Verdict: confirmed* · Affected: /about-us/, /author/iblog123greetingsgmail-com/, /birthday-messages-for-wife/, /

**Evidence.** The visible text of /birthday-messages-for-wife/ (the message-page template) has no byline, no 'published' or 'updated' date and no reviewer. Its JSON-LD names the author as 'Andrea gomes' (Person), but that name never appears on the page. The REST API /wp/v2/users lists 2 authors, 'Andrea gomes' and 'Bob', both with empty descriptions. The About page is titled 'About 123Greetings Blog – The People Behind the Cards' but names no one. Its 4 testimonials are about customer-support emails, not the messages (e.g. 'I am so sorry to have bothered you by being confused by the similarity of your names'; 'thank you for resolving this issue') and carry no dates or context. The homepage says messages are 'written by people who specialize in understanding emotions' and /what-to-write-in-a-card/ says 'written by real people', but no writer or editor is credited anywhere. The About page also says 'Every eCard on 123Greetings is free. No hidden fees', while posts promote and tag the '123Greetings PRO app'. That may be consistent, but it should be checked.

**Fix.** Show 'Written by [name], [role] · Updated [date]' on every message page and post, linking to author pages with real bios (experience writing greeting cards, editorial standards). On the About page, name the editorial team, explain how messages are written and reviewed, and replace the support-email testimonials with feedback about the messages. Make the JSON-LD author match the visible byline. Confirm the 'free' claim against the PRO app offer.

### [medium] Work, business and customer 'anniversary' pages mix work anniversaries with wedding anniversaries

*Verdict: partly-confirmed* · Affected: /anniversary-messages-for-co-worker/, /anniversary-messages-for-boss/, /anniversary-messages-for-employee/, /anniversary-messages-for-customers/, /at-work-messages/, /work-anniversary-messages/

**Evidence.** The /anniversary-messages/ hub lists Co-worker, Boss, Employee and Customers under 'Work Anniversary', and their titles say 'Work Anniversary Messages for Coworker', '50+ Work Anniversary Wishes for Boss' and 'Business Anniversary Messages for Customers'. The messages don't match. /anniversary-messages-for-co-worker/: 1 of 9 is a work anniversary; 8 are about the coworker's marriage ('As your work wife, I fully approve of your real wife'). /anniversary-messages-for-boss/: 5 of 15 are work anniversaries; 10 are wedding wishes ('Wishing you and your partner another year…'). /anniversary-messages-for-customers/: 8 of 21 are about customer loyalty; 13 are wedding wishes to a customer couple. /anniversary-messages-for-employee/: 6 of 7 are work anniversaries and 1 is about marriage. Meanwhile /work-anniversary-messages/ (published 2026-08-22) has only 5 generic messages, and /at-work-messages/ is retirement content under a 'Workplace Messages' title.

**Fix.** Make /work-anniversary-messages/ the pillar: 40+ messages in sections for coworker, employee, boss and by years (1, 5, 10, 20), plus FAQs. Move the work-anniversary messages there. Retitle the relationship pages for their true intent ('Wedding Anniversary Wishes for a Coworker/Boss') or 301 them to the pillar. Move the 13 customer-couple messages to a new 'anniversary wishes for a couple' page and keep /anniversary-messages-for-customers/ as 'thank-you-for-X-years' customer-loyalty messages. Retirement: see the evergreen-gaps finding.

### [low] Reused lead messages and generic filler that doesn't fit the page (verbatim reuse across pages is otherwise low)

*Verdict: partly-confirmed* · Affected: /messages-for-21st-birthday/, /messages-for-30th-birthday/, /messages-for-40th-birthday/, /messages-for-60th-birthday/, /messages-for-10th-anniversary/, /messages-for-25th-anniversary/, /messages-for-50th-anniversary/, /birthday-messages-for-daughter/ (+5 more)

**Evidence.** Of 2,165 messages across all page/post message blocks, 2,154 are unique after normalisation. The reuse that does exist is template lead messages. 'Happy birthday! A big number on the cake, sure, but the number never quite matches how you feel…' appears on the 21st, 30th, 40th and 60th birthday pages without naming any age. 'Happy anniversary! A decade, or two, or five — doesn't really matter…' appears on the 10th, 25th and 50th anniversary pages. 'Happy birthday to the kid who turned my life completely upside down…' is on both the daughter and son pages. Near-duplicates: boss vs co-worker birthday ('coffee that hasn't been sitting out for three hours…', Jaccard 0.89), and the Mother's Day / Father's Day grief message with the word swapped (0.66). The sentence 'right about almost everything since approximately 1962' appears on both the Mother's Day and Father's Day pages. The same message appears twice on one page on /labor-day-messages/ (2 messages), /national-tap-dance-day-messages/, /fathers-day-messages/ and /birthday-messages-for-son/. A writer's note leaked into a /birthday-messages-for-mom/ message: 'Use as a card, a caption, or a note to yourself on a hard morning. It travels well.' On 14 anniversary-by-relationship pages (aunt, uncle, niece, granddaughter, parents, friends, stepmother, co-worker, employee, fiancé and others), no message mentions the relationship. The aunt, uncle and niece messages are interchangeable 'you two' couple wishes.
[Verifier] Duplicates are as stated. Anniversary pages where no message references the recipient's relationship: 7 (aunt, uncle, niece, granddaughter, parents, friends, stepmother), not 14. /anniversary-messages-for-co-worker/ (4 of 9), -employee/ (6 of 7), -fiance/ (3 of 14) and -fiancee/ (4 of 14) do reference it.

**Fix.** Replace each shared lead with one written for the page (every milestone message should mention the age or year). Delete the within-page duplicates. Remove the writer note on the mom page. On relationship pages, aim for at least 60% of messages to reference the recipient's relationship or shared history ('Watching you and Uncle Tom…'). Add a CMS or build check that flags a message appearing on more than one URL, and one that flags repeats within a page.


<details><summary><b>Table: Title-promise gap: every page or post whose <title> claims 'N+' (sorted by shortfall)</b> (126 rows)</summary>

| url | claimed | actual_messages | shortfall |
|---|---|---|---|
| /birthday-messages/ | 500 | 0 | 500 |
| /anniversary-messages/ | 250 | 0 | 250 |
| /birthday-messages-for-wife/ | 150 | 4 | 146 |
| /birthday-messages-for-girlfriend/ | 120 | 6 | 114 |
| /birthday-messages-for-husband/ | 120 | 6 | 114 |
| /birthday-messages-for-mom/ | 115 | 7 | 108 |
| /engagement-messages/ | 100 | 1 | 99 |
| /anniversary-messages-for-brother/ | 100 | 3 | 97 |
| /mothers-day-messages/ | 125 | 29 | 96 |
| /birthday-messages-for-best-friend/ | 100 | 5 | 95 |
| /birthday-messages-for-boyfriend/ | 100 | 5 | 95 |
| /birthday-messages-for-brother/ | 100 | 5 | 95 |
| /anniversary-messages-for-wife/ | 100 | 6 | 94 |
| /birthday-message-for-dad/ | 100 | 6 | 94 |
| /birthday-messages-for-daughter/ | 100 | 6 | 94 |
| /birthday-messages-for-sister/ | 100 | 6 | 94 |
| /anniversary-messages-for-husband/ | 100 | 8 | 92 |
| /birthday-messages-for-son/ | 100 | 8 | 92 |
| /sympathy-condolences-messages/ | 100 | 10 | 90 |
| /anniversary-messages-for-boyfriend/ | 100 | 11 | 89 |
| /parents-day-messages/ | 100 | 11 | 89 |
| /sorry-messages/ | 100 | 15 | 85 |
| /anniversary-messages-for-grandparents/ | 100 | 16 | 84 |
| /birthday-messages-for-grandma/ | 100 | 17 | 83 |
| /get-well-soon-messages/ | 100 | 18 | 82 |
| /teachers-day-messages/ | 100 | 18 | 82 |
| /graduation-messages/ | 100 | 20 | 80 |
| /thank-you-messages/ | 100 | 23 | 77 |
| /messages-for-1st-birthday/ | 80 | 4 | 76 |
| /birthday-messages-for-grandpa/ | 80 | 5 | 75 |
| /birthday-messages-for-grandson/ | 80 | 7 | 73 |
| /birthday-messages-for-niece/ | 80 | 7 | 73 |
| /easter-messages/ | 75 | 2 | 73 |
| /canada-day-messages/ | 100 | 28 | 72 |
| /anniversary-messages-for-parents/ | 75 | 5 | 70 |
| /birthday-messages-for-sweet-16/ | 75 | 5 | 70 |
| /messages-for-25th-anniversary/ | 75 | 5 | 70 |
| /birthday-messages-for-aunt/ | 75 | 6 | 69 |
| /friendship-day-messages/ | 75 | 6 | 69 |
| /anniversary-messages-for-in-laws/ | 75 | 7 | 68 |
| /birthday-messages-for-granddaughter/ | 80 | 18 | 62 |
| /love-messages/ | 100 | 38 | 62 |
| /anniversary-messages-for-daughter/ | 75 | 15 | 60 |
| /anniversary-messages-for-girlfriend/ | 75 | 16 | 59 |
| /birthday-messages-for-mother-in-law/ | 65 | 6 | 59 |
| /birthday-messages-for-nephew/ | 60 | 5 | 55 |
| /messages-for-50th-birthday/ | 60 | 5 | 55 |
| /messages-for-80th-birthday/ | 60 | 5 | 55 |
| /messages-for-90th-birthday/ | 60 | 5 | 55 |
| /birthday-messages-for-uncle/ | 60 | 6 | 54 |
| /messages-for-60th-birthday/ | 60 | 6 | 54 |
| /messages-for-70th-birthday/ | 60 | 6 | 54 |
| /fathers-day-messages/ | 100 | 47 | 53 |
| /messages-for-21st-birthday/ | 60 | 9 | 51 |
| /messages-for-30th-birthday/ | 60 | 9 | 51 |
| /messages-for-18th-birthday/ | 60 | 10 | 50 |
| /mothers-day-wishes-for-stepmom-50-heartfelt-card-messages/ (post; 3 example lines, 0 message blocks) | 50 | 0 | 50 |
| /messages-for-40th-birthday/ | 60 | 11 | 49 |
| /messages-for-5th-anniversary/ | 50 | 1 | 49 |
| /april-fools-day-messages/ | 50 | 2 | 48 |
| /international-yoga-day-messages/ | 50 | 2 | 48 |
| /earth-day-messages/ | 50 | 4 | 46 |
| /heartfelt-belated-birthday-messages/ | 50 | 4 | 46 |
| /messages-for-50th-anniversary/ | 50 | 4 | 46 |
| /anniversary-messages-for-friends/ | 50 | 5 | 45 |
| /belated-birthday-messages-for-her/ | 50 | 5 | 45 |
| /belated-birthday-messages-for-him/ | 50 | 5 | 45 |
| /belated-birthday-messages-for-sorry-i-missed/ | 50 | 5 | 45 |
| /birthday-messages-for-aquarius/ | 50 | 5 | 45 |
| /birthday-messages-for-aries/ | 50 | 5 | 45 |
| /birthday-messages-for-cancer/ | 50 | 5 | 45 |
| /birthday-messages-for-capricorn/ | 50 | 5 | 45 |
| /birthday-messages-for-co-worker/ | 50 | 5 | 45 |
| /birthday-messages-for-father-in-law/ | 50 | 5 | 45 |
| /birthday-messages-for-gemini/ | 50 | 5 | 45 |
| /birthday-messages-for-leo/ | 50 | 5 | 45 |
| /birthday-messages-for-libra/ | 50 | 5 | 45 |
| /birthday-messages-for-pisces/ | 50 | 5 | 45 |
| /birthday-messages-for-sagittarius/ | 50 | 5 | 45 |
| /birthday-messages-for-scorpio/ | 50 | 5 | 45 |
| /birthday-messages-for-taurus/ | 50 | 5 | 45 |
| /birthday-messages-for-virgo/ | 50 | 5 | 45 |
| /national-best-friends-day-messages/ | 50 | 5 | 45 |
| /at-work-messages/ | 50 | 6 | 44 |
| /birthday-messages-for-boss/ | 50 | 6 | 44 |
| /funny-belated-birthday-messages/ | 50 | 6 | 44 |
| /messages-for-13th-birthday/ | 50 | 6 | 44 |
| /messages-for-15th-anniversary/ | 50 | 6 | 44 |
| /messages-for-60th-anniversary/ | 50 | 6 | 44 |
| /anniversary-messages-for-sister/ | 60 | 17 | 43 |
| /messages-for-20th-anniversary/ | 50 | 7 | 43 |
| /messages-for-75th-anniversary/ | 50 | 7 | 43 |
| /wedding-messages-for-the-bride/ | 50 | 7 | 43 |
| /messages-for-10th-anniversary/ | 50 | 8 | 42 |
| /messages-for-1st-anniversary/ | 50 | 8 | 42 |
| /anniversary-messages-for-son/ | 50 | 11 | 39 |
| /birthday-messages-for-teacher/ | 50 | 11 | 39 |
| /anniversary-messages-for-dad/ | 50 | 12 | 38 |
| /birthday-messages-for-across-the-miles/ | 50 | 12 | 38 |
| /labor-day-messages/ | 50 | 12 | 38 |
| /anniversary-messages-for-fiance/ | 50 | 14 | 36 |
| /anniversary-messages-for-boss/ | 50 | 15 | 35 |
| /belated-anniversary-messages-for-him/ | 40 | 5 | 35 |
| /birthday-messages-for-stepmother/ | 40 | 5 | 35 |
| /family-messages/ | 60 | 25 | 35 |
| /messages-for-100th-birthday/ | 40 | 5 | 35 |
| /spring-messages/ | 50 | 15 | 35 |
| /anniversary-messages-for-mom/ | 50 | 16 | 34 |
| /belated-anniversary-messages-for-her/ | 40 | 6 | 34 |
| /birthday-messages-for-stepfather/ | 40 | 6 | 34 |
| /belated-anniversary-messages-for-sorry-i-forgot/ | 40 | 7 | 33 |
| /red-rose-day-messages/ | 30 | 3 | 27 |
| /international-kissing-day-messages/ | 30 | 4 | 26 |
| /national-tap-dance-day-messages/ | 30 | 4 | 26 |
| /hug-week-messages/ | 30 | 5 | 25 |
| /dance-day-messages/ | 30 | 6 | 24 |
| /ice-cream-day-messages/ | 30 | 6 | 24 |
| /4th-of-july-messages/ | 100 | 77 | 23 |
| /national-blueberry-pie-day-messages/ | 25 | 2 | 23 |
| /sneak-a-kiss-day-messages/ | 25 | 3 | 22 |
| /more-inspiration-messages/ | 80 | 60 | 20 |
| /always-live-better-than-yesterday-day-messages/ | 25 | 6 | 19 |
| /anniversary-messages-for-customers/ | 40 | 21 | 19 |
| /congratulations-messages/ | 75 | 62 | 13 |
| /summer-messages/ | 50 | 39 | 11 |
| TOTAL (125 URLs; 0 meet their claim) | 8840 | 1251 | 7589 |

</details>


<details><summary><b>Table: Thinnest 40 message pages (usefulness score = 10×messages + intro words/10 + 5×FAQs + 5 eCard link + 5 internal link)</b> (40 rows)</summary>

| rank | url | family | messages | words | faqs | what is missing |
|---|---|---|---|---|---|---|
| 1 | /engagement-messages/ | evergreen-occasion | 1 | 45 | 0 | title claims 100+; no intro; no FAQ; no eCard link; no related/internal links |
| 2 | /messages-for-5th-anniversary/ | milestone-anniversary | 1 | 30 | 0 | title claims 50+; no intro; no FAQ; no eCard link; no related/internal links |
| 3 | /easter-messages/ | holiday | 2 | 31 | 0 | title claims 75+; no intro; no FAQ; no eCard link; no related/internal links |
| 4 | /april-fools-day-messages/ | holiday | 2 | 44 | 0 | title claims 50+; no intro; no FAQ; no eCard link; no related/internal links |
| 5 | /international-yoga-day-messages/ | national-day | 2 | 44 | 0 | title claims 50+; no intro; no FAQ; no eCard link; no related/internal links |
| 6 | /national-blueberry-pie-day-messages/ | national-day | 2 | 49 | 0 | title claims 25+; no intro; no FAQ; no eCard link; no related/internal links |
| 7 | /anniversary-messages-for-brother/ | anniversary-by-relationship | 3 | 84 | 0 | title claims 100+ (and ends 'Meta Title'); no intro; no FAQ; no eCard link; no related links |
| 8 | /national-childrens-day-messages/ | national-day | 3 | 53 | 0 | no intro; no FAQ; no eCard link; unclear which Children's Day (filed under November); no related links |
| 9 | /red-rose-day-messages/ | national-day | 3 | 58 | 0 | title claims 30+; no intro; no FAQ; no eCard link; no related links |
| 10 | /sneak-a-kiss-day-messages/ | national-day | 3 | 68 | 0 | title claims 25+; no intro; no FAQ; no eCard link; no related links |
| 11 | /international-kissing-day-messages/ | national-day | 4 | 72 | 0 | title claims 30+; no intro; no FAQ; no eCard link; no related links |
| 12 | /birthday-messages-for-wife/ | birthday-by-relationship | 4 | 140 | 0 | title claims 150+; no intro; no FAQ; no eCard link; no related links |
| 13 | /messages-for-1st-birthday/ | milestone-birthday | 4 | 76 | 0 | title claims 80+; no intro; no FAQ; no eCard link; no related links |
| 14 | /earth-day-messages/ | holiday | 4 | 88 | 0 | title claims 50+; no intro; no FAQ; no eCard link; no related links |
| 15 | /heartfelt-belated-birthday-messages/ | belated | 4 | 103 | 0 | title claims 50+; no intro; no FAQ; no eCard link; no related links |
| 16 | /messages-for-50th-anniversary/ | milestone-anniversary | 4 | 133 | 0 | title claims 50+; shared generic lead; no intro; no FAQ; no eCard; no related links |
| 17 | /national-tap-dance-day-messages/ | national-day | 4 | 81 | 0 | title claims 30+; 1 message duplicated, all say 'Dance Day'; no intro/FAQ/eCard/links |
| 18 | /anniversary-messages-for-uncle/ | anniversary-by-relationship | 5 | 83 | 0 | 0 of 5 messages mention uncle; no intro; no FAQ; no eCard; no related links |
| 19 | /messages-for-80th-birthday/ | milestone-birthday | 5 | 92 | 0 | title claims 60+; no intro; no FAQ; no eCard link; no related links |
| 20 | /birthday-messages-for-taurus/ | zodiac | 5 | 98 | 0 | title claims 50+; no sign dates/traits intro; no FAQ; no eCard; no related links |
| 21 | /business-anniversary-messages/ | anniversary-type | 5 | 98 | 0 | duplicates /company-anniversary-messages/; no intro; no FAQ; no eCard; no links |
| 22 | /anniversary-messages-for-siblings/ | anniversary-by-relationship | 5 | 100 | 0 | overlaps brother/sister pages; no intro; no FAQ; no eCard; no links |
| 23 | /birthday-messages-for-aries/ | zodiac | 5 | 102 | 0 | title claims 50+; no intro; no FAQ; no eCard; no related links |
| 24 | /birthday-messages-for-nephew/ | birthday-by-relationship | 5 | 103 | 0 | title claims 60+; no intro; no FAQ; no eCard; no related links |
| 25 | /friendship-anniversary-messages/ | anniversary-type | 5 | 104 | 0 | no intro; no FAQ; no eCard; no link to friendship hub |
| 26 | /anniversary-messages-for-neighbours/ | anniversary-by-relationship | 5 | 104 | 0 | no intro; no FAQ; no eCard; no related links |
| 27 | /work-anniversary-messages/ | anniversary-type | 5 | 105 | 0 | should be work-anniversary pillar; no intro; no FAQ; no eCard; no links |
| 28 | /birthday-messages-for-father-in-law/ | birthday-by-relationship | 5 | 106 | 0 | title claims 50+; no intro; no FAQ; no eCard; no related links |
| 29 | /birthday-messages-for-virgo/ | zodiac | 5 | 106 | 0 | title claims 50+; no intro; no FAQ; no eCard; no related links |
| 30 | /birthday-messages-for-grandpa/ | birthday-by-relationship | 5 | 107 | 0 | title claims 80+; no intro; no FAQ; no eCard; no related links |
| 31 | /birthday-messages-for-gemini/ | zodiac | 5 | 107 | 0 | title claims 50+; no intro; no FAQ; no eCard; no related links |
| 32 | /birthday-messages-for-stepmother/ | birthday-by-relationship | 5 | 113 | 0 | title claims 40+; no intro; no FAQ; no eCard; no related links |
| 33 | /company-anniversary-messages/ | anniversary-type | 5 | 114 | 0 | duplicates business-anniversary; no intro; no FAQ; no eCard; no links |
| 34 | /dating-anniversary-messages/ | anniversary-type | 5 | 119 | 0 | overlaps relationship-anniversary; no intro; no FAQ; no eCard; no links |
| 35 | /messages-for-40th-anniversary/ | milestone-anniversary | 5 | 119 | 0 | no ruby/gift intro; no FAQ; no eCard; no related links |
| 36 | /messages-for-100th-birthday/ | milestone-birthday | 5 | 120 | 0 | title claims 40+; no intro; no FAQ; no eCard; no related links |
| 37 | /birthday-messages-for-cancer/ | zodiac | 5 | 120 | 0 | title claims 50+; no intro; no FAQ; no eCard; no related links |
| 38 | /relationship-anniversary-messages/ | anniversary-type | 5 | 121 | 0 | overlaps dating-anniversary; no intro; no FAQ; no eCard; no links |
| 39 | /messages-for-90th-birthday/ | milestone-birthday | 5 | 122 | 0 | title claims 60+; no intro; no FAQ; no eCard; no related links |
| 40 | /birthday-messages-for-leo/ | zodiac | 5 | 129 | 0 | title claims 50+; no intro; no FAQ; no eCard; no related links |

</details>


<details><summary><b>Table: Template families: what each one consistently lacks</b> (13 rows)</summary>

| family | pages | messages median (min-max) | words median | intro ≥30 words | has FAQ | eCard link | links to other blog pages | titles with a count | avg shortfall | consistently lacks |
|---|---|---|---|---|---|---|---|---|---|---|
| zodiac birthday | 12 | 5 (5-5) | 129 | 0/12 | 0/12 | 0/12 | 0/12 | 12/12 | 45 | sign dates & traits (only on hub), partner/friend angles, FAQ, eCard, links to neighbouring signs |
| milestone birthday (1st-100th, Sweet 16) | 13 | 6 (4-11) | 158 | 0/13 | 0/13 | 0/13 | 0/13 | 13/13 | 53.8 | age-specific intro, messages naming the age (21/30/40/60 share one generic lead), funny vs heartfelt sections, FAQ, eCard, links |
| milestone anniversary (1st-75th) | 11 | 6 (1-8) | 133 | 0/11 | 0/11 | 0/11 | 0/11 | 9/11 | 47 | gift/symbol content (15th & 20th both say 'Crystal to China'; 60th & 75th both 'Diamond Jubilee'), spouse vs couple split, FAQ, eCard, links |
| birthday by relationship | 27 | 6 (4-18) | 145 | 1/27 | 0/27 | 0/27 | 0/27 | 27/27 | 75 | volume, tone sections, FAQ, eCard, related relationships; homepage-linked pages (mom 7, wife 4, husband 6) are thin |
| anniversary by relationship | 31 | 7 (3-21) | 189 | 0/31 | 0/31 | 0/31 | 0/31 | 17/31 | 58.9 | relationship-specific wording (14 pages with 0 messages naming the relationship), FAQ, eCard, links; work-vs-wedding intent mixed |
| belated (birthday 5 + anniversary 3) | 8 | 5 (4-7) | 143.5 | 0/8 | 0/8 | 0/8 | 0/8 | 8/8 | ~41 | a pillar page; fragmented into 8 pages of 4-7 messages |
| anniversary type (wedding/relationship/dating/work/company/business/friendship) | 7 | 5 (5-5) | 114 | 0/7 | 0/7 | 0/7 | 0/7 | 0/7 | - | distinct scope (business≈company, relationship≈dating≈wedding), FAQ, eCard, links |
| national/awareness days | 62 | 5 (2-111) | 328.5 | 0/62 | 50/62 | 36/62 | 6/62 | 12/62 | 31.5 | intro, links to related days/evergreen pages; 12 older pages have 2-6 messages and no FAQ |
| holidays / major observances | 25 | 5 (2-77) | 334 | 3/25 | 21/25 | 19/25 | 0/25 | 10/25 | 62 | volume on autumn/winter holidays (Thanksgiving, Veterans Day, Day of the Dead, Boss's Day: 5 each), audience sections, cross-links |
| hubs (birthday, anniversary, wedding, friendship, thankyou, inspiration) | 6 | 0 | 441.5 | 6/6 | 3/6 | 3/6 | 6/6 | 2/6 | 375 | own messages; sibling pages outside their family (friendship, thank-you, inspiration, wedding hubs) |
| sub-pages of thank-you/friendship/wedding/inspiration | 19 | 7 (5-60) | 350 | 1/19 | 18/19 | 16/19 | 0/19 | 2/19 | - | link back to hub and siblings, intro, volume |
| story posts (Mother's Day + 'when my…') | 17 | 0-7 example lines | 1268 | 17/17 | 0 (Q&A sections) | 17/17 | 11/17 (only to /what-to-write-in-a-card/) | 1/17 | - | links to the matching message pages; 6 posts link a 404 |
| Bob posts (daily + weekly) | 32 | 0 | 385.5 (216-784) | 32/32 | 0/32 | 9/32 (weekly only) | 1/32 | 0/32 | - | search intent, unique titles/H1s, any link to messages or eCards (daily) |

</details>


<details><summary><b>Table: Seasonal plan: 1 Oct 2026 - 14 Feb 2027 (dates verified)</b> (25 rows)</summary>

| occasion | 2026/27 date | existing page | current state | action | publish/refresh by |
|---|---|---|---|---|---|
| Canadian Thanksgiving | Mon 12 Oct | /canadian-thanksgiving-messages/ | 5 msgs, 345 words, no links | expand to 40+, link Fall/Thanksgiving/thank-you | 5 Oct (urgent) |
| Columbus / Indigenous Peoples' Day | Mon 12 Oct | /columbus-day-messages/ | 5 msgs; mentions Indigenous Peoples' Day in FAQ | add IPD section/messages | 5 Oct |
| Boss's Day | Fri 16 Oct | /bosss-day-messages/ | 5 msgs | expand to 30+, link boss birthday/anniversary pages | 9 Oct |
| Sweetest Day | Sat 17 Oct | /sweetest-day-messages/ | 5 msgs | expand to 20+ | 10 Oct |
| Dussehra | Tue 20 Oct | none (404) | - | create | 12 Oct |
| Karva Chauth | Thu 29 Oct | none (404) | - | create (optional, India audience) | 20 Oct |
| Halloween (+Samhain, Candy Corn 30 Oct, Pumpkin Day 26 Oct) | Sat 31 Oct | /halloween-messages/ + 4 micro-pages | 11 msgs, 356 words; micro-pages 5 each; no cross-links | expand to 60-80 with audience sections; make it the cluster hub | 10 Oct |
| Day of the Dead / All Saints / All Souls | 1-2 Nov | /day-of-the-dead-messages/, /all-saints-day-messages/ | 5 msgs each | expand; add All Souls section | 20 Oct |
| Daylight saving ends | Sun 1 Nov | /daylight-saving-time-ends-messages/ | 5 msgs | OK as is (low priority) | - |
| Guy Fawkes Night | Thu 5 Nov | /guy-fawkes-day-messages/ | 5 msgs | OK; link Remembrance Day | - |
| Diwali (Dhanteras 6 Nov, Lakshmi Puja 8 Nov, Bhai Dooj 11 Nov) | Sun 8 Nov | none (404) | - | create hub + Bhai Dooj page | 20 Oct |
| Veterans Day / Remembrance Day | Wed 11 Nov | /veterans-day-messages/ (pub. 29 Sep); Remembrance none | 5 msgs | expand Veterans to 30+; create Remembrance Day (CA/UK) | 28 Oct |
| Children's Day (India) | Sat 14 Nov | /national-childrens-day-messages/ | 3 msgs, 53 words | decide US (June) vs India (Nov); expand | 1 Nov |
| US Thanksgiving (+Friendsgiving) | Thu 26 Nov | /thanksgiving-day-messages/ (pub. 30 Sep) | 5 msgs, 312 words | expand to 75+ (family/friends/coworkers/clients/funny/religious/Friendsgiving) | 1 Nov |
| Hanukkah | 4-12 Dec | none (404) | - | create | 13 Nov |
| Christmas (hub + ~10 children) | Fri 25 Dec | none (404; site search finds nothing) | - | create hub then children | hub 31 Oct; children 15 Nov |
| Holiday / Season's Greetings (business, non-denominational) | Dec | none | - | create | 8 Nov |
| Winter | 21 Dec solstice | none (404) | - | create | 30 Nov |
| Kwanzaa | 26 Dec - 1 Jan | none (404) | - | create | 5 Dec |
| Boxing Day | Sat 26 Dec | none (404) | - | optional | 10 Dec |
| New Year's Eve/Day (+ 'Merry Christmas & Happy New Year') | 31 Dec / Fri 1 Jan | none (404) | - | create | 1 Dec |
| MLK Day | Mon 18 Jan 2027 | none (404) | - | create | 5 Jan |
| Lunar New Year | Sat 6 Feb 2027 | none (404) | - | create | 15 Jan |
| Valentine's Day + Valentine's Week (Rose 7 Feb … Kiss 13 Feb) | Sun 14 Feb 2027 | none (404); related day pages exist but are dated to other months | red-rose 3 msgs (Jun 12), kissing 4 (Jul 6), hug week 5, teddy 6, chocolate 10 | create hub; relink and expand the week pages | 10 Jan |
| Mother's Day 2027 (11 posts + page) | Sun 9 May 2027 | /mothers-day-messages/ + 11 posts | posts say 'May 10, 2026' | refresh dates, links, titles | early Apr 2027 |

</details>


<details><summary><b>Table: Coverage gaps checked live (HTTP status of the likely slug on 2026-09-30)</b> (25 rows)</summary>

| occasion / relationship | slug(s) checked | status | priority |
|---|---|---|---|
| Christmas | christmas-messages, christmas-wishes, merry-christmas-messages, christmas-card-messages, christmas-messages-for-family/-friends/-coworkers/-boss | 404 (all) | P0 |
| Holiday / season's greetings | holiday-messages, season-greetings-messages | 404 | P0 |
| New Year | new-year-messages, new-years-messages, happy-new-year-messages | 404 | P0 |
| Hanukkah | hanukkah-messages | 404 | P0 |
| Diwali / Dussehra / Bhai Dooj / Karva Chauth | diwali-, dussehra-, bhai-dooj-, karva-chauth-messages | 404 | P0 (Diwali), P1 others |
| Kwanzaa | kwanzaa-messages | 404 | P1 |
| Valentine's Day | valentines-day-messages, valentine-messages | 404 | P0 (for Jan publish) |
| Lunar New Year | lunar-new-year-messages, chinese-new-year-messages | 404 | P1 |
| Remembrance Day | remembrance-day-messages | 404 | P1 |
| Winter / Boxing Day / MLK / Friendsgiving / Black Friday / World Kindness Day | winter-, boxing-day-, mlk-day-, friendsgiving-, black-friday-, world-kindness-day-messages | 404 | P2 |
| Retirement | retirement-messages (content exists only on orphan /at-work-messages/) | 404 | P0 (quick win: 301) |
| Good luck / new job / promotion / farewell / goodbye / welcome | good-luck-, new-job-, promotion-, farewell-, goodbye-, welcome-messages | 404 | P1 |
| Housewarming / new home | housewarming-, new-home-messages | 404 | P1 |
| Baby shower / bridal shower | baby-shower-, bridal-shower-messages | 404 | P2 (spring) |
| Miss you / thinking of you / good morning / good night | miss-you-, thinking-of-you-, good-morning-, good-night-messages | 404 | P1 |
| Pet sympathy / loss of mother | pet-sympathy-, loss-of-mother-sympathy-messages | 404 | P1 |
| Encouragement | encouragement-messages (and linked /encouragement-inspiration-messages/) | 404 | P1 (content exists in /more-inspiration-messages/) |
| Birthday for friend / kids / cousin / twins / dog / employee | birthday-messages-for-friend/-kids/-cousin/-twins/-dog/-employee | 404 | P1 (friend, kids = P0) |
| Birthday for girl / boy (child) | birthday-messages-for-girl/-boy | 301 to girlfriend/boyfriend (wrong intent) | P1 |
| Birthday for in-laws | birthday-messages-for-sister-/brother-/daughter-/son-in-law | 404 | P2 |
| Funny / religious birthday | funny-birthday-messages, religious-birthday-messages | 404 | P1 |
| Anniversary for couple / sister-in-law | anniversary-messages-for-couple, wedding-anniversary-messages-for-couple, anniversary-messages-for-sister-in-law | 404 | P1 (couple) |
| Memorial Day / Juneteenth / Women's Day / Nurses Day / Admin Professionals / Eid / Ramadan / St Patrick's / Holi / Navratri / Passover | memorial-day-, juneteenth-, womens-day-, international-womens-day-, nurses-day-, administrative-professionals-day-, secretary-day-, eid-, eid-mubarak-, ramadan-, st-patricks-day-, holi-, navratri-, passover-messages | 404 | P2 (publish 6 weeks before each) |
| Grandparents Day (exists) | grandparents-day-messages; grandparents-day | 200; 301 to -messages | - |
| New baby (exists) | new-baby-messages | 200 (40 msgs) | - |

</details>


<details><summary><b>Table: Cannibalisation / duplication groups and recommendation</b> (12 rows)</summary>

| group | pages (messages) | evidence | recommendation |
|---|---|---|---|
| Thank you | /thank-you-messages/ (23), /thankyou-messages/ (hub, 0), /national-thank-you-day-messages/ (5), /thank-you-day-messages/ (5), /dailies-thankyou-messages/ (5) | two pages target 'thank you messages'; hub doesn't link the 23-message page; the two thank-you-day pages paraphrase each other (vocab Jaccard 0.39) | 301 /thankyou-messages/ → /thank-you-messages/ (make it the hub); 301 /thank-you-day-messages/ → /national-thank-you-day-messages/ and state its date; keep dailies as child |
| Dance | /dance-day-messages/ (6), /national-tap-dance-day-messages/ (4) | tap-dance messages say 'Dance Day' (1 duplicated); dance-day messages are romantic | differentiate with day-specific messages, or merge tap dance in as a section + 301 |
| Work anniversary | /work-anniversary-messages/ (5), /anniversary-messages-for-co-worker/ (1 work/8 wedding), /anniversary-messages-for-employee/ (6/1), /anniversary-messages-for-boss/ (5/10), /at-work-messages/ (6 retirement) | titles say work anniversary; bodies mostly wedding anniversary | work-anniversary pillar with coworker/employee/boss sections; retitle or 301 relationship pages; /at-work-messages/ → /retirement-messages/ |
| Wedding anniversary | /anniversary-messages/ (hub, 0; claims 250+), /wedding-anniversary-messages/ (5), /relationship-anniversary-messages/ (5), /dating-anniversary-messages/ (5) | 3 near-identical pages published the same day; vocab Jaccard 0.20-0.32 | put wedding messages on the hub; turn /wedding-anniversary-messages/ into 'anniversary wishes for a couple'; 301 relationship → dating |
| Business / company / customers | /business-anniversary-messages/ (5), /company-anniversary-messages/ (5), /anniversary-messages-for-customers/ (21: 8 loyalty + 13 couple) | business≈company (Jaccard 0.22, same publish date); customers page mixes intents | 301 company → business (with team/client/customer sections); keep customers as loyalty-only; move couple messages |
| Friendship | /friendship-messages/ (hub, 0; meta 80+), /friendship-day-messages/ (6), /friendship-week/ (10), /national-best-friends-day-messages/ (5, 17 FAQs), /friendship-messages-for-best-friends/ (8), /womens-friendship-day-messages/ (5), /friendship-anniversary-messages/ (5), /anniversary-messages-for-friends/ (5) | hub links only 5 children; day/week overlap | 301 /friendship-week/ → /friendship-day-messages/; hub links all; keep friendship-anniversary (friends) vs anniversary-for-friends (a couple) with explicit titles |
| Inspiration / encouragement | /inspiration-messages/ (hub, 0; leaked META text), /inspiration-messages-motivation/ (19), /inspiration-messages-you-can-do-it/ (17), /more-inspiration-messages/ (60, titled 'Words of Encouragement'), /national-day-of-encouragement-messages/ (5), /positive-thinking-day-messages/ (5) | motivation vs you-can-do-it Jaccard 0.32; encouragement link is a 404 | move /more-inspiration-messages/ → /encouragement-messages/ (301) and fix the 404 link; differentiate motivation (goals) vs you-can-do-it (exams/interviews); hub links the day pages |
| Fiancé / fiancée anniversary | /anniversary-messages-for-fiance/ (14), /anniversary-messages-for-fiancee/ (14) | 1 of 28 messages names fiancé(e); interchangeable | merge + 301, or make each gender-specific |
| Belated birthday | 5 pages (4-6 each) | no pillar; Jaccard up to 0.25 between them | build /belated-birthday-messages/ pillar; fold the 5 in as sections (301) |
| Siblings / brother / sister anniversary | /anniversary-messages-for-siblings/ (5), brother (3), sister (17) | siblings page overlaps both | keep brother/sister, 301 siblings → sister/brother hub section, or differentiate |
| Micro-day clusters | kiss: international-kissing (4), sneak-a-kiss (3), longest-kiss (7), kiss-and-make-up (5); angel: angel-week (5), be-an-angel (5), guardian-angel (5); smile: smile-month (14), send-a-smile (5); cat: international (5), national (5) | thin, same vocabulary; none cross-link | keep only where the date is distinct; cross-link; fold sneak-a-kiss and longest-kiss into international-kissing as sections |
| Mother's Day page vs 11 Mother's Day posts | /mothers-day-messages/ (29) vs posts for mom/wife/MIL/grandma/stepmom/lost mom | posts target 'Mother's Day messages for X'; no links either way | keep posts as guides; link both ways; page gets a 'for your wife / grandma / stepmom' section linking each post |

</details>


<details><summary><b>Table: Cross-page duplicate and off-fit messages</b> (14 rows)</summary>

| message (start) | pages | issue |
|---|---|---|
| 'Happy birthday! A big number on the cake, sure, but the number never quite matches how you feel…' | /messages-for-21st-birthday/, /messages-for-30th-birthday/, /messages-for-40th-birthday/, /messages-for-60th-birthday/ | verbatim on 4 milestone pages; names no age |
| 'Happy anniversary! A decade, or two, or five — doesn't really matter…' | /messages-for-10th-anniversary/, /messages-for-25th-anniversary/, /messages-for-50th-anniversary/ | verbatim on 3 milestone pages; generic |
| 'Happy birthday to the kid who turned my life completely upside down…' | /birthday-messages-for-daughter/, /birthday-messages-for-son/ | verbatim on 2 pages |
| 'Happy birthday! Hoping today brings cake, coffee that hasn't been sitting out for three hours…' | /birthday-messages-for-co-worker/, /birthday-messages-for-boss/ | near-duplicate (Jaccard 0.89) |
| 'Thinking of you today. I know Mother's/Father's Day is a hard one…' | /mothers-day-messages/, /fathers-day-messages/ | near-duplicate with the word swapped (0.66) |
| '…right about almost everything since approximately 1962…' | /mothers-day-messages/, /fathers-day-messages/ | shared sentence |
| 'Another year isn't a countdown… Use as a card, a caption, or a note to yourself on a hard morning. It travels well.' | /birthday-messages-for-mom/ | leaked writer note; generic, not about mom |
| 'On Dance Day, just remember: if you have two left feet…' (×2) | /national-tap-dance-day-messages/ | repeated on the same page; not tap-specific |
| 'Happy Labor Day! May you take a well-deserved break…' and 'Wishing you a restful Labor Day!…' (each ×2) | /labor-day-messages/ | 2 messages repeated on the same page |
| 'You were my first safe place…' (×2); 'Our arms may not hold you like before…' (×2) | /fathers-day-messages/; /birthday-messages-for-son/ | repeated on the same page |
| Generic 'you two' couple wishes | /anniversary-messages-for-aunt/, -uncle/, -niece/, -granddaughter/, -parents/, -friends/, -stepmother/ (+7 more) | 0 messages name the relationship; interchangeable between pages |
| Wedding-anniversary wishes on work pages | /anniversary-messages-for-co-worker/ (8/9), -boss/ (10/15), -customers/ (13/21), -employee/ (1/7) | don't fit the 'work anniversary' titles |
| Romantic 'my love' messages | /dance-day-messages/ (International Dance Day) | wrong audience for the occasion |
| Retirement messages under 'Workplace Messages' | /at-work-messages/ (6/6) | page title doesn't match its content |

</details>


<details><summary><b>Table: Hub coverage</b> (8 rows)</summary>

| hub | child pages linked in content | messages on hub | notes / missing links |
|---|---|---|---|
| / (home) | 20 unique blog URLs | 0 | links /thank-you-messages/ but not the /thankyou-messages/ hub; 'Trending today' lists Summer and Birthday twice on 30 Sep; 'Coming up this month' = Halloween, St Francis, Guardian Angel, Clergy Appreciation |
| /what-to-write-in-a-card/ | 111 unique URLs | 0 | only source of links for 93 pages; calendar tabs: Jan 0, Feb 0, Mar 2, Apr 4, May 5, Jun 7, Jul 12, Aug 19, Sep 22, Oct 21, Nov 7, Dec 0; 7 http:// links + /canada-day-messages without a slash; retirement page not linked |
| /birthday-messages/ | 57 (all birthday children) | 0 (claims 500+; children total 362) | complete for its family; no link to belated pillar (none exists), brother-birthday post, or thank-you-for-birthday page |
| /anniversary-messages/ | 52 (all anniversary children) | 0 (claims 250+) | complete; lists work pages whose content is mostly wedding anniversaries |
| /wedding-messages/ | 5 | 0 | missing /engagement-messages/, /wedding-anniversary-messages/, /messages-for-1st-anniversary/ |
| /friendship-messages/ | 5 | 0 (meta claims 80+; children hold 37) | missing friendship-day, friendship-week, national-best-friends-day, womens-friendship-day, friendship-anniversary, birthday-for-best-friend, keep-in-touch |
| /thankyou-messages/ | 6 | 0 | missing /thank-you-messages/ (23 msgs), national-thank-you-day, thank-you-day, thank-you story post; H1 'Thankyou Messages' |
| /inspiration-messages/ | 3 | 0 | missing national-day-of-encouragement, positive-thinking-day, always-live-better-than-yesterday; visible META TITLE/DESCRIPTION/KEY PHRASE text; default title |

</details>


<details><summary><b>Table: Posts overview</b> (5 rows)</summary>

| series | posts | dates | words | title / H1 duplication | links to blog message pages | eCard links | recommendation |
|---|---|---|---|---|---|---|---|
| Wake Up With Bob | 13 | 14-26 Jul 2026 | 216-432 | 13 identical titles, 13 identical H1s | 0 | 0 | retitle uniquely + add a link to a message page, or noindex |
| Five Minutes With Bob | 10 | 11 Jul - 2 Aug 2026 | 316-455 | 7 identical titles, 10 identical H1s | 0 | 0 | same as above |
| Weekly Bobcast / Week With Bob | 9 | 19 May - 13 Jul 2026 | 422-784 | dated titles ('13th JULY: Your Weekly Bobcast!') | 1 (to /what-to-write-in-a-card/) | 6-12 each (UTM) | out of date; noindex and replace with a maintained /upcoming-events/ calendar |
| Mother's Day story posts | 11 | 30 Apr - 10 May 2026 | 1,163-1,548 | unique | 5 link /what-to-write-in-a-card/; 6 link a 404 | 2-3 each | link /mothers-day-messages/ and sibling posts; refresh for 9 May 2027; stepmom title '50+' vs 3 |
| 'When my…' story posts (sorry, graduation, love, congratulations, birthday brother, thank-you) | 6 | 11-16 May 2026 | 862-964 | unique | only /what-to-write-in-a-card/ (dead #anchors) | 3-4 each | link /sorry-messages/, /graduation-messages/, /anniversary-messages-for-wife/, /congratulations-messages/, /birthday-messages-for-brother/, /thank-you-messages/ |

</details>


## Privacy, ads, security & other

### [medium] Ads, identity-sync and analytics trackers fire before any consent, and the site's cookie banner is notice-only and blocks nothing

*Verdict: partly-confirmed* · Affected: /birthday-messages-for-mom/, /sympathy-condolences-messages/, /mothers-day-messages-for-wife-what-she-actually-wants/, sitewide (banner and GA4 on all 668 URLs; ad/ID stack on message pages)

**Evidence.** Reproduction: open https://blog.123greetings.com/birthday-messages-for-mom/ in a fresh profile (Playwright desktop, Chromium), leave the banner alone, then read cookies after 20 s (script agent-work/completeness/p1_privacy.mjs, results in p1_normal_desktop_birthday_messages_for_mom_.json).

What loaded before any interaction:
- 133 requests to 31 hosts.
- 17 cookies (see the table). They include _ga and _ga_R56NTBBBCB (400 days), __gads, __gpi and __eoi (Google Ad Manager), _pubcid (SharedID, 270 days), _cc_id/_cc_dc (Lotame), imid_secure (Intimate Merger), uid on .criteo.com (390 days), FCCDCF/FCNEC and _GRECAPTCHA (180 days).
- localStorage IDs for id5-sync.com, esp.criteo.com, yahoo.com (ConnectID), intimatemerger.com, rtbhouse and pubcid.org.
- The first ID-sync calls (Criteo, Lotame, ID5, Yahoo, IM, creativecdn) went out 3.5 s after navigation.

The banner does nothing. Its inline config (Beautiful Cookie Consent 4.9.2) is type:"info" (only 'Accept' and 'x'), revokable:"0", with the text "By using our site, you agree to our Cookie Policy". Everything above was already set while it was still showing.

No Consent Mode or consent handling:
- Every GA4 hit carries gcd=13l3l3l3l1l1 and no gcs, meaning no Consent Mode default is set.
- truereachAdRender.js (101 KB) contains 0 occurrences of 'consent', 'gdpr' or '__tcfapi'.

Where a CMP exists:
- Google Funding Choices (TCF CMP id 300) loads only through the ad script on message pages. From our US (Ohio) egress it reported gdprApplies:false, displayStatus:'disabled', us_privacy '1---' and GPP applicableSections [-1].
- On a blog post (/mothers-day-messages-for-wife-what-she-actually-wants/) there is no CMP at all: __tcfapi, __gpp and __uspapi are undefined. _ga, _ga_R56NTBBBCB, _GRECAPTCHA and the stats.wp.com/pixel.wp.com beacons still fire before any choice.

EU/UK and California behaviour could not be tested from a US IP. A GPC run (Sec-GPC:1 plus navigator.globalPrivacyControl=true) produced the same hosts and cookies, which is consistent with Ohio having no applicable state law, so that test is inconclusive.
[Verifier] My fresh desktop run (agent-work/critic-verify/mom_desktop.json):
- 131 requests to 33 hosts; 11 WordPress.com static assets returned 429, a sandbox artifact.
- The same 17 cookies were set by 6 s: _ga and _ga_R56NTBBBCB 400 d, __gads/__gpi 390 d, __eoi 180 d, _pubcid 270 d, Lotame _cc_id/_cc_dc, imid_secure, criteo uid 390 d, FCCDCF/FCNEC, _GRECAPTCHA 180 d.
- localStorage held _GESPSK-* keys for id5-sync.com, esp.criteo.com, yahoo.com, intimatemerger.com, rtbhouse and pubcid.org.

Banner: Beautiful Cookie Consent 4.9.2, type:"info", revokable:"0", text 'By using our site, you agree to our Cookie Policy.'

GA4: every hit has gcd=13l3l3l3l1l1 and no gcs, and the page has no gtag('consent') call.

Corrections:
- A CDP initiator trace (initiators.json) shows GPT's pubads_impl.js loads every ID module: IM secure-signal/provider.js, Yahoo connectId-gpt.js, SharedID pubcid.js, Lotame sync.min.js, RTB House encrypted-tag, ID5 esp.js and Criteo publishertag.ids.js. These are Ad Manager secure-signal providers. GPT also loads Funding Choices (fundingchoicesmessages.google.com/i/46400095). truereachAdRender.js mentions none of these vendors, so its 0 'consent'/'gdpr'/'__tcfapi' strings say nothing about whether they are consent-gated.
- Every gampad request carries gdpr=0, us_privacy=1--- and gpp_sid=-1, so the ad stack does read the CMP. The CMP (Funding Choices, id 300) returned gdprApplies:false, displayStatus 'disabled', GPP applicableSections [-1] and supportedAPIs ['7:usnat, 13:usfl'].
- On the blog post /mothers-day-messages-for-wife-what-she-actually-wants/ there is no CMP: __tcfapi, __gpp, __uspapi and googlefc are undefined. Cookies there were _ga, _ga_R56NTBBBCB and _GRECAPTCHA, plus stats.wp.com and pixel.wp.com beacons.
- A GPC run (Sec-GPC:1 plus navigator.globalPrivacyControl) produced an identical cookie set and us_privacy=1---. This is inconclusive from Ohio.
- The footer on every page already links 'Do Not Sell My Info' (www.123greetings.com/connect/optout, a CCPA opt-out form) and 'Request Opt In'.
- Pages sampled by curl (home, a tag page, a category page, a post, a message page, contact, 404) all carry the banner, GA4 and reCAPTCHA. truereach appears only on message pages.
- Whether anything waits for consent in the EEA/UK or California could not be tested.

**Fix.** 1. Add Consent Mode v2 defaults before gtag config, at minimum for EEA/UK/CH, and drive them from one CMP. Funding Choices is already attached to Ad Manager network 46400095, so enable its GDPR/US-state messages and load it on every template, not only through GPT on message pages. Then retire the notice-only Beautiful Cookie Consent banner.
2. In Ad Manager, review Admin > Secure signals (ID5, Criteo, Lotame, Yahoo ConnectID, IM, RTB House, SharedID) and turn off providers that aren't needed. Confirm with Google/truereach how secure signals behave under TCF. This is not a truereach script change.
3. Load reCAPTCHA only on /contact-us/.
4. Make the existing footer 'Do Not Sell My Info' route to an ad-tech opt-out (CMP/GPP), not only the email form.
5. Retest from EU and California IPs before drawing any compliance conclusion.

### [medium] Every ad request tells Google Ad Manager the page is https://www.123greetings.com/, and the blog's own ads.txt is a mis-scoped copy

*Verdict: partly-confirmed* · Affected: https://1437953666.rsc.cdn77.org/publisher/3d64cfc3-83fc-11f1-8ca4-8324842a64f3/truereachAdRender.js, /sympathy-condolences-messages/, /birthday-messages-for-mom/, /ads.txt, https://www.123greetings.com/ads.txt, all message pages that load truereach

**Evidence.** The page_url override:
- The base64 trAdsJSON config embedded in truereachAdRender.js has one entry per device (MOBILE and DESKTOP). Each defines the only slot, '/22081762831,46400095/123greetings_int', and then runs googletag.pubads().set('page_url', 'https://www.123greetings.com/').
- Live, today: the GAM request from /sympathy-condolences-messages/ (mobile) carried url=https://www.123greetings.com/ and loc=https://blog.123greetings.com/sympathy-condolences-messages/.
- All 25 gampad/ads requests in today's earlier Playwright logs (agent-work/performance/*.json: /birthday-messages-for-mom/, /mothers-day-messages/, /birthday-messages/) carry url=https%3A%2F%2Fwww.123greetings.com%2F.
- Result: buyers, brand-safety and contextual systems see the eCard home page, not the actual blog page (including bereavement pages). Declaring a page URL that isn't the page can be treated as inventory misrepresentation.

The ads.txt files:
- https://blog.123greetings.com/ads.txt has 1,265 lines. It starts '#V1 / #lettucelebrate.com / #V1-2026-01-22', which looks like another publisher's file.
- It has no OWNERDOMAIN/MANAGERDOMAIN, 1 malformed record ('OGURY.COM, 1103306f-e76b-478a-b374-059bf435c2ef', with no DIRECT/RESELLER), and 253 records that aren't in the root file.
- The root file (123greetings.com/ads.txt redirects 301 to www, 6,436 lines, OWNERDOMAIN=123greetings.com, MANAGERDOMAIN=adpushup.com) has no 'subdomain=blog.123greetings.com' line. Crawlers therefore ignore the blog's own file.

Reproduction: curl the script and base64-decode trAdsJSON. Or open any message page, filter DevTools Network by 'gampad/ads', and compare the url and loc parameters.
[Verifier] page_url:
- Decoded trAdsJSON (agent-work/critic-verify/trAdsJSON.json): the MOBILE and DESKTOP entries both define only '/22081762831,46400095/123greetings_int' and contain googletag.pubads().set('page_url', 'https://www.123greetings.com/') in their trht tag HTML.
- cur_pgurl:'1' disables truereach's own URL setter, so the value comes from this hard-coded tag.
- Live requests, all with url=https://www.123greetings.com/ and loc set to the real page: desktop /birthday-messages-for-mom/ (1 of 1), and mobile /sympathy-condolences-messages/, /summer-messages/ and /birthday-messages/ (3 of 3).
- The 25 complete gampad URLs in agent-work/performance/*.json all carry url=www.123greetings.com.
- Google's GPT reference describes page_url only as 'URL of the page on which ads are displayed'. It says nothing about how buyers or brand-safety systems use it.

ads.txt:
- blog.123greetings.com/ads.txt has 1,265 lines. Lines 1–2 are '#V1' and '#lettucelebrate.com'. '#V1-2026-01-22' is the last line (1265), not part of the header.
- There is no OWNERDOMAIN/MANAGERDOMAIN and 1 malformed line ('OGURY.COM, 1103306f-…').
- Records missing from the root file: 253 unique only when whole lines are compared, including cert-ID and case. Comparing (ad system, account ID), 169 unique sellers (173 lines) are blog-only.
- The blog file has no MoMagic entries. The root file does (a '#MOMAGIC' section with momagic.com, Momagic123greetings46400095, DIRECT).
- 123greetings.com/ads.txt redirects 301 to www: 6,436 lines, OWNERDOMAIN=123greetings.com, MANAGERDOMAIN=adpushup.com, no subdomain= line.
- So spec-compliant crawlers use the root file, and the blog file is effectively dead. Its practical impact is low, since authorization is checked on 123greetings.com either way.

**Fix.** 1. Ask truereach to remove the hard-coded page_url from both device configs, or set it to location.href.
2. Delete the stale blog ads.txt, or add 'subdomain=blog.123greetings.com' and keep a correct file. Keep the root file (which already lists MoMagic) as the source of truth.
3. Frame this as data accuracy, not a policy violation, unless Google or truereach confirms otherwise.

### [medium] No email capture or reminder sign-up anywhere, and 9 posts tell readers to 'set a reminder' without linking to 123Greetings' reminder service

*Verdict: partly-confirmed* · Affected: /happy-mothers-day-2026-messages-what-to-write-in-the-card/, /19th-may-your-week-with-bob/, /what-to-write-in-a-mothers-day-card-shell-actually-keep/, /mothers-day-messages-from-son-what-to-write-when-you-live-far-away/, https://www.123greetings.com/connect/birthdays, https://www.123greetings.com/connect/events/

**Evidence.** No sign-up form exists. Across all 668 crawled URLs the only forms are:
- 49 WordPress comment forms,
- 1 Contact Form 7 form,
- 1 search form,
- Jetpack Carousel comment forms on 363 pages.

The reminder services are never linked. The main site's footer offers "B'day Reminders" (/connect/birthdays) and 'Event Reminders' (/connect/events/), but the blog has 0 links to either: the only /connect/ links are the footer opt-out and opt-in. There are also no links to the brand's Facebook, Instagram or Pinterest profiles, which the www footer does link.

Posts that tell readers to set a reminder without linking the service:
- 8 Mother's Day posts, e.g. 'Set a reminder.' on /happy-mothers-day-2026-messages-what-to-write-in-the-card/ and 'Set a calendar reminder for May 1st.' on /what-to-write-in-a-mothers-day-card-shell-actually-keep/.
- /19th-may-your-week-with-bob/ ('a brand-new reminder and scheduling service').
- 5 of these 9 link /app, and none link a reminder sign-up.

A reader comment on /7th-june-your-weekly-bobcast/ ('I have very much enjoyed your newsletter') shows demand. The only subscription path left is RSS.
[Verifier] No email or newsletter capture exists. Forms across the 668 crawled URLs: 49 WP comment forms, 1 CF7 form, 1 search form and 363 Jetpack Carousel comment forms. Live checks on /, /birthday-messages-for-mom/, 3 posts and /7th-june-your-weekly-bobcast/ found no subscribe or newsletter markup and no comment-subscription checkbox. The blog never links the web reminder sign-ups (/connect/birthdays, /connect/events/); its only /connect/ links are the footer optout and optin. All 8 Mother's Day posts that mention reminders link www.123greetings.com/app in the same answer, and each presents the app as the way to schedule the card or be reminded. Examples: 'Set a calendar reminder for May 1st. Or let the 123Greetings app do the remembering for you…' and 'Set a reminder — or better, lock in the card right now. The 123Greetings app lets you … schedule it to send up to 60 days in advance'. Only /19th-may-your-week-with-bob/ describes the reminder and scheduling service without any link. The blog has no social-profile links and no sameAs. The www footer links social profiles through JS onclick handlers. The comment 'I have very much enjoyed your newsletter' (Dianna Caldwell, 9 June 2026) is present on /7th-june-your-weekly-bobcast/.

**Fix.** 1. Add an email opt-in with consent text (Jetpack Subscribe or an ESP form), e.g. occasion reminders plus message ideas.
2. Next to the existing app links, add a web alternative to /connect/birthdays or /connect/events/ with UTM tags, for readers who won't install an app.
3. Link the service from /19th-may-your-week-with-bob/.
4. Add social-profile links and Organization.sameAs.

### [medium] The only ad is a full-screen interstitial, requested on every message-page view, including sympathy pages

*Verdict: confirmed* · Affected: /summer-messages/, /birthday-messages/, /mothers-day-messages/, /sympathy-condolences-messages/, /birthday-messages-for-mom/

**Evidence.** The configuration:
- The truereach config sets ft:'interstitial' for both mobile and desktop, with acb 'CORNER' (mobile) and 'CLOSE' (desktop), intlr '0', and ncnt '' (no navigation-count cap set).
- The ad lives in div#TR-7a488296-83fe-11f1-8ca4-c3dcd911aa47: position:fixed at 0,0, full viewport (390x844 mobile, 1366x900 desktop), z-index 2147483647, visibility:hidden until filled.
- The GPT div's document y moved from 297 to 5344 as we scrolled, which confirms it is fixed rather than in-content.

When it is requested:
- One mobile session, 3 consecutive page views (/summer-messages/, then /birthday-messages/, then /mothers-day-messages/; p2_mobile.json): each view sent a fresh 123greetings_int request.
- Desktop /birthday-messages-for-mom/: request 3.6 s after navigation. Mobile /sympathy-condolences-messages/: 4.4 s.
- No other ad unit exists on any page tested. Earlier runs requested only this unit (25 of 25 requests).

Limits and corrections:
- No ad filled in our headless US sessions, so on-screen timing, countdown and close button could not be observed.
- REPORT.md line 442 describes this slot as 'one 300x250 GPT ad in content; no sticky/interstitial'. That description is wrong: it is the hidden interstitial container.
[Verifier] Config (decoded trAdsJSON):
- ft:'interstitial' on MOBILE and DESKTOP; acb 'CORNER' (mobile) and 'CLOSE' (desktop); intlr '0'; ncnt ''; tr ''.
- truereach's time cap compares seconds since lastRenderedTime against tr. With tr empty, no cap applies. With ncnt empty, the navigation counter is skipped.

Container: div#TR-7a488296-83fe-11f1-8ca4-c3dcd911aa47 is position:fixed with rect 0,0,390x844 on mobile and 0,0,1366x900 on desktop, z-index 2147483647, visibility:hidden. The GPT div is centred at 45,297, 300x250.

Requests: one mobile session (ads_session_mobile.json) sent one 123greetings_int request per view:
- /sympathy-condolences-messages/ at 3.55 s
- /summer-messages/ at 4.2 s
- /birthday-messages/ at 3.4 s
Desktop /birthday-messages-for-mom/ requested at 3.8 s. Timings differ slightly from the critic's (3.6 s and 4.4 s), which is normal run-to-run variation.

Other checks:
- Only one GPT slot exists and there are no ins.adsbygoogle elements.
- No fill occurred, so display, countdown and close button were not observed.
- REPORT.md line 442 does say '/halloween-messages/ … one 300x250 GPT ad in content; no sticky/interstitial', which misreads the hidden fixed container.
- The count of 242 is the pages with message blocks in pages.json. That they all load truereach is inferred from page samples.

**Fix.** 1. Confirm with truereach when the interstitial shows. It should be navigation-triggered only (never on first arrival), capped at one per session, and closable immediately. Better, switch to GPT's native out-of-page interstitial (googletag.enums.OutOfPageFormat.INTERSTITIAL), which follows the Better Ads Standards.
2. Exclude sympathy, condolence and loss pages.
3. Add in-content display units between message sections, which are more viewable and less intrusive.
4. Check Search Console for intrusive-interstitial signals.

### [medium] eCard click-throughs and message copies aren't measured as goals, most eCard links carry no campaign tags, and the blog and main site use separate GA4 properties

*Verdict: confirmed* · Affected: /summer-messages/, /birthday-messages-for-mom/, https://www.googletagmanager.com/gtag/js?id=G-R56NTBBBCB, https://www.123greetings.com/, 132 pages with in-content eCard links

**Evidence.** Separate properties:
- The blog sends to GA4 G-R56NTBBBCB.
- www.123greetings.com (where eCards are sent) uses G-47Q5QDHYDP, plus legacy UA-5085183-1 and AW-18134250822.

Click-throughs are tracked but not goals:
- Clicking the in-content 'summer' link on /summer-messages/ (p3_click.json) sent en=click with ep.link_url=https://www.123greetings.com/events/summer/, link_domain=123greetings.com and outbound=true.
- But the tag's only key-event rule (__ccd_conversion_marking) is the default 'purchase', which never fires on the blog.

Copies aren't tracked at all: the copy button's inline handler (on every message page) only calls navigator.clipboard.writeText(). There is no gtag, dataLayer or _stq call.

Campaign tags (links.json):
- 599 in-content links to 123Greetings eCard hosts on 132 pages.
- Only 56 carry UTM parameters: 49 with utm_source=blog on 4 Bob posts, and 7 wrongly tagged utm_source=chatgpt.com/gemini.
- 543 are untagged.
[Verifier] Measurement IDs:
- The blog's inline gtag config is G-R56NTBBBCB.
- The www home page configures G-47Q5QDHYDP, UA-5085183-1 and AW-18134250822.

Key-event rules:
- The blog container's __ccd_conversion_marking has only ['purchase'].
- The www container has 17 rules (purchase, card_count, import, mobile_cards_created, ads_conversion_page_view …).
- Key events are property-level, so this points to two separate properties. Neither container has a cross-domain linker.

Click test (click.json): clicking the in-content 'summer' link on /summer-messages/ sent en=click with ep.link_url=https://www.123greetings.com/events/summer/, ep.link_domain=123greetings.com and ep.outbound=true. It also sent a Jetpack pixel.wp.com/c.gif click beacon.

Copy button: the handler is attached via addEventListener in an inline script. It calls only navigator.clipboard.writeText(message.innerText); there is no gtag, dataLayer or _stq call.

Links (pages.json, in_main links to non-blog 123greetings hosts):
- 608 links on 134 pages (critic: 599 on 132).
- 56 carry UTM: 49 utm_source=blog on 4 posts, all authored by Bob; 6 utm_source=chatgpt.com; 1 utm_source=gemini.
- About 552 are untagged.

**Fix.** 1. In GA4, create an 'ecard_click' event (click where link_domain contains 123greetings.com) and mark it as a key event.
2. Add gtag('event','copy_message',{section:<H2>, page_path}) to the copy handler.
3. UTM-tag all CTAs: utm_source=blog&utm_medium=referral&utm_campaign=<page-slug>&utm_content=<cta-position>.
4. Either add the blog as a second data stream in the www property or send key events to both, so blog-assisted eCard sends show up where revenue is measured.
5. Remove the dead UA tag on www.

### [low] A publishing account's login email is public and confirmed, and the REST API lists every user

*Verdict: partly-confirmed* · Affected: /wp-json/wp/v2/users, /author/iblog123greetingsgmail-com/, /wp-json/oembed/1.0/embed?url=https%3A%2F%2Fblog.123greetings.com%2Fbirthday-messages-for-mom%2F, /xmlrpc.php, /wp-login.php

**Evidence.** The email is confirmed:
- Bob's author og:image (in yoast_head from /wp-json/wp/v2/users) is Gravatar hash 7dc5101ac210bbf3844f55d033bd58844672b6a0f0cdcf6c07eefd226c09e8ed.
- That is exactly sha256('[account email]'). So the author slug 'iblog123greetingsgmail-com', which SEO flagged for authorship, is also a publicly verifiable consumer Gmail login for an account that publishes all 49 posts.

What /wp-json/wp/v2/users exposes (200, X-WP-Total 2):
- 'Andrea gomes' (id 272191372, slug blog123greetings, url http://blog123greetings.wordpress.com) and 'Bob' (id 272191379).
- Internal user meta: wp_wpcom_plan_expiry_* and elementor_introduction flags (e.g. black_friday_pointer_2025, conversion_banner_go_pro).
- oEmbed for message pages returns author_name 'Andrea gomes'.

Authentication surface:
- /wp-login.php redirects 302 to WordPress.com Jetpack SSO (site_id 248970765).
- /xmlrpc.php is enabled (405 'XML-RPC server accepts POST requests only') and is advertised by <link rel=pingback> and RSD (/xmlrpc.php?rsd lists the WordPress, MetaWeblog, Blogger and Movable Type APIs).
- The REST index advertises application passwords.

A known login email plus these entry points makes targeted phishing and credential stuffing against a publishing account easy.
[Verifier] Users endpoint:
- GET /wp-json/wp/v2/users returns 200 with X-WP-Total 2: 'Andrea gomes' (272191372, slug blog123greetings, url http://blog123greetings.wordpress.com) and 'Bob' (272191379, slug iblog123greetingsgmail-com).
- Bob's yoast_head Gravatar hash 7dc5101ac210bbf3844f55d033bd58844672b6a0f0cdcf6c07eefd226c09e8ed equals sha256('[account email]').
- /wp/v2/posts shows X-WP-Total 49, all by author 272191379 (Bob).
- meta shows wp_wpcom_plan_expiry_notice_dismiss/modal_dismiss/modal_dismiss_grace (all 0). Andrea's record has elementor_introduction flags (black_friday_pointer_2025, conversion_banner_go_pro and others). Bob's is empty.

Other endpoints:
- oEmbed for /birthday-messages-for-mom/ returns author_name 'Andrea gomes'.
- /wp-login.php redirects 302 to wordpress.com/wp-login.php?action=jetpack-sso&site_id=248970765.
- GET /xmlrpc.php returns 405 'XML-RPC server accepts POST requests only.'. Pages carry rel=pingback and an RSD link. The RSD lists WordPress, Movable Type, MetaWeblog, Blogger and WP-API.
- The /wp-json/ index advertises application-passwords.

Caveats:
- The anonymous users endpoint shows only authors of published content, so other accounts, including admins, may exist.
- The hash proves the account's email, and WordPress.com SSO accepts email as a login identifier.
- 2FA status and whether XML-RPC accepts password auth were not tested; that would need login or POST attempts, which are out of scope.

**Fix.** 1. Move both users to company-domain addresses (@123greetings.com) and enforce WordPress.com 2FA for every user.
2. Change user_nicename (SEO's 301 plan still applies).
3. Hide /wp/v2/users from anonymous visitors, e.g. a Code Snippets 'rest_endpoints' filter that unsets '/wp/v2/users' and '/wp/v2/users/(?P<id>[\d]+)' when !is_user_logged_in(). Also stop Elementor meta appearing in the public schema.
4. Revoke unused application passwords.
5. If no Jetpack feature needs XML-RPC, block it except for Jetpack's IP ranges (ask WordPress.com support on Atomic).

### [low] Admin plugins with remote-control endpoints (Code Snippets, MCP adapter, Elementor MCP Composer) plus leftover unused plugins enlarge the attack surface

*Verdict: partly-confirmed* · Affected: /wp-json/, /wp-json/code-snippets/v1/snippets, /wp-json/mcp/mcp-adapter-default-server, /wp-json/elementor-mcp-composer/v1.0.17/mcp-settings, /wp-json/wpforms/v1/setup-wizard/license/key

**Evidence.** /wp-json/ lists 40 namespaces and 882 routes. They include:
- code-snippets/v1: 23 routes, including snippet create, activate and export. The plugin runs arbitrary PHP.
- mcp: /mcp/mcp-adapter-default-server with GET, POST and DELETE.
- wp-abilities/v1: …/abilities/{name}/run with all methods.
- elementor-mcp-composer/v1.0.17: mcp-settings and mcp-credentials.
- elementor-ai/v1, and elementor-one/v1 (plugin/theme install and activate).
- wpforms/v1 setup-wizard, although the site uses CF7 and has 0 WPForms forms.
- Two testimonial plugins (sp-rtp/v2, real-testimonial/v2) with no testimonials rendered.
- newspack-blocks/v1.
- livevisitor/v1, whose POST /update/{post_id} is a public counter route.

Access control works: all 18 anonymous GETs to sensitive routes returned 401/403 (e.g. rest_forbidden on /code-snippets/v1/snippets and /mcp/mcp-adapter-default-server; invalid_nonce on elementor-mcp-composer). Only /code-snippets/v1/snippets/schema returned 200, and it holds the schema only.

This is hygiene, not a vulnerability. But a compromised publishing account (see the email-exposure finding) could use these to run code or grant an AI agent site access.
[Verifier] Corrections to the critic's details:
1. The two testimonial namespaces (sp-rtp/v2 with 9 routes, real-testimonial/v2 with 3) belong to one plugin, Real Testimonials (testimonial-free 4.0.0), not two plugins. It enqueues 4 stylesheets on every page (font-awesome, style-rtp-blocks, swiper and fontello), although no testimonial markup was seen.
2. The critic's own cache shows that not all 18 anonymous GETs returned 401 or 403. /livevisitor/v1/count/7608 returned 400 'Invalid post ID' and /sp-rtp/v2/export-posts returned 400 'Missing parameter(s): type'. WP REST validates parameters before running permission callbacks, so these 400s do not indicate open access.
3. That livevisitor POST /update/{post_id} is public cannot be verified with a read-only check. The index lists methods, not permissions, and no livevisitor front-end call appears in the page HTML.
4. The zero WPForms forms figure only means none rendered on the 668 crawled URLs.
5. The risk from a compromised publishing account applies only if that account has admin rights; these routes require elevated capabilities.

**Fix.** 1. Remove unused plugins: WPForms (and its robots.txt block), Real Testimonials (testimonial-free), Newspack Blocks, and Live Visitor if it is unused. Removing testimonial-free also removes 4 stylesheets from every page.
2. Keep the MCP adapter, Elementor MCP Composer and Code Snippets deactivated when not in use.
3. Audit administrators and application passwords, and turn on activity-log alerts.

### [low] Favicon and app icons: /favicon.ico is blank, /apple-touch-icon.png is a white square, and there is no web manifest

*Verdict: confirmed* · Affected: /favicon.ico, /apple-touch-icon.png, /wp-content/uploads/2025/10/cropped-favicon.jpg, /manifest.json, /site.webmanifest

**Evidence.** Root icon files:
- /favicon.ico returns 200: a 198-byte 16x16 icon with every pixel fully transparent.
- /apple-touch-icon.png returns 200: a 162-byte 100x100 plain white PNG.
- Tools that request these root paths directly (feed readers, bookmark sync, some link unfurlers) show a blank icon.

Declared icons: every page declares the same 512x512 JPEG (cropped-favicon.jpg) as the 32x32 icon, the 192x192 icon, the apple-touch-icon and the msapplication-TileImage.

Missing:
- no <link rel=manifest>; /manifest.json and /site.webmanifest return 404;
- no theme-color meta.

The main site serves proper PNG apple-touch-icons from 57x57 to 180x180 (c.123g.us/images/apple-touch-icon/).
[Verifier] Live: /favicon.ico 200, 198 B, 16x16, all pixels transparent. /apple-touch-icon.png and /apple-touch-icon-precomposed.png 200, 162 B, 100x100, solid white. /manifest.json and /site.webmanifest 404. All sampled pages declare cropped-favicon.jpg (a 512x512, 37.5 KB JPEG) for 32x32, 192x192, apple-touch-icon and TileImage, with no manifest link or theme-color. The feed's <image> also points to this JPEG, so feed readers that use it get a real icon. The www site declares 9 PNG touch icons, 57-180 px.

**Fix.** 1. Upload a square PNG Site Icon (Customizer > Site Identity).
2. Replace the root favicon.ico (16/32/48) and apple-touch-icon.png (180x180, opaque background) over SFTP on Atomic.
3. Add a site.webmanifest (name, short_name, icons 192/512 PNG, theme_color) and <meta name=theme-color>.
4. See the performance finding for the icon's file size.

### [low] No clickjacking, MIME-sniffing or referrer headers; the contact form renders inside a third-party frame

*Verdict: confirmed* · Affected: /, /birthday-messages-for-mom/, /contact-us/

**Evidence.** Response headers on /, /birthday-messages-for-mom/ and /contact-us/ contain only:
- strict-transport-security: max-age=31536000 (no includeSubDomains),
- a permissions-policy for private-state-tokens,
- x-hacker ('Want root? Visit join.a8c.com…', WordPress.com default, harmless).

Missing: X-Frame-Options, any Content-Security-Policy (no frame-ancestors), X-Content-Type-Options and Referrer-Policy.

The framing test (p5_frame.mjs, shots/p5_frame_contact.png): a simulated third-party origin iframed https://blog.123greetings.com/contact-us/. It rendered and the CF7 fields (your-name, your-email, your-subject, your-message) were live inside the frame.

With no CSP, nothing limits the third-party truereach loader, which injects HTML and script templates (trht/trbd) through innerHTML on message pages.
[Verifier] Live headers (13:42 UTC) on /, /birthday-messages-for-mom/ and /contact-us/: strict-transport-security max-age=31536000 (no includeSubDomains); a permissions-policy limited to private-state-token; x-hacker; no XFO, CSP, XCTO or Referrer-Policy header and no meta equivalents. An independent frame test from a third-party origin rendered /contact-us/ with all CF7 fields visible and enabled, and no frame-busting script was present.

**Fix.** 1. Add headers with a send_headers snippet (Code Snippets is already installed) or through WordPress.com support: 'X-Frame-Options: SAMEORIGIN', 'Content-Security-Policy: frame-ancestors 'self'', 'X-Content-Type-Options: nosniff' and 'Referrer-Policy: strict-origin-when-cross-origin'.
2. Purge the edge cache so cached pages pick up the headers.
3. Later, consider a report-only CSP to inventory script origins.

### [low] Printing a message page wastes paper: both headers, the jump menu, 124 copy icons and the back-to-top button print; 62 messages take 7 pages

*Verdict: partly-confirmed* · Affected: /congratulations-messages/, /birthday-messages/

**Evidence.** Measured in Playwright with emulateMedia('print') and page.pdf(Letter) (agent-work/completeness/p4_print*.pdf, shots/p4_printletter_congratulations_messages_.png).

The site's CSS has no print stylesheet: only 2 @media print rules across the 69 readable stylesheets.

On /congratulations-messages/ (62 messages):
- 7 Letter pages.
- Both the desktop header (logo and menu) and the mobile header (second logo and hamburger) print.
- The 'Emotions' jump menu keeps a column about 30% wide, which stays empty after page 1.
- 124 copy-icon buttons, the fixed back-to-top button and the dark footer all print.

/birthday-messages/ (hub) prints 4 pages of navigation tiles on dark backgrounds. People often print or copy a message to hand-write in a card.
[Verifier] /congratulations-messages/ (62 messages) prints to 7 Letter pages in both background modes. Printed on page 1: both headers (two logos, menu and hamburger) and the Emotions jump menu, whose column (about 31% of the width) stays empty on pages 2-7. The 62 copy-icon buttons (one per message) print, as does the fixed back-to-top button: a faint chevron on every page by default, a blue square with background graphics on. The footer prints on page 7; it is dark only with background graphics enabled. /birthday-messages/ prints 4 pages of navigation tiles, dark with backgrounds on and faint grey text with Chrome's defaults. There are 2 @media print rules across 69-70 readable stylesheets. Files: agent-work/critic-verify/print_*.pdf and shots/cg_*.png, bd_*.png.

**Fix.** Add a print stylesheet via Customizer > Additional CSS: @media print { .penci-header-wrap, .penci_navbar_mobile, [data-elementor-type=header], [data-elementor-type=footer], the jump-menu column, .copy-icon-btn, #penci-go-to-top/.penci-go-to-top-floating, .cc-window, [id^=TR-] {display:none} content column {width:100%} blockquote/message {break-inside:avoid} body {font-size:12pt; color:#000; background:#fff} }. Optionally add a 'Print these messages' button.

### [low] The RSS feed only syndicates the stalled 'Bob' diary: 10 items with 2 titles, no message pages, last item 2 Aug

*Verdict: partly-confirmed* · Affected: /feed/, /comments/feed/, /

**Evidence.** /feed/ (RSS 2.0, 49 KB) has 10 items, all by 'Bob':
- 'Five Minutes With Bob' x7 and 'Wake Up With Bob' x3.
- Newest pubDate Sun, 02 Aug 2026; lastBuildDate Sat, 01 Aug 2026.
- Each item carries 11-21 <category> tags.

None of the 242 message pages can appear, because they are WordPress Pages.

The channel title is the 91-character tagline.

The home <head> has two <link rel=alternate> entries for the same /feed/ with different titles ('…RSS Feed' from the theme and '… » Feed' from core), plus Atom and a comments feed. The comments feed holds just 3 comments.
[Verifier] Live /feed/: 10 items, all by Bob (Five Minutes With Bob x7, Wake Up With Bob x3). Newest pubDate Sun, 02 Aug 2026 13:00:52 +0000; lastBuildDate Sat, 01 Aug 2026 10:04:21 +0000; 11-21 categories per item. Channel title = site title (88 characters); tagline = 'Card Messages & Wishes for Every Occasion.' No posts since 2 Aug (REST). 242 message URLs are Pages, so they are excluded from the feed. /comments/feed/ has 3 comments (17 Jul, 9 Jun, 9 Jun). The home head has duplicate RSS alternates for /feed/, plus Atom and comments feeds.

**Fix.** 1. Syndicate what readers want: a feed of new and updated message pages (e.g. a small snippet adding 'page' to the main feed query, or a dedicated /feed/?post_type=page) with a featured image.
2. Retitle the Bob items, or drop them from the feed.
3. Shorten the site title.
4. Remove the theme's duplicate feed link.
5. Use the feed for email-by-RSS and Pinterest/Flipboard auto-publishing.

### [low] The blog's privacy and cookie policies don't cover the blog's own trackers or data collection, and it has no privacy page of its own

*Verdict: partly-confirmed* · Affected: https://www.123greetings.com/privacy_policy.html, https://www.123greetings.com/cookie_policy.html, /privacy-policy/, /contact-us/, sitewide footer (511 pages link these policies)

**Evidence.** The footer links go to www.123greetings.com pages; /privacy-policy/ on the blog returns 404.

privacy_policy.html ('Last Updated: February 24, 2026') has 0 mentions of:
- WordPress, Automattic, Jetpack, reCAPTCHA, Gravatar or truereach,
- California, CCPA or CPRA, GDPR,
- 'Global Privacy Control' or 'Do Not Track'.

cookie_policy.html:
- lists only Google Analytics, Bitly and YouTube (performance), and GA advertising features, Doubleclick, Rubicon and Pubmatic (advertising);
- names no cookies;
- relies on 'By continuing to use our site, you agree to the placement of cookies'.

Vendors observed on the blog but absent from both policies: Criteo, Lotame (crwdcntrl), ID5, RTB House, Yahoo ConnectID, Intimate Merger (im-apps.net), SharedID/_pubcid, Google Funding Choices, reCAPTCHA, WordPress.com Stats/pixel and truereach/MoMagic.

Data the blog collects without a notice at the point of collection:
- The Contact Form 7 form (name, email, subject, message, plus the Akismet honeypot _wpcf7_ak_hp_textarea).
- The comment form on 49 posts.
- GA4 user-provided-data auto-collection: the gtag container for G-R56NTBBBCB has __ogt_1p_data_v2 with isEnabled:true, isAutoEnabled:true, autoEmailEnabled:true, autoPhoneEnabled:true and autoAddressEnabled:true.
[Verifier] What checks out:
- blog /privacy-policy/ returns 404.
- Footer Privacy Policy and Cookie Policy links point to www.123greetings.com and appear on 667 of 668 crawled pages per pages.json, not 511.
- privacy_policy.html is 'Last Updated: February 24, 2026' and has 0 mentions of WordPress, Automattic, Jetpack, reCAPTCHA, Gravatar, truereach, MoMagic, California, CCPA, CPRA, GDPR, Global Privacy Control or Do Not Track.
- cookie_policy.html lists Google Analytics, Bitly and YouTube (performance) and GA advertising features, Doubleclick, Rubicon and Pubmatic (advertising), names no individual cookies, and says 'By continuing to use our site, you agree to the placement of cookies'.
- Neither policy names Criteo, Lotame, ID5, RTB House, Yahoo, Intimate Merger, SharedID, Funding Choices or Akismet.
- The CF7 form collects your-name, your-email, your-subject, your-message, _wpcf7_ak_hp_textarea and a reCAPTCHA token, with no notice nearby. The comment form appears on all 49 posts.
- The blog gtag container's __ogt_1p_data_v2 has isEnabled, isAutoEnabled, autoEmailEnabled, autoPhoneEnabled and autoAddressEnabled all true.

Corrections:
- The cookie policy says it covers '123greetings.com and 123invitations.com domain names and other sites owned, operated or controlled by 123Greetings.com, Inc.' and even mentions commenter IDs.
- The privacy policy has a 'Third Party Ad Advertising' section (ad networks using cookies and web beacons) and covers User Content and comments.
- Every blog page's footer also links 'Do Not Sell My Info' (www.123greetings.com/connect/optout, a CCPA opt-out form that names the CCPA) and 'Request Opt In'.

**Fix.** 1. Publish a blog privacy notice, or a blog section in the main policy. It should list each processor/vendor (WordPress.com/Automattic incl. Akismet and Stats, Google GA4/Ad Manager/reCAPTCHA/Funding Choices, truereach/MoMagic and each ID vendor), purposes, retention and a cookie table with names and lifetimes.
2. Add GDPR and US-state rights sections, including GPC handling.
3. Put a short notice with a policy link under the contact and comment forms.
4. Either disclose GA4 user-provided-data collection or turn off its automatic detection.
5. Replace the 'continuing to use' wording once a real CMP is in place.


<details><summary><b>Table: Cookies set before any banner interaction (fresh desktop profile, /birthday-messages-for-mom/, 20 s, no clicks)</b> (17 rows)</summary>

| cookie | domain | lifetime (days) | vendor |
|---|---|---|---|
| _ga | .123greetings.com | 400 | Google Analytics 4 |
| _ga_R56NTBBBCB | .123greetings.com | 400 | Google Analytics 4 |
| __gads | .123greetings.com | 390 | Google Ad Manager |
| __gpi | .123greetings.com | 390 | Google Ad Manager |
| __eoi | .123greetings.com | 180 | Google Ad Manager |
| test_cookie | .doubleclick.net | session | Google DoubleClick |
| FCCDCF | .123greetings.com | 390 | Google Funding Choices (CMP) |
| FCNEC | .123greetings.com | 365 | Google Funding Choices (CMP) |
| _pubcid | .123greetings.com | 270 | SharedID (Prebid) |
| _cc_id | .123greetings.com | 270 | Lotame |
| _cc_id | .crwdcntrl.net | 270 | Lotame |
| _cc_dc | .crwdcntrl.net | 270 | Lotame |
| panoramaId_expiry | .123greetings.com | 1 | Lotame Panorama ID |
| imid_secure | .im-apps.net | 400 | Intimate Merger |
| imid_created_secure | .im-apps.net | 400 | Intimate Merger |
| uid | .criteo.com | 390 | Criteo |
| _GRECAPTCHA | www.google.com | 180 | Google reCAPTCHA (loads on every page) |

</details>


<details><summary><b>Table: Other gap checks run (no issue, informational or not testable)</b> (20 rows)</summary>

| check | result | status |
|---|---|---|
| http://blog.123greetings.com/ | 301 to https | ok |
| blog123greetings.wordpress.com | 301 to https://blog.123greetings.com/ | ok |
| Search reflection /?s=<b>audittest</b>"' | HTML-escaped in title and body; noindex | ok |
| /wp-content/uploads/, /wp-content/debug.log | 403 | ok |
| /readme.html, /license.txt | 200 (WordPress.com defaults; readme noindex, no version) | info |
| Attachment URL /home/oct11/ | 301 to the image file (Yoast) | ok |
| Date archives /2026/, /2026/08/ | 200, noindex | ok |
| /birthday-messages-for-mom/2/ and ?replytocom=1 | 301 to canonical | ok |
| /Birthday-Messages-For-Mom/ (uppercase) | 200 with canonical to the lowercase URL | acceptable |
| /wp-sitemap.xml | 301 to /sitemap_index.xml | ok |
| 18 sensitive REST routes (anonymous GET) | 401/403 on all except the code-snippets schema | ok |
| GA4 page_view per page load | exactly 1, so no double counting; outbound clicks tracked | ok |
| html lang / og:locale | en-US / en_US on all 668 URLs; single language, no hreflang needed; WordPress timezone Asia/Kolkata | ok |
| GPC (Sec-GPC:1 + navigator.globalPrivacyControl) | same 31 hosts and ID cookies; CMP reports no applicable state (Ohio egress) | inconclusive |
| EU/UK consent behaviour | not testable from a US IP | not tested |
| Comment spam | 3 approved comments ever (IDs up to 57), none spammy; comment_status open on 49/49 posts and on media (5/5 sampled); Jetpack Carousel comment form on 363 pages | info |
| Affiliate/sponsored links needing disclosure | none: external links are only api.whatsapp.com share links and 3 Wikipedia links | ok |
| Contact email bob@123greetings-inc.com | MX at Rackspace works; SPF ~all; no DMARC record (the brand domain 123greetings.com has p=none) | info |
| robots.txt and AI crawlers | no AI-bot blocks; nothing to fix | info |
| Cross-browser (WebKit/Firefox) | only Chromium is installed in this sandbox | not tested |

</details>


## Thin pages — highest priority

| Page | Words | Messages | Title claims | Score | What to add (top items) |
|---|---|---|---|---|---|
| [/messages-for-5th-anniversary/](https://blog.123greetings.com/messages-for-5th-anniversary/) | 30 | 1 | 50 | 1 | Add 50+ messages in sections: For Husband, For Wife, For a Couple, Funny, Wood-Themed ('knock on wood', 'deep roots'), Romantic, Religious/Blessings.; Add an intro: the 5th anniversary is wood (traditional) and silverware (modern), with gift ideas.; Add tips and sign-offs such as 'Five years rooted in love'. |
| [/easter-messages/](https://blog.123greetings.com/easter-messages/) | 31 | 2 | 75 | 1 | Intro: Easter 2027 is Sunday, March 28, 2027. Briefly cover its meaning (the Resurrection) and secular traditions (eggs, the Easter bunny).; Add “Religious / He Is Risen” (15, including short scripture lines such as Matthew 28:6), “For Family” (10), “For Friends” (10), “For Kids & Grandkids” (10), “For Coworkers” (6), “Funny / Bunny Puns” (12), “Short Texts” (15) and “Easter Card Sign-offs” (10).; Add Good Friday / Holy Week and Easter Monday lines. |
| [/april-fools-day-messages/](https://blog.123greetings.com/april-fools-day-messages/) | 44 | 2 | 50 | 1 | An intro: April 1 origins (the 1582 calendar-change theory, 'poisson d’avril', 'hunting the gowk' in Scotland) and rules for harmless pranks; A 'Funny April Fools’ Texts' section with 15 prank messages; A 'For Friends' section with 8, a 'For Family / Kids' section with 8 and a 'For Coworkers (office-safe)' section with 8 |
| [/international-yoga-day-messages/](https://blog.123greetings.com/international-yoga-day-messages/) | 44 | 2 | 50 | 1 | Add an intro: International Day of Yoga is June 21. The UN declared it in 2014 after India proposed it, and it was first observed in 2015. Mention the annual theme.; Add 50+ messages in sections: 'Wishes for Friends & Family' (10), 'For Yoga Teachers / Students' (8), 'Health & Wellness Wishes' (8), 'Short WhatsApp / Instagram Captions' (10), 'Yoga Quotes' (Patanjali, B.K.S. Iyengar; 8), 'Funny Yoga Wishes' (6).; Add a FAQ block: When is International Yoga Day? What is this year’s theme? How can I celebrate at home? |
| [/engagement-messages/](https://blog.123greetings.com/engagement-messages/) | 45 | 1 | 100 | 1 | Add “For a Friend” (12), “For Sister / Brother” (8), “For Son / Daughter” (8), “For a Coworker” (8), “Romantic – for Your Fiancé(e)” (10), “Funny” (12), “Religious Blessings” (8) and “Short Texts & Social Comments” (15).; Intro plus how-to-write tips: congratulate both partners, mention the proposal story, look ahead to the wedding. Sign-off ideas: “Cheers to forever”, “Can’t wait to celebrate you both”.; FAQs: What do you write in an engagement card? Do you address the bride, the groom or both? Should you send a gift? What should you comment on an engagement post? |
| [/national-childrens-day-messages/](https://blog.123greetings.com/national-childrens-day-messages/) | 53 | 3 |  | 1 | Add 30+ messages in sections: From Parents (8), From Grandparents (5), From Teachers (6), For Kids to Read Themselves, simple words (6), Funny (5); Add an intro clarifying dates: US National Children’s Day (2nd Sunday in June), India Children’s Day (Nov 14, Nehru’s birthday), Universal Children’s Day (Nov 20); Add 10 short captions and a 'what to write for a child' tip list (praise effort, be specific) |
| [/messages-for-1st-birthday/](https://blog.123greetings.com/messages-for-1st-birthday/) | 76 | 4 | 80 | 1 | Add 75+ messages in sections: From Mom & Dad (to baby), From Grandparents, For Baby Boy, For Baby Girl, For Twins, For Godchild/Niece/Nephew, Funny Cake-Smash Messages, Religious Blessings, Instagram Captions, Baby-Book Notes for the Future.; Add an intro on why the first birthday is really for the parents too, with messages to congratulate the parents on surviving year one.; Add tips: write it to the future reader (the child at 18), include a first-year milestone. |
| [/anniversary-messages-for-brother/](https://blog.123greetings.com/anniversary-messages-for-brother/) | 84 | 3 | 100 | 1 | Expand to 60+: For Brother & Sister-in-Law (15), Heartfelt (10), Funny/Sibling Roast (12), From Sister (6), From Brother (6), Milestones — 1st, 10th, 25th, 50th (8), Religious Blessings (5), Short Texts (8); Intro plus tips on addressing the couple and including the sister-in-law; FAQs: 'What do you write in an anniversary card for your brother and his wife?' |
| [/earth-day-messages/](https://blog.123greetings.com/earth-day-messages/) | 88 | 4 | 50 | 1 | Intro: Earth Day is April 22 (Thursday, April 22, 2027). It was founded in 1970 by Sen. Gaylord Nelson. Mention the yearly EARTHDAY.ORG theme.; Add “Inspirational” (10), “Funny” (10), “For Kids & Students” (8), “For Teachers / Classrooms” (6), “For Coworkers & Green Teams” (6), “Short Captions & Hashtags” (15) and “Eco Pledges to Share” (8).; Tips: pair a wish with an action such as planting a tree or joining a cleanup. Sign-off ideas: “Green regards”, “For the planet”. |
| [/messages-for-80th-birthday/](https://blog.123greetings.com/messages-for-80th-birthday/) | 92 | 5 | 60 | 1 | Add 55+ messages in sections: For Grandma, For Grandpa, For Mom, For Dad, For Friend, Gentle Funny ('20 four times'), Heartfelt, Religious/Blessings, Toasts.; Add an intro and tips: mention eight decades of history they’ve lived through, and write legibly or large-print.; Add sign-offs: 'Eighty and extraordinary,' 'With love from all your grandkids'. |
| [/messages-for-50th-birthday/](https://blog.123greetings.com/messages-for-50th-birthday/) | 92 | 5 | 60 | 1 | Add 55+ messages in sections: Funny 'Half-Century', Heartfelt, For Husband, For Wife, For Mom, For Dad, For Best Friend, For Coworker, Inspirational, Religious/Blessings.; Add an intro on the 'golden' 50 milestone, with party-toast ideas.; Add sign-offs: 'Fabulous at fifty,' 'Here’s to the next 50'. |
| [/birthday-messages-for-boyfriend/](https://blog.123greetings.com/birthday-messages-for-boyfriend/) | 102 | 5 | 100 | 1 | Sections: Romantic (20), Funny (15), Cute/Sweet (15), Short texts (15), Instagram captions (10), Long paragraphs to make him cry (5); Add 8 'First birthday together' and 8 Long-distance boyfriend wishes; Add 6 milestone wishes (his 21st, 25th, 30th) and 5 flirty/spicy-but-card-safe lines |
| [/heartfelt-belated-birthday-messages/](https://blog.123greetings.com/heartfelt-belated-birthday-messages/) | 103 | 4 | 50 | 1 | Add 45+ heartfelt belated wishes in sections: 'Sincere Apologies' (8), 'For Best Friend' (6), 'For Mom' / 'For Dad' (5 each), 'For Husband / Wife' (5 each), 'For Sister / Brother' (4 each), 'For Coworker' (4), 'Short Texts' (8).; Add an intro on why a late but sincere wish still matters, and how to acknowledge being late without over-apologizing.; Add tips: one sentence of apology, then shift the focus fully to them; mention something specific from their year. |
| [/work-anniversary-messages/](https://blog.123greetings.com/work-anniversary-messages/) | 105 | 5 |  | 1 | Add 60+ messages in sections: From Manager to Employee (10), To My Boss (8), To a Coworker (10), For the Team/Group Card (5), Funny (10), 1-Year (5), 5-Year (5), 10-Year (5), 20+ Years / Near Retirement (5); LinkedIn comment replies and 'how to respond to work anniversary wishes' (10 thank-you replies); Intro plus tips: mention a specific contribution, keep it professional, sign-off ideas |
| [/dance-day-messages/](https://blog.123greetings.com/dance-day-messages/) | 111 | 6 | 30 | 1 | Intro: International Dance Day falls on April 29 (next: Thursday, April 29, 2027). The ITI Dance Committee created it in 1982, on the birthday of ballet reformer Jean-Georges Noverre.; Rename the existing block to “For Your Dance Partner” and add 10 more romantic lines.; New sections: “For Dancers & Dance Students” (10), “For Dance Teachers & Choreographers” (8), “For Your Dance Crew / Friends” (8), a genuinely “Funny” section (10 two-left-feet jokes), “Inspirational” (8) and 15 short Instagram captions with hashtags. |
| [/birthday-messages-for-stepmother/](https://blog.123greetings.com/birthday-messages-for-stepmother/) | 113 | 5 | 40 | 1 | Add 35+ messages: Heartfelt/Bonus Mom (8), From a Stepdaughter (6), From a Stepson (6), Funny (8), Short Texts (6), For a Stepmom You're Still Getting to Know (4), Milestone birthdays (3); Intro on striking the right tone with a stepmom: gratitude without comparing her to your mom; Tips: 'What to write when the relationship is new' and 'How to thank her for specific things' |
| [/belated-birthday-messages-for-sorry-i-missed/](https://blog.123greetings.com/belated-birthday-messages-for-sorry-i-missed/) | 117 | 5 | 50 | 1 | An intro on how to apologize for a missed birthday without over-explaining; A 'Sincere Apology' section with 10 messages and a 'Funny Excuses' section with 10; Sections for Best Friend (6), Family (6) and Coworker (5) |
| [/dating-anniversary-messages/](https://blog.123greetings.com/dating-anniversary-messages/) | 119 | 5 |  | 1 | Add first-person sections: “For Boyfriend” (12), “For Girlfriend” (12) and “Short Texts for Your Partner” (15).; Milestone sections: 1 month, 6 months, and the 1st, 2nd, 3rd and 5th dating anniversary (6–8 each).; Add “Funny” (10), “Long-Distance” (8) and “Instagram Captions” (15). Move the current five into a “For a Couple You Know” section. |
| [/messages-for-40th-anniversary/](https://blog.123greetings.com/messages-for-40th-anniversary/) | 119 | 5 |  | 1 | Add 40+ messages in sections: For Husband, For Wife, For Parents, For Grandparents, For a Couple, Funny, Ruby-Themed, Religious/Blessings.; Add an intro: the 40th anniversary is ruby (traditional and modern), symbolizing enduring passion.; Add FAQs: 'What is the 40th anniversary gift?', 'What do you write for parents’ ruby anniversary?' Also mention that US couples can request a White House greeting for 50th-plus anniversaries (as a related tip). |
| [/messages-for-100th-birthday/](https://blog.123greetings.com/messages-for-100th-birthday/) | 120 | 5 | 40 | 1 | Add 40+ messages in sections: Heartfelt, Gentle Funny, For Grandma, For Grandpa, For a Great-Grandparent, Religious/Blessings, From the Whole Family, Toasts for the Party.; Add an intro on becoming a centenarian and 'Century Club' ideas: mention historic events they’ve lived through, and read the card aloud if eyesight is limited.; Add 'what to write' tips: large readable font, short sentences, one favorite memory, thank them for their legacy. |
| [/relationship-anniversary-messages/](https://blog.123greetings.com/relationship-anniversary-messages/) | 121 | 5 |  | 1 | Add 30+ messages in named sections: For Boyfriend, For Girlfriend, First Relationship Anniversary (1 year together), 6-Month/'Monthsary', Long-Distance, Funny, Short Text Messages, and For a Couple (friends/family); Add a 60–80 word intro explaining what a relationship (dating) anniversary is and how it differs from a wedding anniversary; Add 'what to write' tips (name a shared memory, a small inside joke, one hope for the next year) and sign-off ideas (“Still choosing you,” “Yours, always”) |
| [/messages-for-90th-birthday/](https://blog.123greetings.com/messages-for-90th-birthday/) | 122 | 5 | 60 | 1 | Add 55+ messages in sections: For Grandma, For Grandpa, For Great-Grandparent, For Mom/Dad, Heartfelt, Gentle Funny, Religious/Blessings, From the Whole Family, Toasts.; Add an intro and tips on honoring nine decades: mention the eras they’ve lived through, and ask others to add memories.; Add sign-offs: 'Ninety and inspiring,' 'Your loving family'. |
| [/birthday-messages-for-uncle/](https://blog.123greetings.com/birthday-messages-for-uncle/) | 123 | 6 | 60 | 1 | Add 55+ messages in sections: Funny (12), Heartfelt (10), From Niece (6), From Nephew (6), Cool Uncle (6), Short Texts (8), Religious/Blessings (4), Milestones (50th/60th) (4); Intro on the uncle role: mentor, fun relative, godfather; Tips: reference a shared memory, a skill he taught you, or his signature joke |
| [/birthday-messages-for-girlfriend/](https://blog.123greetings.com/birthday-messages-for-girlfriend/) | 124 | 6 | 120 | 1 | Sections: Romantic (20), Cute (15), Funny (15), Short texts (15), Instagram captions (15), Long paragraphs (5); Add 8 'First birthday together', 8 Long-distance, and 5 'Midnight text' wishes; Add 6 milestone wishes (her 21st, 25th, 30th) and 5 poem-style wishes |
| [/birthday-messages-for-sweet-16/](https://blog.123greetings.com/birthday-messages-for-sweet-16/) | 125 | 5 | 75 | 1 | Add 60+ messages in sections: From Mom/Dad (10), From Grandparents (6), For Daughter/For Son (8), For a Best Friend (8), Funny/Driving Jokes (10), Short Instagram Captions (10), Religious/Blessing wishes (5), Inspirational advice for turning 16 (6); Intro explaining Sweet 16 traditions (party, first car/permit, candle-lighting ceremony, quinceañera comparison); 'What to write in a Sweet 16 card' tips, plus ideas for tucking in a letter or money |
| [/anniversary-messages-for-employee/](https://blog.123greetings.com/anniversary-messages-for-employee/) | 128 | 7 |  | 1 | Expand to 50+: By Milestone — 1, 3, 5, 10, 15, 20, 25 years (21), Formal/HR (8), From Manager (8), Funny (6), Short Slack/Teams (6), LinkedIn Shout-outs (5), Remote Employee (4); Add a 'how to recognize a work anniversary' tip box (name a specific contribution, mention the year count, what to include in a company-wide post); FAQs: 'What do you say to an employee on their 5-year anniversary?', 'Should I send a work anniversary card?' |
| [/messages-for-50th-anniversary/](https://blog.123greetings.com/messages-for-50th-anniversary/) | 133 | 4 | 50 | 1 | Add 50+ messages in sections: For Parents, For Grandparents, For Husband, For Wife, From Friends, Golden-Themed, Religious/Blessings, Toasts & Speech Lines, Funny (gentle).; Add an intro: the 50th anniversary is gold, with party, vow-renewal and family-tribute ideas.; Add tips: include a family memory, and read it aloud at the party. |
| [/birthday-messages-for-wife/](https://blog.123greetings.com/birthday-messages-for-wife/) | 140 | 4 | 150 | 1 | Add 140+ messages in sections: Romantic (25), Heart-Touching/Emotional (20), Funny (20), Short Texts (20), From Husband After Many Years (10), For a New Wife/First Birthday Married (8), For a Pregnant Wife / Mom of Our Kids (8), Religious/Blessings (8), Instagram Captions (15), Long Love Letters (6); Intro on making it personal (inside jokes, what she does that no one sees, specific memories); 'How to write a birthday love letter to your wife' mini-guide with a template |
| [/birthday-messages-for-best-friend/](https://blog.123greetings.com/birthday-messages-for-best-friend/) | 143 | 5 | 100 | 1 | Add sections: Funny (20), Heartfelt/Emotional (20), Short text messages (15), Instagram captions (15), Long-distance best friend (8), Milestone (21st/30th/40th, 10); Add a 'For Her' and 'For Him' best-friend section (8 each), plus a 'Best friend since childhood' set; Add 5 long paragraph-style messages for a card or a surprise video |
| [/birthday-messages-for-boss/](https://blog.123greetings.com/birthday-messages-for-boss/) | 143 | 6 | 50 | 1 | Intro on workplace etiquette: keep it respectful, short and non-personal, and use a group card for teams; Add sections: Professional/Formal (15), From the Team (10), Funny but safe (10), Short Slack/Teams/email wishes (10), For a female boss (5), For a mentor (5); Add 5 wishes for a boss's milestone birthday (50th, 60th) and 5 for a retiring boss |
| [/birthday-messages-for-scorpio/](https://blog.123greetings.com/birthday-messages-for-scorpio/) | 143 | 5 | 50 | 1 | Fix the truncated message #7 first; Intro: Scorpio birthdays fall Oct 23–Nov 21. It's a water sign ruled by Pluto (traditionally Mars), with the Scorpion symbol. Traits: intense, loyal, private, magnetic; Add 12 Funny wishes (the stare, secrets, grudges, mysterious vibes) and 12 Heartfelt wishes about loyalty and depth |
| [/messages-for-30th-anniversary/](https://blog.123greetings.com/messages-for-30th-anniversary/) | 144 | 5 |  | 1 | Add 40+ messages in sections: For Husband, For Wife, For Parents, For a Couple, Funny, Pearl-Themed, Religious/Blessings.; Add an intro: the 30th anniversary is pearl (traditional) and diamond (modern).; Add tips and sign-offs such as 'Three decades, one love'. |
| [/birthday-messages-for-stepfather/](https://blog.123greetings.com/birthday-messages-for-stepfather/) | 145 | 6 | 40 | 1 | Add 35+ messages in named sections: Heartfelt/Thank You for Choosing Us (8), From a Stepdaughter (6), From a Stepson (6), Funny/Dad Jokes (8), Short Text Wishes (8), For a New Stepdad (4), Milestone 50th/60th (4); Short intro on writing to a stepdad: acknowledging that he chose the role, not comparing him to a biological father, what to call him in the card; Add a 'What to write' tips box with 3-4 fill-in templates (e.g. 'Thank you for ___ when you didn't have to.') |
| [/birthday-messages-for-libra/](https://blog.123greetings.com/birthday-messages-for-libra/) | 149 | 5 | 50 | 1 | Intro: Libra birthdays fall Sep 23–Oct 22. It's an air sign ruled by Venus, with the Scales symbol. Traits: charming, fair, social, aesthetic, famously indecisive; Add a real Funny section (12: indecision, aesthetics, conflict-avoidance) and a Heartfelt section (12: fairness, kindness, peacemaking); Add 10 short texts/captions and 5 'Happy Libra season' posts |
| [/messages-for-25th-anniversary/](https://blog.123greetings.com/messages-for-25th-anniversary/) | 150 | 5 | 75 | 1 | Add 70+ messages in sections: For Husband, For Wife, For Parents (from kids), For Friends/Couple, Funny, Silver-Themed, Religious/Blessings, Toasts for a Silver Jubilee party.; Add an intro: the 25th anniversary is silver (traditional and modern), with party and vow-renewal ideas.; Add tips: reference 25 years of shared history, and sign-offs like 'Here’s to our golden next chapter'. |
| [/anniversary-messages-for-wife/](https://blog.123greetings.com/anniversary-messages-for-wife/) | 154 | 6 | 100 | 1 | An intro on romantic vs. funny tone, plus the 'one specific memory' tip; A 'Romantic' section with 20 messages and a 'Funny' section with 15; A 'Short & Sweet Texts' section with 15 |
| [/anniversary-messages-for-friends/](https://blog.123greetings.com/anniversary-messages-for-friends/) | 154 | 5 | 50 | 1 | Expand to 60+: Heartfelt (12), Funny (12), For Best Friend & Their Spouse (8), First Anniversary (6), Milestones — 10th, 25th, 50th (8), Religious Blessings (5), Short Texts (6), Group-Card Lines (5); Tips: address both partners, use a shared memory, sign off from both of you; FAQs: 'What do you write in an anniversary card for a couple?' |
| [/birthday-messages-for-co-worker/](https://blog.123greetings.com/birthday-messages-for-co-worker/) | 155 | 5 | 50 | 1 | Intro and etiquette tips: keep it inclusive and non-personal, and use a group card; Sections: Professional (12), Funny office humor (12), Short Slack/Teams messages (12), Group card sign-ins (10), For a work bestie (8), For a new coworker (5); Add 5 remote-team/virtual birthday wishes and 5 for a coworker who is leaving soon |
| [/anniversary-messages-for-parents/](https://blog.123greetings.com/anniversary-messages-for-parents/) | 158 | 5 | 75 | 1 | An intro on what to write for your parents' anniversary, plus a gift-by-year table; A 'From Daughter' section with 10 messages and a 'From Son' section with 10; A 'Funny' section with 10 and an 'Emotional / Thank You for Raising Us' section with 10 |
| [/wedding-anniversary-messages/](https://blog.123greetings.com/wedding-anniversary-messages/) | 158 | 5 |  | 1 | Add 60+ messages in named sections: For My Husband (10), For My Wife (10), For Parents (10), For Grandparents (5), For a Couple/Friends (10), Funny (10), Religious/Blessings (5), Short Texts (10), Belated Anniversary (5); Milestone sections: 1st, 5th, 10th, 25th (silver), 40th (ruby), 50th (golden), 60th (diamond), each with 3–5 wishes; Traditional gift chart (1st paper, 5th wood, 10th tin, 15th crystal, 20th china, 25th silver, 30th pearl, 40th ruby, 50th gold, 60th diamond) |
| [/belated-birthday-messages-for-him/](https://blog.123greetings.com/belated-birthday-messages-for-him/) | 165 | 5 | 50 | 1 | A 'Funny Belated Wishes for Him' section with 12 messages; Sections for Husband (8), Boyfriend (6), Dad (6), Brother (6), Best Friend (6) and Boss/Coworker (4); A 'Short Texts' section with 10 |
| [/birthday-messages-for-brother/](https://blog.123greetings.com/birthday-messages-for-brother/) | 167 | 5 | 100 | 1 | Sections: Funny (20), Heartfelt/Emotional (15), For Big Brother (10), For Little Brother (10), Short texts (10), Instagram captions (10); Add 8 From-Sister and 8 From-Brother messages, 5 for a twin brother, and 5 for a brother-in-law; Add 6 milestone wishes (his 18th, 21st, 30th, 40th) and 5 long-distance/estranged-brother wishes |
| [/funny-belated-birthday-messages/](https://blog.123greetings.com/funny-belated-birthday-messages/) | 168 | 6 | 50 | 1 | Add 40+ funny belated wishes in named sections: 'Blame It on the Calendar' (10), 'Age Jokes' (8), 'One-Liners for Text/WhatsApp' (10), 'For Your Best Friend' (6), 'For Brother/Sister' (5), 'For Coworkers' (5).; Add short relationship sections: 'Funny Belated Wishes for Mom', 'for Dad', and 'for Husband/Wife' (4–5 each).; Add a 60–80 word intro on how late is 'too late' and why owning the mistake with humor works. |
| [/belated-birthday-messages-for-her/](https://blog.123greetings.com/belated-birthday-messages-for-her/) | 168 | 5 | 50 | 1 | An intro on how to own a missed birthday gracefully; A 'Funny Belated Wishes for Her' section with 10 messages; Sections for Wife (8), Girlfriend (6), Mom (6), Sister (6), Best Friend (6) and Coworker (4) |
| [/birthday-messages-for-husband/](https://blog.123greetings.com/birthday-messages-for-husband/) | 171 | 6 | 120 | 1 | Sections: Romantic (20), Funny (15), Deeply loving/long paragraphs (8), Short texts (15), Instagram captions (10), Religious/blessings (6); Add milestone wishes (his 30th, 40th, 50th, 60th, 10) and 5 'first birthday as husband' wishes; Add 5 long-distance/deployed-husband wishes and 5 'from wife and kids' wishes |
| [/birthday-messages-for-daughter/](https://blog.123greetings.com/birthday-messages-for-daughter/) | 185 | 6 | 100 | 1 | Sections: From Mom (15), From Dad (15), Heartfelt/Proud (15), Funny (10), Short texts (10), Instagram captions (10); Age sections: little girl (1st–10th, 10), teen/Sweet 16 (8), 18th/21st (8), adult daughter (10); Add 5 religious/blessing wishes and 5 wishes for a daughter living far away |
| [/birthday-messages-for-son/](https://blog.123greetings.com/birthday-messages-for-son/) | 187 | 8 | 100 | 1 | Sections: From Mom (15), From Dad (15), Proud/Heartfelt (12), Funny (10), Short texts (10), Instagram captions (8); Age sections: little boy 1–10 (10), teen son (8), 18th/21st (8), adult/married son (8); Add 5 religious blessings, 5 long-distance/away-at-college wishes and 5 stepson wishes |
| [/at-work-messages/](https://blog.123greetings.com/at-work-messages/) | 188 | 6 | 50 | 1 | An intro on professional vs. warm tone at work; Sections of 8–10 messages each: Farewell / Leaving the Company, Promotion, Welcome New Employee, Work Anniversary, New Job Congratulations, Thank You Colleague, Good Luck, Get Well (coworker), Sympathy (coworker), Boss’s Day; Expand Retirement to 15, including 'From the Team' and 'For Boss' |
| [/birthday-messages-for-sister/](https://blog.123greetings.com/birthday-messages-for-sister/) | 202 | 6 | 100 | 1 | Sections: Funny (20), Heartfelt/Emotional (15), For Big Sister (10), For Little Sister (10), Short texts (10), Instagram captions (10); Add 8 From-Brother and 8 From-Sister messages, 5 for a twin sister and 5 for a sister-in-law; Add milestone wishes (her 18th, 21st, 30th, 40th, 8) and 5 long-distance sister wishes |
| [/invitation-messages/](https://blog.123greetings.com/invitation-messages/) | 205 | 6 |  | 1 | Add sections with 6–8 messages each: 'Wedding', 'Baby Shower', 'Bridal Shower', 'Graduation Party', 'Retirement', 'Housewarming', 'Kids’ Birthday', 'Dinner Party', 'Holiday Party (Halloween, Christmas)', 'Formal / Corporate', 'Funny Invitations'.; Add a fill-in invitation template box: event, host, date/time, venue, dress code, RSVP by/contact.; Add etiquette tips: when to send (4–6 weeks ahead for weddings, 2–3 for parties), how to word an RSVP deadline, and plus-ones. |
| [/birthday-message-for-dad/](https://blog.123greetings.com/birthday-message-for-dad/) | 226 | 6 | 100 | 1 | An intro on writing to Dad (men of few words, specific memories); A 'From Daughter' section with 12 messages and a 'From Son' section with 12; A 'Funny Dad' section with 15 (dad jokes, thermostat, grilling, naps) |
| [/cute-messages/](https://blog.123greetings.com/cute-messages/) | 249 | 7 |  | 1 | Add 60+ messages in sections: Good Morning (10), Good Night (10), For Him (10), For Her (10), Flirty (8), Long-Distance (8), Actually Funny/Cute (8), One-Liners with Emoji (10); Short intro: when to send a cute text 'just because'; Tips: personalize with pet names, inside jokes, and a callback to your first date |
| [/birthday-messages-for-mom/](https://blog.123greetings.com/birthday-messages-for-mom/) | 300 | 7 | 115 | 1 | Remove the leaked note in #4 and rewrite that message so it addresses Mom; Sections: Heartfelt (20), Funny (15), Emotional/make-her-cry (10), From Daughter (12), From Son (12), Short texts (15), Instagram captions (10); Add a labelled Religious/Blessings section (8), a Long-distance mom section (6), and a 'Mom who is also Grandma' set (5) |
| [/thanksgiving-day-messages/](https://blog.123greetings.com/thanksgiving-day-messages/) | 312 | 5 |  | 1 | Add an intro with the dates: US Thanksgiving Thursday Nov 26, 2026; Canadian Thanksgiving Monday Oct 12, 2026; Add 50+ messages in sections: For Family, For Friends/Friendsgiving, For Coworkers & Clients (business), For Your Partner, Religious/Blessing, Funny (turkey, leftovers, football), For Someone Far Away, For Someone Grieving This Holiday, Short Texts, Table-Card Gratitude Lines; Add 'what to write' tips and host thank-you messages for after dinner |
| [/national-best-friends-day-messages/](https://blog.123greetings.com/national-best-friends-day-messages/) | 968 | 5 | 50 | 1 | Add 50+ messages in sections: Funny (12), Sentimental (10), Long-Distance (8), For a Girl Bestie (6), For a Guy Bestie (6), Childhood Friend (5), Short Captions for Instagram (10); Add 10 best-friend quotes with correct attributions; Add an intro: June 8, unofficial origin, how to celebrate |
| [/messages-for-20th-anniversary/](https://blog.123greetings.com/messages-for-20th-anniversary/) | 114 | 7 | 50 | 2 | Add 40+ messages in sections: For Husband, For Wife, For Parents (from kids), For a Couple (friends), Funny, Heartfelt, Nostalgic (to match the nav), China/Platinum-Themed.; Add an intro: the 20th anniversary gift is china (traditional) and platinum (modern), with the emerald gemstone.; Add tips: reference 20 years of milestones (kids, homes, careers), and sign-offs like 'Two decades down, forever to go'. |
| [/anniversary-messages/](https://blog.123greetings.com/anniversary-messages/) | 135 | 0 | 250 | 2 | An intro paragraph on choosing the right message by relationship and tone; A 'Top 20 Anniversary Messages' teaser block pulling the best from the husband, wife, parents and friends pages; An anniversary gift-by-year table: 1st paper, 5th wood, 10th tin/aluminum, 15th crystal, 20th china, 25th silver, 30th pearl, 40th ruby, 50th gold, 60th diamond, with links to each milestone page |
| [/messages-for-13th-birthday/](https://blog.123greetings.com/messages-for-13th-birthday/) | 158 | 6 | 50 | 2 | Add 40+ messages in sections: For Son, For Daughter, For Grandchild, For Niece/Nephew, Funny Official-Teenager Messages, Heartfelt From Parents, Encouragement for the Teen Years, Short Texts/Captions.; Add an intro on why 13 matters (first teen year; Bar Mitzvah age for boys) and tips: don’t be cringe, be encouraging, keep it short.; Add sign-offs: 'Proud of you already,' 'Your biggest fan (even when you roll your eyes)'. |
| [/messages-for-70th-birthday/](https://blog.123greetings.com/messages-for-70th-birthday/) | 178 | 6 | 60 | 2 | Add 55+ messages in sections: For Mom, For Dad, For Grandma, For Grandpa, For Friend, Gentle Funny, Heartfelt, Religious/Blessings, Toasts.; Add an intro and tips: share a favorite memory, and thank them for their influence.; Add sign-offs: 'Seventy and still our favorite,' 'With love from all of us'. |
| [/messages-for-1st-anniversary/](https://blog.123greetings.com/messages-for-1st-anniversary/) | 181 | 8 | 50 | 2 | Add 40+ messages in sections: For Husband, For Wife, For the Newlyweds (friends/family), From Parents to the Couple, Funny First-Year Messages, Paper-Themed, Religious/Blessings.; Add an intro: the 1st anniversary gift is paper (traditional) and clocks (modern), plus paper gift ideas such as love letters and framed vows.; Add tips: reference a first-year moment (moving in, first holiday), and sign-offs like 'Year one of forever'. |
| [/messages-for-60th-birthday/](https://blog.123greetings.com/messages-for-60th-birthday/) | 183 | 6 | 60 | 2 | Add 55+ messages in sections: For Mom, For Dad, For Husband, For Wife, For Friend, Funny (retirement-adjacent, gentle), Heartfelt, Religious/Blessings, Toasts.; Add an intro on the 60th milestone and tips for balancing humor and honor.; Add sign-offs: 'Sixty and sensational,' 'Here’s to the best decade yet'. |
| [/birthday-messages/](https://blog.123greetings.com/birthday-messages/) | 189 | 0 | 500 | 2 | Add a 150-word intro and 20-30 'best of' sample messages on the hub itself (5 each: Heartfelt, Funny, Short, Religious, For Coworkers, Belated); Add a 'What to write in a birthday card' tips block with templates, and link to /what-to-write-in-a-card/; Add a FAQ: 'What do you write in a birthday card?', 'Short birthday wishes', 'Funny birthday messages', 'Belated birthday wishes' |
| [/anniversary-messages-for-boyfriend/](https://blog.123greetings.com/anniversary-messages-for-boyfriend/) | 201 | 11 | 100 | 2 | Expand to 100: Romantic (20), Funny (15), First Anniversary (10), Long-Distance (10), Short Texts (15), Instagram Captions (10), Milestones — 6 Months, 2, 3, 5 Years (10), Deep/Emotional Letters (10); Add 'How to write an anniversary message for your boyfriend' tips (a shared memory, an inside joke, a future plan) and 10 sign-off ideas; FAQs: 'What should I write in a 1-year anniversary card for my boyfriend?', 'How do you celebrate a dating anniversary long-distance?' |
| [/messages-for-10th-anniversary/](https://blog.123greetings.com/messages-for-10th-anniversary/) | 205 | 8 | 50 | 2 | Add 40+ messages in sections: For Husband, For Wife, For a Couple (friends/family), For Parents, Funny, Tin/Aluminum-Themed Puns, Religious/Blessings.; Add an intro: the 10th anniversary gift is tin or aluminum (traditional) and diamond jewelry (modern), with the symbolism of durability.; Add tips on referencing 10 years of shared milestones (kids, homes, moves), plus sign-offs like 'Here’s to decade two'. |
| [/messages-for-21st-birthday/](https://blog.123greetings.com/messages-for-21st-birthday/) | 206 | 9 | 60 | 2 | Add 50+ messages in sections: Funny 21st (responsible-drinking jokes), Heartfelt, For Son, For Daughter, For Best Friend, For Grandchild, Toasts, Instagram Captions.; Add an intro on 21 as the US legal drinking age and 'key to the door' milestone, with a note to keep humor responsible.; Add sign-offs: 'Cheers to you,' 'Proud of you, 21 and all'. |
| [/anniversary-messages-for-husband/](https://blog.123greetings.com/anniversary-messages-for-husband/) | 207 | 8 | 100 | 2 | An intro on tone (romantic, funny, sentimental), plus a tip to add one specific memory from the year; A 'Romantic' section with 20 messages; A 'Funny' section with 15 messages (snoring, the thermostat, his cooking experiments) |
| [/messages-for-30th-birthday/](https://blog.123greetings.com/messages-for-30th-birthday/) | 210 | 9 | 60 | 2 | Add 50+ messages in sections: Funny 'Dirty Thirty', Heartfelt, For Husband, For Wife, For Best Friend, For Sister/Brother, Inspirational, Captions.; Add an intro on turning 30 and tips for joking about age without stinging.; Add sign-offs: 'Thirty and thriving,' 'Still younger than your playlist'. |
| [/anniversary-messages-for-co-worker/](https://blog.123greetings.com/anniversary-messages-for-co-worker/) | 214 | 9 |  | 2 | Add 30+ work-anniversary messages: Professional (8), Funny/Office Humor (8), By Milestone — 1, 5, 10, 20 years (8), From the Team (5), Short Slack/Teams (6), LinkedIn Comments (5); Keep and label a separate 'Wedding Anniversary for a Coworker' section (15); Tips: keep it inclusive (avoid assuming a spouse's gender), and sign off for a group card |
| [/messages-for-40th-birthday/](https://blog.123greetings.com/messages-for-40th-birthday/) | 230 | 11 | 60 | 2 | Add 50+ messages in sections: Funny Over-the-Hill, Heartfelt, For Husband, For Wife, For Best Friend, For Sister/Brother, For Coworker, Inspirational 'Life Begins at 40', Captions.; Add an intro and tips on 40th humor that lands (nap jokes yes, health jokes careful).; Add sign-offs: 'Forty and fabulous,' 'Aged like fine wine'. |
| [/anniversary-messages-for-dad/](https://blog.123greetings.com/anniversary-messages-for-dad/) | 239 | 12 | 50 | 2 | Add 'For Mom & Dad Together' (15) — the biggest gap; Add From Son (8), From Daughter (8), Funny Dad-Joke Wishes (8), Milestones — 25th Silver, 40th Ruby, 50th Golden (9), Religious Blessings (5), For Stepdad (5), Remembering Mom on Their Anniversary (5, gentle); Intro plus 'what to write in your parents’ anniversary card' tips |
| [/birthday-messages-for-teacher/](https://blog.123greetings.com/birthday-messages-for-teacher/) | 245 | 11 | 50 | 2 | Bring each of the 10 sections to 5-6 messages (+45), adding sections for Preschool/Kindergarten Teacher, Coach, Professor, Music/Art Teacher, and From Parents; Add short text/email wishes and 'Sign from the whole class' group-card messages; Intro with etiquette on birthday cards for teachers (appropriate tone, class cards, gift-card notes) |
| [/national-cat-day-messages/](https://blog.123greetings.com/national-cat-day-messages/) | 276 | 5 |  | 2 | Add 30+ messages in sections: Funny Cat (10), For a Cat Mom/Dad (8), From the Cat (6), Rescue/Adopted Cat (5), Short Captions (8); Add a separate, gently worded 'In Memory of a Beloved Cat' section (5); Add an intro with the date (Oct 29), founding (2005) and the adoption message |
| [/national-coffee-day-messages/](https://blog.123greetings.com/national-coffee-day-messages/) | 280 | 6 |  | 2 | Add 30+ messages in sections: For a Partner (keep the current ones and fix them), For Friends (8), For Coworkers (8), Funny Caffeine Puns (8), Short Captions (8); Add an International Coffee Day (Oct 1) note and messages; Add an intro: Sept 29 in the US, free-coffee deals, coffee-date ideas |
| [/grandparents-day-messages/](https://blog.123greetings.com/grandparents-day-messages/) | 281 | 5 |  | 2 | Add an intro: National Grandparents Day is the first Sunday after Labor Day (Sept 12, 2027). Marian McQuade founded it, President Carter proclaimed it in 1978, and its flower is the forget-me-not.; Add 40+ messages in sections: 'For Grandma' (8), 'For Grandpa' (8), 'From Young Grandkids' (6, simple wording kids can copy), 'Funny' (8), 'Long-Distance' (5), 'In Memory of Grandparents' (5), 'Religious Blessings' (5).; Add tips: include a memory, and use large print or handwriting for older readers. |
| [/messages-for-18th-birthday/](https://blog.123greetings.com/messages-for-18th-birthday/) | 283 | 10 | 60 | 2 | Add 45+ messages in sections: For Son, For Daughter, For Grandchild, For Best Friend, Funny Welcome-to-Adulthood, Heartfelt From Parents, Advice for Adulthood, Short Captions.; Add an intro on 18 as the coming-of-age milestone (voting, legal adulthood), with tips on balancing pride and advice without lecturing.; Add sign-offs: 'Proud of the adult you’re becoming,' 'Still your #1 fan'. |
| [/anniversary-messages-for-grandparents/](https://blog.123greetings.com/anniversary-messages-for-grandparents/) | 294 | 16 | 100 | 2 | An intro explaining that grandparents’ anniversaries are often 40th/50th/60th milestones, with the gift material for each (ruby, gold, diamond); A 'Golden 50th Anniversary for Grandparents' section with 10 messages, and a '60th Diamond' section with 6; A 'From the Grandkids' section with 10 messages written in a child’s voice for young kids to copy |
| [/all-saints-day-messages/](https://blog.123greetings.com/all-saints-day-messages/) | 301 | 5 |  | 2 | Add an intro: the Nov 1 date (Sunday in 2026), origins (Pope Gregory III/IV, 8th–9th century), and how it relates to Halloween (All Hallows’ Eve) and All Souls’ Day (Nov 2); Expand to 30+ messages in sections: Catholic & Christian Blessings, Short Prayers, For Family, For Friends, For Your Parish/Priest, Remembering Loved Ones (soft link to All Souls’), Patron Saint Wishes, Short Text Wishes, Social Captions; Add 5 scripture-inspired lines (e.g. Hebrews 12:1 'so great a cloud of witnesses') |
| [/bosss-day-messages/](https://blog.123greetings.com/bosss-day-messages/) | 309 | 5 |  | 2 | Add 40+ messages in sections: Professional (8), Funny (8), From the Whole Team (6), For a Female Boss (5), For a Mentor/Former Boss (5), For a Remote Manager (4), Short Texts/Slack-appropriate (8); Intro: date (Oct 16), origin (Patricia Bays Haroski registered it in 1958 in honor of her father/boss), etiquette (appreciation goes up, keep gifts modest, group cards); 'What to write when you don't know your boss well' tips |
| [/anniversary-messages-for-mom/](https://blog.123greetings.com/anniversary-messages-for-mom/) | 313 | 16 | 50 | 2 | An intro: whether to write to Mom alone or to both parents, and how to make it personal; A 'From Daughter' section with 8 messages and a 'From Son' section with 8; A 'Funny' section with 10 (Dad’s thermostat, 'still putting up with him') |
| [/wedding-messages-for-the-groom/](https://blog.123greetings.com/wedding-messages-for-the-groom/) | 315 | 7 |  | 2 | Add 40+ messages in sections: From the Bride (8), From Parents (8), From Brother / Best Man (8), From Coworkers (5), Funny (10), Heartfelt (8), Religious Blessings (5), Short Texts (8); Groom-to-son messages from Dad and Mom; Tips: what to write in a groom's card versus a joint card |

## Content errors — high severity

| Page | Type | Where | Text | Fix |
|---|---|---|---|---|
| [/13th-july-your-weekly-bobcast/](https://blog.123greetings.com/13th-july-your-weekly-bobcast/) | leaked-template-text | H3 heading before the summer-friends section | (Rotating Section Based on Categories) | ☀️ Before Summer Gets Away… |
| [/15th-june-your-weekly-bobcast/](https://blog.123greetings.com/15th-june-your-weekly-bobcast/) | structure | H3 heading above the Summer Solstice section | A Birthday Tradition You Could Probably Steal | Here Comes the Sun: A Solstice Tradition Worth Stealing |
| [/19th-may-your-week-with-bob/](https://blog.123greetings.com/19th-may-your-week-with-bob/) | factual | 'This Week, We’re Celebrating…' list | Brother’s Day (May 18) | Brother’s Day (May 24) |
| [/22nd-june-your-weekly-bobcast/](https://blog.123greetings.com/22nd-june-your-weekly-bobcast/) | factual | This Week list | National Orange Blossom Day (June 23rd) | National Orange Blossom Day (June 27th) |
| [/all-saints-day-messages/](https://blog.123greetings.com/all-saints-day-messages/) | factual | message #3 | All Saint’s Day is the holiest day for all Christians. | All Saints’ Day is a sacred day for Christians around the world. |
| [/anniversary-messages-for-boss/](https://blog.123greetings.com/anniversary-messages-for-boss/) | wrong-topic | title + meta vs messages #8–#17 | Happy Anniversary to you and your partner! | Move messages #8–#17 under a labeled 'Wedding Anniversary Wishes for Boss' H2 (or retitle 'Anniversary Wishes for Boss: Work & Wedding') |
| [/anniversary-messages-for-brother/](https://blog.123greetings.com/anniversary-messages-for-brother/) | leaked-template-text | <title> | 100+ Anniversary Wishes for Brother, Heartfelt & Warm Meta Title | 100+ Anniversary Wishes for Brother & Sister-in-Law — Heartfelt & Warm |
| [/anniversary-messages-for-co-worker/](https://blog.123greetings.com/anniversary-messages-for-co-worker/) | wrong-topic | title vs messages #4–#11 | Work Anniversary Messages for Coworker - Warm & Professional | Add labeled sections 'Work Anniversary' and 'Wedding Anniversary', or retitle 'Anniversary Messages for Coworker: Work & Wedding' |
| [/anniversary-messages-for-customers/](https://blog.123greetings.com/anniversary-messages-for-customers/) | wrong-topic | title/meta vs messages #12, #14–#17, #19–#23 | On the occasion of your anniversary, we extend the warmest wishes to you and your beloved | Add labeled sections: 'Customer Loyalty Anniversary', 'Our Business Anniversary — Thank You', and 'Wishing a Customer a Happy Wedding Anniversary' |
| [/anniversary-messages-for-employee/](https://blog.123greetings.com/anniversary-messages-for-employee/) | wrong-topic | message #9 | A strong partnership at home is the foundation for success everywhere else Hope you take some well-deserved time to celebrate your love today Happy Anniversary! | Move this to a labeled 'Wedding Anniversary for an Employee' section, or replace it with a work-anniversary wish. Add punctuation: '…everywhere else. Hope you t |
| [/anniversary-messages-for-fiance/](https://blog.123greetings.com/anniversary-messages-for-fiance/) | wrong-recipient | message #16 | Happy Anniversary to a wonderful couple! May your engagement continue | Happy anniversary, my love! May our engagement continue to be filled with excitement, understanding, and all the little moments that make love so special. |
| [/belated-anniversary-messages-for-him/](https://blog.123greetings.com/belated-anniversary-messages-for-him/) | wrong-recipient | message #5 | Happy Anniversary, beautiful people! | My timing needs work; my love for you doesn’t. Happy Belated Anniversary, handsome! |
| [/belated-anniversary-messages-for-sorry-i-forgot/](https://blog.123greetings.com/belated-anniversary-messages-for-sorry-i-forgot/) | wrong-recipient | title / meta description | Sorry I Forgot Our Anniversary Messages | Retitle to 'Sorry I Forgot Your Anniversary Messages — Belated Wishes for Friends' (meta: 'Forgot a friend’s anniversary?'), or rewrite the messages for your ow |
| [/birthday-card-messages-when-my-brother-and-i-stopped-talking-about-things-that-mattered/](https://blog.123greetings.com/birthday-card-messages-when-my-brother-and-i-stopped-talking-about-things-that-mattered/) | structure | tip section vs. story and PRO CTA | Send the card before the birthday, not on it. | Make the story match the advice, e.g. change 'Scheduled it to land on his actual birthday.' to 'Scheduled it to land a week before his birthday.', and change th |
| [/birthday-messages-for-grandma/](https://blog.123greetings.com/birthday-messages-for-grandma/) | wrong-topic | message #13 | A new baby, a new name, and somehow you already look like you were made for this. | Remove it or move it to a new-grandma congratulations page |
| [/birthday-messages-for-mom/](https://blog.123greetings.com/birthday-messages-for-mom/) | leaked-template-text | message #4 | Use as a card, a caption, or a note to yourself on a hard morning. It travels well. | Delete these two sentences |
| [/birthday-messages-for-scorpio/](https://blog.123greetings.com/birthday-messages-for-scorpio/) | other | message #7 (end) | Wishing you all the success and | Wishing you all the success and happiness this year can hold! |
| [/fathers-day-messages/](https://blog.123greetings.com/fathers-day-messages/) | leaked-template-text | message #20 (For your Uncle) | Happy Father’s Day for the uncle who acts like a second dad, a wise counselor, or the fun guardian who always has your back. | You’re always there when I need good advice, a good laugh, or a helping hand when I’m stuck. I am so lucky to have you on my side. Happy Father’s Day to the unc |
| [/friendship-day-messages/](https://blog.123greetings.com/friendship-day-messages/) | factual | FAQ Q1 answer | It was first proposed in 1958 in Paraguay, but it gained global popularity after being unofficially championed in the 1930s by a greeting card company | Friendship Day was first promoted in 1930 by Hallmark founder Joyce Hall. In 1958, Dr. Ramón Artemio Bracho in Paraguay proposed a World Friendship Day on July  |
| [/friendship-messages-here-for-you/](https://blog.123greetings.com/friendship-messages-here-for-you/) | leaked-template-text | message #4 | (in one line) | Life may take us through unexpected twists and turns, but one thing won’t change: you’ll always have a friend in me. |
| [/friendship-messages-here-for-you/](https://blog.123greetings.com/friendship-messages-here-for-you/) | leaked-template-text | message #4 | (next line) | Delete “(next line)” so the message ends at “You’ll always have a friend in me.” |
| [/graduation-card-messages-when-my-dad-struggled-with-saying-he-was-proud-of-me/](https://blog.123greetings.com/graduation-card-messages-when-my-dad-struggled-with-saying-he-was-proud-of-me/) | leaked-template-text | intro (bold centered label above the second summary) | Value it provides: | Delete the 'Value it provides:' label, and keep (or merge) the one-line summary that follows it. |
| [/happy-mothers-day-2026-messages-what-to-write-in-the-card/](https://blog.123greetings.com/happy-mothers-day-2026-messages-what-to-write-in-the-card/) | factual | 'A Quick Note on Why This Day Exists' paragraph | In 1908, Anna Jarvis started Mother’s Day with a handwritten letter. Not flowers. | In 1908, Anna Jarvis held the first Mother’s Day service in Grafton, West Virginia, and sent 500 white carnations, her late mother’s favorite flower. She later  |
| [/inspiration-messages/](https://blog.123greetings.com/inspiration-messages/) | leaked-template-text | FAQ Q5 answer (bullet list after the answer) | META TITLE: You Can Do It Messages to Inspire, Encourage & Cheer | Delete the three bullets (META TITLE / META DESCRIPTION / KEY PHRASE) from the FAQ, and put the values into the SEO plugin for /inspiration-messages-you-can-do- |
| [/international-sunflower-day-messages/](https://blog.123greetings.com/international-sunflower-day-messages/) | factual | FAQ Q2 answer | It’s observed on June 1st every year. | National Sunflower Day is observed on the first Saturday in August (Aug 7, 2027). It was created by the National Sunflower Association and North Dakota Tourism  |
| [/international-sunflower-day-messages/](https://blog.123greetings.com/international-sunflower-day-messages/) | wrong-topic | message #9 | Happy International Flower Day. Hope something small and beautiful finds you today | Happy Sunflower Day! Hope something bright and golden finds you today, even if it’s just a little sunlight on the table. |
| [/international-sunflower-day-messages/](https://blog.123greetings.com/international-sunflower-day-messages/) | wrong-topic | message #12 | Happy International Flower Day. May today remind you that beautiful things do not always have to rush. | Happy Sunflower Day! May today remind you to keep turning toward the light, at your own pace. |
| [/love-messages-for-wife-the-thank-you-i-owed-my-wife-for-two-years/](https://blog.123greetings.com/love-messages-for-wife-the-thank-you-i-owed-my-wife-for-two-years/) | leaked-template-text | body paragraph (bold, centered label after the intro) | Value of this blog: | Delete the label, or replace it with a reader-facing lead such as 'The short version:'. |
| [/mothers-day-messages-for-someone-who-lost-their-mom/](https://blog.123greetings.com/mothers-day-messages-for-someone-who-lost-their-mom/) | structure | body paragraph ('One More Thing Before You Close This Tab') link | quiet library of thinking-of-you and sympathy cards | Link to Thinking of You/Sympathy cards (e.g. https://www.123greetings.com/general/thinking_of_you/), not /events/mothers_day/ |
| [/national-best-friends-day-messages/](https://blog.123greetings.com/national-best-friends-day-messages/) | factual | FAQ 'When is National Best Friends Day 2026?' answer | established by the U.S. Congress in 1935 | Its exact origins are unclear. There's no record of Congress creating it, and it has become popular online in recent years. |
| [/national-best-friends-day-messages/](https://blog.123greetings.com/national-best-friends-day-messages/) | factual | FAQ 'Is Best Friends Day a real holiday?' answer | Officially established by the U.S. Congress in 1935. | Yes, it's a widely celebrated unofficial observance (not a federal holiday) held every June 8. |
| [/national-best-friends-day-messages/](https://blog.123greetings.com/national-best-friends-day-messages/) | leaked-template-text | FAQ 'How is Best Friends Day celebrated around the world?' answer | (our #2 market) | Remove '(our #2 market)'. |
| [/national-best-friends-day-messages/](https://blog.123greetings.com/national-best-friends-day-messages/) | factual | FAQ 'What’s the difference between Best Friends Day, Friendship Day, and International Day of Friendship?' answer | U.S. Congress, 1935. | Remove 'U.S. Congress, 1935.'. Its origin is unknown. |
| [/national-day-of-encouragement-messages/](https://blog.123greetings.com/national-day-of-encouragement-messages/) | leaked-template-text | FAQ 'What should I write in a National Day of Encouragement card?' answer | What to Write in a Card – 123Greetings Blog. | Remove the pasted citation. Write instead: '…explore our guide on what to write in a card', linking to /what-to-write-in-a-card/ without '?utm_source=chatgpt.co |
| [/national-oatmeal-day-messages/](https://blog.123greetings.com/national-oatmeal-day-messages/) | wrong-topic | message #5 | the first warm spoonful of cornflakes on a chilly morning. | the first warm spoonful of oatmeal on a chilly morning. |
| [/national-tap-dance-day-messages/](https://blog.123greetings.com/national-tap-dance-day-messages/) | wrong-topic | message #3 (repeated as #4) | On Dance Day, just remember: if you have two left feet | Happy National Tap Dance Day! Two left feet? Perfect: that’s two more taps. |
| [/national-tap-dance-day-messages/](https://blog.123greetings.com/national-tap-dance-day-messages/) | wrong-topic | message #5 | Happy Dance Day! Rhythm is optional today, but the vibes are compulsory. | Happy National Tap Dance Day! May your shuffles be crisp and your time steps on beat. |
| [/parents-day-messages/](https://blog.123greetings.com/parents-day-messages/) | typo | FAQ 'Can I send a Parents’ Day eCard online?' answer | eCards I our 123Greetngso find the perfect greeting. | Explore a collection of free Parents’ Day eCards on 123Greetings to find the perfect greeting. |
| [/say-hey-day-messages/](https://blog.123greetings.com/say-hey-day-messages/) | factual | meta description | this October 10th | …to spread warmth and brighten someone's day this October 25. |
| [/upcoming-events/](https://blog.123greetings.com/upcoming-events/) | structure | entire page | Upcoming Events - 123Greetings Blog - Free eCards, Card Message Ideas & What to Write in Any Greeting Card | Populate the page with a calendar of upcoming occasions, each linked to its message page (e.g. Send a Smile Day Oct 2, St. Francis Day Oct 4, World Teachers' Da |
| [/wake-up-with-bob-25th-july/](https://blog.123greetings.com/wake-up-with-bob-25th-july/) | factual | body paragraph ('The story follows…') | The story follows Tatum O’Neal’s character, Velvet. | The story follows Tatum O’Neal’s character, Sarah Brown, the orphaned niece of Velvet Brown. |
| [/wedding-messages-for-the-bride/](https://blog.123greetings.com/wedding-messages-for-the-bride/) | wrong-recipient | message #4 | This day is just the start of our endless journey. | This day is just the start of your endless journey. |
| [/wedding-messages-when-just-married/](https://blog.123greetings.com/wedding-messages-when-just-married/) | leaked-template-text | message #8 | Clever & Humorous. | The adventure begins today, but the love story started long ago. |
| [/wedding-messages-when-just-married/](https://blog.123greetings.com/wedding-messages-when-just-married/) | leaked-template-text | FAQ Q4 answer | Clever and Humours ! | “The adventure begins today, but the love story started long ago.” |
| [/what-to-write-in-a-card/](https://blog.123greetings.com/what-to-write-in-a-card/) | leaked-template-text | calendar tabs January, February and December | Looking for more? We’ve got plenty coming your way, stay tuned! | Add occasion tiles for January (New Year's Day, etc.), February (Valentine's Day, Galentine's Day, Presidents' Day) and December (Christmas, Hanukkah, Kwanzaa,  |

Medium and low severity errors (1206) are in `data/content_errors.csv` and the dashboard.
