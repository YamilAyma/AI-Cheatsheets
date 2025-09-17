
---

# 🚀 AWS Amplify Cheatsheet Completo 🚀

**AWS Amplify** es un conjunto de herramientas y servicios para construir aplicaciones móviles y web de pila completa (`fullstack`) escalables. Acelera el desarrollo al proporcionar una interfaz unificada para integrar servicios de backend de AWS, herramientas de interfaz de usuario, flujo de trabajo de CI/CD y más, con un fuerte enfoque en las aplicaciones sin servidor.

---

## 1. 🌟 Conceptos Clave

* **Pila Completa (Fullstack)**: Amplify ayuda a construir tanto el frontend (web/móvil) como el backend (AWS) de tu aplicación.
* **Sin Servidor (Serverless)**: Gran parte del backend que provisiona Amplify es sin servidor (Lambda, DynamoDB, S3, API Gateway).
* **Componentes de UI (UI Components)**: Biblioteca de componentes de UI preconstruidos (React, Vue, Angular, React Native, Flutter) para funcionalidades comunes (autenticación, subida de archivos).
* **CLI (Command Line Interface)**: La herramienta principal para configurar y gestionar tu backend Amplify (añadir autenticación, APIs, almacenamiento).
* **Client Libraries (Bibliotecas Cliente)**: Para integrar tu frontend con el backend de Amplify (JavaScript, iOS, Android, Flutter).
* **Amplify Hosting**: Servicio de hosting gestionado para aplicaciones web, con CI/CD, ramificación de entornos y previsualizaciones.
* **Amplify Studio**: Interfaz visual para construir y gestionar el backend de Amplify, el modelo de datos y los componentes de UI.
* **Categorías (Categories)**: Bloques de construcción de backend de Amplify (Auth, API, Storage, Functions, Analytics, Notifications, etc.).

---

## 2. 🛠️ Configuración Inicial (Amplify CLI)

### 2.1. Instalar Amplify CLI

```bash
npm install -g @aws-amplify/cli
```

### 2.2. Configurar Amplify CLI con tu Cuenta AWS

```bash
amplify configure
# Te abrirá el navegador para iniciar sesión en AWS.
# Luego te pedirá:
#   Región de AWS por defecto.
#   Crear/seleccionar un usuario de IAM con permisos de administrador.
#   Introducir el Access Key ID y Secret Access Key de ese usuario.
```

### 2.3. Inicializar un Proyecto Amplify en tu App Frontend

1. Crea tu aplicación frontend (ej. `npx create-react-app my-amplify-app`).
2. Navega a la raíz de tu proyecto frontend.
   ```bash
   cd my-amplify-app
   amplify init
   # Te preguntará:
   #   Application Name
   #   Environment Name (ej. dev)
   #   Default editor
   #   Tipo de aplicación (ej. javascript, react)
   #   Ruta de código fuente, ruta de build, comando de build, comando de inicio
   # Esto creará un proyecto Amplify y un archivo `aws-exports.js` (o `amplifyconfiguration.json`)
   ```

### 2.4. Integrar con tu Aplicación Frontend

* El archivo `aws-exports.js` contiene la configuración de tu backend AWS.
  ```javascript
  // src/index.js (o App.js para React)
  import Amplify from 'aws-amplify'; // Para Amplify JS v5 y anteriores
  // import { Amplify } from 'aws-amplify'; // Para Amplify JS v6+
  import config from './aws-exports'; // Importa el archivo de configuración generado
  Amplify.configure(config); // Configura Amplify con tus recursos de AWS

  // ... renderizar tu aplicación React/Vue/etc.
  ```

---

## 3. 🧩 Categorías de Backend (Amplify CLI)

Añade y configura servicios de backend usando el CLI.

### 3.1. Autenticación (`Auth`)

* **`amplify add auth`**: Añade y configura la autenticación.
  * **Proveedores**: User Pool de Amazon Cognito (por defecto), Federación Social (Google, Facebook), SAML.
  * **Múltiples factores de autenticación (MFA)**.
  * **Recuperación de contraseña**.
  * Esto provisiona un Cognito User Pool y, opcionalmente, un Identity Pool.
* **`amplify push`**: Despliega los cambios a AWS.

### 3.2. API (`API`)

