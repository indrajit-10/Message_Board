// Pass 1: axe-core + accessibility tree + keyboard tab walk + text colour/contrast census
// on 10 representative pages, desktop and mobile. ~20 page loads.
// Run: cd /home/user/Message_Board/site-audit && node agent-work/accessibility/a1_axe.mjs [desktop|mobile]
import { launch, newCtx, open, runAxe, save, sleep, loadCount, assetStats, SHOTS } from './lib.mjs';

const PAGES = {
  home: '/',
  birthday: '/birthday-messages/',
  mom: '/birthday-messages-for-mom/',
  angel: '/be-an-angel-day-messages/',
  sympathy: '/sympathy-condolences-messages/',
  post: '/mothers-day-messages-for-wife-what-she-actually-wants/',
  archive: '/archive/',
  tag: '/tag/alps/',
  contact: '/contact-us/',
  e404: '/this-page-does-not-exist-a11y-check/',
};
const vps = process.argv[2] ? [process.argv[2]] : ['desktop', 'mobile'];

const HELPERS = () => {
  window.__sel = (n) => {
    if (!n || !n.tagName) return String(n);
    let s = n.tagName.toLowerCase();
    if (n.id) s += '#' + n.id;
    if (typeof n.className === 'string' && n.className.trim()) s += '.' + n.className.trim().split(/\s+/).slice(0, 3).join('.');
    return s;
  };
  window.__path = (n) => {
    const parts = [];
    for (let x = n; x && x.tagName && parts.length < 5; x = x.parentElement) parts.unshift(window.__sel(x));
    return parts.join(' > ');
  };
};

async function focusInfo(page) {
  return page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const e = document.activeElement;
    if (!e || e === document.body) return { el: 'body' };
    const inIframe = e.tagName === 'IFRAME';
    await wait(350);
    const pick = (s) => ({ outline: `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`, outlineOffset: s.outlineOffset, shadow: s.boxShadow, bg: s.backgroundColor, color: s.color, td: s.textDecorationLine, border: `${s.borderTopColor} ${s.borderTopWidth} ${s.borderBottomColor} ${s.borderBottomWidth}` });
    const f = pick(getComputedStyle(e));
    const r = e.getBoundingClientRect();
    const vw = innerWidth, vh = innerHeight;
    const inViewport = r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < vh && r.left < vw;
    let hiddenBy = null;
    for (let n = e; n && n !== document.documentElement; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.visibility === 'hidden') { hiddenBy = 'visibility:hidden on ' + window.__sel(n); break; }
      if (parseFloat(s.opacity) === 0) { hiddenBy = 'opacity:0 on ' + window.__sel(n); break; }
      if (s.display === 'none') { hiddenBy = 'display:none on ' + window.__sel(n); break; }
    }
    let obscuredBy = null, obscuredPts = 0;
    if (inViewport) {
      const pts = [[0.5, 0.5], [0.1, 0.2], [0.9, 0.8]];
      for (const [px, py] of pts) {
        const x = Math.min(Math.max(r.left + r.width * px, 0), vw - 1), y = Math.min(Math.max(r.top + r.height * py, 0), vh - 1);
        const top = document.elementFromPoint(x, y);
        if (top && !e.contains(top) && !top.contains(e)) { obscuredPts++; obscuredBy = window.__path(top); }
      }
    }
    let nf = null, diff = [];
    if (!inIframe) {
      e.blur();
      await wait(350);
      nf = pick(getComputedStyle(e));
      e.focus({ preventScroll: true });
      diff = Object.keys(f).filter((k) => f[k] !== nf[k]);
    }
    const name = (e.getAttribute('aria-label') || e.innerText || e.value || e.getAttribute('title') || (e.querySelector && e.querySelector('img') && e.querySelector('img').alt) || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    return {
      el: window.__sel(e), path: window.__path(e), role: e.getAttribute('role'), href: (e.getAttribute('href') || '').slice(0, 80), name,
      rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], inViewport, hiddenBy, obscuredBy, obscuredPts,
      focusStyle: f, diff, unfocused: nf,
    };
  });
}

