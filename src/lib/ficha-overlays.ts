import type { Lang } from '../i18n/locale';
import { amateurasu as amateurasuCopy } from '../i18n/fichas/amateurasu';
import { canes as canesCopy } from '../i18n/fichas/canes';
import { carcinogenial as carcinogenialCopy } from '../i18n/fichas/carcinogenial';
import { chispas as chispasCopy } from '../i18n/fichas/chispas';
import { evoluciona as evolucionaCopy } from '../i18n/fichas/evoluciona';
import { hubris as hubrisCopy } from '../i18n/fichas/hubris';
import { letrados as letradosCopy } from '../i18n/fichas/letrados';
import { mantas as mantasCopy } from '../i18n/fichas/mantas';
import { ninive as niniveCopy } from '../i18n/fichas/ninive';
import { reloj as relojCopy } from '../i18n/fichas/reloj';
import { pavoneo as pavoneoCopy } from '../i18n/fichas/pavoneo';
import { piramisu as piramisuCopy } from '../i18n/fichas/piramisu';
import { tartan as tartanCopy } from '../i18n/fichas/tartan';
import { ficha as fichaCopy } from '../i18n/fichas/ficha';
import { IG_DM_ESTUDIO } from './instagram';
import type { CompIconSlug } from './comp-icons';
import { fichaConceptArtUrl, mergeFicha, toFicha, type FichaComponent, type FichaContent } from './ficha';
import type { GameCard } from './games';

const LUDOISMO = 'https://ludoismo.cl/';

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

function bn(locale: Lang, en: string, es: string): string {
  return locale === 'en' ? en : es;
}

/** Ítem de componentes: nombre bilingüe + icono slug (+ foto opcional). */
function comp(
  locale: Lang,
  qty: string,
  nameEn: string,
  nameEs: string,
  icon: CompIconSlug,
  detail?: Pick<FichaComponent, 'image' | 'imageAlt'>
): FichaComponent {
  return {
    qty,
    name: bn(locale, nameEn, nameEs),
    icon,
    ...detail,
  };
}

