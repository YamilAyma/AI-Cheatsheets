
---

# ☁️ Spring Cloud Stream Cheatsheet Completo ☁️

**Spring Cloud Stream** es un framework para construir microservicios basados en mensajes. Proporciona una abstracción para el uso de Message Brokers (como Apache Kafka, RabbitMQ, Apache Pulsar, AWS Kinesis, etc.), lo que permite a los desarrolladores centrarse en la lógica de negocio sin preocuparse por los detalles específicos del broker.

---

## 1. 🌟 Conceptos Clave

*   **Message Broker (Broker de Mensajes)**: Un software que actúa como intermediario para enviar y recibir mensajes (ej. Kafka, RabbitMQ).
*   **Binder (Enlazador)**: Un componente que adapta Spring Cloud Stream a un Message Broker específico. El binder es el que sabe cómo interactuar con Kafka, RabbitMQ, etc.
*   **Channel (Canal)**: Una interfaz lógica que representa un destino para los mensajes (input o output). No es el topic/queue real del broker, sino una abstracción.
*   **Message (Mensaje)**: La unidad de datos que se envía a través de los canales. Contiene un `payload` (la carga útil de datos) y `headers` (metadatos).
*   **Consumer Group (Grupo de Consumidores)**: Un concepto del broker (particularmente en Kafka) que permite escalar horizontalmente el consumo de mensajes, asegurando que cada mensaje sea procesado solo una vez por el grupo.
*   **Partición (Partition)**: En Kafka, los topics se dividen en particiones para escalabilidad y paralelismo. Los mensajes dentro de una partición tienen un orden garantizado.
*   **Dead Letter Queue (DLQ)**: Una cola/topic especial donde los mensajes que no pudieron ser procesados (ej. por errores de lógica o formato) son enviados para su posterior análisis.

---

## 2. 🛠️ Configuración Inicial (Spring Boot)

1.  **Añadir dependencias en `pom.xml` (Maven):**
    *   Necesitas el starter principal de Spring Cloud Stream y el starter para el binder específico que vas a usar (ej. Kafka, RabbitMQ).
    ```xml
    <dependencies>
        <!-- Spring Boot Parent (si no está ya) -->
        <parent>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-parent</artifactId>
            <version>3.2.0</version> <!-- Usar la versión de Spring Boot que uses -->
            <relativePath/>
        </parent>

        <!-- Spring Cloud Dependencies (BOM) para gestionar versiones de Spring Cloud -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2023.0.0</version> <!-- Usar la versión compatible con tu Spring Boot -->
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <!-- Spring Cloud Stream Starter principal -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-stream-kafka</artifactId> <!-- O -stream-rabbit, etc. -->
        </dependency>
        <!-- Opcional: Spring Cloud Function si usas el estilo funcional -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-function-web</artifactId>
        </dependency>
        <!-- Opcional: Spring Cloud Bus si quieres actualizar la configuración dinámicamente -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-bus-kafka</artifactId>
        </dependency>

        <!-- Spring Boot Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    ```

---

## 3. 📤 Productor (Envío de Mensajes)

Existen dos enfoques principales: el funcional (recomendado) y el basado en `@StreamListener` (legacy para `@Output`).

### 3.1. Enfoque Funcional (Recomendado - Spring Cloud Function)

Define un `Supplier` que produce mensajes.

```java
// src/main/java/com/example/producer/MessageProducer.java
package com.example.producer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.util.function.Supplier;

// Clase de ejemplo para el payload
class MyEvent {
    private String id;
    private String data;
    public MyEvent(String id, String data) { this.id = id; this.data = data; }
    public String getId() { return id; } public void setId(String id) { this.id = id; }
    public String getData() { return data; } public void setData(String data) { this.data = data; }
    @Override public String toString() { return "MyEvent{" + "id='" + id + '\'' + ", data='" + data + '\'' + '}'; }
}

@Configuration
public class MessageProducer {

    // Sinks es una forma reactiva de emitir mensajes programáticamente
    private final Sinks.Many<Message<MyEvent>> sink = Sinks.many().unicast().onBackpressureBuffer();

    // 1. Define un Supplier<Flux<Message<T>>> para enviar mensajes
    // El nombre del bean ('eventSupplier') se usa en la configuración de bindings
    @Bean
    public Supplier<Flux<Message<MyEvent>>> eventSupplier() {
        return () -> sink.asFlux()
                         .doOnNext(m -> System.out.println("Enviando evento: " + m.getPayload()))
                         .doOnError(e -> System.err.println("Error en el stream de salida: " + e.getMessage()));
    }

    // 2. Método para emitir mensajes (llamado desde un Controller, Service, etc.)
    public void produceEvent(MyEvent event) {
        Message<MyEvent> message = MessageBuilder.withPayload(event).build();
        sink.tryEmitNext(message);
    }
}
```

