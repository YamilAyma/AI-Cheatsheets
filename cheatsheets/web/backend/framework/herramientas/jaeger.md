
---

# 🔎 Jaeger (Distributed Tracing) Cheatsheet Completo 🔎

**Jaeger** es un sistema de trazabilidad distribuida de código abierto, inspirado en Dapper de Google y OpenZipkin. Se utiliza para monitorear y solucionar problemas de transacciones complejas en entornos de microservicios. Recopila datos de traza de todas las partes de tu aplicación y proporciona una interfaz de usuario para visualizarlos.

---

## 1. 🌟 Conceptos Clave de Trazabilidad Distribuida

*   **Trace (Traza)**: Representa la ejecución completa de una operación o solicitud a través de múltiples servicios. Cada traza tiene un `Trace ID` único.
*   **Span (Tramo)**: Una unidad lógica de trabajo dentro de una traza. Un Span representa una operación individual (ej. una llamada a un servicio, una operación de base de datos). Cada Span tiene un `Span ID` y un `Parent Span ID` que lo vincula a su operación padre, creando así una jerarquía dentro de la traza.
*   **Context Propagation (Propagación de Contexto)**: El mecanismo mediante el cual los `Trace ID` y `Span ID` se pasan de un servicio a otro (generalmente a través de encabezados HTTP, JMS, Kafka, etc.) para mantener la continuidad de la traza.
*   **Service (Servicio)**: El nombre de la aplicación o microservicio que genera los Spans.
*   **Operation (Operación)**: El nombre de una función o endpoint dentro de un servicio que genera un Span (ej. `GET /api/users`, `userRepository.findById`).
*   **Tags (Etiquetas)**: Pares clave-valor adjuntos a un Span que proporcionan metadatos adicionales y contextuales sobre la operación (ej. `http.status_code`, `db.statement`, `user.id`). Son buscables en la UI de Jaeger.
*   **Logs (Registros)**: Mensajes con marca de tiempo adjuntos a un Span, útiles para registrar eventos específicos durante la ejecución de una operación.
*   **Sampler (Muestreador)**: Un componente que decide si una traza debe ser recolectada o no. Crucial para gestionar el volumen de datos de traza en producción.
*   **Exporter (Exportador)**: El componente que envía los Spans recolectados a un sistema de backend de trazabilidad (como Jaeger Collector).
*   **OpenTracing / OpenTelemetry**: Estándares de instrumentación de código para trazabilidad distribuida. Jaeger es compatible con ambos.

---

## 2. 🛠️ Arquitectura de Jaeger

Jaeger se compone de varios componentes principales:

*   **Jaeger Client**: Librerías específicas de lenguaje (Java, Go, Python, Node.js, etc.) que instrumentan tu aplicación. Capturan Spans y los envían al Jaeger Agent.
*   **Jaeger Agent**: Un demonio de red que escucha a los Jaeger Clients y envía los Spans en lotes al Jaeger Collector. Generalmente se despliega como un sidecar en Kubernetes o en el mismo host que la aplicación.
*   **Jaeger Collector**: Recibe Spans del Jaeger Agent, los valida, los procesa y los almacena en el backend de almacenamiento.
*   **Jaeger Query**: Un servicio que recupera trazas del almacenamiento y las expone a la UI de Jaeger.
*   **Storage**: El backend de almacenamiento persistente para las trazas (Cassandra, Elasticsearch, Kafka).
*   **Jaeger UI**: La interfaz de usuario web para visualizar y explorar las trazas.

---

## 3. ⚙️ Instalación de Jaeger Server (Docker)

Para un entorno de desarrollo o pruebas, se suele usar la imagen `all-in-one` que incluye todos los componentes de Jaeger Server y el almacenamiento en memoria.

