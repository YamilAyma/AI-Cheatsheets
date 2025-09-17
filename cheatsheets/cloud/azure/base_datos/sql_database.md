
---

# 🗄️ Azure SQL Database Cheatsheet Completo 🗄️

**Azure SQL Database** es un servicio de base de datos relacional PaaS (Plataforma como Servicio) completamente gestionado en Azure. Es una versión siempre actualizada y "evergreen" del motor de base de datos de Microsoft SQL Server, lo que te libera de la gestión de la infraestructura subyacente (servidores, parches, backups).

---

## 1. 🌟 Conceptos Clave

* **PaaS (Platform as a Service)**: Azure gestiona la infraestructura, el sistema operativo, los parches del motor de DB, los backups y la alta disponibilidad. Tú gestionas tus datos y la seguridad a nivel de base de datos.
* **Logical Server (Servidor Lógico)**: Un contenedor lógico para tus bases de datos en Azure. No es una instancia de servidor real, sino un punto de administración central para un grupo de bases de datos.
* **Base de Datos Única (Single Database)**: Un modelo de despliegue donde cada base de datos tiene sus propios recursos garantizados (CPU, memoria, almacenamiento).
* **Grupo Elástico (Elastic Pool)**: Un conjunto de bases de datos que comparten un conjunto de recursos provisionados. Ideal para aplicaciones SaaS multi-inquilino con patrones de uso variables.
* **Instancia Gestionada (Managed Instance)**: (Cercano a IaaS) Una instancia de SQL Server casi 100% compatible con SQL Server on-premise, con las ventajas de PaaS. Ideal para migraciones "lift-and-shift".
* **DTU (Database Transaction Unit)**: Un modelo de compra basado en una medida combinada de CPU, memoria y I/O. Simple, pero menos granular.
* **vCore (Virtual Core)**: Un modelo de compra que te permite elegir de forma independiente la CPU, la memoria y el almacenamiento. Más flexible y transparente.
* **Nivel de Servicio (Service Tier)**: Determina el rendimiento y las características disponibles (ej. General Purpose, Business Critical).
* **Nivel de Computación (Compute Tier)**:
  * **Provisioned (Aprovisionado)**: Recursos de computación siempre disponibles.
  * **Serverless (Sin Servidor)**: Pausa y reanuda automáticamente la computación según la demanda. Ideal para cargas de trabajo intermitentes.
* **Alta Disponibilidad (HA)**: Azure SQL Database proporciona HA automáticamente (99.99%+).
* **Recuperación ante Desastres (DR)**: Lograda a través de Geo-Replicación, Grupos de Failover.

---

## 2. 🛠️ Creación y Configuración

### 2.1. Crear una Base de Datos (Portal / CLI / Bicep)

1. **Grupo de Recursos**: Selecciona o crea uno.
2. **Nombre de la Base de Datos**: Nombre único en el servidor lógico.
3. **Servidor Lógico**: Crea un nuevo servidor lógico o selecciona uno existente.
   * **Server name**: Nombre único globalmente (`<server-name>.database.windows.net`).
   * **Server admin login**: Credenciales de administrador del servidor.
4. **Grupo Elástico**: Opcional, para compartir recursos.
5. **Compute + Storage**: Elige el modelo de compra (DTU o vCore) y el nivel de servicio.
6. **Redundancia de Almacenamiento**: LRS (local), ZRS (zona), GRS (geo), GZRS (geo-zona).
7. **Redes (Networking)**:
   * **Connectivity method**: `No access`, `Public endpoint`, `Private endpoint`.
   * **Firewall rules**: **¡CRÍTICO!** Configura reglas de firewall para permitir el acceso desde tu IP, otros servicios de Azure.
8. **Seguridad**:
   * **Microsoft Defender for SQL**: Habilita la protección avanzada contra amenazas.
9. **Configuración Adicional**:
   * **Collation**: Reglas de ordenación y comparación de caracteres.
   * **Maintenance window**: Ventana para actualizaciones.

### 2.2. Conexión a la Base de Datos

* **Herramientas**: SQL Server Management Studio (SSMS), Azure Data Studio, Visual Studio Code (con extensión `mssql`).
* **Server name**: `<server-name>.database.windows.net`.
* **Authentication**: SQL Server Authentication o Azure Active Directory (Microsoft Entra ID) Authentication.
* **Connection String (Cadena de Conexión)**:
  ```
  Server=tcp:<server-name>.database.windows.net,1433;Initial Catalog=<db-name>;Persist Security Info=False;User ID=<user>;Password=<password>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
  ```
* **Firewall**: Asegúrate de que tu IP esté permitida en las reglas de firewall del servidor lógico.

---

## 3. 📝 Modelos de Compra y Niveles de Servicio

### 3.1. Modelo DTU

* **Basic**: Para desarrollo y cargas de trabajo ligeras.
* **Standard**: Para aplicaciones de producción con cargas de trabajo moderadas.
* **Premium**: Para cargas de trabajo de producción intensivas con alto I/O.

### 3.2. Modelo vCore

* **General Purpose (Propósito General)**:
  * Arquitectura de computación y almacenamiento desacoplada.
  * Buen balance para la mayoría de las cargas de trabajo empresariales.
  * **Compute Tier**: Provisioned o Serverless.
* **Business Critical (Crítico para el Negocio)**:
  * Arquitectura de alta disponibilidad con múltiples réplicas.
  * Rendimiento I/O muy alto, baja latencia.
  * Ideal para aplicaciones OLTP de alta velocidad.
* **Hyperscale**:
  * Arquitectura de almacenamiento altamente escalable (hasta 100 TB).
  * Backups casi instantáneos, escalado rápido.
  * Ideal para bases de datos muy grandes.