**Uso de `StreamBridge` (para enviar mensajes desde cualquier parte de tu código):**

`StreamBridge` es la forma preferida de enviar mensajes programáticamente sin acoplarse a un `Supplier` bean.

```java
// src/main/java/com/example/producer/MyRestController.java
package com.example.producer;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class MyRestController {

    private final StreamBridge streamBridge; // Inyecta StreamBridge

    public MyRestController(StreamBridge streamBridge) {
        this.streamBridge = streamBridge;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public String sendEvent(@RequestBody String data) {
        MyEvent event = new MyEvent(UUID.randomUUID().toString(), data);
        // 'output-channel' debe coincidir con el nombre de un binding de salida en application.properties
        streamBridge.send("output-channel", event); // Envía el evento al binding 'output-channel'
        System.out.println("Evento enviado vía REST: " + event);
        return "Event sent!";
    }
}
```

---

## 4. 📥 Consumidor (Recepción de Mensajes)

### 4.1. Enfoque Funcional (Recomendado - Spring Cloud Function)

Define un `Consumer` que consume mensajes.

```java
// src/main/java/com/example/consumer/MessageConsumer.java
package com.example.consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import java.util.function.Consumer;

// Clase de ejemplo para el payload
class MyEvent {
    private String id;
    private String data;
    // Constructor, getters, setters, toString() (igual que la del productor)
    public MyEvent(String id, String data) { this.id = id; this.data = data; }
    public String getId() { return id; } public void setId(String id) { this.id = id; }
    public String getData() { return data; } public void setData(String data) { this.data = data; }
    @Override public String toString() { return "MyEvent{" + "id='" + id + '\'' + ", data='" + data + '\'' + '}'; }
}

@Configuration
public class MessageConsumer {

    // Define un Consumer<MyEvent> para procesar mensajes
    // El nombre del bean ('eventConsumer') se usa en la configuración de bindings
    @Bean
    public Consumer<MyEvent> eventConsumer() {
        return event -> { // Recibe el payload directamente
            System.out.println("Consumiendo evento: " + event.getId() + " - " + event.getData());
            // Lógica de negocio para procesar el evento
            if (event.getData().contains("error")) {
                throw new RuntimeException("Error simulado al procesar: " + event.getData());
            }
        };
    }

    // Si necesitas acceso a los headers del mensaje, puedes recibir Message<T>
    @Bean
    public Consumer<Message<MyEvent>> eventConsumerWithHeaders() {
        return message -> {
            MyEvent event = message.getPayload();
            String messageId = (String) message.getHeaders().get("id");
            System.out.println("Consumiendo evento (con headers): " + event.getId() + " - " + event.getData() + " (Message ID: " + messageId + ")");
        };
    }
}
```

---

## 5. 🔁 Procesador (Transformación de Streams)

Define una `Function` que recibe un flujo de entrada y produce un flujo de salida.

```java
// src/main/java/com/example/processor/MessageProcessor.java
package com.example.processor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Flux;

import java.util.function.Function;

// MyEvent y MyTransformedEvent clases de ejemplo
class MyEvent {
    private String id;
    private String data;
    public MyEvent(String id, String data) { this.id = id; this.data = data; }
    public String getId() { return id; } public void setId(String id) { this.id = id; }
    public String getData() { return data; } public void setData(String data) { this.data = data; }
}
class MyTransformedEvent {
    private String originalId;
    private String processedData;
    public MyTransformedEvent(String id, String data) { this.originalId = id; this.processedData = data; }
    public String getOriginalId() { return originalId; } public void setOriginalId(String originalId) { this.originalId = originalId; }
    public String getProcessedData() { return processedData; } public void setProcessedData(String processedData) { this.processedData = processedData; }
}

@Configuration
public class MessageProcessor {

    // Define una Function<Flux<MyEvent>, Flux<MyTransformedEvent>>
    // El nombre del bean ('eventProcessor') se usa en la configuración de bindings
    @Bean
    public Function<Flux<MyEvent>, Flux<MyTransformedEvent>> eventProcessor() {
        return input -> input
                .map(event -> {
                    System.out.println("Procesando evento: " + event.getId());
                    // Lógica de transformación
                    return new MyTransformedEvent(event.getId(), event.getData().toUpperCase());
                })
                .doOnError(e -> System.err.println("Error en el stream de procesamiento: " + e.getMessage()));
    }
}
```

---

## 6. ⚙️ Configuración (`application.properties` o `application.yml`)

