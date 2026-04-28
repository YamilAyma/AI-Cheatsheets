---
title: "postman"
---


---

# 📬 Postman Cheatsheet Completo 📬

Postman es una plataforma colaborativa para el desarrollo de APIs. Simplifica cada paso del ciclo de vida de la API, desde el diseño y la prueba hasta la publicación y la monitorización. Permite enviar solicitudes HTTP a APIs y ver las respuestas de forma interactiva y visual.

---

## 1. 🌟 Conceptos Clave

* **Solicitud (Request)**: Una petición HTTP enviada a un endpoint de la API (ej. GET, POST, PUT, DELETE).
* **Respuesta (Response)**: La información devuelta por el servidor de la API en respuesta a una solicitud.
* **Colección (Collection)**: Una forma de organizar y agrupar solicitudes relacionadas. Permite ejecutar múltiples solicitudes en un orden específico.
* **Entorno (Environment)**: Un conjunto de variables clave-valor que puedes usar en tus solicitudes. Útil para cambiar entre diferentes configuraciones (ej. desarrollo, producción) sin modificar las solicitudes.
* **Espacio de Trabajo (Workspace)**: Un área colaborativa donde tú y tu equipo pueden organizar las colecciones, entornos y otros elementos de Postman.
* **Variables**: Placeholders dinámicos que se pueden usar en solicitudes, scripts y entornos.
* **Scripts (Pre-request Script & Test Script)**: Código JavaScript que se ejecuta antes o después de una solicitud, respectivamente.
* **Servidor Mock (Mock Server)**: Un servidor simulado que imita el comportamiento de una API real, devolviendo respuestas predefinidas sin necesidad de un backend real.
* **Monitor**: Permite programar la ejecución de colecciones a intervalos regulares para verificar el rendimiento y la disponibilidad de la API.
* **Newman**: Una herramienta de línea de comandos (CLI) que te permite ejecutar colecciones de Postman directamente desde tu terminal o en un proceso de CI/CD.

---

## 2. 🛠️ Interfaz Principal (Elementos Clave)

* **Barra Lateral (Sidebar)**: Contiene tus Colecciones, Entornos, Historial de Solicitudes y APIs.
* **Pestaña de Solicitud (Request Tab)**: Área principal donde construyes y envías tus solicitudes.
* **Área de Respuesta (Response Area)**: Muestra la respuesta del servidor (cuerpo, encabezados, estado, tiempo).
* **Menú de Entornos (Environment Selector)**: Desplegable para seleccionar el entorno activo.
* **Barra de Búsqueda y Filtro**: Para encontrar rápidamente solicitudes, colecciones, etc.

---

## 3. 🚀 Creación y Envío de Solicitudes

### 3.1. Métodos HTTP

* **`GET`**: Para obtener datos de un servidor.
  * Ej: `https://api.example.com/users`
* **`POST`**: Para enviar datos y crear un nuevo recurso.
  * Ej: `https://api.example.com/users` (con un cuerpo de usuario)
* **`PUT`**: Para enviar datos y actualizar completamente un recurso existente.
  * Ej: `https://api.example.com/users/123` (con un cuerpo de usuario completo)
* **`PATCH`**: Para enviar datos y actualizar parcialmente un recurso existente.
  * Ej: `https://api.example.com/users/123` (con un cuerpo de usuario parcial)
* **`DELETE`**: Para eliminar un recurso.
  * Ej: `https://api.example.com/users/123`

### 3.2. URL y Parámetros (Query Params)

* Introduce la URL del endpoint en la barra de direcciones.
* Para parámetros de consulta (`?key=value`):
  * Escribe directamente en la URL.
  * Usa la pestaña **`Params`** debajo de la URL (recomendado, maneja la codificación URL).
  * Ej: `q=nodejs&limit=10` se convierte en `?q=nodejs&limit=10`.

### 3.3. Encabezados (Headers)

