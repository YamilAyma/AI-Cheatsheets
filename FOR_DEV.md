# 🛠️ Guía del Desarrollador — AI Cheatsheets

Esta guía describe la arquitectura de automatización de contenidos, los scripts de procesamiento y el flujo de trabajo (*happy path*) para agregar y actualizar cheatsheets en este repositorio.

---

## 📂 Arquitectura de Contenidos

Los cheatsheets están estructurados bajo `src/content/cheatsheets/` según su área tecnológica:

```text
src/content/cheatsheets/
├── arquitectura/                # Patrones y metodologías generales (DDD, Onion, Hexagonal)
│   └── patrones_distribuidos/   # CQRS, Saga, Circuit Breaker, Event Sourcing
├── base_datos/                  # Consultas, DER, motores relacionales y NoSQL
│   ├── nosql/                   # Redis, MongoDB, Mongoose
│   └── orm/                     # Prisma ORM
├── conocimiento/                # APIs, paradigma funcional, AOP, reactivo
├── csharp/                      # .NET, C#
├── devops/                      # Docker, K8s, Terraform, Ansible, Nginx, Shells
├── herramientas/                # Git, GitHub, cURL, OpenAPI, Postman, AHK, AppleScript
├── java/                        # Java Core, Spring, JUnit, Mockito, Tomcat
├── php/                         # PHP Core, ecosistema
├── python/                      # Python Core, NumPy, scripting
└── web/                         # Entornos Web
    ├── frontend/                # SPA Frameworks, Estilos, API Clients
    │   └── testing/             # Jest, Vitest, Playwright, Cypress
    └── fullstack/               # Astro, Next.js, SvelteKit
```

---

## ⚙️ Pipeline de Procesamiento Automatizado

Para asegurar consistencia en metadatos y compilación, el proyecto cuenta con un pipeline automatizado de 4 fases que se ejecuta antes de cualquier subida.

### Comandos Principales

*   `npm run pipeline`: Procesa, sanea y genera enlaces cruzados en todos los archivos.
*   `npm run upload`: Ejecuta la pipeline completa, realiza confirmaciones inteligentes en Git y sube los cambios al remoto (`git push`).
*   `npm run list`: Muestra en consola y guarda en `docs/cheatsheets-tree.txt` el árbol completo de temas estructurados.

---

## 🔍 Detalles de los Scripts Internos

### 1. Enriquecedor de Frontmatter (`scripts/enhance_frontmatter.js`)
*   **Propósito**: Garantiza que todos los archivos `.mdx` tengan un bloque frontmatter estándar y limpio.
*   **Comportamiento**: Si agregas una cheatsheet vacía o sin frontmatter, lee el título del archivo, le asigna un icono automático basado en la tecnología, inicializa la fecha actual de creación/actualización y define etiquetas básicas de metadatos.
*   **Corrección de comillas**: Cuenta con un limpiador que remueve de forma segura cualquier comilla externa o barra de escape redundante (evitando el bug de comillas anidadas).

### 2. Refinador de Descripciones (`scripts/refine-metadata.mjs`)
*   **Propósito**: Genera descripciones dinámicas y precisas para SEO y previsualizaciones.
*   **Comportamiento**: Lee el primer párrafo legible del cuerpo del cheatsheet, remueve marcas de formato (negritas, enlaces, código inline) y lo inyecta directamente como la `description` en el frontmatter del archivo.

### 3. Saneador MDX (`scripts/fix_mdx_syntax.cjs`)
*   **Propósito**: Corrige la sintaxis incompatible de Markdown tradicional para asegurar compatibilidad con el motor MDX de Astro.
*   **Comportamiento**: Convierte signos de comparación y flechas (`<`, `<=`, `>=`, `->`, `=>`) que no forman parte de tags HTML reales en sus correspondientes entidades HTML seguras (`&lt;`, `&gt;=`, etc.).

### 4. Enlazador Interno Wikipedia-Style (`scripts/internal-linker.mjs`)
*   **Propósito**: Crea una red navegable de conocimiento cruzado automático.
*   **Comportamiento**: Escanea todos los títulos y alias definidos en los frontmatters de los cheatsheets para construir un diccionario de términos. Posteriormente, busca menciones de dichos términos en los textos de otros cheatsheets e inyecta enlaces Markdown enriquecidos con tooltips nativos, evitando autoreferencias y zonas de código.

---

## 🧠 Flujo de Commits Inteligentes y Atómicos

Para mantener un historial de Git limpio y profesional, el script `scripts/upload-cheatsheets.js` aplica una estrategia inteligente al momento de confirmar cambios:

1.  **Nuevas Cheatsheets**: Se realiza **un commit atómico e independiente por cada archivo nuevo** agregado.
    *   *Formato*: `feat (Cheatsheet/[Categoría]): Agregar cheatsheet de [Nombre]`
2.  **Modificaciones Masivas**: Todos los cambios en archivos ya existentes resultantes del preprocesamiento de descripciones o del enlazado interno automático se agrupan en **un único commit global**.
    *   *Formato*: `docs (Cheatsheet): Actualizar enlaces y metadatos de cheatsheets existentes`
3.  **Configuraciones**: Todos los archivos de desarrollo, scripts y `package.json` se confirman juntos al final.
    *   *Formato*: `chore: actualizar utilidades, scripts de procesamiento y package.json`

---

## 🚀 Happy Path: Agregar o Actualizar Contenido

Sigue este flujo de trabajo estándar cuando desees incorporar o modificar un tema:

### Paso 1: Crear el Archivo
Crea un archivo con extensión `.mdx` en la ubicación correspondiente dentro de la estructura. 
*Ejemplo: `src/content/cheatsheets/rust/rust.mdx`*

### Paso 2: Escribir el Contenido
Puedes omitir el frontmatter (el pipeline lo creará por ti) e iniciar directamente con el título principal `#` y el cuerpo estructurado de tu guía.

### Paso 3: Vista Previa Local (Opcional)
Inicia el servidor de desarrollo local para verificar visualmente los estilos y renderizado del sitio:
```bash
npm run dev
```

### Paso 4: Procesar y Subir
Ejecuta el comando maestro de subida:
```bash
npm run upload
```

> [!IMPORTANT]
> **Nota sobre Credenciales de Git:**
> Si ejecutas `npm run upload` dentro de entornos sandboxados o contenedores donde tus claves SSH o tokens de GitHub no están mapeados, el paso de confirmación local de Git (`git commit`) se completará perfectamente, pero el `git push` final podría fallar por falta de permisos. 
> Si esto ocurre, simplemente abre tu terminal del sistema habitual (o interfaz de tu editor como VS Code) y ejecuta:
> ```bash
> git push
> ```
