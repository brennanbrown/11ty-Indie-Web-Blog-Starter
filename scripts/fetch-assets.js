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

  // Allow users to skip fetching in their own projects/CI
  if (process.env.SKIP_FETCH_ASSETS === '1' || process.env.SKIP_FETCH_ASSETS === 'true') {
    console.log('[assets] Skipping asset fetch (SKIP_FETCH_ASSETS set)');
    return;
  }

  // Optional project-level config from site.json under `assets`
  let siteConfigAssets = {};
  try {
    const siteJsonPath = path.join(root, 'src', '_data', 'site.json');
    const raw = await fs.promises.readFile(siteJsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.assets) {
      siteConfigAssets = parsed.assets;
    }
  } catch {}

  const defaults = {
    profileUrl: 'https://placehold.co/300x300.jpg?text=Profile',
    ogDefaultUrl: 'https://placehold.co/1200x630/png?text=OG%20Image',
    retroStarsUrl: 'https://www.transparenttextures.com/patterns/stardust.png',
  };

  const cfg = {
    profileUrl: process.env.PROFILE_IMAGE_URL || siteConfigAssets.profileUrl || defaults.profileUrl,
    ogDefaultUrl: process.env.OG_DEFAULT_URL || siteConfigAssets.ogDefaultUrl || defaults.ogDefaultUrl,
    retroStarsUrl: process.env.RETRO_STARS_URL || siteConfigAssets.retroStarsUrl || defaults.retroStarsUrl,
  };

  const targets = [
    cfg.profileUrl && { url: cfg.profileUrl, file: 'profile.jpg', desc: 'profile image placeholder' },
    cfg.ogDefaultUrl && { url: cfg.ogDefaultUrl, file: 'og-default.png', desc: 'default Open Graph image placeholder' },
    cfg.retroStarsUrl && { url: cfg.retroStarsUrl, file: 'retro-stars.png', desc: 'retro stars background tile' },
  ].filter(Boolean);

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
