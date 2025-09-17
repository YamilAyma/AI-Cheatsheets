
---

# 🚀 AWS CodePipeline Cheatsheet Completo 🚀

**AWS CodePipeline** es un servicio de entrega continua y completamente gestionado que automatiza tus pipelines de lanzamiento para actualizaciones de software rápidas y fiables. Integra todos los pasos de tu proceso de lanzamiento, desde el commit del código hasta el despliegue en producción.

---

## 1. 🌟 Conceptos Clave

* **Pipeline (Tubería)**: Un flujo de trabajo automatizado que orquesta los pasos para entregar tu código.
* **Stage (Etapa)**: Una fase lógica dentro de un pipeline (ej. Source, Build, Test, Deploy). Un pipeline tiene múltiples etapas, que se ejecutan secuencialmente.
* **Action (Acción)**: Una tarea individual dentro de una etapa (ej. obtener código, compilar, ejecutar pruebas, desplegar). Una etapa puede tener una o más acciones, que pueden ejecutarse en paralelo o en serie.
* **Artifact (Artefacto)**: El resultado de una acción que se pasa a la siguiente acción. Puede ser el código fuente, un archivo compilado, un paquete de despliegue, etc.
* **Source Stage (Etapa de Origen)**: La primera etapa que detecta cambios en tu repositorio de código (ej. CodeCommit, GitHub, S3). Genera el artefacto de entrada.
* **Build Stage (Etapa de Construcción)**: Compila tu código, ejecuta pruebas unitarias y empaqueta el código en un artefacto de salida. Utiliza servicios como AWS CodeBuild.
* **Test Stage (Etapa de Prueba)**: Ejecuta pruebas de integración, pruebas de aceptación o pruebas de rendimiento. Puede usar CodeBuild o servicios de terceros.
* **Deploy Stage (Etapa de Despliegue)**: Despliega tu aplicación a un entorno de destino. Utiliza servicios como AWS CodeDeploy, Elastic Beanstalk, ECS, Lambda, CloudFormation.
* **Manual Approval (Aprobación Manual)**: Una acción opcional que pausa el pipeline y espera la aprobación humana antes de continuar.
* **CodePipeline Webhook**: Permite que sistemas externos (ej. GitHub fuera de AWS) disparen un pipeline de CodePipeline.

---

## 2. 🛠️ Configuración Inicial y Creación de un Pipeline

### 2.1. Métodos de Creación

1. **AWS Management Console (UI)**: La forma más sencilla.
2. **AWS CLI (Command Line Interface)**: Para automatización.
3. **AWS SDKs**: Para integración programática.
4. **AWS CloudFormation**: Infraestructura como código (IaC).

### 2.2. Proceso Básico (Console)

1. **En la Consola de AWS**, ve a CodePipeline.
2. Haz clic en `Create pipeline`.
3. **Paso 1: Choose pipeline settings**:
   * **Pipeline name**: Nombre único.
   * **Service role**: Un rol de IAM que CodePipeline asume para interactuar con otros servicios de AWS. Puedes crear uno nuevo o usar uno existente.
   * **Artifact store**: Un bucket S3 donde se almacenarán los artefactos del pipeline. Puedes usar el por defecto o uno personalizado.
   * **Pipeline type**: V1 (clásico) o V2 (más nuevo, mejor rendimiento, más opciones).
4. **Paso 2: Add source stage**:
   * **Source provider**: Dónde está tu código (ej. AWS CodeCommit, GitHub, Amazon S3, Bitbucket).
   * **Repository, Branch**.
   * **Detection options**: Cómo detecta los cambios (ej. `AWS CodePipeline` para CodeCommit/S3; `GitHub (Webhooks)` o `CodePipeline` para GitHub).
5. **Paso 3: Add build stage**:
   * **Build provider**: Elige un servicio de construcción (ej. `AWS CodeBuild`).
   * **Project name**: Selecciona un proyecto CodeBuild existente o crea uno nuevo.