---

## 4. 📈 Rendimiento y Escalado

* **Scale Up/Down**: Cambia el nivel de servicio o los recursos (DTUs, vCores) de tu base de datos en cualquier momento.
* **Grupos Elásticos**: Comparte recursos entre múltiples bases de datos para optimizar costos en aplicaciones multi-inquilino.
* **Index Tuning**: Utiliza índices para acelerar las consultas. Azure SQL Database proporciona recomendaciones de índices automáticas.
* **Query Performance Insight**: Analiza el rendimiento de tus consultas, identifica cuellos de botella.
* **Automatic Tuning**: Habilita la afinación automática para que Azure SQL Database cree/elimine índices y corrija planes de consulta de forma automática.
* **Read Scale-Out**: Utiliza Geo-Replicas para desviar las cargas de trabajo de solo lectura a réplicas secundarias.

---

## 5. 🛡️ Alta Disponibilidad (HA) y Recuperación ante Desastres (DR)

* **Alta Disponibilidad (HA)**:
  * **General Purpose**: Utiliza Azure Premium Storage para HA a nivel de almacenamiento.
  * **Business Critical**: Utiliza una arquitectura de múltiples réplicas (similar a Always On Availability Groups).
  * El failover es automático y transparente.
* **Backups y Point-in-Time Restore (PITR)**:
  * Backups automáticos (completos, diferenciales, de logs).
  * Permite restaurar la base de datos a cualquier punto en el tiempo dentro del período de retención (7-35 días).
* **Geo-Restore**: Restaura la base de datos a otra región geográfica a partir del último backup georeplicado.
* **Active Geo-Replication**:
  * Crea hasta 4 réplicas secundarias legibles en diferentes regiones.
  * Para recuperación ante desastres y escalado de lectura.
* **Auto-Failover Groups**:
  * Agrupa una o más bases de datos para que conmuten por error como una unidad.
  * Proporciona endpoints de solo lectura y lectura/escritura que no cambian después de un failover.

---

## 6. 🔒 Seguridad

* **Firewall Rules**:
  * **Server-level**: Aplican a todas las bases de datos en el servidor lógico.
  * **Database-level**: Aplican solo a una base de datos específica.
  * Permite acceso desde IPs o rangos de IP, y desde otros servicios de Azure.
* **Virtual Network (VNet) Integration**:
  * **VNet Service Endpoints**: Permite que el tráfico a tu base de datos permanezca dentro de la red de Azure.
  * **Private Link**: Expone tu base de datos a través de un endpoint privado en tu VNet.
* **Authentication**:
  * **SQL Authentication**: Usuarios y contraseñas gestionados en la base de datos.
  * **Azure Active Directory (Microsoft Entra ID) Authentication**: (Recomendado) Autenticación centralizada, MFA.
* **Authorization**:
  * `GRANT`, `DENY`, `REVOKE` (T-SQL estándar).
  * Roles de base de datos.
* **Cifrado (Encryption)**:
  * **Transparent Data Encryption (TDE)**: Cifra los archivos de la base de datos, backups y logs en reposo. Habilitado por defecto.
  * **Always Encrypted**: Cifra los datos en tránsito y en uso, protegiendo datos sensibles incluso de los administradores de la base de datos.
* **Advanced Threat Protection (ATP)**: Parte de Microsoft Defender for SQL. Detecta actividades anómalas, inyecciones SQL, etc.
* **Dynamic Data Masking**: Oculta datos sensibles en los resultados de las consultas para usuarios no privilegiados.
* **Row-Level Security (RLS)**: Restringe el acceso a las filas de una tabla basándose en las características del usuario que ejecuta la consulta.
* **Auditing**: Rastrea eventos de la base de datos y los escribe en un log de auditoría.

---

## 7. 💡 Buenas Prácticas y Consejos

* **Usa el Modelo vCore**: Es más flexible y transparente para producción. El modelo DTU es bueno para empezar o para aplicaciones simples.
* **Elige el Nivel de Servicio Correcto**: `General Purpose` es ideal para la mayoría de las aplicaciones. `Business Critical` para aplicaciones con alta transaccionalidad y baja latencia. `Serverless` para cargas de trabajo intermitentes.
* **Seguridad de Red Primero**: Configura el firewall y la integración con VNet para restringir el acceso a tu base de datos.
* **Autenticación con Azure AD**: Siempre prefiere la autenticación de Azure AD sobre la de SQL para una gestión de identidad centralizada.
* **Monitoreo Activo**: Utiliza Query Performance Insight y Azure Monitor para monitorear el rendimiento de tu base de datos y configurar alertas.
* **Habilita Automatic Tuning**: Permite que Azure te ayude a optimizar el rendimiento de tu base de datos.
* **Usa Connection Pooling**: En tus aplicaciones, utiliza un pool de conexiones para gestionar las conexiones a la base de datos de manera eficiente.
* **Políticas de Reintento**: Implementa lógica de reintento en tus aplicaciones para manejar errores de conexión transitorios.
* **HA/DR**: Para producción, considera Active Geo-Replication o Auto-Failover Groups para la recuperación ante desastres.
* **Backups**: Define el período de retención de backups según tus requisitos de negocio.
* **Infraestructura como Código (IaC)**: Usa Bicep, ARM Templates o Terraform para definir y desplegar tus bases de datos de forma consistente.

---

Este cheatsheet te proporciona una referencia completa de Azure SQL Database, cubriendo sus conceptos esenciales, modelos de compra, configuración, rendimiento, alta disponibilidad, seguridad y las mejores prácticas para ejecutar bases de datos relacionales gestionadas de forma eficiente y segura en Microsoft Azure.
