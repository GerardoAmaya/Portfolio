import { ImageResponse } from "next/og";

export const contentType = "image/png";

// La imagen depende solo de los query params, así que una vez generada no
// cambia nunca: se cachea de forma inmutable para que cada previsualización de
// LinkedIn, WhatsApp o Slack no vuelva a ejecutar la función.
const CACHE_CONTROL = "public, max-age=31536000, s-maxage=31536000, immutable";

/** Recorta el texto para que no desborde la tarjeta ni infle el render. */
function text(value: string | null, fallback: string, max: number) {
  const raw = (value ?? fallback).trim() || fallback;
  return raw.length > max ? `${raw.slice(0, max - 1).trimEnd()}…` : raw;
}

/** Acota las dimensiones: un `?w=20000` no debe poder tumbar la función. */
function size(value: string | null, fallback: number, min: number, max: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(Math.round(n), min), max);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = text(url.searchParams.get("title"), "Gerardo Amaya — Fullstack Developer", 90);
  const subtitle = text(
    url.searchParams.get("subtitle"),
    "Building solid web products with Node, Nest.js, Python, Laravel, React and Next.js — and integrating LLMs you can audit.",
    170
  );
  const eyebrow = text(url.searchParams.get("eyebrow"), "PROJECT", 40);
  const width = size(url.searchParams.get("w"), 1200, 600, 2400);
  const height = size(url.searchParams.get("h"), 630, 315, 1260);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "96px 112px",
        backgroundColor: "#0b0a0f",
        backgroundImage:
          "radial-gradient(ellipse at 0% 0%, rgba(168, 85, 247, 0.30), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(139, 92, 246, 0.22), transparent 55%)",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 22,
          fontWeight: 500,
          color: "#a78bfa",
          fontFamily: "monospace",
        }}
      >
        <span>{">"} gerardo.dev</span>
        <span style={{ color: "#3f3f46" }}>—</span>
        <span style={{ color: "#71717a", letterSpacing: "0.12em" }}>{eyebrow}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            maxWidth: "78%",
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 22,
            lineHeight: 1.45,
            color: "#a1a1aa",
            maxWidth: "70%",
            display: "flex",
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 18,
          color: "#52525b",
        }}
      >
        <div>Gerardo Amaya · Fullstack Developer</div>
        <div>El Salvador</div>
      </div>
    </div>,
    {
      width,
      height,
      headers: { "Cache-Control": CACHE_CONTROL },
    }
  );
}
