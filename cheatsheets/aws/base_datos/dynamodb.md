
---

# ⚡ DynamoDB (NoSQL Key-Value and Document Database) Cheatsheet Completo ⚡

**Amazon DynamoDB** es una base de datos de documentos y clave-valor NoSQL, completamente gestionada, que ofrece rendimiento de latencia de milisegundos de un solo dígito a cualquier escala. Es una base de datos sin servidor (serverless) altamente disponible, duradera y escalable, diseñada para aplicaciones de alto rendimiento y uso intensivo.

---

## 1. 🌟 Conceptos Clave

* **Tabla (Table)**: Una colección de ítems.
* **Ítem (Item)**: Un grupo de atributos que se puede identificar de forma única entre todos los demás ítems (similar a una "fila" o "registro" en SQL, pero sin un esquema fijo).
* **Atributo (Attribute)**: Un elemento de datos fundamental que se almacena en un ítem (similar a una "columna" en SQL). Los atributos pueden ser escalares, conjuntos o documentos anidados.
* **Clave Primaria (Primary Key)**: Un identificador único para cada ítem en una tabla. Puede ser:
  * **Clave de Partición (Partition Key)**: (También llamada Hash Key) Un solo atributo. Determina en qué partición se almacena el ítem. Los ítems con la misma clave de partición se almacenan juntos.
  * **Clave de Partición y Clave de Ordenación (Sort Key)**: (También llamada Hash and Range Key) Una combinación de dos atributos. La clave de partición determina la partición, y la clave de ordenación organiza los ítems dentro de esa partición. Permite consultas por rango.
* **Esquema Flexible (Schemaless)**: Los ítems en la misma tabla pueden tener diferentes atributos (excepto la clave primaria). Los atributos no tienen tipos predefinidos.
* **Unidades de Capacidad (Capacity Units)**:
  * **RCU (Read Capacity Unit)**: Capacidad para realizar 1 lectura consistente o 2 lecturas eventualmente consistentes por segundo para ítems de hasta 4KB.
  * **WCU (Write Capacity Unit)**: Capacidad para realizar 1 escritura por segundo para ítems de hasta 1KB.
* **Modelos de Capacidad**:
  * **Aprovisionado (Provisioned)**: Pagas por la capacidad de lectura/escritura que especificas por adelantado (RCU/WCU). Ideal para cargas de trabajo predecibles.
  * **Bajo Demanda (On-Demand)**: Pagas por el uso real de lectura/escritura por segundo. Ideal para cargas de trabajo impredecibles o variables.
* **Consistencia de Lectura**:
  * **Eventualmente Consistente (Eventually Consistent)**: (Por defecto) La respuesta de lectura puede no reflejar la escritura más reciente. Más rápida, menor latencia.
  * **Fuertemente Consistente (Strongly Consistent)**: La respuesta de lectura siempre refleja la escritura más reciente. Mayor latencia, puede costar más RCU.
* **Índices Secundarios (Secondary Indexes)**:
  * **GSI (Global Secondary Index)**: Una clave de partición y clave de ordenación diferente a la de la tabla principal. Permite consultar la tabla con una clave alternativa. Es "global" porque puede abarcar todas las particiones de la tabla.
  * **LSI (Local Secondary Index)**: Una clave de ordenación diferente, pero comparte la misma clave de partición que la tabla principal. Es "local" a una partición.

---

## 2. 🛠️ Creación y Gestión de Tablas

### 2.1. Crear una Tabla (Console / CLI / SDK)

* **Requisitos Mínimos**: Nombre de la tabla, Clave de Partición.
* **Opcional**: Clave de Ordenación, Índices Secundarios, Modo de Capacidad.

