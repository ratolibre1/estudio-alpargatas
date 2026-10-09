import type { FichaContent } from './ficha';
import { STUDIO_NEUTRAL, paletteRoles, studioSanitizeHex } from './studio-neutral';

/** Cuatro colores de la ficha (CMS `palette`); el resto es color-mix en CSS. */
export type FichaPaletteVars = {
  'ficha-c-base': string;
  'ficha-c-primary': string;
  'ficha-c-apoyo': string;
  'ficha-c-tinta': string;
};

/** UI de secciones (premios, componentes, facts…): transversal en casi todos los juegos. */
export const FICHA_SECTION_FONT = 'Nunito, sans-serif';
export const FICHA_SECTION_FONT_JP = '"Zen Maru Gothic", sans-serif';

export type FichaThemeVars = FichaPaletteVars &
  Record<
    'ficha-title-font' | 'ficha-tagline-font' | 'ficha-section-font' | 'ficha-body-font',
    string
  >;

type Rgb = { r: number; g: number; b: number };

function parseColor(input: string): Rgb | null {
  const s = input.trim();
  let m = /^#([0-9a-f]{3})$/i.exec(s);
  if (m) {
    const h = m[1];
    return {
      r: parseInt(h[0] + h[0], 16),
      g: parseInt(h[1] + h[1], 16),
      b: parseInt(h[2] + h[2], 16),
    };
  }
  m = /^#([0-9a-f]{6})$/i.exec(s);
  if (m) {
    const h = m[1];
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }
  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(s);
  if (m) {
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
  }
  return null;
}

function relLuminance({ r, g, b }: Rgb): number {
  const channel = (c: number) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(bg: string, fg: string): number {
  const b = parseColor(bg);
  const f = parseColor(fg);
  if (!b || !f) return 0;
  const l1 = relLuminance(b);
  const l2 = relLuminance(f);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function sanitizePalette(raw: string[] | undefined): string[] {
  const fb = STUDIO_NEUTRAL.paperAlt;
  return (raw ?? []).map((c) => studioSanitizeHex(c, fb));
}

/**
 * Rama única del sistema de color de ficha (`data-band` en body).
 * Solo lee los 4 slots de `palette`; superficies en ficha.css (ver docs/PALETAS_FICHA.md).
 */
export function fichaBandMode(g: FichaContent): 'light' | 'dark' {
  const roles = paletteRoles(sanitizePalette(g.palette));
  const tintaRgb = parseColor(roles.tinta);
  if (tintaRgb && relLuminance(tintaRgb) < 0.22) return 'dark';
  const primaryRgb = parseColor(roles.primary);
  const baseRgb = parseColor(roles.base);
  const lPrimary = primaryRgb ? relLuminance(primaryRgb) : 0.5;
  const lBase = baseRgb ? relLuminance(baseRgb) : 0.9;
  if (lPrimary < 0.4 && lBase > lPrimary + 0.12) return 'dark';
  return 'light';
}

/** Texto sobre botón primary: uno de los cuatro slots. */
export function fichaOnPrimary(g: FichaContent): 'base' | 'tinta' {
  const roles = paletteRoles(sanitizePalette(g.palette));
  const onBase = contrastRatio(roles.primary, roles.base);
  const onTinta = contrastRatio(roles.primary, roles.tinta);
  return onTinta >= onBase ? 'tinta' : 'base';
}

export function fichaPaletteVars(g: FichaContent): FichaPaletteVars {
  const roles = paletteRoles(sanitizePalette(g.palette));
  return {
    'ficha-c-base': roles.base,
    'ficha-c-primary': roles.primary,
    'ficha-c-apoyo': roles.apoyo,
    'ficha-c-tinta': roles.tinta,
  };
}

/** Cuerpo de ficha: Nunito salvo juego JP (ver docs/FUENTES_JUEGOS.md). */
export function fichaSectionFont(g: FichaContent): string {
  const body = g.bodyFont ?? '';
  if (/zen maru/i.test(body)) return FICHA_SECTION_FONT_JP;
  return FICHA_SECTION_FONT;
}

/** Variables inyectadas en `<body>`: 4 colores + fuentes (sin hex extra). */
export function fichaThemeVars(g: FichaContent): FichaThemeVars {
  const sectionFont = fichaSectionFont(g);
  return {
    ...fichaPaletteVars(g),
    'ficha-title-font': g.titleFont,
    'ficha-tagline-font': g.taglineFont,
    'ficha-section-font': sectionFont,
    /* Alias: premios/componentes siempre usan section-font, no titleFont del juego. */
    'ficha-body-font': sectionFont,
  };
}

export function fichaThemeStyle(g: FichaContent): string {
  return Object.entries(fichaThemeVars(g))
    .map(([k, v]) => `--${k}: ${v}`)
    .join('; ');
}

/** Meta theme-color: primary de la paleta. */
export function fichaThemeColor(g: FichaContent): string {
  return fichaPaletteVars(g)['ficha-c-primary'];
}
