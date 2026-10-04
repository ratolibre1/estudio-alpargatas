import type { FichaContent } from './ficha';

/** CSS custom properties (sin `--`) para body/article de una ficha. */
export type FichaThemeVars = Record<string, string>;

const FALLBACK = {
  /** Solo si el CMS no trae colores de texto (ficha demo / legacy) */
  ink: '#1a2847',
  muted: 'rgba(26, 40, 71, .62)',
  line: 'rgba(26, 40, 71, .12)',
  card: '#ffffff',
  ui: '"Helvetica Neue", Arial, sans-serif',
  accent: '#ea580c',
};

/**
 * Un skin por juego (colores del CMS). No hay “modo claro/oscuro”:
 * publicado vs proto solo cambia contenido/CTA, no la paleta.
 */
export function fichaThemeVars(g: FichaContent): FichaThemeVars {
  const ink = g.bodyColor ?? g.titleColor ?? FALLBACK.ink;
  const muted = g.mutedColor ?? g.taglineColor ?? FALLBACK.muted;
  const accent = g.ctaColor ?? g.palette[2] ?? g.palette[1] ?? FALLBACK.accent;
  const headerBg = g.headerBg ?? g.bg;
  const headerText = g.headerText ?? g.titleColor;
  const headerMuted = g.headerMuted ?? g.taglineColor ?? muted;
  const footerBg = g.footerBg ?? headerBg;
  const footerText = g.footerText ?? headerText;
  const footerMuted = g.footerMuted ?? headerMuted;
  const surface = g.surfaceColor ?? g.palette[3] ?? FALLBACK.card;

  return {
    'ficha-bg': g.bg,
    'ficha-ink': ink,
    'ficha-muted': muted,
    'ficha-line': g.lineColor ?? FALLBACK.line,
    'ficha-card': surface,
    'ficha-title': g.titleColor,
    'ficha-tag': g.taglineColor,
    'ficha-title-font': g.titleFont,
    'ficha-body-font': g.bodyFont ?? g.taglineFont ?? FALLBACK.ui,
    'ficha-accent': accent,
    'ficha-header-bg': headerBg,
    'ficha-header-text': headerText,
    'ficha-header-muted': headerMuted,
    'ficha-footer-bg': footerBg,
    'ficha-footer-text': footerText,
    'ficha-footer-muted': footerMuted,
  };
}

export function fichaThemeStyle(g: FichaContent): string {
  return Object.entries(fichaThemeVars(g))
    .map(([k, v]) => `--${k}: ${v}`)
    .join('; ');
}
