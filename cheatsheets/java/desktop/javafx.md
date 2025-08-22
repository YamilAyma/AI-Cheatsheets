¡Excelente elección! JavaFX es un framework potente para construir interfaces de usuario de escritorio en Java, ofreciendo una experiencia moderna y rica. Aquí tienes un "cheatsheet" completo y bien estructurado de JavaFX, optimizado para ser claro y conciso para una IA conversacional.

---

# 🎨 JavaFX Cheatsheet Completo 🎨

JavaFX es un kit de herramientas de GUI de código abierto y multiplataforma para Java. Permite desarrollar aplicaciones de escritorio ricas y expresivas con gráficos, multimedia y una API Java moderna. Es el sucesor natural de Swing y AWT para el desarrollo de GUI en Java.

---

## 1. 🌟 Conceptos Clave

* **Scene Graph (Gráfico de Escena)**: Una estructura de datos jerárquica que representa todos los elementos visuales de la interfaz de usuario. Cada elemento de UI es un "Node".
* **Nodes (Nodos)**: Los bloques de construcción básicos de la interfaz de usuario (controles, formas, contenedores, etc.).
* **Stage (Escenario)**: La ventana principal de la aplicación. Una aplicación JavaFX puede tener múltiples `Stage`s.
* **Scene (Escena)**: El contenido de un `Stage`. Cada `Stage` tiene una `Scene`. Una `Scene` contiene el "root node" del Scene Graph.
* **FXML**: Un lenguaje de marcado XML opcional que permite definir la interfaz de usuario de forma declarativa, separando el diseño de la lógica de programación.
* **Observables y Binding**: El sistema de propiedades de JavaFX permite la vinculación de datos bidireccional entre propiedades de UI y datos del modelo, lo que simplifica la sincronización.
* **CSS**: Permite estilizar la interfaz de usuario utilizando hojas de estilo CSS estándar.

---

## 2. 🛠️ Configuración Inicial (Proyecto Maven)

Para Java 11+, JavaFX se gestiona como módulos externos.

1. **Añade las dependencias en `pom.xml`:**

   ```xml
   <dependencies>
       <dependency>
           <groupId>org.openjfx</groupId>
           <artifactId>javafx-controls</artifactId>
           <version>22</version> <!-- Usar la versión más reciente -->
       </dependency>
       <dependency>
           <groupId>org.openjfx</groupId>
           <artifactId>javafx-fxml</artifactId>
           <version>22</version>
       </dependency>
       <!-- Puedes añadir más módulos según necesites: javafx-graphics, javafx-media, etc. -->
   </dependencies>

   <build>
       <plugins>
           <plugin>
               <groupId>org.apache.maven.plugins</groupId>
               <artifactId>maven-compiler-plugin</artifactId>
               <version>3.11.0</version>
               <configuration>
                   <source>21</source> <!-- Tu versión de Java -->
                   <target>21</target>
               </configuration>
           </plugin>
           <!-- Plugin para ejecutar y empaquetar la aplicación JavaFX -->
           <plugin>
               <groupId>org.openjfx</groupId>
               <artifactId>javafx-maven-plugin</artifactId>
               <version>0.0.8</version>
               <configuration>
                   <mainClass>com.example.myapp.HelloApplication</mainClass> <!-- Tu clase principal -->
               </configuration>
           </plugin>
       </plugins>
   </build>
   ```
2. **Configura `module-info.java` (si usas módulos Java):**

   ```java
   // src/main/java/module-info.java
   module com.example.myapp {
       requires javafx.controls;
       requires javafx.fxml;
       // requires javafx.graphics; // Si usas javafx.graphics
       // requires javafx.media;    // Si usas javafx.media

       opens com.example.myapp to javafx.fxml; // Permite que FXML acceda a tu paquete
       exports com.example.myapp; // Exporta tu paquete principal
   }
   ```

---

## 3. 🖥️ Estructura Básica de la Aplicación

Toda aplicación JavaFX principal debe extender `javafx.application.Application` e implementar el método `start()`.

