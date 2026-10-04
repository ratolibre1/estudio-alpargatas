import type { Lang } from '../i18n/locale';
import { ninive as niniveCopy } from '../i18n/fichas/ninive';
import { reloj as relojCopy } from '../i18n/fichas/reloj';
import { ficha as fichaCopy } from '../i18n/fichas/ficha';
import { fichaConceptArtUrl, mergeFicha, toFicha, type FichaContent } from './ficha';
import type { GameCard } from './games';

const IG = 'https://ig.me/m/estudioalpargatas/';
const LUDOISMO = 'https://ludoismo.cl/';

export function demoNinive(game: GameCard, locale: Lang): FichaContent {
  const t = niniveCopy[locale];
  const ui = fichaCopy[locale];
  const base = toFicha(game);
  return mergeFicha(base, {
    players: locale === 'en' ? '2' : '2',
    duration: locale === 'en' ? '15 min' : '15 min',
    image: fichaConceptArtUrl('ninive'),
    imageAlt:
      locale === 'en'
        ? 'Concept art — garden palace with orange flowers and blue fountains'
        : 'Arte conceptual — palacio jardín con flores naranjas y fuentes azules',
    imageCaption: ui.conceptCaption,
    pitchTitle: locale === 'en' ? 'One palace. Two gardens.' : 'Un mismo palacio. Dos jardines.',
    pitchSubtitle: t.introP2,
    buyUrl: LUDOISMO,
    rulesUrl: LUDOISMO,
    rulesLabel: locale === 'en' ? 'See the rulebook' : 'Ver reglamento',
    publisherUrl: LUDOISMO,
    publisherLabel: 'Ludoísmo',
    bggId: game.bggId ?? 456259,
    howTo: [
      { title: t.rule1Title, body: t.rule1Body, image: '/assets/ninive-mano.webp', imageAlt: t.gal2Alt },
      { title: t.rule2Title, body: t.rule2Body, image: '/assets/ninive-colocar.webp', imageAlt: t.rulePhotoAlt },
      { title: t.rule3Title, body: t.rule3Body, image: '/assets/ninive-partida.webp', imageAlt: t.gal1Alt },
    ],
    componentsPhoto: '/assets/ninive-partida.webp',
    componentsPhotoAlt: t.gal1Alt,
    components:
      locale === 'en'
        ? [
            { qty: '27', name: 'Cards' },
            { qty: '2', name: 'Role cards' },
          ]
        : [
            { qty: '27', name: 'Cartas' },
            { qty: '2', name: 'Cartas de rol' },
          ],
    resources:
      locale === 'en'
        ? [
            { label: 'Rulebook PDF', href: LUDOISMO, meta: 'Full game · Ludoísmo' },
            { label: 'Quick guide', href: LUDOISMO, meta: 'Core rules summary' },
          ]
        : [
            { label: 'Reglamento PDF', href: LUDOISMO, meta: 'Juego completo · Ludoísmo' },
            { label: 'Guía rápida', href: LUDOISMO, meta: 'Resumen de reglas' },
          ],
    photos: [
      { src: '/assets/ninive-caja.webp', alt: t.heroAlt, caption: t.heroCaption },
      { src: '/assets/ninive-partida.webp', alt: t.gal1Alt, caption: t.gal1Cap },
      { src: '/assets/ninive-mano.webp', alt: t.gal2Alt, caption: t.gal2Cap },
      { src: '/assets/ninive-colocar.webp', alt: t.rulePhotoAlt, caption: t.ruleCaption },
    ],
    credits:
      locale === 'en'
        ? 'Design · Estudio Alpargatas · Published by Ludoísmo'
        : 'Diseño · Estudio Alpargatas · Editorial Ludoísmo',
  });
}

export function demoReloj(game: GameCard, locale: Lang): FichaContent {
  const t = relojCopy[locale];
  const ui = fichaCopy[locale];
  const base = toFicha(game);
  return mergeFicha(base, {
    players: '2–5',
    duration: '15–20 min',
    image: fichaConceptArtUrl('reloj'),
    imageAlt:
      locale === 'en'
        ? 'Concept art — clock hours and half-hours of the day'
        : 'Arte conceptual — horas y medias horas del día en un reloj',
    imageCaption: ui.conceptCaption,
    pitchTitle: locale === 'en' ? 'Forty-eight cards. Not an hour to spare.' : 'Cuarenta y ocho cartas. Ninguna hora de sobra.',
    pitchSubtitle: String(t.p2),
    ctaHref: IG,
    version: String(t.version),
    adjusting: String(t.change2),
    nextPlaytests: String(t.change3),
    howTo: (
      t.modes as readonly { name: string; desc: string }[]
    ).map((mode, index) => ({
      title: mode.name,
      body: mode.desc,
      image: index === 0 ? '/assets/reloj-playtest-orden.webp' : index === 1 ? '/assets/reloj-playtest-mazo.webp' : undefined,
      imageAlt: index === 0 ? String(t.altOrden) : index === 1 ? String(t.altMazo) : undefined,
    })),
    componentsPhoto: '/assets/reloj-playtest-mazo.webp',
    componentsPhotoAlt: String(t.altMazo),
    componentsNote: locale === 'en' ? 'Materials still in review' : 'Materiales en revisión',
    components: [{ qty: '48', name: locale === 'en' ? 'cards' : 'cartas' }],
    photos: [
      { src: '/assets/reloj-playtest-orden.webp', alt: String(t.altOrden), caption: String(t.capOrden) },
      { src: '/assets/reloj-playtest-mazo.webp', alt: String(t.altMazo), caption: String(t.capMazo) },
    ],
    credits: locale === 'en' ? 'Design · Estudio Alpargatas' : 'Diseño · Estudio Alpargatas',
  });
}
