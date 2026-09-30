// Build one Word document with every audit finding from data/report_data.json.
// Usage: NODE_PATH=<dir with docx installed> node make_docx.js
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType,
  ShadingType, AlignmentType, PageOrientation, LevelFormat, Footer, PageNumber, BorderStyle,
  ExternalHyperlink, PageBreak,
} = require('docx');

const D = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/report_data.json'), 'utf8'));
const K = D.kpis;
const BASE = 'https://blog.123greetings.com';
const clean = (s) => String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
const short = (u) => clean(u).replace(BASE, '') || '/';
const fmt = (n) => Number(n).toLocaleString('en-US');

const INK = '1C2230', MUTED = '5B6477', ACCENT = '2C4FA3', RULE = 'DFE3EA', HEAD_FILL = 'E7EDFA';
const SEV = { critical: '7A1D1D', high: 'B3261E', medium: 'A45F00', low: '5B6477' };

// ---------- helpers
const p = (text, opts = {}) => new Paragraph({ spacing: { after: 120 }, ...opts, children: [new TextRun({ text: clean(text), ...(opts.run || {}) })] });
const runs = (parts, opts = {}) => new Paragraph({ spacing: { after: 120 }, ...opts, children: parts.map((r) => (typeof r === 'string' ? new TextRun(clean(r)) : new TextRun({ ...r, text: clean(r.text) }))) });
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(clean(t))] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(clean(t))] });
const h3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(clean(t))] });
const bullet = (t, level = 0) => new Paragraph({ numbering: { reference: 'bullets', level }, spacing: { after: 60 }, children: [new TextRun(clean(t))] });
const multi = (text, opts = {}) => clean(text).split(/\n+/).filter((x) => x.trim()).map((line) => {
  const m = line.match(/^\s*[-•]\s+(.*)$/);
  return m ? bullet(m[1]) : p(line, opts);
});
const sevRun = (s) => ({ text: String(s).toUpperCase(), bold: true, color: SEV[s] || MUTED, size: 18 });

const border = { style: BorderStyle.SINGLE, size: 4, color: RULE };
const borders = { top: border, bottom: border, left: border, right: border };
function cell(content, width, { header = false, color, bold, size = 18 } = {}) {
  const paras = (Array.isArray(content) ? content : [content]).map((c) =>
    c instanceof Paragraph ? c : new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: clean(c), bold: header || bold, color: header ? INK : color, size })] }));
  return new TableCell({
    width: { size: width, type: WidthType.DXA }, borders,
    shading: header ? { type: ShadingType.CLEAR, color: 'auto', fill: HEAD_FILL } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: paras,
  });
}
function table(columns, widths, rows, opts = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths,
    rows: [
      new TableRow({ tableHeader: true, children: columns.map((c, i) => cell(c, widths[i], { header: true })) }),
      ...rows.map((r) => new TableRow({ cantSplit: opts.cantSplit, children: r.map((c, i) => (c instanceof TableCell ? c : cell(c ?? '', widths[i]))) })),
    ],
  });
}

// ---------- portrait section: summary, priorities, site findings, checks
const S1 = [];
S1.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'SITE AUDIT · 30 SEPTEMBER 2026', color: MUTED, size: 18, bold: true })] }));
S1.push(new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun('blog.123greetings.com — Full Audit Findings')] }));
S1.push(p(`Crawled ${fmt(K.urls)} URLs (every sitemap URL plus every internal link) and requested ${fmt(K.link_targets)} unique link and image targets. All ${K.content_pages} pages and posts were read line by line by review agents, and every finding was re-checked by a second, adversarial agent before it was kept: ${K.rejected} reviewer findings were rejected as false positives or style preferences. Functionality, performance, technical SEO, accessibility and content strategy were tested in a real browser (desktop 1366×900 and mobile 390×844) and each finding was re-tested by a verifier; a completeness critic then covered privacy, ads, security and other gaps.`));
S1.push(runs([{ text: 'Caveats. ', bold: true }, 'Our test IP was rate-limited by WordPress.com (HTTP 429) during parts of the audit, so Lighthouse timings are indicative; re-check them in PageSpeed Insights. Fact corrections were checked against web sources by the verifier, but an editor should confirm them before publishing. Privacy and ad observations describe what a US browser session received and are not legal advice.'], { shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'F5F6F8' } }));

