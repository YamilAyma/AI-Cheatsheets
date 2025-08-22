
---

# AI-Cheatsheets 🚀

[![Estado del Sitio Web](https://img.shields.io/website?url=https%3A%2F%2Faicheatsheets.infinityfree.me%2Findex.php&up_message=Online&down_message=Offline&label=Demo)](https://aicheatsheets.infinityfree.me/index.php)
[![GitHub Stars](https://img.shields.io/github/stars/YamilAyma/AI-Cheatsheets?style=social)](https://github.com/YamilAyma/AI-Cheatsheets/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/YamilAyma/AI-Cheatsheets?style=social)](https://github.com/YamilAyma/AI-Cheatsheets/network/members)

Un repositorio de código abierto y un sitio web interactivo que aloja una colección curada de "cheatsheets" (hojas de trucos) para desarrolladores. Construido con PHP puro y sin bases de datos, este proyecto convierte dinámicamente archivos Markdown en páginas web legibles y bien formateadas.

🔗 **Ver Demo en Vivo:** **[aicheatsheets.infinityfree.me](https://aicheatsheets.infinityfree.me/index.php)**

---



## ✨ Características Principales

*   **📂 Navegador de Archivos Dinámico:** Explora carpetas y archivos Markdown de forma intuitiva.
*   **🎨 Resaltado de Sintaxis:** Bloques de código con resaltado automático gracias a [Highlight.js](https://highlightjs.org/).
*   **🔍 Búsqueda en Tiempo Real:** Filtra archivos y carpetas instantáneamente a medida que escribes.
*   **📄 Exportar a PDF / Imprimir:** Guarda cualquier cheatsheet como PDF con un formato de impresión limpio.
*   **💅 Diseño Moderno y Responsivo:** Interfaz limpia y adaptable a cualquier dispositivo.
*   **🔗 Metadatos Dinámicos (SEO/OG):** Vistas previas atractivas al compartir enlaces en redes sociales.
*   **🚀 Despliegue Automatizado:** Integración continua con GitHub Actions para despliegues automáticos vía FTP.
*   **🧩 Cero Dependencias Complejas:** Funciona en cualquier hosting PHP sin necesidad de bases de datos o frameworks.

## 🛠️ Tecnologías Utilizadas

*   **Backend:** PHP 8+ (Vanilla)
*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
*   **Librerías Clave:**
    *   [Parsedown](https://parsedown.org/) para la conversión de Markdown a HTML.
    *   [Highlight.js](https://highlightjs.org/) para el resaltado de sintaxis.
*   **Hosting:** [InfinityFree](https://www.infinityfree.com)
*   **CI/CD:** GitHub Actions

## 🚀 Cómo Empezar (Montaje Local)

Puedes clonar este repositorio y ejecutarlo en tu máquina local. Solo necesitas un entorno de servidor PHP.

### Prerrequisitos
*   Un servidor local como [XAMPP](https://www.apachefriends.org/index.html), WAMP, MAMP, o simplemente el servidor web incorporado de PHP.

### Instalación
1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/YamilAyma/AI-Cheatsheets.git
    ```
2.  **Navega al directorio del proyecto:**
    ```bash
    cd AI-Cheatsheets
    ```
3.  **Inicia el servidor PHP:**
    La forma más sencilla es usar el servidor incorporado de PHP desde la raíz del proyecto.
    ```bash
    php -S localhost:8000
    ```
4.  **Abre tu navegador:**
    Visita `http://localhost:8000` y verás la aplicación funcionando.

## 📁 Estructura del Proyecto

La estructura es simple y fácil de entender. Para añadir tus propios cheatsheets, simplemente crea o modifica archivos `.md` dentro de la carpeta `cheatsheets/`.

```
/
├── .github/workflows/      # Flujo de trabajo para el despliegue con GitHub Actions
├── cheatsheets/            # ¡AQUÍ VAN TODOS LOS CHEATSHEETS EN MARKDOWN!
├── css/                    # Hojas de estilo
├── js/                     # Scripts de JavaScript (si los hubiera)
├── index.php               # Archivo principal que actúa como controlador
├── Parsedown.php           # Librería para renderizar Markdown
└── README.md               # Este archivo :)
```

## 🤝 Cómo Contribuir

¡Las contribuciones son bienvenidas! Si quieres mejorar el proyecto o añadir nuevos cheatsheets, sigue estos pasos:

1.  **Haz un Fork** de este repositorio.
2.  **Crea una nueva rama** para tu funcionalidad o cheatsheet (`git checkout -b feature/AmazingFeature` o `git checkout -b cheatsheet/NewTopic`).
3.  **Haz tus cambios.** Si añades un cheatsheet, simplemente crea un nuevo archivo `.md` en una carpeta apropiada dentro de `/cheatsheets`.
4.  **Haz Commit** de tus cambios (`git commit -m 'Add some AmazingFeature'`).
5.  **Haz Push** a tu rama (`git push origin feature/AmazingFeature`).
6.  **Abre un Pull Request.**


---

*Desarrollado con IA e iniciativa de Yamil Ayma.*
