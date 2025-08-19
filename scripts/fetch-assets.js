#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // follow redirects
          return resolve(download(res.headers.location, dest));
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(dest, () => {});
          return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function main() {
  const root = process.cwd();
  const assetsDir = path.join(root, 'src', 'assets');
  ensureDirSync(assetsDir);

  const targets = [
    {
      url: 'https://placehold.co/300x300.jpg?text=Profile',
      file: 'profile.jpg',
      desc: 'profile image placeholder'
    },
    {
      url: 'https://placehold.co/1200x630/png?text=OG%20Image',
      file: 'og-default.png',
      desc: 'default Open Graph image placeholder'
    },
    {
      url: 'https://www.transparenttextures.com/patterns/stardust.png',
      file: 'retro-stars.png',
      desc: 'retro stars background tile'
    }
  ];

  for (const t of targets) {
    const outPath = path.join(assetsDir, t.file);
    try {
      await fs.promises.access(outPath, fs.constants.F_OK);
      console.log('[assets] Exists, skipping', path.relative(root, outPath));
    } catch {
      try {
        await download(t.url, outPath);
        console.log('[assets] Downloaded', t.desc, '->', path.relative(root, outPath));
      } catch (e) {
        console.warn('[assets] Failed to download', t.url, e.message);
      }
    }
  }
}

main().catch((e) => {
  console.error('[assets] Error:', e);
  process.exit(0); // non-fatal
});
