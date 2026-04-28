---
title: "prometheus"
---


---

# 📈 Prometheus Cheatsheet Completo 📈

**Prometheus** es una solución de monitoreo de código abierto y sistema de alertado. Se especializa en recolectar métricas de "series de tiempo" (time series data) y ofrece un modelo de datos multidimensional, un lenguaje de consulta flexible (PromQL) y capacidades de alertado.

---

## 1. 🌟 Conceptos Clave

*   **Series de Tiempo (Time Series)**: Un conjunto de valores de datos indexados por un timestamp. En Prometheus, cada serie de tiempo se identifica por un nombre de métrica y un conjunto de pares clave-valor (etiquetas/labels).
*   **Métrica (Metric)**: Un nombre para el tipo de datos que se está midiendo (ej. `http_requests_total`, `cpu_usage_seconds_total`).
*   **Etiquetas (Labels)**: Pares clave-valor que proporcionan dimensiones adicionales a una métrica, lo que permite consultas flexibles (ej. `http_requests_total{method="POST", path="/api/users"}`).
*   **Target (Objetivo)**: Un endpoint que Prometheus scrapea (raspa) para obtener métricas (ej. `/metrics` de una aplicación).
*   **Scraping (Raspado)**: El proceso mediante el cual Prometheus extrae métricas de los Targets en intervalos regulares.
*   **PromQL (Prometheus Query Language)**: Un lenguaje de consulta funcional potente para seleccionar y agregar datos de series de tiempo.
*   **Alertmanager**: Un componente separado que maneja las alertas enviadas por Prometheus. Se encarga de la deduplicación, el agrupamiento y el enrutamiento de las alertas a las herramientas de notificación.

---

## 2. 🛠️ Arquitectura de Prometheus

1.  **Prometheus Server**:
    *   **Retriever**: Scrapea métricas de los targets.
    *   **Time Series Database (TSDB)**: Almacena las métricas scrapeadas.
    *   **HTTP Server**: Para la UI, el API y los Pushgateway.
    *   **Rule Manager**: Evalúa reglas de grabación y reglas de alerta.
2.  **Exporters**: Aplicaciones o librerías que exponen métricas en el formato Prometheus desde sistemas que no lo hacen nativamente (ej. Node Exporter para métricas de host, JMX Exporter para JVMs).
3.  **Pushgateway (Opcional)**: Para métricas de trabajos de corta duración que no pueden ser scrapeadas directamente. Los jobs envían sus métricas al Pushgateway, y Prometheus las scrapea del Pushgateway.
4.  **Alertmanager**: Recibe alertas de Prometheus, las agrupa, silencia y las envía a los destinatarios.
5.  **Service Discovery**: Prometheus puede descubrir Targets dinámicamente de sistemas como Kubernetes, Consúl, EC2, etc.

---

## 3. ⚙️ Instalación y Configuración Básica

### 3.1. Con Docker (Recomendado para Desarrollo/Pruebas)

```bash
docker run -d --name prometheus -p 9090:9090 \
  -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus:v2.48.0 # Usar la versión específica
```

### 3.2. Archivo de Configuración (`prometheus.yml`)

Define cómo Prometheus scrapea los targets, evalúa las reglas y almacena los datos.

```yaml
# prometheus.yml
global:
  scrape_interval: 15s # Intervalo por defecto para raspar targets
  evaluation_interval: 15s # Intervalo por defecto para evaluar reglas

# Reglas de alerta
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['localhost:9093'] # Dirección del Alertmanager

rule_files: # Archivos que contienen reglas de grabación y alerta
  - "alert.rules.yml" # Ejemplo

scrape_configs: # Cómo Prometheus encuentra y scrapea los targets
  - job_name: "prometheus" # Monitorear el propio Prometheus
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "node_exporter" # Monitorear hosts (si tienes node_exporter ejecutándose)
    static_configs:
      - targets: ["localhost:9100"] # Puerto por defecto de Node Exporter

  - job_name: "my_java_app" # Monitorear tu aplicación Java (ej. Spring Boot Actuator)
    metrics_path: "/actuator/prometheus" # Endpoint de métricas de Actuator
    static_configs:
      - targets: ["localhost:8080"] # Dirección de tu aplicación
        labels:
          application: "my-app-service" # Etiquetas personalizadas para este job
```

### 3.3. Acceder a la UI de Prometheus

*   `http://localhost:9090` (para la UI, explorador de PromQL, estado del servidor).

---

## 4. 📈 PromQL (Prometheus Query Language) Cheatsheet

Lenguaje funcional potente para consultar métricas.

### 4.1. Tipos de Datos

*   **Instant vector**: Un conjunto de series de tiempo que contienen un único valor para cada serie de tiempo, todos con la misma marca de tiempo.
    *   `http_requests_total`
    *   `http_requests_total{method="POST"}`
