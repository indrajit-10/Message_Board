# blog.123greetings.com — site audit (30 Sep 2026)

Crawled **668 URLs** (sitemaps + every internal link), checked **669 unique link/image targets**, and had every one of the **296 pages and posts** read line by line by review agents, with each finding re-checked by an adversarial verifier. Functionality, performance, SEO, accessibility and content strategy were audited separately in a real browser and verified the same way.

## Headline numbers

| | |
|---|---|
| Verified wording / content errors | **1251** (45 high severity) |
| Editor / AI notes published on live pages | **21** |
| Factual errors (dates, history, anniversary gifts) | **39** |
| Pages whose title promises more messages than they have | **125** (short by 7,589 messages in total) |
| Thin pages that need more content | **234** of 296 |
| Broken link targets | **8** (used 40 times) |
| Site-level issues (UX, performance, SEO, a11y, strategy, security) | **26** |
| Messages on the whole site | 2165 (median page: 5) |


## Fix these first

1. **Delete editor and AI notes that are live on the site** — 21 places, e.g. 'META TITLE: … META DESCRIPTION …' inside the Inspiration FAQ, 'Meta Title' at the end of the Anniversary-for-Brother page title, '(our #2 market)' on National Best Friends Day, 'Use as a card, a caption… It travels well.' in a Mom birthday message, '(in one line)/(next line)', 'Clever and Humours !', 'Value of this blog:' and '(Rotating Section Based on Categories)'. Filter the Content errors tab by type 'leaked-template-text'.
2. **Stop titles from over-promising** — 125 pages promise '50+', '100+' or even '500+' messages, but the typical message page has 5. Together they are 7,589 messages short. Change the titles to the real count today, then grow the pages (the Thin pages tab lists what to add to each).
3. **Fix messages written for the wrong occasion or person** — The Tap Dance Day page has only generic 'Dance Day' lines (one repeated). Work, customer and employee anniversary pages mix in wedding-anniversary wishes. Oatmeal Day mentions cornflakes, Sunflower Day says 'International Flower Day', and a bride's card says 'our journey'. Filter by 'wrong-topic' and 'wrong-recipient'.
4. **Repair broken eCard links and add a card link to every message page** — 7 dead links to www.123greetings.com (e.g. /blog/what-to-write-in-a-card, used 32 times on the Mother's Day posts) and 1 internal 404 (/encouragement-inspiration-messages/). 141 of 242 message pages have no link to send a matching eCard at all.
5. **Correct factual errors** — 39 verified, e.g. wrong dates for Brothers Day, Orange Blossom Day, Sunflower Day, Say Hey Day and Clergy Appreciation Day; the invented 'established by the U.S. Congress in 1935' claim on Best Friends Day; 'Crystal to China' on both the 15th and 20th anniversary titles.
6. **Make the messages findable** — Most pages have no search box, and the site search skips all 242 message pages. Message pages have no breadcrumbs or related links: 8 pages are orphans and 212 are reachable from only one internal link. /upcoming-events/ is blank but listed in the sitemap.
7. **Speed up page loads** — Uncached pages take about 2.3 s to generate and are only cached for 5 minutes. Mobile LCP is 3.9–6.8 s. reCAPTCHA and the contact-form scripts (about 800 KB) load on every page, and 34–40 stylesheets block rendering. See the Performance tab for ranked fixes.
8. **Clean up indexing** — 255 titles end in a 91-character site-name suffix. 13 'Wake Up With Bob' posts share one title, and 7 'Five Minutes With Bob' posts share another. 347 tag archives (317 with a single post) are in the sitemap, as are two theme templates (/penci-block/…). The author URL is built from an email address.
9. **Remove the hidden leftover template section** — 134 message pages carry a block hidden on every screen size, with a second H1 ('Birthday messages, for Mom'), empty “” quotes and a dead 'Emotions' menu. Visitors never see it, but search engines read it. Delete that container from the Elementor templates.
10. **Run the proofreading fixes** — 1,251 verified wording errors (45 high, 380 medium) with the exact text and a suggested correction for each, e.g. 'Have a Blast !', 'let go off', 'eCards I our 123Greetngso', and sentences run together without a full stop. Everything is in data/content_errors.csv and the Content errors tab.


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

### [high] Broken and mismatched card links (CTAs): 40 links on 13 pages return 404

*Verdict: unverified* · Affected: /mothers-day-messages-for-wife-what-she-actually-wants/, /mothers-day-messages-for-someone-who-lost-their-mom/, /mothers-day-messages-for-mother-in-law-what-to-write/, /happy-mothers-day-2026-messages-what-to-write-in-the-card/, /mothers-day-card-messages-for-grandma-funny-heartfelt/, /mothers-day-wishes-for-stepmom-50-heartfelt-card-messages/, /sorry-messages-for-coworkers-when-my-coworker-struggled-with-saying-sorry/, /love-messages-for-wife-the-thank-you-i-owed-my-wife-for-two-years/ (+8 more)

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

**Fix.** 1. Replace each /blog/what-to-write-in-a-card link with its specific blog page (e.g. "Mother's Day messages for your wife" → https://blog.123greetings.com/mothers-day-messages-for-wife-what-she-actually-wants/).
2. On www.123greetings.com, add a 301 from /blog/* to https://blog.123greetings.com/*.
3. Retarget the other dead links:
   - /events/sorry/ → /general/sorry/
   - /events/thank_you/ → /thank_you/
   - /events/congratulations/ → /congratulations/
   - the doubled vanilla URL → /events/national_vanilla_pudding_day/
   - encouragement-inspiration-messages → /inspiration-messages/
   - romantic_birthday_cards → a love/romance category
4. Add /events/sweetest_day/ to /sweetest-day-messages/.
5. Remove the chatgpt UTM.
6. Run a link check before publishing.

### [high] Message pages are dead ends: no breadcrumbs, no related messages, no in-content links

*Verdict: unverified* · Affected: /birthday-messages-for-mom/, /national-tap-dance-day-messages/, /be-an-angel-day-messages/, /anniversary-messages-for-boyfriend/, /messages-for-50th-anniversary/

**Evidence.** 234 of 242 message pages (pages.json, type=page with message blocks) have no link in the main content to any other blog page. Only 8 do: /everyday-messages/, /stepfamily-day-messages/, /happiness-happens-day-messages/, /national-relaxation-day-messages/, /national-day-of-encouragement-messages/, /wife-appreciation-day-messages/, /international-daughters-day-messages/, /congratulations-messages/.

Example: every link on /birthday-messages-for-mom/ is one of these:
- the 4 header items (repeated in 3 header copies and the off-canvas menu)
- the hidden side-nav anchors
- 6 legal footer links to www.123greetings.com

There are no breadcrumbs, no "more birthday messages", no link back to /birthday-messages/, and no eCard link. The page ends after 7 messages (shots/d_mom_full.png).

The header offers only Home, About Us, What to write in a card and Contact Us. The footer has only legal links. A visitor who arrives from search has to go back to the homepage or to /what-to-write-in-a-card/ to find a sibling page such as /birthday-message-for-dad/.

**Fix.** 1. Enable Yoast breadcrumbs in the page template (Home › Birthday › For Mom).
2. Add a template-level "More [occasion] messages" block that links the parent hub and 4–8 sibling pages, for example an Elementor Loop Grid filtered by a shared tag or parent page.
3. Add a link back to the hub under the H1.

### [high] Most pages have no search box, and the site's own search skips all 242 message pages

*Verdict: unverified* · Affected: /?s=birthday, /?s=tap+dance, /?s=sympathy, /?s=birthday+messages+for+mom, /?s=zzqx, /this-does-not-exist/, /, /what-to-write-in-a-card/ (+1 more)

**Evidence.** The header has no search control at 1366px or at 390px: there is no search icon or form in the header DOM, and the off-canvas menu contains only 4 links. A search box is visible in only three places. (1) The homepage and (2) /what-to-write-in-a-card/ each have a Google Programmable Search box ("Search Messages", div.gcse-search). (3) 404 pages have the theme's WordPress search form (pc-searchform). I fetched 40 page HTMLs (38 message pages, 1 post, the homepage) and only the homepage contained a search widget. The crawl found pc-searchform only on the 404 template.

The WordPress search (the one the 404 page uses) returns posts only:
- /?s=birthday: 10 results per page (page 2 exists), all posts ("Five Minutes With Bob", "…Weekly Bobcast", etc.). /birthday-messages/ and /birthday-messages-for-mom/ are missing.
- /?s=tap+dance: 2 posts; /national-tap-dance-day-messages/ is missing.
- /?s=sympathy: 1 post; /sympathy-condolences-messages/ is missing.
- /?s=birthday+messages+for+mom: 10 Mother's Day posts; /birthday-messages-for-mom/ is missing.

The 404 page says "Please use search for help", but that search cannot return a message page.

The zero-results page (/?s=zzqx) shows only "Sorry, but nothing matched your search terms. Please try again with some different keywords." It has no search field, no suggestions and no links, and it capitalises the query as "Zzqx" (shots/d_search_empty.png).

The homepage Google search does find pages ("birthday mom" gives 4 results including /birthday-messages-for-mom/). However, every result shows an extra underlined "Structured data" link (shots/RATE_LIMITED_CSS_MISSING__d_home_cse_results.png; the site's own CSS was rate-limited in that capture, but the Google results block rendered normally).

**Fix.** 1. Add one search control to the desktop header and the mobile off-canvas menu, on every template.
2. Use a single engine everywhere, and make it include message pages: remove the theme's posts-only search restriction (Soledad option or a pre_get_posts filter), or switch to Jetpack Search, or use Google search consistently.
3. Point the 404 form and the results template at that same engine.
4. On the zero-results template, show a search field and links to the top occasion hubs.
5. Turn off the "Structured data" link in the Programmable Search control panel.

### [medium] "You may also like" on every post shows the same 10 unrelated 'Bob' diary posts

*Verdict: unverified* · Affected: /mothers-day-messages-for-wife-what-she-actually-wants/, /mothers-day-messages-for-someone-who-lost-their-mom/, /birthday-card-messages-when-my-brother-and-i-stopped-talking-about-things-that-mattered/

**Evidence.** Every one of the 49 posts in pages.json has the same related-posts carousel (.penci-related-carousel) under "YOU MAY ALSO LIKE": 7× "Five Minutes With Bob" and 3× "Wake Up With Bob", i.e. the 10 most recent diary posts.

For example, the post "Mother's Day Messages for Wife" recommends "Five Minutes With Bob, August 2, 2026" and similar (shots/d_post_related.png, m_post_related.png).

The cause is that all posts are in the single category "123greetings", so relating posts by category just returns the latest posts. Previous/next links do work (e.g. "Heartfelt Mother's Day Messages…" / "What to Write in a Mother's Day Card…").

**Fix.** Switch the Soledad related-posts source to tags, or to a custom taxonomy by occasion. Exclude the Bob diary series, or move it to its own category, and give the Mother's Day, Birthday and other posts proper categories.

### [medium] /upcoming-events/ is a blank page but is listed in the sitemap

*Verdict: unverified* · Affected: /upcoming-events/

**Evidence.** The page returns 200 with the title "Upcoming Events". The content container is empty (innerHTML is 6 characters of whitespace), there is no H1, and the body text is only header and footer (259 characters).

What a visitor sees:
- Desktop: the header, then the footer directly underneath at y≈85, then a white screen (shots/d_upcoming_events.png).
- Mobile: the header, the footer, and about 1,300px of white (shots/m_upcoming_events.png).

The page is in the page sitemap and has 0 internal inlinks, so the only way in is from search engines.

**Fix.** Either build the events list (for example, upcoming occasions linking to their message pages), or unpublish the page, 301 it to /what-to-write-in-a-card/ and remove it from the sitemap.

### [medium] 141 of 242 message pages have no link to send a matching eCard

*Verdict: unverified* · Affected: /birthday-messages-for-mom/, /national-tap-dance-day-messages/, /sympathy-condolences-messages/, /mothers-day-messages/, /thank-you-messages/, /graduation-messages/, /easter-messages/, /love-messages/

**Evidence.** pages.json: 141 of 242 message pages have no link in the main content to www.123greetings.com (the full list is in the "Message pages without eCard CTA" table). This includes the site's flagship pages:
- all 31 /anniversary-messages-for-*/ pages
- 37 /birthday-messages-for-*/ pages
- the milestone birthday and anniversary pages
- /mothers-day-messages/, /sympathy-condolences-messages/, /thank-you-messages/

In the browser, /birthday-messages-for-mom/ has 0 www.123greetings.com links in content on desktop and on mobile. Matching card categories do exist; for example, https://www.123greetings.com/events/national_tap_dance_day/ (200) is linked from a Bob post but not from /national-tap-dance-day-messages/.

**Fix.** Add a CTA block to the message-page Elementor template, placed after the first 3–5 messages and again at the end: "Send a free [occasion] eCard →". Store its target URL in a per-page custom field so every page links to its matching www.123greetings.com category.

### [medium] Cookie banner covers 23% of the mobile screen and blocks search and back-to-top; closing with "x" counts as consent

*Verdict: unverified* · Affected: /, /birthday-messages/, /about-us/, /contact-us/

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

**Fix.** 1. On mobile, use a compact bar (under about 15% of the viewport) with inline buttons.
2. While the banner is visible, raise the back-to-top button above it.
3. Make "x" behave as dismiss or deny, not allow; add Reject and a revoke link.
4. Coordinate with the privacy reviewers on holding back analytics and ads until consent (e.g. Google Consent Mode).

### [medium] Header has no mega menu or occasion links; the Soledad 'Mega Menu' and 'Footer' templates are public, indexable pages

*Verdict: unverified* · Affected: /, /penci-block/mega-menu/, /penci-block/footer/, /thank-you-messages/, /thankyou-messages/, /archive/

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

**Fix.** 1. Attach a real mega menu under "What to write in a card" listing the 15 occasion hubs, or add the top 4–5 occasions to the header.
2. Exclude the penci_block post type from the front end and from search: set Yoast "show in search results" to No, or register it as non-public.
3. Choose one Thank You hub and 301 the other.
4. Add footer navigation (top occasions, archive, about/contact) and social profiles.
5. Either link /archive/ from the site or retitle it to match what it lists.

### [medium] Keyboard users get no visible focus, hit invisible menu links, and cannot open the mobile menu

*Verdict: unverified* · Affected: /, /birthday-messages-for-mom/, sitewide (all templates)

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

**Fix.** 1. Add :focus-visible outlines to links and buttons.
2. Make the closed off-canvas panel inert, or visibility:hidden, so it drops out of the tab order.
3. Replace the hamburger div with `<button aria-label="Open menu" aria-expanded>`, at least 44px.
4. Make back-to-top a `<button aria-label="Back to top">`.
5. Give copy buttons aria-label="Copy message".
6. Add a skip-to-content link.
7. Remove the legacy #sidebar-nav.

### [medium] Mobile jump menu: headings land under the sticky header, and the long menu pushes messages below the fold

*Verdict: unverified* · Affected: /birthday-messages/, /fathers-day-messages/, /4th-of-july-messages/, /everyday-messages/, /congratulations-messages/, /more-inspiration-messages/, /birthday-messages-for-teacher/, /canada-day-messages/ (+1 more)

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

**Fix.** 1. Add `html{scroll-padding-top:80px}`, or `scroll-margin-top:80px` on the section containers.
2. Below 768px, collapse the menu into a "Jump to section" dropdown (<details>/<select>) or a horizontal row of scrolling chips.
3. Make menu items at least 44px tall.
4. Consider a small sticky "Sections" button.

### [medium] Mobile: content jumps 66px when the header becomes sticky, and injected copy buttons shift text on load

*Verdict: unverified* · Affected: /birthday-messages-for-mom/, /halloween-messages/, /what-to-write-in-a-card/, /mothers-day-messages-for-wife-what-she-actually-wants/, /contact-us/

**Evidence.** Header jump (mobile, 390x844), measured on /birthday-messages-for-mom/:
- Scrolling from 60px to 70px switches .penci_navbar_mobile from position:static to fixed (adding the class "mobile-sticky").
- Its wrapper collapses from 66px to 0px, and the visible H1's position in the document moves from 121px to 55px. The whole page jumps up 66px.
- Each crossing records a 0.0782 layout shift. Three crossings gave a cumulative layout shift (CLS) of 0.2346 (shots/m_mom_scroll40_before_switch.png vs m_mom_scroll80_after_switch.png).
- The same 0.0782 shift appeared on /halloween-messages/, /what-to-write-in-a-card/, the Mother's Day wife post and /contact-us/, so this is sitewide on mobile.

Copy buttons: the inline "Click to Copy" snippet inserts a <button> before every message at DOMContentLoaded.
- On mobile this shifted text by 0.0823 on /birthday-messages-for-mom/ (at 1.19s) and 0.0411 on /halloween-messages/ (at 1.34s). The sources were div.elementor-text-editor and div.penci-block_content.
- Mobile CLS totals: 0.161 on /birthday-messages-for-mom/, 0.119 on /halloween-messages/, 0.101 on /what-to-write-in-a-card/.

On desktop, the same pages measured 0.003–0.028, because desktop uses a separate sticky clone that slides in. I saw no shifts caused by ads.

**Fix.** 1. Keep the 66px space when the mobile navbar becomes fixed: a placeholder div, a min-height on the wrapper, or position:sticky instead of toggling to fixed.
2. Render the copy button in the Elementor template or with PHP, or reserve its space in CSS (e.g. `.msgs .penci-block_content{padding-left:28px}` with the button absolutely positioned), so nothing moves after load.

### [low] A hidden 'Emotions' template block on 138 message pages holds a duplicate H1, empty “” quotes and dead '#' anchors

*Verdict: unverified* · Affected: /birthday-messages-for-mom/, /be-an-angel-day-messages/, /national-tap-dance-day-messages/, /thank-you-messages/, /at-work-messages/, /belated-anniversary-messages-for-sorry-i-forgot/

**Evidence.** Visitors never see this block. The container (e.g. elementor-element-396920a on /birthday-messages-for-mom/) has elementor-hidden-desktop, elementor-hidden-tablet and elementor-hidden-mobile, and only the mobile and tablet breakpoints are active in the Elementor settings, so it never renders.

In the browser on desktop and mobile, /birthday-messages-for-mom/, /be-an-angel-day-messages/ and /national-tap-dance-day-messages/ each show exactly 1 visible H1 and 0 visible empty “” blocks (shots/d_mom_full.png). 18 of 18 sampled pages were hidden the same way.

The HTML of each of the 138 pages still contains:
- a second H1 (e.g. "Birthday messages, for Mom")
- two empty “” paragraphs
- a one-item "Emotions" jump link that is either href="#" (101 pages) or points to an id that doesn't exist (#n on /be-an-angel-day-messages/ and /thank-you-day-messages/, #fe on /thank-you-messages/, #r on /at-work-messages/, #f on /anniversary-messages-for-friends/)
- placeholder labels such as "abc" (/belated-anniversary-messages-for-sorry-i-forgot/) and "Nostalgic" (/be-an-angel-day-messages/)

The copy-button script also attaches 2 invisible buttons to these empty blocks.

**Fix.** Delete the hidden container from the Elementor template instead of hiding it with responsive visibility. Alternatively, finish it (real section ids and labels, no empty blocks) and show it. Either way, crawlers stop seeing the duplicate H1 and empty quotes.

### [low] Contact and comment forms rely on placeholders instead of labels; reCAPTCHA badge hidden without the required notice

*Verdict: unverified* · Affected: /contact-us/, /mothers-day-messages-for-wife-what-she-actually-wants/

**Evidence.** Contact form (/contact-us/, Contact Form 7):
- The form has `novalidate`. Fields have no <label>, only placeholders ("Name*", "Email*", "Subject", "Your Message"), and "required" is set only via aria-required.
- Validation happens in the browser when a field loses focus. Typing "not-an-email" and tabbing out showed "The e-mail address entered is invalid."; emptying Name showed "The field is required." (shots/d_contact_blur_validation.png).
- Submit was not clicked: the form posts via AJAX, so clicking would send a request.
- The reCAPTCHA v3 badge is present but visibility:hidden, and the page has no "protected by reCAPTCHA / Privacy Policy / Terms" text.

Comment form (#commentform, on all 49 posts):
- A textarea plus Name* and Email* inputs, placeholders only.
- The email field is type="text", and name/email have neither required nor aria-required.
- There is no cookies-consent checkbox. The heading reads "LEAVE A COMMENT" (shots/d_post_comment_form.png, m_post_comment_form.png).

**Fix.** 1. Add visible <label>s.
2. Use type="email" with autocomplete attributes (name, email), and add required.
3. Because the reCAPTCHA badge is hidden, add Google's disclosure text under the contact form.

### [low] Copy-message button: copies the quote marks, gives no error feedback, and message pages have no share buttons

*Verdict: unverified* · Affected: /birthday-messages-for-mom/, /mothers-day-messages-for-wife-what-she-actually-wants/

**Evidence.** Copying works both by desktop click and mobile tap: the icon turns into a checkmark with "COPIED" for 2 seconds (shots/d_mom_copy_clicked.png, m_mom_copy_tapped.png).

Issues:
- The clipboard text includes the typographic quotation marks. After clicking copy on the first message, the clipboard read `“Happy birthday to the woman who taught me everything I know, …`, starting with U+201C, so users paste the quote marks into their card.
- The "Copy" tooltip only shows on :hover, not on keyboard focus.
- The snippet calls navigator.clipboard.writeText() without awaiting it or catching errors, so "Copied" shows even if the write fails.
- 9 buttons are created on /birthday-messages-for-mom/ but only 7 are visible; 2 sit inside the hidden template block.
- Message pages have no share buttons.

Posts have a "Share" hover dropdown with only WhatsApp and Copy Link. Copy Link correctly copies the post URL and opens no new tab (shots/d_post_share_hover.png).

**Fix.** 1. Strip the wrapping quote marks before copying, e.g. `text.trim().replace(/^[“"]|[”"]$/g,'')`.
2. Await writeText and show an error state if it fails.
3. Show the tooltip on :focus-visible as well as hover.
4. Add WhatsApp, email and Pinterest share buttons, per message or per page, to message pages.

### [low] The homepage 'initialise' error comes from the cookie plugin's inline script, which crashes when its library fails to load

*Verdict: unverified* · Affected: /

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

**Fix.** 1. Guard the init: `if (window.cookieconsent && window.cookieconsent.initialise) {…}`, or move it into the plugin's own file.
2. Add similar existence checks to the theme's inline -after scripts (stickThis, wp.i18n).
3. Replace the `window.onload` assignment with addEventListener('load', …).
4. Reduce the number of separate static requests per page (enable Jetpack Boost concatenation for the remaining plugin JS/CSS) so partial load failures are less likely.


## Performance

### [critical] Uncached HTML takes about 2.3 s to generate, and the edge cache keeps it for only 300 s, so mobile LCP is 3.9-6.8 s

*Verdict: unverified* · Affected: sitewide (HTML documents, 668 URLs), /, /birthday-messages/, /birthday-messages-for-mom/, /mothers-day-messages/, /mothers-day-messages-for-wife-what-she-actually-wants/, /tag/alps/

**Evidence.** curl samples, sequential with 2.5 s gaps and a Chrome navigation Accept header (script agent-work/performance/ttfb.sh, output ttfb.out). Uncached means a cache-busting ?perfaudit=<random> query string, or the first request after the page sat idle for about 5 minutes.
- 21 MISS responses: server-timing 'cache;desc=MISS;dur=' median 2,283 ms (min 1,905, p90 2,432, max 5,537 on the post). Client TTFB median 2.46 s, max 6.02 s. Header x-nananana: Batcache-Set.
- 15 edge HITs: dur 1-3 ms, TTFB median 169 ms (142-448).
- HTML header is 'cache-control: max-age=300, must-revalidate'. Static assets, by contrast, get max-age=31536000 or 315360000.
- The first request after about 3-7 minutes idle was a full MISS for 5 of 5 URLs: / 2,046 ms, /birthday-messages/ 2,011, /birthday-messages-for-mom/ 2,283, /mothers-day-messages/ 2,296, the post 2,424. /tag/alps/, requested about 3 minutes earlier, was a HIT.
- All 7 Lighthouse mobile runs measured server response 1,873-2,520 ms. LCP breakdown shows TTFB as 38-62% of LCP (/archive/ TTFB 2,407 of 3,856 ms; / 2,483 of 4,632 ms).
- The earlier crawl got x-ac STALE on 507 of 513 HTML responses and a fresh HIT on only 6, so pages are usually expired at the edge between visits.
- Once the HTML was cached, Lighthouse desktop runs measured server response 77-88 ms.
Repro: curl -s -o /dev/null -D - -H 'Accept: text/html' 'https://blog.123greetings.com/tag/alps/?x=123' | grep -i server-timing

**Fix.** 1. Cut origin render time (target under 600 ms). Profile with Query Monitor on a MISS. Deactivate plugins whose assets load but are unused on these pages: penci-recipe, penci-review, testimonial-free, wpforms-form-locker, layout-grid, search-in-place, Jetpack PayPal and Search blocks. Reduce the Elementor/Soledad dynamic widgets that run queries per request (side-nav penci-advanced-list, latest-posts blocks). Check that the persistent object cache is hit.
2. Lengthen HTML edge caching. Send a longer Cache-Control / s-maxage with stale-while-revalidate from a small mu-plugin. First confirm with WordPress.com support that the Atomic edge honours it; WP.com purges on publish, so staleness risk is low.
3. Warm the cache for top landing pages (seasonal message pages) with a scheduled sitemap fetch before holidays.
Expected: removes about 2 s from mobile FCP/LCP for every visitor who hits an expired page.

### [critical] reCAPTCHA v3 and Contact Form 7 assets load on every page (about 800 KiB and 0.75-1.9 s of main-thread time), but only /contact-us/ has a form

*Verdict: unverified* · Affected: sitewide (all page types: home, message pages, posts, archive, tag), /, /mothers-day-messages/, /archive/, /tag/alps/, /contact-us/

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

**Fix.** Enqueue CF7 and reCAPTCHA only where a form is rendered:
- add_filter('wpcf7_load_js','__return_false');
- add_filter('wpcf7_load_css','__return_false');
- On the contact page template, call wpcf7_enqueue_scripts(); wpcf7_enqueue_styles();
- On wp_enqueue_scripts at priority 20 or later: if (!is_page('contact-us')) { wp_dequeue_script('google-recaptcha'); wp_dequeue_script('wpcf7-recaptcha'); }
- Better still, load reCAPTCHA only when the contact form gets focus.
Expected: about 800 KiB and 9-13 requests less on 667 of 668 URLs, and 0.75-1.9 s less main-thread time on mid-range mobile.

### [high] Message pages load a heavy ad and identity stack (truereach, GPT, Funding Choices, 7 ID-sync vendors) for one ad slot

*Verdict: unverified* · Affected: /birthday-messages/, /birthday-messages-for-mom/, /mothers-day-messages/, all Elementor message pages (38 of 38 sampled HTML files include truereachAdRender.js; not on home, posts, archive or tag)

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

**Fix.** Delay truereach until after the load event plus idle time, or until first scroll or interaction. The single interstitial slot doesn't need to compete with first render. Ask the vendor to drop ID modules that aren't contracted (ID5, Criteo IDs, Lotame, Yahoo ConnectID, RTB House, AudienceSearch, creativecdn) and to serve the loader with a long cache TTL. Keep one CMP: Funding Choices or the NSC cookie banner, not both.
Expected: about 40 fewer requests, about 560 KiB less, and about 1 s less TBT on message pages.

### [high] Render-blocking CSS: 34-40 stylesheets, a 1.3 MB main.css that is 98% unused, and 96 KB of inline CSS in every HTML page

*Verdict: unverified* · Affected: sitewide, /, /birthday-messages-for-mom/, /mothers-day-messages-for-wife-what-she-actually-wants/

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

**Fix.** 1. Enable Jetpack Boost 'Optimize CSS loading' (critical CSS). Boost is already installed (_jb_static bundles).
2. In Soledad Performance settings, turn on the options that split or trim main.css, and turn off unused features.
3. Dequeue plugin CSS on pages that don't use it: penci-recipe, penci-review, layout-grid, testimonial-free (4 files), wpforms-form-locker, mediaelement (2 files), jetpack-paypal-payments, search-in-place, social-counter, and the Jetpack Search block inline styles if Jetpack Search isn't used.
4. Enable Elementor's 'Improved CSS Loading' and 'Inline Font Icons' features.
5. Load jQuery in the footer or defer it (Boost 'Defer non-essential JavaScript').
Expected: FCP and LCP about 1.5-3 s faster on mobile Slow-4G (Lighthouse estimate), plus 0.5-1 s less style/layout main-thread time.

### [high] Web fonts: 7 text families and 386-549 @font-face rules per page, only 4-10 faces used; theme fonts have no font-display

*Verdict: unverified* · Affected: sitewide

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

**Fix.** 1. Elementor > Settings > Advanced: Google Fonts Load = Swap. Remove unused families from Site Settings > Global Fonts and theme defaults (Roboto, Roboto Slab, Inter, Albert Sans) or disable Elementor Google Fonts entirely. Limit subsets to latin.
2. Soledad typography: use one body family and one heading family with 2-3 weights, and request with &display=swap (or self-host them).
3. Replace preconnects with one to fonts.wp.com, or self-host.
4. Drop duplicate Font Awesome builds (keep one, or switch to inline SVG icons).
5. Reorder the penciicon src list so woff2 comes first.
6. Preload the 1-2 critical woff2 files.
Expected: 4 fewer render-blocking CSS requests (about 190 KB decoded @font-face CSS), no invisible text, and less font-swap CLS.

### [medium] Layout shifts: the sticky mobile header shifts content by 0.08 on first scroll on every page, and the logo has empty width/height

*Verdict: unverified* · Affected: sitewide (sticky header, 7 of 7 tested pages), /birthday-messages/, /archive/, /tag/alps/, /

**Evidence.** Sticky header (Playwright mobile 412x823, probe_cls.mjs):
- On / and /tag/alps/, a layout-shift entry of 0.0802 (hadRecentInput=false) fires at scrollY=67.
- Its sources are DIV.container (rect y 65 -> 0), DIV.container.penci-breadcrumb and SECTION.penci-section. The 66 px header DIV.penci_mobile_midbar.sticky-enable drops out of flow without a placeholder.
- The same 0.08 shift appeared during scrolling on all 7 pages in the inventory pass.
- Real-user CLS counts scroll-triggered shifts, because scrolling is not input.

Logo: img.penci-mainlogo has width="" and height="" with CSS width/height auto and max-width 280px. On /birthday-messages/, Lighthouse mobile CLS is 0.136, of which 0.132 is a shift of div.container-single-page caused by this image ('Media element lacking an explicit size').

Lighthouse load-only CLS: /archive/ 0.156, /tag/alps/ 0.156, /birthday-messages/ 0.136, / desktop 0.094 (hero plus font swaps). Adding the 0.08 scroll shift puts most pages above the 0.1 'good' threshold.

**Fix.** Keep the header's space reserved when it becomes fixed: wrap it in a container with min-height equal to the header height (66 px mobile), or use position: sticky instead of toggling position: fixed. Output width="700" height="240" on the logo <img>, or add CSS aspect-ratio: 700/240.

### [medium] The post template's LCP image is a CSS background, so the browser can't discover it early (mobile LCP 6.8 s)

*Verdict: unverified* · Affected: /mothers-day-messages-for-wife-what-she-actually-wants/, likely all 49 posts using the Soledad single-post header (verified on this post)

**Evidence.** The LCP element is span.attachment-penci-full-thumb.penci-single-featured-img, with inline style background-image: url(https://i0.wp.com/.../2026/04/may4th-husband-to-wife.webp?fit=585%2C329&ssl=1) and padding-top: 56.24%. The HTML has no <link rel=preload>.

Lighthouse mobile LCP 6.82 s: TTFB 2,596 ms, load delay 3,343 ms (49%), load 812 ms, render 66 ms.
Lighthouse desktop LCP 1.2 s, with 801 ms of load delay.

The 585 px-wide image fills a 372 CSS-px slot on a 2.625 DPR phone (about 977 device px), so it is also blurry on mobile.

**Fix.** Render the featured image as <img> with srcset/sizes, fetchpriority="high" and no lazy-loading. Soledad has single-post header options for this; the span already carries penci-disable-lazy. Alternatively, print <link rel="preload" as="image" imagesrcset=... fetchpriority="high"> for the featured image in wp_head on single posts.

### [medium] Unused JavaScript: Soledad library bundle 88% unused, two Swiper versions, 1st-party JS 75% unused

*Verdict: unverified* · Affected: /birthday-messages-for-mom/, /mothers-day-messages/, sitewide (theme bundles)

**Evidence.** Playwright JS coverage on /birthday-messages-for-mom/:
- 70 scripts, 3.90 MB decoded, 35% executed.
- First-party: 32 scripts, 1.06 MB, 25% used.
- _jb_static/??43755b75c1 (98 KiB Brotli, 370 KB decoded) is 12% used. It bundles Swiper 11.0.5, Isotope, Jarallax, Magnific Popup, Theia sticky, Slick, imagesLoaded, fitvids, Masonry and a video controller.
- _jb_static/??34692c1620 (47 KiB, 180 KB decoded) is 4% used and carries a second Swiper (8.3.2, from testimonial-free).

Lighthouse bootup on /mothers-day-messages/: jquery.min.js accounts for 1,565 ms of script time (handlers run through jQuery). Most message pages have 20-25 first-party scripts, loaded synchronously at the end of body.

Also loaded everywhere: wp-emoji-release.min.js (5.8 KiB plus 3 KB inline module), wp-polyfill, comment-reply, and sticky-menu-or-anything (a third sticky implementation next to Soledad and Theia).

**Fix.** In Soledad Performance settings, disable the features and libraries the site doesn't use (masonry/isotope, jarallax parallax, magnific lightbox, theia sticky sidebar, slick). Remove testimonial-free if no testimonials render (it adds Swiper 8, FA and fontello). Enable Jetpack Boost 'Defer non-essential JavaScript'. Disable emoji scripts (remove_action('wp_head','print_emoji_detection_script',7)). Remove the sticky-menu plugin if the theme's sticky header is used.

### [low] Homepage loads Google Programmable Search (CSE) upfront, and every page carries Jetpack Search CSS

*Verdict: unverified* · Affected: /

**Evidence.** Lighthouse mobile on /:
- cse.google.com/cse.js, cse_element__en.js (127 KiB, 55% unused), adsense/search/async-ads.js (45 KiB, 73% unused), default_v6 CSS and more: 7 requests, 195 KiB.
- 426 ms main-thread, 112 ms blocking.
- Pulls adtrafficquality/sodar (about 23 KiB).
- The CSE widget holds the deepest DOM on the page (depth 25, nested tables).

Every page also inlines 7 Jetpack Search block styles, about 22 KB.

**Fix.** Load CSE only when the search box gets focus or is clicked, or use the site's own search. Dequeue Jetpack Search block styles if Jetpack Search isn't used.

### [low] Oversized logo (2 copies) and a 37 KB JPEG favicon at high priority on every page

*Verdict: unverified* · Affected: sitewide

**Evidence.** The logo /wp-content/uploads/2026/04/123greetings.webp (39.7 KB, 700x240) comes straight from origin, not Photon, with no srcset. It appears twice in the header and renders at 131-146 CSS px wide on mobile (Lighthouse layout: 280 px), about 1.8-2x larger than needed at DPR 2.625.

cropped-favicon.jpg is a 37.2 KiB JPEG fetched at High priority on every uncached visit.

Apart from these, images are in good shape:
- 60-140 KiB of images per page
- 3,440 of 3,731 crawled image references are WebP
- the homepage hero uses loading=eager, fetchpriority=high and width/height
- Photon serves WebP with a 2-year cache

**Fix.** Export the logo at about 300x103 (about 2x rendered size) or serve it through Photon with srcset. Add width/height (see the CLS finding). Replace the favicon with a 32/48 px PNG or ICO under 5 KB, plus an SVG icon.

### [low] Three analytics beacons: GA4 gtag.js (173 KiB), Jetpack Stats and WP.com bilmur

*Verdict: unverified* · Affected: sitewide

**Evidence.** www.googletagmanager.com/gtag/js?id=G-R56NTBBBCB is 173 KiB compressed and 517 KB decoded (49% used). Lighthouse mobile: 278-577 ms main-thread and 147-418 ms blocking per page (/archive/ 577/418, / 545/394).

stats.wp.com e-202640.js, s0.wp.com bilmur.min.js and pixel.wp.com are cheap together: 3 requests, 7.8 KiB, under 3 ms blocking.

**Fix.** Delay gtag until after load or idle (or load through the consent tool once consent is given). Configure GA4 so it doesn't also run enhanced-measurement features the site doesn't use. Keep Jetpack Stats only if it's used.


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
