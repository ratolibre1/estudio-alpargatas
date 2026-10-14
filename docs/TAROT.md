# Tarot de Alpargatas

La portada ES/EN incluye `TarotReading.astro`: invitación grande y diálogo nativo con 22 cartas boca abajo en abanico. Cada elección mueve una carta a uno de los tres espacios, la voltea y revela su predicción. Al completar la tirada aparece un enlace a la ficha de un prototipo y la opción de volver a tirar.

## Contenido y recomendación

- `src/lib/tarot.ts`: nombres ES/EN, predicciones editoriales, rutas de imágenes y tres afinidades por arcano. Las afinidades suman 3, 2 y 1 puntos respectivamente. Las tres cartas cuentan; los empates favorecen la afinidad de mayor prioridad de la última carta.
- Los juegos disponibles y sus nombres, descripciones y enlaces vienen del CMS. Se excluye el estado `publicado`; nunca se recomienda una ficha inexistente.
- `src/i18n/tarot.ts`: textos de interfaz y nombres de las tres posiciones.
- `src/lib/tarot-client.ts`: mezcla Fisher–Yates al abrir o repetir, límite de tres elecciones distintas, bloqueo durante cada animación y cancelación al cerrar. No usa servicios externos ni guarda datos del visitante.
- `src/styles/tarot.css`: estilos propios, con los cortes oficiales 980 / 760 / 520. El abanico permite desplazamiento interno en pantallas pequeñas.

## Arte

Fuente: carpeta Drive **Juegos de Mesa / Tarot Web**, ID `1IS7gZr1v4Pvjz6snN1_hUYAEHxbT8zcZ`. Contiene 22 PNG numerados 00–21. Se conservaron completos, sin recortes, como WebP de 600×900 en `public/assets/tarot/`. Los originales siguen en Drive. Las predicciones son texto nuevo para esta funcionalidad.

Reverso: `back.svg` es la fuente; `back.webp` (1200×1800, export con resvg) es lo que carga el abanico. Regenerar tras editar el SVG: `npm run assets:tarot-back`. Los anversos van en WebP 600×900. Las imágenes de la invitación son diferidas; dentro del diálogo solo se descarga el anverso de cada carta elegida.

## Accesibilidad y comprobación

El diálogo mantiene el foco dentro de la lectura, admite Escape, cierre explícito y clic en el fondo, y devuelve el foco al CTA. Flechas izquierda/derecha y Home/End recorren el abanico; Enter/Espacio eligen. Las predicciones se anuncian mediante una región viva. `prefers-reduced-motion` omite las animaciones. Sin JavaScript, se informa cómo activar la experiencia.

Ejecutar `npm test` y `npm run build`. Las pruebas verifican todos los arcanos y assets, mezcla sin repetición, límite de selección, puntuación/desempates y las 1540 combinaciones posibles con rutas ES/EN.
