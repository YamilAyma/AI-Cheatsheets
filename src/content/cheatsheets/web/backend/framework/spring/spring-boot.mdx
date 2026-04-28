---
title: "spring-boot"
---

¡Absolutamente! Spring Boot es un framework increíble para construir aplicaciones Java robustas y de alto rendimiento de manera rápida y eficiente. Aquí tienes un "cheatsheet" completo y bien estructurado, optimizado para ser claro y conciso para una IA conversacional.

---

# ☕ Spring Boot Cheatsheet Completo ☕

Spring Boot es un framework basado en Spring Framework, diseñado para simplificar el proceso de desarrollo y despliegue de aplicaciones Java, especialmente microservicios y APIs RESTful. Se enfoca en la "convención sobre configuración" para que puedas empezar a codificar más rápido.

---

## 1. 🌟 Conceptos Clave

* **Autoconfiguración**: Spring Boot detecta automáticamente las dependencias en tu classpath (ej. si tienes `spring-web`, configura un servidor web embebido).
* **Servidores Embebidos**: Incluye servidores web como Tomcat, Jetty o Undertow directamente en el archivo JAR ejecutable, eliminando la necesidad de desplegar WARs en servidores de aplicaciones externos.
* **Starters**: Conjuntos de descriptores de dependencias que agrupan todas las librerías necesarias para una funcionalidad común (ej. `spring-boot-starter-web` para desarrollo web, `spring-boot-starter-data-jpa` para acceso a datos).
* **Convención sobre Configuración**: Reduce la cantidad de configuración manual necesaria, proporcionando valores por defecto sensatos.
* **Aplicaciones Standalone**: Permite ejecutar tu aplicación como un JAR independiente con un comando `java -jar`.
* **Actuator**: Proporciona endpoints de monitoreo y gestión para la aplicación en producción.

---

## 2. 🛠️ Configuración Inicial (Generación de Proyecto)

La forma más común de iniciar un proyecto Spring Boot es usando **Spring Initializr**.

