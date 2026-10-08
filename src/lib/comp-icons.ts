/** Iconos recortados de `Downloads/ICONOS.png` → `/public/assets/comp-icons/`. */

export const COMP_ICON_BASE = '/assets/comp-icons';

export const COMP_ICON_SLUGS = [
  'rulebook',
  'deck-cards',
  'hand-cards',
  'die-d6',
  'dice-poly',
  'tokens-stack',
  'tiles-stack',
  'meeples',
  'pawn',
  'miniature',
  'map',
  'player-board',
  'hex-tiles',
  'terrain-tiles',
  'puzzle',
  'coins',
  'resource-cubes',
  'cylinders',
  'heart-star',
  'flags',
  'hourglass',
  'token-bag',
  'player-screen',
  'spinner',
  'score-pad',
] as const;

export type CompIconSlug = (typeof COMP_ICON_SLUGS)[number];

/** Etiquetas para Decap (`config.yml`); mantener alineado con `COMP_ICON_SLUGS`. */
export const COMP_ICON_LABELS: Record<CompIconSlug, string> = {
  rulebook: 'Reglamento',
  'deck-cards': 'Mazo / cartas',
  'hand-cards': 'Cartas en mano / rol',
  'die-d6': 'Dado D6',
  'dice-poly': 'Dados poliédricos',
  'tokens-stack': 'Fichas / tokens',
  'tiles-stack': 'Losetas',
  meeples: 'Meeples',
  pawn: 'Peones',
  miniature: 'Miniaturas',
  map: 'Mapa',
  'player-board': 'Tablero personal',
  'hex-tiles': 'Losetas hex',
  'terrain-tiles': 'Terreno / paisaje',
  puzzle: 'Piezas especiales',
  coins: 'Monedas',
  'resource-cubes': 'Cubos de recurso',
  cylinders: 'Cilindros',
  'heart-star': 'Salvavidas / corazón',
  flags: 'Banderas',
  hourglass: 'Reloj / temporizador',
  'token-bag': 'Bolsa de fichas',
  'player-screen': 'Pantalla de jugador',
  spinner: 'Ruleta / spinner',
  'score-pad': 'Bloc de puntuación',
};

const SLUG_SET = new Set<string>(COMP_ICON_SLUGS);

export function isCompIconSlug(value: string): value is CompIconSlug {
  return SLUG_SET.has(value);
}

export function compIconUrl(slug: CompIconSlug): string {
  return `${COMP_ICON_BASE}/${slug}.webp`;
}

const DEFAULT_ICON: CompIconSlug = 'tokens-stack';

/** Resuelve URL del icono: slug del set, ruta custom (`/…`), o default. */
export function resolveComponentIcon(_name: string, explicit?: string): string {
  const raw = explicit?.trim();
  if (!raw) return compIconUrl(DEFAULT_ICON);
  if (isCompIconSlug(raw)) return compIconUrl(raw);
  if (raw.startsWith('/')) return raw;
  return compIconUrl(DEFAULT_ICON);
}