```bash
docker run -d --name jaeger -p 16686:16686 -p 6831:6831/udp -p 6832:6832/udp -p 14268:14268 jaegertracing/all-in-one:latest
```
*   `16686`: Puerto para la UI de Jaeger (`http://localhost:16686`).
*   `6831/udp`, `6832/udp`: Puertos para el agente UDP de Jaeger (para recibir Spans de los clientes).
*   `14268`: Puerto HTTP para el colector (para recibir Spans de clientes/agentes HTTP).

### 3.1. Configuración de Almacenamiento (Opcional para Producción)

Para producción, necesitas configurar un backend de almacenamiento persistente.

*   **Elasticsearch (Recomendado)**:
    ```bash
    docker run -d --name jaeger \
      -e COLLECTOR_ZIPKIN_HOST_PORT=9411 \
      -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
      -e SPAN_STORAGE_TYPE=elasticsearch \
      -e ELASTICSEARCH_SERVER_URLS=http://your_es_host:9200 \
      -p 16686:16686 \
      -p 6831:6831/udp \
      -p 14268:14268 \
      jaegertracing/all-in-one:latest # En un entorno real, usarías componentes separados
    ```
*   **Cassandra**: Similar a Elasticsearch, con variables de entorno para los puntos de contacto de Cassandra.

---

## 4. 📝 Instrumentación de Aplicaciones (Spring Boot con Micrometer Tracing)

Micrometer Tracing (parte de Spring Boot 3+ y Micrometer 1.10+) es el enfoque recomendado y estándar para instrumentar aplicaciones Spring Boot para Jaeger (basado en OpenTelemetry).

1.  **Añadir dependencias en `pom.xml` (en tu microservicio):**
    ```xml
    <dependencies>
        <!-- Micrometer Tracing Bridge para OpenTelemetry -->
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-tracing-bridge-otel</artifactId>
        </dependency>
        <!-- Exporter para Jaeger -->
        <dependency>
            <groupId>io.opentelemetry</groupId>
            <artifactId>opentelemetry-exporter-jaeger</artifactId>
        </dependency>
        <!-- Para la API de OpenTelemetry (si necesitas instrumentación manual más allá del bridge) -->
        <dependency>
            <groupId>io.opentelemetry</groupId>
            <artifactId>opentelemetry-api</artifactId>
            <version>1.34.1</version> <!-- Usar la versión compatible -->
        </dependency>
        <!-- Spring Boot Actuator para exposición de métricas y health -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
    </dependencies>
    ```

2.  **Configurar `application.yml` (en tu microservicio cliente):**
    ```yaml
    # src/main/resources/application.yml
    spring:
      application:
        name: my-product-service # ¡CRÍTICO! El nombre del servicio para las trazas
      sleuth: # Propiedades del "bridge" OpenTelemetry
        sampler:
          probability: 1.0 # Muestrear el 100% de las trazas (0.0 a 1.0)
          # Para producción, un valor como 0.1 (10%) o 0.01 (1%) es más común para no saturar.
        propagation:
          type: W3C # Usar el formato de encabezado W3C Trace Context (traceparent, tracestate)

    management:
      tracing:
        sampling:
          probability: 1.0 # Equivalente a spring.sleuth.sampler.probability
        propagation:
          type: W3C
        exporters:
          jaeger:
            endpoint: http://localhost:14250 # Endpoint gRPC de Jaeger Collector (por defecto)
          logging: # Útil para depuración local
            enabled: true # Para ver las trazas en los logs de la consola
    ```
    *   **Nota**: `14250` es el puerto gRPC del Jaeger Collector. Si usas el agente, el endpoint sería `http://localhost:6831` (UDP Thrift) o `http://localhost:14268` (HTTP Thrift/JSON) dependiendo del formato del cliente. Los exporters de OTel suelen usar gRPC o HTTP.

---

## 5. 🚀 Visualización de Trazas en la UI de Jaeger

