
---

# 📊 Amazon Redshift Cheatsheet Completo 📊

**Amazon Redshift** es un servicio de data warehouse de escala de petabytes, totalmente gestionado y compatible con SQL, en la nube de AWS. Está diseñado para almacenar y analizar grandes volúmenes de datos de forma rápida y eficiente, siendo ideal para aplicaciones de Business Intelligence, reporting y cargas de trabajo analíticas.

---

## 1. 🌟 Conceptos Clave

* **Data Warehouse (Almacén de Datos)**: Un sistema de base de datos optimizado para consultas analíticas complejas sobre grandes volúmenes de datos (OLAP - Online Analytical Processing), a diferencia de las bases de datos transaccionales (OLTP).
* **Columnares (Columnar Storage)**: Redshift almacena los datos en formato columnar, lo que permite un acceso más rápido a las columnas necesarias para las consultas analíticas y una mayor compresión de datos.
* **Compresión de Datos**: Reduce significativamente el espacio en disco y mejora el rendimiento de I/O.
* **Procesamiento Paralelo Masivo (Massively Parallel Processing - MPP)**: Divide los datos y las consultas entre múltiples nodos de computación para un procesamiento paralelo.
* **Clúster (Cluster)**: Una colección de uno o más nodos de computación. Es la unidad principal de un data warehouse Redshift.
* **Nodo Líder (Leader Node)**: Gestiona las comunicaciones con las aplicaciones cliente, analiza y planifica las consultas, y coordina las operaciones con los nodos de computación.
* **Nodos de Computación (Compute Nodes)**: Almacenan los datos, ejecutan los planes de consulta y realizan operaciones en paralelo.
* **Slices**: Particiones de datos en los nodos de computación. Cada nodo tiene múltiples slices.
* **Distribución de Datos (Distribution Style)**: Cómo se distribuyen las filas de una tabla entre los slices de los nodos de computación. ¡Crucial para el rendimiento!
* **Clave de Distribución (Distribution Key - DISTKEY)**: La columna utilizada para determinar cómo se distribuyen las filas.
* **Clave de Ordenación (Sort Key - SORTKEY)**: Las columnas utilizadas para ordenar los datos dentro de cada slice, acelerando las consultas que utilizan esas columnas en `WHERE` o `ORDER BY`.

---

## 2. 🛠️ Creación y Gestión de un Clúster Redshift

### 2.1. Crear un Clúster (Console / CLI / CloudFormation)

1. **Node Type (Tipo de Nodo)**:
   * **DC (Dense Compute)**: Optimizado para cargas de trabajo intensivas en CPU y memoria. Más rendimiento por dólar.
   * **DS (Dense Storage)**: Optimizado para grandes volúmenes de datos con almacenamiento HDD. Más almacenamiento por dólar.
   * **RA3**: Nodos con almacenamiento gestionado (Managed Storage) que separan computación de almacenamiento, escalando independientemente. Recomendado para la mayoría de los casos.
2. **Number of Nodes (Número de Nodos)**: Determina la capacidad del clúster (computación y almacenamiento).
3. **Clúster Identifier**: Nombre único.
4. **Database Name, Master Username, Master Password**: Credenciales de acceso.
5. **VPC (Virtual Private Cloud)**: En qué VPC se desplegará.
6. **Cluster Subnet Group**: Grupo de subredes que usará Redshift (se recomienda múltiples AZs).
7. **Publicly Accessible**: ¿Será accesible desde internet? (Generalmente `No` para seguridad).
8. **VPC Security Group(s)**: Firewall de red. **¡CRÍTICO!**
9. **IAM Role**: Para permisos a otros servicios de AWS (ej. S3 para carga de datos).
10. **Automated Snapshots**: Copias de seguridad automáticas (período de retención).
11. **Maintenance Window**: Ventana para actualizaciones.
12. **Encryption**: Cifrado en reposo (KMS) y en tránsito.

### 2.2. Conexión a Redshift

