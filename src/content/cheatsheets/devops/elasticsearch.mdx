---
title: "elasticsearch"
---


---

# 🔍 Elasticsearch Cheatsheet Completo 🔍

**Elasticsearch** es un motor de búsqueda y análisis distribuido en tiempo real, construido sobre Apache Lucene. Es un almacén de datos NoSQL orientado a documentos, ideal para casos de uso que requieren búsquedas rápidas, escalabilidad horizontal y capacidades analíticas avanzadas.

---

## 1. 🌟 Conceptos Clave

*   **Documento (Document)**: La unidad básica de información en Elasticsearch. Es un objeto JSON flexible y auto-contenido.
*   **Índice (Index)**: Una colección lógica de documentos que comparten un propósito similar (similar a una "tabla" en SQL, pero más flexible).
*   **Tipo (Type)**: (¡Deprecado en ES 7+, obsoleto en ES 8+) Anteriormente, una subdivisión de un índice para agrupar documentos similares. Ahora, se recomienda usar un índice por tipo de documento. El tipo por defecto es `_doc`.
*   **Shard (Fragmento)**: Una partición horizontal de un índice. Los shards permiten escalar un índice horizontalmente y distribuir los documentos entre múltiples nodos.
*   **Réplica (Replica)**: Una copia de un shard primario. Proporciona alta disponibilidad (tolerancia a fallos) y escalabilidad de lectura.
*   **Nodo (Node)**: Una única instancia en ejecución de Elasticsearch.
*   **Clúster (Cluster)**: Una colección de uno o más nodos Elasticsearch que trabajan juntos.
*   **Mapping (Mapeo)**: El esquema de un índice. Define el tipo de datos que contiene cada campo en los documentos, y cómo deben ser indexados.
*   **Query DSL (Domain Specific Language)**: Un lenguaje basado en JSON para construir consultas de búsqueda y agregaciones.
*   **Inverted Index (Índice Invertido)**: La estructura de datos principal que Lucene (y, por extensión, Elasticsearch) utiliza para búsquedas de texto completo, mapeando palabras a los documentos que las contienen.

---

## 2. 🛠️ Arquitectura Básica

*   **Cluster**: Colección de nodos.
*   **Nodos**:
    *   **Master-eligible Node**: Puede ser elegido como el nodo maestro que gestiona el clúster.
    *   **Data Node**: Almacena los shards de datos.
    *   **Ingest Node**: Para preprocesar documentos antes de la indexación.
    *   **Coordinating Node**: (Por defecto, todos los nodos son coordinadores) Maneja las solicitudes de los clientes, las enruta a los nodos apropiados y agrega los resultados.

---

## 3. ⚙️ Instalación y Configuración Básica

### 3.1. Con Docker (Recomendado para Desarrollo)

```bash
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 \
    -e "discovery.type=single-node" \
    -e "xpack.security.enabled=false" \
    -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
    elasticsearch:8.12.0 # Usar la versión específica que necesites
# Para habilitar X-Pack Basic Security (autenticación):
# docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 \
#   -e "discovery.type=single-node" \
#   -e "xpack.security.enabled=true" \
#   -e "ELASTIC_PASSWORD=changeme" \
#   elasticsearch:8.12.0
```
*   **Notas**: `xpack.security.enabled=false` es solo para desarrollo, en producción SIEMPRE habilita la seguridad. `-Xms`, `-Xmx` para la memoria JVM.

### 3.2. Configuración (`config/elasticsearch.yml`)

*   **`cluster.name`**: Nombre del clúster (debe ser el mismo para todos los nodos del clúster).
*   **`node.name`**: Nombre único del nodo.
*   **`network.host`**: Para vincular a una IP específica (`0.0.0.0` para todas).
*   **`http.port`**: Puerto HTTP (por defecto 9200).
*   **`transport.port`**: Puerto de comunicación entre nodos (por defecto 9300).
*   **`discovery.seed_hosts`**: Nodos semilla para el descubrimiento en un clúster.
*   **`cluster.initial_master_nodes`**: Nodos que pueden ser master en el primer arranque del clúster.

---

