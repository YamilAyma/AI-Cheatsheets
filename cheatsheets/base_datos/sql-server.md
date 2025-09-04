
---

# ⚙️ Microsoft SQL Server Cheatsheet Completo ⚙️

**Microsoft SQL Server** es un sistema de gestión de bases de datos relacionales (RDBMS) desarrollado por Microsoft. Ofrece capacidades robustas para el almacenamiento de datos, la gestión, la recuperación y el análisis, y es ampliamente utilizado en aplicaciones empresariales y sistemas de Business Intelligence.

---

## 1. 🌟 Conceptos Clave Específicos de SQL Server

* **Transact-SQL (T-SQL)**: La extensión propietaria de Microsoft al estándar SQL. Añade funcionalidades como variables, control de flujo, funciones personalizadas y procedimientos almacenados.
* **Instancia (Instance)**: Un solo servicio del motor de base de datos SQL Server. Un servidor físico puede albergar múltiples instancias de SQL Server.
* **Base de Datos (Database)**: Una colección lógica de objetos (tablas, vistas, procedimientos almacenados, funciones, índices).
* **Esquema (Schema)**: Un contenedor lógico de objetos de base de datos. Sirve para agrupar y gestionar permisos. Cada objeto (tabla, vista) pertenece a un esquema (ej. `dbo.Users`). `dbo` es el esquema por defecto.
* **Master Database**: Contiene metadatos de la instancia de SQL Server.
* **msdb Database**: Utilizado por SQL Server Agent para programar tareas.
* **tempdb Database**: Base de datos temporal para objetos temporales y operaciones de clasificación/hash.
* **model Database**: Plantilla para todas las nuevas bases de datos.
* **SQL Server Management Studio (SSMS)**: La herramienta gráfica principal para administrar SQL Server.
* **SQL Server Agent**: Un componente para programar y automatizar tareas administrativas (jobs).

---

## 2. 🛠️ Configuración Inicial y Conexión

