
---

# 🌐 Flask Cheatsheet Completo 🌐

Flask es un microframework web para Python que proporciona las herramientas esenciales para construir aplicaciones web, dejando la elección de otras herramientas (como ORM o templating) en manos del desarrollador. Se basa en el toolkit WSGI (Werkzeug) y el motor de plantillas Jinja2.

---

## 1. 🌟 Conceptos Clave

* **Microframework**: Significa que es ligero, tiene un núcleo minimalista y no impone muchas decisiones sobre cómo estructurar tu proyecto o qué librerías usar.
* **Werkzeug**: Una biblioteca de utilidades WSGI (Web Server Gateway Interface) que maneja las solicitudes HTTP.
* **Jinja2**: El motor de plantillas por defecto de Flask para renderizar HTML dinámicamente.
* **Rutas (Routes)**: Mapean las URLs a funciones de Python que manejan las solicitudes.
* **Vistas (Views)**: Las funciones de Python que manejan una solicitud entrante y devuelven una respuesta.
* **Contextos**: Flask maneja dos contextos principales:
  * **Contexto de Aplicación (`app context`)**: Activo cuando se ejecuta código relacionado con la aplicación (ej. acceso a `current_app`).
  * **Contexto de Solicitud (`request context`)**: Activo durante una solicitud HTTP, proporcionando acceso a objetos como `request`, `session`, `g`.
* **Blueprint**: Mecanismo para organizar aplicaciones Flask grandes en componentes modulares y reutilizables.
* **WSGI**: (Web Server Gateway Interface) Un estándar de Python para la comunicación entre servidores web y aplicaciones web.

---

## 2. 🛠️ Configuración Inicial

1. **Crear Entorno Virtual (Recomendado):**
   ```bash
   python -m venv venv
   # Windows: venv\Scripts\activate
   # macOS/Linux: source venv/bin/activate
   ```
2. **Instalar Flask:**
   ```bash
   pip install Flask
   ```3.  **Ejecutar una Aplicación Básica ("Hello World"):**
   ```python
   # app.py
   from flask import Flask

   app = Flask(__name__) # Crea una instancia de la aplicación Flask

   @app.route('/') # Decorador para definir una ruta. '/' es la ruta raíz.
   def hello_world(): # Función vista que maneja la ruta
       return '¡Hola, Mundo desde Flask!'

   if __name__ == '__main__':
       app.run(debug=True) # Ejecuta la aplicación en modo desarrollo (auto-recarga, debug)
   ```
3. **Ejecutar la Aplicación:**
   ```bash
   export FLASK_APP=app.py # O set FLASK_APP=app.py en Windows CMD
   flask run
   # O para depuración
   # export FLASK_DEBUG=1
   # flask run
   ```

   Visita `http://127.0.0.1:5000/` en tu navegador.

---

## 3. 🗺️ Rutas (Routing)

### 3.1. Definición de Rutas

* **`@app.route(rule, options)`**: Decorador para vincular una URL a una función vista.

  ```python
  @app.route('/about')
  def about_page():
      return 'Página Acerca de Nosotros'
  ```

### 3.2. Métodos HTTP

* Por defecto, las rutas solo responden a `GET`. Usa el argumento `methods` para especificar otros.

  ```python
  @app.route('/submit', methods=['GET', 'POST'])
  def handle_submit():
      if request.method == 'POST':
          return 'Datos recibidos por POST'
      return 'Formulario para enviar datos (GET)'
  ```

### 3.3. Reglas de URL Variables

* Captura partes de la URL como variables y las pasa a la función vista.

  ```python
  @app.route('/user/<username>') # Captura 'username' como string por defecto
  def show_user_profile(username):
      return f'Perfil de usuario: {username}'

  @app.route('/post/<int:post_id>') # Captura 'post_id' como entero
  def show_post(post_id):
      return f'Publicación número: {post_id}'

  @app.route('/path/<path:subpath>') # Captura subrutas completas
  def show_subpath(subpath):
      return f'Subruta: {subpath}'
  ```

### 3.4. Generación de URLs (`url_for`)

* Genera URLs dinámicamente, lo que es útil para evitar URLs "hardcodeadas" y manejar cambios de ruta.

  ```python
  from flask import url_for, redirect

  @app.route('/login')
  def login():
      return 'Página de Login'

  @app.route('/dashboard')
  def dashboard():
      return redirect(url_for('login')) # Redirige a la ruta 'login'
  ```

---

## 4. 🚀 Solicitudes y Respuestas (Request & Response)

