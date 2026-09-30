// Pass 2: targeted manual checks. ~14 page loads. Never submits forms.
// Run: cd /home/user/Message_Board/site-audit && node agent-work/accessibility/a2_manual.mjs [section...]
import { launch, newCtx, open, runAxe, save, sleep, loadCount, assetStats, SHOTS } from './lib.mjs';

const only = process.argv.slice(2);
const want = (s) => only.length === 0 || only.includes(s);
const HELPERS = () => {
  window.__sel = (n) => {
    if (!n || !n.tagName) return String(n);
    let s = n.tagName.toLowerCase();
    if (n.id) s += '#' + n.id;
    if (typeof n.className === 'string' && n.className.trim()) s += '.' + n.className.trim().split(/\s+/).slice(0, 3).join('.');
    return s;
  };
};
const TEXT_SPACING = `*{line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important}p{margin-bottom:2em !important}`;

async function clipped(page) {
  return page.evaluate(() => {
    const out = [];
    for (const e of document.querySelectorAll('body *')) {
      if (!e.childNodes || ![...e.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim())) continue;
      const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
      // walk up to 4 ancestors looking for a clipping box that is smaller than its content
      for (let a = e, i = 0; a && i < 4; a = a.parentElement, i++) {
        const s = getComputedStyle(a);
        if (s.display === 'none' || s.visibility === 'hidden') break;
        const clipY = /(hidden|clip)/.test(s.overflowY), clipX = /(hidden|clip)/.test(s.overflowX);
        if ((clipY && a.scrollHeight > a.clientHeight + 2) || (clipX && a.scrollWidth > a.clientWidth + 2)) {
          if (a.clientHeight === 0) break; // intentionally collapsed
          out.push({ el: window.__sel(e), box: window.__sel(a), text: e.textContent.trim().slice(0, 50), sh: a.scrollHeight, ch: a.clientHeight, sw: a.scrollWidth, cw: a.clientWidth });
          break;
        }
      }
    }
    return out.slice(0, 25);
  });
}

async function focusDesc(page) {
  return page.evaluate(() => {
    const e = document.activeElement; if (!e || e === document.body) return { el: 'body' };
    const r = e.getBoundingClientRect(); const vw = innerWidth, vh = innerHeight;
    const inVP = r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < vh && r.left < vw;
    let covered = 0, by = null;
    if (inVP) for (const [px, py] of [[0.5, 0.5], [0.1, 0.2], [0.9, 0.8]]) {
      const x = Math.min(Math.max(r.left + r.width * px, 0), vw - 1), y = Math.min(Math.max(r.top + r.height * py, 0), vh - 1);
      const t = document.elementFromPoint(x, y); if (t && !e.contains(t) && !t.contains(e)) { covered++; let f = t; while (f && getComputedStyle(f).position !== 'fixed' && getComputedStyle(f).position !== 'sticky') f = f.parentElement; by = window.__sel(f || t); }
    }
    return { el: window.__sel(e), name: (e.getAttribute('aria-label') || e.innerText || e.value || '').trim().replace(/\s+/g, ' ').slice(0, 40), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], inVP, covered, by };
  });
}

const browser = await launch();
const R = {};

