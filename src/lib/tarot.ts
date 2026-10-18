import type { Lang } from '../i18n/locale';

export interface TarotCard {
  id: number;
  name: Record<Lang, string>;
  prediction: Record<Lang, string>;
  /** Affinities in descending order; recommendations combine all three cards. */
  games: readonly string[];
}

export const TAROT_CARDS: readonly TarotCard[] = [
  { id: 0, name: { es: 'La Chispa', en: 'The Spark' }, prediction: { es: 'Una idea pequeña encenderá algo mucho más grande. Atrévete a hacer la primera jugada.', en: 'A small idea will set something much bigger in motion. Dare to make the first move.' }, games: ['chispas', 'amateurasu', 'hubris'] },
  { id: 1, name: { es: 'El Artífice', en: 'The Maker' }, prediction: { es: 'Lo que imaginas tomará forma entre tus manos. Una pieza bien puesta cambiará todo.', en: 'What you imagine will take shape in your hands. One well-placed piece will change everything.' }, games: ['letrados', 'tartan', 'piramisu'] },
  { id: 2, name: { es: 'Visión', en: 'Vision' }, prediction: { es: 'Verás una posibilidad que los demás pasan por alto. Confía en esa intuición antes de mostrar tus cartas.', en: 'You will see a possibility others overlook. Trust that instinct before showing your cards.' }, games: ['almagesto', 'pavoneo', 'mantas'] },
  { id: 3, name: { es: 'El Mundo Imaginado', en: 'The Imagined World' }, prediction: { es: 'Un lugar que todavía no conoces te abrirá sus puertas. La curiosidad será tu mejor brújula.', en: 'A place you have yet to discover will open its doors. Curiosity will be your best compass.' }, games: ['amateurasu', 'chauvet', 'almagesto'] },
  { id: 4, name: { es: 'El Sistema', en: 'The System' }, prediction: { es: 'Encontrarás orden donde parecía haber caos. Al conectar las piezas, aparecerá un camino nuevo.', en: 'You will find order in apparent chaos. Connecting the pieces will reveal a new path.' }, games: ['tartan', 'letrados', 'reloj'] },
  { id: 5, name: { es: 'El Legado', en: 'The Legacy' }, prediction: { es: 'Algo del pasado volverá con una forma inesperada. Lo que recibiste será el comienzo de algo propio.', en: 'Something from the past will return in an unexpected form. What you inherited will become a beginning of your own.' }, games: ['chauvet', 'evoluciona', 'hubris'] },
  { id: 6, name: { es: 'La Mesa', en: 'The Table' }, prediction: { es: 'Tu próxima aventura necesitará compañía. Compartir una decisión te llevará más lejos que jugar a solas.', en: 'Your next adventure will need company. Sharing a decision will take you further than playing alone.' }, games: ['piramisu', 'canes', 'palomas'] },
  { id: 7, name: { es: 'Decisiones', en: 'Decisions' }, prediction: { es: 'Dos caminos parecerán igual de tentadores. Elegir uno a tiempo valdrá más que esperar la certeza.', en: 'Two paths will seem equally tempting. Choosing one in time will matter more than waiting for certainty.' }, games: ['hubris', 'chispas', 'pavoneo'] },
  { id: 8, name: { es: 'El Desafío', en: 'The Challenge' }, prediction: { es: 'Una prueba pondrá a trabajar tu ingenio. El movimiento más audaz no será necesariamente el más grande.', en: 'A challenge will put your ingenuity to work. The boldest move will not necessarily be the biggest.' }, games: ['hubris', 'letrados', 'canes'] },
  { id: 9, name: { es: 'El Laboratorio', en: 'The Laboratory' }, prediction: { es: 'Un experimento traerá una sorpresa útil. Prueba una combinación distinta: el error también puede revelar algo.', en: 'An experiment will bring a useful surprise. Try a different combination: a mistake can reveal something too.' }, games: ['nudis', 'carcinogenial', 'evoluciona'] },
  { id: 10, name: { es: 'El Azar', en: 'Chance' }, prediction: { es: 'Lo inesperado entrará en la partida. No podrás controlar la suerte, pero sí qué hacer cuando llegue.', en: 'The unexpected will enter the game. You cannot control luck, but you can choose what to do when it arrives.' }, games: ['chispas', 'chauvet', 'hubris'] },
  { id: 11, name: { es: 'El Equilibrio', en: 'The Balance' }, prediction: { es: 'Encontrarás el punto justo entre avanzar y cuidar lo construido. No todo se gana empujando más fuerte.', en: 'You will find the balance between moving forward and protecting what you built. Pushing harder will not win everything.' }, games: ['mantas', 'tartan', 'piramisu'] },
  { id: 12, name: { es: 'La Otra Mirada', en: 'Another Perspective' }, prediction: { es: 'Lo que parecía un obstáculo mostrará otra cara. Cambiar de perspectiva transformará tu próxima jugada.', en: 'An obstacle will reveal another side. A change of perspective will transform your next move.' }, games: ['evoluciona', 'carcinogenial', 'pavoneo'] },
  { id: 13, name: { es: 'Poda', en: 'Pruning' }, prediction: { es: 'Dejar algo atrás abrirá espacio para crecer. Soltar una pieza puede ser la jugada que faltaba.', en: 'Leaving something behind will make room to grow. Letting go of a piece may be the move you needed.' }, games: ['carcinogenial', 'tartan', 'ermitanos'] },
  { id: 14, name: { es: 'El Ritmo', en: 'The Rhythm' }, prediction: { es: 'Llegará un momento en que todo encaje a tu propio ritmo. Escucha el tiempo antes de acelerar.', en: 'There will be a moment when everything falls into your own rhythm. Listen to the timing before speeding up.' }, games: ['reloj', 'mantas', 'gato'] },
  { id: 15, name: { es: 'Voracidad', en: 'Hunger' }, prediction: { es: 'Querrás ir por una recompensa más grande. Reconocer cuándo tienes suficiente será tu verdadera ventaja.', en: 'You will want to chase a greater reward. Knowing when you have enough will be your real advantage.' }, games: ['hubris', 'gato', 'chispas'] },
  { id: 16, name: { es: 'Ruptura', en: 'Rupture' }, prediction: { es: 'Un giro inesperado romperá tu plan. Entre las piezas sueltas encontrarás una forma mejor de empezar.', en: 'An unexpected turn will break your plan. Among the scattered pieces you will find a better way to begin.' }, games: ['chispas', 'carcinogenial', 'evoluciona'] },
  { id: 17, name: { es: 'El Lenguaje', en: 'The Language' }, prediction: { es: 'Una señal sencilla dirá más de lo que esperabas. Encontrarás a alguien que entienda tu forma de jugar.', en: 'A simple signal will say more than you expected. You will find someone who understands the way you play.' }, games: ['letrados', 'piramisu', 'palomas'] },
  { id: 18, name: { es: 'La Niebla', en: 'The Mist' }, prediction: { es: 'No verás todo el camino, pero sí el siguiente paso. Avanzar con preguntas también es avanzar.', en: 'You will not see the entire path, but you will see the next step. Moving forward with questions is still moving forward.' }, games: ['ermitanos', 'almagesto', 'amateurasu'] },
  { id: 19, name: { es: 'La Materia', en: 'The Material' }, prediction: { es: 'Lo cotidiano esconderá una posibilidad nueva. Mira de cerca: lo que necesitas puede estar frente a ti.', en: 'The everyday will hide a new possibility. Look closely: what you need may be right in front of you.' }, games: ['nudis', 'piramisu', 'tartan'] },
  { id: 20, name: { es: 'La Revelación', en: 'The Revelation' }, prediction: { es: 'Una conexión que no habías visto se hará evidente. Esa pequeña claridad cambiará cómo juegas.', en: 'A connection you had not seen will become clear. That small insight will change how you play.' }, games: ['almagesto', 'evoluciona', 'nudis'] },
  { id: 21, name: { es: 'El Umbral', en: 'The Threshold' }, prediction: { es: 'Estás a una jugada de entrar en un mundo nuevo. Cruza el umbral: hay una historia esperando por ti.', en: 'You are one move away from a new world. Cross the threshold: a story is waiting for you.' }, games: ['amateurasu', 'ermitanos', 'chauvet'] },
];

