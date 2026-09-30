// Desktop functional checks across message hubs, message pages, search, archives, posts, 404, upcoming-events.
import { launch, newCtx, openClean, cls, save, sleep, SHOTS, assetStats, loadCount, BASE } from './lib.mjs';

const browser = await launch();
const ctx = await newCtx(browser, 'desktop', { permissions: ['clipboard-read', 'clipboard-write'] });
// pre-dismiss cookie banner for most pages (banner tested separately)
await ctx.addCookies([{ name: 'cookieconsent_status', value: 'dismiss', domain: 'blog.123greetings.com', path: '/' }]);
const R = {};
const PAUSE = 4000;

const visInfo = () => {
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity !== 0; };
  const h1 = [...document.querySelectorAll('h1')].map((e) => ({ t: e.innerText.trim().slice(0, 60), vis: vis(e) }));
  const empties = [...document.querySelectorAll('p, blockquote')].filter((p) => /^[“"]\s*[”"]$/.test(p.textContent.trim()));
  const sideNav = [...document.querySelectorAll('.elementor-widget-penci-advanced-list')].map((w) => ({ vis: vis(w), items: [...w.querySelectorAll('a')].map((a) => ({ t: a.innerText.trim(), h: a.getAttribute('href'), vis: vis(a) })) }));
  const header = document.querySelector('.penci_header.penci-header-builder.main-builder-header, .penci_header');
  const stickyHeader = [...document.querySelectorAll('.penci_header')].filter((e) => getComputedStyle(e).position === 'fixed');
  return { h1, emptiesTotal: empties.length, emptiesVisible: empties.filter(vis).length, sideNav, docH: document.documentElement.scrollHeight };
};

async function headerBottom(page) {
  return page.evaluate(() => {
    let b = 0;
    document.querySelectorAll('.penci_header, .penci-header-builder, header, .sticky-wrapper, #penci-header-sticky').forEach((e) => {
      const cs = getComputedStyle(e);
      if ((cs.position === 'fixed' || cs.position === 'sticky') && cs.display !== 'none' && cs.visibility !== 'hidden') {
        const r = e.getBoundingClientRect();
        if (r.bottom > 0 && r.top <= 0 + 5 && r.height < 300) b = Math.max(b, r.bottom);
      }
    });
    return b;
  });
}

// click every visible side-nav item and measure where its target lands
async function testJumpNav(page, name) {
  const items = await page.evaluate(() => {
    const w = [...document.querySelectorAll('.elementor-widget-penci-advanced-list')].find((w) => w.getBoundingClientRect().height > 0);
    if (!w) return [];
    return [...w.querySelectorAll('a[href^="#"]')].map((a, i) => ({ i, t: a.innerText.trim(), h: a.getAttribute('href') }));
  });
  const out = [];
  for (const it of items) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(400);
    const link = page.locator('.elementor-widget-penci-advanced-list a[href^="#"]').filter({ visible: true }).nth(it.i);
    try { await link.click({ timeout: 5000 }); } catch (e) { out.push({ ...it, err: String(e).slice(0, 120) }); continue; }
    await sleep(1600);
    const hb = await headerBottom(page);
    const r = await page.evaluate((h) => {
      const id = h.slice(1);
      const t = id ? document.getElementById(id) : null;
      if (!t) return { exists: false, sy: scrollY, hash: location.hash };
      const rr = t.getBoundingClientRect();
      const firstHeading = t.querySelector('h2, h3, h4, .elementor-heading-title');
      const hr = firstHeading ? firstHeading.getBoundingClientRect() : null;
      return { exists: true, sy: Math.round(scrollY), hash: location.hash, targetTop: Math.round(rr.top), headingTop: hr ? Math.round(hr.top) : null, heading: firstHeading ? firstHeading.innerText.trim().slice(0, 40) : null };
    }, it.h);
    out.push({ ...it, headerBottom: Math.round(hb), ...r });
  }
  return out;
}

async function step(name, path, fn, opts = {}) {
  await sleep(PAUSE);
  const { page, log } = await openClean(ctx, path, { wait: opts.wait ?? 6000 });
  const rec = { status: log.status, finalUrl: log.finalUrl, pageErrors: log.pageErrors.map((e) => e.msg), consoleErrors: log.console.filter((c) => c.type === 'error').map((c) => c.text.slice(0, 160)), http: log.http.slice(0, 10), n429: log.n429 };
  try { Object.assign(rec, await fn(page)); } catch (e) { rec.error = String(e).slice(0, 300); }
  rec.cls = await cls(page).catch(() => null);
  R[name] = rec;
  console.error('done', name, rec.status, 'errors', rec.pageErrors.length);
  await page.close();
}