```java
// src/main/java/com/example/myapp/HelloApplication.java
package com.example.myapp;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.StackPane; // Un layout simple para centrar
import javafx.stage.Stage;

public class HelloApplication extends Application {

    @Override
    public void start(Stage primaryStage) {
        // 1. Crear el Root Node (un Layout)
        StackPane root = new StackPane();

        // 2. Crear un Node (un control)
        Label helloLabel = new Label("¡Hola, JavaFX!");

        // 3. Añadir el Node al Root Node
        root.getChildren().add(helloLabel);

        // 4. Crear la Scene (escena)
        Scene scene = new Scene(root, 400, 300); // root node, ancho, alto

        // 5. Configurar el Stage (ventana)
        primaryStage.setTitle("Mi Primera Aplicación JavaFX");
        primaryStage.setScene(scene); // Asignar la escena al escenario
        primaryStage.show(); // Mostrar el escenario
    }

    public static void main(String[] args) {
        launch(); // Método para lanzar la aplicación JavaFX
    }
}
```

---

## 4. 📐 Layouts (Contenedores)

Los layouts son nodos que organizan y posicionan a sus hijos.

* **`VBox`**: Organiza los nodos verticalmente.
  * `setSpacing()`: Espaciado entre elementos.
  * `setAlignment()`: Alineación de los hijos.
* **`HBox`**: Organiza los nodos horizontalmente.
  * `setSpacing()`: Espaciado entre elementos.
  * `setAlignment()`: Alineación de los hijos.
* **`BorderPane`**: Divide el área en cinco regiones: TOP, BOTTOM, LEFT, RIGHT, CENTER.
* **`GridPane`**: Organiza los nodos en una cuadrícula (filas y columnas).
  * `add(node, col, row)`: Añade un nodo en una posición específica.
  * `setHgap()`, `setVgap()`: Espaciado horizontal/vertical.
* **`FlowPane`**: Organiza los nodos en una dirección de flujo (horizontal o vertical) y los "envuelve" cuando no hay más espacio.
* **`StackPane`**: Apila los nodos uno encima del otro, centrándolos por defecto.
* **`AnchorPane`**: Permite "anclar" nodos a los bordes del panel.
  * `AnchorPane.setTopAnchor(node, value)`
* **`Pane`**: El layout más básico. No realiza ningún layout automático; debes posicionar los hijos manualmente.

```java
// Ejemplo con VBox
VBox root = new VBox(10); // Espaciado de 10px
root.setAlignment(Pos.CENTER);
root.setPadding(new Insets(20)); // Padding alrededor
root.getChildren().addAll(new Button("Botón 1"), new Button("Botón 2"));
```

---

## 5. 🎛️ Controles Comunes (Widgets)

Los controles son nodos interactivos con los que el usuario puede interactuar.

* **`Button`**: Botón clicable.
  * `setOnAction(event -> { ... })`: Manejador de eventos de clic.
* **`Label`**: Texto no editable.
* **`TextField`**: Campo de entrada de texto de una sola línea.
  * `getText()`, `setText()`.
* **`PasswordField`**: Campo de contraseña.
* **`TextArea`**: Campo de entrada de texto de múltiples líneas.
* **`CheckBox`**: Casilla de verificación.
  * `isSelected()`, `setSelected()`.
* **`RadioButton`**: Botón de radio (usar con `ToggleGroup`).
* **`ToggleGroup`**: Agrupa `RadioButton`s para que solo uno pueda ser seleccionado.
* **`ChoiceBox`**: Menú desplegable simple.
* **`ComboBox`**: Menú desplegable más avanzado (puede ser editable).
* **`ListView<T>`**: Lista de elementos.
  * Requiere `ObservableList` para los datos.
* **`TableView<T>`**: Tabla de datos (muy potente para mostrar colecciones de objetos).
  * Requiere `ObservableList` para los datos y `TableColumn`s para las columnas.
  * `TableColumn.setCellValueFactory(new PropertyValueFactory<>("propertyName"))`.
* **`Slider`**: Control deslizante para seleccionar un valor en un rango.
* **`ProgressBar` / `ProgressIndicator`**: Indicadores de progreso.
* **`ImageView`**: Para mostrar imágenes.
* **`DatePicker`**: Selector de fechas.
* **`MenuBar` / `Menu` / `MenuItem`**: Para menús de aplicación.
* **`Tooltip`**: Texto de ayuda que aparece al pasar el ratón.

