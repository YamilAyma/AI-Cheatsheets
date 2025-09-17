
---

# 📣 Amazon SNS (Simple Notification Service) Cheatsheet Completo 📣

**Amazon SNS** es un servicio de notificación push completamente gestionado que te permite enviar mensajes a una gran cantidad de suscriptores (aplicaciones, usuarios finales, otros servicios de AWS) de forma asíncrona. Es un servicio de "publicar/suscribirse" (pub/sub) que facilita la creación de arquitecturas desacopladas y distribuidas.

---

## 1. 🌟 Conceptos Clave

* **Tema (Topic)**: Un canal lógico al que los publicadores envían mensajes. Los suscriptores se registran en un tema para recibir mensajes. Es la unidad central en SNS.
* **Publicador (Publisher)**: La aplicación o servicio que envía mensajes a un tema de SNS.
* **Suscriptor (Subscriber)**: El endpoint que recibe mensajes de un tema.
* **Protocolo de Suscripción**: El método por el cual un suscriptor recibe mensajes (ej. HTTP/S, SQS, Lambda, SMS, Email, SQS-FIFO).
* **Mensaje (Message)**: La unidad de datos que se envía a un tema. Contiene un cuerpo (hasta 256 KB) y atributos personalizados.
* **Filtro de Mensajes (Message Filtering)**: Los suscriptores pueden definir políticas de filtro para recibir solo un subconjunto de los mensajes publicados en un tema.
* **FIFO Topic (Tema FIFO)**: Un tipo especial de tema SNS que garantiza el orden y la deduplicación de los mensajes, al igual que SQS FIFO. Requiere colas SQS FIFO como suscriptores.
* **Entrega At-least-once (Al menos una vez)**: SNS entrega mensajes al menos una vez, lo que significa que un mensaje podría entregarse más de una vez. Los suscriptores deben ser idempotentes.

---

## 2. 🛠️ Creación y Configuración de un Tema

### 2.1. Tipos de Temas

* **Estándar (Standard Topics)**:
  * **Uso**: Para la mayoría de los casos donde la entrega "al menos una vez" y el orden "mejor esfuerzo" son aceptables.
  * **Características**: Alto throughput, alta disponibilidad, entrega de mensajes de mejor esfuerzo.
* **FIFO Topics (Temas FIFO)**:
  * **Uso**: Para casos donde el orden de los mensajes es **crítico** y se necesita la entrega "exactamente una vez".
  * **Características**: Orden estricto de mensajes, deduplicación de mensajes. Requiere que los suscriptores sean colas SQS FIFO.
  * **`MessageGroupId`**: Obligatorio para publicar mensajes en temas FIFO.

### 2.2. Crear un Tema (Console / CLI / SDK)

```bash
# AWS CLI - Crear tema Estándar
aws sns create-topic --name my-standard-topic

# AWS CLI - Crear tema FIFO
aws sns create-topic --name my-fifo-topic.fifo \
    --attributes '{"FifoTopic": "true", "ContentBasedDeduplication": "false"}'
```

### 2.3. Atributos de Tema Comunes

* **`DisplayName`**: Nombre para mostrar en notificaciones (ej. para SMS).
* **`DeliveryPolicy`**: Política JSON para reintentos de entrega.
* **`AccessPolicy`**: Política JSON que define quién puede publicar/suscribirse al tema.
* **`KmsMasterKeyId`**: Clave KMS para cifrar los mensajes en el tema (Encryption at Rest).
* **`FifoTopic`**: `true` para temas FIFO.
* **`ContentBasedDeduplication`**: `true` para deduplicación basada en contenido para temas FIFO.

---

## 3. 📝 Suscripciones

Un suscriptor se registra en un tema para recibir mensajes.

### 3.1. Crear una Suscripción (Console / CLI / SDK)

