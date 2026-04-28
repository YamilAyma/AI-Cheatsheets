---
title: "modelmapper"
---

---

# 🔄 ModelMapper (Java) Cheatsheet Completo 🔄

**ModelMapper** es una librería de Java que simplifica el mapeo de objetos de un modelo a otro. Está diseñada bajo el principio de "convención sobre configuración" (Convention over Configuration), lo que significa que intenta adivinar las asignaciones basándose en los nombres de las propiedades, reduciendo drásticamente el código boilerplate para las conversiones de objetos.

---

## 1. 🌟 Conceptos Clave

*   **Mapeo de Objetos**: Proceso de copiar datos de las propiedades de un objeto (`fuente`) a las propiedades de otro objeto (`destino`).
*   **Convención sobre Configuración**: ModelMapper intentará automáticamente mapear propiedades con nombres similares entre objetos.
*   **Inmutabilidad**: ModelMapper funciona bien con objetos mutables e inmutables, utilizando `Providers` para instanciar tipos inmutables.
*   **Reflexión**: Utiliza la reflexión de Java para acceder a las propiedades de los objetos en tiempo de ejecución.
*   **Configuración Flexible**: Permite definir mapeos personalizados y estrategias de coincidencia cuando la convención no es suficiente.

---

## 2. 🛠️ Configuración Inicial (Maven)

Añade la dependencia en tu `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.modelmapper</groupId>
        <artifactId>modelmapper</artifactId>
        <version>3.2.0</version> <!-- Usar la versión más reciente y estable -->
    </dependency>
</dependencies>
```

### 2.1. Creación de la Instancia de ModelMapper

```java
import org.modelmapper.ModelMapper;

public class AppConfig {
    // Instancia de ModelMapper (generalmente como un Singleton en Spring/aplicaciones web)
    private static final ModelMapper modelMapper = new ModelMapper();

    public static ModelMapper getModelMapper() {
        return modelMapper;
    }
}
```
*   Es una buena práctica crear una **única instancia** de `ModelMapper` y reutilizarla, ya que su inicialización puede ser costosa.

---

## 3. 🚀 Mapeo Básico

ModelMapper mapeará automáticamente propiedades con el mismo nombre y tipo, o si tienen getters/setters que coinciden por convención.

### 3.1. Mapear a un Nuevo Objeto (Clase Destino)

```java
import org.modelmapper.ModelMapper;

// Clases de ejemplo
class Source {
    private String firstName;
    private String lastName;
    private int age;
    // Getters y Setters
    public Source(String f, String l, int a) { this.firstName = f; this.lastName = l; this.age = a; }
    public String getFirstName() { return firstName; } public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; } public void setLastName(String lastName) { this.lastName = lastName; }
    public int getAge() { return age; } public void setAge(int age) { this.age = age; }
}

class Destination {
    private String name;
    private int yearsOld; // Nombre diferente
    // Getters y Setters
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public int getYearsOld() { return yearsOld; } public void setYearsOld(int yearsOld) { this.yearsOld = yearsOld; }
}

public class BasicMapping {
    public static void main(String[] args) {
        ModelMapper modelMapper = AppConfig.getModelMapper();

        Source source = new Source("John", "Doe", 30);

        // Mapea Source a una nueva instancia de Destination
        Destination dest = modelMapper.map(source, Destination.class);

        System.out.println("Dest name: " + dest.getName()); // John Doe (mapeo compuesto por defecto)
        System.out.println("Dest yearsOld: " + dest.getYearsOld()); // 30 (mapeo por nombre de propiedad)
    }
}
```

### 3.2. Mapear a un Objeto Existente

```java
// Continuando con las clases Source y Destination
public class MappingToExisting {
    public static void main(String[] args) {
        ModelMapper modelMapper = AppConfig.getModelMapper();

        Source source = new Source("Jane", "Smith", 25);
        Destination existingDest = new Destination();
        existingDest.setName("Existing Name"); // Valor que será sobrescrito
        existingDest.setYearsOld(99);        // Valor que será sobrescrito

        // Mapea Source a la instancia existente de Destination
        modelMapper.map(source, existingDest);

        System.out.println("Dest name: " + existingDest.getName());     // Jane Smith
        System.out.println("Dest yearsOld: " + existingDest.getYearsOld()); // 25
    }
}
```

---

## 4. 📝 Mapeo Personalizado (`PropertyMap`)

Cuando la convención no es suficiente (nombres de propiedades diferentes, lógica de transformación).