async function axTree(page) {
  const client = await page.context().newCDPSession(page);
  await client.send('Accessibility.enable');
  const { nodes } = await client.send('Accessibility.getFullAXTree');
  const out = { headings: [], landmarks: [], emptyQuotes: 0, links: [], buttonsNoName: [], images: [] };
  const LM = new Set(['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search', 'region', 'form']);
  for (const n of nodes) {
    if (n.ignored) continue;
    const role = n.role?.value, name = (n.name?.value || '').trim();
    if (role === 'heading') {
      const lvl = (n.properties || []).find((p) => p.name === 'level')?.value?.value;
      out.headings.push([lvl, name.slice(0, 80)]);
    }
    if (LM.has(role)) out.landmarks.push([role, name.slice(0, 40)]);
    if ((role === 'StaticText' || role === 'paragraph' || role === 'generic') && /^[“"]\s*[”"]$/.test(name)) out.emptyQuotes++;
    if (role === 'link') out.links.push(name.slice(0, 60));
    if (role === 'button' && !name) out.buttonsNoName.push(n.backendDOMNodeId);
    if (role === 'image' || role === 'img') out.images.push(name.slice(0, 60));
  }
  // also count StaticText “” precisely
  out.staticQuoteNodes = nodes.filter((n) => !n.ignored && n.role?.value === 'StaticText' && /^[“"]\s*[”"]$/.test((n.name?.value || '').trim())).length;
  await client.detach();
  return out;
}

async function census(page) {
  return page.evaluate(() => {
    const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map((x) => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
    const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const bgOf = (el) => {
      let layers = [];
      for (let n = el; n; n = n.parentElement) {
        const s = getComputedStyle(n);
        const c = parse(s.backgroundColor);
        if (s.backgroundImage && s.backgroundImage !== 'none' && !/gradient/.test(s.backgroundImage)) return { img: true, sel: window.__sel(n) };
        if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
      }
      let base = { r: 255, g: 255, b: 255 };
      for (let i = layers.length - 1; i >= 0; i--) { const c = layers[i]; base = { r: c.r * c.a + base.r * (1 - c.a), g: c.g * c.a + base.g * (1 - c.a), b: c.b * c.a + base.b * (1 - c.a) }; }
      return base;
    };
    const groups = {};
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const t = walker.currentNode; if (!t.nodeValue.trim()) continue;
      const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
      const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
      const s = getComputedStyle(el); if (s.visibility === 'hidden') continue;
      let hid = false; for (let n = el; n; n = n.parentElement) { const ss = getComputedStyle(n); if (ss.display === 'none' || parseFloat(ss.opacity) === 0) { hid = true; break; } } if (hid) continue;
      const fg = parse(s.color); const bg = bgOf(el);
      if (bg.img) continue;
      const fgc = fg.a < 1 ? { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a) } : fg;
      const L1 = lum(fgc), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const size = parseFloat(s.fontSize), weight = parseInt(s.fontWeight);
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const key = `${s.color} on rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)}) ${size}px/${weight}`;
      if (!groups[key]) groups[key] = { key, ratio: +ratio.toFixed(2), large, count: 0, sample: [], need: large ? 3 : 4.5 };
      groups[key].count++;
      if (groups[key].sample.length < 3) groups[key].sample.push(window.__sel(el) + ' "' + t.nodeValue.trim().slice(0, 40) + '"');
    }
    return Object.values(groups).sort((a, b) => b.count - a.count);
  });
}

