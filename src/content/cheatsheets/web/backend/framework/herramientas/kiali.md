---
title: "kiali"
---


---

# 👁️ Kiali (Istio Service Mesh Observability) Cheatsheet Completo 👁️

**Kiali** es una consola de operaciones para Istio, que proporciona un mapa de la malla de servicios, gráficos de flujo de tráfico, vistas detalladas de la salud de los servicios, y la capacidad de depurar y validar la configuración de Istio. Permite a los desarrolladores y operadores visualizar el comportamiento de la malla, entender las relaciones entre servicios y detectar problemas de manera eficiente.

---

## 1. 🌟 Conceptos Clave

*   **Service Mesh Visualization (Visualización de la Malla de Servicios)**: Kiali genera un mapa topológico de tu malla, mostrando los servicios, las relaciones de tráfico entre ellos y sus métricas de salud.
*   **Traffic Flow (Flujo de Tráfico)**: Muestra cómo las solicitudes viajan entre los servicios en tiempo real.
*   **Health Status (Estado de Salud)**: Indicadores visuales de la salud de los servicios (ej. tasa de errores).
*   **Istio Configuration Validation**: Kiali puede validar tu configuración de Istio (VirtualServices, DestinationRules, Gateways, etc.) y señalar posibles errores o inconsistencias.
*   **Trace Integration (Integración de Trazas)**: Se integra con herramientas de trazabilidad como Jaeger para mostrar los detalles de las trazas de las solicitudes.
*   **Metrics Integration (Integración de Métricas)**: Utiliza Prometheus (el backend de métricas de Istio) para mostrar métricas detalladas de servicios y cargas de trabajo.

---

## 2. 🛠️ Instalación y Acceso

Kiali se instala como parte del ecosistema de Istio.

1.  **Asegúrate de que Istio esté instalado y funcionando.**
2.  **Instalar Kiali (con `istioctl`)**:
    *   Una forma común es con el perfil de instalación de Istio (ej. `demo` o `default` suelen incluir Kiali).
    *   Si no lo tienes, puedes instalarlo específicamente:
        ```bash
        istioctl install --set profile=demo # O el perfil que uses
        # O si ya tienes Istio y solo quieres Kiali:
        # istioctl install --set profile=default --set components.kiali.enabled=true
        ```
    *   También puedes instalarlo a través del repositorio de Helm de Istio.
3.  **Acceder a la UI de Kiali**:
    ```bash
    istioctl dashboard kiali
    ```
    *   Esto suele abrir un navegador en la URL correcta (ej. `http://localhost:20001`).
    *   Kiali te pedirá credenciales de Kubernetes (normalmente las de tu `kubectl` config).

---

## 3. 🖥️ Interfaz de Usuario (UI) y Navegación

Kiali se organiza en varias secciones principales en su barra lateral izquierda:

### 3.1. Overview (Vista General)

*   Proporciona una visión general de la salud de tus namespaces y cargas de trabajo.
*   **Filtros**: Permite filtrar por `Namespace`, `Istio Config`, `Health`, `Traffic`.

### 3.2. Graph (Grafo / Mapa de Servicios) - ¡La característica estrella!

*   Muestra un mapa topológico interactivo de tu malla de servicios.
*   **Visualización**:
    *   Nodos representan servicios, cargas de trabajo o aplicaciones.
    *   Aristas representan flujos de tráfico.
    *   Colores e iconos indican el estado de salud (verde = sano, naranja = advertencia, rojo = error).
    *   **Traffic Animation**: Puedes ver el flujo de tráfico en tiempo real.
*   **Filtros**: Por `Graph Type` (Service, Workload, App), `Namespace`, `Traffic`, `Response Time`, `Rate` (requests/second), `Refresh Rate`.
*   **Options (Opciones de Display)**:
    *   `Traffic`: `Requests`, `Request Percent`, `Responses` (ej. 5xx).
    *   `Node`: `Traffic`, `Health`, `Circuit Breakers`.
    *   `Layout`: Diferentes algoritmos de diseño del grafo.
*   **Context Menu (Menú Contextual)**: Haz clic derecho en un nodo o arista para ver opciones:
    *   `Health`, `Metrics`, `Traces`, `Traffic Routing`, `In/Outbound Metrics`.

### 3.3. Applications (Aplicaciones)

*   Lista todas las aplicaciones detectadas por Kiali.
*   **Vista Detallada de Aplicación**: Muestra la salud, métricas, Spans y logs de las cargas de trabajo asociadas a una aplicación.

### 3.4. Workloads (Cargas de Trabajo)

*   Lista todos los Pods/Deployments en el clúster.
*   **Vista Detallada de Carga de Trabajo**: Estado de salud, métricas, logs de contenedores, pods relacionados, configuraciones de Istio aplicadas.

### 3.5. Services (Servicios)

