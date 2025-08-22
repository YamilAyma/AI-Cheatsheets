
# 🔗 APIs (Application Programming Interfaces) Cheatsheet Completo 🔗

Una **API (Application Programming Interface)** es un conjunto de reglas, protocolos y herramientas que permite que diferentes aplicaciones de software se comuniquen entre sí. Actúa como un contrato que define cómo un sistema puede solicitar funcionalidades o datos a otro sistema.

---

## 1. 🌟 Conceptos Clave

* **Abstracción**: Una API esconde la complejidad interna de un sistema y expone solo las funcionalidades necesarias.
* **Contrato**: Una API define un contrato estricto sobre cómo se deben hacer las solicitudes y cómo serán las respuestas.
* **Cliente y Servidor**: En una interacción API, hay un **cliente** (la aplicación que hace la solicitud) y un **servidor** (la aplicación que recibe la solicitud y proporciona la respuesta).
* **Stateless (Sin Estado)**: En muchas APIs modernas (especialmente RESTful), cada solicitud del cliente al servidor contiene toda la información necesaria para entender la solicitud. El servidor no almacena ninguna información de sesión entre solicitudes.
* **Endpoint**: Una URL específica a la que se envía una solicitud para acceder a un recurso o función particular.

---

## 2. 🌐 Tipos Comunes de APIs

### 2.1. REST (Representational State Transfer) - ¡El más popular!

* **Principios**: Sigue 6 principios arquitectónicos:
  1. **Client-Server**: Separación de preocupaciones.
  2. **Stateless**: Cada solicitud es independiente.
  3. **Cacheable**: Las respuestas pueden ser cacheables para mejorar el rendimiento.
  4. **Layered System**: Permite usar proxies, balanceadores de carga, etc.
  5. **Uniform Interface**: Conjunto consistente de interfaces (recursos, métodos HTTP).
  6. **Code on Demand (Opcional)**: El servidor puede extender la funcionalidad del cliente enviando código.
* **Recursos**: Todo se trata como un recurso (ej. un usuario, un producto), identificado por una URL (URI). Los recursos son sustantivos.
* **Métodos HTTP (Verbos)**: Utiliza métodos HTTP estándar para realizar operaciones en los recursos:
  * `GET`: Obtener un recurso o una colección de recursos. (Idempotente y Seguro)
  * `POST`: Crear un nuevo recurso. (No Idempotente, No Seguro)
  * `PUT`: Actualizar completamente un recurso existente o crear uno si no existe. (Idempotente, No Seguro)
  * `PATCH`: Actualizar parcialmente un recurso existente. (No Idempotente, No Seguro)
  * `DELETE`: Eliminar un recurso. (Idempotente, No Seguro)
* **Formatos de Datos**: Principalmente JSON, pero también XML, texto plano.
* **Cuándo usar**: Aplicaciones web, móviles, APIs públicas, microservicios.

### 2.2. SOAP (Simple Object Access Protocol)

* **Protocolo**: Un protocolo basado en XML para intercambiar información estructurada.
* **Estricto**: Es muy estricto en su estructura y reglas.
* **WSDL (Web Services Description Language)**: Archivo XML que describe la API (operaciones, parámetros, tipos de datos).
* **Transporte**: Puede usar HTTP, SMTP, TCP, etc. (aunque HTTP es común).
* **Cuándo usar**: Aplicaciones empresariales, sistemas heredados, entornos que requieren transacciones ACID o seguridad de nivel empresarial. Menos flexibilidad, pero mayor formalidad.

### 2.3. GraphQL

* **Lenguaje de Consulta**: Un lenguaje de consulta para APIs y un runtime para satisfacer esas consultas con tus datos existentes.
* **Single Endpoint**: Generalmente, solo un endpoint HTTP (`POST /graphql`).
* **Cliente Define Datos**: El cliente especifica exactamente qué datos necesita, lo que reduce el "over-fetching" (obtener más datos de los necesarios) y el "under-fetching" (tener que hacer múltiples solicitudes).
* **Tipado Fuerte**: Requiere un esquema que define los tipos de datos disponibles en la API.
* **Cuándo usar**: Aplicaciones con necesidades de datos complejas, microservicios que necesitan agregación, aplicaciones móviles donde el ancho de banda es crítico.