```bash
# AWS CLI - Suscribir una cola SQS a un tema
aws sns subscribe \
    --topic-arn "arn:aws:sns:us-east-1:123456789012:my-standard-topic" \
    --protocol sqs \
    --notification-endpoint "arn:aws:sqs:us-east-1:123456789012:my-queue"

# AWS CLI - Suscribir un endpoint HTTP/S
aws sns subscribe \
    --topic-arn "arn:aws:sns:us-east-1:123456789012:my-standard-topic" \
    --protocol http \
    --notification-endpoint "http://my-endpoint.example.com/notifications"
```

### 3.2. Protocolos de Suscripción Comunes

* **`sqs`**: Envía mensajes a una cola SQS. **¡Muy común para microservicios!**
* **`lambda`**: Invoca una función Lambda.
* **`http`/`https`**: Envía una solicitud HTTP/S POST al endpoint.
* **`email`/`email-json`**: Envía un correo electrónico.
* **`sms`**: Envía un mensaje de texto.
* **`application`**: Envía notificaciones push a endpoints de aplicaciones móviles (a través de servicios APN, FCM, etc. configurados en Pinpoint o SNS).

### 3.3. Confirmación de Suscripción

* Para protocolos HTTP/S y Email, SNS envía un mensaje de confirmación al endpoint. El suscriptor debe procesar este mensaje para confirmar la suscripción.

### 3.4. Política de Filtro de Mensajes (Message Filtering Policy)

* Permite a los suscriptores definir un filtro JSON para recibir solo mensajes con atributos específicos.
* **Uso**: Reduce el tráfico de red, simplifica la lógica del suscriptor.
  ```bash
  # AWS CLI - Establecer política de filtro
  aws sns set-subscription-attributes \
      --subscription-arn "arn:aws:sns:us-east-1:123456789012:my-topic:subscription-id" \
      --attribute-name "FilterPolicy" \
      --attribute-value '{ "event_type": ["order_created", "order_updated"], "priority": ["high"] }'
  ```

  * Cuando se publica un mensaje, debe tener atributos (ej. `event_type="order_created"`, `priority="high"`) que coincidan con esta política.

---

## 4. 📬 Publicación de Mensajes

### 4.1. `Publish` (Publicar un Mensaje)

* Envía un mensaje a un tema. SNS se encarga de enviarlo a todos los suscriptores.

  ```bash
  # AWS CLI - Publicar en tema Estándar
  aws sns publish \
      --topic-arn "arn:aws:sns:us-east-1:123456789012:my-standard-topic" \
      --message "Tu pedido ha sido procesado." \
      --message-attributes '{ "event_type": {"DataType": "String", "StringValue": "order_processed"}, "priority": {"DataType": "String", "StringValue": "normal"} }'
  ```

  ```bash
  # AWS CLI - Publicar en tema FIFO
  aws sns publish \
      --topic-arn "arn:aws:sns:us-east-1:123456789012:my-fifo-topic.fifo" \
      --message "Mensaje FIFO #1." \
      --message-group-id "user-id-123" \
      --message-deduplication-id "unique-dedup-id-for-msg1" # O ContentBasedDeduplication
  ```

### 4.2. Atributos de Mensaje (`MessageAttributes`)

* Pares clave-valor para proporcionar metadatos sobre el mensaje.
* **Uso**: Para políticas de filtro de suscriptores y para pasar información contextual.
* Los `MessageAttributes` deben tener `DataType` (String, Number, Binary).

---

## 5. 🧰 Características Adicionales

### 5.1. Dead-Letter Queues (DLQ)

* Puedes configurar una DLQ (una cola SQS) para una **suscripción** SNS.
* **Uso**: Si SNS no puede entregar un mensaje a un suscriptor después de varios reintentos (basado en la `DeliveryPolicy` del tema), lo envía a la DLQ.
* Permite analizar y re-procesar los mensajes fallidos.

### 5.2. Orden y Deduplicación (FIFO Topics)

