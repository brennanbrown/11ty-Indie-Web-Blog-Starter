#!/usr/bin/env node
/*
  Generates PNG favicon fallbacks and Apple touch icon from the source SVG.
  Requires: sharp (install with: npm i -D sharp)
*/
const fs = require('fs');
const path = require('path');

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true });
}

async function main() {
  const sharp = require('sharp');
  const root = process.cwd();
  const srcSvg = path.join(root, 'src', 'assets', 'favicon.svg');
  const outDir = path.join(root, 'src', 'assets');

  try {
    await fs.promises.access(srcSvg, fs.constants.R_OK);
  } catch (e) {
    console.error('[icons] Source SVG not found:', srcSvg);
    process.exit(0); // non-fatal in CI
  }

  await ensureDir(outDir);
  const svgBuffer = await fs.promises.readFile(srcSvg);

  const tasks = [
    { file: 'favicon-16x16.png', size: 16 },
    { file: 'favicon-32x32.png', size: 32 },
    { file: 'apple-touch-icon.png', size: 180 },
  ];

  for (const t of tasks) {
    const outPath = path.join(outDir, t.file);
    await sharp(svgBuffer, { density: 384 }) // high density for crisp rasterization
      .resize(t.size, t.size)
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(outPath);
    console.log('[icons] Wrote', path.relative(root, outPath));
  }
}

main().catch((err) => {
  console.error('[icons] Error:', err);
  process.exit(1);
});
