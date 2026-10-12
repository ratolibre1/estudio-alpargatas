import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { build } from 'esbuild';
import yaml from 'js-yaml';

async function load(entryPoint) {
  const result = await build({ entryPoints: [entryPoint], bundle: true, write: false, format: 'esm', platform: 'node' });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
}
const { TAROT_CARDS, shuffleTarot, selectTarotCard, recommendTarotGame, tarotImage } = await load('src/lib/tarot.ts');
const { localizePath } = await load('src/i18n/locale.ts');
const games = readdirSync('src/content/games').map((file) => yaml.load(readFileSync('src/content/games/' + file, 'utf8').split('---')[1]));
const eligible = games.filter((game) => game.state !== 'publicado').map((game) => game.keyword);

test('22 arcanos completos, imágenes locales y afinidades a prototipos reales', () => {
  assert.deepEqual(TAROT_CARDS.map((card) => card.id), Array.from({ length: 22 }, (_, i) => i));
  for (const card of TAROT_CARDS) {
    assert(existsSync('public' + tarotImage(card.id)), card.name.es);
    for (const locale of ['es', 'en']) {
      assert(card.name[locale]);
      assert(card.prediction[locale].length > 30);
    }
    assert.equal(card.games.length, 3);
    assert.equal(new Set(card.games).size, 3);
    assert(card.games.every((slug) => eligible.includes(slug)), card.name.es);
  }
});

test('la mezcla cambia el orden sin perder ni repetir cartas', () => {
  const original = TAROT_CARDS.map((card) => card.id);
  const shuffled = shuffleTarot(() => 0).map((card) => card.id);
  assert.notDeepEqual(shuffled, original);
  assert.deepEqual([...shuffled].sort((a, b) => a - b), original);
  assert.deepEqual(TAROT_CARDS.map((card) => card.id), original);
});

test('una tirada admite solo tres cartas distintas incluso ante clics repetidos', () => {
  let selected = selectTarotCard([], TAROT_CARDS[0]);
  selected = selectTarotCard(selected, TAROT_CARDS[0]);
  assert.equal(selected.length, 1);
  assert.equal(recommendTarotGame(selected, eligible), undefined);
  selected = selectTarotCard(selected, TAROT_CARDS[1]);
  selected = selectTarotCard(selected, TAROT_CARDS[2]);
  selected = selectTarotCard(selected, TAROT_CARDS[3]);
  assert.deepEqual(selected.map((card) => card.id), [0, 1, 2]);
});

test('la recomendación combina las tres cartas y respeta el desempate de la última', () => {
  const cards = [
    { games: ['chispas', 'tartan', 'hubris'] },
    { games: ['chispas', 'tartan', 'hubris'] },
    { games: ['hubris', 'tartan', 'chispas'] },
  ];
  assert.equal(recommendTarotGame(cards, eligible), 'chispas');
  assert.equal(recommendTarotGame([{ games: ['chispas'] }, { games: ['tartan'] }, { games: ['hubris'] }], eligible), 'hubris');
  assert.equal(recommendTarotGame(cards, ['piramisu']), 'piramisu');
  assert.equal(recommendTarotGame(cards, []), undefined);
});

test('todas las 1540 combinaciones llevan a un prototipo y a rutas ES/EN válidas', () => {
  let count = 0;
  for (let a = 0; a < 20; a++) for (let b = a + 1; b < 21; b++) for (let c = b + 1; c < 22; c++) {
    const keyword = recommendTarotGame([TAROT_CARDS[a], TAROT_CARDS[b], TAROT_CARDS[c]], eligible);
    assert(eligible.includes(keyword));
    assert.notEqual(keyword, 'ninive');
    assert.equal(localizePath(`/juegos/${keyword}/`, 'es'), `/juegos/${keyword}`);
    assert.equal(localizePath(`/juegos/${keyword}/`, 'en'), `/en/juegos/${keyword}`);
    count++;
  }
  assert.equal(count, 1540);
});
