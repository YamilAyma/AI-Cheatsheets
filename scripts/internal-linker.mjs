#!/usr/bin/env node

/**
 * internal-linker.mjs
 * 
 * Wikipedia-style internal linking system for AI Cheatsheets.
 * Scans MDX cheatsheets, builds a dictionary from frontmatter,
 * and proposes internal links between pages with native tooltips.
 * 
 * Usage:
 *   node scripts/internal-linker.mjs                          # Interactivo, todos los archivos
 *   node scripts/internal-linker.mjs --file php/php            # Un solo archivo
 *   node scripts/internal-linker.mjs --dry-run                 # Solo preview, no edita
 *   node scripts/internal-linker.mjs --auto                    # Aprueba todo sin preguntar
 *   node scripts/internal-linker.mjs --file php/php --dry-run  # Combinable
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'src', 'content', 'cheatsheets');
const DICT_PATH = path.join(PROJECT_ROOT, 'scripts', 'link-dictionary.json');

// ═══════════════════════════════════════════════════════
// Phase 1: Build Dictionary
// ═══════════════════════════════════════════════════════

function buildDictionary() {
    const entries = [];
    scanDirectory(CONTENT_DIR, entries);

    // Sort by longest match term first to prevent partial collisions
    // e.g. "spring-security" should be checked before "spring"
    entries.sort((a, b) => {
        const maxA = Math.max(...a.matchTerms.map(t => t.length));
        const maxB = Math.max(...b.matchTerms.map(t => t.length));
        return maxB - maxA;
    });

    fs.writeFileSync(DICT_PATH, JSON.stringify(entries, null, 2), 'utf-8');
    return entries;
}

function scanDirectory(dir, entries) {
    for (const item of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath, entries);
            continue;
        }

        if (!item.endsWith('.mdx') || item === 'welcome.mdx') continue;

        const content = fs.readFileSync(fullPath, 'utf-8');
        const fm = parseFrontmatter(content);
        if (!fm.title) continue;

        const entryId = path.relative(CONTENT_DIR, fullPath)
            .replace(/\\/g, '/')
            .replace(/\.mdx$/, '');

        entries.push({
            title: fm.title,
            description: fm.description || '',
            route: `/${entryId}`,
            matchTerms: generateMatchTerms(fm.title, fm.aliases),
        });
    }
}

/**
 * Minimal YAML frontmatter parser.
 * Handles: title, description, aliases (array).
 */