// 1. Birthday hub
await step('birthdayHub', '/birthday-messages/', async (page) => {
  const v = await page.evaluate(visInfo);
  const sticky = await page.evaluate(() => {
    const w = [...document.querySelectorAll('.elementor-widget-penci-advanced-list')].find((w) => w.getBoundingClientRect().height > 0);
    const box = w && w.closest('.e-con, .elementor-element');
    return box ? { pos: getComputedStyle(box).position, cls: box.className.slice(0, 80) } : null;
  });
  const jumps = await testJumpNav(page, 'birthdayHub');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('.elementor-widget-penci-advanced-list a[href="#zodiacBirthday"]').filter({ visible: true }).first().click().catch(() => {});
  await sleep(1500);
  await page.screenshot({ path: `${SHOTS}/d_birthday_hub_after_jump_zodiac.png` });
  // scroll to bottom: does the sticky side nav overlap footer?
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await sleep(1500);
  await page.screenshot({ path: `${SHOTS}/d_birthday_hub_bottom.png` });
  const tiles = await page.evaluate(() => [...document.querySelectorAll('.elementor[data-elementor-type=wp-page] a')].map((a) => ({ t: a.innerText.trim().slice(0, 30), h: a.getAttribute('href') })));
  const ecard = tiles.filter((t) => /www\.123greetings\.com/.test(t.h || ''));
  return { vis: v, sticky, jumps, tilesCount: tiles.length, ecardLinks: ecard, hashLinks: tiles.filter((t) => t.h === '#').length };
});

// 2. Father's Day (16 jump items)
await step('fathersDay', '/fathers-day-messages/', async (page) => {
  const v = await page.evaluate(visInfo);
  const jumps = await testJumpNav(page, 'fathersDay');
  // screenshot after jumping to "From Sons"
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('.elementor-widget-penci-advanced-list a[href="#wfs"]').filter({ visible: true }).first().click().catch(() => {});
  await sleep(1500);
  await page.screenshot({ path: `${SHOTS}/d_fathers_day_jump_from_sons.png` });
  // side nav while scrolled mid-page: still visible?
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
  await sleep(1500);
  const navMid = await page.evaluate(() => {
    const w = [...document.querySelectorAll('.elementor-widget-penci-advanced-list')].find((w) => w.offsetParent);
    const r = w.getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), inView: r.bottom > 0 && r.top < innerHeight };
  });
  await page.screenshot({ path: `${SHOTS}/d_fathers_day_midscroll.png` });
  const ecard = await page.evaluate(() => [...document.querySelectorAll('.elementor[data-elementor-type=wp-page] a')].filter((a) => /www\.123greetings\.com/.test(a.href)).map((a) => ({ t: a.innerText.trim().slice(0, 40), h: a.href })));
  return { vis: v, jumps, navMid, ecard };
});

// 3-5. Message pages with the hidden "Emotions" template
for (const [name, path] of [['mom', '/birthday-messages-for-mom/'], ['angel', '/be-an-angel-day-messages/'], ['tapdance', '/national-tap-dance-day-messages/']]) {
  await step(name, path, async (page) => {
    const v = await page.evaluate(visInfo);
    const copyBtns = await page.locator('button.copy-icon-btn').count();
    let copy = null;
    if (copyBtns) {
      const b = page.locator('button.copy-icon-btn').first();
      await b.scrollIntoViewIfNeeded();
      const a11y = await b.evaluate((e) => ({ ariaLabel: e.getAttribute('aria-label'), title: e.getAttribute('title'), type: e.getAttribute('type'), text: e.innerText }));
      await b.click();
      await sleep(400);
      const tooltip = await page.evaluate(() => { const t = document.querySelector('button.copy-icon-btn .copy-tooltip'); return t ? { text: t.innerText || t.textContent, vis: getComputedStyle(t).visibility, op: getComputedStyle(t).opacity } : null; });
      let clip = null;
      try { clip = await page.evaluate(() => navigator.clipboard.readText()); } catch (e) { clip = 'ERR ' + String(e).slice(0, 100); }
      if (name === 'mom') await page.screenshot({ path: `${SHOTS}/d_mom_copy_clicked.png`, clip: { x: 0, y: 0, width: 1366, height: 450 } });
      copy = { a11y, tooltipAfterClick: tooltip, clipboard: clip.slice(0, 200) };
    }
    const ecard = await page.evaluate(() => [...document.querySelectorAll('.elementor[data-elementor-type=wp-page] a')].filter((a) => /123greetings\.com/.test(a.href) && !a.href.includes('blog.')).map((a) => a.href));
    const internal = await page.evaluate(() => [...document.querySelectorAll('.elementor[data-elementor-type=wp-page] a')].filter((a) => a.href.includes('blog.123greetings.com')).map((a) => a.href));
    await page.screenshot({ path: `${SHOTS}/d_${name}_full.png`, fullPage: true });
    return { vis: v, copyBtns, copy, ecard, internalLinks: internal.length };
  });
}

