import { execSync } from 'child_process';

async function main() {
  console.log('\n======================================================');
  console.log('🏁 INICIANDO PIPELINE DE PROCESAMIENTO DE CHEATSHEETS');
  console.log('======================================================\n');

  try {
    // Step 1: Enhance Frontmatter
    console.log('🔄 [Paso 1/4] Enriqueciendo Frontmatter (títulos, iconos, fechas y etiquetas)...');
    execSync('node scripts/enhance_frontmatter.js', { stdio: 'inherit' });
    console.log('✅ Frontmatter enriquecido.\n');

    // Step 2: Refine Metadata (Descriptions)
    console.log('🔄 [Paso 2/4] Refinando descripciones a partir del primer párrafo...');
    execSync('node scripts/refine-metadata.mjs', { stdio: 'inherit' });
    console.log('✅ Descripciones refinadas.\n');

    // Step 3: Fix MDX Syntax Safety
    console.log('🔄 [Paso 3/4] Saneando sintaxis y caracteres especiales de MDX...');
    execSync('node scripts/fix_mdx_syntax.cjs', { stdio: 'inherit' });
    console.log('✅ Sintaxis MDX corregida y segura.\n');

    // Step 4: Auto Internal Linking
    console.log('🔄 [Paso 4/4] Ejecutando enlazado interno Wikipedia-style de forma automática...');
    execSync('node scripts/internal-linker.mjs --auto', { stdio: 'inherit' });
    console.log('✅ Enlazado interno automático completado.\n');

    console.log('======================================================');
    console.log('🎉 PIPELINE COMPLETADA CON ÉXITO');
    console.log('======================================================\n');
  } catch (error) {
    console.error('\n❌ Ocurrió un error al ejecutar la pipeline de procesamiento:');
    console.error(error.message);
    process.exit(1);
  }
}

main();
