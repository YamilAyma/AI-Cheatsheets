
---

# 👁️ Amazon CloudWatch Cheatsheet Completo 👁️

**Amazon CloudWatch** es un servicio de monitoreo y gestión para AWS Cloud Resources y las aplicaciones que ejecutas en AWS. Recopila y rastrea métricas, monitorea archivos de log, dispara alarmas y reacciona automáticamente a los cambios en tus recursos de AWS. Proporciona una vista unificada de la salud de tus recursos, lo que te ayuda a detectar problemas, depurar y optimizar el rendimiento.

---

## 1. 🌟 Conceptos Clave

* **Métrica (Metric)**: Una variable de tiempo. Un punto de datos que representa una medición única tomada en un período de tiempo. Se identifica por un nombre de métrica, un namespace y dimensiones.
* **Namespace**: Un contenedor para métricas. Identifica el servicio de AWS o la aplicación que generó la métrica (ej. `AWS/EC2`, `AWS/RDS`, `MyApplication`).
* **Dimensión (Dimension)**: Un par nombre-valor que identifica de forma única una métrica. Permite filtrar y segmentar métricas (ej. `InstanceId`, `InstanceType` para EC2; `DBInstanceIdentifier` para RDS).
* **Estadística (Statistic)**: Una agregación de datos de métricas durante un período de tiempo (ej. `Average`, `Sum`, `Minimum`, `Maximum`, `SampleCount`, `p90`, `p99`).
* **Período (Period)**: La duración en la que se agregan los puntos de datos de las métricas (ej. 1 minuto, 5 minutos, 1 hora).
* **Alarma (Alarm)**: Monitorea una métrica y dispara una acción (ej. notificación SNS, acción de Auto Scaling) cuando el valor de la métrica cruza un umbral específico durante un número de períodos.
* **Evento (Event)**: Un cambio en un entorno de AWS. CloudWatch Events (ahora EventBridge) te permite responder a estos cambios.
* **Log Group (Grupo de Logs)**: Una agrupación lógica de flujos de logs de CloudWatch Logs.
* **Log Stream (Flujo de Logs)**: Una secuencia de eventos de logs de una fuente específica dentro de un Log Group.

---

## 2. 📊 Métricas (Metrics)

* **Recopilación**: Muchos servicios de AWS (EC2, RDS, Lambda, S3, ELB) publican métricas automáticamente en CloudWatch.
* **Métricas Estándar**: Gratuitas, con resolución de 1 minuto (o 5 minutos para algunos servicios heredados).
* **Métricas Detalladas (Detailed Monitoring)**: Resolución de 1 segundo (con costo adicional) para EC2.
* **Métricas Personalizadas (Custom Metrics)**: Puedes publicar tus propias métricas desde tus aplicaciones utilizando el SDK de AWS o la CLI.
  * **`aws cloudwatch put-metric-data`**:
    ```bash
    aws cloudwatch put-metric-data \
        --namespace "MyApplication" \
        --metric-data "MetricName=OrderCount,Value=1,Unit=Count,Dimensions=[{Name=Environment,Value=Prod},{Name=Region,Value=us-east-1}]"
    ```

### 2.1. Navegación de Métricas

1. En la consola de CloudWatch, ve a `Metrics`.
2. Explora por `All metrics` o `Custom namespaces`.
3. Selecciona un `Namespace` (ej. `AWS/EC2`).
4. Selecciona una dimensión (ej. `Per-Instance Metrics`).
5. Selecciona una métrica (ej. `CPUUtilization`).
6. Configura el `Time range` (rango de tiempo) y el `Period` (granularidad de agregación).
7. Elige la `Statistic` (ej. `Average`, `Sum`, `Max`).

---

## 3. 🔔 Alarmas (Alarms)

Disparan acciones cuando una métrica excede un umbral.

### 3.1. Crear una Alarma

1. En la consola de CloudWatch, ve a `Alarms` -> `Create alarm`.
2. **Specify metric**: Selecciona la métrica (ej. `CPUUtilization` para una `InstanceId` específica).
3. **Define threshold**:
   * `Static`: Umbral fijo (ej. `CPUUtilization` `is Greater than` `80`).
   * `Anomaly detection`: Umbral dinámico basado en el comportamiento histórico (crea una banda de confianza).
   * `Math expression`: Define una expresión matemática.
4. **Period**: Duración en la que se evalúa la métrica.
5. **Datapoints to alarm**: Cuántos puntos de datos consecutivos deben cruzar el umbral para que la alarma cambie de estado.
6. **Configure actions**: Qué hacer cuando la alarma cambia de estado.
   * **Notification**: Enviar una notificación a un tema SNS.
   * **EC2 Action**: Detener/terminar/reiniciar/recuperar una instancia EC2.
   * **Auto Scaling Action**: Añadir/eliminar instancias en un Auto Scaling Group.
7. **Name, Description**.

### 3.2. Estados de Alarma

* **`OK`**: La métrica está dentro del umbral.
* **`ALARM`**: La métrica ha cruzado el umbral.
* **`INSUFFICIENT_DATA`**: No hay suficientes datos para determinar el estado.

---

