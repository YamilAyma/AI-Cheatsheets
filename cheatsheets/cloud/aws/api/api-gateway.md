

---

# 🚪 Amazon API Gateway Cheatsheet Completo 🚪

**Amazon API Gateway** es un servicio completamente gestionado que facilita a los desarrolladores la creación, publicación, mantenimiento, monitoreo y aseguramiento de APIs a cualquier escala. Permite que las aplicaciones cliente accedan a la funcionalidad de los servicios backend (Lambda, EC2, HTTP endpoints) de manera segura y eficiente.

---

## 1. 🌟 Conceptos Clave

* **API (Application Programming Interface)**: Un conjunto de endpoints, recursos y métodos que expone la funcionalidad de tu backend.
* **Endpoint de API**: Una URL específica a la que se envía una solicitud para acceder a un recurso o función particular.
* **Recurso (Resource)**: Una entidad lógica en tu API (ej. `/users`, `/products`).
* **Método (Method)**: Una operación HTTP (GET, POST, PUT, DELETE, PATCH) asociada a un recurso.
* **Integración (Integration)**: El backend al que API Gateway envía la solicitud (ej. una función Lambda, un endpoint HTTP, un servicio AWS).
* **Método de Integración**: El método HTTP utilizado por API Gateway para llamar al backend.
* **Mapeo (Mapping)**:
  * **Request Mapping (Mapeo de Solicitud)**: Transforma la solicitud entrante del cliente al formato que el backend espera.
  * **Response Mapping (Mapeo de Respuesta)**: Transforma la respuesta del backend al formato que el cliente espera.
* **Modelo de Datos (Data Model)**: Define la estructura del cuerpo de la solicitud/respuesta JSON utilizando JSON Schema.
* **Validación de Solicitudes (Request Validation)**: Valida la estructura del cuerpo de la solicitud, los parámetros de la ruta, los parámetros de la consulta y los encabezados contra un modelo definido.
* **Etapa (Stage)**: Una referencia lógica a un estado del API (ej. `dev`, `test`, `prod`). Cada etapa tiene su propia URL.
* **Despliegue (Deployment)**: La acción de "desplegar" tu API a una etapa específica para que sea accesible.
* **Autorizador (Authorizer)**: Un mecanismo para controlar el acceso a tus APIs (ej. Lambda Authorizer, Cognito User Pool, IAM).
* **Uso de Claves (Usage Plans)**: Para controlar el acceso de los clientes, establecer límites de tasa y cuotas.

---

## 2. 🛠️ Creación de una API (REST API)

### 2.1. Pasos Básicos

1. **Crear API**: Elige el tipo de API (REST API, HTTP API, WebSocket API, REST API privada). La **REST API** es la más tradicional y configurable. **HTTP API** es más nueva, más rápida y más barata para casos de uso básicos.
2. **Crear Recursos**: Define la estructura de tu URL (ej. `/users`, `/products`).
3. **Crear Métodos**: Para cada recurso, define los métodos HTTP (GET, POST, PUT, DELETE).
4. **Configurar la Integración**: Conecta el método a un backend.

### 2.2. Configuración de un Método y su Integración

Para cada método HTTP en un recurso:

1. **Tipo de Integración**:

   * **Lambda Function**: Invoca una función Lambda.
     * **Uso**: Para backends sin servidor (Serverless). **¡Muy común!**
     * Configura el nombre/ARN de la función Lambda.
   * **HTTP**: Proxy a un endpoint HTTP externo.
     * **Uso**: Para servicios RESTful existentes, EC2, contenedores.
     * Configura la URL del endpoint.
   * **Mock**: Devuelve una respuesta simulada directamente desde API Gateway.
     * **Uso**: Para prototipos, desarrollo frontend sin backend.
   * **AWS Service**: Invoca directamente otros servicios de AWS (ej. DynamoDB, S3).
   * **VPC Link (Private Integration)**: Para integrar APIs privadas con backends en una VPC privada (ej. ALB, NLB, Cloud Map).
