
---

# ☁️ Amazon EC2 (Elastic Compute Cloud) Cheatsheet Completo ☁️

**Amazon EC2** proporciona capacidad de computación escalable en la nube de AWS. Te permite obtener y configurar capacidad de computación virtual de forma rápida, eliminando la necesidad de invertir en hardware y ofreciendo una forma rentable de escalar tus recursos informáticos.

---

## 1. 🌟 Conceptos Clave

* **Instancia (Instance)**: Una máquina virtual (VM) en la nube de AWS. Es donde se ejecuta tu sistema operativo y tus aplicaciones.
* **AMI (Amazon Machine Image)**: Una plantilla preconfigurada que contiene la configuración necesaria para lanzar una instancia (sistema operativo, software, datos).
* **Tipo de Instancia (Instance Type)**: Define la capacidad de hardware de una instancia (CPU virtual, memoria, almacenamiento, rendimiento de red).
* **Clave de Par (Key Pair)**: Un conjunto de claves criptográficas que utilizas para acceder de forma segura a tus instancias Linux mediante SSH. Una clave pública en AWS, una clave privada en tu máquina.
* **Security Group (Grupo de Seguridad)**: Un firewall virtual que controla el tráfico de entrada y salida de las instancias a nivel de instancia.
* **Elastic IP Address (EIP)**: Una dirección IP pública estática que puedes asignar a tu cuenta AWS y luego a una instancia EC2. Permanece asociada a tu cuenta incluso si la instancia se detiene o se reemplaza.
* **EBS (Elastic Block Store)**: Almacenamiento de bloques persistente que se puede adjuntar a una instancia EC2 (como un disco duro virtual).
* **Instance Store**: Almacenamiento temporal de bloques a nivel de hardware, físicamente conectado a la instancia host. Los datos se pierden cuando la instancia se detiene o termina.
* **UserData**: Script que se ejecuta la primera vez que se inicia una instancia EC2 (útil para automatización de configuración).
* **Roles de IAM (IAM Roles)**: La forma **recomendada** de otorgar permisos a una instancia EC2 para interactuar con otros servicios de AWS.

---

## 2. 🛠️ Tipos de Instancias (Clases)

* **Propósito General (General Purpose)**: `T` (burstable, para cargas de trabajo de uso medio), `M` (balanceadas).
* **Optimizadas para Computación (Compute Optimized)**: `C` (altas cargas de trabajo CPU-intensivas).
* **Optimizadas para Memoria (Memory Optimized)**: `R`, `X`, `Z` (altas cargas de trabajo de memoria-intensivas, ej. bases de datos).
* **Almacenamiento Optimizado (Storage Optimized)**: `I`, `D`, `H` (altas cargas de trabajo I/O, bases de datos NoSQL, data warehouses).
* **Aceleración de GPU (Accelerated Computing)**: `P`, `G`, `F` (para Machine Learning, gráficos).

---

## 3. 🚀 Modelos de Precios de EC2

* **On-Demand (Bajo Demanda)**:
  * **Uso**: Paga por el tiempo de computación por segundo/hora. Sin compromisos a largo plazo.
  * **Pros**: Máxima flexibilidad, sin pagos iniciales.
  * **Contras**: Más caro.
  * **Ideal para**: Cargas de trabajo impredecibles, desarrollo/pruebas.
* **Reserved Instances (Instancias Reservadas - RIs)**:
  * **Uso**: Compromiso por 1 o 3 años para una instancia EC2 específica.
  * **Pros**: Ahorros significativos (hasta un 72%) en comparación con On-Demand.
  * **Contras**: Compromiso a largo plazo, menos flexibilidad.
  * **Ideal para**: Cargas de trabajo predecibles y de larga duración.
* **Spot Instances (Instancias Spot)**:
  * **Uso**: Instancias EC2 no utilizadas por AWS. Haces una oferta por ellas. AWS puede terminarlas con poca antelación si necesita la capacidad.
  * **Pros**: Ahorros masivos (hasta un 90%).
  * **Contras**: No son confiables para cargas de trabajo críticas e interrumpibles.
  * **Ideal para**: Cargas de trabajo tolerantes a fallos, procesamiento por lotes, tareas de desarrollo/pruebas.
* **Dedicated Hosts / Dedicated Instances**:
  * **Uso**: Instancias EC2 en hardware físico dedicado para tu uso exclusivo.
  * **Pros**: Para cumplimiento normativo estricto y requisitos de licenciamiento de software existentes.
  * **Contras**: Más caro.

