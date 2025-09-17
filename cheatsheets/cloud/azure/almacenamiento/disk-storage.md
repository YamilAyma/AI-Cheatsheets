
---

# 💿 Azure Disk Storage Cheatsheet Completo 💿

**Azure Disk Storage** proporciona almacenamiento de bloques de alto rendimiento, duradero y de baja latencia para máquinas virtuales (VMs) de Azure. Los discos se gestionan como recursos de Azure de nivel superior y están diseñados para una alta disponibilidad y durabilidad.

---

## 1. 🌟 Conceptos Clave

* **Managed Disks (Discos Gestionados)**: (Recomendado) Azure gestiona la cuenta de almacenamiento, la disponibilidad y la escalabilidad de los discos. Simplifica enormemente la gestión.
* **Unmanaged Disks (Discos no Gestionados)**: (Heredado) El usuario gestiona la cuenta de almacenamiento donde se guardan los discos (VHDs). Mayor complejidad.
* **Disk Types (Tipos de Disco)**:
  * **Ultra Disk**: Máximo rendimiento, latencia ultra baja.
  * **Premium SSD**: SSD de alto rendimiento para cargas de trabajo de producción.
  * **Standard SSD**: SSD de rendimiento consistente para cargas de trabajo de producción que no son de alta demanda.
  * **Standard HDD**: Discos duros magnéticos, para cargas de trabajo no críticas.
* **Roles de Disco (Disk Roles)**:
  * **OS Disk (Disco del Sistema Operativo)**: Almacena el sistema operativo de la VM. Hay uno por cada VM.
  * **Data Disk (Disco de Datos)**: Almacenamiento adicional que se adjunta a una VM para datos de aplicaciones.
  * **Temporary Disk (Disco Temporal)**: Almacenamiento temporal no persistente incluido con la VM, en el hardware físico del host de Azure. **¡Los datos se pierden en reinicios, migraciones o detenciones!**
* **Rendimiento del Disco**:
  * **IOPS (Input/Output Operations Per Second)**: Número de operaciones de lectura/escritura por segundo.
  * **Throughput (Rendimiento)**: Ancho de banda de datos (MB/s).
* **Snapshot (Instantánea)**: Una copia de seguridad de solo lectura y puntual de un disco.
* **Shared Disk (Disco Compartido)**: (Para Premium SSD y Ultra Disk) Permite adjuntar un disco a múltiples VMs, para aplicaciones en clúster.

---

## 2. 🛠️ Tipos de Discos y Casos de Uso

| Tipo de Disco            | Descripción                                                                   | Caso de Uso                                                                |
| :----------------------- | :----------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| **Ultra Disk**     | Latencia de microsegundos, alto IOPS y throughput personalizables.             | Bases de datos críticas de alto rendimiento (SAP HANA, SQL Server).       |
| **Premium SSD v2** | Rendimiento granularmente configurable (IOPS, throughput).                     | Cargas de trabajo de producción que necesitan un rendimiento específico. |
| **Premium SSD v1** | Alto rendimiento, baja latencia, IOPS y throughput fijos por tamaño de disco. | Cargas de trabajo de producción, bases de datos.                          |
| **Standard SSD**   | Rendimiento consistente para cargas de trabajo de menor demanda.               | Servidores web, aplicaciones empresariales de bajo a medio uso.            |
| **Standard HDD**   | Discos magnéticos, menor costo.                                               | Backups, datos no críticos, cargas de trabajo de acceso poco frecuente.   |

---

## 3. 🚀 Creación y Gestión de Discos

### 3.1. Creación de Discos

* **Al crear una VM**: Puedes configurar el disco del SO y añadir discos de datos directamente durante el proceso de creación de la VM.
* **Crear un Disco Independiente**:
  1. En el Azure Portal, ve a `Disks` -> `Create`.
  2. **Grupo de Recursos**: Selecciona o crea uno.
  3. **Nombre del Disco**: Nombre único.
  4. **Región**: Ubicación geográfica.
  5. **Availability Zone**: (Opcional) Zona de Disponibilidad.
  6. **Source type**: `None` (disco vacío), `Snapshot` (desde una instantánea), `Storage blob`.
  7. **Size**: Elige el tamaño del disco (y el tipo de rendimiento asociado).

### 3.2. Adjuntar un Disco a una VM

1. Asegúrate de que la VM esté en ejecución.
2. En el Azure Portal, ve a tu VM -> `Disks`.
3. Haz clic en `Attach existing disks` (si ya lo creaste) o `Create and attach a new disk`.
4. Una vez adjuntado, necesitas **inicializar y formatear el disco dentro del sistema operativo** de la VM para que sea utilizable.