```java
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;

// Clases de ejemplo (extendidas)
class UserEntity {
    private Long id;
    private String firstName;
    private String lastName;
    private String emailAddress;
    private boolean isActive;
    // Getters y Setters
    public UserEntity(Long id, String fn, String ln, String e, boolean ia) { this.id = id; this.firstName = fn; this.lastName = ln; this.emailAddress = e; this.isActive = ia; }
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; } public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; } public void setLastName(String lastName; ) { this.lastName = lastName; }
    public String getEmailAddress() { return emailAddress; } public void setEmailAddress(String emailAddress) { this.emailAddress = emailAddress; }
    public boolean isActive() { return isActive; } public void setActive(boolean active) { isActive = active; }
}

class UserDto {
    private Long userId;
    private String fullName;
    private String email;
    private String status; // Activo/Inactivo
    // Getters y Setters
    public Long getUserId() { return userId; } public void setUserId(Long userId) { this.userId = userId; }
    public String getFullName() { return fullName; } public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
}

public class CustomMapping {
    public static void main(String[] args) {
        ModelMapper modelMapper = AppConfig.getModelMapper();

        // 1. Definir el mapeo personalizado
        PropertyMap<UserEntity, UserDto> userMap = new PropertyMap<UserEntity, UserDto>() {
            @Override
            protected void configure() {
                // Mapear firstName y lastName a fullName
                map().setFullName(source.getFirstName() + " " + source.getLastName());

                // Mapear emailAddress a email
                map(source.getEmailAddress()).setEmail(null); // 'null' es un placeholder, se usa map(source.getter()).setter(null)

                // Mapeo condicional o con lógica
                using(ctx -> ((boolean) ctx.getSource()) ? "Activo" : "Inactivo") // Usa un Converter inline
                        .map(source.isActive()).setStatus(null); // source.isActive() es el valor fuente, null es el destino

                // Ignorar una propiedad en el mapeo (no la copies)
                skip().setUserId(null); // No mapear ID de usuario (si ya está en el destino, etc.)
            }
        };

        // 2. Añadir el mapeo al ModelMapper
        modelMapper.addMappings(userMap);

        // 3. Realizar el mapeo
        UserEntity userEntity = new UserEntity(123L, "Alice", "Wonder", "alice@example.com", true);
        UserDto userDto = modelMapper.map(userEntity, UserDto.class);

        System.out.println("User ID (skipped): " + userDto.getUserId()); // null (porque lo saltamos)
        System.out.println("User Full Name: " + userDto.getFullName());   // Alice Wonder
        System.out.println("User Email: " + userDto.getEmail());         // alice@example.com
        System.out.println("User Status: " + userDto.getStatus());       // Activo
    }
}
```

---

## 5. ↔️ Converters (Conversión de Tipos)

Para transformar tipos de datos específicos (ej. `String` a `Date`, `Integer` a `Boolean`).

```java
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

// 1. Definir un Converter
public class StringToLocalDateConverter implements Converter<String, LocalDate> {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public LocalDate convert(MappingContext<String, LocalDate> context) {
        if (context.getSource() == null) {
            return null;
        }
        return LocalDate.parse(context.getSource(), FORMATTER);
    }
}

// Clases de ejemplo
class EventSource { String date; public EventSource(String d) { this.date = d; } public String getDate() { return date; } public void setDate(String date) { this.date = date; } }
class EventDestination { LocalDate eventDate; public LocalDate getEventDate() { return eventDate; } public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; } }

public class UsingConverters {
    public static void main(String[] args) {
        ModelMapper modelMapper = AppConfig.getModelMapper();

        // 2. Añadir el converter a ModelMapper
        modelMapper.addConverter(new StringToLocalDateConverter());

        EventSource source = new EventSource("2023-10-26");
        EventDestination dest = modelMapper.map(source, EventDestination.class);

        System.out.println("Fecha convertida: " + dest.getEventDate()); // 2023-10-26
    }
}
```
*   También puedes usar `using(converterInstance).map(source.getter()).setDestination(null)` dentro de un `PropertyMap` para aplicar un `Converter` específico a una asignación de propiedad individual.

---

## 6. 🔄 Providers (Instanciación Personalizada)

Para instanciar el objeto de destino cuando no tiene un constructor por defecto o tiene dependencias.

