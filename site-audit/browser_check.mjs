// Load a sample of pages in headless Chromium (desktop + mobile) and record
// runtime problems: console/JS errors, failed requests, broken images,
// horizontal overflow on mobile, page weight and load timings.
// Usage: node browser_check.mjs  (writes data/browser.json and screenshots/)
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'https://blog.123greetings.com';
const PAGES = [
  '/',
  '/archive/',
  '/upcoming-events/',
  '/what-to-write-in-a-card/',
  '/birthday-messages/',
  '/birthday-messages-for-mom/',
  '/national-tap-dance-day-messages/',
  '/anniversary-messages/',
  '/halloween-messages/',
  '/thanksgiving-day-messages/',
  '/sympathy-condolences-messages/',
  '/mothers-day-messages-for-wife-what-she-actually-wants/',
  '/five-minutes-with-bob-2nd-august/',
  '/tag/alps/',
  '/category/123greetings/',
  '/contact-us/',
  '/about-us/',
  '/?s=birthday',
  '/this-page-does-not-exist-audit-check/',
];

const VIEWPORTS = {
  desktop: { viewport: { width: 1366, height: 900 } },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  },
};

fs.mkdirSync('data', { recursive: true });
fs.mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ channel: 'chromium' });
const results = [];

for (const [vpName, vpOpts] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext({ ...vpOpts, ignoreHTTPSErrors: false });
  for (const path of PAGES) {
    const page = await ctx.newPage();
    const rec = { path, viewport: vpName, console: [], pageErrors: [], failed: [], httpErrors: [], requests: 0, bytes: 0 };
    page.on('console', (m) => {
      if (['error', 'warning'].includes(m.type())) rec.console.push(`${m.type()}: ${m.text().slice(0, 300)}`);
    });
    page.on('pageerror', (e) => rec.pageErrors.push(String(e).slice(0, 300)));
    page.on('requestfailed', (r) => {
      const f = r.failure()?.errorText || '';
      if (!/ERR_ABORTED/.test(f)) rec.failed.push(`${f} ${r.url().slice(0, 200)}`);
    });
    page.on('response', async (r) => {
      rec.requests++;
      const len = Number(r.headers()['content-length'] || 0);
      rec.bytes += len;
      if (r.status() >= 400) rec.httpErrors.push(`${r.status()} ${r.url().slice(0, 200)}`);
    });
    const t0 = Date.now();
    let resp;
    try {
      resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 });
    } catch (e) {
      rec.navError = String(e).slice(0, 200);
    }
    rec.status = resp?.status();
    rec.loadMs = Date.now() - t0;
    await page.waitForTimeout(2500);
    // scroll to bottom to trigger lazy images
    try {
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1200);
      Object.assign(
        rec,
        await page.evaluate(() => {
          const nav = performance.getEntriesByType('navigation')[0];
          const imgs = [...document.images];
          const broken = imgs
            .filter((i) => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith('data:'))
            .map((i) => i.currentSrc || i.src);
          const overflow = document.documentElement.scrollWidth - window.innerWidth;
          const wide = [];
          if (overflow > 2) {
            for (const el of document.querySelectorAll('body *')) {
              const r = el.getBoundingClientRect();
              if (r.right > window.innerWidth + 2 && r.width > 0 && getComputedStyle(el).position !== 'fixed') {
                wide.push(`${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join('.')} (${Math.round(r.right)}px)`);
                if (wide.length > 8) break;
              }
            }
          }
          const smallTap = [...document.querySelectorAll('a, button')]
            .filter((a) => {
              const r = a.getBoundingClientRect();
              return r.width > 0 && r.height > 0 && (r.height < 24 || r.width < 24) && a.offsetParent;
            }).length;
          const fixed = [...document.querySelectorAll('body *')]
            .filter((e) => ['fixed', 'sticky'].includes(getComputedStyle(e).position))
            .map((e) => {
              const r = e.getBoundingClientRect();
              return { el: `${e.tagName.toLowerCase()}#${e.id}.${[...e.classList].slice(0, 2).join('.')}`, h: Math.round(r.height), w: Math.round(r.width), top: Math.round(r.top) };
            })
            .filter((f) => f.h > 0 && f.w > 0);
          const hashLinks = [...document.querySelectorAll('a[href="#"]')].filter((a) => a.offsetParent).length;
          return {
            title: document.title,
            domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
            loadEvent: nav ? Math.round(nav.loadEventEnd) : null,
            transferKB: Math.round(performance.getEntriesByType('resource').reduce((s, r) => s + (r.transferSize || 0), (nav?.transferSize || 0)) / 1024),
            resourceCount: performance.getEntriesByType('resource').length,
            thirdPartyHosts: [...new Set(performance.getEntriesByType('resource').map((r) => new URL(r.name).host))].filter((h) => !h.endsWith('123greetings.com')),
            imageCount: imgs.length,
            brokenImages: broken,
            imagesNoAlt: imgs.filter((i) => !i.hasAttribute('alt')).length,
            horizontalOverflowPx: overflow,
            overflowingElements: wide,
            smallTapTargets: smallTap,
            fixedElements: fixed,
            visibleHashLinks: hashLinks,
            h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()).filter(Boolean),
            bodyTextLen: document.body.innerText.length,
          };
        }),
      );
      const shot = `screenshots/${vpName}${path.replace(/[^a-z0-9]+/gi, '_').replace(/_$/, '') || '_home'}.png`;
      await page.screenshot({ path: shot, fullPage: false });
      rec.screenshot = shot;
    } catch (e) {
      rec.evalError = String(e).slice(0, 300);
    }
    results.push(rec);
    console.log(vpName, path, rec.status, rec.loadMs + 'ms', 'console', rec.console.length, 'pageErr', rec.pageErrors.length, 'failed', rec.failed.length, 'overflow', rec.horizontalOverflowPx);
    await page.close();
  }

  // Interaction checks (desktop + mobile)
  const page = await ctx.newPage();
  const inter = { viewport: vpName, checks: {} };
  try {
    // 1. side menu "#" links on a message page: do they do anything?
    await page.goto(BASE + '/birthday-messages/', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2000);
    const side = page.locator('.sideCatMenu a[href="#"]').filter({ visible: true });
    const n = await side.count();
    const sideRes = [];
    for (let i = 0; i < Math.min(n, 4); i++) {
      const before = await page.evaluate(() => window.scrollY);
      await side.nth(i).click({ timeout: 5000 }).catch((e) => sideRes.push('click failed: ' + String(e).slice(0, 80)));
      await page.waitForTimeout(1200);
      const after = await page.evaluate(() => window.scrollY);
      sideRes.push({ text: (await side.nth(i).innerText()).trim(), scrolled: after - before, url: page.url() });
    }
    inter.checks.sideMenu = { visibleHashLinks: n, sample: sideRes };

    // 2. search
    await page.goto(BASE + '/', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1500);
    const searchInputs = await page.locator('input[type="search"], input[name="s"]').count();
    const visibleSearch = await page.locator('input[type="search"], input[name="s"]').filter({ visible: true }).count();
    const searchToggle = await page.locator('.search-click, .top-search-classes, a.search-click, .pcheader-icon.top-search-classes').count();
    await page.goto(BASE + '/?s=birthday', { waitUntil: 'load', timeout: 60000 });
    const searchResults = await page.evaluate(() => ({
      title: document.title,
      articles: document.querySelectorAll('article, .grid-style, li.list-post, .penci-post-item').length,
      text: document.body.innerText.slice(0, 400),
    }));
    await page.goto(BASE + '/?s=zzqxnotfound', { waitUntil: 'load', timeout: 60000 });
    const noResults = await page.evaluate(() => document.body.innerText.match(/nothing|no results|not found|sorry/i)?.[0] || null);
    inter.checks.search = { searchInputs, visibleSearch, searchToggle, searchResults, noResultsMessage: noResults };

    // 3. contact form (inspect only, never submitted)
    await page.goto(BASE + '/contact-us/', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1500);
    inter.checks.contactForm = await page.evaluate(() => {
      const f = document.querySelector('form.wpcf7-form, form.wpforms-form, .elementor-form, form[action*="contact"]');
      if (!f) return { found: false, forms: [...document.forms].map((x) => x.className || x.id || x.action) };
      const fields = [...f.querySelectorAll('input, textarea, select')].filter((i) => i.type !== 'hidden');
      return {
        found: true,
        cls: f.className,
        fields: fields.map((i) => ({
          name: i.name,
          type: i.type,
          required: i.required || i.getAttribute('aria-required') === 'true',
          labelled: !!(i.labels?.length || i.getAttribute('aria-label') || i.placeholder),
        })),
      };
    });

    // 4. 404
    const r404 = await page.goto(BASE + '/this-page-does-not-exist-audit-check/', { waitUntil: 'load' });
    inter.checks.notFound = {
      status: r404?.status(),
      title: await page.title(),
      hasSearch: (await page.locator('input[name="s"]').count()) > 0,
      text: (await page.evaluate(() => document.body.innerText)).slice(0, 300),
    };

    // 5. mobile nav toggle
    if (vpName === 'mobile') {
      await page.goto(BASE + '/', { waitUntil: 'load' });
      await page.waitForTimeout(1500);
      const burger = page.locator('.navigation-mobile-toggle, .penci-mobile-hamburger, .button-menu-mobile, #navigation .button-menu-mobile, .pc_mobile_toggle, .mobile-nav-toggle').filter({ visible: true }).first();
      const hasBurger = (await burger.count()) > 0;
      let opened = null;
      if (hasBurger) {
        await burger.click().catch(() => {});
        await page.waitForTimeout(1200);
        await page.screenshot({ path: 'screenshots/mobile_menu_open.png' });
        opened = await page.evaluate(() => [...document.querySelectorAll('#sidebar-nav, .penci-menu-hbg, .mobile-sidebar, #sidebar-nav-logo')].some((e) => e.getBoundingClientRect().width > 50 && getComputedStyle(e).visibility !== 'hidden'));
      }
      inter.checks.mobileMenu = { hasBurger, opened };
    }
  } catch (e) {
    inter.error = String(e).slice(0, 300);
  }
  results.push(inter);
  console.log('interactions', vpName, JSON.stringify(inter).slice(0, 600));
  await ctx.close();
}

await browser.close();
fs.writeFileSync('data/browser.json', JSON.stringify(results, null, 1));
console.log('done');