---

## 4. 🛠️ Lanzamiento y Conexión a una Instancia EC2

### 4.1. Pasos Básicos para Lanzar (Console / CLI)

1. **Elegir una AMI**: Sistema operativo (Amazon Linux, Ubuntu, Windows Server, etc.).
2. **Elegir un Tipo de Instancia**: `t2.micro` (Free Tier), `m5.large`, etc.
3. **Configurar Detalles de la Instancia**:
   * **Network**: Elegir VPC y Subnet.
   * **Auto-assign Public IP**: Habilitar si la instancia necesita acceso a internet.
   * **IAM Role**: Asignar un rol de IAM para permisos a otros servicios de AWS.
   * **User data**: Script de configuración.
4. **Añadir Almacenamiento**: Volumen EBS (tamaño, tipo, eliminación al terminar).
5. **Configurar Security Group**: Reglas de entrada/salida.
6. **Revisar y Lanzar**: Elegir un **Key Pair** existente o crear uno nuevo.

### 4.2. Conexión a Instancias

* **Linux (SSH)**:
  ```bash
  ssh -i /path/to/your-key.pem ec2-user@<public-ip-or-dns>
  # (ec2-user para Amazon Linux, ubuntu para Ubuntu, centos para CentOS, etc.)
  ```

  * Asegúrate de que tu clave privada (`.pem`) tenga permisos correctos: `chmod 400 /path/to/your-key.pem`.
* **Windows (RDP)**:
  * Obtén la contraseña de administrador descifrándola con tu clave privada.
  * Conéctate usando un cliente RDP (ej. Escritorio Remoto).
* **AWS Systems Manager Session Manager**:
  * Permite conectarse a instancias sin abrir puertos SSH/RDP y sin usar claves SSH.
  * Requiere el agente SSM en la instancia y un rol de IAM adecuado.

---

## 5. 🔒 Seguridad (Security Groups, IAM Roles, NACLs)

### 5.1. Security Groups (Nivel de Instancia)

* Actúa como un firewall virtual que controla el tráfico a nivel de instancia.
* **Estado (Stateful)**: Las reglas de entrada se aplican, y el tráfico de respuesta saliente se permite automáticamente.
* **Reglas de Entrada (Inbound Rules)**:
  * **Type**: Protocolo (SSH, HTTP, HTTPS, Custom TCP, All TCP, etc.).
  * **Port Range**: Puertos específicos.
  * **Source**: IP, CIDR block, o **otro Security Group**. (¡Recomendado usar Security Groups como fuente para la comunicación entre instancias!).
* **Reglas de Salida (Outbound Rules)**: Por defecto, permiten todo el tráfico saliente. Restríngelas si es necesario.

### 5.2. IAM Roles (para Instancias EC2)

* **Método Recomendado para Permisos**: Adjunta un rol de IAM a una instancia EC2 en lugar de usar credenciales codificadas en el código.
* La instancia asume el rol y obtiene permisos temporales para interactuar con otros servicios de AWS (ej. S3, DynamoDB, RDS).
* **Ejemplo**: Un rol que permite a la instancia EC2 escribir en un bucket S3.

### 5.3. Network ACLs (NACLs - Nivel de Subred)

* Firewall a nivel de subred.
* **Sin Estado (Stateless)**: Debes definir reglas de entrada y de salida por separado (ej. si permites entrada en el puerto 80, también debes permitir salida en puertos efímeros).
* Se usan para un control más granular de la red, pero Security Groups son más comunes para las instancias.

---

## 6. 💾 Almacenamiento (EBS, Instance Store, S3)

### 6.1. EBS (Elastic Block Store)

* **Discos Duros Virtuales persistentes**: Se adjuntan a instancias EC2. Los datos persisten incluso si la instancia se detiene o termina (si no se configura la eliminación).
* **Tipos de Volumen**:
  * **`gp2`/`gp3` (General Purpose SSD)**: Balance de rendimiento/costo, bueno para la mayoría de cargas de trabajo.
  * **`io1`/`io2` (Provisioned IOPS SSD)**: Para cargas de trabajo transaccionales intensivas, bases de datos.
  * **`st1` (Throughput Optimized HDD)**: Para cargas de trabajo secuenciales, data warehouses.
  * **`sc1` (Cold HDD)**: Para datos poco accesibles y de bajo costo.
