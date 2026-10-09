# Montajes de componentes

Para el agente que arme la mesa de un juego nuevo en la ficha. Canes, Mantas a Raya, Nínive, Letrados y Carcinogenial ya están montados con las mismas reglas. No reabrir esas decisiones salvo que Arturo lo pida.

La galería de la ficha sigue siendo foto o arte existente. El montaje vive solo en el bloque de componentes.

## Dónde se cablea

| Qué | Dónde |
|---|---|
| Mesa general | `componentsPhoto` en `src/lib/ficha-overlays.ts` |
| Detalle al hacer click en un componente | `components[].image` vía `comp(...)` |
| Alt ES / EN | `src/i18n/fichas/<juego>.ts` |
| Archivo | `public/assets/<juego>-mesa-montaje.webp` y `<juego>-comp-<pieza>.webp` |

El stage es 16:9 con `object-fit: cover` (`.ficha-comp-stage` en `src/styles/ficha.css`). Exportar **1600×900**.

Cache: subir `?v=` solo en la URL que cambió. Un reemplazo global de `?v=` pisa otros juegos (Canes y Mantas comparten el archivo).

Nombres de componente: los de la ficha, no un sinónimo. Ejemplos ya corregidos: «Fichas de Buzo», «Carta de Segundo Jugador» (es una sola), «Cartas de Super comodín».

## Cómo se exporta

1. HTML temporal en `/tmp/<juego>-montaje/` (el directorio tiene que existir antes de servir).
2. `python3 -m http.server` en ese directorio.
3. Screenshot con Playwright (`/tmp/canes-export/node_modules/playwright-core`) y Chrome en `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. Viewport 1440×810, `deviceScaleFactor: 2`, screenshot del elemento de la mesa.
4. `magick <png> -resize 1600x900 -quality 86 public/assets/<archivo>.webp`.
5. Matar el server. Revisar `http://127.0.0.1:4321/juegos/<keyword>` (el dev server ya corre). No hacer deploy.

El modelo de visión se equivoca al contar flores, piedras y números en jpg chicos. Verificar con píxeles o con el PNG grande.

## La mesa

Partida en curso, no el setup inicial. El conjunto (palacio o losetas, carta especial, manos) va centrado.

Borde de mesa, el de Canes:

- Fondo oscuro alrededor.
- `.table-rail`: `inset: 22px 30px 26px`, `border-radius: 26px`, `padding: 12px`.
- Madera: `linear-gradient(160deg, #8B5A2B 0%, #5C3A18 35%, #7A4E28 70%, #4A2E12 100%)`.
- Fieltro adentro, `border-radius: 16px`. El color es del juego.

Fieltros ya usados:

| Juego | Fieltro |
|---|---|
| Canes, Carcinogenial | verde `#3a7d52 → #2d6340 → #245234` |
| Mantas | celeste `radial-gradient(ellipse at 50% 42%, #1b86b8 0%, #0e628f 54%, #08486c 100%)` |
| Nínive | burdeo `radial-gradient(ellipse at 50% 42%, #8a2e3c 0%, #641c28 54%, #3e1018 100%)` |
| Letrados | pizarra `radial-gradient(ellipse at 50% 42%, #3d86b0 0%, #226080 54%, #14384c 100%)` |

En Mantas no hay plato celeste plano detrás de la grilla. La separación entre losetas es 4px.

La mesa general lleva el riel de madera. El detalle de un componente (cartas, fichas, ayuda) es fieltro a sangre, sin riel. Así están Canes, Carcinogenial y el detalle de Letrados.

## Cartas y fichas

Trato de Canes, en los tres:

