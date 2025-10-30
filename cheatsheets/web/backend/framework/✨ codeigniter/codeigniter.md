
# 🔥 CodeIgniter 4 Cheatsheet Completo 🔥

**CodeIgniter** es un framework de aplicaciones web de código abierto para construir sitios web dinámicos con PHP. Es conocido por su rendimiento, su ligera huella y su enfoque en la simplicidad, permitiendo a los desarrolladores construir aplicaciones rápidamente sin una curva de aprendizaje pronunciada.

---

## 1. 🌟 Conceptos Clave

* **MVC (Model-View-Controller)**: El patrón arquitectónico principal.
  * **Model**: Gestiona la interacción con la base de datos (lógica de datos).
  * **View**: Representa la presentación (HTML, UI).
  * **Controller**: Maneja las solicitudes del usuario, interactúa con el Modelo y carga la Vista.
* **Ligero y Rápido**: Tiene una huella muy pequeña y un rendimiento excelente.
* **"Casi" Cero Configuración**: Requiere una configuración mínima para empezar.
* **Enrutamiento Flexible**: Permite un control total sobre las URLs.
* **Librerías y Helpers**: Proporciona un rico conjunto de librerías y helpers para tareas comunes.
* **Seguridad**: Incluye características de seguridad incorporadas (protección CSRF, filtrado XSS, etc.).

---

## 2. 🛠️ Configuración Inicial

### 2.1. Requisitos

* PHP 7.4+ (recomendado PHP 8.1+)
* Extensiones de PHP (ej. `intl`, `mbstring`, `json`).
* Composer (para la instalación).

### 2.2. Instalación (con Composer)

```bash
composer create-project codeigniter4/appstarter my-ci-app
cd my-ci-app
```

### 2.3. Ejecutar el Servidor de Desarrollo

```bash
php spark serve
# Visita http://localhost:8080
```

### 2.4. Estructura de Directorios

* `app/`: Tu código de aplicación (controladores, modelos, vistas, configuración).
* `public/`: El directorio raíz de tu servidor web (`index.php`).
* `writable/`: Directorios para logs, caché, uploads.
* `vendor/`: Dependencias de Composer.

### 2.5. Configuración Básica

* **`app/Config/App.php`**:
  * `baseURL`: `public $baseURL = 'http://localhost:8080/';` (¡Configura esto!)
  * `indexPage`: `public $indexPage = '';` (Elimina `index.php` de las URLs).
  * `defaultLocale`, `supportedLocales`: Para internacionalización.
* **`app/Config/Database.php`**:
  * Configura la conexión a tu base de datos (hostname, username, password, database).
* **`.env` File**: (Recomendado) Copia `env` a `.env` y descomenta las líneas para configurar el entorno (`CI_ENVIRONMENT`), la `baseURL` y la configuración de la base de datos.
  ```
  CI_ENVIRONMENT = development
  app.baseURL = 'http://localhost:8080'
  database.default.hostname = localhost
  database.default.database = my_db
  database.default.username = root
  database.default.password =
  ```

---

## 3. 🗺️ Enrutamiento (`app/Config/Routes.php`)

Define cómo las URLs se mapean a los Controladores.

```php
// app/Config/Routes.php
$routes->get('/', 'Home::index'); // Ruta raíz

// Ruta simple
$routes->get('about', 'Pages::about');

// Ruta con placeholders (parámetros)
$routes->get('products/(:num)', 'Products::show/$1'); // (:num) para número
$routes->get('news/(:segment)', 'News::view/$1'); // (:segment) para cualquier carácter excepto /

// Métodos HTTP
$routes->post('users/create', 'Users::create');
$routes->put('articles/(:num)', 'Articles::update/$1');
$routes->delete('comments/(:num)', 'Comments::delete/$1');

// Agrupación de rutas
$routes->group('admin', function($routes) {
    $routes->get('dashboard', 'Admin\Dashboard::index');
    $routes->get('users', 'Admin\Users::list');
});
```

---

## 4. 🎮 Controladores (`app/Controllers/`)

Manejan la lógica de la aplicación.

```php
// app/Controllers/Products.php
namespace App\Controllers;

use App\Models\ProductModel; // Importa el modelo
use CodeIgniter\Controller;

class Products extends Controller
{
    public function index()
    {
        $model = new ProductModel();
        $data['products'] = $model->findAll();
        $data['title'] = 'Lista de Productos';
      
        return view('products/index', $data); // Carga la vista con datos
    }

    public function show($id)
    {
        $model = new ProductModel();
        $data['product'] = $model->find($id);

        if (empty($data['product'])) {
            throw new \CodeIgniter\Exceptions\PageNotFoundException('No se puede encontrar el producto con ID: '. $id);
        }

        $data['title'] = $data['product']['name'];
        return view('products/show', $data);
    }
}
```

---

