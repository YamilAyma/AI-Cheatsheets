

# 🔥 Firebase Cheatsheet Completo 🔥

**Firebase** es una plataforma de Google para el desarrollo de aplicaciones web y móviles. Proporciona servicios de backend gestionados (BaaS - Backend as a Service), SDKs y herramientas para acelerar el desarrollo, reducir la complejidad y escalar aplicaciones.

## 1. 🌟 Servicios Principales

### 1.1. Build (Desarrollo)

* **Authentication**:
  * **Propósito**: Autenticación de usuarios segura y fácil de implementar.
  * **Proveedores**: Email/Contraseña, Teléfono, Google, Facebook, Twitter, GitHub, SAML, OIDC y anónimo.
  * **UI**: Proporciona FirebaseUI, una biblioteca de UI para flujos de autenticación.
* **Firestore (Cloud Firestore)**:
  * **Propósito**: Base de datos NoSQL de documentos, flexible y escalable.
  * **Características**: Sincronización en tiempo real, consultas complejas, soporte offline, estructura de colecciones y documentos.
  * **Uso**: La base de datos principal recomendada para la mayoría de las aplicaciones.
* **Realtime Database**:
  * **Propósito**: La base de datos NoSQL original de Firebase, basada en un único árbol JSON.
  * **Características**: Sincronización de muy baja latencia, soporte offline.
  * **Uso**: Aplicaciones que necesitan una sincronización de estado muy rápida y simple.
* **Storage (Cloud Storage for Firebase)**:
  * **Propósito**: Almacenamiento de archivos de usuario (imágenes, videos, documentos).
  * **Características**: Basado en Google Cloud Storage, reglas de seguridad robustas.
* **Hosting**:
  * **Propósito**: Alojamiento rápido y seguro para aplicaciones web estáticas y dinámicas.
  * **Características**: CDN global, SSL automático, dominios personalizados, previsualizaciones.
* **Functions (Cloud Functions for Firebase)**:
  * **Propósito**: Ejecuta código de backend sin servidor en respuesta a eventos.
  * **Triggers**: HTTPS, eventos de Firebase (ej. escritura en DB, subida a Storage), Cloud Pub/Sub, cron jobs.
* **Machine Learning (ML Kit)**:
  * **Propósito**: APIs de Machine Learning fáciles de usar (en el dispositivo y en la nube) para reconocimiento de texto, detección de caras, escaneo de códigos de barras, etc.

### 1.2. Release & Monitor (Lanzamiento y Monitoreo)

* **Crashlytics**:
  * **Propósito**: Informes de errores en tiempo real.
  * **Características**: Agrupa errores, proporciona contexto, alertas.
* **Performance Monitoring**:
  * **Propósito**: Monitorea el rendimiento de tu aplicación (tiempo de inicio, solicitudes de red).
* **Test Lab**:
  * **Propósito**: Pruebas de aplicaciones en dispositivos físicos y virtuales en la nube.
* **App Distribution**:
  * **Propósito**: Distribuye versiones de prueba de tu aplicación a testers.

### 1.3. Engage (Participación)

* **Google Analytics for Firebase**:
  * **Propósito**: Analítica de aplicaciones gratuita e ilimitada.
  * **Características**: Segmentación de audiencias, seguimiento de eventos y conversiones.
* **Cloud Messaging (FCM)**:
  * **Propósito**: Envía notificaciones push y mensajes a tus usuarios.
* **Remote Config**:
  * **Propósito**: Cambia el comportamiento y la apariencia de tu aplicación sin necesidad de una actualización.
* **A/B Testing**:
  * **Propósito**: Realiza experimentos para probar cambios en tu aplicación.

---

## 2. 🛠️ Configuración Inicial (Web)