* **`amplify add api`**: Añade una API.
  * **REST API (API Gateway + Lambda)**:
    * Crea un endpoint HTTP/REST.
    * Integra con una función Lambda (crea la Lambda por ti).
  * **GraphQL API (AWS AppSync)**:
    * Crea una API GraphQL.
    * Define tu esquema GraphQL (`schema.graphql`).
    * Soporta fuentes de datos (DynamoDB, Lambda, Aurora Serverless).
    * Genera resoluciones automáticamente o permite resolvers personalizados.
    * Ofrece autenticación flexible (API Key, IAM, Cognito, OIDC).
* **`amplify push`**: Despliega los cambios a AWS.

### 3.3. Almacenamiento (`Storage`)

* **`amplify add storage`**: Añade almacenamiento.
  * **Content (S3)**: Para almacenar archivos de usuario (imágenes, videos, documentos).
    * Provisiona un bucket S3.
    * Configura permisos de acceso (privado, público, solo lectura).
  * **NoSQL Database (DynamoDB)**:
    * Define un modelo de datos.
    * Provisiona una tabla DynamoDB.
* **`amplify push`**: Despliega los cambios a AWS.

### 3.4. Funciones (`Functions`)

* **`amplify add function`**: Añade una función Lambda.
  * Crea una función Lambda con un tiempo de ejecución (Node.js, Python, etc.).
  * Puedes elegir templates (ej. para Lambda con CRUD de DynamoDB).
  * Se puede invocar desde el frontend o desde otras funciones.
* **`amplify push`**: Despliega los cambios a AWS.

### 3.5. Analítica (`Analytics`)

* **`amplify add analytics`**: Añade analítica (Amazon Pinpoint).
  * Rastrea eventos de usuario, métricas de engagement.
  * Crea un proyecto Pinpoint.

### 3.6. Notificaciones (`Notifications`)

* **`amplify add notifications`**: Añade notificaciones push (Amazon Pinpoint).
  * Para enviar notificaciones push a dispositivos móviles.

---

## 4. 🧰 Bibliotecas Cliente (Client Libraries)

El frontend de tu aplicación interactúa con el backend de Amplify usando estas bibliotecas.

### 4.1. Configuración Global

```javascript
// aws-exports.js se genera automáticamente
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);
```

### 4.2. Uso de Categorías

* **Auth (Autenticación)**:
  ```javascript
  import { Auth } from 'aws-amplify';

  // Registro
  await Auth.signUp({ username, password, attributes: { email } });
  // Confirmación
  await Auth.confirmSignUp(username, code);
  // Inicio de sesión
  await Auth.signIn(username, password);
  // Obtener usuario actual
  const user = await Auth.currentAuthenticatedUser();
  // Cerrar sesión
  await Auth.signOut();
  ```
* **API**:
  ```javascript
  import { API } from 'aws-amplify';

  const apiName = 'myRestApi'; // Nombre de tu API definido en Amplify
  const path = '/items';

  // GET
  const myInit = { headers: { /* ... */ } };
  const response = await API.get(apiName, path, myInit);

  // POST
  const postData = { body: { name: 'New Item' } };
  const createResponse = await API.post(apiName, path, postData);
  ```
* **Storage (S3)**:
  ```javascript
  import { Storage } from 'aws-amplify';

  // Subir archivo
  const file = event.target.files[0];
  await Storage.put(`public/${file.name}`, file, {
    contentType: file.type,
    level: 'public' // 'public', 'protected', 'private'
  });

  // Obtener URL de archivo
  const url = await Storage.get(`public/${fileName}`);
  // Descargar archivo
  const data = await Storage.get(`public/${fileName}`, { download: true });
  ```
* **Functions (Lambda)**:
  ```javascript
  import { API } from 'aws-amplify'; // Para invocar desde REST API
  import { Interactions } from 'aws-amplify'; // Para interacción con Lex

  // Invocar una función Lambda a través de la API Gateway
  const lambdaResponse = await API.post('myLambdaApi', '/myfunction', {
    body: { data: 'payload' }
  });
  ```
* **Analytics**:
  ```javascript
  import { Analytics } from 'aws-amplify';

  Analytics.record({ name: 'AppOpened', attributes: { version: '1.0' } });
  Analytics.record({ name: 'ItemAddedToCart', attributes: { itemId: 'prod123', quantity: 1 } });
  ```

