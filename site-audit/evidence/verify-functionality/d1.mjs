// Desktop checks: keyboard focus order/styles, header hover, Google CSE results, zero-results page,
// desktop jump menu, reCAPTCHA badge, copy button focus tooltip, cookie-lib failure, mobile back-to-top tap.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { newCtx, openClean, sleep, SHOTS, OUT, assetStats, loadCount } from './lib.mjs';

const res = {};
const browser = await chromium.launch({ channel: 'chromium' });

const focusInfo = () => {
  const e = document.activeElement;
  if (!e || e === document.body) return { tag: 'BODY' };
  const r = e.getBoundingClientRect();
  const cs = getComputedStyle(e);
  return {
    tag: e.tagName, text: (e.innerText || e.value || e.getAttribute('aria-label') || e.getAttribute('href') || '').trim().slice(0, 40),
    inOffcanvas: !!e.closest('#penci_off_canvas'), inSidebarNav: !!e.closest('#sidebar-nav'),
    rect: [r.x, r.y, r.width, r.height].map(Math.round),
    outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, boxShadow: cs.boxShadow,
  };
};

// ---------- desktop homepage ----------
{
  const ctx = await newCtx(browser, 'desktop');
  const { page, log } = await openClean(ctx, '/', { wait: 8000 });
  const h = { status: log.status, n429: log.n429, pageErrors: log.pageErrors };
  h.banner = await page.evaluate(() => { const w = document.querySelector('.cc-window'); if (!w) return null; const b = w.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map(Math.round); });
  // dismiss banner so it does not interfere
  await page.evaluate(() => document.querySelector('.cc-window .cc-dismiss')?.click());
  await sleep(800);
  // header hover: any submenu appears?
  h.menu = [];
  const items = await page.locator('.penci-header-builder.main-builder-header nav li > a').all();
  for (const a of items.slice(0, 6)) {
    const txt = (await a.innerText()).trim();
    await a.hover();
    await sleep(700);
    const sub = await page.evaluate(() => [...document.querySelectorAll('.sub-menu, .penci-megamenu, .penci-dropdown-menu, ul.children')].filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.height > 5 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0; }).length);
    h.menu.push({ txt, visibleSubmenus: sub, liClass: await a.evaluate((x) => x.parentElement.className) });
  }
  // keyboard
  await page.mouse.move(5, 5);
  await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement && document.activeElement.blur(); });
  await page.keyboard.press('Tab'); // focus first
  h.tabs = [];
  for (let i = 0; i < 18; i++) {
    h.tabs.push(await page.evaluate(focusInfo));
    if (i === 2) await page.screenshot({ path: `${SHOTS}/d_home_focus_tab3.png`, clip: { x: 0, y: 0, width: 1366, height: 200 } });
    await page.keyboard.press('Tab');
    await sleep(150);
  }
  h.skipLink = await page.evaluate(() => !!document.querySelector('a[href="#main"], a[href="#content"], .skip-link'));
  // Google CSE search
  try {
    await page.evaluate(() => window.scrollTo(0, 0));
    const inp = page.locator('input.gsc-input').first();
    await inp.scrollIntoViewIfNeeded();
    h.csePlaceholder = await inp.getAttribute('placeholder');
    await inp.click();
    await inp.fill('birthday mom');
    await inp.press('Enter');
    await sleep(5000);
    h.cse = await page.evaluate(() => {
      const results = [...document.querySelectorAll('.gsc-webResult.gsc-result')].filter((r) => r.innerText.trim());
      return {
        n: results.length,
        links: results.map((r) => { const a = r.querySelector('a.gs-title'); return a ? a.href.slice(0, 100) : null; }),
        structuredData: [...document.querySelectorAll('.gsc-results a, .gsc-results div, .gsc-results span')].filter((e) => e.children.length === 0 && /Structured data/i.test(e.textContent)).length,
        overlay: !!document.querySelector('.gsc-results-wrapper-overlay.gsc-results-wrapper-visible'),
        resultText: results.slice(0, 2).map((r) => r.innerText.slice(0, 200)),
      };
    });
    await page.screenshot({ path: `${SHOTS}/d_home_cse_results.png` });
  } catch (e) { h.cseErr = String(e).slice(0, 200); }
  res.home = h;
  await page.close();
  await sleep(2500);

  // ---------- zero-results search page ----------
  {
    const { page: p, log: l } = await openClean(ctx, '/?s=zzqx', { wait: 3000 });
    res.zzqx = await p.evaluate(() => {
      const h1 = document.querySelector('h1');
      return { h1Rendered: h1 && h1.innerText, h1Transform: h1 && getComputedStyle(h1).textTransform, searchInputs: document.querySelectorAll('input[name=s], input.gsc-input').length, bodyMain: (document.querySelector('.penci-wrap-content, #main, .container') || document.body).innerText.slice(0, 400) };
    });
    res.zzqx.status = l.status;
    await p.screenshot({ path: `${SHOTS}/d_search_empty.png` });
    await p.close();
    await sleep(2500);
  }

  // ---------- desktop jump menu ----------
  {
    const { page: p, log: l } = await openClean(ctx, '/birthday-messages/', { wait: 4000 });
    const link = p.locator('a[href^="#"]:visible', { hasText: 'Milestone' }).first();
    const href = await link.getAttribute('href');
    await link.click();
    await sleep(1800);
    res.deskJump = await p.evaluate((href) => {
      const t = document.getElementById(href.slice(1));
      const hd = document.querySelector('.penci-header-builder.penci_builder_sticky_header_desktop');
      const hr = hd ? hd.getBoundingClientRect() : null;
      const menuLink = document.querySelector(`a[href="${href}"]`);
      return { hash: location.hash, targetTop: Math.round(t.getBoundingClientRect().top), stickyHeader: hr && [Math.round(hr.top), Math.round(hr.bottom)], menuStillVisible: menuLink ? (() => { const r = menuLink.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })() : null };
    }, href);
    res.deskJump.status = l.status;
    await p.close();
    await sleep(2500);
  }

  // ---------- message page: copy button focus / tooltip, sizes ----------
  {
    const { page: p } = await openClean(ctx, '/birthday-messages-for-mom/', { wait: 4000 });
    res.copy = await p.evaluate(() => {
      const b = [...document.querySelectorAll('button.copy-icon-btn')].find((x) => x.getBoundingClientRect().width > 0);
      const r = b.getBoundingClientRect();
      b.focus();
      const tip = b.querySelector('.copy-tooltip');
      const cs = getComputedStyle(b);
      return { w: Math.round(r.width), h: Math.round(r.height), outline: cs.outlineStyle, tooltipVisOnFocus: tip ? getComputedStyle(tip).visibility + '/' + getComputedStyle(tip).opacity : null, ariaLabel: b.getAttribute('aria-label') };
    });
    // breadcrumbs / related
    res.momStructure = await p.evaluate(() => ({
      breadcrumbs: !!document.querySelector('.penci-breadcrumb, .breadcrumbs, #breadcrumbs, nav[aria-label*=readcrumb], .yoast-breadcrumbs'),
      bcSchema: [...document.querySelectorAll('script[type="application/ld+json"]')].some((s) => s.textContent.includes('BreadcrumbList')),
      shareButtons: document.querySelectorAll('.penci-social-buttons a, .post-share a, .penci-post-share a').length,
    }));
    await p.close();
    await sleep(2500);
  }

  // ---------- contact page: reCAPTCHA badge ----------
  {
    const { page: p } = await openClean(ctx, '/contact-us/', { wait: 7000 });
    res.recaptcha = await p.evaluate(() => {
      const b = document.querySelector('.grecaptcha-badge');
      if (!b) return { badge: false };
      const cs = getComputedStyle(b);
      const r = b.getBoundingClientRect();
      const rules = [];
      for (const ss of document.styleSheets) {
        let cr; try { cr = ss.cssRules; } catch (e) { continue; }
        for (const rule of cr || []) if (rule.selectorText && rule.selectorText.includes('grecaptcha')) rules.push({ href: ss.href || 'inline:' + (ss.ownerNode && ss.ownerNode.id), rule: rule.cssText.slice(0, 160) });
      }
      const txt = document.body.innerText;
      return { badge: true, vis: cs.visibility, display: cs.display, opacity: cs.opacity, rect: [r.x, r.y, r.width, r.height].map(Math.round), inlineStyle: (b.getAttribute('style') || '').slice(0, 200), rules, noticeText: /protected by reCAPTCHA/i.test(txt) };
    });
    await p.close();
    await sleep(2500);
  }
  await ctx.close();
}

