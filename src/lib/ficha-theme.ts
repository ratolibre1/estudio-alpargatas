import type { FichaContent } from './ficha';
import { STUDIO_NEUTRAL, paletteRoles, studioSanitizeHex } from './studio-neutral';
import { fichaColorVars, contrastRatio, type FichaMode } from './ficha-colors';

/** Cuatro colores de la ficha (CMS `palette`); el resto son mezclas derivadas en ficha-colors.ts. */
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

function sanitizePalette(raw: string[] | undefined): string[] {
  const fb = STUDIO_NEUTRAL.paperAlt;
  return (raw ?? []).map((c) => studioSanitizeHex(c, fb));
}

/** Elección explícita del CMS. Cambiar la paleta nunca cambia el modo. */
export function fichaBandMode(g: FichaContent): FichaMode {
  return g.fichaMode === 'dark' ? 'dark' : 'light';
}

/** Compatibilidad del atributo; el texto real se calcula sobre el fondo real. */
export function fichaOnPrimary(g: FichaContent, mode = fichaBandMode(g)): 'base' | 'tinta' {
  const roles = paletteRoles(sanitizePalette(g.palette));
  const accent = fichaColorVars(g.palette, mode)['ficha-accent'];
  return contrastRatio(accent, roles.tinta) >= contrastRatio(accent, roles.base) ? 'tinta' : 'base';
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

/** Variables de `<body>`: cuatro colores de origen, derivados y fuentes. */
export function fichaThemeVars(g: FichaContent): FichaThemeVars & Record<string, string> {
  const sectionFont = fichaSectionFont(g);
  return {
    ...fichaPaletteVars(g),
    ...fichaColorVars(g.palette, fichaBandMode(g)),
    'ficha-title-font': g.titleFont,
    'ficha-tagline-font': g.taglineFont ?? g.titleFont,
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
