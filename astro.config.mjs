import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';

/**
 * El adapter de Netlify solo se activa cuando el build corre en Netlify
 * (NETLIFY=true es automático en su entorno). Localmente no se carga
 * para evitar que intente levantar el servidor Deno de Edge Functions.
 */
const adapter = process.env.NETLIFY ? netlify() : undefined;

export default defineConfig({
  output: 'static',
  adapter,
  integrations: [react(), markdoc(), keystatic()],
  trailingSlash: 'always',
});