function heroBase(game: GameCard, keyword: string, locale: Lang): Partial<FichaContent> {
  const ui = fichaCopy[locale];
  return {
    image: fichaConceptArtUrl(keyword),
    imageAlt: game.imageAlt ?? game.name,
    imageCaption: ui.conceptCaption,
    inspiration: game.pitch ?? game.description,
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
      inspirationTitle: stripHtml(t.ideaH2),
      inspiration: t.ideaP1,
      ctaHref: IG_DM_ESTUDIO,
      ...protoDev(t, 'version', 'change1', 'change2', 'change3', 'change4'),
      howTo: [
        { title: stripHtml(t.ideaH2), body: joinParts(t.ideaP1, t.ideaP2) },
        { title: stripHtml(t.mechH2), body: joinParts(t.mechP1, t.mechP2) },
        { title: t.skill1Name, body: t.skill1Desc },
      ],
      components: [
        comp(locale, '5', 'Landscapes', 'Paisajes', 'terrain-tiles'),
        comp(locale, '—', 'Ray + Light decks', 'Mazos Rayo + Luz', 'deck-cards'),
      ],
      credits: t.footer,
    };
  },

  canes: (_g, locale) => {
    const t = canesCopy[locale];
    return {
      players: '2–5',
      duration: '30 min',
      inspirationTitle: stripHtml(t.ideaH2),
      inspiration: t.heroP,
      ctaHref: IG_DM_ESTUDIO,
      manualUrl: 'https://example.com/canes-manual',
      manualUpdated: '2026-10-07',
      pnpUrl: 'https://example.com/canes-pnp',
      pnpUpdated: '2026-10-07',
      publisherUrl: 'https://example.com/canes',
      publisherLabel: t.dummyPublisher,
      bggId: 1,
      ...protoDev(t, 'dummyVersion', 'dummyChange1', 'dummyChange2', 'dummyChange3', 'dummyChange4'),
      awards: [
        { title: t.dummyAward1, href: 'https://example.com/canes-premio' },
        { title: t.dummyAward2 },
      ],
      howTo: [
        { title: t.step1Title, body: t.step1Body },
        { title: t.step2Title, body: t.step2Body },
        { title: t.step3Title, body: t.step3Body },
      ],
      componentsPhoto: '/assets/canes-mesa-montaje.webp',
      componentsPhotoAlt: t.galMesaAlt,
      components: [
        comp(locale, '100', 'Discipline Cards', 'Cartas de Disciplina', 'deck-cards', {
          image: '/assets/canes-comp-disciplinas.webp?v=4',
          imageAlt: t.compDisciplinasAlt,
        }),
        comp(locale, '75', 'Action Tokens', 'Fichas de Acción', 'tokens-stack', {
          image: '/assets/canes-comp-accion.webp?v=5',
          imageAlt: t.compAccionAlt,
        }),
        comp(locale, '45', 'Snack Tokens', 'Fichas de Snack', 'tokens-stack', {
          image: '/assets/canes-comp-snacks.webp?v=4',
          imageAlt: t.compSnacksAlt,
        }),
        comp(locale, '5', 'Help Cards', 'Tarjetas de Ayuda', 'hand-cards', {
          image: '/assets/canes-comp-ayuda.webp?v=3',
          imageAlt: t.compAyudaAlt,
        }),
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
      inspirationTitle: joinParts(t.mutH2a, stripHtml(t.mutH2em)),
      inspiration: t.heroTag,
      ctaHref: IG_DM_ESTUDIO,
      howTo: [
        { title: t.step1Title, body: t.step1Body },
        { title: t.step2Title, body: t.step2Body },
        { title: t.step3Title, body: t.step3Body },
      ],
      componentsPhoto: '/assets/carcinogenial-mesa-montaje.webp?v=5',
      componentsPhotoAlt: t.montajeAlt,
      components: [
        comp(locale, '80', 'Mutation cards', 'Cartas de Mutación', 'deck-cards', {
          image: '/assets/carcinogenial-comp-cartas.webp?v=3',
          imageAlt: t.compCartasAlt,
        }),
        comp(locale, '75', 'Action tokens', 'Fichas de Acción', 'tokens-stack', {
          image: '/assets/carcinogenial-comp-accion.webp',
          imageAlt: t.compAccionAlt,
        }),
        comp(locale, '40', 'Injection tokens', 'Fichas de Inyección', 'tokens-stack', {
          image: '/assets/carcinogenial-comp-inyeccion.webp',
          imageAlt: t.compInyeccionAlt,
        }),
        comp(locale, '4', 'Help cards', 'Tarjetas de Ayuda', 'hand-cards', {
          image: '/assets/carcinogenial-comp-ayuda.webp',
          imageAlt: t.compAyudaAlt,
        }),
      ],
      credits: t.footer,
    };
  },

  chispas: (_g, locale) => {
    const t = chispasCopy[locale];
    return {
      players: '2–6',
      duration: '20–30 min',
      inspirationTitle: stripHtml(t.riskH2),
      inspiration: t.riskP2,
      ctaHref: IG_DM_ESTUDIO,
      ...protoDev(t, 'badgeVersion', 'change1', 'change2', 'change3', 'change4'),
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
      inspirationTitle: joinParts(t.h2a, stripHtml(t.h2em)),
      inspiration: t.p1,
      ctaHref: IG_DM_ESTUDIO,
      ...protoDev(t, 'version', 'change1', 'change2', 'change3'),
      howTo: [
        { title: joinParts(t.h2a, stripHtml(t.h2em)), body: joinParts(t.p1, t.p2) },
        { title: joinParts(t.playH2a, stripHtml(t.playH2em)), body: t.playP1 },
        { title: joinParts(t.statusH2a, stripHtml(t.statusH2em), t.statusH2b), body: joinParts(t.statusP1, t.statusP2) },
      ],
      components: [
        comp(locale, '97', 'Evolution cards', 'Cartas de Evolución', 'deck-cards'),
        comp(locale, '4', 'Joker Cards', 'Cartas de Comodín', 'hand-cards'),
        comp(locale, '4', 'Fall Cards', 'Cartas de Caída', 'hand-cards'),
        comp(locale, '2', 'Super Joker Cards', 'Cartas de Super Comodín', 'hand-cards'),
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
      inspirationTitle: stripHtml(t.ideaH2),
      inspiration: t.ideaP1,
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
        comp(locale, '25', 'Feats', 'Hazañas', 'flags'),
        comp(locale, '6', 'Boast cards (0–5)', 'Cartas de Alarde (0–5)', 'deck-cards'),
      ],
      credits: t.footer,
    };
  },

  letrados: (game, locale) => {
    const t = letradosCopy[locale];
    return {
      players: '2',
      duration: '15 min',
      inspirationTitle: stripHtml(t.ideaH2),
      inspiration: t.heroSub,
      publisherUrl: 'https://www.lighthousegms.com/es',
      publisherLabel: 'Lighthouse Games',
      howTo: [
        { title: t.rule1Title, body: t.rule1Body },
        { title: t.rule2Title, body: t.rule2Body },
        { title: t.rule3Title, body: t.rule3Body },
      ],
      componentsPhoto: '/assets/letrados-mesa-montaje.webp?v=3',
      componentsPhotoAlt: t.montajeAlt,
      components: [
        comp(locale, '26', 'Letter cards', 'Cartas de Letra', 'deck-cards', {
          image: '/assets/letrados-comp-letras.webp?v=4',
          imageAlt: t.compLetrasAlt,
        }),
      ],
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

  ninive: (game, locale) => {
    const t = niniveCopy[locale];
    const ui = fichaCopy[locale];
    return {
      players: '2',
      duration: '15 min',
      imageAlt: t.fichaConceptAlt,
      inspirationTitle: stripHtml(t.introH2),
      inspiration: t.introP1,
      buyUrl: LUDOISMO,
      rulesUrl: LUDOISMO,
      rulesLabel: ui.rules,
      publisherUrl: LUDOISMO,
      publisherLabel: 'Ludoísmo',
      bggId: game.bggId ?? 456259,
      howTo: [
        { title: t.rule1Title, body: t.rule1Body, image: '/assets/ninive-mano.webp', imageAlt: t.gal2Alt },
        { title: t.rule2Title, body: t.rule2Body, image: '/assets/ninive-colocar.webp', imageAlt: t.rulePhotoAlt },
        { title: t.rule3Title, body: t.rule3Body, image: '/assets/ninive-partida.webp', imageAlt: t.gal1Alt },
      ],
      componentsPhoto: '/assets/ninive-mesa-montaje.webp?v=4',
      componentsPhotoAlt: t.montajeAlt,
      components: [
        comp(locale, '25', 'Palace Cards', 'Cartas de Palacio', 'deck-cards', {
          image: '/assets/ninive-comp-palacio.webp?v=2',
          imageAlt: t.compPalacioAlt,
        }),
        comp(locale, '1', 'Second Player Card', 'Carta de Segundo Jugador', 'hand-cards', {
          image: '/assets/ninive-comp-segundo.webp?v=2',
          imageAlt: t.compSegundoAlt,
        }),
      ],
      resources: [
        { label: t.resourceRulebookLabel, href: LUDOISMO, meta: t.resourceRulebookMeta },
        { label: t.resourceGuideLabel, href: LUDOISMO, meta: t.resourceGuideMeta },
      ],
      photos: [
        { src: '/assets/ninive-caja.webp', alt: t.heroAlt, caption: t.heroCaption },
        { src: '/assets/ninive-partida.webp', alt: t.gal1Alt, caption: t.gal1Cap },
        { src: '/assets/ninive-mano.webp', alt: t.gal2Alt, caption: t.gal2Cap },
        { src: '/assets/ninive-colocar.webp', alt: t.rulePhotoAlt, caption: t.ruleCaption },
      ],
      credits: t.fichaCredits,
    };
  },

  reloj: (_g, locale) => {
    const t = relojCopy[locale];
    return {
      players: '2–5',
      duration: '15–20 min',
      imageAlt: t.fichaConceptAlt,
      inspirationTitle: joinParts(t.h2a, stripHtml(t.h2em)),
      inspiration: t.p1,
      ctaHref: IG_DM_ESTUDIO,
      ...protoDev(t, 'version', 'change1', 'change2', 'change3'),
      howTo: (t.modes as readonly { name: string; desc: string }[]).map((mode, index) => ({
        title: mode.name,
        body: mode.desc,
        image:
          index === 0
            ? '/assets/reloj-playtest-orden.webp'
            : index === 1
              ? '/assets/reloj-playtest-mazo.webp'
              : undefined,
        imageAlt: index === 0 ? String(t.altOrden) : index === 1 ? String(t.altMazo) : undefined,
      })),
      componentsPhoto: '/assets/reloj-playtest-mazo.webp',
      componentsPhotoAlt: String(t.altMazo),
      components: [comp(locale, '48', 'Time Cards', 'Cartas de Tiempo', 'deck-cards')],
      photos: [
        { src: '/assets/reloj-playtest-orden.webp', alt: t.altOrden, caption: t.capOrden },
        { src: '/assets/reloj-playtest-mazo.webp', alt: t.altMazo, caption: t.capMazo },
      ],
      credits: t.fichaCredits,
    };
  },

  mantas: (_g, locale) => {
    const t = mantasCopy[locale];
    return {
      players: '2',
      duration: '20–30 min',
      inspirationTitle: stripHtml(t.ideaH2),
      inspiration: t.ideaP1,
      ctaHref: IG_DM_ESTUDIO,
      howTo: [
        { title: t.step1Title, body: t.step1Body },
        { title: t.step2Title, body: t.step2Body },
        { title: t.step3Title, body: t.step3Body },
      ],
      componentsPhoto: '/assets/mantas-mesa-montaje.webp?v=11',
      componentsPhotoAlt: t.montajeAlt,
      components: [
        comp(locale, '24', 'Manta Ray Tiles', 'Losetas de Manta Raya', 'terrain-tiles', {
          image: '/assets/mantas-comp-losetas.webp?v=3',
          imageAlt: t.comp1Alt,
        }),
        comp(locale, '1', 'Boat Tile', 'Loseta de Bote', 'terrain-tiles', {
          image: '/assets/mantas-comp-bote.webp?v=3',
          imageAlt: t.comp2Alt,
        }),
        comp(locale, '24', 'Objective Cards', 'Cartas de Objetivo', 'deck-cards', {
          image: '/assets/mantas-comp-cartas.webp?v=5',
          imageAlt: t.compCartasAlt,
        }),
        comp(locale, '2', 'Diver Tokens', 'Fichas de Buzo', 'meeples', {
          image: '/assets/mantas-comp-meeples.webp?v=4',
          imageAlt: t.compMeeplesAlt,
        }),
        comp(locale, '1', 'Lifebuoy Token', 'Ficha de Salvavidas', 'heart-star', {
          image: '/assets/mantas-comp-salvavidas.webp?v=6',
          imageAlt: t.comp5Alt,
        }),
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
    const inspirationTitle = joinParts(t.h2a, stripHtml(t.h2em), t.h2b);
    return {
      players: '2',
      duration: '15–20 min',
      inspirationTitle,
      inspiration: t.heroSub,
      ctaHref: IG_DM_ESTUDIO,
      ...protoDev(t, 'version', 'change1', 'change2', 'change3'),
      howTo: [
        { title: inspirationTitle, body: joinParts(t.p1, t.p2) },
        { title: joinParts(t.originA, stripHtml(t.originEm)), body: joinParts(t.originP1, t.originP2) },
      ],
      componentsPhoto: '/assets/pavoneo-abanico.webp',
      componentsPhotoAlt: t.fanAlt,
      components: [comp(locale, '13', 'Cards (12 + cover)', 'Cartas (12 + cover)', 'deck-cards')],
      photos: [{ src: '/assets/pavoneo-abanico.webp', alt: t.fanAlt, caption: t.fanCap }],
      credits: t.footer,
    };
  },

  piramisu: (_g, locale) => {
    const t = piramisuCopy[locale];
    return {
      players: '2–4',
      duration: '10–20 min',
      inspirationTitle: joinParts(t.h2a, t.h2b),
      inspiration: t.heroDesc,
      ctaHref: IG_DM_ESTUDIO,
      howTo: [
        { title: t.rule1Name, body: t.rule1Desc },
        { title: t.rule2Name, body: t.rule2Desc },
        { title: t.rule3Name, body: t.rule3Desc },
      ],
      componentsPhoto: '/assets/piramisu-maqueta.webp',
      componentsPhotoAlt: t.heroAlt,
      components: [comp(locale, '24', 'Ingredient cards', 'Cartas de Ingrediente', 'deck-cards')],
      photos: [
        { src: '/assets/piramisu-maqueta.webp', alt: t.heroAlt, caption: t.heroCap },
        { src: '/assets/piramisu-ronda.webp', alt: t.protoAlt, caption: t.protoCap },
      ],
      credits: t.footer,
    };
  },

  tartan: (_g, locale) => {
    const t = tartanCopy[locale];
    const inspirationTitle = `${t.h2a} ${stripHtml(t.h2em)}${t.h2b}`;
    return {
      players: '2–5',
      inspirationTitle,
      inspiration: t.originP1,
      ctaHref: IG_DM_ESTUDIO,
      ...protoDev(t, 'version', 'change1', 'change2', 'change3'),
      howTo: [
        { title: inspirationTitle, body: joinParts(t.p1, t.p2) },
        { title: joinParts(t.originA, stripHtml(t.originEm), t.originB), body: joinParts(t.originP1, t.originP2) },
      ],
      credits: t.footer,
    };
  },
};

/** Mezcla CMS + copy/assets de fichas handmade (i18n/fichas). */
export function buildLegacyFicha(game: GameCard, locale: Lang, keyword: string): FichaContent {
  const base = mergeFicha(toFicha(game), heroBase(game, keyword, locale));
  const extra = overlays[keyword]?.(game, locale);
  return extra ? mergeFicha(base, extra) : base;
}
