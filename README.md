# Gerardo Amaya — Portfolio

[![CI](https://github.com/GerardoAmaya/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/GerardoAmaya/Portfolio/actions/workflows/ci.yml)
[![Live site](https://img.shields.io/badge/Live-gerardoamayacv.netlify.app-8B5CF6?logo=netlify&logoColor=white)](https://gerardoamayacv.netlify.app)

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![next-intl](https://img.shields.io/badge/next--intl-ES_%7C_EN-A78BFA)](https://next-intl.dev)
[![Netlify](https://img.shields.io/badge/Netlify-deployed-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com)

Personal portfolio site built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui. Bilingual (ES/EN), dark/light themes, optimized for performance and SEO. Deployed on Netlify.

**Live:** [gerardoamayacv.netlify.app](https://gerardoamayacv.netlify.app) — [Español](https://gerardoamayacv.netlify.app/es) · [English](https://gerardoamayacv.netlify.app/en)

## Tech stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **i18n**: next-intl (ES, EN)
- **Theming**: next-themes (dark / light / system)
- **Animation**: CSS keyframes (no animation library, honours `prefers-reduced-motion`)
- **Icons**: Lucide, react-icons
- **Forms**: Netlify Forms (via the static `public/__forms.html` definition)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm run format` | Prettier write |

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
    og/route.tsx       # Generated Open Graph images
    robots.ts
    sitemap.ts
    not-found.tsx      # 404 for paths outside /[locale]
  components/
    ui/                # shadcn/ui primitives
    sections/          # Page sections
    layout/            # Header, Footer, switchers
  data/                # projects, experience, skills (typed per locale)
  i18n/                # next-intl config
  lib/                 # site config, metadata helpers, utils
  proxy.ts             # next-intl middleware
messages/
  en.json
  es.json
public/
  projects/            # Case-study covers
  resume.pdf
  __forms.html         # Static form Netlify detects at build time
```

Every page builds its own canonical and `hreflang` tags through
[`src/lib/metadata.ts`](./src/lib/metadata.ts). Next inherits `alternates` and
`openGraph` wholesale from the layout, so a page that omits them ends up
pointing at the home page.

## Deployment

Auto-deployed on Netlify from the `master` branch. Configuration lives in [`netlify.toml`](./netlify.toml).

## Author

**Gerardo Alberto Amaya** — Fullstack Engineer · El Salvador

[![Gmail](https://img.shields.io/badge/Gmail-gerardoamayasv2000@gmail.com-EA4335?logo=gmail&logoColor=white)](mailto:gerardoamayasv2000@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Gerardo_Alberto_Amaya-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gerardo-alberto-amaya-fuentes-20b292240)
[![GitHub](https://img.shields.io/badge/GitHub-GerardoAmaya-181717?logo=github&logoColor=white)](https://github.com/GerardoAmaya)
