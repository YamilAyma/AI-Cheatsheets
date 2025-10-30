
---

# 🔐 Firebase Authentication Cheatsheet Completo 🔐

**Firebase Authentication** es un servicio de backend que proporciona autenticación segura y fácil de implementar para tus aplicaciones. Soporta una variedad de proveedores de identidad (email/contraseña, federación social, teléfono) y maneja todo el flujo de autenticación, desde la interfaz de usuario hasta la gestión de usuarios.

---

## 1. 🌟 Conceptos Clave

* **Autenticación**: El proceso de verificar la identidad de un usuario (¿Quién eres?).
* **Proveedores de Identidad**: Los servicios que Firebase puede usar para autenticar usuarios (Google, Facebook, Email/Contraseña, etc.).
* **Firebase User Object**: Un objeto que representa al usuario autenticado. Contiene información básica (UID, email, etc.) y un ID Token.
* **UID (User ID)**: Un identificador único para cada usuario en tu proyecto de Firebase.
* **ID Token (JWT)**: Un JSON Web Token que se genera para cada usuario autenticado. Se puede usar para verificar la identidad del usuario en tu backend o en Cloud Functions.
* **Reglas de Seguridad**: Permiten controlar el acceso a otros servicios de Firebase (Firestore, Storage) basándose en el estado de autenticación del usuario (`request.auth`).
* **FirebaseUI Auth**: Una biblioteca de interfaz de usuario preconstruida que maneja los flujos de inicio de sesión para todos los proveedores soportados.

---

## 2. 🛠️ Configuración Inicial

1. **En la Consola de Firebase**, ve a tu proyecto y selecciona la pestaña `Authentication`.
2. Haz clic en `Get started`.
3. En la pestaña `Sign-in method`, habilita los proveedores de identidad que quieras usar (ej. Email/Password, Google, etc.).
4. **Para proveedores sociales (Google, Facebook, etc.)**: Necesitarás configurar tus propias aplicaciones de desarrollador en esas plataformas y añadir el `Client ID` y `Client Secret` en la consola de Firebase.

### 2.1. Instalación e Inicialización del SDK (Web)

1. **Instalar**: `npm install firebase`
2. **Inicializar**:
   ```javascript
   // src/firebase.js
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";

   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     // ...
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app); // Exporta la instancia de Auth
   ```

---

## 3. 📝 Métodos Comunes (Web - JavaScript v9 Modular SDK)

```javascript
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  // ... otros proveedores
} from "firebase/auth";

const auth = getAuth();
```

### 3.1. Autenticación con Email y Contraseña

* **Registro de un Nuevo Usuario**:
  ```javascript
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Usuario registrado y logueado
      const user = userCredential.user;
      console.log('Usuario registrado:', user);
    })
    .catch((error) => console.error("Error de registro:", error.code, error.message));
  ```
* **Inicio de Sesión de un Usuario**:
  ```javascript
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Usuario logueado
      const user = userCredential.user;
      console.log('Usuario logueado:', user);
    })
    .catch((error) => console.error("Error de inicio de sesión:", error));
  ```
* **Restablecimiento de Contraseña**:
  ```javascript
  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log('Correo de restablecimiento de contraseña enviado.');
    })
    .catch((error) => console.error("Error de restablecimiento:", error));
  ```

### 3.2. Proveedores de Federación Social (Google, Facebook, etc.)

* **Inicio de Sesión con Popup**:
  ```javascript
  const provider = new GoogleAuthProvider();
  // provider.addScope('https://www.googleapis.com/auth/contacts.readonly'); // Para scopes adicionales

  signInWithPopup(auth, provider)
    .then((result) => {
      // El usuario está logueado
      const user = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
    })
    .catch((error) => console.error("Error con Google:", error));
  ```
* **Inicio de Sesión con Redirección**: `signInWithRedirect`, `getRedirectResult`.

### 3.3. Gestión del Estado de Autenticación

* **Observador del Estado de Autenticación**: **¡CRÍTICO!** La forma recomendada de saber si un usuario está logueado.
  ```javascript
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Usuario está logueado, obtén su información
      console.log('Usuario activo:', user.uid, user.email);
      // Aquí es donde normalmente rediriges a tu app o actualizas el estado global
    } else {
      // Usuario no está logueado
      console.log('No hay usuario activo.');
    }
  });
  ```
