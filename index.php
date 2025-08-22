<?php
// Incluimos la librería Parsedown
require_once 'Parsedown.php';

// 1. Construir la URL completa y canónica de la página actual
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
$full_url = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

// 2. Definir los metadatos por defecto (para la página de inicio)
$meta_title = 'AI Cheatsheets - Guías Rápidas para Desarrolladores';
$meta_description = 'Un centro de conocimiento con resúmenes, comandos y buenas prácticas sobre programación, arquitectura y herramientas de desarrollo.';
$meta_image = $protocol . $_SERVER['HTTP_HOST'] . '/default-og-image.png'; // URL completa de la imagen
$meta_type = 'website';


// Definimos la carpeta raíz de los cheatsheets
define('CHEAT_ROOT', 'cheatsheets');

// Instanciamos Parsedown
$parsedown = new Parsedown();

// Obtenemos la ruta del archivo o carpeta solicitada desde la URL (?path=...)
$path = isset($_GET['path']) ? $_GET['path'] : '';

// --- MEDIDA DE SEGURIDAD ---
// Normalizamos la ruta para evitar ataques de travesía de directorios (ej. ?path=../)
$real_base = realpath(CHEAT_ROOT);
$user_path = realpath(CHEAT_ROOT . '/' . $path);

// Si la ruta del usuario no está dentro de nuestra carpeta de cheatsheets, lo bloqueamos.
if ($user_path === false || strpos($user_path, $real_base) !== 0) {
    die("Acceso no permitido.");
}

$page_title = 'IA Cheatsheets';
$content_html = '';
$floating_buttons_html = ''; 

// Si la ruta apunta a un archivo markdown (.md)
if (is_file($user_path) && pathinfo($user_path, PATHINFO_EXTENSION) == 'md') {
    $page_title = basename($user_path, '.md');

    // METADATOS Y SEO
    $markdown_content = file_get_contents($user_path);
    
    // Convertimos el Markdown a HTML para poder extraer el texto plano
    $html_content = $parsedown->text($markdown_content);
    $plain_text_content = strip_tags($html_content); // Quitamos todas las etiquetas HTML

    $meta_title = htmlspecialchars($page_title) . ' | AI Cheatsheets';
    // Generamos una descripción corta (primeros 155 caracteres) del contenido
    $meta_description = trim(mb_substr($plain_text_content, 0, 155, 'UTF-8')) . '...';
    $meta_type = 'article'; // El tipo para un cheatsheet es 'article'


    // Lógica para el botón de "Volver"
    // Obtenemos la ruta del directorio padre a partir de la ruta actual
    $parent_dir = dirname($path);
    
    // Si el archivo está en la raíz (dirname devuelve '.'), el enlace es al inicio.
    // De lo contrario, el enlace es a la carpeta padre.
    $back_link = ($parent_dir === '.') ? 'index.php' : '?path=' . urlencode($parent_dir);

    // Botones
    $print_button = '
    <a href="#" onclick="window.print(); return false;" class="fab fab-print" title="Guardar como PDF">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/>
        </svg>
    </a>';

    // Creamos el HTML del botón
    $back_button = '
    <a href="' . $back_link . '" class="fab fab-back" title="Volver a la carpeta">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>
        </svg>
    </a>';

    $floating_buttons_html = $print_button . $back_button;

    // Leemos el contenido del markdown
    $markdown_content = file_get_contents($user_path);
    
    // Juntamos el botón de "Volver" con el contenido del cheatsheet
    $content_html = $parsedown->text($markdown_content);
}
// Si la ruta apunta a un directorio
else if (is_dir($user_path)) {
    $page_title = 'Explorando: ' . ($path ?: 'Inicio');
    
    if (empty($path)) {
        $content_html .= '
        <div class="hero">
            <h2>Antes de aprender, explora estas guías rápidas</h2>
            <p>Resumenes e información servida para desarrolladores. Explora las categorías para empezar.</p>
        </div>';
    }

    $items = scandir($user_path);

        // Barra de búsqueda
    $content_html .= '
    <div class="search-container">
        <input type="text" id="searchInput" onkeyup="filterFiles()" placeholder="Buscar archivos y carpetas...">
    </div>';
    
    $content_html .= '<ul class="file-list">';

    // Listar directorios primero
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $item_path = $user_path . '/' . $item;
        if (is_dir($item_path)) {
            $link = '?path=' . urlencode(trim($path . '/' . $item, '/'));
            $content_html .= '<li><a href="' . $link . '" class="folder">' . htmlspecialchars($item) . '</a></li>';
        }
    }

    // Listar archivos .md después
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $item_path = $user_path . '/' . $item;
        if (is_file($item_path) && pathinfo($item, PATHINFO_EXTENSION) == 'md') {
            $link = '?path=' . urlencode(trim($path . '/' . $item, '/'));
            $file_name = basename($item, '.md');
            $content_html .= '<li><a href="' . $link . '" class="file">' . htmlspecialchars($file_name) . '</a></li>';
        }
    }

    $content_html .= '</ul>';
} else {
    $content_html = '<h2>Contenido no encontrado</h2><p>El archivo o carpeta que buscas no existe.</p>';
}

