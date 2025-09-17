
---

# 🌌 Azure Cosmos DB Cheatsheet Completo 🌌

**Azure Cosmos DB** es un servicio de base de datos NoSQL multimodelo y distribuido globalmente de Microsoft. Ofrece rendimiento de baja latencia (milisegundos de un solo dígito), escalabilidad elástica y alta disponibilidad con múltiples modelos de consistencia. Es una base de datos sin servidor (serverless) en el núcleo, ideal para aplicaciones modernas de gran escala.

---

## 1. 🌟 Conceptos Clave

* **Multimodelo**: Soporta múltiples modelos de datos a través de APIs, incluyendo:
  * **Core (SQL) API**: Para datos de documentos (JSON), consultados con SQL.
  * **MongoDB API**: Para aplicaciones MongoDB existentes (protocolo de conexión compatible).
  * **Cassandra API**: Para aplicaciones Cassandra existentes.
  * **Gremlin API**: Para bases de datos de grafos.
  * **Table API**: Para aplicaciones Azure Table Storage existentes.
* **Distribución Global**: Replica tus datos en múltiples regiones de Azure de forma transparente, permitiendo lecturas y escrituras de baja latencia desde cualquier parte del mundo.
* **Escalabilidad Elástica**: Escala el rendimiento (throughput) y el almacenamiento de forma independiente y automática, sin tiempo de inactividad.
* **RU/s (Request Units per Second)**: La unidad de rendimiento en Cosmos DB. Representa el costo combinado de CPU, IOPS y memoria para las operaciones de base de datos.
  * **Aprovisionado (Provisioned)**: Pagas por un número fijo de RU/s.
  * **Sin Servidor (Serverless)**: Pagas por las RUs consumidas por cada operación.
* **Consistencia de Datos (5 niveles)**:
  * **Strong (Fuerte)**: Lecturas garantizadas para devolver los datos más recientes.
  * **Bounded Staleness (Obsolescencia Limitada)**: Lecturas pueden tener un retraso con respecto a las escrituras, dentro de un límite de tiempo o número de versiones.
  * **Session (Sesión)**: (Por defecto) Consistencia fuerte para las operaciones dentro de una misma sesión de cliente.
  * **Consistent Prefix (Prefijo Consistente)**: Las lecturas nunca ven escrituras fuera de orden.
  * **Eventual (Eventual)**: No hay garantía de orden, pero se garantiza que las réplicas convergerán eventualmente.
* **Particionamiento**: Cosmos DB particiona automáticamente los datos basándose en una **Clave de Partición** para escalar horizontalmente.
* **Contenedor (Container)**: Una unidad de escalabilidad para almacenamiento y rendimiento. Los ítems se almacenan en contenedores (similares a tablas, colecciones o grafos).

---

## 2. 🛠️ Jerarquía de Recursos

1. **Azure Account**: Tu cuenta de Azure.
2. **Cosmos DB Account**: El recurso principal. Define la API por defecto, las regiones geográficas, el modo de capacidad y el nivel de consistencia.
3. **Database (Base de Datos)**: Un contenedor lógico para uno o más contenedores.
4. **Container (Contenedor)**: Donde se almacenan los ítems. Tiene su propio rendimiento (RU/s) y almacenamiento.
5. **Item (Ítem)**: Un único registro de datos (un documento JSON, una fila, un nodo).

---

## 3. 📝 Core (SQL) API - ¡El más común!

### 3.1. Crear un Contenedor

* **Database ID**: `my-database`
* **Container ID**: `my-container`
* **Clave de Partición (Partition Key)**: **¡La decisión de diseño más importante!**
  * Ej: `/userId`, `/productId`.
  * Debe tener alta cardinalidad y una distribución uniforme de valores.
* **Rendimiento (Throughput)**: Aprovisionado o Sin Servidor.

### 3.2. Estructura de un Ítem (Documento JSON)

