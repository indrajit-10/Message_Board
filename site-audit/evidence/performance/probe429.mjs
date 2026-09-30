// One isolated page load (no throttling) that records every 429 and its response headers,
// plus timing of when the 429s happen relative to navigation start.
// Usage (from site-audit/): node agent-work/performance/probe429.mjs /tag/alps/
import { chromium } from 'playwright';
const path = process.argv[2] || '/tag/alps/';
const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await browser.newContext({ viewport: { width: 1350, height: 940 } });
const page = await ctx.newPage();
const t0 = Date.now();
const stats = { total: 0, firstParty: 0, s429: [], byStatus: {} };
page.on('response', async (r) => {
  const u = r.url();
  stats.total++;
  if (u.startsWith('https://blog.123greetings.com')) stats.firstParty++;
  stats.byStatus[r.status()] = (stats.byStatus[r.status()] || 0) + 1;
  if (r.status() === 429) {
    const h = await r.allHeaders().catch(() => ({}));
    let body = '';
    try { body = (await r.text()).slice(0, 200).replace(/\s+/g, ' '); } catch {}
    stats.s429.push({ t: Date.now() - t0, url: u.slice(0, 140), h: { server: h.server, 'x-ac': h['x-ac'], 'retry-after': h['retry-after'], 'content-type': h['content-type'], via: h.via, 'x-proxy': h['x-proxy'], 'server-timing': h['server-timing'], 'host-header': h['host-header'] }, body });
  }
});
await page.goto('https://blog.123greetings.com' + path, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(4000);
const fp = stats.s429.filter(x => x.url.startsWith('https://blog.123greetings.com'));
console.log(JSON.stringify({ path, total: stats.total, firstParty: stats.firstParty, byStatus: stats.byStatus, n429: stats.s429.length, n429FirstParty: fp.length, first: stats.s429.slice(0, 3), times: stats.s429.map(x => x.t) }, null, 1));
await browser.close();
