// Verification pass 1 (desktop 1366x900). Never submits forms. ~10 page loads, 7 s pauses.
// Run: cd /home/user/Message_Board/site-audit && node agent-work/a11y-verify/v1_desktop.mjs [section...]
import fs from 'node:fs';
import { launch, newCtx, open, runAxe, axTree, save, sleep, loadCount, assetStats, SHOTS, OUT } from './vlib.mjs';

const only = process.argv.slice(2);
const want = (s) => only.length === 0 || only.includes(s);
const PAUSE = 7000;

// Describe the focused element; screenshot its box focused and after blur() so pixels can be diffed.
async function probeFocus(page, tag) {
  const d = await page.evaluate(() => {
    const e = document.activeElement;
    if (!e || e === document.body) return { el: 'body' };
    const r = e.getBoundingClientRect(); const s = getComputedStyle(e);
    const vis = r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
    const cc = document.querySelector('.cc-window'); const hdr = document.querySelector('.penci_header.penci_builder_sticky_header_desktop');
    return { el: window.__sel(e), name: (e.getAttribute('aria-label') || e.innerText || e.getAttribute('title') || e.querySelector('img')?.alt || '').trim().replace(/\s+/g, ' ').slice(0, 45),
      rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], inVP: vis,
      fv: e.matches(':focus-visible'), outline: `${s.outlineStyle} ${s.outlineWidth}`, shadow: s.boxShadow, color: s.color, td: s.textDecorationLine,
      ccOverlap: cc && getComputedStyle(cc).display !== 'none' && getComputedStyle(cc).opacity !== '0' ? window.__overlap(e, cc) : null,
      hdrOverlap: hdr ? window.__overlap(e, hdr) : null };
  });
  if (d.inVP) {
    const [x, y, w, h] = d.rect;
    const clip = { x: Math.max(0, x - 6), y: Math.max(0, y - 6), width: Math.max(4, Math.min(w + 12, 1366 - Math.max(0, x - 6))), height: Math.max(4, Math.min(h + 12, 900 - Math.max(0, y - 6))) };
    await page.screenshot({ path: `${SHOTS}/${tag}_f.png`, clip });
    await page.evaluate(() => { window.__last = document.activeElement; document.activeElement.blur(); });
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${SHOTS}/${tag}_u.png`, clip });
    await page.evaluate(() => window.__last.focus());
    await page.waitForTimeout(150);
    d.shot = tag;
  }
  return d;
}

async function tabWalk(page, n, prefix) {
  await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
  await page.waitForTimeout(300);
  const out = [];
  for (let i = 1; i <= n; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(450);
    out.push({ i, ...(await probeFocus(page, `${prefix}_t${String(i).padStart(2, '0')}`)) });
  }
  return out;
}

const landmarks = (page) => page.evaluate(() => ({
  main: document.querySelectorAll('main,[role=main]').length, header: document.querySelectorAll('header,[role=banner]').length,
  footer: document.querySelectorAll('footer,[role=contentinfo]').length, navs: [...document.querySelectorAll('nav,[role=navigation]')].map((n) => window.__sel(n) + '|' + (n.getAttribute('aria-label') || '')),
  skip: [...document.querySelectorAll('a[href^="#"]')].filter((a) => /skip|content|main/i.test(a.textContent + (a.getAttribute('aria-label') || ''))).map((a) => a.outerHTML.slice(0, 120)),
  firstFocusable: (() => { const f = [...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')].filter((e) => e.tabIndex >= 0)[0]; return f ? f.outerHTML.slice(0, 140) : null; })(),
}));

const browser = await launch();
const R = {};

// ---------- H: homepage ----------
if (want('H')) {
  const ctx = await newCtx(browser, 'desktop');
  const { page, log } = await open(ctx, '/', { wait: 6000 });
  const rec = { log };
  rec.landmarks = await landmarks(page);
  rec.offcanvas = await page.evaluate(() => [...document.querySelectorAll('#penci_off_canvas, nav#sidebar-nav, .penci-builder-mobile-sidebar-nav')].map((e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return { el: window.__sel(e), vis: s.visibility, disp: s.display, transform: s.transform, inert: e.inert, ariaHidden: e.getAttribute('aria-hidden'), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], focusables: [...e.querySelectorAll('a[href],button')].filter((x) => x.tabIndex >= 0).length }; }));
  rec.tabs = await tabWalk(page, 14, 'home');
  // category cards: focus each title link and measure colours
  await page.evaluate(() => scrollTo(0, 0));
  const titles = await page.$$('.elementor-widget-icon-box .elementor-icon-box-title a');
  rec.cards = [];
  for (const [k, t] of titles.entries()) {
    await t.focus(); await page.waitForTimeout(700);
    const info = await t.evaluate((a) => { const s = getComputedStyle(a); const w = a.closest('.elementor-widget-icon-box'); const bg = window.__bg(a); const r = w.getBoundingClientRect(); return { text: a.textContent.trim(), color: s.color, bg: bg.bg, bgFrom: bg.from, ratio: window.__ratio(s.color, bg.bg), fontSize: s.fontSize, outline: s.outlineStyle, fv: a.matches(':focus-visible'), box: [r.left, r.top, r.width, r.height] }; });
    await page.screenshot({ path: `${SHOTS}/home_card${k}_${info.text.replace(/\W/g, '')}.png`, clip: { x: Math.max(0, info.box[0] - 4), y: Math.max(0, info.box[1] - 4), width: Math.min(info.box[2] + 8, 1366), height: Math.min(info.box[3] + 8, 900) } }).catch(() => {});
    delete info.box; rec.cards.push(info);
  }
  // hover vs focus background on one card (Anniversary)
  rec.alts = await page.evaluate(() => ({
    logos: [...document.querySelectorAll('img')].filter((i) => /123Greetings Blog/.test(i.alt)).map((i) => { const r = i.getBoundingClientRect(); return { vis: r.width > 0 && getComputedStyle(i).visibility !== 'hidden', x: Math.round(r.left), altLen: i.alt.length }; }),
    badges: [...document.querySelectorAll('figure.elementor-image-box-img a')].map((a) => ({ tabindex: a.getAttribute('tabindex'), alt: a.querySelector('img')?.alt, href: a.getAttribute('href') })),
    h1: (() => { const h = document.querySelector('h1'); return { words: h.textContent.trim().split(/\s+/).length, fontSize: getComputedStyle(h).fontSize, weight: getComputedStyle(h).fontWeight }; })(),
    comingUp: [...document.querySelectorAll('h2')].map((h) => JSON.stringify(h.textContent.trim().slice(0, 30))),
  }));
  const ax = await axTree(page);
  rec.axLandmarks = ax.filter((n) => ['navigation', 'main', 'banner', 'contentinfo', 'search', 'region', 'form', 'complementary'].includes(n.role?.value)).map((n) => `${n.role.value}:${n.name?.value || ''}`);
  rec.axH2 = ax.filter((n) => n.role?.value === 'heading').map((n) => n.name?.value?.slice(0, 40));
  rec.toggle = await page.evaluate(() => { const t = document.querySelector('.read-toggle'); const h = document.querySelector('.hidden-content'); const s = getComputedStyle(h); return { tag: t.tagName, href: t.getAttribute('href'), role: t.getAttribute('role'), exp: t.getAttribute('aria-expanded'), hiddenStyle: `mh=${s.maxHeight} ov=${s.overflow} disp=${s.display} vis=${s.visibility}` }; });
  const axHidden = ax.filter((n) => (n.name?.value || '').includes('Browse through hundreds') || (n.role?.value === 'StaticText' && /Browse through hundreds/.test(n.name?.value || '')));
  rec.collapsedTextInAX = axHidden.length;
  // go-to-top: scroll down, click, see if it scrolls
  await page.evaluate(() => scrollTo(0, 1200)); await page.waitForTimeout(900);
  rec.goTop = await page.evaluate(() => { const g = document.querySelector('.penci-go-to-top-floating'); if (!g) return null; const r = g.getBoundingClientRect(); return { tag: g.tagName, tabIndex: g.tabIndex, role: g.getAttribute('role'), label: g.getAttribute('aria-label'), cls: g.className, rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], y: scrollY }; });
  if (rec.goTop) { await page.mouse.click(rec.goTop.rect[0] + 20, rec.goTop.rect[1] + 20); await page.waitForTimeout(1500); rec.goTop.yAfterClick = await page.evaluate(() => scrollY); }
  rec.axe = await runAxe(page);
  // cookie banner keyboard: Space on Accept, then Enter
  await page.evaluate(() => scrollTo(0, 0));
  rec.cookie = await page.evaluate(() => { const c = document.querySelector('.cc-window'); const r = c.getBoundingClientRect(); return { html: c.outerHTML.slice(0, 900), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], domIdx: [...document.body.querySelectorAll('*')].indexOf(c), domTotal: document.body.querySelectorAll('*').length, closeRect: (() => { const x = c.querySelector('.cc-close').getBoundingClientRect(); return [Math.round(x.left), Math.round(x.top), Math.round(x.width), Math.round(x.height)]; })(), acceptRect: (() => { const x = c.querySelector('.cc-dismiss').getBoundingClientRect(); return [Math.round(x.left), Math.round(x.top), Math.round(x.width), Math.round(x.height)]; })() }; });
  const bannerVis = () => page.evaluate(() => { const c = document.querySelector('.cc-window'); const s = getComputedStyle(c); return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0 && c.getBoundingClientRect().height > 0; });
  await page.focus('.cc-dismiss'); await page.keyboard.press('Space'); await page.waitForTimeout(1500);
  rec.cookie.afterSpace = await bannerVis();
  await page.focus('.cc-dismiss'); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
  rec.cookie.afterEnter = await bannerVis();
  rec.cookie.focusAfter = await page.evaluate(() => window.__sel(document.activeElement));
  R.home = rec; save('v1_home', rec);
  console.log('H', log.status, JSON.stringify(rec.landmarks), JSON.stringify(rec.cards));
  await page.close(); await ctx.close(); await sleep(PAUSE);
}

// ---------- M: message page, copy buttons ----------
if (want('M')) {
  const ctx = await newCtx(browser, 'desktop', { permissions: ['clipboard-read', 'clipboard-write'] });
  const { page, log } = await open(ctx, '/birthday-messages-for-mom/', { wait: 6000 });
  const rec = { log };
  rec.btns = await page.evaluate(() => { const b = [...document.querySelectorAll('button.copy-icon-btn')]; const vis = b.filter((x) => x.getBoundingClientRect().width > 0); const f = vis[0]; const r = f.getBoundingClientRect(); const tip = f.querySelector('.copy-tooltip'); const svg = f.querySelector('svg');
    return { total: b.length, visible: vis.length, msgs: document.querySelectorAll('.msgs').length, msgsVisible: [...document.querySelectorAll('.msgs')].filter((m) => m.getBoundingClientRect().height > 0).length, html: f.outerHTML.slice(0, 300), type: f.getAttribute('type'), aria: f.getAttribute('aria-label'), title: f.getAttribute('title'), size: [Math.round(r.width), Math.round(r.height)], tipVis: getComputedStyle(tip).visibility, tipOp: getComputedStyle(tip).opacity, svgHidden: svg?.getAttribute('aria-hidden'), inForm: !!f.closest('form'), live: [...document.querySelectorAll('[aria-live],[role=status],[role=alert]')].map((x) => window.__sel(x)),
      scriptHasBtn: [...document.scripts].some((s) => /copy-icon-btn/.test(s.textContent)) }; });
  const ax = await axTree(page);
  rec.axButtons = ax.filter((n) => n.role?.value === 'button').map((n) => JSON.stringify(n.name?.value ?? null)).slice(0, 12);
  // keyboard focus on first copy button
  const first = page.locator('button.copy-icon-btn:visible').first();
  await first.scrollIntoViewIfNeeded();
  await page.keyboard.press('Tab'); // establish keyboard modality
  await first.focus(); await page.waitForTimeout(600);
  rec.focus = await first.evaluate((b) => { const t = b.querySelector('.copy-tooltip'); const s = getComputedStyle(b); return { fv: b.matches(':focus-visible'), outline: s.outlineStyle, shadow: s.boxShadow, bg: s.backgroundColor, tipVis: getComputedStyle(t).visibility, tipOp: getComputedStyle(t).opacity }; });
  const box = await first.boundingBox();
  await page.screenshot({ path: `${SHOTS}/mom_copy_focused.png`, clip: { x: box.x - 20, y: box.y - 20, width: 200, height: 60 } });
  await page.keyboard.press('Enter'); await page.waitForTimeout(400);
  rec.afterEnter = await first.evaluate((b) => { const t = b.querySelector('.copy-tooltip'); return { tipText: t.textContent, tipVis: getComputedStyle(t).visibility, tipOp: getComputedStyle(t).opacity, liveTexts: [...document.querySelectorAll('[aria-live],[role=status],[role=alert]')].map((x) => x.textContent.trim().slice(0, 60)) }; });
  rec.clipboard = await page.evaluate(() => navigator.clipboard.readText().then((t) => t.slice(0, 80)).catch((e) => 'ERR ' + e));
  await page.screenshot({ path: `${SHOTS}/mom_copy_after_enter.png`, clip: { x: box.x - 20, y: box.y - 40, width: 220, height: 90 } });
  // hover shows tooltip?
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.waitForTimeout(600);
  rec.hover = await first.evaluate((b) => { const t = b.querySelector('.copy-tooltip'); return { tipText: t.textContent, tipVis: getComputedStyle(t).visibility, tipOp: getComputedStyle(t).opacity }; });
  // in-text links (1.4.1)
  rec.inText = await page.evaluate(() => [...document.querySelectorAll('.elementor p a[href], .elementor li a[href]')].filter((a) => a.getBoundingClientRect().width > 0).slice(0, 8).map((a) => { const s = getComputedStyle(a), p = getComputedStyle(a.parentElement); return { text: a.textContent.trim().slice(0, 30), td: s.textDecorationLine, fw: s.fontWeight + '/' + p.fontWeight, c: s.color, pc: p.color, ratio: window.__ratio(s.color, p.color) }; }));
  rec.axe = await runAxe(page);
  R.mom = rec; save('v1_mom', rec);
  console.log('M', log.status, JSON.stringify(rec.btns), JSON.stringify(rec.focus), JSON.stringify(rec.afterEnter));
  await page.close(); await ctx.close(); await sleep(PAUSE);
}

// ---------- P: post ----------
if (want('P')) {
  const ctx = await newCtx(browser, 'desktop');
  const { page, log } = await open(ctx, '/mothers-day-messages-for-wife-what-she-actually-wants/', { wait: 6000 });
  const rec = { log };
  rec.landmarks = await landmarks(page);
  rec.comment = await page.evaluate(() => [...document.querySelectorAll('#commentform input:not([type=hidden]), #commentform textarea')].map((e) => ({ id: e.id, type: e.type, ph: e.placeholder, labels: e.labels?.length || 0, labelText: e.labels?.[0]?.textContent?.trim().slice(0, 40), ac: e.getAttribute('autocomplete'), ariaLabel: e.getAttribute('aria-label'), req: e.required, ariaReq: e.getAttribute('aria-required') })));
  rec.meta = await page.evaluate(() => [...document.querySelectorAll('.prev-post-title > span, .next-post-title > span, time.entry-date, .single-comment-o, .penci-breadcrumb a, .penci-breadcrumb span, .post-box-meta-single span')].filter((e) => e.getBoundingClientRect().width > 0 && e.textContent.trim()).slice(0, 14).map((e) => { const s = getComputedStyle(e); const b = window.__bg(e); return { el: window.__sel(e), text: e.textContent.trim().slice(0, 25), color: s.color, bg: b.bg, ratio: window.__ratio(s.color, b.bg), fs: s.fontSize }; }));
  rec.headings = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => h.getBoundingClientRect().height > 0).map((h) => h.tagName + ' ' + h.textContent.trim().slice(0, 35)));
  rec.inText = await page.evaluate(() => [...document.querySelectorAll('.inner-post-entry p a[href], .inner-post-entry li a[href]')].filter((a) => a.getBoundingClientRect().width > 0).slice(0, 10).map((a) => { const s = getComputedStyle(a), p = getComputedStyle(a.closest('p,li')); return { text: a.textContent.trim().slice(0, 35), td: s.textDecorationLine, fw: s.fontWeight + '/' + p.fontWeight, c: s.color, pc: p.color, ratio: window.__ratio(s.color, p.color), inline: getComputedStyle(a).display, parentText: a.closest('p,li').textContent.trim().length - a.textContent.trim().length }; }));
  rec.tabs = await tabWalk(page, 12, 'post');
  rec.axe = await runAxe(page);
  R.post = rec; save('v1_post', rec);
  console.log('P', log.status, JSON.stringify(rec.comment), JSON.stringify(rec.meta).slice(0, 800));
  await page.close(); await ctx.close(); await sleep(PAUSE);
}

// ---------- T: tag archive + category + author (contrast of meta) ----------
if (want('T')) {
  const ctx = await newCtx(browser, 'desktop');
  for (const p of ['/tag/alps/', '/category/123greetings/', '/author/iblog123greetingsgmail-com/']) {
    const { page, log } = await open(ctx, p, { wait: 5000 });
    const rec = { log };
    rec.meta = await page.evaluate(() => [...document.querySelectorAll('.penci-breadcrumb a, .penci-breadcrumb span, .breadcrumb_last, .otherl-date > time, time.entry-date, .grid-post-box-meta span, .penci-ajax-more-text, span.ajax-more-text, .archive-box span, .author-content, .penci-pagination a, .penci-pagination span')].filter((e) => e.getBoundingClientRect().width > 0 && e.textContent.trim() && e.children.length === 0).slice(0, 14).map((e) => { const s = getComputedStyle(e); const b = window.__bg(e); return { el: window.__sel(e), text: e.textContent.trim().slice(0, 25), color: s.color, bg: b.bg, ratio: window.__ratio(s.color, b.bg), fs: s.fontSize }; }));
    rec.readmore = await page.evaluate(() => { const a = [...document.querySelectorAll('a')].filter((x) => /^read more$/i.test(x.textContent.trim())); return { n: a.length, html: a[0]?.outerHTML.slice(0, 250), prevHeading: a[0]?.closest('article')?.querySelector('h2,h3')?.outerHTML.slice(0, 200), thumb: a[0]?.closest('article')?.querySelector('a.penci-image-holder')?.outerHTML.slice(0, 250) }; });
    rec.h = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => h.getBoundingClientRect().height > 0).map((h) => h.tagName + ' ' + h.textContent.trim().slice(0, 30)).slice(0, 8));
    rec.axe = await runAxe(page);
    R[p] = rec;
    console.log('T', p, log.status, JSON.stringify(rec.axe.violations.map((v) => [v.id, v.count])), JSON.stringify(rec.meta).slice(0, 600));
    await page.close(); await sleep(PAUSE);
  }
  save('v1_archives', { tag: R['/tag/alps/'], cat: R['/category/123greetings/'], author: R['/author/iblog123greetingsgmail-com/'] });
  await ctx.close();
}

// ---------- A: /archive/ Load More ----------
if (want('A')) {
  const ctx = await newCtx(browser, 'desktop');
  const { page, log } = await open(ctx, '/archive/', { wait: 6000 });
  const rec = { log };
  rec.before = await page.evaluate(() => { const a = document.querySelector('a.penci-ajax-more-button'); const t = a.querySelector('.ajax-more-text') || a; const s = getComputedStyle(t); const b = window.__bg(t); return { html: a.outerHTML.slice(0, 300), aria: a.getAttribute('aria-label'), text: a.innerText.trim(), color: s.color, bg: b.bg, ratio: window.__ratio(s.color, b.bg), fs: s.fontSize + '/' + s.fontWeight, posts: document.querySelectorAll('article').length, live: [...document.querySelectorAll('[aria-live],[role=status],[role=alert]')].map((x) => window.__sel(x)) }; });
  const ax = await axTree(page);
  rec.axName = ax.filter((n) => /more posts/i.test(n.name?.value || '')).map((n) => `${n.role?.value}:${n.name?.value}`);
  await page.focus('a.penci-ajax-more-button'); await page.keyboard.press('Enter'); await page.waitForTimeout(6000);
  rec.after = await page.evaluate(() => ({ posts: document.querySelectorAll('article').length, focus: window.__sel(document.activeElement), url: location.href, liveText: [...document.querySelectorAll('[aria-live],[role=status],[role=alert]')].map((x) => window.__sel(x) + ':' + x.textContent.trim().slice(0, 40)) }));
  rec.axe = await runAxe(page);
  R.archive = rec; save('v1_archive', rec);
  console.log('A', log.status, JSON.stringify(rec.before), JSON.stringify(rec.after));
  await page.close(); await ctx.close(); await sleep(PAUSE);
}

// ---------- C: contact ----------
if (want('C')) {
  const ctx = await newCtx(browser, 'desktop');
  const { page, log } = await open(ctx, '/contact-us/', { wait: 6000 });
  const rec = { log };
  rec.fields = await page.evaluate(() => [...document.querySelectorAll('form.wpcf7-form input:not([type=hidden]), form.wpcf7-form textarea')].map((e) => ({ name: e.name, type: e.type, ph: e.placeholder, labels: e.labels?.length || 0, ac: e.getAttribute('autocomplete'), ariaLabel: e.getAttribute('aria-label'), req: e.required, ariaReq: e.getAttribute('aria-required'), vis: e.getBoundingClientRect().width > 0 })));
  rec.form = await page.evaluate(() => { const f = document.querySelector('form.wpcf7-form'); return { aria: f.getAttribute('aria-label'), ver: document.querySelector('link[href*="contact-form-7"],script[src*="contact-form-7"]')?.getAttribute('href') || document.querySelector('script[src*="contact-form-7"]')?.src, novalidate: f.noValidate, reqLegend: /required/i.test(f.textContent) }; });
  rec.img = await page.evaluate(() => [...document.querySelectorAll('.imgtxt img, img[src*="email"]')].map((i) => ({ alt: i.getAttribute('alt'), src: i.src.slice(-50), next: i.parentElement.textContent.trim().slice(0, 60) })));
  rec.landmarks = await landmarks(page);
  rec.axe = await runAxe(page);
  R.contact = rec; save('v1_contact', rec);
  console.log('C', log.status, JSON.stringify(rec.fields), JSON.stringify(rec.img), JSON.stringify(rec.axe.violations.map((v) => [v.id, v.count])));
  await page.close(); await ctx.close(); await sleep(PAUSE);
}

// ---------- E: 404 ----------
if (want('E')) {
  const ctx = await newCtx(browser, 'desktop');
  const { page, log } = await open(ctx, '/this-page-does-not-exist-a11y-verify/', { wait: 5000 });
  const rec = { log };
  rec.landmarks = await landmarks(page);
  rec.h = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,[role=heading]')].map((h) => h.tagName + ' ' + h.textContent.trim().slice(0, 40) + ' vis=' + (h.getBoundingClientRect().height > 0)));
  rec.msg = await page.evaluate(() => [...document.querySelectorAll('.sub-heading-text-404, .error-404 p, .page-404 p, [class*="404"]')].slice(0, 6).map((e) => window.__sel(e) + ' ' + e.textContent.trim().slice(0, 60)));
  rec.search = await page.evaluate(() => [...document.querySelectorAll('input[type=search], input[name=s], input.search-input')].map((i) => ({ name: i.name, labels: i.labels?.length || 0, aria: i.getAttribute('aria-label'), ph: i.placeholder, vis: i.getBoundingClientRect().width > 0 })));
  rec.axe = await runAxe(page);
  rec.tabs = await tabWalk(page, 8, 'e404');
  R.e404 = rec; save('v1_404', rec);
  console.log('E', log.status, JSON.stringify(rec.h), JSON.stringify(rec.search), JSON.stringify(rec.landmarks));
  await page.close(); await ctx.close(); await sleep(PAUSE);
}

// ---------- B: birthday hub: jump links, Shift+Tab under banner/header ----------
if (want('B')) {
  const ctx = await newCtx(browser, 'desktop');
  const { page, log } = await open(ctx, '/birthday-messages/', { wait: 6000 });
  const rec = { log };
  const ax = await axTree(page);
  rec.arrowLinks = ax.filter((n) => n.role?.value === 'link' && /arrow/i.test(n.name?.value || '')).map((n) => n.name.value);
  rec.arrowImgs = await page.evaluate(() => { const i = [...document.querySelectorAll('img[alt="arrow"]')]; return { total: i.length, visible: i.filter((x) => x.getBoundingClientRect().width > 0).length }; });
  // Shift+Tab from last footer link upward
  await page.evaluate(() => { const a = [...document.querySelectorAll('#footer-section-container a')].pop(); a.focus(); });
  await page.waitForTimeout(600);
  const back = [];
  for (let i = 0; i < 16; i++) { await page.keyboard.press('Shift+Tab'); await page.waitForTimeout(500); back.push(await probeFocus(page, `bday_st${String(i).padStart(2, '0')}`)); }
  rec.shiftTab = back.map((b) => ({ name: b.name, rect: b.rect, cc: b.ccOverlap, hdr: b.hdrOverlap }));
  // Forward Tab from the top: where does focus land relative to the sticky header when going up after scrolling down?
  rec.axe = await runAxe(page);
  R.birthday = rec; save('v1_birthday', rec);
  console.log('B', log.status, JSON.stringify(rec.arrowLinks), JSON.stringify(rec.shiftTab.slice(0, 6)));
  await page.close(); await ctx.close(); await sleep(PAUSE);
}

// ---------- N: angel page FAQ accordion ----------
if (want('N')) {
  const ctx = await newCtx(browser, 'desktop');
  const { page, log } = await open(ctx, '/be-an-angel-day-messages/', { wait: 6000 });
  const rec = { log };
  rec.faq = await page.evaluate(() => { const acc = document.querySelector('.e-n-accordion'); if (!acc) return null; const items = [...acc.querySelectorAll('details, .e-n-accordion-item')]; const s = acc.querySelector('summary, .e-n-accordion-item-title'); return { items: items.length, tag: items[0]?.tagName, summaryHtml: s?.outerHTML.slice(0, 400), open: items.filter((d) => d.open).length, regions: [...acc.querySelectorAll('[role=region]')].length }; });
  await page.focus('.e-n-accordion summary, .e-n-accordion-item-title').catch(() => {});
  const before = await page.evaluate(() => [...document.querySelectorAll('.e-n-accordion details')].map((d) => d.open));
  await page.keyboard.press('Enter'); await page.waitForTimeout(800);
  const after = await page.evaluate(() => [...document.querySelectorAll('.e-n-accordion details')].map((d) => d.open));
  rec.enter = { before, after, exp: await page.evaluate(() => document.activeElement.getAttribute('aria-expanded')) };
  rec.axe = await runAxe(page);
  R.angel = rec; save('v1_angel', rec);
  console.log('N', log.status, JSON.stringify(rec.faq), JSON.stringify(rec.enter));
  await page.close(); await ctx.close();
}

await browser.close();
console.log('loads', loadCount(), 'assets', JSON.stringify(assetStats));
