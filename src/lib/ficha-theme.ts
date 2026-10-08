import type { FichaContent } from './ficha';

/** CSS custom properties (sin `--`) para body/article de una ficha. */
export type FichaThemeVars = Record<string, string>;

const PAGE_NEUTRAL = '#fafafa';
const FALLBACK = {
  ink: '#1a2847',
  muted: 'rgba(26, 40, 71, .62)',
  line: 'rgba(26, 40, 71, .12)',
  card: '#ffffff',
  ui: '"Helvetica Neue", Arial, sans-serif',
  accent: '#ea580c',
  light: '#f7f3ea',
};

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

function isLightBackground(bg: string): boolean {
  const rgb = parseColor(bg);
  if (!rgb) return true;
  return relLuminance(rgb) > 0.55;
}

function unique(candidates: (string | undefined)[]): string[] {
  const out: string[] = [];
  for (const c of candidates) {
    if (!c) continue;
    if (!out.includes(c)) out.push(c);
  }
  return out;
}

/** Elige el primer color legible; si ninguno cumple, el de mayor contraste. */
function pickOnBackground(bg: string, candidates: string[], minRatio = 4.5): string {
  const list = unique(candidates);
  for (const c of list) {
    if (contrastRatio(bg, c) >= minRatio) return c;
  }
  let best = list[0] ?? (isLightBackground(bg) ? FALLBACK.ink : FALLBACK.light);
  let bestR = 0;
  for (const c of list) {
    const r = contrastRatio(bg, c);
    if (r > bestR) {
      bestR = r;
      best = c;
    }
  }
  if (bestR < 3) {
    return isLightBackground(bg) ? FALLBACK.ink : FALLBACK.light;
  }
  return best;
}

function mix(a: string, b: string, aPercent: number): string {
  return `color-mix(in srgb, ${a} ${aPercent}%, ${b})`;
}

/** Fondo del cuerpo y secciones (contraste claro con la cinta --ficha-bg). */
function pageBackground(g: FichaContent): string {
  if (isLightBackground(g.bg)) {
    return '#ffffff';
  }
  return PAGE_NEUTRAL;
}

