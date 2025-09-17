
---

# 🌐 Azure App Service Cheatsheet Completo 🌐

**Azure App Service** es un servicio PaaS (Plataforma como Servicio) completamente gestionado para construir, desplegar y escalar aplicaciones web y APIs. Proporciona una plataforma robusta con soporte para múltiples lenguajes (.NET, .NET Core, Java, Ruby, Node.js, PHP, Python) y contenedores Docker.

---

## 1. 🌟 Conceptos Clave

* **PaaS (Platform as a Service)**: Azure gestiona la infraestructura subyacente (servidores, redes, parches de sistema operativo, etc.), permitiéndote enfocarte en el código de tu aplicación.
* **App Service Plan**: Define los recursos de computación (CPU, memoria, disco) en los que se ejecuta tu App Service. Un App Service Plan puede alojar múltiples App Services. Es la unidad de escalado y facturación.
* **App Service**: El recurso de Azure que representa tu aplicación web o API.
* **Deployment Slots (Ranuras de Despliegue)**: Entornos de "staging" que te permiten desplegar una nueva versión de tu aplicación en una ranura que no es de producción. Luego puedes "intercambiar" (`swap`) esta ranura con la de producción, logrando despliegues con cero tiempo de inactividad.
* **Kudu**: El motor de despliegue y la herramienta de diagnóstico de App Service. Proporciona una consola web (`https://<app-name>.scm.azurewebsites.net/`) para ver logs, variables de entorno y ejecutar comandos.
* **WebJobs**: Para ejecutar scripts o programas en segundo plano en el contexto de tu App Service (continuos o programados).
* **App Settings (Configuración de la Aplicación)**: Pares clave-valor que se inyectan como variables de entorno en tu aplicación. Ideal para configuraciones.
* **Connection Strings (Cadenas de Conexión)**: Configuración específica para cadenas de conexión a bases de datos.
* **Scale Up / Scale Out**:
  * **Scale Up**: Aumentar los recursos del App Service Plan (más CPU/memoria).
  * **Scale Out**: Aumentar el número de instancias de VM en el App Service Plan.
* **Managed Identities (Identidades Gestionadas)**: La forma **recomendada** para que tu App Service se autentique con otros servicios de Azure sin almacenar credenciales en el código.

---

## 2. 🛠️ Planes de App Service (Tiers)

La elección del plan afecta el costo, el rendimiento, el escalado y las funcionalidades disponibles.

* **Free (F1)** / **Shared (D1)**:
  * Para desarrollo, pruebas, prototipos.
  * Recursos compartidos, sin SLA.
  * No soporta dominios personalizados (Free), escalado automático, ni deployment slots.
* **Basic (B1, B2, B3)**:
  * Para aplicaciones de bajo tráfico.
  * Recursos dedicados.
  * Soporta dominios personalizados y SSL.
  * Sin deployment slots ni escalado automático.
* **Standard (S1, S2, S3)**:
  * Para aplicaciones de producción de tráfico moderado.
  * Soporta **escalado automático (Auto-scaling)** y **deployment slots**.
  * Backups diarios.
* **Premium (P1v2, P2v2, P3v2)**:
  * Para aplicaciones de producción de alto rendimiento y escalabilidad.
  * Mayores recursos de computación.
  * Más deployment slots.
  * Integración con VNet.
* **Isolated (Aislado)**:
  * Ejecuta tus aplicaciones en un entorno de red privado y dedicado (App Service Environment - ASE).
  * Máximo nivel de seguridad y aislamiento.

---

## 3. 🚀 Despliegue de Aplicaciones

### 3.1. Métodos de Despliegue

1. **Azure DevOps Pipelines**: (Recomendado) Integración completa de CI/CD.
2. **GitHub Actions**: (Recomendado) Integración directa con repositorios de GitHub.
3. **Deployment Center**:
   * Una interfaz en el Azure Portal que te guía para configurar CI/CD desde GitHub, Bitbucket, Azure Repos.
4. **Local Git**: Configura tu App Service como un repositorio Git remoto.
5. **FTP/FTPS**: Método tradicional, no recomendado para CI/CD.
6. **ZIP Deploy**: Sube un archivo ZIP con tu aplicación.
7. **Visual Studio / VS Code**: Despliegue directo desde el IDE.

### 3.2. Deployment Slots (Ranuras de Despliegue) - ¡Para Cero Downtime!

* **Propósito**: Desplegar nuevas versiones en un entorno de "staging" antes de pasarlas a producción.
* **Flujo de Trabajo**:
  1. Crea una nueva ranura de despliegue (ej. `staging`) desde la ranura de producción.
  2. Despliega tu nueva versión de código en la ranura `staging`.
  3. Prueba la nueva versión en la URL de la ranura `staging` (`<app-name>-staging.azurewebsites.net`).
  4. Realiza un **"swap"** (intercambio). Esto redirige el tráfico de producción a la ranura `staging` y viceversa, de forma instantánea.
