
---

# ☁️ AWS (Amazon Web Services) Cheatsheet Completo ☁️

**AWS (Amazon Web Services)** es una plataforma de servicios en la nube segura que ofrece potencia informática, almacenamiento de bases de datos, entrega de contenido y otras funcionalidades para ayudar a las empresas a escalar y crecer. Ofrece una amplia gama de servicios que se pueden usar para construir casi cualquier tipo de aplicación en la nube.

---

## 1. 🌟 Conceptos Clave de AWS

* **Computación en la Nube (Cloud Computing)**: Entrega bajo demanda de potencia informática, almacenamiento de bases de datos, aplicaciones y otros recursos de TI a través de una plataforma de servicios en la nube a través de Internet con precios de pago por uso.
* **Región (Region)**: Una ubicación geográfica física donde AWS tiene sus centros de datos (ej. `us-east-1` en Norteamérica, `eu-west-1` en Irlanda).
* **Zona de Disponibilidad (Availability Zone - AZ)**: Uno o más centros de datos discretos con energía, redes y conectividad redundantes dentro de una Región. Las AZs están lo suficientemente separadas para prevenir que un fallo afecte a múltiples AZs, pero lo suficientemente cerca para conexiones de baja latencia.
* **Edge Location (Ubicación de Borde)**: Centros de datos usados por servicios como CloudFront (CDN) para entregar contenido a usuarios finales con baja latencia.
* **IAM (Identity and Access Management)**: Servicio para gestionar el acceso a los recursos de AWS de forma segura.
* **Virtual Private Cloud (VPC)**: Una red virtual aislada lógicamente en la nube de AWS.
* **Pago por Uso (Pay-as-you-go)**: Solo pagas por los servicios que usas, sin contratos a largo plazo ni pagos iniciales.
* **Alta Disponibilidad (High Availability - HA)**: Diseñar sistemas para que estén operativos el mayor tiempo posible, incluso frente a fallos.
* **Escalabilidad (Scalability)**: Capacidad de un sistema para manejar una carga creciente.
  * **Horizontal**: Añadir más instancias.
  * **Vertical**: Aumentar el tamaño de las instancias.

---

## 2. 🔠 Servicios Principales (Categorías y Ejemplos)

### 2.1. Computación (Compute)

* **EC2 (Elastic Compute Cloud)**: Servidores virtuales (máquinas virtuales) en la nube.
  * **Instances**: Máquinas virtuales configurables (tipo de instancia, AMI, almacenamiento, red).
  * **AMIs (Amazon Machine Images)**: Plantillas para lanzar instancias.
  * **Security Groups**: Firewall a nivel de instancia.
  * **Elastic IPs**: Direcciones IP públicas estáticas.
  * **Auto Scaling Groups (ASG)**: Escala automáticamente la cantidad de instancias.
* **AWS Lambda**: Computación sin servidor (Serverless). Ejecuta código en respuesta a eventos sin provisionar ni gestionar servidores.
* **ECS (Elastic Container Service)**: Servicio de orquestación de contenedores Docker.
* **EKS (Elastic Kubernetes Service)**: Servicio gestionado de Kubernetes.
* **Fargate**: Motor de computación sin servidor para ECS y EKS (no gestionas los servidores subyacentes).
* **Lightsail**: Servicios de computación sencillos (VPS, bases de datos, contenedores) para casos de uso básicos.

### 2.2. Almacenamiento (Storage)

* **S3 (Simple Storage Service)**: Almacenamiento de objetos escalable, duradero y de alta disponibilidad.
  * **Buckets**: Contenedores para almacenar objetos.
  * **Objects**: Archivos individuales (hasta 5 TB).
  * **Storage Classes**: Diferentes niveles de almacenamiento (Standard, IA, Glacier, etc.).
* **EBS (Elastic Block Store)**: Almacenamiento de bloques persistente para instancias EC2 (discos duros virtuales).
* **EFS (Elastic File System)**: Almacenamiento de archivos escalable y elástico para EC2 (NFS gestionado).
* **Glacier**: Almacenamiento de archivos a largo plazo y bajo costo (archivado).
* **Storage Gateway**: Conecta almacenamiento local con almacenamiento en la nube de AWS.

### 2.3. Bases de Datos (Databases)

