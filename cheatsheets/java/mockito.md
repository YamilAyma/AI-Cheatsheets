
---

# 🎭 Mockito Cheatsheet Completo 🎭

**Mockito** es un framework de mocking para pruebas unitarias en Java. Permite a los desarrolladores crear "objetos mock" (simulados) que reemplazan a las dependencias reales de la clase que se está probando. Esto asegura que las pruebas unitarias sean aisladas, deterministas y rápidas.

---

## 1. 🌟 Conceptos Clave

*   **Mock Object (Objeto Mock)**: Una versión simulada de un objeto real. No tiene la lógica del objeto real; en su lugar, se le "dice" cómo debe comportarse cuando se invocan sus métodos.
*   **Spy Object (Objeto Spy)**: Una versión "parcialmente" simulada de un objeto real. Mantiene el comportamiento real del objeto, pero permite "espiar" (verificar) llamadas a métodos o "stubear" (sobrescribir) comportamientos específicos.
*   **Stubbing (Simulación)**: El proceso de configurar un mock para que devuelva un valor específico o realice una acción cuando se invoca un método particular.
*   **Verification (Verificación)**: El proceso de comprobar si un método de un mock fue invocado, cuántas veces, y con qué argumentos.
*   **Inyección de Mocks (`@InjectMocks`)**: Anotación de Mockito para inyectar automáticamente los mocks creados (`@Mock`) en las dependencias de la clase bajo prueba.

---

## 2. 🛠️ Configuración Inicial (Maven)

Para usar Mockito con JUnit 5 (recomendado), necesitas las siguientes dependencias en tu `pom.xml`:

```xml
<dependencies>
    <!-- JUnit Jupiter API y Engine -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <version>5.10.0</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-engine</artifactId>
        <version>5.10.0</version>
        <scope>test</scope>
    </dependency>

    <!-- Mockito Core -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <version>5.5.0</version> <!-- Usar la versión más reciente -->
        <scope>test</scope>
    </dependency>
    <!-- Mockito JUnit Jupiter Integration (para anotaciones @Mock, @InjectMocks con JUnit 5) -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-junit-jupiter</artifactId>
        <version>5.5.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.11.0</version>
            <configuration>
                <source>17</source>
                <target>17</target>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>3.1.2</version>
        </plugin>
    </plugins>
</build>
```

---

## 3. 📝 Estructura Básica de una Prueba con Mockito

```java
// src/main/java/com/example/myapp/UserRepository.java (Dependencia)
package com.example.myapp;

import java.util.Optional;

public class User {
    private Long id;
    private String name;
    // Constructor, getters, setters
    public User(Long id, String name) { this.id = id; this.name = name; }
    public Long getId() { return id; }
    public String getName() { return name; }
}

public interface UserRepository { // Interfaz de la dependencia (buena práctica para mocks)
    Optional<User> findById(Long id);
    void save(User user);
    boolean delete(Long id);
}

// src/main/java/com/example/myapp/UserService.java (Clase a probar)
package com.example.myapp;

import java.util.Optional;

public class UserService {
    private final UserRepository userRepository; // Dependencia

    public UserService(UserRepository userRepository) { // Inyección por constructor
        this.userRepository = userRepository;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
    }

    public boolean createUser(User user) {
        if (userRepository.findById(user.getId()).isPresent()) {
            throw new IllegalArgumentException("Usuario con este ID ya existe.");
        }
        userRepository.save(user);
        return true;
    }

    public boolean deleteUser(Long id) {
        return userRepository.delete(id);
    }
}
```

