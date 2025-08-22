
---

# 🌿 Spring Data JPA Cheatsheet Completo 🌿

**Spring Data JPA** es una parte del paraguas de Spring Data, que tiene como objetivo reducir la cantidad de código repetitivo necesario para implementar la capa de acceso a datos (Repository) en aplicaciones basadas en la tecnología JPA (Java Persistence API). Se integra perfectamente con Hibernate (la implementación JPA por defecto en Spring Boot).

---

## 1. 🌟 Conceptos Clave

*   **JPA (Java Persistence API)**: La especificación estándar de Java para la persistencia de objetos relacionales (ORM).
*   **Hibernate**: La implementación de ORM más popular que cumple con la especificación JPA.
*   **Repositorio (Repository)**: Un patrón de diseño que aísla la lógica de acceso a datos de la lógica de negocio. Spring Data JPA proporciona interfaces de repositorio que se implementan automáticamente en tiempo de ejecución.
*   **`JpaRepository<T, ID>`**: La interfaz principal de Spring Data JPA que proporciona métodos CRUD (Crear, Leer, Actualizar, Borrar) y de paginación/ordenación comunes.
*   **Métodos Derivados de Consultas**: La característica distintiva de Spring Data JPA. Permite definir métodos de consulta simplemente declarando sus firmas en la interfaz del repositorio (ej. `findByNombreAndEdad()`).
*   **Convención sobre Configuración**: Spring Data JPA adivina el propósito de tus métodos de repositorio basándose en su nombre, eliminando la necesidad de escribir la implementación.
*   **`EntityManager`**: El API central de JPA para interactuar con el contexto de persistencia. Spring Data JPA lo gestiona por ti.

---

## 2. 🛠️ Configuración Inicial (Spring Boot)

1.  **Añadir dependencias en `pom.xml` (Maven):**
    ```xml
    <dependencies>
        <!-- Spring Boot Starter Data JPA (incluye Hibernate y H2 por defecto) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <!-- Driver de base de datos (ej. PostgreSQL) -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!-- Para usar Jakarta EE Persistence API (Spring Boot 3+ usa Jakarta) -->
        <dependency>
            <groupId>jakarta.persistence</groupId>
            <artifactId>jakarta.persistence-api</artifactId>
            <version>3.1.0</version> <!-- Usar la versión compatible con tu Spring Boot -->
        </dependency>
        <!-- JUnit 5 y Mockito para pruebas -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    ```

2.  **Configuración de la Base de Datos (`application.properties` o `application.yml`):**
    ```properties
    # application.properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
    spring.datasource.username=user
    spring.datasource.password=password
    spring.datasource.driver-class-name=org.postgresql.Driver

    # Configuración de JPA/Hibernate
    spring.jpa.hibernate.ddl-auto=update # create, create-drop, validate, none
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.format_sql=true
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect # O el dialecto de tu DB
    ```

---

## 3. 📝 Definición de Entidades JPA

Las entidades son clases Java que se mapean a tablas de base de datos.

