# Ficha de juego — estructura de ejemplo

Plantilla canónica para juegos nuevos. Copiar, reemplazar `ejemplo` por el **keyword** (una palabra, minúsculas) y rellenar.

Referencias: [FICHAS.md](./FICHAS.md) (arquitectura), [FUENTES_JUEGOS.md](./FUENTES_JUEGOS.md) (tipografías), `src/lib/comp-icons.ts` (`COMP_ICON_SLUGS` / `COMP_ICON_LABELS`).

---

## 1. Orden de trabajo

1. **CMS** — `src/content/games/ejemplo.md` (o `/admin/`). ES en el campo base, EN en `*En`.
2. **Asset héroe** — `public/assets/concepto-ejemplo.webp` (3:2, mismo arte que portafolio).
3. **`npm run build`** — deben generarse `/juegos/ejemplo/` y `/en/juegos/ejemplo/` sin carpeta en `src/pages/juegos/ejemplo/`.

`src/i18n/fichas/<keyword>.ts` queda solo para `/juegos/old/`. No se crea un overlay para la ficha nueva.

---

## 2. CMS — frontmatter mínimo

```yaml
---
keyword: ejemplo
name: Nombre del juego
emoji: 🎲
tagline: Una línea para home y héroe.
taglineEn: One line for home and hero.
description: Párrafo corto (ES). Si falta pitch, la ficha lo usa.
descriptionEn: Short paragraph (EN).
meta: Género · versión · hook
metaEn: Genre · version · hook
state: pruebas
stateLabel: En pruebas
stateLabelEn: In testing
stateOrder: 4
date: '2026-10'
home: proto
homeOrder: 99
image: /assets/concepto-ejemplo.webp
imageAlt: Alt ES para imagen de catálogo
imageAltEn: EN alt for catalogue image
bg: '#f5eedc'
titleColor: '#8b3a10'
taglineColor: '#5c3820'
palette:
  - '#f5eedc'
  - '#8b3a10'
  - '#c4762a'
  - '#1a1a1a'
titleFont: 'Fraunces, serif'
taglineFont: 'Fraunces, serif'
bodyFont: 'Nunito, sans-serif'
conceptos:
  - temática, setting, tono
  - estilo visual, materiales
  - mecánicas clave (no se muestran en la web)
---
```

### Campos de ficha (opcionales, en el CMS)

| Campo | Uso |
|--------|-----|
| `inspirationTitle` / `inspiration` | Historia / inspiración, después de premios y «En qué estamos». En el CMS el origen sigue siendo `pitchTitle` / `pitch`. |
| `players`, `duration` | Badges (overlay puede sobreescribir CMS) |
| `ctaHref` | Proto → IG (`IG_DM_ESTUDIO` en overlay) |
| `buyUrl`, `rulesUrl`, `publisherUrl` | Publicado |
| `version`, `adjusting`, `nextPlaytests` | Bloque «En qué estamos» (proto) |
| `howTo[]` | `{ title, body, image?, imageAlt? }` |
| `componentsPhoto`, `componentsPhotoAlt` | Mesa por defecto del bloque componentes |
| `components[]` | `{ qty, name, nameEn?, icon, image?, imageAlt? }` — icon = slug del select |
| `fotos[]` / `photos` | Galería `{ src, alt, caption? }` |
| `resources[]` | `{ label, href, meta? }` |
| `awards[]` | Premios (suelen venir del CMS en publicados) |
| `credits` | Pie de ficha |

---

## 3. i18n — solo `/juegos/old/`

`src/i18n/fichas/ejemplo.ts` no alimenta la ficha nueva. Sigue existiendo para las páginas archivadas. El ejemplo de abajo es ese archivo histórico, no un paso para un juego nuevo.

Misma forma en todos los juegos con overlay: export nombrado = keyword, claves `es` y `en`. Textos de secciones van aquí; el overlay solo **ensambla** y apunta a assets.

