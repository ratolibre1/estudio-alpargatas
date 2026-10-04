import type { GameCard } from './games';

export type FichaVariant = 'publicado' | 'proto';

export type FichaHowToStep = {
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
};

export type FichaComponent = {
  qty: string;
  name: string;
};

export type FichaResource = {
  label: string;
  href: string;
  meta?: string;
};

export type FichaPhoto = {
  src: string;
  alt: string;
  caption?: string;
};

export type FichaAward = {
  title: string;
  image?: string;
  href?: string;
};

export type FichaContent = {
  keyword: string;
  name: string;
  tagline: string;
  variant: FichaVariant;
  state: string;
  stateLabel: string;
  players?: string;
  duration?: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  pitchTitle?: string;
  /** Línea derecha de la franja bajo el héroe (mockup GPT). */
  pitchSubtitle?: string;
  pitch?: string;
  buyUrl?: string;
  ctaHref?: string;
  rulesUrl?: string;
  rulesLabel?: string;
  publisherUrl?: string;
  publisherLabel?: string;
  bggId?: number;
  version?: string;
  adjusting?: string;
  nextPlaytests?: string;
  awards?: FichaAward[];
  howTo?: FichaHowToStep[];
  componentsPhoto?: string;
  componentsPhotoAlt?: string;
  componentsNote?: string;
  components?: FichaComponent[];
  photos?: FichaPhoto[];
  resources?: FichaResource[];
  credits?: string;
  bg: string;
  titleColor: string;
  taglineColor: string;
  palette: string[];
  titleFont: string;
  /** Fuente cuerpo UI + párrafos de sección */
  taglineFont?: string;
  bodyFont?: string;
  /** Tema opcional (CMS); si falta, ficha-theme.ts deriva */
  bodyColor?: string;
  mutedColor?: string;
  lineColor?: string;
  surfaceColor?: string;
  ctaColor?: string;
  headerBg?: string;
  headerText?: string;
  headerMuted?: string;
  footerBg?: string;
  footerText?: string;
  footerMuted?: string;
};

export function fichaVariant(state: string): FichaVariant {
  return state === 'publicado' ? 'publicado' : 'proto';
}

/** Arte de portafolio; mismo asset que las tarjetas del catálogo. */
export function fichaConceptArtUrl(keyword: string): string {
  return `/assets/concepto-${keyword}.webp`;
}

export function toFicha(game: GameCard): FichaContent {
  return {
    keyword: game.keyword,
    name: game.name,
    tagline: game.tagline,
    variant: fichaVariant(game.state),
    state: game.state,
    stateLabel: game.stateLabel,
    players: game.players,
    duration: game.duration,
    image: game.image,
    imageAlt: game.imageAlt,
    imageCaption: game.imageCaption,
    pitchTitle: game.pitchTitle,
    pitch: game.pitch ?? game.description,
    buyUrl: game.buyUrl,
    ctaHref: game.ctaHref,
    rulesUrl: game.rulesUrl,
    rulesLabel: game.rulesLabel,
    publisherUrl: game.publisherUrl,
    publisherLabel: game.publisherLabel,
    bggId: game.bggId,
    version: game.version,
    adjusting: game.adjusting,
    nextPlaytests: game.nextPlaytests,
    awards: game.awards,
    howTo: game.howTo,
    componentsPhoto: game.componentsPhoto,
    componentsPhotoAlt: game.componentsPhotoAlt,
    componentsNote: game.componentsNote,
    components: game.components,
    photos: game.fotos,
    resources: game.resources,
    credits: game.credits,
    bg: game.bg,
    titleColor: game.titleColor,
    taglineColor: game.taglineColor,
    palette: game.palette,
    titleFont: game.titleFont,
    taglineFont: game.taglineFont,
    bodyFont: game.bodyFont,
    bodyColor: game.bodyColor,
    mutedColor: game.mutedColor,
    lineColor: game.lineColor,
    surfaceColor: game.surfaceColor,
    ctaColor: game.ctaColor,
    headerBg: game.headerBg,
    headerText: game.headerText,
    headerMuted: game.headerMuted,
    footerBg: game.footerBg,
    footerText: game.footerText,
    footerMuted: game.footerMuted,
  };
}

export function mergeFicha(base: FichaContent, extra: Partial<FichaContent>): FichaContent {
  return { ...base, ...extra };
}
