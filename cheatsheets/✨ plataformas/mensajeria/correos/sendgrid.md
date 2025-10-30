
---

# ✉️ SendGrid Cheatsheet Completo ✉️

**SendGrid** es una plataforma de comunicación con el cliente basada en la nube para el envío de correos electrónicos transaccionales y de marketing. Proporciona una API robusta, herramientas de análisis y una alta entregabilidad para asegurar que tus correos lleguen a la bandeja de entrada de los destinatarios.

---

## 1. 🌟 Conceptos Clave

* **API Key (Clave de API)**: Una clave secreta que utilizas para autenticar tus solicitudes a la API de SendGrid.
* **Correo Transaccional**: Correos electrónicos automáticos enviados en respuesta a una acción del usuario (ej. restablecimiento de contraseña, confirmación de compra, notificación).
* **Correo de Marketing**: Correos enviados a una lista de suscriptores para fines de marketing y promoción.
* **Entregabilidad (Deliverability)**: La capacidad de tus correos electrónicos para llegar a la bandeja de entrada del destinatario sin ser marcados como spam.
* **Autenticación de Dominio (Domain Authentication)**: Proceso para verificar que eres el propietario de un dominio y autorizar a SendGrid a enviar correos en tu nombre. Mejora drásticamente la entregabilidad.
* **Webhooks**: URLs que SendGrid puede llamar para notificarte en tiempo real sobre eventos de correo electrónico (ej. entregas, rebotes, clics, aperturas).
* **Plantillas (Templates)**: Diseños de correo electrónico reutilizables que puedes crear en la UI de SendGrid y luego usar en tus envíos de API, personalizándolos con datos dinámicos.
* **Listas de Supresión (Suppression Lists)**: Listas de direcciones de correo electrónico a las que no se debe enviar correo (ej. rebotes, quejas de spam, desuscripciones).

---

## 2. 🛠️ Configuración Inicial

1. **Crear una Cuenta**: Regístrate en [sendgrid.com](https://sendgrid.com/).
2. **Verificar un Remitente (Sender Identity)**:
   * **Single Sender Verification**: Verifica una única dirección de correo electrónico. Bueno para empezar.
   * **Domain Authentication**: (Recomendado para producción) Verifica todo un dominio, lo que mejora la entregabilidad. Requiere añadir registros DNS (CNAME).
3. **Crear una API Key**:
   * En el panel de SendGrid, ve a `Settings` -> `API Keys` -> `Create API Key`.
   * Dale un nombre y elige los permisos (`Full Access` o `Restricted Access`).
   * **¡Copia la clave de API y guárdala de forma segura! No se volverá a mostrar.**

---

## 3. 🚀 Envío de Correos Electrónicos (API v3)

### 3.1. Instalación de la Librería de Ayuda (Helper Library)

* **Node.js**: `npm install @sendgrid/mail`
* **PHP**: `composer require sendgrid/sendgrid`
* **Python**: `pip install sendgrid`
* **Java**: Añadir `sendgrid-java` a tu `pom.xml` o `build.gradle`.
* **Ruby**: `gem install sendgrid-ruby`
* **Go**: `go get github.com/sendgrid/sendgrid-go`

### 3.2. Envío Básico (Node.js - `@sendgrid/mail`)

```javascript
// sendEmail.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Usa variables de entorno para la API Key

const msg = {
  to: 'test@example.com', // Destinatario
  from: 'test@example.com', // Remitente verificado
  subject: 'Asunto de prueba',
  text: 'Este es el cuerpo en texto plano',
  html: '<strong>Este es el cuerpo en HTML</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Email enviado');
  })
  .catch((error) => {
    console.error(error);
  });
```

### 3.3. Envío con Personalización y Plantillas (Node.js)

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  personalizations: [
    {
      to: [{ email: 'user1@example.com', name: 'User One' }],
      dynamic_template_data: { // Datos para la plantilla
        name: 'User One',
        order_id: '12345',
      },
    },
    {
      to: [{ email: 'user2@example.com', name: 'User Two' }],
      dynamic_template_data: {
        name: 'User Two',
        order_id: '67890',
      },
    },
  ],
  from: {
    email: 'sales@example.com',
    name: 'Mi Tienda',
  },
  template_id: 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // ID de tu plantilla de SendGrid
  // Opcional: categorías para seguimiento
  categories: ['transactional', 'order_confirmation'],
};