## 4. 🗄️ Operaciones CRUD de Documentos (API REST)

Todas las interacciones con Elasticsearch se realizan a través de una API RESTful (generalmente JSON sobre HTTP). Puedes usar `curl`, Postman, Kibana Dev Tools o clientes de lenguaje.

*   **Encabezado Común**: `Content-Type: application/json`

### 4.1. Indexar un Documento (CREATE / UPDATE)

*   **Con ID explícito**:
    ```bash
    PUT /my_index/_doc/1
    {
      "title": "Mi primer documento",
      "author": "Juan Perez",
      "tags": ["tutorial", "elastic"],
      "published_date": "2023-10-26"
    }
    ```
*   **Con ID generado automáticamente (POST)**:
    ```bash
    POST /my_index/_doc
    {
      "title": "Otro documento",
      "author": "Maria Garcia"
    }
    ```

### 4.2. Obtener un Documento

```bash
GET /my_index/_doc/1
```

### 4.3. Actualizar un Documento (Parcialmente)

*   `_update` te permite enviar solo los campos que quieres cambiar.
    ```bash
    POST /my_index/_update/1
    {
      "doc": {
        "tags": ["tutorial", "elastic", "update"],
        "views": 100
      }
    }
    ```*   Incrementar un campo numérico:
    ```bash
    POST /my_index/_update/1
    {
      "script": {
        "source": "ctx._source.views += params.count",
        "lang": "painless",
        "params": {
          "count": 1
        }
      }
    }
    ```

### 4.4. Eliminar un Documento

```bash
DELETE /my_index/_doc/1
```

### 4.5. Operaciones Bulk (Masivas)

*   Para realizar múltiples operaciones CRUD de forma eficiente en una sola solicitud.
    ```bash
    POST /_bulk
    { "index": { "_index": "my_index", "_id": "2" } }
    { "title": "Documento 2", "author": "Pedro" }
    { "create": { "_index": "my_index", "_id": "3" } }
    { "title": "Documento 3", "author": "Laura" }
    { "update": { "_index": "my_index", "_id": "1" } }
    { "doc": { "views": 200 } }
    { "delete": { "_index": "my_index", "_id": "3" } }
    ```
    *   **Nota**: Cada línea debe terminar con un salto de línea (`\n`). La última línea también.

---

## 5. 🔎 Búsqueda (Search API - Query DSL)

El corazón de Elasticsearch.

*   **Endpoint Principal**: `GET /<index_name>/_search`
*   **Búsqueda Básica (Query String)**:
    ```bash
    GET /my_index/_search?q=elastic
    GET /my_index/_search?q=title:primer%20AND%20author:Juan
    ```
*   **Búsqueda con Query DSL (JSON Body)**: **¡Más potente y flexible!**
    ```bash
    GET /my_index/_search
    {
      "query": {
        "match": {        // Query de texto completo
          "title": "primer documento"
        }
      },
      "size": 10,         // Número de resultados a devolver (default 10)
      "from": 0,          // Offset para paginación (default 0)
      "sort": [           // Ordenación
        { "published_date": "desc" },
        { "views": "desc" }
      ],
      "_source": ["title", "author"] // Solo devolver estos campos en la respuesta
    }
    ```

### 5.1. Tipos de Queries Comunes

*   **`match`**: Búsqueda de texto completo, analiza el texto de entrada.
    ```json
    "match": { "description": "red bike" }
    ```
*   **`term`**: Búsqueda de término exacto (no analiza el texto, para campos `keyword`).
    ```json
    "term": { "status.keyword": "ACTIVE" }
    ```
*   **`terms`**: Búsqueda de términos exactos múltiples (AND o OR).
    ```json
    "terms": { "tags": ["elastic", "search"] }
    ```*   **`range`**: Búsqueda de rangos (numéricos o de fecha).
    ```json
    "range": {
      "price": {
        "gte": 100, // Greater Than or Equal
        "lte": 500  // Less Than or Equal
      },
      "date": {
        "gt": "2023-01-01", // Greater Than
        "lt": "now"        // Less Than (ahora)
      }
    }
    ```