// Lógica de la "migaja de pan" (breadcrumbs)
$breadcrumbs = '<a href="index.php">Inicio</a>';
if (!empty($path)) {
    $parts = explode('/', $path);
    $current_path = '';
    foreach ($parts as $part) {
        $current_path .= $part;
        $breadcrumbs .= ' / <a href="?path=' . urlencode($current_path) . '">' . htmlspecialchars(basename($part, '.md')) . '</a>';
        $current_path .= '/';
    }
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($page_title); ?> - IA Cheatsheets</title>

    <!-- Metadatos Estándar y SEO -->
    <meta name="description" content="<?php echo htmlspecialchars($meta_description); ?>">
    <meta name="author" content="IA Cheatsheets"> <!-- Puedes poner tu nombre aquí -->

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="<?php echo $meta_type; ?>">
    <meta property="og:url" content="<?php echo htmlspecialchars($full_url); ?>">
    <meta property="og:title" content="<?php echo htmlspecialchars($meta_title); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($meta_description); ?>">
    <meta property="og:image" content="<?php echo htmlspecialchars($meta_image); ?>">
    <meta property="og:site_name" content="IA Cheatsheets">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="<?php echo htmlspecialchars($full_url); ?>">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($meta_title); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($meta_description); ?>">
    <meta name="twitter:image" content="<?php echo htmlspecialchars($meta_image); ?>">
    <link rel="icon" type="image/x-icon" href="./favicon.ico">

    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
</head>
<body>
    <header>
        <h1>IA Cheatsheets</h1>
        <nav class="breadcrumbs">
            <?php echo $breadcrumbs; ?>
        </nav>
    </header>
    <main>
        <div class="content-container">
            <?php echo $content_html; ?>
        </div>
        <p class="breadcrumbs" align="center"><?php echo $breadcrumbs; ?></p>

    </main>
    <footer>
        <p>Plataforma de Cheatsheets v1.0</p>
    </footer>

    <?php echo $floating_buttons_html; ?>

        <!-- Highlight.js desde CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

    <!-- Inicializar -->
    <script>hljs.highlightAll();</script>

    <script src="BlurDotBg.js"></script>
    <!-- FUNCIONALIDAD PARA LA BÚSQUEDA -->
    <script>
        function filterFiles() {
            // 1. Obtener los elementos del DOM
            const input = document.getElementById('searchInput');
            const filter = input.value.toLowerCase();
            const ul = document.querySelector('.file-list');
            const li = ul.getElementsByTagName('li');

            // 2. Recorrer todos los elementos de la lista
            for (let i = 0; i < li.length; i++) {
                const a = li[i].getElementsByTagName('a')[0];
                const txtValue = a.textContent || a.innerText;

                // 3. Comprobar si el texto del elemento coincide con la búsqueda
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    li[i].style.display = ""; // Muestra el elemento si coincide
                } else {
                    li[i].style.display = "none"; // Oculta el elemento si no coincide
                }
            }
        }
        </script>
    

			

</body>
</html>