sgMail.send(msg);
```

### 3.4. Envío con Adjuntos (Node.js)

```javascript
const fs = require('fs');

const attachment = fs.readFileSync('path/to/file.pdf').toString('base64');

const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Tu factura',
  html: '<p>Adjuntamos tu factura.</p>',
  attachments: [
    {
      content: attachment,
      filename: 'factura.pdf',
      type: 'application/pdf',
      disposition: 'attachment',
      content_id: 'my-invoice', // Opcional
    },
  ],
};

sgMail.send(msg);
```

---

## 4. 🔗 Webhooks (Eventos de Correo Electrónico)

Para recibir notificaciones en tiempo real sobre el estado de tus correos.

1. **Crear un Endpoint en tu Aplicación**: Un endpoint HTTP POST que pueda recibir y procesar los eventos de SendGrid.
2. **Configurar Webhook en SendGrid**:
   * Ve a `Settings` -> `Mail Settings` -> `Event Webhook`.
   * Introduce la `HTTP Post URL` de tu endpoint.
   * Selecciona los eventos que quieres recibir (`Delivered`, `Bounced`, `Opened`, `Clicked`, `Spam Report`, `Unsubscribed`).

* **Ejemplo de Payload de Webhook (JSON):**
  ```json
  [
    {
      "email": "test@example.com",
      "timestamp": 1678886400,
      "event": "delivered",
      "sg_message_id": "..."
    },
    {
      "email": "test2@example.com",
      "timestamp": 1678886401,
      "event": "open",
      "useragent": "..."
    }
  ]
  ```

---

## 5. 💡 Buenas Prácticas y Consejos

* **Autenticación de Dominio**: Es lo más importante para la entregabilidad. Configura la autenticación de dominio (DKIM, SPF) en lugar de verificar remitentes individuales.
* **Calentamiento de IP (IP Warmup)**: Si envías un gran volumen de correos desde una nueva IP dedicada, aumenta gradualmente el volumen de envío para construir una buena reputación.
* **Procesa Bounces y Quejas**: Usa webhooks para procesar los rebotes y las quejas. Elimina esas direcciones de tus listas de envío para proteger tu reputación.
* **Listas de Supresión**: No intentes enviar correos a direcciones que están en tus listas de supresión.
* **Usa Plantillas**: Para correos transaccionales y de marketing, utiliza las plantillas dinámicas de SendGrid. Facilita la edición y la gestión del contenido.
* **No Hardcodees la API Key**: Almacena tu clave de API de SendGrid en una variable de entorno (`process.env.SENDGRID_API_KEY`).
* **Categorías**: Usa categorías en tus envíos para segmentar y analizar el rendimiento de diferentes tipos de correo (ej. `password_reset`, `weekly_newsletter`).
* **Prueba con Sandbox Mode**: Habilita el "Sandbox Mode" en tus envíos de API para validar la estructura de tu solicitud sin enviar realmente el correo.
  ```javascript
  const msg = {
    // ...
    mail_settings: {
      sandbox_mode: {
        enable: true
      }
    }
  };
  ```
* **Manejo de Errores**: Implementa un manejo de errores robusto en tus llamadas a la API de SendGrid para manejar fallos de red o de la API.
* **Cumplimiento Normativo (GDPR, CAN-SPAM)**: Asegúrate de incluir enlaces de suscripción claros y de cumplir con las regulaciones de correo electrónico.

---

Este cheatsheet te proporciona una referencia completa de SendGrid, cubriendo sus conceptos esenciales, cómo configurar tu cuenta, enviar correos a través de su API, usar plantillas y webhooks, y las mejores prácticas para una entrega de correo electrónico efectiva y de alta reputación.
