# Gerardo Amaya — Portfolio

Personal portfolio site built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui. Bilingual (ES/EN), dark/light themes, optimized for performance and SEO. Deployed on Netlify.

## Tech stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **i18n**: next-intl (ES, EN)
- **Theming**: next-themes (dark / light / system)
- **Animation**: motion (Framer Motion)
- **Validation**: Zod
- **Icons**: Lucide
- **Forms**: Netlify Forms

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
    [locale]/          # Localized routes (es, en)
      page.tsx         # Home
      about/
      projects/
      experience/
      blog/
      contact/
    api/               # API routes (if needed)
  components/
    ui/                # shadcn/ui primitives
    sections/          # Page sections
    layout/            # Header, Footer, etc.
  content/
    projects/          # MDX case studies
    blog/              # MDX articles
  i18n/                # next-intl config
  lib/                 # Utilities
messages/
  en.json
  es.json
public/
  resume.pdf
```

## Deployment

Auto-deployed on Netlify from the `master` branch. Configuration lives in [`netlify.toml`](./netlify.toml).