Aquí se enlazan los Beans funcionales (Supplier, Consumer, Function) a los destinos reales del broker.

```properties
# application.properties

# --- Configuración del Binder (Kafka) ---
spring.cloud.stream.binders.kafka-binder.type=kafka
spring.cloud.stream.binders.kafka-binder.environment.spring.cloud.stream.kafka.binder.brokers=localhost:9092
spring.cloud.stream.binders.kafka-binder.environment.spring.cloud.stream.kafka.binder.consumer.auto-offset-reset=earliest

# --- Configuración de Funciones ---
# Define qué funciones se van a usar en esta aplicación
# Para productor: eventSupplier (nombre del bean Supplier)
# Para consumidor: eventConsumer (nombre del bean Consumer)
# Para procesador: eventProcessor (nombre del bean Function)
spring.cloud.stream.function.definition=eventSupplier;eventConsumer;eventProcessor

# --- Bindings (Mapeo de Canales lógicos a destinos del Broker) ---
# Binding para el Supplier (productor)
spring.cloud.stream.bindings.eventSupplier-out-0.destination=my-output-topic
spring.cloud.stream.bindings.eventSupplier-out-0.binder=kafka-binder # Usa el binder definido arriba
spring.cloud.stream.bindings.eventSupplier-out-0.content-type=application/json # Tipo de serialización

# Binding para el Consumer (consumidor)
spring.cloud.stream.bindings.eventConsumer-in-0.destination=my-input-topic
spring.cloud.stream.bindings.eventConsumer-in-0.group=my-consumer-group # Obligatorio para consumidores escalables
spring.cloud.stream.bindings.eventConsumer-in-0.binder=kafka-binder
spring.cloud.stream.bindings.eventConsumer-in-0.content-type=application/json

# Binding para el Processor (input y output)
spring.cloud.stream.bindings.eventProcessor-in-0.destination=my-input-topic-for-processor
spring.cloud.stream.bindings.eventProcessor-in-0.group=my-processor-group
spring.cloud.stream.bindings.eventProcessor-in-0.binder=kafka-binder
spring.cloud.stream.bindings.eventProcessor-in-0.content-type=application/json

spring.cloud.stream.bindings.eventProcessor-out-0.destination=my-output-topic-from-processor
spring.cloud.stream.bindings.eventProcessor-out-0.binder=kafka-binder
spring.cloud.stream.bindings.eventProcessor-out-0.content-type=application/json

# --- Propiedades Específicas del Kafka Binder ---
# Estas se aplican a TODOS los bindings que usan el binder 'kafka-binder'
spring.cloud.stream.kafka.binder.auto-create-topics=true # Crear topics automáticamente
# spring.cloud.stream.kafka.binder.brokers=localhost:9092 # Ya definido en 'binders.kafka-binder.environment'

# --- Configuración Global de Mensajes ---
spring.cloud.stream.default.content-type=application/json # Content-Type por defecto si no se especifica

# --- Configuración de Consumidor para DLQ (Dead Letter Queue) ---
spring.cloud.stream.bindings.eventConsumer-in-0.consumer.max-attempts=3 # Reintentar 3 veces
spring.cloud.stream.kafka.bindings.eventConsumer-in-0.consumer.enable-dlq=true # Habilitar DLQ
spring.cloud.stream.kafka.bindings.eventConsumer-in-0.consumer.dlq-name=my-dlq-topic # Nombre del topic DLQ
# Nota: La configuración de DLQ puede variar ligeramente entre binders.
```

---

## 7. 🧪 Testing

Spring Cloud Stream proporciona herramientas para facilitar las pruebas unitarias y de integración.

```java
// src/test/java/com/example/producer/MessageProducerTest.java
package com.example.producer;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.stream.binder.test.InputDestination; // Para simular envío a input
import org.springframework.cloud.stream.binder.test.OutputDestination; // Para capturar salida
import org.springframework.cloud.stream.binder.test.TestChannelBinderConfiguration; // Configuración de Test Binder
import org.springframework.context.annotation.Import;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.GenericMessage;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Import(TestChannelBinderConfiguration.class) // Importa la configuración del binder de prueba
class MessageProducerTest {

    @Autowired
    private OutputDestination outputDestination; // Inyecta el destino de salida de prueba

    @Autowired
    private MessageProducer messageProducer; // Inyecta tu productor real

    @Test
    void testProduceEvent() {
        MyEvent eventToSend = new MyEvent("test-id-123", "Hello from test!");
        messageProducer.produceEvent(eventToSend); // Llama al método que produce el evento

        // Captura el mensaje de la salida de prueba (del binding 'eventSupplier-out-0')
        // El nombre del binding se deriva de `spring.cloud.stream.function.definition` y `-out-0`
        Message<byte[]> receivedMessage = outputDestination.receive(100, "eventSupplier-out-0"); // Timeout de 100ms
        assertThat(receivedMessage).isNotNull();

        // Deserializa el payload
        String payloadString = new String(receivedMessage.getPayload());
        assertThat(payloadString).contains("Hello from test!");
        assertThat(receivedMessage.getHeaders().get("contentType")).isEqualTo("application/json");
    }
}
```

