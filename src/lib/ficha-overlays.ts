import type { Lang } from '../i18n/locale';
import { amateurasu as amateurasuCopy } from '../i18n/fichas/amateurasu';
import { canes as canesCopy } from '../i18n/fichas/canes';
import { carcinogenial as carcinogenialCopy } from '../i18n/fichas/carcinogenial';
import { chispas as chispasCopy } from '../i18n/fichas/chispas';
import { evoluciona as evolucionaCopy } from '../i18n/fichas/evoluciona';
import { hubris as hubrisCopy } from '../i18n/fichas/hubris';
import { letrados as letradosCopy } from '../i18n/fichas/letrados';
import { mantas as mantasCopy } from '../i18n/fichas/mantas';
import { pavoneo as pavoneoCopy } from '../i18n/fichas/pavoneo';
import { piramisu as piramisuCopy } from '../i18n/fichas/piramisu';
import { tartan as tartanCopy } from '../i18n/fichas/tartan';
import { ficha as fichaCopy } from '../i18n/fichas/ficha';
import { IG_DM_ESTUDIO } from './instagram';
import { demoNinive, demoReloj } from './ficha-demos';
import { fichaConceptArtUrl, mergeFicha, toFicha, type FichaContent } from './ficha';
import type { GameCard } from './games';