* **Snapshots**: Copias de seguridad puntuales de volúmenes EBS. Se almacenan en S3.
* **Encryption**: Los volúmenes EBS se pueden cifrar en reposo y en tránsito.

### 6.2. Instance Store

* **Almacenamiento Temporal**: Proporciona almacenamiento de bloques a nivel de hardware, físicamente conectado a la instancia.
* **¡Los datos se pierden al detener o terminar la instancia!**
* **Uso**: Cachés temporales, buffers, datos efímeros.

### 6.3. S3 (Simple Storage Service)

* **Almacenamiento de Objetos**: No es un sistema de archivos para el sistema operativo directamente.
* Las instancias EC2 pueden acceder a S3 utilizando los roles de IAM.
* **Uso**: Copias de seguridad, almacenamiento de archivos, servir contenido estático.

---

## 7. 📈 Escalado y Alta Disponibilidad (Auto Scaling Groups, Load Balancers)

### 7.1. Auto Scaling Groups (ASG)

* **Escala automáticamente**: Añade o elimina instancias EC2 basándose en políticas (ej. utilización de CPU, solicitudes por segundo, métricas de SQS).
* **Alta disponibilidad**: Reemplaza automáticamente las instancias EC2 que no son saludables o que han fallado.
* **Launch Template/Configuration**: Define cómo se lanzan las nuevas instancias (AMI, tipo de instancia, Security Group, User Data).

### 7.2. Elastic Load Balancing (ELB)

* **Distribuye el tráfico**: Distribuye las solicitudes entrantes a múltiples instancias EC2.
* **Tipos de Load Balancers**:
  * **Application Load Balancer (ALB)**: Opera en la capa 7 (HTTP/HTTPS). Ideal para aplicaciones web, balanceo de carga basado en ruta/host.
  * **Network Load Balancer (NLB)**: Opera en la capa 4 (TCP/UDP/TLS). Ideal para alto rendimiento, baja latencia, IP estáticas.
  * **Classic Load Balancer (CLB)**: Heredado, no recomendado para nuevos proyectos.
* **Health Checks**: ELB verifica la salud de las instancias registradas y solo envía tráfico a las instancias saludables.

---

## 8. 💡 Buenas Prácticas y Consejos

* **IAM Roles, NO Claves de Acceso**: La forma **más segura y recomendada** de otorgar permisos a tus instancias EC2. Nunca almacenes claves de acceso de IAM directamente en las instancias.
* **Security Groups Mínimos**: Abre solo los puertos estrictamente necesarios. Permite el tráfico solo de las IPs o Security Groups específicos que lo necesitan.
* **AMIs Optimizadas**: Utiliza AMIs optimizadas (ej. Amazon Linux 2, AMIs de Ubuntu) y crea tus propias AMIs personalizadas para un arranque más rápido y consistente.
* **User Data para Automatización**: Automatiza la configuración inicial, la instalación de software y la ejecución de scripts al iniciar una instancia.
* **Volúmenes EBS para Persistencia**: Almacena todos los datos importantes en volúmenes EBS y configura snapshots para copias de seguridad.
* **Auto Scaling Groups para HA y Escalabilidad**: Utiliza ASGs con ELB para asegurar que tu aplicación sea altamente disponible y escale automáticamente para manejar la carga.
* **Monitoreo (CloudWatch)**: Configura CloudWatch para monitorear el uso de CPU, memoria, red y disco de tus instancias, y crea alarmas.
* **Instancias Spot para Cargas de Trabajo Tolerantes a Fallos**: Aprovecha las instancias Spot para cargas de trabajo que pueden interrumpirse (ej. procesamiento por lotes, desarrollo/pruebas) para ahorrar costos.
* **SSH Key Management**: Protege tus claves privadas SSH. No las compartas y rota las claves regularmente.
* **Acceso a la Consola por SSH**: Deshabilita la autenticación con contraseña para SSH y usa solo claves.
* **Redes Privadas**: Coloca tus bases de datos y otros recursos sensibles en subredes privadas.

---

Este cheatsheet te proporciona una referencia completa de Amazon EC2, cubriendo sus conceptos esenciales, tipos de instancias, modelos de precios, cómo lanzar y conectar, seguridad, opciones de almacenamiento, escalado y las mejores prácticas para ejecutar servidores virtuales de forma eficiente y segura en AWS.
