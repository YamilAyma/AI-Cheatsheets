---
title: "cebolla"
---


---

# 🧅 Arquitectura Cebolla (Onion Architecture) Cheatsheet Completo 🧅

La **Arquitectura Cebolla**, propuesta por Jeffrey Palermo, es un patrón de diseño de software que organiza el código en capas concéntricas, similar a las capas de una cebolla. El objetivo principal es **proteger y centralizar el modelo de dominio y la lógica de negocio**, haciéndolos independientes de la infraestructura (bases de datos, frameworks web, UI, servicios externos).

---

## 1. 🌟 Conceptos Clave

* **Dominio en el Centro**: El modelo de dominio es el corazón de la aplicación y la capa más interna.
* **Dependencias Hacia Adentro**: Las dependencias entre capas siempre apuntan hacia el centro. Las capas externas pueden depender de las capas internas, pero las capas internas no deben saber nada de las capas externas.
* **Inversión de Dependencias (Dependency Inversion Principle - DIP)**: Las interfaces (contratos) se definen en las capas más internas y las implementaciones concretas de esas interfaces se colocan en las capas externas. Un mecanismo de Inyección de Dependencias (DI) es crucial para conectar estas implementaciones.
* **Desacoplamiento**: Logra un alto grado de desacoplamiento entre las reglas de negocio y los detalles de implementación de la infraestructura.
* **Testabilidad**: Al aislar el dominio y la lógica de aplicación, se vuelven muy fáciles de probar de forma unitaria, sin necesidad de entornos complejos.
* **Flexibilidad Tecnológica**: Permite cambiar bases de datos, frameworks de UI/Web, o servicios externos con mínimo impacto en la lógica de negocio central.

---

## 2. 🌀 Las Capas (Círculos Concéntricos)

La Arquitectura Cebolla típicamente define cuatro capas principales, aunque el número exacto puede variar ligeramente en la práctica. Cada capa depende solo de las capas que están más cerca del centro.

### 2.1. 🔵 1. Dominio (Domain Layer) - El Núcleo Interno

* **Propósito**: Encapsula las reglas de negocio más fundamentales y agnósticas a la aplicación o la infraestructura. Es la capa más estable y la razón de ser del software.
* **Contenido**:
  * **Entidades**: Objetos que representan conceptos clave del negocio con identidad y ciclo de vida (ej. `Product`, `Order`, `Customer`).
  * **Objetos de Valor**: Objetos que representan un concepto descriptivo pero no tienen identidad (ej. `Address`, `Money`).
  * **Agregados**: Unidades consistentes del modelo de dominio.
  * **Eventos de Dominio**: Representan algo significativo que ocurrió en el dominio.
  * **Interfaces de Repositorio (Repository Interfaces)**: **¡Importante!** El dominio define las *interfaces* de cómo quiere persistir o recuperar sus entidades, pero no la implementación. (Ej. `IProductRepository`).
  * **Servicios de Dominio (Domain Services)**: Lógica de negocio que involucra múltiples entidades o agregados, y que no encaja naturalmente en una entidad individual.
* **Dependencias**: NO tiene dependencias de ninguna otra capa. Es la capa más interna y agnóstica.
* **Cambios**: Son los cambios más costosos, deben ser mínimos.

### 2.2. 🟢 2. Capa de Servicios de Dominio (Domain Services Layer)

* **Propósito**: Contiene la lógica de negocio que coordina múltiples entidades o agregados del dominio, o que necesita acceder a los puertos de salida (ej. repositorios) definidos en el Dominio.
* **Contenido**:
  * Implementaciones de los Servicios de Dominio definidos en la capa de Dominio.
  * Lógica de validación que abarca múltiples entidades.
* **Dependencias**: Depende únicamente de la capa de Dominio.

### 2.3. 🟡 3. Capa de Servicios de Aplicación (Application Services Layer)

* **Propósito**: Contiene la lógica de negocio específica de la aplicación o "casos de uso". Orquestra el modelo de dominio y los servicios de infraestructura para cumplir los requisitos funcionales de la aplicación.
* **Contenido**:
  * **Servicios de Aplicación / Casos de Uso (Application Services / Use Cases)**: Clases que implementan funcionalidades específicas de la aplicación (ej. `CreateProductUseCase`, `ProcessOrderService`).
  * **DTOs (Data Transfer Objects)**: Modelos de datos para la entrada (Request DTOs) y salida (Response DTOs) de esta capa, desacoplando los modelos de dominio de la interfaz de usuario/API.
  * Interfaces para la interacción con la infraestructura (si se necesita una capa de adaptadores independiente).
* **Dependencias**: Depende de la capa de Dominio y de la capa de Servicios de Dominio. Define interfaces para la capa de Infraestructura (ej. `IPaymentGateway`).

### 2.4. 🔴 4. Capa de Infraestructura (Infrastructure Layer)

