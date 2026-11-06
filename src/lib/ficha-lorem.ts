import { loremBaseline } from './ficha-lorem-baseline';

/** Texto de revisión. Mismo parrafito en cada hueco, con el tono del slot. */
export const FICHA_LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const baseline = new Map(Object.entries(loremBaseline));

/** El mismo texto que compara la ficha contra la foto congelada. */
export function loremText(text: string | undefined): string {
  return (text ?? '').replace(/\s+/g, ' ').trim();
}

export function loremFlag(locale: string, keyword: string, ...parts: Array<string | number>): string {
  return [locale, keyword, ...parts].join(':');
}

/** Cajitas de componentes ya revisadas, en es y en. El índice sigue el orden del overlay. */
const reviewedComponents: Record<string, number> = {
  ninive: 2,
  mantas: 5,
  canes: 4,
  letrados: 1,
  carcinogenial: 4,
  piramisu: 3,
  reloj: 1,
  evoluciona: 4,
  pavoneo: 2,
  oxido: 3,
};

/**
 * Textos que ya volvieron al original.
 * Clave: `locale:keyword:hueco` (`howto:0:title`, `component:1`, `gallery:2`, …).
 * Apagar un flag no borra este módulo: se limpia cuando los 19 juegos queden sin Lorem.
 */
const reviewedSlots = [
  // Ficha nueva de Óxido: copy completo en ambos idiomas, sin placeholders.
  ...(['es', 'en'] as const).flatMap((locale) => [
    ...['devVersionTitle', 'devAdjusting', 'devNextTitle', 'devNextBody', 'inspirationTitle', 'inspirationBody'].map((slot) => loremFlag(locale, 'oxido', slot)),
    ...Array.from({ length: 3 }, (_, i) => ['title', 'body'].map((part) => loremFlag(locale, 'oxido', 'howto', i, part))).flat(),
    ...Array.from({ length: 5 }, (_, i) => loremFlag(locale, 'oxido', 'gallery', i)),
  ]),
  loremFlag('es', 'ninive', 'inspirationTitle'),
  loremFlag('es', 'ninive', 'inspirationBody'),
  loremFlag('en', 'ninive', 'inspirationTitle'),
  loremFlag('en', 'ninive', 'inspirationBody'),
  loremFlag('es', 'mantas', 'inspirationTitle'),
  loremFlag('es', 'mantas', 'inspirationBody'),
  loremFlag('en', 'mantas', 'inspirationTitle'),
  loremFlag('en', 'mantas', 'inspirationBody'),
  loremFlag('es', 'letrados', 'inspirationTitle'),
  loremFlag('es', 'letrados', 'inspirationBody'),
  loremFlag('en', 'letrados', 'inspirationTitle'),
  loremFlag('en', 'letrados', 'inspirationBody'),
];

/** Está en la ficha, pero el autor todavía no dio el ok. */
export const loremDraft = new Set<string>([]);

export const loremOff = new Set<string>([
  ...(['es', 'en'] as const).flatMap((locale) =>
    Object.entries(reviewedComponents).flatMap(([keyword, count]) =>
      Array.from({ length: count }, (_, index) => loremFlag(locale, keyword, 'component', index)),
    ),
  ),
  ...reviewedSlots,
]);

/**
 * Tapa el hueco si nadie lo aprobó y el CMS sigue con el mismo texto.
 * Un guardado que cambia el texto, o un hueco que no estaba en la foto, se muestra.
 */
export function showFichaLorem(flag: string, text?: string): boolean {
  if (loremOff.has(flag)) return false;
  const current = loremText(text);
  const previous = baseline.get(flag);
  if (previous === undefined) return current.length === 0;
  return current === previous;
}
