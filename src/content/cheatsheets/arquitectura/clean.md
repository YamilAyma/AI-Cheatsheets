---
title: "clean"
---


---

# ⚪ Arquitectura Limpia (Clean Architecture) Cheatsheet Completo ⚪

La **Arquitectura Limpia** es una filosofía de diseño de software que propone una organización de código basada en capas concéntricas, donde las dependencias siempre apuntan hacia adentro. Su objetivo principal es hacer que el sistema sea independiente de frameworks, bases de datos, UI y cualquier otra agencia externa, priorizando las reglas de negocio.

---

## 1. 🌟 Principios Fundamentales

La Arquitectura Limpia se basa en varios principios clave, a menudo resumidos como las "5 Independencias":

1. **Independiente de Frameworks**: La arquitectura no depende de la existencia de alguna librería o framework. No estás atado a Express, Spring, React, Angular, etc.
2. **Testable**: Las reglas de negocio pueden ser probadas sin la UI, la base de datos, el servidor web, o cualquier otro elemento externo.
3. **Independiente de la UI**: La lógica de negocio no sabe nada sobre la interfaz de usuario.
4. **Independiente de la Base de Datos**: Las reglas de negocio no saben nada sobre la base de datos que utilizas (SQL, NoSQL, ORM, etc.).
5. **Independiente de Agencias Externas**: La lógica de negocio no depende de factores externos que puedan cambiar frecuentemente (servicios de terceros, APIs específicas).

---

## 2. 🌀 Las Capas (Círculos Concéntricos)

La Arquitectura Limpia organiza el código en capas concéntricas, donde cada círculo representa un área de funcionalidad. La regla de oro es la **Regla de Dependencia**: **las dependencias solo pueden apuntar hacia adentro.**

### 2.1. 🔵 1. Entidades (Entities) - El Núcleo Interno

* **Propósito**: Encapsulan las reglas de negocio empresariales (enterprise-wide business rules). Son los objetos de negocio más estables y fundamentales del sistema.
* **Contenido**: Objetos de dominio puros (POJOs/POCOs/Plain Objects) con propiedades y métodos que implementan la lógica esencial del negocio, incluso si no hay aplicación (ej. reglas de validación de un `Pedido`).
* **Dependencias**: NO tienen dependencias de ninguna otra capa. Son la capa más interna y agnóstica.
* **Cambios**: Deben ser las menos propensas a cambios.
* **Ejemplos**: `User`, `Order`, `Product`, `Account` (con sus validaciones internas y lógica básica).

### 2.2. 🟢 2. Casos de Uso / Interfaz de Aplicación (Use Cases / Application Business Rules)

* **Propósito**: Contienen las reglas de negocio específicas de la aplicación (application-specific business rules). Orchestran las Entidades para lograr los objetivos de la aplicación.
* **Contenido**:
  * **Interactores / Servicios de Aplicación**: Clases que implementan casos de uso específicos (ej. `CreateOrder`, `LoginUser`, `GetProductDetails`).
  * **Interfaces de Puertos de Entrada (`Input Port`)**: Definidas por los casos de uso para que los "drivers" (controladores de UI/API) las invoquen. Toman un "Request Model" como entrada.
  * **Interfaces de Puertos de Salida (`Output Port`)**: Definidas por los casos de uso para que los "adaptadores" (presentadores, pasarelas de datos) las implementen. Devuelven un "Response Model" como salida.
* **Dependencias**: Solo dependen de las Entidades.
* **Cambios**: Cambian cuando las reglas de negocio de la aplicación cambian.
* **Ejemplos**:
  * `CrearPedidoInteractor` (implements `CrearPedidoInputBoundary`)
  * `LoginUsuarioService` (implements `LoginUsuarioInputBoundary`)
  * Interfaces: `IOrderRepository`, `IUserRepository` (definidas aquí, implementadas en Interface Adapters).

### 2.3. 🟠 3. Adaptadores de Interfaz (Interface Adapters)

