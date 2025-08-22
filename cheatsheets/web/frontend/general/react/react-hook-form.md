¡Excelente elección! React Hook Form es una librería fantástica para la gestión de formularios en React, conocida por su rendimiento y facilidad de uso. Aquí tienes un "cheatsheet" completo y detallado, optimizado para ser claro y conciso para una IA conversacional.

---

# 📝 React Hook Form Cheatsheet Completo 📝

React Hook Form es una librería de alto rendimiento para la validación de formularios con React, que minimiza los re-renders y simplifica la gestión del estado del formulario, utilizando hooks no controlados (uncontrolled components) por defecto.

---

## 1. 🌟 Conceptos Clave

* **Rendimiento**: Se enfoca en componentes no controlados (uncontrolled components), minimizando re-renders y optimizando el rendimiento.
* **Hooks**: Utiliza hooks de React para gestionar el estado del formulario y la validación.
* **Validación Declarativa**: Permite definir reglas de validación directamente en los inputs o a través de esquemas externos (Zod, Yup).
* **Aislamiento de Errores**: Solo los inputs con errores se re-renderizan, no todo el formulario.
* **Simplicidad**: API sencilla y fácil de aprender.

---

## 2. 🛠️ Configuración Inicial

1. **Instalación:**
   ```bash
   npm install react-hook-form
   # o
   yarn add react-hook-form
   ```
2. **Instalación de Resolvers (Opcional, para validación externa):**
   ```bash
   npm install @hookform/resolvers @hookform/resolvers/zod zod # Ejemplo con Zod
   # o
   npm install @hookform/resolvers @hookform/resolvers/yup yup # Ejemplo con Yup
   ```

---

## 3. 🎯 El Hook Principal: `useForm()`

Este es el hook central que proporciona toda la funcionalidad necesaria para tu formulario.

**Sintaxis Básica:**

```javascript
import { useForm } from 'react-hook-form';

function MyForm() {
  const {
    register,         // Función para registrar inputs
    handleSubmit,     // Función para envolver tu manejador de envío
    formState: {     // Objeto que contiene el estado del formulario (errores, isDirty, isValid, etc.)
      errors,         // Objeto con los errores de validación
      isDirty,        // true si el formulario ha sido modificado
      isValid,        // true si el formulario es válido (cumple con las reglas de validación)
      isSubmitting,   // true mientras el formulario se está enviando
      isSubmitted,    // true después del primer envío
      submitCount,    // Número de veces que el formulario ha sido enviado
    },
    watch,            // Función para observar valores de input
    setValue,         // Función para actualizar valores de input programáticamente
    getValues,        // Función para obtener todos los valores del formulario
    reset,            // Función para resetear el formulario
    control,          // Objeto para usar con componentes controlados (ej. con Controller)
  } = useForm({
    // Opciones de configuración
    defaultValues: {},   // Valores por defecto del formulario
    resolver: undefined, // Resolver para validación con librerías externas
    mode: 'onSubmit',    // Cuándo activar la validación ('onChange', 'onBlur', 'onSubmit', 'onTouched', 'all')
    reValidateMode: 'onChange', // Cuándo revalidar después de un error
    criteriaMode: 'firstError', // 'firstError' o 'all' para errores de validación
  });

  // ... lógica del formulario
}
```

### Opciones Comunes de `useForm`

* **`defaultValues: object`**:
  * Establece los valores iniciales del formulario. Muy útil para formularios de edición.
  * ```javascript
    useForm({
      defaultValues: {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        email: '',
      }
    });
    ```
* **`mode: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all'`**:
  * Define cuándo se activan las validaciones.
    * `onSubmit` (por defecto): La validación se activa al enviar el formulario.
    * `onBlur`: Se valida cuando el campo pierde el foco.
    * `onChange`: Se valida con cada cambio en el campo. (Puede ser intensivo en re-renders).
    * `onTouched`: Se valida solo después de que el campo ha sido "tocado" (blurred una vez).
    * `all`: Se valida en todos los eventos (onChange y onSubmit).