```java
// src/test/java/com/example/consumer/MessageConsumerTest.java
package com.example.consumer;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.stream.binder.test.InputDestination;
import org.springframework.cloud.stream.binder.test.OutputDestination;
import org.springframework.cloud.stream.binder.test.TestChannelBinderConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Import(TestChannelBinderConfiguration.class)
class MessageConsumerTest {

    @Autowired
    private InputDestination inputDestination; // Inyecta el destino de entrada de prueba

    @Autowired
    private OutputDestination outputDestination; // Para verificar si se envía a DLQ o similar (opcional)

    @Test
    void testConsumeEvent() {
        MyEvent eventToSend = new MyEvent("test-consumer-id", "Processed data");
        Message<MyEvent> message = MessageBuilder.withPayload(eventToSend)
                                                 .setHeader("contentType", "application/json") // Importante para la deserialización
                                                 .build();

        // Envía el mensaje al destino de entrada de prueba (del binding 'eventConsumer-in-0')
        inputDestination.send(message, "eventConsumer-in-0");

        // En este punto, el Consumer bean debería haber procesado el mensaje.
        // La verificación sería en los logs o en un mock de un servicio invocado por el consumer.
        // Aquí solo verificamos que no fue a DLQ (asumiendo que no hay error)
        Message<byte[]> dlqMessage = outputDestination.receive(100, "eventConsumer-in-0.dlq");
        assertThat(dlqMessage).isNull();
    }
}
```

---

## 8. 💡 Buenas Prácticas y Consejos

*   **Usa el Enfoque Funcional**: Para nuevos proyectos, prioriza la definición de beans `Supplier`, `Consumer` y `Function` para productores, consumidores y procesadores. Es más flexible y menos acoplado que `@StreamListener`.
*   **Utiliza `StreamBridge` para Productores Programáticos**: Cuando necesites enviar un mensaje desde un controlador REST o un servicio arbitrario, `StreamBridge` es la forma limpia y desacoplada de hacerlo.
*   **Tipado Fuerte**: Define clases Java para tus payloads de mensajes. Esto permite que Spring Cloud Stream realice la deserialización automáticamente y ofrece seguridad de tipos.
*   **Configuración en `application.properties`/`yml`**: Centraliza la configuración de bindings, destinos y propiedades del binder en los archivos de configuración.
*   **Consumer Groups para Escalar**: Siempre define un `group` para tus consumidores (`spring.cloud.stream.bindings.<channel>.group`). Esto permite escalar tu aplicación ejecutando múltiples instancias que comparten la carga de mensajes y aseguran que cada mensaje se procese solo una vez por grupo.
*   **Manejo de Errores y DLQ**: Habilita y configura una Dead Letter Queue (`enable-dlq`) para manejar mensajes fallidos de forma robusta. Implementa lógica para monitorear y re-procesar los mensajes en la DLQ.
*   **Contenido Tipo (Content-Type)**: Especifica siempre el `content-type` (`application/json`, `text/plain`, `application/avro`, etc.) en tus bindings. Esto permite que Spring Cloud Stream use el `MessageConverter` adecuado para serializar/deserializar payloads.
*   **Mensajes Inmutables**: Crea tus payloads de mensajes (clases `MyEvent`) como objetos inmutables para evitar efectos secundarios.
*   **Monitoreo**: Integra Actuator y herramientas de monitoreo (Prometheus, Grafana) para observar las métricas de tus canales y binders.
*   **Schema Registry (para Avro/Protobuf)**: Si usas formatos binarios como Avro o Protocol Buffers, considera usar un Schema Registry con tu binder (ej. Confluent Schema Registry para Kafka).
*   **Manejo de Contrapresión**: Para flujos reactivos complejos, considera cómo se maneja la contrapresión entre productores y consumidores para evitar la saturación del sistema.

---

Este cheatsheet te proporciona una referencia completa de Spring Cloud Stream, cubriendo sus conceptos esenciales, cómo configurar productores, consumidores y procesadores con los enfoques modernos, la configuración, las pruebas y las mejores prácticas para construir sistemas de microservicios basados en mensajes de manera eficiente y robusta.