// Are empty message blocks, duplicate H1s and the side "Emotions" menu actually visible?
import { chromium } from 'playwright';
const pages = ['/national-tap-dance-day-messages/', '/birthday-messages-for-mom/', '/be-an-angel-day-messages/', '/messages-for-5th-anniversary/', '/cousins-day-messages/', '/birthday-messages-for-grandma/'];
const widths = [1366, 900, 390];
const browser = await chromium.launch({ channel: 'chromium' });
const out = [];
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 500, hasTouch: w < 500 });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto('https://blog.123greetings.com' + p, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const vis = (el) => { const cs = getComputedStyle(el); const b = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && b.width > 0 && b.height > 0 && !!el.offsetParent; };
      const anyHidden = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return true; } return false; };
      const msgs = [...document.querySelectorAll('.msgs')].map((m) => { const ed = m.querySelector('.elementor-text-editor'); const t = (ed?.innerText || '').trim(); const h = m.querySelector('h1,h2,h3')?.innerText.trim() || ''; return { h, t: t.slice(0, 30), empty: !t.replace(/[“”"' ]/g, ''), visible: vis(m) && !anyHidden(m) }; });
      const h1 = [...document.querySelectorAll('h1')].map((h) => ({ t: h.innerText.trim().replace(/\s+/g, ' '), visible: vis(h) && !anyHidden(h) }));
      const side = [...document.querySelectorAll('.sideCatMenu')].map((s) => ({ text: s.innerText.trim().replace(/\s+/g, ' ').slice(0, 80), visible: vis(s) && !anyHidden(s) }));
      return { emptyVisible: msgs.filter((m) => m.empty && m.visible).map((m) => m.h || '(no heading)'), emptyHidden: msgs.filter((m) => m.empty && !m.visible).length, realVisible: msgs.filter((m) => !m.empty && m.visible).length, realHidden: msgs.filter((m) => !m.empty && !m.visible).length, h1, side };
    });
    out.push({ w, p, ...r });
    console.log(w, p, JSON.stringify(r));
  }
  await ctx.close();
}
await browser.close();