* **`request` Objeto**: Global (proxy de contexto) que contiene la información de la solicitud HTTP entrante.

  ```python
  from flask import request, jsonify, make_response, flash, redirect, url_for

  @app.route('/data', methods=['GET', 'POST'])
  def handle_data():
      if request.method == 'GET':
          # Acceder a parámetros de consulta (query parameters)
          name = request.args.get('name', 'Mundo') # /data?name=Alice
          return f'Hola, {name}!'
      elif request.method == 'POST':
          # Acceder a datos de formulario
          user_name = request.form.get('username')
          # Acceder a JSON body
          if request.is_json:
              data = request.json
              item = data.get('item')
              return jsonify({'message': f'Recibido JSON: {item}'})
          return f'Recibido formulario de {user_name}'

  # JSON Response
  @app.route('/api/status')
  def api_status():
      data = {'status': 'success', 'code': 200}
      return jsonify(data), 200 # Retornar JSON y código de estado

  # Custom Response
  @app.route('/custom_response')
  def custom_response():
      response = make_response('<h1>Contenido HTML personalizado</h1>', 200)
      response.headers['Content-Type'] = 'text/html'
      response.headers['X-Custom-Header'] = 'FlaskApp'
      return response
  ```
* **`session` Objeto**: Diccionario para almacenar datos específicos del usuario entre solicitudes (basado en cookies firmadas). Requiere `SECRET_KEY`.

  ```python
  app.secret_key = 'tu_super_secreto_aqui' # ¡Cambia esto por uno real y complejo!

  @app.route('/set_session')
  def set_session():
      session['username'] = 'TestUser'
      return 'Sesión establecida'

  @app.route('/get_session')
  def get_session():
      username = session.get('username', 'Invitado')
      return f'Usuario en sesión: {username}'
  ```
* **`g` Object**: Un objeto global (`g`) para almacenar datos específicos de la solicitud que pueden ser accedidos desde cualquier parte del código durante la vida de esa solicitud.

  ```python
  from flask import g

  @app.before_request
  def before_request():
      g.start_time = time.time() # Añadir tiempo de inicio a g

  @app.after_request
  def after_request(response):
      # Calcular tiempo de procesamiento
      total_time = time.time() - g.start_time
      response.headers['X-Processing-Time'] = str(total_time)
      return response
  ```

### 4.4. Mensajes Flash (`flash()`)

* Para enviar mensajes de una ruta a la siguiente (ej. después de un formulario).
* Requiere `session` y `SECRET_KEY`.

  ```python
  from flask import flash, get_flashed_messages

  @app.route('/add_item', methods=['POST'])
  def add_item():
      # ... lógica para añadir ítem
      flash('Ítem añadido correctamente!', 'success') # Categoría opcional
      return redirect(url_for('index'))

  # En el template (ver sección 5)
  ```

---

## 5. 🎨 Plantillas (Templating con Jinja2)

Flask usa Jinja2 para renderizar plantillas HTML dinámicas.

* **Ubicación**: Las plantillas deben estar en una carpeta llamada `templates/` en la raíz de tu proyecto.
* **`render_template()`**: Función para cargar y renderizar una plantilla.

  ```python
  # app.py
  from flask import render_template

  @app.route('/')
  def index():
      title = "Página Principal"
      items = ["Manzana", "Banana", "Cereza"]
      return render_template('index.html', page_title=title, my_items=items)

  @app.route('/messages')
  def show_messages():
      return render_template('messages.html') # Para mostrar mensajes flash
  ```
* **Sintaxis Jinja2 (`templates/index.html`)**:

  ```html
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <title>{{ page_title }}</title> {# Interpolación de variables #}
  </head>
  <body>
      <h1>{{ page_title }}</h1>

      <h2>Lista de Ítems:</h2>
      <ul>
          {% for item in my_items %} {# Bucle For #}
              <li>{{ item }}</li>
          {% endfor %}
      </ul>

      {% if my_items|length > 2 %} {# Sentencia If #}
          <p>Tenemos más de 2 ítems.</p>
      {% else %}
          <p>Tenemos 2 ítems o menos.</p>
      {% endif %}

      {# Comentario Jinja2 #}

      <a href="{{ url_for('about_page') }}">Ir a Acerca</a> {# Generar URL #}
  </body>
  </html>
  ```
* **`templates/messages.html` (para mensajes flash):**

  ```html
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <title>Mensajes</title>
  </head>
  <body>
      {% with messages = get_flashed_messages(with_categories=true) %}
        {% if messages %}
          <ul class=flashes>
          {% for category, message in messages %}
            <li class="{{ category }}">{{ message }}</li>
          {% endfor %}
          </ul>
        {% endif %}
      {% endwith %}
      <a href="{{ url_for('index') }}">Volver a Home</a>
  </body>
  </html>
  ```

---

## 6. 📁 Archivos Estáticos

* Flask busca archivos estáticos (CSS, JS, imágenes) en la carpeta `static/` por defecto.
* Usa `url_for('static', filename='path/to/file')` para generar sus URLs.

  ```html
  <!-- templates/index.html -->
  <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
  <img src="{{ url_for('static', filename='images/logo.png') }}" alt="Logo">
  <script src="{{ url_for('static', filename='js/script.js') }}"></script>
  ```

---

## 7. 🧩 Blueprints (Modularización)

Para organizar aplicaciones más grandes en componentes reutilizables y modulares.