* **RDS (Relational Database Service)**: Bases de datos relacionales gestionadas (MySQL, PostgreSQL, SQL Server, Oracle, MariaDB, Amazon Aurora).
* **DynamoDB**: Base de datos NoSQL de clave-valor y documentos, completamente gestionada y sin servidor.
* **Aurora**: Base de datos relacional compatible con MySQL y PostgreSQL, de alto rendimiento y escalabilidad.
* **ElastiCache**: Servicio de caché en memoria (Redis, Memcached).
* **Redshift**: Almacén de datos (Data Warehouse) a escala de petabytes.

### 2.4. Redes y Entrega de Contenido (Networking & Content Delivery)

* **VPC (Virtual Private Cloud)**: Red virtual aislada en la nube de AWS.
  * **Subnets**: Segmentos de IP dentro de una VPC (públicas y privadas).
  * **Route Tables**: Reglas de enrutamiento del tráfico de la subred.
  * **Internet Gateway**: Permite la comunicación entre la VPC y el internet.
  * **NAT Gateway**: Permite que las instancias en subredes privadas accedan a internet.
  * **Security Groups**: Firewall a nivel de instancia.
  * **Network ACLs (NACLs)**: Firewall a nivel de subred (sin estado).
* **Route 53**: Servicio DNS (Domain Name System) escalable.
* **CloudFront**: Red de entrega de contenido (CDN) para baja latencia.
* **ELB (Elastic Load Balancing)**: Distribuye el tráfico entrante a múltiples instancias (Application Load Balancer - ALB, Network Load Balancer - NLB, Classic Load Balancer - CLB).
* **Direct Connect**: Conexión de red dedicada desde tu centro de datos a AWS.

### 2.5. Seguridad, Identidad y Cumplimiento (Security, Identity & Compliance)

* **IAM (Identity and Access Management)**:
  * **Users**: Cuentas de usuario individuales.
  * **Groups**: Colecciones de usuarios.
  * **Roles**: Define un conjunto de permisos temporales para entidades (ej. EC2 instances, Lambda functions).
  * **Policies**: Documentos JSON que definen los permisos (Allow/Deny) para acceder a los recursos.
* **KMS (Key Management Service)**: Gestiona claves de cifrado.
* **Secrets Manager**: Almacena y gestiona secretos de forma segura.
* **AWS WAF (Web Application Firewall)**: Protege las aplicaciones web de ataques.
* **AWS Shield**: Protección contra ataques DDoS.
* **Cognito**: Autenticación, autorización y gestión de usuarios para aplicaciones web y móviles.

### 2.6. Herramientas de Gestión (Management Tools)

* **CloudWatch**: Servicio de monitoreo para recursos y aplicaciones de AWS (logs, métricas, alarmas).
* **CloudTrail**: Registra eventos de API de AWS (quién hizo qué, cuándo, dónde). Para auditoría.
* **AWS Config**: Registra la configuración de los recursos de AWS y los cambios.
* **Systems Manager**: Gestión de la infraestructura de AWS (parches, automatización).

### 2.7. Herramientas de Desarrollo (Developer Tools)

* **CloudFormation**: Infraestructura como código (IaC) para provisionar recursos de AWS.
* **CodeCommit**: Servicio de control de versiones Git gestionado.
* **CodeBuild**: Servicio de integración continua (CI).
* **CodeDeploy**: Servicio de despliegue continuo (CD).
* **CodePipeline**: Automatiza los pasos de CI/CD.

---

## 3. 🛠️ Acceso y Gestión de AWS

### 3.1. AWS Management Console (UI)

* Interfaz web para interactuar con los servicios de AWS.

### 3.2. AWS CLI (Command Line Interface)

* Herramienta de línea de comandos para interactuar con AWS.
  1. **Instalar**: `pip install awscli` (para Python).
  2. **Configurar**: `aws configure` (introduce `Access Key ID`, `Secret Access Key`, `Region`, `Output Format`).
  3. **Ejemplos**:
     ```bash
     aws ec2 describe-instances
     aws s3 ls
     aws s3 cp my_file.txt s3://my-bucket/
     ```

### 3.3. AWS SDKs (Software Development Kits)