function mutedFrom(ink: string, bg: string, preferred?: string): string {
  if (preferred && contrastRatio(bg, preferred) >= 2.8) return preferred;
  const rgb = parseColor(ink);
  if (!rgb) return FALLBACK.muted;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55)`;
}

/** Evita tinta casi negra sobre fondo claro (contraste > ~11). */
function easeForeground(fg: string, bg: string): string {
  if (contrastRatio(bg, fg) > 10.5) {
    return mix(fg, '#64748b', '28%');
  }
  return fg;
}

/** Link legible sobre fondo de premio; oscurece acentos claros (rojo sobre azul cielo). */
function pickLinkOnAward(awardBg: string, candidates: string[]): string {
  for (const c of unique(candidates)) {
    if (contrastRatio(awardBg, c) >= 4.5) return c;
    const darker = mix(c, '#120606', '42%');
    if (contrastRatio(awardBg, darker) >= 4.5) return darker;
  }
  return pickOnBackground(awardBg, candidates, 4.5);
}

/** Chips de paleta aptos como fondo de premio (incluye azules medios tipo Letrados). */
function awardFill(pageBg: string, bandBg: string, palette: string[]): string {
  for (const c of palette) {
    const rgb = parseColor(c);
    if (!rgb) continue;
    const lum = relLuminance(rgb);
    if (lum >= 0.38 && lum <= 0.93) return c;
  }
  if (isLightBackground(bandBg)) return bandBg;
  return mix(bandBg, pageBg, '86%');
}

/** Tokens de premios: fondo claro de paleta + acentos saturados (no gris-lavado). */
function awardTheme(
  g: FichaContent,
  pageBg: string,
  palette: string[],
  accent: string
): {
  awardBg: string;
  onAwardTitle: string;
  onAwardLink: string;
  awardBar: string;
  awardBorder: string;
} {
  const awardBg = g.surfaceColor ?? awardFill(pageBg, g.bg, palette);

  /* titleColor suele ser crema para header oscuro — no reutilizar en cajitas claras */
  const titleCandidates = unique([
    palette[2],
    g.bodyColor,
    FALLBACK.ink,
    palette[3],
    g.titleColor,
  ]);
  let onAwardTitle = pickOnBackground(awardBg, titleCandidates, 4.5);
  if (g.titleColor && !isLightBackground(g.titleColor) && contrastRatio(awardBg, g.titleColor) >= 4.5) {
    onAwardTitle = g.titleColor;
  }

  const linkCandidates = unique([
    palette[3],
    palette[1],
    g.ctaColor,
    accent,
    palette[2],
    FALLBACK.accent,
  ]);
  let onAwardLink = pickLinkOnAward(awardBg, linkCandidates);
  if (onAwardLink === onAwardTitle) {
    onAwardLink = pickLinkOnAward(
      awardBg,
      linkCandidates.filter((c) => c !== onAwardTitle)
    );
  }

  const awardBar = palette[3] ?? palette[2] ?? accent;
  const awardBorder = mix(awardBar, awardBg, '58%');

  return { awardBg, onAwardTitle, onAwardLink, awardBar, awardBorder };
}

/**
 * Un skin por juego. Colores de texto se calculan por superficie (página blanca,
 * franja --ficha-bg, header/footer) para mantener contraste.
 */
export function fichaThemeVars(g: FichaContent): FichaThemeVars {
  const palette = g.palette ?? [];
  const pageBg = pageBackground(g);
  const bandBg = g.bg;
  const bandLight = isLightBackground(bandBg);

  const darkPool = unique([g.bodyColor, palette[0], g.titleColor, FALLBACK.ink]);
  const lightPool = unique([g.titleColor, palette[1], FALLBACK.light, '#ffffff']);

  let onLightTitle = pickOnBackground(pageBg, darkPool, 3.5);
  onLightTitle = easeForeground(onLightTitle, pageBg);
  let onLightInk = pickOnBackground(pageBg, [...darkPool, onLightTitle], 4.25);
  onLightInk = easeForeground(onLightInk, pageBg);
  const onLightTag = mutedFrom(onLightInk, pageBg, g.taglineColor);
  const onLightMuted = mutedFrom(onLightInk, pageBg);

  const bandTitlePool = bandLight
    ? unique([palette[0], g.titleColor, onLightTitle, FALLBACK.ink])
    : unique([g.titleColor, ...lightPool]);
  const onBandTitle = pickOnBackground(bandBg, bandTitlePool, 3.5);
  const onBandMuted = mutedFrom(onBandTitle, bandBg, g.taglineColor);

  const headerBg = g.headerBg ?? g.bg;
  const headerChromeDark = !isLightBackground(g.bg);
  const headerText = pickOnBackground(
    headerBg,
    headerChromeDark ? lightPool : darkPool,
    4
  );
  const headerMuted = mutedFrom(headerText, headerBg, g.taglineColor);

  const footerBg = g.footerBg ?? headerBg;
  const footerText = g.footerText ?? headerText;
  const footerMuted = g.footerMuted ?? headerMuted;

  const accent = g.ctaColor ?? palette[2] ?? palette[1] ?? FALLBACK.accent;

  const linkOnLight = pickOnBackground(
    pageBg,
    unique([g.ctaColor, g.titleColor, palette[1], palette[2], accent, FALLBACK.accent]),
    4.5
  );

  const {
    awardBg,
    onAwardTitle,
    onAwardLink,
    awardBar,
    awardBorder,
  } = awardTheme(g, pageBg, palette, accent);

  return {
    'ficha-bg': g.bg,
    'ficha-page-bg': pageBg,
    'ficha-band-bg': bandBg,
    'ficha-on-light-ink': onLightInk,
    'ficha-on-light-title': onLightTitle,
    'ficha-on-light-tag': onLightTag,
    'ficha-on-light-muted': onLightMuted,
    'ficha-on-band-ink': onBandTitle,
    'ficha-on-band-title': onBandTitle,
    'ficha-on-band-muted': onBandMuted,
    /* Alias legacy usados en ficha.css */
    'ficha-ink': onLightInk,
    'ficha-muted': onLightTag,
    'ficha-title': onLightTitle,
    'ficha-tag': onLightTag,
    'ficha-line': g.lineColor ?? FALLBACK.line,
    /* Paneles/recursos: mismo fondo legible que premios (no palette[3] oscuro). */
    'ficha-card': awardBg,
    'ficha-title-font': g.titleFont,
    'ficha-body-font': g.bodyFont ?? g.taglineFont ?? FALLBACK.ui,
    'ficha-accent': accent,
    'ficha-link-on-light': linkOnLight,
    'ficha-award-bg': awardBg,
    'ficha-award-border': awardBorder,
    'ficha-award-bar': awardBar,
    'ficha-award-title': onAwardTitle,
    'ficha-award-link': onAwardLink,
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
