
---

# ➿ Programación Funcional (FP) Cheatsheet Completo ➿

La **Programación Funcional** es un paradigma de programación que construye software mediante la composición de funciones puras, evitando el estado compartido y los datos mutables. Su objetivo es crear programas más predecibles, testables y concurrentes.

---

## 1. 🌟 Principios Fundamentales

* **Inmutabilidad (Immutability)**:

  * Los datos no pueden ser modificados después de su creación.
  * En lugar de modificar un objeto existente, cualquier operación que "cambie" los datos devuelve una nueva instancia con los cambios.
  * **Beneficio**: Previene efectos secundarios inesperados y facilita el razonamiento sobre el estado del programa.
  * *Ejemplo (JavaScript/Python):*
    ```javascript
    // Imperativo (mutable)
    let arr = [1, 2, 3];
    arr.push(4); // arr es [1, 2, 3, 4]

    // Funcional (inmutable)
    const arr = [1, 2, 3];
    const newArr = [...arr, 4]; // newArr es [1, 2, 3, 4], arr sigue siendo [1, 2, 3]
    ```
* **Funciones Puras (Pure Functions)**:

  * Dada la misma entrada, siempre devuelve la misma salida.
  * No produce **efectos secundarios** (side effects).
  * No depende de ningún estado externo mutable.
  * **Beneficio**: Predecibles, fáciles de probar, pueden ser ejecutadas en paralelo y su orden de ejecución no importa.
  * *Ejemplo (Lenguaje Agnostico):*
    ```
    // Función Pura
    sumar(a, b):
      retorna a + b

    // Función Impura (depende de estado externo)
    total = 0
    sumarATotal(a):
      total = total + a // Modifica una variable externa
      retorna total

    // Función Impura (tiene efecto secundario)
    guardarEnBD(datos):
      escribirEnBaseDeDatos(datos) // Efecto secundario: modifica estado externo
      retorna "Guardado"
    ```
* **Sin Efectos Secundarios (No Side Effects)**:

  * Una función no debe causar ninguna interacción observable con el mundo exterior que no sea su valor de retorno.
  * Evita modificar variables globales, imprimir en consola, escribir en archivos, realizar llamadas de red, o mutar argumentos.
  * **Gestión**: Los efectos secundarios son inevitables en una aplicación real (I/O). El objetivo es minimizarlos y aislarlos en la periferia de la aplicación, utilizando funciones puras para la mayor parte de la lógica.
* **Transparencia Referencial (Referential Transparency)**:

  * Una expresión puede ser reemplazada por su valor sin cambiar el comportamiento del programa.
  * Es una consecuencia directa de usar funciones puras.
  * **Beneficio**: Facilita la optimización por el compilador y el razonamiento sobre el código.

---

## 2. 🧩 Conceptos Clave y Técnicas

* **Funciones de Primera Clase (First-Class Functions)**:

  * Las funciones se tratan como cualquier otra variable.
  * Pueden ser asignadas a variables, pasadas como argumentos a otras funciones, y devueltas como valores de funciones.
  * **Crucial para las Funciones de Orden Superior.**
  * *Ejemplo (Python):*
    ```python
    def saludar(nombre):
        return f"Hola, {nombre}"

    mi_funcion = saludar # Asignar a una variable
    print(mi_funcion("Mundo"))
    ```
* **Funciones de Orden Superior (Higher-Order Functions - HOFs)**:

  * Funciones que toman una o más funciones como argumentos, o devuelven una función como resultado.
  * Permiten la abstracción de patrones de comportamiento.
  * **Ejemplos clásicos**: `map`, `filter`, `reduce` (o `fold`).
  * *Ejemplo (JavaScript):*
    ```javascript
    function aplicarOperacion(arr, operacion) { // HOF
      return arr.map(operacion);
    }
    const duplicar = (x) => x * 2;
    const numeros = [1, 2, 3];
    const duplicados = aplicarOperacion(numeros, duplicar); // [2, 4, 6]
    ```
* **Composición de Funciones (Function Composition)**:

  * Combinar funciones más pequeñas para construir funciones más grandes y complejas, donde la salida de una función se convierte en la entrada de la siguiente.
  * `f(g(x))` (se lee de derecha a izquierda: `g` se aplica primero a `x`, luego `f` se aplica al resultado de `g`).
  * **Beneficio**: Código modular, legible y reutilizable.
  * *Ejemplo (Pseudocódigo):*
    ```
    duplicar(x) := x * 2
    sumarUno(x) := x + 1

    // Imperativo
    resultado = sumarUno(duplicar(5)) // (5 * 2) + 1 = 11

    // Composición
    compose(f, g) := x -> f(g(x))
    duplicarYSumarUno = compose(sumarUno, duplicar)
    resultado = duplicarYSumarUno(5) // 11
    ```
* **Recursión (Recursion)**:

  * Las funciones se llaman a sí mismas para resolver problemas que pueden dividirse en subproblemas más pequeños del mismo tipo.
  * Una alternativa a los bucles en la FP, ya que no implican la mutación de un contador o estado.
  * Requiere una **condición base** para terminar.
  * *Ejemplo (Python - factorial):*
    ```python
    def factorial(n):
        if n == 0: # Condición base
            return 1
        else:
            return n * factorial(n - 1) # Llamada recursiva
    ```
