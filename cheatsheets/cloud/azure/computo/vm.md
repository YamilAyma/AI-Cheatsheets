
---

# 💻 Azure Virtual Machines (VMs) Cheatsheet Completo 💻

**Azure Virtual Machines (VMs)** es el servicio de computación IaaS (Infraestructura como Servicio) de Microsoft Azure. Permite crear y gestionar máquinas virtuales en la nube, proporcionando la flexibilidad de un entorno de computación totalmente configurable, incluyendo el sistema operativo, el software de aplicación y el almacenamiento.

---

## 1. 🌟 Conceptos Clave

* **Virtual Machine (VM)**: Una instancia de servidor virtual que se ejecuta en los centros de datos de Azure.
* **Imagen (Image)**: Una plantilla que contiene un sistema operativo preconfigurado (ej. Ubuntu, Windows Server, CentOS) y, opcionalmente, software de aplicación.
* **Tamaño de VM (VM Size)**: Define la capacidad de hardware de una VM (CPU virtual, memoria, IOPS de almacenamiento temporal).
* **Disco (Disk)**: El almacenamiento persistente para las VMs de Azure.
  * **Disco del Sistema Operativo (OS Disk)**: Contiene el sistema operativo.
  * **Disco de Datos (Data Disk)**: Almacenamiento adicional que puedes adjuntar a una VM.
* **Conjunto de Disponibilidad (Availability Set)**: Una agrupación lógica de VMs dentro de un centro de datos que permite a Azure entender cómo construir tu aplicación para redundancia y alta disponibilidad. Distribuye las VMs en Dominios de Actualización y Dominios de Fallo.
* **Zonas de Disponibilidad (Availability Zones)**: Centros de datos físicamente separados dentro de una región de Azure. Desplegar VMs en múltiples zonas proporciona una mayor disponibilidad y resiliencia ante fallos de centro de datos.
* **Red Virtual (VNet)**: Una red virtual aislada en la nube de Azure donde se despliegan tus VMs.
* **Interfaz de Red (NIC - Network Interface Card)**: Permite a una VM de Azure comunicarse con Internet, Azure y recursos locales.
* **Grupo de Seguridad de Red (NSG - Network Security Group)**: Un firewall virtual que controla el tráfico de red de entrada y salida a nivel de NIC o subred.
* **Dirección IP Pública (Public IP Address)**: Una dirección IP que permite que los recursos de internet se comuniquen con tus VMs de Azure.
* **Diagnósticos de Arranque (Boot Diagnostics)**: Permite ver la salida de la consola y capturas de pantalla de la VM, útil para diagnosticar problemas de arranque.
* **Extensiones de VM (VM Extensions)**: Pequeñas aplicaciones que proporcionan configuración post-despliegue y tareas de automatización en las VMs.

---

## 2. 🛠️ Tamaños de VMs (Series)

* **B-series (Burstable)**: Para cargas de trabajo con uso de CPU bajo a moderado que experimentan picos de uso. (Desarrollo/Pruebas, servidores web pequeños).
* **D-series (General Purpose)**: Un buen balance de CPU, memoria y almacenamiento temporal. (Aplicaciones de producción, bases de datos pequeñas/medianas).
* **E-series (Memory Optimized)**: Alta relación de memoria a CPU. (Bases de datos relacionales, cachés en memoria, análisis).
* **F-series (Compute Optimized)**: Alta relación de CPU a memoria. (Servidores web de alto tráfico, procesamiento por lotes, análisis).
* **L-series (Storage Optimized)**: Alto rendimiento de disco y IOPS. (Bases de datos NoSQL como Cassandra, MongoDB).
* **N-series (GPU Optimized)**: VMs con GPUs NVIDIA. (Inteligencia artificial, machine learning, renderizado).
* **H-series (High Performance Compute - HPC)**: VMs para computación de alto rendimiento.

---

## 3. 💾 Discos de Almacenamiento (Disk Storage)

* **Tipos de Discos**:
  * **Ultra Disk**: Almacenamiento de disco de latencia ultra baja para cargas de trabajo I/O intensivas.
  * **Premium SSD**: SSD de alto rendimiento para cargas de trabajo de producción.
  * **Standard SSD**: SSD de rendimiento consistente para cargas de trabajo que requieren menor latencia.
  * **Standard HDD**: Discos duros magnéticos, para cargas de trabajo no críticas.
* **Discos Gestionados (Managed Disks)**: (Recomendado) Azure gestiona el almacenamiento, la disponibilidad y la escalabilidad.
* **Discos no Gestionados (Unmanaged Disks)**: Tú gestionas las cuentas de almacenamiento donde se guardan los discos (VHDs). (Heredado).
* **Disco Temporal (Temporary Disk)**: Almacenamiento temporal no persistente incluido con la VM. **¡Los datos se pierden en reinicios, migraciones o detenciones!**

---

## 4. 🚀 Creación y Gestión de una VM

### 4.1. Creación (Azure Portal / CLI / Bicep)

1. **Grupo de Recursos**: Selecciona o crea uno.
2. **Nombre de VM**: Nombre único.
3. **Región**: Ubicación geográfica.
4. **Opciones de Disponibilidad**: Sin redundancia, Zona de Disponibilidad, o Conjunto de Disponibilidad.
5. **Imagen**: Sistema operativo (Ubuntu, Windows Server, etc.).
6. **Tamaño**: Elige el tamaño de la VM.
7. **Autenticación**:
   * **Linux**: Clave pública SSH o contraseña.
   * **Windows**: Nombre de usuario y contraseña.
