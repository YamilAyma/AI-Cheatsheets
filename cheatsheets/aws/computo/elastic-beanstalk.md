
# 🚀 AWS Elastic Beanstalk Cheatsheet Completo 🚀

**AWS Elastic Beanstalk** es un servicio fácil de usar para desplegar y escalar aplicaciones y servicios web desarrollados con Java, .NET, PHP, Node.js, Python, Ruby, Go y Docker en servidores familiares como Apache, Nginx, Passenger e IIS. Te permite cargar tu código y Elastic Beanstalk se encarga automáticamente del despliegue, el balanceo de carga, el escalado automático y el monitoreo de la salud de tu aplicación.

---

## 1. 🌟 Conceptos Clave

* **Plataforma como Servicio (PaaS)**: Elastic Beanstalk es un PaaS. Abstrae la infraestructura subyacente, permitiéndote concentrarte en el código de tu aplicación.
* **Aplicación (Application)**: Una colección lógica de versiones de tu aplicación, entornos y configuraciones de entorno.
* **Versión de la Aplicación (Application Version)**: Una iteración específica de tu código ejecutable (ej. un archivo WAR, ZIP, o un Dockerfile).
* **Entorno (Environment)**: Una instancia específica de una versión de la aplicación que se ejecuta en recursos de AWS (ej. servidor web, balanceador de carga, base de datos).
  * **Environment Type**:
    * **Web Server Environment**: Para aplicaciones web HTTP/HTTPS.
    * **Worker Environment**: Para aplicaciones que procesan tareas en segundo plano (ej. de una cola SQS).
* **Plataforma (Platform)**: La combinación de un sistema operativo, un tiempo de ejecución (ej. Node.js 18, Java 17), un servidor web (ej. Apache, Nginx) y componentes de Elastic Beanstalk que ejecutan tu aplicación.
* **Configuración de Entorno**: Define cómo se aprovisionan los recursos de AWS para tu entorno (ej. tipo de instancia EC2, tamaño de disco, política de Auto Scaling, variables de entorno).
* **Balanceador de Carga (Load Balancer)**: Por defecto, Elastic Beanstalk provisiona un Application Load Balancer (ALB) para distribuir el tráfico.
* **Auto Scaling Group (ASG)**: Escala automáticamente la cantidad de instancias EC2 para manejar la carga.
* **Monitoreo y Salud**: Elastic Beanstalk monitorea la salud de tu aplicación y de la infraestructura.

---

## 2. 🛠️ Creación y Despliegue de una Aplicación

### 2.1. Métodos de Despliegue

1. **AWS Management Console (UI)**: La forma más sencilla de empezar.
2. **AWS CLI (Command Line Interface)**: Para automatización y scripts.
3. **EB CLI (Elastic Beanstalk CLI)**: Una CLI específica de Elastic Beanstalk, muy útil para el desarrollo local y el despliegue.
4. **AWS SDKs**: Para integración programática.
5. **AWS CloudFormation**: Infraestructura como código (IaC).

### 2.2. Proceso Básico con EB CLI

1. **Instalar EB CLI**: `pip install awsebcli`
2. **Inicializar Proyecto Localmente (en el directorio raíz de tu app)**:
   ```bash
   eb init
   # Te preguntará:
   #   Region (ej. us-east-1)
   #   Application Name
   #   Platform (ej. Node.js, Java, Python)
   #   CodeCommit (si quieres integrarlo)
   ```
3. **Crear un Entorno**:
   ```bash
   eb create my-dev-environment
   # Te preguntará:
   #   Environment Name
   #   CNAME prefix (ej. myapp-dev.us-east-1.elasticbeanstalk.com)
   #   Load Balancer Type (ALB, NLB, Classic)
   # Esto aprovisionará los recursos de AWS (EC2, ELB, ASG, Security Groups, S3 bucket)
   ```
4. **Desplegar tu Código**:
   ```bash
   eb deploy
   # Empaqueta tu código y lo despliega a tu entorno actual
   ```
5. **Ver el Estado del Entorno**:
   ```bash
   eb status
   eb health
   ```
6. **Ver los Logs**:
   ```bash
   eb logs
   ```
