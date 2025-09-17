
---

# 📦 Azure Blob Storage Cheatsheet Completo 📦

**Azure Blob Storage** es un servicio de almacenamiento de objetos de Microsoft Azure, optimizado para almacenar grandes cantidades de datos no estructurados. Es altamente escalable, seguro y rentable, ideal para almacenar imágenes, videos, archivos de log, backups, datos para análisis de Big Data y mucho más.

---

## 1. 🌟 Conceptos Clave

* **Almacenamiento de Objetos (Object Storage)**: Almacena datos como "blobs" (Binary Large Objects), que son esencialmente archivos. A diferencia del almacenamiento de archivos, no tiene una jerarquía de carpetas real; la estructura de carpetas es una convención en el nombre del blob (ej. `folder/subfolder/file.txt`).
* **Cuenta de Almacenamiento (Storage Account)**: Un espacio de nombres único y de nivel superior en Azure para tus datos de almacenamiento. Es el punto de partida para acceder a Blob Storage, File Storage, Queue Storage y Table Storage.
* **Contenedor (Container)**: Un grupo de blobs (similar a una carpeta en un sistema de archivos). Un contenedor puede almacenar un número ilimitado de blobs.
* **Blob**: Un archivo de cualquier tipo y tamaño.
  * **Tipos de Blobs**:
    * **Blobs en Bloques (Block Blobs)**: Optimizados para streaming y almacenamiento de objetos grandes. Se componen de bloques. (¡El más común!).
    * **Blobs en Anexos (Append Blobs)**: Similar a los blobs en bloques, pero optimizados para operaciones de anexo. Ideal para logs.
    * **Blobs de Página (Page Blobs)**: Optimizados para operaciones de lectura/escritura aleatorias. Se utilizan para los discos de las VMs de Azure (VHDs).
* **Niveles de Acceso (Access Tiers)**: Determinan el costo y el rendimiento del almacenamiento.
  * **Hot (Frecuente)**: Optimizado para datos a los que se accede con frecuencia. Mayor costo de almacenamiento, menor costo de acceso.
  * **Cool (Esporádico)**: Optimizado para datos a los que se accede con poca frecuencia (almacenados durante al menos 30 días). Menor costo de almacenamiento, mayor costo de acceso.
  * **Archive (Archivo)**: Optimizado para datos que se almacenan durante al menos 180 días y rara vez se acceden. Costo de almacenamiento extremadamente bajo, costo de acceso y latencia de recuperación altos (horas).
* **Redundancia**: Opciones para la replicación de datos para durabilidad y alta disponibilidad.
  * **LRS (Locally-redundant storage)**: 3 copias en un único centro de datos.
  * **ZRS (Zone-redundant storage)**: 3 copias en diferentes Zonas de Disponibilidad dentro de una región.
  * **GRS (Geo-redundant storage)**: 3 copias en la región primaria y 3 copias en una región secundaria.
  * **GZRS (Geo-zone-redundant storage)**: Combina ZRS y GRS.

---

## 2. 🛠️ Creación y Gestión

### 2.1. Crear una Cuenta de Almacenamiento (Portal / CLI / Bicep)

1. **Grupo de Recursos**: Selecciona o crea uno.
2. **Nombre de la Cuenta de Almacenamiento**: Nombre único globalmente en Azure, solo minúsculas y números.
3. **Región**: Ubicación geográfica.
4. **Rendimiento**:
   * **Standard**: HDD/SSD estándar.
   * **Premium**: SSD de alto rendimiento.
5. **Redundancia**: Elige el nivel de redundancia (LRS, ZRS, GRS, GZRS).
6. **Redes**: Configura el acceso a la red (acceso público, endpoint privado).
7. **Seguridad**: Habilita `Secure transfer required` (HTTPS).

### 2.2. Crear un Contenedor (Portal / CLI / SDK)

* **Nombre del Contenedor**: Nombre único dentro de la cuenta de almacenamiento.
* **Nivel de Acceso Público**:
  * **Private**: (Recomendado) No hay acceso público anónimo.
  * **Blob**: Permite acceso de lectura público anónimo a los blobs.
  * **Container**: Permite acceso de lectura público anónimo al contenedor y a los blobs.

---

## 3. 📝 Acceso y Manipulación de Blobs

### 3.1. Acceso (Endpoints)

* La URL de un blob sigue el formato:
  `https://<storage-account-name>.blob.core.windows.net/<container-name>/<blob-name>`

### 3.2. Azure CLI

* Requiere `az login`.
  ```bash
  # Variables
  export AZURE_STORAGE_ACCOUNT="mystorageaccount123"
  export AZURE_STORAGE_KEY="MY_STORAGE_KEY..." # O usa --connection-string o login

  # Listar contenedores
  az storage container list

  # Crear contenedor
  az storage container create --name mycontainer

  # Subir un archivo
  az storage blob upload --container-name mycontainer --file mylocalfile.txt --name myremote_file.txt

  # Descargar un archivo
  az storage blob download --container-name mycontainer --name myremote_file.txt --file mylocal_downloaded_file.txt

  # Listar blobs en un contenedor
  az storage blob list --container-name mycontainer --output table

  # Eliminar un blob
  az storage blob delete --container-name mycontainer --name myremote_file.txt
  ```

### 3.3. SDKs (.NET, Java, Python, Node.js)

