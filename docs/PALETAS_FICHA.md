# Paletas de ficha — familia + contrapunto

Reglas para los cuatro colores de cada juego (`palette` en `src/content/games/*.md`).

**Antes de tocar hex:** leer [PALETAS_WORKFLOW.md](./PALETAS_WORKFLOW.md). Los colores vienen de **conceptos / arte**, no de una tabla genérica.

## Estrategia de los cuatro slots

Tres tonos de la **misma familia** que el principal + **apoyo** como **contrapunto** (complementario suave o segundo color icónico del juego — p. ej. naranja frente a azul en Nínive).

| Rol CMS | Índice | Variable CSS | Qué es |
|---|---|---|---|
| **base** | `palette[0]` | `--ficha-c-base` | Claro teñido del principal (crema, marfil, gris-cartoon…). |
| **primary** | `palette[1]` | `--ficha-c-primary` | Identidad del juego. |
| **apoyo** | `palette[2]` | `--ficha-c-apoyo` | **Contrapunto** — el otro color que el arte ya usa (links, bordes de cajitas, acento en banda oscura). |
| **tinta** | `palette[3]` | `--ficha-c-tinta` | Oscuro de la familia; texto en superficies claras. **No** es el CTA por sí solo. |

### Reglas al elegir hex

1. Base y tinta comparten matiz con el principal.
2. Apoyo = contraste temático (no repetir el mismo coral en todo el catálogo).
3. Sin `#fff` / `#000` puros; `studioSanitizeHex` los reemplaza por neutros de estudio (`src/lib/studio-neutral.ts`).
4. **`bg` / `titleColor` / `taglineColor` del CMS no pintan la ficha** — solo portafolio u otros contextos. En ficha manda `palette` + derivación abajo.

---

## Un solo sistema de color (no hay tema aparte)

Flujo fijo:

1. CMS → cuatro hex en `palette`.
2. `ficha-theme.ts` → inyecta `--ficha-c-{base,primary,apoyo,tinta}` + fuentes en `<body class="ficha-page">`.
3. `fichaBandMode()` elige **`data-band="light"`** o **`"dark"`** (una sola bifurcación).
4. `ficha.css` aplica **las mismas fórmulas** en cada rama (`color-mix` en sRGB).
5. `fichaOnPrimary()` elige **`data-on-primary="base|tinta"`** para texto del botón CTA (el que tenga mejor contraste sobre `--ficha-c-primary`).

No existe un “modo oscuro” manual en CMS hoy: la rama **light/dark** sale **solo** de la paleta. Si quieres una ficha que se sienta oscura, diseña los cuatro slots para que disparen **dark** (ver abajo). Las transformaciones de superficies son **idénticas** en todos los juegos.

Implementación:

- `src/lib/ficha-theme.ts` — paleta, `fichaBandMode`, `fichaOnPrimary`, fuentes
- `src/styles/ficha.css` — tablas `[data-band="light"]` / `[data-band="dark"]`
- `src/layouts/BaseLayout.astro` — `data-band`, `data-on-primary`

---

## Cómo se elige `data-band` (light vs dark)

Función `fichaBandMode` en `ficha-theme.ts` (luminancia relativa WCAG):

| Orden | Condición | Resultado |
|---|---|---|
| 1 | `palette[3]` (tinta) tiene luminancia **&lt; 0,22** | **dark** |
| 2 | `palette[1]` (primary) luminancia **&lt; 0,4** **y** `palette[0]` (base) es **≥ 0,12** más clara que el primary | **dark** |
| 3 | Si no | **light** |

**Ejemplos:**

- **Nínive** (`base` crema + `primary` azul medio): entra en regla 2 → **dark** (página teñida, cajitas oscuras, apoyo naranja en links de componentes).
- **Canes** (`primary` verde legible + base clara, tinta no ultra-oscura): suele quedar **light** (cajitas tipo celeste = mezcla primary + base).
- **Chauvet / Palomas** (tinta muy oscura): regla 1 → **dark**.

Para **forzar sensación “ficha clara”** (cajitas celestes, header = base): sube la luminancia del **primary** (≈ ≥ 0,4) o acerca base y primary para no cumplir la regla 2. No hace falta otro campo en CMS.

---

## Derivación por token (antecedente para paletas finales)