* **Sticky Settings (Configuraciones Fijas)**: Puedes marcar la configuración de la aplicación y las cadenas de conexión como "fijas a la ranura", para que no se intercambien durante un swap.

---

## 4. ⚙️ Configuración

### 4.1. Application Settings

* En Azure Portal -> Tu App Service -> `Configuration` -> `Application settings`.
* Pares clave-valor que se exponen como **variables de entorno** a tu aplicación.
* **¡Nunca hardcodees secretos en tu código!** Usa App Settings (y para mayor seguridad, Key Vault).

### 4.2. Connection Strings

* Configuración específica para cadenas de conexión a bases de datos.
* Se inyectan como variables de entorno con prefijos específicos según el tipo (ej. `SQLAZURECONNSTR_`, `MYSQLCONNSTR_`).

### 4.3. General Settings

* **Stack settings**: Versión del lenguaje/runtime (Node.js, .NET, Java, etc.).
* **Platform settings**: 32-bit/64-bit.
* **Always on**: Mantiene tu aplicación "caliente" (evita cold starts), disponible en planes Basic y superiores.

---

## 5. 🔒 Seguridad

* **Authentication / Authorization**:
  * Servicio "Easy Auth" de App Service. Habilita la autenticación con proveedores de identidad (Azure AD, Microsoft, Google, Facebook, Twitter) con configuración mínima.
* **Managed Identities (Identidades Gestionadas)**:
  * **Método Recomendado**: Permite a tu App Service autenticarse de forma segura con otros servicios de Azure sin credenciales en el código.
* **Custom Domains & SSL**:
  * Añade dominios personalizados.
  * Soporta certificados SSL gratuitos (App Service Managed Certificate) o puedes subir los tuyos.
* **Networking**:
  * **VNet Integration**: Permite que tu App Service acceda a recursos en una VNet.
  * **Access Restrictions**: Restringe el tráfico de entrada a tu App Service basándose en IPs, VNet, o Service Endpoints.
  * **Private Endpoints**: Permite que los clientes en tu VNet accedan de forma segura a tu App Service a través de una dirección IP privada.
* **Azure Key Vault**: Para almacenar y gestionar secretos de forma segura. App Service puede acceder a Key Vault usando una identidad gestionada.

---

## 6. 📈 Monitoreo y Diagnóstico

* **Azure Monitor**:
  * **Metrics**: Métricas de rendimiento (CPU, memoria, solicitudes HTTP, errores).
  * **Logs**:
    * **Application logs**: Logs generados por tu aplicación (`console.log`, `System.out.println`).
    * **Web server logs**: Logs de IIS/Nginx.
    * **Detailed error messages**, **Failed request tracing**.
  * **Log stream**: Ver logs en tiempo real.
* **App Service diagnostics**: Herramienta en el Azure Portal que ayuda a diagnosticar y solucionar problemas comunes.
* **Application Insights**: (Recomendado) Para monitoreo de rendimiento de aplicaciones (APM). Ofrece trazas de solicitudes, dependencias, excepciones, y métricas de rendimiento.

---

## 7. 💡 Buenas Prácticas y Consejos

* **Usa Deployment Slots**: Para despliegues con cero tiempo de inactividad y pruebas seguras.
* **Automatiza con CI/CD**: Utiliza Azure DevOps o GitHub Actions para un flujo de trabajo de CI/CD automatizado.
* **Configuración como Código**: Gestiona la configuración de la aplicación (App Settings) y la infraestructura (App Service Plan) usando Infraestructura como Código (Bicep/ARM Templates).
* **Managed Identities para Seguridad**: Siempre prefiere las identidades gestionadas para que tu App Service acceda a otros recursos de Azure.
* **Monitoreo con Application Insights**: Es la mejor manera de obtener visibilidad profunda del rendimiento y los errores de tu aplicación.
* **Escalado Automático**: Configura reglas de escalado automático para manejar la carga de forma eficiente y optimizar los costos.
* **`Always On` para Producción**: Habilita la opción "Always On" en planes Basic o superiores para evitar "cold starts".
* **Backups**: Configura backups automáticos para tu App Service.
* **Kudu para Diagnóstico**: Utiliza la consola de Kudu (`https://<app-name>.scm.azurewebsites.net/`) para acceder a los archivos, logs, y ejecutar comandos de diagnóstico.
* **Desacopla la Base de Datos**: Aloja tu base de datos en un servicio dedicado (Azure SQL Database, Azure Database for MySQL/PostgreSQL) en lugar de en la misma VM.

---

Este cheatsheet te proporciona una referencia completa de Azure App Service, cubriendo sus conceptos esenciales, planes de hospedaje, estrategias de despliegue, configuración, seguridad, monitoreo y las mejores prácticas para alojar tus aplicaciones web y APIs de forma eficiente y escalable en Microsoft Azure.