```java
import org.modelmapper.Provider;
import org.modelmapper.ModelMapper;

// Clases de ejemplo (inmutable)
class PointSource {
    private int x;
    private int y;
    // Constructor, getters
    public PointSource(int x, int y) { this.x = x; this.y = y; }
    public int getX() { return x; } public int getY() { return y; }
}

class PointDestination { // Clase inmutable
    private final int xCoord;
    private final int yCoord;

    public PointDestination(int xCoord, int yCoord) {
        this.xCoord = xCoord;
        this.yCoord = yCoord;
    }
    // Getters
    public int getXCoord() { return xCoord; } public int getYCoord() { return yCoord; }
}

public class UsingProviders {
    public static void main(String[] args) {
        ModelMapper modelMapper = AppConfig.getModelMapper();

        // 1. Definir un Provider
        // Crea una instancia de PointDestination usando el constructor con argumentos
        Provider<PointDestination> pointProvider = new Provider<PointDestination>() {
            @Override
            public PointDestination get(MappingContext<PointSource, PointDestination> context) {
                PointSource source = context.getSource();
                return new PointDestination(source.getX(), source.getY());
            }
        };

        // 2. Añadir el Provider a ModelMapper para el tipo PointDestination
        modelMapper.createTypeMap(PointSource.class, PointDestination.class)
                   .setProvider(pointProvider)
                   // Opcional: añadir mapeos si los nombres de los campos no coinciden
                   .addMappings(mapper -> {
                       mapper.map(src -> src.getX(), PointDestination::getXCoord);
                       mapper.map(src -> src.getY(), PointDestination::getYCoord);
                   });

        PointSource source = new PointSource(10, 20);
        PointDestination dest = modelMapper.map(source, PointDestination.class);

        System.out.println("Dest X: " + dest.getXCoord()); // 10
        System.out.println("Dest Y: " + dest.getYCoord()); // 20
    }
}
```

---

## 7. ⚙️ Configuración Global

Puedes ajustar el comportamiento de `ModelMapper` globalmente.

```java
import org.modelmapper.convention.MatchingStrategies; // Importar estrategias
import org.modelmapper.config.Configuration.AccessLevel; // Importar AccessLevel

public class GlobalConfig {
    public static void configureModelMapper(ModelMapper modelMapper) {
        // Estrategia de coincidencia de nombres (default: Standard)
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        // MatchingStrategies:
        // - STRICT: Coincidencia exacta de nombres (ej. 'user.name' -> 'user.name').
        // - STANDARD: Coincidencia por sub-propiedades (ej. 'user.firstName' -> 'user.name.firstName').
        // - LOOSE: Coincidencia flexible (ej. 'user.firstName' -> 'userName').

        // Habilitar mapeo directo de campos (fields) además de getters/setters
        modelMapper.getConfiguration().setFieldMatchingEnabled(true);

        // Nivel de acceso para mapear campos (por defecto: PUBLIC)
        modelMapper.getConfiguration().setFieldAccessLevel(AccessLevel.PRIVATE);
        // AccessLevel: PRIVATE, PROTECTED, PACKAGE_PRIVATE, PUBLIC

        // Ignorar valores nulos del origen (default: false, los nulos sobrescriben)
        modelMapper.getConfiguration().setSkipNullEnabled(true);

        // Habilitar la fusión de colecciones (añadir a colección existente en lugar de reemplazarla)
        modelMapper.getConfiguration().setCollectionsMergeEnabled(true);

        // Ignorar mapeos ambiguos (default: false, lanza excepción)
        modelMapper.getConfiguration().setAmbiguityIgnored(true);
    }
}

// En el inicio de tu app o en AppConfig:
// ModelMapper modelMapper = new ModelMapper();
// GlobalConfig.configureModelMapper(modelMapper);
```

---

## 8. 💡 Buenas Prácticas y Consejos

*   **Una Instancia por Aplicación**: Crea una única instancia de `ModelMapper` y reutilízala en toda tu aplicación. Configúrala al inicio.
*   **Convención Primero**: Intenta nombrar tus propiedades de manera que `ModelMapper` pueda inferir las asignaciones automáticamente.
*   **Mapeos Personalizados para Excepciones**: Utiliza `PropertyMap` para los casos donde la convención no funciona o necesitas lógica de transformación.
*   **Mapea DTOs a Entidades y Viceversa**: ModelMapper es ideal para convertir entre tus entidades de dominio (persistentes) y tus DTOs (para APIs o ViewModels).
*   **Inmutabilidad con `Provider`**: Si tus objetos de destino son inmutables y no tienen constructores por defecto o públicos sin argumentos, necesitarás un `Provider`.
*   **Manejo de Colecciones**: Por defecto, ModelMapper sobrescribe las colecciones de destino. Si quieres fusionarlas, usa `setCollectionsMergeEnabled(true)`.
*   **Manejo de Nulos**: Considera `setSkipNullEnabled(true)` si no quieres que los valores nulos en el objeto fuente sobrescriban los valores existentes en el objeto destino.
*   **Pruebas Unitarias para Mapeos**: A pesar de la automatización, es vital escribir pruebas unitarias para tus mapeos críticos para asegurar que funcionan como se espera, especialmente después de cambios.
*   **Rendimiento**: Para aplicaciones con requisitos de rendimiento muy estrictos y un gran volumen de mapeos, mide el rendimiento. Si ModelMapper se convierte en un cuello de botella, considera mapeos manuales o librerías de generación de código como MapStruct.

---

Este cheatsheet te proporciona una referencia completa de ModelMapper, cubriendo sus conceptos esenciales, mapeo básico y personalizado, gestión de transformaciones e instanciación, configuración global y las mejores prácticas para un uso eficiente y robusto en tus aplicaciones Java.