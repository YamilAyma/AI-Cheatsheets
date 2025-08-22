¡Excelente elección! TypeScript es una herramienta fundamental en el desarrollo web moderno, especialmente para proyectos a gran escala, ya que añade seguridad de tipo y mejoras en la productividad. Aquí tienes un "cheatsheet" completo y bien estructurado de TypeScript, optimizado para ser claro y conciso para una IA conversacional.

---

# 🟦 TypeScript Cheatsheet Completo 🟦

TypeScript es un superset de JavaScript que añade tipado estático opcional al lenguaje. Se compila a JavaScript plano, lo que significa que cualquier código JavaScript válido es también código TypeScript válido. Su objetivo principal es ayudar a los desarrolladores a construir aplicaciones más robustas y escalables, detectando errores de tipo en tiempo de desarrollo.

---

## 1. 🌟 Conceptos Clave

* **Tipado Estático**: Permite definir los tipos de variables, funciones y objetos en tiempo de desarrollo, lo que ayuda a prevenir errores comunes antes de ejecutar el código.
* **Superset de JavaScript**: TypeScript incluye todas las características de JavaScript (ES6+), más sus propias características de tipado.
* **Compilación**: El código TypeScript (`.ts` o `.tsx`) se transpila a JavaScript (`.js`) para poder ser ejecutado por navegadores o Node.js.
* **Inferencia de Tipos**: TypeScript es lo suficientemente inteligente como para deducir el tipo de una variable en muchos casos, eliminando la necesidad de anotarlo explícitamente.
* **Editor Support**: Los IDEs y editores de código (VS Code, WebStorm) ofrecen un excelente soporte para TypeScript, con autocompletado, refactorización y detección de errores en tiempo real.

---

## 2. 🛠️ Configuración Inicial

1. **Instalación del Compilador (Global):**
   ```bash
   npm install -g typescript
   # o
   yarn global add typescript
   ```
2. **Inicializar Proyecto (`tsconfig.json`):**
   * Crea un archivo `tsconfig.json` en la raíz de tu proyecto. Este archivo configura cómo el compilador de TypeScript (`tsc`) compilará tus archivos.

   ```bash
   tsc --init
   ```
3. **Compilar TypeScript:**
   ```bash
   tsc # Compila todos los archivos .ts según tsconfig.json
   tsc myFile.ts # Compila un archivo específico
   tsc --watch # Compila automáticamente los cambios
   ```

### `tsconfig.json` (Opciones Comunes)

```json
{
  "compilerOptions": {
    "target": "ESNext",         // Versión de JS a la que compilar (ej. "ES2016", "ESNext")
    "module": "ESNext",         // Sistema de módulos (ej. "CommonJS", "ESNext")
    "strict": true,             // Habilita todas las opciones de comprobación de tipo estricta (recomendado)
    "esModuleInterop": true,    // Permite la interoperabilidad entre módulos CommonJS y ES
    "skipLibCheck": true,       // Omite la comprobación de tipos de archivos de declaración (d.ts)
    "forceConsistentCasingInFileNames": true, // Impide referencias inconsistentes al mismo archivo
    "outDir": "./dist",         // Directorio de salida para los archivos JS compilados
    "rootDir": "./src",         // Directorio raíz de los archivos TS
    "declaration": true,        // Genera archivos .d.ts para tus módulos
    "sourceMap": true,          // Genera archivos .map para depuración
    "jsx": "react-jsx"          // Para proyectos React/JSX ("preserve", "react", "react-jsx")
  },
  "include": ["src/**/*"],  // Archivos a incluir en la compilación
  "exclude": ["node_modules", "dist"] // Archivos a excluir
}
```

---

## 3. 🧩 Tipos Básicos

* **`number`**: Números (enteros y flotantes).
  ```typescript
  let age: number = 30;
  let pi: number = 3.14;
  ```
* **`string`**: Cadenas de texto.
  ```typescript
  let name: string = "Alice";
  ```
* **`boolean`**: Valores verdadero/falso.
  ```typescript
  let isActive: boolean = true;
  ```
* **`null`**: El valor `null`.
  ```typescript
  let value: null = null;
  ```
* **`undefined`**: El valor `undefined`.
  ```typescript
  let data: undefined = undefined;
  ```
* **`symbol`**: Valores únicos e inmutables.
  ```typescript
  let id: symbol = Symbol("id");
  ```
* **`bigint`**: Enteros de precisión arbitraria.
  ```typescript
  let bigNumber: bigint = 9007199254740991n;
  ```
