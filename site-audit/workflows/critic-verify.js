export const meta = {
  name: 'blog-critic-verify',
  description: 'Adversarially verify the completeness critic findings (privacy, ads, security, analytics, RSS, icons) on blog.123greetings.com',
  phases: [{ title: 'Critic verify', detail: 'two independent verifiers, each re-checking half of the critic findings live' }],
}

const ROOT = '/home/user/Message_Board/site-audit'

const VERDICTS = {
  type: 'object',
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          verdict: { type: 'string', enum: ['confirmed', 'partly-confirmed', 'refuted', 'unverifiable'] },
          severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
          corrected_evidence: { type: 'string' },
          corrected_fix: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['title', 'verdict', 'severity', 'reason'],
      },
    },
  },
  required: ['verdicts'],
}

function prompt(from, to) {
  return `You are an adversarial verifier for an audit of https://blog.123greetings.com (WordPress.com-hosted blog of greeting-card messages run by 123Greetings; Elementor + Soledad theme, Yoast, Contact Form 7 + reCAPTCHA, Jetpack, GA4 gtag, GPT/truereach ads). Today is 2026-09-30.

A "completeness critic" reported findings in ${ROOT}/data/site_audit.json under key "completeness" -> "findings" (a list). Verify findings with index ${from} to ${to} inclusive (0-based). Read them with: python3 -c "import json; f=json.load(open('${ROOT}/data/site_audit.json'))['completeness']['findings']; [print(i, json.dumps(x, indent=1)) for i,x in enumerate(f) if ${from}<=i<=${to}]"

For EACH of those findings, independently re-check every factual claim against the live site now (curl, python requests, or Playwright: write scripts under ${ROOT}/agent-work/critic-verify/ and run them from ${ROOT} so "import { chromium } from 'playwright'" resolves; launch with chromium.launch({ channel: 'chromium' })). The critic's own scripts/outputs are in ${ROOT}/agent-work/completeness/ — read them, but reproduce independently rather than trusting them.
Be skeptical, especially about: legal/compliance conclusions (state what was observed, not legal verdicts), claims about what Google Ad Manager does with page_url, whether a tracker really fires before consent (check in a fresh context with no interaction), security exposure (only public, unauthenticated observations; do not attempt to log in, call write endpoints, or probe beyond reading public GET responses), and anything that could be an artifact of our sandbox (our egress IP is rate-limited by WordPress.com and may see 429s).
Default to "refuted" if the core claim does not hold, "partly-confirmed" with corrected_evidence if numbers/details are off or the severity is overstated, "unverifiable" if you cannot test it. Keep "title" identical to the critic's title. Be gentle with the server (sequential requests, pauses). Never submit forms.`
}

phase('Critic verify')
const [a, b] = await parallel([
  () => agent(prompt(0, 5), { label: 'critic-verify:0-5', phase: 'Critic verify', schema: VERDICTS }),
  () => agent(prompt(6, 11), { label: 'critic-verify:6-11', phase: 'Critic verify', schema: VERDICTS }),
])
const all = [...(a ? a.verdicts : []), ...(b ? b.verdicts : [])]
return { verdicts: all.length, byVerdict: all.reduce((m, v) => ((m[v.verdict] = (m[v.verdict] || 0) + 1), m), {}) }
