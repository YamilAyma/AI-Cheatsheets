
---

# 🔒 AWS IAM (Identity and Access Management) Cheatsheet Completo 🔒

**AWS IAM** es un servicio web que te ayuda a gestionar de forma segura el acceso a tus recursos de AWS. Con IAM, puedes controlar quién está autenticado (ha iniciado sesión) y autorizado (tiene permisos) para usar recursos. Es un servicio global, lo que significa que las configuraciones de IAM se aplican a todas las regiones de AWS.

---

## 1. 🌟 Conceptos Clave

* **Principal (Entidad)**: Una persona o aplicación que puede hacer una solicitud a un recurso de AWS. Incluye Usuarios, Roles y Clientes Web con identidades federadas.
* **Autenticación (Authentication)**: El proceso de verificar la identidad del Principal (¿Quién eres?).
* **Autorización (Authorization)**: El proceso de determinar si un Principal autenticado tiene permiso para realizar una acción en un recurso (¿Qué puedes hacer?).
* **Usuario (User)**: Una identidad en IAM que representa a una persona o una aplicación que interactúa con AWS. Tiene credenciales de inicio de sesión (contraseña para consola, claves de acceso para CLI/SDK).
* **Grupo (Group)**: Una colección de usuarios de IAM. Puedes adjuntar políticas a un grupo, y todos los usuarios del grupo heredarán esos permisos.
* **Rol (Role)**: Una identidad de IAM con permisos específicos que puede ser asumida por una entidad de confianza (usuario, servicio de AWS, aplicación externa). Los roles son temporales y no tienen credenciales de larga duración.
* **Política (Policy)**: Un documento JSON que define permisos. Especifica qué acciones se permiten o deniegan en qué recursos y bajo qué condiciones.
* **Permiso (Permission)**: Una declaración en una política que especifica si una acción es `Allow` o `Deny`.
* **ARN (Amazon Resource Name)**: Un identificador único global para un recurso de AWS.
* **MFA (Multi-Factor Authentication)**: Una capa adicional de seguridad que requiere una segunda forma de verificación además de la contraseña.
* **Principio de Mínimo Privilegio**: Concede solo los permisos necesarios para realizar una tarea específica, y nada más.

---

## 2. 🔠 Componentes de IAM

### 2.1. Users (Usuarios)

* **Crear Usuario**: Define un nombre de usuario.
* **Access Type**:
  * **Programmatic Access**: Genera un `Access Key ID` y un `Secret Access Key` (para AWS CLI, SDKs, APIs).
  * **AWS Management Console access**: Permite iniciar sesión en la consola con una contraseña.
* **Contraseña**: Generada automáticamente o personalizada.
* **MFA**: Configura MFA para usuarios con acceso a la consola, especialmente para la cuenta root y usuarios administradores.
* **Adjuntar Políticas**: Directamente, a través de grupos o roles.

### 2.2. Groups (Grupos)

* **Crear Grupo**: Define un nombre.
* **Adjuntar Políticas**: Adjunta una o más políticas de IAM al grupo.
* **Añadir Usuarios**: Añade usuarios al grupo. Los usuarios heredan todos los permisos de las políticas adjuntas al grupo.
* **Beneficio**: Simplifica la gestión de permisos para múltiples usuarios con roles similares.

### 2.3. Roles (Roles) - ¡Recomendado para servicios!

* **Crear Rol**:
  1. **Select trusted entity**: Elige quién puede asumir este rol (ej. `AWS service` (EC2, Lambda, S3), `Another AWS account`, `Web identity`).
  2. **Attach permissions policies**: Adjunta las políticas de IAM que definen los permisos del rol.
  3. **Name, Description**.
* **Beneficio**:
  * **Seguridad**: Proporciona credenciales temporales, eliminando la necesidad de almacenar claves de acceso de larga duración en el código o en las instancias.
  * **Delegación Segura**: Permite que los servicios o usuarios de otras cuentas accedan a tus recursos de forma segura.
* **Uso con EC2**: Una instancia EC2 puede asumir un rol para interactuar con otros servicios de AWS.
* **Uso con Lambda**: Una función Lambda asume un rol para acceder a los recursos que necesita (ej. CloudWatch Logs, DynamoDB).

### 2.4. Policies (Políticas)

* Documentos JSON que definen permisos.
* **Tipos**:
  * **AWS Managed Policies**: Políticas predefinidas por AWS (ej. `AmazonS3FullAccess`, `AWSLambdaBasicExecutionRole`). Útiles para empezar.
  * **Customer Managed Policies**: Políticas que creas y gestionas tú mismo. Permite un control granular.
  * **Inline Policies**: Políticas incrustadas directamente en un usuario, grupo o rol (menos reutilizables).
