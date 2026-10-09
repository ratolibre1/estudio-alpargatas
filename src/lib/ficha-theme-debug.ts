import { fichaColorVars, contrastRatio, type FichaMode } from './ficha-colors';

const STORAGE_KEY = 'alpargatas:ficha-mode-decisions:v1';
type Decisions = Record<string, FichaMode>;
const validMode = (value: unknown): value is FichaMode => value === 'light' || value === 'dark';

/** Solo afecta la vista local de debug; nunca guarda cambios en el CMS. */
export function initFichaThemeDebug(): void {
  const panel = document.querySelector<HTMLElement>('[data-ficha-debug]');
  if (!panel || panel.dataset.initialized) return;
  const url = new URL(window.location.href);
  if (url.searchParams.get('debug') !== 'paleta' && panel.dataset.preview !== 'true') return;
  panel.dataset.initialized = 'true';
  const keyword = panel.dataset.keyword!;
  const defaultMode: FichaMode = panel.dataset.defaultMode === 'dark' ? 'dark' : 'light';
  const defaults = JSON.parse(panel.dataset.modeDefaults!) as { keyword: string; mode: FichaMode }[];
  const allowed = new Set(defaults.map((item) => item.keyword));
  const readDecisions = (): Decisions => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
      if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
      return Object.fromEntries(Object.entries(stored).filter(([key, value]) => allowed.has(key) && validMode(value))) as Decisions;
    } catch { return {}; }
  };
  let decisions = readDecisions();
  const english = panel.dataset.language === 'en';
  const toggle = panel.querySelector<HTMLButtonElement>('[data-debug-toggle]')!;
  const label = panel.querySelector<HTMLElement>('[data-debug-mode]')!;
  const status = panel.querySelector<HTMLElement>('[data-debug-status]')!;
  const palette = ['base', 'primary', 'apoyo', 'tinta'].map((slot) =>
    document.body.style.getPropertyValue('--ficha-c-' + slot).trim());
  const persist = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions)); } catch { /* La vista sigue funcionando sin almacenamiento. */ } };
  let mode = defaultMode;
  const apply = (selected: FichaMode) => {
    mode = selected;
    document.body.dataset.band = mode;
    const vars = fichaColorVars(palette, mode);
    document.body.dataset.onPrimary = contrastRatio(vars['ficha-accent'], palette[3]) >= contrastRatio(vars['ficha-accent'], palette[0]) ? 'tinta' : 'base';
    for (const [key, value] of Object.entries(vars)) {
      document.body.style.setProperty('--' + key, value);
    }
    label.textContent = english ? `Debug · ${mode === 'dark' ? 'Dark' : 'Light'}` : `Debug · ${mode === 'dark' ? 'Oscuro' : 'Claro'}`;
    toggle.textContent = english ? `View ${mode === 'dark' ? 'light' : 'dark'}` : `Ver ${mode === 'dark' ? 'claro' : 'oscuro'}`;
    toggle.setAttribute('aria-pressed', String(mode === 'dark'));
    const current = new URL(window.location.href);
    current.searchParams.set('debug', 'paleta');
    current.searchParams.set('modo', mode);
    history.replaceState(history.state, '', current);
  };
  const requested = url.searchParams.get('modo');
  if (validMode(requested)) { decisions[keyword] = requested; persist(); }
  apply(validMode(requested) ? requested : decisions[keyword] ?? defaultMode);
  panel.hidden = false;
  toggle.addEventListener('click', () => {
    decisions = readDecisions();
    decisions[keyword] = mode === 'dark' ? 'light' : 'dark';
    persist(); apply(decisions[keyword]); status.textContent = '';
  });
  panel.querySelector('[data-debug-reset]')!.addEventListener('click', () => {
    decisions = readDecisions(); delete decisions[keyword]; persist(); apply(defaultMode);
    const current = new URL(window.location.href);
    current.searchParams.delete('modo');
    history.replaceState(history.state, '', current);
    status.textContent = english ? 'Default restored.' : 'Modo predeterminado restablecido.';
  });
  panel.querySelector('[data-debug-copy]')!.addEventListener('click', async () => {
    decisions = { ...readDecisions(), [keyword]: mode };
    const text = '# fichaMode: decisiones locales de debug\n' + defaults.map((item) =>
      `${item.keyword}: ${decisions[item.keyword] ?? item.mode}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = english ? 'Decisions copied (19 games).' : 'Decisiones copiadas (19 juegos).';
    } catch {
      const output = panel.querySelector<HTMLTextAreaElement>('[data-debug-export]')!;
      output.value = text; output.hidden = false; output.focus(); output.select();
      status.textContent = english ? 'Copy the selected text.' : 'Copia el texto seleccionado.';
    }
  });
}
