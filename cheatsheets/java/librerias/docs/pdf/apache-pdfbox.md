¡Absolutamente! Apache PDFBox es una poderosa librería Java de código abierto para trabajar con documentos PDF. Aquí tienes un "cheatsheet" completo y bien estructurado de Apache PDFBox, optimizado para ser claro y conciso para una IA conversacional.

---

# 📄 Apache PDFBox Cheatsheet Completo 📄

Apache PDFBox es una biblioteca de código abierto que permite crear, manipular, extraer y procesar documentos PDF. Escrita completamente en Java, proporciona una API para manejar casi todos los aspectos de un archivo PDF, desde la creación de nuevas páginas hasta la extracción de texto y la manipulación de formularios.

---

## 1. 🌟 Conceptos Clave

* **`PDDocument`**: El objeto principal que representa un documento PDF completo en memoria.
* **`PDPage`**: Representa una sola página dentro de un `PDDocument`.
* **`PDPageContentStream`**: Una clase utilizada para dibujar contenido (texto, imágenes, formas) en una página.
* **Fonts (`PDFont`)**: Clases para manejar fuentes (ej. `PDType1Font` para fuentes estándar, `PDType0Font` para fuentes TrueType).
* **`PDImageXObject`**: Representa una imagen que puede ser añadida a una página.
* **`PDFTextStripper`**: Una utilidad para extraer texto de un documento PDF.
* **AcroForms (`PDAcroForm`)**: El módulo de PDFBox para trabajar con campos de formulario interactivos.

---

## 2. 🛠️ Configuración Inicial (Maven)

Añade la dependencia principal en tu `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.pdfbox</groupId>
        <artifactId>pdfbox</artifactId>
        <version>2.0.30</version> <!-- Usar la versión más reciente y estable -->
    </dependency>
    <!-- Opcional: Para el módulo de pre-vuelo (validación PDF/A) -->
    <dependency>
        <groupId>org.apache.pdfbox</groupId>
        <artifactId>pdfbox-tools</artifactId>
        <version>2.0.30</version>
    </dependency>
    <!-- Opcional: Para renderizar PDFs a imágenes (requiere Ghostscript en algunos casos) -->
    <dependency>
        <groupId>org.apache.pdfbox</groupId>
        <artifactId>pdfbox-app</artifactId>
        <version>2.0.30</version>
    </dependency>
</dependencies>
```

---

## 3. 🚀 Operaciones Básicas de Documentos

### 3.1. Crear un Nuevo Documento PDF

```java
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;

import java.io.IOException;

public class CreatePdf {
    public static void main(String[] args) throws IOException {
        PDDocument document = new PDDocument(); // Crear un documento vacío
        PDPage page = new PDPage(); // Crear una página vacía
        document.addPage(page); // Añadir la página al documento

        document.save("MyNewDocument.pdf"); // Guardar el documento
        document.close(); // Cerrar el documento (¡muy importante!)
        System.out.println("PDF 'MyNewDocument.pdf' creado exitosamente.");
    }
}
```

### 3.2. Cargar un Documento PDF Existente

```java
import org.apache.pdfbox.pdmodel.PDDocument;

import java.io.File;
import java.io.IOException;

public class LoadPdf {
    public static void main(String[] args) throws IOException {
        File file = new File("MyExistingDocument.pdf");
        if (!file.exists()) {
            System.out.println("Archivo no encontrado: MyExistingDocument.pdf");
            return;
        }

        PDDocument document = null;
        try {
            document = PDDocument.load(file);
            System.out.println("PDF 'MyExistingDocument.pdf' cargado. Número de páginas: " + document.getNumberOfPages());
        } finally {
            if (document != null) {
                document.close();
            }
        }
    }
}
```

### 3.3. Guardar y Cerrar un Documento

* `document.save(String filename)`: Guarda los cambios en un nuevo archivo o sobrescribe el existente.
* `document.close()`: **¡CRÍTICO!** Libera los recursos del documento. Siempre llama a `close()` en un bloque `finally` o usa un `try-with-resources`.

  ```java
  // Usando try-with-resources (preferido)
  try (PDDocument document = PDDocument.load(new File("input.pdf"))) {
      // Haz modificaciones aquí
      document.save("output.pdf");
  } catch (IOException e) {
      e.printStackTrace();
  }
  ```

---

## 4. 📄 Lectura y Extracción de Contenido

