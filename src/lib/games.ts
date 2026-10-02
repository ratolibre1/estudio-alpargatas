import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/locale';
import { localizePath } from '../i18n/locale';

export const KEYWORD_PATTERN = /^[a-z][a-z0-9]*$/;

export function gameHref(keyword: string, locale: Lang = 'es'): string {
  return localizePath(`/juegos/${keyword}/`, locale);
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
    .sort((a, b) => b.date.localeCompare(a.date) || a.stateOrder - b.stateOrder);
}

export async function getHomeGames(section: 'featured' | 'proto'): Promise<GameCard[]> {
  const games = await getGames();
  return games
    .filter((game) => game.home === section)
    .sort((a, b) => a.homeOrder - b.homeOrder);
}

export async function getIdeaGames(): Promise<GameCard[]> {
  const games = await getGames();
  return games.filter((game) => game.state === 'idea');
}

export async function getHomeAllGames(): Promise<GameCard[]> {
  const games = await getGames();
  return games
    .filter((game) => game.home !== 'none')
    .sort((a, b) => b.date.localeCompare(a.date) || a.stateOrder - b.stateOrder || a.homeOrder - b.homeOrder);
}

export function localizeGame(game: GameCard, locale: Lang): GameCard {
  const href = gameHref(game.keyword, locale);
  if (locale !== 'en') return { ...game, href };
  const description = game.descriptionEn ?? game.description;
  const tagline = game.taglineEn ?? game.tagline;
  return {
    ...game,
    href,
    tagline,
    description,
    blurb: description ?? tagline,
    meta: game.metaEn ?? game.meta,
    stateLabel: game.stateLabelEn ?? game.stateLabel,
    facts: game.factsEn ?? game.facts,
    imageAlt: game.imageAltEn ?? game.imageAlt,
    fotos: game.fotos?.map((foto) => ({
      ...foto,
      alt: foto.altEn ?? foto.alt,
      caption: foto.captionEn ?? foto.caption,
    })),
    coverNumber: game.coverNumberEn ?? game.coverNumber,
    coverTitle: game.coverTitleEn ?? game.coverTitle,
    coverStatus: game.coverStatusEn ?? game.coverStatus,
    awards: game.awards?.map((award) => ({
      ...award,
      title: award.titleEn ?? award.title,
    })),
  };
}