* **Currying (Currying)**:

  * Transforma una función que toma múltiples argumentos en una secuencia de funciones, cada una de las cuales toma un solo argumento.
  * *Ejemplo (JavaScript):*
    ```javascript
    // Función normal
    const add = (a, b) => a + b; // add(2, 3)

    // Función currificada
    const curriedAdd = (a) => (b) => a + b; // curriedAdd(2)(3)

    const addTwo = curriedAdd(2); // Retorna una nueva función
    console.log(addTwo(3)); // 5
    ```
* **Aplicación Parcial (Partial Application)**:

  * Fija uno o más argumentos de una función, devolviendo una nueva función con menos argumentos.
  * Relacionado con Currying, pero no necesita que cada función devuelva una función que tome *solo* un argumento.
  * *Ejemplo (JavaScript - usando `bind` o closure):*
    ```javascript
    const multiplicar = (a, b) => a * b;

    // Aplicación parcial para fijar el primer argumento
    const duplicar = multiplicar.bind(null, 2); // 'null' es el contexto 'this'
    console.log(duplicar(5)); // 10

    // Con closure
    const crearMultiplicador = (a) => (b) => a * b;
    const triplicar = crearMultiplicador(3);
    console.log(triplicar(4)); // 12
    ```

---

## 3. 🎯 Patrones Comunes de HOFs (Colecciones)

Estas funciones son omnipresentes en la programación funcional para operar sobre colecciones de forma inmutable.

* **`Map` (Transformación)**:

  * Aplica una función a cada elemento de una lista (o colección) y devuelve una **nueva lista** con los resultados, sin modificar la original.
  * *Ejemplo (Python):*
    ```python
    numeros = [1, 2, 3]
    cuadrados = list(map(lambda x: x * x, numeros)) # [1, 4, 9]
    ```
* **`Filter` (Filtrado)**:

  * Aplica una función de predicado (que devuelve `true` o `false`) a cada elemento de una lista y devuelve una **nueva lista** que contiene solo los elementos para los cuales el predicado devolvió `true`.
  * *Ejemplo (JavaScript):*
    ```javascript
    const edades = [10, 20, 25, 30];
    const adultos = edades.filter(edad => edad >= 18); // [20, 25, 30]
    ```
* **`Reduce` (Agregación / Plegado)**:

  * Aplica una función a una lista de elementos para reducirla a un **único valor**.
  * Toma un "acumulador" y un elemento actual, y devuelve el nuevo valor del acumulador.
  * *Ejemplo (Python):*
    ```python
    from functools import reduce
    numeros = [1, 2, 3, 4]
    suma = reduce(lambda acc, x: acc + x, numeros) # 10
    # Opcional: con valor inicial para el acumulador
    suma_con_inicial = reduce(lambda acc, x: acc + x, numeros, 100) # 110
    ```

---

## 4. 📈 Beneficios de la Programación Funcional

* **Facilita el Razonamiento**: Las funciones puras son más fáciles de entender porque su comportamiento es predecible y no hay estado oculto que rastrear.
* **Mayor Testabilidad**: Las funciones puras son triviales de probar, ya que solo dependen de sus entradas y no tienen efectos secundarios.
* **Concurrencia y Paralelismo**: La inmutabilidad y la ausencia de efectos secundarios eliminan los problemas de bloqueo y las condiciones de carrera, haciendo que el código sea inherentemente más seguro para entornos concurrentes.
* **Menos Bugs**: Reducción drástica de una clase común de bugs relacionados con el estado mutado y los efectos secundarios.
* **Código Más Conciso y Declarativo**: Permite expresar la lógica "qué hacer" en lugar de "cómo hacerlo", lo que a menudo resulta en código más corto y legible.
* **Mejor Composición y Reutilización**: Las funciones puras y el enfoque en la composición conducen a un código más modular y reutilizable.

---

## 5. ⚠️ Desafíos y Consideraciones

* **Gestión de Efectos Secundarios (I/O)**: Es el "problema" central en FP. Requiere patrones específicos (ej. Monads, si el lenguaje los soporta explícitamente como Haskell, o abstraer con Promesas en JS) para manejar I/O y otros efectos sin romper la pureza.
* **Curva de Aprendizaje**: Puede ser una forma de pensar muy diferente a la programación imperativa/orientada a objetos. Conceptos como currying, composición, y recursión pueden llevar tiempo de dominar.
* **Rendimiento**: La creación constante de nuevas copias de datos (inmutabilidad) puede tener un impacto en el rendimiento y el uso de memoria, aunque los lenguajes y librerías suelen tener optimizaciones (ej. estructuras de datos persistentes).
* **Depuración**: Las trazas de pila (stack traces) en la recursión profunda pueden ser difíciles de seguir.
* **Idiomaticidad**: No todos los lenguajes están igualmente adaptados a la programación funcional. Algunos (Haskell, Lisp) son puramente funcionales, mientras que otros (JavaScript, Python, Java 8+) son multiparadigma y permiten FP, pero requieren disciplina.

---

Este cheatsheet te proporciona una referencia completa de la Programación Funcional, cubriendo sus principios fundamentales, conceptos clave, técnicas comunes, beneficios y consideraciones importantes para que puedas empezar a aplicar este poderoso paradigma en tu desarrollo de software.