### 4.1. Extraer Texto de un PDF

```java
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.File;
import java.io.IOException;

public class ExtractText {
    public static void main(String[] args) throws IOException {
        File file = new File("DocumentWithText.pdf");
        if (!file.exists()) {
            System.out.println("Archivo no encontrado: DocumentWithText.pdf");
            return;
        }

        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();

            // Opcional: Extraer texto de páginas específicas
            // pdfStripper.setStartPage(1);
            // pdfStripper.setEndPage(1);

            String text = pdfStripper.getText(document);
            System.out.println("Texto extraído:\n" + text);
        }
    }
}
```

### 4.2. Extraer Imágenes de un PDF

Este es un proceso más complejo que implica iterar sobre los recursos de cada página.

```java
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.pdmodel.PDResources;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Map;

public class ExtractImages {
    public static void main(String[] args) throws IOException {
        File file = new File("DocumentWithImages.pdf");
        if (!file.exists()) {
            System.out.println("Archivo no encontrado: DocumentWithImages.pdf");
            return;
        }

        try (PDDocument document = PDDocument.load(file)) {
            for (int i = 0; i < document.getNumberOfPages(); i++) {
                PDPage page = document.getPage(i);
                PDResources resources = page.getResources();
                if (resources != null) {
                    Map<String, PDImageXObject> images = resources.getImages();
                    if (images != null) {
                        for (Map.Entry<String, PDImageXObject> entry : images.entrySet()) {
                            PDImageXObject image = entry.getValue();
                            BufferedImage bufferedImage = image.getImage();
                            File outputfile = new File("image_" + (i + 1) + "_" + entry.getKey() + ".png");
                            ImageIO.write(bufferedImage, "png", outputfile);
                            System.out.println("Imagen guardada: " + outputfile.getName());
                        }
                    }
                }
            }
        }
    }
}
```

### 4.3. Extraer Metadatos (Información del Documento)

```java
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;

import java.io.File;
import java.io.IOException;

public class ExtractMetadata {
    public static void main(String[] args) throws IOException {
        File file = new File("MyDocument.pdf");
        if (!file.exists()) {
            System.out.println("Archivo no encontrado: MyDocument.pdf");
            return;
        }

        try (PDDocument document = PDDocument.load(file)) {
            PDDocumentInformation info = document.getDocumentInformation();
            System.out.println("Título: " + info.getTitle());
            System.out.println("Autor: " + info.getAuthor());
            System.out.println("Asunto: " + info.getSubject());
            System.out.println("Palabras Clave: " + info.getKeywords());
            System.out.println("Creador: " + info.getCreator());
            System.out.println("Productor: " + info.getProducer());
            System.out.println("Fecha de Creación: " + info.getCreationDate());
            System.out.println("Fecha de Modificación: " + info.getModificationDate());
        }
    }
}
```

---

## 5. ✍️ Modificación y Añadir Contenido

### 5.1. Añadir Texto a una Página Existente

```java
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import java.io.File;
import java.io.IOException;

public class AddTextToPdf {
    public static void main(String[] args) throws IOException {
        File file = new File("ExistingDocument.pdf");
        if (!file.exists()) {
            System.out.println("Archivo no encontrado: ExistingDocument.pdf. Creando uno nuevo...");
            try (PDDocument doc = new PDDocument()) {
                doc.addPage(new PDPage());
                doc.save("ExistingDocument.pdf");
            }
        }

        try (PDDocument document = PDDocument.load(file)) {
            PDPage page = document.getPage(0); // Obtener la primera página

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true, true)) {
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 12); // Fuente y tamaño
                contentStream.setLeading(14.5f); // Espaciado entre líneas

                contentStream.newLineAtOffset(25, 750); // Posición inicial (x, y)
                contentStream.showText("Este es un nuevo texto añadido.");
                contentStream.newLine(); // Nueva línea
                contentStream.showText("¡Más texto en la siguiente línea!");
                contentStream.endText();
            }

            document.save("DocumentWithNewText.pdf");
            System.out.println("Texto añadido a 'DocumentWithNewText.pdf'.");
        }
    }
}
```

### 5.2. Añadir Imagen a una Página Existente

