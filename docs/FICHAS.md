# Fichas de juegos — lineamientos

Para agentes y humanos que mantengan `/juegos/<keyword>/` (ES) y `/en/juegos/<keyword>/` (EN).

Si este archivo choca con un diseño puntual acordado en CMS, gana el **contenido** (copy, fotos). Layout mobile y breakpoints no se negocian.

## Arquitectura (2026-10)

| Pieza | Rol |
|---|---|
| `src/pages/juegos/[slug]/index.astro` | Una ruta estática por juego del CMS (19 keywords). |
| `src/components/GameFicha.astro` | Markup compartido: héroe, franjas, galería, CTA, bloque dev (proto). |
| `src/components/GameComponents.astro` | Mesa general + tiles (icono, cantidad grande); hover/click cambia foto si hay `image`. |
| `public/assets/comp-icons/` | 25 iconos (`rulebook` … `score-pad`). **Fuente:** recortes en `scripts/source/comp-icons-selected/` (`part-6` = rulebook … `part-30` = score-pad). Importar: `./scripts/import-comp-icons.sh`. Fallback auto-slice: `./scripts/rename-comp-icons.sh` + `scripts/source/ICONOS.png`. |
| `src/lib/comp-icons.ts` | `COMP_ICON_SLUGS` + `resolveComponentIcon`: slug en `components[].icon` (CMS select o overlay). Sin icono → `tokens-stack`. |
| `src/styles/ficha.css` | Grid 12 col, héroe full-bleed, shell 8/12 (`cols 3–10`). |
| `src/lib/ficha.ts` | Tipos + `toFicha()` desde `GameCard`. |
| `src/lib/ficha-theme.ts` | Skin por juego → CSS vars (`fichaThemeVars`, `fichaThemeStyle`). |
| `src/lib/ficha-overlays.ts` | `buildLegacyFicha`: CMS + `i18n/fichas/*`. Componentes vía helper `comp(locale, qty, nameEn, nameEs, icon, detail?)`. Bloque dev proto: `protoDev(t, …)`. |
| `src/content/games/<keyword>.md` | Fuente de verdad: copy, estado, paleta, fotos, `howTo`, premios, etc. |
| `src/pages/juegos/old/<keyword>/` | Fichas Astro legacy (13), deprecadas. URL: `/juegos/old/<keyword>/`. |

**Reservado en rutas:** `old/`. No crear `src/pages/juegos/<keyword>/` salvo que quieras anular el catch-all a propósito.

### Skin (tema por juego, no “modo oscuro”)

- `publicado` vs `proto` cambia **contenido** (comprar vs probar por IG, bloque “en qué estamos”), **no** una paleta alternativa.
- Colores y fuentes vienen del CMS (`bg`, `titleColor`, `taglineColor`, `palette`, …). **`ficha-theme.ts` calcula texto legible** por superficie: cuerpo en papel de estudio (`--ficha-on-light-*`, sin `#fff`/`#000` puros), franja de inspiración (`--ficha-on-band-*`), header/footer (`--ficha-header-*`). `titleColor` sigue mandando en chrome del sitio cuando contrasta con `bg`.
- Cuatro colores por juego: **familia del principal + apoyo contrapunto** (base / primary / apoyo / tinta) → [PALETAS_FICHA.md](./PALETAS_FICHA.md). Cómo pedirlas bien: [PALETAS_WORKFLOW.md](./PALETAS_WORKFLOW.md).
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
- Nínive / Reloj: overlays en `ficha-overlays.ts` (reglas, galería, URLs Ludoísmo, bloque dev en Reloj, etc.).

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

**Plantilla detallada (CMS + i18n + overlay + componentes):** [FICHA_ESTRUCTURA_EJEMPLO.md](./FICHA_ESTRUCTURA_EJEMPLO.md).

**Montajes de mesa ya acordados (Canes, Mantas, Nínive):** [MONTAJES.md](./MONTAJES.md).

Keyword = una palabra, igual al archivo CMS. Ejemplo: `almagesto` → `/juegos/almagesto` y `/en/juegos/almagesto`.

1. **CMS** — `src/content/games/<keyword>.md` (o `/admin/`). Frontmatter ES + campos `*En`. Obligatorio: `conceptos` (tuple de 3 strings: temática, estilo visual, mecánicas). Brief para imágenes; no se pinta en la web.
2. **Asset** — `public/assets/concepto-<keyword>.webp` para portafolio y héroe de ficha.
3. **Build** — `npm run build`. Deben salir ES + EN sin crear carpeta en `src/pages/juegos/<keyword>/`.
4. **Contenido extra** (opcional): campos opcionales del schema (`howTo`, `fotos`, `pitchTitle`, …) o entrada en `ficha-overlays.ts` si hace falta lógica que no cabe en YAML.

### Wrapper EN

Ya centralizado: `src/pages/en/juegos/[slug]/index.astro` reexporta la página ES.

### Diccionarios `src/i18n/fichas/<keyword>.ts`

Siguen existiendo para las fichas archivadas y como referencia de copy. La ficha unificada lee **CMS** y mezcla diccionario vía `ficha-overlays.ts` cuando hay overlay. Si migras secciones de un juego archivado, mueve el texto al markdown CMS o a un overlay explícito.

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