// 6-7. Search results
await step('searchBirthday', '/?s=birthday', async (page) => {
  const res = await page.evaluate(() => {
    const arts = [...document.querySelectorAll('article, .grid-style, li.list-post, .penci-grid > li')];
    const links = [...new Set([...document.querySelectorAll('article h2 a, .grid-title a, .entry-title a, .penci-entry-title a, h2.penci-entry-title a')].map((a) => a.href))];
    const pag = [...document.querySelectorAll('.pagination a, .penci-pagination a, .nav-links a, .penci-ajax-more a, .penci-ajax-more-button')].map((a) => ({ t: a.innerText.trim(), h: a.getAttribute('href') }));
    const searchInputs = [...document.querySelectorAll('input[type=search], input[name=s], input.gsc-input')].filter((e) => e.getBoundingClientRect().width > 0).length;
    return { h1: document.querySelector('h1')?.innerText, count: links.length, links, pag, searchInputs };
  });
  await page.screenshot({ path: `${SHOTS}/d_search_birthday.png` });
  return res;
});
await step('searchEmpty', '/?s=zzqx', async (page) => {
  const res = await page.evaluate(() => ({ h1: document.querySelector('h1')?.innerText, main: (document.querySelector('#main, .container-single-page, .penci-wrapper-data, main') || document.body).innerText.slice(0, 600), searchInputs: [...document.querySelectorAll('input[type=search], input[name=s], input.gsc-input')].filter((e) => e.getBoundingClientRect().width > 0).length, links: [...document.querySelectorAll('#main a, .penci-wrapper-data a')].length }));
  await page.screenshot({ path: `${SHOTS}/d_search_empty.png` });
  return res;
});