* **Temas FIFO**: Garantizan que los mensajes se procesen en orden estricto y se dedupliquen.
* **`MessageGroupId`**: Todos los mensajes con el mismo `MessageGroupId` se envían en el orden exacto en que se reciben al suscriptor FIFO.
* **`MessageDeduplicationId`**: Identificador para la deduplicación.

### 5.3. Cifrado (Encryption)

* **Encryption at Rest**: Puedes cifrar los mensajes en el tema SNS usando AWS KMS.
* **Encryption in Transit**: Todas las comunicaciones con SNS usan HTTPS.

### 5.4. Fanout Pattern

* Cuando un mensaje se publica en un tema SNS y se envía a múltiples tipos de suscriptores simultáneamente (ej. una Lambda procesa, una SQS encola, un email notifica).

---

## 6. 🔒 Seguridad

* **IAM Roles y Policies**: La forma **recomendada** para controlar quién puede publicar en un tema SNS y quién puede suscribirse o recibir mensajes de él.
* **Topic Policies**: Documentos JSON que se adjuntan a un tema para definir permisos. Complementan o anulan las políticas de IAM.
* **Confirmación de Suscripción**: Para protocolos HTTP/S y Email, la confirmación es un paso de seguridad crítico para evitar suscripciones no autorizadas.

---

## 7. 📈 Monitoreo y Auditoría

* **CloudWatch Metrics**: Monitorea métricas como `NumberOfMessagesPublished/Delivered/Failed`, `PublishSize`, `NumberOfNotificationsFilteredOut`.
* **CloudWatch Alarms**: Configura alarmas para umbrales críticos (ej. `NumberOfNotificationsFailed` es alto).
* **CloudWatch Logs**: Integra Lambda u otros servicios para enviar logs a CloudWatch Logs.
* **CloudTrail**: Registra todas las llamadas API de SNS para auditoría.

---

## 8. 💡 Buenas Prácticas y Consejos

* **Desacoplamiento Primero**: Usa SNS para desacoplar componentes de tu arquitectura, permitiendo que productores y consumidores escalen de forma independiente.
* **Colas SQS como Intermediarios**: Si un consumidor necesita procesar mensajes de SNS de forma duradera o si la lógica del consumidor es compleja, usa una cola SQS como suscriptor de SNS. Esto proporciona un buffer y un control más granular sobre el consumo.
* **Temas FIFO para Orden y Deduplicación Crítica**: Utiliza temas FIFO si el orden y la deduplicación son requisitos estrictos. De lo contrario, los temas estándar son más performantes y económicos.
* **Políticas de Filtro de Mensajes**: Implementa políticas de filtro de mensajes en las suscripciones para que los consumidores solo reciban los mensajes que les interesan, reduciendo el tráfico y la complejidad del consumidor.
* **Mensajes Idempotentes**: Diseña a tus suscriptores para que sean idempotentes, ya que SNS garantiza una entrega "al menos una vez" y los reintentos pueden causar duplicados.
* **DLQ para Suscripciones Fallidas**: Configura una Dead-Letter Queue para las suscripciones críticas para capturar y analizar mensajes que no pueden ser entregados.
* **Seguridad con IAM**: Utiliza roles y políticas de IAM con el principio de mínimo privilegio para controlar el acceso a tus temas.
* **Atributos de Mensaje para Metadatos**: Usa `MessageAttributes` para pasar metadatos importantes que los suscriptores pueden usar para el ruteo o la lógica.
* **Prueba tus Suscripciones**: Prueba a fondo tus suscriptores y las políticas de filtro para asegurarte de que los mensajes se entregan y procesan como se espera.
* **Monitoreo Activo**: Configura alarmas de CloudWatch para métricas críticas de entrega y fallos.

---

Este cheatsheet te proporciona una referencia completa de Amazon SNS, cubriendo sus conceptos esenciales, los tipos de temas, cómo crear y gestionar suscripciones y publicaciones, las características adicionales, la seguridad y las mejores prácticas para construir arquitecturas de mensajería escalables y desacopladas en AWS.
