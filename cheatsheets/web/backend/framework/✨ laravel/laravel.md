
---

# 🚀 Laravel Cheatsheet Completo 🚀

**Laravel** es un framework de aplicaciones web de código abierto para PHP, creado por Taylor Otwell. Sigue el patrón de diseño **MVC (Model-View-Controller)** y proporciona un conjunto de herramientas y funcionalidades "out-of-the-box" para tareas comunes como el enrutamiento, la autenticación, las sesiones, el caching y la interacción con la base de datos, lo que acelera enormemente el desarrollo.

---

## 1. 🌟 Conceptos Clave

* **MVC (Model-View-Controller)**: El patrón arquitectónico principal.
  * **Model**: Representa los datos y la lógica de negocio (interactúa con la DB).
  * **View**: La capa de presentación (HTML, UI), impulsada por el motor de plantillas Blade.
  * **Controller**: Maneja las solicitudes, interactúa con el Modelo y devuelve una Vista o una respuesta JSON.
* **Composer**: El gestor de paquetes para PHP, utilizado para gestionar las dependencias de Laravel.
* **Artisan**: La interfaz de línea de comandos (CLI) de Laravel. Proporciona comandos para tareas comunes (migraciones, controladores, etc.).
* **Eloquent ORM**: Un ORM (Object-Relational Mapper) potente y expresivo que facilita la interacción con la base de datos utilizando objetos PHP.
* **Blade**: El motor de plantillas de Laravel. Simple pero potente, permite usar lógica de PHP en tus vistas.
* **Routing (Enrutamiento)**: Define cómo las URLs se mapean a los Controladores o a Closures.
* **Middleware**: Mecanismo para filtrar las solicitudes HTTP que entran en tu aplicación (ej. autenticación, CSRF, logging).
* **Service Container**: Una poderosa herramienta para gestionar dependencias de clase y realizar inyección de dependencias (DI).

---

## 2. 🛠️ Configuración Inicial

### 2.1. Requisitos

* PHP (versión requerida por Laravel).
* Composer.
* Base de Datos (MySQL, PostgreSQL, SQLite, SQL Server).

### 2.2. Instalación

* **Vía Laravel Installer**:
  ```bash
  composer global require laravel/installer
  laravel new my-app
  ```
* **Vía Composer**:
  ```bash
  composer create-project laravel/laravel my-app
  cd my-app
  ```

### 2.3. Configuración del Entorno (`.env`)

* Copia `.env.example` a `.env`.
* Configura las variables de entorno clave:
  ```
  APP_NAME=Laravel
  APP_ENV=local
  APP_KEY= # Se genera con `php artisan key:generate`
  APP_DEBUG=true
  APP_URL=http://localhost

  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=laravel
  DB_USERNAME=root
  DB_PASSWORD=
  ```
* Generar la clave de la aplicación:
  ```bash
  php artisan key:generate
  ```

### 2.4. Ejecutar el Servidor de Desarrollo

```bash
php artisan serve
# Visita http://127.0.0.1:8000
```

---

## 3. 🗺️ Enrutamiento (`routes/web.php` y `routes/api.php`)

* **`routes/web.php`**: Para rutas web (con sesión, protección CSRF, cookies).
* **`routes/api.php`**: Para APIs RESTful (sin estado, con autenticación por token).

```php
// routes/web.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;

// Ruta básica con Closure
Route::get('/', function () {
    return view('welcome');
});

// Ruta a un Controlador
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

// Rutas de recursos (CRUD)
Route::resource('photos', PhotoController::class);
// GET /photos, POST /photos, GET /photos/{id}, PUT /photos/{id}, DELETE /photos/{id}, etc.

// Parámetros de ruta
Route::get('/user/{id}', function (string $id) {
    return 'User '.$id;
});

// Nombres de ruta
Route::get('/profile', [UserController::class, 'show'])->name('profile');

// Agrupación de rutas (middleware, prefijos)
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
```

---

## 4. 🎮 Controladores (`app/Http/Controllers/`)

* **Crear un Controlador (Artisan)**:
  ```bash
  php artisan make:controller PostController --resource # --resource crea los métodos CRUD
  ```

```php
// app/Http/Controllers/PostController.php
namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::all();
        return view('posts.index', ['posts' => $posts]);
    }

    public function show(Post $post) // Model Binding
    {
        return view('posts.show', ['post' => $post]);
    }
}
```

---

## 5. 🎨 Vistas (Blade - `resources/views/`)

* Extensión `.blade.php`.

### 5.1. Sintaxis Básica de Blade