## 5. 🎨 Vistas (`app/Views/`)

La capa de presentación.

```php
<!-- app/Views/templates/header.php -->
<!DOCTYPE html>
<html>
<head>
    <title><?= esc($title) ?></title>
</head>
<body>
    <h1><?= esc($title) ?></h1>

<!-- app/Views/products/index.php -->
<?= $this->include('templates/header', ['title' => $title]) ?>

<h2>Lista de Productos</h2>
<ul>
    <?php if (! empty($products) && is_array($products)): ?>
        <?php foreach ($products as $product): ?>
            <li>
                <a href="/products/<?= esc($product['id'], 'url') ?>">
                    <?= esc($product['name']) ?>
                </a>

            </li>
        <?php endforeach; ?>
    <?php else: ?>
        <h3>No hay productos</h3>
    <?php endif ?>
</ul>

<?= $this->include('templates/footer') ?>

<!-- app/Views/templates/footer.php -->
    <em>© 2023</em>
</body>
</html>
```

* **`esc()`**: Helper de seguridad para escapar la salida y prevenir ataques XSS.

---

## 6. 💾 Modelos (`app/Models/`)

Interactúan con la base de datos. CodeIgniter 4 proporciona un Model robusto.

```php
// app/Models/ProductModel.php
namespace App\Models;

use CodeIgniter\Model;

class ProductModel extends Model
{
    protected $table = 'products'; // Nombre de la tabla
    protected $primaryKey = 'id'; // Clave primaria
    protected $allowedFields = ['name', 'description', 'price']; // Campos permitidos para inserción/actualización
  
    // Opcional: Validación
    protected $validationRules = [
        'name' => 'required|min_length[3]|max_length[255]',
        'price' => 'required|decimal'
    ];

    // Opcional: Timestamps
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
```

### 6.1. Operaciones CRUD con el Modelo

```php
// En un Controlador
$model = new ProductModel();

// Encontrar todos
$allProducts = $model->findAll();

// Encontrar por ID
$product = $model->find(1);

// Encontrar por condición
$activeProducts = $model->where('active', 1)->findAll();

// Insertar
$data = [
    'name' => 'Nuevo Producto',
    'price' => 99.99
];
$model->insert($data);

// Actualizar
$model->update(1, ['price' => 110.00]);

// Eliminar
$model->delete(1);
```

---

## 7. 🧰 Librerías y Helpers

* **Cargar**:
  * **Helpers**: `helper('form');` o `helper(['form', 'url']);`
  * **Librerías**: `\Config\Services::email();` o `\Config\Services::validation();`
* **Helpers Comunes**:
  * **URL**: `site_url()`, `base_url()`, `current_url()`.
  * **Form**: `form_open()`, `form_input()`, `form_submit()`, `form_close()`.
  * **HTML**: `img()`, `link_tag()`.
  * **Array**: `dot_array_search()`.
* **Librerías Comunes**:
  * **Validation**: Para validar datos de formularios.
  * **Session**: Para gestionar sesiones de usuario.
  * **Email**: Para enviar correos.
  * **Pagination**: Para paginar resultados.

---

## 8. 🛡️ Seguridad

* **Escapar Salida (`esc()`)**: Previene ataques XSS.
* **Protección CSRF (Cross-Site Request Forgery)**:
  * Habilitado por defecto.
  * Añade `<?= csrf_field() ?>` en tus formularios.
* **Consultas Preparadas (Query Builder / Model)**: Protegen contra inyección SQL.
* **Filtro de URI**: Filtra caracteres no permitidos en las URLs.

---

## 9. 💡 Buenas Prácticas y Consejos

* **Usa el archivo `.env`**: Para la configuración de tu entorno.
* **Sigue la Estructura MVC**: Mantén tu lógica, datos y presentación separados.
* **Usa los Modelos de CI4**: Aprovecha las funcionalidades del Model de CodeIgniter 4 (validación, timestamps, soft deletes).
* **Validación**: Valida todos los datos de entrada, ya sea en el Controlador o en el Modelo.
* **Helpers de Seguridad**: Siempre escapa la salida con `esc()`.
* **Usa el Query Builder**: Para consultas de base de datos seguras y portables.
* **Errores**: Configura el entorno a `production` para ocultar errores detallados a los usuarios finales.
* **`spark` CLI**: Utiliza la herramienta de línea de comandos `spark` para tareas comunes (migraciones, servir la app, etc.).
* **Migraciones de Base de Datos**: Usa `php spark make:migration` y `php spark migrate` para gestionar los cambios de esquema de tu base de datos de forma versionada.

---

Este cheatsheet te proporciona una referencia completa de CodeIgniter 4, cubriendo sus conceptos esenciales, configuración, enrutamiento, MVC, manejo de base de datos, seguridad y las mejores prácticas para un desarrollo web rápido y eficiente con PHP.