* Bibliotecas para programar con AWS en varios lenguajes (Python Boto3, Java SDK, Node.js SDK, .NET SDK).
  ```python
  # Python (Boto3)
  import boto3

  s3 = boto3.client('s3')
  response = s3.list_buckets()
  for bucket in response['Buckets']:
      print(f"  {bucket['Name']}")
  ```

### 3.4. CloudFormation / Terraform (IaC - Infraestructura como Código)

* Define tus recursos de AWS en plantillas (YAML o JSON para CloudFormation; HCL para Terraform).
* Permite provisionar y gestionar recursos de forma consistente y reproducible.

---

## 4. 🔒 Seguridad en AWS (IAM - ¡CRÍTICO!)

* **Users**: Para personas (acceso de consola o programático).
* **Groups**: Agrupa usuarios con el mismo conjunto de permisos.
* **Roles**: Para servicios o usuarios temporales. Delega permisos (ej. una instancia EC2 puede asumir un rol para acceder a S3). **¡Preferido para servicios!**
* **Policies**: Documentos JSON que definen los permisos.
  * **Identity-based Policies**: Adjuntas a un usuario, grupo o rol.
  * **Resource-based Policies**: Adjuntas a un recurso (ej. S3 bucket policy, KMS key policy).
* **Principio de Mínimo Privilegio**: Otorga solo los permisos necesarios para realizar una tarea específica.
* **MFA (Multi-Factor Authentication)**: Habilítalo para usuarios root y usuarios de IAM críticos.
* **AWS CLI/SDK Credentials**: Usa `aws configure` y no hardcodees las claves de acceso en tu código. Utiliza Roles de IAM para instancias EC2 o funciones Lambda.

---

## 5. 💰 Gestión de Costos

* **Pago por Uso**: Paga solo por lo que consumes.
* **Free Tier (Capa Gratuita)**: Muchos servicios tienen un nivel gratuito por un tiempo o con límites de uso.
* **Budgets**: Configura presupuestos en la consola para monitorear y recibir alertas sobre el gasto.
* **Cost Explorer**: Analiza y visualiza tus costos.
* **Reserved Instances / Savings Plans**: Para cargas de trabajo predecibles y a largo plazo, puedes ahorrar dinero.

---

## 6. 💡 Buenas Prácticas y Consejos

* **Seguridad es lo Primero**: Es el pilar en la nube. Configura IAM correctamente, usa MFA, y el principio de mínimo privilegio.
* **Infraestructura como Código (IaC)**: Usa CloudFormation o Terraform para definir y gestionar tu infraestructura.
* **Monitorea Todo (CloudWatch)**: Configura alarmas para detectar anomalías y monitorea el rendimiento de tus recursos.
* **Alta Disponibilidad y Tolerancia a Fallos**: Diseña tus aplicaciones para ser redundantes a través de múltiples AZs y regiones.
* **Escalabilidad y Elasticidad**: Aprovecha Auto Scaling Groups y servicios sin servidor (Lambda) para escalar automáticamente.
* **Costos**: Revisa regularmente tus costos, optimiza recursos y considera opciones de ahorro.
* **Etiquetado (Tagging)**: Etiqueta tus recursos con metadatos útiles (ej. `Project`, `Environment`, `Owner`) para organización, gestión de costos y seguridad.
* **Desacoplamiento**: Diseña tus arquitecturas usando colas de mensajes (SQS) o streams de eventos (Kinesis) para desacoplar los componentes.
* **Principio de los 6 Pilares (AWS Well-Architected Framework)**:
  1. **Excelencia Operacional**: Gestión y monitoreo.
  2. **Seguridad**: Protección de datos, sistemas y activos.
  3. **Fiabilidad**: Recuperación de fallos, escalado horizontal.
  4. **Rendimiento y Eficiencia**: Uso eficiente de recursos.
  5. **Optimización de Costos**: Minimizar gastos innecesarios.
  6. **Sostenibilidad**: Impacto ambiental de las cargas de trabajo.
* **Comienza Pequeño**: Empieza con servicios básicos y escala a medida que aprendes.

---

Este cheatsheet te proporciona una referencia completa de AWS, cubriendo sus conceptos esenciales, una amplia gama de servicios por categoría, herramientas de acceso, seguridad, gestión de costos y las mejores prácticas para construir y gestionar aplicaciones en la nube.
