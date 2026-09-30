export const meta = {
  name: 'blog-page-review',
  description: 'Review every blog.123greetings.com page/post for errors and thin content, then adversarially verify each chunk',
  phases: [
    { title: 'Page review', detail: 'one reviewer per ~30-page bundle: language, semantic, factual errors + content gaps' },
    { title: 'Page verify', detail: 'adversarial fact-checker per bundle: confirm/reject each finding, add misses' },
  ],
}

const ROOT = '/home/user/Message_Board/site-audit'

const CONTEXT = `You are auditing https://blog.123greetings.com — a WordPress (Elementor + Soledad/"Penci" theme) blog of greeting-card message ideas run by 123Greetings (an eCard company at www.123greetings.com). Today is 2026-09-30.
Most URLs are "message pages": an H1 like "Birthday Messages for Mom", optional section headings (Funny, Heartfelt, ...), and quoted messages each in its own block, sometimes plus an intro, an FAQ accordion, and a left "Emotions" jump menu. "Posts" are long-form articles (Bob's daily/weekly columns, Mother's Day stories, "when my X struggled..." stories).

BUNDLE FORMAT (the file you read): one section per page, starting "==================== PAGE: <url>". It lists title, meta description, H1s, dates, side nav items, headings, MESSAGE BLOCKS (numbered, in page order; "[Heading] " prefix when the block carries a section heading), OTHER BODY TEXT / BODY TEXT, FAQ ACCORDION, and LANGUAGETOOL CANDIDATES.
- A block shown as “” or (EMPTY) renders on the live page as a pair of empty curly quotes.
- "[ALSO ON N OTHER PAGE(S)]" = the exact message text is duplicated elsewhere on the site.
- LANGUAGETOOL CANDIDATES are automated and often false positives (proper nouns, slang, intentional informal style, comma pedantry). Only report the real ones.
- If something in the bundle looks like an extraction artifact, check the live page: curl -s <url> | python3 -c "import sys,re,html; t=re.sub(r'<[^>]+>',' ',sys.stdin.read()); print(html.unescape(t))" | grep -n -i "<phrase>"  (be gentle with the server: fetch only when needed, sequentially).

ALREADY COVERED DETERMINISTICALLY (do NOT report these): HTTP status/broken links, count of empty message blocks, empty section headings, title "N+" claim vs actual message count, exact-duplicate messages (within or across pages), duplicate H1 rendered twice by the template, missing alt text, title length.

WHAT TO REPORT as issues (be exhaustive on these — every real one, every page):
- typo / spelling mistakes; grammar errors; punctuation errors (unpaired or wrong quotes, space before punctuation, doubled punctuation, missing sentence-final punctuation in a message, stray characters, "( wink)"-style formatting);
- capitalization problems in titles/headings/meta (inconsistent Title Case, "Thoughtful" mid-sentence, etc.);
- wrong-topic content: a message that does not fit the page's occasion (e.g. generic "Dance Day" messages on a National Tap Dance Day page; Christmas wording on a Thanksgiving page);
- wrong-recipient content: a message addressed to someone other than the page's recipient (e.g. "husband" on a birthday-for-mom page, "sister" on a brother page), wrong gender/pronouns, wrong milestone age/number (e.g. "30 years" on a 25th anniversary page);
- leaked editor / AI / template text inside messages or headings (e.g. "Use as a card, a caption, or a note to yourself on a hard morning. It travels well.", "Meta Title", "Here are…", "[Name]", placeholder or instruction text);
- factual errors: wrong observance dates (verify: e.g. National Tap Dance Day = May 25; International Dance Day = Apr 29), wrong anniversary gift materials/gemstones, wrong zodiac date ranges or traits, wrong holiday facts/history, wrong year references;
- tone/sensitivity problems (jokes on a sympathy page, assumptions about religion, anything inappropriate for a greeting card);
- structural/semantic problems: side-nav items pointing to sections that don't exist on the page (e.g. "Nostalgic -> #n" when there is no Nostalgic section), FAQ answers that don't answer their question, FAQ missing questions, headings that don't match their content, H1 wording that contradicts the title, meta descriptions that are truncated/misleading/contain typos;
- outdated content: past dates presented as upcoming, stale year references.

For EVERY issue: quote the exact offending text verbatim (a substring someone can Ctrl+F on the page), say where it is (e.g. "message #4", "title", "meta description", "FAQ Q2 answer", "body paragraph"), give the corrected text in "fix", and a one-line "why".
Severity: high = factually wrong / wrong recipient or occasion / leaked editor text / visibly broken; medium = clear grammar or spelling error in visible text, misleading meta; low = minor punctuation/capitalization/style inconsistency.

CONTENT ASSESSMENT for EVERY page in the bundle (posts too): is it thin? Rate 1–5 (5 = comprehensive, genuinely useful). Then give concrete, page-specific additions that would make it the best page on the web for its query: how many more messages and in which named sections/angles (e.g. "add 15 short text-message wishes", "add a From-Daughter section", "add religious/blessing wishes", "add funny messages for a 40th"), an intro explaining the occasion (date, origin), "how to write your own / what to write" tips, sign-off ideas, FAQs worth adding, related internal pages to link (use real blog.123greetings.com slugs you see in the bundle or that obviously exist), and eCard CTA ideas. Assign a priority (high = thin page with good search potential; low = already solid).`

