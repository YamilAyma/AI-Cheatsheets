
---

# ☁️ Microsoft Azure Cheatsheet Completo ☁️

**Microsoft Azure** es una plataforma de computación en la nube que proporciona una amplia gama de servicios, incluyendo computación, análisis, almacenamiento y redes. Permite a las organizaciones construir, desplegar y gestionar aplicaciones a través de una red global de centros de datos de Microsoft.

---

## 1. 🌟 Conceptos Clave de Azure

* **Suscripción (Subscription)**: La unidad principal de facturación y gestión en Azure. Cada suscripción está asociada a una cuenta de Azure.
* **Grupo de Recursos (Resource Group)**: Un contenedor lógico que agrupa recursos de Azure relacionados (ej. máquinas virtuales, redes, bases de datos). Es fundamental para la gestión, el control de acceso y la facturación.
* **Recurso (Resource)**: Una entidad gestionada por Azure (ej. una VM, una base de datos, una cuenta de almacenamiento).
* **Región (Region)**: Un área geográfica en el mundo que contiene uno o más centros de datos de Azure.
* **Zona de Disponibilidad (Availability Zone)**: Centros de datos físicamente separados dentro de una región, con su propia energía, refrigeración y red, lo que permite la alta disponibilidad.
* **Azure Resource Manager (ARM)**: El servicio de despliegue y gestión de Azure. Permite crear, actualizar y eliminar recursos en tu suscripción de Azure.
* **Control de Acceso Basado en Roles (RBAC)**: Un sistema de gestión de permisos que permite un control granular sobre el acceso a los recursos de Azure.

---

## 2. 🔠 Servicios Principales (Categorías y Ejemplos)

### 2.1. Computación (Compute)

* **Azure Virtual Machines (VMs)**: Máquinas virtuales Linux y Windows en la nube.
* **Azure Functions**: Computación sin servidor (Serverless). Ejecuta código en respuesta a eventos.
* **Azure App Service**: Plataforma como Servicio (PaaS) para construir, desplegar y escalar aplicaciones web y APIs.
* **Azure Kubernetes Service (AKS)**: Servicio gestionado de Kubernetes.
* **Azure Container Apps**: Servicio de orquestación de contenedores sin servidor, ideal para microservicios.
* **Azure Container Instances (ACI)**: Contenedores individuales bajo demanda, sin necesidad de orquestadores.
* **Azure Logic Apps**: Flujos de trabajo sin servidor para integrar aplicaciones, datos y servicios.

### 2.2. Almacenamiento (Storage)

* **Azure Blob Storage**: Almacenamiento de objetos escalable y de alta disponibilidad.
  * **Hot Tier**: Para datos de acceso frecuente.
  * **Cool Tier**: Para datos de acceso poco frecuente.
  * **Archive Tier**: Para archivado a largo plazo.
* **Azure Disk Storage**: Almacenamiento de bloques de alto rendimiento para VMs.
* **Azure Files**: Recurso compartido de archivos gestionado en la nube.
* **Azure Queue Storage**: Almacenamiento de colas de mensajes.

### 2.3. Bases de Datos (Databases)

* **Azure SQL Database**: Base de datos relacional gestionada (PaaS), compatible con SQL Server.
* **Azure Database for MySQL/PostgreSQL/MariaDB**: Bases de datos de código abierto gestionadas (PaaS).
* **Azure Cosmos DB**: Base de datos NoSQL multimodelo, distribuida globalmente, con baja latencia.
* **Azure Cache for Redis**: Servicio de caché en memoria gestionado.

### 2.4. Redes (Networking)

* **Azure Virtual Network (VNet)**: Red virtual aislada en la nube de Azure.
  * **Subnets**: Segmentos de IP dentro de una VNet.
  * **Network Security Groups (NSGs)**: Firewall a nivel de subred/NIC.
* **Azure Load Balancer**: Balanceador de carga para distribuir tráfico a VMs.
* **Azure Application Gateway**: Balanceador de carga de capa 7 (HTTP/HTTPS) con Web Application Firewall (WAF).
* **Azure CDN (Content Delivery Network)**: Red de entrega de contenido para baja latencia.
* **Azure DNS**: Servicio DNS para alojar tus dominios.

### 2.5. Seguridad, Identidad y Gobernanza (Security, Identity & Governance)

* **Azure Active Directory (Azure AD)**: Servicio de gestión de identidad y acceso.
  * Ahora se llama **Microsoft Entra ID**.
  * Usuarios, grupos, roles, SSO.
* **Azure Key Vault**: Almacena y gestiona secretos, claves de cifrado y certificados.
* **Azure Security Center**: Monitoreo de seguridad y gestión de políticas.
* **Azure Policy**: Aplica y gestiona políticas de gobernanza sobre tus recursos.
* **Azure Blueprints**: Define un conjunto de recursos, políticas y roles para un despliegue repetible.

### 2.6. Herramientas de Desarrollo y DevOps

