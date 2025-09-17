
---

# 🌐 Amazon CloudFront Cheatsheet Completo 🌐

**Amazon CloudFront** es un servicio de red de entrega de contenido (CDN) rápido que distribuye contenido estático y dinámico a nivel mundial, con alta disponibilidad y rendimiento. Utiliza una red global de **Edge Locations (ubicaciones de borde)** para cachear y entregar contenido más cerca de tus usuarios, reduciendo la latencia y mejorando la experiencia del usuario.

---

## 1. 🌟 Conceptos Clave

* **CDN (Content Delivery Network)**: Un sistema distribuido de servidores (Edge Locations) que entregan contenido web a los usuarios basándose en la ubicación geográfica del usuario, el origen de la página web y un servidor de entrega de contenido.
* **Distribución (Distribution)**: La configuración principal de CloudFront. Define de dónde CloudFront obtiene el contenido (orígenes) y cómo lo entrega a los usuarios.
* **Origen (Origin)**: La ubicación donde se almacena el contenido original (ej. un bucket de S3, un balanceador de carga ELB, una instancia EC2, un servidor HTTP personalizado).
* **Edge Location / Point of Presence (PoP)**: Centros de datos de CloudFront ubicados estratégicamente en todo el mundo. Cachen el contenido y sirven las solicitudes a los usuarios cercanos.
* **Cache Hit / Cache Miss**:
  * **Cache Hit**: La solicitud del usuario es servida directamente desde el Edge Location (rápido).
  * **Cache Miss**: El Edge Location no tiene el contenido, por lo que lo solicita al Origin y luego lo cachea para futuras solicitudes.
* **Comportamiento de Caché (Cache Behavior)**: Reglas que definen cómo CloudFront maneja las solicitudes para rutas de URL específicas (ej. `/images/*`, `/api/*`).
  * Controla: Patrón de ruta, origen al que enrutar, métodos HTTP permitidos, política de caché, reenvío de encabezados/cookies/query strings.
* **Política de Caché (Cache Policy)**: (Recomendado para nuevas distribuciones) Define la configuración de caché (TTL, reenvío de encabezados/cookies/query strings).
* **Política de Solicitudes de Origen (Origin Request Policy)**: (Recomendado para nuevas distribuciones) Define qué encabezados/cookies/query strings se reenvían al origen.
* **Viewer Protocol Policy**: Cómo los usuarios acceden a CloudFront (HTTP, HTTPS).
* **Origin Protocol Policy**: Cómo CloudFront se conecta al origen (HTTP, HTTPS).
* **Distribución Web / RTP**: La mayoría de las distribuciones son "Web". "RTP" es para Real-Time Messaging Protocol (streaming).

---

## 2. 🛠️ Creación de una Distribución (Web Distribution)

### 2.1. Pasos Básicos (Console / CLI / SDK / CloudFormation)

1. **Origin Domain Name**: Elige o introduce el endpoint de tu origen (ej. `my-s3-bucket.s3.amazonaws.com`, `my-elb-12345.us-east-1.elb.amazonaws.com`, `api.example.com`).
2. **Origin Path (Opcional)**: Prefijo de ruta para el origen (ej. `/images`).
3. **Origin Access Control (OAC) / Origin Access Identity (OAI)**: (Recomendado para S3) Para restringir el acceso a tu bucket S3 para que solo CloudFront pueda acceder a él.
   * **OAC (más nuevo, recomendado)**: Controla el acceso a buckets S3 y ALB/EC2.
   * **OAI (legado para S3)**: Crea un usuario virtual de CloudFront en IAM.
4. **Viewer Protocol Policy**:
   * `HTTP and HTTPS`: Permite ambos (redirige HTTP a HTTPS por defecto).
   * `Redirect HTTP to HTTPS` (Recomendado).
   * `HTTPS Only`.
5. **Allowed HTTP Methods**: `GET, HEAD` (estáticos); `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE` (API).
6. **Cache Policy**: (Recomendado) Crea o selecciona una política de caché.
   * Define `Minimum TTL`, `Default TTL`, `Maximum TTL`.
   * Define qué encabezados, cookies y cadenas de consulta se incluyen en la clave de caché.
