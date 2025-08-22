<?php
// Incluimos la librería Parsedown
require_once 'Parsedown.php';

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

$page_title = 'AI Cheatsheets';
$content_html = '';
$floating_buttons_html = ''; 

// Si la ruta apunta a un archivo markdown (.md)
if (is_file($user_path) && pathinfo($user_path, PATHINFO_EXTENSION) == 'md') {
    $page_title = basename($user_path, '.md');

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
    <title><?php echo htmlspecialchars($page_title); ?> - Mis Cheatsheets</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
</head>
<body>
    <header>
        <h1>AI Cheatsheets</h1>
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
    <script>
    let colorbg = new Color4Bg.BlurDotBg({
        dom: "box",
        colors: ["#A7DDBC","#8FC5AA","#78AE99","#609687"],
        loop: true
    })
    </script>
    

			

</body>
</html>