
---

# 🌊 Amazon Kinesis Cheatsheet Completo 🌊

**Amazon Kinesis** es una plataforma de streaming de datos en AWS que facilita la recopilación, procesamiento y análisis de datos de streaming en tiempo real. Permite manejar grandes volúmenes de datos de una amplia gama de fuentes con alta durabilidad y escalabilidad.

---

## 1. 🌟 Conceptos Clave

* **Streaming de Datos (Data Streaming)**: El proceso de mover datos de forma continua y en tiempo real, a medida que se generan.
* **Shard (Fragmento)**: La unidad base de throughput en Kinesis Data Streams. Cada shard proporciona una capacidad fija de lectura (2MB/s de datos, hasta 5 transacciones/s) y escritura (1MB/s de datos, hasta 1000 registros/s).
* **Partition Key (Clave de Partición)**: Un valor (ej. ID de usuario, ID de dispositivo) que los productores usan para asignar un registro a un shard específico. Los registros con la misma clave de partición van al mismo shard, lo que garantiza el orden dentro de ese shard.
* **Sequence Number (Número de Secuencia)**: Un identificador único que Kinesis asigna a cada registro cuando se añade al stream. Es la base para el orden garantizado dentro de un shard.
* **Retención de Datos (Data Retention)**: El tiempo que los datos permanecen disponibles en un Kinesis Data Stream (24 horas por defecto, configurable hasta 365 días).
* **Throughput**: La cantidad de datos (MB/s) o registros/segundo que un stream puede manejar. Se escala ajustando el número de shards.
* **Consistencia de Lectura**:
  * **Lectura Altamente Consistente**: Se obtienen los datos más actualizados.
  * **Lectura Eventualmente Consistente**: Se obtienen los datos casi más actualizados (default para rendimiento).
* **Kinesis Client Library (KCL)**: Una librería Java (y adaptadores para otros lenguajes) que simplifica el desarrollo de aplicaciones consumidoras de Kinesis Data Streams, manejando la lógica de escalado, el seguimiento de la posición y el rebalanceo de shards.

---

## 2. 🛠️ Servicios Principales de Kinesis

### 2.1. Kinesis Data Streams (KDS) - ¡El Servicio Core!

* **Propósito**: Captura y almacena datos de streaming de forma continua y a gran escala. Es la "columna vertebral" para el streaming en tiempo real.
* **Modelo**: Stream de registros que se almacena en shards por un período de retención.
* **Uso**: Ingesta de logs de aplicaciones, datos de clickstream, datos de IoT, transacciones financieras.

### 2.2. Kinesis Firehose (KDF)

* **Propósito**: Carga datos de streaming en servicios de almacenamiento o análisis de AWS (S3, Redshift, OpenSearch Service, Splunk) de forma automática y sin servidor.
* **Modelo**: Servicio gestionado que no requiere administración de shards. Realiza transformaciones, compresión y agrupación (buffering) de datos.
* **Uso**: Captura datos para data lakes (S3), data warehouses (Redshift), análisis de logs (OpenSearch/Splunk).

### 2.3. Kinesis Data Analytics (KDA)

* **Propósito**: Procesar y analizar datos de streaming en tiempo real utilizando SQL estándar o Apache Flink.
* **Modelo**: Servicio gestionado sin servidor.
* **Uso**: Analítica en tiempo real (detección de anomalías, agregaciones), procesamiento ETL de streaming.

### 2.4. Kinesis Video Streams (KVS)

* **Propósito**: Captura, procesa y almacena datos de video de streaming de forma segura.
* **Uso**: Grabación de cámaras de seguridad, analítica de video en tiempo real.

---

## 3. 📝 Kinesis Data Streams (KDS) - Detalles

### 3.1. Creación de un Stream (Console / CLI / SDK)

```bash
aws kinesis create-stream \
    --stream-name my-data-stream \
    --shard-count 1 # Número de shards. Cada shard es 1MB/s write, 2MB/s read.
```

### 3.2. Publicar Datos (Producers)

* **`PutRecord`**: Envía un solo registro a un stream.
* **`PutRecords`**: Envía hasta 500 registros en una sola llamada API (operación por lotes).
* **`Partition Key`**: Obligatorio. Determina a qué shard se envía el registro. **¡CRÍTICO para la distribución y el orden!**
* **`Data Blob`**: Los datos del registro (hasta 1MB por registro, o 50KB en PutRecords si no usas Partition Key, entonces es 1MB).