* **`resolver: function`**:
  * Integración con librerías de validación de esquemas (Zod, Yup, Joi, Vest, etc.).
  * ```javascript
    import { zodResolver } from '@hookform/resolvers/zod';
    import { z } from 'zod';

    const schema = z.object({
      username: z.string().min(3, 'Mínimo 3 caracteres'),
      email: z.string().email('Email inválido'),
    });

    useForm({
      resolver: zodResolver(schema),
      defaultValues: { username: '', email: '' },
    });
    ```
* **`criteriaMode: 'firstError' | 'all'`**:
  * `firstError` (por defecto): Muestra solo el primer error encontrado para un campo.
  * `all`: Muestra todos los errores para un campo.

---

## 4. 📝 Registrando Inputs con `register()`

`register()` es la función clave para vincular los inputs de tu formulario con React Hook Form.

**Sintaxis Básica:**

```jsx
<input {...register("nombreDelCampo")} />
```

**Con Reglas de Validación Incorporadas:**

Puedes pasar un segundo argumento a `register` con un objeto de reglas de validación.

* **`required`**: `boolean | string`
  * `true` o un mensaje de error si el campo es obligatorio.
  * ```jsx
    <input {...register("firstName", { required: "Este campo es obligatorio" })} />
    ```
* **`minLength`**: `number | object`
  * Longitud mínima del valor.
  * ```jsx
    <input {...register("password", { minLength: { value: 6, message: "Mínimo 6 caracteres" } })} />
    ```
* **`maxLength`**: `number | object`
  * Longitud máxima del valor.
* **`min`**: `number | object`
  * Valor numérico mínimo.
  * ```jsx
    <input type="number" {...register("age", { min: { value: 18, message: "Debes ser mayor de 18" } })} />
    ```
* **`max`**: `number | object`
  * Valor numérico máximo.
* **`pattern`**: `RegExp | object`
  * Expresión regular para validar el formato del valor.
  * ```jsx
    <input {...register("email", { pattern: { value: /^\S+@\S+$/i, message: "Formato de email inválido" } })} />
    ```
* **`validate`**: `function | object`
  * Una función (o un objeto de funciones) para validaciones personalizadas.
  * Recibe el valor del campo y los valores de todo el formulario.
  * Debe devolver `true` si es válido, o un `string` (mensaje de error) si no lo es.
  * ```jsx
    <input
      {...register("confirmPassword", {
        validate: (value) =>
          value === watch("password") || "Las contraseñas no coinciden",
      })}
    />
    ```

---

## 5. ❌ Manejo de Errores (`formState.errors`)

El objeto `errors` te permite acceder a los mensajes de error para cada campo.

```jsx
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("username", { required: "Usuario es obligatorio" })}
        placeholder="Usuario"
      />
      {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}

      <input
        type="password"
        {...register("password", { minLength: { value: 6, message: "Contraseña debe tener al menos 6 caracteres" } })}
        placeholder="Contraseña"
      />
      {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
```

---

## 6. 🚀 Envío del Formulario (`handleSubmit()`)

`handleSubmit` es la función que envuelve tu función de envío real. Se encarga de la validación antes de ejecutar tu lógica.

```javascript
// Dentro de tu componente de formulario:
const { handleSubmit } = useForm();

// 1. Función que se ejecuta si la validación es exitosa
const onSubmit = (data) => {
  console.log("Datos enviados:", data);
  // Aquí llamarías a tu API
};

// 2. (Opcional) Función que se ejecuta si la validación falla
const onError = (errors, e) => {
  console.log("Errores de validación:", errors);
  // Aquí podrías hacer scroll a los campos con error, etc.
};

return (
  // Puedes pasar solo el onSubmit
  <form onSubmit={handleSubmit(onSubmit)}>
    {/* ... inputs */}
    <button type="submit">Enviar</button>
  </form>

  // O pasar también un callback de error
  // <form onSubmit={handleSubmit(onSubmit, onError)}>
  //   {/* ... inputs */}
  //   <button type="submit">Enviar</button>
  // </form>
);
```

