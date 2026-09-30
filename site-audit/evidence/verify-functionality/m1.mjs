// Mobile checks: cookie banner, GA-before-consent, header sticky CLS, copy buttons, jump menus.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { newCtx, openClean, sleep, cls, SHOTS, OUT, assetStats, loadCount } from './lib.mjs';

const res = {};
const browser = await chromium.launch({ channel: 'chromium' });

function gaWatch(page, arr) {
  const t0 = Date.now();
  page.on('request', (r) => {
    const u = r.url();
    if (/google-analytics\.com\/g\/collect|analytics\.google\.com\/g\/collect|\/g\/collect\?/.test(u)) arr.push({ t: Date.now() - t0, u: u.slice(0, 160) });
  });
}

// ---------- context 1: message page, fresh visitor ----------
{
  const ctx = await newCtx(browser, 'mobile');
  const ga = [];
  const page0 = await ctx.newPage(); // placeholder so we can attach before goto
  await page0.close();
  ctx.on('page', (p) => gaWatch(p, ga));
  const { page, log } = await openClean(ctx, '/birthday-messages-for-mom/', { wait: 7000 });
  const r = { log: { status: log.status, n429: log.n429, pageErrors: log.pageErrors, console: log.console.slice(0, 15), http: log.http.slice(0, 20) } };
  r.gaBeforeConsent = ga.slice();
  r.clsAtLoad = await cls(page);
  r.banner = await page.evaluate(() => {
    const w = document.querySelector('.cc-window');
    if (!w) return null;
    const b = w.getBoundingClientRect();
    const cs = getComputedStyle(w);
    return { rect: [b.x, b.y, b.width, b.height].map(Math.round), pos: cs.position, z: cs.zIndex, vis: cs.visibility, disp: cs.display, text: w.innerText.slice(0, 300), buttons: [...w.querySelectorAll('a,button,span[role=button],[tabindex]')].map((e) => ({ tag: e.tagName, cls: e.className, text: e.innerText.trim().slice(0, 30), aria: e.getAttribute('aria-label') })) };
  });
  r.cookiesBefore = (await ctx.cookies()).filter((c) => /cookieconsent/.test(c.name)).map((c) => ({ name: c.name, value: c.value, expires: c.expires }));
  await page.screenshot({ path: `${SHOTS}/m_mom_banner.png` });
  // copy buttons
  r.copyButtons = await page.evaluate(() => {
    const bs = [...document.querySelectorAll('button.copy-icon-btn')];
    return { total: bs.length, visible: bs.filter((b) => b.offsetParent !== null && b.getBoundingClientRect().width > 0).length, sample: bs.slice(0, 1).map((b) => { const r = b.getBoundingClientRect(); const cs = getComputedStyle(b); return { w: r.width, h: r.height, outline: cs.outlineStyle + ' ' + cs.outlineWidth, aria: b.getAttribute('aria-label'), text: b.innerText, type: b.getAttribute('type') }; }) };
  });
  // header sticky switch measurement
  const snap = async (label) => page.evaluate((label) => {
    const nb = document.querySelector('.penci_navbar_mobile');
    const wrap = nb && nb.parentElement;
    const h1s = [...document.querySelectorAll('h1')].filter((h) => h.getBoundingClientRect().height > 0);
    const h1 = h1s[0];
    return { label, scrollY: Math.round(scrollY), nbPos: nb && getComputedStyle(nb).position, nbClass: nb && nb.className, nbH: nb && Math.round(nb.getBoundingClientRect().height), wrapCls: wrap && wrap.className, wrapH: wrap && Math.round(wrap.getBoundingClientRect().height), h1ViewportTop: h1 && Math.round(h1.getBoundingClientRect().top), h1DocTop: h1 && Math.round(h1.getBoundingClientRect().top + scrollY), cls: +(window.__cls.value.toFixed(4)), nShifts: window.__cls.entries.length };
  }, label);
  r.scroll = [];
  r.scroll.push(await snap('start'));
  for (const y of [40, 60, 70, 80, 120, 0, 80, 0, 80]) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await sleep(700);
    r.scroll.push(await snap('to ' + y));
  }
  r.clsAfterScroll = await cls(page);
  // copy button click + clipboard (mobile context: grant permission)
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'https://blog.123greetings.com' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  // close the banner with x
  r.closeX = await page.evaluate(() => {
    const w = document.querySelector('.cc-window');
    if (!w) return 'no banner';
    const cands = [...w.querySelectorAll('*')].filter((e) => e.children.length === 0 && e.textContent.trim().toLowerCase() === 'x');
    const el = cands[0] ? (cands[0].closest('a,button,[role=button],span') || cands[0]) : null;
    if (!el) return 'no x found';
    const info = { tag: el.tagName, cls: el.className, role: el.getAttribute('role'), tabindex: el.getAttribute('tabindex'), aria: el.getAttribute('aria-label') };
    el.click();
    return info;
  });
  await sleep(1200);
  r.cookiesAfterX = (await ctx.cookies()).filter((c) => /cookieconsent/.test(c.name)).map((c) => ({ name: c.name, value: c.value, expires: new Date(c.expires * 1000).toISOString() }));
  r.bannerAfterX = await page.evaluate(() => { const w = document.querySelector('.cc-window'); return w ? getComputedStyle(w).display + '/' + getComputedStyle(w).visibility + '/' + w.className : null; });
  // tap first visible copy button
  const btn = page.locator('button.copy-icon-btn:visible').first();
  await btn.scrollIntoViewIfNeeded();
  await btn.tap();
  await sleep(400);
  r.clip = await page.evaluate(async () => { try { return await navigator.clipboard.readText(); } catch (e) { return 'ERR ' + e.message; } });
  r.clipFirstCharCode = r.clip ? r.clip.charCodeAt(0).toString(16) : null;
  r.clipLastCharCode = r.clip ? r.clip.charCodeAt(r.clip.length - 1).toString(16) : null;
  r.btnAfterTap = await btn.innerText().catch(() => null);
  res.mom = r;
  await page.close();

  // ---------- jump menus (banner already dismissed in this context) ----------
  for (const [path, item] of [['/fathers-day-messages/', 'Funny'], ['/birthday-messages/', 'Milestone']]) {
    const { page: p2, log: l2 } = await openClean(ctx, path, { wait: 5000 });
    const j = { status: l2.status, n429: l2.n429 };
    j.menu = await p2.evaluate(() => {
      const links = [...document.querySelectorAll('a[href^="#"]')].filter((a) => a.getAttribute('href').length > 1 && a.getBoundingClientRect().height > 0 && getComputedStyle(a).visibility !== 'hidden');
      if (!links.length) return null;
      // container = nearest common ancestor of first and last
      let c = links[0].parentElement;
      while (c && !c.contains(links[links.length - 1])) c = c.parentElement;
      const cr = c.getBoundingClientRect();
      const h1 = [...document.querySelectorAll('h1')].find((h) => h.getBoundingClientRect().height > 0);
      const firstMsg = [...document.querySelectorAll('.msgs .elementor-text-editor, .msgs .penci-block_content')].find((e) => e.getBoundingClientRect().height > 0 && e.innerText.trim().length > 5);
      const ids = links.map((a) => a.getAttribute('href').slice(1));
      return {
        n: links.length,
        heights: links.map((a) => Math.round(a.getBoundingClientRect().height)),
        texts: links.map((a) => a.innerText.trim().slice(0, 25)),
        missingTargets: ids.filter((id) => !document.getElementById(decodeURIComponent(id))),
        containerTop: Math.round(cr.top + scrollY), containerH: Math.round(cr.height), containerPos: getComputedStyle(c).position,
        h1Top: h1 ? Math.round(h1.getBoundingClientRect().top + scrollY) : null,
        firstMsgTop: firstMsg ? Math.round(firstMsg.getBoundingClientRect().top + scrollY) : null,
        scrollPaddingTop: getComputedStyle(document.documentElement).scrollPaddingTop,
      };
    });
    await p2.screenshot({ path: `${SHOTS}/m_${path.replace(/\//g, '')}_top.png` });
    const link = p2.locator('a[href^="#"]:visible', { hasText: item }).first();
    j.clickedText = await link.innerText().catch(() => null);
    const href = await link.getAttribute('href').catch(() => null);
    j.href = href;
    await link.tap();
    await sleep(1800);
    j.after = await p2.evaluate((href) => {
      const t = document.getElementById(decodeURIComponent(href.slice(1)));
      const nb = document.querySelector('.penci_navbar_mobile');
      const nbr = nb.getBoundingClientRect();
      const tr = t ? t.getBoundingClientRect() : null;
      const heading = t ? t.querySelector('h2,h3,h4,.elementor-heading-title') : null;
      const hr = heading ? heading.getBoundingClientRect() : null;
      return { hash: location.hash, scrollY: Math.round(scrollY), targetTop: tr && Math.round(tr.top), headingText: heading && heading.innerText.slice(0, 40), headingTop: hr && Math.round(hr.top), headingBottom: hr && Math.round(hr.bottom), navbarPos: getComputedStyle(nb).position, navbarTop: Math.round(nbr.top), navbarBottom: Math.round(nbr.bottom) };
    }, href);
    await p2.screenshot({ path: `${SHOTS}/m_${path.replace(/\//g, '')}_after_jump.png` });
    res[path] = j;
    await p2.close();
    await sleep(3000);
  }
  await ctx.close();
}