* Usa la pestaña **`Headers`**.
* **Comunes**:
  * `Content-Type`: `application/json`, `application/x-www-form-urlencoded`, `multipart/form-data`, etc. (especifica el formato del cuerpo de la solicitud).
  * `Authorization`: Para tokens de autenticación (ej. `Bearer <token>`, `Basic <base64_cred>`).
  * `Accept`: `application/json`, `text/xml`, etc. (especifica el formato de respuesta preferido).
  * `User-Agent`: Información sobre el cliente que realiza la solicitud.

### 3.4. Cuerpo de la Solicitud (Body) - Para POST, PUT, PATCH

* Usa la pestaña **`Body`**.
* **Opciones**:
  * **`none`**: No enviar cuerpo (para GET, DELETE).
  * **`form-data`**: Para enviar datos de formulario tipo `multipart/form-data`. Útil para subir archivos o enviar datos mixtos.
    * Puedes añadir pares clave-valor y especificar el tipo (texto o archivo).
  * **`x-www-form-urlencoded`**: Para enviar datos de formulario simple codificados.
    * Similar a los parámetros de URL, pero en el cuerpo.
  * **`raw`**: Para enviar datos en formato crudo.
    * Selecciona el tipo: **`JSON`** (más común), XML, Text, HTML.
    * Ejemplo JSON:
      ```json
      {
        "name": "Nuevo Producto",
        "price": 99.99,
        "available": true
      }
      ```
  * **`binary`**: Para subir un solo archivo binario (ej. imagen, PDF).

### 3.5. Autorización (Authorization)

* Usa la pestaña **`Authorization`**.
* **Tipos comunes**:
  * **`No Auth`**: Sin autenticación.
  * **`Bearer Token`**: Para tokens JWT. Introduce el token en el campo `Token`. Postman añade `Authorization: Bearer <token>` al encabezado.
  * **`Basic Auth`**: Para credenciales de nombre de usuario y contraseña codificadas en Base64. Introduce `Username` y `Password`. Postman añade `Authorization: Basic <base64_cred>`.
  * **`API Key`**: Para claves API. Introduce `Key`, `Value` y si va `In` `Header` o `Query Params`.
  * **`OAuth 2.0`**: Para flujos de autenticación OAuth 2.0 (más complejo, Postman ayuda a gestionar tokens).

---

## 4. 🧰 Funcionalidades Avanzadas

### 4.1. Variables

* **Sintaxis**: Usa `{{variable_name}}` en cualquier parte de la solicitud (URL, encabezados, cuerpo, scripts).
* **Alcance (Scope)**:

  * **Global**: Accesible en todos los Workspaces. (Usar con precaución, puede ensuciar el entorno).
  * **Collection**: Definidas en una Colección, accesibles para todas las solicitudes dentro de esa Colección.
  * **Environment**: Definidas en un Entorno activo. Ideal para URLs base, credenciales de API.
  * **Data**: Variables cargadas desde un archivo CSV/JSON durante la ejecución de la Colección.
  * **Local**: Definidas en scripts, solo existen durante la ejecución de esa solicitud.
* **Definir Variables**:

  * En la pestaña `Environments` (para Entornos).
  * En la configuración de la Colección (para Colecciones).
  * En `Globals` (para Variables Globales).
  * En scripts usando `pm.environment.set("key", "value")`.

### 4.2. Scripts

* **`Pre-request Script`**: Se ejecuta **antes** de enviar la solicitud.
  * **Usos Comunes**:
    * Generar un timestamp o UUID.
    * Calcular un hash de firma.
    * Establecer variables de entorno o de colección dinámicamente.
    * Obtener un token de autenticación de otra solicitud.
  * **Ejemplo**:
    ```javascript
    pm.environment.set("timestamp", Date.now());
    pm.environment.set("random_id", pm.variables.replaceIn("{{$guid}}")); // Genera un GUID
    ```
