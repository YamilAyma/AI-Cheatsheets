
---

# 📂 Azure Files Cheatsheet Completo 📂

**Azure Files** es un servicio de almacenamiento en la nube completamente gestionado que ofrece recursos compartidos de archivos accesibles a través de los protocolos estándar **Server Message Block (SMB)** y **Network File System (NFS)**. Permite a las aplicaciones locales y en la nube compartir archivos de forma sencilla, sin necesidad de gestionar un servidor de archivos.

---

## 1. 🌟 Conceptos Clave

* **Almacenamiento de Archivos (File Storage)**: A diferencia de Blob Storage (objetos) o Disk Storage (bloques), Azure Files proporciona un sistema de archivos jerárquico.
* **Recurso Compartido de Archivos (File Share)**: La unidad principal de Azure Files. Es un recurso compartido de red que puedes montar en clientes Windows, Linux y macOS.
* **Protocolos**:
  * **SMB (Server Message Block)**: El protocolo estándar de compartición de archivos en Windows.
  * **NFS (Network File System)**: El protocolo estándar de compartición de archivos en Linux/Unix.
* **Azure File Sync**: Un servicio que te permite cachear tus recursos compartidos de Azure Files en un Windows Server local (o en una VM de Azure) para un acceso rápido y local.
* **Instantáneas (Snapshots)**: Copias de solo lectura y puntuales de tus recursos compartidos de archivos, útiles para backups y recuperación.
* **Soft Delete**: Protege tus recursos compartidos de archivos de eliminaciones accidentales.

---

## 2. 🛠️ Niveles de Rendimiento (Tiers)

Azure Files ofrece diferentes niveles de rendimiento para adaptarse a diversas cargas de trabajo.

* **Premium (SSD)**:
  * **Almacenamiento**: SSD de alto rendimiento.
  * **Protocolos**: SMB y NFS.
  * **Caso de Uso**: Cargas de trabajo de alto rendimiento, bases de datos, aplicaciones empresariales.
* **Transaction Optimized**:
  * **Almacenamiento**: HDD.
  * **Protocolos**: SMB.
  * **Caso de Uso**: Cargas de trabajo con muchas transacciones, aplicaciones que no son sensibles a la latencia.
* **Hot (Frecuente)**:
  * **Almacenamiento**: HDD.
  * **Protocolos**: SMB.
  * **Caso de Uso**: Compartición de archivos de propósito general.
* **Cool (Esporádico)**:
  * **Almacenamiento**: HDD.
  * **Protocolos**: SMB.
  * **Caso de Uso**: Almacenamiento de archivos de acceso menos frecuente, con un costo de almacenamiento más bajo.

---

## 3. 🚀 Creación y Montaje de un Recurso Compartido

### 3.1. Crear una Cuenta de Almacenamiento

1. En el Azure Portal, crea una nueva **Cuenta de Almacenamiento**.
2. **Tipo de cuenta**:
   * `FileStorage`: Para recursos compartidos de archivos Premium.
   * `StorageV2 (general purpose v2)`: Para recursos compartidos de archivos Standard (Transaction Optimized, Hot, Cool).
3. Configura la **redundancia** (LRS, ZRS, GRS, GZRS).

### 3.2. Crear un Recurso Compartido de Archivos

1. Dentro de tu cuenta de almacenamiento, ve a `File shares` -> `+ File share`.
2. **Nombre**: Nombre del recurso compartido.
3. **Tier**: Elige el nivel de rendimiento (Premium, Transaction Optimized, etc.).
4. **Cuota**: Tamaño máximo del recurso compartido.

### 3.3. Montar el Recurso Compartido

1. En el recurso compartido de archivos, haz clic en `Connect`.
2. Azure te proporcionará los scripts para montar el recurso compartido en Windows, Linux y macOS.

* **Windows (SMB)**:
  ```powershell
  # Conecta a una letra de unidad (ej. Z:)
  $connectTestResult = Test-NetConnection -ComputerName <storage-account-name>.file.core.windows.net -Port 445
  if ($connectTestResult.TcpTestSucceeded) {
      # Guarda las credenciales
      cmdkey /add:<storage-account-name>.file.core.windows.net /user:AZURE\<storage-account-name> /pass:<storage-account-key>
      # Monta el recurso compartido
      New-PSDrive -Name Z -PSProvider FileSystem -Root \\<storage-account-name>.file.core.windows.net\<share-name> -Persist
  } else {
      Write-Error -Message "Unable to reach the Azure storage account via port 445. Check outbound firewall rules."
  }
  ```
