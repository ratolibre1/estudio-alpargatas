import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { build } from 'esbuild';
import yaml from 'js-yaml';

async function load(entryPoint) {
  const result = await build({ entryPoints: [entryPoint], bundle: true, write: false, format: 'esm', platform: 'node' });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
}
const { fichaColorVars, contrastRatio, mixColors } = await load('src/lib/ficha-colors.ts');
const { fichaBandMode, fichaThemeVars } = await load('src/lib/ficha-theme.ts');
const games = readdirSync('src/content/games').map((file) => yaml.load(readFileSync('src/content/games/' + file, 'utf8').split('---')[1]));

/** Estándar aprobado oct 2026 — ver docs/PALETAS_FICHA.md */
const APPROVED_FICHA_MODE = {
  almagesto: 'dark',
  amateurasu: 'light',
  canes: 'light',
  carcinogenial: 'light',
  chauvet: 'dark',
  chispas: 'light',
  ermitanos: 'light',
  evoluciona: 'dark',
  gato: 'light',
  hubris: 'dark',
  letrados: 'light',
  mantas: 'light',
  ninive: 'light',
  nudis: 'light',
  palomas: 'dark',
  pavoneo: 'dark',
  piramisu: 'dark',
  reloj: 'dark',
  tartan: 'dark',
};

test('los 19 juegos tienen cuatro colores y fichaMode explícito aprobado', () => {
  assert.equal(games.length, 19);
  for (const game of games) {
    assert.equal(game.palette.length, 4);
    assert(game.palette.every((c) => /^#[\da-f]{6}$/i.test(c)));
    assert(['light', 'dark'].includes(game.fichaMode), game.keyword);
    assert.equal(APPROVED_FICHA_MODE[game.keyword], game.fichaMode, game.keyword);
    assert.equal(fichaBandMode(game), game.fichaMode);
    assert.equal(fichaBandMode({ ...game, fichaMode: 'dark' }), 'dark');
    assert.equal(fichaBandMode({ ...game, fichaMode: 'light' }), 'light');
  }
});

test('lectura, botones y navegación conservan contraste en ambos modos', () => {
  for (const game of games) for (const mode of ['light', 'dark']) {
    const vars = fichaColorVars(game.palette, mode);
    const get = (key) => vars['ficha-' + key];
    const pairs = [['page-bg', 'on-light-ink'], ['page-bg', 'on-light-tag'],
      ['band-bg', 'on-band-muted'], ['award-bg', 'award-title'], ['award-bg', 'award-link'],
      ['header-bg', 'header-text'], ['header-bg', 'header-muted'], ['header-bg', 'nav-hover'],
      ['accent', 'on-accent'], ['card', 'card-muted']];
    for (const [bg, text] of pairs) {
      assert(contrastRatio(get(bg), get(text)) >= 4.5, `${game.keyword} ${mode}: ${text}`);
    }
    assert.notEqual(get('header-bg'), get('page-bg'));
    assert.equal(get('accent'), game.palette[mode === 'dark' ? 2 : 1]);
    const heroStart = mixColors(get('bg'), get('page-bg'), .28);
    assert(contrastRatio(heroStart, get('on-light-tag')) >= 4.5);
    assert(contrastRatio(heroStart, get('on-light-title')) >= 3);
    const theme = fichaThemeVars({ ...game, fichaMode: mode });
    assert.deepEqual(Object.keys(theme).filter((key) => key.startsWith('ficha-c-')).sort(),
      ['ficha-c-apoyo', 'ficha-c-base', 'ficha-c-primary', 'ficha-c-tinta']);
    assert.deepEqual(['base', 'primary', 'apoyo', 'tinta'].map((slot) => theme['ficha-c-' + slot]), game.palette);
    assert.equal(theme['ficha-page-bg'], get('page-bg'));
  }
});

test('cambiar legacy bg o overrides no cambia el tema de la ficha', () => {
  for (const game of games) {
    assert.deepEqual(fichaThemeVars(game), fichaThemeVars({ ...game,
      bg: '#abc123', titleColor: '#abc123', bodyColor: '#abc123', headerBg: '#abc123', footerBg: '#abc123',
    }));
  }
});
