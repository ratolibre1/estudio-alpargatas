import { defineConfig, envField } from 'astro/config';
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

  /**
   * Declara los secrets de Keystatic en el schema de astro:env/server
   * para que getSecret() funcione en la ruta inyectada por @keystatic/astro.
   * Son optional porque en modo local el SECRET es suficiente para el CMS.
   */
  env: {
    schema: {
      KEYSTATIC_GITHUB_CLIENT_ID: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      KEYSTATIC_GITHUB_CLIENT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      KEYSTATIC_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
});