7. **Abrir la Aplicación en el Navegador**:
   ```bash
   eb open
   ```
8. **Terminar el Entorno**:
   ```bash
   eb terminate my-dev-environment
   # Eliminará todos los recursos de AWS asociados
   ```

---

## 3. ⚙️ Archivos de Configuración (`.ebextensions`)

Elastic Beanstalk te permite personalizar el entorno mediante archivos `.ebextensions` (YAML o JSON) en el directorio `.ebextensions/` en la raíz de tu código fuente.

* **Ejemplos de Uso**:
  * **Variables de Entorno**:
    ```yaml
    # .ebextensions/env_vars.config
    option_settings:
      aws:elasticbeanstalk:application:environment:
        DATABASE_URL: "jdbc:postgresql://..."
        API_KEY: "your_api_key_value"
        SPRING_PROFILES_ACTIVE: "prod"
    ```
  * **Comandos de Script de Despliegue (ej. Migraciones de DB)**:
    ```yaml
    # .ebextensions/01_migrate_db.config
    container_commands:
      01_migrate:
        command: "python manage.py migrate" # Para aplicaciones Python/Django
        # command: "./gradlew clean flywayMigrate" # Para Java/Spring Boot con Flyway
        leader_only: true # Ejecutar solo en una instancia (el líder)
    ```
  * **Instalar Paquetes Adicionales**:
    ```yaml
    # .ebextensions/02_install_packages.config
    packages:
      yum: # Para Amazon Linux
        postgresql-devel: []
        git: []
      # apt: # Para Ubuntu
      #   nginx: []
    ```
  * **Configurar Archivos (`files`)**:
    ```yaml
    # .ebextensions/03_custom_nginx.config
    files:
      "/etc/nginx/conf.d/elasticbeanstalk/my_custom_proxy.conf": # Ruta en la instancia EC2
        mode: "000644"
        owner: root
        group: root
        content: |
          client_max_body_size 50M; # Aumentar límite de tamaño de archivo
          proxy_read_timeout 300;
    ```
  * **Configurar Proxies (`.platform/nginx/conf.d/`)**: Para configuraciones más específicas de Nginx/Apache en las plataformas `Managed Platform`.

---

## 4. 📈 Escalado y Balanceo de Carga

### 4.1. Auto Scaling Group (ASG)

* Elastic Beanstalk configura un ASG para escalar automáticamente tu aplicación.
* **Configuración**: Puedes ajustar las reglas de escalado en la consola EB o mediante `.ebextensions`.
  * `aws:autoscaling:asg: `
    * `MinSize`: Número mínimo de instancias.
    * `MaxSize`: Número máximo de instancias.
  * `aws:autoscaling:trigger: `
    * `MeasureName`: Métrica de CloudWatch (ej. `CPUUtilization`).
    * `Unit`: `Percent`.
    * `UpperThreshold`: Umbral para escalar OUT.
    * `LowerThreshold`: Umbral para escalar IN.

### 4.2. Balanceador de Carga (Load Balancer)

* Por defecto, se usa un Application Load Balancer (ALB).
* Maneja la distribución del tráfico, el balanceo de carga basado en ruta, la terminación SSL/TLS y la redirección HTTP a HTTPS.
* Puedes configurar listeners, certificados SSL (desde ACM - AWS Certificate Manager) y reglas del balanceador de carga.

---

## 5. 📊 Monitoreo y Salud

* **Health Status**: Elastic Beanstalk proporciona un indicador de salud codificado por colores:
  * `Green`: Saludable.
  * `Yellow`: Advertencia (degradado).
  * `Red`: Crítico (instancia no disponible).
  * `Grey`: Desconocido.
* **Enhanced Health Reporting**: Proporciona información más detallada sobre la salud de la aplicación (ej. CPU, memoria, latencia de solicitudes) y de las instancias EC2.
* **CloudWatch Logs**: Los logs de la aplicación y del sistema operativo de las instancias se envían automáticamente a CloudWatch Logs.
* **CloudWatch Metrics**: Métricas del ALB, ASG, EC2 se envían a CloudWatch. Puedes configurar alarmas.

---