## 4. 📝 CloudWatch Logs

Almacena, monitorea y analiza archivos de log de sistemas, aplicaciones y servicios de AWS.

* **Log Group**: Un grupo lógico de Log Streams (ej. `/aws/lambda/my-function`, `/var/log/nginx`).
* **Log Stream**: Una secuencia de eventos de log dentro de un Log Group (ej. logs de una instancia EC2 específica, de una invocación de Lambda).
* **Eventos de Log**: Un registro individual con un mensaje y una marca de tiempo.

### 4.1. Recopilación de Logs

* **Servicios AWS**: Muchos servicios de AWS (Lambda, ECS, EKS, API Gateway) envían logs automáticamente a CloudWatch Logs.
* **Agente CloudWatch (para EC2/On-Premise)**:
  1. Instala el agente CloudWatch en tus instancias EC2 o servidores locales.
  2. Configura el agente para recolectar logs de archivos específicos (ej. `/var/log/syslog`, `/var/log/my-app/*.log`) y enviarlos a Log Groups específicos.
  3. Asegura que el rol de IAM de la instancia tenga permisos para `logs:CreateLogGroup`, `logs:CreateLogStream`, `logs:PutLogEvents`.

### 4.2. Consulta de Logs (`CloudWatch Logs Insights`)

* Un motor de consulta interactivo para analizar logs.
  ```
  fields @timestamp, @message
  | filter @message like /Error/
  | sort @timestamp desc
  | limit 20
  | stats count() as error_count by bin(5m)
  ```

### 4.3. Filtros de Métricas (Metric Filters)

* Extrae valores numéricos de los eventos de log y los publica como métricas de CloudWatch.
* **Uso**: Crear alarmas sobre patrones de logs (ej. alarma cuando se detectan 5 errores en 1 minuto en los logs).

---

## 5. 🗓️ EventBridge (Antes CloudWatch Events)

Servicio de bus de eventos sin servidor que conecta tus aplicaciones con datos de tus propios sistemas, aplicaciones SaaS y servicios de AWS.

* **Event Rule (Regla de Evento)**: Define un patrón de evento o un cronograma y una acción a realizar.
* **Event Pattern (Patrón de Evento)**: Coincide con eventos específicos de AWS o eventos personalizados.
* **Scheduler (Programador)**: Un cronograma (sintaxis cron) para disparar la regla (ej. `cron(0 12 * * ? *)` para cada día a las 12 PM UTC).
* **Target (Objetivo)**: El servicio AWS o endpoint al que se envía el evento (ej. Lambda, SQS, SNS, ECS tasks, Step Functions).

### 5.1. Crear una Regla de Evento

1. En la consola de EventBridge, ve a `Rules` -> `Create rule`.
2. **Define Pattern**:
   * **Event Pattern**: `{"source":["aws.ec2"], "detail-type":["EC2 Instance State-change Notification"]}` (para cambios de estado de EC2).
   * **Schedule**: `cron(0 2 * * ? *)` (cada día a las 2 AM UTC).
3. **Select Targets**: Elige la acción (ej. `Lambda function`).
   * `Input Transformer`: (Opcional) Transforma el evento antes de pasarlo al Target.

---

## 6. 💡 Buenas Prácticas y Consejos

* **Monitorea los 4 Golden Signals**: Latencia, Tráfico, Errores y Saturación para tus aplicaciones y servicios.
* **Alarmas para Métricas Críticas**: Configura alarmas de CloudWatch para métricas clave (ej. `CPUUtilization` > 80%, `ErrorRate` > 0, `Latency` alta, `QueueSize` de SQS alta).
* **Notificaciones de Alarma**: Envía notificaciones de alarma a través de SNS a múltiples destinos (email, SMS, Slack/PagerDuty vía Lambda).
* **Logging Estructurado**: Haz que tus aplicaciones generen logs en formato JSON o de clave-valor para facilitar el análisis en CloudWatch Logs Insights.
* **Agente CloudWatch para EC2/On-Premise**: Úsalo para recolectar logs de archivos y métricas a nivel de sistema operativo.
* **Métricas Personalizadas**: Publica métricas personalizadas para el monitoreo de la lógica de negocio clave.
* **EventBridge para Automatización**: Utiliza EventBridge para automatizar tareas en respuesta a eventos de AWS o eventos personalizados de tu aplicación.
* **Costos**: Presta atención a los costos. Las métricas personalizadas de alta resolución y los logs de larga retención pueden ser costosos.
* **Seguridad con IAM**: Utiliza IAM para controlar quién puede ver métricas, configurar alarmas y acceder a los logs.
* **Dashboards de CloudWatch**: Crea dashboards personalizados para una vista unificada de tus métricas y logs más importantes.
* **Correlación de Logs, Métricas y Trazas**: Integra CloudWatch con Micrometer Tracing/Jaeger para correlacionar logs y métricas con trazas distribuidas.

---

Este cheatsheet te proporciona una referencia completa de Amazon CloudWatch, cubriendo sus conceptos esenciales, métricas, alarmas, logs, eventos (EventBridge) y las mejores prácticas para monitorear, analizar y automatizar tus recursos y aplicaciones en AWS.