```java
// Ejemplo de botón y TextField
Button submitButton = new Button("Enviar");
TextField nameField = new TextField();
nameField.setPromptText("Ingrese su nombre"); // Texto placeholder

submitButton.setOnAction(event -> {
    String name = nameField.getText();
    System.out.println("Nombre ingresado: " + name);
});
```

---

## 6. 🎨 Estilización (CSS)

JavaFX permite estilizar los nodos utilizando CSS.

* **CSS Externo**: Carga un archivo `.css`.

  ```java
  // En tu start() o controlador
  scene.getStylesheets().add(getClass().getResource("/com/example/myapp/style.css").toExternalForm());
  ```

  ```css
  /* src/main/resources/com/example/myapp/style.css */
  .button {
      -fx-background-color: #4CAF50;
      -fx-text-fill: white;
      -fx-font-size: 14px;
      -fx-padding: 8px 15px;
      -fx-border-radius: 5px;
      -fx-background-radius: 5px;
  }

  #myButton { /* Seleccionar por fx:id o setId() */
      -fx-background-color: #008CBA;
  }

  .root {
      -fx-background-color: #f0f2f5;
  }
  ```
* **CSS en Línea (Inline)**: Usa el método `setStyle()`. Menos mantenible.

  ```java
  helloLabel.setStyle("-fx-font-size: 24px; -fx-text-fill: red;");
  ```
* **Pseudo-clases**: `:hover`, `:pressed`, `:focused`, `:disabled`.

  ```css
  .button:hover {
      -fx-background-color: #45a049;
  }
  ```

---

## 7. ⚛️ FXML (Lenguaje de Marcado XML)

Separa la definición de la interfaz de usuario de la lógica de la aplicación.

1. **Archivo FXML (`hello-view.fxml`):**

   ```xml
   <!-- src/main/resources/com/example/myapp/hello-view.fxml -->
   <?xml version="1.0" encoding="UTF-8"?>

   <?import javafx.scene.control.Button?>
   <?import javafx.scene.control.Label?>
   <?import javafx.scene.layout.VBox?>

   <VBox alignment="CENTER" spacing="20.0" xmlns:fx="http://javafx.com/fxml/1" xmlns="http://javafx.com/javafx/22" fx:controller="com.example.myapp.HelloController">
       <children>
           <Label fx:id="welcomeText"/> <!-- fx:id para inyectar en el controlador -->
           <Button text="Hello!" onAction="#onHelloButtonClick"/> <!-- onAction para el método del controlador -->
       </children>
   </VBox>
   ```
2. **Controlador FXML (`HelloController.java`):**

   ```java
   // src/main/java/com/example/myapp/HelloController.java
   package com.example.myapp;

   import javafx.fxml.FXML;
   import javafx.scene.control.Label;

   public class HelloController {
       @FXML // Inyecta el Label del FXML
       private Label welcomeText;

       @FXML // Método llamado por onAction del Button
       protected void onHelloButtonClick() {
           welcomeText.setText("¡Bienvenido a JavaFX con FXML!");
       }

       // Método de inicialización (opcional, se llama después de que los elementos FXML son inyectados)
       public void initialize() {
           welcomeText.setText("Haga clic en el botón.");
       }
   }
   ```
3. **Cargador FXML en `Application`:**

   ```java
   // Modificación de HelloApplication.java para usar FXML
   import javafx.fxml.FXMLLoader;
   import javafx.scene.Parent; // Para el root node cargado desde FXML

   // ... (imports existentes)

   @Override
   public void start(Stage primaryStage) throws Exception { // Importante: throws Exception
       FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("hello-view.fxml"));
       Parent root = fxmlLoader.load(); // Carga el FXML y construye el Scene Graph

       Scene scene = new Scene(root, 320, 240); // Usa el root cargado
       primaryStage.setTitle("Aplicación FXML");
       primaryStage.setScene(scene);
       primaryStage.show();
   }
   ```

---

## 8. 🔄 Data Binding (Vinculación de Datos)

JavaFX tiene un sistema de propiedades robusto para el binding.

