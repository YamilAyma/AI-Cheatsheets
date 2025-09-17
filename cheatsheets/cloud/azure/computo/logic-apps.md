

---

# 🔄 Azure Logic Apps Cheatsheet Completo 🔄

**Azure Logic Apps** es un servicio de integración sin servidor (serverless) y de plataforma como servicio (PaaS) en Azure que permite a los desarrolladores y profesionales de TI crear, programar y automatizar flujos de trabajo (workflows) que integran aplicaciones, datos, servicios y sistemas, ya sea en la nube o en entornos locales.

---

## 1. 🌟 Conceptos Clave

* **Workflow (Flujo de Trabajo)**: La secuencia de pasos que define un proceso de negocio. Es el componente principal en Logic Apps.
* **Trigger (Disparador)**: El primer paso en cualquier workflow. Inicia una nueva instancia del workflow en respuesta a un evento (ej. una solicitud HTTP, un nuevo correo electrónico, un mensaje en una cola).
* **Action (Acción)**: Cada paso en el workflow después del disparador. Las acciones ejecutan una operación (ej. enviar un correo, crear un archivo, llamar a una API, transformar datos).
* **Connector (Conector)**: Un componente preconstruido que actúa como un wrapper alrededor de una API de servicio (ej. Office 365, Salesforce, Twitter, Azure Blob Storage, SQL Server). Proporciona disparadores y acciones listos para usar.
* **Run (Ejecución)**: Una instancia de un workflow que ha sido ejecutada.
* **Sin Servidor (Serverless)**: No necesitas aprovisionar ni gestionar servidores. Azure gestiona el escalado y la infraestructura.
* **Expresiones de Workflow**: Funciones similares a las de Excel para manipular datos, realizar conversiones, operaciones lógicas y más dentro de un workflow.
* **Conexiones de API**: Recursos de Azure que almacenan las credenciales de conexión para los conectores.
* **Integration Account (Cuenta de Integración)**: (Para escenarios B2B/EDI) Un recurso de Azure para almacenar artefactos de integración empresarial (esquemas, mapas, partners).

---

## 2. 🛠️ Tipos de Logic Apps

* **Logic App (Consumption)**:
  * **Entorno**: Multi-inquilino (multi-tenant).
  * **Facturación**: Pago por ejecución (trigger, action, connector).
  * **Conectores**: Acceso a la gran mayoría de conectores gestionados por Azure.
  * **Escalado**: Automático.
  * **Ideal para**: Flujos de trabajo sencillos, integración de SaaS, prototipos.
* **Logic App (Standard)**:
  * **Entorno**: Inquilino único (single-tenant), se ejecuta en un plan de App Service o Workflow Standard.
  * **Facturación**: Basada en un plan de hospedaje (similar a App Service).
  * **Conectores**: Incluye conectores "built-in" (ej. Service Bus, SQL, Blob Storage) que se ejecutan en el mismo proceso y ofrecen mayor rendimiento y menor latencia.
  * **Ideal para**: Flujos de trabajo de alto rendimiento, baja latencia, integración con VNet, y mayor control sobre la configuración.

---

## 3. 📝 Disparadores Comunes (Triggers)

Los disparadores inician el workflow.

* **Request (Solicitud HTTP)**:
  * **`When a HTTP request is received`**: El disparador más común para crear APIs y webhooks.
* **Schedule (Programación)**:
  * **`Recurrence`**: Ejecuta el workflow en un cronograma (ej. cada hora, diariamente, etc.).
* **Service-based (Basados en Servicios)**:
  * **Office 365 Outlook**: `When a new email arrives`.
  * **Azure Blob Storage**: `When a blob is added or modified`.
  * **Azure Queues**: `When a message is available in a queue`.
  * **Azure Service Bus**: `When a message is received in a queue/topic`.
  * **Salesforce**: `When a record is created`.
  * **Twitter**: `When a new tweet is posted`.

---

## 4. 🔗 Acciones Comunes (Actions)

Las acciones ejecutan operaciones.

* **Control Flow (Flujo de Control)**:
  * **`Condition`**: Bifurca el workflow basándose en una condición (if/else).
  * **`Switch`**: Bifurca el workflow basándose en el valor de una expresión (switch/case).
  * **`For each`**: Itera sobre los elementos de un array.
  * **`Until`**: Repite acciones hasta que una condición sea verdadera.
  * **`Scope`**: Agrupa acciones para implementar manejo de errores a nivel de bloque (try/catch).
  * **`Terminate`**: Detiene la ejecución del workflow.
* **Data Operations (Operaciones de Datos)**:
  * **`Compose`**: Crea una única salida a partir de múltiples entradas. Útil para construir objetos JSON o cadenas.
  * **`Parse JSON`**: Parsea un string JSON en tokens de datos con un esquema JSON.
  * **`Select`**: Crea un array de objetos JSON a partir de otro array, seleccionando y transformando propiedades.
  * **`Filter array`**: Filtra un array basándose en una condición.
  * **`Join`**: Une los elementos de un array en una cadena con un delimitador.
* **Service-based (Basadas en Servicios)**:
  * **Office 365 Outlook**: `Send an email`.
  * **Azure Blob Storage**: `Create blob`, `Get blob content`.
  * **SQL Server**: `Execute a SQL query`, `Get rows`.
  * **HTTP**: `HTTP` (realiza una solicitud HTTP a cualquier endpoint).
  * **Azure Functions**: `Call an Azure Function`.

---