* **Propósito**: Contiene todas las implementaciones concretas para las preocupaciones técnicas y externas. Es la capa más externa y volátil.
* **Contenido**:
  * **Implementaciones de Repositorios**: Clases que implementan las interfaces de Repositorio definidas en la capa de Dominio (ej. `JpaProductRepository`, `MongoDbUserRepository`).
  * **Clientes de Servicios Externos**: Clases que interactúan con APIs de terceros, sistemas de mensajería, etc.
  * **Frameworks Web**: Controladores, configuraciones de ruteo (ej. Spring MVC, Express.js, ASP.NET Core).
  * **Interfaces de Usuario (UI)**: Componentes de interfaz de usuario (React, Angular, WPF, WinForms).
  * **Base de Datos**: ORMs (Hibernate, Entity Framework), drivers de bases de datos.
  * **Logging, Autenticación, Configuración**: Implementaciones concretas de estos servicios.
* **Dependencias**: Depende de todas las capas internas para implementar sus interfaces. También depende directamente de frameworks y librerías externas.
* **Cambios**: Es la capa más propensa a cambios.

---

## 3. 🎯 La Regla de Dependencia

* **Principio "Hacia Adentro"**: "Las dependencias siempre fluyen hacia adentro." Una capa solo puede depender de las capas más internas que ella. **Las capas internas NO DEBEN depender de las capas externas.**
* **Inversión de Dependencias (DIP) en Acción**: Para que la capa de Dominio (o Servicios de Aplicación) pueda usar la capa de Infraestructura sin depender de ella, la capa interna define una interfaz (el "puerto"), y la capa externa proporciona la implementación (el "adaptador"). El contenedor de Inyección de Dependencias (DI) es quien "conecta" la implementación externa con la interfaz interna en tiempo de ejecución.

---

## 4. 🛠️ Estructura Práctica de Proyectos (Ejemplo C# / Java)

```
MyApplication.sln (Solución) / my-application (Proyecto Raíz)
├── MyApplication.Domain/     # Capa de Dominio (Proyecto o Módulo)
│   ├── Entities/
│   │   └── Product.cs / .java
│   ├── Services/             # Interfaces de Servicios de Dominio
│   │   └── IProductValidator.cs / .java
│   └── Repositories/         # Interfaces de Repositorios
│       └── IProductRepository.cs / .java
│
├── MyApplication.DomainServices/ # Capa de Servicios de Dominio (Proyecto o Módulo)
│   └── Services/
│       └── ProductValidator.cs / .java (Implementa IProductValidator)
│
├── MyApplication.Application/ # Capa de Servicios de Aplicación (Proyecto o Módulo)
│   ├── UseCases/
│   │   ├── CreateProduct/
│   │   │   ├── CreateProductCommand.cs / .java (Request DTO)
│   │   │   ├── CreateProductResponse.cs / .java (Response DTO)
│   │   │   └── ICreateProductUseCase.cs / .java
│   │   └── CreateProductUseCase.cs / .java (Implementa ICreateProductUseCase)
│   ├── Mappers/              # DTO Mappers (ej. Mapster, AutoMapper)
│   │   └── ProductMapper.cs / .java
│   └── Services/             # Otros servicios de aplicación
│
├── MyApplication.Infrastructure/ # Capa de Infraestructura (Proyecto o Módulo)
│   ├── Data/                 # Implementaciones de Repositorios
│   │   └── JpaProductRepository.cs / .java (Implementa IProductRepository)
│   ├── PersistenceModels/    # Entidades de ORM
│   │   └── ProductEntity.cs / .java
│   ├── ExternalServices/     # Clientes de APIs externas
│   │   └── ThirdPartyEmailService.cs / .java
│   └── Logging/
│       └── ConsoleLogger.cs / .java
│
├── MyApplication.WebUI/      # Capa de UI/Presentación (Proyecto o Módulo)
│   ├── Controllers/          # Controladores Web (ASP.NET Core / Spring MVC)
│   │   └── ProductsController.cs / .java (Usa ICreateProductUseCase)
│   ├── ViewModels/           # ViewModels para la UI
│   │   └── ProductViewModel.cs / .java
│   ├── Startup.cs / MainApp.java # Configuración de DI
│   └── appsettings.json / application.properties
│
├── MyApplication.Tests/      # Capa de Pruebas
│   ├── DomainTests/
│   ├── ApplicationTests/
│   └── InfrastructureTests/
```

---

## 5. 📈 Beneficios

