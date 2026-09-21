import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    '/juegos/amateuratsu': '/juegos/amateurasu',
    '/juegos/el-gran-festival-de-canes': '/juegos/canes',
    '/juegos/mantas-a-raya': '/juegos/mantas',
  },
});
