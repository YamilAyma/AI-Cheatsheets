
---

# ⛑️ Helm Cheatsheet Completo ⛑️

**Helm** es el gestor de paquetes para Kubernetes. Te ayuda a definir, instalar y actualizar incluso las aplicaciones de Kubernetes más complejas. Los "paquetes" de Helm se llaman **Charts**.

---

## 1. 🌟 Conceptos Clave

*   **Chart (Gráfico)**: Un paquete de Helm. Contiene toda la información necesaria para definir una aplicación Kubernetes, incluyendo configuraciones y manifiestos (YAMLs) de Kubernetes, y puede ser versionado. Es la "unidad" desplegable en Helm.
*   **Release (Lanzamiento)**: Una instancia de un Chart desplegada en un clúster de Kubernetes. Cuando instalas un Chart, Helm crea una Release. Puedes tener múltiples Releases del mismo Chart.
*   **Repository (Repositorio)**: Un lugar donde se pueden almacenar y compartir Charts de Helm. Los Charts se descargan de estos repositorios.
*   **Values (Valores)**: Un archivo YAML (`values.yaml`) que contiene los valores de configuración para un Chart. Puedes sobrescribir estos valores al instalar o actualizar un Chart.
*   **Templates (Plantillas)**: Los archivos YAML de manifiesto de Kubernetes dentro de un Chart que contienen lógica de plantilla (Go templating) para rellenar valores dinámicamente.
*   **Subchart (Subgráfico)**: Un Chart que se incluye dentro de otro Chart, lo que permite la composición de aplicaciones más grandes.

---

## 2. 🛠️ Configuración Inicial