// ---------------- A: desktop ----------------
if (want('A')) {
  const ctx = await newCtx(browser, 'desktop');
  await ctx.addInitScript(HELPERS);

  // A1 contact form
  {
    const { page, log } = await open(ctx, '/contact-us/', { wait: 6000 });
    const rec = { log };
    rec.axe = await runAxe(page);
    const fields = await page.$$('form.wpcf7-form input:not([type=hidden]), form.wpcf7-form textarea');
    rec.fields = [];
    for (const f of fields) {
      const info = await f.evaluate((e) => ({ name: e.name, type: e.type, placeholder: e.placeholder, autocomplete: e.getAttribute('autocomplete'), required: e.required, ariaRequired: e.getAttribute('aria-required'), id: e.id, labels: e.labels ? e.labels.length : 0, phColor: getComputedStyle(e, '::placeholder').color, bg: getComputedStyle(e).backgroundColor, border: getComputedStyle(e).borderTopColor + ' ' + getComputedStyle(e).borderTopWidth, hidden: getComputedStyle(e.closest('p') || e).display === 'none' }));
      rec.fields.push(info);
    }
    // AX names via snapshot of form
    rec.axForm = await page.accessibility.snapshot({ root: await page.$('form.wpcf7-form') }).catch((e) => String(e));
    // trigger client-side validation (change event) without submitting
    await page.fill('input[name="your-email"]', 'abc');
    await page.focus('input[name="your-email"]');
    await page.keyboard.press('Tab');
    await page.fill('input[name="your-name"]', 'x');
    await page.fill('input[name="your-name"]', '');
    await page.focus('input[name="your-name"]');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1500);
    rec.afterValidation = await page.evaluate(() => {
      const f = document.querySelector('form.wpcf7-form');
      const lum = (c) => { const m = c.match(/\d+(\.\d+)?/g).map(Number); const g = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * g(m[0]) + 0.7152 * g(m[1]) + 0.0722 * g(m[2]); };
      const tips = [...f.querySelectorAll('.wpcf7-not-valid-tip')].map((t) => { const s = getComputedStyle(t); const L1 = lum(s.color), L2 = lum('rgb(255,255,255)'); return { text: t.textContent, ariaHidden: t.getAttribute('aria-hidden'), color: s.color, fontSize: s.fontSize, ratioOnWhite: +((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2), field: t.closest('[data-name]')?.dataset.name }; });
      const inputs = [...f.querySelectorAll('input:not([type=hidden]),textarea')].map((i) => ({ name: i.name, ariaInvalid: i.getAttribute('aria-invalid'), describedby: i.getAttribute('aria-describedby'), describedText: i.getAttribute('aria-describedby') ? (document.getElementById(i.getAttribute('aria-describedby'))?.textContent || null) : null, border: getComputedStyle(i).borderTopColor }));
      const srr = document.querySelector('.screen-reader-response'); return { tips, inputs, srStatus: srr?.querySelector('[role=status]')?.textContent, srList: srr?.querySelector('ul')?.innerText, dataStatus: f.getAttribute('data-status') };
    });
    await page.screenshot({ path: `${SHOTS}/desktop_contact_validation.png`, fullPage: false });
    // text spacing
    await page.addStyleTag({ content: TEXT_SPACING });
    await page.waitForTimeout(500);
    rec.textSpacingClipped = await clipped(page);
    R.contact = rec;
    console.log('A1 contact', log.status, JSON.stringify(rec.afterValidation).slice(0, 300));
    await page.close();
    await sleep(6000);
  }

  // A2 post: collapsed "show more" content and focus
  {
    const { page, log } = await open(ctx, '/mothers-day-messages-for-wife-what-she-actually-wants/', { wait: 6000 });
    const rec = { log };
    rec.smore = await page.evaluate(() => {
      const c = document.querySelector('.penci-single-smore, .container-single');
      const btns = [...document.querySelectorAll('[class*="smore"], [class*="show-more"], [class*="readmore"], .penci-show-more')].map((b) => { const r = b.getBoundingClientRect(); const s = getComputedStyle(b); return { el: window.__sel(b), tag: b.tagName, text: b.innerText.trim().slice(0, 40), role: b.getAttribute('role'), tabIndex: b.tabIndex, href: b.getAttribute('href'), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], display: s.display, maxH: s.maxHeight, overflow: s.overflow }; });
      const entry = document.querySelector('.post-entry');
      const s = entry ? getComputedStyle(entry) : null;
      const er = entry?.getBoundingClientRect();
      const inner = document.querySelector('#penci-post-entry-inner');
      const links = inner ? [...inner.querySelectorAll('a[href]')].map((a) => { const r = a.getBoundingClientRect(); return { text: a.innerText.trim().slice(0, 40), top: Math.round(r.top + scrollY) }; }) : [];
      return { containerClass: c?.className, btns: btns.slice(0, 10), entryMaxH: s?.maxHeight, entryOverflow: s?.overflow, entryH: er && Math.round(er.height), entryTop: er && Math.round(er.top + scrollY), entryScrollH: entry?.scrollHeight, links };
    });
    // Tab to the 12th stop observed earlier and screenshot
    await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
    const stops = [];
    for (let i = 0; i < 14; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(250); stops.push(await focusDesc(page)); if (i === 11) await page.screenshot({ path: `${SHOTS}/desktop_post_tab12.png` }); }
    rec.stops = stops;
    rec.commentFields = await page.evaluate(() => [...document.querySelectorAll('#commentform input:not([type=hidden]), #commentform textarea')].map((e) => ({ id: e.id, placeholder: e.placeholder, labels: e.labels?.length || 0, autocomplete: e.getAttribute('autocomplete'), ariaLabel: e.getAttribute('aria-label'), required: e.required, ariaRequired: e.getAttribute('aria-required') })));
    await page.addStyleTag({ content: TEXT_SPACING });
    await page.waitForTimeout(500);
    rec.textSpacingClipped = await clipped(page);
    R.post = rec;
    console.log('A2 post', log.status, JSON.stringify(rec.smore).slice(0, 400));
    await page.close();
    await sleep(6000);
  }

  // A3 home: card focus colours, Read More toggle, text spacing
  {
    const { page, log } = await open(ctx, '/', { wait: 6000 });
    const rec = { log };
    // Focus the "Anniversary" card title via keyboard path: focus programmatically after a keyboard Tab (so :focus-visible applies)
    await page.keyboard.press('Tab');
    const cardInfo = [];
    for (const name of ['Anniversary', 'Thank You', 'Birthday']) {
      const h = page.locator('.elementor-icon-box-title a, .elementor-image-box-title a, h3 a').filter({ hasText: new RegExp(`^\\s*${name}\\s*$`) }).first();
      await h.focus();
      await page.waitForTimeout(600);
      const info = await h.evaluate((a) => {
        const s = getComputedStyle(a); let bg = null, n = a;
        while (n && (!bg || bg === 'rgba(0, 0, 0, 0)')) { bg = getComputedStyle(n).backgroundColor; if (bg === 'rgba(0, 0, 0, 0)') n = n.parentElement; }
        const r = a.getBoundingClientRect();
        return { color: s.color, outline: s.outlineStyle + ' ' + s.outlineWidth, effectiveBg: bg, bgFrom: window.__sel(n), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] };
      });
      const box = await h.evaluate((a) => { const c = a.closest('.elementor-widget, .e-con'); const r = c.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
      await page.screenshot({ path: `${SHOTS}/desktop_home_focus_${name.replace(/\s/g, '')}.png`, clip: { x: Math.max(0, box[0] - 10), y: Math.max(0, box[1] - 10), width: Math.min(box[2] + 20, 1366), height: Math.min(box[3] + 20, 900) } }).catch(() => {});
      cardInfo.push({ name, ...info });
    }
    rec.cardFocus = cardInfo;
    // Read More toggle
    rec.toggle = await page.evaluate(async () => {
      const t = document.querySelector('.read-toggle'); const w = document.querySelector('.read-more-content');
      const before = { text: t.textContent, ariaExpanded: t.getAttribute('aria-expanded'), ariaControls: t.getAttribute('aria-controls'), role: t.getAttribute('role'), hiddenH: [...w.querySelectorAll('.hidden-content')].map((h) => h.getBoundingClientRect().height) };
      t.focus();
      return before;
    });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(900);
    rec.toggleAfter = await page.evaluate(() => { const t = document.querySelector('.read-toggle'); const w = document.querySelector('.read-more-content'); return { text: t.textContent, ariaExpanded: t.getAttribute('aria-expanded'), active: w.classList.contains('active'), hiddenH: [...w.querySelectorAll('.hidden-content')].map((h) => Math.round(h.getBoundingClientRect().height)), focus: window.__sel(document.activeElement), url: location.href }; });
    // Space key on the toggle (it's a link, so Space should scroll the page rather than toggle)
    const y0 = await page.evaluate(() => scrollY);
    await page.focus('.read-toggle');
    await page.keyboard.press('Space');
    await page.waitForTimeout(900);
    rec.toggleSpace = await page.evaluate((y0) => ({ text: document.querySelector('.read-toggle').textContent, scrolled: scrollY - y0 }), y0);
    // CSE search input label
    rec.cse = await page.evaluate(() => { const i = document.querySelector('#gsc-i-id1'); if (!i) return null; return { ariaLabel: i.getAttribute('aria-label'), placeholder: i.placeholder, title: i.title, labels: i.labels?.length, type: i.type }; });
    await page.evaluate(() => scrollTo(0, 0));
    await page.addStyleTag({ content: TEXT_SPACING });
    await page.waitForTimeout(600);
    rec.textSpacingClipped = await clipped(page);
    await page.screenshot({ path: `${SHOTS}/desktop_home_textspacing.png`, fullPage: false });
    R.home = rec;
    console.log('A3 home', log.status, JSON.stringify(rec.cardFocus), JSON.stringify(rec.toggleAfter));
    await page.close();
    await sleep(6000);
  }

  // A4 birthday hub: Shift+Tab upward from the footer under the sticky header (2.4.11), jump menu names
  {
    const { page, log } = await open(ctx, '/birthday-messages/', { wait: 6000 });
    const rec = { log };
    rec.jump = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].filter((a) => a.querySelector('img')).map((a) => ({ text: a.innerText.trim(), img: a.querySelector('img').alt, title: a.querySelector('img').title })).slice(0, 8));
    const client = await ctx.newCDPSession(page);
    await client.send('Accessibility.enable');
    const { nodes } = await client.send('Accessibility.getFullAXTree');
    rec.axLinkNames = nodes.filter((n) => !n.ignored && n.role?.value === 'link' && /arrow/i.test(n.name?.value || '')).map((n) => n.name.value).slice(0, 10);
    // go to bottom, focus last footer link, then Shift+Tab upwards
    await page.evaluate(() => { const a = [...document.querySelectorAll('#footer-section-container a')].pop(); a.focus(); });
    await page.waitForTimeout(500);
    const back = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Shift+Tab'); await page.waitForTimeout(450);
      const d = await focusDesc(page); back.push(d);
      if (d.covered >= 2 && !rec.shot) { rec.shot = `desktop_birthday_shifttab_${i}.png`; await page.screenshot({ path: `${SHOTS}/${rec.shot}` }); }
    }
    rec.shiftTab = back;
    rec.sticky = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((x) => { const s = getComputedStyle(x); return (s.position === 'fixed' || s.position === 'sticky') && s.display !== 'none'; }).map((x) => { const r = x.getBoundingClientRect(); return { el: window.__sel(x), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] }; }).filter((x) => x.rect[2] && x.rect[3]));
    await page.addStyleTag({ content: TEXT_SPACING });
    await page.waitForTimeout(500);
    rec.textSpacingClipped = await clipped(page);
    R.birthday = rec;
    console.log('A4 birthday', log.status, 'covered stops', back.filter((b) => b.covered).length, JSON.stringify(rec.axLinkNames));
    await page.close();
    await sleep(6000);
  }
  await ctx.close();
  save('a2_A', R);
}