```java
import jakarta.persistence.*; // Para Spring Boot 3+ (Jakarta EE 9+)
// import javax.persistence.*; // Para Spring Boot 2.x (Java EE 8)

@Entity // Marca la clase como una entidad JPA
@Table(name = "productos") // Opcional: Especifica el nombre de la tabla si es diferente al nombre de la clase
public class Product {

    @Id // Marca el campo como clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Estrategia de generación de ID (auto-incremento en DB)
    // Otras estrategias: AUTO, SEQUENCE, TABLE (menos comunes)
    private Long id;

    @Column(name = "nombre_producto", nullable = false, length = 150) // Mapea a columna, no nulo, longitud
    private String name;

    @Column(unique = true) // Valor único en esta columna
    private String sku;

    private Double price;

    private Boolean active;

    @Temporal(TemporalType.TIMESTAMP) // Mapeo para fechas/horas
    @Column(name = "created_at", updatable = false) // No se actualiza en UPDATEs
    private java.util.Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at")
    private java.util.Date updatedAt;

    @Transient // No se mapea a la base de datos
    private String transientField;

    // Relaciones (Ejemplos, pueden ser muy complejas)
    @ManyToOne(fetch = FetchType.LAZY) // Relación Muchos a Uno (varios productos a una categoría)
    @JoinColumn(name = "category_id") // Columna de clave foránea en la tabla 'productos'
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true) // Uno a Muchos (un producto tiene muchos ítems de pedido)
    // 'mappedBy' indica que la relación es gestionada por el campo 'product' en la entidad OrderItem
    private java.util.List<OrderItem> orderItems;

    // Constructor(es), Getters y Setters
    public Product() { }
    public Product(String name, String sku, Double price, Boolean active) {
        this.name = name;
        this.sku = sku;
        this.price = price;
        this.active = active;
    }

    @PrePersist // Método que se ejecuta antes de persistir la entidad por primera vez
    protected void onCreate() {
        this.createdAt = new java.util.Date();
        this.updatedAt = new java.util.Date();
    }

    @PreUpdate // Método que se ejecuta antes de actualizar la entidad
    protected void onUpdate() {
        this.updatedAt = new java.util.Date();
    }
}
```

---

## 4. 🗃️ Definición de Repositorios

Simplemente crea una interfaz que extienda `JpaRepository` (u otras interfaces de Spring Data). Spring Data JPA creará la implementación en tiempo de ejecución.

```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // Opcional pero buena práctica

import java.util.List;
import java.util.Optional;

@Repository // Anotación opcional, pero buena práctica para la claridad del rol
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Aquí no se escribe ningún código, ¡solo la firma del método!

    // 1. Métodos Derivados de Consultas (Query Methods)
    // Encuentra productos por nombre
    List<Product> findByName(String name);

    // Encuentra productos por nombre O SKU
    List<Product> findByNameOrSku(String name, String sku);

    // Encuentra productos con precio mayor que un valor dado
    List<Product> findByPriceGreaterThan(Double price);

    // Encuentra productos activos ordenados por nombre ascendente
    List<Product> findByActiveTrueOrderByNameAsc();

    // Encuentra productos por nombre que contenga una cadena (case-insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Encuentra los 5 productos más caros
    List<Product> findTop5ByOrderByPriceDesc();

    // Comprueba si un producto con un SKU dado existe
    boolean existsBySku(String sku);

    // Cuenta el número de productos activos
    long countByActiveTrue();

    // Elimina productos por nombre
    long deleteByName(String name); // Devuelve el número de entidades eliminadas

    // 2. Consultas Personalizadas con @Query (JPQL o Native SQL)
    // JPQL (Java Persistence Query Language): Usa nombres de entidades y campos de entidad
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN ?1 AND ?2")
    List<Product> findProductsInPriceRange(Double minPrice, Double maxPrice);

    @Query("SELECT p FROM Product p WHERE p.category.name = :categoryName")
    List<Product> findByCategoryName(@Param("categoryName") String categoryName);

    // Native SQL Query (SQL puro de tu base de datos)
    @Query(value = "SELECT * FROM productos WHERE nombre_producto LIKE %?1%", nativeQuery = true)
    List<Product> searchProductsNative(String keyword);

    // Consultas de actualización/eliminación con @Modifying y @Transactional
    @Modifying // Indica que la consulta es una operación DML (INSERT, UPDATE, DELETE)
    @Transactional // Para que la operación sea transaccional (importante para DML)
    @Query("UPDATE Product p SET p.price = p.price * (1 + :percentage / 100) WHERE p.active = TRUE")
    int updatePriceForActiveProducts(@Param("percentage") Double percentage);
}
```

---

## 5. 🚀 Métodos Heredados de `JpaRepository` (CRUD y Paginación/Ordenación)

`JpaRepository` extiende `PagingAndSortingRepository` y `CrudRepository`, proporcionando estos métodos listos para usar:

