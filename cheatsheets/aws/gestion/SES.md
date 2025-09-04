
---

# 📧 Amazon SES (Simple Email Service) Cheatsheet Completo 📧

**Amazon SES** es un servicio de correo electrónico rentable, flexible y escalable, diseñado para que los desarrolladores envíen correos electrónicos desde cualquier aplicación. Permite enviar correos electrónicos de marketing, notificaciones y transaccionales.

---

## 1. 🌟 Conceptos Clave

* **Verificación de Identidad (Verified Identity)**: Un dominio o dirección de correo electrónico que has verificado con SES. Debes verificar que eres el propietario para poder enviar correos desde esa identidad.
* **Sandbox (Entorno de Pruebas)**: Por defecto, todas las cuentas nuevas de SES están en un Sandbox. En este modo, solo puedes enviar correos a direcciones verificadas (tanto la de origen como la de destino). Para enviar a cualquier dirección, debes solicitar salir del Sandbox.
* **Límites de Envío (Sending Limits)**: El número máximo de correos electrónicos que puedes enviar por día y la velocidad máxima de envío por segundo. Se incrementan al salir del Sandbox y con el uso.
* **Identidad (Identity)**: La dirección de correo electrónico o el dominio desde el cual envías correos.
* **Reputación de Envío (Sending Reputation)**: Un factor clave para la entregabilidad de tus correos. Incluye métricas como `bounce rate` (tasa de rebote), `complaint rate` (tasa de quejas) y `engagement`.
* **Tasa de Rebote (Bounce Rate)**: El porcentaje de correos electrónicos que no se pudieron entregar.
* **Tasa de Quejas (Complaint Rate)**: El porcentaje de destinatarios que marcan tu correo como spam.
* **Listas de Supresión (Suppression Lists)**:
  * **Global Suppression List**: Una lista gestionada por AWS de direcciones de correo electrónico que han causado un rebote fuerte o una queja para CUALQUIER cliente de SES.
  * **Account-level Suppression List**: Una lista específica de tu cuenta de SES de direcciones que han rebotado o quejado para TUS envíos.
* **Notification Feedback**: Recibe notificaciones (vía SNS) sobre rebotes, quejas y entregas exitosas.

---

## 2. 🛠️ Configuración Inicial y Verificación de Identidades

### 2.1. Salir del Sandbox (Para Producción)

1. En la consola de AWS, ve a Amazon SES.
2. Ve a `Account dashboard`.
3. Haz clic en `Request production access`.
4. Rellena el formulario explicando tu caso de uso (qué tipo de correos vas a enviar, cómo gestionas los rebotes/quejas, etc.).

### 2.2. Verificar una Identidad (Email Address)

1. En la consola de SES, ve a `Verified identities`.
2. Haz clic en `Create identity`.
3. Selecciona `Email address`.
4. Introduce la dirección de correo electrónico.
5. SES enviará un correo de verificación a esa dirección. Debes hacer clic en el enlace para verificarla.

### 2.3. Verificar una Identidad (Domain)

1. En la consola de SES, ve a `Verified identities`.
2. Haz clic en `Create identity`.
3. Selecciona `Domain`.
4. Introduce tu nombre de dominio (ej. `example.com`).
5. SES te proporcionará registros **TXT (DKIM)** que debes añadir a la configuración DNS de tu dominio. Esto demuestra que eres el propietario del dominio y mejora la reputación de envío.
6. Opcional: Configurar **SPF (Sender Policy Framework)** en tu DNS para especificar qué servidores están autorizados a enviar correo desde tu dominio.
7. Opcional: Configurar **DMARC (Domain-based Message Authentication, Reporting, and Conformance)** para indicar a los servidores receptores cómo manejar los correos que fallan SPF/DKIM.

---

## 3. 📧 Envío de Correos Electrónicos

SES proporciona APIs para enviar correos.

### 3.1. Tipos de Envío

* **`SendEmail` (Simple)**: Para enviar correos individuales.
  * Soporta texto plano y HTML.
  * Permite definir remitente, destinatarios (To, CC, BCC), asunto, cuerpo.
* **`SendRawEmail` (Raw)**: Para enviar correos completamente construidos por ti (incluyendo encabezados personalizados, adjuntos, codificaciones).
  * Uso: Casos avanzados, migraciones.
* **`SendTemplatedEmail` (Plantilla)**: Para enviar correos usando plantillas de SES.
  * Uso: Correos de marketing, notificaciones personalizadas masivas.

### 3.2. Envío Básico (AWS CLI)

```bash
# Enviar un correo simple
aws ses send-email \
    --from "sender@example.com" \
    --destination 'ToAddresses=["recipient@example.com"],CcAddresses=["cc@example.com"]' \
    --message 'Subject={Data="Mi Asunto"},Body={Text={Data="Este es el cuerpo del mensaje en texto plano."},Html={Data="<h1>Hola!</h1><p>Este es el cuerpo en HTML.</p>"}}'

# Enviar un correo con adjunto (usando SendRawEmail)
# Primero crea un archivo MIME con el adjunto, luego:
# aws ses send-raw-email --raw-message file://email_with_attachment.mime
```

### 3.3. Envío con SDKs (Python Boto3)