* **Linux (SMB)**:
  ```bash
  sudo mkdir -p /mnt/myazureshare
  sudo mount -t cifs //<storage-account-name>.file.core.windows.net/<share-name> /mnt/myazureshare -o vers=3.0,username=<storage-account-name>,password=<storage-account-key>,dir_mode=0777,file_mode=0777,serverino
  ```
* **Linux (NFS - solo para Premium)**:
  ```bash
  sudo mkdir -p /mnt/myazureshare
  sudo mount -t nfs -o vers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport <storage-account-name>.file.core.windows.net:/<storage-account-name>/<share-name> /mnt/myazureshare
  ```

---

## 4. 🔒 Seguridad

* **Autenticación**:
  * **Clave de la Cuenta de Almacenamiento**: Proporciona acceso total al recurso compartido.
  * **SAS (Shared Access Signature)**: Proporciona acceso delegado y limitado.
  * **Azure AD (Microsoft Entra ID)**: (Recomendado para SMB)
    * **Azure AD Domain Services (Azure AD DS)**: Permite la autenticación basada en identidad para VMs unidas a un dominio.
    * **On-premises Active Directory Domain Services (AD DS)**: Para VMs locales o en Azure unidas a un dominio AD DS.
    * **Azure AD Kerberos**: Para clientes híbridos y en la nube.
    * Permite permisos a nivel de archivo/directorio (ACLs de Windows).
* **Cifrado (Encryption)**:
  * **Encryption in Transit**: Cifrado por defecto con SMB 3.0+ y NFSv4.1.
  * **Encryption at Rest**: Cifrado por defecto con claves gestionadas por Microsoft. Puedes usar tus propias claves (Customer-Managed Keys).
* **Redes**:
  * **Firewall y Redes Virtuales**: Restringe el acceso a la cuenta de almacenamiento a IPs o VNets específicas.
  * **Private Endpoints**: Expone tu recurso compartido a través de un endpoint privado en tu VNet.

---

## 5. 🔄 Azure File Sync

Un servicio que sincroniza tus recursos compartidos de Azure Files con servidores Windows locales.

* **Componentes**:
  * **Recurso Compartido de Azure Files**: La copia maestra de tus archivos en la nube.
  * **Storage Sync Service**: El recurso de Azure que gestiona la sincronización.
  * **Sync Group**: Define la topología de sincronización.
  * **Server Endpoint**: La ruta en un Windows Server registrado que se sincroniza.
  * **Cloud Endpoint**: El recurso compartido de Azure Files.
* **Cloud Tiering**: Permite que los archivos de acceso menos frecuente se almacenen solo en la nube, liberando espacio en el servidor local.

---

## 6. 💡 Buenas Prácticas y Consejos

* **Usa el Nivel de Rendimiento Adecuado**: Elige el tier que mejor se adapte a tus necesidades de rendimiento y costo.
* **Seguridad**:
  * **Autenticación Basada en Identidad**: Siempre prefiere la autenticación con Azure AD sobre las claves de la cuenta de almacenamiento.
  * **Private Endpoints**: Usa endpoints privados para acceder a tus recursos compartidos desde una VNet.
* **Monitoreo**: Utiliza Azure Monitor para rastrear métricas como la capacidad, la latencia, el rendimiento y las transacciones.
* **Backups**:
  * **Instantáneas (Snapshots)**: Úsalas para backups puntuales.
  * **Azure Backup**: (Recomendado) Para una solución de backup gestionada y a largo plazo.
* **Azure File Sync para Cargas Híbridas**: Es la solución ideal si necesitas acceso local rápido a tus archivos en la nube.
* **Infraestructura como Código (IaC)**: Define tus cuentas de almacenamiento y recursos compartidos usando Bicep, ARM Templates o Terraform.
* **SMB vs. NFS**: Elige el protocolo que mejor se adapte a tus clientes (SMB para Windows, NFS para Linux).

---

Este cheatsheet te proporciona una referencia completa de Azure Files, cubriendo sus conceptos esenciales, niveles de rendimiento, cómo crear y montar recursos compartidos, la seguridad, la sincronización con Azure File Sync y las mejores prácticas para una gestión de archivos eficiente y segura en Microsoft Azure.