* **`any`**: Tipo comodín. Desactiva la comprobación de tipo para esa variable. **Usar con precaución.**
  ```typescript
  let anything: any = "hello";
  anything = 123;
  ```
* **`unknown`**: Similar a `any`, pero más seguro. Debes refinar su tipo antes de usarlo.
  ```typescript
  let unknownValue: unknown = "test";
  if (typeof unknownValue === "string") {
    console.log(unknownValue.toUpperCase()); // Ahora es seguro usar métodos de string
  }
  ```
* **`void`**: Para funciones que no devuelven ningún valor.
  ```typescript
  function logMessage(): void {
    console.log("Mensaje.");
  }
  ```
* **`never`**: Representa un valor que nunca ocurre (ej. funciones que lanzan un error o bucles infinitos).
  ```typescript
  function throwError(message: string): never {
    throw new Error(message);
  }
  ```

---

## 4. 📝 Anotaciones de Tipo

### 4.1. Variables

```typescript
let count: number = 5;
let username: string = "Juan";
let isActiveUser: boolean = false;
```

### 4.2. Parámetros de Función y Retorno

```typescript
function add(a: number, b: number): number {
  return a + b;
}

const greet = (name: string): string => `Hello, ${name}`;

function log(message: string): void {
  console.log(message);
}
```

---

## 5. 📦 Tipos Complejos

### 5.1. Arrays

```typescript
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Ana", "Luis"]; // Sintaxis genérica
```

### 5.2. Objetos

```typescript
let user: { id: number; name: string; isActive?: boolean } = { // `?` para propiedad opcional
  id: 1,
  name: "Carlos",
};

user.isActive = true;
```

### 5.3. Tuplas

Arrays con un número fijo de elementos y tipos específicos en cada posición.

```typescript
let person: [string, number] = ["Maria", 28];
// let invalidPerson: [string, number] = [28, "Maria"]; // Error
```

---

## 6. 🤝 Uniones e Intersecciones

### 6.1. Tipos de Unión (`|`)

Un valor puede ser de uno de los tipos especificados.

```typescript
let id: number | string = 123;
id = "abc"; // Válido
// id = true; // Error

function printId(id: number | string): void {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}
```

### 6.2. Tipos de Intersección (`&`)

Combina múltiples tipos en uno solo, un valor debe ser de *todos* los tipos.

```typescript
type Draggable = {
  drag: () => void;
};

type Resizable = {
  resize: () => void;
};

type UIWidget = Draggable & Resizable; // Debe tener ambos métodos

let widget: UIWidget = {
  drag: () => console.log("Dragging"),
  resize: () => console.log("Resizing"),
};
```

---

## 7. 🏷️ Tipos Personalizados

### 7.1. Interfaces

Definen la forma de los objetos. Pueden ser implementadas por clases y extendidas.

```typescript
interface User {
  readonly id: number; // Propiedad de solo lectura
  name: string;
  email?: string; // Propiedad opcional
}

interface AdminUser extends User { // Extiende la interfaz User
  role: "admin" | "superadmin"; // Tipo literal de unión
  permissions: string[];
}

const normalUser: User = { id: 1, name: "Alice" };
const admin: AdminUser = { id: 2, name: "Bob", role: "admin", permissions: ["manage_users"] };

// normalUser.id = 3; // Error: id es readonly
```

### 7.2. Alias de Tipo (`type`)

Crea un nuevo nombre para un tipo existente. Puede ser usado para cualquier tipo (primitivos, uniones, tuplas, objetos). No puede ser implementado por clases, pero puede ser extendido por intersecciones.

```typescript
type Age = number;
type UserID = string | number;

type Point = {
  x: number;
  y: number;
};

type CardSuit = "Clubs" | "Diamonds" | "Hearts" | "Spades"; // Tipos literales

const myAge: Age = 25;
const center: Point = { x: 10, y: 20 };
const suit: CardSuit = "Clubs";
```

**Diferencias clave `interface` vs `type`**:

* `interface` puede ser `declarada` varias veces y se fusionarán (Declaration Merging). `type` no.
* `interface` se usa para definir la forma de `objetos` principalmente, y para clases.
* `type` es más flexible, puede aliasar primitivos, uniones, intersecciones, etc.
* Generalmente, `interface` para objetos/clases, `type` para todo lo demás o cuando se necesiten las características específicas de `type`.

---

## 8. 📊 Enums