*   **`exists`**: Si un campo existe.
    ```json
    "exists": { "field": "tags" }
    ```
*   **`bool`**: Combina múltiples consultas (AND, OR, NOT).
    *   `must`: Todas las consultas deben coincidir (AND). Contribuyen al score.
    *   `filter`: Todas las consultas deben coincidir (AND). No contribuyen al score (más rápido para filtrar).
    *   `should`: Al menos una de las consultas debe coincidir (OR). Contribuyen al score.
    *   `must_not`: Ninguna de las consultas debe coincidir (NOT).
    ```json
    "bool": {
      "must": [
        { "match": { "title": "elastic" } }
      ],
      "filter": [
        { "term": { "status.keyword": "published" } },
        { "range": { "published_date": { "gte": "2023-01-01" } } }
      ],
      "should": [
        { "match": { "author": "Juan" } }
      ],
      "must_not": [
        { "match": { "tags": "deprecated" } }
      ]
    }
    ```

---

## 6. 📊 Agregaciones (Aggregations API)

Para realizar análisis de datos complejos.

*   Se añaden dentro del Query DSL en el bloque `aggs` (o `aggregations`).
*   **Bucket Aggregations**: Agrupan documentos en "buckets" (cubos).
    *   **`terms`**: Agrupa por valores únicos de un campo (ej. "faceting").
    *   **`date_histogram`**: Agrupa por intervalos de tiempo.
    *   **`range`**: Agrupa por rangos numéricos predefinidos.
    *   **`filter`**: Agrupa por un filtro Query DSL.
*   **Metric Aggregations**: Calculan métricas sobre los buckets.
    *   `avg`, `sum`, `min`, `max`, `value_count`.
    *   `cardinality`: Número de valores únicos (aproximado para campos no agregables).

```bash
GET /my_index/_search
{
  "size": 0, # No queremos hits, solo agregaciones
  "aggs": {
    "products_by_author": { # Nombre de la agregación
      "terms": {
        "field": "author.keyword", # Agrupar por autor (usar .keyword para exactitud)
        "size": 10
      },
      "aggs": { # Sub-agregaciones (ej. promedio de vistas por autor)
        "avg_views": {
          "avg": {
            "field": "views"
          }
        }
      }
    },
    "monthly_published": {
      "date_histogram": {
        "field": "published_date",
        "calendar_interval": "month"
      }
    },
    "total_documents": {
      "value_count": {
        "field": "_id"
      }
    },
    "price_stats": {
      "stats": { # Estadísticas básicas (min, max, avg, sum, count)
        "field": "price"
      }
    }
  }
}
```

---

## 7. 📝 Mappings (Esquema de Índice)

Define el tipo de datos de los campos de un documento y cómo deben ser indexados.

*   Por defecto, Elasticsearch detecta los tipos de campos (`dynamic mapping`). Para producción, es mejor definir los mappings explícitamente.
*   **`text`**: Para texto completo que se analiza (tokeniza, stemming, etc.). No apto para agregaciones o ordenación.
*   **`keyword`**: Para texto exacto (sin analizar). Ideal para IDs, nombres, tags, estados, para agregaciones y ordenación.
    *   Los campos `text` tienen un subcampo `keyword` por defecto (`my_field.keyword`).
*   **`date`**: Fechas.
*   **`integer`, `long`, `float`, `double`**: Números.
*   **`boolean`**: Booleanos.
*   **`object`**: Objetos JSON.
*   **`nested`**: Para arrays de objetos, donde cada objeto en el array es independiente.

```bash
PUT /my_articles
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "author": { "type": "keyword" }, # Para búsqueda exacta y agregaciones
      "content": { "type": "text", "analyzer": "spanish" }, # Usar analizador de español
      "tags": { "type": "keyword" },
      "published_date": { "type": "date", "format": "yyyy-MM-dd" },
      "views": { "type": "long" },
      "location": { "type": "geo_point" }, # Para datos geoespaciales
      "comments": {
        "type": "nested", # Para arrays de objetos, permite consultar objetos individuales
        "properties": {
          "user": { "type": "keyword" },
          "text": { "type": "text" }
        }
      }
    }
  },
  "settings": {
    "number_of_shards": 3, # Shards primarios
    "number_of_replicas": 1 # Réplicas
  }
}
```
*   **`dynamic` mapping**: Por defecto, `true`. Si un campo nuevo aparece en un documento, Elasticsearch intenta inferir su tipo. Si es `false`, los campos no definidos son ignorados. Si es `strict`, cualquier campo no definido lanza un error.

