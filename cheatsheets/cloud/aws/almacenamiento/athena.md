.

---

# 🔍 Amazon Athena Cheatsheet Completo 🔍

**Amazon Athena** es un servicio de consultas interactivo que te permite analizar datos directamente en Amazon S3 utilizando SQL estándar. Es un servicio **sin servidor (serverless)**, lo que significa que no tienes infraestructura que provisionar, gestionar o escalar, y solo pagas por las consultas que ejecutas.

---

## 1. 🌟 Conceptos Clave

* **Sin Servidor (Serverless)**: No necesitas aprovisionar, escalar o gestionar ningún servidor. Athena gestiona automáticamente los recursos de computación.
* **Pago por Consulta (Pay-per-query)**: Solo pagas por la cantidad de datos escaneados por tus consultas.
* **SQL Estándar**: Utiliza ANSI SQL, lo que facilita el uso para aquellos familiarizados con SQL.
* **Lectura de Datos en S3**: Athena consulta datos directamente en Amazon S3. No almacena datos por sí mismo.
* **Fuentes de Datos**: Puede consultar datos en S3 en varios formatos (CSV, JSON, ORC, Parquet, Avro, TSV).
* **Metastore (AWS Glue Data Catalog)**: Athena utiliza el AWS Glue Data Catalog para almacenar los metadatos de las tablas (esquema, ubicación en S3).
* **Búsqueda Ad-Hoc**: Ideal para consultas exploratorias y análisis de datos no planificados.

---

## 2. 🛠️ Configuración y Uso Básico

### 2.1. Requisitos

1. **Datos en Amazon S3**: Tus datos deben estar almacenados en buckets S3.
2. **AWS Glue Data Catalog**: Athena usará Glue Data Catalog para definir tus tablas. Puedes crear tablas directamente en Athena, y se registrarán en Glue.
3. **Output Location (Ubicación de Salida)**: Un bucket S3 donde Athena almacenará los resultados de tus consultas.

### 2.2. Acceso (Console / CLI / SDK)

1. **AWS Management Console**: Ve al servicio Athena.
2. **Query Editor**: La interfaz principal para escribir y ejecutar consultas.
3. **Workgroups**: Permite aislar los recursos de consulta, establecer límites de costos y gestionar los resultados de las consultas.

### 2.3. Crear una Base de Datos y Tabla (DDL)

* Primero, crea una base de datos lógica en Athena (se registra en Glue).

  ```sql
  CREATE DATABASE my_athena_db;
  ```
* Luego, crea una tabla que apunte a tus datos en S3.

  ```sql
  CREATE EXTERNAL TABLE IF NOT EXISTS my_athena_db.logs (
    `timestamp` STRING,
    `level` STRING,
    `message` STRING,
    `source_ip` STRING
  )
  ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde' -- Para CSV
  WITH SERDEPROPERTIES (
    'separatorChar' = ',',
    'quoteChar' = '\"',
    'escapeChar' = '\\'
  )
  LOCATION 's3://my-log-bucket/raw_logs/'; -- Ubicación en S3 de tus archivos de log
  ```

  * **`ROW FORMAT SERDE`**: Define el Serializer/Deserializer (ej. `OpenCSVSerde` para CSV, `JsonSerde` para JSON).
  * **`LOCATION`**: La ruta S3 al directorio que contiene tus datos.

---

## 3. 📝 Tipos de Datos Compatibles

* **Primitivos**: `BOOLEAN`, `TINYINT`, `SMALLINT`, `INT`, `BIGINT`, `DOUBLE`, `FLOAT`, `DECIMAL`, `CHAR`, `VARCHAR`, `STRING`, `BINARY`, `DATE`, `TIMESTAMP`.
* **Complejos**: `ARRAY<data_type>`, `MAP<primitive_type, data_type>`, `STRUCT<col_name : data_type [COMMENT col_comment], ...>`.

### 3.1. Crear Tabla para JSON (Ejemplo)

```sql
CREATE EXTERNAL TABLE IF NOT EXISTS my_athena_db.users_json (
  `user_id` BIGINT,
  `username` STRING,
  `email` STRING,
  `address` STRUCT<street:STRING, city:STRING, zipcode:STRING>, -- Objeto anidado
  `roles` ARRAY<STRING> -- Array de strings
)
ROW FORMAT SERDE 'org.openx.data.json.serde.JsonSerde' -- Para JSON
WITH SERDEPROPERTIES (
  'ignore.malformed.json' = 'true'
)
LOCATION 's3://my-data-bucket/user_profiles/';
```

* **Nota**: Los archivos JSON deben tener un registro por línea.

---

## 4. 🚀 Consultas SQL Estándar

Athena utiliza Presto como motor de consulta, compatible con ANSI SQL.

### 4.1. `SELECT` Básica

```sql
SELECT * FROM my_athena_db.logs LIMIT 10;
```

### 4.2. `WHERE` (Filtrado)

```sql
SELECT timestamp, message
FROM my_athena_db.logs
WHERE level = 'ERROR' AND source_ip LIKE '192.168.%';
```

### 4.3. `GROUP BY` y Funciones de Agregación

