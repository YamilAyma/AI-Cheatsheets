
---

# 📣 Amazon Pinpoint Cheatsheet Completo 📣

**Amazon Pinpoint** es un servicio flexible y escalable de AWS que permite a las empresas participar con sus clientes a través de múltiples canales (correo electrónico, SMS, notificaciones push, voz) para campañas de marketing, comunicaciones transaccionales y participación del usuario. Proporciona herramientas para segmentar usuarios, enviar mensajes personalizados y analizar el rendimiento de las campañas.

---

## 1. 🌟 Conceptos Clave

* **Proyecto (Project)**: El contenedor de nivel superior en Pinpoint, que organiza todos los componentes de una campaña (segmentos, mensajes, campañas, jornadas).
* **Endpoint (Punto Final)**: Representa un destino al que Pinpoint puede enviar mensajes (ej. una dirección de correo electrónico, un número de teléfono, un token de dispositivo para notificaciones push). Contiene atributos que describen al usuario.
* **Atributos de Endpoint**: Metadatos asociados a un endpoint (ej. `City`, `LastLoginDate`, `SubscriptionStatus`).
* **Segmento (Segment)**: Un grupo dinámico de endpoints que comparten características comunes (ej. "Usuarios activos en Madrid", "Clientes que no han comprado en 30 días").
* **Canales (Channels)**: Los medios a través de los cuales Pinpoint puede enviar mensajes.
  * **Email**: Correo electrónico.
  * **SMS**: Mensajes de texto (SMS).
  * **Push Notifications**: Notificaciones a dispositivos móviles (APN, FCM, ADM, Baidu).
  * **Voice**: Llamadas de voz.
  * **In-App Messaging**: Mensajes dentro de la propia aplicación (requiere SDK).
* **Mensaje (Message)**: El contenido real que se envía (ej. texto de email, cuerpo de SMS). Puede ser personalizado usando atributos.
* **Plantilla de Mensaje (Message Template)**: Un mensaje predefinido y reutilizable que se puede personalizar con variables.
* **Campaña (Campaign)**: Una iniciativa de marketing dirigida a un segmento específico, que envía mensajes a través de uno o más canales en un horario definido.
* **Jornada (Journey)**: Un flujo de trabajo multicanal basado en el comportamiento del usuario o eventos. Permite una interacción más compleja y personalizada.
* **Eventos (Events)**: Acciones realizadas por los usuarios o el sistema que Pinpoint puede rastrear y utilizar para activar jornadas o construir segmentos (ej. `AppOpened`, `ItemAddedToCart`, `PurchaseCompleted`).
* **Análisis (Analytics)**: Pinpoint proporciona métricas detalladas sobre la entrega, apertura, clics y conversiones de los mensajes.

---

## 2. 🛠️ Configuración Inicial y Creación de Proyecto

### 2.1. Creación de un Proyecto (Console / CLI / SDK)

1. **En la Consola de AWS**, ve a Amazon Pinpoint.
2. Haz clic en `Create a project`.
3. Asigna un nombre al proyecto.
4. **Configurar Canales**:
   * Para usar **Email**: Necesitas verificar una identidad (dirección de correo electrónico o dominio) en Amazon SES (Simple Email Service) y habilitar el canal de email en Pinpoint.
   * Para usar **SMS**: Necesitas habilitar el canal de SMS y configurar un número de origen (número corto, número 10DLC, toll-free number).
   * Para **Push Notifications**: Necesitas configurar las credenciales de tu proveedor de notificaciones (Firebase Cloud Messaging - FCM, Apple Push Notification service - APNs).

---

## 3. 📝 Gestión de Endpoints y Atributos

### 3.1. Añadir/Actualizar Endpoints (SDK / CLI)

* Normalmente, tus aplicaciones cliente (web/móvil) o backends de servicio enviarán datos a Pinpoint.

