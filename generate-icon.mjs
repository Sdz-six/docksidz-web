import fs from 'fs';
import sharp from 'sharp';
import path from 'path';

// The SVG path for lucide 'file-code-2'
const svgPath = `<path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m5 12-3 3 3 3" /><path d="m9 18 3-3-3-3" />`;

async function generateIcon(size) {
  // Scale the SVG elements based on size (Lucide icons are usually 24x24)
  const padding = size * 0.25; // 25% padding
  const innerSize = size - (padding * 2);
  
  const svgBuffer = Buffer.from(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#111844" rx="${size * 0.2}" />
      <g transform="translate(${padding}, ${padding}) scale(${innerSize / 24})">
        <g fill="none" stroke="#F8FAFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${svgPath}
        </g>
      </g>
    </svg>
  `);

  const dir = path.join(process.cwd(), 'public', 'icons');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await sharp(svgBuffer)
    .png()
    .toFile(path.join(dir, `icon-${size}x${size}.png`));
    
  console.log(`Generated icon-${size}x${size}.png`);
}

async function main() {
  try {
    await generateIcon(192);
    await generateIcon(512);
  } catch (err) {
    console.error("Error generating icons:", err);
  }
}

main();
