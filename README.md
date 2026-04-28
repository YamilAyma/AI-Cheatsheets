# IA Cheatsheets 🚀

Un centro de conocimiento moderno, rápido y estático para desarrolladores. Esta plataforma recopila cheatsheets, resúmenes técnicos, comandos y buenas prácticas sobre programación, arquitectura y herramientas de desarrollo.

Originalmente desarrollado en PHP, este proyecto ha sido migrado a **Astro (SSG)** para ofrecer un rendimiento superior, mejor SEO y una experiencia de desarrollo basada en componentes y MDX.

## 🛠️ Tecnologías

- **Framework**: [Astro 6.x](https://astro.build/)
- **Contenido**: [MDX](https://mdxjs.com/) (Markdown con superpoderes)
- **Estilos**: CSS Vanilla (Diseño Premium & Responsivo)
- **Despliegue**: Optimizado para Vercel (SSG)
- **SEO**: Generación automática de Sitemap plano

## ✨ Características Principales

- 🔍 **Buscador Global**: Encuentra cualquier cheatsheet al instante desde cualquier página.
- 📱 **Diseño Responsivo**: Experiencia optimizada para móviles y escritorio.
- 📄 **Listo para Imprimir**: Botones flotantes dedicados para guardar cheatsheets como PDF.
- ⚡ **Máximo Rendimiento**: Carga instantánea gracias a la generación de sitios estáticos.
- 📂 **Navegación Intuitiva**: Estructura de carpetas lógica con navegación dinámica en el footer.

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js `v22.12.0` o superior
- npm

### Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd ai-cheatsheets
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### Comandos Útiles

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:4321` |
| `npm run build` | Genera el sitio estático y procesa el sitemap en `./dist/` |
| `npm run preview` | Previsualiza el build de producción localmente |
| `node scripts/fix_mdx_syntax.cjs` | Sanea la sintaxis de los archivos MDX |

## 🏗️ Estructura del Proyecto

```text
/
├── scripts/                # Scripts de utilidad (limpieza MDX, sitemap)
├── src/
│   ├── components/         # Componentes Astro (Buscador, FABs, etc.)
│   ├── content/
│   │   └── cheatsheets/    # Base de datos de conocimientos en .mdx
│   ├── layouts/            # Plantillas base (BaseLayout)
│   └── pages/              # Enrutamiento dinámico [...slug].astro
├── public/                 # Assets estáticos (imágenes, iconos)
└── astro.config.mjs        # Configuración de Astro y sitemap
```

## 📝 Gestión de Contenido

Para añadir un nuevo cheatsheet, simplemente crea un archivo `.mdx` dentro de `src/content/cheatsheets/`. Asegúrate de incluir el frontmatter necesario:

```yaml
---
title: "Nombre del Cheatsheet"
description: "Breve descripción para SEO"
createdAt: "2026-04-28"
updatedAt: "2026-04-28"
tags: ["etiqueta1", "etiqueta2"]
icon: "🚀"
---
```

## ⚙️ Scripts Especiales

- **`fix_mdx_syntax.cjs`**: Escapa caracteres especiales (como `<` o `->`) que pueden romper la compilación de MDX. Ejecútalo si encuentras errores en el build.
- **`flatten_sitemap.cjs`**: Se ejecuta automáticamente después del build para generar un `sitemap.xml` único y plano en lugar de un índice fragmentado.

## 📄 Licencia

Este proyecto es para uso personal y educativo.
