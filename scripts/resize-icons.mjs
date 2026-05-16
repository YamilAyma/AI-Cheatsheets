import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const ICONS_DIR = path.resolve('public/images/icons');
const ORIGINALS_DIR = path.join(ICONS_DIR, 'originals');
const TARGET_SIZE = 64; // We use 64x64 for Retina/High-DPI support, CSS will scale it to 1.25em

async function main() {
  try {
    // Check if originals directory exists
    try {
      await fs.access(ORIGINALS_DIR);
    } catch {
      console.log(`\n📁 Creating directory: ${ORIGINALS_DIR}`);
      console.log(`⚠️  Please place your raw .png icons in the 'originals' folder and run this script again.`);
      await fs.mkdir(ORIGINALS_DIR, { recursive: true });
      return;
    }

    const files = await fs.readdir(ORIGINALS_DIR);
    const pngFiles = files.filter(f => f.endsWith('.png'));

    if (pngFiles.length === 0) {
      console.log(`\n❌ No .png files found in ${ORIGINALS_DIR}`);
      return;
    }

    console.log(`\n✨ Found ${pngFiles.length} icons. Starting optimization...\n`);

    for (const file of pngFiles) {
      const inputPath = path.join(ORIGINALS_DIR, file);
      const outputPath = path.join(ICONS_DIR, file);

      await sharp(inputPath)
        .resize({
          width: TARGET_SIZE,
          height: TARGET_SIZE,
          fit: 'inside',
          kernel: sharp.kernel.lanczos3 // Best algorithm for downscaling sharp UI icons
        })
        .png({
          quality: 100,
          compressionLevel: 9, // Max compression without quality loss
          effort: 10
        })
        .toFile(outputPath);

      console.log(`✅ Optimized: ${file} -> ${TARGET_SIZE}x${TARGET_SIZE}`);
    }

    console.log(`\n🎉 All icons have been resized and saved to ${ICONS_DIR}`);
    console.log(`💡 Verify they look correct in the UI. If you are satisfied, you can run 'npm run icons:clean' to delete the originals.`);

  } catch (error) {
    console.error('\n❌ An error occurred:', error);
  }
}

main();
