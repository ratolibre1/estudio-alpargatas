# Protocolo de un proto nuevo

Para cuando entra un juego que todavía no está publicado. La ficha nueva sale solo del CMS: `src/content/games/<keyword>.md`. No se crea `src/pages/juegos/<keyword>/` ni se copia nada desde `/juegos/old/` o `src/i18n/fichas/`.

Keyword: una palabra ASCII en minúsculas (`oxido`, `reloj`). La URL es `/juegos/<keyword>` y `/en/juegos/<keyword>`.

Estado de un proto: `pruebas`, `boceto` o `idea`. `publicado` apaga el bloque «En qué estamos», cambia el CTA a compra y **saca el juego del tarot**.

## Mínimo para que el build no se caiga

Sin estos campos el markdown no entra en la colección:

| Campo | Notas |
|---|---|
| `keyword`, `name`, `emoji` | El keyword es el nombre del archivo. |
| `tagline`, `meta` | El subtítulo se ve en la ficha, el portafolio y el tarot. |
| `state`, `stateLabel`, `stateOrder`, `date` | |
| `bg`, `titleColor`, `taglineColor` | Siguen en el CMS. La ficha no los pinta; usa `palette`. |
| `palette` | Exactamente 4 colores. Ver [PALETAS_FICHA.md](./PALETAS_FICHA.md). |
| `titleFont` | Familia del título. Ver fuentes, abajo. |
| `conceptos` | Tres strings: temática, estilo visual, mecánicas. Brief de imágenes. No se muestra. |

`fichaMode` default `light`. `taglineFont` default Georgia si falta; no dejarlo así en un proto que ya se enseña.

## Mínimo de la ficha

Cada texto visible va en español y en inglés (`*En`). Lo que todavía no está escrito se deja vacío: ver Lorem.

| Bloque | Qué tiene que haber | Qué puede esperar |
|---|---|---|
| Héroe | Nombre, subtítulo, estado, arte `concepto-<keyword>.webp` | Edad, duración, jugadores, solo si ya están decididos. La edad no se inventa. |
| En qué estamos | Párrafos `adjusting` y `nextPlaytests` | Los títulos son fijos: **Versión Actual** y **Próximas pruebas**. El número de `version` no se muestra. |
| Inspiración | `pitchTitle` + `pitch` | Los dos, o ninguno. Con uno solo la franja no aparece. |
| Cómo se juega | Hasta 3 pasos, título y cuerpo | La plantilla pinta solo los tres primeros. |
| Componentes | Cantidad, nombre ES/EN, icono de `comp-icons.ts` | Mesa y detalle cuando haya arte. El `(c)` en el nombre marca arte conceptual, en los dos idiomas. |
| Galería | Fotos de mesa o de concepto, con pie | |
| Archivos | | Manual e imprimible van aparte, cada uno con URL ES y URL EN. No hay fallback de un idioma al otro. |
| Cocreación | | El pill sale solo si hay nombre y URL. |

Premios vacíos están bien: en Revisiones se lee «Listo · 0».

El pie del arte conceptual es común a todas las fichas («Arte conceptual · Exploración visual»). No se cambia por juego.

## Texto que todavía no existe

No se escribe copy de relleno que parezca definitivo. Un hueco vacío lo tapa la plantilla con Lorem ipsum.

Un texto nuevo y no vacío se muestra tal cual, y en Revisiones esa celda puede pasar a Listo si todos los huecos de la columna están así en los dos idiomas. Por eso el dummy no se tipea: se deja el campo en blanco.

No regenerar `src/lib/ficha-lorem-baseline.ts`. Esa foto es la que decide si un texto viejo sigue tapado.

## Imágenes

WebP, calidad ~86. Al reemplazar una que ya estaba publicada, subir `?v=` solo en esa URL.

| Uso | Export | Cómo entra en la página |
|---|---|---|
| Arte conceptual, héroe y portafolio | **1200×800** (3:2) | `public/assets/concepto-<keyword>.webp`. El campo `image` del CMS es el del portafolio; el héroe de la ficha usa siempre el archivo `concepto-`. |
| Cómo se juega | **1200×900** (4:3) | `howTo[].image`. El marco recorta con `object-fit: cover`. |
| Mesa de componentes | **1600×900** (16:9) | `componentsPhoto`. Partida en curso, no el setup inicial. Riel de madera y fieltro del juego. Gramática en [MONTAJES.md](./MONTAJES.md). |
| Detalle de un componente | **1600×900** (16:9) | `components[].image`. Mismo fieltro, a sangre, sin riel. |
| Galería | La proporción del arte | `fotos`. Se muestra entera (`contain`), sin recorte. Tope de alto `min(85vh, 52rem)`. |
| Icono de componente | El set existente | Slug en `components[].icon`. Sin icono cae en `tokens-stack`. |

## Fuentes

El título no repite la familia de otro juego. El cuerpo sigue en Nunito, salvo una excepción justificada (hoy solo Amateurasu).

1. Mirar la tabla de [FUENTES_JUEGOS.md](./FUENTES_JUEGOS.md).
2. Si la familia no está en `src/lib/caja-fonts.ts`, sumarla a `CAJA_FONTS_URL` con el peso que la ficha usa (el título va en 700).
3. Anotar el par nuevo en esa tabla, en el mismo cambio.

## Revisiones

`/revisiones` no está en el menú y lleva `noindex`. La fila no se agrega a mano: aparece al existir el markdown.

Todo lo que no se aprobó queda Pendiente. No se marca Listo en código para «salir del paso». Una celda pasa a Listo cuando el texto ya no está bajo Lorem en español y en inglés, o cuando las imágenes de ese bloque están en la lista que Arturo dio por cerrada.

## Tarot

La portada no crea una carta nueva. Los 22 arcanos ya están. Un proto entra en la recomendación así:

1. `state` distinto de `publicado`. Un publicado nunca se recomienda, aunque figure en una carta.
2. El keyword se agrega a `games` de los arcanos que le hagan sentido, en `src/lib/tarot.ts`. Cada carta tiene tres afinidades: la primera suma 3, la segunda 2, la tercera 1. Las tres cartas de la tirada cuentan.
3. Si el keyword no está en ningún arcano, la tirada no lo elige.

No hace falta arte de tarot por juego. Las cartas son las de `public/assets/tarot/` (600×900). Detalle en [TAROT.md](./TAROT.md).

El portafolio lista solo con que el markdown exista. El campo `home` (`featured`, `proto`, `none`) se guarda, pero la portada actual no lo usa para armar una fila.

## Al cerrar

- `npm run build` incluye `/juegos/<keyword>` y `/en/juegos/<keyword>`.
- Mirar la ficha en local: http://127.0.0.1:4321/juegos/<keyword>
- No hacer deploy. Subir a `main` publica producción.