```bash
# AWS CLI - PutRecord
aws kinesis put-record \
    --stream-name my-data-stream \
    --partition-key "user-123" \
    --data "{\"event_type\": \"login\", \"user_id\": \"user-123\", \"timestamp\": 1678886400}"

# AWS CLI - PutRecords (para múltiples registros)
aws kinesis put-records \
    --stream-name my-data-stream \
    --records '[
        {"Data":"{\"event_type\":\"add_to_cart\",\"user_id\":\"user-123\"}","PartitionKey":"user-123"},
        {"Data":"{\"event_type\":\"view_product\",\"user_id\":\"user-456\"}","PartitionKey":"user-456"}
    ]'
```

* **KPL (Kinesis Producer Library)**: Una librería para productores de Java que simplifica la escritura en KDS, proporcionando agregación, reintentos y lógica asíncrona.

### 3.3. Consumir Datos (Consumers)

* **`GetShardIterator`**: Obtiene un iterador para un shard específico, indicando dónde empezar a leer.
  * `ShardIteratorType`: `LATEST` (desde el más reciente), `TRIM_HORIZON` (desde el principio), `AT_SEQUENCE_NUMBER`, `AFTER_SEQUENCE_NUMBER`, `AT_TIMESTAMP`.
* **`GetRecords`**: Recupera un lote de registros usando el iterador del shard. Devuelve el próximo iterador de shard.
  * Se requiere un bucle para seguir obteniendo registros.
* **KCL (Kinesis Client Library) - ¡Recomendado para consumidores complejos!**
  * Una librería que simplifica el consumo de KDS al abstraer la lógica de gestión de shards, balanceo de carga, checkpointing (seguimiento de progreso) y manejo de errores.
  * **`DynamoDB`**: KCL utiliza DynamoDB para almacenar el estado del checkpointing (la posición de lectura de cada shard).
  * Los consumidores KCL se ejecutan como un grupo de instancias, cada una procesando un subconjunto de shards.

```java
// Ejemplo conceptual de KCL Worker (Java)
// Configuración en application.properties:
// aws.kinesis.streamName=my-data-stream
// aws.kinesis.applicationName=my-kcl-application
// aws.dynamodb.tableName=my-kcl-checkpoints

public class RecordProcessorFactory implements IRecordProcessorFactory {
    public IRecordProcessor createProcessor() {
        return new MyRecordProcessor();
    }
}

public class MyRecordProcessor implements IRecordProcessor {
    // Implementar métodos: initialize, processRecords, shutdown
    @Override
    public void processRecords(ProcessRecordsInput processRecordsInput) {
        for (Record record : processRecordsInput.getRecords()) {
            String data = new String(record.getData().array(), StandardCharsets.UTF_8);
            System.out.println("Procesando registro: " + data + " en shard " + record.getPartitionKey());
            // Lógica de negocio aquí
        }
        // Checkpoint: KCL usa DynamoDB para guardar la posición de lectura
        processRecordsInput.getCheckpointer().checkpoint();
    }
    // ... otros métodos ...
}
```

### 3.4. Escalado (Resharding)

* **`UpdateShardCount`**: Cambia el número de shards en un stream para aumentar o disminuir la capacidad.
  * `aws kinesis update-shard-count --stream-name my-data-stream --target-shard-count 2 --scaling-type UNIFORM_SCALING`
* **`SplitShard` / `MergeShards`**: Operaciones de bajo nivel para cambiar manualmente la distribución de rangos de claves de partición.

---

## 4. 🧰 Kinesis Firehose (KDF) - Detalles

### 4.1. Creación de un Delivery Stream

1. **Source**: Direct Put o Kinesis Data Stream.
2. **Destino**: S3, Redshift, OpenSearch Service, Splunk.
3. **Transformación y Conversión de Formato**:
   * Opcional: Invoca una función Lambda para transformar registros.
   * Opcional: Convertir a Parquet o ORC para destinos S3/Redshift.
4. **Configuración del Buffer**:
   * `Buffer size` (1-128 MB), `Buffer interval` (60-900 segundos).
   * Firehose envía datos cuando se alcanza el tamaño o el intervalo del buffer.
5. **Compresión**: GZIP, Snappy, ZIP, o no comprimir.
6. **Cifrado**: En el destino S3.
7. **IAM Role**: Rol con permisos para leer de la fuente y escribir en el destino.

### 4.2. Publicar Datos en Firehose (Producers)

* **`PutRecord`**: Envía un solo registro a un Firehose Delivery Stream.
* **`PutRecordBatch`**: Envía hasta 500 registros en una sola llamada API.

```bash
# AWS CLI - PutRecord en Firehose
aws firehose put-record \
    --delivery-stream-name my-firehose-stream \
    --record '{"Data": "{\"log_level\": \"INFO\", \"message\": \"User logged in\"}\n"}'
```

* **Nota**: `\n` al final del `Data` es importante para que Firehose lo trate como un registro separado al cargarlo a S3/Redshift.

---

## 5. 🌊 Kinesis Data Analytics (KDA) - Detalles

### 5.1. Creación de una Aplicación de KDA