Conjuntos de constantes con nombres fáciles de usar.

```typescript
enum Direction {
  Up,    // 0 por defecto
  Down,  // 1
  Left,  // 2
  Right  // 3
}
console.log(Direction.Up); // 0
console.log(Direction[0]); // "Up"

enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING"
}
console.log(Status.Active); // "ACTIVE"

// Uso con otros tipos
function setUserStatus(status: Status): void {
  console.log(`User status set to: ${status}`);
}
setUserStatus(Status.Active);
```

---

## 9. 🚀 Genéricos (`Generics`)

Permiten escribir componentes o funciones que pueden trabajar con una variedad de tipos en lugar de uno solo, sin perder la seguridad de tipos.

```typescript
function identity<T>(arg: T): T { // `T` es un placeholder para el tipo
  return arg;
}

let output1 = identity<string>("myString"); // output1 es de tipo string
let output2 = identity<number>(100);       // output2 es de tipo number

interface Box<T> { // Interfaz genérica
  value: T;
}

const stringBox: Box<string> = { value: "Hello" };
const numberBox: Box<number> = { value: 123 };

// Restricciones de tipo (Constraints)
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T { // `T` debe tener una propiedad `length`
  console.log(arg.length);
  return arg;
}

loggingIdentity("hello"); // Válido
loggingIdentity([1, 2, 3]); // Válido
// loggingIdentity(5); // Error: number no tiene 'length'
```

---

## 10. 🏷️ Afirmaciones de Tipo (`Type Assertions`)

Le dices al compilador que sabes más sobre el tipo de un valor de lo que él puede inferir. No realizan comprobaciones en tiempo de ejecución.

* Sintaxis `as type` (preferida en TSX).
* Sintaxis `<type>value`.

```typescript
let someValue: unknown = "this is a string";

let strLength: number = (someValue as string).length; // "someValue" es tratado como string
// let strLength: number = (<string>someValue).length; // Sintaxis alternativa

const inputElement = document.getElementById("myInput") as HTMLInputElement;
// inputElement.value ahora tiene acceso a la propiedad 'value'
```

---

## 11. 🛡️ Guardas de Tipo (`Type Guards`)

Permiten reducir el tipo de una variable dentro de un bloque condicional.

* **`typeof`**: Para tipos primitivos.
* **`instanceof`**: Para clases.
* **Guardas de Tipo Personalizadas**: Funciones que devuelven un predicado de tipo (`parameter is Type`).

```typescript
// typeof
function printValue(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toLowerCase()); // 'value' es string aquí
  } else {
    console.log(value.toFixed(2)); // 'value' es number aquí
  }
}

// instanceof
class Cat {
  meow() { console.log("Meow!"); }
}
class Dog {
  bark() { console.log("Woof!"); }
}

function makeSound(animal: Cat | Dog) {
  if (animal instanceof Cat) {
    animal.meow();
  } else {
    animal.bark();
  }
}

// Guarda de Tipo Personalizada
interface Bird {
  fly: () => void;
}
interface Fish {
  swim: () => void;
}

function isBird(pet: Bird | Fish): pet is Bird { // Predicado de tipo
  return (pet as Bird).fly !== undefined;
}

function move(pet: Bird | Fish) {
  if (isBird(pet)) {
    pet.fly();
  } else {
    pet.swim();
  }
}
```

---

## 12. 👻 Nulos y Definidos (`Null` & `Undefined`)

* **`strictNullChecks`**: Opción del compilador (muy recomendada). Si es `true`, `null` y `undefined` solo pueden ser asignados a `any`, sus propios tipos, o uniones que los incluyan.

  ```typescript
  let username: string = "Bob";
  // username = null; // Error si strictNullChecks es true
  let optionalName: string | null = null; // Válido
  ```
* **Encadenamiento Opcional (`?.`)**: Accede a propiedades de un objeto que podría ser `null` o `undefined` sin lanzar un error.

  ```typescript
  interface UserProfile {
    name: string;
    address?: {
      street: string;
      city: string;
    };
  }

  let user: UserProfile = { name: "John" };
  console.log(user.address?.street); // undefined (no hay error)
  ```
* **Coalescencia Nula (`??`)**: Proporciona un valor por defecto si una expresión es `null` o `undefined` (a diferencia de `||` que también captura `0`, `""`, `false`).

  ```typescript
  let value: number | null = null;
  let result = value ?? 100; // result es 100
  let emptyString: string = "";
  let name = emptyString ?? "Default Name"; // name es ""
  ```
