import type { FichaContent } from './ficha';
import { loremDraft, loremFlag, showFichaLorem } from './ficha-lorem';

export type ReviewMark = 'ok' | 'partial' | 'review' | 'pending' | 'missing' | 'dummy' | 'na';

export type ReviewCell = {
  mark: ReviewMark;
  note: string;
};

export type ReviewColumn = {
  id: string;
  group: string;
  label: string;
};

export const REVIEW_COLUMNS: ReviewColumn[] = [
  { id: 'tagline', group: 'Textos', label: 'Subtítulo' },
  { id: 'concept', group: 'Textos', label: 'Leyenda' },
  { id: 'awards', group: 'Textos', label: 'Premios' },
  { id: 'inspiration', group: 'Textos', label: 'Inspiración' },
  { id: 'dev', group: 'Textos', label: 'En qué estamos' },
  { id: 'componentsText', group: 'Textos', label: 'Componentes' },
  { id: 'howtoText', group: 'Textos', label: 'Cómo se juega' },
  { id: 'galleryText', group: 'Textos', label: 'Pies de foto' },
  { id: 'componentImages', group: 'Imágenes', label: 'Componentes' },
  { id: 'howtoImages', group: 'Imágenes', label: 'Cómo se juega' },
  { id: 'protoPhotos', group: 'Imágenes', label: 'Fotos del proto' },
  { id: 'manuals', group: 'Archivos', label: 'Manuales' },
  { id: 'printables', group: 'Archivos', label: 'Imprimibles' },
  { id: 'agePlayers', group: 'Ficha', label: 'Edad / jugadores' },
];

/** Manuales en es y en ya cargados. Los imprimibles siguen aparte. */
const MANUALS_OK = new Set(['canes']);
const FACTS_OK = new Set(['ninive', 'letrados', 'canes', 'mantas', 'piramisu', 'carcinogenial']);

/** Los cinco primeros de la tabla: mismos juegos con el texto de componentes ya revisado. */
const COMPONENT_IMAGES_OK = new Set(['ninive', 'letrados', 'carcinogenial', 'canes', 'mantas']);

const STATE_RANK: Record<string, number> = {
  publicado: 0,
  produccion: 1,
  disponible: 2,
  pruebas: 3,
  boceto: 4,
  idea: 5,
};

export type ReviewRow = {
  keyword: string;
  name: string;
  state: string;
  href: string;
  cells: Record<string, ReviewCell>;
};

type Slot = Array<string | number>;

function slotState(keyword: string, slots: Slot[]): 'ok' | 'review' | 'partial' | 'pending' {
  const perLocale = (['es', 'en'] as const).map((locale) => {
    const flags = slots.map((parts) => loremFlag(locale, keyword, ...parts));
    const off = flags.every((flag) => !showFichaLorem(flag));
    const draft = flags.some((flag) => loremDraft.has(flag));
    if (!off) return 'pending' as const;
    if (draft) return 'review' as const;
    return 'ok' as const;
  });
  if (perLocale.every((state) => state === 'ok')) return 'ok';
  if (perLocale.every((state) => state === 'pending')) return 'pending';
  if (perLocale.includes('review')) return 'review';
  return 'partial';
}

function slotNote(state: 'ok' | 'review' | 'partial' | 'pending', detail: string): string {
  if (state === 'ok') return detail || 'es y en';
  if (state === 'review') return 'es listo · en por validar';
  if (state === 'partial') return detail ? `a medias · ${detail}` : 'a medias';
  return detail;
}

function pending(note = ''): ReviewCell {
  return { mark: 'pending', note };
}

function isDummyHref(href: string): boolean {
  return href.includes('example.com');
}

function fileCell(esUrl: string | undefined, enUrl: string | undefined, approved: boolean): ReviewCell {
  if ([esUrl, enUrl].some((href) => href && isDummyHref(href))) return pending('links de muestra');
  if (approved && esUrl && enUrl) return { mark: 'ok', note: 'es y en' };
  if (!esUrl && !enUrl) return pending('sin archivo');
  const langs = [esUrl && 'es', enUrl && 'en'].filter(Boolean).join(' y ');
  return pending(langs);
}

function devSlots(ficha: FichaContent): Slot[] {
  const slots: Slot[] = [];
  if (ficha.version || ficha.adjusting) slots.push(['devVersionTitle']);
  if (ficha.adjusting) slots.push(['devAdjusting']);
  if (ficha.nextPlaytests) {
    slots.push(['devNextTitle']);
    slots.push(['devNextBody']);
  }
  return slots;
}

