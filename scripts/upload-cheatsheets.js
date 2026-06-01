import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const CHEATSHEETS_DIR = 'src/content/cheatsheets';

// Helper to capitalize a string beautifully
function capitalizeString(str) {
  return str
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format the folder location for the commit scope
function formatFolderLocation(relPath) {
  const dirName = path.dirname(relPath);
  if (dirName === '.' || dirName === '') {
    return 'General';
  }
  return dirName
    .split(/[\\/]/)
    .map(seg => {
      // Capitalize each word inside the folder name
      return seg
        .split(/[_-]/)
        .map(word => {
          // Keep common acronyms capitalized
          const upper = word.toUpperCase();
          if (['CSS', 'API', 'DB', 'UI', 'ORM', 'JS', 'TS', 'E2E'].includes(upper)) {
            return upper;
          }
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    })
    .join('/');
}

// Extract title from frontmatter if available, otherwise capitalize filename
async function getCheatsheetTitle(filePath, fallbackName) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const match = content.match(/^title:\s*["']?(.*?)["']?$/m);
    if (match && match[1]) {
      return match[1].trim();
    }
  } catch (err) {
    // Ignore and fallback
  }
  return capitalizeString(fallbackName);
}

async function main() {
  console.log('📦 Buscando nuevas cheatsheets o modificaciones en git...');
  
  let statusOutput = '';
  try {
    statusOutput = execSync('git status --porcelain', { encoding: 'utf-8' });
  } catch (err) {
    console.error('❌ Error al ejecutar git status:', err.message);
    process.exit(1);
  }

  if (!statusOutput.trim()) {
    console.log('✨ No hay cambios pendientes en el repositorio.');
    return;
  }

  // Parse git status output line by line
  const lines = statusOutput.split('\n');
  const filesToCommit = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    
    // Status can be: ' M filepath', ' A filepath', '?? filepath', etc.
    const statusCode = line.substring(0, 2);
    let filePath = line.substring(3).trim();
    
    // Remove enclosing quotes from git path if any
    if (filePath.startsWith('"') && filePath.endsWith('"')) {
      filePath = filePath.slice(1, -1);
    }

    // Standardize path separators for Windows/Unix compatibility
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Only process files in src/content/cheatsheets/ that are .md or .mdx
    if (normalizedPath.startsWith(CHEATSHEETS_DIR) && (normalizedPath.endsWith('.md') || normalizedPath.endsWith('.mdx'))) {
      filesToCommit.push({
        relativeToRepo: normalizedPath,
        relativeToDir: normalizedPath.substring(CHEATSHEETS_DIR.length + 1),
        status: statusCode.trim()
      });
    }
  }

  if (filesToCommit.length === 0) {
    console.log('ℹ️ No se detectaron modificaciones ni nuevas cheatsheets en la carpeta de contenidos.');
    // Check if there are other files to commit
    commitRemainingFiles();
    return;
  }

  const newFiles = [];
  const modifiedFiles = [];

  for (const file of filesToCommit) {
    const fileNameWithoutExt = path.basename(file.relativeToDir).replace(/\.mdx?$/, '');
    
    // Skip general index or welcome files if they are not standard cheatsheets
    if (fileNameWithoutExt === 'welcome' && file.relativeToDir === 'welcome.mdx') {
      continue;
    }

    const isNew = file.status === '??' || file.status === 'A';
    if (isNew) {
      newFiles.push(file);
    } else {
      modifiedFiles.push(file);
    }
  }

  console.log(`\n🚀 Se encontraron ${newFiles.length} nueva(s) cheatsheet(s) y ${modifiedFiles.length} modificada(s).`);

  let commitCount = 0;

  // 1. Commit each NEW cheatsheet individually
  for (const file of newFiles) {
    const fileNameWithoutExt = path.basename(file.relativeToDir).replace(/\.mdx?$/, '');
    const folderScope = formatFolderLocation(file.relativeToDir);
    const cheatsheetTitle = await getCheatsheetTitle(file.relativeToRepo, fileNameWithoutExt);
    const commitMessage = `feat (Cheatsheet/${folderScope}): Agregar cheatsheet de ${cheatsheetTitle}`;

    console.log(`\nStaging: ${file.relativeToRepo}`);
    try {
      execSync(`git add "${file.relativeToRepo}"`);
      console.log(`Committing: "${commitMessage}"`);
      execSync(`git commit -m "${commitMessage}"`);
      commitCount++;
    } catch (err) {
      console.error(`❌ Error al procesar nueva cheatsheet ${file.relativeToRepo}:`, err.message);
    }
  }

  // 2. Commit all MODIFIED cheatsheets in a single combined commit
  if (modifiedFiles.length > 0) {
    console.log(`\n📦 Agrupando ${modifiedFiles.length} cheatsheet(s) modificadas en un solo commit...`);
    try {
      for (const file of modifiedFiles) {
        execSync(`git add "${file.relativeToRepo}"`);
      }
      const commitMessage = `docs (Cheatsheet): Actualizar enlaces y metadatos de cheatsheets existentes`;
      console.log(`Committing: "${commitMessage}"`);
      execSync(`git commit -m "${commitMessage}"`);
      commitCount++;
    } catch (err) {
      console.error(`❌ Error al procesar actualizaciones agrupadas:`, err.message);
    }
  }

  // Also commit any other residual config/scripts changed during the process
  commitRemainingFiles();

  // Push all commits
  console.log(`\n⬆️ Subiendo commits al repositorio remoto...`);
  try {
    execSync('git push');
    console.log('✅ ¡Repositorio subido con éxito!');
  } catch (err) {
    console.error('❌ Error al subir (git push):', err.message);
  }
}

function commitRemainingFiles() {
  try {
    const remainingStatus = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
    if (remainingStatus) {
      console.log('\n📦 Staging y commit de archivos de configuración restantes...');
      execSync('git add .');
      const msg = 'chore: actualizar utilidades, scripts de procesamiento y package.json';
      execSync(`git commit -m "${msg}"`);
      console.log(`✅ Commited: "${msg}"`);
    }
  } catch (err) {
    // Ignore if nothing to commit
  }
}

main();