// ---------- context 2: homepage, fresh visitor: banner vs search & back-to-top, then Accept ----------
{
  const ctx = await newCtx(browser, 'mobile');
  const ga = [];
  ctx.on('page', (p) => gaWatch(p, ga));
  const { page, log } = await openClean(ctx, '/', { wait: 8000 });
  const h = { status: log.status, n429: log.n429, pageErrors: log.pageErrors };
  h.gaBeforeConsent = ga.slice();
  h.banner = await page.evaluate(() => { const w = document.querySelector('.cc-window'); if (!w) return null; const b = w.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map(Math.round); });
  h.search = await page.evaluate(() => { const i = document.querySelector('input.gsc-input, .gsc-control-cse, .gcse-search'); if (!i) return null; const b = i.getBoundingClientRect(); return { sel: i.className, top: Math.round(b.top), docTop: Math.round(b.top + scrollY), h: Math.round(b.height), placeholder: i.placeholder || null }; });
  await page.screenshot({ path: `${SHOTS}/m_home_banner.png` });
  await page.evaluate(() => window.scrollTo(0, 1500));
  await sleep(1500);
  h.btt = await page.evaluate(() => {
    const b = document.querySelector('.penci-go-to-top-floating');
    const r = b.getBoundingClientRect();
    const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
    const top = document.elementFromPoint(cx, cy);
    return { rect: [r.x, r.y, r.width, r.height].map(Math.round), cs: getComputedStyle(b).display + '/' + getComputedStyle(b).opacity + '/' + getComputedStyle(b).visibility, z: getComputedStyle(b).zIndex, topElAtCenter: top ? top.tagName + '.' + String(top.className).slice(0, 60) : null, bannerCovers: !!(top && top.closest('.cc-window')) };
  });
  await page.screenshot({ path: `${SHOTS}/m_home_scrolled_1500.png` });
  if (h.btt && h.btt.rect[2] > 0) {
    const [x, y, w, hh] = h.btt.rect;
    await page.touchscreen.tap(x + w / 2, y + hh / 2);
    await sleep(2000);
    h.scrollAfterBttTap = await page.evaluate(() => Math.round(scrollY));
  }
  // Accept
  h.accept = await page.evaluate(() => { const b = document.querySelector('.cc-window .cc-dismiss, .cc-window .cc-btn'); if (!b) return null; const t = b.innerText; b.click(); return t + ' / ' + b.className; });
  await sleep(1200);
  h.cookiesAfterAccept = (await ctx.cookies()).filter((c) => /cookieconsent/.test(c.name)).map((c) => ({ name: c.name, value: c.value, expires: new Date(c.expires * 1000).toISOString() }));
  h.gaAfterAcceptTotal = ga.length;
  await page.close();
  await sleep(2500);
  const { page: p3 } = await openClean(ctx, '/about-us/', { wait: 3000 });
  h.bannerOnNextPage = await p3.evaluate(() => { const w = document.querySelector('.cc-window'); return w ? { disp: getComputedStyle(w).display, cls: w.className } : null; });
  // revoke button?
  h.revoke = await p3.evaluate(() => !!document.querySelector('.cc-revoke'));
  res.home = h;
  await ctx.close();
}

res.assetStats = assetStats;
res.loads = loadCount();
fs.writeFileSync(`${OUT}/m1.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1).slice(0, 12000));
await browser.close();
