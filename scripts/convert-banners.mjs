// Convert client PDFs/PNGs to web-friendly JPGs sized for Keizerfest concept grid.
// Usage: node scripts/convert-banners.mjs

import fs from 'node:fs';
import path from 'node:path';
import { pdf } from 'pdf-to-img';
import sharp from 'sharp';

const OUT_DIR = path.resolve('images');
fs.mkdirSync(OUT_DIR, { recursive: true });

const TARGETS = [
  {
    name: 'banner-back2scratch.jpg',
    src: 'C:/Users/gaeta/Downloads/[Library] B2S/timetable-340x175cm.png',
    type: 'png',
  },
  {
    name: 'banner-bdkmv.jpg',
    src: 'C:/Users/gaeta/Downloads/[Library] BDKMV/timetable-340x175cm.png',
    type: 'png',
  },
  {
    name: 'banner-wallhala.jpg',
    src: 'C:/Users/gaeta/Downloads/walhalla.pdf',
    type: 'pdf',
  },
  {
    name: 'banner-wide-open.jpg',
    src: 'C:/Users/gaeta/Downloads/[Library] Wide Open.pdf',
    type: 'pdf',
  },
];

async function getPdfPageBuffer(pdfPath, scale = 2) {
  const document = await pdf(pdfPath, { scale });
  for await (const page of document) {
    return page; // Buffer (PNG)
  }
  throw new Error('No pages in PDF');
}

async function process(target) {
  let buffer;
  if (target.type === 'png') {
    buffer = fs.readFileSync(target.src);
  } else {
    // Try descending scales until skia/memory succeeds
    let lastErr;
    for (const scale of [2, 1.5, 1, 0.75]) {
      try {
        buffer = await getPdfPageBuffer(target.src, scale);
        break;
      } catch (err) {
        lastErr = err;
      }
    }
    if (!buffer) throw lastErr;
  }
  const outPath = path.join(OUT_DIR, target.name);
  const meta = await sharp(buffer, { limitInputPixels: false }).metadata();
  await sharp(buffer, { limitInputPixels: false })
    .resize({ width: 1800, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outPath);
  const stats = fs.statSync(outPath);
  console.log(
    `${target.name}: ${meta.width}x${meta.height} → ${(stats.size / 1024).toFixed(1)} KB`
  );
}

for (const t of TARGETS) {
  try {
    await process(t);
  } catch (err) {
    console.error(`Failed ${t.name}:`, err.message);
  }
}
