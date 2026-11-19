# Pendientes

Resultado de la revisión del proyecto del 2026-11-19. El estado de partida está en verde: `typecheck`, `lint` y `build` pasan sin avisos, y `npm audit` no reporta vulnerabilidades.

Los puntos están ordenados por prioridad. Al cerrar uno, se marca la casilla y se anota el commit. Los arreglos están en la rama `chore/pendientes-revision`.

**Fuera de esta lista:** 14 archivos (los de `src/components/ui/`, `src/i18n/`, `src/lib/utils.ts`, `tsconfig.json` y otros) ya no seguían el formato de Prettier antes de la revisión. `npm run format` los arregla; conviene hacerlo en un commit aparte y agregar `prettier --check` a CI.

| #   | Pendiente                                                          | Prioridad | Esfuerzo | Estado     |
| --- | ------------------------------------------------------------------ | --------- | -------- | ---------- |
| 1   | Una IP agota el tope diario del asistente                          | Alta      | Bajo     | Hecho      |
| 2   | `Origin: null` produce un error 500 en `/api/ask`                  | Media     | Bajo     | Hecho      |
| 3   | Todos los casos de estudio se envían al navegador en cada página   | Media     | Bajo     | Hecho      |
| 4   | Node 20 sin soporte en Netlify y CI                                | Media     | Bajo     | Hecho      |
| 5   | README desactualizado                                              | Media     | Bajo     | Hecho      |
| 6   | Tests de las funciones puras                                       | Media     | Medio    | Hecho      |
| 7   | El límite del asistente no es atómico ni compartido si Blobs falla | Baja      | Medio    | Hecho      |
| 8   | El cliente puede inventar turnos del asistente                     | Baja      | Bajo     | Descartado |
| 9   | `/og` genera imágenes con cualquier texto                          | Baja      | Medio    | Hecho      |
| 10  | El honeypot no se envía desde el formulario con JS                 | Baja      | Bajo     | Hecho      |
| 11  | Dependencias con versiones nuevas                                  | Baja      | Variable | Parcial    |

---

## 1. Una IP agota el tope diario del asistente

- [x] Hecho (2026-11-19, commit `1388e57`)

**Resuelto:** `checkRateLimit` cuenta primero la IP y solo después el global. Test en [`rate-limit.test.ts`](src/lib/ask/rate-limit.test.ts), comprobado que falla con el código anterior.