### 2.4. gRPC (Google Remote Procedure Call)

* **Framework RPC**: Un framework de llamada a procedimiento remoto (RPC) de alto rendimiento y código abierto.
* **HTTP/2**: Utiliza HTTP/2 para el transporte subyacente, permitiendo streaming bidireccional y multiplexing.
* **Protocol Buffers**: Utiliza Protocol Buffers (protobuf) para serializar datos, que es más eficiente y compacto que JSON/XML.
* **Multi-lenguaje**: Genera código cliente y servidor en múltiples lenguajes a partir de un archivo de definición de servicio (`.proto`).
* **Cuándo usar**: Microservicios internos, sistemas de alto rendimiento, comunicación entre servicios en entornos polyglot.

---

## 3. 🔄 El Ciclo de Solicitud-Respuesta HTTP (para APIs REST/GraphQL/gRPC)

1. **Cliente envía una Solicitud**: Contiene todos los detalles de lo que el cliente quiere.
2. **Servidor recibe la Solicitud**: Procesa la solicitud.
3. **Servidor envía una Respuesta**: Contiene el resultado de la solicitud.

### 3.1. Anatomía de una Solicitud (Request)

* **Método HTTP (Verbo)**: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`.
* **Endpoint / URL**: La dirección del recurso.
  * Ej: `https://api.example.com/users/123`
* **Headers (Encabezados)**: Metadatos sobre la solicitud.
  * `Content-Type`: El formato del cuerpo de la solicitud (ej. `application/json`, `application/x-www-form-urlencoded`).
  * `Accept`: El formato de respuesta que el cliente prefiere (ej. `application/json`).
  * `Authorization`: Credenciales de autenticación (ej. `Bearer <token>`, `Basic <base64_cred>`).
  * `User-Agent`: Información sobre el cliente.
* **Body (Cuerpo / Payload)**: Los datos enviados con la solicitud (para `POST`, `PUT`, `PATCH`).
  * Ej: `{ "name": "Alice", "email": "alice@example.com" }` (JSON)

### 3.2. Anatomía de una Respuesta (Response)

* **Status Code (Código de Estado HTTP)**: Indica el resultado de la solicitud.
  * **1xx (Informativo)**: Solicitud recibida, proceso continuando.
  * **2xx (Éxito)**: La solicitud fue recibida, entendida y aceptada.
    * `200 OK`: Éxito general para GET, PUT, PATCH.
    * `201 Created`: Nuevo recurso creado (para POST).
    * `204 No Content`: Solicitud exitosa, pero sin cuerpo de respuesta (para DELETE).
  * **3xx (Redirección)**: Se necesita una acción adicional para completar la solicitud.
    * `301 Moved Permanently`: Recurso movido permanentemente.
    * `302 Found`: Recurso encontrado temporalmente.
  * **4xx (Error del Cliente)**: La solicitud contiene sintaxis incorrecta o no puede ser cumplida.
    * `400 Bad Request`: Solicitud mal formada.
    * `401 Unauthorized`: Autenticación necesaria o fallida.
    * `403 Forbidden`: El cliente no tiene permisos para acceder al recurso.
    * `404 Not Found`: El recurso no existe.
    * `405 Method Not Allowed`: Método HTTP no permitido para el recurso.
    * `409 Conflict`: Conflicto con el estado actual del recurso (ej. intentar crear un recurso que ya existe).
    * `429 Too Many Requests`: Demasiadas solicitudes en un período de tiempo.
  * **5xx (Error del Servidor)**: El servidor falló al cumplir una solicitud aparentemente válida.
    * `500 Internal Server Error`: Error genérico del servidor.
    * `502 Bad Gateway`: Servidor actuando como gateway recibió una respuesta inválida.
    * `503 Service Unavailable`: Servidor no está listo para manejar la solicitud.
* **Headers (Encabezados)**: Metadatos sobre la respuesta.
  * `Content-Type`: El formato del cuerpo de la respuesta.
  * `Cache-Control`: Instrucciones de caching.
  * `Location`: Para respuestas `201 Created` (URL del nuevo recurso).
* **Body (Cuerpo / Payload)**: Los datos devueltos por el servidor.
  * Ej: `{ "id": 123, "name": "Alice" }` (JSON)

---

