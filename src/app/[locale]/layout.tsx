import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AskWidget } from "@/components/ask/ask-widget";
import { NavigationWatcher } from "@/components/motion/project-morph";
import { RiseObserver } from "@/components/motion/rise";
import { PersonJsonLd } from "@/components/json-ld";
import { projects } from "@/data/projects";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/lib/site";
import { localeAlternates, ogImageUrl, ogLocale } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  // Con el teclado abierto el layout se encoge en vez de taparse (chat del asistente)
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a0f" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  // Tarjeta de la portada al compartir: nombre, rol y ventana de código
  const homeOg = ogImageUrl(locale, "");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("defaultTitle"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    applicationName: t("siteName"),
    authors: [{ name: site.fullName }],
    creator: site.fullName,
    openGraph: {
      type: "website",
      locale: ogLocale(locale),
      siteName: t("siteName"),
      title: t("defaultTitle"),
      description: t("description"),
      url: `/${locale}`,
      images: [{ url: homeOg, width: 1200, height: 630, alt: t("defaultTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("description"),
      images: [homeOg],
    },
    alternates: localeAlternates(locale, ""),
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Nav" });

  // data-scroll-behavior: Next desactiva el scroll suave mientras navega. Sin
  // esto, la página nueva queda ~75px más abajo (debajo del header sticky).
  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-dvh flex-col font-sans`}
      >
        <PersonJsonLd />
        <NextIntlClientProvider>
          <Providers>
            <a
              href="#main"
              className="focus:bg-primary focus:text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-offset-2"
            >
              {t("skipToContent")}
            </a>
            <Header />
            <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </main>
            <Footer />
            {/* Solo slug y título: el resto de los casos de estudio no viaja al navegador */}
            <AskWidget
              projects={projects.map((p) => ({ slug: p.slug, title: p.i18n[locale].title }))}
            />
            <NavigationWatcher />
            <RiseObserver />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