7. **Origin Request Policy**: (Recomendado) Define qué encabezados, cookies y cadenas de consulta se reenvían al origen.
8. **Default Root Object**: El archivo que CloudFront devuelve cuando un usuario solicita la raíz de tu dominio (ej. `index.html`).
9. **Alternate Domain Names (CNAMEs)**: Tus nombres de dominio personalizados (ej. `www.example.com`). Requiere un certificado SSL/TLS.
10. **Custom SSL Certificate**: Si usas CNAMEs, debes proporcionar un certificado SSL/TLS de AWS Certificate Manager (ACM).
11. **Logging**: Habilitar logs de acceso (guardados en S3).
12. **WAF Web ACL**: Asociar una Web ACL de AWS WAF para protección contra ataques web.

---

## 3. 📝 Configuración de Orígenes (Origins)

* Una distribución puede tener múltiples orígenes.
* **Origin ID**: Identificador único para el origen.
* **Origin Domain Name**: El endpoint del origen.
* **Origin Access Control (OAC) / Origin Access Identity (OAI)**:
  * Para buckets S3, OAC/OAI es clave para evitar el acceso directo público al bucket. CloudFront gestiona los permisos de S3.
  * Con OAC, CloudFront añade un encabezado (`AWS-Route53-Alias-Target`) que tu bucket S3 puede usar en su política para permitir el acceso.

---

## 4. 🧰 Comportamientos de Caché (Cache Behaviors)

* Definen cómo CloudFront maneja las solicitudes para rutas de URL específicas.
* Se evalúan en orden de prioridad (del 0 al 100, 0 es la más alta).
* La política por defecto (`Default (*)`) tiene la prioridad más baja.

**Ejemplo de Comportamientos de Caché**:

* **`Path Pattern`**: `/images/*` (para imágenes)
  * `Origin`: `my-s3-bucket-images.s3.amazonaws.com`
  * `Viewer Protocol Policy`: `Redirect HTTP to HTTPS`
  * `Allowed HTTP Methods`: `GET, HEAD, OPTIONS`
  * `Cache Policy`: `Managed-CachingOptimized` (política gestionada por AWS)
  * `Origin Request Policy`: `Managed-AllViewerAndHostHeader`
* **`Path Pattern`**: `/api/*` (para API endpoints dinámicos)
  * `Origin`: `my-api-elb.us-east-1.elb.amazonaws.com`
  * `Viewer Protocol Policy`: `HTTPS Only`
  * `Allowed HTTP Methods`: `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE`
  * `Cache Policy`: `Managed-CachingDisabled` (¡No cachear APIs dinámicas!)
  * `Origin Request Policy`: `Managed-AllViewerAndHostHeader` (reenviar todo al origen)
  * `Lambda@Edge`: (Opcional) Asociar una función Lambda para procesar la solicitud en el Edge.

---

## 5. ⚡ Caching (Políticas de Caché)

Controla cómo y por cuánto tiempo CloudFront cachea el contenido.

* **`Minimum TTL`**: Tiempo mínimo en caché (incluso si el origen envía `Cache-Control: max-age=0`).
* **`Default TTL`**: Tiempo por defecto en caché si el origen no especifica `Cache-Control`.
* **`Maximum TTL`**: Tiempo máximo en caché (incluso si el origen pide más).
* **`Cache-Control` / `Expires` Headers del Origen**: CloudFront respeta estos encabezados HTTP del origen para determinar el TTL.
* **Clave de Caché (Cache Key)**: Puedes configurar qué elementos de la solicitud (encabezados, cookies, query strings) se incluyen en la clave de caché. Si la clave de caché es diferente, CloudFront no usará el objeto cacheado.
  * `None`: (Más caché) No se reenvían, la clave es solo la URL.
  * `Whitelist`: Solo se reenvían los especificados.
  * `All`: Se reenvían todos (menos caché).

### 5.1. Invalidación de Caché

* Cuando cambias el contenido en tu origen, CloudFront puede seguir sirviendo versiones antiguas desde el caché.
* Para forzar la actualización:
  1. **Cambiar el nombre del archivo**: `image_v2.jpg`.
  2. **Invalidación de caché**: `Create Invalidation` en la consola de CloudFront.
     * `/*` (invalida todo, costoso).
     * `/images/logo_v2.jpg` (invalida un archivo específico).

