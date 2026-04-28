---
title: "cURL"
---


---

# 🔗 cURL Cheatsheet Completo 🔗

**cURL** es una herramienta de línea de comandos para transferir datos a o desde un servidor, utilizando uno de los muchos protocolos soportados (HTTP, HTTPS, FTP, FTPS, SCP, SFTP, TFTP, DICT, TELNET, LDAP, FILE, POP3, IMAP, SMTP, RTMP y RTSP). Es una utilidad fundamental para interactuar con APIs y depurar problemas de red.

---

## 1. 🌟 Conceptos Clave

* **Cliente HTTP**: Actúa como un cliente que realiza solicitudes a un servidor.
* **Protocolos Múltiples**: Soporta una amplia gama de protocolos, siendo HTTP/HTTPS los más comunes para APIs.
* **Línea de Comandos**: Todas las interacciones se realizan a través de comandos en la terminal.
* **Depuración**: Permite ver encabezados de solicitud y respuesta, información de conexión, etc.
* **Portabilidad**: Disponible en prácticamente todos los sistemas operativos.

---

## 2. 🛠️ Configuración Inicial

* **Instalación**: cURL viene preinstalado en la mayoría de los sistemas operativos basados en Unix (Linux, macOS). Para Windows, puedes descargarlo de su sitio oficial o usar herramientas como Chocolatey.
  * **Linux (Debian/Ubuntu)**: `sudo apt install curl`
  * **macOS (preinstalado)**: `curl --version`
  * **Windows (descarga)**: Añadir `curl.exe` a tu `PATH`.

---

## 3. 🚀 Solicitudes HTTP Básicas

### 3.1. GET Request (Predeterminado)

* Recupera datos de un recurso.
  ```bash
  curl https://api.example.com/users
  ```
* Con parámetros de consulta (query parameters):
  ```bash
  curl "https://api.example.com/products?category=electronics&limit=10"
  ```

  * **Nota**: Usa comillas si la URL contiene caracteres especiales como `&`.

### 3.2. POST Request

* Envía datos para crear un nuevo recurso.
* **Con datos de formulario (`application/x-www-form-urlencoded`):**
  ```bash
  curl -X POST -d "username=john.doe&password=secret" https://api.example.com/login
  # -d es un atajo para --data
  ```
