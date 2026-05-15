#!/usr/bin/env node

/**
 * refine-metadata.mjs
 * 
 * Refines cheatsheet metadata by extracting the first paragraph 
 * from the body and using it as the frontmatter description.
 * 
 * Rules:
 * 1. Takes the first paragraph (first block of text after frontmatter/headings).
 * 2. Converts to plain text (removes Markdown formatting).
 * 3. Truncates at the first period (.).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'src', 'content', 'cheatsheets');

function getAllMdxFiles(dir) {
    const files = [];
    for (const item of fs.readdirSync(dir)) {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            files.push(...getAllMdxFiles(full));
        } else if (item.endsWith('.mdx') && item !== 'welcome.mdx') {
            files.push(full);
        }
    }
    return files;
}

/**
 * Removes Markdown bold, italic, links, and inline code.
 */
function cleanMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1')  // Bold
        .replace(/\*(.*?)\*/g, '$1')      // Italic
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links [text](url)
        .replace(/`(.*?)`/g, '$1')          // Inline code
        .trim();
}

function refineFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    
    let frontmatterEndIndex = -1;
    let fencesFound = 0;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '---') {
            fencesFound++;
            if (fencesFound === 2) {
                frontmatterEndIndex = i;
                break;
            }
        }
    }

    if (frontmatterEndIndex === -1) return;

    const bodyLines = lines.slice(frontmatterEndIndex + 1);
    let firstParagraph = "";

    for (let line of bodyLines) {
        const trimmed = line.trim();
        // Skip empty lines, headings, imports, and separators
        if (!trimmed) continue;
        if (trimmed.startsWith('#')) continue;
        if (trimmed.startsWith('import ')) continue;
        if (trimmed === '---') continue;
        if (trimmed.startsWith('<')) continue; // Skip JSX/HTML
        
        // This looks like our first paragraph
        firstParagraph = trimmed;
        break;
    }

    if (!firstParagraph) return;

    // Clean and Truncate
    let refinedDescription = cleanMarkdown(firstParagraph);
    
    // Look for a period followed by a space or end of string
    // This avoids truncating at .js, .ts, etc.
    const periodMatch = refinedDescription.match(/\.(?:\s|$)/);
    if (periodMatch) {
        refinedDescription = refinedDescription.substring(0, periodMatch.index + 1);
    }

    // Update frontmatter
    const frontmatterLines = lines.slice(0, frontmatterEndIndex + 1);
    let descriptionUpdated = false;

    for (let i = 0; i < frontmatterLines.length; i++) {
        if (frontmatterLines[i].startsWith('description:')) {
            frontmatterLines[i] = `description: "${refinedDescription.replace(/"/g, '\\"')}"`;
            descriptionUpdated = true;
            break;
        }
    }

    // If description didn't exist, we could add it before the last fence, 
    // but the user said all cheatsheets have it (vaguely).
    // Let's ensure it's there.
    if (!descriptionUpdated) {
        frontmatterLines.splice(frontmatterEndIndex, 0, `description: "${refinedDescription.replace(/"/g, '\\"')}"`);
    }

    const newContent = [...frontmatterLines, ...bodyLines].join(content.includes('\r\n') ? '\r\n' : '\n');
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return refinedDescription;
}

function main() {
    console.log('\n  ✨ Refinando metadatos (descripciones) de Cheatsheets...\n');
    
    const files = getAllMdxFiles(CONTENT_DIR);
    let count = 0;

    for (const file of files) {
        const relPath = path.relative(CONTENT_DIR, file);
        const newDesc = refineFile(file);
        if (newDesc) {
            console.log(`  ✅ [${relPath}] -> "${newDesc.substring(0, 50)}${newDesc.length > 50 ? '...' : ''}"`);
            count++;
        }
    }

    console.log(`\n  🏁 Proceso finalizado. ${count} archivos actualizados.\n`);
}

main();
