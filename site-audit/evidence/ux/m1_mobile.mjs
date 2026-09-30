// Mobile (390x844, touch) functional checks.
import { launch, newCtx, openClean, cls, save, sleep, SHOTS, assetStats, loadCount } from './lib.mjs';

const browser = await launch();
const ctx = await newCtx(browser, 'mobile', { permissions: ['clipboard-read', 'clipboard-write'] });
const R = {};
const PAUSE = 4000;

const fixedScan = () => {
  const out = [];
  for (const e of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(e);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    const r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) continue;
    const vw = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
    const vh = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
    out.push({ el: (e.tagName.toLowerCase() + (e.id ? '#' + e.id.slice(0, 40) : '') + '.' + (typeof e.className === 'string' ? e.className.trim().split(/\s+/).slice(0, 3).join('.') : '')).slice(0, 110), pos: cs.position, rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], pctViewport: +(100 * vw * vh / (innerWidth * innerHeight)).toFixed(1), z: cs.zIndex });
  }
  return out.filter((x) => x.pctViewport > 0.5);
};

async function step(name, path, fn, opts = {}) {
  await sleep(PAUSE);
  const { page, log } = await openClean(ctx, path, { wait: opts.wait ?? 7000 });
  const rec = { status: log.status, pageErrors: log.pageErrors.map((e) => e.msg), consoleErrors: log.console.filter((c) => c.type === 'error').map((c) => c.text.slice(0, 160)), http: log.http.slice(0, 8), n429: log.n429 };
  try { Object.assign(rec, await fn(page)); } catch (e) { rec.error = String(e).slice(0, 400); }
  rec.cls = await cls(page).catch(() => null);
  R[name] = rec;
  console.error('done', name, rec.status, rec.error ? 'ERR ' + rec.error.slice(0, 120) : '');
  await page.close();
}

