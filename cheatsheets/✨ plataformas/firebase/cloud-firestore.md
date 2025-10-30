
---

# 🔥 Cloud Firestore Cheatsheet Completo 🔥

**Cloud Firestore** es una base de datos NoSQL de documentos, flexible y escalable, para el desarrollo móvil, web y de servidor. Ofrece sincronización en tiempo real, soporte offline y capacidades de consulta potentes, todo ello con una estructura de datos jerárquica.

---

## 1. 🌟 Conceptos Clave

* **NoSQL de Documentos**: Los datos se almacenan en "documentos" (similares a objetos JSON), no en tablas y filas.
* **Estructura Jerárquica**: Los datos se organizan en **Colecciones**, que contienen **Documentos**. Los documentos pueden contener **Subcolecciones**.
* **Documento (Document)**: La unidad básica de almacenamiento. Es un conjunto de pares clave-valor.
* **Colección (Collection)**: Un contenedor para documentos. No puedes tener colecciones dentro de colecciones, solo documentos.
* **Subcolección (Subcollection)**: Una colección asociada a un documento específico.
* **Modelo de Datos**: `Colección -> Documento -> Subcolección -> Documento ...`
* **Sincronización en Tiempo Real**: Los clientes (web/móvil) suscritos a una consulta reciben actualizaciones automáticamente cuando los datos cambian.
* **Soporte Offline**: Para aplicaciones móviles y web, Firestore cachea los datos localmente, permitiendo que la aplicación funcione sin conexión. Sincroniza los cambios cuando la conexión se restablece.
* **Consultas Compuestas (Compound Queries)**: Permite realizar consultas que filtran y ordenan por múltiples campos.
* **Indexación Automática**: Por defecto, Firestore crea automáticamente índices de campo único para todos los campos de tus documentos.
* **Reglas de Seguridad (Security Rules)**: Un lenguaje declarativo para proteger tus datos, permitiendo un control de acceso granular.

---

## 2. 🛠️ Estructura de Datos

* **Referencia a un Documento**: `coleccion('nombre_coleccion').documento('ID_documento')`
* **Referencia a una Colección**: `coleccion('nombre_coleccion')`
* **Referencia a una Subcolección**: `coleccion('nombre_coleccion').documento('ID_documento').coleccion('nombre_subcoleccion')`

```
// Ejemplo de Estructura
/users/{userId}/              (Colección 'users')
    - email: "alice@example.com"
    - name: "Alice"
    /cart/{cartId}/           (Subcolección 'cart' del usuario 'userId')
        - productId: "prod123"
        - quantity: 2
/products/{productId}/        (Colección 'products')
    - name: "Laptop Pro"
    - price: 1200
```

---

## 3. 📝 Operaciones CRUD (Web - JavaScript v9 Modular SDK)

```javascript
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

const db = getFirestore();

// 1. Crear Documentos
// addDoc (con ID generado automáticamente)
const docRef = await addDoc(collection(db, "cities"), {
  name: "Tokyo",
  country: "Japan"
});
console.log("Document written with ID: ", docRef.id);

// setDoc (con ID específico - crea o sobrescribe)
await setDoc(doc(db, "cities", "LA"), {
  name: "Los Angeles",
  state: "CA",
  country: "USA"
});

// 2. Leer Documentos
// getDoc (leer un solo documento)
const docSnap = await getDoc(doc(db, "cities", "LA"));
if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  console.log("No such document!");
}

// getDocs (leer todos los documentos de una colección)
const querySnapshot = await getDocs(collection(db, "cities"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data().name}`);
});

// 3. Actualizar Documentos
// updateDoc (actualización parcial - falla si el documento no existe)
const cityRef = doc(db, "cities", "LA");
await updateDoc(cityRef, {
  capital: true,
  "regions.westCoast": true // Para campos anidados
});

// setDoc con { merge: true } (actualización parcial - crea el documento si no existe)
await setDoc(cityRef, { state: "California" }, { merge: true });

// 4. Eliminar Documentos
// deleteDoc (eliminar un documento)
await deleteDoc(doc(db, "cities", "LA"));

// Para eliminar un campo, usa la función especial `deleteField`
// import { deleteField } from "firebase/firestore";
// await updateDoc(cityRef, {
//     capital: deleteField()
// });
```

---

## 4. 🔍 Consultas (Querying)

### 4.1. Consultas Simples (`where`)

```javascript
import { collection, query, where, getDocs } from "firebase/firestore";

// Crear una consulta
const q = query(collection(db, "cities"), where("state", "==", "CA"));

