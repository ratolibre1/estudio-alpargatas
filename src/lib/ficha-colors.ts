import { paletteRoles } from './studio-neutral';

export type FichaMode = 'light' | 'dark';
export const FICHA_TEXT_CONTRAST = 4.6;

function rgb(hex: string): number[] {
  const value = hex.trim().replace(/^#/, '');
  const expanded = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
  if (!/^[\da-f]{6}$/i.test(expanded)) throw new Error(`Invalid palette color: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(expanded.slice(i, i + 2), 16));
}

export function contrastRatio(a: string, b: string): number {
  const luminance = (color: string) => rgb(color)
    .map((c) => c / 255)
    .map((c) => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4)
    .reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0);
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}

/** Mezcla sRGB: colores derivados, nunca un quinto color de origen. */
export function mixColors(a: string, b: string, weight: number): string {
  const x = rgb(a), y = rgb(b);
  return '#' + x.map((v, i) => Math.round(v * weight + y[i] * (1 - weight))
    .toString(16).padStart(2, '0')).join('');
}

/** Derivación de tokens semánticos a partir de palette + modo (build estático). */
export function fichaColorVars(palette: string[], mode: FichaMode): Record<string, string> {
  const { base, primary, apoyo, tinta } = paletteRoles(palette);
  const colors = [base, tinta, primary, apoyo];
  const bestText = (bg: string) => colors.reduce((best, c) =>
    contrastRatio(bg, c) > contrastRatio(bg, best) ? c : best, base);
  const safeSurface = (a: string, b: string, weight: number) => {
    for (let percent = Math.round(weight * 100); percent >= 0; percent--) {
      const color = mixColors(a, b, percent / 100);
      if (contrastRatio(color, bestText(color)) >= FICHA_TEXT_CONTRAST) return color;
    }
    return b;
  };
  const readableColor = (bg: string, preferred: string, initialWeight = 1) => {
    const readable = bestText(bg);
    for (let percent = Math.round(initialWeight * 100); percent >= 0; percent--) {
      const color = mixColors(preferred, readable, percent / 100);
      if (contrastRatio(bg, color) >= FICHA_TEXT_CONTRAST) return color;
    }
    return readable;
  };
  const secondary = (bg: string, ink: string) => {
    for (let percent = 85; percent <= 100; percent++) {
      const color = mixColors(ink, bg, percent / 100);
      if (contrastRatio(bg, color) >= FICHA_TEXT_CONTRAST) return color;
    }
    return ink;
  };
  const dark = mode === 'dark';
  const pageBg = dark ? safeSurface(base, tinta, .22) : base;
  const headerBg = dark ? tinta : safeSurface(primary, base, .30);
  const bandBg = dark ? tinta : safeSurface(primary, base, .18);
  const awardBg = dark ? safeSurface(base, tinta, .14) : safeSurface(primary, base, .16);
  const cardBg = dark ? safeSurface(base, tinta, .12) : safeSurface(primary, base, .10);
  const pageInk = bestText(pageBg), headerInk = bestText(headerBg);
  const fichaBg = dark ? tinta : mixColors(primary, base, .22);
  const heroStart = mixColors(fichaBg, pageBg, .28);
  const title = dark ? pageInk : primary;
  const titleInk = Math.min(contrastRatio(title, pageBg), contrastRatio(title, heroStart)) >= 3 ? title : pageInk;
  const tagBg = contrastRatio(pageInk, heroStart) < contrastRatio(pageInk, pageBg) ? heroStart : pageBg;
  let accent = dark ? apoyo : primary;
  if (contrastRatio(accent, bestText(accent)) < FICHA_TEXT_CONTRAST) {
    accent = [primary, apoyo, tinta, base].find((c) => contrastRatio(c, bestText(c)) >= FICHA_TEXT_CONTRAST) ?? accent;
  }
  const values: Record<string, string> = {
    'page-bg': pageBg, bg: fichaBg, 'band-bg': bandBg, card: cardBg,
    'header-bg': headerBg, 'header-text': headerInk, 'header-muted': secondary(headerBg, headerInk),
    'nav-hover': readableColor(headerBg, apoyo), 'on-header-ink': bestText(headerInk),
    'on-light-ink': pageInk, 'on-light-title': titleInk,
    'on-light-tag': secondary(tagBg, pageInk), 'on-light-muted': secondary(tagBg, pageInk),
    'on-band-title': bestText(bandBg), 'on-band-muted': secondary(bandBg, bestText(bandBg)),
    'award-bg': awardBg, 'award-title': bestText(awardBg),
    'award-link': readableColor(awardBg, apoyo),
    'link-on-light': readableColor(pageBg, apoyo),
    'card-text': bestText(cardBg), 'card-muted': secondary(cardBg, bestText(cardBg)),
    accent, 'on-accent': bestText(accent),
  };
  return Object.fromEntries(Object.entries(values).map(([key, value]) => ['ficha-' + key, value]));
}
