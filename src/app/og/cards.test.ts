import { describe, expect, it } from "vitest";
import es from "../../../messages/es.json";
import en from "../../../messages/en.json";
import { getProject } from "@/data/projects";
import { fitStack, ogQuery, resolveOgCard } from "./cards";

const card = (query: string) => resolveOgCard(new URLSearchParams(query));

describe("ogQuery", () => {
  it("solo lleva idioma e identificador", () => {
    expect(ogQuery("es", "")).toBe("locale=es");
    expect(ogQuery("en", "/about")).toBe("locale=en&page=about");
    expect(ogQuery("es", "/projects")).toBe("locale=es&page=projects");
    expect(ogQuery("en", "/projects/waypoint")).toBe("locale=en&project=waypoint");
  });

  it("una ruta sin tarjeta propia usa la de la portada", () => {
    expect(ogQuery("es", "/otra")).toBe("locale=es");
  });
});

describe("resolveOgCard", () => {
  it("toma los textos de una página de messages/", () => {
    expect(card("locale=en&page=about")).toEqual({
      home: false,
      title: en.About.title,
      subtitle: en.About.lead,
      eyebrow: en.About.title.toUpperCase(),
      stack: null,
    });
    expect(card("locale=es&page=contact").subtitle).toBe(es.Contact.subtitle);
  });

  it("toma los textos de un proyecto de src/data", () => {
    const project = getProject("waypoint")!;
    expect(card("locale=en&project=waypoint")).toEqual({
      home: false,
      title: project.i18n.en.title,
      subtitle: project.i18n.en.tagline,
      eyebrow: "PROJECT",
      stack: fitStack(project.stack),
    });
  });

  it("ignora los textos que vengan en la URL", () => {
    const result = card("locale=es&title=Texto+falso&subtitle=x&eyebrow=y");
    expect(result.home).toBe(true);
    expect(result.title).toBeNull();
    expect(result.subtitle).toBe(es.Metadata.ogTagline);
  });

  it("cae en la portada con página, proyecto o idioma desconocidos", () => {
    expect(card("locale=es&page=admin").home).toBe(true);
    expect(card("locale=es&project=no-existe").home).toBe(true);
    expect(card("locale=fr&page=about").title).toBe(es.About.title);
  });
});

describe("fitStack", () => {
  it("toma las primeras tecnologías hasta llenar la fila, sin cortar ninguna", () => {
    expect(
      fitStack(["Python", "FastAPI", "PostgreSQL", "PostGIS", "Claude AI", "Telegram Bot API"])
    ).toEqual(["Python", "FastAPI", "PostgreSQL", "PostGIS", "Claude AI"]);
  });

  it("no pasa de seis etiquetas aunque sean cortas", () => {
    expect(fitStack(["a", "b", "c", "d", "e", "f", "g"])).toHaveLength(6);
  });

  it("todos los proyectos muestran al menos una tecnología", async () => {
    const { projects } = await import("@/data/projects");
    for (const p of projects) expect(fitStack(p.stack).length).toBeGreaterThan(0);
  });
});
