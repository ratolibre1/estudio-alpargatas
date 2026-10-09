# Paletas de ficha — familia + contrapunto

Reglas para los cuatro colores de cada juego (`palette` en `src/content/games/*.md`).

**Antes de tocar hex:** leer [PALETAS_WORKFLOW.md](./PALETAS_WORKFLOW.md). Los colores vienen de **conceptos / arte**, no de una tabla genérica.

## Estrategia

Tres tonos de la **misma familia** que el principal + **apoyo** como **contrapunto** (complementario suave o segundo color icónico del juego — p. ej. naranja frente a azul en Nínive).

| Rol CMS | Índice | Qué es |
|---|---|---|
| **base** | `palette[0]` | Claro teñido del principal (crema, marfil, gris-cartoon…). |
| **primary** | `palette[1]` | Identidad del juego. |
| **secondary** (apoyo) | `palette[2]` | **Contrapunto** — el otro color que el arte ya usa. |
| **accent** (tinta) | `palette[3]` | Oscuro de la familia; texto en cuerpo claro. No es el CTA. |

### Reglas

1. Base y tinta comparten matiz con el principal.
2. Apoyo = contraste temático (no repetir el mismo coral en todos los juegos).
3. Sin `#fff` / `#000` puros; ver `studio-neutral.ts`.
4. Ficha clara: `titleColor` suele ser **primary** (o tinta si buscas editorial oscuro).

## Mapeo a superficies

| Superficie | Origen |
|---|---|
| `--ficha-bg` | `bg` |
| CTA / barra premio | primary → apoyo (`ficha-theme.ts`) |
| Enlaces premios | apoyo → primary |

## Implementación

- `src/lib/studio-neutral.ts`, `src/lib/ficha-theme.ts`
- Schema: `palette` length 4