*   **`save(entity)`**: Guarda una entidad. Si el ID existe, actualiza; si no, inserta.
*   **`saveAll(entities)`**: Guarda una colección de entidades.
*   **`findById(id)`**: Devuelve un `Optional<T>` con la entidad si se encuentra, `Optional.empty()` si no.
*   **`existsById(id)`**: Comprueba si una entidad con el ID dado existe.
*   **`findAll()`**: Devuelve todas las entidades.
*   **`findAllById(ids)`**: Devuelve todas las entidades con los IDs dados.
*   **`deleteById(id)`**: Elimina una entidad por ID.
*   **`delete(entity)`**: Elimina una entidad.
*   **`deleteAll(entities)`**: Elimina una colección de entidades.
*   **`count()`**: Devuelve el número total de entidades.

### 5.1. Paginación y Ordenación

*   **`Pageable`**: Interfaz para especificar paginación y ordenación. Se crea con `PageRequest`.
    *   `PageRequest.of(page, size)`: Página (0-indexed), tamaño por página.
    *   `PageRequest.of(page, size, Sort.by("prop1").desc().and(Sort.by("prop2").asc()))`: Con ordenación.
*   **`Sort`**: Objeto para definir la ordenación.
    *   `Sort.by("prop1")`: Ordena por `prop1` ascendente.
    *   `Sort.by("prop1").desc()`: Ordena por `prop1` descendente.
*   **`Page<T>`**: Tipo de retorno para métodos que soportan paginación. Contiene la lista de elementos, información de paginación (total de páginas, total de elementos).

```java
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // Obtener todos los productos paginados y ordenados
    Page<Product> findAll(Pageable pageable);

    // Obtener productos activos paginados y ordenados por precio
    Page<Product> findByActiveTrue(Pageable pageable);

    // Solo ordenación (retorna una List)
    List<Product> findAll(Sort sort);
}

// Uso en un Service o Controller
// Pageable pageable = PageRequest.of(0, 10, Sort.by("name").ascending());
// Page<Product> productPage = productRepository.findAll(pageable);
// List<Product> products = productPage.getContent();
// int totalPages = productPage.getTotalPages();
// long totalElements = productPage.getTotalElements();
```

---

## 6. 🌐 Transacciones (`@Transactional`)

Gestiona el comportamiento transaccional de los métodos. Generalmente se usa en la capa de Servicio.

*   **`@Transactional`**: Anotación para que un método o clase se ejecute dentro de una transacción.
    *   Por defecto, la transacción se hace commit si no hay excepciones en tiempo de ejecución (`RuntimeException`).
    *   Hace `rollback` si una `RuntimeException` (o subclase) es lanzada.
*   **`@Transactional(readOnly = true)`**: Optimización para métodos de solo lectura. El proveedor JPA puede aplicar optimizaciones (ej. no sincronizar el contexto de persistencia al final).
*   **`@Transactional(rollbackFor = MyCustomException.class)`**: Hace rollback si se lanza una excepción específica (aunque sea `checked`).
*   **`@Transactional(noRollbackFor = MyCustomException.class)`**: No hace rollback si se lanza una excepción específica.
*   **`@Transactional(propagation = Propagation.REQUIRED)`**: Comportamiento de propagación de la transacción. `REQUIRED` (por defecto) significa que si ya hay una transacción, se une a ella; si no, crea una nueva.

```java
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true) // Método de solo lectura
    public Product getProductDetails(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
    }

    @Transactional // Método de escritura, transaccional
    public Product createProduct(Product product) {
        if (productRepository.existsBySku(product.getSku())) {
            throw new IllegalArgumentException("SKU de producto ya existente");
        }
        return productRepository.save(product);
    }

    @Transactional
    public void transferStock(Long fromProductId, Long toProductId, int quantity) {
        Product fromProduct = productRepository.findById(fromProductId)
            .orElseThrow(() -> new IllegalArgumentException("Producto origen no encontrado"));
        Product toProduct = productRepository.findById(toProductId)
            .orElseThrow(() -> new IllegalArgumentException("Producto destino no encontrado"));

        if (fromProduct.getStock() < quantity) { // Suponiendo un campo 'stock'
            throw new IllegalArgumentException("Stock insuficiente");
        }

        fromProduct.setStock(fromProduct.getStock() - quantity);
        toProduct.setStock(toProduct.getStock() + quantity);

        productRepository.save(fromProduct);
        productRepository.save(toProduct);
        // Si hay una excepción aquí, ambos saves se desharán (rollback)
    }
}
```