---

## 7. 🔄 Actualización y Observación de Valores

* **`setValue(name, value, options)`**:
  * Establece el valor de un campo programáticamente.
  * `options`: `{ shouldValidate: boolean, shouldDirty: boolean, shouldTouch: boolean }`
  * ```javascript
    // Después de alguna lógica
    setValue('firstName', 'Jane', { shouldValidate: true, shouldDirty: true });
    ```
* **`watch(name?: string | string[], defaultValue?: any)`**:
  * Observa el valor de un campo o de todos los campos. Útil para mostrar valores en tiempo real o para lógica condicional.
  * **¡CUIDADO!** Si llamas a `watch()` sin argumentos, tu componente se re-renderizará con cada cambio en cualquier input.
  * ```jsx
    // Observar un solo campo
    const firstName = watch("firstName");
    // Observar varios campos
    const [firstName, lastName] = watch(["firstName", "lastName"]);
    // Observar todos los campos (causa re-render en cada cambio)
    const allValues = watch();

    return <p>Hola, {firstName}</p>;
    ```
* **`getValues(name?: string | string[])`**:
  * Obtiene el valor de un campo o de todos los campos **sin suscribirse a cambios** (no causa re-renders).
  * Útil para acceder a valores en funciones de validación personalizadas o en manejadores de eventos.
  * ```javascript
    const passwordValue = getValues("password");
    // O dentro de un validate:
    validate: (value) => value === getValues("password") || "No coinciden"
    ```

---

## 8. 🏗️ Formularios con Componentes Controlados (`Controller` / `useController`)

Por defecto, React Hook Form funciona mejor con componentes no controlados (usando la ref del `register`). Sin embargo, muchos componentes de UI (Material UI, Ant Design, etc.) son componentes controlados que requieren las props `value` y `onChange`.

### `Controller` Component (Recomendado para componentes de UI)

```jsx
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material'; // Ejemplo con Material UI

function ControlledForm() {
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        rules={{ required: 'Email es obligatorio' }} // Reglas de validación aquí
        render={({ field }) => ( // `field` contiene props { onChange, onBlur, value, name, ref }
          <TextField
            {...field} // Pasa todas las props de `field` al componente
            label="Email"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ''}
          />
        )}
      />
      <Button type="submit">Enviar</Button>
    </form>
  );
}
```

### `useController` Hook (Para control más granular o componentes personalizados)