6. **Paso 4: Add deploy stage**:
   * **Deploy provider**: Elige un servicio de despliegue (ej. `AWS CodeDeploy`, `Amazon S3`, `AWS Elastic Beanstalk`, `Amazon ECS`, `AWS CloudFormation`).
   * **Application name, Deployment group** (si usas CodeDeploy).
   * **Bucket, Path** (si despliegas a S3).
7. **Paso 5: Review**. Haz clic en `Create pipeline`.

---

## 3. ⚙️ Integración con Servicios de AWS

CodePipeline orquesta los servicios, no los reemplaza.

### 3.1. Source Providers (Orígenes)

* **AWS CodeCommit**: Repositorios Git gestionados por AWS. Se integra nativamente.
* **GitHub / GitHub Enterprise**: Repositorios de GitHub. Requiere conexión.
* **Amazon S3**: Un bucket S3. Cuando un nuevo objeto (o nueva versión) se sube, dispara el pipeline.
* **Bitbucket / GitLab**: Otros repositorios Git.
* **Amazon ECR**: Repositorios de imágenes de contenedores.

### 3.2. Build Providers (Construcción)

* **AWS CodeBuild**: El servicio de CI/CD de AWS.
  * Ejecuta comandos definidos en un archivo `buildspec.yml`.
  * Compila código, ejecuta pruebas unitarias, empaqueta artefactos.

### 3.3. Deploy Providers (Despliegue)

* **AWS CodeDeploy**: Automatiza el despliegue a instancias EC2, servidores on-premise, o AWS Lambda.
* **AWS Elastic Beanstalk**: Despliega tu código a entornos EB gestionados.
* **Amazon S3**: Despliega artefactos a un bucket S3 (ej. para sitios web estáticos, assets).
* **Amazon ECS (Elastic Container Service)**: Despliega definiciones de tareas de ECS.
* **AWS CloudFormation**: Despliega pilas (stacks) de CloudFormation.
* **AWS Service Catalog**: Despliega productos.
* **AWS Lambda**: Invoca una función Lambda (para despliegues personalizados).

### 3.4. Test Providers (Pruebas)

* **AWS CodeBuild**: Puede ser usado para ejecutar pruebas de integración o de aceptación.
* **AWS Device Farm**: Para pruebas de aplicaciones móviles.
* **Jenkins / Otros**: Puedes usar una acción de Lambda para integrar con herramientas de prueba de terceros.

---

## 4. 📝 Artefactos (Artifacts)

* **Input Artifacts**: El artefacto de entrada para una acción.
* **Output Artifacts**: El artefacto que produce una acción.
* **`buildspec.yml` (para CodeBuild)**:
  ```yaml
  version: 0.2
  phases:
    build:
      commands:
        - echo Build started on `date`
        - npm install
        - npm run build
  artifacts: # Define qué archivos se incluyen en el artefacto de salida
    files:
      - '**/*' # Todos los archivos del directorio de salida (ej. dist/)
    discard-paths: yes
    base-directory: build # Directorio raíz del artefacto
  ```
* Los artefactos se almacenan en un bucket S3 específico de CodePipeline.

---

## 5. 🧰 Características Adicionales

### 5.1. Aprobaciones Manuales (Manual Approval)

* Una acción que pausa el pipeline y espera a que una persona apruebe o rechace la continuación.
* **Uso**: Para etapas críticas (ej. antes del despliegue en producción).
* Se pueden enviar notificaciones a temas SNS.

### 5.2. Etapas y Acciones en Paralelo/Secuencial

* **Etapas**: Siempre se ejecutan secuencialmente.
* **Acciones**: Dentro de una etapa, las acciones pueden ejecutarse en paralelo o secuencialmente (configurado en la UI).

### 5.3. Pipeline Triggers (Disparadores de Pipeline)