```python
# Python SDK (azure-storage-blob)
from azure.storage.blob import BlobServiceClient

connection_string = "DefaultEndpointsProtocol=https;AccountName=mystorageaccount;AccountKey=...;EndpointSuffix=core.windows.net"

# Crear cliente de servicio de blob
blob_service_client = BlobServiceClient.from_connection_string(connection_string)

# Crear un contenedor
container_client = blob_service_client.get_container_client("mycontainer")
# container_client.create_container()

# Subir un blob
blob_client = container_client.get_blob_client("example.txt")
with open("local_file.txt", "rb") as data:
    blob_client.upload_blob(data)

# Descargar un blob
with open("downloaded_file.txt", "wb") as download_file:
    download_file.write(blob_client.download_blob().readall())

# Listar blobs
blob_list = container_client.list_blobs()
for blob in blob_list:
    print(f"\t" + blob.name)
```

---

## 4. 🔒 Seguridad

* **Autenticación**:
  * **Claves de Acceso (Access Keys)**: (Potente pero menos seguro) Proporcionan control total sobre la cuenta de almacenamiento. Rota las claves regularmente.
  * **Azure AD (Microsoft Entra ID)**: (Recomendado) Usa RBAC para otorgar permisos granulares a identidades de Azure AD (usuarios, grupos, service principals, managed identities).
  * **SAS (Shared Access Signature)**: Un token que proporciona acceso delegado y limitado a recursos de almacenamiento.
    * **Tipos**: `User delegation SAS`, `Service SAS`, `Account SAS`.
    * **Permisos**: Read, Write, Delete, List.
    * **Expiración**: Tienen un tiempo de vida limitado.
    * **IPs permitidas**.
* **Cifrado (Encryption)**:
  * **Encryption at Rest (Cifrado en Reposo)**: Cifrado por defecto con claves gestionadas por Microsoft. Puedes usar tus propias claves (Customer-Managed Keys).
  * **Encryption in Transit (Cifrado en Tránsito)**: Usa HTTPS. Puedes forzar el uso de HTTPS (`Secure transfer required`).
* **Redes**:
  * **Firewall y Redes Virtuales**: Restringe el acceso a la cuenta de almacenamiento a IPs o VNets específicas.
  * **Private Endpoints**: Expone tu cuenta de almacenamiento a través de un endpoint privado en tu VNet.

---

## 5. 🧰 Características Adicionales

* **Lifecycle Management (Gestión del Ciclo de Vida)**:
  * Define reglas para mover blobs automáticamente entre niveles de acceso (Hot -> Cool -> Archive) o eliminarlos después de un tiempo.
  * Uso: Optimización de costos.
* **Static Website Hosting**:
  * Configura un contenedor para alojar un sitio web estático.
  * Define el documento de índice (`index.html`) y el de error (`404.html`).
  * Se accede a través de un endpoint de sitio web estático.
* **Versioning**:
  * Mantiene múltiples versiones de un blob. Protege contra eliminaciones/sobrescrituras accidentales.
* **Soft Delete**:
  * Retiene los blobs eliminados durante un período de tiempo configurable.
* **CORS (Cross-Origin Resource Sharing)**:
  * Permite que los scripts de una página web en un dominio accedan a recursos en otro dominio. Configura reglas CORS para tu Blob Storage.
* **Azure CDN**:
  * Integra Blob Storage con Azure CDN para una entrega de contenido global de baja latencia.
* **Event Grid / Event Hubs / Queue Storage**:
  * Blob Storage puede publicar eventos (ej. `BlobCreated`, `BlobDeleted`) a estos servicios para disparar flujos de trabajo (ej. ejecutar una Azure Function cuando se sube un nuevo archivo).
* **Data Lake Storage Gen2**:
  * Construido sobre Blob Storage, añade un espacio de nombres jerárquico y es compatible con el sistema de archivos de Hadoop (HDFS).
  * Ideal para análisis de Big Data.

---

## 6. 💡 Buenas Prácticas y Consejos

* **Usa Azure AD para Autenticación**: Siempre prefiere la autenticación de Azure AD (con identidades gestionadas o service principals) sobre las claves de acceso.
* **SAS para Acceso Delegado**: Utiliza SAS para otorgar acceso temporal y limitado a clientes externos.
* **Fuerza HTTPS (`Secure transfer required`)**: Es una configuración de seguridad fundamental.
* **Niveles de Acceso y Ciclo de Vida**: Utiliza los niveles de acceso (Hot, Cool, Archive) y las políticas de ciclo de vida para optimizar los costos.
* **Redundancia Adecuada**: Elige el nivel de redundancia que se ajuste a tus requisitos de durabilidad y disponibilidad.
* **Monitorea con Azure Monitor**: Rastrea métricas como la capacidad, la latencia, el rendimiento y las solicitudes.
* **Logs de Diagnóstico**: Habilita los logs de diagnóstico para auditoría y depuración.
* **Organización con Contenedores y Prefijos**: Utiliza contenedores para separar diferentes tipos de datos y prefijos (nombres de blob con `/`) para simular una estructura de carpetas.
* **Desacoplamiento con Eventos**: Usa eventos de Blob Storage para desacoplar el procesamiento de datos de la ingesta.
* **CDN para Contenido Público**: Para contenido público de acceso frecuente, integra con Azure CDN para mejorar el rendimiento y reducir los costos de salida.

---

Este cheatsheet te proporciona una referencia completa de Azure Blob Storage, cubriendo sus conceptos esenciales, cómo crear y gestionar recursos, la seguridad, las características avanzadas y las mejores prácticas para un almacenamiento de objetos eficiente, seguro y escalable en Microsoft Azure.
