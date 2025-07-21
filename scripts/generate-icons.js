import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Icon sizes to generate
const iconSizes = [
  { size: 192, name: 'favicon-192.png' },
  { size: 512, name: 'favicon-512.png' },
  { size: 192, name: 'favicon-maskable-192.png', maskable: true },
  { size: 512, name: 'favicon-maskable-512.png', maskable: true },
  { size: 180, name: 'apple-touch-icon.png' },
];

async function generateIcons() {
  try {
    // Read the SVG file
    const svgBuffer = await fs.readFile(path.join(publicDir, 'favicon.svg'));

    // Generate each icon size
    for (const { size, name, maskable } of iconSizes) {
      console.log(`Generating ${name}...`);

      let pipeline = sharp(svgBuffer, { density: 300 })
        .resize(size, size)
        .png();

      // Add padding for maskable icons (safe area)
      if (maskable) {
        const padding = Math.round(size * 0.1); // 10% padding
        const innerSize = size - padding * 2;

        pipeline = sharp(svgBuffer, { density: 300 })
          .resize(innerSize, innerSize)
          .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 250, g: 250, b: 250, alpha: 1 }, // Match background_color
          })
          .png();
      }

      await pipeline.toFile(path.join(publicDir, name));
    }

    console.log('✓ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
