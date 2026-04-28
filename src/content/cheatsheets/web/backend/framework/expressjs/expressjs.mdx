---
title: "expressjs"
---


---

# 🌐 Express.js Cheatsheet Completo 🌐

Express.js es un framework web rápido, sin opiniones (unopinionated) y minimalista para Node.js. Proporciona una robusta colección de características para desarrollar aplicaciones web y APIs. Se basa en el modelo de E/S no bloqueante de Node.js, lo que lo hace muy adecuado para construir servicios escalables.

---

## 1. 🌟 Conceptos Clave

* **Middleware**: Funciones que tienen acceso al objeto de solicitud (`req`), al objeto de respuesta (`res`) y a la siguiente función middleware en el ciclo de solicitud-respuesta de la aplicación (`next()`). Pueden ejecutar código, modificar objetos de solicitud y respuesta, finalizar el ciclo o pasar el control al siguiente middleware.
* **Routing (Enrutamiento)**: Define cómo una aplicación responde a una solicitud de cliente a un endpoint particular, que es una URI (o ruta) y un método HTTP específico (GET, POST, etc.).
* **Application Object (`app`)**: La instancia principal de Express que representa tu aplicación web.
* **Request Object (`req`)**: Contiene información sobre la solicitud HTTP entrante (parámetros de ruta, cuerpo, encabezados, etc.).
* **Response Object (`res`)**: Permite construir y enviar la respuesta HTTP al cliente.

---

## 2. 🛠️ Configuración Inicial

1. **Crear Directorio del Proyecto e Inicializar `package.json`:**
   ```bash
   mkdir my-express-app
   cd my-express-app
   npm init -y
   ```
2. **Instalar Express.js:**
   ```bash
   npm install express
   ```
3. **Archivo de Aplicación Básico (`app.js` o `server.js`):**
   ```javascript
   const express = require('express'); // Importa la librería Express
   const app = express();              // Crea una instancia de la aplicación Express
   const PORT = process.env.PORT || 3000; // Define el puerto

   // Define una ruta GET para la URL raíz '/'
   app.get('/', (req, res) => {
     res.send('¡Hola, Mundo desde Express!'); // Envía una respuesta de texto
   });

   // Inicia el servidor
   app.listen(PORT, () => {
     console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
   });
   ```
4. **Ejecutar la Aplicación:**
   ```bash
   node app.js
   ```

   Visita `http://localhost:3000` en tu navegador.

---

## 3. 🗺️ Enrutamiento (Routing)

Define cómo la aplicación responde a las solicitudes HTTP.

### 3.1. Métodos HTTP

* **`app.get(path, handler)`**: Maneja solicitudes GET.
* **`app.post(path, handler)`**: Maneja solicitudes POST.
* **`app.put(path, handler)`**: Maneja solicitudes PUT.
* **`app.delete(path, handler)`**: Maneja solicitudes DELETE.
* **`app.patch(path, handler)`**: Maneja solicitudes PATCH.
* **`app.all(path, handler)`**: Maneja todos los métodos HTTP para una ruta.

```javascript
// app.js
app.get('/users', (req, res) => {
  res.send('Obteniendo todos los usuarios');
});

app.post('/users', (req, res) => {
  res.status(201).send('Creando un nuevo usuario');
});

app.put('/products/:id', (req, res) => {
  res.send(`Actualizando producto con ID: ${req.params.id}`);
});

app.delete('/items/:id', (req, res) => {
  res.status(204).send('Eliminando ítem');
});

app.all('/secret', (req, res) => {
  res.send('Puedes acceder a esta ruta con cualquier método HTTP (GET, POST, etc.)');
});
```

### 3.2. Parámetros de Ruta

* Define segmentos variables en la URL. Accesibles a través de `req.params`.

```javascript
app.get('/products/:productId', (req, res) => {
  const productId = req.params.productId;
  res.send(`Detalle del producto con ID: ${productId}`);
});

app.get('/users/:userId/posts/:postId', (req, res) => {
  const userId = req.params.userId;
  const postId = req.params.postId;
  res.send(`Posts del usuario ${userId}, Post ID: ${postId}`);
});
```

### 3.3. Rutas con Expresiones Regulares (Regex)

* Para patrones de URL más complejos.

```javascript
app.get(/a/, (req, res) => { // Coincide con cualquier URL que contenga 'a'
  res.send('Ruta que contiene "a"');
});
```

