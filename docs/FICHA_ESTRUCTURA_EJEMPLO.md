# Ficha de juego — estructura de ejemplo

Plantilla canónica para juegos nuevos. Copiar, reemplazar `ejemplo` por el **keyword** (una palabra, minúsculas) y rellenar.

Referencias: [FICHAS.md](./FICHAS.md) (arquitectura), [FUENTES_JUEGOS.md](./FUENTES_JUEGOS.md) (tipografías), `src/lib/comp-icons.ts` (`COMP_ICON_SLUGS` / `COMP_ICON_LABELS`).

---

## 1. Orden de trabajo

1. **CMS** — `src/content/games/ejemplo.md` (o `/admin/`).
2. **Asset héroe** — `public/assets/concepto-ejemplo.webp` (3:2, mismo arte que portafolio).
3. **Copy largo** (opcional pero habitual) — `src/i18n/fichas/ejemplo.ts` (`es` + `en`).
4. **Overlay** — entrada `ejemplo:` en `src/lib/ficha-overlays.ts` (import del copy + bloque como abajo).
5. **`npm run build`** — deben generarse `/juegos/ejemplo/` y `/en/juegos/ejemplo/` sin carpeta en `src/pages/juegos/ejemplo/`.

Si todo el contenido cabe en el markdown (howTo, componentes, fotos), puedes **omitir el overlay** y usar solo CMS. El overlay sirve para mezclar copy de `i18n/fichas/*` y assets fijos sin inflar el YAML.

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

### Campos de ficha (opcionales, CMS o overlay)

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

## 3. i18n — `src/i18n/fichas/ejemplo.ts`

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

Convención **protoDev**: en el diccionario, `version` + `change1`…`change4`. En overlay: `...protoDev(t, 'version', 'change1', 'change2', 'change3', 'change4')` → une `change1–2` en «Ajustando» y `change3+` en «Próximas pruebas».

---

## 4. Overlay — proto completo (referencia: Canes)

Añadir import y entrada en `src/lib/ficha-overlays.ts`. **No** duplicar arrays por locale: usar `comp()` y claves `t.*`.

```typescript
import { ejemplo as ejemploCopy } from '../i18n/fichas/ejemplo';

// dentro de overlays: Record<string, OverlayFn>
ejemplo: (_g, locale) => {
  const t = ejemploCopy[locale];
  return {
    players: '2–4',
    duration: '30 min',
    inspirationTitle: stripHtml(t.ideaH2),
    inspiration: t.ideaP2,
    ctaHref: IG_DM_ESTUDIO,
    ...protoDev(t, 'version', 'change1', 'change2', 'change3'),
    howTo: [
      { title: t.step1Title, body: t.step1Body },
      { title: t.step2Title, body: t.step2Body },
      { title: t.step3Title, body: t.step3Body },
    ],
    componentsPhoto: '/assets/ejemplo-mesa.webp',
    componentsPhotoAlt: t.galMesaAlt,
    components: [
      comp(locale, '54', 'cards', 'cartas', 'deck-cards', {
        image: '/assets/ejemplo-cartas.webp',
        imageAlt: t.galMesaAlt,
      }),
      comp(locale, '12', 'tokens', 'fichas', 'tokens-stack'),
    ],
    photos: [
      { src: '/assets/ejemplo-mesa.webp', alt: t.galMesaAlt, caption: t.galMesaCap },
    ],
    credits: t.footer,
  };
},
```

### Componentes — tres modos UI

| Modo | Qué pones | UI |
|------|-----------|-----|
| **Solo cintas** | `components: [ comp(...), … ]` sin `componentsPhoto` ni `image` en ítems | Cintas apiladas (`--tiles-only`) |
| **Mesa + cintas** | `componentsPhoto` + `components` (sin `image` por ítem) | Mesa fija; cintas informativas |
| **Interactivo** | `componentsPhoto` y/o `image` en ítems | Hover/click cambia foto de mesa |

Helper obligatorio (ya definido en el mismo archivo):

```typescript
comp(locale, qty, nameEn, nameEs, iconSlug, { image?, imageAlt? }?)
```

Iconos: slugs en `COMP_ICON_SLUGS` (`deck-cards`, `meeples`, …). En Decap: select «Icono» en la lista de componentes.

---

## 5. Overlay — publicado (referencia: Nínive)

```typescript
ninive: (game, locale) => {
  const t = niniveCopy[locale];
  const ui = fichaCopy[locale];
  return {
    players: '2',
    duration: '15 min',
    imageAlt: t.fichaConceptAlt,
    inspirationTitle: stripHtml(t.introH2),
    inspiration: t.introP2,
    buyUrl: 'https://…',
    rulesUrl: 'https://…',
    rulesLabel: ui.rules,
    publisherUrl: 'https://…',
    publisherLabel: 'Editorial',
    bggId: game.bggId,
    howTo: [
      { title: t.rule1Title, body: t.rule1Body, image: '/assets/…', imageAlt: t.gal2Alt },
    ],
    componentsPhoto: '/assets/…',
    componentsPhotoAlt: t.gal1Alt,
    components: [
      comp(locale, '27', 'Cards', 'Cartas', 'deck-cards', {
        image: '/assets/…',
        imageAlt: t.gal2Alt,
      }),
    ],
    resources: [
      { label: t.resourceRulebookLabel, href: 'https://…', meta: t.resourceRulebookMeta },
    ],
    photos: [
      { src: '/assets/…', alt: t.heroAlt, caption: t.heroCaption },
    ],
    awards: game.awards,
    credits: t.fichaCredits,
  };
},
```

---

## 6. Overlay — mínimo (solo franja + créditos)

```typescript
ejemplo: (_g, locale) => {
  const t = ejemploCopy[locale];
  return {
    inspirationTitle: stripHtml(t.ideaH2),
    inspiration: t.ideaP2,
    ctaHref: IG_DM_ESTUDIO,
    credits: t.footer,
  };
},
```

---

## 7. CMS-only — componentes en markdown

Si no hay overlay, puedes definir componentes en el frontmatter (mismo shape que el schema):

```yaml
componentsPhoto: /assets/ejemplo-mesa.webp
componentsPhotoAlt: Partida en mesa
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
```

---

## 8. Anti-patrones (no hacer)

- Dos arrays `locale === 'en' ? […] : […]` para componentes o recursos.
- `componentsNote` (ya no se renderiza).
- Carpetas `src/pages/juegos/<keyword>/` (choca con `[slug]` salvo `old/`).
- Iconos adivinados por nombre: usar slug explícito en CMS u overlay.
- `palette[3]` como fondo de tarjetas: el tema usa `awardFill`; no forzar `#1a1a1a` como “card”.

---

## 9. Checklist antes de merge

- [ ] `keyword` = nombre del archivo `.md` = slug URL.
- [ ] `concepto-<keyword>.webp` existe.
- [ ] Overlay (si aplica) usa `comp()` + `t.footer` / claves i18n.
- [ ] Cada ítem de `components` tiene `icon`.
- [ ] Build: ES + EN sin errores de content schema.
- [ ] DevTools: 1200 / 980 / 760 — héroe, cintas y galería legibles.
