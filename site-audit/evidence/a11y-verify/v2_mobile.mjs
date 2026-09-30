// Verification pass 2: mobile 390x844 + reflow 320x256. Never submits forms. ~4 page loads.
// Run: cd /home/user/Message_Board/site-audit && node agent-work/a11y-verify/v2_mobile.mjs [section...]
import { launch, newCtx, open, save, sleep, loadCount, assetStats, SHOTS } from './vlib.mjs';

const only = process.argv.slice(2);
const want = (s) => only.length === 0 || only.includes(s);
const PAUSE = 7000;
const focusInfo = (page) => page.evaluate(() => {
  const e = document.activeElement; if (!e || e === document.body) return { el: 'body' };
  const r = e.getBoundingClientRect();
  const inVP = r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
  const cc = document.querySelector('.cc-window'); const ccOn = cc && getComputedStyle(cc).display !== 'none' && parseFloat(getComputedStyle(cc).opacity) > 0 && cc.getBoundingClientRect().height > 0;
  const oc = document.querySelector('#penci_off_canvas');
  const cx = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1), cy = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
  const hit = inVP ? document.elementFromPoint(cx, cy) : null;
  return { el: window.__sel(e), name: (e.getAttribute('aria-label') || e.innerText || e.placeholder || e.querySelector?.('img')?.alt || '').trim().replace(/\s+/g, ' ').slice(0, 35),
    rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], inVP,
    inDrawer: !!e.closest('#penci_off_canvas'), inSidebarNav: !!e.closest('#sidebar-nav'),
    ccOverlap: ccOn ? window.__overlap(e, cc) : null, centerHit: hit ? (e.contains(hit) ? 'self' : (hit.closest('#penci_off_canvas') ? 'drawer' : (hit.closest('.cc-window') ? 'cookie' : window.__sel(hit)))) : null };
});

const browser = await launch();
const R = {};

if (want('MM')) {
  const ctx = await newCtx(browser, 'mobile');
  const { page, log } = await open(ctx, '/birthday-messages-for-mom/', { wait: 6000 });
  const rec = { log };
  rec.hamburger = await page.evaluate(() => { const h = document.querySelector('.button-menu-mobile'); const p = h.parentElement; const r = h.getBoundingClientRect(); h.focus(); return { html: h.outerHTML.slice(0, 200), parent: p.outerHTML.slice(0, 160), tag: h.tagName, tabIndex: h.tabIndex, role: h.getAttribute('role'), aria: h.getAttribute('aria-label'), exp: h.getAttribute('aria-expanded'), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], focusable: document.activeElement === h, anyFocusableAncestor: !!h.closest('a[href],button,[tabindex="0"]') }; });
  rec.drawerClosed = await page.evaluate(() => { const o = document.querySelector('#penci_off_canvas'); const s = getComputedStyle(o); const r = o.getBoundingClientRect(); const sn = document.querySelector('nav#sidebar-nav'); const ss = sn && getComputedStyle(sn); const sr = sn?.getBoundingClientRect(); return { vis: s.visibility, disp: s.display, transform: s.transform, left: Math.round(r.left), inert: o.inert, ariaHidden: o.getAttribute('aria-hidden'), sidebarNav: sn ? { vis: ss.visibility, disp: ss.display, transform: ss.transform, rect: [Math.round(sr.left), Math.round(sr.top), Math.round(sr.width), Math.round(sr.height)], links: [...sn.querySelectorAll('a')].map((a) => (a.getAttribute('aria-label') || a.textContent.trim() || a.querySelector('img')?.alt || '').slice(0, 20) + '|' + a.getAttribute('href') + '|' + Math.round(a.getBoundingClientRect().width)) } : null }; });
  // forward Tab from top
  await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
  const fwd = [];
  for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(350); fwd.push(await focusInfo(page)); }
  rec.fwd = fwd;
  // end of tab order: from the last footer link onward
  await page.evaluate(() => { const a = [...document.querySelectorAll('#footer-section-container a')].pop(); a.focus(); });
  const tail = [];
  for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(350); tail.push(await focusInfo(page)); }
  rec.tail = tail;
  // open the drawer by tapping the hamburger
  await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
  await page.waitForTimeout(500);
  await page.tap('.button-menu-mobile');
  await page.waitForTimeout(1300);
  rec.opened = await page.evaluate(() => { const o = document.querySelector('#penci_off_canvas'); const c = document.querySelector('.close-mobile-menu-builder'); return { left: Math.round(o.getBoundingClientRect().left), bodyOpen: document.body.classList.contains('open-mobile-builder-sidebar-nav'), active: window.__sel(document.activeElement), closeHtml: c.outerHTML.slice(0, 200), dialogRole: o.getAttribute('role'), ariaModal: o.getAttribute('aria-modal'), hbExpanded: document.querySelector('.button-menu-mobile').getAttribute('aria-expanded') }; });
  await page.screenshot({ path: `${SHOTS}/mobile_drawer_open.png` });
  const open1 = [];
  for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(350); open1.push(await focusInfo(page)); }
  rec.tabsOpen = open1;
  await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
  rec.afterEsc = await page.evaluate(() => ({ left: Math.round(document.querySelector('#penci_off_canvas').getBoundingClientRect().left), bodyOpen: document.body.classList.contains('open-mobile-builder-sidebar-nav'), active: window.__sel(document.activeElement) }));
  // Close via keyboard: focus Close link and press Enter
  await page.focus('.close-mobile-menu-builder'); await page.keyboard.press('Enter'); await page.waitForTimeout(1000);
  rec.afterCloseEnter = await page.evaluate(() => ({ left: Math.round(document.querySelector('#penci_off_canvas').getBoundingClientRect().left), bodyOpen: document.body.classList.contains('open-mobile-builder-sidebar-nav'), active: window.__sel(document.activeElement), url: location.href }));
  R.mm = rec; save('v2_mobile_menu', rec);
  console.log('MM', log.status, JSON.stringify(rec.hamburger), JSON.stringify(rec.opened), JSON.stringify(rec.afterEsc), JSON.stringify(rec.afterCloseEnter));
  await page.close(); await ctx.close(); await sleep(PAUSE);
}