```python
import boto3
from botocore.exceptions import ClientError

SENDER = "Sender Name <sender@example.com>"  # Debe ser una identidad verificada
RECIPIENT = "recipient@example.com"
AWS_REGION = "us-east-1" # Región donde está verificado el remitente

SUBJECT = "Un correo de prueba de SES"
BODY_TEXT = ("Amazon SES prueba de correo electrónico.\r\n"
             "Esta es la versión en texto plano.")
BODY_HTML = """<html>
<head></head>
<body>
  <h1>Amazon SES Prueba HTML</h1>
  <p>Esta es la versión en HTML del correo electrónico.</p>
</body>
</html>"""

CHARSET = "UTF-8"

client = boto3.client('ses', region_name=AWS_REGION)

try:
    response = client.send_email(
        Destination={
            'ToAddresses': [
                RECIPIENT,
            ],
        },
        Message={
            'Body': {
                'Html': {
                    'Charset': CHARSET,
                    'Data': BODY_HTML,
                },
                'Text': {
                    'Charset': CHARSET,
                    'Data': BODY_TEXT,
                },
            },
            'Subject': {
                'Charset': CHARSET,
                'Data': SUBJECT,
            },
        },
        Source=SENDER,
        # Opcional: ReplyToAddresses=['replyto@example.com']
        # Opcional: ReturnPath='error@example.com' (para rebotes)
    )
except ClientError as e:
    print(e.response['Error']['Message'])
else:
    print("Email enviado! Message ID:", response['MessageId'])
```

---

## 4. 🧰 Gestión de Reputación y Notificaciones

### 4.1. Configurar Feedback Loop (Bounces, Complaints, Deliveries)

* Para mejorar la reputación, es crucial procesar los rebotes y las quejas.
* **SNS Topics**: Crea temas SNS para recibir notificaciones.
  1. Crea un tema SNS (ej. `ses-bounces`, `ses-complaints`, `ses-deliveries`).
  2. Suscríbete a estos temas (ej. con una función Lambda, una cola SQS, o un endpoint HTTP).
  3. En la consola de SES, ve a `Verified identities`, selecciona tu identidad (dominio o email).
  4. En la pestaña `Notifications`, configura los temas SNS para `Bounce`, `Complaint` y `Delivery`.

### 4.2. Monitoring de la Reputación

* SES proporciona métricas de reputación en CloudWatch (ej. `BounceRate`, `ComplaintRate`).
* Configura alarmas de CloudWatch para estas métricas para ser notificado si superan ciertos umbrales.

---

## 5. 📧 Plantillas de Correo (Templated Emails)

Para correos personalizados a gran escala.

1. **Crear Plantilla (Console / CLI / SDK)**:

   ```bash
   aws ses create-template \
       --cli-input-json '{
           "Template": {
               "TemplateName": "WelcomeEmail",
               "Subject": "Bienvenido a nuestra plataforma, {{name}}!",
               "HtmlPart": "<h1>Hola, {{name}}!</h1><p>Gracias por registrarte.</p>",
               "TextPart": "Hola, {{name}}! Gracias por registrarte."
           }
       }'
   ```
2. **Enviar Correo Basado en Plantilla (`SendTemplatedEmail`)**:

   * Proporciona el nombre de la plantilla y un objeto de datos para la personalización.

   ```bash
   aws ses send-templated-email \
       --source "sender@example.com" \
       --destination 'ToAddresses=["recipient@example.com"]' \
       --template "WelcomeEmail" \
       --template-data '{"name":"Alice"}'
   ```

   * Soporta envío masivo con `SendBulkTemplatedEmail`.

---

## 6. 💡 Buenas Prácticas y Consejos

* **Verifica Identidades**: Antes de enviar cualquier correo, asegúrate de que tu dirección de correo electrónico o dominio de origen esté verificado en SES.
* **Salir del Sandbox**: Para enviar correos a destinatarios no verificados y aumentar tus límites de envío, solicita salir del Sandbox.
* **Monitorea la Reputación**: Presta mucha atención a tus tasas de rebote y quejas en CloudWatch. Altas tasas pueden llevar a que AWS limite o pause tu capacidad de envío.
* **Procesa Bounces y Complaints**: Configura notificaciones de feedback a través de SNS/SQS/Lambda y procesa los rebotes y las quejas de forma programática. Elimina las direcciones de correo electrónico que rebotan de tus listas de envío.
* **Autenticación de Correo (SPF, DKIM, DMARC)**: Configura estos registros DNS para mejorar la entregabilidad y la confianza de tus correos.
* **Segmentación de Listas**: Utiliza listas de envío diferentes para correos transaccionales y de marketing.
* **Warm-up (Calentamiento de IP)**: Si vas a enviar un gran volumen de correos desde una nueva IP o dominio, calienta gradualmente la IP aumentando el volumen de envío con el tiempo para construir una buena reputación.
* **Evita Listas de Supresión**: No envíes correos a direcciones que ya están en las listas de supresión de SES (global o de tu cuenta).
* **Cifrado de Datos**: SES cifra los datos en tránsito (HTTPS) y en reposo.
* **IAM Roles y Policies**: Usa IAM para controlar quién puede enviar correos con SES y qué identidades pueden usar.
* **Personalización de Envíos**: Utiliza plantillas para envíos masivos y personalizados.

---

Este cheatsheet te proporciona una referencia completa de Amazon SES, cubriendo sus conceptos esenciales, cómo verificar identidades, enviar correos, gestionar la reputación, usar plantillas y aplicar las mejores prácticas para un envío de correo electrónico escalable, fiable y rentable en AWS.