// M1. Home: cookie banner, hamburger, search, back-to-top, sticky elements
await step('home', '/', async (page) => {
  const out = {};
  out.fixedOnLoad = await page.evaluate(fixedScan);
  out.banner = await page.evaluate(() => { const w = document.querySelector('.cc-window'); if (!w) return null; const r = w.getBoundingClientRect(); return { rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], pct: +(100 * r.width * Math.min(r.height, innerHeight - r.y) / (innerWidth * innerHeight)).toFixed(1) }; });
  await page.screenshot({ path: `${SHOTS}/m_home_banner.png` });
  // header sticky? scroll down
  await page.evaluate(() => window.scrollTo(0, 1500));
  await sleep(1500);
  out.fixedAfterScroll = await page.evaluate(fixedScan);
  out.backToTop = await page.evaluate(() => { const b = document.querySelector('.penci-go-to-top-floating'); if (!b) return null; const r = b.getBoundingClientRect(); const cs = getComputedStyle(b); return { rect: [Math.round(r.x), Math.round(r.y), r.width, r.height], vis: cs.visibility, op: cs.opacity, disp: cs.display, cls: b.className }; });
  await page.screenshot({ path: `${SHOTS}/m_home_scrolled_1500.png` });
  if (out.backToTop && out.backToTop.rect[1] < 844) {
    await page.locator('.penci-go-to-top-floating').tap().catch(() => {});
    await sleep(1500);
    out.afterBackToTop = await page.evaluate(() => scrollY);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(800);
  // search box on mobile
  out.search = await page.evaluate(() => [...document.querySelectorAll('input.gsc-input, input[name=s], input[type=search]')].map((e) => { const r = e.getBoundingClientRect(); return { cls: e.className, ph: e.placeholder, rect: [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)] }; }));
  // hamburger
  const burger = page.locator('.penci-mobile-hamburger, .navigation-mobile-toggle, a.penci-mobile-hamburger, .pc-builder-element .navigation-mobile-toggle, .button-menu-mobile').filter({ visible: true }).first();
  out.burgerFound = await burger.count();
  if (out.burgerFound) {
    out.burgerA11y = await burger.evaluate((e) => ({ tag: e.tagName, aria: e.getAttribute('aria-label'), expanded: e.getAttribute('aria-expanded'), text: e.innerText.trim(), cls: e.className, rect: (() => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; })() }));
    await burger.tap();
    await sleep(1200);
    out.menuOpen = await page.evaluate(() => {
      const oc = document.querySelector('#penci_off_canvas');
      const r = oc.getBoundingClientRect();
      const links = [...oc.querySelectorAll('a')].map((a) => { const rr = a.getBoundingClientRect(); return { t: a.innerText.trim(), h: a.getAttribute('href'), onScreen: rr.right > 0 && rr.left < innerWidth && rr.width > 0, h_px: Math.round(rr.height) }; });
      const bodyOverflow = getComputedStyle(document.body).overflow + '/' + getComputedStyle(document.documentElement).overflow;
      const socials = [...document.querySelectorAll('.inner-header-social a')].map((a) => { const rr = a.getBoundingClientRect(); return { aria: a.getAttribute('aria-label'), h: a.getAttribute('href'), onScreen: rr.right > 0 && rr.left < innerWidth && rr.width > 0 && getComputedStyle(a).visibility !== 'hidden' }; });
      const legacy = document.querySelector('#sidebar-nav'); const lr = legacy?.getBoundingClientRect();
      return { panel: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], links, bodyOverflow, socials, legacySidebarNav: lr ? [Math.round(lr.x), Math.round(lr.y), Math.round(lr.width), Math.round(lr.height), getComputedStyle(legacy).visibility] : null };
    });
    await page.screenshot({ path: `${SHOTS}/m_menu_open.png` });
    // close with X
    const closeX = page.locator('#penci_off_canvas .close-mobile-menu-builder, a.close-mobile-menu-builder').filter({ visible: true }).first();
    out.closeXcount = await closeX.count();
    if (out.closeXcount) { await closeX.tap().catch((e) => { out.closeErr = String(e).slice(0, 150); }); }
    else { await page.mouse.click(370, 400); }
    await sleep(1200);
    out.menuAfterClose = await page.evaluate(() => { const r = document.querySelector('#penci_off_canvas').getBoundingClientRect(); return { x: Math.round(r.x), onScreen: r.right > 0 && r.left < innerWidth, url: location.href, hash: location.hash, sy: scrollY }; });
    // re-open and tap a link
    await burger.tap();
    await sleep(1000);
    const about = page.locator('#penci_off_canvas a', { hasText: /about us/i }).first();
    await Promise.all([page.waitForURL(/about-us/, { timeout: 20000 }).catch(() => {}), about.tap()]);
    out.navToAbout = page.url();
  }
  // cookie banner: tap the X close (not Accept) and see what happens
  return out;
}, { wait: 8000 });