type OverlayFn = (game: GameCard, locale: Lang) => Partial<FichaContent>;

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function joinParts(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

function heroBase(game: GameCard, keyword: string, locale: Lang): Partial<FichaContent> {
  const ui = fichaCopy[locale];
  return {
    image: fichaConceptArtUrl(keyword),
    imageAlt: game.imageAlt ?? game.name,
    imageCaption: ui.conceptCaption,
    pitch: game.pitch ?? game.description,
    players: game.players,
    duration: game.duration,
  };
}

function protoDev(
  t: Record<string, string | undefined>,
  versionKey = 'version',
  ...changeKeys: string[]
): Pick<FichaContent, 'version' | 'adjusting' | 'nextPlaytests'> {
  const changes = changeKeys.map((k) => t[k]).filter(Boolean) as string[];
  return {
    version: t[versionKey],
    adjusting: changes.slice(0, 2).join(' '),
    nextPlaytests: changes.slice(2).join(' '),
  };
}

const overlays: Record<string, OverlayFn> = {
  amateurasu: (_g, locale) => {
    const t = amateurasuCopy[locale];
    return {
      players: '2–4',
      duration: '30–45 min',
      pitchTitle: stripHtml(t.ideaH2),
      pitchSubtitle: t.ideaP2,
      ctaHref: IG_DM_ESTUDIO,
      ...protoDev(t, 'version', 'change1', 'change2', 'change3', 'change4'),
      howTo: [
        { title: stripHtml(t.ideaH2), body: joinParts(t.ideaP1, t.ideaP2) },
        { title: stripHtml(t.mechH2), body: joinParts(t.mechP1, t.mechP2) },
        { title: t.skill1Name, body: t.skill1Desc },
      ],
      components: [
        { qty: '5', name: locale === 'en' ? 'Landscapes' : 'Paisajes' },
        { qty: '—', name: locale === 'en' ? 'Ray + Light decks' : 'Mazos Rayo + Luz' },
      ],
      credits: t.footer,
    };
  },

  canes: (_g, locale) => {
    const t = canesCopy[locale];
    return {
      players: '2–5',
      duration: '30 min',
      pitchTitle: stripHtml(t.ideaH2),
      pitchSubtitle: t.ideaP2,
      ctaHref: IG_DM_ESTUDIO,
      howTo: [
        { title: t.step1Title, body: t.step1Body },
        { title: t.step2Title, body: t.step2Body },
        { title: t.step3Title, body: t.step3Body },
      ],
      componentsPhoto: '/assets/canes-set.webp',
      componentsPhotoAlt: t.setAlt,
      components: [
        { qty: '100', name: locale === 'en' ? 'discipline cards' : 'cartas de disciplina' },
        { qty: '75', name: locale === 'en' ? 'action tokens' : 'fichas de Acción' },
      ],
      photos: [
        { src: '/assets/canes-mesa.webp', alt: t.galMesaAlt, caption: t.galMesaCap },
        { src: '/assets/canes-mesa-accion.webp', alt: t.galAccionAlt, caption: t.galAccionCap },
        { src: '/assets/canes-cartas-closeup.webp', alt: t.galCloseAlt, caption: t.galCloseCap },
      ],
      credits: t.footer,
    };
  },

  carcinogenial: (_g, locale) => {
    const t = carcinogenialCopy[locale];
    return {
      players: '2–4',
      pitchTitle: joinParts(t.mutH2a, stripHtml(t.mutH2em)),
      pitchSubtitle: t.mutP,
      ctaHref: IG_DM_ESTUDIO,
      howTo: [
        { title: t.step1Title, body: t.step1Body },
        { title: t.step2Title, body: t.step2Body },
        { title: t.step3Title, body: t.step3Body },
      ],
      componentsPhoto: '/assets/carcinogenial-tenazas.webp',
      componentsPhotoAlt: t.tenazasName,
      components: [
        { qty: '80', name: locale === 'en' ? 'mutation cards' : 'cartas de Mutación' },
        { qty: '75', name: locale === 'en' ? 'action tokens' : 'fichas de Acción' },
      ],
      credits: locale === 'en' ? 'Carcinogenial · Estudio Alpargatas' : 'Carcinogenial · Estudio Alpargatas',
    };
  },

  chispas: (_g, locale) => {
    const t = chispasCopy[locale];
    return {
      players: '2–6',
      duration: '20–30 min',
      pitchTitle: stripHtml(t.riskH2),
      pitchSubtitle: t.riskP2,
      ctaHref: IG_DM_ESTUDIO,
      version: t.badgeVersion,
      adjusting: joinParts(t.change1, t.change2),
      nextPlaytests: joinParts(t.change3, t.change4),
      howTo: [
        { title: stripHtml(t.riskH2), body: joinParts(t.riskP1, t.riskP2) },
        { title: stripHtml(t.actionsH2), body: t.actionsNote },
        { title: stripHtml(t.statusH2), body: joinParts(t.statusP1, t.statusP2) },
      ],
      credits: t.footer,
    };
  },

  evoluciona: (_g, locale) => {
    const t = evolucionaCopy[locale];
    return {
      players: '2–5',
      duration: '15–30 min',
      pitchTitle: joinParts(t.h2a, stripHtml(t.h2em)),
      pitchSubtitle: t.p2,
      ctaHref: IG_DM_ESTUDIO,
      ...protoDev(t, 'version', 'change1', 'change2', 'change3'),
      howTo: [
        { title: joinParts(t.h2a, stripHtml(t.h2em)), body: joinParts(t.p1, t.p2) },
        { title: joinParts(t.playH2a, stripHtml(t.playH2em)), body: t.playP1 },
        { title: joinParts(t.statusH2a, stripHtml(t.statusH2em), t.statusH2b), body: joinParts(t.statusP1, t.statusP2) },
      ],
      photos: [
        { src: '/assets/evoluciona-pista.webp', alt: t.heroAlt, caption: t.heroCap },
        { src: '/assets/evoluciona-playtest.webp', alt: t.playAlt, caption: t.playCap },
      ],
      credits: t.footer,
    };
  },

  hubris: (_g, locale) => {
    const t = hubrisCopy[locale];
    return {
      players: '2–4',
      pitchTitle: stripHtml(t.ideaH2),
      pitchSubtitle: t.ideaP2,
      ctaHref: IG_DM_ESTUDIO,
      version: 'v0.2',
      adjusting: joinParts(t.status1, t.status2),
      nextPlaytests: joinParts(t.status3, t.status4),
      howTo: [
        { title: stripHtml(t.ideaH2), body: joinParts(t.ideaP1, t.ideaP2) },
        { title: stripHtml(t.mechH2), body: joinParts(t.mechP1, t.mechP2) },
        { title: t.die1Label, body: t.die1Desc },
      ],
      components: [
        { qty: '25', name: locale === 'en' ? 'Feats' : 'Hazañas' },
        { qty: '6', name: locale === 'en' ? 'Boast cards (0–5)' : 'Cartas Alarde (0–5)' },
      ],
      credits: t.footer,
    };
  },

  letrados: (game, locale) => {
    const t = letradosCopy[locale];
    return {
      players: '2',
      duration: '15 min',
      pitchTitle: stripHtml(t.ideaH2),
      pitchSubtitle: t.ideaP2,
      publisherUrl: 'https://www.lighthousegms.com/es',
      publisherLabel: 'Lighthouse Games',
      howTo: [
        { title: t.rule1Title, body: t.rule1Body },
        { title: t.rule2Title, body: t.rule2Body },
        { title: t.rule3Title, body: t.rule3Body },
      ],
      componentsPhoto: '/assets/letrados-portada.webp',
      componentsPhotoAlt: t.heroAlt,
      components: [{ qty: '26', name: locale === 'en' ? 'letter cards' : 'cartas de letra' }],
      photos: [
        { src: '/assets/letrados-portada.webp', alt: t.heroAlt, caption: t.heroCaption },
        { src: '/assets/letrados-carta-editorial.webp', alt: t.cardEdAlt, caption: t.cardEdCap },
        { src: '/assets/letrados-proto.webp', alt: t.protoAlt },
        { src: '/assets/letrados-lighthouse-banner.webp', alt: t.bannerAlt },
      ],
      awards: game.awards,
      credits: t.footer,
    };
  },

  mantas: (_g, locale) => {
    const t = mantasCopy[locale];
    return {
      players: '2',
      duration: '20–30 min',
      pitchTitle: stripHtml(t.ideaH2),
      pitchSubtitle: t.ideaP2,
      ctaHref: IG_DM_ESTUDIO,
      howTo: [
        { title: t.step1Title, body: t.step1Body },
        { title: t.step2Title, body: t.step2Body },
        { title: t.step3Title, body: t.step3Body },
      ],
      componentsPhoto: '/assets/mantas-tablero.webp',
      componentsPhotoAlt: t.boardAlt,
      componentsNote: t.boardCap,
      components: [
        { qty: '24', name: locale === 'en' ? 'tiles' : 'losetas' },
        { qty: '12', name: locale === 'en' ? 'mission cards' : 'cartas de misión' },
        { qty: '2', name: 'meeples' },
      ],
      photos: [
        { src: '/assets/mantas-partida.webp', alt: t.galPartidaAlt, caption: t.galPartidaCap },
        { src: '/assets/mantas-losetas-mesa.webp', alt: t.galLosetasAlt, caption: t.galLosetasCap },
        { src: '/assets/mantas-tabletopia.webp', alt: t.galDigitalAlt, caption: t.galDigitalCap },
      ],
      credits: t.footer,
    };
  },

  pavoneo: (_g, locale) => {
    const t = pavoneoCopy[locale];
    const pitchTitle =
      locale === 'en'
        ? `${t.h2a} ${stripHtml(t.h2em)} ${t.h2b}`
        : `${t.h2a} ${stripHtml(t.h2em)} ${t.h2b}`;
    return {
      players: '2',
      duration: '15–20 min',
      pitchTitle,
      pitchSubtitle: t.p2,
      ctaHref: IG_DM_ESTUDIO,
      ...protoDev(t, 'version', 'change1', 'change2', 'change3'),
      howTo: [
        { title: pitchTitle, body: joinParts(t.p1, t.p2) },
        { title: joinParts(t.originA, stripHtml(t.originEm)), body: joinParts(t.originP1, t.originP2) },
      ],
      componentsPhoto: '/assets/pavoneo-abanico.webp',
      componentsPhotoAlt: t.fanAlt,
      componentsNote: t.fanCap,
      components: [{ qty: '13', name: locale === 'en' ? 'cards (12 + cover)' : 'cartas (12 + cover)' }],
      photos: [{ src: '/assets/pavoneo-abanico.webp', alt: t.fanAlt, caption: t.fanCap }],
      credits: t.footer,
    };
  },

  piramisu: (_g, locale) => {
    const t = piramisuCopy[locale];
    return {
      players: '2–4',
      duration: '10–20 min',
      pitchTitle: joinParts(t.h2a, t.h2b),
      pitchSubtitle: t.p2,
      ctaHref: IG_DM_ESTUDIO,
      howTo: [
        { title: t.rule1Name, body: t.rule1Desc },
        { title: t.rule2Name, body: t.rule2Desc },
        { title: t.rule3Name, body: t.rule3Desc },
      ],
      componentsPhoto: '/assets/piramisu-maqueta.webp',
      componentsPhotoAlt: t.heroAlt,
      componentsNote: t.heroCap,
      components: [{ qty: '24', name: locale === 'en' ? 'ingredient cards' : 'cartas de ingrediente' }],
      photos: [
        { src: '/assets/piramisu-maqueta.webp', alt: t.heroAlt, caption: t.heroCap },
        { src: '/assets/piramisu-ronda.webp', alt: t.protoAlt, caption: t.protoCap },
      ],
      credits: t.footer,
    };
  },

  tartan: (_g, locale) => {
    const t = tartanCopy[locale];
    const pitchTitle = `${t.h2a} ${stripHtml(t.h2em)}${t.h2b}`;
    return {
      players: '2–5',
      pitchTitle,
      pitchSubtitle: t.p2,
      ctaHref: IG_DM_ESTUDIO,
      ...protoDev(t, 'version', 'change1', 'change2', 'change3'),
      howTo: [
        { title: pitchTitle, body: joinParts(t.p1, t.p2) },
        { title: joinParts(t.originA, stripHtml(t.originEm), t.originB), body: joinParts(t.originP1, t.originP2) },
      ],
      credits: t.footer,
    };
  },
};

/** Mezcla CMS + copy/assets de fichas handmade (i18n/fichas). */
export function buildLegacyFicha(game: GameCard, locale: Lang, keyword: string): FichaContent {
  if (keyword === 'ninive') return demoNinive(game, locale);
  if (keyword === 'reloj') return demoReloj(game, locale);

  const base = mergeFicha(toFicha(game), heroBase(game, keyword, locale));
  const extra = overlays[keyword]?.(game, locale);
  return extra ? mergeFicha(base, extra) : base;
}
