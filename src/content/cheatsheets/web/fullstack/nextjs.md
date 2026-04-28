---
title: "nextjs"
---


---

# 🚀 Next.js Cheatsheet Completo 🚀

Next.js es un framework de React para producción que ofrece las mejores características de desarrollo (como enrutamiento basado en sistema de archivos, optimización de imágenes, API Routes) y de rendimiento (renderizado del lado del servidor, generación estática, división de código).

---

## 1. 🌟 Conceptos Clave

* **Renderizado Híbrido**: Capacidad de usar Server-Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR) y Client-Side Rendering (CSR) en la misma aplicación.
* **App Router (por defecto)**: Basado en el directorio `app/`. Utiliza React Server Components y Client Components para un control más granular sobre dónde se renderiza el código (servidor vs. cliente).
* **Pages Router (legado)**: Basado en el directorio `pages/`. Renderizado por defecto en el cliente, pero con funciones de exportación para SSR (`getServerSideProps`) y SSG (`getStaticProps`).
* **Server Components**: Se renderizan en el servidor y no tienen estado ni efectos (no `useState`, `useEffect`). Reducen el tamaño del bundle de JavaScript del cliente.
* **Client Components**: Se envían al cliente y pueden usar estado, efectos y hooks del navegador. Deben tener `'use client'` al inicio del archivo.
* **File-system Routing**: Las rutas se definen mediante la estructura de directorios y nombres de archivos (ej. `app/dashboard/page.js` se mapea a `/dashboard`).
* **API Routes**: Permiten crear endpoints API en tu aplicación Next.js, eliminando la necesidad de un backend separado para ciertas funcionalidades.

---

## 2. 🛠️ Configuración Inicial

1. **Crear un Proyecto Next.js:**
   ```bash
   npx create-next-app@latest # Seguir las indicaciones (preferir App Router)
   # npx create-next-app@latest --experimental-app # Para versiones antiguas si no era el default
   ```2.  **Iniciar el Servidor de Desarrollo:**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

   Visita `http://localhost:3000`
2. **Construir para Producción:**
   ```bash
   npm run build
   ```
3. **Iniciar la Aplicación Construida:**
   ```bash
   npm start
   ```

---

## 3. 🗺️ Enrutamiento (App Router - `/app` Directory)

El nuevo sistema de enrutamiento basado en React Server Components.

* **`app/page.js`**: El archivo por defecto para una ruta. Representa la UI principal de una ruta.
  * Ej: `app/dashboard/page.js` -> `/dashboard`
* **`app/layout.js`**: Define la UI compartida para un segmento de ruta y sus hijos. **Obligatorio en el directorio `app` raíz.** Puede haber layouts anidados.
  * Ej: `app/layout.js` (layout raíz), `app/dashboard/layout.js` (layout específico del dashboard).
* **Rutas Anidadas**: Las carpetas anidadas definen rutas anidadas.
  * `app/dashboard/settings/page.js` -> `/dashboard/settings`
* **Rutas Dinámicas**: Crea rutas con parámetros.
  * `app/users/[userId]/page.js` -> `/users/123` (accede a `userId` con `params.userId` en el componente).
* **Catch-all Routes**: Captura todos los segmentos de una ruta.
  * `app/blog/[...slug]/page.js` -> `/blog/a/b/c` (slug será `['a', 'b', 'c']`).
* **Optional Catch-all Routes**: Captura todos los segmentos de una ruta, pero la ruta base también es opcional.
  * `app/shop/[[...slug]]/page.js` -> `/shop`, `/shop/a`, `/shop/a/b`.
* **Route Groups (`(folderName)`)**: Agrupa rutas sin afectar la URL. Útil para organizar layouts o rutas privadas.
  * `app/(marketing)/about/page.js` -> `/about`
* **Archivos de UI Especiales:**
  * **`loading.js`**: UI de carga para un segmento de ruta. Se muestra mientras el contenido se carga.
  * **`error.js`**: UI de error para un segmento de ruta y sus hijos. Captura errores de React.
  * **`template.js`**: Similar a `layout.js`, pero crea una nueva instancia del componente en cada navegación, lo que es útil para estados de animación.
  * **`not-found.js`**: UI personalizada para rutas 404.

