# 🌊 Aqua Icons Workflow

Este documento explica cómo gestionar y optimizar los iconos personalizados estilo Apple 2003 (Aqua) en el proyecto AI-Cheatsheets.

## 🚀 Guía Rápida

### 1. Preparación de Originales

Coloca tus archivos `.png` con fondo transparente (preferiblemente de alta resolución, ej. 512x512 o 1024x1024) en la siguiente ruta:
`public/images/icons/originals/`

### 2. Optimización por Lotes

Ejecuta el siguiente comando en la terminal:

```bash
npm run icons:optimize
```

**¿Qué hace este comando?**

* Busca todos los PNGs en la carpeta `originals/`.
* Los redimensiona a **64x64px** (óptimo para nitidez en pantallas Retina).
* Usa el algoritmo **Lanczos3** para mantener los bordes definidos.
* Aplica compresión máxima sin pérdida de calidad.
* Guarda el resultado en `public/images/icons/`.

### 3. Registro y Activación

Para que el sitio reconozca el nuevo icono, debes registrarlo en el diccionario:
`src/utils/aquaIconMap.ts`

Añade o descomenta el emoji correspondiente y asocia el nombre del archivo:

```typescript
"📁": "/images/icons/folder-closed.png",
```

### 4. Limpieza (Opcional)

Si ya has verificado que los iconos se ven bien y no quieres guardar los archivos originales pesados en el repositorio:

```bash
npm run icons:clean
```

---

## 🎨 Generación de Nuevos Iconos (IA)

Para mantener la consistencia estética, utiliza el siguiente prompt base en tu generador de imágenes favorito (Midjourney, DALL-E 3):

> **Prompt Base:**
> `A high-fidelity skeuomorphic icon of a [NOMBRE DEL OBJETO, ej: blue glossy folder], Apple Mac OS X Aqua style from 2003, 3D isometric 3/4 perspective, photorealistic rendering, glossy glass-like texture, vibrant candy-colored highlights, soft liquid reflections, translucent materials, clean white background, studio lighting, soft drop shadow, high resolution, 4k..`

---

## 🛠️ Detalles Técnicos

### Componente Astro

Para usar iconos en la interfaz (fuera de Markdown), utiliza el componente dedicado:

```astro
---
import AquaIcon from '../atoms/AquaIcon.astro';
---
<AquaIcon name="📂" />
```

### Plugin de Transformación

El sistema cuenta con un plugin de **Rehype** (`src/plugins/rehype-aqua-icons.mjs`) que busca automáticamente los emojis registrados en tus archivos `.mdx` y los reemplaza por las imágenes correspondientes durante el build, asegurando **cero impacto en el rendimiento del cliente**.
