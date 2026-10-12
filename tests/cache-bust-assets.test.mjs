import test from 'node:test';
import assert from 'node:assert/strict';
import { contentHash, rewriteAssetUrls } from '../src/integrations/cache-bust-assets.mjs';

const hashes = new Map([
  ['/assets/ninive-partida.webp', 'abc12345'],
  ['/assets/mantas-mesa-montaje.webp', 'deadbeef'],
]);

test('contentHash es estable y corto', () => {
  assert.equal(contentHash(Buffer.from('hola')), contentHash(Buffer.from('hola')));
  assert.equal(contentHash(Buffer.from('hola')).length, 8);
  assert.notEqual(contentHash(Buffer.from('hola')), contentHash(Buffer.from('chao')));
});

test('pega el hash y reemplaza el ?v= manual', () => {
  const html = [
    '<img src="/assets/ninive-partida.webp" alt="">',
    '<img src="/assets/mantas-mesa-montaje.webp?v=11" alt="">',
    '<a href="https://www.youtube.com/watch?v=iNGk06DjYow">',
    '<img src="https://cdn.example.com/assets/otro.webp">',
    '<img src="/assets/no-existe.webp">',
  ].join('\n');

  const { source, count, missing } = rewriteAssetUrls(html, hashes);

  assert.equal(count, 2);
  assert.ok(source.includes('src="/assets/ninive-partida.webp?v=abc12345"'));
  assert.ok(source.includes('src="/assets/mantas-mesa-montaje.webp?v=deadbeef"'));
  assert.ok(source.includes('watch?v=iNGk06DjYow'));
  assert.ok(source.includes('https://cdn.example.com/assets/otro.webp'));
  assert.ok(source.includes('src="/assets/no-existe.webp"'));
  assert.deepEqual([...missing], ['/assets/no-existe.webp']);
});

test('reescribir dos veces no mueve el hash', () => {
  const once = rewriteAssetUrls('<img src="/assets/ninive-partida.webp">', hashes);
  const twice = rewriteAssetUrls(once.source, hashes);
  assert.equal(twice.source, once.source);
  assert.equal(twice.count, 0);
});
