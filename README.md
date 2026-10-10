# Relationship HR — Mutual Compatibility Audit

An **equality-based**, fully **client-side** web application where two partners each fill out the identical
**Relationship Application Form (RH-1312)** and simultaneously receive a **mutual compatibility report**.

> Both of you fill it out. Both of you get the report. **Nobody judges anybody.**
> The app evaluates *the match itself* — never the people.

---

## Core Philosophy

- **Equality first** — both users are equal applicants. There is no "HR", no interviewer, no judge.
- **Mutual reveal** — the report unlocks only when **both** have submitted, and both see the identical page.
- **Match-focused language** — friction points are framed as conversation starters, never as rejections.
- **Privacy by design** — neither user ever sees the other's raw answers; only the final compatibility breakdown.
  Everything runs in the browser; there is no backend, no database, no accounts.

## Features

- 6-character **Match Code** sessions (e.g. `XK9F26`) with shareable links.
- 13-section, step-by-step **application wizard** with autosave drafts (`localStorage`).
- **Waiting room** with live status; auto-opens the report when the second file lands.
- Transparent **compatibility engine** (0–100%): exact matches, complementary synergies, 1–10 rating deltas,
  and dealbreaker *flags* (flagged for discussion — never auto-reject).
- **Report:** animated circular score, match-focused status stamp, both-sides-visible category audit table,
  radar + bar charts, synergy highlights, discussion areas, suggested conversation starters.
- **Share report** link (data rides, base64-encoded, inside the URL hash so it works cross-device),
  **Download as PDF**, and same-device sync via `BroadcastChannel` + `storage` events.
- Works offline after first load. No API keys. No servers.

## Tech Stack

| Concern   | Choice                                   |
| --------- | ---------------------------------------- |
| Framework | Vite + React 19 + TypeScript             |
| Styling   | Tailwind CSS 4                           |
| Animation | framer-motion                            |
| Icons     | lucide-react                             |
| Charts    | recharts                                 |
| Routing   | react-router-dom **HashRouter** (`/#/…`) |
| PDF       | html2pdf.js                              |
| State     | Browser `localStorage` + BroadcastChannel |

## Getting Started

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
npm run build   # production build → dist/
npm run preview # preview the production build locally
```

## Deployment

The app uses **hash routing** and a **relative base path (`base: './'`)**, so the static `dist/` output works on
any host and any sub-path with zero configuration.

### GitHub Pages

```bash
npm run deploy    # builds, then pushes dist/ to the gh-pages branch
```

Then in your repo: **Settings → Pages → Source: `gh-pages` branch**. Your app lives at
`https://<user>.github.io/<repo>/` — shareable links look like `https://<user>.github.io/<repo>/#/session/XK9F26`.

### Netlify

Drag the `dist/` folder into the Netlify dashboard, or connect the repo with:

- Build command: `npm run build`
- Publish directory: `dist`

### Vercel

```bash
npx vercel
```

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

### Any static host (or a ZIP)

Run `npm run build` and upload the `dist/` folder anywhere — it is a single self-contained HTML file.

## How Sessions Sync (No Backend)

1. **Same device / tabs:** `BroadcastChannel` + `storage` events update every open tab instantly.
2. **Cross-device:** after submitting, your sealed answers are base64-encoded into the share link
   (`#/session/XK9F26?d=…`). When your partner opens it, your file merges into their browser; when they submit,
   the report opens — and their "Share report" link carries both files back to you.

## Project Structure

```
src/
  components/   ui primitives, chrome, score ring, charts
  pages/        Landing, Session, Apply, Waiting, Report
  lib/          session storage/sync, payload encoding, compatibility algorithm, demo data
  data/         questions.ts — the full RH-1312 form schema
  types/        shared TypeScript types
```

## Disclaimer

This is a playful communication tool for couples and almost-couples. The "department" issues data,
never verdicts — and certainly never rejections.
