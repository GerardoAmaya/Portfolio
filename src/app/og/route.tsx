import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { resolveOgCard } from "./cards";
import { clampSize, fitText } from "./params";

export const contentType = "image/png";

// La imagen depende solo de los query params, así que una vez generada no
// cambia nunca: se cachea de forma inmutable para que cada previsualización de
// LinkedIn, WhatsApp o Slack no vuelva a ejecutar la función.
const CACHE_CONTROL = "public, max-age=31536000, s-maxage=31536000, immutable";

const BG = "#0b0a0f";
const PRIMARY = "#a78bfa";
const FUCHSIA = "#d946ef";
const MUTED = "#a1a1aa";
const SUBTLE = "#52525b";
const BORDER = "#27222f";
const STACK = ["Node", "NestJS", "Next.js", "PostgreSQL", "GCP", "Claude API"];

// Geist, la misma tipografía del sitio (licencia OFL, ver fonts/OFL-LICENSE.txt)
const fontsDir = join(process.cwd(), "src/app/og/fonts");
let fontsPromise: Promise<{ name: string; data: Buffer; weight: 400 | 500 | 700 }[]> | null = null;
function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(join(fontsDir, "Geist-Regular.ttf")).then((data) => ({
      name: "Geist",
      data,
      weight: 400 as const,
    })),
    readFile(join(fontsDir, "Geist-Bold.ttf")).then((data) => ({
      name: "Geist",
      data,
      weight: 700 as const,
    })),
    readFile(join(fontsDir, "GeistMono-Medium.ttf")).then((data) => ({
      name: "Geist Mono",
      data,
      weight: 500 as const,
    })),
  ]).catch(() => {
    // Sin fuentes la imagen sale igual con la tipografía por defecto
    fontsPromise = null;
    return [];
  });
  return fontsPromise;
}

function Dots() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div key={c} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c }} />
      ))}
    </div>
  );
}

/** Ventana de editor con el perfil como objeto, solo en la tarjeta de la portada. */
function CodeWindow() {
  const k = { color: "#c084fc" };
  const v = { color: "#7dd3fc" };
  const s = { color: "#86efac" };
  const p = { color: "#fda4af" };
  const b = { color: "#fb923c" };
  const lines = [
    [
      <span key="a" style={k}>
        const
      </span>,
      <span key="b" style={v}>
        &nbsp;gerardo
      </span>,
      <span key="c">&nbsp;= {"{"}</span>,
    ],
    [
      <span key="a" style={p}>
        &nbsp;&nbsp;role
      </span>,
      <span key="b">:&nbsp;</span>,
      <span key="c" style={s}>
        &quot;Fullstack&quot;
      </span>,
      <span key="d">,</span>,
    ],
    [
      <span key="a" style={p}>
        &nbsp;&nbsp;stack
      </span>,
      <span key="b">:&nbsp;[</span>,
      <span key="c" style={s}>
        &quot;NestJS&quot;
      </span>,
      <span key="d">,&nbsp;</span>,
      <span key="e" style={s}>
        &quot;Next.js&quot;
      </span>,
      <span key="f">],</span>,
    ],
    [
      <span key="a" style={p}>
        &nbsp;&nbsp;ai
      </span>,
      <span key="b">:&nbsp;</span>,
      <span key="c" style={s}>
        &quot;Claude API&quot;
      </span>,
      <span key="d">,</span>,
    ],
    [
      <span key="a" style={p}>
        &nbsp;&nbsp;available
      </span>,
      <span key="b">:&nbsp;</span>,
      <span key="c" style={b}>
        true
      </span>,
      <span key="d">,</span>,
    ],
    [<span key="a">{"};"}</span>],
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 440,
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        backgroundColor: "#100e16",
        boxShadow: "0 30px 80px -20px rgba(167,139,250,0.35)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 18px",
          borderBottom: `1px solid ${BORDER}`,
          backgroundColor: "#15121d",
        }}
      >
        <Dots />
        <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 16, color: MUTED }}>
          gerardo.ts
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px 22px",
          gap: 6,
          fontFamily: "Geist Mono",
          fontSize: 20,
          color: "#e4e4e7",
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ display: "flex" }}>
            <span style={{ color: "#3f3a4a", width: 30 }}>{i + 1}</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  // Los textos no vienen en la URL: se resuelven a partir de la página pedida
  const card = resolveOgCard(url.searchParams);
  const home = card.home;
  const title = fitText(card.title, "Gerardo Amaya", 90);
  const subtitle = fitText(
    card.subtitle,
    "Building solid web products and integrating AI you can audit.",
    home ? 110 : 150
  );
  const eyebrow = fitText(card.eyebrow, "", 40);
  const width = clampSize(url.searchParams.get("w"), 1200, 600, 2400);
  const height = clampSize(url.searchParams.get("h"), 630, 315, 1260);
  const fonts = await loadFonts();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        backgroundColor: BG,
        backgroundImage:
          "radial-gradient(ellipse at 0% 0%, rgba(168, 85, 247, 0.28), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(139, 92, 246, 0.2), transparent 55%)",
        color: "#fff",
        fontFamily: "Geist",
      }}
    >
      {/* Arriba: logo y etiqueta */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 26, color: "#fff" }}>
          <span style={{ color: PRIMARY }}>{">"}</span>
          <span>&nbsp;gerardo</span>
          <span style={{ color: SUBTLE }}>.dev</span>
        </div>
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 16,
              letterSpacing: "0.12em",
              color: PRIMARY,
              border: `1px solid rgba(167,139,250,0.4)`,
              backgroundColor: "rgba(167,139,250,0.1)",
              borderRadius: 999,
              padding: "6px 14px",
            }}
          >
            {eyebrow}
          </div>
        ) : null}
      </div>

      {/* Centro */}
      {home ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 560, gap: 18 }}>
            <div
              style={{
                display: "flex",
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 52,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                backgroundImage: `linear-gradient(100deg, #ffffff, ${PRIMARY} 55%, ${FUCHSIA})`,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Fullstack Developer
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 24,
                lineHeight: 1.45,
                color: MUTED,
                marginTop: 6,
              }}
            >
              {subtitle}
            </div>
          </div>
          <CodeWindow />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 40 ? 58 : 68,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 960,
            }}
          >
            {title}
          </div>
          <div
            style={{ display: "flex", fontSize: 26, lineHeight: 1.45, color: MUTED, maxWidth: 900 }}
          >
            {subtitle}
          </div>
        </div>
      )}

      {/* Abajo: stack y dirección */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {STACK.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                fontFamily: "Geist Mono",
                fontSize: 16,
                color: "#d4d4d8",
                border: `1px solid ${BORDER}`,
                backgroundColor: "rgba(255,255,255,0.03)",
                borderRadius: 8,
                padding: "6px 12px",
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 18, color: SUBTLE }}>
          gerardoamayacv.netlify.app
        </div>
      </div>
    </div>,
    {
      width,
      height,
      fonts,
      headers: { "Cache-Control": CACHE_CONTROL },
    }
  );
}