## 5. 🚀 Desarrollo y Gestión

### 5.1. Herramientas de Desarrollo

* **Azure Portal**: El diseñador visual de Logic Apps es la forma más común de construir y gestionar workflows.
* **Visual Studio Code**: Extensión "Azure Logic Apps (Standard)" para desarrollo local.
* **Visual Studio**: Soporte para proyectos de Logic Apps.

### 5.2. Código Subyacente (`Code View`)

* Cada Logic App se define en un formato JSON llamado **Workflow Definition Language (WDL)**.
* Puedes ver y editar el JSON directamente en el `Code View` del diseñador.

### 5.3. Expresiones de Workflow

* Utilizadas para manipular datos dentro de los workflows.
* **Sintaxis**: `@functionName(parameters)`
* **Categorías**:
  * **String Functions**: `concat()`, `substring()`, `replace()`, `toLower()`, `toUpper()`, `split()`, `trim()`.
  * **Collection Functions**: `length()`, `first()`, `last()`, `union()`, `intersection()`.
  * **Logical Comparison Functions**: `equals()`, `greater()`, `less()`, `and()`, `or()`, `not()`.
  * **Conversion Functions**: `int()`, `string()`, `json()`, `xml()`, `base64()`.
  * **Date and Time Functions**: `utcNow()`, `formatDateTime()`, `addToTime()`, `subtractFromTime()`.

---

## 6. 🔒 Seguridad y Gobernanza

* **Autenticación de Triggers**:
  * **SAS (Shared Access Signature)**: El trigger HTTP genera una URL con una firma SAS.
  * **Azure AD OAuth**: Protege los triggers HTTP con autenticación de Azure AD.
* **Autenticación de Conectores**:
  * Gestionada a través de **API Connections**, que almacenan las credenciales de forma segura.
  * Soporta OAuth, claves de API, autenticación básica, identidades gestionadas.
* **Managed Identities (Identidades Gestionadas)**:
  * **Recomendado**: Permite a tu Logic App autenticarse con otros servicios de Azure que soportan Azure AD sin necesidad de almacenar credenciales.
* **Control de Acceso (RBAC)**: Usa RBAC para controlar quién puede crear, editar y gestionar Logic Apps.
* **Redes**:
  * **Integration Service Environment (ISE)**: (Legado) Un entorno privado y aislado para Logic Apps.
  * **Logic App (Standard)**: Permite la integración con VNet para acceder a recursos privados.

---

## 7. 📈 Monitoreo y Diagnóstico

* **Runs history (Historial de Ejecuciones)**:
  * Visor en el Azure Portal que muestra el historial de cada ejecución del workflow.
  * Puedes ver las entradas y salidas de cada paso, la duración y los errores.
* **Azure Monitor**:
  * **Metrics**: Métricas de rendimiento (ejecuciones iniciadas, completadas, fallidas, latencia).
  * **Logs**: Los logs de diagnóstico se pueden enviar a Log Analytics.
* **Alerts (Alertas)**: Configura alertas en Azure Monitor para notificar sobre fallos en el workflow.

---

## 8. 💡 Buenas Prácticas y Consejos

* **Modulariza tus Flujos de Trabajo**: Para flujos complejos, divídelos en Logic Apps más pequeñas y reutilizables que se pueden llamar entre sí.
* **Manejo de Errores**:
  * Utiliza `Scopes` para agrupar acciones y configurar acciones de "run after" para manejar fallos (similar a un `try-catch`).
  * Configura políticas de reintento (`retry policy`) en las acciones para manejar errores transitorios.
* **Nombres Descriptivos**: Usa nombres claros y consistentes para tus disparadores, acciones y conexiones.
* **Paralelismo**: Ejecuta acciones en paralelo cuando no dependan unas de otras para acelerar tus flujos de trabajo.
* **Manejo de Datos Grandes**: Para procesar grandes cantidades de datos, utiliza `For each` con el control de concurrencia activado o patrones de "debatching".
* **Infraestructura como Código (IaC)**: Define tus Logic Apps usando ARM Templates o Bicep para despliegues consistentes y reproducibles.
* **Usa `Parse JSON`**: Cuando trabajes con cuerpos de respuesta de API, usa la acción `Parse JSON` con un esquema para obtener tokens de datos tipados y fáciles de usar en los siguientes pasos.
* **Seguridad**:
  * Protege tus triggers HTTP.
  * Utiliza identidades gestionadas para la autenticación con otros servicios de Azure.
  * Almacena secretos en Azure Key Vault.
* **Costos (Consumption Plan)**: Sé consciente del número de ejecuciones de acciones y conectores, ya que impactan directamente en el costo.
* **Cuándo usar Logic Apps vs. Azure Functions**:
  * **Logic Apps**: Ideal para orquestación de servicios, integración de APIs y flujos de trabajo con muchos conectores preconstruidos (enfoque "low-code").
  * **Azure Functions**: Ideal para lógica de negocio compleja, transformaciones de datos intensivas en código y cuando necesitas control total sobre el entorno de ejecución (enfoque "code-first").
  * **Híbrido**: A menudo se usan juntas. Logic Apps orquesta el flujo y llama a Azure Functions para la lógica de negocio.

---

Este cheatsheet te proporciona una referencia completa de Azure Logic Apps, cubriendo sus conceptos esenciales, tipos de planes, disparadores y acciones comunes, desarrollo, seguridad, monitoreo y las mejores prácticas para construir flujos de trabajo de integración y automatización sin servidor en Microsoft Azure.
