
---

# 📬 Amazon SQS (Simple Queue Service) Cheatsheet Completo 📬

**Amazon SQS** es un servicio de cola de mensajes completamente gestionado que te permite desacoplar y escalar microservicios, sistemas distribuidos y aplicaciones sin servidor. Actúa como un intermediario que almacena mensajes hasta que los consumidores puedan procesarlos.

---

## 1. 🌟 Conceptos Clave

* **Cola de Mensajes (Message Queue)**: Un búfer para almacenar mensajes temporalmente entre el productor y el consumidor.
* **Productor (Producer)**: El componente que envía mensajes a la cola SQS.
* **Consumidor (Consumer)**: El componente que recupera y procesa mensajes de la cola SQS.
* **Desacoplamiento (Decoupling)**: SQS permite que productores y consumidores funcionen de forma independiente, sin necesidad de estar disponibles al mismo tiempo.
* **Escalabilidad**: SQS escala automáticamente para manejar cualquier volumen de tráfico de mensajes.
* **Durabilidad**: Los mensajes se almacenan redundantemente en múltiples Zonas de Disponibilidad.
* **Mensaje (Message)**: La unidad de datos que se envía y se recibe. Contiene un cuerpo (hasta 256 KB) y atributos personalizados.
* **Retención de Mensajes (Message Retention)**: El tiempo que SQS almacena un mensaje en la cola si no se procesa (1 minuto a 14 días, por defecto 4 días).
* **ID de Mensaje (Message ID)**: Un identificador único que SQS asigna a cada mensaje.
* **Recibo de Manejo (Receipt Handle)**: Un identificador único que se devuelve cuando un consumidor recibe un mensaje. Se usa para eliminar el mensaje.
* **Visibilidad (Visibility Timeout)**: El período durante el cual un mensaje recibido por un consumidor se oculta a otros consumidores. Si el consumidor falla o no elimina el mensaje, vuelve a estar visible.

---

## 2. 🛠️ Tipos de Colas SQS

### 2.1. Colas Estándar (Standard Queues)

* **Uso**: Para la mayoría de los casos de uso donde el alto rendimiento y la escalabilidad son críticos, y la entrega "al menos una vez" y el orden "mejor esfuerzo" son aceptables.
* **Características**:
  * **At-least-once delivery (Entrega al menos una vez)**: Un mensaje puede ser entregado más de una vez.
  * **Best-effort ordering (Orden de mejor esfuerzo)**: Los mensajes se entregan generalmente en el orden en que se envían, pero no se garantiza estrictamente.
  * **Alto Throughput**: Prácticamente ilimitado.
  * **Costo**: Bajo.

### 2.2. Colas FIFO (First-In, First-Out)

* **Uso**: Para casos donde el orden de los mensajes es **crítico** y se necesita la entrega "exactamente una vez".
* **Características**:
  * **Exactly-once delivery (Entrega exactamente una vez)**: Garantiza que un mensaje se procesa exactamente una vez.
  * **First-In, First-Out (FIFO) ordering (Orden FIFO)**: Los mensajes se entregan estrictamente en el orden en que se envían.
  * **Throughput limitado**: Menor throughput que las colas estándar (3000 mensajes por segundo sin procesamiento por lotes, 30000 con procesamiento por lotes).
* **Atributos de Mensaje Específicos FIFO**:
  * **`MessageGroupId`**: Agrupa mensajes relacionados que deben ser procesados en orden estricto. Los mensajes con el mismo `MessageGroupId` se procesan secuencialmente.
  * **`MessageDeduplicationId`**: Un token opcional (o contenido hash del mensaje) para la deduplicación de mensajes.

---

## 3. 🛠️ Creación y Configuración de una Cola

### 3.1. Crear una Cola (Console / CLI / SDK)

```bash
# AWS CLI - Crear cola Estándar
aws sqs create-queue --queue-name my-standard-queue

# AWS CLI - Crear cola FIFO
aws sqs create-queue --queue-name my-fifo-queue.fifo \
    --attributes '{"FifoQueue": "true", "ContentBasedDeduplication": "false"}'
```

### 3.2. Atributos de Cola Comunes