* **Mostrar Datos**: `{{ $variable }}` (escapa HTML por defecto).
* **Mostrar HTML (sin escapar)**: `{!! $html !!}` (¡CUIDADO con XSS!).
* **Estructuras de Control**:
  ```blade
  @if (count($records) === 1)
      Solo hay un registro.
  @elseif (count($records) > 1)
      Hay múltiples registros.
  @else
      No hay registros.
  @endif

  @foreach ($users as $user)
      <p>{{ $user->name }}</p>
  @endforeach

  @unless (Auth::check())
      No estás logueado.
  @endunless

  @isset($variable)
      La variable está definida.
  @endisset
  ```

### 5.2. Herencia de Plantillas

* **Layout Base (`layouts/app.blade.php`)**:
  ```blade
  <html>
      <head><title>@yield('title')</title></head>
      <body>
          <div class="container">
              @yield('content')
          </div>
      </body>
  </html>
  ```
* **Vista Hija (`posts/index.blade.php`)**:
  ```blade
  @extends('layouts.app')

  @section('title', 'Lista de Posts')

  @section('content')
      <p>Este es el contenido de la página de posts.</p>
  @endsection
  ```

---

## 6. 💾 Eloquent ORM y Modelos (`app/Models/`)

* **Crear un Modelo y Migración (Artisan)**:
  ```bash
  php artisan make:model Post -m # -m crea el archivo de migración
  ```

```php
// app/Models/Post.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'user_id']; // Asignación masiva

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

### 6.1. Migraciones (`database/migrations/`)

* Gestionan el esquema de la base de datos.
* **Ejecutar Migraciones**:
  ```bash
  php artisan migrate
  ```
* **Revertir Migraciones**:
  ```bash
  php artisan migrate:rollback
  ```

```php
// database/migrations/xxxx_create_posts_table.php
public function up()
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('content');
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
}
```

### 6.2. Operaciones CRUD con Eloquent

```php
// En un Controlador o Tinker
use App\Models\Post;

// Crear
$post = new Post;
$post->title = 'Mi primer post';
$post->content = 'Contenido...';
$post->save();
// O con asignación masiva
$post = Post::create(['title' => 'Otro post', 'content' => '...']);

// Leer
$allPosts = Post::all();
$post = Post::find(1);
$posts = Post::where('active', 1)->orderBy('title')->take(10)->get();

// Actualizar
$post = Post::find(1);
$post->title = 'Título actualizado';
$post->save();

// Eliminar
$post = Post::find(1);
$post->delete();
```

---

## 7. 🛡️ Seguridad

* **Autenticación**:
  * **Breeze / Jetstream**: Scaffolding de autenticación completo (registro, login, etc.).
  * `Auth::user()`: Obtener el usuario autenticado.
  * `Auth::check()`: Verificar si el usuario está logueado.
* **Autorización (Gates & Policies)**:
  * **Gates**: Closures para autorizar acciones simples.
  * **Policies**: Clases para agrupar la lógica de autorización para un modelo.
* **Protección CSRF**: Automática para rutas web. Usa `@csrf` en tus formularios.
* **Protección XSS**: Blade escapa las variables (`{{ }}`) por defecto.
* **Inyección SQL**: Eloquent ORM usa bindings de parámetros para prevenir inyección SQL.

---

## 8. 💡 Buenas Prácticas y Consejos

* **Sigue las Convenciones**: Laravel se basa en convenciones (nombres de modelos en singular, nombres de tablas en plural).
* **Usa Artisan**: Aprovecha la CLI para generar código (controladores, modelos, migraciones, etc.).
* **`.env` para la Configuración**: Nunca guardes credenciales o configuraciones sensibles en tu código.
* **Validación de Solicitudes**: Usa `Form Requests` para la validación de formularios.
  * `php artisan make:request StorePostRequest`
* **Carga Eager (Eager Loading)**: Para evitar el problema N+1, usa `with()` para cargar relaciones.
  * `$posts = Post::with('user')->get();`
* **Colecciones de Laravel**: Aprende a usar las potentes colecciones de Laravel para manipular arrays y datos.
* **Colas y Trabajos (Queues & Jobs)**: Para tareas de larga duración (envío de correos, procesamiento de videos), muévelas a trabajos en segundo plano.
* **Pruebas (Testing)**: Laravel viene con PHPUnit. Escribe pruebas para tu aplicación.
  * `php artisan make:test UserTest`
* **Middleware**: Utiliza middleware para la lógica que se aplica a múltiples rutas (autenticación, logging, etc.).

---

Este cheatsheet te proporciona una referencia completa de Laravel, cubriendo sus conceptos esenciales, configuración, enrutamiento, MVC, Eloquent ORM, seguridad y las mejores prácticas para un desarrollo web rápido y elegante con PHP.