* **Endpoint**: URL de conexión (ej. `mycluster.abcdefghij.us-east-1.redshift.amazonaws.com`).
* **Port**: Puerto por defecto 5439.
* **Credenciales**: Master Username y Master Password.
* **Security Group**: Asegúrate de que el Security Group de tu herramienta de BI, aplicación o instancias EC2 tenga reglas de salida para el puerto 5439, y el Security Group de Redshift tenga reglas de entrada desde la fuente.
* **JDBC/ODBC**: Redshift es compatible con JDBC y ODBC, lo que permite conectar herramientas de SQL y Business Intelligence.
* **SQL Client**: Utiliza SSMS, DBeaver, DataGrip, o el Query Editor de la consola de AWS.

### 2.3. Gestión de Clúster (Console / CLI)

* **Redimensionar (Resize)**: Cambiar el tipo y/o número de nodos para escalar vertical u horizontalmente.
* **Pausar/Reanudar (Pause/Resume)**: Para clústeres RA3, puedes pausar el clúster cuando no está en uso para ahorrar costos de computación.
* **Instantáneas (Snapshots)**: Copias de seguridad automáticas y manuales.
* **Restaurar (Restore)**: Restaurar un clúster desde una instantánea.
* **Vaciar/Recuperar (Vacuum/Analyze)**: Tareas de mantenimiento para optimizar el rendimiento (ver `VACUUM`, `ANALYZE`).

---

## 3. 📝 DDL (Data Definition Language) - Definición de Estructura

Redshift es compatible con SQL estándar, pero con algunas extensiones y optimizaciones específicas para data warehousing.

### 3.1. `CREATE TABLE` (con Optimización)

**¡CRÍTICO!** Las claves de distribución (`DISTKEY`) y ordenación (`SORTKEY`) son fundamentales para el rendimiento.

```sql
CREATE TABLE Ventas (
    ID_Venta INT NOT NULL,
    ID_Producto INT NOT NULL,
    ID_Cliente INT NOT NULL DISTKEY, -- Clave de Distribución (para JOINs con Clientes)
    FechaVenta DATE NOT NULL SORTKEY, -- Clave de Ordenación (para filtrar por fecha)
    Cantidad INT,
    PrecioUnitario DECIMAL(10, 2),
    MontoTotal DECIMAL(10, 2),
    UNIQUE (ID_Venta) -- No hay PRIMARY KEY en el sentido tradicional para todos los motores
)
DISTSTYLE KEY -- Estilo de distribución (KEY, ALL, AUTO, EVEN)
COMPOUND SORTKEY (ID_Producto, FechaVenta); -- Clave de ordenación compuesta
```

* **`DISTSTYLE`**:
  * **`AUTO`**: Redshift elige el mejor estilo (default).
  * **`EVEN`**: Distribuye filas uniformemente por round-robin (bueno para tablas pequeñas o sin claves de unión obvias).
  * **`ALL`**: Replica la tabla completa en cada nodo (bueno para tablas pequeñas (< 10GB) que se unen a tablas grandes).
  * **`KEY`**: Distribuye filas basándose en el valor de una columna (`DISTKEY`). **¡Ideal para tablas grandes que se unen a otras tablas grandes con esa clave!**
* **`SORTKEY`**:
  * **`SINGLE`**: `SORTKEY (columna)`: Ordena por una sola columna.
  * **`COMPOUND`**: `COMPOUND SORTKEY (columna1, columna2, ...)`: Ordena por múltiples columnas.
  * **`INTERLEAVED`**: `INTERLEAVED SORTKEY (columna1, columna2, ...)`: Ordena por múltiples columnas con entrelazado. Bueno para consultas que usan diferentes columnas en `WHERE`. Más costoso de mantener.

### 3.2. `COPY` (Carga de Datos)

**¡El comando más eficiente para cargar datos en Redshift!** Carga datos en paralelo desde S3.