- Arte plano. Sin brillo, sin canto extruido claro.
- Sombra suave (`drop-shadow`), inclinación chica.
- Un mazo es una pila, no un abanico. Solo una mano de reversos se abre en abanico. El descarte del centro, en un juego tipo Canes, también puede ir en abanico.
- Las cartas que un jugador ya bajó, con fichas encima, no van en abanico. Van en fila, en columna o en grilla, con un temblor de ±2°. Eso no es un abanico.
- Anverso y reverso tienen el mismo tamaño, en el PNG y en el CSS. Medir el ancho de layout, no el bounding box después de rotar: un giro de 2° agranda el rectángulo. Si el mazo se ve más alto, es porque las de abajo asoman; la de arriba mide igual que una boca arriba.
- Un borde gris claro alrededor del reverso puede ser parte de la carta, no margen para recortar. En Carcinogenial lo era. No hacer flood-fill de ese gris salvo que se confirme que es lienzo.
- Esquinas redondas con máscara de alpha, el mismo radio en anverso y reverso. `border-radius` más `box-shadow` no sigue la curva; `drop-shadow` sí, si el PNG ya tiene el alpha.
- La carta especial (segundo jugador, ayuda) va al mismo tamaño que las demás. En el arte de caja a veces sale más grande; no copiar eso.
- No calcar el asiento de Canes en un juego hermano. Misma gramática (mano, ayuda, fichas, cartas bajadas), distinta disposición en cada jugador.
- Si las fichas copiadas a la escala de Canes se ven chicas en la mesa, Carcinogenial quedó al 115% de ese primer pase (sobre la carta, en el pocillo y en el montón).
- Si el reverso trae texto, girar el mazo para que se lea derecho. En Mantas, `rotate(90deg)` deja «Mantas a Raya» de izquierda a derecha y la cabeza de la manta hacia la derecha. `rotate(-90deg)` lo deja al revés.

Grosor de losetas y meeples: un duplicado oscuro desplazado hacia abajo. El canto mira hacia abajo de la pantalla aunque el arte rote. No invertir el orden del transform.

«Madera» significa grosor, no color café. El canto toma un tono más oscuro del propio cuerpo (el buzo morado, morado; el salvavidas, marengo). El canto café del buzo naranja ya está aprobado. El agujero del salvavidas también muestra ese gris en la pared interior.

Losetas de Mantas: rotación de 90° al azar, algunas por el reverso, y encima un temblor de a lo más ~3,5°. Las misiones cumplidas van en fila horizontal, del mismo tamaño que el mazo, solapadas, no en columna.

## Nínive, por si hay que retocar el palacio

Cada carta es única por flores (número izquierdo) y piedras (número derecho). Archivos en `~/Downloads/Diseños individuales/Carta-XY.png` (`Carta-15` = 1 flor y 5 piedras). `Carta-Reverso.png` es el dorso azul. `Carta-Seg.png` es la de segundo jugador.

La carta de arriba se apoya en la junta de las dos de abajo. El montaje principal no lleva las 25: es el centro del palacio de la caja, con la de segundo jugador en una esquina y una mano de 3 reversos a la izquierda y otra de 4 a la derecha.

## Carcinogenial

Misma gramática y mismo fieltro que Canes: cuatro jugadores, mazo, descarte en abanico, pocillo de inyección y pocillo de acción. Cada asiento va armado distinto (fila, columna o grilla de 2×2). La ayuda es una sola lámina ancha, simples y avanzadas juntas; en el detalle se muestran dos copias superpuestas. El PNG de ayuda llegó con el texto comido por los íconos: no recortarlo para disimularlo.

## Ya hecho

| Juego | Mesa | Detalles |
|---|---|---|
| Canes | `canes-mesa-montaje.webp` | disciplinas, acción, snacks, ayuda |
| Mantas | `mantas-mesa-montaje.webp?v=11` | losetas, bote, cartas, buzos, salvavidas |
| Nínive | `ninive-mesa-montaje.webp?v=4` | palacio, segundo jugador |
| Letrados | `letrados-mesa-montaje.webp?v=3` | letras `?v=4`; torres de 4, manos de 2, esquinas redondas; el detalle va sin riel |
| Carcinogenial | `carcinogenial-mesa-montaje.webp?v=5` | cartas `?v=3`, acción, inyección, ayuda |

Evoluciona tiene conteos en el overlay (97 / 4 / 4 / 2) y todavía no tiene montaje.