* **Propiedades Observables**: Los tipos de propiedades de JavaFX (ej. `StringProperty`, `IntegerProperty`, `BooleanProperty`) son observables.
* **Binding Unidireccional (`bind()`):**
  * `targetProperty.bind(sourceProperty)`: `targetProperty` siempre refleja el valor de `sourceProperty`.
* **Binding Bidireccional (`bindBidirectional()`):**
  * `property1.bindBidirectional(property2)`: Cambiar cualquiera de las propiedades actualiza la otra.
* **Listeners (`addListener()`):**
  * Para reaccionar a cambios en una propiedad.

```java
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
// ... (resto de imports)

public class BindingExample extends Application {
    @Override
    public void start(Stage primaryStage) {
        StringProperty name = new SimpleStringProperty("John Doe"); // Un modelo de datos simple

        Label nameLabel = new Label();
        TextField nameField = new TextField();

        // Binding unidireccional: Label se actualiza cuando 'name' cambia
        nameLabel.textProperty().bind(name);

        // Binding bidireccional: TextField y 'name' se mantienen sincronizados
        nameField.textProperty().bindBidirectional(name);

        VBox root = new VBox(10);
        root.getChildren().addAll(nameLabel, nameField);

        Scene scene = new Scene(root, 300, 200);
        primaryStage.setScene(scene);
        primaryStage.setTitle("Ejemplo de Binding");
        primaryStage.show();

        // Puedes cambiar 'name' programáticamente y la UI se actualizará
        name.set("Jane Smith"); // nameLabel y nameField se actualizan automáticamente
    }
    // ... main method
}
```

---

## 9. ⚡ Event Handling (Manejo de Eventos)

* **`setOnAction`**: Para eventos de acción (botones, menús).
* **`setOnMouseClicked`**: Para clics del ratón.
* **`setOnKeyPressed`**: Para pulsaciones de teclado.
* **`addEventHandler` / `removeEventHandler`**: Para manejo de eventos más avanzado (fase de captura/burbujeo).

```java
Button myButton = new Button("Clickeame");
myButton.setOnAction(event -> {
    System.out.println("Botón clickeado!");
    event.consume(); // Consumir el evento para que no se propague a los padres
});

// Evento de teclado en un Scene
scene.setOnKeyPressed(event -> {
    System.out.println("Tecla presionada: " + event.getCode());
    if (event.getCode() == KeyCode.ESCAPE) {
        System.out.println("Escape presionado. Saliendo...");
        Platform.exit();
    }
});
```

---

## 10. 💡 Buenas Prácticas y Consejos

* **Separación de Preocupaciones (MVC/MVP/MVVM)**: Utiliza FXML y controladores para separar la UI de la lógica de negocio. Para aplicaciones más grandes, considera patrones como MVC, MVP o MVVM.
* **Usa `Scene Builder`**: Es una herramienta visual para diseñar interfaces de JavaFX sin escribir FXML a mano. Genera el código FXML por ti.
* **Concurrencia (`Platform.runLater`)**: Las actualizaciones de la UI siempre deben hacerse en el hilo de la aplicación JavaFX (FX Application Thread). Si realizas operaciones largas en hilos de fondo, usa `Platform.runLater()` para actualizar la UI de forma segura.
  ```java
  new Thread(() -> {
      // ... lógica de fondo pesada
      Platform.runLater(() -> {
          // Actualización de UI segura aquí
          myLabel.setText("Tarea completada!");
      });
  }).start();
  ```
* **Manejo de Recursos**: Asegúrate de cerrar recursos (conexiones a BD, streams) adecuadamente.
* **Modularización (Java 9+)**: Aprovecha el sistema de módulos de Java para crear aplicaciones más seguras y con un tamaño de ejecución reducido.
* **Manejo de Errores**: Implementa un manejo robusto de excepciones.
* **Accesibilidad**: Ten en cuenta la accesibilidad al diseñar tus interfaces (teclado, contraste, etc.).

---

Este cheatsheet te proporciona una referencia completa y concisa de JavaFX, cubriendo los fundamentos y las características esenciales para construir aplicaciones de escritorio ricas y eficientes en Java.