```sql
SELECT level, COUNT(*) AS error_count
FROM my_athena_db.logs
GROUP BY level
ORDER BY error_count DESC;
```

### 4.4. `JOIN`s (entre tablas de Athena)

```sql
SELECT u.username, o.order_id, o.total_amount
FROM my_athena_db.users u
JOIN my_athena_db.orders o ON u.user_id = o.user_id
WHERE o.order_date >= '2023-01-01';
```

### 4.5. Funciones de Ventana (Window Functions)

```sql
SELECT timestamp, message,
       ROW_NUMBER() OVER (PARTITION BY source_ip ORDER BY timestamp DESC) AS rn
FROM my_athena_db.logs
WHERE rn <= 5;
```

---

## 5. ⚡ Optimización de Costos y Rendimiento

* **Formato de Datos Columnares (ORC, Parquet - ¡CRÍTICO!)**:
  * **Uso**: Convertir tus datos de S3 a formatos columnares (ORC o Parquet).
  * **Beneficios**: Reduce drásticamente la cantidad de datos escaneados por Athena (solo lee las columnas necesarias) y mejora la velocidad de la consulta. También reduce los costos de S3 por la compresión.
  * **Herramientas**: Usa AWS Glue ETL Jobs o Apache Spark para convertir los datos.
* **Particionamiento de Tablas**:
  * **Uso**: Organiza tus datos en S3 en una estructura de carpetas que refleje las particiones (ej. `s3://my-bucket/logs/year=2023/month=01/day=15/`).
  * **Beneficios**: Athena solo escanea los directorios relevantes para la consulta, reduciendo los datos escaneados.
  * **Cláusula DDL**:
    ```sql
    CREATE EXTERNAL TABLE ...
    PARTITIONED BY (year INT, month INT, day INT) -- Define las claves de partición
    ROW FORMAT SERDE ...
    LOCATION 's3://my-log-bucket/partitioned_logs/';

    MSCK REPAIR TABLE my_athena_db.logs; -- Para descubrir nuevas particiones
    ```
  * **Consultas**: Siempre incluye las columnas de partición en la cláusula `WHERE` (ej. `WHERE year=2023 AND month=1`).
* **Compresión de Datos**: Comprime tus archivos en S3 (GZIP, Snappy). Reduce los datos escaneados y el costo.
* **`LIMIT` y `UNLOAD`**:
  * Usa `LIMIT` para consultas exploratorias y evitar escanear demasiados datos.
  * Usa `UNLOAD` para escribir los resultados de la consulta de vuelta a S3, que luego se pueden usar en otras consultas o servicios.
* **Vistas (`CREATE VIEW`)**: Predefine consultas complejas o para simplificar el acceso a datos. No ahorran costos directamente, pero mejoran la reutilización y la legibilidad.
* **Costos**: Se basa en $5 por TB escaneado. La optimización del escaneo es la clave para reducir los costos.

---

## 6. 🔒 Seguridad

* **IAM Roles y Policies**: Controla quién puede acceder a Athena y a qué buckets S3 puede consultar.
* **Bucket Policies (S3)**: Restringe el acceso a los buckets S3 que contienen tus datos y resultados.
* **Encryption**: Athena soporta el cifrado de datos en S3 (SSE-S3, SSE-KMS, CSE).
* **VPC Endpoints**: Accede a Athena desde una VPC privada sin pasar por la internet pública.
* **Workgroups**: Usa Workgroups para establecer límites de uso de datos, aislar consultas y gestionar costos por equipo o proyecto.

---

## 7. 💡 Buenas Prácticas y Consejos

* **Diseño Schemaless, Optimización Schemeful**: Aunque DynamoDB es schemaless, para un rendimiento óptimo en Athena, necesitas entender cómo estructurar tus datos en S3 y cómo definirlos en el Glue Data Catalog.
* **Convertir a Formatos Columnares**: ¡Es la optimización #1! Usa ORC o Parquet.
* **Particiona tus Datos**: Organiza tus datos en S3 con particiones lógicas para reducir el escaneo.
* **Comprime tus Archivos**: Reduce el tamaño en S3 y los datos escaneados.
* **Limita `SELECT *`**: En consultas de Athena, selecciona solo las columnas que necesitas para reducir los datos escaneados.
* **Usa `CTAS` (CREATE TABLE AS SELECT)**: Para transformar datos y guardarlos de nuevo en S3 en un formato optimizado y particionado.
* **Costos Transparentes**: Cada consulta muestra la cantidad de datos escaneados, lo que te permite optimizar proactivamente.
* **Workgroups para Gobernanza**: Utiliza Workgroups para gestionar el acceso, los costos y las configuraciones de consulta para diferentes equipos o proyectos.
* **`MSCK REPAIR TABLE`**: Ejecútalo cuando añadas nuevas particiones a un directorio de tabla existente en S3.
* **Evita Consultas Complejas con Regex Extensivas**: Las funciones de regex pueden ser costosas en términos de rendimiento.

---

Este cheatsheet te proporciona una referencia completa de Amazon Athena, cubriendo sus conceptos esenciales, cómo crear tablas y consultar datos en S3, estrategias de optimización de costos y rendimiento, seguridad y las mejores prácticas para un análisis de datos interactivo y sin servidor en AWS.
