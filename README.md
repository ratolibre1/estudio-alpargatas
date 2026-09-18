# Estudio Alpargatas — versión Astro

Traslado de la versión publicada del sitio de Estudio Alpargatas a Astro. Conserva las tres rutas actuales, el diseño, los textos, las imágenes y las correcciones móviles.

## Usarlo en local

Necesitas Node.js 22 o superior.

```bash
npm install
npm run dev
```

Astro mostrará la dirección local en la terminal. Para comprobar la versión de producción:

```bash
npm run build
npm run preview
```

## Estructura

- `src/pages/`: portada, mapa y ficha de Nínive.
- `src/layouts/BaseLayout.astro`: estructura HTML común y metadatos.
- `src/components/`: encabezado y pie reutilizables.
- `src/data/games.ts`: contenido de tarjetas y prototipos de la portada.
- `src/styles/global.css`: diseño completo de la versión actual.
- `public/assets/`: logo y fotografías.

Para añadir una nueva ficha, crea una carpeta en `src/pages/juegos/` siguiendo el ejemplo de `ninive/index.astro`, y convierte la tarjeta correspondiente en un enlace.

## GitHub y Netlify

El archivo `netlify.toml` ya incluye la configuración necesaria. Al importar el repositorio en Netlify, el comando de compilación es `npm run build` y la carpeta publicada es `dist`.

## Trabajarlo con Claude

Puedes subir el ZIP completo o, de preferencia, abrir esta carpeta como proyecto. Los mejores puntos de entrada son `README.md`, `src/pages/index.astro`, `src/data/games.ts` y `src/styles/global.css`.