```python
# project/auth.py (Blueprint para autenticación)
from flask import Blueprint, render_template, request, redirect, url_for, flash

auth_bp = Blueprint('auth', __name__, url_prefix='/auth') # Definir Blueprint

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == 'admin' and password == 'pass':
            flash('Inicio de sesión exitoso!', 'success')
            return redirect(url_for('main.dashboard'))
        flash('Credenciales inválidas.', 'danger')
    return render_template('auth/login.html')

@auth_bp.route('/logout')
def logout():
    flash('Sesión cerrada.', 'info')
    return redirect(url_for('auth.login'))

# project/main.py (Blueprint principal)
from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/dashboard')
def dashboard():
    return 'Bienvenido al Dashboard!'

# project/app.py (Aplicación principal)
from flask import Flask
from auth import auth_bp
from main import main_bp

app = Flask(__name__)
app.secret_key = 'another_secret_key' # ¡Debe ser único y complejo!

app.register_blueprint(auth_bp) # Registrar Blueprints
app.register_blueprint(main_bp)

if __name__ == '__main__':
    app.run(debug=True)
```

* Los templates para Blueprints se buscan en `templates/blueprint_name/`. (ej. `templates/auth/login.html`)

---

## 8. ⚙️ Configuración

* **Directamente en `app.config`**:
  ```python
  app.config['DEBUG'] = True
  app.config['DATABASE_URL'] = 'sqlite:///site.db'
  ```
* **Desde un Objeto**:
  ```python
  # config.py
  class Config:
      DEBUG = False
      SECRET_KEY = 'prod_secret'

  class DevelopmentConfig(Config):
      DEBUG = True
      SECRET_KEY = 'dev_secret'

  # app.py
  app.config.from_object('config.DevelopmentConfig')
  ```
* **Desde un Archivo**:
  ```python
  # config.cfg
  DEBUG = True
  SECRET_KEY = 'file_secret'

  # app.py
  app.config.from_pyfile('config.cfg')
  ```
* **Variables de Entorno**: Es buena práctica cargar secretos desde variables de entorno.

---

## 9. ❌ Manejo de Errores

* **`@app.errorhandler(code)`**: Decorador para registrar una función que maneja un código de error HTTP específico.

  ```python
  @app.errorhandler(404)
  def page_not_found(e):
      return render_template('404.html'), 404

  @app.errorhandler(500)
  def internal_server_error(e):
      return render_template('500.html'), 500
  ```

---

## 10. 🔌 Extensiones (Flask Ecosystem)

Flask tiene una vasta comunidad que ha creado extensiones para casi todo. Algunas populares son:

* **Flask-SQLAlchemy**: Integración con SQLAlchemy (ORM para bases de datos).
* **Flask-WTF**: Integración con WTForms para formularios y validación.
* **Flask-Login**: Gestión de sesiones de usuario y autenticación.
* **Flask-Migrate**: Migraciones de base de datos con Alembic.
* **Flask-RESTful** / **Flask-RESTx**: Para construir APIs RESTful de forma más estructurada.
* **Flask-CORS**: Manejo de CORS (Cross-Origin Resource Sharing).

**Ejemplo Flask-SQLAlchemy (Instalación: `pip install Flask-SQLAlchemy`):**

```python
# app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydb.db' # Base de datos SQLite
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Deshabilita el seguimiento de modificaciones
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

@app.route('/create_db')
def create_db_tables():
    with app.app_context(): # Requiere contexto de aplicación para acceder a la BD
        db.create_all()
    return 'Tablas de base de datos creadas!'

@app.route('/add_user')
def add_new_user():
    with app.app_context():
        new_user = User(username='testuser', email='test@example.com')
        db.session.add(new_user)
        db.session.commit()
    return 'Usuario añadido!'

if __name__ == '__main__':
    app.run(debug=True)
```

* Para ejecutar `create_db_tables`, primero inicia el servidor (`flask run`), luego visita `http://127.0.0.1:5000/create_db`.

---

## 11. 💡 Buenas Prácticas y Consejos

* **Entornos Virtuales**: Siempre usa entornos virtuales para aislar las dependencias de tus proyectos.
* **`SECRET_KEY`**: Genera una clave secreta fuerte para tu aplicación y guárdala como variable de entorno, no en el código.
* **Blueprints**: Utiliza Blueprints para organizar aplicaciones con más de unas pocas rutas.
* **Configuración**: Centraliza tu configuración y usa perfiles (ej. desarrollo, producción) o variables de entorno.
* **Validación de Entradas**: Siempre valida y sanitiza las entradas del usuario. Usa librerías como Flask-WTF.
* **Manejo de Errores**: Implementa manejadores de errores para los códigos HTTP comunes.
* **Logging**: Configura el logging para monitorear tu aplicación en producción.
* **ORM**: Para aplicaciones con bases de datos relacionales, usa un ORM como SQLAlchemy con Flask-SQLAlchemy.
* **Despliegue**: No uses `app.run(debug=True)` en producción. Usa un servidor WSGI como Gunicorn o uWSGI, y un servidor web como Nginx o Apache como proxy inverso.

---

Este cheatsheet te proporciona una referencia completa y concisa de Flask, cubriendo los fundamentos del framework y las características esenciales para construir aplicaciones web ligeras y eficientes en Python.
