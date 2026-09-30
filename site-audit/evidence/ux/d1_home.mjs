// Desktop: homepage clean load, JS errors, cookie banner, header nav hover/keyboard, search box.
import { launch, newCtx, open, cls, save, sleep, SHOTS, loadCount } from './lib.mjs';

const browser = await launch();
const ctx = await newCtx(browser, 'desktop');
const R = {};

// ---- 1. clean homepage load, slow wait
{
  const { page, log } = await open(ctx, '/', { wait: 9000 });
  R.home = { log };
  R.home.cookieconsentDefined = await page.evaluate(() => typeof window.cookieconsent);
  R.home.cookieScriptTag = await page.evaluate(() => {
    const s = document.getElementById('nsc_bar_nice-cookie-consent_js-js');
    return s ? { src: s.src, async: s.async, defer: s.defer } : null;
  });
  R.home.ccWindow = await page.evaluate(() => {
    const w = document.querySelector('.cc-window');
    if (!w) return null;
    const r = w.getBoundingClientRect();
    return { cls: w.className, vis: getComputedStyle(w).display + '/' + getComputedStyle(w).visibility + '/' + getComputedStyle(w).opacity, x: r.x, y: r.y, w: r.width, h: r.height, text: w.innerText.slice(0, 200), ariaRole: w.getAttribute('role'), ariaLabel: w.getAttribute('aria-label') };
  });
  R.home.cls = await cls(page);
  await page.screenshot({ path: `${SHOTS}/d_home_viewport.png` });

  // header nav items and hover behaviour
  R.home.nav = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.penci_header .navigation ul.menu > li, header .navigation ul.menu > li').forEach((li) => {
      const a = li.querySelector(':scope > a');
      const r = a.getBoundingClientRect();
      out.push({ text: a.innerText.trim(), href: a.getAttribute('href'), visible: r.width > 0 && r.height > 0, x: r.x, y: r.y, sub: !!li.querySelector('ul, .penci-megamenu, .sub-menu'), cls: li.className });
    });
    return out;
  });
  // hover each visible top item, detect any new visible panel
  R.home.hover = [];
  const items = await page.locator('.penci_header .navigation ul.menu > li > a').filter({ visible: true }).all();
  for (const it of items) {
    await it.hover();
    await sleep(700);
    const panel = await page.evaluate(() => {
      const c = [...document.querySelectorAll('.sub-menu, .penci-megamenu, .penci-mega-latest-posts, .penci-dropdown-menu, ul.children')].filter((e) => {
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.opacity !== '0' && cs.display !== 'none';
      });
      return c.map((e) => e.className.slice(0, 80));
    });
    R.home.hover.push({ text: (await it.innerText()).trim(), panels: panel });
  }
  await page.mouse.move(10, 500);

  // keyboard: tab sequence from top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('body').click({ position: { x: 5, y: 300 } }).catch(() => {});
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  R.home.tabs = [];
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
    await sleep(150);
    const f = await page.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return { tag: 'body' };
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return {
        tag: e.tagName.toLowerCase(),
        text: (e.innerText || e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.value || '').trim().slice(0, 50),
        href: e.getAttribute('href'),
        visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth,
        rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
        outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor,
        boxShadow: cs.boxShadow.slice(0, 60),
        inHeaderClass: (e.closest('[class]')?.className || '').slice(0, 60),
      };
    });
    R.home.tabs.push(f);
  }
  await page.keyboard.press('Tab');
  await page.screenshot({ path: `${SHOTS}/d_home_focus_tab17.png` });
  R.home.skipLink = await page.evaluate(() => !!document.querySelector('a.skip-link, a[href="#content"], a[href="#main"], .screen-reader-text[href^="#"]'));

  // search box on homepage (Google CSE)
  R.home.search = await page.evaluate(() => {
    const i = document.querySelector('input.gsc-input');
    const sInputs = [...document.querySelectorAll('input[type=search], input[name=s], input.gsc-input')].map((e) => {
      const r = e.getBoundingClientRect();
      return { name: e.name, cls: e.className, ph: e.placeholder, title: e.title, visible: r.width > 0 && r.height > 0, aria: e.getAttribute('aria-label'), labelled: !!(e.labels && e.labels.length) };
    });
    return { gsc: !!i, sInputs, headerSearch: !!document.querySelector('.penci_header .top-search-classes, .penci_header .search-click, .penci_header form.pc-searchform') };
  });
  // Read More toggle
  const rm = page.locator('a.read-toggle').first();
  if (await rm.count()) {
    const before = await page.evaluate(() => ({ url: location.href, sy: scrollY, txt: document.querySelector('a.read-toggle').innerText }));
    await rm.click();
    await sleep(800);
    const after = await page.evaluate(() => ({ url: location.href, sy: scrollY, txt: document.querySelector('a.read-toggle').innerText, hidden: [...document.querySelectorAll('.hidden-content')].map((e) => getComputedStyle(e).display) }));
    R.home.readMore = { before, after };
    await page.screenshot({ path: `${SHOTS}/d_home_readmore_open.png` });
  }
  // trending + tiles links
  R.home.mainLinks = await page.evaluate(() => {
    const main = document.querySelector('.elementor[data-elementor-type=wp-page]') || document.body;
    return [...main.querySelectorAll('a')].map((a) => ({ text: a.innerText.trim().slice(0, 40), href: a.getAttribute('href') }));
  });
  // try the search: type and press Enter (Google CSE, read-only GET)
  if (R.home.search.gsc) {
    const inp = page.locator('input.gsc-input').first();
    await inp.scrollIntoViewIfNeeded();
    await inp.click();
    await inp.fill('birthday mom');
    await sleep(1500);
    R.home.autocomplete = await page.evaluate(() => [...document.querySelectorAll('.gsc-completion-container td.gssb_a, .gsc-completion-container .gsq_a')].map((e) => e.innerText.trim()).slice(0, 10));
    await page.keyboard.press('Enter');
    await sleep(5000);
    R.home.cseResults = await page.evaluate(() => {
      const res = [...document.querySelectorAll('.gsc-webResult.gsc-result a.gs-title')].map((a) => ({ t: a.innerText.trim().slice(0, 70), h: a.getAttribute('data-ctorig') || a.href }));
      const box = document.querySelector('.gsc-results-wrapper-overlay, .gsc-results-wrapper-visible, .gsc-resultsbox-visible');
      const noRes = document.querySelector('.gs-no-results-result');
      return { count: res.length, res: res.slice(0, 12), overlay: box ? box.className : null, noRes: noRes ? noRes.innerText : null, ads: document.querySelectorAll('.gsc-adBlock, .gsc-adBlockVertical, #adBlock').length, url: location.href };
    });
    await page.screenshot({ path: `${SHOTS}/d_home_cse_results.png` });
  }
  R.home.logAfter = { console: log.console.length, pageErrors: log.pageErrors };
  await page.close();
}

