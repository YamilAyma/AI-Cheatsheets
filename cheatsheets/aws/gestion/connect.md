

---

# 📞 Amazon Connect Cheatsheet Completo 📞

**Amazon Connect** es un servicio de centro de contacto basado en la nube que facilita la configuración y administración de un servicio de atención al cliente para tus clientes. Está diseñado para ser fácil de usar y altamente escalable, con un modelo de pago por uso, eliminando la necesidad de infraestructura física o contratos a largo plazo.

---

## 1. 🌟 Conceptos Clave

* **Instancia de Amazon Connect (Instance)**: Tu centro de contacto virtual. Un entorno aislado donde se configuran todos los aspectos de tu centro de contacto (flujos de contacto, agentes, colas, etc.).
* **Contact Flow (Flujo de Contacto)**: La lógica visualmente programada que define cómo se manejan las interacciones con los clientes (ej. IVR, ruteo a agentes, mensajes de bienvenida). Es el "cerebro" de tu centro de contacto.
* **Queue (Cola)**: Una ubicación donde los contactos (llamadas, chats) esperan a ser atendidos por un agente disponible. Los contactos se rutean a colas basándose en la lógica del Contact Flow.
* **Routing Profile (Perfil de Ruteo)**: Un conjunto de colas que un agente puede atender. Determina a qué contactos se le asigna un agente.
* **User (Usuario / Agente)**: Representa a un agente del centro de contacto que atiende a los clientes. Cada usuario tiene credenciales, un perfil de ruteo, un perfil de seguridad y configuraciones de teléfono/softphone.
* **Security Profile (Perfil de Seguridad)**: Define los permisos que un usuario o un grupo de usuarios tienen dentro de la instancia de Connect (ej. acceso a informes, a flujos, a la configuración).
* **Softphone / Contact Control Panel (CCP)**: La interfaz basada en navegador que usan los agentes para recibir y gestionar llamadas/chats.
* **Channel (Canal)**: Los tipos de interacción que soporta Connect. Principalmente Voz y Chat.
* **Lambda Functions**: Se integran con Contact Flows para lógica personalizada (ej. buscar información en una base de datos, integrarse con un CRM).
* **Contact Attributes**: Pares clave-valor que se asocian a un contacto y se propagan a través del Contact Flow. Se usan para tomar decisiones de ruteo, personalizar mensajes o mostrarlos al agente.

---

## 2. 🛠️ Configuración Inicial y Creación de Instancia

### 2.1. Crear una Instancia de Amazon Connect

1. **En la Consola de AWS**, ve a Amazon Connect.
2. Haz clic en `Add an instance`.
3. **Identity Management**:
   * `Store users in Amazon Connect` (más fácil para empezar).
   * `Link to an existing directory` (AD, SAML, Okta, etc., para integración empresarial).
4. **Admin User**: Crea un usuario administrador para la instancia.
5. **Telemetry**: Elige un bucket S3 para logs.
6. **Alias**: Un nombre único para tu instancia (ej. `my-company-contact-center`). La URL será `https://<alias>.awsapps.com/connect/`.
7. **S3 Bucket**: Un bucket S3 por defecto para grabación de llamadas y logs.
8. Haz clic en `Create instance`.

### 2.2. Iniciar Sesión en la Instancia

* Una vez creada, ve a la URL de tu instancia (ej. `https://<alias>.awsapps.com/connect/`).
* Inicia sesión con las credenciales del administrador.

---

## 3. 📝 Gestión de Usuarios y Perfiles

### 3.1. Users (Agentes)

* En la instancia de Connect, ve a `Users` -> `User management` -> `Add new user`.
* **Username, Password, First/Last Name**.
* **Routing Profile**: Asigna un perfil de ruteo.
* **Security Profile**: Asigna un perfil de seguridad.
* **Phone Type**:
  * `Softphone`: Recomendado, basado en navegador (CCP).
  * `Desk Phone`: Para teléfonos físicos (requiere SIP, etc.).

### 3.2. Routing Profiles (Perfiles de Ruteo)

* En la instancia de Connect, ve a `Routing` -> `Routing profiles` -> `Add new profile`.
* **Name, Description**.
* **Channels**: `Voice`, `Chat` (habilita y define la `Prioridad` y `Demora` del agente).
* **Queues**: Asigna las colas que los agentes con este perfil atenderán.
* **Default Outbound Queue**: La cola predeterminada para llamadas salientes.

### 3.3. Security Profiles (Perfiles de Seguridad)

* En la instancia de Connect, ve a `Users` -> `Security profiles`.
* Define permisos para categorías de usuarios (administradores, supervisores, agentes).
* **Permissions**: Granularidad sobre el acceso a informes, configuración de flujos, usuarios, etc.

---

## 4. 📞 Ruteo y Colas (Contact Flows & Queues)

### 4.1. Queues (Colas)

* En la instancia de Connect, ve a `Routing` -> `Queues` -> `Add new queue`.
* **Name, Description**.
* **Hours of Operation**: Horario de atención para la cola.
* **Queue Flow**: Un Contact Flow específico para esta cola (ej. "Gracias por esperar").
* **Outbound Caller ID**: Número de teléfono para llamadas salientes desde esta cola.

### 4.2. Contact Flows (Flujos de Contacto) - ¡El cerebro del centro de contacto!

