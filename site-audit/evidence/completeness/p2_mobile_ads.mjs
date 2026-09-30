// Mobile: ad formats (interstitial / sticky), overlays, CTA click tracking, over 3 page views in one session.
import fs from 'node:fs';
import { BASE, OUT, SHOTS, launch, newCtx, recordRequests, sleep, stats, countLoad, loads } from './lib.mjs';

const PAGES = (process.argv[2] || '/summer-messages/,/birthday-messages/,/mothers-day-messages/').split(',');
const VP = process.argv[3] || 'mobile';
const browser = await launch();
const ctx = await newCtx(browser, VP);
const rec = recordRequests(ctx);
await ctx.route(/^https:\/\/(www\.|search\.)?123greetings\.com\//, (route) => route.request().resourceType() === 'document' ? route.abort() : route.continue());
const page = await ctx.newPage();

async function snapshot(tag) {
  return page.evaluate(() => {
    const vw = innerWidth, vh = innerHeight;
    const fixed = [];
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 50 || r.height < 30) continue;
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const ix = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)), iy = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      const cover = (ix * iy) / (vw * vh);
      if (cover < 0.02) continue;
      fixed.push({ tag: el.tagName, id: el.id.slice(0, 60), cls: String(el.className).slice(0, 60), pos: cs.position, rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], cover: +cover.toFixed(3), z: cs.zIndex, opacity: cs.opacity, pe: cs.pointerEvents, bg: cs.backgroundColor, hasIframe: !!el.querySelector('iframe'), text: (el.innerText || '').replace(/\s+/g, ' ').slice(0, 80) });
    }
    const pts = [[vw / 2, vh / 2], [vw / 2, vh - 30], [vw / 2, 150]].map(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? `${x},${y}: ${e.tagName}#${e.id.slice(0, 40)}.${String(e.className).slice(0, 40)}` : null; });
    let slots = [];
    try { slots = window.googletag && googletag.pubads ? googletag.pubads().getSlots().map((s) => { const el = document.getElementById(s.getSlotElementId()); const r = el && el.getBoundingClientRect(); const ri = s.getResponseInformation && s.getResponseInformation(); return { path: s.getAdUnitPath(), div: s.getSlotElementId(), rect: r ? [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)] : null, filled: !!ri, ri: ri ? { a: ri.advertiserId, c: ri.creativeId, isEmpty: ri.isEmpty } : null }; }) : []; } catch (e) {}
    const trEls = Array.from(document.querySelectorAll('[id^="TR-"]')).map((el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { id: el.id, pos: cs.position, display: cs.display, vis: cs.visibility, pe: cs.pointerEvents, z: cs.zIndex, rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], html: el.innerHTML.length, iframes: el.querySelectorAll('iframe').length }; });
    const ls = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^tr-|truereach|lastRendered/i.test(k)) ls[k] = localStorage.getItem(k).slice(0, 60); } } catch (e) {}
    const ss = {}; try { for (let i = 0; i < sessionStorage.length; i++) { const k = sessionStorage.key(i); if (/^tr-/i.test(k)) ss[k] = sessionStorage.getItem(k).slice(0, 60); } } catch (e) {}
    return { url: location.href, docH: document.documentElement.scrollHeight, bodyOverflow: getComputedStyle(document.body).overflow, htmlOverflow: getComputedStyle(document.documentElement).overflow, fixed, pts, slots, trEls, ls, ss };
  });
}

const results = [];
for (let i = 0; i < PAGES.length; i++) {
  const path = PAGES[i];
  rec.reset();
  await page.goto(BASE + path, { waitUntil: 'load', timeout: 90000 }).catch((e) => console.error('nav', String(e).slice(0, 200)));
  countLoad();
  await sleep(12000);
  const s0 = await snapshot('top');
  await page.screenshot({ path: `${SHOTS}/p2_${VP}_${i}_top.png` }).catch(() => {});
  // scroll through the page
  const h = s0.docH;
  for (let y = 0; y < h; y += 600) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(700); }
  await sleep(4000);
  const s1 = await snapshot('bottom');
  await page.screenshot({ path: `${SHOTS}/p2_${VP}_${i}_bottom.png` }).catch(() => {});
  const gam = rec.reqs.filter((r) => /securepubads\.g\.doubleclick\.net\/gampad\/ads/.test(r.url)).map((r) => { const u = new URL(r.url); return { t: r.t, iu: u.searchParams.get('iu_parts'), sz: (u.searchParams.get('prev_iu_szs') || '').slice(0, 80) }; });
  const ga = rec.reqs.filter((r) => /google-analytics\.com\/g\/collect/.test(r.url)).map((r) => { const u = new URL(r.url); return { t: r.t, tid: u.searchParams.get('tid'), en: u.searchParams.get('en'), body: r.post.slice(0, 200) }; });
  const entry = { path, s0, s1, gam, ga };
  // click-test on first page: in-content eCard link (not footer)
  if (i === 0) {
    const cta = await page.evaluate(() => {
      const a = Array.from(document.querySelectorAll('a[href*="123greetings.com"]')).find((x) => !x.href.includes('blog.123greetings.com') && !x.closest('footer, [class*="footer"], [data-elementor-type="footer"]') && x.offsetParent);
      if (!a) return null; a.setAttribute('data-audit-cta', '1'); a.scrollIntoView({ block: 'center' }); return { href: a.href, text: a.innerText.trim().slice(0, 60), target: a.target, rel: a.rel };
    });
    entry.cta = cta;
    if (cta) {
      await sleep(1500);
      rec.reset();
      const loc = page.locator('a[data-audit-cta="1"]');
      await loc.dispatchEvent('mousedown').catch(() => {});
      entry.ctaHrefAfterMousedown = await loc.getAttribute('href').catch(() => null);
      await loc.click({ timeout: 5000, noWaitAfter: true }).catch((e) => console.error('click', String(e).slice(0, 150)));
      await sleep(5000);
      entry.afterClick = rec.reqs.filter((r) => !/\.(png|jpe?g|webp|gif|svg|woff2?|css)(\?|$)/.test(r.url)).map((r) => ({ t: r.t, url: r.url.slice(0, 260), type: r.type, post: r.post.slice(0, 300) })).slice(0, 30);
      // if a popup/new tab opened, close it
      for (const p of ctx.pages()) if (p !== page) await p.close().catch(() => {});
    }
  }
  results.push(entry);
  await sleep(3000);
}
fs.writeFileSync(`${OUT}/p2_${VP}.json`, JSON.stringify({ results, stats, loads }, null, 1));
console.log('done', loads, JSON.stringify(stats));
await browser.close();