// ---- 2. accept cookie banner then reload: does it come back?
{
  await sleep(3000);
  const { page, log } = await open(ctx, '/about-us/', { wait: 7000 });
  R.cookie = { log };
  const btn = page.locator('.cc-window .cc-btn.cc-dismiss, .cc-window a.cc-btn').first();
  R.cookie.bannerBefore = await page.locator('.cc-window').isVisible().catch(() => false);
  if (await btn.count()) {
    R.cookie.btnText = await btn.innerText();
    await btn.click();
    await sleep(1500);
  }
  R.cookie.bannerAfterClick = await page.locator('.cc-window').isVisible().catch(() => false);
  R.cookie.cookies = (await ctx.cookies()).filter((c) => /cookie|consent|nsc/i.test(c.name)).map((c) => ({ n: c.name, v: c.value.slice(0, 60), exp: c.expires }));
  R.cookie.revokeBtn = await page.evaluate(() => { const e = document.querySelector('.cc-revoke'); return e ? getComputedStyle(e).display : null; });
  R.cookie.cls = await cls(page);
  await page.close();
  await sleep(2500);
  const r2 = await open(ctx, '/contact-us/', { wait: 6000 });
  R.cookie.bannerOnNextPage = await r2.page.locator('.cc-window').isVisible().catch(() => false);
  R.cookie.contactLog = r2.log;
  // Contact form inspection (NO submit)
  R.contact = await r2.page.evaluate(() => {
    const f = document.querySelector('form.wpcf7-form');
    if (!f) return null;
    const fields = [...f.querySelectorAll('input, textarea, select, button')].map((e) => {
      const r = e.getBoundingClientRect();
      const lab = e.labels && e.labels[0] ? e.labels[0].innerText.trim().slice(0, 40) : null;
      return { tag: e.tagName.toLowerCase(), type: e.type, name: e.name, req: e.required, ariaReq: e.getAttribute('aria-required'), ph: e.placeholder, label: lab, visible: r.width > 0 && r.height > 0, autocomplete: e.getAttribute('autocomplete') };
    });
    return { novalidate: f.hasAttribute('novalidate'), action: f.getAttribute('action'), cls: f.className, fields, swv: !!(window.wpcf7 && window.wpcf7.schemas), recaptcha: !!document.querySelector('.grecaptcha-badge'), recaptchaBadge: (() => { const b = document.querySelector('.grecaptcha-badge'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x, r.y, r.width, r.height, getComputedStyle(b).visibility]; })() };
  });
  // client-side validation on blur (no submit): type bad email, tab out
  try {
    const email = r2.page.locator('form.wpcf7-form input[name="your-email"]');
    await email.scrollIntoViewIfNeeded();
    await email.click();
    await email.fill('not-an-email');
    await r2.page.keyboard.press('Tab');
    await sleep(1200);
    const nameF = r2.page.locator('form.wpcf7-form input[name="your-name"]');
    await nameF.click();
    await nameF.fill('');
    await r2.page.keyboard.press('Tab');
    await sleep(1200);
    R.contactBlur = await r2.page.evaluate(() => ({
      tips: [...document.querySelectorAll('.wpcf7-not-valid-tip')].map((e) => e.innerText.trim()),
      invalid: [...document.querySelectorAll('.wpcf7-not-valid, [aria-invalid=true]')].map((e) => e.name),
      emailValidity: document.querySelector('input[name="your-email"]').validity.valid,
      formNovalidate: document.querySelector('form.wpcf7-form').noValidate,
    }));
    await r2.page.screenshot({ path: `${SHOTS}/d_contact_blur_validation.png`, fullPage: false });
  } catch (e) {
    R.contactBlurErr = String(e).slice(0, 200);
  }
  R.contactCls = await cls(r2.page);
  await r2.page.close();
}

R.loads = loadCount();
save('d1_home', R);
console.log(JSON.stringify(R, null, 1).slice(0, 20000));
await browser.close();