```java
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class AddImageToPdf {
    public static void main(String[] args) throws IOException {
        File file = new File("DocumentForImage.pdf");
        if (!file.exists()) {
            System.out.println("Archivo no encontrado: DocumentForImage.pdf. Creando uno nuevo...");
            try (PDDocument doc = new PDDocument()) {
                doc.addPage(new PDPage());
                doc.save("DocumentForImage.pdf");
            }
        }
      
        // Crear una imagen de ejemplo si no existe
        File imageFile = new File("example.png");
        if (!imageFile.exists()) {
            BufferedImage dummyImage = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB);
            ImageIO.write(dummyImage, "png", imageFile);
            System.out.println("Imagen de ejemplo 'example.png' creada.");
        }

        try (PDDocument document = PDDocument.load(file)) {
            PDPage page = document.getPage(0); // Obtener la primera página

            PDImageXObject pdImage = PDImageXObject.createFromFile("example.png", document); // Cargar la imagen

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true, true)) {
                contentStream.drawImage(pdImage, 50, 600, 100, 100); // x, y, ancho, alto
            }

            document.save("DocumentWithImage.pdf");
            System.out.println("Imagen añadida a 'DocumentWithImage.pdf'.");
        }
    }
}
```

### 5.3. Dibujar Formas y Líneas

```java
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import java.awt.Color;
import java.io.File;
import java.io.IOException;

public class DrawShapes {
    public static void main(String[] args) throws IOException {
        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
            // Dibujar una línea
            contentStream.setStrokingColor(Color.BLUE); // Color del trazo
            contentStream.setLineWidth(2); // Ancho de línea
            contentStream.moveTo(100, 500);
            contentStream.lineTo(200, 550);
            contentStream.stroke(); // Dibujar el trazo

            // Dibujar un rectángulo
            contentStream.setStrokingColor(Color.BLACK);
            contentStream.setLineWidth(1);
            contentStream.addRect(250, 450, 100, 50); // x, y, ancho, alto
            contentStream.stroke();

            // Dibujar un rectángulo relleno
            contentStream.setNonStrokingColor(Color.GREEN); // Color de relleno
            contentStream.addRect(250, 350, 100, 50);
            contentStream.fill(); // Rellenar

            // Dibujar texto con color
            contentStream.beginText();
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN), 18);
            contentStream.setNonStrokingColor(Color.RED); // Color del texto
            contentStream.newLineAtOffset(50, 100);
            contentStream.showText("Texto en Rojo!");
            contentStream.endText();
        }

        document.save("ShapesAndText.pdf");
        document.close();
        System.out.println("PDF 'ShapesAndText.pdf' creado con formas y texto.");
    }
}
```

---

## 6. 📁 Trabajar con Formularios (AcroForms)

### 6.1. Rellenar Campos de Formulario

```java
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDTextField;

import java.io.File;
import java.io.IOException;

public class FillForm {
    public static void main(String[] args) throws IOException {
        File file = new File("MyForm.pdf"); // Asegúrate de que este PDF tiene campos de formulario
        if (!file.exists()) {
            System.out.println("Archivo de formulario no encontrado: MyForm.pdf");
            return;
        }

        try (PDDocument document = PDDocument.load(file)) {
            PDAcroForm acroForm = document.getDocumentCatalog().getAcroForm();
            if (acroForm != null) {
                PDTextField nameField = (PDTextField) acroForm.getField("NameField"); // Reemplaza con el nombre de tu campo
                if (nameField != null) {
                    nameField.setValue("John Doe");
                    System.out.println("Campo 'NameField' rellenado.");
                } else {
                    System.out.println("Campo 'NameField' no encontrado.");
                }

                PDTextField emailField = (PDTextField) acroForm.getField("EmailField");
                if (emailField != null) {
                    emailField.setValue("john.doe@example.com");
                    System.out.println("Campo 'EmailField' rellenado.");
                } else {
                    System.out.println("Campo 'EmailField' no encontrado.");
                }
            } else {
                System.out.println("No se encontró AcroForm en el documento.");
            }

            document.save("FilledForm.pdf");
            System.out.println("Formulario rellenado y guardado como 'FilledForm.pdf'.");
        }
    }
}
```

### 6.2. Aplanar Formulario (Hacer los campos no editables)