---

## 4. 🧳 Request Object (`req`) - Obtener Datos de la Solicitud

* **`req.params`**: Objeto que contiene las propiedades de los parámetros de ruta.
* **`req.query`**: Objeto que contiene los parámetros de la cadena de consulta (query string).
  ```javascript
  // URL: /search?q=nodejs&category=web
  app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
    const category = req.query.category;
    res.send(`Buscando: "${searchTerm}" en categoría: "${category}"`);
  });
  ```
* **`req.body`**: Contiene el cuerpo de la solicitud. **Requiere middleware para parsear (ej. `express.json()`, `express.urlencoded()`).**
* **`req.headers`**: Objeto que contiene los encabezados de la solicitud.
* **`req.method`**: El método HTTP de la solicitud (ej. 'GET', 'POST').
* **`req.url` / `req.path`**: La URL/ruta de la solicitud.
* **`req.ip`**: La dirección IP remota del cliente.

---

## 5. 📨 Response Object (`res`) - Enviar Datos en la Respuesta

* **`res.send(body)`**: Envía una respuesta HTTP. El tipo de contenido se establece automáticamente.
* **`res.json(body)`**: Envía una respuesta JSON.
  ```javascript
  app.get('/api/data', (req, res) => {
    res.json({ message: 'Datos de la API', version: '1.0' });
  });
  ```
* **`res.status(code)`**: Establece el código de estado HTTP para la respuesta.
  ```javascript
  app.post('/new-resource', (req, res) => {
    res.status(201).send('Recurso creado exitosamente.'); // 201 Created
  });
  app.get('/not-found', (req, res) => {
    res.status(404).send('Página no encontrada.'); // 404 Not Found
  });
  ```
* **`res.end()`**: Finaliza el proceso de respuesta sin datos.
* **`res.redirect([status,] path)`**: Redirige una solicitud.
  ```javascript
  app.get('/old-path', (req, res) => {
    res.redirect(301, '/new-path'); // Redirección permanente
  });
  ```
* **`res.sendFile(path [, options] [, callback])`**: Transfiere el archivo en la ruta dada.
  ```javascript
  app.get('/download', (req, res) => {
    res.sendFile(__dirname + '/public/report.pdf');
  });
  ```
* **`res.download(path [, filename] [, options] [, callback])`**: Fuerza la descarga de un archivo.
* **`res.set(field, value)` / `res.header(field, value)`**: Establece encabezados de respuesta HTTP.
  ```javascript
  app.get('/custom-header', (req, res) => {
    res.set('X-Custom-Header', 'MyValue');
    res.send('Respuesta con encabezado personalizado');
  });
  ```
* **`res.cookie(name, value [, options])`**: Establece una cookie.
* **`res.clearCookie(name [, options])`**: Borra una cookie.

---

## 6. ⚙️ Middleware

Funciones que se ejecutan entre la solicitud y la respuesta.

### 6.1. Middleware a Nivel de Aplicación

* **`app.use([path,] callback)`**: Se ejecuta para cada solicitud a la aplicación (o a rutas que comienzan con `path`).

  ```javascript
  // app.js
  const express = require('express');
  const app = express();

  // 1. Middleware para logging (ej. morgan, o custom)
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Pasa el control al siguiente middleware/ruta
  });

  // 2. Middleware incorporado de Express
  app.use(express.json()); // Para parsear cuerpos de solicitud JSON
  app.use(express.urlencoded({ extended: true })); // Para parsear cuerpos de solicitud URL-encoded

  // 3. Servir archivos estáticos (ej. CSS, JS, imágenes)
  app.use(express.static('public')); // Sirve archivos desde la carpeta 'public'

  app.get('/', (req, res) => {
    res.send('Página principal');
  });

  app.post('/data', (req, res) => {
    console.log('Datos recibidos:', req.body);
    res.json({ message: 'Datos procesados', received: req.body });
  });

  // ¡Importante! El orden del middleware importa. Se ejecutan en el orden en que se definen.
  ```

### 6.2. Middleware a Nivel de Ruta

* Se ejecuta solo para una ruta específica.

```javascript
function authMiddleware(req, res, next) {
  if (req.query.token === 'secret') {
    next(); // Permite que la solicitud continúe a la ruta
  } else {
    res.status(401).send('No autorizado');
  }
}

app.get('/protected', authMiddleware, (req, res) => {
  res.send('Bienvenido al área protegida!');
});
```