8. **Discos**: Configura el disco del SO y añade discos de datos.
9. **Redes**: Configura la VNet, subred, IP pública y NSG.
10. **Gestión**: Habilita monitoreo, diagnósticos, etc.
11. **Extensiones**: Añade extensiones para configuración (ej. Custom Script Extension).

### 4.2. Conexión a VMs

* **Linux (SSH)**:
  ```bash
  ssh -i /path/to/your-private-key.pem azureuser@<public-ip-address>
  ```
* **Windows (RDP)**:
  * Usa el cliente de Escritorio Remoto con la IP pública, nombre de usuario y contraseña.
* **Azure Bastion**: Un servicio PaaS que te permite conectarte de forma segura (SSH/RDP) a tus VMs directamente desde el Azure Portal, sin exponerlas a la internet pública.
* **Serial Console**: Acceso a la consola de la VM para diagnósticos.

---

## 5. 🔒 Seguridad (Network Security Groups - NSGs, ¡CRÍTICO!)

* Un NSG contiene una lista de reglas de seguridad que permiten o deniegan el tráfico de red.
* Se pueden asociar a NICs o a subredes.
* **Reglas de Entrada (Inbound Rules)**:
  * **Prioridad**: Número de 100 a 4096. Las reglas se procesan en orden de prioridad.
  * **Fuente**: IP, rango CIDR, etiqueta de servicio, o grupo de seguridad de aplicación.
  * **Protocolo**: TCP, UDP, ICMP, Any.
  * **Rango de Puertos de Destino**: Puertos específicos (ej. 22 para SSH, 80 para HTTP, 443 para HTTPS, 3389 para RDP).
  * **Acción**: Allow (Permitir) o Deny (Denegar).
* **Reglas de Salida (Outbound Rules)**:
  * Similares a las de entrada, pero controlan el tráfico saliente.

### 5.1. Identidades Gestionadas (Managed Identities)

* **Método Recomendado para Autenticación de VM**: Permite que tus VMs se autentiquen con otros servicios de Azure (ej. Key Vault, Storage) sin necesidad de almacenar credenciales en el código.
* **System-assigned**: La identidad se crea y se elimina con la VM.
* **User-assigned**: La identidad es un recurso de Azure independiente que se puede asignar a múltiples VMs.

---

## 6. 📈 Escalabilidad y Alta Disponibilidad

* **Scale Sets (Conjuntos de Escalado)**:
  * Permiten crear y gestionar un grupo de VMs con carga equilibrada.
  * El número de instancias de VM puede aumentar o disminuir automáticamente en respuesta a la demanda (Auto-scaling).
* **Availability Sets (Conjuntos de Disponibilidad)**:
  * Protege contra fallos de hardware en un único centro de datos.
  * Distribuye las VMs en:
    * **Fault Domains**: Racks de servidores con su propia fuente de alimentación y red.
    * **Update Domains**: Grupos de VMs y hardware que pueden ser reiniciados al mismo tiempo para mantenimiento.
* **Availability Zones (Zonas de Disponibilidad)**:
  * Para una mayor disponibilidad, despliega tus VMs en múltiples Zonas de Disponibilidad dentro de una región.
* **Load Balancer / Application Gateway**:
  * Distribuyen el tráfico entre múltiples VMs para escalabilidad y alta disponibilidad.

---

## 7. 💡 Buenas Prácticas y Consejos

* **Usa Grupos de Recursos**: Agrupa tus VMs y recursos relacionados en Grupos de Recursos para una gestión más fácil.
* **Infraestructura como Código (IaC)**: Usa Bicep o ARM Templates para definir y desplegar tus VMs de forma consistente.
* **Principio de Mínimo Privilegio (NSGs y RBAC)**:
  * Configura NSGs para permitir solo el tráfico de red necesario.
  * Usa RBAC para otorgar a los usuarios solo los permisos que necesitan para gestionar las VMs.
* **Identidades Gestionadas**: **Siempre prefiere las identidades gestionadas** sobre el almacenamiento de credenciales en tus VMs.
* **Alta Disponibilidad**:
  * Para aplicaciones críticas, despliega VMs en un **Availability Set** o en **Availability Zones**.
  * Usa un **Load Balancer** o **Application Gateway** para distribuir el tráfico.
* **Discos Gestionados**: Utiliza discos gestionados para una gestión más sencilla y una mayor resiliencia.
* **Backups y Recuperación**:
  * Configura **Azure Backup** para tus VMs.
  * Usa **Azure Site Recovery** para la recuperación ante desastres.
* **Monitoreo con Azure Monitor**: Habilita los diagnósticos de arranque y utiliza Azure Monitor para recopilar métricas y logs de tus VMs.
* **Automatización**: Utiliza extensiones de VM (ej. Custom Script Extension) o herramientas como Ansible/Chef/Puppet para la configuración de software.
* **Costos**: Elige el tamaño de VM adecuado para tu carga de trabajo y apaga las VMs cuando no las estés usando para ahorrar costos. Considera Azure Reservations para cargas de trabajo predecibles.

---

Este cheatsheet te proporciona una referencia completa de Azure Virtual Machines, cubriendo sus conceptos esenciales, tipos de VMs y discos, cómo crear y conectar, seguridad, escalabilidad, alta disponibilidad y las mejores prácticas para ejecutar servidores virtuales de forma eficiente y segura en Microsoft Azure.
