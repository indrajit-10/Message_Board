// Privacy / consent / analytics / ads check on a message page (desktop), fresh profile, no banner interaction.
// Run twice: normal and with GPC (Sec-GPC: 1 + navigator.globalPrivacyControl = true).
import fs from 'node:fs';
import { BASE, OUT, SHOTS, launch, newCtx, recordRequests, sleep, stats, countLoad, loads } from './lib.mjs';

const PATH = process.argv[2] || '/birthday-messages-for-mom/';
const MODE = process.argv[3] || 'normal'; // normal | gpc
const VP = process.argv[4] || 'desktop';
const browser = await launch();
const extra = MODE === 'gpc' ? { extraHTTPHeaders: { 'Sec-GPC': '1', DNT: '1' } } : {};
const ctx = await newCtx(browser, VP, extra);
if (MODE === 'gpc') await ctx.addInitScript(() => { Object.defineProperty(Navigator.prototype, 'globalPrivacyControl', { get: () => true }); });
const rec = recordRequests(ctx);
// never actually leave to www: abort documents on other 123greetings hosts (used for the click test)
await ctx.route(/^https:\/\/(www\.|search\.)?123greetings\.com\//, (route) => route.request().resourceType() === 'document' ? route.abort() : route.continue());

const page = await ctx.newPage();
const t0 = Date.now();
await page.goto(BASE + PATH, { waitUntil: 'load', timeout: 90000 }).catch((e) => console.error('nav', String(e).slice(0, 200)));
countLoad();
await sleep(20000);
const tLoaded = Date.now() - t0;

const cookies = await ctx.cookies();
const info = await page.evaluate(async () => {
  const out = {};
  out.cmp = { tcfapi: typeof window.__tcfapi, gpp: typeof window.__gpp, uspapi: typeof window.__uspapi, googlefc: typeof window.googlefc, gtag: typeof window.gtag };
  if (typeof window.__tcfapi === 'function') {
    out.tcf = await new Promise((res) => { try { window.__tcfapi('ping', 2, (d) => res(d)); setTimeout(() => res('timeout'), 3000); } catch (e) { res(String(e)); } });
  }
  if (typeof window.__uspapi === 'function') {
    out.usp = await new Promise((res) => { try { window.__uspapi('getUSPData', 1, (d, ok) => res({ d, ok })); setTimeout(() => res('timeout'), 3000); } catch (e) { res(String(e)); } });
  }
  if (typeof window.__gpp === 'function') {
    out.gpp = await new Promise((res) => { try { const r = window.__gpp('ping', (d, ok) => res({ d, ok })); if (r) res(r); setTimeout(() => res('timeout'), 3000); } catch (e) { res(String(e)); } });
  }
  out.dataLayer = (window.dataLayer || []).map((x) => { try { return JSON.stringify(Array.from(x)).slice(0, 200); } catch (e) { return String(x).slice(0, 200); } }).slice(0, 30);
  out.ls = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); out.ls[k] = String(localStorage.getItem(k)).slice(0, 80); } } catch (e) {}
  out.gpcSeen = navigator.globalPrivacyControl;
  // cookie banner
  const cc = document.querySelector('.cc-window');
  out.banner = cc ? { visible: !!(cc.offsetWidth || cc.offsetHeight) && getComputedStyle(cc).display !== 'none' && !cc.classList.contains('cc-invisible'), text: cc.innerText.replace(/\s+/g, ' ').slice(0, 300), buttons: Array.from(cc.querySelectorAll('a,button,span[role=button]')).map((b) => b.innerText.trim()).filter(Boolean) } : null;
  // GPT slots
  out.slots = [];
  try {
    if (window.googletag && googletag.pubads) {
      for (const s of googletag.pubads().getSlots()) {
        const el = document.getElementById(s.getSlotElementId());
        const r = el ? el.getBoundingClientRect() : null;
        const ri = s.getResponseInformation && s.getResponseInformation();
        out.slots.push({ path: s.getAdUnitPath(), div: s.getSlotElementId(), sizes: s.getSizes().map((z) => (z.getWidth ? z.getWidth() + 'x' + z.getHeight() : String(z))), rect: r ? [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)] : null, filled: ri ? { adv: ri.advertiserId, li: ri.lineItemId, creative: ri.creativeId } : null, targeting: (s.getTargetingKeys ? s.getTargetingKeys() : []).slice(0, 20) });
      }
      out.pubadsTargeting = googletag.pubads().getTargetingKeys ? googletag.pubads().getTargetingKeys() : null;
    }
  } catch (e) { out.slotErr = String(e); }
  // ad-ish containers
  out.adEls = Array.from(document.querySelectorAll('[id^="TR-"], [id^="div-gpt"], [id^="google_ads_iframe"], ins.adsbygoogle, iframe[id^="google_ads_iframe"], [class*="truereach"], [id*="truereach"]')).map((el) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return { tag: el.tagName, id: el.id.slice(0, 80), cls: String(el.className).slice(0, 80), rect: [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)], pos: cs.position, label: (el.innerText || '').slice(0, 60) };
  });
  out.docH = document.documentElement.scrollHeight;
  // eCard CTA link for click-tracking test
  const a = Array.from(document.querySelectorAll('a[href*="123greetings.com"]')).find((x) => !x.href.includes('blog.123greetings.com') && !x.closest('footer, [class*="footer"], [data-elementor-type="footer"]') && x.offsetParent);
  out.cta = a ? { href: a.href, text: a.innerText.trim().slice(0, 60), target: a.target } : null;
  return out;
});

