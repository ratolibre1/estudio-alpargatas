import type { Lang } from '../locale';

export const slug = {
  es: {
    crumbHome: 'Inicio',
    crumbPortfolio: 'Portafolio',
    labelConcept: '01 — Concepto',
    emptyBefore: 'Todavía no hay notas. Llena el campo “Concepto / notas” en ',
    emptyMid: ' o el body de ',
    emptyAfter: '.',
    labelPlaytest: 'Playtest',
    labelStatus: 'Estado',
    statusBefore: 'Proto armado desde el CMS. Cuando el juego tenga página propia, reemplaza esta ruta con un ',
    statusMid: ' en ',
    statusAfter: '.',
  },
  en: {
    crumbHome: 'Home',
    crumbPortfolio: 'Portfolio',
    labelConcept: '01 — Concept',
    emptyBefore: 'No notes yet. Fill in the “Concept / notes” field in ',
    emptyMid: ' or the body of ',
    emptyAfter: '.',
    labelPlaytest: 'Playtest',
    labelStatus: 'Status',
    statusBefore: 'Prototype page built from the CMS. When the game gets its own page, replace this route with an ',
    statusMid: ' in ',
    statusAfter: '.',
  },
} as const satisfies Record<Lang, Record<string, string>>;