/** Revised illustrations use a new URL so returning visitors receive the latest artwork. */
const REVISED_TAROT_IDS = new Set([0, 1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21]);
export const tarotImage = (id: number) => `/assets/tarot/${String(id).padStart(2, '0')}${REVISED_TAROT_IDS.has(id) ? '-v2' : ''}.webp`;
/** Reverso raster (1200×1800); fuente editable en `back.svg`. Regenerar: `npm run assets:tarot-back`. */
export const tarotBackImage = () => '/assets/tarot/back.webp';

const ROMAN_BY_ID: Record<number, string> = {
  1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X',
  11: 'XI', 12: 'XII', 13: 'XIII', 14: 'XIV', 15: 'XV', 16: 'XVI', 17: 'XVII', 18: 'XVIII',
  19: 'XIX', 20: 'XX', 21: 'XXI',
};

/** Arcano 0 → `0`; arcanos I–XXI en romano (según `id` del CMS). */
export function tarotArcanaLabel(id: number): string {
  if (id === 0) return '0';
  return ROMAN_BY_ID[id] ?? String(id);
}

export function tarotCardHeading(card: Pick<TarotCard, 'id' | 'name'>, locale: Lang): string {
  return `${tarotArcanaLabel(card.id)} | ${card.name[locale]}`;
}

/** Fisher–Yates: no repeated cards, and every position can receive any card. */
export function shuffleTarot(random: () => number = Math.random): TarotCard[] {
  const deck = [...TAROT_CARDS];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function selectTarotCard(selected: readonly TarotCard[], card: TarotCard): TarotCard[] {
  if (selected.length >= 3 || selected.some((item) => item.id === card.id)) return [...selected];
  return [...selected, card];
}

/** The whole reading counts. Ties favor the last card's strongest affinity. */
export function recommendTarotGame(selected: readonly TarotCard[], eligible: readonly string[]): string | undefined {
  if (selected.length !== 3) return undefined;
  const scores = new Map<string, number>();
  for (const card of selected) card.games.forEach((slug, index) => {
    if (eligible.includes(slug)) scores.set(slug, (scores.get(slug) ?? 0) + 3 - index);
  });
  const finalAffinities = selected[2].games;
  const rank = (slug: string) => {
    const index = finalAffinities.indexOf(slug);
    return index < 0 ? Number.MAX_SAFE_INTEGER : index;
  };
  return [...scores.keys()].sort((a, b) =>
    scores.get(b)! - scores.get(a)! || rank(a) - rank(b) || a.localeCompare(b)
  )[0] ?? eligible[0];
}