* **Azure DevOps**: Un conjunto de servicios para el ciclo de vida de desarrollo de software (Boards, Repos, Pipelines, Test Plans, Artifacts).
* **Azure Monitor**: Servicio de monitoreo para recopilar, analizar y actuar sobre la telemetría de tus entornos.
  * **Metrics**: Recopila métricas de rendimiento.
  * **Logs**: Recopila y analiza logs.
* **Azure Bicep / ARM Templates**: Infraestructura como código (IaC) para provisionar recursos de Azure.

---

## 3. 🛠️ Acceso y Gestión de Azure

### 3.1. Azure Portal (UI)

* Interfaz web para interactuar con los servicios de Azure.

### 3.2. Azure CLI (Command Line Interface)

* Herramienta de línea de comandos para interactuar con Azure.
  1. **Instalar**: Sigue la guía oficial.
  2. **Iniciar Sesión**: `az login`
  3. **Ejemplos**:
     ```bash
     az group create --name MyResourceGroup --location eastus
     az vm create --resource-group MyResourceGroup --name MyVM --image UbuntuLTS --admin-username azureuser --generate-ssh-keys
     az storage blob upload --account-name mystorageaccount --container-name mycontainer --name myblob --file mylocalfile.txt
     az group delete --name MyResourceGroup --yes
     ```

### 3.3. Azure PowerShell

* Módulo de PowerShell para interactuar con Azure.

### 3.4. Azure SDKs (Software Development Kits)

* Bibliotecas para programar con Azure en varios lenguajes (Python, Java, .NET, Node.js, Go).

### 3.5. Bicep / ARM Templates (IaC)

* **Bicep**: Un lenguaje declarativo y simplificado que transpila a ARM Templates.
  ```bicep
  resource storageAccount 'Microsoft.Storage/storageAccounts@2021-09-01' = {
    name: 'mystorageaccount1234'
    location: resourceGroup().location
    sku: {
      name: 'Standard_LRS'
    }
    kind: 'StorageV2'
  }
  ```
* **ARM Templates**: Archivos JSON para definir recursos.

---

## 4. 🔒 Seguridad en Azure (Azure AD y RBAC - ¡CRÍTICO!)

* **Azure Active Directory (Microsoft Entra ID)**:
  * **Tenants**: Una instancia dedicada de Azure AD.
  * **Usuarios y Grupos**: Gestiona las identidades.
  * **Service Principals**: Identidades para aplicaciones.
  * **Managed Identities**: Identidades gestionadas para recursos de Azure.
* **Control de Acceso Basado en Roles (RBAC)**:
  * Asigna roles (conjunto de permisos) a identidades (usuarios, grupos, service principals, managed identities) en un ámbito específico (suscripción, grupo de recursos, recurso).
  * **Roles Built-in**: `Owner` (Control total), `Contributor` (Crear/gestionar recursos, pero no dar acceso), `Reader` (Solo ver).
  * **Roles Personalizados**: Para permisos granulares.

---

## 5. 💰 Gestión de Costos

* **Pago por Uso**: Paga solo por lo que consumes.
* **Azure Free Account**: Cuenta gratuita con créditos y servicios gratuitos por un tiempo.
* **Azure Cost Management**: Herramienta para monitorear, analizar y optimizar tus costos.
* **Budgets**: Configura presupuestos y alertas para evitar gastos inesperados.
* **Azure Advisor**: Proporciona recomendaciones para mejorar el costo, rendimiento, seguridad, etc.
* **Reservations**: Ahorra dinero al comprometerte a usar ciertos servicios por 1 o 3 años.

---

## 6. 💡 Buenas Prácticas y Consejos

* **Organiza con Grupos de Recursos**: Agrupa recursos relacionados para facilitar la gestión.
* **Infraestructura como Código (IaC)**: Usa Bicep o ARM Templates para definir y desplegar tu infraestructura de forma consistente.
* **Principio de Mínimo Privilegio (RBAC)**: Otorga solo los permisos necesarios para realizar una tarea.
* **Managed Identities**: Utiliza identidades gestionadas para que tus recursos de Azure se autentiquen de forma segura con otros servicios.
* **Monitoriza con Azure Monitor**: Configura alertas para detectar anomalías y monitorea el rendimiento de tus recursos.
* **Seguridad en Redes (NSGs)**: Configura Network Security Groups para controlar el tráfico de red de entrada y salida.
* **Alta Disponibilidad**: Diseña tus aplicaciones para ser redundantes a través de Zonas de Disponibilidad.
* **Azure Policy**: Utiliza políticas para hacer cumplir estándares y gobernanza en tu entorno.
* **Etiquetado (Tagging)**: Etiqueta tus recursos para organización, gestión de costos y automatización.
* **Comienza Pequeño y Escala**: Aprovecha los servicios PaaS y sin servidor para empezar rápidamente y escalar a medida que tu aplicación crece.

---

Este cheatsheet te proporciona una referencia completa de Microsoft Azure, cubriendo sus conceptos esenciales, una amplia gama de servicios por categoría, herramientas de acceso, seguridad, gestión de costos y las mejores prácticas para construir y gestionar aplicaciones en la nube de Microsoft.
