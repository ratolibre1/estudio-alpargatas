import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export const KEYWORD_PATTERN = /^[a-z][a-z0-9]*$/;

export function gameHref(keyword: string): string {
  return `/juegos/${keyword}/`;
}

export function bggHref(bggId: number): string {
  return `https://boardgamegeek.com/boardgame/${bggId}`;
}

export type GameCard = CollectionEntry<'games'>['data'] & {
  id: string;
  href: string;
  blurb: string;
};

function toCard(entry: CollectionEntry<'games'>): GameCard {
  // El data-store de Astro (devalue) a veces omite campos de la primera
  // entrada si su valor es un alias del id del Map. El frontmatter crudo
  // sigue completo: lo usamos de respaldo.
  const raw = (entry.rendered?.metadata?.frontmatter ?? {}) as Partial<
    CollectionEntry<'games'>['data']
  >;
  const data = { ...raw, ...entry.data };
  const keyword = data.keyword ?? entry.id;
  if (data.keyword != null && entry.id !== data.keyword) {
    throw new Error(
      `Keyword drift: src/content/games/${entry.id}.md declara keyword "${data.keyword}". El archivo y el keyword tienen que ser la misma palabra.`
    );
  }
  return {
    ...data,
    id: keyword,
    keyword,
    href: gameHref(keyword),
    blurb: data.description ?? data.tagline,
  };
}

export async function getGame(keyword: string): Promise<GameCard | undefined> {
  const entry = await getEntry('games', keyword);
  return entry ? toCard(entry) : undefined;
}

export async function getGames(): Promise<GameCard[]> {
  const entries = await getCollection('games');
  return entries
    .map(toCard)
    .sort((a, b) => a.stateOrder - b.stateOrder || b.date.localeCompare(a.date));
}

export async function getHomeGames(section: 'featured' | 'proto'): Promise<GameCard[]> {
  const games = await getGames();
  return games
    .filter((game) => game.home === section)
    .sort((a, b) => a.homeOrder - b.homeOrder);
}