const ISSUE = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['typo', 'grammar', 'punctuation', 'capitalization', 'wrong-topic', 'wrong-recipient', 'leaked-template-text', 'factual', 'tone', 'structure', 'seo-meta', 'outdated', 'other'] },
    severity: { type: 'string', enum: ['high', 'medium', 'low'] },
    location: { type: 'string' },
    quote: { type: 'string' },
    fix: { type: 'string' },
    why: { type: 'string' },
  },
  required: ['type', 'severity', 'location', 'quote', 'fix', 'why'],
}

const REVIEW = {
  type: 'object',
  properties: {
    pages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          issues: { type: 'array', items: ISSUE },
          content: {
            type: 'object',
            properties: {
              thin: { type: 'boolean' },
              score: { type: 'integer', minimum: 1, maximum: 5 },
              priority: { type: 'string', enum: ['high', 'medium', 'low'] },
              summary: { type: 'string' },
              add: { type: 'array', items: { type: 'string' } },
            },
            required: ['thin', 'score', 'priority', 'summary', 'add'],
          },
        },
        required: ['url', 'issues', 'content'],
      },
    },
  },
  required: ['pages'],
}

const VERIFIED = {
  type: 'object',
  properties: {
    pages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          confirmed: {
            type: 'array',
            items: { ...ISSUE, properties: { ...ISSUE.properties, source: { type: 'string', enum: ['reviewer', 'verifier'] }, note: { type: 'string' } }, required: [...ISSUE.required, 'source'] },
          },
          rejected: {
            type: 'array',
            items: { type: 'object', properties: { quote: { type: 'string' }, type: { type: 'string' }, reason: { type: 'string' } }, required: ['quote', 'reason'] },
          },
        },
        required: ['url', 'confirmed', 'rejected'],
      },
    },
  },
  required: ['pages'],
}

function reviewPrompt(c) {
  return `${CONTEXT}

YOUR TASK: Read the bundle file ${ROOT}/${c.file} completely (use the Read tool; it may need several reads with offset/limit — do not skip any page). It covers ${c.n} pages; list their URLs first with: grep -n "^==================== PAGE:" ${ROOT}/${c.file}

Go page by page and message by message. Read every message, heading, title, meta description, FAQ and body paragraph. Return one entry in "pages" for EVERY one of the ${c.n} URLs in the bundle (even if it has no issues), with all issues and the content assessment.`
}

function verifyPrompt(c, rev) {
  return `${CONTEXT}

YOUR TASK: You are an adversarial fact-checker. A reviewer audited the bundle ${ROOT}/${c.file} (pages listed below) and produced the findings in the JSON at the end.
1. For EACH reported issue decide whether it is real. Confirm only if (a) the quoted text really exists on that page (check the bundle; if in doubt check the live page with curl), (b) it is genuinely an error — not a stylistic preference, intentional informal/funny voice, valid alternative spelling, or LanguageTool pedantry — and (c) the fix is correct. For factual claims (dates, anniversary gifts, zodiac ranges, holiday facts) verify carefully; you may use WebSearch/WebFetch (load them with ToolSearch) when unsure. When uncertain about a typo/grammar/style claim, REJECT it. Correct the fix/severity if the reviewer got them slightly wrong (explain in note).
2. Then read the bundle yourself (every page, every message) and ADD any clear errors the reviewer missed (source: "verifier"), especially: typos, wrong recipient/occasion, leaked template/AI text, factual errors, broken side-nav anchors, bad meta descriptions.
Return one entry per URL (even with empty arrays). Put every reviewer issue in either confirmed (source "reviewer") or rejected (with reason).

The bundle has ${c.n} pages (list them with: grep -n "^==================== PAGE:" ${ROOT}/${c.file}).

REVIEWER FINDINGS (issues only):
${JSON.stringify(rev.pages.map((p) => ({ url: p.url, issues: p.issues })))}`
}

const results = await pipeline(
  args.chunks,
  (c, _, i) => agent(reviewPrompt(c), { label: `review:${c.file.split('/').pop()}`, phase: 'Page review', schema: REVIEW }),
  (rev, c) =>
    rev
      ? agent(verifyPrompt(c, rev), { label: `verify:${c.file.split('/').pop()}`, phase: 'Page verify', schema: VERIFIED }).then((v) => ({ chunk: c.file, review: rev, verified: v }))
      : null,
)

const ok = results.filter(Boolean)
const missing = args.chunks.filter((c) => !ok.find((r) => r.chunk === c.file)).map((c) => c.file)
if (missing.length) log(`chunks without results: ${missing.join(', ')}`)
return {
  chunks_done: ok.length,
  missing,
  summary: ok.map((r) => ({
    chunk: r.chunk,
    pages: r.review.pages.length,
    reviewer_issues: r.review.pages.reduce((s, p) => s + p.issues.length, 0),
    confirmed: r.verified ? r.verified.pages.reduce((s, p) => s + p.confirmed.length, 0) : null,
    rejected: r.verified ? r.verified.pages.reduce((s, p) => s + p.rejected.length, 0) : null,
  })),
}