### 6.3. Middleware de Manejo de Errores

* Tiene cuatro argumentos: `(err, req, res, next)`. Debe ser el **último** middleware definido.

```javascript
// app.js (al final de todas las rutas y otros middlewares)
app.use((err, req, res, next) => {
  console.error(err.stack); // Imprime el stack trace en la consola
  res.status(500).send('¡Algo salió mal en el servidor!');
});

// Para probarlo:
app.get('/error-test', (req, res, next) => {
  throw new Error('Este es un error de prueba!'); // Error síncrono
});

app.get('/async-error-test', async (req, res, next) => {
  try {
    // Simular un error en una operación asíncrona
    await Promise.reject(new Error('Este es un error asíncrono de prueba!'));
  } catch (err) {
    next(err); // Pasa el error al middleware de manejo de errores
  }
});
```

---

## 7. 🗃️ Routers (`express.Router`)

Para organizar tu aplicación en módulos más pequeños y manejables.

```javascript
// routes/api.js
const express = require('express');
const router = express.Router(); // Crea una nueva instancia de Router

// Middleware específico para este router
router.use((req, res, next) => {
  console.log('Middleware del router API');
  next();
});

router.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API!' });
});

router.get('/products', (req, res) => {
  res.json([{ id: 1, name: 'Laptop' }, { id: 2, name: 'Mouse' }]);
});

module.exports = router; // Exporta el router

// app.js
const express = require('express');
const app = express();
const apiRouter = require('./routes/api'); // Importa tu router

app.use('/api', apiRouter); // Monta el router en el prefijo '/api'

app.listen(3000, () => console.log('Servidor en 3000'));
```

---

## 8. 🎨 Plantillas (Templating)

* Express soporta varios motores de plantillas (EJS, Pug, Handlebars, etc.).
* **Configuración**:
  ```javascript
  // app.js
  app.set('view engine', 'pug'); // Configura Pug como motor de plantillas
  app.set('views', './views'); // Especifica la carpeta de plantillas
  ```
* **Renderizar una Plantilla**:
  ```javascript
  // app.js
  app.get('/template-page', (req, res) => {
    res.render('index', { title: 'Mi Página', message: 'Hola desde Pug!' });
  });
  ```
* **Ejemplo `views/index.pug`:**
  ```pug
  html
    head
      title= title
    body
      h1= message
      p Este es un párrafo de Pug.
  ```

  (La sintaxis variará según el motor de plantillas.)

---

## 9. 💡 Buenas Prácticas y Consejos

* **Modularización**: Divide tu aplicación usando `express.Router` y archivos separados para rutas, middleware y lógica.
* **Middleware Ordenado**: La secuencia de middleware es crucial. Los middleware de autenticación deben ir antes de las rutas protegidas, y los manejadores de errores deben ser los últimos.
* **Variables de Entorno**: Utiliza variables de entorno (ej. con `dotenv` para desarrollo) para configurar la aplicación y almacenar secretos (ej. claves de API, credenciales de base de datos).
* **Validación de Entradas**: Siempre valida y sanitiza las entradas del usuario (ej. con librerías como Joi o Express-validator).
* **Logging**: Implementa un sistema de logging robusto (ej. con `morgan` para requests, `winston` o `pino` para logs de aplicación).
* **Seguridad**: Usa librerías de seguridad (ej. `helmet` para protección HTTP, `cors` para CORS) y ten en cuenta las vulnerabilidades comunes (XSS, CSRF, inyección SQL).
* **Manejo Asíncrono de Errores**: Asegúrate de que tus manejadores de ruta y middleware asíncronos pasen los errores a `next(err)`. Usa un `try...catch` o un envoltorio de promesa.
* **Testing**: Escribe pruebas unitarias y de integración para tus rutas y middleware (ej. `Jest`, `Supertest`).
* **Despliegue**: No uses `app.listen()` directamente en producción. Utiliza un proceso como `PM2` o un orquestador de contenedores como Docker/Kubernetes.

---

Este cheatsheet te proporciona una referencia completa y concisa de Express.js, cubriendo sus conceptos esenciales, enrutamiento, manejo de solicitudes/respuestas, middleware y las mejores prácticas para construir aplicaciones web y APIs eficientes en Node.js.
