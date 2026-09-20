import { config, collection, fields } from '@keystatic/core';

/**
 * Netlify inyecta automáticamente NETLIFY=true en su entorno de build/runtime.
 * - En Netlify (producción): modo GitHub → los cambios crean commits en el repo.
 * - Localmente: modo local → escribe directo al disco sin OAuth.
 */
const storage = process.env.NETLIFY
  ? ({
      kind: 'github',
      repo: 'ratolibre1/estudio-alpargatas',
      branchPrefix: 'keystatic/',
    } as const)
  : ({ kind: 'local' } as const);

export default config({
  storage,

  ui: {
    brand: { name: 'Estudio Alpargatas' },
  },

  collections: {
    games: collection({
      label: 'Juegos',
      slugField: 'name',
      path: 'src/content/games/*',
      schema: {
        name: fields.slug({ name: { label: 'Nombre del juego' } }),
        emoji: fields.text({ label: 'Emoji' }),
        tagline: fields.text({ label: 'Tagline (frase corta para la card)' }),
        meta: fields.text({ label: 'Meta (género · versión)' }),

        state: fields.select({
          label: 'Estado',
          options: [
            { label: 'Publicado', value: 'publicado' },
            { label: 'Avanzado', value: 'avanzado' },
            { label: 'En playtest', value: 'playtest' },
            { label: 'En rediseño', value: 'rediseno' },
            { label: 'Proto', value: 'proto' },
          ],
          defaultValue: 'proto',
        }),

        stateLabel: fields.text({
          label: 'Etiqueta del estado',
          description: 'Texto visible en la card, ej: "En playtest"',
        }),

        stateOrder: fields.integer({
          label: 'Orden de clasificación',
          description: '1=publicado, 2=avanzado, 3=playtest, 4=rediseño, 5=proto',
          defaultValue: 5,
        }),

        date: fields.text({
          label: 'Fecha de actualización',
          description: 'Formato YYYY-MM, ej: 2025-06',
        }),

        href: fields.text({
          label: 'URL de la página del juego',
          description: 'Ej: /juegos/chispas/ — dejar vacío si no tiene página aún',
          validation: { isRequired: false },
        }),

        /* ── Visual de la card en el portafolio ── */
        bg: fields.text({ label: 'Color de fondo (CSS)', description: 'Ej: #1a2818' }),
        titleColor: fields.text({ label: 'Color del título (CSS)' }),
        taglineColor: fields.text({ label: 'Color del tagline (CSS)' }),

        palette: fields.array(
          fields.text({ label: 'Color' }),
          {
            label: 'Paleta (exactamente 4 colores)',
            itemLabel: props => props.fields.value.value,
          }
        ),

        titleFont: fields.text({
          label: 'Fuente CSS del título',
          description: 'Ej: Georgia, serif',
        }),
      },
    }),
  },
});