```sql
COPY Ventas (ID_Venta, ID_Producto, ID_Cliente, FechaVenta, Cantidad, PrecioUnitario, MontoTotal)
FROM 's3://my-data-bucket/ventas/data.csv' -- Ruta del archivo en S3
CREDENTIALS 'aws_iam_role=arn:aws:iam::123456789012:role/RedshiftLoadRole' -- Rol IAM con permisos para S3
DELIMITER ',' -- Delimitador de CSV
IGNOREHEADER 1 -- Ignorar la primera fila (encabezado)
REGION 'us-east-1' -- Región del bucket S3
GZIP -- Si el archivo está comprimido
TIMEFORMAT 'YYYY-MM-DD'; -- Formato de fecha
```

* **`CREDENTIALS`**: **¡Usar IAM Role es la forma más segura!**
* Soporta varios formatos: CSV, JSON, AVRO, ORC, Parquet.
* Puede cargar desde S3, DynamoDB, EMR.

### 3.3. `VACUUM` y `ANALYZE` (Mantenimiento)

* **`VACUUM`**: Reorganiza y ordena los datos en disco para mejorar el rendimiento de las consultas y reclamar espacio de almacenamiento de filas eliminadas o actualizadas.
* **`ANALYZE`**: Actualiza las estadísticas de la tabla, que el optimizador de consultas utiliza para crear planes de consulta eficientes.
  ```sql
  VACUUM Ventas;
  ANALYZE Ventas;
  ```

  * Estas operaciones son cruciales y deben programarse regularmente para tablas con cambios frecuentes.

---

## 4. 🗃️ DML y DQL (SQL Estándar)

Redshift soporta la mayoría del SQL estándar.

### 4.1. `INSERT`, `UPDATE`, `DELETE`

* Funcionan como en SQL estándar.
  ```sql
  INSERT INTO Clientes (ID_Cliente, Nombre) VALUES (1, 'Juan');
  UPDATE Clientes SET Email = 'juan.nuevo@example.com' WHERE ID_Cliente = 1;
  DELETE FROM Clientes WHERE ID_Cliente = 1;
  ```

### 4.2. `SELECT` (Consultas)

