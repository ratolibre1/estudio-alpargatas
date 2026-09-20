/**
 * Ruta SSR explícita para el API de Keystatic.
 * Necesaria para que @astrojs/netlify la empaquete como Netlify Function.
 * Usa process.env directamente en vez de getSecret() de astro:env/server,
 * que tiene un bug conocido con Astro 6 + Netlify runtime.
 */
export const prerender = false;

import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

const handler = makeHandler({
  config: keystaticConfig,
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: process.env.KEYSTATIC_SECRET,
});

export const ALL = handler;
