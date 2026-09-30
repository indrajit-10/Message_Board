// Helpers for the adversarial accessibility verification (run from /home/user/Message_Board/site-audit).
import { chromium } from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';

export const BASE = 'https://blog.123greetings.com';
export const OUT = 'agent-work/a11y-verify';
export const SHOTS = `${OUT}/shots`;
fs.mkdirSync(SHOTS, { recursive: true });
export const AXE_SRC = fs.readFileSync('agent-work/accessibility/axe.min.js', 'utf8');

export const VIEWPORTS = {
  desktop: { viewport: { width: 1366, height: 900 } },
  mobile: {
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  },
  reflow: { viewport: { width: 320, height: 256 } },
};
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let loads = 0;
export const loadCount = () => loads;

// static first-party assets: reuse the accessibility agent's cache (read-only), else our own cache
const CACHES = ['agent-work/accessibility/cache', `${OUT}/cache`];
fs.mkdirSync(CACHES[1], { recursive: true });
const STATIC_RE = /^https:\/\/blog\.123greetings\.com\/(wp-content|wp-includes|_jb_static)\//;
export const assetStats = { cached: 0, fetched: 0, r429: 0 };

export async function newCtx(browser, vp, extra = {}) {
  const ctx = await browser.newContext({ ...VIEWPORTS[vp], ...extra });
  await ctx.route(STATIC_RE, async (route) => {
    const url = route.request().url();
    const key = crypto.createHash('sha1').update(url).digest('hex');
    for (const c of CACHES) {
      const f = `${c}/${key}`;
      if (fs.existsSync(f + '.json')) {
        const meta = JSON.parse(fs.readFileSync(f + '.json', 'utf8'));
        assetStats.cached++;
        return route.fulfill({ status: 200, headers: meta.headers, body: fs.readFileSync(f + '.bin') });
      }
    }
    for (const w of [0, 4000, 9000, 15000]) {
      if (w) { assetStats.r429++; await sleep(w); }
      let resp;
      try { resp = await route.fetch({ timeout: 45000 }); } catch (e) { return route.abort().catch(() => {}); }
      if (resp.status() === 429) continue;
      const body = await resp.body();
      const headers = resp.headers();
      if (resp.status() === 200) {
        const keep = {};
        for (const h of ['content-type', 'access-control-allow-origin', 'cache-control']) if (headers[h]) keep[h] = headers[h];
        const f = `${CACHES[1]}/${key}`;
        fs.writeFileSync(f + '.bin', body);
        fs.writeFileSync(f + '.json', JSON.stringify({ url, headers: keep }));
      }
      assetStats.fetched++;
      return route.fulfill({ response: resp, body });
    }
    return route.fulfill({ status: 429, contentType: 'text/plain', body: 'Too Many Requests' });
  });
  await ctx.addInitScript(() => {
    window.__sel = (n) => {
      if (!n || !n.tagName) return String(n);
      let s = n.tagName.toLowerCase();
      if (n.id) s += '#' + n.id;
      if (typeof n.className === 'string' && n.className.trim()) s += '.' + n.className.trim().split(/\s+/).slice(0, 3).join('.');
      return s;
    };
    window.__lum = (c) => {
      const m = (c.match(/[\d.]+/g) || [0, 0, 0]).map(Number);
      const g = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * g(m[0]) + 0.7152 * g(m[1]) + 0.0722 * g(m[2]);
    };
    window.__ratio = (a, b) => { const L1 = window.__lum(a), L2 = window.__lum(b); return +((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2); };
    window.__bg = (el) => { // first non-transparent ancestor background (ignores images)
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
        const b = getComputedStyle(n).backgroundColor;
        if (b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') return { bg: b, from: window.__sel(n) };
      }
      return { bg: 'rgb(255, 255, 255)', from: 'default' };
    };
    window.__overlap = (el, other) => { // fraction of el's box covered by other's box
      const a = el.getBoundingClientRect(), b = other.getBoundingClientRect();
      const vw = innerWidth, vh = innerHeight;
      const ax1 = Math.max(a.left, 0), ay1 = Math.max(a.top, 0), ax2 = Math.min(a.right, vw), ay2 = Math.min(a.bottom, vh);
      const area = Math.max(0, ax2 - ax1) * Math.max(0, ay2 - ay1);
      if (!area) return null;
      const ix = Math.max(0, Math.min(ax2, b.right) - Math.max(ax1, b.left)), iy = Math.max(0, Math.min(ay2, b.bottom) - Math.max(ay1, b.top));
      return +(ix * iy / area).toFixed(2);
    };
  });
  return ctx;
}

export async function open(ctx, path, { wait = 5000 } = {}) {
  const page = await ctx.newPage();
  const log = { path, pageErrors: [], http: [] };
  page.on('pageerror', (e) => log.pageErrors.push(String(e.message || e).slice(0, 200)));
  page.on('response', (r) => { if (r.status() >= 400 && /123greetings/.test(r.url())) log.http.push(`${r.status()} ${r.url().slice(0, 140)}`); });
  let resp = null;
  try { resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 }); } catch (e) { log.navError = String(e).slice(0, 200); }
  loads++;
  log.status = resp?.status();
  log.xcache = resp?.headers()['x-ac'] || resp?.headers()['x-cache'] || null;
  await page.waitForTimeout(wait);
  return { page, log };
}

export async function runAxe(page, tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']) {
  await page.addScriptTag({ content: AXE_SRC });
  return page.evaluate(async (tags) => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'incomplete'] });
    const slim = (arr) => arr.map((v) => ({ id: v.id, impact: v.impact, count: v.nodes.length,
      nodes: v.nodes.slice(0, 12).map((n) => ({ target: n.target.join(' '), html: n.html.slice(0, 160), data: (n.any[0] && n.any[0].data) || null })) }));
    return { violations: slim(r.violations), incomplete: slim(r.incomplete) };
  }, tags);
}

export async function axTree(page) {
  const client = await page.context().newCDPSession(page);
  await client.send('Accessibility.enable');
  const { nodes } = await client.send('Accessibility.getFullAXTree');
  await client.detach().catch(() => {});
  return nodes.filter((n) => !n.ignored);
}

export const launch = () => chromium.launch({ channel: 'chromium' });
export function save(name, data) { fs.writeFileSync(`${OUT}/${name}.json`, JSON.stringify(data, null, 1)); }