// ---------- cookie library failure reproduction ----------
{
  const ctx = await newCtx(browser, 'desktop', {}, { failRe: /cookieNSCconsent\.min\.js/ });
  const { page, log } = await openClean(ctx, '/', { wait: 6000 });
  res.cookieFail = { pageErrors: log.pageErrors.map((e) => e.msg), banner: await page.evaluate(() => !!document.querySelector('.cc-window')), cc: await page.evaluate(() => typeof window.cookieconsent) };
  await page.close();
  await ctx.close();
  await sleep(2500);
}

// ---------- mobile: what does tapping back-to-top hit while banner is up? ----------
{
  const ctx = await newCtx(browser, 'mobile');
  const { page } = await openClean(ctx, '/', { wait: 6000 });
  await page.evaluate(() => window.scrollTo(0, 1500));
  await sleep(1500);
  const r = await page.evaluate(() => { const b = document.querySelector('.penci-go-to-top-floating'); const x = b.getBoundingClientRect(); return [x.x + x.width / 2, x.y + x.height / 2]; });
  const before = (await ctx.cookies()).filter((c) => c.name === 'cookieconsent_status').map((c) => c.value);
  await page.touchscreen.tap(r[0], r[1]);
  await sleep(2000);
  res.bttTap = {
    center: r.map(Math.round), cookieBefore: before,
    cookieAfter: (await ctx.cookies()).filter((c) => c.name === 'cookieconsent_status').map((c) => c.value),
    scrollY: await page.evaluate(() => Math.round(scrollY)),
    bannerVisible: await page.evaluate(() => { const w = document.querySelector('.cc-window'); return w ? getComputedStyle(w).display !== 'none' && !w.classList.contains('cc-invisible') : false; }),
  };
  // second tap now that banner is gone
  await page.touchscreen.tap(r[0], r[1]);
  await sleep(2000);
  res.bttTap.scrollYAfterSecondTap = await page.evaluate(() => Math.round(scrollY));
  await page.close();
  await ctx.close();
}

res.assetStats = assetStats;
res.loads = loadCount();
fs.writeFileSync(`${OUT}/d1.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1).slice(0, 15000));
await browser.close();