1.  **Acceder a la UI**: `http://localhost:16686`
2.  **Buscar Trazas**:
    *   **Service**: Selecciona el nombre del servicio (tu `spring.application.name`).
    *   **Operation**: Elige una operación (nombre de Span).
    *   **Tags**: Filtra por tags (`http.status_code=500`, `error=true`, `user.id=123`).
    *   **Lookback**: Rango de tiempo para buscar trazas.
    *   **Min Duration / Max Duration**: Filtra por duración de la traza.
    *   **Limit**: Número máximo de trazas a mostrar.
3.  **Visualizar Detalles de la Traza**:
    *   **Gráfico de Gantt**: Muestra la duración de cada Span y su relación jerárquica.
    *   **Detalles del Span**: Haz clic en un Span para ver sus tags, logs, y otros metadatos.
    *   **Flame Graph / Call Graph**: Diferentes vistas para analizar el rendimiento y la jerarquía de Spans.
    *   **JSON**: Puedes ver la representación JSON cruda de la traza.

---

## 6. 🌐 Integración y Ecosistema

*   **Micrometer Tracing**: El puente de instrumentación para Java (Spring Boot).
*   **OpenTelemetry**: El estándar de facto para instrumentación de observabilidad (trazas, métricas, logs). Jaeger es compatible con Spans de OTel.
*   **Istio**: Una malla de servicios que utiliza Jaeger para su trazabilidad distribuida.
*   **Logs**: Los logs de la aplicación pueden ser enriquecidos con `Trace ID` y `Span ID` para facilitar la correlación. (Spring Boot lo hace por defecto con Micrometer Tracing).
*   **Métricas**: Aunque Jaeger se enfoca en trazas, los sistemas de monitoreo de métricas (Prometheus, Grafana) son complementarios para identificar problemas que luego se investigan con trazas.

---

## 7. 💡 Buenas Prácticas y Consejos

*   **Muestreo (Sampling)**: En producción, es CRÍTICO configurar una tasa de muestreo adecuada (`management.tracing.sampling.probability`). No envíes el 100% de las trazas a Jaeger, ya que esto puede generar un volumen de datos masivo y sobrecargar tus sistemas.
*   **Nombres de Servicios Claros**: Asegúrate de que `spring.application.name` sea único y descriptivo para cada microservicio. Esto facilita la búsqueda y el filtrado en Jaeger.
*   **Tags Relevantes**: Añade tags personalizados (`Span.tag("key", "value")` o `@NewSpan`) con información clave para tu depuración y búsqueda (ej. `user.id`, `customer.type`, `http.status_code`, `db.statement`, `error=true`).
*   **Propagación de Contexto Consistente**: Asegúrate de que todos los servicios y componentes de tu sistema usen el mismo formato de propagación de contexto (ej. `W3C Trace Context` es el estándar moderno, `B3` es común para compatibilidad).
*   **Monitorea tu Infraestructura Jaeger**: Monitorea la salud y el rendimiento de tus componentes de Jaeger (Agent, Collector, Query Service, Storage) para asegurar que puedan manejar el volumen de datos.
*   **Configura Almacenamiento Persistente para Producción**: No uses el almacenamiento en memoria para Jaeger en producción. Elasticsearch o Cassandra son las opciones más comunes.
*   **Logs Correlacionados**: Asegúrate de que tus logs incluyan el `Trace ID` y `Span ID` para poder correlacionar un log específico con una traza completa.
*   **Usa un Agente Jaeger (Sidecar en K8s)**: En Kubernetes, desplegar el Jaeger Agent como un sidecar en cada Pod es la forma recomendada, ya que reduce el overhead de red y garantiza que los Spans se envíen de forma robusta.
*   **Comprende la Jerarquía de Spans**: Un buen entendimiento de cómo se anidan los Spans te ayudará a interpretar el gráfico de Gantt y a identificar cuellos de botella en la traza.

---

Este cheatsheet te proporciona una referencia completa de Jaeger, cubriendo sus conceptos esenciales de trazabilidad distribuida, su arquitectura, cómo instalar el servidor, instrumentar aplicaciones Spring Boot, visualizar trazas y aplicar las mejores prácticas para un monitoreo y depuración eficientes en arquitecturas de microservicios.