*   **Range vector**: Un conjunto de series de tiempo que contienen un rango de valores para cada serie de tiempo.
    *   `http_requests_total[5m]` (últimos 5 minutos)
*   **Scalar**: Un simple valor numérico de punto flotante.
    *   `100`
*   **String**: Una cadena de caracteres (poco usado en consultas).
    *   `"hello"`

### 4.2. Selectores de Métricas y Etiquetas

*   `metric_name`: Selecciona todas las series de tiempo con ese nombre.
*   `metric_name{label1="value1", label2!="value2"}`: Filtra por etiquetas.
    *   `=`: Seleccionar etiquetas que son exactamente iguales.
    *   `!=`: Seleccionar etiquetas que no son exactamente iguales.
    *   `=~`: Seleccionar etiquetas que coinciden con una expresión regular.
    *   `!~`: Seleccionar etiquetas que no coinciden con una expresión regular.
    *   `{method="POST", path="/api.*"}`: Método POST y path que empieza por `/api`.

### 4.3. Operadores de Rango

*   `[duration]`: Especifica un rango de tiempo.
    *   `[5m]`, `[1h]`, `[1d]`, `[30s]`.

### 4.4. Operadores de Agregación (Agregadores)

Operan sobre un vector instantáneo. Agregan sobre dimensiones de etiquetas.

*   `sum()`: Calcula la suma de los valores.
*   `avg()`: Calcula el promedio.
*   `count()`: Cuenta el número de elementos.
*   `min()`, `max()`: Mínimo / Máximo.
*   `stddev()`, `stdvar()`: Desviación estándar / Varianza.
*   `group()`: Agrupa por etiquetas.
*   `topk(k, vector)`: Los `k` elementos con los valores más grandes.

    ```promql
    sum(http_requests_total)                   # Suma de todas las solicitudes HTTP
    sum by (path) (http_requests_total)        # Suma por cada 'path'
    avg by (status_code) (http_requests_total) # Promedio por 'status_code'
    count(http_requests_total{method="GET"})  # Cantidad de requests GET
    ```

### 4.5. Operadores de Vector a Vector / Vector a Escalar

*   `+`, `-`, `*`, `/`, `%`, `^` (exponente).
*   `and`, `or`, `unless`.

### 4.6. Funciones Comunes

*   `rate(instant_vector_range)`: Calcula la tasa promedio por segundo de un contador sobre un rango de tiempo. **¡CRÍTICO para contadores!**
    *   `rate(http_requests_total[5m])`: Tasa de solicitudes HTTP por segundo en los últimos 5 minutos.
*   `irate(instant_vector_range)`: Tasa instantánea por segundo (basada en los dos últimos puntos).
*   `increase(instant_vector_range)`: El aumento total de un contador sobre un rango de tiempo.
    *   `increase(node_cpu_seconds_total[1h])`: Total de segundos de CPU en la última hora.
*   `delta(instant_vector_range)`: La diferencia de un *gauge* sobre un rango de tiempo.
*   `resets(instant_vector_range)`: Cuenta el número de veces que un contador se reinicia.
*   `predict_linear(instant_vector_range, sec_ahead)`: Predice valores futuros usando regresión lineal.
*   `histogram_quantile(φ, histogram_bucket_vector)`: Calcula cuantiles de histogramas.
    *   `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))`: El 99 percentil de duración de solicitudes.
*   `deriv(instant_vector_range)`: La derivada de un *gauge*.
*   `abs(vector)`, `ceil(vector)`, `floor(vector)`, `round(vector)`.
*   `exp(vector)`, `ln(vector)`, `log2(vector)`, `log10(vector)`.
*   `sqrt(vector)`.
*   `clamp_min(vector, scalar)`, `clamp_max(vector, scalar)`.
*   `topk(k, vector)`: Los `k` elementos con los valores más grandes.
*   `bottomk(k, vector)`: Los `k` elementos con los valores más pequeños.

---

## 5. 🔔 Alerting (Alertmanager)

Prometheus evalúa reglas de alerta y envía alertas a Alertmanager. Alertmanager luego las agrupa, silencia y las enruta.

### 5.1. Archivo de Reglas (`alert.rules.yml`)

```yaml
# alert.rules.yml
groups:
  - name: my_app_alerts
    rules:
      - alert: HighRequestLatency # Nombre de la alerta
        expr: rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m]) > 0.5 # Latencia promedio > 0.5s
        for: 1m # La condición debe ser verdadera durante 1 minuto
        labels: # Etiquetas adicionales para la alerta
          severity: critical
        annotations: # Anotaciones para la alerta
          summary: "Alta latencia de solicitud en servicio {{ $labels.service_name }}"
          description: "La latencia promedio para el servicio {{ $labels.service_name }} ha excedido 0.5 segundos por más de 1 minuto."

      - alert: ServiceDown # Alerta si un servicio está inactivo
        expr: up{job="my_java_app"} == 0 # 'up' es una métrica de Prometheus que es 1 si el target está UP, 0 si está DOWN
        for: 30s
        labels:
          severity: major
        annotations:
          summary: "Servicio {{ $labels.job }} está inactivo"
          description: "El servicio {{ $labels.job }} en instancia {{ $labels.instance }} está inactivo por más de 30 segundos."
```