1. **Crear un Proyecto Firebase**: Ve a la [Consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto.
2. **Añadir Firebase a tu App Web**:
   * En el proyecto, haz clic en el icono `</>` para añadir una aplicación web.
   * Copia el objeto de configuración de Firebase.
3. **Instalar el SDK de Firebase**:
   ```bash
   npm install firebase
   # o
   yarn add firebase
   ```
4. **Inicializar Firebase en tu App**:
   ```javascript
   // src/firebase.js o similar
   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";
   import { getAuth } from "firebase/auth";
   // ... otros servicios

   // Tu configuración de Firebase
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "...",
     measurementId: "..."
   };

   // Inicializar Firebase
   const app = initializeApp(firebaseConfig);

   // Exportar los servicios que necesitas
   export const db = getFirestore(app);
   export const auth = getAuth(app);
   // ...
   ```

---

## 3. 🚀 Ejemplos de Uso (Web - JavaScript v9 Modular SDK)

### 3.1. Authentication

```javascript
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

const auth = getAuth();

// Registro
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
  })
  .catch((error) => console.error(error));

// Inicio de sesión
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
  })
  .catch((error) => console.error(error));

// Escuchar cambios de estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuario está logueado
  } else {
    // Usuario no está logueado
  }
});

// Cerrar sesión
signOut(auth).then(() => {
  // Cierre de sesión exitoso
});
```

### 3.2. Firestore (Base de Datos)

```javascript
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

const db = getFirestore();

// Crear un documento
addDoc(collection(db, "users"), {
  first: "Ada",
  last: "Lovelace",
  born: 1815
});

// Leer todos los documentos de una colección
const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});

// Leer un documento
const docRef = doc(db, "users", "some-id");
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
}

// Actualizar un documento
updateDoc(docRef, {
  born: 1816
});

// Eliminar un documento
deleteDoc(doc(db, "users", "some-id"));

// Consultas (Query)
const q = query(collection(db, "users"), where("born", ">", 1900));
const querySnapshot = await getDocs(q);
```

### 3.3. Storage

```javascript
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

const storageRef = ref(storage, 'images/some-image.jpg');

// Subir un archivo
uploadBytes(storageRef, file).then((snapshot) => {
  console.log('¡Archivo subido!');
  // Obtener la URL de descarga
  getDownloadURL(snapshot.ref).then((downloadURL) => {
    console.log('URL del archivo:', downloadURL);
  });
});
```

### 3.4. Cloud Functions (Ejemplo de HTTP Trigger)

```javascript
// functions/index.js
const functions = require("firebase-functions");

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("¡Hola, logs!", {structuredData: true});
  response.send("¡Hola desde Firebase!");
});
```

---

## 4. 🔒 Reglas de Seguridad (Security Rules)

* Un lenguaje declarativo para proteger tus datos en Firestore, Realtime Database y Storage.
* **Firestore/Realtime Database**: Se escriben en un archivo `firestore.rules` o `database.rules`.
* **Storage**: Se escriben en un archivo `storage.rules`.
* Se despliegan con la Firebase CLI (`firebase deploy --only firestore:rules`).

```
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leer a todos, pero solo escribir a usuarios autenticados
    match /users/{userId} {
      allow read;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    // Permite leer posts, pero solo el autor puede crear/actualizar/eliminar
    match /posts/{postId} {
      allow read;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.authorId == request.auth.uid;
    }
  }
}
```

---

## 5. 💡 Buenas Prácticas y Consejos

* **Seguridad Primero**: Configura tus reglas de seguridad. **Nunca dejes tus bases de datos abiertas a escritura pública en producción.**
* **SDK Modular (v9+)**: Usa la sintaxis modular del SDK de JavaScript v9 para un mejor "tree-shaking" y un menor tamaño de bundle.
* **Firestore vs. Realtime Database**:
  * **Firestore**: Mejor para la mayoría de los casos de uso. Ofrece consultas más potentes y escalabilidad.
  * **Realtime Database**: Para sincronización de estado de muy baja latencia.
* **Cloud Functions para Lógica de Servidor**: Utiliza Cloud Functions para la lógica que no debe ejecutarse en el cliente (ej. procesamiento de pagos, envío de notificaciones).
* **Limita tus Consultas**: Diseña tu modelo de datos y consultas para ser eficientes. Evita leer colecciones enteras si no es necesario.
* **Índices en Firestore**: Para consultas complejas, necesitas crear índices. La consola de Firebase te sugerirá los índices necesarios.
* **Firebase CLI**: Aprende a usar la CLI (`firebase init`, `firebase deploy`, `firebase emulators:start`) para un flujo de trabajo de desarrollo eficiente.
* **Emuladores de Firebase**: Usa el Emulators Suite para desarrollar y probar tu aplicación localmente, sin incurrir en costos.
* **Monitoreo**: Utiliza Crashlytics, Performance Monitoring y Google Analytics para entender el rendimiento y el uso de tu aplicación.
* **Costos**: Entiende el modelo de precios de Firebase (basado en lecturas/escrituras, almacenamiento, ejecuciones de funciones).

---

Este cheatsheet te proporciona una referencia completa de Firebase, cubriendo sus servicios principales, configuración, ejemplos de uso con el SDK de JavaScript, reglas de seguridad y las mejores prácticas para construir aplicaciones web y móviles de alta calidad.

---