Notación: `mix(A p%, B)` = `color-mix(in srgb, A p%, B)`.

### Rama `data-band="light"`

| Token semántico | Fórmula |
|---|---|
| `--ficha-page-bg` | `base` |
| `--ficha-bg` | `mix(primary 22%, base)` |
| `--ficha-band-bg` | `mix(primary 18%, base)` |
| `--ficha-on-light-title` (h1 héroe) | `primary` |
| `--ficha-on-light-ink` | `tinta` |
| `--ficha-on-light-tag` | `mix(tinta 58%, base)` |
| `--ficha-on-light-muted` | `mix(tinta 42%, base)` |
| `--ficha-on-band-title` | `tinta` |
| `--ficha-on-band-muted` | `mix(tinta 52%, primary)` |
| `--ficha-accent` (nav hover, acentos UI) | `primary` |
| `--ficha-link-on-light` | `apoyo` |
| `--ficha-line` | `mix(tinta 16%, transparent)` |
| `--ficha-card` | `mix(primary 10%, base)` |
| **Cajitas** (`--ficha-award-bg`) | `mix(primary 16%, base)` |
| `--ficha-award-bar` (sombra/borde activo) | `apoyo` |
| `--ficha-award-border` | `mix(apoyo 45%, base)` |
| `--ficha-award-title` (texto principal cajita) | `tinta` |
| `--ficha-award-link` (nombre componente, link premio) | `apoyo` |
| `--ficha-header-bg` | = `page-bg` |
| `--ficha-header-text` | `tinta` |
| `--ficha-header-muted` | `mix(tinta 50%, base)` |

### Rama `data-band="dark"`

| Token semántico | Fórmula |
|---|---|
| `--ficha-page-bg` | `mix(base 34%, tinta)` |
| `--ficha-bg` | `tinta` |
| `--ficha-band-bg` | `tinta` |
| `--ficha-on-light-title` (h1 héroe) | `base` |
| `--ficha-on-light-ink` | `base` |
| `--ficha-on-light-tag` | `mix(base 62%, apoyo)` |
| `--ficha-on-light-muted` | `mix(base 48%, apoyo)` |
| `--ficha-on-band-title` | `base` |
| `--ficha-on-band-muted` | `mix(base 55%, apoyo)` |
| `--ficha-accent` | `apoyo` |
| `--ficha-link-on-light` | `apoyo` |
| `--ficha-line` | `mix(base 22%, transparent)` |
| `--ficha-card` | `mix(base 12%, tinta)` |
| **Cajitas** (`--ficha-award-bg`) | `mix(base 14%, tinta)` |
| `--ficha-award-bar` | `apoyo` |
| `--ficha-award-border` | `mix(apoyo 38%, tinta)` |
| `--ficha-award-title` | `base` |
| `--ficha-award-link` | `apoyo` |
| `--ficha-header-bg` | `tinta` |
| `--ficha-header-text` | `base` |
| `--ficha-header-muted` | `mix(base 52%, apoyo)` |

Footer hereda `--ficha-header-*` en ambas ramas.

### CTA primary (ambas ramas)

| Token | Fórmula |
|---|---|
| Fondo botón | `--ficha-c-primary` (directo en `.ficha-cta`) |
| Texto botón | `--ficha-on-accent` → `base` o `tinta` según `data-on-primary` (mejor contraste 4.5:1) |

### Tipografía de cajitas (transversal)

Premios, facts y componentes: **Nunito Medium Italic 500** (`--ficha-caja-weight` / `--ficha-caja-style` en `ficha.css`). Excepción JP: `--ficha-section-font` = Zen Maru Gothic cuando el juego lo define en `bodyFont`.

---

## Checklist al cerrar una paleta

1. Cuatro slots con roles correctos (base / primary / apoyo / tinta).
2. Previsualizar en dev: ¿**light** o **dark** te da la atmósfera que buscas? Ajustar luminancia de primary/tinta si no.
3. Cajitas: en **light**, fondo ≈ primary suave sobre base; texto título = tinta. En **dark**, fondo ≈ tinta suavizada; título = base; contrapunto = apoyo.
4. Contraste: leer héroe y una cajita en móvil; apoyo debe distinguirse del fondo de cajita.

Ver también [FICHAS.md](./FICHAS.md) (skin y layout).