---

## 5. 🚀 Amplify Hosting (CI/CD y Despliegue)

* **Descripción**: Servicio de hosting gestionado que automatiza el despliegue de tu frontend web (SPA o SSR) desde tu repositorio de Git.
* **Características**:
  * **CI/CD**: Configura automáticamente un pipeline de CI/CD.
  * **Ramificación de Entornos**: Despliega cada rama de Git a un entorno de hosting separado.
  * **Previsualizaciones de Pull Request**: Despliega automáticamente una URL de previsualización para cada Pull Request.
  * **Dominios Personalizados y HTTPS**.
  * **Soporte SSR**: Para frameworks como Next.js, Nuxt.js.

### 5.1. Configurar Amplify Hosting

1. En la consola de Amplify, ve a `Hosting` -> `Get started`.
2. Elige tu proveedor de repositorio (GitHub, GitLab, Bitbucket, CodeCommit).
3. Selecciona tu repositorio y rama.
4. Configura los ajustes de build (comando de build, directorio de salida).
5. Haz clic en `Save and deploy`.

---

## 6. 🎨 Componentes de UI (UI Components)

Bibliotecas de componentes preconstruidos para frameworks frontend populares.

* **`@aws-amplify/ui-react`**, `ui-vue`, `ui-angular`, `ui-react-native`, `ui-flutter`.
* **`Authenticator` Component**: Un componente de autenticación completo (registro, inicio de sesión, recuperación de contraseña, MFA) listo para usar.
  ```jsx
  // React ejemplo
  import { Amplify } from 'aws-amplify';
  import { Authenticator } from '@aws-amplify/ui-react';
  import '@aws-amplify/ui-react/styles.css'; // Estilos

  import config from './aws-exports';
  Amplify.configure(config);

  function App() {
    return (
      <Authenticator> {/* Envuelve tu aplicación con el componente Authenticator */}
        {({ signOut, user }) => (
          <main>
            <h1>Hola {user.username}</h1>
            <button onClick={signOut}>Cerrar sesión</button>
          </main>
        )}
      </Authenticator>
    );
  }
  export default App;
  ```

---

## 7. 💡 Buenas Prácticas y Consejos

* **Usa la CLI para Empezar**: `amplify init`, `amplify add auth/api/storage` son excelentes para configurar rápidamente tu backend.
* **Backend sin Servidor**: Prioriza las categorías que provisionan recursos sin servidor (Lambda, DynamoDB, S3) para escalabilidad y pago por uso.
* **Frontend con Amplify Hosting**: Aprovecha Amplify Hosting para CI/CD, ramificación de entornos y despliegues sin problemas.
* **Desarrollo de Entornos Múltiples**: Usa `amplify env add <new-env-name>` para crear entornos de backend separados (dev, staging, prod) y `amplify env checkout <env-name>` para cambiar entre ellos.
* **Permisos de IAM de Mínimo Privilegio**: Asegúrate de que los roles y políticas de IAM creados por Amplify (o manualmente) sigan el principio de mínimo privilegio.
* **No Mutes `aws-exports.js`**: Este archivo es generado automáticamente. No lo edites manualmente; usa la CLI (`amplify update ...`) para modificar la configuración.
* **Utiliza `Authenticator` de UI Components**: Para una experiencia de autenticación rápida y segura. Puedes personalizarlo extensivamente.
* **GraphQL con AppSync**: Para APIs que requieren un modelo de datos flexible, suscripciones en tiempo real o agregación de múltiples fuentes de datos.
* **`amplify mock`**: Ejecuta un backend localmente para desarrollo y pruebas sin desplegar a la nube.
* **Monitoreo (CloudWatch)**: Monitoriza los logs y las métricas de tus recursos de backend (Lambda, API Gateway, DynamoDB) a través de CloudWatch.
* **Limpieza de Recursos**: Usa `amplify remove <category>` y `amplify delete` para limpiar los recursos de AWS que ya no necesites, para evitar costos inesperados.

---

Este cheatsheet te proporciona una referencia completa de AWS Amplify, cubriendo sus conceptos esenciales, cómo configurar proyectos y backend, las bibliotecas cliente, el hosting, los componentes de UI y las mejores prácticas para construir aplicaciones fullstack escalables y sin servidor en AWS.