* **`DelaySeconds`**: Retrasa la entrega de mensajes nuevos a la cola (0-15 minutos).
* **`MaximumMessageSize`**: Tamaño máximo de un mensaje (1KB-256KB, default 256KB).
* **`MessageRetentionPeriod`**: Tiempo que un mensaje permanece en la cola (60 segundos - 14 días, default 4 días).
* **`ReceiveMessageWaitTimeSeconds`**: Tiempo máximo de espera para la "long polling" (0-20 segundos, default 0 para "short polling").
* **`VisibilityTimeout`**: Tiempo que un mensaje es invisible para otros consumidores después de ser recibido (0 segundos - 12 horas, default 30 segundos).
* **`RedrivePolicy`**: Configuración para una Dead Letter Queue (DLQ).
  * `deadLetterTargetArn`: ARN de la DLQ.
  * `maxReceiveCount`: Número máximo de veces que un mensaje puede ser recibido antes de ir a la DLQ.

---

## 4. 📬 Operaciones de Mensajes (AWS CLI / SDK)

### 4.1. `SendMessage` (Enviar un Mensaje)

* Envía un mensaje a la cola.

  ```bash
  # Cola Estándar
  aws sqs send-message \
      --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/my-standard-queue \
      --message-body "Contenido de mi mensaje" \
      --message-attributes '{"DataType": {"DataType": "String", "StringValue": "order"}}'
  ```

  ```bash
  # Cola FIFO
  aws sqs send-message \
      --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/my-fifo-queue.fifo \
      --message-body "Contenido de mi mensaje FIFO" \
      --message-group-id "order-processing-group" \
      --message-deduplication-id "unique-dedup-id-1" # O usa ContentBasedDeduplication
  ```

### 4.2. `ReceiveMessage` (Recibir Mensajes)

* Recupera uno o más mensajes de la cola.
* **Long Polling**: Configura `ReceiveMessageWaitTimeSeconds` a > 0 (hasta 20 segundos) para que SQS espere a que haya mensajes. Reduce el número de solicitudes vacías y el costo.
  ```bash
  aws sqs receive-message \
      --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/my-standard-queue \
      --max-number-of-messages 10 \
      --visibility-timeout 60 \
      --wait-time-seconds 20 # Long polling
  ```

  * La respuesta contiene `MessageId`, `Body`, `MD5OfBody`, `ReceiptHandle`.

### 4.3. `DeleteMessage` (Eliminar un Mensaje)

* Elimina un mensaje de la cola. **¡Es crucial eliminar un mensaje después de procesarlo con éxito!**
  * Requiere el `ReceiptHandle` del mensaje.

  ```bash
  aws sqs delete-message \
      --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/my-standard-queue \
      --receipt-handle "AQEBfB..."
  ```

### 4.4. `ChangeMessageVisibility` (Cambiar Visibilidad)

* Modifica el `VisibilityTimeout` de un mensaje. Útil si el procesamiento toma más o menos tiempo de lo esperado.
  ```bash
  aws sqs change-message-visibility \
      --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/my-standard-queue \
      --receipt-handle "AQEBfB..." \
      --visibility-timeout 120 # Ocultar por 120 segundos más
  ```

### 4.5. `SendMessageBatch` / `DeleteMessageBatch` (Operaciones por Lotes)

* Envía/elimina hasta 10 mensajes en una sola solicitud. Reduce el costo y la latencia.

---

## 5. 🧰 Características Adicionales

### 5.1. Dead-Letter Queues (DLQ) - Colas de Mensajes No Procesados

* **Uso**: Para capturar mensajes que fallan repetidamente al ser procesados.
* **Configuración**: Se define un `RedrivePolicy` en la cola principal que apunta a una DLQ separada.
  * `maxReceiveCount`: Número máximo de veces que un mensaje puede ser recibido de la cola principal antes de ser movido a la DLQ.
* **Análisis**: Los mensajes en la DLQ pueden ser inspeccionados para depurar y entender por qué fallaron.

### 5.2. Filtrado de Mensajes (Message Filtering)

* Si SQS es el destino de un tema SNS, puedes configurar una `Subscription Policy` en la suscripción SQS a SNS para filtrar mensajes basándose en atributos.
* Permite que solo los mensajes con atributos específicos lleguen a la cola SQS.