* **Con datos JSON (`application/json`):**
  ```bash
  curl -X POST \
       -H "Content-Type: application/json" \
       -d '{"name": "Laptop Pro", "price": 1200.00}' \
       https://api.example.com/products
  ```

  * `-H` o `--header`: Para añadir encabezados HTTP.
  * `\`: Para continuar el comando en la siguiente línea (opcional, mejora la legibilidad).
  * Usa comillas simples para la cadena JSON para evitar problemas con comillas dobles internas en la terminal.
* **Con datos JSON desde un archivo:**
  ```bash
  curl -X POST \
       -H "Content-Type: application/json" \
       -d @product.json \
       https://api.example.com/products
  # product.json contiene: {"name": "Monitor", "price": 300.00}
  ```

  * `@filename`: Lee el cuerpo de la solicitud desde un archivo.

### 3.3. PUT Request

* Actualiza completamente un recurso existente o lo crea si no existe.
  ```bash
  curl -X PUT \
       -H "Content-Type: application/json" \
       -d '{"id": 1, "name": "Laptop Updated", "price": 1150.00}' \
       https://api.example.com/products/1
  ```

### 3.4. PATCH Request

* Actualiza parcialmente un recurso existente.
  ```bash
  curl -X PATCH \
       -H "Content-Type: application/json" \
       -d '{"price": 1100.00}' \
       https://api.example.com/products/1
  ```

### 3.5. DELETE Request

* Elimina un recurso.
  ```bash
  curl -X DELETE https://api.example.com/products/1
  ```

---

## 4. 🧰 Opciones Comunes

### 4.1. Verbosidad y Depuración

* **`-v` o `--verbose`**: Muestra detalles de lo que cURL está haciendo (encabezados de solicitud, respuesta, negociación SSL, etc.). ¡Muy útil para depurar!
  ```bash
  curl -v https://api.example.com/status
  ```
* **`-i` o `--include`**: Muestra los encabezados de respuesta HTTP junto con el cuerpo.
  ```bash
  curl -i https://api.example.com/users
  ```
* **`-I` o `--head`**: Realiza una solicitud HEAD y solo muestra los encabezados de respuesta. No descarga el cuerpo.
  ```bash
  curl -I https://api.example.com/users
  ```

### 4.2. Encabezados (Headers)

* **`-H "Header-Name: Value"` o `--header`**: Añade encabezados HTTP personalizados.
  ```bash
  curl -H "Accept: application/json" https://api.example.com/data
  curl -H "Custom-Header: MyValue" https://api.example.com/status
  ```

### 4.3. Autorización (Authentication)

* **Basic Auth (`-u` o `--user`)**:
  ```bash
  curl -u "username:password" https://api.example.com/protected/resource
  ```

  * **Advertencia**: Envía la contraseña en texto plano (aunque codificada en Base64). Usa HTTPS.
* **Bearer Token (OAuth 2.0, JWT)**:
  ```bash
  curl -H "Authorization: Bearer YOUR_AUTH_TOKEN" https://api.example.com/api/v1/data
  ```
* **API Key (en el encabezado)**:
  ```bash
  curl -H "X-API-Key: YOUR_API_KEY" https://api.example.com/api/items
  ```

### 4.4. Archivos (Files)

* **Subir archivos (`-F` o `--form`)**: Para solicitudes `multipart/form-data`.
  ```bash
  curl -X POST \
       -F "name=My Document" \
       -F "document=@/path/to/my_document.pdf;type=application/pdf" \
       https://api.example.com/upload
  ```

  * `@filename`: Indica que se subirá el contenido del archivo.
  * `;type=`: Opcional para especificar el Content-Type del archivo.
* **Descargar archivos (`-o`, `-O`)**:
  * `-o <output-file>`: Guarda la salida en un archivo con el nombre especificado.
    ```bash
    curl -o my_page.html https://example.com
    ```
  * `-O` (mayúscula): Guarda la salida en un archivo con el nombre del archivo remoto.
    ```bash
    curl -O https://example.com/image.jpg # Guarda como image.jpg
    ```

### 4.5. Cookies

* **Enviar cookies (`-b` o `--cookie`)**:
  ```bash
  curl -b "sessionid=xyz123; user_pref=darkmode" https://api.example.com/profile
  # O desde un archivo de cookies Netscape: curl -b cookies.txt https://api.example.com/profile
  ```
* **Guardar cookies (`-c` o `--cookie-jar`)**:
  ```bash
  curl -c cookies.txt https://api.example.com/login # Guarda cookies de la respuesta
  ```

---

## 5. ⚙️ Opciones Avanzadas

* **Redirecciones (`-L` o `--location`)**: Sigue redirecciones HTTP (3xx). Por defecto, cURL no sigue las redirecciones.
  ```bash
  curl -L http://shorturl.com/xyz
  ```
* **Tiempo de Espera (`--connect-timeout`, `--max-time`)**:
  * `--connect-timeout <seconds>`: Tiempo máximo para establecer la conexión.
  * `--max-time <seconds>`: Tiempo máximo total para toda la operación.

  ```bash
  curl --connect-timeout 5 --max-time 10 https://slow-api.example.com/data
  ```
* **Ignorar SSL/TLS (`-k` o `--insecure`)**: Permite conexiones SSL/TLS "inseguras" (sin verificar certificados). **¡Solo para desarrollo/pruebas! No usar en producción.**
  ```bash
  curl -k https://self-signed-cert.example.com
  ```
* **Silenciar Salida (`-s` o `--silent`)**: Suprime la barra de progreso y los mensajes de error.
  * Combinado con `-S` (`--show-error`) para mostrar errores si ocurren.

  ```bash
  curl -sS https://api.example.com/data # Solo muestra la respuesta o el error
  ```
* **Proxies (`-x` o `--proxy`)**: Usa un proxy HTTP/HTTPS.
  ```bash
  curl -x http://proxy.example.com:8080 https://api.example.com/data
  ```
* **Autocompresión (`--compressed`)**: Solicita contenido comprimido (gzip, deflate, brotli) si el servidor lo soporta y lo descomprime automáticamente.
  ```bash
  curl --compressed https://example.com/large_file
  ```
* **Limitar Ancho de Banda (`--limit-rate`)**: Limita la tasa de transferencia de datos.
  ```bash
  curl --limit-rate 100K -O https://example.com/large_download.zip # 100 Kilobytes/segundo
  ```

---

## 6. 💡 Consejos y Mejores Prácticas

* **Siempre usa HTTPS**: Para cualquier operación sensible, asegúrate de que la URL comienza con `https://`.
* **Comillas para URLs y datos**: Usa comillas dobles (`"`) para URLs que contienen parámetros o caracteres especiales. Usa comillas simples (`'`) para los cuerpos de solicitud JSON/XML para evitar problemas con las comillas dobles internas en la terminal (especialmente en Linux/macOS).
* **Empieza con `-v` o `-i`**: Para depurar APIs, `curl -v` es tu mejor amigo para ver la conversación HTTP completa.
* **`jq` para JSON**: Si la respuesta es JSON, canaliza la salida de cURL a `jq` para formatearla y filtrar datos.
  ```bash
  curl -s https://api.example.com/users | jq '.[] | select(.age > 30) | .name'
  ```
* **`--data-urlencode`**: Para enviar datos de formulario que necesitan ser codificados, es más seguro que solo `-d`.
  ```bash
  curl -X POST --data-urlencode "name=John Doe&city=New York" https://api.example.com/register
  ```
* **Guarda Comandos Comunes**: Almacena los comandos cURL complejos en scripts o alias de shell para reutilizarlos fácilmente.

---

Este cheatsheet te proporciona una referencia completa de cURL, cubriendo desde las solicitudes HTTP básicas hasta opciones avanzadas de depuración, autenticación y manejo de archivos, lo que te permitirá interactuar de manera efectiva con cualquier API.