// 8. Archive + Load More
await step('archive', '/archive/', async (page) => {
  const before = await page.evaluate(() => [...document.querySelectorAll('.elementor[data-elementor-type=wp-page] h2 a, .elementor[data-elementor-type=wp-page] .entry-title a')].map((a) => a.innerText.trim()));
  const btn = page.locator('text=Load More Posts').first();
  let after = null; let btnInfo = null;
  if (await btn.count()) {
    btnInfo = await btn.evaluate((e) => ({ tag: e.tagName, href: e.getAttribute('href'), cls: e.className }));
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await sleep(5000);
    after = await page.evaluate(() => [...document.querySelectorAll('.elementor[data-elementor-type=wp-page] h2 a, .elementor[data-elementor-type=wp-page] .entry-title a')].map((a) => a.innerText.trim()));
    await page.screenshot({ path: `${SHOTS}/d_archive_after_loadmore.png` });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${SHOTS}/d_archive_top.png` });
  return { beforeCount: before.length, beforeTitles: [...new Set(before)], btnInfo, afterCount: after?.length, afterTitles: after ? [...new Set(after)] : null };
});

// 9. Category pagination: page 1 -> click "next" / "3"
await step('category', '/category/123greetings/', async (page) => {
  const pag = await page.evaluate(() => [...document.querySelectorAll('.pagination a, .penci-pagination a, .nav-links a, a.page-numbers')].map((a) => ({ t: a.innerText.trim(), h: a.getAttribute('href') })));
  const loadMore = await page.evaluate(() => [...document.querySelectorAll('.penci-ajax-more, .penci-ajax-more-button, .penci-pagination.penci-ajax-more')].map((e) => e.className));
  const posts = await page.evaluate(() => document.querySelectorAll('article, .grid-style, li.list-post').length);
  let clicked = null;
  const three = page.locator('a.page-numbers', { hasText: /^3$/ }).first();
  if (await three.count()) {
    await Promise.all([page.waitForLoadState('load').catch(() => {}), three.click()]);
    await sleep(3000);
    clicked = { url: page.url(), title: await page.title(), posts: await page.evaluate(() => document.querySelectorAll('article, .grid-style, li.list-post').length) };
  }
  return { pag, loadMore, posts, clicked };
});

// 10. Author last page
await step('authorLast', '/author/iblog123greetingsgmail-com/page/5/', async (page) => {
  return await page.evaluate(() => ({ title: document.title, pag: [...document.querySelectorAll('a.page-numbers, .nav-links a, .penci-pagination a')].map((a) => ({ t: a.innerText.trim(), h: a.getAttribute('href') })), posts: document.querySelectorAll('article, .grid-style, li.list-post').length, authorBox: document.querySelector('.author-description, .post-author, .penci-author-desc')?.innerText?.slice(0, 200) }));
});

// 11. Post: comments, share, prev/next, related, eCard CTAs
await step('post', '/mothers-day-messages-for-wife-what-she-actually-wants/', async (page) => {
  const info = await page.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
    const form = document.querySelector('#commentform, form.comment-form');
    const fields = form ? [...form.querySelectorAll('input, textarea, button')].filter((e) => e.type !== 'hidden').map((e) => ({ name: e.name || e.id, type: e.type, req: e.required || e.getAttribute('aria-required') === 'true', label: e.labels?.[0]?.innerText?.trim()?.slice(0, 30) || null, ph: e.placeholder || null, vis: vis(e) })) : null;
    const share = [...document.querySelectorAll('.tags-share-box a, .post-share a, .penci-social-share a, .list-posts-share a')].map((a) => ({ t: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 20), h: (a.getAttribute('href') || '').slice(0, 80), target: a.target, cls: a.className.slice(0, 40), vis: vis(a) }));
    const prevNext = [...document.querySelectorAll('.post-pagination a, .penci-post-pagination a, .prev-post a, .next-post a')].map((a) => ({ t: a.innerText.trim().slice(0, 60), h: a.getAttribute('href') }));
    const relatedHeads = [...document.querySelectorAll('h3, h4, .post-title-box, .penci-related-title, .post-related h3')].filter(vis).map((e) => e.innerText.trim()).filter((t) => /related|you may|also like|latest/i.test(t));
    const related = [...document.querySelectorAll('.post-related a, .penci-related a, .related-posts a')].map((a) => a.innerText.trim()).filter(Boolean).slice(0, 12);
    const ctas = [...document.querySelectorAll('.entry-content a, .inner-post-entry a')].map((a) => ({ t: a.innerText.trim().slice(0, 50), h: a.href }));
    const commentsTitle = [...document.querySelectorAll('#respond h3, .comment-reply-title, .post-title-box h3')].map((e) => e.innerText.trim());
    return { fields, formAction: form?.getAttribute('action'), commentsTitle, share, prevNext, relatedHeads, related, ctas, recaptcha: !!document.querySelector('.g-recaptcha, .grecaptcha-badge'), cookiesConsentBox: !!document.querySelector('#wp-comment-cookies-consent') };
  });
  // where does the list of "Five Minutes With Bob" links render? screenshot around it
  const bobBox = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find((x) => x.href.includes('five-minutes-with-bob-2nd-august') && x.innerText.trim());
    if (!a) return null;
    const blk = a.closest('section, .penci-owl-carousel, .post-related, .widget, .penci-block-vc, .elementor-element, aside, div[class*=related]');
    const r = a.getBoundingClientRect();
    return { y: Math.round(r.top + scrollY), blk: blk ? (blk.id || '') + ' ' + blk.className.slice(0, 100) : null, heading: blk?.querySelector('h3, h2, .penci-border-arrow')?.innerText?.trim()?.slice(0, 40) };
  });
  // copy-link share button behaviour (does it open a tab?)
  let copyLink = null;
  const cl = page.locator('a:has-text("Copy Link")').first();
  if (await cl.count() && await cl.isVisible()) {
    const pagesBefore = ctx.pages().length;
    await cl.scrollIntoViewIfNeeded();
    await cl.click().catch(() => {});
    await sleep(2500);
    let clip = null; try { clip = await page.evaluate(() => navigator.clipboard.readText()); } catch (e) { clip = 'ERR'; }
    const pagesAfter = ctx.pages();
    copyLink = { newTabs: pagesAfter.length - pagesBefore, newTabUrl: pagesAfter.length > pagesBefore ? pagesAfter[pagesAfter.length - 1].url() : null, clipboard: clip?.slice(0, 120), url: page.url() };
    for (const p of pagesAfter.slice(pagesBefore)) await p.close();
  }
  await page.screenshot({ path: `${SHOTS}/d_post_full.png`, fullPage: true });
  return { ...info, bobBox, copyLink };
});

// 12. Upcoming events
await step('upcoming', '/upcoming-events/', async (page) => {
  await page.screenshot({ path: `${SHOTS}/d_upcoming_events.png`, fullPage: true });
  return await page.evaluate(() => {
    const c = document.querySelector('.elementor[data-elementor-type=wp-page], .post-entry, .inner-post-entry, #main');
    return { title: document.title, contentHTMLlen: c ? c.innerHTML.length : null, contentText: c ? c.innerText.slice(0, 300) : null, contentSnippet: c ? c.innerHTML.replace(/\s+/g, ' ').slice(0, 600) : null, h1: [...document.querySelectorAll('h1')].map((h) => h.innerText), bodyTextLen: document.body.innerText.length, docH: document.documentElement.scrollHeight };
  });
});

// 13. 404 page
await step('notFound', '/this-does-not-exist/', async (page) => {
  await page.screenshot({ path: `${SHOTS}/d_404.png`, fullPage: true });
  return await page.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
    const box = document.querySelector('.error-404, .penci-error-page, .not-found, #main') || document.body;
    return { title: document.title, text: box.innerText.slice(0, 400), searchForms: [...document.querySelectorAll('form[role=search], form.pc-searchform, input[name=s], input.gsc-input')].map((e) => ({ tag: e.tagName, vis: vis(e) })), links: [...box.querySelectorAll('a')].filter(vis).map((a) => ({ t: a.innerText.trim(), h: a.getAttribute('href') })), docH: document.documentElement.scrollHeight };
  });
});

// 14. What-to-write hub: truereach overlay / interstitial check
await step('whatToWrite', '/what-to-write-in-a-card/', async (page) => {
  await sleep(4000);
  const tr = await page.evaluate(() => {
    return [...document.querySelectorAll('[id^="TR-"], [id*="truereach" i], iframe')].map((e) => {
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      return { id: e.id.slice(0, 50), tag: e.tagName, pos: cs.position, z: cs.zIndex, pe: cs.pointerEvents, vis: cs.visibility, disp: cs.display, op: cs.opacity, rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], src: (e.src || '').slice(0, 80), childCount: e.children.length, text: (e.innerText || '').slice(0, 80) };
    }).filter((x) => x.rect[2] > 0 || x.pos === 'fixed');
  });
  const center = await page.evaluate(() => { const e = document.elementFromPoint(683, 450); return e ? (e.tagName + '#' + e.id + '.' + (e.className || '').toString().slice(0, 60)) : null; });
  await page.screenshot({ path: `${SHOTS}/d_what_to_write_8s.png` });
  await page.evaluate(() => window.scrollTo(0, 2000));
  await sleep(3000);
  const center2 = await page.evaluate(() => { const e = document.elementFromPoint(683, 450); return e ? (e.tagName + '#' + e.id + '.' + (e.className || '').toString().slice(0, 60)) : null; });
  await page.screenshot({ path: `${SHOTS}/d_what_to_write_scrolled.png` });
  const links = await page.evaluate(() => [...document.querySelectorAll('.elementor[data-elementor-type=wp-page] a')].map((a) => a.getAttribute('href')));
  return { tr, center, center2, hashLinks: links.filter((h) => h === '#' || !h).length, linkCount: links.length };
});

R.assetStats = assetStats; R.loads = loadCount();
save('d4_desktop', R);
console.log(JSON.stringify(R, null, 1).slice(0, 60000));
await browser.close();