2. **Método de Integración**: El método HTTP que el Gateway usará para llamar al backend (puede ser diferente al método del cliente).
3. **Path Parameters (Parámetros de Ruta)**:

   * Sintaxis en la URL del recurso: `{paramName}` (ej. `/users/{userId}`).
   * Se pasan al backend como parte de la ruta o a través de mappings.
4. **Query String Parameters (Parámetros de Consulta)**:

   * Sintaxis en la URL del cliente: `?param=value`.
   * Se pueden pasar al backend como parte de la cadena de consulta o a través de mappings.
5. **Request Headers (Encabezados de Solicitud)**:

   * Se pueden pasar al backend a través de mappings.

---

## 3. 📝 Mapeos y Modelos (REST API)

Para transformar la entrada y salida de las solicitudes.

### 3.1. Modelos (Models)

* **Definición**: Un esquema JSON (JSON Schema) que define la estructura del cuerpo de la solicitud/respuesta.
* **Uso**: Para la validación de solicitudes y para generar SDKs de cliente.
* `application/json` es el `Content-Type` más común.

### 3.2. Mapeo de Solicitud (Request Mapping)

* **Templates (Plantillas de Mapeo)**: Utilizan la sintaxis **Apache Velocity Template Language (VTL)** para transformar el cuerpo, los parámetros y los encabezados de la solicitud entrante al formato que el backend espera.
* **Variables de Contexto VTL**: `$` (raíz del body), `$input` (para acceder a body, path, params, headers), `$context` (metadatos de API Gateway).
* **Ejemplo (JSON a JSON, añadiendo un campo):**
  ```json
  #set($inputRoot = $input.path('$').replaceAll('\\\\\'', ''))
  {
    "name": "$inputRoot.name",
    "age": $inputRoot.age,
    "requestId": "$context.requestId"
  }
  ```

### 3.3. Mapeo de Respuesta (Response Mapping)

* **Templates (Plantillas de Mapeo)**: Transforman la respuesta del backend al formato que el cliente espera.
* Se configuran por código de estado HTTP (ej. 200, 400, 500).
* **Ejemplo (Backend devuelve `{ "id": 1, "name": "Alice" }`, convertir a `{ "user_id": 1, "full_name": "Alice" }`):**
  ```json
  #set($inputRoot = $input.path('$').replaceAll('\\\\\'', ''))
  {
    "user_id": $inputRoot.id,
    "full_name": "$inputRoot.name"
  }
  ```

---

## 4. 🔒 Seguridad y Autorización

### 4.1. IAM Permissions (Permisos de IAM)

* **Uso**: Para proteger APIs que son accedidas por usuarios o servicios de AWS.
* **Autenticación**: El cliente debe firmar la solicitud con credenciales de IAM.
* **Autorización**: Basada en las políticas de IAM adjuntas al usuario/rol que realiza la solicitud.

### 4.2. Lambda Authorizer (Antiguo: Custom Authorizer)

* **Uso**: Una función Lambda que se invoca antes de la integración del backend para autenticar y autorizar la solicitud.
* **Tipo**:
  * **Request-based**: La función Lambda recibe encabezados, parámetros de consulta, etc.
  * **Token-based**: La función Lambda recibe un token del encabezado `Authorization`.
* Devuelve una política de IAM (allow/deny) y un contexto de autorización.
* **Cache**: La respuesta del autorizador puede ser cacheada para reducir invocaciones Lambda.

### 4.3. Amazon Cognito User Pool Authorizer

* **Uso**: Integración directa con Cognito User Pools para autenticar usuarios con tokens JWT.
* Valida automáticamente los tokens de identidad y acceso de Cognito.

### 4.4. Uso de Claves (API Keys) y Planes de Uso (Usage Plans)

* **API Key**: Una clave alfanumérica que los clientes incluyen en el encabezado `x-api-key`.
* **Usage Plan**:
  * Asocia API Keys a una etapa de API.
  * Define límites de tasa (Rate Limit) y cuotas (Quota) para el uso de la API.
  * **Rate Limit**: Máximo de solicitudes por segundo (RPS).
  * **Quota**: Número total de solicitudes permitidas en un período (ej. por mes).

