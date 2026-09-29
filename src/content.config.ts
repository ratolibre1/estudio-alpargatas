import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
    state: z.enum(['publicado', 'avanzado', 'playtest', 'rediseno', 'proto']),
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
    titleFont: z.string(),
    /** Default para que un md a medias no tumbe toda la colección en el watcher. */
    taglineFont: z.string().default('Georgia, serif'),
    /**
     * Brief para generar imágenes: [temática, estilo visual, mecánicas].
     * Exactamente 3 strings. No se muestra en la web.
     */
    conceptos: z.tuple([z.string(), z.string(), z.string()]),
  }),
});

export const collections = { games };
