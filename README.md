# Gerardo Amaya — Portfolio

Personal portfolio site built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui. Bilingual (ES/EN), dark/light themes, optimized for performance and SEO. Deployed on Netlify.

## Tech stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **i18n**: next-intl (ES, EN)
- **Theming**: next-themes (dark / light / system)
- **Animation**: motion (Framer Motion)
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
