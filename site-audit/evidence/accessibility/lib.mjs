// Shared helpers for the accessibility audit scripts (run from /home/user/Message_Board/site-audit).
import { chromium } from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';

export const BASE = 'https://blog.123greetings.com';
export const OUT = 'agent-work/accessibility';
export const SHOTS = `${OUT}/shots`;
fs.mkdirSync(SHOTS, { recursive: true });
export const AXE_SRC = fs.readFileSync(`${OUT}/axe.min.js`, 'utf8');

export const VIEWPORTS = {
  desktop: { viewport: { width: 1366, height: 900 } },
  mobile: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  },
  // 320 CSS px wide = 1280 px at 400% zoom (WCAG 1.4.10 reflow); desktop UA, no touch
  reflow: { viewport: { width: 320, height: 256 } },
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let loads = 0;
export const loadCount = () => loads;

// Disk cache for first-party static assets with backoff on 429, so we don't hammer the origin.
const CACHE = `${OUT}/cache`;
fs.mkdirSync(CACHE, { recursive: true });
const STATIC_RE = /^https:\/\/blog\.123greetings\.com\/(wp-content|wp-includes|_jb_static)\//;
export const assetStats = { cached: 0, fetched: 0, retried429: 0, failed429: 0 };

export async function newCtx(browser, vp, extra = {}) {
  const ctx = await browser.newContext({ ...VIEWPORTS[vp], ...extra });
  await ctx.route(STATIC_RE, async (route) => {
    const url = route.request().url();
    const key = crypto.createHash('sha1').update(url).digest('hex');
    const f = `${CACHE}/${key}`;
    if (fs.existsSync(f + '.json')) {
      const meta = JSON.parse(fs.readFileSync(f + '.json', 'utf8'));
      assetStats.cached++;
      return route.fulfill({ status: 200, headers: meta.headers, body: fs.readFileSync(f + '.bin') });
    }
    const waits = [0, 3000, 7000, 12000, 20000];
    for (let i = 0; i < waits.length; i++) {
      if (waits[i]) { assetStats.retried429++; await sleep(waits[i]); }
      let resp;
      try { resp = await route.fetch({ timeout: 45000 }); } catch (e) { return route.abort().catch(() => {}); }
      if (resp.status() === 429) continue;
      const body = await resp.body();
      const headers = resp.headers();
      if (resp.status() === 200) {
        const keep = {};
        for (const h of ['content-type', 'access-control-allow-origin', 'cache-control']) if (headers[h]) keep[h] = headers[h];
        fs.writeFileSync(f + '.bin', body);
        fs.writeFileSync(f + '.json', JSON.stringify({ url, headers: keep }));
      }
      assetStats.fetched++;
      return route.fulfill({ response: resp, body });
    }
    assetStats.failed429++;
    return route.fulfill({ status: 429, contentType: 'text/html', body: 'Too Many Requests' });
  });
  return ctx;
}

export async function open(ctx, path, { wait = 5000 } = {}) {
  const page = await ctx.newPage();
  const log = { path, pageErrors: [], http: [] };
  page.on('pageerror', (e) => log.pageErrors.push(String(e.message || e).slice(0, 200)));
  page.on('response', (r) => { if (r.status() >= 400) log.http.push(`${r.status()} ${r.url().slice(0, 160)}`); });
  let resp = null;
  try {
    resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 });
  } catch (e) { log.navError = String(e).slice(0, 200); }
  loads++;
  log.status = resp?.status();
  await page.waitForTimeout(wait);
  return { page, log };
}

export async function runAxe(page, tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']) {
  await page.addScriptTag({ content: AXE_SRC });
  return page.evaluate(async (tags) => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'incomplete'] });
    const slim = (arr) => arr.map((v) => ({
      id: v.id, impact: v.impact, tags: v.tags.filter((t) => /wcag|best/.test(t)), help: v.help,
      count: v.nodes.length,
      nodes: v.nodes.slice(0, 40).map((n) => ({ target: n.target.join(' '), html: n.html.slice(0, 220), summary: (n.failureSummary || '').slice(0, 300),
        data: (n.any[0] && n.any[0].data) || null })),
    }));
    return { violations: slim(r.violations), incomplete: slim(r.incomplete) };
  }, tags);
}

export async function launch() { return chromium.launch({ channel: 'chromium' }); }
export function save(name, data) { fs.writeFileSync(`${OUT}/${name}.json`, JSON.stringify(data, null, 1)); }