### 3.1. Navegación (App Router)

* **`Link` Component (`next/link`)**: Componente preferido para la navegación del lado del cliente.
  ```jsx
  import Link from 'next/link';
  <Link href="/dashboard">Ir al Dashboard</Link>
  <Link href={{ pathname: '/posts', query: { id: 10 } }}>Post 10</Link>
  ```
* **`useRouter` Hook (`next/navigation`)**: Para navegación programática.
  ```jsx
  'use client'; // ¡Es un Client Component!
  import { useRouter } from 'next/navigation';

  function MyComponent() {
    const router = useRouter();
    const handleClick = () => {
      router.push('/settings'); // Navega a /settings
      // router.back(); // Va hacia atrás en el historial
      // router.refresh(); // Refresca los datos y re-renderiza el componente actual
    };
    return <button onClick={handleClick}>Ir a Configuración</button>;
  }
  ```*   **`useParams` / `useSearchParams` (`next/navigation`)**: Para acceder a parámetros de URL.
  ```jsx
  'use client';
  import { useParams, useSearchParams } from 'next/navigation';

  function UserProfile() {
    const params = useParams(); // { userId: '123' } si la ruta es /users/[userId]
    const searchParams = useSearchParams(); // URLSearchParams object
    const sort = searchParams.get('sort'); // /products?sort=asc -> 'asc'

    return <p>Usuario ID: {params.userId}, Ordenar por: {sort}</p>;
  }
  ```

---

## 4. 🗃️ Carga de Datos (App Router)

El App Router está diseñado para fetch de datos en Server Components.

### 4.1. Server Components (Fetch directo con `async/await`)

* Cualquier componente en `app/` es un Server Component por defecto (a menos que tenga `'use client'`).
* Puedes usar `async/await` directamente en ellos. `fetch` se extiende automáticamente con un caché de solicitud.

  ```jsx
  // app/products/page.js (Server Component)
  async function getProducts() {
    // Por defecto, 'fetch' cachea los datos (force-cache)
    const res = await fetch('https://api.example.com/products', { cache: 'force-cache' });
    // Para no cachear (SSR):
    // const res = await fetch('https://api.example.com/products', { cache: 'no-store' });
    // Para ISR (revalidar cada X segundos):
    // const res = await fetch('https://api.example.com/products', { next: { revalidate: 60 } }); // Revalidar cada 60s

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    return res.json();
  }

  export default async function ProductsPage() {
    const products = await getProducts(); // Directamente await en el componente

    return (
      <div>
        <h1>Nuestros Productos</h1>
        <ul>
          {products.map(product => (
            <li key={product.id}>{product.name} - ${product.price}</li>
          ))}
        </ul>
      </div>
    );
  }
  ```

### 4.2. Revalidación de Datos

* **Tiempo-basada (ISR)**: Con `revalidate` en `fetch` options.
* **Bajo Demanda**:
  * `revalidatePath(path)`: Revalida el caché para una ruta específica.
  * `revalidateTag(tag)`: Revalida el caché para requests con una `tag` específica.
    ```javascript
    // Ejemplo de fetch con tag para revalidación
    const res = await fetch('https://api.example.com/products', { next: { tags: ['products'] } });

    // En un Server Action o API Route para revalidar:
    import { revalidateTag } from 'next/cache';
    revalidateTag('products'); // Forzará una nueva obtención de datos para todas las requests con tag 'products'
    ```

### 4.3. Server Actions (`'use server'`)