### 3.3. Desmontar un Disco de una VM

1. Dentro del sistema operativo de la VM, desmonta el disco lógicamente.
2. En el Azure Portal, ve a tu VM -> `Disks`.
3. Selecciona el disco y haz clic en `Detach`.

---

## 4. 📈 Rendimiento

* El rendimiento (IOPS y throughput) de los discos **Premium SSD** y **Standard SSD** depende del **tamaño del disco**. Discos más grandes tienen mayor rendimiento.
* El rendimiento de **Ultra Disk** y **Premium SSD v2** se puede configurar independientemente del tamaño del disco.
* El rendimiento también está limitado por el **tamaño de la VM**. Una VM de un tamaño pequeño no podrá aprovechar el rendimiento máximo de un disco grande de alto rendimiento.

---

## 5. 🛡️ Backups y Recuperación ante Desastres

* **Snapshots (Instantáneas)**:
  * Una copia de seguridad puntual de un disco.
  * Puedes crear un nuevo disco a partir de una instantánea.
  * **Tipos**: `Full` y `Incremental` (más eficientes en costo).
* **Azure Backup**:
  * (Recomendado) Un servicio de backup gestionado que automatiza la creación de instantáneas y la gestión de la retención.
  * Proporciona copias de seguridad consistentes con la aplicación.
* **Azure Site Recovery**:
  * Para la replicación de VMs y discos a otra región de Azure para la recuperación ante desastres.

---

## 6. 🔒 Seguridad

* **Encryption at Rest (Cifrado en Reposo)**:
  * **Server-Side Encryption (SSE)**: (Por defecto) Los discos se cifran automáticamente en los centros de datos de Azure con claves gestionadas por Microsoft.
  * **Customer-Managed Keys (CMK)**: Puedes usar tus propias claves de cifrado gestionadas en Azure Key Vault para un mayor control.
* **Azure Disk Encryption (ADE)**:
  * Cifra los discos del SO y los discos de datos de las VMs de Azure utilizando BitLocker (Windows) o DM-Crypt (Linux).
  * Las claves de cifrado se almacenan en tu Azure Key Vault.
* **Private Links**: Permiten importar o exportar discos gestionados de forma segura dentro de tu VNet, sin exponerlos a la internet pública.
* **RBAC (Role-Based Access Control)**: Usa RBAC para controlar quién puede crear, adjuntar, modificar o eliminar discos.

---

## 7. 💡 Buenas Prácticas y Consejos

* **Usa Managed Disks**: Es el estándar moderno. Simplifica la gestión, el escalado y la disponibilidad.
* **Elige el Tipo de Disco Correcto**:
  * `Premium SSD` para la mayoría de las cargas de trabajo de producción.
  * `Standard SSD` para desarrollo/pruebas o aplicaciones de menor demanda.
  * `Standard HDD` para backups o datos de acceso poco frecuente.
  * `Ultra Disk` solo cuando necesites el máximo rendimiento y la menor latencia.
* **Dimensiona el Disco y la VM Juntos**: Asegúrate de que el tamaño de tu VM pueda soportar el rendimiento de los discos que le adjuntas.
* **Separa los Datos y el SO**: Usa discos de datos para los datos de tu aplicación, no el disco del SO. Facilita la gestión, los backups y el escalado.
* **Habilita el Caching**:
  * **Read-only**: Para cargas de trabajo de solo lectura.
  * **Read-write**: Para cargas de trabajo de lectura/escritura balanceadas.
  * **None**: Para cargas de trabajo de solo escritura.
* **Usa Snapshots y Azure Backup**: Implementa una estrategia de backup robusta para tus discos.
* **Seguridad**:
  * Habilita el cifrado SSE (por defecto). Considera ADE para una capa adicional de cifrado a nivel de SO.
  * Usa RBAC para aplicar el principio de mínimo privilegio.
* **Infraestructura como Código (IaC)**: Define tus discos y VMs usando Bicep, ARM Templates o Terraform para despliegues consistentes.
* **Limpieza de Recursos**: Cuando eliminas una VM, los discos adjuntos no se eliminan por defecto. Asegúrate de eliminar los discos que ya no necesites para evitar costos.

---

Este cheatsheet te proporciona una referencia completa de Azure Disk Storage, cubriendo sus conceptos esenciales, tipos de discos, gestión, rendimiento, backups, seguridad y las mejores prácticas para proporcionar un almacenamiento de bloques eficiente y seguro para tus máquinas virtuales en Microsoft Azure.