* **Propósito**: Convierten los datos del formato más conveniente para los casos de uso y entidades (ej. Request/Response Models) a un formato conveniente para las agencias externas (ej. JSON, filas de base de datos) y viceversa.
* **Contenido**:
  * **Controladores (Controllers) / APIs / Gateways UI**: Toman la entrada de la UI/API (ej. solicitud HTTP), la convierten en un "Request Model" para el Caso de Uso, e invocan el Caso de Uso.
  * **Presentadores (Presenters)**: Toman el "Response Model" del Caso de Uso y lo transforman en un "ViewModel" o datos para que la UI los muestre.
  * **Pasarelas de Base de Datos (Database Gateways / Repositories Implementations)**: Implementan las interfaces `IXXXRepository` definidas en la capa de Casos de Uso, traduciendo las operaciones de dominio a llamadas a la base de datos (SQL, ORM).
* **Dependencias**: Dependen de los Casos de Uso (de sus interfaces de entrada y salida) y de las Entidades. NO dependen de Frameworks & Drivers.
* **Cambios**: Cambian cuando la UI, el formato de la base de datos o una API externa cambian.
* **Ejemplos**:
  * `OrderController` (toma JSON HTTP, llama a `CrearPedidoInteractor`)
  * `ProductPresenter` (convierte `ProductResponseModel` a `ProductViewModel` para React/Angular)
  * `SQLUserRepository` (implementa `IUserRepository`, usando JPA/EF Core para interactuar con SQL).

### 2.4. 🔴 4. Frameworks & Drivers - El Anillo Exterior

* **Propósito**: La capa más externa. Contiene las implementaciones concretas de frameworks, librerías, bases de datos y la interfaz de usuario.
* **Contenido**:
  * **Base de Datos**: ORMs (Hibernate, Entity Framework), drivers de bases de datos.
  * **Web Frameworks**: Servidores web (Spring Boot, Express.js, ASP.NET Core), frameworks de UI (React, Vue, Angular).
  * **Herramientas y Utilidades**: Cualquier otra librería de terceros o implementación de bajo nivel.
* **Dependencias**: Dependen de las capas internas. Son las que cambian con más frecuencia, pero sus cambios no afectan a las capas internas.
* **Cambios**: Cambian cuando decides usar un nuevo framework, una nueva base de datos, o actualizas la versión principal de una librería.
* **Ejemplos**:
  * La configuración de `application.properties` en Spring Boot.
  * Las tablas y conexiones SQL.
  * Los componentes JSX de React que usan `useState`.
  * La implementación del servidor Express.js.

---

## 3. 🎯 La Regla de Dependencia (The Dependency Rule)

* **El Corazón de la Arquitectura Limpia**:

  * "Las dependencias del código fuente solo pueden apuntar hacia adentro."
  * Esto significa que el código en un círculo exterior puede depender del código en un círculo interior.
  * PERO, el código en un círculo interior **NO DEBE DEPENDER** del código en un círculo exterior.
* **Implementación**: Esta regla se aplica utilizando el **Principio de Inversión de Dependencias (DIP)**.

  * Las capas internas definen **interfaces** (puertos) que necesitan.
  * Las capas externas implementan estas interfaces (adaptadores).
  * La Inyección de Dependencias (DI) es crucial para "inyectar" las implementaciones externas en las interfaces internas.
* *Ejemplo de DIP:*

  1. `CasoDeUso` (Interna) necesita guardar datos. Define una interfaz: `interface IUserRepository { save(user: User): void; }`.
  2. `AdaptadorDeInterfaz` (Externa) implementa la interfaz: `class SQLUserRepository implements IUserRepository { /* ... lógica SQL ... */ }`.
  3. `Frameworks&Drivers` (Más externa) configura el contenedor de DI para que, cuando `IUserRepository` sea solicitada, se proporcione una instancia de `SQLUserRepository`.
  4. `CasoDeUso` recibe una `IUserRepository`, sin saber que es una implementación SQL.

---

## 4. 📈 Beneficios

