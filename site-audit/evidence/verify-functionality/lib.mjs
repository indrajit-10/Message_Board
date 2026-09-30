// Shared helpers for the UX audit scripts.
import { chromium } from 'playwright';
import fs from 'node:fs';

export const BASE = 'https://blog.123greetings.com';
export const OUT = 'agent-work/verify-functionality';
export const SHOTS = `${OUT}/shots`;
fs.mkdirSync(SHOTS, { recursive: true });

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
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let loads = 0;
export function loadCount() { return loads; }

// init script: collect layout shifts and long tasks
const INIT = () => {
  window.__cls = { value: 0, entries: [] };
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) {
          window.__cls.value += e.value;
          window.__cls.entries.push({
            t: Math.round(e.startTime),
            v: +e.value.toFixed(4),
            src: (e.sources || []).map((s) => {
              const n = s.node;
              if (!n || !n.tagName) return '?';
              return (n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/).slice(0, 3).join('.') : '')).slice(0, 120);
            }),
          });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}
};

// Disk cache for versioned first-party static assets, with backoff on 429.
// Other audit agents share our egress IP, so WordPress.com rate-limits static
// files; caching keeps our footprint small and makes renders complete.
import crypto from 'node:crypto';
const CACHE = `${OUT}/cache`;
fs.mkdirSync(CACHE, { recursive: true });
export const assetStats = { cached: 0, fetched: 0, retried429: 0, failed429: 0, forcedFail: 0 };
const STATIC_RE = /^https:\/\/blog\.123greetings\.com\/(wp-content|wp-includes|_jb_static)\//;

export async function newCtx(browser, vp, extra = {}, { failRe = null } = {}) {
  const ctx = await browser.newContext({ ...VIEWPORTS[vp], ...extra });
  await ctx.addInitScript(INIT);
  await ctx.route(STATIC_RE, async (route) => {
    const url = route.request().url();
    if (failRe && failRe.test(url)) {
      assetStats.forcedFail++;
      return route.fulfill({ status: 429, contentType: 'text/html', body: 'Too Many Requests (simulated)' });
    }
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

// open a page with full logging
export async function open(ctx, path, { wait = 6000, waitUntil = 'load' } = {}) {
  const page = await ctx.newPage();
  const log = { path, console: [], pageErrors: [], failed: [], http: [], requests: [] };
  page.on('console', (m) => {
    if (['error', 'warning'].includes(m.type())) {
      const loc = m.location();
      log.console.push({ type: m.type(), text: m.text().slice(0, 400), url: loc?.url?.slice(0, 200), line: loc?.lineNumber });
    }
  });
  page.on('pageerror', (e) => log.pageErrors.push({ msg: String(e.message || e).slice(0, 300), stack: String(e.stack || '').slice(0, 800) }));
  page.on('requestfailed', (r) => {
    const f = r.failure()?.errorText || '';
    log.failed.push(`${f} ${r.url().slice(0, 220)}`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400) log.http.push(`${r.status()} ${r.url().slice(0, 220)}`);
  });
  const t0 = Date.now();
  let resp = null;
  try {
    resp = await page.goto(BASE + path, { waitUntil, timeout: 60000 });
  } catch (e) {
    log.navError = String(e).slice(0, 300);
  }
  loads++;
  log.status = resp?.status();
  log.finalUrl = page.url();
  log.loadMs = Date.now() - t0;
  await page.waitForTimeout(wait);
  return { page, log };
}

// open, and if first-party assets were rate-limited (429), wait and retry once
export async function openClean(ctx, path, opts = {}) {
  let r = await open(ctx, path, opts);
  const n429 = (l) => l.http.filter((h) => h.startsWith('429') && h.includes('blog.123greetings.com')).length;
  if (n429(r.log) > 0) {
    const first = r.log;
    await r.page.close();
    console.error(`429s on ${path} (${n429(first)}), waiting 45s and retrying`);
    await sleep(45000);
    r = await open(ctx, path, opts);
    r.log.retriedAfter429 = n429(first);
  }
  r.log.n429 = n429(r.log);
  return r;
}

export async function cls(page) {
  return page.evaluate(() => window.__cls);
}

export async function launch() {
  return chromium.launch({ channel: 'chromium' });
}

export function save(name, data) {
  fs.writeFileSync(`${OUT}/${name}.json`, JSON.stringify(data, null, 1));
}
