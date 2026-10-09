/**
 * Neutros del estudio para fichas. Sin blanco ni negro puros.
 * Ver docs/PALETAS_FICHA.md
 */
export const STUDIO_NEUTRAL = {
  paper: '#fffdf6',
  paperAlt: '#f7f4eb',
  paperMuted: '#f4f0df',
  ink: '#1a2847',
  inkSoft: '#24332a',
  onDark: '#f7f3ea',
  shade: '#120806',
} as const;

const PURE_LIGHT = new Set(['#fff', '#ffffff']);
const PURE_DARK = new Set(['#000', '#000000']);

/** Sustituye blanco/negro puro por neutros de estudio. */
export function studioSanitizeHex(color: string | undefined, fallback: string): string {
  if (!color?.trim()) return fallback;
  const n = color.trim().toLowerCase();
  if (PURE_LIGHT.has(n)) return STUDIO_NEUTRAL.paper;
  if (PURE_DARK.has(n)) return STUDIO_NEUTRAL.shade;
  return color;
}

/** Roles canónicos de palette[0..3]; ver docs/PALETAS_FICHA.md */
export function paletteRoles(palette: string[]) {
  const safe = (i: number, fb: string) => studioSanitizeHex(palette[i], fb);
  const primary = safe(1, STUDIO_NEUTRAL.ink);
  const apoyo = safe(2, STUDIO_NEUTRAL.inkSoft);
  const tinta = safe(3, STUDIO_NEUTRAL.ink);
  return {
    base: safe(0, STUDIO_NEUTRAL.paperAlt),
    primary,
    apoyo,
    tinta,
    /** @deprecated alias — apoyo / contrapunto */
    secondary: apoyo,
    /** @deprecated alias — tinta oscura, no CTA */
    accent: tinta,
  };
}