* `id`: Un identificador único para el ítem dentro de la partición (generado por ti o por Cosmos DB).
* `_rid`, `_self`, `_etag`, `_attachments`, `_ts`: Propiedades del sistema gestionadas por Cosmos DB.

```json
{
    "id": "e41a3d9b-325b-4b2a-a92c-15a4d3f31234",
    "userId": "user123",
    "orderDate": "2023-10-26T10:00:00Z",
    "totalAmount": 99.99,
    "items": [
        { "productId": "p001", "quantity": 2, "price": 25.00 },
        { "productId": "p002", "quantity": 1, "price": 49.99 }
    ],
    "shippingAddress": {
        "street": "123 Main St",
        "city": "Anytown",
        "zipcode": "12345"
    }
}
```

### 3.3. Consultas SQL

* La Core (SQL) API utiliza un dialecto SQL para consultar documentos JSON.

  ```sql
  -- Seleccionar todos los ítems de un usuario
  SELECT * FROM c WHERE c.userId = "user123"

  -- Filtrar y ordenar
  SELECT c.id, c.totalAmount
  FROM c
  WHERE c.userId = "user123" AND c.totalAmount > 50
  ORDER BY c.orderDate DESC

  -- Proyecciones y alias
  SELECT c.id AS orderId, i.productId
  FROM c
  JOIN i IN c.items -- Unir con el array anidado 'items'
  WHERE c.userId = "user123"
  ```
* **Consultas entre particiones**: Posibles, pero más costosas en RUs. Siempre que sea posible, incluye la clave de partición en la cláusula `WHERE`.

### 3.4. SDKs (.NET, Java, Python, Node.js)

* **Operaciones CRUD**:
  * **Create**: `container.items.create(myItem)`
  * **Read**: `container.item(itemId, partitionKey).read()`
  * **Upsert**: `container.items.upsert(myItem)` (crea si no existe, reemplaza si existe).
  * **Patch**: Modifica un ítem parcialmente (requiere configuración).
  * **Delete**: `container.item(itemId, partitionKey).delete()`
  * **Query**: `container.items.query("SELECT * FROM c").fetchAll()`

---

## 4. 📈 Rendimiento y Escalado (RU/s)

### 4.1. Modos de Capacidad

* **Aprovisionado (Provisioned)**:
  * RU/s fijos.
  * Se puede configurar el **Autoscale**: Define un máximo de RU/s y Cosmos DB escala entre el 10% y el 100% de ese valor.
  * Ideal para cargas de trabajo predecibles.
* **Sin Servidor (Serverless)**:
  * No se provisiona capacidad.
  * Pagas por las RUs consumidas por cada operación.
  * Ideal para cargas de trabajo impredecibles o esporádicas.

### 4.2. Optimización de Costos de RU

* **Consultas eficientes**: Siempre incluye la clave de partición en tus consultas.
* **Lecturas vs. Escrituras**: Las lecturas son más baratas que las escrituras.
* **Tamaño del Ítem**: Ítems más pequeños consumen menos RUs.
* **Indexación**: La política de indexación afecta el costo de las escrituras. Indexa solo los campos que necesitas para tus consultas.
* **Proyecciones**: En las consultas, selecciona solo los campos necesarios.
* **Consistencia**: La consistencia `Strong` consume más RUs que `Eventual`.

---

## 5. 🗃️ Indexación

* Cosmos DB indexa automáticamente todos los campos de cada ítem por defecto.
* Puedes personalizar la **Política de Indexación (Indexing Policy)** para:
  * **Modo de Indexación**:
    * `Consistent`: El índice se actualiza de forma síncrona con las escrituras.
    * `None`: Sin indexación.
  * **Incluir/Excluir Rutas**: Especifica qué rutas JSON incluir o excluir del índice.
  * **Tipos de Índice**: `Range` (para =, >, <, ORDER BY), `Hash` (para =), `Spatial` (para geoespacial).

---