* **Web**: [https://start.spring.io/](https://start.spring.io/)
* **CLI**: `spring init --dependencies=web,data-jpa my-project` (Si tienes Spring Boot CLI instalado)

**Dependencias Básicas Comunes (en `pom.xml` para Maven o `build.gradle` para Gradle):**

```xml
<!-- Maven (pom.xml) -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId> <!-- Para APIs REST, incluye Tomcat -->
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId> <!-- Para persistencia con JPA -->
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId> <!-- Base de datos en memoria para desarrollo -->
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId> <!-- Para pruebas -->
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 3. 📝 Anotaciones Esenciales

Las anotaciones son el corazón de Spring Boot para configurar y definir componentes.

### 3.1. Aplicación Principal

* **`@SpringBootApplication`**: Combina `@Configuration`, `@EnableAutoConfiguration`, y `@ComponentScan`. Se usa en la clase principal de la aplicación.
  ```java
  import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;

  @SpringBootApplication
  public class MyAppApplication {
      public static void main(String[] args) {
          SpringApplication.run(MyAppApplication.class, args);
      }
  }
  ```

### 3.2. Componentes y Configuración

* **`@Component`**: Anotación genérica para indicar que una clase es un "componente" de Spring y debe ser gestionada por el contenedor IoC.
* **`@Service`**: Especialización de `@Component` para la capa de servicio (lógica de negocio).
* **`@Repository`**: Especialización de `@Component` para la capa de persistencia (acceso a base de datos).
* **`@Controller`**: Especialización de `@Component` para la capa de controladores (manejo de peticiones web).
* **`@RestController`**: Combinación de `@Controller` y `@ResponseBody`. Indica que el resultado de los métodos debe serializarse directamente en el cuerpo de la respuesta HTTP (común para APIs REST).
* **`@Configuration`**: Indica que una clase contiene definiciones de beans (métodos anotados con `@Bean`).
* **`@Bean`**: Anotación de método que indica que el valor devuelto por el método debe ser registrado como un bean en el contenedor IoC de Spring.

  ```java
  @Configuration
  public class AppConfig {
      @Bean
      public MyService myService() {
          return new MyServiceImpl();
      }
  }
  ```

### 3.3. Inyección de Dependencias (IoC)

* **`@Autowired`**: Inyecta automáticamente una instancia de un bean compatible en un campo, constructor o método.
  ```java
  @Service
  public class UserService {
      @Autowired // Inyección por campo
      private UserRepository userRepository;

      // O inyección por constructor (preferido)
      // public UserService(UserRepository userRepository) {
      //     this.userRepository = userRepository;
      // }
  }
  ```

### 3.4. Desarrollo Web (APIs REST)

* **`@RequestMapping("/api/users")`**: Mapea una clase o método a una URL. Puede usarse con métodos HTTP específicos.
* **`@GetMapping("/users")`**: Mapea un método a una petición GET.
* **`@PostMapping("/users")`**: Mapea un método a una petición POST.
* **`@PutMapping("/users/{id}")`**: Mapea un método a una petición PUT.
* **`@DeleteMapping("/users/{id}")`**: Mapea un método a una petición DELETE.
* **`@PatchMapping("/users/{id}")`**: Mapea un método a una petición PATCH.
* **`@PathVariable("id")`**: Extrae un valor de la URL (ej. `/users/123` -> `id=123`).
* **`@RequestParam("name")`**: Extrae un parámetro de la cadena de consulta (query parameter) (ej. `/users?name=John`).
* **`@RequestBody`**: Mapea el cuerpo de la petición HTTP a un objeto Java (Spring Boot lo deserializa automáticamente desde JSON/XML).
* **`@ResponseBody`**: Indica que el valor de retorno de un método debe serializarse directamente al cuerpo de la respuesta HTTP (implícito con `@RestController`).
* **`@ResponseStatus(HttpStatus.CREATED)`**: Define el código de estado HTTP de la respuesta.
* **`ResponseEntity<T>`**: Permite un control total sobre la respuesta HTTP (cuerpo, cabeceras, código de estado).

  ```java
  @RestController
  @RequestMapping("/api/products")
  public class ProductController {
      @Autowired
      private ProductService productService;

      @GetMapping
      public List<Product> getAllProducts() {
          return productService.findAll();
      }

      @GetMapping("/{id}")
      public ResponseEntity<Product> getProductById(@PathVariable Long id) {
          return productService.findById(id)
                  .map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
      }

      @PostMapping
      @ResponseStatus(HttpStatus.CREATED)
      public Product createProduct(@RequestBody Product product) {
          return productService.save(product);
      }
  }
  ```

### 3.5. Acceso a Datos (JPA y Spring Data JPA)

* **`@Entity`**: Marca una clase como una entidad JPA (mapeada a una tabla de base de datos).
* **`@Table(name = "my_products")`**: Especifica el nombre de la tabla si es diferente al nombre de la clase.
* **`@Id`**: Marca un campo como la clave primaria de la entidad.
* **`@GeneratedValue(strategy = GenerationType.IDENTITY)`**: Configura la generación automática del ID.
* **`@Column(name = "prod_name", nullable = false, unique = true)`**: Configura propiedades de la columna.
* **`@Transient`**: Excluye un campo del mapeo de la base de datos.
* **`@NoRepositoryBean`**: Evita que Spring Data cree una implementación para esta interfaz (para interfaces base personalizadas).
* **`JpaRepository<T, ID>`**: Interfaz clave de Spring Data JPA que proporciona métodos CRUD y de paginación/ordenación por defecto.

  ```java
  import jakarta.persistence.*; // O javax.persistence si usas JavaEE/JakartaEE 8 o anterior

  @Entity
  @Table(name = "products")
  public class Product {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      private String name;
      private double price;
      // Getters y Setters
  }

  import org.springframework.data.jpa.repository.JpaRepository;
  import org.springframework.stereotype.Repository;

  @Repository // No estrictamente necesario con JpaRepository, pero buena práctica
  public interface ProductRepository extends JpaRepository<Product, Long> {
      // Spring Data JPA generará automáticamente la implementación
      List<Product> findByNameContaining(String name); // Ejemplo de método derivado de consulta
  }
  ```

---

## 4. ⚙️ Configuración de Aplicación (`application.properties` / `application.yml`)

Puedes configurar tu aplicación usando archivos de propiedades o YAML.

### 4.1. `application.properties` (Formato clave=valor)

```properties
server.port=8081
spring.datasource.url=jdbc:h2:mem:mydb
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true # Habilita la consola H2 para desarrollo

# Configuración JPA (Hibernate)
spring.jpa.hibernate.ddl-auto=update # create, create-drop, validate, none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Logging
logging.level.root=INFO
logging.level.org.springframework.web=DEBUG
logging.level.com.example.myapp=DEBUG # Tu paquete base
```

### 4.2. `application.yml` (Formato YAML)

```yaml
server:
  port: 8081
spring:
  datasource:
    url: jdbc:h2:mem:mydb
    username: sa
    password: password
  h2:
    console:
      enabled: true
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
logging:
  level:
    root: INFO
    org.springframework.web: DEBUG
    com.example.myapp: DEBUG
```

---

## 5. 🪵 Logging

Spring Boot usa SLF4J con Logback por defecto.

* Puedes configurar los niveles de logging en `application.properties`/`application.yml`.
* Usa una interfaz de logger (ej. `org.slf4j.Logger`) en tus clases:
  ```java
  import org.slf4j.Logger;
  import org.slf4j.LoggerFactory;

  @Service
  public class MyService {
      private static final Logger logger = LoggerFactory.getLogger(MyService.class);

      public void doSomething() {
          logger.info("Doing something important...");
          logger.debug("Debug message here.");
          logger.error("An error occurred!");
      }
  }
  ```

---

## 6. 🧑‍💻 Perfiles (Profiles)

Permiten configurar propiedades y beans diferentes para distintos entornos (ej. `dev`, `prod`, `test`).

* **`@Profile("dev")`**: Anota un componente o configuración para que solo se active en un perfil específico.
* **Archivos de Propiedades Específicos**:
  * `application-dev.properties`
  * `application-prod.yml`
* **Activación de Perfiles**:
  * **En `application.properties`**: `spring.profiles.active=dev`
  * **Línea de comandos**: `java -jar myapp.jar --spring.profiles.active=prod`
  * **Variable de entorno**: `SPRING_PROFILES_ACTIVE=test`

---

## 7. 📈 Spring Boot Actuator

Proporciona endpoints para monitorear y gestionar tu aplicación en producción.

* **Dependencia**: `spring-boot-starter-actuator`
* **Configuración (ej. en `application.properties`)**:
  ```properties
  management.endpoints.web.exposure.include=* # Expone todos los endpoints
  management.endpoint.health.show-details=always # Muestra detalles de salud
  ```
* **Endpoints comunes (accesibles en `http://localhost:8080/actuator/`):**
  * `/health`: Estado de salud de la aplicación (base de datos, disco, etc.).
  * `/info`: Información personalizada de la aplicación.
  * `/beans`: Lista de todos los beans en el contexto de la aplicación.
  * `/env`: Variables de entorno y propiedades de configuración.
  * `/metrics`: Métricas de la aplicación (CPU, memoria, HTTP requests, etc.).
  * `/loggers`: Ver y cambiar los niveles de log en tiempo de ejecución.

---

## 8. 🧪 Testing

Spring Boot facilita el testing con su módulo de test.

* **`@SpringBootTest`**: Carga el contexto completo de la aplicación. Ideal para tests de integración.
  ```java
  import org.springframework.boot.test.context.SpringBootTest;
  import org.springframework.test.context.junit.jupiter.SpringExtension;
  import org.junit.jupiter.api.Test;
  import static org.junit.jupiter.api.Assertions.assertTrue;

  @SpringBootTest
  class MyAppApplicationTests {
      @Test
      void contextLoads() {
          assertTrue(true); // Verifica que el contexto se carga correctamente
      }
  }
  ```
* **`@WebMvcTest`**: Para probar controladores web sin cargar el contexto completo de Spring. Ideal para tests de unidad de controladores.
  * Se usa con `MockMvc` para simular peticiones HTTP.

  ```java
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
  import org.springframework.test.web.servlet.MockMvc;
  import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
  import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

  @WebMvcTest(ProductController.class) // Especifica el controlador a probar
  class ProductControllerTest {
      @Autowired
      private MockMvc mockMvc;

      @Test
      void shouldReturnDefaultMessage() throws Exception {
          mockMvc.perform(get("/api/products"))
                 .andExpect(status().isOk());
      }
  }
  ```
* **`@DataJpaTest`**: Para probar componentes de JPA (repositorios) con una base de datos en memoria.
* **`@MockBean`**: Permite añadir mocks al contexto de la aplicación para aislar los componentes.

---

## 9. 🚀 Ejecución y Despliegue

* **Maven**:
  * Limpiar y empaquetar: `mvn clean package`
  * Ejecutar JAR: `java -jar target/myapp-0.0.1-SNAPSHOT.jar`
* **Gradle**:
  * Limpiar y empaquetar: `gradle clean build`
  * Ejecutar JAR: `java -jar build/libs/myapp-0.0.1-SNAPSHOT.jar`
* **En IDE (IntelliJ, Eclipse)**: Ejecutar la clase principal con `@SpringBootApplication`.

---

## 10. 💡 Buenas Prácticas y Consejos

* **Estructura de Carpetas**: Sigue la convención de paquetes por capas (ej. `com.example.app.controller`, `com.example.app.service`, `com.example.app.repository`, `com.example.app.model`).
* **Inyección por Constructor**: Preferible a la inyección por campo (`@Autowired`) porque facilita las pruebas unitarias y asegura que las dependencias sean inmutables.
* **Manejo de Excepciones Global**: Usa `@ControllerAdvice` y `@ExceptionHandler` para centralizar el manejo de errores en tus APIs REST.
* **Validación de Entradas**: Utiliza `@Valid` con anotaciones de JSR 303/349 (Hibernate Validator) en los `@RequestBody` de tus controladores.
* **Documentación de API**: Integra Swagger/OpenAPI (con Springdoc OpenAPI) para documentar tus APIs REST.
* **Seguridad**: Para aplicaciones reales, integra Spring Security.
* **Monitorización**: Usa Spring Boot Actuator y combínalo con herramientas de monitorización externas (ej. Prometheus, Grafana).

---

Este cheatsheet te proporciona una referencia completa y concisa de Spring Boot, cubriendo los aspectos esenciales para el desarrollo, configuración, prueba y despliegue de aplicaciones Java modernas.
