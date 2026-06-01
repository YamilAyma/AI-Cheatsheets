import fs from 'fs/promises';
import path from 'path';

const CHEATSHEETS_DIR = path.resolve('src/content/cheatsheets');

// Extract metadata from frontmatter without external dependencies
function parseFrontmatter(content) {
  const metadata = {};
  
  // Find standard frontmatter block at the start of the file
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return metadata;
  
  const yamlLines = match[1].split('\n');
  for (const line of yamlLines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    
    // Remove enclosing quotes if any
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    metadata[key] = value;
  }
  
  return metadata;
}

async function buildTree(dirPath, relativeDir = '') {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const children = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      const dirTree = await buildTree(fullPath, relPath);
      if (dirTree && dirTree.children.length > 0) {
        children.push({
          type: 'directory',
          name: entry.name,
          children: dirTree.children
        });
      }
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      try {
        const content = await fs.readFile(fullPath, 'utf-8');
        const meta = parseFrontmatter(content);
        
        children.push({
          type: 'file',
          name: entry.name,
          title: meta.title || entry.name.replace(/\.mdx?$/, ''),
          icon: meta.icon || '📄',
          description: meta.description || ''
        });
      } catch (err) {
        // Fallback if read fails
        children.push({
          type: 'file',
          name: entry.name,
          title: entry.name.replace(/\.mdx?$/, ''),
          icon: '📄',
          description: ''
        });
      }
    }
  }

  // Sort: directories first (alphabetical), then files (alphabetical)
  children.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return { children };
}

function renderTree(node, prefix = '', outputLines = []) {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const isLast = i === node.children.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const childPrefix = prefix + (isLast ? '    ' : '│   ');

    if (child.type === 'directory') {
      outputLines.push(`${prefix}${connector}📁 [${child.name}]`);
      renderTree(child, childPrefix, outputLines);
    } else {
      const desc = child.description ? ` - ${child.description.substring(0, 60)}${child.description.length > 60 ? '...' : ''}` : '';
      outputLines.push(`${prefix}${connector}${child.icon} ${child.title} (${child.name})${desc}`);
    }
  }
  return outputLines;
}

async function main() {
  try {
    await fs.access(CHEATSHEETS_DIR);
  } catch {
    console.error(`\n❌ Error: Cheatsheets directory not found at ${CHEATSHEETS_DIR}`);
    process.exit(1);
  }

  console.log('🔍 Analizando cheatsheets y construyendo árbol de temas...\n');
  const tree = await buildTree(CHEATSHEETS_DIR);
  
  const outputLines = [
    '🎯 AI Cheatsheets - Árbol de Temas',
    '=================================',
    ''
  ];
  
  renderTree(tree, '', outputLines);
  
  const finalOutput = outputLines.join('\n');
  console.log(finalOutput);
  
  // Also save the output to a text file for future reference
  const outputPath = path.resolve('docs/cheatsheets-tree.txt');
  try {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, finalOutput, 'utf-8');
    console.log(`\n💾 Árbol guardado con éxito en: docs/cheatsheets-tree.txt`);
  } catch (err) {
    console.error(`\n⚠️ No se pudo guardar el árbol en archivo: ${err.message}`);
  }
}

main();
