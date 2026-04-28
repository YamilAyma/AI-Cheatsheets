const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const indexPath = path.join(distDir, 'sitemap-index.xml');
const sitemap0Path = path.join(distDir, 'sitemap-0.xml');
const targetPath = path.join(distDir, 'sitemap.xml');

async function flattenSitemap() {
  try {
    if (fs.existsSync(sitemap0Path)) {
      console.log('Flattening sitemap...');
      fs.copyFileSync(sitemap0Path, targetPath);
      
      if (fs.existsSync(indexPath)) fs.unlinkSync(indexPath);
      fs.unlinkSync(sitemap0Path);
      
      console.log('Successfully created flat sitemap.xml');
    } else if (fs.existsSync(indexPath)) {
        // If it only created an index for some reason, rename it if it contains urls? 
        // No, index usually points to files.
        console.log('Sitemap index found but sitemap-0.xml missing.');
    }
  } catch (err) {
    console.error('Error flattening sitemap:', err);
  }
}

flattenSitemap();
