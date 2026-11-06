import type { Lang } from '../i18n/locale';
import { localizePath } from '../i18n/locale';
import { ficha as fichaCopy } from '../i18n/fichas/ficha';
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
  /** Slug de `COMP_ICON_SLUGS` (ej. deck-cards) o ruta `/assets/…` custom. */
  icon?: string;
  /** Foto al hover/click; si falta, se mantiene la mesa general. */
  image?: string;
  imageAlt?: string;
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
  /** Edad mínima, por ejemplo `8+`. Si falta, la ficha no la muestra. */
  age?: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  inspirationTitle?: string;
  inspiration?: string;
  buyUrl?: string;
  ctaHref?: string;
  rulesUrl?: string;
  rulesLabel?: string;
  /** PDF del manual en español. Si falta junto con el resto de archivos, se esconde «Ver archivos». */
  manualUrl?: string;
  /** PDF del manual en inglés. La ficha en inglés no reutiliza el de español. */
  manualUrlEn?: string;
  /** Última actualización del manual, `YYYY-MM-DD`. */
  manualUpdated?: string;
  /** Archivo print-and-play en español. */
  pnpUrl?: string;
  /** Archivo print-and-play en inglés. */
  pnpUrlEn?: string;
  /** Última actualización del PnP, `YYYY-MM-DD`. */
  pnpUpdated?: string;
  publisherUrl?: string;
  publisherLabel?: string;
  /** Nombre de quien cocreó el juego. El pill solo aparece si también hay `cocreatorUrl`. */
  cocreator?: string;
  cocreatorUrl?: string;
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
  /** Preferencia de diseño; no se infiere de los colores. */
  fichaMode?: 'light' | 'dark';
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

/** Arte de portafolio y pie común. El copy de cada juego viene del CMS. */
export function applyFichaChrome(ficha: FichaContent, locale: Lang): FichaContent {
  const ui = fichaCopy[locale];
  const cocreatorUrl = ficha.cocreatorUrl?.startsWith('http')
    ? ficha.cocreatorUrl
    : ficha.cocreatorUrl
      ? localizePath(ficha.cocreatorUrl, locale)
      : undefined;
  return {
    ...ficha,
    image: fichaConceptArtUrl(ficha.keyword),
    imageAlt: ficha.imageAlt || ficha.name,
    imageCaption: ui.conceptCaption,
    cocreatorUrl,
  };
}

function filled(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
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
    age: game.age,
    image: game.image,
    imageAlt: game.imageAlt,
    imageCaption: game.imageCaption,
    inspirationTitle: game.pitchTitle,
    inspiration: game.pitch ?? game.description,
    ctaHref: filled(game.ctaHref),
    rulesUrl: filled(game.rulesUrl),
    rulesLabel: filled(game.rulesLabel),
    manualUrl: filled(game.manualUrl),
    manualUrlEn: filled(game.manualUrlEn),
    manualUpdated: filled(game.manualUpdated),
    pnpUrl: filled(game.pnpUrl),
    pnpUrlEn: filled(game.pnpUrlEn),
    pnpUpdated: filled(game.pnpUpdated),
    publisherUrl: filled(game.publisherUrl),
    publisherLabel: filled(game.publisherLabel),
    cocreator: filled(game.cocreator),
    cocreatorUrl: filled(game.cocreatorUrl),
    buyUrl: filled(game.buyUrl),
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
    fichaMode: game.fichaMode,
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
