// Pass 3: cookie banner keyboard operation, TrueReach overlay, reflow retry, two-H1 post, archive Load More. ~5 loads.
// Run: cd /home/user/Message_Board/site-audit && node agent-work/accessibility/a3_final.mjs
import { launch, newCtx, open, save, sleep, loadCount, assetStats, SHOTS } from './lib.mjs';

const HELPERS = () => {
  window.__sel = (n) => {
    if (!n || !n.tagName) return String(n);
    let s = n.tagName.toLowerCase();
    if (n.id) s += '#' + n.id;
    if (typeof n.className === 'string' && n.className.trim()) s += '.' + n.className.trim().split(/\s+/).slice(0, 3).join('.');
    return s;
  };
};
const bannerVisible = (page) => page.evaluate(() => { const c = document.querySelector('.cc-window'); if (!c) return 'absent'; const s = getComputedStyle(c); const r = c.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0 && r.height > 0 ? 'visible' : 'hidden'; });

const browser = await launch();
const R = {};

// L1: cookie close "x" (span role=button): Space then Enter
{
  const ctx = await newCtx(browser, 'desktop'); await ctx.addInitScript(HELPERS);
  const { page, log } = await open(ctx, '/tag/alps/', { wait: 6000 });
  const rec = { log, initial: await bannerVisible(page) };
  await page.focus('.cc-close'); await page.keyboard.press('Space'); await page.waitForTimeout(1200);
  rec.afterSpaceOnX = await bannerVisible(page);
  if (rec.afterSpaceOnX === 'visible') { await page.focus('.cc-close'); await page.keyboard.press('Enter'); await page.waitForTimeout(1200); rec.afterEnterOnX = await bannerVisible(page); }
  rec.focusAfter = await page.evaluate(() => window.__sel(document.activeElement));
  R.closeX = rec; console.log('L1', JSON.stringify(rec));
  await page.close(); await ctx.close(); await sleep(6000);
}

// L2: Accept (a role=button): Space then Enter; TrueReach container
{
  const ctx = await newCtx(browser, 'desktop'); await ctx.addInitScript(HELPERS);
  const { page, log } = await open(ctx, '/birthday-messages/', { wait: 8000 });
  const rec = { log, initial: await bannerVisible(page) };
  rec.tr = await page.evaluate(() => [...document.querySelectorAll('div[id^="TR-"]')].map((d) => { const s = getComputedStyle(d); const r = d.getBoundingClientRect(); return { id: d.id, pos: s.position, z: s.zIndex, pe: s.pointerEvents, vis: s.visibility, op: s.opacity, bg: s.backgroundColor, rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], ariaHidden: d.getAttribute('aria-hidden'), role: d.getAttribute('role'), children: d.children.length, html: d.outerHTML.slice(0, 400), focusables: d.querySelectorAll('a,button,iframe,[tabindex]').length }; }));
  rec.hitTest = await page.evaluate(() => [[683, 450], [200, 300], [1200, 200]].map(([x, y]) => window.__sel(document.elementFromPoint(x, y))));
  await page.focus('.cc-dismiss'); await page.keyboard.press('Space'); await page.waitForTimeout(1200);
  rec.afterSpaceOnAccept = await bannerVisible(page);
  if (rec.afterSpaceOnAccept === 'visible') { await page.focus('.cc-dismiss'); await page.keyboard.press('Enter'); await page.waitForTimeout(1200); rec.afterEnterOnAccept = await bannerVisible(page); }
  rec.focusAfter = await page.evaluate(() => window.__sel(document.activeElement));
  R.accept = rec; console.log('L2', JSON.stringify(rec).slice(0, 1500));
  await page.close(); await ctx.close(); await sleep(6000);
}

// L3: reflow 320 retry on mom page
{
  const ctx = await newCtx(browser, 'reflow'); await ctx.addInitScript(HELPERS);
  const { page, log } = await open(ctx, '/birthday-messages-for-mom/', { wait: 6000 });
  const rec = { log };
  rec.m = await page.evaluate(() => { const vw = document.documentElement.clientWidth; const off = []; for (const e of document.querySelectorAll('body *')) { const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue; const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none') continue; let fx = false; for (let a = e; a; a = a.parentElement) if (getComputedStyle(a).position === 'fixed') { fx = true; break; } if (fx) continue; if (r.right > vw + 1 && r.left < vw) off.push({ el: window.__sel(e), right: Math.round(r.right) }); } return { vw, scrollW: document.documentElement.scrollWidth, nOff: off.length, off: off.slice(-8), title: document.title }; });
  await page.screenshot({ path: `${SHOTS}/reflow320_mom.png` });
  R.reflowMom = rec; console.log('L3', JSON.stringify(rec));
  await page.close(); await ctx.close(); await sleep(6000);
}

// L4: post with two H1s + L5 archive Load More
{
  const ctx = await newCtx(browser, 'desktop'); await ctx.addInitScript(HELPERS);
  {
    const { page, log } = await open(ctx, '/19th-may-your-week-with-bob/', { wait: 5000 });
    const client = await ctx.newCDPSession(page); await client.send('Accessibility.enable');
    const { nodes } = await client.send('Accessibility.getFullAXTree');
    R.twoH1 = { log, h1: nodes.filter((n) => !n.ignored && n.role?.value === 'heading' && (n.properties || []).find((p) => p.name === 'level')?.value?.value === 1).map((n) => n.name?.value) };
    console.log('L4', JSON.stringify(R.twoH1));
    await page.close(); await sleep(6000);
  }
  {
    const { page, log } = await open(ctx, '/archive/', { wait: 6000 });
    const rec = { log };
    rec.before = await page.evaluate(() => { const b = document.querySelector('.penci-ajax-more-button, .penci-ajax-more a, .penci-ajax-more-click, [class*="ajax-more"]'); const a = b.closest('a,button') || b; const r = a.getBoundingClientRect(); return { el: window.__sel(a), tag: a.tagName, href: a.getAttribute('href'), role: a.getAttribute('role'), tabIndex: a.tabIndex, text: a.innerText.trim(), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], posts: document.querySelectorAll('article').length, live: [...document.querySelectorAll('[aria-live],[role=status],[role=alert]')].map((x) => window.__sel(x)) }; });
    const sel = await page.evaluate(() => { const b = document.querySelector('.penci-ajax-more-button, .penci-ajax-more a, .penci-ajax-more-click, [class*="ajax-more"]'); const a = b.closest('a,button') || b; a.setAttribute('data-a11y-probe', '1'); return '[data-a11y-probe="1"]'; });
    const focusable = await page.evaluate((s) => { const e = document.querySelector(s); e.focus(); return document.activeElement === e; }, sel);
    rec.focusable = focusable;
    if (focusable) { await page.keyboard.press('Enter'); await page.waitForTimeout(5000); }
    rec.after = await page.evaluate(() => ({ posts: document.querySelectorAll('article').length, focus: window.__sel(document.activeElement), url: location.href }));
    R.loadMore = rec; console.log('L5', JSON.stringify(rec));
    await page.close();
  }
  await ctx.close();
}
save('a3_final', R);
await browser.close();
console.log('loads', loadCount(), 'assets', JSON.stringify(assetStats));