---

## 5. 🧰 Características Adicionales

### 5.1. Almacenamiento en Caché (Caching)

* Habilita el caching en una etapa de API para almacenar en caché las respuestas de los métodos.
* Reduce la latencia y la carga en el backend.
* Configurable por tamaño de caché, tiempo de vida (TTL), y parametrización.

### 5.2. Limitación de Tasa (Throttling)

* Protege tu backend de un número excesivo de solicitudes.
* Configurable a nivel de etapa, método y plan de uso.

### 5.3. Validación de Solicitudes (Request Validation)

* Valida el cuerpo, los parámetros de ruta, consulta y encabezados de la solicitud contra un modelo JSON Schema.
* Devuelve un error 400 Bad Request si la validación falla, antes de invocar el backend.

### 5.4. Registros y Monitoreo (CloudWatch Logs & Metrics)

* API Gateway envía logs de acceso y ejecución a CloudWatch Logs.
* Métricas de CloudWatch para invocaciones, errores, latencia, integración, etc.
* **Caching**: Habilita el caching en una etapa de API para almacenar en caché las respuestas de los métodos.
* **Registros y Monitoreo (CloudWatch Logs & Metrics)**:
  * API Gateway envía logs de acceso y ejecución a CloudWatch Logs.
  * Métricas de CloudWatch para invocaciones, errores, latencia, integración, etc.

### 5.5. Versionado de API

* Crea nuevas etapas (ej. `v1`, `v2`) para desplegar diferentes versiones de tu API.
* Permite a los clientes migrar a nuevas versiones de forma controlada.

### 5.6. Despliegue de API Gateway

* Después de realizar cambios en tu API, debes crear un nuevo `Deployment` y asociarlo a una `Stage`.
* Cada `Deployment` es una instantánea de tu configuración de API.

---

## 6. 💡 Buenas Prácticas y Consejos

* **HTTP API vs. REST API**: Para APIs simples, menos configurables y de bajo costo, usa HTTP API. Para control granular, mapeos, validación y características avanzadas, usa REST API.
* **IAM Roles para Integraciones**: Utiliza roles de IAM para que API Gateway tenga permisos para invocar tus backends (ej. Lambda, otros servicios AWS).
* **Manejo de Errores Consistente**: Configura plantillas de mapeo de respuesta para errores (ej. 4xx, 5xx) para proporcionar respuestas de error consistentes a tus clientes.
* **Validación de Solicitudes**: Habilítala para proteger tu backend de entradas inválidas.
* **Autorizadores para Seguridad**: Implementa Autorizadores (Lambda, Cognito) para la autenticación y autorización de tus APIs.
* **Uso de Claves y Planes de Uso**: Si ofreces APIs públicas o gestionas el acceso de terceros, implementa planes de uso para controlar el consumo.
* **Caching**: Habilita el caching para reducir la latencia y la carga en tus backends, especialmente para APIs de lectura intensiva.
* **Monitoreo Completo**: Configura logs de ejecución detallados en CloudWatch Logs y alarmas en CloudWatch Metrics.
* **Despliegue con IaC**: Utiliza CloudFormation o Terraform para definir y desplegar tus APIs de forma consistente.
* **Versión de API**: Utiliza el versionado de API (ej. `/v1/`, `/v2/`) y la gestión de etapas (`dev`, `prod`) para una gestión de ciclo de vida de API efectiva.
* **HTTPS Solamente**: API Gateway fuerza HTTPS, lo cual es una excelente práctica de seguridad.
* **Integración de `Lambda Proxy`**: Para una integración más sencilla con funciones Lambda, donde la Lambda gestiona la lógica de la solicitud/respuesta HTTP completa. El mapeo VTL es mínimo.

---

Este cheatsheet te proporciona una referencia completa de Amazon API Gateway, cubriendo sus conceptos esenciales, cómo crear y configurar APIs, mapeos, seguridad, características adicionales y las mejores prácticas para construir, publicar y gestionar APIs de manera eficiente y segura en AWS.