// click-tracking test: click the first visible in-content eCard link (navigation to www is aborted)
let clickTest = null;
const allBefore = rec.reqs.slice();
if (info.cta) {
  rec.reset();
  const before = info.cta.href;
  const loc = page.locator(`a[href="${new URL(info.cta.href).href.replace(/"/g, '\\"')}"]`).first();
  let hrefAfterMousedown = null;
  try {
    await loc.scrollIntoViewIfNeeded({ timeout: 5000 });
    await loc.dispatchEvent('mousedown');
    hrefAfterMousedown = await loc.getAttribute('href');
    await loc.click({ timeout: 5000, noWaitAfter: true, modifiers: [] }).catch((e) => console.error('click', String(e).slice(0, 150)));
  } catch (e) { console.error('cta', String(e).slice(0, 200)); }
  await sleep(4000);
  clickTest = { before, hrefAfterMousedown, requestsAfterClick: rec.reqs.map((r) => ({ t: r.t, url: r.url.slice(0, 1500), type: r.type, post: r.post.slice(0, 600) })).filter((r) => !/\.(png|jpe?g|webp|gif|svg|woff2?|css)(\?|$)/.test(r.url)).slice(0, 40) };
}

const all = allBefore;
const hosts = {};
for (const r of all) { try { const h = new URL(r.url).host; hosts[h] = hosts[h] || { n: 0, first: r.t }; hosts[h].n++; hosts[h].first = Math.min(hosts[h].first, r.t); } catch (e) {} }
const ga = all.filter((r) => /google-analytics\.com\/(g|j)\/collect|analytics\.google\.com\/g\/collect/.test(r.url)).map((r) => { const u = new URL(r.url); return { t: r.t, tid: u.searchParams.get('tid'), en: u.searchParams.get('en'), gcs: u.searchParams.get('gcs'), gcd: u.searchParams.get('gcd'), npa: u.searchParams.get('npa'), dl: (u.searchParams.get('dl') || '').slice(0, 80), ep: Array.from(u.searchParams.entries()).filter(([k]) => /^(ep|epn|up)\./.test(k)), body: r.post.slice(0, 800) }; });
const gam = all.filter((r) => /securepubads\.g\.doubleclick\.net\/gampad\/ads/.test(r.url)).map((r) => { const u = new URL(r.url); return { t: r.t, iu: u.searchParams.get('iu_parts') || u.searchParams.get('iu'), enc: u.searchParams.get('enc_prev_ius'), sz: u.searchParams.get('prev_iu_szs') || u.searchParams.get('sz'), npa: u.searchParams.get('npa'), gdpr: u.searchParams.get('gdpr'), us_privacy: u.searchParams.get('us_privacy'), gpp: u.searchParams.get('gpp'), gpc: u.searchParams.get('gpc') || u.searchParams.get('sec_gpc'), rdp: u.searchParams.get('rdp'), ltd: u.searchParams.get('ltd'), cookie_enabled: u.searchParams.get('cookie_enabled'), url: u.searchParams.get('url'), loc: u.searchParams.get('loc'), ref: u.searchParams.get('ref') }; });
const pageShot = `${SHOTS}/p1_${MODE}_${VP}${PATH.replace(/\W+/g, '_')}.png`;
await page.screenshot({ path: pageShot }).catch(() => {});

const out = { path: PATH, mode: MODE, vp: VP, tLoaded, nRequests: all.length, hosts, cookies: cookies.map((c) => ({ name: c.name, domain: c.domain, expiresDays: c.expires > 0 ? Math.round((c.expires * 1000 - Date.now()) / 86400000) : 'session', sameSite: c.sameSite, secure: c.secure })), info, ga, gam, clickTest, stats, loads };
fs.writeFileSync(`${OUT}/p1_${MODE}_${VP}${PATH.replace(/\W+/g, '_')}.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify({ n: all.length, hosts: Object.keys(hosts).length, cookies: cookies.length, ga: ga.length, gam: gam.length, slots: info.slots.length, stats }, null, 0));
await browser.close();