* Funciones asíncronas que se ejecutan directamente en el servidor, llamadas desde componentes cliente o servidor.
* Permiten mutaciones de datos y revalidaciones eficientes sin construir API Routes manualmente.

  ```jsx
  // app/add-item-form.js (Client Component)
  'use client';
  import { useRef } from 'react';
  import { addItem } from '../actions/itemActions'; // Importa la Server Action

  export default function AddItemForm() {
    const formRef = useRef(null);

    async function onSubmit(formData) {
      await addItem(formData); // Llama a la Server Action
      formRef.current?.reset(); // Limpia el formulario
    }

    return (
      <form ref={formRef} action={onSubmit}> {/* Usa la Server Action directamente en 'action' */}
        <input type="text" name="itemName" required />
        <button type="submit">Añadir Ítem</button>
      </form>
    );
  }

  // actions/itemActions.js (Server Action)
  'use server';
  import { revalidatePath } from 'next/cache';
  import { redirect } from 'next/navigation';

  export async function addItem(formData) {
    const itemName = formData.get('itemName');
    // Lógica para guardar en DB
    console.log('Añadiendo ítem en el servidor:', itemName);

    revalidatePath('/dashboard'); // Revalida la ruta del dashboard para mostrar el nuevo ítem
    // redirect('/dashboard/success'); // Opcional: redirigir después de la acción
  }
  ```

### 4.4. Fetching en Client Components (CSR)

* Para datos que cambian con mucha frecuencia, dependen del estado del usuario, o no se pueden obtener en el servidor.
* Usa `useEffect` con librerías como SWR o React Query.

  ```jsx
  'use client';
  import useSWR from 'swr'; // npm install swr

  const fetcher = (url) => fetch(url).then((res) => res.json());

  function ClientSideData() {
    const { data, error, isLoading } = useSWR('/api/realtime-data', fetcher);

    if (error) return <div>Failed to load</div>;
    if (isLoading) return <div>Loading...</div>;
    return <div>Realtime Data: {data.value}</div>;
  }
  ```

---

## 5. 🎨 Estilización

* **CSS Modules (Recomendado)**: Archivos `.module.css`. Genera nombres de clase únicos.

  ```jsx
  // styles/Home.module.css
  .container {
    padding: 0 2rem;
  }
  .title {
    color: blue;
  }

  // app/page.js
  import styles from './Home.module.css';
  export default function HomePage() {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Mi Página</h1>
      </div>
    );
  }
  ```
* **Global CSS**: Importa `*.css` en `app/layout.js` o `app/globals.css`.

  ```css
  /* app/globals.css */
  body {
    margin: 0;
    font-family: sans-serif;
  }
  ```

  ```jsx
  // app/layout.js
  import './globals.css';
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
  ```
* **Tailwind CSS**: Integración fácil con `npx create-next-app`.
* **Styled Components / Emotion**: Requieren configuración para SSR.
* **CSS en línea**: Menos común, pero posible.

  ```jsx
  <p style={{ color: 'red', fontSize: '16px' }}>Texto rojo</p>
  ```

---

## 6. 🌐 API Routes (App Router - `/app/api` Directory)

Permite crear endpoints API RESTful o GraphQL en tu aplicación.

* **`app/api/route.js`**: El archivo que define la lógica de la API para una ruta.
* **Exporta funciones para métodos HTTP**: `GET`, `POST`, `PUT`, `DELETE`, etc.

  ```typescript
  // app/api/users/route.ts
  import { NextResponse } from 'next/server';

  let users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const user = users.find(u => u.id === parseInt(id));
      return user ? NextResponse.json(user) : new NextResponse('User not found', { status: 404 });
    }
    return NextResponse.json(users);
  }

  export async function POST(request: Request) {
    const newUser = await request.json();
    users.push({ id: users.length + 1, ...newUser });
    return NextResponse.json(newUser, { status: 201 });
  }

  export async function PUT(request: Request) {
    const { id, name } = await request.json();
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex > -1) {
      users[userIndex].name = name;
      return NextResponse.json(users[userIndex]);
    }
    return new NextResponse('User not found', { status: 404 });
  }

  export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const initialLength = users.length;
      users = users.filter(u => u.id !== parseInt(id));
      return initialLength !== users.length ? new NextResponse(null, { status: 204 }) : new NextResponse('User not found', { status: 404 });
    }
    return new NextResponse('Missing ID', { status: 400 });
  }
  ```

  * **Rutas Dinámicas en API Routes**: `app/api/users/[id]/route.ts`
    ```typescript
    // app/api/users/[id]/route.ts
    import { NextResponse } from 'next/server';

    export async function GET(request: Request, { params }: { params: { id: string } }) {
      const id = params.id;
      // Lógica para obtener usuario por ID
      return NextResponse.json({ id, name: `User ${id}` });
    }
    ```