// the About page (loaded via menu link) is the next page in this context; cookie banner status on it
// M2. Birthday hub on mobile: side nav placement, jump behaviour
await step('birthdayHub', '/birthday-messages/', async (page) => {
  const out = {};
  const banner = page.locator('.cc-window');
  out.bannerStillShown = await banner.isVisible().catch(() => false);
  if (out.bannerStillShown) {
    // test the "x" close instead of Accept
    const x = page.locator('.cc-window .cc-close, .cc-window [aria-label*=close i]').first();
    out.xCount = await x.count();
    if (out.xCount) { await x.tap().catch(() => {}); await sleep(800); }
    out.bannerAfterX = await banner.isVisible().catch(() => false);
    out.cookieAfterX = (await ctx.cookies()).filter((c) => /consent/i.test(c.name)).map((c) => c.name + '=' + c.value);
  }
  out.nav = await page.evaluate(() => {
    const w = [...document.querySelectorAll('.elementor-widget-penci-advanced-list')].find((w) => w.getBoundingClientRect().height > 0);
    if (!w) return { visible: false };
    const r = w.getBoundingClientRect();
    const firstSection = document.getElementById('forHer');
    return { visible: true, top: Math.round(r.top + scrollY), height: Math.round(r.height), items: w.querySelectorAll('a').length, firstSectionTop: firstSection ? Math.round(firstSection.getBoundingClientRect().top + scrollY) : null, pos: getComputedStyle(w.closest('.e-con') || w).position };
  });
  await page.screenshot({ path: `${SHOTS}/m_birthday_hub_top.png` });
  const link = page.locator('.elementor-widget-penci-advanced-list a[href="#byMilestone"]').filter({ visible: true }).first();
  if (await link.count()) {
    await link.tap();
    await sleep(1800);
    out.jump = await page.evaluate(() => {
      const t = document.getElementById('byMilestone').getBoundingClientRect();
      let hb = 0;
      document.querySelectorAll('.penci_header, .penci-header-mobile, #penci-header-mobile, .penci-builder-mobile-header').forEach((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); if ((cs.position === 'fixed' || cs.position === 'sticky') && r.top <= 5 && r.bottom > 0 && r.height < 200 && cs.display !== 'none') hb = Math.max(hb, r.bottom); });
      return { targetTop: Math.round(t.top), headerBottom: Math.round(hb), sy: Math.round(scrollY), hash: location.hash };
    });
    out.fixedAfterJump = await page.evaluate(fixedScan);
    await page.screenshot({ path: `${SHOTS}/m_birthday_hub_after_jump.png` });
  }
  return out;
});

// M3. Father's Day: 16-item nav on mobile
await step('fathersDay', '/fathers-day-messages/', async (page) => {
  const out = {};
  out.nav = await page.evaluate(() => {
    const w = [...document.querySelectorAll('.elementor-widget-penci-advanced-list')].find((w) => w.getBoundingClientRect().height > 0);
    if (!w) return { visible: false };
    const r = w.getBoundingClientRect();
    const first = document.getElementById('fyf');
    const firstMsg = document.querySelector('.msgs p, .msgs .elementor-text-editor');
    const h1 = document.querySelector('h1');
    return { visible: true, top: Math.round(r.top + scrollY), height: Math.round(r.height), items: w.querySelectorAll('a').length, h1Top: h1 ? Math.round(h1.getBoundingClientRect().top + scrollY) : null, firstSectionTop: first ? Math.round(first.getBoundingClientRect().top + scrollY) : null, firstMsgTop: firstMsg ? Math.round(firstMsg.getBoundingClientRect().top + scrollY) : null, smallTargets: [...w.querySelectorAll('a')].filter((a) => a.getBoundingClientRect().height < 24).length, itemH: [...w.querySelectorAll('a')].slice(1, 4).map((a) => Math.round(a.getBoundingClientRect().height)) };
  });
  await page.screenshot({ path: `${SHOTS}/m_fathers_day_top.png` });
  await page.screenshot({ path: `${SHOTS}/m_fathers_day_top2screens.png`, clip: { x: 0, y: 0, width: 390, height: 1688 } }).catch(() => {});
  const link = page.locator('.elementor-widget-penci-advanced-list a[href="#fw"]').filter({ visible: true }).first();
  if (await link.count()) {
    await link.tap();
    await sleep(1800);
    out.jump = await page.evaluate(() => { const t = document.getElementById('fw').getBoundingClientRect(); return { targetTop: Math.round(t.top), sy: Math.round(scrollY), hash: location.hash }; });
    out.fixedAfterJump = await page.evaluate(fixedScan);
    await page.screenshot({ path: `${SHOTS}/m_fathers_day_after_jump.png` });
    // how to get back to the nav? any back-to-top?
    out.backToTop = await page.evaluate(() => { const b = document.querySelector('.penci-go-to-top-floating'); const r = b?.getBoundingClientRect(); return b ? { rect: [Math.round(r.x), Math.round(r.y), r.width, r.height], op: getComputedStyle(b).opacity, vis: getComputedStyle(b).visibility, cls: b.className } : null; });
  }
  return out;
});