```typescript
export const ejemplo = {
  es: {
    footer: 'Ejemplo · Estudio Alpargatas',
    ideaH2: 'Título franja<br /><em>énfasis</em>',
    ideaP2: 'Relato de la inspiración.',
    step1Title: 'Paso 1',
    step1Body: '…',
    step2Title: 'Paso 2',
    step2Body: '…',
    step3Title: 'Paso 3',
    step3Body: '…',
    galMesaAlt: 'Alt mesa',
    galMesaCap: 'Pie de foto mesa',
    // Proto — bloque dev (protoDev):
    version: 'v0.1',
    change1: 'Primer párrafo de ajustes.',
    change2: 'Segundo párrafo de ajustes.',
    change3: 'Próximas pruebas.',
    // Publicado — extras ficha (opcional):
    fichaConceptAlt: 'Alt arte conceptual en héroe de ficha',
    fichaCredits: 'Diseño · Estudio Alpargatas',
    resourceRulebookLabel: 'Reglamento PDF',
    resourceRulebookMeta: 'Juego completo',
  },
  en: {
    footer: 'Example · Estudio Alpargatas',
    ideaH2: 'Strip title<br /><em>emphasis</em>',
    ideaP2: 'Pitch strip subtitle.',
    step1Title: 'Step 1',
    step1Body: '…',
    step2Title: 'Step 2',
    step2Body: '…',
    step3Title: 'Step 3',
    step3Body: '…',
    galMesaAlt: 'Table alt',
    galMesaCap: 'Table caption',
    version: 'v0.1',
    change1: 'First tuning paragraph.',
    change2: 'Second tuning paragraph.',
    change3: 'Next playtests.',
    fichaConceptAlt: 'Concept art alt for ficha hero',
    fichaCredits: 'Design · Estudio Alpargatas',
    resourceRulebookLabel: 'Rulebook PDF',
    resourceRulebookMeta: 'Full game',
  },
} as const;
```

En las páginas viejas, `version` + `change1`…`change4` armaban «Ajustando» y «Próximas pruebas». En la ficha nueva esos textos van directo en `adjusting` / `nextPlaytests` del markdown.

---

## 4. Componentes en el CMS

El copy largo (pitch, how-to, ajustes, créditos, componentes, fotos) va en el markdown, con el inglés en `*En`. No hay overlay.

### Tres modos de UI

| Modo | Qué pones | UI |
|------|-----------|-----|
| **Solo cintas** | `components` sin `componentsPhoto` ni `image` en ítems | Cintas apiladas (`--tiles-only`) |
| **Mesa + cintas** | `componentsPhoto` + `components` (sin `image` por ítem) | Mesa fija; cintas informativas |
| **Interactivo** | `componentsPhoto` y/o `image` en ítems | Hover/click cambia foto de mesa |

Iconos: slugs en `COMP_ICON_SLUGS` (`deck-cards`, `meeples`, …). En el CMS: select «Icono».

```yaml
componentsPhoto: /assets/ejemplo-mesa.webp
componentsPhotoAlt: Partida en mesa
componentsPhotoAltEn: Table setup
components:
  - qty: '48'
    name: cartas
    nameEn: cards
    icon: deck-cards
    image: /assets/ejemplo-detalle.webp
    imageAlt: Detalle de cartas
    imageAltEn: Card detail
howTo:
  - title: Objetivo
    titleEn: Goal
    body: Texto ES…
    bodyEn: EN text…
pitchTitle: De dónde salió
pitchTitleEn: Where it came from
pitch: Párrafo ES…
pitchEn: EN paragraph…
version: v0.1
adjusting: Qué se está afinando.
adjustingEn: What is being tuned.
nextPlaytests: Próxima mesa.
nextPlaytestsEn: Next table.
credits: Diseño · Estudio Alpargatas
creditsEn: Design · Estudio Alpargatas
```

Campos que el CMS también guarda y la ficha muestra: `age`, `cocreator`, `cocreatorUrl`, `manualUrl` / `manualUrlEn`, `pnpUrl` / `pnpUrlEn`. Un vacío (`''` o `null`) es ausencia: no publica un valor y no tira el build.

---

## 5. Anti-patrones (no hacer)

- Dos arrays `locale === 'en' ? […] : […]` para componentes o recursos.
- `componentsNote` (ya no se renderiza).
- Carpetas `src/pages/juegos/<keyword>/` (choca con `[slug]` salvo `old/`).
- Iconos adivinados por nombre: el slug va en el CMS.
- `palette[3]` como fondo de tarjetas: el tema usa `awardFill`; no forzar `#1a1a1a` como “card”.
- Volver a leer `src/i18n/fichas/<keyword>.ts` desde la ficha nueva. Eso es archivo de `/juegos/old/`.

---

## 6. Checklist antes de merge

- [ ] `keyword` = nombre del archivo `.md` = slug URL.
- [ ] `concepto-<keyword>.webp` existe.
- [ ] El copy de la ficha está en el markdown, ES y `*En`.
- [ ] Cada ítem de `components` tiene `icon`.
- [ ] Build: ES + EN sin errores de content schema.
- [ ] DevTools: 1200 / 980 / 760 — héroe, cintas y galería legibles.
