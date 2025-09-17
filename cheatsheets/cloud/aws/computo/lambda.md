
---

# 🚀 AWS Lambda Cheatsheet Completo 🚀

**AWS Lambda** es un servicio de computación sin servidor que te permite ejecutar código sin aprovisionar ni gestionar servidores. Solo pagas por el tiempo de cómputo que consumes. Ejecuta tu código en respuesta a eventos (ej. cambios en S3, actualizaciones de DynamoDB, solicitudes HTTP) y escala automáticamente desde unas pocas solicitudes por día hasta miles por segundo.

---

## 1. 🌟 Conceptos Clave

* **Computación sin Servidor (Serverless Compute)**: No tienes que aprovisionar, escalar ni gestionar ningún servidor. AWS se encarga de todo.
* **Función Lambda (Lambda Function)**: Una unidad de código que Lambda ejecuta.
* **Tiempo de Ejecución (Runtime)**: El entorno en el que se ejecuta tu código Lambda (Node.js, Python, Java, C#, Go, Ruby, PowerShell, o un `Custom Runtime`).
* **Evento (Event)**: Una invocación que dispara la ejecución de una función Lambda. Puede ser una solicitud HTTP (API Gateway), un cambio en una base de datos (DynamoDB Streams), un archivo subido a S3, etc.
* **Trigger (Disparador)**: El servicio de AWS o la aplicación que invoca tu función Lambda en respuesta a un evento.
* **Tiempo de Vida (Lifecycle)**:
  * **Cold Start (Arranque en Frío)**: La primera vez que se invoca una función (o después de un período de inactividad), Lambda necesita inicializar el entorno de ejecución. Esto añade latencia.
  * **Warm Start (Arranque en Caliente)**: Si la función se invoca de nuevo mientras el entorno de ejecución aún está activo, se reutiliza, reduciendo la latencia.
* **Memoria (Memory)**: El único recurso que configuras directamente para una función Lambda. Afecta directamente la CPU y el costo.
* **Tiempo de Espera (Timeout)**: El tiempo máximo que una función Lambda puede ejecutarse antes de ser terminada (hasta 15 minutos).
* **Simultaneidad (Concurrency)**: El número de invocaciones en paralelo que tu función puede manejar. Por defecto, es de 1000 por cuenta/región, pero es configurable.
* **ARN (Amazon Resource Name)**: Un identificador único global para los recursos de AWS, incluyendo tus funciones Lambda.
* **IAM Role (Rol de Ejecución)**: Un rol de IAM que la función Lambda asume al ejecutarse, definiendo los permisos que tiene para acceder a otros servicios de AWS.

---

## 2. 🛠️ Creación de una Función Lambda

### 2.1. Métodos de Creación

1. **AWS Management Console (UI)**: Interfaz web fácil de usar.
2. **AWS CLI (Command Line Interface)**: Para automatización.
3. **AWS SDKs**: Para integración programática.
4. **AWS SAM (Serverless Application Model)**: Un framework de código abierto para construir aplicaciones sin servidor. Usa una plantilla YAML.
5. **AWS CDK (Cloud Development Kit)**: Un framework para definir recursos de la nube usando lenguajes de programación.
6. **Terraform**: Para infraestructura como código (IaC).

### 2.2. Componentes al Crear una Función

* **Runtime**: Lenguaje de programación.
* **Handler**: El método o función en tu código que Lambda invoca cuando se ejecuta.
  * Ej: `my_function.handler` (Python), `index.handler` (Node.js), `com.example.MyLambda::handleRequest` (Java).
* **Memory (MB)**: De 128 MB a 10240 MB. Aumentar la memoria también aumenta la CPU.
* **Timeout**: De 1 segundo a 15 minutos.
* **IAM Role**: Un rol de ejecución con los permisos necesarios (ej. `AWSLambdaBasicExecutionRole` para logs de CloudWatch).
* **VPC (Virtual Private Cloud)**: Opcional. Si la Lambda necesita acceder a recursos en una VPC privada (ej. RDS, Redshift, EC2).
* **Environment Variables**: Pares clave-valor para la configuración de la función.
* **Layers**: Código y librerías que se empaquetan por separado y se adjuntan a múltiples funciones.
* **Dead-Letter Queue (DLQ)**: Una cola (SQS) o tema (SNS) donde se envían los eventos fallidos.
* **Concurrency Settings**: Límite de simultaneidad reservado o sin reservar.

---

## 3. 🚀 Modelos de Invocación

### 3.1. Invocación Síncrona (`RequestResponse`)

* El invocador espera la respuesta de la función Lambda.
* **Casos de Uso**: API Gateway (HTTP), clientes directos del SDK/CLI, Elastic Load Balancing.
* **Manejo de Errores**: La función Lambda devuelve el error directamente al invocador.

### 3.2. Invocación Asíncrona (`Event`)

* El invocador envía el evento y no espera la respuesta. Lambda gestiona la cola de reintentos.
* **Casos de Uso**: S3, SNS, CloudWatch Events, clientes directos del SDK/CLI con `--invocation-type Event`.
* **Manejo de Errores**: Lambda reintenta la función dos veces más en caso de fallo. Si todos los reintentos fallan, el evento puede ir a una DLQ.

### 3.3. Invocación de Stream (`Event Source Mapping`)

* Lambda lee eventos de un stream (ej. DynamoDB Streams, Kinesis Streams) y los procesa en lotes.
* **Casos de Uso**: DynamoDB Streams, Kinesis, Kafka (con conectores).
* **Manejo de Errores**: Los reintentos se gestionan internamente por Lambda y por la configuración del `Event Source Mapping`.

---

## 4. 📝 Ejemplo de Código (Node.js)

```javascript
// index.js (Handler para una solicitud API Gateway)
exports.handler = async (event, context) => {
    // 'event' contiene los datos de la solicitud (body, headers, query params, etc.)
    // 'context' contiene metadatos de la invocación (requestId, functionName, etc.)

    console.log('Received event:', JSON.stringify(event, null, 2));

    try {
        // Ejemplo: Leer un path parameter si viene de API Gateway
        const userId = event.pathParameters ? event.pathParameters.userId : null;

        if (!userId) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Missing userId parameter" }),
            };
        }

        // Simular una operación asíncrona (ej. llamada a una base de datos)
        const userData = await fetchUserDataFromDatabase(userId);

        if (!userData) {
            return {
                statusCode: 404,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: `User ${userId} not found` }),
            };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: `User data for ID ${userId}`, data: userData }),
        };
    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
};

async function fetchUserDataFromDatabase(userId) {
    // Simular un fetch de datos
    return new Promise(resolve => setTimeout(() => {
        if (userId === "123") {
            resolve({ id: "123", name: "Alice", email: "alice@example.com" });
        } else {
            resolve(null);
        }
    }, 100));
}
```

---

## 5. 🧰 Integraciones Comunes (Triggers)

Lambda se integra con casi todos los servicios de AWS.

* **API Gateway**: Para invocar funciones Lambda a través de solicitudes HTTP (REST APIs, WebSockets).
* **S3**: Cuando se suben, eliminan o modifican objetos en un bucket.
* **DynamoDB Streams**: Cuando se modifican ítems en una tabla DynamoDB.
* **Kinesis Streams**: Cuando hay nuevos datos en un stream de Kinesis.
* **SQS (Simple Queue Service)**: Cuando hay mensajes en una cola SQS.
* **SNS (Simple Notification Service)**: Cuando se publica un mensaje en un tema SNS.
* **CloudWatch Events / EventBridge**: Para invocar funciones en un cronograma o en respuesta a eventos de AWS.
* **ALB (Application Load Balancer)**: Como destino de un ALB para balanceo de carga.
* **CloudFront**: En Edge Locations para personalización de CDN (Lambda@Edge).
* **Cognito**: Para flujos de autenticación y autorización personalizados.

---

## 6. 📈 Optimización y Monitoreo

* **Memory**: Es el factor más importante. Prueba diferentes configuraciones de memoria. Aumentar la memoria también asigna más CPU.
* **Provisioned Concurrency**: Para mitigar "cold starts" en funciones críticas, especialmente con Java o .NET. Mantiene un número de instancias "calientes" pre-provisionadas.
* **SnapStart (Java)**: Reduce el cold start en Java inicializando el entorno de ejecución en una instantánea.
* **VPC**: Si tu Lambda necesita acceder a recursos en una VPC, configúrala. Esto añade latencia en "cold starts".
* **Environment Variables**: Usa variables de entorno para la configuración, no hardcodees valores en el código.
* **Layers**: Reutiliza código y librerías comunes entre funciones usando Layers.
* **CloudWatch Logs**: Lambda envía automáticamente los logs a CloudWatch Logs. Configura alarmas y dashboards.
* **CloudWatch Metrics**: Monitorea métricas como invocaciones, errores, latencia, cold starts, uso de memoria.
* **AWS X-Ray**: Para trazar solicitudes a través de múltiples funciones Lambda y otros servicios, identificando cuellos de botella de rendimiento.
* **Dead-Letter Queues (DLQ)**: Configura una DLQ (SQS o SNS) para funciones invocadas asíncronamente para capturar eventos que fallan después de todos los reintentos.

---

## 7. 🔒 Seguridad (IAM Roles)

* **IAM Execution Role**: Define los permisos que la función Lambda tiene para interactuar con otros servicios de AWS (ej. leer de S3, escribir en DynamoDB, publicar en CloudWatch Logs). **¡Principio de mínimo privilegio!**
* **Resource-based Policies**: Políticas que adjuntas directamente a tu función Lambda para controlar qué entidades pueden invocarla.
* **VPC Security Groups**: Si tu Lambda está en una VPC, usa Security Groups para controlar el tráfico de red de entrada y salida.

---

## 8. 💡 Buenas Prácticas y Consejos

* **Idempotencia**: Diseña tus funciones Lambda para que sean idempotentes, es decir, que la ejecución múltiple del mismo evento produzca el mismo resultado y no cause efectos secundarios no deseados.
* **Minimiza el Código Fuera del Handler**: El código fuera del handler (globalmente) se ejecuta solo en un "cold start". Úsalo para inicializaciones costosas (ej. conexiones a bases de datos, clientes HTTP).
* **Variables de Entorno**: Utiliza variables de entorno para la configuración y los secretos, en lugar de hardcodearlos.
* **Conexiones a Bases de Datos**: Para evitar abrir/cerrar conexiones en cada invocación, inicializa los pools de conexiones globalmente (fuera del handler). Para bases de datos relacionales, considera el RDS Proxy.
* **Manejo de Errores**: Implementa bloques `try-catch` y maneja las excepciones adecuadamente. Configura DLQs para eventos asíncronos.
* **Optimiza el Tamaño del Paquete**: Minimiza el tamaño de tu código y dependencias para reducir los tiempos de carga y los "cold starts".
* **Logging Robusto**: Utiliza un logging estructurado y detallado para facilitar la depuración en CloudWatch Logs.
* **Pruebas Unitarias e de Integración**: Prueba tus funciones Lambda de forma exhaustiva.
* **SAM/CDK para Despliegue**: Utiliza AWS SAM o AWS CDK para definir y desplegar tus funciones Lambda como parte de aplicaciones sin servidor.

---

Este cheatsheet te proporciona una referencia completa de AWS Lambda, cubriendo sus conceptos esenciales, cómo crear y configurar funciones, modelos de invocación, integraciones comunes, optimización, seguridad y las mejores prácticas para construir aplicaciones sin servidor eficientes y escalables.