// ---------------- B: mobile hamburger ----------------
if (want('B')) {
  const ctx = await newCtx(browser, 'mobile');
  await ctx.addInitScript(HELPERS);
  const { page, log } = await open(ctx, '/birthday-messages-for-mom/', { wait: 6000 });
  const rec = { log };
  const state = () => page.evaluate(() => { const oc = document.querySelector('#penci_off_canvas'); const r = oc.getBoundingClientRect(); const hb = document.querySelector('.button-menu-mobile'); return { offcanvasLeft: Math.round(r.left), bodyClass: document.body.className.split(' ').filter((c) => /menu|open|sidebar|nav/i.test(c)), active: window.__sel(document.activeElement), hbExpanded: hb.getAttribute('aria-expanded'), close: (() => { const c = document.querySelector('.close-mobile-menu-builder'); const cr = c.getBoundingClientRect(); return { rect: [Math.round(cr.left), Math.round(cr.top), Math.round(cr.width), Math.round(cr.height)], name: c.getAttribute('aria-label') }; })() }; });
  rec.before = await state();
  // keyboard: try Enter/Space on hamburger after focusing via Tab? it's not focusable; try element.focus()
  rec.focusable = await page.evaluate(() => { const hb = document.querySelector('.button-menu-mobile'); hb.focus(); return document.activeElement === hb; });
  await page.tap('.button-menu-mobile');
  await page.waitForTimeout(1200);
  rec.afterTap = await state();
  await page.screenshot({ path: `${SHOTS}/mobile_menu_open.png` });
  const tabs = [];
  for (let i = 0; i < 8; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(250); tabs.push(await focusDesc(page)); }
  rec.tabsWhileOpen = tabs;
  await page.keyboard.press('Escape');
  await page.waitForTimeout(900);
  rec.afterEscape = await state();
  R.mobileMenu = rec;
  console.log('B mobile menu', JSON.stringify(rec).slice(0, 1500));
  await page.close();
  await ctx.close();
  save('a2_B', rec);
  await sleep(6000);
}