* **Independencia Total**: Facilita el cambio de UI, base de datos, frameworks, etc., con mínimo impacto en las reglas de negocio.
* **Alta Testabilidad**: Las reglas de negocio (Entidades, Casos de Uso) son unidades de código puro, sin acoplamiento a detalles externos, lo que las hace muy fáciles de probar (pruebas unitarias rápidas).
* **Alta Mantenibilidad**: Los cambios en una capa (ej. UI) rara vez requieren cambios en las capas internas. La lógica de negocio está aislada y protegida.
* **Escalabilidad**: Facilita la distribución de responsabilidades y la colaboración en equipos grandes.
* **Coherencia de Negocio**: Asegura que la lógica de negocio central sea la más protegida y consistente, sin ser contaminada por preocupaciones técnicas.
* **Ciclo de Vida Más Largo**: El valor real de la aplicación (las reglas de negocio) se mantiene estable a lo largo del tiempo, sobreviviendo a los cambios de tecnología.

---

## 5. ⚠️ Desventajas y Desafíos

* **Mayor Complejidad Inicial / Boilerplate**: Requiere más archivos, interfaces y clases para una aplicación simple, lo que puede sentirse como una sobreingeniería ("over-engineering").
* **Curva de Aprendizaje**: El concepto de la Inversión de Dependencias y la gestión de modelos de entrada/salida para cada capa puede ser difícil de entender inicialmente.
* **Over-Engineering en Pequeños Proyectos**: Para aplicaciones muy pequeñas o prototipos, la sobrecarga de la Arquitectura Limpia puede ser innecesaria y ralentizar el desarrollo.
* **Navegación del Código**: Puede ser más difícil navegar entre múltiples archivos y capas, especialmente sin buenas herramientas de IDE.
* **Rigidez Inicial**: Requiere disciplina y un entendimiento claro desde el principio. Una implementación incorrecta puede llevar a un "big ball of mud" con más capas.

---

## 6. 💡 Notas de Implementación Práctica

* **Estructura de Directorios**: A menudo, la estructura de directorios del proyecto refleja las capas (ej. `src/domain`, `src/application`, `src/infrastructure`, `src/presentation`).
* **Modelos de Datos Dedicados**: Utiliza modelos de datos específicos para cada capa:
  * `Entidades` (Domain Models): En la capa de `Entities`.
  * `Request/Response Models` (DTOs): En la capa de `Use Cases` (para comunicación entre casos de uso y adaptadores).
  * `ViewModels` (para UI): En la capa de `Interface Adapters` (para la UI).
  * `Entidades de Base de Datos`: En la capa de `Frameworks & Drivers` (mapeos de ORM).
* **Inyección de Dependencias (DI)**: Es una herramienta esencial para implementar la Inversión de Dependencias. Utiliza un contenedor de DI (ej. Spring IoC, Koin, Ninject, inversifyJS, o construir uno simple).
* **Pragmatismo**: No todas las aplicaciones necesitan el 100% de la pureza de la Arquitectura Limpia. Sé pragmático y aplica los principios donde el beneficio sea mayor (ej. en la lógica de negocio compleja).
* **Nivel de Granularidad**: Decide qué nivel de granularidad es apropiado para tus Casos de Uso (ej. ¿un caso de uso por operación, o un servicio por agregado de dominio?).

---

## 7. 🤝 Conceptos Relacionados

* **Arquitectura Hexagonal (Ports & Adapters)**: Un precursor y concepto hermano de la Arquitectura Limpia. Se enfoca en aislar el núcleo de la aplicación de los detalles externos a través de "puertos" (interfaces) y "adaptadores" (implementaciones).
* **Arquitectura Cebolla (Onion Architecture)**: Otro modelo concéntrico muy similar, con énfasis en el dominio como el núcleo.
* **DDD (Domain-Driven Design)**: A menudo se utiliza junto con la Arquitectura Limpia para modelar dominios complejos, ya que la capa de Entidades/Dominio es el corazón de ambos.
* **Principios SOLID**: La Arquitectura Limpia encarna y se beneficia fuertemente de los principios SOLID, especialmente del Principio de Inversión de Dependencias (DIP).

---

Este cheatsheet te proporciona una referencia completa de la Arquitectura Limpia, cubriendo sus principios fundamentales, la estructura de sus capas, la crucial regla de dependencia, sus beneficios y desafíos, y las mejores prácticas para implementarla en tus proyectos de software.