async function extras(page) {
  return page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const cc = document.querySelector('.cc-window, .cc-banner, [aria-label*="cookie" i]');
    let cookie = null;
    if (cc) {
      const r = cc.getBoundingClientRect(); const s = getComputedStyle(cc);
      cookie = { sel: window.__sel(cc), role: cc.getAttribute('role'), ariaLabel: cc.getAttribute('aria-label'), ariaModal: cc.getAttribute('aria-modal'), ariaDescribedby: cc.getAttribute('aria-describedby'),
        visible: s.display !== 'none' && s.visibility !== 'hidden' && r.height > 0, rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
        focusables: [...cc.querySelectorAll('a,button,input,[tabindex]')].map((x) => ({ el: window.__sel(x), tag: x.tagName, role: x.getAttribute('role'), tabindex: x.getAttribute('tabindex'), name: (x.getAttribute('aria-label') || x.innerText || '').trim().slice(0, 40), rect: (() => { const rr = x.getBoundingClientRect(); return [Math.round(rr.width), Math.round(rr.height)]; })() })),
        html: cc.outerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '<svg/>').slice(0, 1500), domIndex: [...document.body.querySelectorAll('*')].indexOf(cc), domTotal: document.body.querySelectorAll('*').length };
    }
    const hb = q('.button-menu-mobile');
    let hamburger = null;
    if (hb) {
      const r = hb.getBoundingClientRect(); const s = getComputedStyle(hb);
      hamburger = { sel: window.__sel(hb), tag: hb.tagName, tabIndex: hb.tabIndex, role: hb.getAttribute('role'), ariaLabel: hb.getAttribute('aria-label'), ariaExpanded: hb.getAttribute('aria-expanded'), visible: s.display !== 'none' && r.width > 0 && r.top < innerHeight, rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], parentTag: hb.parentElement.tagName, parentTab: hb.parentElement.tabIndex };
    }
    const ally = [...document.querySelectorAll('[class*="ea11y"], [id*="ea11y"], [class*="ally-widget"], #ea11y-root')].map((x) => window.__sel(x)).slice(0, 5);
    const anims = document.getAnimations().map((a) => ({ target: a.effect && a.effect.target ? window.__sel(a.effect.target) : '?', name: a.animationName || a.transitionProperty || a.constructor.name, dur: a.effect?.getTiming?.().duration, iter: a.effect?.getTiming?.().iterations })).slice(0, 30);
    const iframes = [...document.querySelectorAll('iframe')].map((f) => { const r = f.getBoundingClientRect(); return { src: (f.src || '').slice(0, 90), title: f.title, ariaHidden: f.getAttribute('aria-hidden'), tabindex: f.getAttribute('tabindex'), w: Math.round(r.width), h: Math.round(r.height), id: f.id }; });
    const recaptcha = q('.grecaptcha-badge') ? (() => { const r = q('.grecaptcha-badge').getBoundingClientRect(); return { rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], vis: getComputedStyle(q('.grecaptcha-badge')).visibility }; })() : null;
    const fixed = [...document.querySelectorAll('body *')].filter((x) => { const s = getComputedStyle(x); return (s.position === 'fixed' || s.position === 'sticky') && s.display !== 'none' && s.visibility !== 'hidden'; }).map((x) => { const r = x.getBoundingClientRect(); return { el: window.__sel(x), pos: getComputedStyle(x).position, rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] }; }).filter((x) => x.rect[2] > 0 && x.rect[3] > 0).slice(0, 20);
    return { cookie, hamburger, ally, anims, iframes, recaptcha, fixed, docH: document.documentElement.scrollHeight, scrollW: document.documentElement.scrollWidth };
  });
}

const browser = await launch();
const results = {};
for (const vp of vps) {
  const ctx = await newCtx(browser, vp);
  await ctx.addInitScript(HELPERS);
  for (const [key, path] of Object.entries(PAGES)) {
    const t0 = Date.now();
    const { page, log } = await open(ctx, path, { wait: 6000 });
    const rec = { vp, key, path, log };
    try {
      rec.extras = await extras(page);
      rec.axe = await runAxe(page);
      rec.ax = await axTree(page);
      rec.census = await census(page);
      await page.screenshot({ path: `${SHOTS}/${vp}_${key}_top.png` });
      // keyboard walk from the top of the document
      await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
      await page.waitForTimeout(500);
      const N = vp === 'desktop' ? 30 : 22;
      rec.tabs = [];
      for (let i = 0; i < N; i++) {
        await page.keyboard.press('Tab');
        const fi = await focusInfo(page);
        rec.tabs.push(fi);
        if (key === 'home' && i < 10) await page.screenshot({ path: `${SHOTS}/${vp}_home_tab${String(i + 1).padStart(2, '0')}.png` });
      }
    } catch (e) {
      rec.error = String(e).slice(0, 400);
    }
    results[`${vp}:${key}`] = rec;
    console.log(vp, key, log.status, 'violations', rec.axe?.violations.map((v) => `${v.id}(${v.count})`).join(' '), 'err', rec.error || '', 'ms', Date.now() - t0);
    save(`a1_${vp}`, Object.fromEntries(Object.entries(results).filter(([k]) => k.startsWith(vp))));
    await page.close();
    await sleep(6000);
  }
  await ctx.close();
}
await browser.close();
console.log('loads', loadCount(), 'assets', JSON.stringify(assetStats));
