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
    /** Copy más largo para la home; si falta, se usa tagline. */
    description: z.string().optional(),
    meta: z.string(),
    state: z.enum(['publicado', 'avanzado', 'playtest', 'rediseno', 'proto']),
    stateLabel: z.string(),
    stateOrder: z.number().int(),
    date: z.string(),
    home: z.enum(['featured', 'proto', 'none']).default('none'),
    homeOrder: z.number().int().default(0),
    players: z.string().optional(),
    duration: z.string().optional(),
    facts: z.array(z.string()).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    coverNumber: z.string().optional(),
    coverTitle: z.string().optional(),
    coverStatus: z.string().optional(),
    coverTheme: z.enum(['red', 'green', 'blue']).optional(),
    coverInitials: z.string().optional(),
    /** ID numérico de BoardGameGeek. La URL se deriva. */
    bggId: z.number().int().positive().optional(),
    awards: z
      .array(
        z.object({
          title: z.string(),
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
  }),
});

export const collections = { games };