---

## 8. 🧰 Gestión de Índices

*   **Listar Índices**:
    ```bash
    GET /_cat/indices?v
    ```
*   **Eliminar Índice**:
    ```bash
    DELETE /my_index
    ```
*   **Index Templates**: Define patrones para los mappings y settings de nuevos índices que coincidan con un patrón de nombre.
    ```bash
    PUT /_index_template/my_template
    {
      "index_patterns": ["logs-*-2023*", "logs-*-2024*"], # Patrón de nombre de índice
      "priority": 10,
      "template": {
        "settings": {
          "number_of_shards": 1,
          "number_of_replicas": 0
        },
        "mappings": {
          "properties": {
            "timestamp": { "type": "date" },
            "message": { "type": "text" }
          }
        }
      }
    }
    ```
*   **Index Lifecycle Management (ILM)**: (Característica de X-Pack) Automatiza la gestión de índices a lo largo de su vida útil (rollover, shrink, force merge, delete).

---

## 9. 🌐 Clientes de Lenguaje

Elasticsearch proporciona clientes oficiales para varios lenguajes:

*   **Java**: `Elasticsearch Java Client` (cliente moderno), `Java High Level REST Client` (cliente anterior, ahora en modo mantenimiento).
*   **Python**: `elasticsearch-py`.
*   **JavaScript**: `@elastic/elasticsearch`.
*   **Go**: `go-elasticsearch`.
*   **C#**: `NEST`, `Elastic.Clients.Elasticsearch`.

---

## 10. 💡 Buenas Prácticas y Consejos

*   **Entender `text` vs `keyword`**: Es la decisión más importante para el mapeo. `text` para búsqueda de texto completo, `keyword` para búsqueda exacta, filtrado, ordenación y agregaciones.
*   **Diseño de Shards y Réplicas**: Define `number_of_shards` y `number_of_replicas` al crear un índice.
    *   **Shards**: Elige el número de shards basándose en el tamaño esperado de tus datos. No se pueden cambiar después de crear el índice.
    *   **Réplicas**: Al menos 1 réplica para alta disponibilidad. Se pueden cambiar dinámicamente.
*   **Aliases de Índice**: Usa alias para tus índices para proporcionar una capa de abstracción. Facilita los cambios sin tiempo de inactividad (ej. reindexar a un nuevo índice y luego cambiar el alias).
*   **Seguridad (X-Pack)**: **Habilita SIEMPRE la seguridad en producción.** Configura autenticación, autorización y encriptación.
*   **Optimización de Consultas**:
    *   Usa `filter` dentro de `bool` para condiciones que no necesitan contribuir al score (más rápidas).
    *   Limita el `size` y usa `from` o `search_after` para paginación eficiente.
    *   Usa `_source` para devolver solo los campos necesarios.
*   **Monitoreo**: Monitorea el clúster de Elasticsearch (uso de CPU, memoria, disco, salud de shards, JVM). Kibana Monitoring, Stack Monitoring son herramientas útiles.
*   **Estrategia de Ingesta de Datos**: Utiliza herramientas como Logstash, Beats o Kafka/RabbitMQ con clientes de lenguaje para una ingesta de datos eficiente.
*   **Documentación de Mappings**: Documenta tus mappings y asegúrate de que coinciden con los datos que estás indexando.
*   **Core Web Vitals**: Entiende los conceptos de Core Web Vitals de Google para optimizar el rendimiento de búsqueda.

---

Este cheatsheet te proporciona una referencia completa de Elasticsearch, cubriendo sus conceptos esenciales, arquitectura, cómo interactuar con él usando la API REST, la búsqueda con Query DSL, las agregaciones, los mappings y las mejores prácticas para construir sistemas de búsqueda y análisis potentes.