# Fichas de juegos — lineamientos

Para agentes y humanos que mantengan `/juegos/<keyword>/` (ES) y `/en/juegos/<keyword>/` (EN).

Si este archivo choca con un diseño puntual acordado en CMS, gana el **contenido** (copy, fotos). Layout mobile y breakpoints no se negocian.

## Arquitectura (2026-10)

| Pieza | Rol |
|---|---|
| `src/pages/juegos/[slug]/index.astro` | Una ruta estática por juego del CMS (19 keywords). |
| `src/components/GameFicha.astro` | Markup compartido: héroe, franjas, galería, CTA, bloque dev (proto). |
| `src/styles/ficha.css` | Grid 12 col, héroe full-bleed, shell 8/12 (`cols 3–10`). |
| `src/lib/ficha.ts` | Tipos + `toFicha()` desde `GameCard`. |
| `src/lib/ficha-theme.ts` | Skin por juego → CSS vars (`fichaThemeVars`, `fichaThemeStyle`). |
| `src/lib/ficha-demos.ts` | Overlays ricos para **Nínive** y **Reloj**. |
| `src/lib/ficha-overlays.ts` | `buildLegacyFicha`: CMS + copy/fotos de `i18n/fichas/*` (13 juegos con ficha old). |
| `src/content/games/<keyword>.md` | Fuente de verdad: copy, estado, paleta, fotos, `howTo`, premios, etc. |
| `/juegos/plantilla/` | Demo interna (toggle Nínive publicado / Reloj proto). **No** duplicar en prod. |
| `src/pages/juegos/old/<keyword>/` | Fichas Astro legacy (13), deprecadas. URL: `/juegos/old/<keyword>/`. |

**Reservado en rutas:** `plantilla/` y `old/`. No crear `src/pages/juegos/<keyword>/` salvo que quieras anular el catch-all a propósito.

### Skin (tema por juego, no “modo oscuro”)

- `publicado` vs `proto` cambia **contenido** (comprar vs probar por IG, bloque “en qué estamos”), **no** una paleta alternativa.
- Colores y fuentes vienen del CMS (`bg`, `titleColor`, `taglineColor`, `palette`, …). **`ficha-theme.ts` calcula texto legible** por superficie: página blanca (`--ficha-on-light-*`), franja pitch (`--ficha-on-band-*`), header/footer (`--ficha-header-*`). `titleColor` sigue mandando en chrome del sitio cuando contrasta con `bg`.
- Página:

```astro
<BaseLayout
  bodyClass="ficha-page"
  theme={fichaThemeVars(ficha)}
  themeColor={ficha.bg}
  fontUrl={CAJA_FONTS_URL}
>
  <GameFicha ficha={ficha} locale={locale} />
</BaseLayout>
```

- `body.ficha-page` en `ficha.css` enlaza header/footer a `--ficha-header-*` / `--ficha-footer-*`.

### Tipografía

- Pares título + cuerpo documentados en **`docs/FUENTES_JUEGOS.md`** (criterio tipo [Fontpair](https://fontpair.co/all)).
- `bodyFont` en CMS alimenta párrafos y UI de sección; si falta, cae en `taglineFont`.

### Héroe e imagen

- Grid desktop: col 1 vacía; copy cols **2–4**; imagen cols **5–12** (arte a la derecha, copy alineado a la derecha dentro de su columna).
- Imagen por defecto: **`/assets/concepto-<keyword>.webp`** (`fichaConceptArtUrl`) — mismo arte que el portafolio.
- Nínive / Reloj: overlays en `ficha-demos.ts` (reglas, galería, URLs Ludoísmo, etc.).

### CTA proto

- Instagram DM normalizado: `src/lib/instagram.ts` → `https://ig.me/m/estudioalpargatas/`.

## Breakpoints oficiales

Tres cortes. **No inventar 680 / 700 / 720 / 780 / 800 / 1100.**

| Corte | Ancho | Qué pasa |
|---|---|---|
| Tablet | `max-width: 980px` | Héroe y secciones 2 col → **1 col**. |
| Phone | `max-width: 760px` | Nav compacto, gutter `1.5rem`, galerías 1 col. |
| Small | `max-width: 520px` | Grillas densas → 2 o 1 col. |

Viven en `src/styles/global.css` y se repiten en `ficha.css` donde aplique.

## Receta para un juego nuevo

Keyword = una palabra, igual al archivo CMS. Ejemplo: `almagesto` → `/juegos/almagesto` y `/en/juegos/almagesto`.

1. **CMS** — `src/content/games/<keyword>.md` (o `/admin/`). Frontmatter ES + campos `*En`. Obligatorio: `conceptos` (tuple de 3 strings: temática, estilo visual, mecánicas). Brief para imágenes; no se pinta en la web.
2. **Asset** — `public/assets/concepto-<keyword>.webp` para portafolio y héroe de ficha.
3. **Build** — `npm run build`. Deben salir ES + EN sin crear carpeta en `src/pages/juegos/<keyword>/`.
4. **Contenido extra** (opcional): campos opcionales del schema (`howTo`, `fotos`, `pitchTitle`, …) o overlay en `ficha-demos.ts` si hace falta lógica que no cabe en YAML.

### Wrapper EN

Ya centralizado: `src/pages/en/juegos/[slug]/index.astro` reexporta la página ES.

### Diccionarios `src/i18n/fichas/<keyword>.ts`

Siguen existiendo para las fichas archivadas y como referencia de copy. La plantilla unificada lee **CMS**; solo Nínive/Reloj mezclan diccionario vía `ficha-demos.ts`. Si migras secciones de un juego archivado, mueve el texto al markdown CMS o a un overlay explícito.

## Qué no hacer

- Breakpoints ad hoc.
- `src/pages/juegos/<keyword>/` duplicado (colisiona con `[slug]` si no está en `RESERVED`).
- Links relativos (`../`) — usar `localizePath('/juegos/otro/', locale)`.
- Meter copy EN en el `.astro` de producción.
- Confundir “proto” con un tema oscuro global.

## Checklist visual (DevTools)

- 1200 desktop — héroe 12 col, imagen pegada a la derecha, shell 8/12 en cuerpo.
- 980 tablet — héroe apilado.
- 760 phone — nav OK, gutter 1.5rem, CTA legible.
- 390 — h1 entra, badges wrap, sin scroll horizontal.
- `/en/juegos/<keyword>/` — mismo layout, copy EN del CMS, switcher CL/US OK.