```jsx
import { useForm, useController } from 'react-hook-form';
import { Slider } from '@mui/material'; // Ejemplo con un Slider

function MySliderInput({ control, name }) {
  const {
    field: { value, onChange, ...restField },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: 'Slider es obligatorio', min: 10 },
    defaultValue: 0,
  });

  return (
    <>
      <Slider
        value={value}
        onChange={onChange}
        {...restField}
        // Puedes añadir más props aquí si es necesario
      />
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </>
  );
}

function ParentForm() {
  const { handleSubmit, control } = useForm();
  const onSubmit = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <MySliderInput name="volume" control={control} />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

---

## 9. 🗑️ Resetear Formulario (`reset()`)

* Restablece el formulario a sus `defaultValues` (o a un objeto vacío si no se especifican `defaultValues`).
* ```javascript
  const { reset } = useForm();
  // ...
  <button onClick={() => reset()}>Limpiar Formulario</button>

  // Resetear con nuevos valores
  reset({
    firstName: '',
    lastName: '',
  });
  ```

---

## 10. 🎯 Otros Hooks Útiles

* **`useWatch()`**:
  * Una alternativa a `watch()` que **no causa re-renders del componente actual** si los valores observados no son necesarios para el renderizado del mismo componente. Es más eficiente para observar valores en componentes hijos.
  * ```jsx
    // Dentro de un componente hijo que necesita saber el valor de 'name'
    import { useWatch } from 'react-hook-form';
    import { useFormContext } from 'react-hook-form'; // Necesario si no pasas 'control' por props

    function DisplayName() {
      const { control } = useFormContext(); // O lo pasas desde el padre
      const firstName = useWatch({
        control,
        name: 'firstName',
        defaultValue: 'Invitado',
      });
      return <p>Mostrando: {firstName}</p>;
    }
    ```
* **`useFieldArray()`**:
  * Para gestionar listas dinámicas de campos (añadir, eliminar, mover elementos en un array de inputs).
  * ```javascript
    import { useFieldArray } from 'react-hook-form';

    function DynamicFields() {
      const { control, register, handleSubmit } = useForm({
        defaultValues: {
          items: [{ name: "" }]
        }
      });
      const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
      });

      return (
        <form onSubmit={handleSubmit(data => console.log(data))}>
          {fields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`items.${index}.name`)} />
              <button type="button" onClick={() => remove(index)}>X</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ name: "" })}>Añadir Item</button>
          <button type="submit">Enviar</button>
        </form>
      );
    }
    ```
* **`useFormContext()`**:
  * Para formularios anidados o muy grandes donde pasar `control` y otras props de `useForm` a través de muchos niveles de componentes se vuelve tedioso. Requiere que `FormProvider` envuelva el formulario.
  * ```jsx
    // ParentComponent.js
    import { useForm, FormProvider } from 'react-hook-form';
    import ChildComponent from './ChildComponent';

    function ParentComponent() {
      const methods = useForm();
      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(data => console.log(data))}>
            <ChildComponent />
            <button type="submit">Enviar</button>
          </form>
        </FormProvider>
      );
    }

    // ChildComponent.js
    import { useFormContext } from 'react-hook-form';

    function ChildComponent() {
      const { register, formState: { errors } } = useFormContext();
      return (
        <>
          <input {...register('firstName')} />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </>
      );
    }
    ```

---

## 11. ⚙️ DevTools (Opcional)

* La extensión de React DevTools es muy útil para inspeccionar el estado de tus formularios gestionados por React Hook Form.

---

## 12. 💡 Buenas Prácticas y Consejos

* **Componentes no controlados por defecto**: Siempre que sea posible, usa la ref (`{...register("name")}`) directamente en tus inputs nativos (`<input>`, `<select>`, `<textarea>`) para obtener el mejor rendimiento.
* **Utiliza `Controller` para librerías de UI**: Cuando uses componentes de librerías como Material UI, Ant Design, o Chakra UI, utiliza el componente `Controller` para integrarlos correctamente.
* **Centraliza tu validación**: Para formularios complejos, usa un `resolver` con librerías de esquemas como Zod o Yup. Mantiene tu lógica de validación limpia y separada.
* **Usa `defaultValues`**: Siempre define `defaultValues` en tu `useForm` para evitar componentes no controlados que cambian a controlados y viceversa, lo que puede causar advertencias en React.
* **`mode` Importa**: Elige el `mode` de validación adecuado para tu UX. `onBlur` o `onSubmit` suelen ser buenas opciones para evitar validaciones intrusivas al escribir.
* **`useWatch` vs `watch`**: Si solo necesitas observar un valor en un componente hijo y no quieres que el componente padre se re-renderice, usa `useWatch` dentro del hijo.
* **Optimiza mensajes de error**: Muestra los mensajes de error cerca del campo correspondiente para una mejor usabilidad.
* **Divide formularios grandes**: Para formularios muy grandes o complejos, considera usar `useFormContext` con `FormProvider` para evitar el prop-drilling de `control`.
* **Estado de envío**: Utiliza `formState.isSubmitting` para deshabilitar el botón de envío mientras el formulario se está procesando.

---

Este cheatsheet debería proporcionarte una referencia completa y eficaz para trabajar con React Hook Form, permitiéndote construir formularios robustos y de alto rendimiento.
