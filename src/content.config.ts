import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { COMP_ICON_SLUGS } from './lib/comp-icons';

const compIconSlug = z.enum(
  COMP_ICON_SLUGS as unknown as [string, ...string[]]
);

const keyword = z
  .string()
  .regex(
    /^[a-z][a-z0-9]*$/,
    'Una sola palabra ASCII en minúsculas (ej: reloj, canes, mantas).'
  );

/**
 * Colección de juegos — única fuente de verdad.
 * keyword = id del archivo = slug de URL (/juegos/<keyword>/).
 * El href no se guarda: se deriva siempre del keyword.
 */
const games = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/games' }),
  schema: z.object({
    keyword,
    name: z.string(),
    emoji: z.string(),
    tagline: z.string(),
    taglineEn: z.string().optional(),
    /** Copy más largo para la home; si falta, se usa tagline. */
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    meta: z.string(),
    metaEn: z.string().optional(),
    state: z.enum(['publicado', 'produccion', 'disponible', 'pruebas', 'boceto', 'idea']),
    stateLabel: z.string(),
    stateLabelEn: z.string().optional(),
    stateOrder: z.number().int(),
    date: z.string(),
    home: z.enum(['featured', 'proto', 'none']).default('none'),
    homeOrder: z.number().int().default(0),
    players: z.string().optional(),
    duration: z.string().optional(),
    facts: z.array(z.string()).optional(),
    factsEn: z.array(z.string()).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageAltEn: z.string().optional(),
    /** Fotos de mesa / playtest en la ficha stub. No es la imagen de home. */
    fotos: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          altEn: z.string().optional(),
          caption: z.string().optional(),
          captionEn: z.string().optional(),
        })
      )
      .optional(),
    coverNumber: z.string().optional(),
    coverNumberEn: z.string().optional(),
    coverTitle: z.string().optional(),
    coverTitleEn: z.string().optional(),
    coverStatus: z.string().optional(),
    coverStatusEn: z.string().optional(),
    coverTheme: z.enum(['red', 'green', 'blue']).optional(),
    coverInitials: z.string().optional(),
    /** ID numérico de BoardGameGeek. La URL se deriva. */
    bggId: z.number().int().positive().optional(),
    awards: z
      .array(
        z.object({
          title: z.string(),
          titleEn: z.string().optional(),
          image: z.string().optional(),
          href: z.string().optional(),
        })
      )
      .optional(),
    bg: z.string(),
    titleColor: z.string(),
    taglineColor: z.string(),
    palette: z.array(z.string()).length(4),
    /** Elección editorial por juego, independiente de la paleta. */
    fichaMode: z.enum(['light', 'dark']).default('light'),
    titleFont: z.string(),
    /** Default para que un md a medias no tumbe toda la colección en el watcher. */
    taglineFont: z.string().default('Georgia, serif'),
    /** Fuente del cuerpo (secciones). Si vacío, taglineFont o UI sans. */
    bodyFont: z.string().optional(),
    bodyColor: z.string().optional(),
    mutedColor: z.string().optional(),
    lineColor: z.string().optional(),
    surfaceColor: z.string().optional(),
    ctaColor: z.string().optional(),
    headerBg: z.string().optional(),
    headerText: z.string().optional(),
    headerMuted: z.string().optional(),
    footerBg: z.string().optional(),
    footerText: z.string().optional(),
    footerMuted: z.string().optional(),
    /**
     * Brief para generar imágenes: [temática, estilo visual, mecánicas].
     * Exactamente 3 strings. No se muestra en la web.
     */
    conceptos: z.tuple([z.string(), z.string(), z.string()]),
    imageCaption: z.string().optional(),
    imageCaptionEn: z.string().optional(),
    pitchTitle: z.string().optional(),
    pitchTitleEn: z.string().optional(),
    pitch: z.string().optional(),
    pitchEn: z.string().optional(),
    buyUrl: z.string().optional(),
    ctaHref: z.string().optional(),
    rulesUrl: z.string().optional(),
    rulesLabel: z.string().optional(),
    rulesLabelEn: z.string().optional(),
    publisherUrl: z.string().optional(),
    publisherLabel: z.string().optional(),
    publisherLabelEn: z.string().optional(),
    version: z.string().optional(),
    adjusting: z.string().optional(),
    adjustingEn: z.string().optional(),
    nextPlaytests: z.string().optional(),
    nextPlaytestsEn: z.string().optional(),
    howTo: z
      .array(
        z.object({
          title: z.string(),
          titleEn: z.string().optional(),
          body: z.string(),
          bodyEn: z.string().optional(),
          image: z.string().optional(),
          imageAlt: z.string().optional(),
          imageAltEn: z.string().optional(),
        })
      )
      .optional(),
    componentsPhoto: z.string().optional(),
    componentsPhotoAlt: z.string().optional(),
    componentsPhotoAltEn: z.string().optional(),
    componentsNote: z.string().optional(),
    componentsNoteEn: z.string().optional(),
    components: z
      .array(
        z.object({
          qty: z.string(),
          name: z.string(),
          nameEn: z.string().optional(),
          icon: compIconSlug.optional(),
          image: z.string().optional(),
          imageAlt: z.string().optional(),
          imageAltEn: z.string().optional(),
        })
      )
      .optional(),
    resources: z
      .array(
        z.object({
          label: z.string(),
          labelEn: z.string().optional(),
          href: z.string(),
          meta: z.string().optional(),
          metaEn: z.string().optional(),
        })
      )
      .optional(),
    credits: z.string().optional(),
    creditsEn: z.string().optional(),
  }),
});

export const collections = { games };
