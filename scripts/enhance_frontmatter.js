import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, '../src/content/cheatsheets');

function getIconByFilename(filename) {
    const f = filename.toLowerCase();
    if (f.includes('react')) return '⚛️';
    if (f.includes('vue')) return '🖖';
    if (f.includes('angular')) return '🅰️';
    if (f.includes('node')) return '🟢';
    if (f.includes('js') || f.includes('javascript')) return '🟨';
    if (f.includes('ts') || f.includes('typescript')) return '🔷';
    if (f.includes('python')) return '🐍';
    if (f.includes('java')) return '☕';
    if (f.includes('php')) return '🐘';
    if (f.includes('docker')) return '🐋';
    if (f.includes('git')) return '📜';
    if (f.includes('sql') || f.includes('db')) return '🗄️';
    if (f.includes('aws') || f.includes('cloud')) return '☁️';
    if (f.includes('css')) return '🎨';
    if (f.includes('html')) return '🌐';
    return '📄';
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.mdx')) {
            let content = fs.readFileSync(filePath, 'utf8');
            const stats = fs.statSync(filePath);
            
            let frontmatter = {};
            let body = content;

            const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
            if (fmMatch) {
                const yaml = fmMatch[1];
                yaml.split('\n').forEach(line => {
                    const parts = line.split(':');
                    if (parts.length >= 2) {
                        frontmatter[parts[0].trim()] = parts.slice(1).join(':').trim();
                    }
                });
                body = content.slice(fmMatch[0].length);
            }

            // Defaults
            const title = frontmatter.title || path.basename(file, '.mdx');
            const description = frontmatter.description || `Guía rápida y trucos sobre ${title}.`;
            const createdAt = frontmatter.createdAt || stats.birthtime.toISOString().split('T')[0];
            const updatedAt = frontmatter.updatedAt || stats.mtime.toISOString().split('T')[0];
            const tags = frontmatter.tags || `[${path.basename(dir)}]`;
            const icon = frontmatter.icon || getIconByFilename(file);

            const newFm = [
                '---',
                `title: "${title.replace(/"/g, '\\"')}"`,
                `description: "${description.replace(/"/g, '\\"')}"`,
                `createdAt: ${createdAt}`,
                `updatedAt: ${updatedAt}`,
                `tags: ${tags}`,
                `icon: "${icon}"`,
                '---',
                ''
            ].join('\n');

            fs.writeFileSync(filePath, newFm + body);
            console.log(`Enhanced: ${file}`);
        }
    });
}

console.log('Enhancing frontmatter for all .mdx files...');
walkDir(contentDir);
console.log('Finished enhancing frontmatter.');
