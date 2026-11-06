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
| `src/lib/comp-icons.ts` | `COMP_ICON_SLUGS` + `resolveComponentIcon`: slug en `components[].icon` (CMS). Sin icono → `tokens-stack`. |
| `src/styles/ficha.css` | Grid 12 col, héroe full-bleed, shell 8/12 (`cols 3–10`). |
| `src/lib/ficha.ts` | Tipos + `toFicha()` / `applyFichaChrome()`. El copy sale del CMS. El cromo (arte `concepto-<keyword>` y pie común) lo pone la plantilla. |
| `src/lib/ficha-theme.ts` | Skin por juego → CSS vars (`fichaThemeVars`, `fichaThemeStyle`). |
| `src/content/games/<keyword>.md` | Única fuente de la ficha nueva: copy, estado, paleta, fotos, componentes, archivos. |
| `src/i18n/fichas/<keyword>.ts` | Solo alimenta `/juegos/old/`. No entra en la ficha nueva. |
| `src/pages/juegos/old/<keyword>/` | Fichas Astro legacy, archivo histórico. URL: `/juegos/old/<keyword>/`. |

**Reservado en rutas:** `old/`. No crear `src/pages/juegos/<keyword>/` salvo que quieras anular el catch-all a propósito.

### Skin (cuatro colores + modo explícito)

- `publicado` vs `proto` cambia **contenido** (comprar vs probar por IG, bloque “en qué estamos”), **no** una paleta alternativa.
- **Color en ficha:** solo los cuatro `palette` → `--ficha-c-{base,primary,apoyo,tinta}` en `<body>`. Los tokens derivados se calculan en `ficha-colors.ts` y se aplican en `ficha.css` según **`data-band="light|dark"`**, elegido explícitamente mediante `fichaMode` en CMS; ver [PALETAS_FICHA.md](./PALETAS_FICHA.md).
- `bg` / `titleColor` / `taglineColor` del CMS **no** alimentan la ficha (portafolio / legacy).
- Cuatro colores: **familia + apoyo contrapunto** — cómo pedirlos: [PALETAS_WORKFLOW.md](./PALETAS_WORKFLOW.md).
- Página:

```astro
<BaseLayout
  bodyClass="ficha-page"
  theme={fichaThemeVars(ficha)}
  themeColor={fichaThemeColor(ficha)}
  fichaBand={fichaBandMode(ficha)}
  fichaOnPrimary={fichaOnPrimary(ficha)}
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
- Imagen del héroe: **`/assets/concepto-<keyword>.webp`** (`fichaConceptArtUrl`). El campo `image` del CMS sigue siendo el del portafolio; la ficha no lo usa como arte principal.

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

**Plantilla detallada (CMS + componentes):** [FICHA_ESTRUCTURA_EJEMPLO.md](./FICHA_ESTRUCTURA_EJEMPLO.md).

**Montajes de mesa ya acordados (Canes, Mantas, Nínive):** [MONTAJES.md](./MONTAJES.md).

Keyword = una palabra, igual al archivo CMS. Ejemplo: `almagesto` → `/juegos/almagesto` y `/en/juegos/almagesto`.

1. **CMS** — `src/content/games/<keyword>.md` (o `/admin/`). Frontmatter ES + campos `*En`. Obligatorio: `conceptos` (tuple de 3 strings: temática, estilo visual, mecánicas). Brief para imágenes; no se pinta en la web. Ahí también van pitch, how-to, componentes, fotos, edad, cocreador y archivos.
2. **Asset** — `public/assets/concepto-<keyword>.webp` para portafolio y héroe de ficha.
3. **Build** — `npm run build`. Deben salir ES + EN sin crear carpeta en `src/pages/juegos/<keyword>/`.

### Wrapper EN

Ya centralizado: `src/pages/en/juegos/[slug]/index.astro` reexporta la página ES.

### Diccionarios `src/i18n/fichas/<keyword>.ts`

Solo los lee `/juegos/old/`. La ficha nueva no los importa. Si un texto de una página vieja tiene que verse en `/juegos/<keyword>/`, se copia al markdown.

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