```java
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;

import java.io.File;
import java.io.IOException;

public class FlattenForm {
    public static void main(String[] args) throws IOException {
        File file = new File("FilledForm.pdf"); // Usa el formulario rellenado del ejemplo anterior
        if (!file.exists()) {
            System.out.println("Archivo no encontrado: FilledForm.pdf");
            return;
        }

        try (PDDocument document = PDDocument.load(file)) {
            PDAcroForm acroForm = document.getDocumentCatalog().getAcroForm();
            if (acroForm != null) {
                acroForm.flatten(); // Esto elimina la interactividad de los campos
                System.out.println("Formulario aplanado.");
            } else {
                System.out.println("No se encontró AcroForm para aplanar.");
            }

            document.save("FlattenedForm.pdf");
            System.out.println("Formulario aplanado y guardado como 'FlattenedForm.pdf'.");
        }
    }
}
```

---

## 7. 🔒 Seguridad (Cifrado)

```java
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;

import java.io.File;
import java.io.IOException;

public class EncryptPdf {
    public static void main(String[] args) throws IOException {
        File file = new File("MyDocumentToEncrypt.pdf");
        if (!file.exists()) {
            System.out.println("Archivo no encontrado: MyDocumentToEncrypt.pdf. Creando uno nuevo...");
            try (PDDocument doc = new PDDocument()) {
                doc.addPage(new PDPage());
                try (PDPageContentStream cs = new PDPageContentStream(doc, doc.getPage(0))) {
                    cs.beginText();
                    cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                    cs.newLineAtOffset(50, 700);
                    cs.showText("Contenido secreto.");
                    cs.endText();
                }
                doc.save("MyDocumentToEncrypt.pdf");
            }
        }

        try (PDDocument document = PDDocument.load(file)) {
            // Definir permisos de acceso
            AccessPermission ap = new AccessPermission();
            ap.setCanPrint(false); // No permitir imprimir
            ap.setCanFillInForm(true); // Permitir rellenar formularios
            // ap.setCanExtractContent(false); // No permitir copiar texto/imágenes

            // Definir la política de protección
            // (owner password, user password, permissions)
            StandardProtectionPolicy spp = new StandardProtectionPolicy("ownerPass", "userPass", ap);
            spp.setEncryptionKeyLength(128); // 40, 128 (estándar), 256
            spp.setPermissions(ap); // Reestablecer permisos por si acaso

            document.protect(spp); // Aplicar la protección

            document.save("EncryptedDocument.pdf");
            System.out.println("PDF 'EncryptedDocument.pdf' cifrado.");
        }
    }
}
```

---

## 8. 💡 Buenas Prácticas y Consejos

* **Siempre cierra el documento (`document.close()`):** Es la regla más importante. PDFBox carga el PDF en memoria y utiliza archivos temporales. No cerrar el documento puede llevar a fugas de memoria, archivos corruptos y problemas de recursos. Usa `try-with-resources` siempre que sea posible.
* **Manejo de `IOException`**: Las operaciones de archivo siempre deben manejar `IOException`.
* **Checksum de Fuentes**: Si incrustas fuentes TrueType (`PDType0Font.load()`), asegúrate de que estás usando la versión correcta de la fuente, ya que los cambios en el archivo de la fuente pueden afectar el renderizado.
* **Coordenadas en PDF**: El origen (0,0) está en la esquina inferior izquierda de la página. Las coordenadas X aumentan hacia la derecha y las Y aumentan hacia arriba.
* **Modificar PDFs**: Cuando modifiques un PDF existente, siempre es una buena práctica guardar los cambios en un **nuevo archivo** en lugar de sobrescribir el original, hasta que estés seguro de que los cambios son correctos.
* **Rendimiento**: Para PDFs muy grandes, considera cargar solo las páginas necesarias o usar técnicas de optimización si la memoria es una preocupación.
* **Errores de Fuentes**: Si el texto no se muestra correctamente, es probable que sea un problema de fuente. Asegúrate de que la fuente está incrustada o que es una de las 14 fuentes estándar de PDF (ej. Helvetica, Times-Roman).
* **Más Allá de lo Básico**: PDFBox tiene capacidades mucho más avanzadas (ej. firmas digitales, renderizado a imágenes, PDF/A validation, edición de comentarios, optimización de PDF). Consulta la documentación oficial para funcionalidades específicas.

---

Este cheatsheet te proporciona una referencia completa de Apache PDFBox, cubriendo desde las operaciones básicas de documentos hasta la manipulación de contenido, formularios y seguridad, junto con consideraciones clave para un uso efectivo.