```bash
# AWS CLI - Crear tabla con clave de partición simple
aws dynamodb create-table \
    --table-name Users \
    --attribute-definitions \
        AttributeName=UserId,AttributeType=S \
    --key-schema \
        AttributeName=UserId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST # O PROVISIONED con ReadCapacityUnits/WriteCapacityUnits
``````bash
# AWS CLI - Crear tabla con clave de partición y ordenación
aws dynamodb create-table \
    --table-name UserPosts \
    --attribute-definitions \
        AttributeName=Username,AttributeType=S \
        AttributeName=PostId,AttributeType=N \
    --key-schema \
        AttributeName=Username,KeyType=HASH \
        AttributeName=PostId,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST
```

### 2.2. Operaciones de Tabla Comunes (AWS CLI)

* **Listar Tablas**: `aws dynamodb list-tables`
* **Describir Tabla**: `aws dynamodb describe-table --table-name Users`
* **Actualizar Tabla (ej. capacidad aprovisionada)**: `aws dynamodb update-table --table-name Users --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=10`
* **Añadir GSI**: `aws dynamodb update-table --table-name Users --attribute-definitions [...] --global-secondary-index-updates [...]`
* **Eliminar Tabla**: `aws dynamodb delete-table --table-name Users`

---

## 3. 🗃️ Operaciones CRUD de Ítems (API REST / CLI / SDK)

### 3.1. `PutItem` (Crear / Sobrescribir un Ítem)

* Crea un nuevo ítem o reemplaza uno existente con la misma clave primaria.
  ```bash
  aws dynamodb put-item \
      --table-name Users \
      --item '{ "UserId": {"S": "user123"}, "Username": {"S": "john.doe"}, "Email": {"S": "john@example.com"}, "Age": {"N": "30"} }'
  ```

### 3.2. `GetItem` (Leer un Ítem)

* Recupera un ítem por su clave primaria.
  ```bash
  aws dynamodb get-item \
      --table-name Users \
      --key '{ "UserId": {"S": "user123"} }' \
      --projection-expression "Username, Email" \
      --consistent-read # Para lectura fuertemente consistente
  ```

### 3.3. `UpdateItem` (Actualizar un Ítem)

* Modifica atributos existentes, añade nuevos o elimina atributos.
  ```bash
  aws dynamodb update-item \
      --table-name Users \
      --key '{ "UserId": {"S": "user123"} }' \
      --update-expression "SET Age = :newAge, #E = :newEmail REMOVE LastLogin" \
      --expression-attribute-values '{ ":newAge": {"N": "31"}, ":newEmail": {"S": "john.updated@example.com"} }' \
      --expression-attribute-names '{ "#E": "Email" }' \
      --return-values UPDATED_NEW # Devuelve los atributos modificados
  ```

  * **`--update-expression`**: Define las acciones (SET, REMOVE, ADD, DELETE).
  * **`--expression-attribute-values`**: Sustituye los valores en la expresión.
  * **`--expression-attribute-names`**: Sustituye los nombres de atributos (si son palabras reservadas o para evitar ambigüedades).
  * **`--condition-expression`**: Una condición opcional que debe ser verdadera para que la actualización se realice (ej. para bloqueo optimista).

### 3.4. `DeleteItem` (Eliminar un Ítem)

* Elimina un ítem por su clave primaria.
  ```bash
  aws dynamodb delete-item \
      --table-name Users \
      --key '{ "UserId": {"S": "user123"} }'
  ```

---

## 4. 🔍 Operaciones de Consulta y Escaneo

### 4.1. `Query` (Consultar)

* Recupera ítems que tienen la misma **Clave de Partición**.
* Opcionalmente, se puede aplicar una condición a la **Clave de Ordenación** (si existe) y/o un `FilterExpression`.
* **¡Muy eficiente!**

  ```bash
  # Consultar por Clave de Partición (Username) y rango en Clave de Ordenación (PostId)
  aws dynamodb query \
      --table-name UserPosts \
      --key-condition-expression "Username = :u AND PostId BETWEEN :minP AND :maxP" \
      --expression-attribute-values '{ ":u": {"S": "john.doe"}, ":minP": {"N": "100"}, ":maxP": {"N": "200"} }' \
      --projection-expression "PostId, Title, CreatedAt" \
      --scan-index-forward false # Orden descendente por Sort Key
  ```

  * **`--key-condition-expression`**: Condiciones solo sobre la Clave de Partición y/o Clave de Ordenación.
  * **`--filter-expression`**: Filtra resultados *después* de la consulta principal (menos eficiente, se realiza después de escanear la partición).
  * **`--limit`**: Limita el número de ítems devueltos.

