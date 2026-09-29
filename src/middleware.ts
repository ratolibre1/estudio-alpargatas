import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const path = context.url.pathname;
  const fromQuery = context.url.searchParams.get('locale') === 'en';
  context.locals.locale =
    fromQuery || path === '/en' || path === '/en/' || path.startsWith('/en/') ? 'en' : 'es';
  return next();
});