* Soporta `SELECT`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`, `JOIN`s, subconsultas.
* Las funciones de ventana (ej. `ROW_NUMBER()`, `RANK()`, `LAG()`, `LEAD()`) son muy potentes para analítica.

  ```sql
  SELECT c.Nombre, COUNT(v.ID_Venta) AS TotalVentas, SUM(v.MontoTotal) AS IngresosTotales
  FROM Clientes c
  JOIN Ventas v ON c.ID_Cliente = v.ID_Cliente
  WHERE v.FechaVenta BETWEEN '2023-01-01' AND '2023-06-30'
  GROUP BY c.Nombre
  HAVING SUM(v.MontoTotal) > 1000
  ORDER BY IngresosTotales DESC
  LIMIT 10;
  ```

---

## 5. ⚡ Rendimiento y Optimización

### 5.1. Claves de Distribución (`DISTKEY`)

* **`DISTSTYLE KEY` (con `DISTKEY` en una columna)**:
  * **Elegir la clave correcta**: Ideal para la columna más utilizada en las cláusulas `JOIN` con tablas grandes. Distribuye filas con el mismo valor de `DISTKEY` al mismo slice, minimizando la transferencia de datos entre nodos durante los JOINs.
  * **Evitar sesgo (skew)**: La columna `DISTKEY` debe tener una alta cardinalidad y una distribución uniforme de valores.
* **`DISTSTYLE ALL`**:
  * Para tablas pequeñas (< 10 GB) que se unen a menudo con tablas grandes.
  * Replica la tabla completa en cada nodo, eliminando el movimiento de datos durante los JOINs.

### 5.2. Claves de Ordenación (`SORTKEY`)

* **`COMPOUND SORTKEY`**: Para columnas que se usan juntas en `WHERE` y `ORDER BY`.
* **`INTERLEAVED SORTKEY`**: Para tablas que se usan en consultas con diferentes columnas en `WHERE`. Más lento para ingesta y mantenimiento.
* **Uso**: La clave de ordenación principal debe ser la columna más utilizada para filtros o rangos.

### 5.3. Codificación de Compresión (`ENCODE`)

* Redshift aplica automáticamente codificaciones de compresión por defecto.
* Puedes especificar codificaciones manualmente para optimizar aún más el espacio y el rendimiento.
  * `RAW` (sin compresión, para `SORTKEY`, `DISTKEY` o campos pequeños).
  * `AZ64`, `ZSTD`, `LZO`, `TEXT255`, `BYTEDICT`.

### 5.4. Vistas Materializadas (Materialized Views - MV)

* **`CREATE MATERIALIZED VIEW`**: Almacena el resultado de una consulta precalculada.
* **`REFRESH MATERIALIZED VIEW`**: Actualiza los datos de la vista materializada.
* **Uso**: Para consultas complejas o costosas que se ejecutan con frecuencia. Mejora drásticamente el rendimiento de lectura.

### 5.5. Workload Management (WLM)

* Configura colas de consultas para gestionar la concurrencia y la priorización de diferentes tipos de consultas.
* Permite a las consultas de alta prioridad ejecutarse más rápido, incluso bajo carga.

---

## 6. 🔒 Seguridad

* **VPC Security Group**: Controla el acceso a nivel de red al clúster de Redshift. **¡CRÍTICO!**
* **IAM Roles**: **Recomendado** para que Redshift acceda a otros servicios de AWS (ej. S3 para `COPY`).
* **Cifrado**:
  * **Cifrado en Reposo**: Cifra los datos en el clúster usando AWS KMS o claves gestionadas por AWS.
  * **Cifrado en Tránsito**: Todas las conexiones deben usar SSL.
* **Seguridad a Nivel de Columna/Fila (Column/Row-level Security)**: Para un control de acceso granular.
* **`CREATE USER` / `GRANT` / `REVOKE`**: Gestiona usuarios y permisos de base de datos.
* **Auditoría**: Habilita los logs de auditoría para registrar la actividad de la base de datos.

---

## 7. 💡 Buenas Prácticas y Consejos

* **Diseño de Esquema para OLAP**: Piensa en cómo se consultarán los datos, no en cómo se escribirán. Desnormalizar es común.
* **Claves de Distribución y Ordenación**: Son los factores más importantes para el rendimiento. Entiende tus patrones de consulta para elegirlos correctamente.
  * Elige `DISTKEY` para una columna utilizada en `JOIN`s de tablas grandes.
  * Elige `SORTKEY` para columnas usadas en `WHERE` y `ORDER BY`.
* **`COPY` para Ingesta**: Siempre usa el comando `COPY` para cargar grandes volúmenes de datos desde S3.
* **`VACUUM` y `ANALYZE` Regularmente**: Programa estas operaciones de mantenimiento, especialmente para tablas con alta actividad de escritura/eliminación, para mantener el rendimiento óptimo.
* **Usa Vistas Materializadas (MV)**: Para consultas complejas y repetitivas.
* **WLM para Priorización**: Configura el Workload Management para priorizar consultas críticas.
* **Monitoreo (CloudWatch)**: Monitoriza el uso de CPU, RAM, disco, IOPS, latencia de consultas, conexiones con CloudWatch y los logs de Redshift.
* **Cifrado Activo**: Siempre cifra tus datos en Redshift y tus conexiones.
* **Escalabilidad del Clúster**: Elige un tipo y número de nodos que se ajuste a tus necesidades. Redimensionar el clúster es una operación de mantenimiento.
* **Redshift Spectrum**: Para consultar datos directamente en S3 usando Redshift, sin necesidad de cargar todos los datos en el clúster. Útil para datos de baja frecuencia de acceso.
* **Conexiones JDBC/ODBC**: Utiliza drivers y clientes compatibles.

---

Este cheatsheet te proporciona una referencia completa de Amazon Redshift, cubriendo sus conceptos esenciales de data warehousing, cómo configurar y gestionar clústeres, la carga de datos, las claves de optimización, la seguridad y las mejores prácticas para un análisis a gran escala de datos en AWS.