// M4. Message page: copy button on touch, ad overlays, CLS
await step('mom', '/birthday-messages-for-mom/', async (page) => {
  const out = {};
  out.h1Visible = await page.evaluate(() => [...document.querySelectorAll('h1')].filter((h) => h.getBoundingClientRect().height > 0).map((h) => h.innerText));
  out.emptyVisible = await page.evaluate(() => [...document.querySelectorAll('p')].filter((p) => /^[“"]\s*[”"]$/.test(p.textContent.trim()) && p.getBoundingClientRect().height > 0).length);
  const btn = page.locator('button.copy-icon-btn').filter({ visible: true }).first();
  out.copyBtnCount = await page.locator('button.copy-icon-btn').filter({ visible: true }).count();
  if (out.copyBtnCount) {
    await btn.scrollIntoViewIfNeeded();
    out.copyBtnSize = await btn.evaluate((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; });
    await btn.tap();
    await sleep(300);
    out.copyFeedback = await btn.evaluate((e) => ({ html: e.innerText, tipVis: getComputedStyle(e.querySelector('.copy-tooltip')).visibility, tipOp: getComputedStyle(e.querySelector('.copy-tooltip')).opacity }));
    try { out.clipboard = (await page.evaluate(() => navigator.clipboard.readText())).slice(0, 160); } catch (e) { out.clipboard = 'ERR ' + String(e).slice(0, 80); }
    await page.screenshot({ path: `${SHOTS}/m_mom_copy_tapped.png` });
  }
  await page.evaluate(() => window.scrollTo(0, 900));
  await sleep(2500);
  out.fixedMid = await page.evaluate(fixedScan);
  await page.screenshot({ path: `${SHOTS}/m_mom_mid.png` });
  out.ecard = await page.evaluate(() => [...document.querySelectorAll('.elementor[data-elementor-type=wp-page] a')].filter((a) => /www\.123greetings\.com/.test(a.href)).map((a) => a.href));
  return out;
});

// M5. Halloween: ad overlays over time (interstitial?), sticky ads
await step('halloween', '/halloween-messages/', async (page) => {
  const out = { samples: [] };
  for (const [t, sy] of [[0, 0], [5000, 1200], [6000, 2600]]) {
    await sleep(t);
    await page.evaluate((y) => window.scrollTo(0, y), sy);
    await sleep(1500);
    out.samples.push({ sy, fixed: await page.evaluate(fixedScan), tr: await page.evaluate(() => { const e = document.querySelector('[id^="TR-"]'); if (!e) return null; const cs = getComputedStyle(e); return { vis: cs.visibility, disp: cs.display, html: e.innerHTML.slice(0, 200) }; }) });
    await page.screenshot({ path: `${SHOTS}/m_halloween_sy${sy}.png` });
  }
  out.ads = await page.evaluate(() => [...document.querySelectorAll('iframe[id^=google_ads], div[id^=div-gpt], ins.adsbygoogle, [id*=gpt]')].map((e) => { const r = e.getBoundingClientRect(); return { id: e.id.slice(0, 60), rect: [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)] }; }).slice(0, 12));
  return out;
}, { wait: 5000 });

// M6. What-to-write: button#button-0 and TR overlay
await step('whatToWrite', '/what-to-write-in-a-card/', async (page) => {
  const out = {};
  out.fixed = await page.evaluate(fixedScan);
  out.btn0 = await page.evaluate(() => { const b = document.getElementById('button-0'); if (!b) return null; const r = b.getBoundingClientRect(); const cs = getComputedStyle(b); let p = b; const chain = []; for (let i = 0; i < 5 && p; i++) { chain.push(p.tagName + '#' + p.id + '.' + (p.className || '').toString().slice(0, 40)); p = p.parentElement; } return { rect: [Math.round(r.x), Math.round(r.y), r.width, r.height], vis: cs.visibility, aria: b.getAttribute('aria-label'), text: b.innerText.slice(0, 40), chain }; });
  await page.screenshot({ path: `${SHOTS}/m_what_to_write.png` });
  await page.evaluate(() => window.scrollTo(0, 1600));
  await sleep(2500);
  out.fixedScrolled = await page.evaluate(fixedScan);
  await page.screenshot({ path: `${SHOTS}/m_what_to_write_scrolled.png` });
  return out;
});