S1.push(h1('Headline numbers'));
S1.push(table(['Measure', 'Result'], [6400, 2960], [
  ['Verified wording and content errors (visible to visitors)', `${fmt(K.errors)} (${K.errors_high} high severity)`],
  ['Editor / AI notes published on live pages', String(K.leaked)],
  ['Factual errors (dates, history, anniversary gifts)', String(K.factual)],
  ['Pages whose title promises more messages than they have', `${K.promise_pages} (short by ${fmt(K.promise_gap)} messages)`],
  ['Thin pages that need more content', `${K.thin} of ${K.content_pages}`],
  ['Broken link targets', `${K.broken} (used ${K.broken_refs} times)`],
  ['Pages carrying a hidden leftover template section', String(K.hidden_pages)],
  ['Site-level issues (UX, speed, SEO, accessibility, strategy, privacy/security)', String(K.site_findings)],
  ['Messages on the whole site', `${fmt(K.messages_total)} (median message page: ${K.median_messages})`],
  ['Tags', `${fmt(K.tags_total)} (${K.tags_0} unused, ${K.tags_1} used once)`],
]));

S1.push(h1('Fix these first'));
D.priorities.forEach((pr) => {
  S1.push(new Paragraph({ numbering: { reference: 'numbers', level: 0 }, spacing: { before: 120, after: 40 }, children: [new TextRun({ text: clean(pr.title), bold: true })] }));
  S1.push(p(pr.detail, { indent: { left: 720 } }));
});

S1.push(new Paragraph({ children: [new PageBreak()] }));
S1.push(h1('Site-level findings'));
S1.push(p('Each finding below was re-tested by a separate verifier. "partly-confirmed" means the problem is real but the verifier corrected numbers, scope or severity; the correction is included in the evidence as [Verifier]. Findings the verifiers refuted are not listed.', { run: { color: MUTED } }));
for (const s of D.site) {
  S1.push(h2(`${s.label} (${s.findings.length})`));
  s.findings.forEach((f, i) => {
    S1.push(h3(`${i + 1}. ${f.title}`));
    S1.push(runs([sevRun(f.severity), { text: `   ·   ${f.verdict || ''}${f.count ? `   ·   ${f.count} affected` : ''}`, color: MUTED, size: 18 }]));
    const urls = (f.urls || []).filter(Boolean);
    if (urls.length) S1.push(runs([{ text: 'Affected: ', bold: true }, urls.slice(0, 12).map(short).join(', ') + (urls.length > 12 ? ` (+${urls.length - 12} more)` : '')]));
    S1.push(runs([{ text: 'Evidence', bold: true, color: ACCENT }], { spacing: { after: 40 } }));
    multi(f.evidence).forEach((x) => S1.push(x));
    S1.push(runs([{ text: 'Fix', bold: true, color: ACCENT }], { spacing: { after: 40 } }));
    multi(f.fix).forEach((x) => S1.push(x));
  });
  if (s.refuted && s.refuted.length) S1.push(p(`Dropped after verification: ${s.refuted.join('; ')}`, { run: { color: MUTED, italics: true } }));
}

S1.push(new Paragraph({ children: [new PageBreak()] }));
S1.push(h1('Site-wide automated checks'));
S1.push(table(['Severity', 'Check', 'Pages', 'How to fix'], [1100, 3700, 800, 3760],
  D.det.map((d) => [cell(d.severity.toUpperCase(), 1100, { color: SEV[d.severity], bold: true }), d.label, String(d.pages), d.fix])));
S1.push(h2('Broken links'));
S1.push(table(['Broken target', 'Status', 'Used', 'On pages'], [3600, 800, 700, 4260],
  D.broken.map((b) => [b.target, String(b.status), `${b.refs}×`, b.pages.split(' | ').join(', ')])));

