import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Colección de juegos — fuente de verdad para el portafolio.
 * Cada juego es un archivo .md en src/content/games/.
 * El frontmatter define los metadatos; el body (opcional) puede ser
 * una descripción larga para uso futuro.
 */
const games = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/games' }),
  schema: z.object({
    /** Nombre visible del juego */
    name: z.string(),
    /** Emoji identificador */
    emoji: z.string(),
    /** Frase corta para la card del portafolio */
    tagline: z.string(),
    /** Género · Estado (ej: "Riesgo compartido · V0.3") */
    meta: z.string(),
    /** Estado interno del juego */
    state: z.enum(['publicado', 'avanzado', 'playtest', 'rediseno', 'proto']),
    /** Etiqueta legible del estado */
    stateLabel: z.string(),
    /** Orden de clasificación (1=publicado … 4=proto) */
    stateOrder: z.number().int(),
    /** Fecha de última actualización en formato YYYY-MM */
    date: z.string(),
    /** URL de la página individual del juego (opcional) */
    href: z.string().optional(),
    /** Color de fondo de la card */
    bg: z.string(),
    /** Color del título en la card */
    titleColor: z.string(),
    /** Color del tagline en la card */
    taglineColor: z.string(),
    /** Paleta de 4 colores para los swatches */
    palette: z.array(z.string()).length(4),
    /** Fuente CSS del título en la card */
    titleFont: z.string(),
  }),
});

export const collections = { games };