* En la instancia de Connect, ve a `Routing` -> `Contact flows`.
* Utiliza un editor visual de arrastrar y soltar.
* **Bloques Comunes**:
  * **`Play prompt`**: Reproduce un mensaje de audio (texto a voz o archivo de audio).
  * **`Get customer input`**: Recopila la entrada del cliente (DTMF, voz).
  * **`Store customer input`**: Almacena la entrada del cliente en atributos de contacto.
  * **`Set contact attributes`**: Establece/modifica atributos de contacto.
  * **`Check contact attributes`**: Toma decisiones basándose en atributos de contacto.
  * **`Transfer to queue`**: Rutea el contacto a una cola específica.
  * **`Transfer to agent`**: Rutea directamente a un agente.
  * **`Invoke AWS Lambda function`**: Invoca una función Lambda para lógica personalizada.
  * **`Get customer input (Text to Speech)`**: Utiliza texto a voz para prompts.
  * **`Disconnect`**: Termina el contacto.
  * **`Set working queue`**: Asigna la cola a la que pertenece el contacto para métricas.
  * **`Loop`**: Crea bucles.
  * **`Set recording behavior`**: Inicia/detiene la grabación de llamadas.
  * **`Set voice`**: Cambia la voz de texto a voz.
  * **`Set speech recognition and sentiment`**: Habilita transcripción de voz y análisis de sentimiento.
* **Tipos de Contact Flows**:
  * `Inbound flow`: Para llamadas/chats entrantes.
  * `Customer queue flow`: Mensajes durante la espera en cola.
  * `Customer hold flow`: Mensajes durante la retención en espera.
  * `Customer whisper flow`: Mensaje que escucha el agente antes de hablar con el cliente.
  * `Outbound whisper flow`: Mensaje que escucha el agente al iniciar una llamada saliente.
  * `Outbound flow`: Para llamadas salientes programáticas.

---

## 5. 📞 Canales de Comunicación

### 5.1. Voz (Voice)

* **Números de Teléfono**: Puedes reclamar números de teléfono directamente en Connect o transferirlos.
* **IVR (Interactive Voice Response)**: Construido con `Get customer input` y `Play prompt` en Contact Flows.
* **Grabación de Llamadas**: Configurable en Contact Flows.

### 5.2. Chat

* **Configuración de Chat**: En la instancia de Connect, ve a `Channels` -> `Chat` -> `Add chat flow`.
* Se genera un snippet de código JavaScript/HTML que puedes incrustar en tu sitio web.
* **Chat Transcripts**: Las transcripciones de chat se pueden guardar en S3.

---

## 6. 🧰 Integraciones Comunes

* **AWS Lambda**: Para lógica avanzada en Contact Flows (ej. búsqueda en DB, invocación de APIs, traducción con Amazon Translate).
* **Amazon Lex**: Para construir chatbots conversacionales (IVR conversacional).
* **Amazon Polly**: Para texto a voz de alta calidad.
* **Amazon S3**: Para almacenamiento de grabaciones de llamadas, transcripciones de chat y logs.
* **Amazon Kinesis**: Para streaming de datos de contacto en tiempo real.
* **Amazon CloudWatch**: Para monitoreo de métricas y logs.
* **AWS Contact Lens**: Analítica de conversaciones (sentimiento, categorías de contacto).
* **CRM (Salesforce, Zendesk)**: Integración con CRM para proporcionar contexto al agente.

---

## 7. 📊 Análisis y Monitoreo

* **Informes en Tiempo Real**: Métricas de cola, estado de agentes, contactos en curso.
* **Informes Históricos**: Desempeño de agentes, volúmenes de contacto, tiempos de espera.
* **AWS CloudWatch**: Monitorea métricas clave (ej. `ContactFlowErrors`, `CallsAbandoned`, `QueueSize`). Configura alarmas.
* **CloudWatch Logs**: Los logs de Contact Flows se envían a CloudWatch Logs.

---

## 8. 💡 Buenas Prácticas y Consejos

* **Diseño de Contact Flows**:
  * **Empieza Simple**: Diseña flujos de contacto sencillos al principio y añade complejidad gradualmente.
  * **Manejo de Errores**: Incluye bloques de manejo de errores en tus flujos para proporcionar una experiencia de cliente robusta.
  * **Mensajes Claros**: Utiliza mensajes de voz y texto claros y concisos.
  * **Bucles y Salidas**: Asegúrate de que los clientes siempre tengan una forma de salir de un bucle o de ser transferidos a un agente.
* **Gestión de Agentes**:
  * **Perfiles de Ruteo/Seguridad**: Configura perfiles de ruteo y seguridad de forma granular para controlar el acceso y las asignaciones de contacto.
  * **Estados de Agente**: Entrena a los agentes para usar los estados correctamente (Available, Offline, After Contact Work).
* **Integración con Lambda**:
  * Para lógica compleja (ej. búsquedas en bases de datos, lógica de negocio condicional).
  * Mantén las Lambdas pequeñas, eficientes y seguras.
  * Configura los roles de IAM de las Lambdas con el principio de mínimo privilegio.
* **Monitoreo Activo**: Utiliza los informes de Connect y CloudWatch para monitorear constantemente el rendimiento del centro de contacto. Configura alarmas para problemas críticos.
* **Grabación de Llamadas**: Habilita la grabación de llamadas para fines de control de calidad y capacitación.
* **CCP (Contact Control Panel)**: Familiariza a tus agentes con el CCP para que puedan gestionar eficazmente las interacciones.
* **Prueba a Fondo**: Prueba tus Contact Flows exhaustivamente para diferentes escenarios de clientes.
* **Costos**: Connect es de pago por uso. Controla las grabaciones de llamadas, el uso de números de teléfono y las integraciones de Lambda/Lex para optimizar los costos.

---

Este cheatsheet te proporciona una referencia completa de Amazon Connect, cubriendo sus conceptos esenciales, cómo configurar instancias, gestionar usuarios y flujos de contacto, los canales de comunicación, integraciones, análisis y las mejores prácticas para construir un centro de contacto escalable y eficiente en la nube de AWS.
