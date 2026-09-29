# Fichas de juegos — lineamientos

Para agentes y humanos que armen una página nueva en `/juegos/<keyword>/`.
Si este archivo choca con un diseño puntual de una ficha, gana el diseño **solo** en color/foto. Layout mobile y breakpoints no se negocian.

## Breakpoints oficiales

Tres cortes. **No inventar 680 / 700 / 720 / 780 / 800 / 1100.**

| Corte | Ancho | Qué pasa |
|---|---|---|
| Tablet | `max-width: 980px` | Héroes y secciones 2 col → **1 col**. Catálogos bajan un nivel (4→3). |
| Phone | `max-width: 760px` | Nav compacto, gutter `1.5rem`, títulos con `clamp`, galerías 1 col. |
| Small | `max-width: 520px` | Grillas densas (3–4 chips/cartas) → 2 o 1 col. Collage del home se achica. |

Viven en `src/styles/global.css`. Las fichas con `<style>` propio **repiten esos tres números**, no otros.

```css
@media (max-width: 980px) {
  .xx-hero-grid,
  .xx-cols { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .xx-shell { width: min(960px, calc(100% - 1.5rem)); }
}
@media (max-width: 520px) {
  .xx-cards { grid-template-columns: 1fr; }
}
```

Desktop queda libre: 2 col, 12-col, lo que pida el diseño.

## Shell y tipo

- Shell de ficha: `width: min(960px, calc(100% - 3rem)); margin-inline: auto;`
- A **760**: `calc(100% - 1.5rem)` — mismo gutter que `.shell` global.
- Títulos: `clamp()`, no `px` fijos gigantes. En phone el h1 de ficha no debería pasar ~`clamp(2.4rem, 12vw, 4rem)`.
- No `position: absolute` de fotos/números sobre el copy en mobile: a 760 se vuelven `static` o se apilan.
- Decoraciones `::before`/`::after` del hero: `display: none` a 980 si tapan texto.

## Receta para una ficha nueva

Keyword = una palabra, igual al archivo CMS. Ejemplo: `reloj` → `/juegos/reloj/` y `/en/juegos/reloj/`.

1. **CMS** — `src/content/games/<keyword>.md` (o `/admin/`). Frontmatter ES + campos `*En` (título, tagline, etc.). Obligatorio: `conceptos` con exactamente 3 strings, en este orden: temática, estilo visual, mecánicas. Es brief para el agente de imágenes; no se pinta en la web. Si falta, el glob-loader tira toda la colección.
2. **Diccionario** — `src/i18n/fichas/<keyword>.ts` con `{ es, en }`. Copiar uno cercano (`ninive.ts`, `canes.ts`).
3. **Página** — copiar `src/pages/juegos/plantilla/index.astro` → `src/pages/juegos/<keyword>/index.astro`.
   - `getLocale(Astro)` + `localizePath` en todos los `href` internos.
   - Textos desde el diccionario, no hardcodeados (salvo el nombre propio si no cambia).
4. **Wrapper EN** — `src/pages/en/juegos/<keyword>/index.astro`:

```astro
---
import Page from '../../../juegos/<keyword>/index.astro';
---
<Page />
```

5. **Layout** — `BaseLayout` con `title`, `description`, `bodyClass="page-<keyword>"`, `themeColor`.
6. **Extras** — si hay BGG/premios, `<GameExtras bggId awards />`. Premios: logo + link + título corto. Ancho de badge `4.75rem`.
7. **Build** — `npm run build`. Tiene que salir `/juegos/<keyword>/` y `/en/juegos/<keyword>/`.

Sin ficha diseñada, el catch-all `src/pages/juegos/[slug]/index.astro` arma una ficha mínima desde el markdown. El wrapper EN ya existe: `src/pages/en/juegos/[slug]/index.astro`.

## Qué no hacer

- Un breakpoint “porque en *esta* ficha se veía mejor a 720”.
- Padding de sección `6rem+` en mobile. En 760, `clamp(2rem, 6vw, 3.5rem)` alcanza.
- Grillas de 3+ columnas que no colapsan a 520.
- Links relativos (`../`) — usar `localizePath('/juegos/otro/', locale)`.
- Meter copy EN en el `.astro`. Va al diccionario o al frontmatter `*En`.

## Checklist visual (DevTools)

- 1200 desktop — 2 col, aire OK.
- 980 tablet — hero apilado, sin overlap.
- 760 phone — nav no se parte, textos no se montan, gutter 1.5rem.
- 390 iPhone — h1 entra, chips wrap, fotos no empujan horizontal (`overflow-x` no).
- `/en/juegos/<keyword>/` — mismo layout, copy en inglés, switcher CL/US funciona.
