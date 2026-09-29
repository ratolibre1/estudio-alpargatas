import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  redirects: {
    '/juegos/amateuratsu': '/juegos/amateurasu',
    '/juegos/el-gran-festival-de-canes': '/juegos/canes',
    '/juegos/mantas-a-raya': '/juegos/mantas',
    '/en/juegos/amateuratsu': '/en/juegos/amateurasu',
    '/en/juegos/el-gran-festival-de-canes': '/en/juegos/canes',
    '/en/juegos/mantas-a-raya': '/en/juegos/mantas',
  },
});
