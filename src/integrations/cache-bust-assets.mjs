import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Las fotos viven en public/assets/ con URL estable. Safari en el celular
 * se queda con la copia vieja si el path no cambia. En el build pegamos
 * ?v=<hash del archivo> para que reemplazar el archivo cambie la URL.
 */
const ASSET_RE = /(?<=["'(\s=])(\/assets\/[^"'()\s?#]+)(\?v=[^"'()\s#]*)?/g;

export function contentHash(buf) {
  return createHash('sha1').update(buf).digest('hex').slice(0, 8);
}

export function loadAssetHashes(publicDir) {
  const assetsDir = join(publicDir, 'assets');
  const hashes = new Map();
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) {
        const rel = relative(assetsDir, full).split(sep).join('/');
        hashes.set(`/assets/${rel}`, contentHash(readFileSync(full)));
      }
    }
  };
  walk(assetsDir);
  return hashes;
}

export function rewriteAssetUrls(source, hashes) {
  const missing = new Set();
  let count = 0;
  const next = source.replace(ASSET_RE, (match, path) => {
    const hash = hashes.get(path);
    if (!hash) {
      missing.add(path);
      return match;
    }
    const rewritten = `${path}?v=${hash}`;
    if (rewritten !== match) count += 1;
    return rewritten;
  });
  return { source: next, count, missing };
}

function walkOutput(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkOutput(full, out);
    else if (entry.isFile() && /\.(html|css)$/.test(entry.name)) out.push(full);
  }
  return out;
}

export function cacheBustAssets() {
  return {
    name: 'cache-bust-assets',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const publicDir = join(process.cwd(), 'public');
        let hashes;
        try {
          hashes = loadAssetHashes(publicDir);
        } catch (err) {
          logger.warn(`Sin public/assets, no se versionan imágenes (${err.message})`);
          return;
        }

        const outDir = fileURLToPath(dir);
        let files = 0;
        let urls = 0;
        const missing = new Set();

        for (const file of walkOutput(outDir)) {
          const before = readFileSync(file, 'utf8');
          const result = rewriteAssetUrls(before, hashes);
          for (const path of result.missing) missing.add(path);
          if (result.source === before) continue;
          writeFileSync(file, result.source);
          files += 1;
          urls += result.count;
        }

        logger.info(`Imágenes versionadas: ${urls} URLs en ${files} archivos`);
        if (missing.size > 0) {
          logger.warn(
            `Sin archivo en public/assets (${missing.size}): ${[...missing].sort().join(', ')}`,
          );
        }
      },
    },
  };
}
