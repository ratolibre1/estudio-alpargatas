# Paletas de ficha y modo explícito

Paletas aprobadas por Artur el 9 de octubre de 2026, tras comparar el catálogo completo. Esta ronda sustituye las propuestas anteriores. No regenerar los colores al decidir entre claro y oscuro.

## Fuente de verdad

Cada `src/content/games/<keyword>.md` contiene exactamente cuatro colores:

| Índice | Rol | Uso |
|---|---|---|
| 0 | Base | Superficie clara teñida y texto en oscuro. |
| 1 | Principal | Identidad del juego; CTA en claro. |
| 2 | Contrapunto | Acentos, bordes y CTA en oscuro. |
| 3 | Tinta | Oscuro de la familia; texto en claro y superficies en oscuro. |

La afinidad cromática interna debe coexistir con variedad entre juegos: no repetir el mismo verde/terracota o marrón/azul en todo el catálogo. El contrapunto tiene peso suficiente sobre superficies claras, sin volver a los pasteles anteriores. Los colores de arte, fotos, logo y banderas conservan sus propios colores.

`bg`, `titleColor`, `taglineColor` y los overrides legacy del CMS no pintan la ficha unificada. Sus valores se mantienen para los otros contextos. Todos los colores derivados de ficha proceden exclusivamente de los cuatro slots, mediante mezclas sRGB o selección de uno de ellos.

## Modo como elección por juego

```yaml
palette:
  - "#EEF1DB"
  - "#476B32"
  - "#9D5735"
  - "#253521"
fichaMode: light
```

`fichaMode` acepta `light` o `dark`, también desde el CMS. El fallback es `light`. `fichaBandMode()` solo lee esta decisión: la luminancia, el sistema operativo y cambiar la paleta no cambian el modo. El HTML estático incluye `data-band` y el tema completo, por lo que funciona sin JavaScript.

**Modo estándar (oct 2026):** cada juego tiene `fichaMode: light | dark` en CMS. Reparto aprobado:

| Modo | Juegos |
|---|---|
| **dark** | Almagesto, Chauvet, Evoluciona, Hubris, Palomas, Pavoneo, Piramisú, Reloj, Tartán |
| **light** | Amateurasu, Canes, Carcinogenial, Chispas, Ermitaños, Gato, Letrados, Mantas, Nínive, Nudis |

Para cambiar el reparto: editar solo `fichaMode` en el `.md` o en Decap (sin tocar `palette`).

## Superficies y lectura

`src/lib/ficha-colors.ts` calcula los tokens al compilar; `src/styles/ficha.css` los aplica.

| Elemento | Claro | Oscuro |
|---|---|---|
| Cuerpo | Base | 22% base + 78% tinta |
| Header y footer | 30% principal + 70% base | Tinta |
| Fondo del arte | 22% principal + 78% base | Tinta |
| Banda de inspiración | 18% principal + 82% base | Tinta |
| Cajitas | 16% principal + 84% base | 14% base + 86% tinta |
| Paneles de recursos | 10% principal + 90% base | 12% base + 88% tinta |
| CTA | Principal | Contrapunto |
| Etiqueta de estado | Colores fijos del portafolio (`state-badge.ts`) | Igual |

Estas son las mezclas de partida. Si una superficie no permite un contraste de 4,6:1 con ningún slot, se reduce su mezcla hacia base o tinta. El encabezado se distingue del cuerpo en ambos modos.

El texto se elige contra **su fondo real**, no contra un color distinto al usado por el botón. Los textos secundarios se suavizan solo mientras conservan 4,6:1. Links y estados hover mezclan el contrapunto con un slot legible cuando hace falta. El título grande conserva el principal en claro si alcanza 3:1 en ambos extremos del degradado; de lo contrario usa el texto principal. Las cajitas usan su propio texto, sin opacidad añadida ni colores heredados del chrome general.

No hay quinto color de origen. Las mezclas generan los tokens semánticos; no se guardan como nuevos colores en el CMS.

## Paletas aprobadas

| Juego | Base | Principal | Contrapunto | Tinta | `fichaMode` |
|---|---|---|---|---|---|
| Almagesto | `#E7E4FA` | `#5146B5` | `#816019` | `#18142F` | **dark** |
| Amateurasu | `#FBE6D5` | `#B82F32` | `#256B6B` | `#462022` | light |
| El Gran Festival de Canes | `#EEF1DB` | `#476B32` | `#9D5735` | `#253521` | light |
| Carcinogenial | `#F1F3DF` | `#922D67` | `#5F7214` | `#2B1728` | light |
| Chauvet | `#E9E2D3` | `#504941` | `#A04827` | `#29241F` | **dark** |
| Chispas | `#FFF0BE` | `#BF3F1C` | `#276C84` | `#3B241A` | light |
| Ermitaños | `#DDF3EB` | `#006F73` | `#9F305A` | `#143D35` | light |
| Evoluciona | `#F3EAD1` | `#806012` | `#755698` | `#393017` | **dark** |
| Gato Regalón | `#F8E8E5` | `#9A3D54` | `#4D6E44` | `#422934` | light |
| Hubris | `#EDE2FC` | `#7E36B7` | `#859524` | `#24102F` | **dark** |
| Letrados | `#E8F0FF` | `#2351A8` | `#915409` | `#182844` | light |
| Mantas a Raya | `#DCEFFA` | `#136C99` | `#AB3B25` | `#10283B` | light |
| Nínive | `#F3E3CA` | `#1A6A77` | `#9C4D23` | `#15343A` | light |
| Manda Nudis | `#F8E5F3` | `#AD287E` | `#17646F` | `#39213C` | light |
| Palomas | `#ECE9E3` | `#4E5B77` | `#735913` | `#252B3A` | **dark** |
| Pavoneo | `#EEF0D8` | `#596C18` | `#933E7B` | `#293316` | **dark** |
| Piramisú | `#F7E0C3` | `#6F381B` | `#28577A` | `#382218` | **dark** |
| Hasta un Reloj Roto... | `#EEDFF0` | `#6D416C` | `#885316` | `#302039` | **dark** |
| Tartán | `#E2EAE4` | `#235C4B` | `#A62B43` | `#1A332C` | **dark** |

Ver [PALETAS_WORKFLOW.md](./PALETAS_WORKFLOW.md) para futuras revisiones.
