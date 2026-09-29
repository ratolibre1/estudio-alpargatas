export type Lang = 'es' | 'en';

export const LOCALES: Lang[] = ['es', 'en'];
export const DEFAULT_LOCALE: Lang = 'es';

function pathIsEn(path: string): boolean {
  return path === '/en' || path === '/en/' || path.startsWith('/en/');
}

function urlIsEn(url: URL): boolean {
  return pathIsEn(url.pathname) || url.searchParams.get('locale') === 'en';
}

export function getLocale(astro: { locals: App.Locals; request: Request; url: URL }): Lang {
  if (astro.locals?.locale === 'en') return 'en';
  try {
    if (urlIsEn(astro.url) || urlIsEn(new URL(astro.request.url))) return 'en';
  } catch {
    /* ignore */
  }
  return astro.locals?.locale === 'es' ? 'es' : 'es';
}

/** Prefija /en en rutas internas. Deja intactos http(s), #, mailto y /admin. */
export function localizePath(path: string, locale: Lang): string {
  if (!path || path.startsWith('http') || path.startsWith('#') || path.startsWith('mailto:')) {
    return path;
  }
  if (path.startsWith('/admin')) return path;
  if (locale === 'es') {
    if (path === '/en' || path === '/en/') return '/';
    return path.startsWith('/en/') ? path.slice(3) : path;
  }
  if (path === '/en' || path === '/en/' || path.startsWith('/en/')) return path;
  return path === '/' ? '/en/' : `/en${path.startsWith('/') ? path : `/${path}`}`;
}

export function switchLocalePath(pathname: string, next: Lang): string {
  const bare = pathname === '/en' || pathname === '/en/'
    ? '/'
    : pathname.startsWith('/en/')
      ? pathname.slice(3)
      : pathname;
  return localizePath(bare || '/', next);
}