* **Operador de Asignación No Nula (`!`)**: Le dice al compilador que sabes que una variable no será `null` o `undefined` en ese punto. **Usar con extrema precaución.**

  ```typescript
  function greet(name: string | null) {
    // console.log(name.toUpperCase()); // Error si strictNullChecks es true
    console.log(name!.toUpperCase()); // Asume que 'name' no será null
  }
  greet("Alice");
  // greet(null); // Esto causaría un error en tiempo de ejecución
  ```

---

## 13. 🛠️ Tipos de Utilidad (Built-in Utility Types)

Funciones genéricas que transforman tipos.

* **`Partial<T>`**: Hace que todas las propiedades de `T` sean opcionales.
  ```typescript
  interface Todo { title: string; description: string; completed: boolean; }
  type PartialTodo = Partial<Todo>; // { title?: string; description?: string; completed?: boolean; }
  ```
* **`Readonly<T>`**: Hace que todas las propiedades de `T` sean de solo lectura.
  ```typescript
  type ReadonlyTodo = Readonly<Todo>; // { readonly title: string; readonly description: string; readonly completed: boolean; }
  ```
* **`Pick<T, K>`**: Construye un tipo seleccionando un conjunto de propiedades `K` de `T`.
  ```typescript
  type TodoPreview = Pick<Todo, "title" | "completed">; // { title: string; completed: boolean; }
  ```
* **`Omit<T, K>`**: Construye un tipo seleccionando todas las propiedades de `T` excepto `K`.
  ```typescript
  type TodoWithoutDescription = Omit<Todo, "description">; // { title: string; completed: boolean; }
  ```
* **`Exclude<UnionType, ExcludedMembers>`**: Excluye de `UnionType` todos los miembros que son asignables a `ExcludedMembers`.
  ```typescript
  type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
  ```
* **`Extract<Type, Union>`**: Extrae de `Type` todos los miembros que son asignables a `Union`.
  ```typescript
  type T0 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
  ```
* **`NonNullable<T>`**: Excluye `null` y `undefined` de `T`.
  ```typescript
  type T0 = NonNullable<string | number | undefined>; // string | number
  ```
* **`Parameters<T>`**: Obtiene los tipos de los parámetros de una función `T` como una tupla.
  ```typescript
  function f1(arg: { a: number, b: string }) {}
  type T0 = Parameters<typeof f1>; // [{ a: number, b: string }]
  ```
* **`ReturnType<T>`**: Obtiene el tipo de retorno de una función `T`.
  ```typescript
  type T0 = ReturnType<typeof f1>; // void
  ```
* **`Awaited<T>`**: Extrae el tipo resuelto de una Promesa.
  ```typescript
  type PromiseType = Promise<string>;
  type Result = Awaited<PromiseType>; // string
  ```

---

## 14. 💡 Buenas Prácticas y Consejos

* **Habilita `strict` en `tsconfig.json`**: Esto activa todas las comprobaciones de tipo estrictas y ayuda a escribir código más robusto.
* **Inferencia vs. Anotación**: Deja que TypeScript infiera los tipos cuando sea obvio. Anota explícitamente cuando no sea claro, para parámetros de función, y para retornos de función.
* **Usa `interface` para objetos/clases, `type` para todo lo demás**: Una convención común que ayuda a la consistencia.
* **Evita `any` siempre que sea posible**: `any` derrota el propósito de TypeScript. Usa `unknown` si el tipo es verdaderamente desconocido y luego refínalo con guardas de tipo.
* **Escribe tests para tipos complejos**: Si tienes transformaciones de tipo o lógica compleja, usa `expectType` (de librerías como `dts-jest` o `tsd`) para verificar que tus tipos se comportan como esperas.
* **Organiza tus tipos**: Coloca las definiciones de tipo en archivos `.d.ts` (declaración) o en archivos `.ts` dedicados cuando los tipos sean complejos o reutilizables.
* **Aprovecha el IDE**: Tu editor de código es tu mejor amigo con TypeScript. Usa el autocompletado, la refactorización y la detección de errores.
* **Documenta tus tipos**: Para tipos complejos o API públicas, añade comentarios JSDoc para explicar su propósito.
* **Aprende sobre `utility types`**: Te ahorrarán mucho tiempo y código repetitivo.

---

Este cheatsheet te proporciona una referencia completa y concisa de TypeScript, cubriendo los fundamentos y las características esenciales para escribir código seguro, mantenible y escalable.
