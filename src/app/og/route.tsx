import { ImageResponse } from "next/og";

export const contentType = "image/png";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title =
    url.searchParams.get("title") ?? "Gerardo Amaya — Fullstack Developer";
  const subtitle =
    url.searchParams.get("subtitle") ??
    "Building solid web products with PHP, Laravel, React and Next.js.";
  const eyebrow = url.searchParams.get("eyebrow") ?? "PROJECT";
  const width = Number(url.searchParams.get("w") ?? 1200);
  const height = Number(url.searchParams.get("h") ?? 630);

  return new ImageResponse(
    (
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
          <span style={{ color: "#71717a", letterSpacing: "0.12em" }}>
            {eyebrow}
          </span>
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
      </div>
    ),
    { width, height }
  );
}