// M7. Post on mobile
await step('post', '/mothers-day-messages-for-wife-what-she-actually-wants/', async (page) => {
  const out = {};
  out.fixed = await page.evaluate(fixedScan);
  out.share = await page.evaluate(() => [...document.querySelectorAll('a')].filter((a) => /whatsapp|Copy Link/i.test(a.innerText + a.href)).map((a) => { const r = a.getBoundingClientRect(); return { t: a.innerText.trim().slice(0, 20), h: (a.getAttribute('href') || '').slice(0, 90), target: a.target, cls: a.className.slice(0, 50), rect: [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)] }; }));
  const cl = page.locator('a:has-text("Copy Link")').filter({ visible: true }).first();
  if (await cl.count()) {
    await cl.scrollIntoViewIfNeeded();
    const before = ctx.pages().length;
    await cl.tap().catch(() => {});
    await sleep(2500);
    let clip = null; try { clip = await page.evaluate(() => navigator.clipboard.readText()); } catch (e) { clip = 'ERR'; }
    const after = ctx.pages();
    out.copyLink = { newTabs: after.length - before, newTabUrl: after.length > before ? after[after.length - 1].url() : null, clipboard: clip?.slice(0, 120), sameUrl: page.url(), feedback: await page.evaluate(() => [...document.querySelectorAll('.penci-copied, .copied, .penci-copy-link-mess, [class*=copied]')].map((e) => e.className + ':' + e.innerText).slice(0, 3)) };
    for (const p of after.slice(before)) await p.close();
    await page.screenshot({ path: `${SHOTS}/m_post_after_copylink.png` });
  }
  const rel = page.locator('.post-related').first();
  if (await rel.count()) { await rel.scrollIntoViewIfNeeded(); await sleep(1000); await rel.screenshot({ path: `${SHOTS}/m_post_related.png` }).catch(() => {}); }
  const form = page.locator('#respond').first();
  if (await form.count()) { await form.scrollIntoViewIfNeeded(); await sleep(800); await form.screenshot({ path: `${SHOTS}/m_post_comment_form.png` }).catch(() => {}); }
  out.relatedTitles = await page.evaluate(() => [...document.querySelectorAll('.post-related .related-content a, .post-related h3 a')].map((a) => a.innerText.trim()).filter(Boolean));
  return out;
});

// M8. Contact on mobile
await step('contact', '/contact-us/', async (page) => {
  const out = {};
  out.fixed = await page.evaluate(fixedScan);
  const submit = page.locator('form.wpcf7-form input[type=submit]').first();
  await submit.scrollIntoViewIfNeeded();
  await sleep(800);
  out.submitRect = await submit.evaluate((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; });
  out.fixedAtSubmit = await page.evaluate(fixedScan);
  out.recaptchaNotice = await page.evaluate(() => /protected by reCAPTCHA|Google Privacy Policy/i.test(document.body.innerText));
  out.labels = await page.evaluate(() => [...document.querySelectorAll('form.wpcf7-form label')].map((l) => l.innerText.trim().slice(0, 40)));
  await page.screenshot({ path: `${SHOTS}/m_contact_form.png` });
  return out;
});

// M9. 404 and M10. upcoming events on mobile
await step('notFound', '/this-does-not-exist/', async (page) => {
  await page.screenshot({ path: `${SHOTS}/m_404.png` });
  return { searchVisible: await page.locator('input[name=s]').filter({ visible: true }).count() };
});
await step('upcoming', '/upcoming-events/', async (page) => {
  await page.screenshot({ path: `${SHOTS}/m_upcoming_events.png` });
  return { text: await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 400)) };
});

R.assetStats = assetStats; R.loads = loadCount();
save('m1_mobile', R);
console.log(JSON.stringify(R, null, 1).slice(0, 80000));
await browser.close();
