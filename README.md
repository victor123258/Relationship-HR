# Relationship HR™ — Mutual Compatibility Audit

> Both of you fill it out. Both of you get the report. No one judges anyone — the match speaks for itself.

**Relationship HR** is an equality-based, fully client-side web app where two partners each complete
the same *Relationship Application Form* and receive a **mutual compatibility report** that unlocks
**simultaneously** — only when both have submitted. Neither user is "HR." Neither user is a judge.
The app evaluates **the match**, never the people.

<!-- screenshots
![Landing](docs/screenshot-landing.png)
![Report](docs/screenshot-report.png)
-->

## Core Philosophy

- **Equality first** — both users are equal applicants filling the identical, gender-neutral form.
- **Mutual reveal** — results stay sealed until both submissions exist. No peeking, by design.
- **Match-focused language** — friction points are framed as growth opportunities and conversation
  starters, never as "rejection," "failure," or criticism of either person.
- **Privacy during entry** — neither partner sees the other's raw answers while filling the form.

## Features

- 6-character match codes (unambiguous alphabet — no O/0/I/1 confusion)
- Session dashboard with live applicant status (`Not started → Filling out… Section 3/13 → Submitted`)
- 13-section application wizard with a corporate onboarding checklist, card-style radio inputs,
  1–10 rating sliders, conditional follow-up questions, character counts, and per-step validation
- Auto-save to `localStorage` on every keystroke — close the tab, come back, resume where you left off
- Waiting room with document-scanner animation, rotating relationship facts, and a cross-device
  **handoff link** (partner's sealed answers travel inside the URL — still no server)
- Mutual Compatibility Report with:
  - animated count-up overall score donut (emerald / amber / red by alignment)
  - values-conflict banner (dealbreakers are flagged for conversation, never auto-rejection)
  - 7-axis radar chart overlaying both applicants
  - expandable category breakdown table with per-question contributions
  - synergy highlights, areas to explore together, and tailored conversation starters
  - side-by-side final reflections
- Share Report as a URL (results encoded + compressed in the link) or download as a styled PDF
- Demo mode with realistic sample data — see a full report in one click
- Dark mode toggle (persisted), mobile-first responsive, hash routing for static hosting

## Privacy

Everything runs in your browser. There is **no backend, no database, no accounts, no analytics,
no cookies**. Answers live in `localStorage`, namespaced per session
(`session_{MATCHCODE}_personA_answers`, etc.). Cross-tab sync uses `BroadcastChannel` with a
`storage` event fallback; cross-device sharing works by encoding data directly into URLs
(LZ-string compression). After the first load the app works fully offline.

## Tech Stack

- **Vite + React + TypeScript** — static output, no framework server needed
- **Tailwind CSS v4** — monochrome "corporate document" design system
- **framer-motion** — page transitions, staggered reveals, count-up animations
- **recharts** — radar chart
- **react-router-dom (HashRouter)** — GitHub-Pages-safe routing (`/#/session/XK9F26`)
- **lucide-react** — icons
- **jsPDF** — client-side PDF export
- **lz-string** — URL payload compression

## Getting Started

Prerequisites: **Node.js 18+**

```bash
git clone <your-repo-url>
cd relationship-hr
npm install
npm run dev        # http://localhost:5173
```

## Building for Production

```bash
npm run build      # outputs to /dist
npm run preview    # locally preview the production build
```

## Deployment

The build produces a fully static bundle (all JS/CSS inlined into `index.html`).

- **GitHub Pages:** `npm run build`, then publish `/dist` with the `gh-pages` package
  (`npx gh-pages -d dist`) or via a GitHub Actions static-deploy workflow.
- **Netlify:** drag-and-drop the `/dist` folder, or connect the repo with build command
  `npm run build` and publish directory `dist`.
- **Vercel:** import the repo, framework preset **Vite**, output directory `dist`.
- **Any static host:** upload the contents of `/dist`. Hash routing means no server
  rewrites are ever required.

## How It Works

1. One partner starts a session → gets a 6-character match code (`/#/session/XK9F26`) and shares it.
2. Each partner is assigned Applicant A or B on a first-come basis and completes the same 13-section
   application independently. Progress auto-saves; live status syncs across open tabs.
3. When the second application lands, the report unlocks for **both** at the same time.
4. The scoring engine compares answers across 7 weighted categories (communication, emotional
   intelligence, values & intentions, financial, love & affection, boundaries & trust,
   accountability & growth), combining exact-match scoring, ordinal distance scoring,
   slider-delta scoring, complementary-fit bonuses, and lightweight text-depth analysis.
   Dealbreaker mismatches are surfaced as *values conflicts to discuss* — they cap, never erase,
   the score.

## License

MIT — use it, fork it, ship it.