```javascript
// Ejemplo Node.js (AWS SDK v3)
import { PinpointClient, UpdateEndpointCommand } from "@aws-sdk/client-pinpoint";

const client = new PinpointClient({ region: "us-east-1" });
const projectId = "YOUR_PINPOINT_PROJECT_ID";

async function updateCustomerEndpoint(userId, email, city, lastLogin) {
  const params = {
    ApplicationId: projectId,
    EndpointId: userId, // ID único para el endpoint (ej. ID de usuario)
    EndpointRequest: {
      Address: email,
      ChannelType: "EMAIL", // Tipo de canal
      EffectiveDate: new Date().toISOString(),
      OptOut: "NONE", // NONE, ALL
      User: {
        UserId: userId,
      },
      Attributes: { // Atributos personalizados
        City: [city],
        LastLogin: [lastLogin],
        SubscriptionStatus: ["active"]
      },
      Metrics: { // Métricas (valores numéricos)
        PurchasesCount: 10,
        LifetimeValue: 500.25
      }
    }
  };
  try {
    const command = new UpdateEndpointCommand(params);
    const data = await client.send(command);
    console.log("Endpoint actualizado:", data);
  } catch (error) {
    console.error("Error al actualizar endpoint:", error);
  }
}

// updateCustomerEndpoint("user_456", "user@example.com", "Madrid", new Date().toISOString());
```

### 3.2. Importar Endpoints Masivamente

* Puedes importar una gran cantidad de endpoints desde un archivo CSV en un bucket S3.

---

## 4. 🗃️ Segmentos (Segments)

Colecciones dinámicas de endpoints.

### 4.1. Tipos de Segmentos

* **Segmento Dinámico**: Creado usando reglas de filtro basadas en atributos de endpoint o eventos. Se actualiza automáticamente.
  * Ej: "Todos los usuarios de Madrid que abrieron la app en los últimos 7 días."
* **Segmento Estático**: Creado importando una lista de IDs de endpoint desde un archivo CSV en S3. No se actualiza automáticamente.

### 4.2. Crear un Segmento (Console / SDK)

1. En la consola de Pinpoint, ve a tu `Project` -> `Segments`.
2. Haz clic en `Create a segment`.
3. **Para un Segmento Dinámico**:
   * Elige `Build a segment`.
   * Define reglas de filtro (ej. `User.Attributes.City = "Madrid" AND Endpoint.Metrics.PurchasesCount > 5`).
   * Puedes basar la segmentación en eventos (ej. `AppOpened` en los últimos 7 días).

---

## 5. 📧 Plantillas de Mensaje (Message Templates)

Mensajes reutilizables que se pueden personalizar.

### 5.1. Crear una Plantilla (Console / SDK)

1. En la consola de Pinpoint, ve a `Message templates`.
2. Haz clic en `Create template`.
3. Elige el `Channel` (Email, SMS, Push, Voice, In-App).
4. **Personalización**: Usa la sintaxis de Handlebars para referenciar atributos de endpoint o atributos de evento.
   * Ej: `Hola, {{Endpoint.User.UserAttributes.FirstName}}!`
   * Ej: `Tu pedido #{{Attributes.order_id}} ha sido enviado.`
   * Puedes definir valores por defecto: `{{Endpoint.User.UserAttributes.FirstName | default: 'cliente'}}`

---

## 6. 📢 Campañas (Campaigns)

Iniciativas de marketing dirigidas a segmentos.

### 6.1. Crear una Campaña (Console / SDK)

1. En la consola de Pinpoint, ve a tu `Project` -> `Campaigns`.
2. Haz clic en `Create campaign`.
3. **Configurar**:
   * **Name, Description**.
   * **Segment**: Selecciona el segmento objetivo.
   * **Channel**: Elige el canal (Email, SMS, Push, etc.).
   * **Message**: Define el mensaje (puedes usar una plantilla).
   * **Schedule**: Define cuándo se envía la campaña (única, recurrente).
   * **Treatment**: (Opcional) Define grupos A/B para probar diferentes versiones.
   * **Advanced**: Definir DLQ para mensajes fallidos.

---

## 7. 🗺️ Jornadas (Journeys)

Flujos de trabajo multicanal basados en el comportamiento.

### 7.1. Crear una Jornada (Console / SDK)