if (want('MC')) {
  const ctx = await newCtx(browser, 'mobile');
  const { page, log } = await open(ctx, '/contact-us/', { wait: 6000 });
  const rec = { log };
  rec.cc = await page.evaluate(() => { const c = document.querySelector('.cc-window'); const r = c.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; });
  await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
  const stops = [];
  for (let i = 0; i < 26; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(400); const f = await focusInfo(page); stops.push(f); if (/your-|textarea|input/.test(f.el) && f.ccOverlap >= 0.99 && !rec.shot) { rec.shot = `mobile_contact_obscured_${i}.png`; await page.screenshot({ path: `${SHOTS}/${rec.shot}` }); } }
  rec.stops = stops;
  R.mc = rec; save('v2_mobile_contact', rec);
  console.log('MC', log.status, JSON.stringify(rec.cc), JSON.stringify(stops.filter((s) => s.ccOverlap).map((s) => [s.el.slice(0, 30), s.name, s.ccOverlap, s.centerHit])));
  await page.close(); await ctx.close(); await sleep(PAUSE);
}

if (want('RF')) {
  const ctx = await newCtx(browser, 'reflow');
  const { page, log } = await open(ctx, '/contact-us/', { wait: 6000 });
  const rec = { log };
  const probe = () => page.evaluate(() => {
    const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const cc = document.querySelector('.cc-window'); const r = cc.getBoundingClientRect();
    const deskNav = [...document.querySelectorAll('#menu-my-main-header a, .penci_navbar .menu a, nav.navigation a')].filter(vis).length;
    return { vw: innerWidth, vh: innerHeight, cc: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], ccPct: Math.round(100 * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) * Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) / (innerWidth * innerHeight)), hamburgerVisible: vis(document.querySelector('.button-menu-mobile')), visibleDesktopNavLinks: deskNav, scrollW: document.documentElement.scrollWidth };
  });
  rec.at320 = await probe();
  await page.screenshot({ path: `${SHOTS}/reflow320_contact.png` });
  // Accept button reachable/size at 320x256
  rec.acceptAt320 = await page.evaluate(() => { const a = document.querySelector('.cc-dismiss'); const r = a.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; });
  rec.widths = [];
  for (const [w, h] of [[1366, 900], [1200, 800], [1024, 768], [900, 700], [768, 1024], [480, 800]]) {
    await page.setViewportSize({ width: w, height: h }); await page.waitForTimeout(700);
    rec.widths.push(await probe());
  }
  R.rf = rec; save('v2_reflow', rec);
  console.log('RF', log.status, JSON.stringify(rec));
  await page.close(); await ctx.close(); await sleep(PAUSE);
}

if (want('LP')) { // in-text link appearance on a post (desktop)
  const ctx = await newCtx(browser, 'desktop');
  const { page, log } = await open(ctx, '/mothers-day-messages-for-wife-what-she-actually-wants/', { wait: 6000 });
  const rec = { log };
  const a = page.locator('.inner-post-entry p a[href]').first();
  await a.scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
  rec.link = await a.evaluate((x) => { const s = getComputedStyle(x), p = getComputedStyle(x.closest('p')); return { text: x.textContent, ff: s.fontFamily, fw: s.fontWeight, pfw: p.fontWeight, td: s.textDecorationLine, c: s.color, pc: p.color, ratio: window.__ratio(s.color, p.color) }; });
  const pb = await a.evaluate((x) => { const r = x.closest('p').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
  await page.screenshot({ path: `${SHOTS}/post_inline_link.png`, clip: { x: pb[0], y: pb[1], width: pb[2], height: pb[3] } });
  await a.hover(); await page.waitForTimeout(500);
  rec.hover = await a.evaluate((x) => { const s = getComputedStyle(x); return { td: s.textDecorationLine, c: s.color }; });
  // count in-text links across the post body
  rec.count = await page.evaluate(() => [...document.querySelectorAll('.inner-post-entry p a[href]')].filter((x) => { const p = x.closest('p'); return p.textContent.trim().length > x.textContent.trim().length + 20; }).length);
  R.lp = rec; save('v2_links', rec);
  console.log('LP', log.status, JSON.stringify(rec));
  await page.close(); await ctx.close();
}

await browser.close();
console.log('loads', loadCount(), 'assets', JSON.stringify(assetStats));