---

## 6. 🔒 Seguridad

* **HTTPS (SSL/TLS)**: CloudFront soporta HTTPS para todas las distribuciones.
  * `Viewer Certificate`: Usa certificados de AWS Certificate Manager (ACM) para dominios personalizados.
  * `Origin Protocol Policy`: Conéctate a tu origen usando `HTTPS Only` para seguridad end-to-end.
* **AWS WAF (Web Application Firewall)**: Asocia una Web ACL a tu distribución de CloudFront para protección contra ataques web comunes (SQL injection, XSS).
* **AWS Shield**: Protección contra ataques DDoS.
* **Georestricción (Geo-Restriction)**: Restringe el acceso a tu contenido en función de la ubicación geográfica del usuario.
* **URLs Firmadas (Signed URLs) / Cookies Firmadas (Signed Cookies)**:
  * Otorga acceso temporal y limitado a contenido privado en CloudFront.
  * Uso: Contenido premium, descargas seguras.

---

## 7. 🚀 Edge Functions (Lambda@Edge / CloudFront Functions)

Permite ejecutar código en los Edge Locations de CloudFront en respuesta a eventos de la CDN.

* **`Lambda@Edge`**:
  * **Uso**: Funciones Lambda que se ejecutan en los Edge Locations. Más potentes, pueden interactuar con otros servicios de AWS, mayor latencia.
  * **Eventos**: `Viewer Request`, `Origin Request`, `Origin Response`, `Viewer Response`.
* **`CloudFront Functions`**:
  * **Uso**: Funciones JavaScript ligeras que se ejecutan directamente en los Edge Locations. Muy baja latencia (casi cero).
  * **Eventos**: `Viewer Request`, `Viewer Response`.
  * **Limitaciones**: Solo JavaScript, memoria limitada, tiempo de ejecución corto.
* **Casos de Uso**: Autenticación/autorización en el borde, manipulación de encabezados, reescritura de URL, redirecciones inteligentes, A/B testing en el borde.

---

## 8. 💡 Buenas Prácticas y Consejos

* **Usa CloudFront para Todo el Contenido Web**: Sirve tanto contenido estático (imágenes, JS, CSS) como dinámico (API) a través de CloudFront para obtener beneficios de rendimiento y seguridad.
* **Orígenes S3 con OAC/OAI**: Siempre usa OAC (o OAI para S3 legacy) para restringir el acceso directo a tus buckets S3 y forzar a los usuarios a pasar por CloudFront.
* **HTTPS de Extremo a Extremo**: Configura tu distribución para usar HTTPS desde el visor hasta el origen.
* **Optimiza las Políticas de Caché**: Define TTLs apropiados para tu contenido y decide qué encabezados/cookies/query strings se incluyen en la clave de caché para maximizar los aciertos de caché.
  * Contenido estático: TTLs largos.
  * APIs dinámicas: TTLs cortos o caching deshabilitado.
* **Invalida el Caché con Cuidado**: Invalida solo los archivos necesarios y preferiblemente usa el versionado de archivos (ej. `file_v2.js`) para una invalidación implícita.
* **Comportamientos de Caché Granulares**: Crea comportamientos de caché específicos para diferentes tipos de contenido o rutas de URL (ej. `/assets/*`, `/api/*`).
* **Georestricción y WAF**: Utiliza estas características para proteger tu contenido y tus aplicaciones de accesos no deseados o ataques web.
* **Registros de Acceso (Access Logs)**: Habilita los logs de acceso de CloudFront (en S3) para análisis detallados del tráfico.
* **Lambda@Edge / CloudFront Functions**: Úsalas para lógica personalizada en el Edge que no requiere un backend completo.
* **Monitoreo (CloudWatch)**: Monitoriza el rendimiento de tu distribución (hits, misses, errores, latencia) con CloudWatch.

---

Este cheatsheet te proporciona una referencia completa de Amazon CloudFront, cubriendo sus conceptos esenciales, cómo configurar distribuciones, gestionar orígenes y comportamientos de caché, seguridad, funciones en el Edge y las mejores prácticas para acelerar y proteger la entrega de tu contenido web en AWS.