### 4.2. `Scan` (Escaneo)

* Examina **todos** los ítems en una tabla o índice.
* Opcionalmente, se puede aplicar un `FilterExpression`.
* **¡Menos eficiente que `Query`!** Evitar en tablas grandes si es posible, ya que consume mucha capacidad y es lento.

  ```bash
  aws dynamodb scan \
      --table-name Users \
      --filter-expression "Age > :a" \
      --expression-attribute-values '{ ":a": {"N": "25"} }' \
      --projection-expression "UserId, Username, Age"
  ```

---

## 5. ⚡ Índices Secundarios (Global Secondary Indexes - GSI y Local Secondary Indexes - LSI)

Permiten consultar la tabla con una clave diferente a la primaria.

* **GSI (Global Secondary Index)**:
  * Tiene su propia **Clave de Partición** y **Clave de Ordenación** (diferentes a las de la tabla).
  * Es *global* porque sus datos se almacenan en particiones físicas distintas a las de la tabla principal.
  * **Asíncrono**: Eventualmente consistente con la tabla principal.
  * Tiene su propia configuración de capacidad (RCU/WCU).
  * **Uso**: Para consultas que no usan la clave primaria de la tabla.

    ```bash
    # Crear GSI (ejemplo al crear tabla, o update-table)
    --global-secondary-indexes '[
        {
            "IndexName": "EmailIndex",
            "KeySchema": [
                { "AttributeName": "Email", "KeyType": "HASH" }
            ],
            "Projection": { "ProjectionType": "ALL" }, # ALL, KEYS_ONLY, INCLUDE
            "ProvisionedThroughput": { "ReadCapacityUnits": 5, "WriteCapacityUnits": 5 }
        }
    ]'
    ```

    ```bash
    # Consultar GSI
    aws dynamodb query \
        --table-name Users \
        --index-name EmailIndex \
        --key-condition-expression "Email = :e" \
        --expression-attribute-values '{ ":e": {"S": "john@example.com"} }'
    ```
* **LSI (Local Secondary Index)**:
  * Comparte la misma **Clave de Partición** que la tabla principal, pero tiene una **Clave de Ordenación** diferente.
  * Es *local* a una partición de la tabla principal.
  * **Síncrono**: Fuertemente consistente con la tabla principal.
  * Consume la capacidad de la tabla principal.
  * **Uso**: Para consultas que usan la misma clave de partición, pero necesitan ordenar por un atributo diferente.

---

## 6. 📊 Tipos de Atributos (Sintaxis `{"Type": "Value"}`)

DynamoDB es schemaless, pero los atributos tienen tipos.

* **`S`**: String.
* **`N`**: Number (enviado como string para evitar pérdida de precisión).
* **`B`**: Binary (Base64-encoded).
* **`BOOL`**: Boolean (`true` o `false`).
* **`NULL`**: Null (`true`).
* **`L`**: List (array) (`[{"S":"item1"}, {"N":"2"}]`).
* **`M`**: Map (objeto) (`{"key1": {"S":"value1"}, "key2": {"N":"123"}}`).
* **`SS`**: String Set.
* **`NS`**: Number Set.
* **`BS`**: Binary Set.

---

## 7. 📈 Optimización de Costos y Rendimiento

* **Diseño de Clave Primaria**: ¡La decisión más importante!
  * **Clave de Partición**: Debe tener alta cardinalidad y una distribución uniforme de valores para evitar "hot partitions" (particiones con mucha actividad).
  * **Clave de Ordenación**: Permite patrones de acceso flexibles (consultas por rango, pre-/sufijo) dentro de una partición.