---

## 7. 📸 Optimización de Imágenes (`next/image`)

Componente de React que optimiza las imágenes automáticamente para rendimiento y responsividad.

```jsx
import Image from 'next/image';

// Para imágenes locales (requiere que estén en /public o importadas)
import profilePic from '../public/profile.jpg';
<Image
  src={profilePic}
  alt="Foto de Perfil"
  width={500} // Se requiere ancho y alto para optimización
  height={500}
  placeholder="blur" // Opcional: efecto de blur mientras carga
/>

// Para imágenes remotas (requiere configuración en next.config.js)
<Image
  src="https://example.com/my-image.jpg"
  alt="Descripción"
  width={600}
  height={400}
  priority // Opcional: Carga la imagen con alta prioridad (para LCP)
/>
```

**Configuración de dominios de imágenes remotas en `next.config.js`:**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
module.exports = nextConfig;
```

---

## 8. 🔠 Optimización de Fuentes (`next/font`)

Optimiza las fuentes eliminando las solicitudes de red externas y garantizando que las fuentes se carguen antes de que el texto sea visible.

```jsx
// app/layout.js
import { Inter } from 'next/font/google'; // Para fuentes de Google
// import localFont from 'next/font/local'; // Para fuentes locales

const inter = Inter({ subsets: ['latin'] });
// const myLocalFont = localFont({ src: './my-font.woff2' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}> {/* Aplica la fuente como clase */}
      <body>{children}</body>
    </html>
  );
}
```

---

## 9. 📄 Metadatos y SEO (App Router)

Configura metadatos para SEO y redes sociales.

* **Exportar un objeto `metadata` (estático):**
  ```typescript
  // app/layout.js o app/page.js
  export const metadata = {
    title: 'Mi Título Personalizado',
    description: 'Esta es la descripción de mi página.',
    keywords: ['Next.js', 'React', 'SEO'],
    openGraph: {
      title: 'Mi Título Open Graph',
      description: 'Descripción para redes sociales.',
      url: 'https://example.com',
      siteName: 'Mi Sitio',
      images: [
        {
          url: 'https://example.com/og-image.jpg',
          width: 800,
          height: 600,
        },
      ],
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Mi Título Twitter',
      description: 'Descripción para Twitter.',
      creator: '@myhandle',
      images: ['https://example.com/twitter-image.jpg'],
    },
  };

  export default function Page() { /* ... */ }
  ```
* **Generar metadatos dinámicamente (`generateMetadata` función):**
  ```typescript
  // app/products/[id]/page.js
  import { Metadata } from 'next';

  type Props = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };

  export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const product = await fetch(`https://api.example.com/products/${params.id}`).then((res) => res.json());

    return {
      title: product.name,
      description: product.description,
      // ... otras propiedades de metadatos
    };
  }

  export default function ProductPage({ params }: Props) { /* ... */ }
  ```

---

## 10. 🗺️ Enrutamiento (Pages Router - `/pages` Directory - Legado)

* **`pages/index.js`**: La página raíz (`/`).
* **`pages/about.js`**: La página `/about`.
* **`pages/posts/[id].js`**: Ruta dinámica para `/posts/1`, `/posts/2`, etc.
* **`pages/api/hello.js`**: API Route para `/api/hello`.
* **`pages/_app.js`**: Componente de aplicación personalizado para inicializar páginas (manejo de estado global, inyección de CSS global).
* **`pages/_document.js`**: Personaliza el documento HTML (ej. añadir scripts externos).

### 10.1. Carga de Datos (Pages Router)

* **`getStaticProps` (SSG - Static Site Generation)**:

  * Pre-renderiza la página en tiempo de *build*.
  * No tiene acceso a `request` ni `response` directamente.
  * Útil para datos que no cambian con frecuencia.
  * `revalidate` (ISR): Vuelve a generar la página en segundo plano después de un tiempo si se accede.

  ```typescript
  // pages/blog/[slug].js
  export async function getStaticProps(context) {
    const { slug } = context.params;
    const post = await fetch(`https://api.example.com/posts/${slug}`).then(res => res.json());
    return {
      props: { post }, // Pasará 'post' como prop al componente de página
      revalidate: 60,  // Revalidar cada 60 segundos
    };
  }
  // getStaticPaths necesario para rutas dinámicas con SSG
  export async function getStaticPaths() {
    const posts = await fetch('https://api.example.com/posts').then(res => res.json());
    const paths = posts.map(post => ({ params: { slug: post.slug } }));
    return { paths, fallback: 'blocking' }; // 'blocking' muestra fallback o 404
  }

  function BlogPost({ post }) { return <h1>{{ post.title }}</h1>; }
  export default BlogPost;
  ```
* **`getServerSideProps` (SSR - Server-Side Rendering)**:

  * Pre-renderiza la página en cada *solicitud* al servidor.
  * Tiene acceso al objeto `req` y `res`.
  * Útil para datos que cambian con frecuencia o dependen de la solicitud.

  ```typescript
  // pages/dashboard.js
  export async function getServerSideProps(context) {
    const { req, res } = context; // Acceso a request y response
    // Autenticación o lógica dependiente de la solicitud
    const data = await fetch('https://api.example.com/dynamic-data').then(res => res.json());
    return {
      props: { data },
    };
  }
  function Dashboard({ data }) { return <h1>Dashboard: {{ data.value }}</h1>; }
  export default Dashboard;
  ```
* **Client-side Data Fetching**: Usando `useEffect` en el componente.

  ```jsx
  import React, { useState, useEffect } from 'react';
  function MyClientPage() {
    const [data, setData] = useState(null);
    useEffect(() => {
      fetch('/api/my-data').then(res => res.json()).then(setData);
    }, []);
    return <div>{data ? data.message : 'Loading...'}</div>;
  }
  export default MyClientPage;
  ```

---

## 11. 💡 Buenas Prácticas y Consejos

* **App Router por Defecto**: Para nuevos proyectos o migración, prioriza el App Router y los Server Components.
* **Cuándo `'use client'`**: Marca un componente como Client Component solo cuando necesite hooks de React (estado, efectos), manejo de eventos interactivo, o APIs del navegador. De lo contrario, déjalo como Server Component.
* **Colocación de datos**: Coloca la lógica de obtención de datos lo más cerca posible de donde se consumen (generalmente en Server Components en el App Router).
* **Optimización de Imágenes y Fuentes**: Usa `next/image` y `next/font` para un rendimiento óptimo.
* **SEO y Metadatos**: Configura los metadatos de tu página utilizando la exportación `metadata` o la función `generateMetadata` en el App Router.
* **Entornos**: Utiliza variables de entorno (`.env.local`) para configurar la aplicación según el entorno (desarrollo, producción).
  * Prefijo `NEXT_PUBLIC_` para variables accesibles en el cliente.
* **Errores**: Implementa `error.js` y `not-found.js` en el App Router para una mejor experiencia de usuario.
* **Validación de Esquemasy Tipado**: Usa TypeScript y librerías como Zod para validar datos de API y formularios.
* **Despliegue en Vercel**: Next.js está optimizado para Vercel, lo que facilita el despliegue y aprovecha al máximo sus características.

---

Este cheatsheet te proporciona una referencia completa de Next.js, cubriendo los conceptos esenciales, el App Router, la carga de datos, el enrutamiento, la estilización, las API Routes y las mejores prácticas. Es una herramienta indispensable para construir aplicaciones web modernas y de alto rendimiento.