1.  **Instalar Helm (CLI):**
    *   **macOS (Homebrew)**: `brew install helm`
    *   **Linux (Snap)**: `sudo snap install helm --classic`
    *   **Windows (Chocolatey)**: `choco install kubernetes-helm`
    *   O descarga los binarios desde [github.com/helm/helm/releases](https://github.com/helm/helm/releases).
2.  **Verificar Instalación:**
    ```bash
    helm version
    ```
3.  **Configurar Acceso al Clúster Kubernetes**: Helm utiliza la configuración de `kubectl` (`~/.kube/config`). Asegúrate de que `kubectl` pueda conectarse a tu clúster.

---

## 3. 🚀 Gestión de Repositorios de Charts

### 3.1. Añadir un Repositorio Remoto

*   Para poder instalar Charts de repositorios públicos o privados.
    ```bash
    helm repo add stable https://charts.helm.sh/stable # Repositorio clásico (ahora obsoleto)
    helm repo add bitnami https://charts.bitnami.com/bitnami # Repositorio popular (ej. para WordPress, Redis)
    ```

### 3.2. Listar Repositorios

```bash
helm repo list
```

### 3.3. Actualizar Repositorios

*   Descarga los índices más recientes de todos los repositorios.
    ```bash
    helm repo update
    ```

### 3.4. Buscar Charts en Repositorios

```bash
helm search repo wordpress # Busca 'wordpress' en los repositorios añadidos
helm search hub wordpress # Busca 'wordpress' en Helm Hub (repositorios públicos indexados)
```

---

## 4. 📦 Gestión de Charts y Releases

### 4.1. Crear un Nuevo Chart (Scaffold)

*   Genera la estructura de un Chart vacío.
    ```bash
    helm create my-new-app
    ```
    *   Esto crea un directorio `my-new-app/` con una estructura estándar:
        *   `Chart.yaml`: Información del Chart (nombre, versión, etc.).
        *   `values.yaml`: Valores de configuración por defecto.
        *   `charts/`: Para subcharts.
        *   `templates/`: Contiene los manifiestos de Kubernetes (YAMLs) con templating.
        *   `templates/NOTES.txt`: Mensaje que se muestra después de un despliegue exitoso.

### 4.2. Instalar un Chart

*   **Desde un Repositorio:**
    ```bash
    helm install my-release bitnami/wordpress --version 15.0.0 # Instala 'wordpress' del repo 'bitnami'
    ```
    *   `my-release`: Nombre que le das a esta instancia (Release).
    *   `bitnami/wordpress`: Nombre del Chart.
    *   `--version`: Opcional, especifica una versión del Chart.
*   **Desde un Directorio Local (para Charts que estás desarrollando):**
    ```bash
    cd my-new-app/
    helm install my-local-release . # Instala el Chart desde el directorio actual
    ```
*   **Sobrescribir Valores por Defecto (`values.yaml`)**:
    *   `--set key=value`: Sobrescribe valores individuales.
        ```bash
        helm install my-release bitnami/wordpress --set service.type=NodePort,wordpressUsername=myuser
        ```
    *   `-f <file.yaml>`: Proporciona un archivo YAML con valores personalizados.
        ```bash
        helm install my-release bitnami/wordpress -f my-custom-values.yaml
        ```
        *   **`my-custom-values.yaml`**:
            ```yaml
            service:
              type: NodePort
            wordpressUsername: myuser
            ```

### 4.3. Listar Releases

*   **`helm list`**: Muestra todas las Releases en el namespace actual.
*   `helm list -A` / `helm list --all-namespaces`: Muestra Releases en todos los namespaces.
*   `helm list -a` / `helm list --all`: Muestra Releases de todos los estados (instaladas, fallidas, desinstaladas).

### 4.4. Obtener Información de una Release

*   **`helm status <release-name>`**: Muestra el estado de una Release.
*   **`helm get values <release-name>`**: Muestra los valores configurados para una Release.
*   **`helm get manifest <release-name>`**: Muestra los manifiestos Kubernetes renderizados de una Release.
*   **`helm get all <release-name>`**: Muestra toda la información sobre una Release.

### 4.5. Actualizar una Release

*   **`helm upgrade <release-name> <chart> [options]`**: Actualiza una Release a una nueva versión del Chart o con nuevos valores.
    ```bash
    helm upgrade my-release bitnami/wordpress # Actualiza a la última versión del Chart (si hay nueva)
    helm upgrade my-release bitnami/wordpress -f my-new-values.yaml # Aplica nuevos valores
    ```
*   **`--install` (o `-i`)**: Si la Release no existe, la instala. Útil en pipelines de CI/CD.

### 4.6. Deshacer un Despliegue (Rollback)

*   **`helm rollback <release-name> [revision]`**: Revierte una Release a una revisión anterior.
    ```bash
    helm rollback my-release # Revierte a la revisión anterior
    helm rollback my-release 1 # Revierte a la revisión 1
    ```
*   **`helm history <release-name>`**: Muestra el historial de revisiones de una Release.

### 4.7. Desinstalar una Release

*   **`helm uninstall <release-name>`**: Elimina una Release (y todos los recursos de Kubernetes asociados).
    ```bash
    helm uninstall my-release
    ```

---

## 5. 📄 Estructura de un Chart (Directorio `my-new-app/`)

```
my-new-app/
├── Chart.yaml                  # Información del Chart
├── values.yaml                 # Valores de configuración por defecto
├── charts/                     # Subcharts (opcional)
│   └── my-subchart/
│       ├── Chart.yaml
│       └── ...
├── templates/                  # Manifiestos de Kubernetes con templating
│   ├── _helpers.tpl            # Plantillas auxiliares (funciones reusables)
│   ├── deployment.yaml         # Definición de Deployment
│   ├── service.yaml            # Definición de Service
│   ├── ingress.yaml            # Definición de Ingress (opcional)
│   ├── serviceaccount.yaml     # Service Account (opcional)
│   ├── configmap.yaml          # ConfigMap (opcional)
│   ├── secret.yaml             # Secret (opcional)
│   └── NOTES.txt               # Mensaje post-instalación
├── Chart.lock                  # Lock file (generado, como package-lock.json)
└── .helmignore                 # Archivos a ignorar al empaquetar
```

---

## 6. 📝 Templating (Dentro de `templates/*.yaml`)

Helm utiliza Go templating para procesar los manifiestos de Kubernetes.

*   **Variables de Valores (`.Values`)**: Acceso a los valores definidos en `values.yaml` o pasados con `--set` / `-f`.
    ```yaml
    # deployment.yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: {{ .Release.Name }}-{{ .Chart.Name }} # Acceso a variables de la Release/Chart
    spec:
      replicas: {{ .Values.replicaCount }} # Accede a replicaCount de values.yaml
      template:
        spec:
          containers:
            - name: {{ .Chart.Name }}
              image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
              ports:
                - containerPort: {{ .Values.service.port }}
              env:
                - name: DATABASE_HOST
                  value: {{ .Values.database.host | quote }} # Citas para valores de string
    ```
*   **Variables de la Release (`.Release`)**:
    *   `.Release.Name`: Nombre de la Release (ej. `my-release`).
    *   `.Release.Namespace`: Namespace donde se despliega la Release.
    *   `.Release.Service`: Nombre del servicio que realizó la instalación.
    *   `.Release.IsUpgrade`: `true` si es una actualización.
    *   `.Release.IsInstall`: `true` si es una instalación.
*   **Variables del Chart (`.Chart`)**:
    *   `.Chart.Name`: Nombre del Chart.
    *   `.Chart.Version`: Versión del Chart.
*   **Variables de Ámbito (`.Capabilities`)**: Información sobre el clúster (versión de K8s, API).
*   **Funciones de Plantilla (Built-in Functions)**:
    *   `{{ .Values.key | default "defaultValue" }}`: Valor por defecto.
    *   `{{ .Values.key | quote }}`: Citas para cadenas.
    *   `{{ .Values.key | upper }}`: Convertir a mayúsculas.
    *   `{{ include "my-app.fullname" . | nindent 4 }}`: Incluye una plantilla auxiliar. `nindent` para indentación.
    *   `{{ toYaml .Values.myComplexObject | nindent 2 }}`: Convierte a YAML e indenta.
*   **Estructuras de Control**:
    *   **`{{ if .Values.ingress.enabled }}` / `{{ else }}` / `{{ end }}`**: Condicionales.
    *   **`{{ range $key, $value := .Values.myList }}`**: Iteración.

---

## 7. 💡 Buenas Prácticas y Consejos

*   **Valores por Defecto Claros (`values.yaml`)**: Proporciona valores sensatos y bien documentados en `values.yaml`.
*   **Nombres Consistentes**: Usa nombres consistentes para tus variables, especialmente en `values.yaml` y en los manifiestos.
*   **Modulariza tus Plantillas**: Divide los manifiestos en archivos separados (ej. `deployment.yaml`, `service.yaml`).
*   **Utiliza Plantillas Auxiliares (`_helpers.tpl`)**: Para funciones de plantilla reutilizables (ej. para generar nombres completos, etiquetas comunes). Se definen con `define`.
*   **Probando Plantillas (`helm lint`, `helm template`)**:
    *   `helm lint my-app/`: Verifica el Chart en busca de problemas de sintaxis y buenas prácticas.
    *   `helm template my-release my-app/ -f my-values.yaml`: Renderiza los manifiestos de Kubernetes sin desplegarlos en el clúster. **¡Esencial para depurar!**
*   **Pruebas de Releases (`helm test`)**: Puedes incluir pruebas de integración o de "salud" en tus Charts (en `templates/tests/`).
    ```bash
    helm test <release-name>
    ```
*   **Chartmuseum**: Para alojar tus propios repositorios de Charts privados.
*   **Integración con CI/CD**: Helm se integra muy bien con pipelines de CI/CD para automatizar el despliegue.
*   **Imágenes Específicas**: Siempre usa tags de imágenes específicas (ej. `my-image:1.0.0`) en lugar de `latest` para garantizar la reproducibilidad.
*   **Personaliza sin Modificar el Chart**: Usa `helm install/upgrade -f custom-values.yaml` o `--set` en lugar de modificar directamente los Charts de terceros.

---

Este cheatsheet te proporciona una referencia completa de Helm, cubriendo sus conceptos esenciales, cómo gestionar Charts y Releases, la estructura de un Chart, el templating y las mejores prácticas para definir, instalar y actualizar aplicaciones en Kubernetes de manera eficiente.