* **Capacidad Bajo Demanda (`PAY_PER_REQUEST`)**: Ideal para cargas de trabajo impredecibles o en desarrollo. Paga por el uso real.
* **Capacidad Aprovisionada (`PROVISIONED`)**: Para cargas de trabajo predecibles y constantes. Puede ser más barato si se provisiona correctamente. Usa `Auto Scaling` para ajustar RCU/WCU automáticamente.
* **`Query` vs `Scan`**: Prioriza `Query` sobre `Scan`. Un `Scan` puede ser muy costoso y lento en tablas grandes.
* **`ProjectionExpression`**: En `GetItem`, `Query` y `Scan`, solicita solo los atributos que realmente necesitas. Reduce el uso de RCU y el ancho de banda.
* **`FilterExpression`**: Se aplica *después* de que los ítems han sido recuperados por `Query` o `Scan`. Si puedes filtrar con `KeyConditionExpression` o un GSI, hazlo.
* **`BatchGetItem` / `BatchWriteItem`**: Para leer/escribir múltiples ítems de diferentes tablas de forma eficiente en una sola llamada API.
* **`DynamoDB Accelerator (DAX)`**: Un servicio de caché compatible con la API de DynamoDB que proporciona un rendimiento de latencia de microsegundos para cargas de trabajo de lectura intensiva.
* **Time To Live (TTL)**: Configura un atributo TTL en tus ítems para eliminarlos automáticamente después de un período. Útil para datos que caducan (ej. sesiones, logs antiguos).
* **DynamoDB Streams**: Captura cambios a nivel de ítem en una tabla y los publica en un stream. Útil para integración con Lambda para procesamiento en tiempo real.

---

## 8. 🔒 Seguridad

* **IAM Roles**: Es la forma **recomendada** para que las aplicaciones (EC2 instances, Lambda functions) accedan a DynamoDB. Otorga permisos de IAM a los Roles.
* **IAM Policies**: Documentos JSON que definen permisos específicos para tablas, índices o atributos.
* **Encryption at Rest (Cifrado en Reposo)**: Todos los datos en DynamoDB están cifrados por defecto (gestionado por AWS KMS).
* **Encryption in Transit (Cifrado en Tránsito)**: Todas las comunicaciones con DynamoDB usan HTTPS.
* **DynamoDB Fine-Grained Access Control**: Control de acceso a nivel de atributo individual.

---

## 9. 💡 Buenas Prácticas de Modelado de Datos

* **Diseño centrado en los patrones de acceso**: Diseña tu esquema pensando en cómo vas a consultar los datos (qué queries harás).
* **Evita las "hot partitions"**: Distribuye la carga de trabajo de manera uniforme. Si tu clave de partición tiene pocos valores únicos o un valor único recibe mucha actividad, puedes tener una "hot partition". Considera añadir un sufijo aleatorio a la clave de partición o usar claves compuestas.
* **Utiliza GSI para patrones de acceso alternativos**: Si necesitas consultar tu tabla por atributos que no forman parte de la clave primaria, un GSI es tu solución.
* **Relaciones**:
  * **One-to-many**: Almacena los ítems secundarios en una lista dentro del ítem principal, o usa el ID del ítem principal como clave de partición para los ítems secundarios.
  * **Many-to-many**: Utiliza una tabla de "unión" (similar a SQL) donde la clave primaria es la combinación de las claves de los ítems relacionados.
* **Desnormalización controlada**: A veces, es beneficioso duplicar datos (desnormalizar) para satisfacer los patrones de acceso de una sola consulta y evitar múltiples consultas costosas.
* **Tamaño del Ítem**: Mantén los ítems por debajo del límite de 400KB. Si un ítem es más grande, considera almacenarlo en S3 y guardar solo la URL de S3 en DynamoDB.

---

Este cheatsheet te proporciona una referencia completa de Amazon DynamoDB, cubriendo sus conceptos esenciales, cómo crear y gestionar tablas y ítems, operaciones de consulta/escaneo, índices secundarios, optimización y las mejores prácticas para modelar datos de forma eficiente y segura en una base de datos NoSQL de alto rendimiento.