* **Dominio Protegido**: El modelo de negocio central es inafectado por cambios en la tecnología externa.
* **Alta Testabilidad**: Las capas internas (Dominio, Servicios de Dominio, Servicios de Aplicación) son puras y desacopladas, lo que permite pruebas unitarias rápidas y efectivas sin dependencias de infraestructura.
* **Flexibilidad Extrema**: Facilita enormemente la migración entre tecnologías (cambiar de SQL a NoSQL, de REST a gRPC, de un framework web a otro) al reemplazar solo adaptadores.
* **Desarrollo Paralelo**: Diferentes equipos pueden trabajar en diferentes capas y adaptadores simultáneamente una vez que las interfaces están definidas.
* **Mantenibilidad Mejorada**: Los cambios de requisitos o tecnológicos suelen estar contenidos en sus respectivas capas.
* **Fomenta la Coherencia**: Al proteger el dominio, se mantiene una visión clara y consistente de las reglas de negocio.

---

## 6. ⚠️ Desventajas y Desafíos

* **Complejidad Inicial / Boilerplate**: Requiere más interfaces, DTOs y clases que una arquitectura monolítica simple, lo que puede ser una sobreingeniería para proyectos pequeños o prototipos.
* **Curva de Aprendizaje**: Los desarrolladores deben comprender profundamente el Principio de Inversión de Dependencias y la distinción entre las capas.
* **Mapeo de DTOs**: La conversión constante entre Entidades de Dominio, DTOs de Aplicación y Entidades de Persistencia puede generar código repetitivo, aunque herramientas como AutoMapper o MapStruct ayudan.
* **Navegación del Código**: Puede ser más difícil seguir el flujo de una solicitud a través de múltiples abstracciones y clases sin buenas herramientas de IDE.
* **Disciplina Requerida**: Un equipo debe adherirse estrictamente a la Regla de Dependencia para evitar que la arquitectura se deteriore.

---

## 7. 🤝 Relación con Otras Arquitecturas Limpias

La Arquitectura Cebolla, Hexagonal y Limpia son a menudo consideradas como variaciones o evoluciones del mismo concepto central. Todas comparten la idea de:

* **Capas Concéntricas**: Con la lógica de negocio en el centro.
* **Regla de Dependencia**: Las dependencias siempre apuntan hacia adentro.
* **Inversión de Dependencias**: Para lograr el desacoplamiento.
* **Independencia de la Infraestructura**: El objetivo final.
* **Arquitectura Hexagonal (Ports & Adapters)**: Es muy similar a la Arquitectura Cebolla. A menudo se considera que la Arquitectura Hexagonal es el "núcleo" de la Arquitectura Cebolla, con Puertos (interfaces) y Adaptadores (implementaciones) que conectan el interior con el exterior. La Arquitectura Cebolla a veces es más explícita al detallar las capas internas (Dominio, Servicios de Dominio, Servicios de Aplicación).
* **Arquitectura Limpia (Clean Architecture)**: Robert C. Martin (Uncle Bob) sintetizó ideas de la Arquitectura Hexagonal, la Arquitectura Cebolla y otras para crear su "Arquitectura Limpia". La Arquitectura Limpia es una generalización con cuatro anillos principales (Entidades, Casos de Uso, Adaptadores de Interfaz, Frameworks & Drivers), pero sus principios son casi idénticos.

En esencia, si entiendes una, entiendes las ideas fundamentales de todas ellas. La elección de una sobre otra a menudo se reduce a la terminología preferida o a matices de cómo se subdividen las capas internas.

---

## 8. 💡 Buenas Prácticas y Consejos

* **Comienza por el Dominio**: Diseña tu capa de Dominio primero, enfocándote en las reglas de negocio, independientemente de cómo se persistirán o presentarán.
* **Usa Inyección de Dependencias (DI)**: Es fundamental para implementar la Arquitectura Cebolla. Asegúrate de configurar tu contenedor de DI en la capa más externa (ej. WebUI o CLI App).
* **Evita la Fuga de Modelos**: No expongas tus entidades de dominio directamente a la capa de UI o Infraestructura. Usa DTOs y ViewModels para la comunicación entre capas.
* **Interfaces Claras y Precisas**: Define las interfaces de tus puertos de forma clara y concisa, especificando exactamente lo que necesitan o lo que ofrecen.
* **Testea las Capas Internas Primero**: Las capas de Dominio y Servicios de Aplicación son las más importantes y las más fáciles de probar. Concéntrate en pruebas unitarias exhaustivas para ellas.
* **Sé Pragmático**: Para proyectos muy pequeños, la complejidad inicial de la Arquitectura Cebolla puede ser excesiva. Evalúa los beneficios frente al costo inicial. Sin embargo, para sistemas medianos a grandes, es una inversión que vale la pena.
* **Nombres Descriptivos**: Nombra tus clases y proyectos de manera que reflejen su capa y su propósito para facilitar la navegación y el entendimiento.

---

Este cheatsheet te proporciona una referencia completa de la Arquitectura Cebolla, cubriendo sus principios fundamentales, la estructura de sus capas, la crucial regla de dependencia, sus beneficios y desafíos, y las mejores prácticas para implementar sistemas robustos, desacoplados y testables.