function parseFrontmatter(content) {
    const block = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!block) return {};

    const result = {};
    for (const line of block[1].split(/\r?\n/)) {
        const kv = line.match(/^(\w+):\s*(.+)/);
        if (!kv) continue;

        let [, key, value] = kv;
        value = value.replace(/^["']|["']$/g, '').replace(/\\"/g, '"').trim();

        if (key === 'aliases') {
            const arr = value.match(/\[([^\]]*)\]/);
            if (arr) {
                result.aliases = arr[1]
                    .split(',')
                    .map(s => s.trim().replace(/^["']|["']$/g, ''))
                    .filter(Boolean);
            }
        } else {
            result[key] = value;
        }
    }
    return result;
}

/**
 * From a title like "spring-security" generates:
 *   - "spring-security"
 *   - "spring security"
 *   - "Spring Security"
 * Plus any user-defined aliases from frontmatter.
 */
function generateMatchTerms(title, aliases = []) {
    const terms = new Set();

    terms.add(title);

    if (title.includes('-')) {
        const spaced = title.replace(/-/g, ' ');
        terms.add(spaced);
        terms.add(capitalize(spaced));
    }

    terms.add(capitalize(title));

    if (aliases) {
        for (const a of aliases) {
            if (a.trim()) terms.add(a.trim());
        }
    }

    return [...terms];
}

function capitalize(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
}

// ═══════════════════════════════════════════════════════
// Phase 2: Scan & Propose
// ═══════════════════════════════════════════════════════

function scanFile(filePath, dictionary) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);

    // Current page route — used to prevent self-linking
    const entryId = path.relative(CONTENT_DIR, filePath)
        .replace(/\\/g, '/')
        .replace(/\.mdx$/, '');
    const selfRoute = `/${entryId}`;

    const alreadyMatched = new Set();   // one link per dictionary entry
    const candidates = [];

    let inFrontmatter = false;
    let frontmatterFences = 0;
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const trimmed = raw.trim();

        // — Frontmatter zone —
        if (trimmed === '---') {
            frontmatterFences++;
            inFrontmatter = frontmatterFences < 2;
            if (frontmatterFences <= 2) continue;
        }
        if (inFrontmatter) continue;

        // — Code block zone —
        if (trimmed.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) continue;

        // — Headings (skip) —
        if (/^\s*#{1,6}\s/.test(raw)) continue;

        // — Import lines (skip) —
        if (trimmed.startsWith('import ')) continue;

        // — JSX component lines (skip) —
        if (/^\s*<\/?[A-Z]/.test(raw)) continue;

        // — Search for matches —
        for (const entry of dictionary) {
            if (alreadyMatched.has(entry.route)) continue;
            if (entry.route === selfRoute) continue;

            for (const term of entry.matchTerms) {
                const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`\\b(${escaped})\\b`, 'i');
                const match = regex.exec(raw);

                if (!match) continue;

                const col = match.index;

                // Context guards: skip if inside `inline code` or [existing link](...)
                if (isInsideInlineCode(raw, col)) continue;
                if (isInsideMarkdownLink(raw, col)) continue;
                if (isInsideBoldOrItalic(raw, col, match[0].length)) continue;

                candidates.push({
                    lineNum: i + 1,
                    lineText: raw,
                    matchedTerm: match[0],
                    matchCol: col,
                    entry,
                });

                alreadyMatched.add(entry.route);
                break;  // first matching term variant is enough
            }
        }
    }

    return candidates;
}

function isInsideInlineCode(line, index) {
    let inside = false;
    for (let i = 0; i < index; i++) {
        if (line[i] === '`') inside = !inside;
    }
    return inside;
}

function isInsideMarkdownLink(line, index) {
    // Check [text](url) and [text](url "title") patterns
    const linkRe = /\[[^\]]*\]\([^)]*\)/g;
    let m;
    while ((m = linkRe.exec(line)) !== null) {
        if (index >= m.index && index < m.index + m[0].length) return true;
    }
    return false;
}

function isInsideBoldOrItalic(line, index, termLen) {
    // Check if the matched text is wrapped in ** or * 
    // We allow linking inside bold/italic, but not if the entire
    // bold segment is just the term itself (e.g. **PHP**)
    // Actually, let's allow it — the user can decide per-candidate
    return false;
}

// ═══════════════════════════════════════════════════════
// Phase 3: Apply Selected Links
// ═══════════════════════════════════════════════════════