### 5.3. Encriptación (Encryption at Rest)

* **SSE-SQS**: SQS gestiona las claves de cifrado.
* **SSE-KMS**: AWS Key Management Service gestiona las claves.
* Cifra los mensajes mientras están en reposo en la cola.

### 5.4. SQS con AWS Lambda

* Lambda puede consumir mensajes directamente de una cola SQS.
* AWS gestiona el polling, el escalado de los consumidores Lambda y el `VisibilityTimeout`.
* Para colas FIFO, Lambda respeta el `MessageGroupId` para garantizar el orden de procesamiento.

---

## 6. 🔒 Seguridad

* **IAM Roles y Policies**: La forma **recomendada** para controlar quién puede enviar, recibir o eliminar mensajes de una cola SQS.
  * Un rol de IAM para tu productor/consumidor (ej. una función Lambda, una instancia EC2) con permisos específicos de SQS.
* **Queue Policies**: Documentos JSON que se adjuntan a la cola para definir permisos. Complementan o anulan las políticas de IAM.
* **Encryption in Transit**: Todas las comunicaciones con SQS usan HTTPS.

---

## 7. 📈 Monitoreo y Auditoría

* **CloudWatch Metrics**: Monitorea el número de mensajes en la cola, el `OldestMessageAge`, `NumberOfMessagesSent/Received/Deleted`, `ApproximateNumberOfMessagesVisible/NotVisible/Delayed`.
* **CloudWatch Alarms**: Configura alarmas para umbrales críticos (ej. `ApproximateNumberOfMessagesVisible` es demasiado alto).
* **CloudWatch Logs**: Integra tus consumidores Lambda o EC2 para enviar logs a CloudWatch Logs.
* **CloudTrail**: Registra todas las llamadas API de SQS para auditoría.

---

## 8. 💡 Buenas Prácticas y Consejos

* **Desacoplamiento**: Usa SQS para desacoplar componentes y servicios, permitiendo que operen de forma independiente y asíncrona.
* **Colas FIFO para Orden Crítico**: Si el orden de los mensajes es absolutamente crítico para la lógica de tu negocio, usa colas FIFO. De lo contrario, las colas estándar son más performantes y económicas.
* **DLQ para Mensajes Fallidos**: Siempre configura una Dead-Letter Queue para tus colas principales para capturar y analizar mensajes que no pueden ser procesados.
* **Long Polling para Consumidores**: Utiliza `ReceiveMessageWaitTimeSeconds` > 0 para reducir el número de solicitudes vacías y los costos.
* **`VisibilityTimeout` Adecuado**: Establece un `VisibilityTimeout` suficientemente largo para que tu consumidor procese el mensaje, pero no tan largo como para retrasar la re-entrega en caso de fallo.
* **Eliminar Mensajes**: Es responsabilidad del consumidor eliminar el mensaje de la cola *después* de un procesamiento exitoso.
* **Mensajes Idempotentes**: Diseña tus consumidores para que sean idempotentes, ya que las colas estándar garantizan "al menos una vez" la entrega, y los reintentos pueden causar duplicados.
* **Operaciones por Lotes (`Batch`)**: Usa `SendMessageBatch` y `DeleteMessageBatch` para enviar/eliminar múltiples mensajes en una sola solicitud, reduciendo costos y latencia.
* **Monitoreo Activo**: Configura alarmas de CloudWatch para `ApproximateNumberOfMessagesVisible` y `OldestMessageAge` para detectar cuellos de botella o problemas de procesamiento.
* **Seguridad con IAM**: Utiliza roles de IAM con el principio de mínimo privilegio para controlar el acceso a tus colas.
* **Cifrado en Reposo**: Habilita el cifrado SSE-SQS o SSE-KMS para tus colas.

---

Este cheatsheet te proporciona una referencia completa de Amazon SQS, cubriendo sus conceptos esenciales, los tipos de colas, cómo crear y gestionar mensajes, las características adicionales, la seguridad y las mejores prácticas para construir arquitecturas asíncronas y desacopladas en AWS.