1. En la consola de Pinpoint, ve a tu `Project` -> `Journeys`.
2. Haz clic en `Create journey`.
3. **Configurar**:
   * **Start activity**: Cómo comienza la jornada (ej. cuando los usuarios entran en un segmento, o en un evento específico).
   * **Activities**: Añade diferentes actividades al flujo:
     * `Send email`, `Send SMS`, `Send push notification`.
     * `Wait` (esperar un tiempo).
     * `Condition` (tomar una decisión basada en atributos o eventos).
     * `Split` (dividir a los usuarios en grupos para pruebas).
     * `Update/remove attributes`.
   * **Metrics**: Puedes definir métricas objetivo para la jornada.

---

## 8. 📊 Análisis (Analytics)

Pinpoint proporciona métricas detalladas para tus proyectos, segmentos, campañas y jornadas.

* **Métricas de Compromiso (Engagement Metrics)**:
  * `Messages sent`, `Delivery rate`, `Open rate`, `Click-through rate (CTR)`.
  * `Opt-out rate`.
* **Métricas de Segmentos**: Tamaño del segmento, cambios a lo largo del tiempo.
* **Métricas de Rendimiento de Campañas/Jornadas**: Conversiones, ingresos atribuidos.
* **Exportar Datos**: Puedes exportar datos de análisis a S3 para un análisis más profundo.

---

## 9. 🔒 Seguridad (IAM Roles)

* **IAM Roles**: Es la forma **recomendada** para que Pinpoint acceda a otros servicios de AWS (ej. S3 para importar/exportar, SNS para enviar notificaciones, SES para enviar emails).
* **Políticas de IAM**: Define permisos específicos para Pinpoint (ej. `mobiletargeting:UpdateEndpoint`, `mobiletargeting:SendMessages`).
* **Encryption**: Pinpoint cifra los datos en reposo (gestionado por AWS) y en tránsito (HTTPS).

---

## 10. 💡 Buenas Prácticas y Consejos

* **Verifica Identidades para Email/SMS**: Antes de enviar emails o SMS, verifica tus direcciones de correo electrónico/dominios en SES y configura tu número de origen para SMS.
* **Segmentación Detallada**: Crea segmentos muy específicos para campañas dirigidas. Utiliza la combinación de atributos y eventos para una segmentación precisa.
* **Personaliza Mensajes**: Usa plantillas de mensaje con variables de Handlebars para hacer tus comunicaciones relevantes para cada usuario.
* **Prueba Tus Mensajes**: Envía mensajes de prueba a ti mismo para asegurarte de que el formato y la personalización son correctos.
* **Configura DLQ para Campañas/Jornadas**: Si los mensajes no pueden ser entregados, configúralos para que vayan a una Dead-Letter Queue para su análisis.
* **Monitoreo (CloudWatch)**: Monitoriza las métricas de Pinpoint (tasa de entrega, tasa de fallos) y configura alarmas de CloudWatch.
* **Gestiona Opt-Outs**: Asegúrate de manejar correctamente las solicitudes de exclusión voluntaria (`OptOut`) de los usuarios.
* **Considera el SDK de Pinpoint**: Si tu aplicación es móvil o web, integra el SDK de Pinpoint para un seguimiento de eventos y gestión de endpoints más fácil.
* **Jornadas para Flujos Complejos**: Utiliza Jornadas para flujos de usuario complejos y multicanal, como onboarding, carritos abandonados o programas de lealtad.
* **Roles de IAM con Mínimo Privilegio**: Otorga a Pinpoint solo los permisos de IAM necesarios para interactuar con otros servicios.
* **Cumplimiento Normativo**: Asegúrate de cumplir con las leyes de privacidad de datos (GDPR, CCPA) y las regulaciones de comunicaciones (CAN-SPAM, TCPA) al usar Pinpoint.

---

Este cheatsheet te proporciona una referencia completa de Amazon Pinpoint, cubriendo sus conceptos esenciales, cómo configurar proyectos, gestionar endpoints, segmentos, campañas y jornadas, el análisis de rendimiento y las mejores prácticas para una interacción efectiva con tus clientes en AWS.
