# 🔗 Internal Linker — Guía de Uso

Sistema de linking interno tipo Wikipedia para AI Cheatsheets.  
Escanea los archivos MDX, detecta palabras que coincidan con otros cheatsheets y propone convertirlas en links internos con tooltip.

---

## Instalación

No requiere dependencias extra. Usa Node.js nativo (ESM).

---

## Comandos

| Comando | Descripción |
|---|---|
| `npm run link` | Interactivo, procesa **todos** los archivos |
| `npm run link:dry` | Preview de todos los archivos (no edita nada) |
| `npm run link:auto` | Aprueba y aplica **todo** automáticamente |

### Con archivo específico

```bash
# Preview de un solo archivo
node scripts/internal-linker.mjs --file php/php --dry-run

# Interactivo en un solo archivo
node scripts/internal-linker.mjs --file devops/elasticsearch

# Auto-aprobar en un solo archivo
node scripts/internal-linker.mjs --file devops/elasticsearch --auto
```

> La ruta del `--file` es relativa a `src/content/cheatsheets/`, sin extensión.

---

## Flujo de Trabajo

### 1. Construye el diccionario (automático)

Al ejecutar, el script escanea todos los `.mdx` y extrae:
- `title` del frontmatter → palabra a buscar
- `description` → texto del tooltip
- Ruta del archivo → URL del link

El diccionario se guarda en `scripts/link-dictionary.json` (ignorado por git).

### 2. Escanea cada archivo

Para cada archivo, busca la **primera ocurrencia** de cada término del diccionario en el texto, excluyendo:
- Bloques de código (` ```...``` `)
- Código inline (`` `...` ``)
- Headings (`# ## ###`)
- Componentes JSX (`<CommandCard>`, etc.)
- Links ya existentes (`[texto](url)`)
- Líneas de import
- El propio archivo (evita auto-linking)

### 3. Presenta candidatos

```
📄 devops/elasticsearch.mdx
   6 candidato(s):

   [1]  L22  "SQL"      →  /base_datos/sql
   [2]  L78  "Postman"  →  /herramientas/postman
   [3]  L78  "Kibana"   →  /herramientas/visualizacion_datos/kibana
   [4]  L78  "API"      →  /conocimiento/api
   [5]  L378 "Java"     →  /java/java
   [6]  L379 "Python"   →  /python/python

   Números a aprobar (ej: 1,3,5) o ENTER para saltar: _
```

### 4. Tú decides

- Escribe los números separados por coma: `1,3,5` → aplica esos 3 links.
- Presiona ENTER sin escribir nada → salta al siguiente archivo.
- En modo `--auto` se aprueban todos sin preguntar.

### 5. El script edita el archivo

Reemplaza la primera ocurrencia de la palabra por un link Markdown con tooltip:

```markdown
<!-- Antes -->
Usa Git para el control de versiones de tu código.

<!-- Después -->
Usa [Git](/herramientas/git/git "Guía rápida y trucos sobre git.") para el control de versiones de tu código.
```

---

## Matching Inteligente

### Títulos con guiones

Un título como `spring-security` genera automáticamente estas variantes de búsqueda:
- `spring-security`
- `spring security`
- `Spring Security`

Todas se buscan case-insensitive.

### Word Boundaries

La búsqueda respeta límites de palabra:
- `react` **sí** matchea "usa React para..." ✅
- `react` **no** matchea "reactivo" ❌
- `MUI` **sí** matchea "...usando MUI como..." ✅
- `MUI` **no** matchea "comunicar" ❌

### Aliases (opcional)

Puedes añadir un campo `aliases` en el frontmatter de cualquier cheatsheet para definir variantes de búsqueda adicionales:

```yaml
---
title: "php"
description: "Guía rápida sobre PHP."
aliases: ["PHP 8", "lenguaje PHP", "PHP moderno"]
---
```

El script buscará tanto `"php"` como todas las variantes en `aliases`.

---

## Verificación

Después de ejecutar el script:

```bash
# Ver qué cambió
git diff src/content/cheatsheets/

# Verificar que el proyecto compila
npm run build

# Previsualizar en el navegador
npm run dev
```

---

## Ejemplo Completo (paso a paso)

```bash
# 1. Preview para ver qué encontraría
node scripts/internal-linker.mjs --file php/php --dry-run

# 2. Si te convence, ejecuta en modo interactivo
node scripts/internal-linker.mjs --file php/php

# 3. El script muestra los candidatos, escribes: 1,2
#    Se aplican 2 links en php.mdx

# 4. Verificas el resultado
git diff src/content/cheatsheets/php/php.mdx

# 5. Si todo está bien, haces commit
git add src/content/cheatsheets/php/php.mdx
git commit -m "feat(linking): add internal links to PHP cheatsheet"
```

---

## Archivos del Sistema

| Archivo | Propósito |
|---|---|
| `scripts/internal-linker.mjs` | Script principal |
| `scripts/link-dictionary.json` | Diccionario auto-generado (no se commitea) |
| `INTERNAL-LINKER.md` | Esta guía |