* **Estructura de una Política JSON**:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",        // o "Deny"
        "Action": [               // Una lista de acciones permitidas/denegadas
          "s3:GetObject",
          "s3:PutObject"
        ],
        "Resource": [             // Los ARN de los recursos afectados
          "arn:aws:s3:::my-bucket-name/*"
        ],
        "Condition": {            // (Opcional) Condiciones bajo las cuales se aplica la política
          "IpAddress": { "aws:SourceIp": "203.0.113.0/24" }
        }
      },
      {
        "Effect": "Deny",
        "Action": [
          "s3:DeleteObject"
        ],
        "Resource": [
          "arn:aws:s3:::my-bucket-name/*"
        ]
      }
    ]
  }
  ```    *   **`Effect`**: `Allow` o `Deny`. `Deny` siempre tiene prioridad sobre `Allow`.
  *   **`Action`**: El servicio y la acción (ej. `s3:GetObject`, `ec2:RunInstances`). `*` para todas las acciones.
  *   **`Resource`**: El ARN del recurso. `*` para todos los recursos.
  *   **`Condition`**: Restricciones adicionales (ej. fecha, hora, IP de origen, etiqueta de recurso).

  ```

### 2.5. Claves de Acceso (Access Keys)

* Se componen de un `Access Key ID` (ej. `AKIAIOSFODNN7EXAMPLE`) y un `Secret Access Key` (secreto).
* Se utilizan para autenticar solicitudes programáticas a AWS (CLI, SDKs, APIs).
* **¡No las compartas! ¡No las hardcodees en tu código! ¡Rota las regularmente!**
* **Alternativa Recomendada**: Usa Roles de IAM para servicios.

---

## 3. 🔒 Seguridad en IAM (¡CRÍTICO!)

* **Cuenta Root**: La cuenta root es la cuenta de usuario más potente.
  * **¡Bloquea la cuenta root!** No la uses para tareas diarias.
  * Configura MFA en la cuenta root.
  * Guarda las credenciales de root de forma segura.
* **Principio de Mínimo Privilegio**: Otorga solo los permisos necesarios para realizar una tarea específica. Nunca `*` para acciones o recursos a menos que sea absolutamente necesario y bien justificado.
* **MFA (Multi-Factor Authentication)**: Habilita MFA para todos los usuarios de IAM, especialmente para los administradores.
* **AWS Access Analyzer**: Ayuda a identificar recursos compartidos externamente.
* **AWS Organizations**: Para gestionar múltiples cuentas de AWS y aplicar políticas de servicio (SCP) para un control centralizado de permisos.
* **IAM Access Advisor**: Muestra los permisos que se han utilizado para un usuario/rol y cuándo.
* **IAM Credentials Report**: Lista todos los usuarios de la cuenta y el estado de sus credenciales.
* **IAM Policy Simulator**: Para probar y depurar políticas de IAM.

---

## 4. 🧰 Características Adicionales

* **Identidades Federadas (Federated Identities)**: Permite que usuarios existentes en sistemas de identidad externos (ej. Microsoft Active Directory, Okta, Google, Facebook) accedan a recursos de AWS sin crear usuarios de IAM.
  * **AWS SSO (Single Sign-On)**: Servicio gestionado para SSO.
  * **Amazon Cognito**: Para autenticación y autorización de usuarios en aplicaciones web y móviles.
* **Alias de Cuenta**: Puedes personalizar la URL de inicio de sesión de la consola de AWS (ej. `https://my-company.signin.aws.amazon.com/console`).

---

## 5. 💡 Buenas Prácticas y Consejos

* **¡Bloquea la Cuenta Root!**: Usa la cuenta root solo para tareas de gestión de cuentas (cambiar el plan de soporte, cerrar la cuenta). Crea usuarios de IAM específicos para tareas administrativas.
* **Principio de Mínimo Privilegio**: Es la regla de oro de IAM. Concede solo los permisos necesarios, y restringe por `Action`, `Resource` y `Condition`.
* **MFA en Todas Partes**: Habilita MFA para el usuario root y todos los usuarios de IAM con acceso a la consola.
* **Usa Roles de IAM, NO Claves de Acceso**:
  * Para servicios de AWS (EC2, Lambda, ECS, etc.), siempre adjunta un **Rol de IAM** a ese servicio.
  * Evita las claves de acceso de IAM en entornos de producción.
* **Utiliza Grupos de IAM**: Facilita la gestión de permisos para usuarios con roles similares.
* **Rotación Regular de Claves de Acceso**: Si utilizas claves de acceso de IAM (para usuarios programáticos), rotalas regularmente y elimínalas si no se utilizan.
* **Monitorea Actividad de IAM (CloudTrail)**: CloudTrail registra todas las llamadas a la API de AWS, incluyendo las acciones de IAM. Monitoriza estos logs en busca de actividad sospechosa.
* **Utiliza Políticas Gestionadas por el Cliente**: Te dan un control más granular que las políticas gestionadas por AWS.
* **Valida Políticas con el Simulador**: Usa el IAM Policy Simulator para probar cómo tus políticas afectan los permisos.
* **Auditoría con Access Analyzer**: Revisa periódicamente los hallazgos de Access Analyzer para identificar accesos no deseados.
* **Control de Acceso a Contenedores/Servicios**: Para microservicios, usa `Service Account Roles` en EKS/ECS para un control de acceso granular de los Pods/Tareas.

---

Este cheatsheet te proporciona una referencia completa de AWS IAM, cubriendo sus conceptos esenciales, cómo gestionar usuarios, grupos, roles y políticas, aspectos críticos de seguridad y las mejores prácticas para controlar el acceso a tus recursos de AWS de forma segura y eficiente.