// ---------- landscape section: content errors
const LW = 12960; // 9in usable at 1in margins? landscape letter 11in - 2*0.75in = 9.5in = 13680; use 0.75in margins
const S2 = [];
S2.push(h1(`Content errors (${fmt(D.errors.length)})`));
S2.push(p('Every verified wording and content error, with the exact text as it appears on the page (search for it with Ctrl+F) and a suggested correction. Sorted by severity, then page. The same list is in data/content_errors.csv.', { run: { color: MUTED } }));
const byType = {};
D.errors.forEach((e) => (byType[e.type] = (byType[e.type] || 0) + 1));
S2.push(p('By type: ' + Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join(' · '), { run: { color: MUTED, size: 18 } }));
for (const sev of ['high', 'medium', 'low']) {
  const rows = D.errors.filter((e) => e.severity === sev);
  if (!rows.length) continue;
  S2.push(h2(`${sev[0].toUpperCase() + sev.slice(1)} severity (${rows.length})`));
  S2.push(table(['Page', 'Type', 'Where', 'Text on the page', 'Suggested fix', 'Why'], [2300, 1150, 1500, 3000, 3000, 2730],
    rows.map((e) => [short(e.url), e.type, e.location, e.quote, e.fix, e.why]), { cantSplit: true }));
}

// ---------- landscape section: thin pages
const S3 = [];
S3.push(h1('Low-content pages and what to add'));
S3.push(p(`Each page's quality score (1 = very thin, 5 = comprehensive) and concrete additions from the page reviewers. ${K.thin} of ${K.content_pages} pages are thin. High-priority pages (thin, with good search potential) come first. "Title claims" is the number promised in the page title.`, { run: { color: MUTED } }));
for (const pri of ['high', 'medium', 'low']) {
  const rows = D.pages.filter((x) => x.priority === pri);
  if (!rows.length) continue;
  S3.push(h2(`${pri[0].toUpperCase() + pri.slice(1)} priority (${rows.length} pages)`));
  S3.push(table(['Page', 'Words', 'Msgs', 'Title claims', 'Score', 'Assessment', 'What to add'], [2400, 750, 650, 850, 650, 3100, 5280],
    rows.map((x) => [
      [short(x.url), new Paragraph({ children: [new TextRun({ text: clean(x.title), color: MUTED, size: 16 })] })],
      String(x.words), String(x.messages), x.claimed ? `${x.claimed}+` : '—', x.score ? `${x.score}/5` : '—', x.summary,
      cell(x.add.length ? x.add.map((a) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, spacing: { after: 20 }, children: [new TextRun({ text: clean(a), size: 17 })] })) : '—', 5280),
    ])));
}

// ---------- landscape section: supporting tables from the site audits
const S4 = [];
S4.push(h1('Appendix: supporting data tables'));
S4.push(p('Tables the auditors produced to back their findings (seasonal publishing plan, title-promise gap, Lighthouse results, coverage gaps and more).', { run: { color: MUTED } }));
for (const s of D.site) {
  for (const tb of s.tables || []) {
    if (!tb.rows.length || tb.rows.length > 160) continue;
    S4.push(h2(`${s.label}: ${tb.name}`));
    const n = tb.columns.length;
    const w = Math.floor(13680 / n);
    const widths = Array(n).fill(w);
    widths[n - 1] += 13680 - w * n;
    S4.push(table(tb.columns, widths, tb.rows.map((r) => r.map((c) => (c === null || c === undefined ? '' : String(c)))), { cantSplit: true }));
  }
}

// ---------- document
const portrait = { page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1440, right: 1440 } } };
const landscape = { page: { size: { width: 12240, height: 15840, orientation: PageOrientation.LANDSCAPE }, margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } };
const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'blog.123greetings.com audit · page ', color: MUTED, size: 16 }), new TextRun({ children: [PageNumber.CURRENT], color: MUTED, size: 16 })] })] });

const doc = new Document({
  title: 'blog.123greetings.com — Full Audit Findings',
  creator: '123Greetings blog audit',
  styles: {
    default: { document: { run: { font: 'Calibri', size: 20, color: INK } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', run: { font: 'Georgia', size: 52, bold: true, color: INK }, paragraph: { spacing: { after: 240 } } },
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Georgia', size: 34, bold: true, color: INK }, paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: 'Georgia', size: 26, bold: true, color: ACCENT }, paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 22, bold: true, color: INK }, paragraph: { spacing: { before: 220, after: 60 }, outlineLevel: 2, keepNext: true } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] },
      { reference: 'numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [
    { properties: portrait, footers: { default: footer }, children: S1 },
    { properties: landscape, footers: { default: footer }, children: S2 },
    { properties: landscape, footers: { default: footer }, children: S3 },
    { properties: landscape, footers: { default: footer }, children: S4 },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = path.join(__dirname, 'blog-123greetings-audit.docx');
  fs.writeFileSync(out, buf);
  console.log('wrote', out, (buf.length / 1024).toFixed(0), 'KB');
});
