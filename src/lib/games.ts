import { getCollection, type CollectionEntry } from 'astro:content';

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
  const { keyword } = entry.data;
  if (entry.id !== keyword) {
    throw new Error(
      `Keyword drift: src/content/games/${entry.id}.md declara keyword "${keyword}". El archivo y el keyword tienen que ser la misma palabra.`
    );
  }
  return {
    id: keyword,
    ...entry.data,
    href: gameHref(keyword),
    blurb: entry.data.description ?? entry.data.tagline,
  };
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