*   Lista todos los servicios de Kubernetes.
*   **Vista Detallada de Servicio**: Endpoints, métricas, estado de salud, configuraciones de Istio (VirtualService, DestinationRule) que afectan a este servicio.

### 3.6. Istio Config (Configuración de Istio)

*   Lista todos los recursos de configuración de Istio (VirtualService, DestinationRule, Gateway, PeerAuthentication, AuthorizationPolicy, etc.).
*   **Validación**: Kiali puede resaltar problemas de validación en tu configuración de Istio.
*   **Vista Detallada de Recurso**: Muestra la definición YAML y un gráfico de qué servicios afecta.

### 3.7. Traces (Trazas)

*   **Integración con Jaeger**: Kiali se conecta a Jaeger (el backend de trazabilidad de Istio por defecto) y muestra las trazas de las solicitudes a través de tus servicios.
*   Puedes filtrar trazas por servicio, operación, duración, etc.
*   Haciendo clic en una traza, te redirige a la interfaz de Jaeger para ver los detalles completos del Span.

### 3.8. Health (Salud)

*   Vista agregada de la salud de los servicios/aplicaciones.

---

## 4. 📈 Métricas y Observabilidad

Kiali utiliza Prometheus (el sistema de métricas de Istio) para mostrar gráficos de métricas detallados.

*   **Métricas de Servicios**: Tasa de éxito, tasa de errores, latencia (p50, p90, p99), tráfico (solicitudes por segundo).
*   **Métricas de Carga de Trabajo / Pods**: Uso de CPU, memoria, red.
*   **Filtrado y Agregación**: Puedes filtrar métricas por `response code`, `method`, `destination service`, `source workload`.
*   **Dashboards Personalizados**: Aunque Kiali proporciona gráficos predeterminados, también puedes configurar tus propios dashboards en Grafana usando las métricas de Prometheus que Istio y Kiali exponen.

---

## 5. 🛠️ Acciones y Funcionalidades Adicionales

*   **Traffic Routing (Configuración de Tráfico)**: Desde el grafo o la vista de servicio, puedes crear o modificar `VirtualServices` y `DestinationRules` directamente desde la UI de Kiali (o te proporciona el YAML). Útil para:
    *   **Traffic Shifting (Desvío de Tráfico)**: Enviar un porcentaje del tráfico a una nueva versión de un servicio.
    *   **Canary Deployments**: Despliegue gradual de una nueva versión a un pequeño subconjunto de usuarios.
    *   **A/B Testing**: Enviar tráfico a diferentes versiones basadas en reglas de cabecera/cookie.
*   **Inyección de Sidecar**: Kiali te puede ayudar a verificar si la inyección de sidecar de Envoy está habilitada o no para un namespace.
*   **Depuración de Políticas de Seguridad**: Visualiza cómo las `AuthorizationPolicies` afectan el flujo de tráfico.

---

## 6. 💡 Buenas Prácticas y Consejos

*   **Siempre usa `istioctl dashboard kiali`**: Es la forma más fiable de acceder a Kiali y asegura la autenticación correcta con tu clúster.
*   **Filtra por Namespace**: Si tienes múltiples namespaces, empieza filtrando por el namespace que te interesa para una visión más clara.
*   **Utiliza el Grafo (Graph View)**: Es la herramienta más poderosa de Kiali. Aprende a usar sus filtros y opciones de visualización para aislar rápidamente los problemas.
*   **Monitorea la Salud**: Presta atención a los colores de los nodos y aristas en el grafo para identificar rápidamente servicios con problemas (naranja/rojo).
*   **Integra Tracing (Jaeger)**: Asegúrate de que tu sistema de trazabilidad (Jaeger por defecto con Istio) esté configurado y enviando datos para que Kiali pueda mostrar las trazas.
*   **Monitorea las Métricas**: Sumérgete en los gráficos de métricas para entender el rendimiento, la latencia y la tasa de errores de tus servicios.
*   **Valida tu Configuración de Istio**: Utiliza la sección `Istio Config` para verificar la sintaxis y la semántica de tus objetos de Istio.
*   **Aprende a Navegar entre Secciones**: Salta del grafo a las métricas de un servicio, luego a sus trazas o a su configuración de Istio para depurar un problema de forma holística.
*   **Tiempo de Ventana (Time Range)**: Ajusta el rango de tiempo en la parte superior derecha de la UI para ver datos históricos o en tiempo real.
*   **Comprensión de Istio**: Kiali es una herramienta de visualización para Istio. Un buen entendimiento de los conceptos de Istio (VirtualService, DestinationRule, Gateway) es fundamental para interpretar lo que Kiali muestra.

---

Este cheatsheet te proporciona una referencia completa de Kiali, cubriendo sus conceptos esenciales, cómo instalarlo y acceder a él, la navegación de la UI, la visualización de métricas y trazas, las acciones disponibles y las mejores prácticas para comprender y depurar tu malla de servicios Istio.