import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, '../src/content/cheatsheets');

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.md')) {
            const newPath = filePath.slice(0, -3) + '.mdx';
            fs.renameSync(filePath, newPath);
            console.log(`Renamed: ${file} -> ${path.basename(newPath)}`);
        }
    });
}

console.log('Renaming .md files to .mdx...');
walkDir(contentDir);
console.log('Finished renaming files.');
