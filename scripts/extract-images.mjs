// Extract base64 image attachments from a Claude Code session JSONL
// Usage: node scripts/extract-images.mjs <jsonl-path> <output-dir>

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const [, , jsonlPath, outDir] = process.argv;
if (!jsonlPath || !outDir) {
  console.error('Usage: node extract-images.mjs <jsonl-path> <output-dir>');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const rl = readline.createInterface({
  input: fs.createReadStream(jsonlPath),
  crlfDelay: Infinity,
});

let count = 0;

function walk(node, onImage) {
  if (!node) return;
  if (Array.isArray(node)) {
    for (const item of node) walk(item, onImage);
    return;
  }
  if (typeof node !== 'object') return;
  if (
    node.type === 'image' &&
    node.source &&
    node.source.type === 'base64' &&
    typeof node.source.data === 'string'
  ) {
    onImage(node.source);
  }
  for (const v of Object.values(node)) walk(v, onImage);
}

let lineNum = 0;
for await (const line of rl) {
  lineNum++;
  if (!line.trim()) continue;
  let obj;
  try {
    obj = JSON.parse(line);
  } catch {
    continue;
  }
  walk(obj, (src) => {
    count++;
    const ext = (src.media_type || 'image/jpeg').split('/')[1] || 'jpg';
    const filename = path.join(outDir, `image-${String(count).padStart(2, '0')}.${ext}`);
    fs.writeFileSync(filename, Buffer.from(src.data, 'base64'));
    const stats = fs.statSync(filename);
    console.log(`Wrote ${filename} (${(stats.size / 1024).toFixed(1)} KB) from line ${lineNum}`);
  });
}

console.log(`Total images extracted: ${count}`);
