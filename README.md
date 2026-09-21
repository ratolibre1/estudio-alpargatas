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

- `src/pages/`: portada, mapa, portafolio y fichas en `/juegos/<keyword>/`.
- `src/layouts/BaseLayout.astro`: estructura HTML común y metadatos.
- `src/components/`: encabezado y pie reutilizables.
- `src/content/games/`: CMS — única fuente de verdad. El **keyword** (una palabra) es el id del archivo y el slug (`/juegos/reloj/`, `/juegos/canes/`).
- `src/lib/games.ts`: helper que deriva el href del keyword.
- `src/data/archive.ts`: ideas del cuaderno (no son juegos del CMS).
- `src/styles/global.css`: diseño completo de la versión actual.
- `public/assets/`: logo y fotografías.

Para añadir un juego: crea `src/content/games/<keyword>.md` (o desde `/admin/`) y, si necesita ficha diseñada, `src/pages/juegos/<keyword>/index.astro`.

## GitHub y Netlify

El archivo `netlify.toml` ya incluye la configuración necesaria. Al importar el repositorio en Netlify, el comando de compilación es `npm run build` y la carpeta publicada es `dist`.

## Trabajarlo con Claude

Puedes subir el ZIP completo o, de preferencia, abrir esta carpeta como proyecto. Los mejores puntos de entrada son `README.md`, `src/pages/index.astro`, `src/content/games/` y `src/styles/global.css`.