function applyLinks(filePath, candidates, selectedIndices) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);

    // Process in reverse line order so byte offsets don't shift
    const toApply = selectedIndices
        .map(i => candidates[i])
        .filter(Boolean)
        .sort((a, b) => {
            if (b.lineNum !== a.lineNum) return b.lineNum - a.lineNum;
            return b.matchCol - a.matchCol;
        });

    for (const c of toApply) {
        const idx = c.lineNum - 1;
        const line = lines[idx];

        const term = c.matchedTerm;
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b(${escaped})\\b`, 'i');

        const desc = (c.entry.description || '').replace(/"/g, "'");
        const link = desc
            ? `[${term}](${c.entry.route} "${desc}")`
            : `[${term}](${c.entry.route})`;

        lines[idx] = line.replace(regex, link);
    }

    // Preserve original line endings
    const eol = content.includes('\r\n') ? '\r\n' : '\n';
    fs.writeFileSync(filePath, lines.join(eol), 'utf-8');
}

// ═══════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════

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

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const autoApprove = args.includes('--auto');

    // Extract --file value
    const fileIdx = args.indexOf('--file');
    const fileArg = fileIdx !== -1 ? args[fileIdx + 1] : null;

    console.log('');
    console.log('  ╔═══════════════════════════════════════════════╗');
    console.log('  ║   🔗  AI Cheatsheets — Internal Linker       ║');
    console.log('  ╚═══════════════════════════════════════════════╝');
    console.log('');

    if (dryRun) console.log('  ⚙️  Modo: --dry-run (preview, sin cambios)\n');
    if (autoApprove) console.log('  ⚙️  Modo: --auto (aprobación automática)\n');

    // Phase 1
    console.log('  📖 Construyendo diccionario desde frontmatters...');
    const dictionary = buildDictionary();
    console.log(`  ✅ ${dictionary.length} entradas indexadas.\n`);

    // Resolve target files
    let files = [];
    if (fileArg) {
        const normalized = fileArg.replace(/\\/g, '/');
        const fullPath = path.join(CONTENT_DIR, normalized.endsWith('.mdx') ? normalized : normalized + '.mdx');
        if (!fs.existsSync(fullPath)) {
            console.error(`  ❌ Archivo no encontrado: ${fullPath}`);
            process.exit(1);
        }
        files = [fullPath];
    } else {
        files = getAllMdxFiles(CONTENT_DIR);
    }

    console.log(`  📂 Archivos a procesar: ${files.length}\n`);
    console.log('  ─────────────────────────────────────────────────');

    // Interactive readline
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q) => new Promise(resolve => rl.question(q, resolve));

    let totalLinked = 0;
    let totalCandidates = 0;
    let filesModified = 0;

    for (const filePath of files) {
        const rel = path.relative(CONTENT_DIR, filePath).replace(/\\/g, '/');
        const candidates = scanFile(filePath, dictionary);

        if (candidates.length === 0) continue;

        totalCandidates += candidates.length;

        console.log(`\n  📄 ${rel}`);
        console.log(`     ${candidates.length} candidato(s):\n`);

        for (let i = 0; i < candidates.length; i++) {
            const c = candidates[i];
            const preview = c.lineText.trim().substring(0, 70);
            console.log(`     [${i + 1}]  L${c.lineNum}  "${c.matchedTerm}"  →  ${c.entry.route}`);
            console.log(`          ${preview}${c.lineText.trim().length > 70 ? '...' : ''}`);
        }

        if (dryRun) {
            console.log(`\n     (--dry-run, sin cambios)\n`);
            console.log('  ─────────────────────────────────────────────────');
            continue;
        }

        let selected;
        if (autoApprove) {
            selected = candidates.map((_, i) => i);
            console.log(`\n     ✅ Auto-aprobados: ${selected.length} links`);
        } else {
            const answer = await ask(`\n     Números a aprobar (ej: 1,3,5) o ENTER para saltar: `);

            if (!answer.trim()) {
                console.log('     ⏭️  Saltado');
                console.log('  ─────────────────────────────────────────────────');
                continue;
            }

            selected = answer
                .split(/[,\s]+/)
                .map(s => parseInt(s.trim()) - 1)
                .filter(n => !isNaN(n) && n >= 0 && n < candidates.length);
        }

        if (selected.length > 0) {
            applyLinks(filePath, candidates, selected);
            totalLinked += selected.length;
            filesModified++;
            console.log(`     ✅ ${selected.length} link(s) aplicados.`);
        }

        console.log('  ─────────────────────────────────────────────────');
    }

    console.log('');
    console.log('  ╔═══════════════════════════════════════════════╗');
    console.log(`  ║  🏁 Finalizado                                ║`);
    console.log(`  ║  Links aplicados:  ${String(totalLinked).padEnd(4)} / ${totalCandidates} candidatos   ║`);
    console.log(`  ║  Archivos editados: ${String(filesModified).padEnd(25)} ║`);
    console.log('  ╚═══════════════════════════════════════════════╝');
    console.log('');

    rl.close();
}

main().catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
});