// Ejecutar la consulta
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
});
```

* **Operadores de Consulta**:
  * `<`, `<=`, `==`, `!=`, `>`, `>=`
  * `array-contains`
  * `array-contains-any`
  * `in`, `not-in`

### 4.2. Consultas Compuestas (Compound Queries)

* Para combinar múltiples cláusulas `where`.
* **¡Requieren un índice compuesto!** Firestore te proporcionará un enlace en el mensaje de error para crearlo automáticamente.

```javascript
const q = query(collection(db, "cities"),
              where("state", "==", "CA"),
              where("population", ">", 1000000));
```

### 4.3. Ordenación (`orderBy`) y Límite (`limit`)

```javascript
import { orderBy, limit } from "firebase/firestore";

// Ordenar
const q1 = query(collection(db, "cities"), orderBy("name", "desc"));

// Limitar
const q2 = query(collection(db, "cities"), limit(3));

// Combinar
const q3 = query(collection(db, "cities"),
               where("population", ">", 100000),
               orderBy("population", "desc"),
               limit(5));
```

### 4.4. Paginación

* Usa `startAfter` o `startAt` con el último documento de la página anterior.

```javascript
import { startAfter } from "firebase/firestore";

// Obtener la primera página
const first = query(collection(db, "cities"), orderBy("population"), limit(3));
const documentSnapshots = await getDocs(first);

// Obtener el último documento visible para la paginación
const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

// Obtener la siguiente página
const next = query(collection(db, "cities"),
                 orderBy("population"),
                 startAfter(lastVisible),
                 limit(3));
```

---

## 5. 🔄 Escuchas en Tiempo Real (Realtime Listeners)

```javascript
import { onSnapshot, collection, doc } from "firebase/firestore";

// Escuchar cambios en un solo documento
const unsubDoc = onSnapshot(doc(db, "cities", "SF"), (doc) => {
  console.log("Current data: ", doc.data());
});

// Escuchar cambios en una colección
const unsubCollection = onSnapshot(collection(db, "cities"), (querySnapshot) => {
  querySnapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      console.log("New city: ", change.doc.data());
    }
    if (change.type === "modified") {
      console.log("Modified city: ", change.doc.data());
    }
    if (change.type === "removed") {
      console.log("Removed city: ", change.doc.data());
    }
  });
});

// Para dejar de escuchar (al desmontar un componente)
// unsubDoc();
// unsubCollection();
```

---

## 6. 🔒 Reglas de Seguridad (`firestore.rules`)

* Un lenguaje declarativo para proteger tus datos. **¡CRÍTICO para producción!**
* Se basan en el `path` del documento y la información de `request.auth`.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Regla por defecto: Denegar todo
    match /{document=**} {
      allow read, write: if false;
    }

    // Permitir a cualquiera leer la colección de productos
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth.uid == 'admin-uid'; // Solo un admin puede escribir
    }

    // Permitir a un usuario leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Funciones reutilizables
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
  }
}
```

* Usa el Simulador de Reglas en la consola de Firebase para probar tus reglas.

---

## 7. 💡 Buenas Prácticas y Consejos

* **Estructura de Datos**:
  * **Prefiere datos anidados a subcolecciones para datos pequeños y fijos**: Si los datos siempre se leen junto con el documento padre y no son muy grandes, anidarlos es más simple.
  * **Usa subcolecciones para listas grandes y en crecimiento**: Si tienes una lista que puede crecer indefinidamente (ej. posts de un usuario), usa una subcolección.
  * **Desnormalización**: Duplica datos para evitar consultas complejas o costosas. Es una práctica común en NoSQL.
* **Consultas**:
  * **Índices Compuestos**: Crea los índices compuestos que Firestore te sugiera para tus consultas.
  * **Limita tus lecturas**: Firestore factura por lectura de documentos. Evita leer colecciones enteras si no es necesario.
* **Seguridad**:
  * **Nunca confíes en el cliente**: Implementa todas tus reglas de negocio importantes en tus Reglas de Seguridad.
  * **Pruebas Exhaustivas**: Usa el Simulador de Reglas para probar tus reglas de seguridad.
* **Transacciones y Lotes de Escritura**:
  * **Transacciones**: Para operaciones de lectura y escritura atómicas.
  * **Lotes de Escritura**: Para realizar múltiples escrituras como una sola operación.
* **Soporte Offline**: Confía en las capacidades offline de Firestore para una mejor experiencia de usuario.
* **Costos**: Entiende el modelo de precios de Firestore (basado en lecturas, escrituras, eliminaciones, y almacenamiento).
* **Firebase CLI**: Usa la CLI para desplegar reglas de seguridad e índices (`firebase deploy`).

---

Este cheatsheet te proporciona una referencia completa de Cloud Firestore, cubriendo sus conceptos esenciales, operaciones CRUD, consultas, escuchas en tiempo real, reglas de seguridad y las mejores prácticas para construir aplicaciones escalables y seguras.
