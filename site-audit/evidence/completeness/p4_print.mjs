// Print output of a message page: what prints, how many pages, print CSS present?
import fs from 'node:fs';
import { BASE, OUT, SHOTS, launch, newCtx, sleep, stats } from './lib.mjs';
const PATH = process.argv[2] || '/birthday-messages/';
const browser = await launch();
const ctx = await newCtx(browser, 'desktop');
const page = await ctx.newPage();
await page.goto(BASE + PATH, { waitUntil: 'load', timeout: 90000 });
await sleep(10000);
const css = await page.evaluate(() => {
  let printRules = 0, printSheets = [], total = 0, crossOrigin = 0;
  for (const s of document.styleSheets) {
    const media = s.media && s.media.mediaText;
    if (media && /print/.test(media)) printSheets.push((s.href || 'inline').slice(0, 120) + ' [' + media + ']');
    let rules; try { rules = s.cssRules; } catch (e) { crossOrigin++; continue; }
    total++;
    for (const r of rules) if (r.media && /print/.test(r.media.mediaText)) printRules += r.cssRules.length;
  }
  return { printRules, printSheets, sheetsRead: total, crossOrigin };
});
await page.emulateMedia({ media: 'print' });
await sleep(1000);
const vis = await page.evaluate(() => {
  const q = (sel) => Array.from(document.querySelectorAll(sel)).filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; });
  const box = (sel) => { const els = q(sel); if (!els.length) return null; const r = els[0].getBoundingClientRect(); return { n: els.length, h: Math.round(r.height), y: Math.round(r.y + scrollY) }; };
  return {
    header: box('#header, .penci-header-wrap, header, .elementor-location-header, [data-elementor-type="header"]'),
    mobileNav: box('.penci_navbar_mobile'),
    cookieBanner: box('.cc-window'),
    footer: box('#footer-section, footer, .elementor-location-footer, [data-elementor-type="footer"], .penci-footer'),
    copyButtons: q('.copy-btn, .copy-button, [class*="copy"] svg, button[class*="copy"], .copy-icon, [onclick*="copy"]').length,
    sidebar: box('#sidebar, .penci-sidebar-content, aside'),
    adContainers: q('[id^="TR-"], [id^="div-gpt"], iframe[id^="google_ads"]').length,
    grecaptcha: box('.grecaptcha-badge'),
    backToTop: box('.penci-go-to-top-floating, #penci-go-to-top, .go-to-top'),
    h1: Array.from(document.querySelectorAll('h1')).filter((h) => h.offsetParent).map((h) => h.innerText.trim().slice(0, 60)),
    docH: document.documentElement.scrollHeight,
  };
});
await page.screenshot({ path: `${SHOTS}/p4_print${PATH.replace(/\W+/g, '_')}.png`, fullPage: false });
await page.setViewportSize({ width: 816, height: 1056 });
await sleep(800);
await page.screenshot({ path: `${SHOTS}/p4_printletter${PATH.replace(/\W+/g, '_')}.png`, fullPage: true });
const pdf = await page.pdf({ format: 'Letter', printBackground: false });
fs.writeFileSync(`${OUT}/p4_print${PATH.replace(/\W+/g, '_')}.pdf`, pdf);
const nPages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
// message count on page for words-per-page ratio
const msgs = await page.evaluate(() => document.querySelectorAll('blockquote, .elementor-widget-text-editor p').length);
const out = { PATH, css, vis, nPages, pdfBytes: pdf.length, msgs, stats };
fs.writeFileSync(`${OUT}/p4_print${PATH.replace(/\W+/g, '_')}.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
