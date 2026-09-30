// Helpers for the completeness-critic browser checks.
import { chromium } from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';

export const BASE = 'https://blog.123greetings.com';
export const OUT = 'agent-work/completeness';
export const SHOTS = `${OUT}/shots`;
fs.mkdirSync(SHOTS, { recursive: true });
const CACHE = `${OUT}/cache-assets`;
fs.mkdirSync(CACHE, { recursive: true });
const OTHER_CACHES = ['agent-work/verify-functionality/cache', 'agent-work/a11y-verify/cache', 'agent-work/perf-verify/cache'];

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const VIEWPORTS = {
  desktop: { viewport: { width: 1366, height: 900 } },
  mobile: {
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  },
};
export let loads = 0;
export function countLoad() { loads++; }
export const stats = { cached: 0, fetched: 0, r429: 0, f429: 0 };
const STATIC_RE = /^https:\/\/blog\.123greetings\.com\/(wp-content|wp-includes|_jb_static)\//;

export async function launch() { return chromium.launch({ channel: 'chromium' }); }

export async function newCtx(browser, vp, extra = {}) {
  const ctx = await browser.newContext({ ...VIEWPORTS[vp], ...extra });
  await ctx.route(STATIC_RE, async (route) => {
    const url = route.request().url();
    const key = crypto.createHash('sha1').update(url).digest('hex');
    for (const dir of [CACHE, ...OTHER_CACHES]) {
      const f = `${dir}/${key}`;
      if (fs.existsSync(f + '.json') && fs.existsSync(f + '.bin')) {
        const meta = JSON.parse(fs.readFileSync(f + '.json', 'utf8'));
        stats.cached++;
        return route.fulfill({ status: 200, headers: meta.headers, body: fs.readFileSync(f + '.bin') });
      }
    }
    const waits = [0, 4000, 9000, 15000];
    for (let i = 0; i < waits.length; i++) {
      if (waits[i]) { stats.r429++; await sleep(waits[i]); }
      let resp;
      try { resp = await route.fetch({ timeout: 45000 }); } catch (e) { return route.abort().catch(() => {}); }
      if (resp.status() === 429) continue;
      const body = await resp.body();
      const headers = resp.headers();
      if (resp.status() === 200) {
        const keep = {};
        for (const h of ['content-type', 'access-control-allow-origin', 'cache-control']) if (headers[h]) keep[h] = headers[h];
        fs.writeFileSync(`${CACHE}/${key}.bin`, body);
        fs.writeFileSync(`${CACHE}/${key}.json`, JSON.stringify({ url, headers: keep }));
      }
      stats.fetched++;
      return route.fulfill({ response: resp, body });
    }
    stats.f429++;
    return route.fulfill({ status: 429, contentType: 'text/html', body: 'Too Many Requests' });
  });
  return ctx;
}

// attach a request recorder to a context (captures popups too)
export function recordRequests(ctx) {
  const reqs = [];
  const t0 = Date.now();
  const attach = (page) => {
    page.on('request', (r) => {
      reqs.push({ t: Date.now() - t0, url: r.url(), type: r.resourceType(), method: r.method(), post: (r.postData() || '').slice(0, 3000), frame: r.frame() === page.mainFrame() ? 'main' : 'sub' });
    });
  };
  ctx.on('page', attach);
  return { reqs, attach, reset: () => { reqs.length = 0; } };
}
