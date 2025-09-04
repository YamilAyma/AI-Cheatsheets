
---

# 🌐 Amazon Route 53 Cheatsheet Completo 🌐

**Amazon Route 53** es un servicio web de DNS altamente disponible y escalable. Conecta las solicitudes de los usuarios a la infraestructura de AWS (como instancias Amazon EC2, balanceadores de carga ELB, buckets S3) o a recursos externos a AWS. También se utiliza para registrar nombres de dominio.

---

## 1. 🌟 Conceptos Clave

* **DNS (Domain Name System)**: El sistema que traduce nombres de dominio legibles para humanos (ej. `www.example.com`) a direcciones IP legibles para máquinas (ej. `192.0.2.1`).
* **Zona Alojada (Hosted Zone)**: Un contenedor que contiene información sobre cómo deseas enrutar el tráfico para un dominio y sus subdominios (ej. `example.com`).
* **Conjunto de Registros (Record Set / Resource Record)**: Un conjunto de registros DNS para un dominio o subdominio. Cada registro contiene información de enrutamiento (ej. IP, CNAME).
* **Servidores de Nombres (Name Servers - NS)**: Los servidores DNS autoritativos que contienen los registros para tu dominio. Route 53 proporciona 4 servidores de nombres únicos para cada Zona Alojada.
* **TTL (Time To Live)**: El tiempo que los resolvers DNS (y navegadores/clientes) deben almacenar en caché la información de un registro antes de solicitarla de nuevo. Un TTL bajo permite cambios de DNS rápidos.
* **Enrutamiento Basado en Latencia (Latency-based Routing)**: Enruta el tráfico al recurso que proporcionará la latencia más baja al usuario.
* **Enrutamiento Basado en Geo-ubicación (Geolocation Routing)**: Enruta el tráfico según la ubicación geográfica de los usuarios.
* **Enrutamiento de Conmutación por Error (Failover Routing)**: Enruta el tráfico a un recurso secundario si el recurso principal no está saludable.
* **Enrutamiento Ponderado (Weighted Routing)**: Distribuye el tráfico a múltiples recursos en función de los pesos asignados.
* **Verificación de Salud (Health Checks)**: Monitorea la salud de tus recursos y enruta el tráfico solo a los recursos saludables.

---

## 2. 🛠️ Gestión de Dominios

### 2.1. Registro de Dominios

* Puedes registrar nuevos nombres de dominio directamente a través de Route 53.
* Route 53 se convierte automáticamente en el servicio DNS para ese dominio.

### 2.2. Transferir Dominios

* Puedes transferir dominios existentes de otros registradores a Route 53.

---

## 3. 📝 Zonas Alojadas (Hosted Zones)

* Un contenedor para los registros DNS de un dominio.

### 3.1. Crear una Zona Alojada

1. En la consola de Route 53, ve a `Hosted zones`.
2. Haz clic en `Create hosted zone`.
3. Introduce el `Domain name` (ej. `example.com`).
4. Selecciona `Public hosted zone` (para internet) o `Private hosted zone` (para VPCs).
5. Haz clic en `Create hosted zone`.
6. Route 53 creará automáticamente dos registros para ti:
   * **NS (Name Server)**: Cuatro servidores de nombres de Route 53.
   * **SOA (Start of Authority)**: Información de autoridad sobre la zona.
7. **Actualizar Servidores de Nombres**: Si tu dominio está registrado con otro registrador, debes actualizar los servidores de nombres en ese registrador para que apunten a los servidores NS de Route 53.

---

## 4. 🗃️ Conjuntos de Registros (Record Sets)

Cada registro DNS dentro de una Zona Alojada.

### 4.1. Tipos de Registros Comunes

* **A (Address)**: Mapea un nombre de dominio a una dirección IPv4 (ej. `www.example.com` a `199.30.20.10`).
* **AAAA (IPv6 Address)**: Mapea un nombre de dominio a una dirección IPv6.
* **CNAME (Canonical Name)**: Mapea un nombre de dominio (subdominio) a otro nombre de dominio.
  * **¡No se puede usar CNAME para la raíz del dominio (ej. `example.com`) si tiene otros registros!** Usa un registro `A` o `Alias` en su lugar.
* **MX (Mail Exchanger)**: Especifica los servidores de correo responsables de recibir el correo electrónico para un dominio. Incluye una prioridad.
* **TXT (Text)**: Contiene texto arbitrario (ej. para verificación de dominio, registros SPF/DKIM para email).
* **NS (Name Server)**: Delega un subdominio a otro servidor DNS.
* **PTR (Pointer)**: Mapea una dirección IP a un nombre de dominio (para DNS inverso).

### 4.2. Crear un Registro (Ejemplos)

1. En la Zona Alojada, haz clic en `Create record`.
2. **`Record name`**: El subdominio (ej. `www`, `mail`). Deja en blanco para la raíz del dominio (`example.com`).
3. **`Record type`**: Elige el tipo (A, CNAME, MX, etc.).
4. **`Value`**: La dirección IP o el nombre de dominio de destino.
5. **`TTL (Seconds)`**: Tiempo de vida (ej. 300 segundos).
6. **`Routing policy`**: (Ver sección 5)
7. **`Evaluate target health`**: (Para enrutamiento con Health Checks)

