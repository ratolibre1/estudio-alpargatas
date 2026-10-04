/** Mismos colores que `stateBadge` en /portafolio/ */
export const STATE_BADGE: Record<string, { bg: string; color: string }> = {
  publicado: { bg: '#7c3aed', color: '#fff' },
  produccion: { bg: '#2563eb', color: '#fff' },
  disponible: { bg: '#16a34a', color: '#fff' },
  pruebas: { bg: '#eab308', color: '#1a1205' },
  boceto: { bg: '#f97316', color: '#fff' },
  idea: { bg: '#dc2626', color: '#fff' },
};

export function stateBadgeStyle(state: string): string {
  const badge = STATE_BADGE[state] ?? STATE_BADGE.boceto;
  return `background:${badge.bg};color:${badge.color};`;
}