// ---------------- C: reflow at 320 CSS px ----------------
if (want('C')) {
  const ctx = await newCtx(browser, 'reflow');
  await ctx.addInitScript(HELPERS);
  const pages = { home: '/', birthday: '/birthday-messages/', mom: '/birthday-messages-for-mom/', post: '/mothers-day-messages-for-wife-what-she-actually-wants/', contact: '/contact-us/', tag: '/tag/alps/', archive: '/archive/' };
  const C = {};
  for (const [k, p] of Object.entries(pages)) {
    const { page, log } = await open(ctx, p, { wait: 6000 });
    const rec = { log };
    rec.m = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const off = [];
      for (const e of document.querySelectorAll('body *')) {
        const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
        const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none') continue;
        let fixedAnc = false; for (let a = e; a; a = a.parentElement) { const ps = getComputedStyle(a).position; if (ps === 'fixed') { fixedAnc = true; break; } }
        if (fixedAnc) continue;
        if (r.right > vw + 1 && r.left < vw) off.push({ el: window.__sel(e), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width), text: (e.innerText || '').trim().slice(0, 30) });
      }
      // keep deepest (drop ancestors of others)
      const cc = document.querySelector('.cc-window'); const ccr = cc?.getBoundingClientRect();
      return { vw, scrollW: document.documentElement.scrollWidth, bodyScrollW: document.body.scrollWidth, innerH: innerHeight, offenders: off.slice(-15), nOff: off.length, cookie: ccr ? [Math.round(ccr.left), Math.round(ccr.top), Math.round(ccr.width), Math.round(ccr.height)] : null, cookieCoverPct: ccr ? Math.round(100 * Math.min(ccr.height, innerHeight) / innerHeight) : null, header: (() => { const h = document.querySelector('.penci_navbar_mobile'); if (!h) return null; const r = h.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), getComputedStyle(h.querySelector('.penci_mobile_midbar') || h).position]; })() };
    });
    await page.screenshot({ path: `${SHOTS}/reflow320_${k}.png` });
    // scroll a bit and screenshot to see the sticky mobile header + cookie banner occupancy
    await page.evaluate(() => scrollTo(0, 700)); await page.waitForTimeout(700);
    rec.afterScroll = await page.evaluate(() => { const fixed = [...document.querySelectorAll('body *')].filter((x) => { const s = getComputedStyle(x); return (s.position === 'fixed' || s.position === 'sticky') && s.display !== 'none' && s.visibility !== 'hidden'; }).map((x) => { const r = x.getBoundingClientRect(); return { el: window.__sel(x), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] }; }).filter((x) => x.rect[2] > 0 && x.rect[3] > 0 && x.rect[0] + x.rect[2] > 0 && x.rect[1] < innerHeight && x.rect[1] + x.rect[3] > 0); return fixed; });
    await page.screenshot({ path: `${SHOTS}/reflow320_${k}_scrolled.png` });
    C[k] = rec;
    console.log('C', k, log.status, JSON.stringify(rec.m).slice(0, 700));
    await page.close();
    await sleep(6000);
  }
  await ctx.close();
  save('a2_C', C);
}