* **Cerrar Sesión**:
  ```javascript
  signOut(auth).then(() => {
    console.log('Cierre de sesión exitoso.');
  }).catch((error) => console.error("Error al cerrar sesión:", error));
  ```

### 3.4. Gestión del Perfil de Usuario

* **Obtener el Usuario Actual**:
  ```javascript
  const user = auth.currentUser;
  if (user) {
    // Accede a las propiedades del usuario
    console.log(user.displayName, user.email, user.photoURL, user.uid);
  }
  ```
* **Actualizar el Perfil**:
  ```javascript
  import { updateProfile } from "firebase/auth";

  updateProfile(auth.currentUser, {
    displayName: "Jane Q. User",
    photoURL: "https://example.com/jane-q-user/profile.jpg"
  }).then(() => {
    console.log('Perfil actualizado.');
  });
  ```
* **Verificación de Correo Electrónico**:
  ```javascript
  import { sendEmailVerification } from "firebase/auth";

  sendEmailVerification(auth.currentUser)
    .then(() => {
      console.log('Correo de verificación enviado.');
    });
  ```

### 3.5. Obtener el ID Token del Usuario

* Para autenticar al usuario en tu propio backend.
  ```javascript
  auth.currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
    // Envía el token a tu backend
    console.log('ID Token:', idToken);
  }).catch((error) => {
    // Maneja el error
  });
  ```

---

## 4. 🚀 FirebaseUI Auth

Una biblioteca de UI preconstruida que maneja los flujos de inicio de sesión.

1. **Instalar**: `npm install firebaseui --save`
2. **Uso (React)**:
   ```jsx
   import React, { useEffect, useState } from 'react';
   import { getAuth, EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
   import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

   const uiConfig = {
     signInFlow: 'popup',
     signInSuccessUrl: '/signedIn',
     signInOptions: [
       EmailAuthProvider.PROVIDER_ID,
       GoogleAuthProvider.PROVIDER_ID,
     ],
   };

   function SignInScreen() {
     return (
       <div>
         <h1>Iniciar Sesión</h1>
         <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth()} />
       </div>
     );
   }
   ```

---

## 5. 🔒 Reglas de Seguridad

Firebase Authentication se integra con las reglas de seguridad de otros servicios de Firebase para proteger tus datos.

* `request.auth`: Un objeto disponible en tus reglas que contiene la información de autenticación del usuario que realiza la solicitud.
* **Ejemplo (Firestore)**:
  ```
  // firestore.rules
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      // Solo usuarios autenticados pueden leer
      match /posts/{postId} {
        allow read: if request.auth != null;
      }

      // Solo el autor del post puede escribir en él
      match /posts/{postId} {
        allow write: if request.auth != null && request.auth.uid == resource.data.authorId;
      }
    }
  }
  ```

---

## 6. 💡 Buenas Prácticas y Consejos

* **Usa `onAuthStateChanged`**: Es la forma principal y más fiable de rastrear el estado de autenticación del usuario.
* **Seguridad del Lado del Servidor**: **Nunca confíes en el cliente**. Si tienes un backend personalizado, verifica siempre los ID Tokens del usuario en el servidor para proteger tus APIs.
* **Reglas de Seguridad**: Escribe y prueba tus reglas de seguridad a fondo para proteger tus datos.
* **Errores Comunes de Código**: Familiarízate con los códigos de error de Firebase Auth (ej. `auth/user-not-found`, `auth/wrong-password`) para dar un feedback claro al usuario.
* **FirebaseUI para Empezar Rápido**: Si no necesitas un flujo de autenticación muy personalizado, FirebaseUI te ahorra mucho tiempo.
* **Protege tus Claves de API**: Aunque las claves de API de Firebase para web son públicas, asegúrate de restringir su uso en la consola de Google Cloud (API & Services > Credentials) a tus dominios autorizados.
* **Maneja la Persistencia**: Puedes configurar cómo se persiste el estado de autenticación (`local`, `session`, `none`).

---

Este cheatsheet te proporciona una referencia completa de Firebase Authentication, cubriendo sus conceptos esenciales, cómo configurar e implementar la autenticación con diferentes proveedores, la gestión de usuarios, la integración con reglas de seguridad y las mejores prácticas para una autenticación segura y eficiente en tus aplicaciones.