**Dónde:** [`src/lib/ask/rate-limit.ts:75-77`](src/lib/ask/rate-limit.ts#L75-L77)

**Problema:** `checkRateLimit` suma al contador global (`day:`) antes de revisar el límite por IP. Una IP que ya está bloqueada sigue sumando al global con cada petición. Con unas 300 peticiones desde una sola IP, de las que solo 10 llegan a Anthropic, se llena `DAILY_LIMIT` y el asistente queda apagado para todos hasta el día siguiente.

**Arreglo:** revisar primero el límite por IP y sumar al global solo cuando la IP pasa. Lo ideal es consultar los dos contadores y luego incrementar los dos, para que una petición rechazada por el tope global tampoco consuma cupo de la IP.

**Cómo verificar:** con un test o en local, mandar 20 peticiones desde la misma IP. El contador `day:` debe quedar en 10, no en 20.

---

## 2. `Origin: null` produce un error 500 en `/api/ask`

- [x] Hecho (2026-11-19, commit `de98ccc`)

**Resuelto:** `isSameOrigin()` en [`src/lib/ask/request.ts`](src/lib/ask/request.ts) responde 403 cuando el Origin no es una URL. Probado con `curl` contra `next start`.

**Dónde:** [`src/app/api/ask/route.ts:50`](src/app/api/ask/route.ts#L50)

**Problema:** `new URL(origin)` lanza `TypeError: Invalid URL` cuando el navegador manda `Origin: null`, cosa que hacen los iframes sandbox, algunas redirecciones y ciertos modos de privacidad. La excepción no se captura y la respuesta es un 500 en vez de un 403.

**Arreglo:** envolver el parseo en `try/catch` y responder 403 si falla, o comparar `origin` contra `https://${host}` y `http://${host}` sin parsear.

**Cómo verificar:** `curl -X POST -H "Origin: null" -H "Content-Type: application/json" -d '{}' localhost:3000/api/ask` debe devolver 403.

---

## 3. Todos los casos de estudio se envían al navegador en cada página

- [x] Hecho (2026-11-19, commit `e181109`)

**Resuelto:** el layout le pasa a `AskWidget` solo `{ slug, title }` del idioma actual. Después del build, el texto de los casos de estudio solo aparece en el JS de `/projects`.

**Dónde:** [`src/components/ask/ask-widget.tsx:9`](src/components/ask/ask-widget.tsx#L9)

**Problema:** `AskWidget` es un componente cliente que va en el layout y que importa todo `@/data/projects`. Eso mete en un chunk de 44 KB (18 KB comprimido) todos los textos de problema, solución y resultado en los dos idiomas, y ese chunk se descarga en todas las páginas. El widget solo usa `slug` y `title` para validar y mostrar las referencias `[[project:...]]`.

**Arreglo:** construir en el layout, que es un componente de servidor, una lista reducida `{ slug, title }[]` para el idioma actual y pasarla como prop a `AskWidget`. `isValidRef` y `RefChip` pasan a usar esa lista.

**Cómo verificar:** después de `npm run build`, `grep -l "FOR UPDATE SKIP LOCKED" .next/static/chunks/*.js` no debe encontrar nada fuera de la página de `/projects`.

> `projects-explorer.tsx` también es cliente e importa los datos completos, pero solo carga en `/projects`. Se puede reducir con el mismo patrón si se quiere.

---

## 4. Node 20 sin soporte en Netlify y CI

- [x] Hecho (2026-11-19, commit `455e336`)

**Resuelto:** Node 24 en `netlify.toml`, `.nvmrc` (CI lo lee con `node-version-file`) y `engines: >=22` en `package.json`.

**Dónde:** [`netlify.toml`](netlify.toml) (`NODE_VERSION = "20"`) y [`.github/workflows/ci.yml`](.github/workflows/ci.yml) (`node-version: 20`)

**Problema:** Node 20 dejó de tener soporte en abril de 2026.

**Arreglo:** subir a Node 22 o 24 en los dos archivos, siempre a la misma versión. Opcionalmente, agregar `"engines": { "node": ">=22" }` en `package.json` y un `.nvmrc` para que el entorno local coincida.

**Cómo verificar:** CI en verde y un deploy de Netlify correcto con la versión nueva en el log.

---

## 5. README desactualizado

- [x] Hecho (2026-11-19, commit `87059b4`)

**Resuelto:** se corrigieron los seis puntos de abajo y se agregó una sección sobre el asistente IA.

**Dónde:** [`README.md`](README.md)

Cosas a corregir:

- [x] Dice "CSS keyframes (no animation library)", pero el proyecto usa `motion`.
- [x] Menciona "Server Actions", y no hay ninguna.
- [x] Lista `public/resume.pdf`, que ahora está en `public/cv/gerardo-amaya-{es,en}.pdf`. `/resume.pdf` redirige al CV en inglés.
- [x] No menciona el asistente IA: el endpoint `/api/ask`, `src/lib/ask/`, `src/data/assistant-profile.ts`, la variable `ANTHROPIC_API_KEY` y `ASK_MODEL` opcional, los límites de uso y el uso de Netlify Blobs.
- [x] La estructura del proyecto no incluye `src/components/ask/`, `src/components/motion/` ni `src/app/api/`.
- [x] Agregar un enlace a este archivo.

---

## 6. Tests de las funciones puras

- [x] Hecho (2026-11-19, commit `fcc834c`)

**Resuelto:** Vitest 5.0.5 con 28 tests, `npm test` y un paso en CI. `parse()`, el parser de respuestas y los parámetros de `/og` se movieron a módulos propios (`src/lib/ask/request.ts`, `src/lib/ask/answer.ts`, `src/app/og/params.ts`), porque Next no permite exportar funciones extra desde un `route.ts`.

> Para agregar Vitest hubo que usar npm 11 (`npx npm@11.21.1 install -D vitest`): npm 10.9 falla con `Cannot read properties of null (reading 'edgesOut')` al resolver los peers opcionales de Vitest. Con el lockfile ya generado, `npm install` y `npm ci` funcionan con npm 10.

**Problema:** el proyecto no tiene tests y CI solo corre typecheck, lint y build. El bug del punto 1 es justo del tipo que un test atrapa.

**Arreglo:** agregar Vitest y cubrir primero lo que no necesita navegador:

- [x] `parse()` de [`route.ts`](src/app/api/ask/route.ts): roles inválidos, turnos que no alternan, historial que empieza con el asistente, recortes de longitud. Para probarla hay que exportarla o moverla a `src/lib/ask/`.
- [x] `checkRateLimit()` de [`rate-limit.ts`](src/lib/ask/rate-limit.ts), con el almacenamiento en memoria: límite por IP, tope diario y el caso del punto 1.
- [x] El parser de `Answer` e `Inline` de [`ask-widget.tsx`](src/components/ask/ask-widget.tsx): viñetas, negritas, referencias inventadas y referencias a medio llegar. Conviene sacar la lógica a una función pura.
- [x] `text()` y `size()` de [`og/route.tsx`](src/app/og/route.tsx).
- [x] Agregar el paso `npm test` en CI.

---

## 7. El límite del asistente no es atómico ni compartido si Blobs falla

- [x] Hecho (2026-11-19, commit `1388e57`)

**Resuelto:** cada incremento lee con consistencia fuerte y escribe con `onlyIfMatch` / `onlyIfNew`, con hasta 4 reintentos. Si Blobs falla, la instancia usa memoria durante 5 minutos y luego vuelve a intentarlo. Si el entorno no ofrece lectura fuerte, vuelve a la escritura simple. **Falta verificarlo en Netlify:** revisar en los logs de la función que no aparezca `[ask] blobs`.

**Dónde:** [`src/lib/ask/rate-limit.ts`](src/lib/ask/rate-limit.ts)

**Problema:**

- `bump` lee el contador, lo incrementa y lo vuelve a escribir. Dos peticiones simultáneas pueden leer el mismo valor, así que el límite se puede superar un poco.
- Si Blobs falla una sola vez, `blobsDisabled = true` deja a esa instancia usando solo memoria hasta que se reinicia. Con varias instancias, el límite deja de ser compartido.

**Arreglo posible:** usar escrituras condicionales de Netlify Blobs (ETag / `onlyIfMatch`) con un reintento, y reactivar Blobs después de un tiempo (por ejemplo, 5 minutos) en vez de desactivarlo para siempre.

**Mitigación actual:** el tope de gasto en la consola de Anthropic sigue siendo la red de seguridad. Por eso la prioridad es baja.

---

## 8. El cliente puede inventar turnos del asistente

- [x] Descartado (2026-11-19)

**Decisión:** se deja como está. Acortar o quitar los turnos del asistente le resta contexto a las preguntas de seguimiento, y el riesgo ya está acotado por el system prompt, el límite de 450 tokens de salida y el límite de uso.

**Dónde:** [`src/app/api/ask/route.ts:27`](src/app/api/ask/route.ts#L27)

**Problema:** el historial completo llega desde el navegador, incluidas las respuestas "del asistente". Alguien puede fabricar turnos previos para empujar al modelo fuera de sus reglas. El riesgo es bajo: el system prompt indica tratar los mensajes como datos, la salida está limitada a 450 tokens y el límite de uso acota el gasto.

**Arreglo posible:** acortar más los turnos del asistente que llegan del cliente (ahora 2000 caracteres) o mandar solo las preguntas del usuario más un resumen. Decidir si vale la pena: también le quita contexto a las preguntas de seguimiento.

---

## 9. `/og` genera imágenes con cualquier texto

- [x] Hecho (2026-11-19, commit `aa48455`)

**Resuelto con la opción B:** `/og` solo acepta `locale` y `page` o `project` (`/og?locale=en&project=waypoint`), y los textos salen de `messages/` y `src/data` ([`src/app/og/cards.ts`](src/app/og/cards.ts)). Cualquier otro parámetro, incluidos los `?title=` viejos, recibe la tarjeta de la portada. Probado contra `next start`: las imágenes se ven igual que antes.

**Dónde:** [`src/app/og/route.tsx:196`](src/app/og/route.tsx#L196)

**Problema:** `/og?title=...&subtitle=...` acepta cualquier texto, así que cualquiera puede generar en tu dominio una imagen con tu marca y un mensaje arbitrario, que además queda cacheada un año (`immutable`).

**Arreglo posible:**

- Opción A: firmar los parámetros con un HMAC (`&sig=...`) usando un secreto del servidor y responder 400 si la firma no coincide.
- Opción B: aceptar solo un identificador (`?page=about&locale=es`, `?project=waypoint&locale=en`) y obtener los textos de `messages/` y `src/data/` en el servidor.

La opción B es más simple y además acorta las URL.

---

## 10. El honeypot no se envía desde el formulario con JS

- [x] Hecho (2026-11-19, commit `49048b9`)

**Resuelto:** el `fetch` envía `bot-field` y el campo oculto tiene `tabIndex={-1}` y `autoComplete="off"`.

**Dónde:** [`src/components/sections/contact-form.tsx:78`](src/components/sections/contact-form.tsx#L78)

**Problema:** el `fetch` arma el body solo con `name`, `email` y `message`, así que `bot-field` nunca llega a Netlify cuando el formulario se envía por JS. Un bot con navegador real que rellene todos los campos pasa el filtro.

**Arreglo:** incluir `bot-field` en el body, o cortar en el cliente si viene con contenido. Al campo oculto también le conviene `tabIndex={-1}` y `autoComplete="off"`.

---

## 11. Dependencias con versiones nuevas

- [ ] Hecho: actualizaciones menores listas (2026-11-19, commit `501ba9e`); mayores pendientes

**Criterio:** solo versiones con al menos dos semanas publicadas. Por eso `next-intl` quedó en 4.14.9 (no 4.15.3), Tailwind en 4.3.4 (no 4.3.5), PostCSS en 8.5.32, Prettier en 3.9.10 y `@anthropic-ai/sdk` sigue en 1.9.0 (1.10 y 1.11 salieron esta semana). Se pueden subir en la próxima revisión.

Salida de `npm outdated` el 2026-11-19.

**Versiones menores (actualizar juntas, bajo riesgo):**

- [x] `next-intl` 4.11 → 4.14.9 (4.15 cuando tenga dos semanas)
- [x] `react` / `react-dom` 19.2 → 19.3
- [x] `@radix-ui/*` (dialog 1.3, dropdown-menu 2.2, label 2.1.17, slot 1.5)
- [x] `tailwindcss` / `@tailwindcss/postcss` 4.2 → 4.3.4
- [ ] `@anthropic-ai/sdk` 1.9 → 1.11 (esperar a que 1.11 tenga dos semanas)
- [x] `tailwind-merge`, `postcss`, `prettier`, `@types/*`

**Versiones mayores (cada una por separado, revisando el changelog):**

- [ ] `lucide-react` 0.469 → 1.x: pueden haber cambiado nombres de íconos.
- [ ] `prettier-plugin-tailwindcss` 0.6 → 0.8
- [ ] `eslint` 9 → 10: esperar a que `eslint-config-next` lo soporte.
- [ ] `typescript` 5.9 → 7: esperar a que Next lo soporte oficialmente.

**Cómo verificar:** `npm run typecheck && npm run lint && npm run build` y una revisión visual del sitio después de cada grupo.