* **`Test Script`**: Se ejecuta **después** de recibir la respuesta.
  * **Usos Comunes**:
    * Realizar aserciones sobre la respuesta (estado HTTP, cuerpo, encabezados).
    * Encadenar solicitudes (extraer datos de la respuesta y guardarlos como variables para la siguiente solicitud).
    * Registrar datos.
  * **Ejemplos de Asersiones**:
    ```javascript
    // Test de estado de respuesta
    pm.test("Status code is 200 OK", function () {
        pm.response.to.have.status(200);
    });

    // Test de cuerpo JSON
    pm.test("Response body contains user data", function () {
        const responseData = pm.response.json();
        pm.expect(responseData.name).to.eql("John Doe");
    });

    // Test de tiempo de respuesta
    pm.test("Response time is less than 200ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(200);
    });

    // Test de encabezados
    pm.test("Content-Type header is present", function () {
        pm.response.to.have.header("Content-Type");
        pm.response.to.have.header("Content-Type", "application/json; charset=utf-8");
    });
    ```
  * **Encadenamiento de Solicitudes (Chain Requests)**:
    ```javascript
    // En Test Script de una solicitud de Login
    const responseJson = pm.response.json();
    pm.environment.set("authToken", responseJson.token); // Guarda el token

    // En Pre-request Script de una solicitud protegida
    // pm.request.headers.add({ key: 'Authorization', value: `Bearer ${pm.environment.get('authToken')}` });
    ```

### 4.3. Colecciones

* **Organización**: Agrupa solicitudes relacionadas en carpetas.
* **Ejecutor de Colecciones (Collection Runner)**: Ejecuta todas las solicitudes en una colección (o carpeta) en orden, con la opción de usar archivos de datos CSV/JSON.
  * Acceso desde la barra lateral (icono de "Play").
  * Útil para pruebas de regresión, pruebas de carga básicas, o flujos de trabajo de API.
* **Ejecuciones Programadas (Monitors)**: Programa ejecuciones de colecciones en la nube de Postman.

### 4.4. Entornos

* Permiten cambiar rápidamente entre conjuntos de variables (ej. `dev_url`, `prod_url`, `dev_api_key`, `prod_api_key`).
* Selecciona el entorno activo en el desplegable en la parte superior derecha.

---

## 5. 🤝 Colaboración y Compartir

* **Workspaces**: Crea Workspaces personales o de equipo para organizar proyectos.
* **Compartir Colecciones/Entornos**: Exporta colecciones (JSON) para compartir con otros, o usa las funciones de colaboración en la nube de Postman.
* **Generar Documentación**: Postman puede generar documentación interactiva a partir de tus colecciones, lo que facilita que otros desarrolladores entiendan y usen tus APIs.

---

## 6. 💡 Consejos y Mejores Prácticas

* **Organiza tus Colecciones**: Usa carpetas, nombres claros y descripciones detalladas para mantener tus colecciones ordenadas y comprensibles.
* **Usa Variables en Todas Partes**: Esto hace que tus solicitudes sean flexibles y reutilizables en diferentes entornos.
* **Escribe Pruebas Completas**: Las pruebas automáticas son esenciales para verificar la funcionalidad y la integridad de tu API.
* **Aprovecha los Entornos**: Crea entornos separados para desarrollo, staging y producción.
* **Documenta tus Solicitudes**: Usa la pestaña `Documentation` de cada solicitud/colección para añadir descripciones detalladas, ejemplos y cualquier nota importante.
* **No Hardcodees Secretos**: Nunca guardes credenciales sensibles (claves API, contraseñas) directamente en las solicitudes o variables compartidas de colecciones. Usa variables de entorno o variables secretas de Postman Vault si trabajas en equipo.
* **Comienza con `pm.test()`**: Empieza a escribir tus pruebas añadiendo `pm.test("Mi prueba", function () { ... });` para estructurarlas mejor.
* **Usa Newman para CI/CD**: Integra las pruebas de tu colección en tu pipeline de Integración Continua/Despliegue Continuo (CI/CD) utilizando Newman.

---

Este cheatsheet te proporciona una referencia completa y concisa de Postman, cubriendo sus conceptos esenciales, la creación de solicitudes, las funciones avanzadas y las mejores prácticas para trabajar eficazmente con APIs.