## 6. 🔄 Estrategias de Despliegue

Elastic Beanstalk ofrece varias estrategias para actualizar tu aplicación con poco o ningún tiempo de inactividad.

* **All at once (Todo a la vez)**:
  * Despliega la nueva versión en todas las instancias simultáneamente.
  * **Pros**: Rápido.
  * **Contras**: Tiempo de inactividad durante el despliegue, riesgo alto de fallo.
  * **Uso**: Entornos de desarrollo, aplicaciones con baja tolerancia a la inactividad.
* **Rolling (En cascada)**:
  * Despliega la nueva versión en lotes de instancias. Las instancias antiguas se reemplazan por las nuevas.
  * **Pros**: No hay tiempo de inactividad, riesgo reducido.
  * **Contras**: Las versiones antigua y nueva conviven durante un tiempo (posibles problemas de compatibilidad), tiempo de despliegue más largo.
* **Rolling with additional batch (En cascada con lote adicional)**:
  * Despliega en lotes, pero añade un nuevo lote de instancias antes de terminar las antiguas.
  * **Pros**: No hay tiempo de inactividad, capacidad completa durante el despliegue.
  * **Contras**: Más costoso (instancias adicionales).
* **Immutable (Inmutable)**:
  * Despliega la nueva versión en un nuevo ASG. Una vez que las nuevas instancias son saludables, el tráfico se redirige. Las instancias antiguas se terminan.
  * **Pros**: No hay tiempo de inactividad, fácil rollback, alto nivel de confianza.
  * **Contras**: Más lento, más costoso (duplica instancias temporalmente).
  * **Uso**: Producción, ambientes críticos.
* **Blue/Green (Azul/Verde)**:
  * Despliega la nueva versión en un entorno completamente nuevo ("verde"). Cuando está lista, se redirige el tráfico del entorno antiguo ("azul") al nuevo.
  * **Pros**: Cero tiempo de inactividad, cero riesgo de que las versiones convivan, rollback instantáneo al entorno azul.
  * **Contras**: Más complejo de configurar, duplica los recursos (más costoso).
  * **Uso**: Producción, entornos de misión crítica.

---

## 7. 💡 Buenas Prácticas y Consejos

* **Entornos Separados**: Crea entornos separados para desarrollo, staging y producción.
* **`.ebextensions` para Personalización**: Utiliza archivos `.ebextensions` para configurar el entorno, instalar paquetes, establecer variables de entorno y ejecutar scripts.
* **Variables de Entorno para Configuración**: No hardcodees credenciales ni configuraciones específicas del entorno en tu código. Usa variables de entorno en EB.
* **Configuración de Salud Mejorada**: Habilita `Enhanced Health Reporting` para obtener una visibilidad detallada del rendimiento y la salud de tu aplicación.
* **Usa el Balanceador de Carga**: Configura el ALB para terminación SSL/TLS y redirección HTTP a HTTPS.
* **Elije la Estrategia de Despliegue Adecuada**: Para producción, prioriza estrategias sin tiempo de inactividad como `Immutable` o `Blue/Green`.
* **Monitoriza los Logs con CloudWatch**: Configura tus aplicaciones para generar logs estructurados y utiliza CloudWatch Logs para análisis.
* **Roles de IAM**: Asegúrate de que el rol de servicio de Elastic Beanstalk y el rol de instancia de EC2 tengan los permisos mínimos necesarios.
* **Protección de Eliminación de Entorno**: Habilita `Termination Protection` en entornos de producción.
* **Integración con RDS**: Despliega tu base de datos en Amazon RDS (no en la misma instancia de EB) y configúrala para que sea externa a Elastic Beanstalk para facilitar la gestión.
* **EB CLI**: Aprende y utiliza EB CLI para una gestión más eficiente y automatizada de tus aplicaciones.

---

Este cheatsheet te proporciona una referencia completa de AWS Elastic Beanstalk, cubriendo sus conceptos esenciales, cómo crear y desplegar aplicaciones, la personalización con `.ebextensions`, el escalado, monitoreo y las mejores prácticas para ejecutar tus aplicaciones web de forma sencilla y eficiente en AWS.