```java
// src/test/java/com/example/myapp/UserServiceTest.java
package com.example.myapp;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith; // Para usar @Mock, @InjectMocks
import org.mockito.Mock; // Para crear mocks
import org.mockito.InjectMocks; // Para inyectar mocks
import org.mockito.junit.jupiter.MockitoExtension; // Habilita las anotaciones Mockito

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*; // Aserciones de JUnit
import static org.mockito.Mockito.*; // Métodos estáticos de Mockito (when, verify)

@ExtendWith(MockitoExtension.class) // Habilita el uso de anotaciones Mockito en JUnit 5
class UserServiceTest {

    @Mock // Crea un objeto mock de UserRepository
    private UserRepository userRepository;

    @InjectMocks // Inyecta el/los mocks creados (@Mock) en una instancia de UserService
    private UserService userService; // Esta es la clase que estamos probando

    // @BeforeEach // Si no usas @InjectMocks, podrías inicializar así:
    // void setUp() {
    //    userRepository = mock(UserRepository.class); // Inicialización manual del mock
    //    userService = new UserService(userRepository); // Inyección manual
    // }

    @Test
    void testGetUserById_exists() {
        // Arrange (Preparación): Stubbing (simulación del comportamiento del mock)
        Long userId = 1L;
        User expectedUser = new User(userId, "Test User");
        when(userRepository.findById(userId)).thenReturn(Optional.of(expectedUser)); // Cuando findById se llama con 1L, devuelve Optional con expectedUser

        // Act (Ejecución): Llamar al método de la clase a probar
        User actualUser = userService.getUserById(userId);

        // Assert (Verificación): Comprobar el resultado
        assertNotNull(actualUser);
        assertEquals(expectedUser.getId(), actualUser.getId());
        assertEquals(expectedUser.getName(), actualUser.getName());

        // Verify (Verificación): Comprobar si el método del mock fue llamado
        verify(userRepository, times(1)).findById(userId); // Verifica que findById fue llamado exactamente 1 vez con userId
        verifyNoMoreInteractions(userRepository); // Verifica que no hubo más interacciones con el mock
    }

    @Test
    void testGetUserById_notFound() {
        // Arrange:
        Long userId = 99L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty()); // Simula que el usuario no existe

        // Act & Assert: Verifica que se lanza la excepción correcta
        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> {
            userService.getUserById(userId);
        }, "Debería lanzar IllegalArgumentException si el usuario no es encontrado");

        assertEquals("Usuario no encontrado con ID: " + userId, thrown.getMessage());
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    void testCreateUser_success() {
        // Arrange:
        User newUser = new User(5L, "New User");
        when(userRepository.findById(newUser.getId())).thenReturn(Optional.empty()); // Simula que el ID no existe
        // Mockito.doNothing().when(userRepository).save(any(User.class)); // Opcional: si save() no devuelve nada y quieres ser explícito

        // Act:
        boolean created = userService.createUser(newUser);

        // Assert:
        assertTrue(created);

        // Verify: Verifica que save() fue llamado con el nuevo usuario
        verify(userRepository, times(1)).findById(newUser.getId());
        verify(userRepository, times(1)).save(newUser);
    }

    @Test
    void testDeleteUser_success() {
        // Arrange:
        Long userId = 1L;
        when(userRepository.delete(userId)).thenReturn(true); // Simula que la eliminación fue exitosa

        // Act:
        boolean deleted = userService.deleteUser(userId);

        // Assert:
        assertTrue(deleted);

        // Verify:
        verify(userRepository, times(1)).delete(userId);
    }
}
```

---

## 4. 🧮 Stubbing (Configurar Comportamiento)

Métodos para decirle a un mock qué hacer cuando se invoca un método.

*   **`when(mock.method()).thenReturn(value)`**: Devuelve un valor específico.
    ```java
    when(userRepository.findById(1L)).thenReturn(Optional.of(new User(1L, "Alice")));
    ```
*   **`when(mock.method()).thenThrow(exception)`**: Lanza una excepción.
    ```java
    when(userRepository.findById(anyLong())).thenThrow(new RuntimeException("Error de DB"));
    ```
*   **`when(mock.method()).then(answer)`**: Ejecuta una `Answer` personalizada.
    ```java
    when(userRepository.findById(anyLong())).then(invocation -> {
        Long id = invocation.getArgument(0); // Obtiene el primer argumento
        return Optional.of(new User(id, "Usuario Mock"));
    });
    ```
*   **`doReturn(value).when(mock).method()`**: Para `void` methods, o cuando se stubbean spys.
    ```java
    doReturn(Optional.of(new User(1L, "Alice"))).when(userRepository).findById(1L);
    ```
*   **`doThrow(exception).when(mock).method()`**: Para `void` methods.
    ```java
    doThrow(new RuntimeException("Error de guardado")).when(userRepository).save(any(User.class));
    ```
*   **`doNothing().when(mock).method()`**: Para `void` methods (comportamiento por defecto, pero a veces explícito).

### 4.1. `Argument Matchers` (Coincidencia de Argumentos)

Para stubbear o verificar llamadas con argumentos que varían.

*   `any()`: Cualquier objeto (del tipo especificado).
*   `anyString()`, `anyInt()`, `anyLong()`, `anyBoolean()`, etc.: Cualquier primitivo o tipo de wrapper.
*   `eq(value)`: Un valor específico (útil cuando se mezcla con `any`).
*   `argThat(matcher)`: Un matcher personalizado (con `org.mockito.ArgumentMatcher`).
*   `isNull()`, `isNotNull()`: Es `null` / no es `null`.
*   **Importante**: Si usas un matcher para *un* argumento, **debes usar matchers para *todos* los argumentos** en esa invocación.

    ```java
    when(userRepository.findById(any(Long.class))).thenReturn(Optional.empty()); // any(Long.class)
    when(userRepository.findById(argThat(id -> id > 10))).thenReturn(Optional.of(new User(11L, "Big ID User")));
    ```

---

## 5. ✅ Verificación (Comprobar Interacciones)

Métodos para verificar que los métodos de un mock fueron llamados como se esperaba.

*   **`verify(mock, [mode]).method()`**:
    *   `times(n)`: Exactamente `n` veces (por defecto es `times(1)`).
    *   `atLeast(n)`: Al menos `n` veces.
    *   `atMost(n)`: Como máximo `n` veces.
    *   `never()`: Nunca fue llamado.
    *   `atLeastOnce()`: Al menos una vez (equivalente a `times(1)` con retorno `void`).
    *   `only()`: Solo esta interacción en todo el mock.
