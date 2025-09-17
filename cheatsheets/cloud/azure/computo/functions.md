
---

# ⚡ Azure Functions Cheatsheet Completo ⚡

**Azure Functions** es un servicio de computación sin servidor (serverless) y basado en eventos que te permite ejecutar pequeños fragmentos de código (llamados "funciones") en respuesta a eventos, sin necesidad de aprovisionar o gestionar servidores. Solo pagas por el tiempo de computación que consumes.

---

## 1. 🌟 Conceptos Clave

* **Sin Servidor (Serverless)**: No gestionas la infraestructura. Azure se encarga del escalado, la disponibilidad y el mantenimiento de los servidores.
* **Función (Function)**: Una unidad de código que se ejecuta en respuesta a un evento.
* **Disparador (Trigger)**: El evento que inicia la ejecución de una función. Cada función tiene exactamente un disparador.
* **Enlace (Binding)**: Una forma declarativa de conectar recursos de Azure (como Azure Blob Storage, Cosmos DB, Queue Storage, etc.) a tu función, ya sea como entrada (`input binding`) o como salida (`output binding`). Simplifican la interacción con los datos.
* **Aplicación de Función (Function App)**: La unidad principal de despliegue y gestión en Azure. Una Function App es un recurso que aloja y ejecuta tus funciones.
* **Plan de Hospedaje (Hosting Plan)**: Define cómo se asignan los recursos a tu Function App y cómo se escala.
* **Durable Functions**: Una extensión de Azure Functions para escribir funciones con estado (stateful) en un entorno sin servidor. Ideal para flujos de trabajo complejos y orquestaciones.
* **Proxies de Azure Functions**: (En desuso, se recomienda Azure API Management) Una forma de crear una superficie de API simplificada para tus funciones.

---

## 2. 🛠️ Planes de Hospedaje (Hosting Plans)

La elección del plan afecta el costo, el escalado y las funcionalidades disponibles.

* **Plan de Consumo (Consumption Plan)**:
  * **Sin Servidor (Serverless)**: Escala automáticamente en respuesta a la carga.
  * **Pago por Ejecución**: Solo pagas por el tiempo de ejecución y los recursos consumidos.
  * **Cold Starts**: Puede haber una latencia en la primera ejecución después de un período de inactividad.
  * **Ideal para**: Cargas de trabajo impredecibles, basadas en eventos, APIs con tráfico variable.
* **Plan Premium (Premium Plan)**:
  * **Instancias Precalentadas (Pre-warmed instances)**: Evita los "cold starts".
  * **Funcionalidades Avanzadas**: Conectividad VNet, mayor tiempo de ejecución.
  * **Escalado Dinámico**: Escala automáticamente, pero con instancias siempre activas.
  * **Ideal para**: Aplicaciones con requisitos de alto rendimiento y sin tolerancia a cold starts.
* **Plan de App Service (Dedicated Plan)**:
  * Ejecuta tus funciones en el mismo plan de App Service que tus aplicaciones web.
  * **Escalado Manual o Automático**: Controlas el escalado.
  * **Ideal para**: Aplicaciones con cargas de trabajo predecibles y constantes, o para reutilizar un plan de App Service existente.

---

## 3. 📝 Disparadores Comunes (Triggers)

Cada función tiene un solo disparador.

* **HTTP Trigger**:
  * **Evento**: Una solicitud HTTP.
  * **Uso**: Construir APIs RESTful sin servidor.
* **Timer Trigger**:
  * **Evento**: Un cronograma definido (expresión CRON).
  * **Uso**: Tareas programadas (ej. limpieza nocturna, generación de informes).
* **Queue Storage Trigger**:
  * **Evento**: Un nuevo mensaje en una cola de Azure Queue Storage.
  * **Uso**: Procesamiento de tareas en segundo plano.
* **Blob Storage Trigger**:
  * **Evento**: Un nuevo blob (archivo) creado o actualizado en un contenedor de Azure Blob Storage.
  * **Uso**: Procesamiento de imágenes, archivos de log, ETL.
* **Service Bus Trigger**:
  * **Evento**: Un nuevo mensaje en una cola o tema de Azure Service Bus.
  * **Uso**: Sistemas de mensajería, desacoplamiento de microservicios.
* **Cosmos DB Trigger**:
  * **Evento**: Un documento creado o actualizado en una colección de Azure Cosmos DB.
  * **Uso**: Reacciones en tiempo real a cambios en la base de datos (ej. enviar notificaciones).
* **Event Grid Trigger**:
  * **Evento**: Un evento de Azure Event Grid.
  * **Uso**: Arquitecturas basadas en eventos altamente reactivas.
* **Event Hubs Trigger**:
  * **Evento**: Un evento en un Azure Event Hub.
  * **Uso**: Ingesta de datos de telemetría y streaming a gran escala.

---

## 4. 🔗 Enlaces Comunes (Bindings)

Una función puede tener múltiples enlaces de entrada y salida, pero solo un disparador.

### 4.1. Enlaces de Entrada (Input Bindings)

* **Propósito**: Obtener datos de una fuente externa y pasarlos como argumentos a la función.
* **Ejemplos**:
  * **Blob Storage Input**: Lee el contenido de un blob.
  * **Table Storage Input**: Lee una o más entidades de Azure Table Storage.
  * **Cosmos DB Input**: Lee uno o más documentos de Cosmos DB.

### 4.2. Enlaces de Salida (Output Bindings)