* **Cambios en el Código Fuente**: El disparador más común (CodeCommit, GitHub, S3).
* **CloudWatch Events**: Eventos de AWS que disparan el pipeline.
* **API de CodePipeline**: `StartPipelineExecution` vía CLI/SDK.

### 5.4. Variables del Pipeline

* Puedes pasar variables entre acciones usando el contexto del pipeline (ej. ARN de un recurso recién creado, ID de un build).
* **Variables de acción**: Configura un paso de entrada o salida para capturar variables.

### 5.5. Entradas y Salidas Cruzadas de Acciones

* Una acción puede tener múltiples entradas y producir múltiples salidas.
* Se utiliza para orquestar flujos complejos (ej. dos servicios se construyen en paralelo, luego se combinan para una prueba de integración).

---

## 6. 🔒 Seguridad

* **IAM Service Role**: CodePipeline asume un rol de IAM para interactuar con todos los servicios de AWS que utiliza.
  * **¡Principio de mínimo privilegio!**: Concede solo los permisos necesarios para las acciones específicas del pipeline (ej. `s3:GetObject` para el origen S3, `codebuild:StartBuild` para la acción de construcción).
* **KMS Encryption**: Los artefactos se almacenan en un bucket S3 cifrado con claves KMS.
* **CloudTrail**: Registra todas las acciones de CodePipeline para auditoría.

---

## 7. 📈 Monitoreo y Auditoría

* **Consola de CodePipeline**: Muestra el estado en tiempo real de cada etapa y acción.
* **CloudWatch Events / EventBridge**: CodePipeline emite eventos que puedes usar para crear reglas y ser notificado de cambios de estado del pipeline.
* **CloudWatch Logs**: Los logs de CodeBuild y otras acciones se envían a CloudWatch Logs.
* **CloudTrail**: Registra todas las llamadas API de CodePipeline para auditoría.

---

## 8. 💡 Buenas Prácticas y Consejos

* **Define tu Flujo de CI/CD**: Antes de crear el pipeline, visualiza tu proceso de CI/CD (Source -> Build -> Test -> Deploy).
* **Modulariza tus Pasos**: Utiliza servicios específicos de AWS para cada etapa (CodeCommit para Source, CodeBuild para Build, CodeDeploy para Deploy).
* **Automatiza lo Máximo Posible**: Automatiza todos los pasos que puedas para reducir errores manuales y acelerar el ciclo de lanzamiento.
* **Aprobaciones Manuales para Producción**: Incluye una acción de aprobación manual antes de desplegar en entornos críticos.
* **Monitorea tu Pipeline**: Configura notificaciones y alarmas para fallos del pipeline.
* **Infraestructura como Código (IaC)**: Define tus pipelines de CodePipeline y todos los recursos de AWS que utilizan (CodeBuild projects, CodeDeploy applications, S3 buckets, IAM roles) usando CloudFormation o Terraform para reproducibilidad.
* **Estrategias de Despliegue**: Elige la estrategia de despliegue adecuada (ej. Blue/Green, Canary) utilizando servicios como CodeDeploy para minimizar el tiempo de inactividad y el riesgo.
* **Principio de Mínimo Privilegio**: Otorga al rol de servicio de CodePipeline y a los roles de los servicios integrados solo los permisos necesarios.
* **Artefactos Naming**: Dale nombres claros a tus artefactos de entrada/salida para facilitar su seguimiento.
* **Variables de Entorno**: Utiliza variables de entorno en CodeBuild y CodeDeploy para configurar tu aplicación en función del entorno.

---

Este cheatsheet te proporciona una referencia completa de AWS CodePipeline, cubriendo sus conceptos esenciales, cómo crear y configurar pipelines, las integraciones con otros servicios de AWS, las características adicionales, la seguridad y las mejores prácticas para construir pipelines de integración y entrega continua automatizados y robustos en AWS.
