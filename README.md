# Gerardo Amaya — Portfolio

[![CI](https://github.com/GerardoAmaya/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/GerardoAmaya/Portfolio/actions/workflows/ci.yml)
[![Live site](https://img.shields.io/badge/Live-gerardoamayacv.netlify.app-8B5CF6?logo=netlify&logoColor=white)](https://gerardoamayacv.netlify.app)

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![next-intl](https://img.shields.io/badge/next--intl-ES_%7C_EN-A78BFA)](https://next-intl.dev)
[![Netlify](https://img.shields.io/badge/Netlify-deployed-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com)

Personal portfolio site built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui. Bilingual (ES/EN), dark/light themes, optimized for performance and SEO, with an AI assistant that answers recruiters' questions from the site's own content. Deployed on Netlify.

**Live:** [gerardoamayacv.netlify.app](https://gerardoamayacv.netlify.app) — [Español](https://gerardoamayacv.netlify.app/es) · [English](https://gerardoamayacv.netlify.app/en)

## Tech stack

- **Framework**: Next.js 16 (App Router, Server Components, Route Handlers)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **i18n**: next-intl (ES, EN)
- **Theming**: next-themes (dark / light / system)
- **Animation**: CSS keyframes, the View Transitions API and Motion (all honour `prefers-reduced-motion`)
- **AI assistant**: Claude API (`@anthropic-ai/sdk`) with streaming and prompt caching; rate limits in Netlify Blobs
- **Icons**: Lucide, react-icons
- **Forms**: Netlify Forms (via the static `public/__forms.html` definition)
- **Tests**: Vitest

## Local development

Requires Node 22 or later (`.nvmrc` pins 24, the version used on Netlify and in CI).

```bash
npm install
cp .env.example .env   # add ANTHROPIC_API_KEY to try the assistant
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                | What it does                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `npm run dev`         | Start dev server with Turbopack                                                           |
| `npm run build`       | Production build                                                                          |
| `npm start`           | Run production build                                                                      |
| `npm run lint`        | ESLint                                                                                    |
| `npm run typecheck`   | TypeScript check (no emit)                                                                |
| `npm test`            | Unit tests (Vitest)                                                                       |
| `npm run format`      | Prettier write                                                                            |
| `npm run credly:sync` | Re-fetch Credly badges: downloads the images and regenerates `src/data/certifications.ts` |

## Project structure

```
src/
  app/
    [locale]/          # Localized routes (es, en) — owns <html> and metadata
      page.tsx         # Home
      about/
      projects/
        [slug]/        # Case studies
      experience/
      contact/
      [...rest]/       # Catches unknown paths -> localized 404
      not-found.tsx
    api/ask/route.ts   # AI assistant endpoint (streams the answer)
    og/                # Generated Open Graph images (route + param sanitising)
    robots.ts
    sitemap.ts
    not-found.tsx      # 404 for paths outside /[locale]
  components/
    ui/                # shadcn/ui primitives
    sections/          # Page sections
    layout/            # Header, Footer, switchers
    ask/               # AI assistant widget
    motion/            # Page and project-card transitions
  data/                # projects, experience, skills (typed per locale)
                       # certifications.ts is generated — see scripts/fetch-credly.mjs
                       # assistant-profile.ts: extended resume the assistant can quote
  i18n/                # next-intl config
  lib/
    ask/               # Assistant context, request validation, rate limit, answer parsing
                       # site config, metadata helpers, utils
  proxy.ts             # next-intl middleware
messages/
  en.json
  es.json
scripts/
  fetch-credly.mjs     # Syncs the public Credly profile into data + images
public/
  certifications/      # Credly badge art, kept local on purpose
  projects/            # Case-study covers
  cv/                  # Resume per locale (/resume.pdf redirects to the English one)
  __forms.html         # Static form Netlify detects at build time
```

Certifications come from the public Credly profile, not from a hand-kept list.
`npm run credly:sync` pulls the badges, stores the artwork under
`public/certifications/` and rewrites `src/data/certifications.ts`; the badge
images live in the repo so the section does not depend on Credly's CDN being up,
and so no visitor request leaks to a third party. The script aborts without
touching anything if Credly returns nothing.

Every page builds its own canonical and `hreflang` tags through
[`src/lib/metadata.ts`](./src/lib/metadata.ts). Next inherits `alternates` and
`openGraph` wholesale from the layout, so a page that omits them ends up
pointing at the home page.

## AI assistant

The "Ask my AI" button opens a chat that answers questions about the portfolio.
Everything it knows is built in [`src/lib/ask/context.ts`](./src/lib/ask/context.ts)
from the same data the site renders plus
[`src/data/assistant-profile.ts`](./src/data/assistant-profile.ts), so a new
project in `src/data` is known to it without further changes. Answers cite
sections with `[[ref]]` tags that the widget turns into links, and unknown tags
are dropped.

| Variable            | Required | Purpose                                                  |
| ------------------- | -------- | -------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | Yes      | Server-only key. Use a dedicated key with a spend limit. |
| `ASK_MODEL`         | No       | Model override (default `claude-haiku-5-5`).             |

Spend is bounded by a per-IP limit (10 questions per hour) and a site-wide daily
cap (300), stored in Netlify Blobs with atomic conditional writes. Locally, or if
Blobs is unavailable, the limits fall back to process memory. Without
`ANTHROPIC_API_KEY` the endpoint answers 503 and the widget shows a friendly
error.

## Deployment

Auto-deployed on Netlify from the `master` branch. Configuration lives in [`netlify.toml`](./netlify.toml).
CI (type check, lint, tests and build) runs on every push and pull request.

Open follow-ups from the last project review are tracked in [`PENDIENTES.md`](./PENDIENTES.md).

## Author

**Gerardo Alberto Amaya** — Fullstack Engineer · El Salvador

[![Gmail](https://img.shields.io/badge/Gmail-gerardoamayasv2000@gmail.com-EA4335?logo=gmail&logoColor=white)](mailto:gerardoamayasv2000@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Gerardo_Alberto_Amaya-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gerardo-alberto-amaya-fuentes-20b292240)
[![GitHub](https://img.shields.io/badge/GitHub-GerardoAmaya-181717?logo=github&logoColor=white)](https://github.com/GerardoAmaya)