* **Propósito**: Enviar datos desde la función a una fuente externa.
* **Ejemplos**:
  * **Queue Storage Output**: Escribe un mensaje en una cola.
  * **Blob Storage Output**: Escribe un blob.
  * **Service Bus Output**: Escribe un mensaje en una cola o tema de Service Bus.
  * **Twilio Output**: Envía un SMS.
  * **SendGrid Output**: Envía un correo electrónico.

---

## 5. 🚀 Desarrollo y Despliegue

### 5.1. Herramientas de Desarrollo

* **Azure Functions Core Tools (CLI)**: Para desarrollo, pruebas y despliegue local.
  ```bash
  func init MyFunctionApp --worker-runtime dotnet # O node, python, java
  cd MyFunctionApp
  func new --name MyHttpTrigger --template "HTTP trigger"
  func start # Ejecutar localmente
  func azure functionapp publish MyFunctionApp # Desplegar a Azure
  ```
* **Visual Studio Code**: Excelente extensión para Azure Functions.
* **Visual Studio**: Soporte completo para desarrollo de funciones en C#.

### 5.2. `function.json` (Archivo de Configuración)

* Define los disparadores y enlaces para una función.

```json
{
  "scriptFile": "index.js",
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [ "get", "post" ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### 5.3. `local.settings.json`

* Contiene la configuración local de la aplicación (cadenas de conexión, claves de API). **¡No lo subas a tu repositorio de Git!**
* Se replica en la configuración de la Function App en Azure.

### 5.4. `host.json`

* Contiene la configuración global para todas las funciones en una Function App (ej. logging, timeouts, políticas de reintento).

---

## 6. 📝 Ejemplo de Código (Node.js - HTTP Trigger con Bindings)

```javascript
// HttpTrigger/index.js
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Leer del Input Binding (queueMessage viene de un Queue Storage Input)
    const messageFromQueue = context.bindings.queueMessage;

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Please pass a name in the query string or in the request body for a personalized response.";

    // Escribir al Output Binding (newQueueMessage va a un Queue Storage Output)
    context.bindings.newQueueMessage = "Processed: " + name;

    // Respuesta HTTP (output binding 'res' o '$return')
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
};

// HttpTrigger/function.json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    },
    {
      "name": "queueMessage",
      "type": "queue",
      "direction": "in",
      "queueName": "my-input-queue",
      "connection": "AzureWebJobsStorage" // Nombre de la app setting con la cadena de conexión
    },
    {
      "name": "newQueueMessage",
      "type": "queue",
      "direction": "out",
      "queueName": "my-output-queue",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```

---

## 7. 🔒 Seguridad

* **Niveles de Autorización (para HTTP Triggers)**:
  * `anonymous`: No requiere autenticación.
  * `function`: Requiere una clave de función.
  * `admin`: Requiere la clave maestra.
* **Identidades Gestionadas (Managed Identities)**: **Recomendado**. Permite a tu función autenticarse con otros servicios de Azure (ej. Key Vault, Storage) sin necesidad de almacenar credenciales en la configuración.
* **Azure Key Vault**: Para almacenar y gestionar secretos.
* **Integración con Azure AD (Microsoft Entra ID)**: Para proteger tus funciones con autenticación y autorización de Azure AD.

---

## 8. 📈 Monitoreo y Diagnóstico

* **Azure Monitor**:
  * **Application Insights**: (Recomendado) Para monitoreo de rendimiento de aplicaciones (APM), trazas de solicitudes, dependencias y excepciones.
  * **Logs**: Los logs de la función se envían a Azure Monitor Logs.
  * **Métricas**: Métricas de ejecución, uso de CPU/memoria.
* **Live Metrics Stream**: Observa el rendimiento de tu función en tiempo real.
* **Diagnóstico y resolución de problemas**: Herramienta en el Azure Portal que ayuda a identificar y solucionar problemas comunes.

---

## 9. 💡 Buenas Prácticas y Consejos

* **Funciones Pequeñas y de Propósito Único**: Cada función debe hacer una sola cosa y hacerla bien (Principio de Responsabilidad Única).
* **Sin Estado (Stateless)**: Diseña tus funciones para que sean sin estado, para que puedan escalar sin problemas. Para lógica con estado, utiliza **Durable Functions**.
* **Idempotencia**: Diseña tus funciones para que sean idempotentes (múltiples ejecuciones del mismo evento producen el mismo resultado), especialmente con disparadores de colas/eventos que pueden tener reintentos.
* **Minimiza las Dependencias**: Reduce el tamaño de tu paquete de despliegue para mejorar los "cold starts".
* **Inicialización Fuera del Handler**: Realiza inicializaciones costosas (ej. conexiones a bases de datos, clientes HTTP) fuera de la función principal (handler) para que se reutilicen entre invocaciones "calientes".
* **Manejo de Errores Robustos**: Implementa `try-catch` y maneja las excepciones. Configura políticas de reintento y colas de mensajes no procesados (dead-letter queues) para disparadores de colas.
* **Monitoreo con Application Insights**: Es la mejor manera de obtener visibilidad profunda del rendimiento y los errores de tus funciones.
* **Seguridad**:
  * Usa el nivel de autorización adecuado para tus HTTP Triggers.
  * Utiliza identidades gestionadas para el acceso a otros recursos de Azure.
  * Almacena los secretos en Azure Key Vault.
* **Infraestructura como Código (IaC)**: Usa Bicep, ARM Templates o Terraform para definir y desplegar tus Function Apps de forma consistente.

---

Este cheatsheet te proporciona una referencia completa de Azure Functions, cubriendo sus conceptos esenciales, planes de hospedaje, disparadores y enlaces comunes, desarrollo y despliegue, seguridad, monitoreo y las mejores prácticas para construir aplicaciones sin servidor eficientes y escalables en Microsoft Azure.