// ---------------- D: reduced motion ----------------
if (want('D')) {
  const ctx = await newCtx(browser, 'desktop', { reducedMotion: 'reduce' });
  await ctx.addInitScript(HELPERS);
  const { page, log } = await open(ctx, '/', { wait: 6000 });
  const rec = { log };
  rec.mm = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  rec.htmlScrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  rec.transitions = await page.evaluate(() => { const out = {}; for (const e of document.querySelectorAll('body *')) { const s = getComputedStyle(e); if (s.transitionDuration && s.transitionDuration !== '0s') { const k = s.transitionProperty + ' ' + s.transitionDuration; out[k] = (out[k] || 0) + 1; } } return Object.entries(out).sort((a, b) => b[1] - a[1]).slice(0, 12); });
  rec.animations = await page.evaluate(() => { const out = {}; for (const e of document.querySelectorAll('body *')) { const s = getComputedStyle(e); if (s.animationName && s.animationName !== 'none') { const k = s.animationName + ' ' + s.animationDuration + ' x' + s.animationIterationCount; out[k] = (out[k] || []).concat(window.__sel(e)).slice(0, 3); } } return out; });
  await page.click('.read-toggle');
  await page.waitForTimeout(100);
  rec.toggleAnim = await page.evaluate(() => document.getAnimations().map((a) => ({ t: a.effect?.target ? window.__sel(a.effect.target) : '?', p: a.transitionProperty || a.animationName, d: a.effect?.getTiming?.().duration })).slice(0, 8));
  // go-to-top smooth scroll?
  await page.evaluate(() => scrollTo(0, 3000)); await page.waitForTimeout(800);
  const gt = await page.$('.penci-go-to-top-floating');
  rec.goTop = await page.evaluate(() => { const g = document.querySelector('.penci-go-to-top-floating'); const r = g.getBoundingClientRect(); return { tag: g.tagName, tabIndex: g.tabIndex, role: g.getAttribute('role'), name: g.getAttribute('aria-label'), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], vis: getComputedStyle(g).opacity + '/' + getComputedStyle(g).visibility }; });
  if (gt) { await gt.click().catch(() => {}); const ys = []; for (let i = 0; i < 6; i++) { await page.waitForTimeout(120); ys.push(await page.evaluate(() => Math.round(scrollY))); } rec.goTopScrollYs = ys; }
  R.reduced = rec;
  console.log('D reduced', JSON.stringify(rec).slice(0, 1500));
  await page.close();
  await ctx.close();
  save('a2_D', rec);
}

await browser.close();
console.log('loads', loadCount(), 'assets', JSON.stringify(assetStats));
