
---

# 🆔 Azure Active Directory (Microsoft Entra ID) Cheatsheet Completo 🆔

**Azure Active Directory (Azure AD)**, ahora conocido como **Microsoft Entra ID**, es el servicio de gestión de identidad y acceso (IAM) multitenant basado en la nube de Microsoft. Es la columna vertebral de la autenticación y autorización para Azure, Microsoft 365, Dynamics 365 y miles de aplicaciones SaaS de terceros.

---

## 1. 🌟 Conceptos Clave

* **Identidad**: Un objeto que puede ser autenticado (ej. un usuario, una aplicación).
* **Autenticación**: El proceso de verificar la identidad de un usuario o aplicación (¿Quién eres?).
* **Autorización**: El proceso de conceder a una identidad autenticada permiso para acceder a un recurso (¿Qué puedes hacer?).
* **Tenant (Inquilino)**: Una instancia dedicada y aislada de Azure AD, que representa a una organización.
* **Usuario (User)**: Una identidad que representa a una persona. Puede ser un `Member` (de la organización) o un `Guest` (invitado de otra organización).
* **Grupo (Group)**: Una colección de usuarios. Útil para asignar permisos de forma masiva.
* **Aplicación (Application)**: Una aplicación (SaaS, web, móvil) que está registrada en Azure AD para delegar la autenticación y/o autorización.
* **Service Principal (Entidad de Servicio)**: Una instancia de una aplicación en un tenant. Es la identidad de la aplicación que se utiliza para asignar permisos y roles.
* **Managed Identity (Identidad Gestionada)**: Una identidad en Azure AD que está gestionada por Azure. Permite a los recursos de Azure (VMs, App Services, Functions) autenticarse de forma segura con otros servicios de Azure sin necesidad de almacenar credenciales en el código.
* **RBAC (Role-Based Access Control)**: Control de acceso basado en roles. Asigna roles a identidades para controlar el acceso a los recursos de Azure.

---

## 2. 🛠️ Tipos de Identidades

### 2.1. Usuarios (Users)

* **`Member`**: Usuarios que pertenecen a tu organización.
* **`Guest`**: Usuarios de otras organizaciones a los que invitas a colaborar (B2B).

### 2.2. Grupos (Groups)

* **`Security`**: Para gestionar el acceso a recursos.
* **`Microsoft 365`**: Para colaboración (SharePoint, Teams, etc.).

### 2.3. Identidades de Carga de Trabajo (Workload Identities)

* **`Application`**: El objeto global de una aplicación.
* **`Service Principal`**: La instancia local de una aplicación en tu tenant.
* **`Managed Identity`**: Identidades para recursos de Azure.

---

## 3. 🚀 Autenticación

### 3.1. Métodos de Autenticación

* **Password Hash Synchronization (PHS)**: (Más común y simple) Sincroniza los hashes de las contraseñas de tu AD local a Azure AD.
* **Pass-through Authentication (PTA)**: Autentica a los usuarios directamente contra tu AD local.
* **Federation (AD FS)**: Delega la autenticación a un servidor de federación local (AD FS).

### 3.2. Multi-Factor Authentication (MFA)

* Añade una segunda capa de seguridad a los inicios de sesión.
* **Métodos**: Microsoft Authenticator app, SMS, llamada de voz, FIDO2.
* Se puede aplicar a todos los usuarios o condicionalmente (ver Conditional Access).

### 3.3. Conditional Access (Acceso Condicional)

* (Requiere Azure AD Premium P1)
* Políticas de "if-then" para controlar el acceso.
* **Señales (Conditions)**: Usuario, grupo, ubicación (IP), dispositivo (compliant/hybrid joined), aplicación, riesgo de inicio de sesión.
* **Controles de Acceso (Access Controls)**:
  * **Grant**: `Block access`, `Grant access` con requisitos (`Require MFA`, `Require compliant device`).
  * **Session**: Controles de sesión (ej. `Use Conditional Access App Control`).

---

## 4. 🔗 Integración de Aplicaciones

### 4.1. Registro de Aplicaciones (App Registration)

* Registra una aplicación para que pueda ser autenticada por Azure AD.
* **`Application (client) ID`**: El identificador único de tu aplicación.
* **`Directory (tenant) ID`**: El identificador de tu tenant de Azure AD.
* **`Client Secret` / `Certificate`**: Credenciales para que tu aplicación se autentique.
* **`Redirect URI`**: A dónde Azure AD redirige al usuario después de la autenticación.
* **`API permissions`**: Permisos que tu aplicación necesita para acceder a otras APIs (ej. Microsoft Graph).

### 4.2. Enterprise Applications

* Aplicaciones de la galería de Azure AD (ej. Salesforce, ServiceNow) o aplicaciones personalizadas que los usuarios pueden usar (SSO).

---

## 5. 💡 Buenas Prácticas y Consejos

* **Habilita MFA para Todos los Usuarios**: Especialmente para administradores.
* **Usa Conditional Access**: Para un control de acceso granular y adaptativo.
* **Principio de Mínimo Privilegio (RBAC)**: Asigna los roles menos privilegiados necesarios para realizar una tarea.
* **Usa Managed Identities**: Para que tus recursos de Azure se autentiquen de forma segura.
* **Protege las Credenciales de la Aplicación**: Usa Key Vault para almacenar los secretos de tus aplicaciones.
* **Revisa Regularmente los Permisos**: Audita los permisos y el acceso de los usuarios y las aplicaciones.
* **Usa Grupos para Asignar Permisos**: Es más fácil de gestionar que asignar permisos a usuarios individuales.
* **Implementa Azure AD B2B y B2C**: Para colaboración con externos y para aplicaciones orientadas al consumidor.

---

Este cheatsheet te proporciona una referencia completa de Azure Active Directory (Microsoft Entra ID), cubriendo sus conceptos esenciales, tipos de identidades, métodos de autenticación, integración de aplicaciones y las mejores prácticas para una gestión de identidad y acceso segura y eficiente en el ecosistema de Microsoft.