---

## 5. 🚀 Políticas de Enrutamiento (Routing Policies)

Permiten enrutar el tráfico de forma más inteligente.

* **Simple Routing**: (Por defecto) Enruta todo el tráfico a un solo recurso.
  * Uso: Un único servidor, sin lógica especial.
* **Weighted Routing (Ponderado)**:
  * Enruta el tráfico a múltiples recursos según los pesos que asignes.
  * Uso: Pruebas A/B, Canary deployments, despliegues graduales.
* **Latency Routing (Basado en Latencia)**:
  * Enruta el tráfico a la región de AWS que proporciona la menor latencia al usuario.
  * Uso: Mejorar el rendimiento global para usuarios distribuidos geográficamente.
* **Geolocation Routing (Basado en Geo-ubicación)**:
  * Enruta el tráfico según la ubicación geográfica del usuario.
  * Uso: Contenido localizado, cumplimiento normativo, servidores específicos por región.
* **Failover Routing (Conmutación por Error)**:
  * Enruta el tráfico a un recurso principal (Primary) y cambia a un recurso secundario (Secondary) si el principal no está saludable (basado en Health Checks).
  * Uso: Alta disponibilidad, recuperación ante desastres.
* **Multivalue Answer Routing**:
  * Devuelve hasta 8 registros aleatorios cuando hay múltiples recursos con el mismo nombre.
  * Uso: Simula un balanceador de carga muy básico, para evitar el SPOF de DNS.
* **Geoproximity Routing**:
  * Enruta el tráfico a los recursos en función de la ubicación geográfica de los usuarios y de tus recursos. Permite "sesgar" el tráfico.
  * Uso: Balanceo de carga inteligente para aplicaciones distribuidas.

---

## 6. 🧰 Registros Alias (Alias Records)

* Un tipo de registro especial de Route 53 que apunta a un recurso de AWS (ej. ELB, CloudFront, S3 Website, API Gateway, otro registro de Route 53) en lugar de una dirección IP o nombre de dominio.
* **Ventajas**:

  * **Gratuitos**: No se te cobra por las consultas Alias.
  * **DNS Name Resolution Faster**: Resolución de DNS más rápida.
  * **Integración con Health Checks**: Pueden usarse con Health Checks para Failover.
  * **¡Puedes usarlo para la raíz del dominio (A Record)!** (A diferencia de CNAME).
* **Crear un Registro Alias**:

  1. `Record type`: `A` o `AAAA`.
  2. `Alias`: `Yes`.
  3. `Route traffic to`: Selecciona el recurso de AWS (ej. un Application Load Balancer).

---

## 7. 📈 Verificación de Salud (Health Checks)

* Monitorea la salud de tus recursos (ej. un endpoint HTTP, un puerto TCP, un CloudWatch Alarm).
* Se usan principalmente con políticas de enrutamiento de **Failover** y **Multivalue Answer**.
* **Endpoint**: Puedes monitorear una IP o un nombre de dominio.
* **Protocolo**: HTTP, HTTPS, TCP, o HTTPS_STRINGS (buscar cadena en respuesta).
* **Intervalo**: Con qué frecuencia se comprueba la salud.
* **Threshold**: Número de fallos consecutivos para marcar el recurso como no saludable.

---

## 8. 💡 Buenas Prácticas y Consejos

* **Bajo TTL para Cambios Rápidos**: Para entornos de desarrollo o cuando esperas cambios frecuentes de IP/configuración, usa un TTL bajo (ej. 60 segundos). Para producción y URLs estables, un TTL más alto (ej. 300-3600 segundos) reduce la carga en Route 53.
* **Registros Alias para Recursos de AWS**: Siempre que sea posible, usa registros Alias en lugar de registros CNAME o A para recursos de AWS. Son más rápidos, gratuitos y se integran mejor con otras características.
* **Política de Enrutamiento Adecuada**: Elige la política de enrutamiento que mejor se adapte a tus necesidades de alta disponibilidad, rendimiento o control de tráfico (ej. `Weighted` para A/B testing, `Failover` para DR).
* **Verificaciones de Salud Robustas**: Configura verificaciones de salud detalladas para tus recursos. Un buen Health Check debe validar que la aplicación *funciona* y no solo que el servidor *está vivo*.
* **Configura DNS Inverso**: Para servidores de correo, es crucial configurar registros PTR para evitar que los correos se marquen como spam.
* **Seguridad con IAM**: Utiliza IAM para controlar quién puede gestionar tus Zonas Alojadas y registros DNS.
* **Registros SPF/DKIM/DMARC**: Configura registros TXT para tu dominio para prevenir el spoofing de email.
* **Monitorea los Health Checks**: Configura alarmas de CloudWatch para los Health Checks de Route 53 para ser notificado si un recurso se vuelve no saludable.
* **Utiliza Nombres de Dominio Personalizados**: Route 53 es la herramienta para mapear tus nombres de dominio personalizados a tus aplicaciones en AWS.

---

Este cheatsheet te proporciona una referencia completa de Amazon Route 53, cubriendo sus conceptos esenciales, la gestión de dominios, Zonas Alojadas, registros DNS, políticas de enrutamiento, verificaciones de salud y las mejores prácticas para una gestión de DNS escalable, fiable y segura en AWS.