## 6. 🔗 Características Adicionales

* **Change Feed**: Un registro persistente de los cambios en un contenedor.
  * Permite crear aplicaciones reactivas y basadas en eventos.
  * Se consume con Azure Functions, Change Feed Processor Library.
* **Time To Live (TTL)**: Configura una propiedad TTL en tus ítems para eliminarlos automáticamente después de un período.
* **Analytical Store (Azure Synapse Link)**: Un almacén de datos columnar optimizado para análisis, que se sincroniza automáticamente con tu almacén transaccional. Permite ejecutar análisis a gran escala sin impactar el rendimiento transaccional.
* **Stored Procedures, Triggers, User Defined Functions (UDFs)**: Lógica de servidor escrita en JavaScript que se ejecuta dentro de Cosmos DB.

---

## 7. 🔒 Seguridad

* **Autenticación**:
  * **Claves (Keys)**: Claves primarias/secundarias para acceso total a la cuenta.
  * **Resource Tokens**: Permisos de corta duración y granulares para usuarios finales.
  * **Azure AD (Microsoft Entra ID)**: (Recomendado) Usa Azure AD para autenticar y autorizar con RBAC.
* **Control de Acceso (RBAC)**: Usa RBAC para otorgar permisos a usuarios y aplicaciones.
* **Redes**:
  * **Firewall y VNet**: Restringe el acceso a tu cuenta de Cosmos DB desde IPs o VNet específicas.
  * **Private Link**: Expone tu cuenta a través de un endpoint privado en tu VNet.
* **Cifrado**:
  * **Encryption at Rest (Cifrado en Reposo)**: Cifrado por defecto con claves gestionadas por Microsoft. Puedes usar tus propias claves (Customer-Managed Keys).
  * **Encryption in Transit (Cifrado en Tránsito)**: Todas las conexiones usan HTTPS/TLS.

---

## 8. 💡 Buenas Prácticas y Consejos

* **¡Elige la Clave de Partición Correcta!**: Es la decisión más importante.
  * Busca una propiedad con **alta cardinalidad** (muchos valores únicos).
  * Asegura una **distribución uniforme** de las solicitudes.
  * Usa una clave que sea relevante para tus consultas más comunes.
* **Modela tus Datos para tus Consultas**: Diseña tu esquema de datos pensando en los patrones de acceso de tu aplicación. La desnormalización y la incrustación de datos son comunes y a menudo preferibles a los joins.
* **Usa el SDK Apropiado**: Los SDKs de Azure Cosmos DB están optimizados para el rendimiento (gestionan conexiones, reintentos, etc.).
* **Nivel de Consistencia**: Elige el nivel de consistencia más bajo que satisfaga los requisitos de tu aplicación para obtener el mejor rendimiento y costo. `Session` es un buen punto de partida.
* **Monitorea el Consumo de RU**: Utiliza Azure Monitor para rastrear las RUs consumidas y las solicitudes limitadas (throttled). Configura alertas.
* **Optimiza la Indexación**: Excluye rutas del índice que nunca consultarás para reducir el costo de las escrituras y el tamaño del almacenamiento.
* **Aprovecha el Change Feed**: Para arquitecturas basadas en eventos, el Change Feed es una herramienta poderosa y eficiente.
* **Manejo de Errores (429 - Too Many Requests)**: Asegúrate de que tu SDK o tu código maneje los errores 429 (throttling) con una política de reintento (backoff exponencial).
* **Infraestructura como Código (IaC)**: Usa Bicep, ARM Templates o Terraform para definir y desplegar tus cuentas, bases de datos y contenedores de Cosmos DB.

---

Este cheatsheet te proporciona una referencia completa de Azure Cosmos DB, cubriendo sus conceptos esenciales, modelos de API, configuración, consultas, rendimiento, seguridad y las mejores prácticas para construir aplicaciones distribuidas globalmente y de alta escalabilidad en Microsoft Azure.