*   **`verifyNoInteractions(mock...)`**: Verifica que no hubo interacciones con los mocks dados.
*   **`verifyNoMoreInteractions(mock...)`**: Verifica que no hubo más interacciones con los mocks después de las ya verificadas.

    ```java
    verify(userRepository).save(any(User.class)); // Verificación por defecto: 1 vez
    verify(userRepository, times(2)).findById(anyLong()); // Llamado 2 veces
    verify(userRepository, never()).delete(anyLong()); // Nunca llamado
    verifyNoMoreInteractions(userRepository); // Útil al final de la prueba
    ```

### 5.1. Captura de Argumentos (`ArgumentCaptor`)

Para verificar los valores exactos de los argumentos pasados a un método, incluso si no se pueden comparar directamente o si necesitas inspeccionar el objeto.

```java
import org.mockito.ArgumentCaptor;
import static org.mockito.Mockito.verify;

@Test
void testCapturaArgumento() {
    // Arrange:
    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
    userService.createUser(new User(10L, "Captured User"));

    // Verify:
    verify(userRepository).save(userCaptor.capture()); // Captura el argumento pasado a save()

    User capturedUser = userCaptor.getValue(); // Obtiene el objeto capturado
    assertEquals("Captured User", capturedUser.getName());
}
```

---

## 6. 🕵️ Spies (Espías)

Para objetos reales que quieres monitorear o modificar parcialmente.

*   **`spy(object)`**: Envuelve un objeto real para espiarlo.
*   Puedes stubbear métodos específicos del spy, mientras el resto del objeto se comporta normalmente.
*   **Importante**: Usa `doReturn().when(spy).method()` para stubbear métodos en spys que no devuelven nada o que son complejos.

```java
// src/main/java/com/example/myapp/EmailService.java (Clase real, no una interfaz)
package com.example.myapp;

public class EmailService {
    public boolean sendEmail(String to, String subject, String body) {
        System.out.println(String.format("Enviando email a %s con asunto %s", to, subject));
        // Lógica real de envío de email
        return true;
    }

    public String formatSubject(String originalSubject) {
        return "RE: " + originalSubject;
    }
}
```

```java
// src/test/java/com/example/myapp/EmailServiceTest.java
package com.example.myapp;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Spy; // Para crear spys
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Spy // Crea un spy de EmailService (usa la instancia real, no un mock)
    private EmailService emailService; // Esto creará una instancia real de EmailService

    @Test
    void testSendEmailSpy() {
        String recipient = "test@example.com";
        String subject = "Hola";
        String body = "Contenido de prueba";

        // Stubbing de un método: sendEmail se comportará como si fuera mockeado
        doReturn(false).when(emailService).sendEmail(recipient, subject, body);

        // La llamada a sendEmail ahora devolverá 'false' según el stub
        boolean result = emailService.sendEmail(recipient, subject, body);
        assertFalse(result);

        // Sin embargo, formatSubject() seguirá ejecutando la lógica real
        String formatted = emailService.formatSubject("Original");
        assertEquals("RE: Original", formatted);

        // Puedes verificar interacciones con el spy
        verify(emailService, times(1)).sendEmail(recipient, subject, body);
        verify(emailService, times(1)).formatSubject("Original");
    }
}
```

---

## 7. 💡 Buenas Prácticas y Consejos

*   **Mockear Interfaces y Abstracciones**: Es mejor mockear interfaces o clases abstractas que clases concretas. Esto promueve un diseño más modular y testable.
*   **Mocks vs. Spies**:
    *   **Mocks**: Cuando quieres simular **todo** el comportamiento de una dependencia. Útil para dependencias externas (bases de datos, APIs).
    *   **Spies**: Cuando quieres usar la **implementación real** de un objeto, pero necesitas verificar llamadas a métodos específicos o sobrescribir solo un par de métodos.
*   **Evita Mockear Tipos de Datos (Value Objects)**: No mockees clases como `String`, `Integer`, `List`. Son simples y no tienen comportamiento complejo que necesite ser simulado.
*   **Una Verificación por Prueba (Ideal)**: Intenta que cada prueba se centre en un aspecto del comportamiento de la unidad bajo prueba y tenga una verificación principal.
*   **No Testees Implementaciones de Mockito**: No verifiques detalles internos del mock (ej. el orden de los stubbings). Concéntrate en el comportamiento de la clase bajo prueba.
*   **Clases Finales y Métodos Estáticos/Privados**: Mockito tiene limitaciones con clases `final` y métodos `static`/`private`. Para estos casos, puede que necesites librerías como PowerMock (más compleja) o reconsiderar tu diseño.
*   **Inyección de Dependencias por Constructor**: Preferible a la inyección por campo (`@Autowired` sin constructor) porque facilita la inyección de mocks y mejora la testabilidad de tu código.
*   **`verifyNoMoreInteractions`**: Es una buena práctica usarlo al final de las pruebas para asegurarse de que no hubo llamadas inesperadas a los mocks.

---

Este cheatsheet te proporciona una referencia completa de Mockito, cubriendo sus conceptos esenciales, cómo configurar mocks y spys, realizar stubbing, verificar interacciones y aplicar las mejores prácticas para escribir pruebas unitarias de Java efectivas y robustas.