export function reviewRow(input: {
  es: FichaContent;
  state: string;
  href: string;
}): ReviewRow {
  const { es, state, href } = input;
  const keyword = es.keyword;
  const cells: Record<string, ReviewCell> = {};

  cells.tagline = { mark: 'ok', note: 'es y en' };
  cells.concept = es.image
    ? { mark: 'ok', note: 'texto común' }
    : pending();

  const awardCount = es.awards?.length ?? 0;
  cells.awards = { mark: 'ok', note: String(awardCount) };

  if (es.inspirationTitle && es.inspiration) {
    const mark = slotState(keyword, [['inspirationTitle'], ['inspirationBody']]);
    cells.inspiration = { mark, note: slotNote(mark, '') };
  } else {
    cells.inspiration = pending();
  }

  const dev = devSlots(es);
  if (dev.length === 0) {
    cells.dev = pending();
  } else {
    const mark = slotState(keyword, dev);
    cells.dev = { mark, note: slotNote(mark, '') };
  }

  const componentCount = es.components?.length ?? 0;
  if (componentCount === 0) {
    cells.componentsText = pending();
  } else {
    const slots = Array.from({ length: componentCount }, (_, index) => ['component', index] as Slot);
    const mark = slotState(keyword, slots);
    cells.componentsText = { mark, note: slotNote(mark, String(componentCount)) };
  }

  const steps = es.howTo?.length ?? 0;
  if (steps === 0) {
    cells.howtoText = pending();
    cells.howtoImages = pending('sin fotos');
  } else {
    const slots = es.howTo!.flatMap((_, index) => [
      ['howto', index, 'title'] as Slot,
      ['howto', index, 'body'] as Slot,
    ]);
    const mark = slotState(keyword, slots);
    cells.howtoText = { mark, note: slotNote(mark, `${steps} pasos`) };
    const withImage = es.howTo!.filter((step) => step.image).length;
    cells.howtoImages = pending(withImage === 0 ? 'sin fotos' : `${withImage}/${steps}`);
  }

  const photos = es.photos?.length ?? 0;
  if (photos === 0) {
    cells.galleryText = pending();
    cells.protoPhotos = pending('sin fotos');
  } else {
    const slots = Array.from({ length: photos }, (_, index) => ['gallery', index] as Slot);
    const mark = slotState(keyword, slots);
    const captions = es.photos!.filter((photo) => photo.caption).length;
    cells.galleryText = { mark, note: slotNote(mark, `${captions}/${photos} con pie`) };
    cells.protoPhotos = pending(String(photos));
  }

  const componentPhotos = es.components?.filter((item) => item.image).length ?? 0;
  const hasComponentStage = Boolean(es.componentsPhoto) || componentCount > 0;
  const stage = es.componentsPhoto ? 'mesa' : 'sin mesa';
  const componentImageNote = !hasComponentStage
    ? 'sin fotos'
    : componentPhotos === 0 && !es.componentsPhoto
      ? 'sin fotos'
      : componentCount > 0
        ? `${stage} · ${componentPhotos}/${componentCount}`
        : stage;
  cells.componentImages = COMPONENT_IMAGES_OK.has(keyword)
    ? { mark: 'ok', note: componentImageNote }
    : pending(componentImageNote);

  cells.manuals = fileCell(es.manualUrl, es.manualUrlEn, MANUALS_OK.has(keyword));
  cells.printables = fileCell(es.pnpUrl, es.pnpUrlEn, false);

  const bits = FACTS_OK.has(keyword)
    ? [es.players, es.duration, es.age].filter(Boolean)
    : [es.players ?? 'sin jugadores', es.duration, es.age ?? 'sin edad'].filter(Boolean);
  const note = bits.join(' · ');
  cells.agePlayers = FACTS_OK.has(keyword) ? { mark: 'ok', note } : pending(note);

  return { keyword, name: es.name, state, href, cells };
}

export function sortReviewRows(rows: ReviewRow[]): ReviewRow[] {
  return [...rows].sort((a, b) => {
    const rank = (STATE_RANK[a.state] ?? 9) - (STATE_RANK[b.state] ?? 9);
    return rank || a.name.localeCompare(b.name, 'es');
  });
}

export function columnGroups(columns: ReviewColumn[]): { group: string; span: number }[] {
  const groups: { group: string; span: number }[] = [];
  for (const column of columns) {
    const last = groups[groups.length - 1];
    if (last && last.group === column.group) last.span += 1;
    else groups.push({ group: column.group, span: 1 });
  }
  return groups;
}
