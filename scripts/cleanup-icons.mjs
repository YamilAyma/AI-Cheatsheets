import fs from 'fs/promises';
import path from 'path';

const ORIGINALS_DIR = path.resolve('public/images/icons/originals');

async function main() {
  try {
    try {
      await fs.access(ORIGINALS_DIR);
    } catch {
      console.log(`\nℹ️  Originals directory not found at ${ORIGINALS_DIR}. Nothing to clean.`);
      return;
    }

    await fs.rm(ORIGINALS_DIR, { recursive: true, force: true });
    console.log(`\n🗑️  Successfully deleted the original heavy icons from ${ORIGINALS_DIR}`);
    console.log(`✨ Your repository is now clean and optimized!`);
    
  } catch (error) {
    console.error('\n❌ An error occurred while trying to clean up:', error);
  }
}

main();
