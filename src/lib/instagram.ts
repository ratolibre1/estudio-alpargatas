/** Abre chat directo en Instagram (móvil / app). */
export const IG_DM_ESTUDIO = 'https://ig.me/m/estudioalpargatas/';

const PROFILE_SEGMENTS = new Set(['p', 'reel', 'tv', 'stories', 'explore', 'accounts']);

/** Convierte perfil instagram.com/… al enlace ig.me/m/ cuando aplica. */
export function instagramDmHref(url: string): string {
  if (/^https:\/\/(www\.)?ig\.me\/m\//i.test(url)) {
    return url;
  }
  try {
    const u = new URL(url);
    if (!u.hostname.replace(/^www\./, '').includes('instagram.com')) {
      return url;
    }
    const handle = u.pathname.replace(/^\//, '').split('/')[0]?.replace(/^@/, '');
    if (handle && !PROFILE_SEGMENTS.has(handle)) {
      return `https://ig.me/m/${handle}/`;
    }
  } catch {
    /* URL inválida: devolver tal cual */
  }
  return url;
}