1. **Instalar SQL Server Express/Developer Edition**: Descarga desde [microsoft.com/sql-server/sql-server-downloads](https://www.microsoft.com/en-us/sql-server/sql-server-downloads).
2. **Instalar SQL Server Management Studio (SSMS)**: Descarga desde [docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms).
3. **Conectarse a través de SSMS**: Usa la autenticación de Windows o la autenticación de SQL Server (usuario `sa`).

---

## 3. 📝 DDL (Data Definition Language) - Definición de Estructura

### 3.1. `CREATE`

* **`CREATE DATABASE`**:
  ```sql
  CREATE DATABASE MiAplicacionDB;
  GO -- Delimitador de lote en T-SQL
  ```
* **`USE`**: Selecciona la base de datos.
  ```sql
  USE MiAplicacionDB;
  GO
  ```
* **`CREATE TABLE`**:
  ```sql
  CREATE TABLE Usuarios (
      UsuarioID INT PRIMARY KEY IDENTITY(1,1), -- Clave primaria con auto-incremento (semilla, incremento)
      Nombre VARCHAR(100) NOT NULL,
      Email VARCHAR(255) UNIQUE,
      FechaRegistro DATETIME DEFAULT GETDATE(), -- Fecha y hora actual por defecto
      EsActivo BIT DEFAULT 1, -- BIT es 0 o 1, usado como booleano
      Saldo DECIMAL(10, 2) DEFAULT 0.00,
      CONSTRAINT CK_EdadMinima CHECK (Edad >= 18) -- Constraint de verificación
  );

  CREATE TABLE Pedidos (
      PedidoID INT PRIMARY KEY IDENTITY(1,1),
      UsuarioID INT NOT NULL,
      FechaPedido DATETIME DEFAULT GETDATE(),
      Total DECIMAL(10, 2) NOT NULL,
      CONSTRAINT FK_UsuarioID FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
          ON DELETE CASCADE   -- Si el usuario se elimina, sus pedidos también
          ON UPDATE NO ACTION -- No hacer nada si el ID de usuario se actualiza
  );
  GO
  ```

### 3.2. `ALTER`

* **`ALTER TABLE`**:
  * Añadir columna:
    ```sql
    ALTER TABLE Usuarios
    ADD Telefono VARCHAR(20) NULL; -- NULL o NOT NULL
    ```
  * Eliminar columna:
    ```sql
    ALTER TABLE Usuarios
    DROP COLUMN Telefono;
    ```
  * Modificar tipo de columna:
    ```sql
    ALTER TABLE Usuarios
    ALTER COLUMN Nombre VARCHAR(150) NOT NULL;
    ```
  * Añadir clave foránea:
    ```sql
    ALTER TABLE Pedidos
    ADD CONSTRAINT FK_Pedidos_Productos FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID);
    ```

### 3.3. `DROP`

* **`DROP DATABASE`**:
  ```sql
  DROP DATABASE MiAplicacionDB;
  ```
* **`DROP TABLE`**:
  ```sql
  DROP TABLE Pedidos;
  ```

### 3.4. `TRUNCATE`

* **`TRUNCATE TABLE`**: Elimina todas las filas, reinicia el `IDENTITY`. Más rápido que `DELETE` sin `WHERE`. Es un DDL y no es transaccional.
  ```sql
  TRUNCATE TABLE Usuarios;
  ```

---

## 4. 🗃️ DML (Data Manipulation Language) - Manipulación de Datos

### 4.1. `INSERT`

* **`INSERT INTO`**:
  ```sql
  INSERT INTO Usuarios (Nombre, Email) VALUES ('Ana López', 'ana@example.com');
  INSERT INTO Usuarios VALUES (DEFAULT, 'Pedro Martínez', 'pedro@example.com', GETDATE(), 1, 50.00); -- DEFAULT para IDENTITY
  ```
* **Múltiples filas (SQL Server 2008+):**
  ```sql
  INSERT INTO Productos (Nombre, Precio) VALUES
  ('Laptop', 1200.00),
  ('Mouse', 25.50),
  ('Teclado', 75.00);
  ```

### 4.2. `UPDATE`

* **`UPDATE ... SET ... WHERE`**: **¡Siempre usa `WHERE`!**
  ```sql
  UPDATE Usuarios
  SET Email = 'ana.lopez@nuevo.com', EsActivo = 0
  WHERE UsuarioID = 1;

  UPDATE Productos
  SET Precio = Precio * 1.10
  WHERE Nombre LIKE '%Laptop%';
  ```

### 4.3. `DELETE`

* **`DELETE FROM ... WHERE`**: **¡Siempre usa `WHERE`!**
  ```sql
  DELETE FROM Usuarios
  WHERE UsuarioID = 2;

  DELETE FROM Pedidos
  WHERE FechaPedido < '2023-01-01';
  ```

---

## 5. 🔍 DQL (Data Query Language) - Consulta de Datos

### 5.1. `SELECT`

* **Todo**: `SELECT * FROM Usuarios;`
* **Columnas específicas**: `SELECT Nombre, Email FROM Usuarios;`
* **Alias de columna**: `SELECT Nombre AS NombreCompleto, Email AS CorreoElectronico FROM Usuarios;`
* **Valores Distintos**: `SELECT DISTINCT Ciudad FROM Usuarios;`
* **Limitar resultados (`TOP`)**:
  ```sql
  SELECT TOP 10 * FROM Usuarios; -- Primeras 10 filas
  SELECT TOP 5 PERCENT * FROM Productos ORDER BY Precio DESC; -- El 5% más caro
  ```

### 5.2. `WHERE` (Filtrado)

* Condiciones: `status_code:200`, `user.name:john AND level:ERROR`, `response_time > 100`, `NOT category:admin`, `_exists_:field_name`
  ```sql
  SELECT * FROM Productos WHERE Precio > 100 AND EsActivo = 1;
  SELECT Nombre, Email FROM Usuarios WHERE Nombre LIKE 'A%' OR Nombre LIKE 'B%';
  SELECT * FROM Pedidos WHERE Total BETWEEN 50 AND 100;
  SELECT * FROM Usuarios WHERE UsuarioID IN (1, 3, 5);
  SELECT * FROM Usuarios WHERE Telefono IS NULL;
  ```
* **String Matching**: `LIKE` (con `%` para 0 o más caracteres, `_` para un solo carácter).
  * `'A%'`: Empieza por A.
  * `'%man%'`: Contiene 'man'.
  * `'_a%'`: Segunda letra es 'a'.

### 5.3. `ORDER BY` (Ordenación)

* `ASC` (por defecto), `DESC`.
  ```sql
  SELECT Nombre, Edad FROM Usuarios ORDER BY Edad DESC, Nombre ASC;
  ```

### 5.4. `OFFSET` / `FETCH NEXT` (Paginación - SQL Server 2012+)

```sql
SELECT * FROM Productos
ORDER BY ProductoID
OFFSET 20 ROWS        -- Saltar las primeras 20 filas
FETCH NEXT 10 ROWS ONLY; -- Obtener las siguientes 10 filas
```

### 5.5. `GROUP BY` y `HAVING`

* `GROUP BY` (Agrupación):
  ```sql
  SELECT Categoria, COUNT(*) AS TotalProductos, AVG(Precio) AS PrecioPromedio
  FROM Productos
  GROUP BY Categoria;
  ```
* `HAVING` (Filtrado de Grupos):
  ```sql
  SELECT Categoria, COUNT(*) AS TotalProductos
  FROM Productos
  GROUP BY Categoria
  HAVING COUNT(*) > 5 AND AVG(Precio) < 500;
  ```

---

## 6. 🧮 Funciones Comunes de T-SQL

### 6.1. Funciones de Cadena

* `LEN(s)`: Longitud de la cadena (caracteres).
* `SUBSTRING(s, start, length)`: Extrae subcadena.
* `LOWER(s)`, `UPPER(s)`: Convertir a minúsculas/mayúsculas.
* `TRIM(s)`, `LTRIM(s)`, `RTRIM(s)`: Eliminar espacios.
* `REPLACE(s, find_str, replace_str)`: Reemplaza subcadenas.
* `CONCAT(s1, s2, ...)`: Concatena cadenas.
* `CAST(expression AS type)` / `CONVERT(type, expression)`: Conversión de tipos.

### 6.2. Funciones Numéricas

* `ABS(n)`, `ROUND(n, decimals)`, `CEILING(n)`, `FLOOR(n)`.
* `RAND()`: Número aleatorio.

### 6.3. Funciones de Fecha y Hora

* `GETDATE()`: Fecha y hora actual del sistema.
* `SYSDATETIME()`: Fecha y hora actual con mayor precisión.
* `CURRENT_TIMESTAMP`: Equivalente a `GETDATE()`.
* `DATEADD(interval, number, date)`: Añadir una cantidad a una fecha.
  * `DATEADD(day, 7, GETDATE())`: Añade 7 días.
* `DATEDIFF(interval, date1, date2)`: Diferencia entre dos fechas.
  * `DATEDIFF(year, '2000-01-01', GETDATE())`: Diferencia en años.
* `DATENAME(interval, date)`: Nombre de la parte de la fecha (ej. `MONTH`).
* `DATEPART(interval, date)`: Número de la parte de la fecha (ej. `MONTH` como entero).
* `FORMAT(value, format_string)` (SQL Server 2012+): Formatea valores.

### 6.4. Funciones de Agregación (Revisadas en SQL)

* `COUNT(column)` / `COUNT(*)`: Número de filas. `COUNT(DISTINCT column)`: Valores únicos.
* `SUM(column)`, `AVG(column)`, `MIN(column)`, `MAX(column)`.

---

## 7. 🔄 JOINS (Combinación de Tablas)

* **`INNER JOIN`**: Filas que coinciden en ambas tablas.
  ```sql
  SELECT U.Nombre, P.FechaPedido
  FROM Usuarios AS U
  INNER JOIN Pedidos AS P ON U.UsuarioID = P.UsuarioID;
  ```
* **`LEFT JOIN`** (o `LEFT OUTER JOIN`): Todas las filas de la tabla izquierda, y las coincidentes de la derecha.
  ```sql
  SELECT U.Nombre, P.PedidoID
  FROM Usuarios AS U
  LEFT JOIN Pedidos AS P ON U.UsuarioID = P.UsuarioID;
  ```
* **`RIGHT JOIN`** (o `RIGHT OUTER JOIN`): Todas las filas de la tabla derecha, y las coincidentes de la izquierda.
* **`FULL JOIN`** (o `FULL OUTER JOIN`): Todas las filas cuando hay una coincidencia en cualquiera de las tablas.
* **`CROSS JOIN`**: Producto cartesiano.

### 7.1. `UNION` / `UNION ALL`

* **`UNION`**: Combina resultados, elimina duplicados.
* **`UNION ALL`**: Combina resultados, incluye duplicados.

  ```sql
  SELECT Nombre FROM Clientes
  UNION
  SELECT Nombre FROM Empleados;
  ```

---

## 8. 🪆 Subconsultas (Subqueries) y CTEs

* **Subconsultas**:
  ```sql
  SELECT Nombre FROM Usuarios
  WHERE UsuarioID IN (SELECT UsuarioID FROM Pedidos WHERE Total > 100);
  ```
* **CTE (Common Table Expressions - SQL Server 2005+)**: Definiciones de conjuntos de resultados temporales. Mejor legibilidad y reutilización.
  ```sql
  WITH PedidosGrandes AS (
      SELECT UsuarioID, Total
      FROM Pedidos
      WHERE Total > 500
  )
  SELECT U.Nombre, PG.Total
  FROM Usuarios AS U
  INNER JOIN PedidosGrandes AS PG ON U.UsuarioID = PG.UsuarioID;
  ```

---

## 9. ⚙️ Procedimientos Almacenados (Stored Procedures)

Bloques de código T-SQL guardados y ejecutados en el servidor.

```sql
CREATE PROCEDURE ObtenerProductosPorPrecio
    @PrecioMax DECIMAL(10, 2)
AS
BEGIN
    SELECT Nombre, Precio
    FROM Productos
    WHERE Precio <= @PrecioMax;
END;
GO

-- Ejecutar:
EXEC ObtenerProductosPorPrecio @PrecioMax = 100.00;
GO
```

---

## 10. 🔑 DCL (Data Control Language) - Control de Acceso

* **`CREATE LOGIN`**: Crea un login a nivel de servidor (usuario de SQL Server).
  ```sql
  CREATE LOGIN MyUser WITH PASSWORD = 'MyStrongPassword123!', CHECK_POLICY = ON;
  GO
  ```
* **`CREATE USER`**: Crea un usuario de base de datos y lo mapea a un login.
  ```sql
  USE MiAplicacionDB;
  CREATE USER MyUser FOR LOGIN MyUser;
  GO
  ```
* **`GRANT`**: Otorga permisos a un usuario/rol.
  ```sql
  GRANT SELECT, INSERT ON dbo.Usuarios TO MyUser;
  GRANT EXECUTE ON OBJECT::dbo.ObtenerProductosPorPrecio TO MyUser; -- Permiso para SP
  GO
  ```
* **`REVOKE`**: Revoca permisos.
  ```sql
  REVOKE DELETE ON dbo.Usuarios FROM MyUser;
  GO
  ```

---

## 11. 🔄 TCL (Transaction Control Language) - Control de Transacciones

* **`BEGIN TRANSACTION`**: Inicia una transacción.
* **`COMMIT TRANSACTION`**: Guarda cambios.
* **`ROLLBACK TRANSACTION`**: Deshace cambios.
* **`SAVE TRANSACTION`**: Define un punto de guardado.

  ```sql
  BEGIN TRANSACTION;
  UPDATE Cuentas SET Saldo = Saldo - 100 WHERE CuentaID = 1;
  UPDATE Cuentas SET Saldo = Saldo + 100 WHERE CuentaID = 2;
  -- IF (@@ERROR <> 0) ROLLBACK TRANSACTION; -- Comprobar si hubo error
  COMMIT TRANSACTION;
  GO
  ```

---

## 12. 📊 Índices (Indexes)

Mejoran el rendimiento de las operaciones de recuperación de datos.

* **`CREATE INDEX`**:
  ```sql
  CREATE INDEX IX_Usuarios_Email ON Usuarios (Email);
  CREATE UNIQUE INDEX UQ_Productos_Nombre ON Productos (Nombre); -- Índice único
  ```
* **`DROP INDEX`**:
  ```sql
  DROP INDEX IX_Usuarios_Email ON Usuarios; -- A nivel de tabla
  ```
* **Tipos de Índices**: Clustered (determina el orden físico de los datos), Non-clustered (estructura de datos separada).
* **`EXPLAIN` / `SHOWPLAN`**: En SSMS, puedes usar "Display Estimated Execution Plan" (Ctrl+L) o "Include Actual Execution Plan" (Ctrl+M) para analizar el rendimiento de las consultas.

---

## 13. 🖼️ Vistas (Views)

Tablas virtuales.

* **`CREATE VIEW`**:
  ```sql
  CREATE VIEW ProductosActivos AS
  SELECT ProductoID, Nombre, Precio
  FROM Productos
  WHERE EsActivo = 1;
  GO
  ```

---

## 14. 💡 Buenas Prácticas y Consejos

* **Utiliza SSMS**: Es la herramienta principal para la administración, desarrollo y depuración.
* **Transact-SQL**: Aprende T-SQL para aprovechar las extensiones de SQL Server (variables, lógica de flujo, SPs).
* **Procedimientos Almacenados**: Úsalos para encapsular lógica de negocio compleja en la base de datos, mejorar la seguridad, el rendimiento y la mantenibilidad.
* **Índices para Columnas Clave**: Crea índices en columnas usadas en `WHERE`, `JOIN` y `ORDER BY`. No indexar en exceso.
* **Normalización**: Diseña tu base de datos de forma normalizada para reducir la redundancia.
* **Seguridad a Capas**: Implementa seguridad a nivel de servidor (Logins), a nivel de base de datos (Users), y a nivel de esquema/objeto (Permisos).
* **Backups y Restauración**: Establece una estrategia robusta de copias de seguridad y recuperación.
* **Monitoreo**: Utiliza SQL Server Agent para programar jobs de monitoreo y mantenimiento. Usa las Dynamic Management Views (DMVs) para obtener información del estado del servidor.
* **Evita `SELECT *` en Producción**: Especifica siempre las columnas necesarias.
* **Cifrado y Auditoría**: Implementa cifrado de datos en reposo y en tránsito. Habilita la auditoría para seguir las actividades de la base de datos.
* **Planeamiento de Ejecución**: Analiza los planes de ejecución de tus consultas para identificar cuellos de botella y optimizar el rendimiento.

---

Este cheatsheet te proporciona una referencia completa y concisa de Microsoft SQL Server, cubriendo sus conceptos esenciales, comandos DDL/DML/DQL/DCL/TCL, funciones T-SQL, objetos de base de datos y las mejores prácticas para gestionar y consultar bases de datos relacionales de manera efectiva en el entorno de Microsoft.