1. **Fuente de Streaming**: Kinesis Data Stream o Kinesis Firehose.
2. **Destino (Opcional)**: Kinesis Data Stream, Kinesis Firehose.
3. **Código**:
   * **SQL Studio**: Escribe consultas SQL ANSI estándar para procesar streams.
     ```sql
     CREATE OR REPLACE STREAM "DESTINATION_SQL_STREAM" (
       event_type VARCHAR(64),
       user_id VARCHAR(64),
       event_count INTEGER
     );

     CREATE OR REPLACE PUMP "STREAM_PUMP" AS INSERT INTO "DESTINATION_SQL_STREAM"
     SELECT STREAM "event_type", "user_id", COUNT(*) AS event_count
     FROM "SOURCE_SQL_STREAM_001"
     GROUP BY "event_type", "user_id", STEP("SOURCE_SQL_STREAM_001".ROWTIME BY INTERVAL '1' MINUTE);
     ```
   * **Apache Flink**: Escribe aplicaciones Apache Flink en Java, Scala o Python. Más flexibilidad y potencia.
4. **IAM Role**: Rol con permisos para leer de la fuente y escribir en el destino.

---

## 6. 🔒 Seguridad

* **IAM Roles y Policies**: La forma **recomendada** para controlar quién puede crear/gestionar streams, quién puede publicar y quién puede consumir.
* **Encryption at Rest**:
  * **Kinesis Data Streams**: Cifrado del lado del servidor (SSE) con claves gestionadas por AWS KMS o S3.
  * **Kinesis Firehose**: Cifrado de destino S3 con claves KMS.
* **Encryption in Transit**: Todas las comunicaciones con Kinesis usan HTTPS.
* **VPC Endpoints**: Accede a los servicios de Kinesis desde una VPC privada sin pasar por la internet pública.

---

## 7. 📈 Monitoreo y Auditoría

* **CloudWatch Metrics**: Monitorea métricas clave como `IncomingBytes/Records`, `Read/WriteProvisionedThroughputExceeded`, `GetRecords.IteratorAgeMilliseconds`, `PutRecord.Success`, `ReadLatency`.
* **CloudWatch Alarms**: Configura alarmas para umbrales críticos.
* **CloudWatch Logs**: Los logs de KCL, Firehose y Data Analytics se envían a CloudWatch Logs.
* **CloudTrail**: Registra todas las llamadas API de Kinesis para auditoría.

---

## 8. 💡 Buenas Prácticas y Consejos

* **Diseño de `Partition Key` (KDS)**: **¡CRÍTICO!**
  * Debe tener una alta cardinalidad y una distribución uniforme para evitar "hot shards" (shards con mucha actividad).
  * Asegúrate de que tus datos se distribuyan equitativamente entre los shards.
  * Si el orden es crítico para un subconjunto de datos (ej. eventos de un usuario específico), usa el ID de ese subconjunto como `Partition Key`.
* **Escalado de Shards (KDS)**: Escala tus shards a medida que cambian los requisitos de throughput. Monitorea `Read/WriteProvisionedThroughputExceeded` en CloudWatch.
* **KCL para Consumidores Confiables (KDS)**: Para aplicaciones consumidoras complejas y escalables, utiliza Kinesis Client Library para gestionar la lógica de lectura y checkpointing.
* **Firehose para Carga a Destinos Comunes**: Usa Firehose para una forma sencilla y sin servidor de cargar datos de streaming en S3, Redshift, OpenSearch.
* **Data Analytics para Procesamiento en Tiempo Real**: Utiliza KDA para realizar agregaciones, transformaciones y analítica en tiempo real directamente en los streams.
* **Mensajes Idempotentes**: Diseña tus consumidores para que sean idempotentes, ya que Kinesis garantiza una entrega "al menos una vez" y los reintentos pueden causar duplicados.
* **Gestión de `IteratorAgeMilliseconds`**: En CloudWatch, monitorea el `IteratorAgeMilliseconds` de tus consumidores KCL. Un valor creciente indica que el consumidor no está al día con el stream.
* **Preprocesamiento de Datos**: Utiliza Lambda como un paso intermedio para preprocesar o validar datos antes de enviarlos a Kinesis.
* **Cifrado Activo**: Habilita el cifrado SSE con KMS para tus streams KDS.
* **Roles de IAM con Mínimo Privilegio**: Otorga los permisos mínimos necesarios a los roles de IAM de productores y consumidores.

---

Este cheatsheet te proporciona una referencia completa de Amazon Kinesis, cubriendo sus conceptos esenciales, los servicios principales (Data Streams, Firehose, Data Analytics), cómo publicar y consumir datos, las estrategias de escalado, seguridad y las mejores prácticas para construir sistemas de procesamiento de datos de streaming en tiempo real en AWS.