## 4. 🔒 Seguridad en APIs

* **Autenticación (Authentication)**: Verifica la identidad del cliente (¿Quién eres?).
  * **API Keys**: Claves secretas únicas para identificar aplicaciones. (Simple, pero menos seguro).
  * **Basic Auth**: Envía credenciales de usuario/contraseña codificadas en Base64. (No se recomienda para uso público sin HTTPS).
  * **OAuth 2.0**: Framework para delegar la autenticación. Permite que aplicaciones de terceros accedan a recursos de usuario sin compartir credenciales directas. (Ej. "Iniciar sesión con Google/Facebook").
    * **Bearer Token**: El tipo más común de token OAuth 2.0 (ej. JWT). Un token opaco que se envía en el encabezado `Authorization: Bearer <token>`.
  * **JWT (JSON Web Tokens)**: Tokens autocontenidos y firmados que verifican la autenticidad y la integridad. Pueden contener información del usuario (claims).
* **Autorización (Authorization)**: Determina qué puede hacer un cliente autenticado (¿Qué tienes permiso para hacer?).
  * **Roles**: Asigna roles a los usuarios (ej. "admin", "usuario_básico") y define permisos para esos roles.
  * **Permisos (Scopes)**: Define permisos granulares (ej. `read:products`, `write:users`).

---

## 5. 🏗️ Diseño y Buenas Prácticas de APIs RESTful

* **Recursos Centrados (Nouns, not Verbs)**: Utiliza sustantivos para tus rutas (ej. `/users`, `/products`), no verbos (ej. `/getUsers`).
* **Utiliza Plurales para Colecciones**: `/products` para todos los productos, `/users/123` para un usuario específico.
* **Anidamiento Lógico para Relaciones**: `/users/123/orders` (órdenes del usuario 123).
* **Versioning (Versionado)**: Incluye la versión de la API en la URL (ej. `/v1/users`) o en los encabezados para manejar cambios a lo largo del tiempo.
* **Errores Significativos**: Devuelve códigos de estado HTTP apropiados y cuerpos de respuesta con mensajes de error claros y consistentes.
* **Paginación, Filtrado y Ordenación**: Para colecciones grandes, permite al cliente controlar los resultados (ej. `/products?limit=10&offset=20&sort=price,desc&category=electronics`).
* **Documentación**: Una documentación de API clara y actualizada es CRUCIAL. OpenAPI (Swagger) es el estándar.
* **Idempotencia**: Diseña operaciones `PUT` y `DELETE` para que sean idempotentes (múltiples solicitudes idénticas tienen el mismo efecto que una sola). `POST` no suele serlo.
* **HTTPS**: Siempre usa HTTPS para todas las comunicaciones de API para cifrar los datos en tránsito.

---

## 6. 🧰 Herramientas Comunes para Trabajar con APIs

* **Postman / Insomnia**: Clientes de API GUI para construir, enviar y probar solicitudes HTTP.
* **cURL**: Herramienta de línea de comandos para transferir datos con URLs, muy utilizada para probar APIs.
  * `curl -X GET https://api.example.com/users`
  * `curl -X POST -H "Content-Type: application/json" -d '{"name":"NewUser"}' https://api.example.com/users`
* **Swagger UI / Redoc**: Herramientas para generar documentación interactiva a partir de especificaciones OpenAPI.
* **Swagger Editor**: Editor basado en navegador para escribir y validar especificaciones OpenAPI.
* **SDKs (Software Development Kits)**: Bibliotecas de cliente específicas de lenguaje proporcionadas por los proveedores de API para facilitar el consumo de su API.
* **Web Browsers**: Pueden realizar solicitudes `GET` directamente en la barra de direcciones.
* **Librerías HTTP**:
  * **JavaScript (Frontend)**: `fetch API`, `Axios`.
  * **Python**: `requests`.
  * **Java**: `HttpClient` (Java 11+), `OkHttp`.
  * **Node.js**: `http/https` (core), `Axios`.
  * **C#**: `HttpClient`.

---

Este cheatsheet te proporciona una referencia completa de las APIs, cubriendo sus conceptos esenciales, los tipos más comunes, el ciclo de solicitud-respuesta, aspectos de seguridad y las mejores prácticas para diseñarlas y consumirlas de manera efectiva.