### 5.2. Configuración de Alertmanager (`alertmanager.yml`)

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m

route:
  receiver: 'default-receiver' # Receptor por defecto
  group_by: ['alertname', 'instance'] # Agrupar alertas por nombre de alerta e instancia
  group_wait: 30s # Esperar 30s para más alertas antes de enviar
  group_interval: 5m # Intervalo para enviar nuevas alertas en un grupo
  repeat_interval: 3h # Intervalo para reenviar alertas resueltas

receivers:
  - name: 'default-receiver'
    email_configs: # Configuración de email
      - to: 'your-email@example.com'
        send_resolved: true # Enviar notificación cuando la alerta se resuelve
  - name: 'slack-receiver'
    slack_configs: # Configuración de Slack
      - api_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX'
        channel: '#alerts'
        send_resolved: true
        title: '[{{ .Status | toUpper }}] {{ .CommonLabels.alertname }} for {{ .CommonLabels.instance }}'
        text: '{{ .CommonAnnotations.description }}'
```

---

## 6. 📊 Integración con Grafana (Visualización)

Grafana es la herramienta de visualización de dashboards más popular para Prometheus.

1.  **Instalar Grafana**: Sigue las instrucciones de Grafana.
    ```bash
    docker run -d -p 3000:3000 grafana/grafana:latest
    # Accede a http://localhost:3000 (admin/admin)
    ```2.  **Añadir Fuente de Datos**: En Grafana UI, ve a "Configuration" -> "Data Sources" -> "Add data source" -> "Prometheus". Configura la URL de tu Prometheus (ej. `http://localhost:9090`).
3.  **Crear Dashboards**: Crea paneles en Grafana y usa PromQL para consultar tus métricas de Prometheus.

---

## 7. 💡 Buenas Prácticas y Consejos

*   **Exportadores Oficiales y Comunitarios**: Utiliza exportadores existentes (ej. Node Exporter para hosts, cAdvisor para contenedores, JMX Exporter para JVM) antes de escribir los tuyos.
*   **Nombres de Métricas Claros**: Usa nombres de métricas descriptivos y consistentes (`snake_case`).
*   **Etiquetas Granulares**: Utiliza etiquetas para añadir dimensiones útiles a tus métricas (ej. `method`, `path`, `status_code`, `instance`, `job`, `service_name`). Esto permite consultas y agregaciones flexibles.
*   **Tipos de Métricas Correctos**:
    *   **Counter**: Para valores que solo aumentan (ej. número de solicitudes). Usa `rate()` o `increase()`.
    *   **Gauge**: Para valores que pueden subir y bajar (ej. uso de CPU, número de usuarios activos).
    *   **Histogram**: Para muestrear observaciones (ej. duración de solicitudes) y agruparlas en rangos configurables. Permite calcular percentiles.
    *   **Summary**: Similar a Histogram, pero calcula los cuantiles en el cliente.
*   **Manejo de Contadores**: Los contadores pueden reiniciarse (ej. cuando un servicio se reinicia). Usa `rate()` o `increase()` para manejar esto correctamente.
*   **Reglas de Grabación (Recording Rules)**: Para consultas PromQL complejas o costosas que se ejecutan con frecuencia, crea reglas de grabación para pre-calcular y almacenar los resultados como nuevas series de tiempo.
*   **Reglas de Alerta Claras**: Define reglas de alerta con umbrales y `for` (duración para la condición) adecuados. Incluye `summary` y `description` útiles en las anotaciones.
*   **Monitoreo del Propio Prometheus**: Incluye el job `prometheus` en `scrape_configs` para monitorear la salud de tu servidor Prometheus.
*   **Federación (Federation)**: Para monitorear múltiples clústeres de Prometheus o centralizar métricas.
*   **Largo Plazo (Long-Term Storage)**: Prometheus está optimizado para el almacenamiento de datos a corto plazo. Para el almacenamiento a largo plazo, considera integrar soluciones como Thanos, Cortex o Mimir.

---

Este cheatsheet te proporciona una referencia completa de Prometheus, cubriendo sus conceptos esenciales, arquitectura, cómo configurarlo, el potente lenguaje de consulta PromQL, el sistema de alertado y las mejores prácticas para construir un sistema de monitoreo robusto y escalable.