---

## 7. ❌ Manejo de Errores Comunes

*   **`Optional<T>`**: `findById()` devuelve `Optional`, lo que fomenta el manejo explícito de la ausencia de un recurso, evitando `NullPointerExceptions`.
    ```java
    Product product = productRepository.findById(id)
        .orElse(null); // O .orElseThrow(() -> new EntityNotFoundException("..."));
    ```
*   **`EntityNotFoundException`**: Lanzada por `EntityManager.getReferenceById()` (antes `getById()`) si la entidad no existe. `findById()` retorna `Optional.empty()`.
*   **`DataIntegrityViolationException`**: Lanzada por Spring por problemas de integridad de datos (ej. intentar insertar una clave duplicada en una columna `UNIQUE`, o violar un `NOT NULL`).
*   **`OptimisticLockingFailureException`**: Lanzada si se usa bloqueo optimista (`@Version`) y dos transacciones intentan actualizar la misma entidad simultáneamente.

---

## 8. 💡 Buenas Prácticas y Consejos

*   **Capa de Servicio**: Siempre coloca tu lógica de negocio en una capa de servicio (`@Service`) y usa `@Transactional` en los métodos de servicio, no en los métodos del repositorio. Los repositorios deben ser solo para operaciones CRUD básicas.
*   **DTOs (Data Transfer Objects)**: No expongas tus entidades JPA directamente a la capa de controlador/vista. Mapea tus entidades a DTOs para la comunicación con el cliente. ModelMapper o MapStruct son útiles para esto.
*   **Lazy Loading y N+1 Problem**: Entiende cómo funciona `FetchType.LAZY` (`@ManyToOne`, `@OneToMany` por defecto). Cargar colecciones perezosamente puede llevar al problema N+1 si no se maneja correctamente (ej. usar `JOIN FETCH` en `@Query`, o `@EntityGraph`).
*   **`Optional` para Finders**: Todos los métodos de `findBy` que se espera que devuelvan una sola entidad deben devolver `Optional<T>`.
*   **Consultas Nativas con Cuidado**: Usa `nativeQuery = true` solo cuando no puedas lograr la consulta deseada con JPQL o métodos derivados. Las consultas nativas son menos portátiles entre diferentes bases de datos.
*   **Pruebas (`@DataJpaTest`)**: Utiliza la anotación `@DataJpaTest` para escribir pruebas de integración para tus repositorios. Carga un subconjunto del contexto de Spring y configura una base de datos en memoria (ej. H2) automáticamente.
*   **Auditoría**: Integra Spring Data JPA con la auditoría (`@EnableJpaAuditing`, `@CreatedDate`, `@LastModifiedDate`, `@CreatedBy`, `@LastModifiedBy`) para rastrear automáticamente quién y cuándo modificó una entidad.
*   **Convenciones de Nomenclatura**: Sigue estrictamente las convenciones de nomenclatura de Spring Data JPA para los métodos derivados de consultas para que se autogeneren correctamente.
*   **Evita el Bloqueo de Concurrencia (Optimistic Locking)**: Para evitar conflictos en la actualización de datos concurrentes, usa `@Version` en tus entidades.

---

Este cheatsheet te proporciona una referencia completa de Spring Data JPA, cubriendo sus conceptos esenciales, la definición de entidades y repositorios, los métodos derivados de consultas, `@Query`, paginación, transacciones y las mejores prácticas para construir una capa de acceso a datos eficiente y mantenible en tus aplicaciones Spring Boot.