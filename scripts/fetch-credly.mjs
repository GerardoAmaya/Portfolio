#!/usr/bin/env node
/**
 * Sincroniza las insignias públicas de Credly.
 *
 * Descarga la imagen de cada insignia a `public/certifications/` y regenera
 * `src/data/certifications.ts`. Las imágenes se guardan en el repo en vez de
 * enlazarse al CDN de Credly: así la sección no depende de un servicio ajeno
 * ni filtra una petición del visitante hacia un tercero, y Next puede
 * optimizarlas.
 *
 * Uso: npm run credly:sync
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const USERNAME = "gerardo-alberto-amaya-fuentes";
const API = `https://www.credly.com/users/${USERNAME}/badges.json?page=1&page_size=100`;
const IMAGES_DIR = path.join(process.cwd(), "public", "certifications");
const DATA_FILE = path.join(process.cwd(), "src", "data", "certifications.ts");

/** Nombre de archivo estable y legible a partir del nombre de la insignia */
function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Quita el sufijo redundante: en la tarjeta ya se ve que es una insignia */
function cleanName(name) {
  return name.replace(/\s+Skill Badge$/i, "").trim();
}

async function main() {
  const res = await fetch(API, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Credly respondió ${res.status}`);

  const { data } = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Credly no devolvió insignias; se aborta sin tocar nada");
  }

  await mkdir(IMAGES_DIR, { recursive: true });

  const badges = [];

  for (const badge of data) {
    const template = badge.badge_template;
    const issuer = template.issuer.entities.find((e) => e.primary)?.entity.name ?? "";
    const slug = slugify(cleanName(template.name));
    const file = `${slug}.png`;

    const image = await fetch(template.image_url);
    if (!image.ok) throw new Error(`No se pudo bajar la imagen de ${template.name}`);
    await writeFile(path.join(IMAGES_DIR, file), Buffer.from(await image.arrayBuffer()));

    badges.push({
      id: badge.id,
      slug,
      name: cleanName(template.name),
      issuer,
      image: `/certifications/${file}`,
      issuedAt: badge.issued_at_date,
      expiresAt: badge.expires_at_date ?? null,
      level: template.level ?? null,
      // Distingue certificación de insignia de habilidad: una certificación
      // vence o se llama a sí misma certificación. Mezclarlas sin distinguir
      // infla el conjunto, y el detalle lo nota justo quien sabe leerlo
      isCertification: Boolean(badge.expires_at_date) || /certifi(cation|ed)/i.test(template.name),
      url: `https://www.credly.com/badges/${badge.id}/public_url`,
      skills: (template.skills ?? []).map((s) => s.name),
    });
  }

  // Más recientes primero
  badges.sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));

  const contents = `// Generado por scripts/fetch-credly.mjs — no editar a mano.
// Última sincronización: ${new Date().toISOString().slice(0, 10)}

export type Certification = {
  id: string;
  slug: string;
  name: string;
  issuer: string;
  image: string;
  /** Fecha ISO de emisión */
  issuedAt: string;
  /** Fecha ISO de vencimiento, o null si la insignia no expira */
  expiresAt: string | null;
  level: string | null;
  /** true para certificaciones formales (las que vencen), false para skill badges */
  isCertification: boolean;
  /** Página pública de verificación en Credly */
  url: string;
  skills: string[];
};

export const credlyProfileUrl = "https://www.credly.com/users/${USERNAME}/badges";

export const certifications: Certification[] = ${JSON.stringify(badges, null, 2)};
`;

  await writeFile(DATA_FILE, contents, "utf8");
  console.log(`${badges.length} insignias sincronizadas.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
