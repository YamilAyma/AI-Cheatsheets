
---

# 🚀 Azure DevOps Cheatsheet Completo 🚀

**Azure DevOps** es un conjunto de servicios de desarrollo de software que proporciona un entorno de extremo a extremo para el ciclo de vida del desarrollo, desde la planificación y el seguimiento hasta la compilación, las pruebas y el despliegue. Es una plataforma integral para la gestión de proyectos, el control de versiones y la automatización de CI/CD.

---

## 1. 🌟 Servicios Principales

Azure DevOps se compone de cinco servicios principales:

* **Azure Boards**: Herramienta de seguimiento de trabajo ágil para planificación, seguimiento de progreso y gestión de proyectos.
* **Azure Repos**: Repositorios de control de versiones (Git o TFVC) para tu código.
* **Azure Pipelines**: Servicio de Integración Continua (CI) y Entrega Continua (CD) para compilar, probar y desplegar tu código.
* **Azure Test Plans**: Herramienta de gestión de pruebas para planificación, ejecución y seguimiento de pruebas.
* **Azure Artifacts**: Servicio de gestión de paquetes para crear, alojar y compartir paquetes (NuGet, npm, Maven, Python).

---

## 2. 📋 Azure Boards (Planificación y Seguimiento)

* **Work Items (Elementos de Trabajo)**: La unidad básica de seguimiento (ej. `Epic`, `Feature`, `User Story`, `Task`, `Bug`).
* **Backlogs**:
  * **Product Backlog**: Lista de historias de usuario, características y bugs.
  * **Iteration Backlog (Sprint Backlog)**: Elementos de trabajo asignados a una iteración/sprint.
* **Boards**: Tableros Kanban para visualizar el flujo de trabajo (columnas como `New`, `Active`, `Resolved`, `Closed`).
* **Sprints**: Planificación de iteraciones (sprints) con fechas de inicio y fin.
* **Queries (Consultas)**: Consultas personalizadas para buscar y filtrar elementos de trabajo.
* **Dashboards**: Paneles personalizables con widgets para visualizar el progreso (burndown charts, diagramas de flujo acumulado).

---

## 3. 📂 Azure Repos (Control de Versiones)

* **Git**: (Recomendado) Sistema de control de versiones distribuido.
* **TFVC (Team Foundation Version Control)**: Sistema de control de versiones centralizado.

### 3.1. Operaciones Comunes (Git)

* **Repos**: Crea y gestiona repositorios Git.
* **Branches (Ramas)**: Aísla el trabajo en ramas (ej. `feature/my-new-feature`).
* **Pull Requests (PRs)**: El mecanismo para la revisión de código.
  * Requiere revisores, enlaza elementos de trabajo, comprueba políticas de rama.
* **Branch Policies (Políticas de Rama)**: Protege ramas importantes (`main`, `develop`).
  * **Require a minimum number of reviewers**: Requiere aprobaciones.
  * **Check for linked work items**: Requiere que los PRs estén vinculados a elementos de trabajo.
  * **Check for comment resolution**: Requiere que todos los comentarios se resuelvan.
  * **Build validation**: Requiere que un pipeline de compilación se complete con éxito.

---

## 4. ⚙️ Azure Pipelines (CI/CD)

El corazón de la automatización en Azure DevOps. Se define mediante archivos YAML.

### 4.1. Conceptos Clave

* **Pipeline**: Define el proceso de CI/CD.
* **Trigger (Disparador)**: Evento que inicia un pipeline (ej. `push` a una rama, `pull_request`).
* **Stage (Etapa)**: Una fase principal del pipeline (ej. `Build`, `Test`, `Deploy-QA`, `Deploy-Prod`).
* **Job (Trabajo)**: Un conjunto de pasos que se ejecutan en un `Agent`.
* **Agent (Agente)**: Una máquina (VM) que ejecuta los trabajos.
  * **Microsoft-hosted**: Agentes gestionados por Microsoft (Windows, macOS, Ubuntu).
  * **Self-hosted**: Agentes que tú gestionas.
* **Step (Paso)**: La unidad de trabajo más pequeña. Puede ser un `script`, una `task`, o una referencia a una plantilla.
* **Task (Tarea)**: Un bloque de script preempaquetado (ej. `Npm@1`, `Maven@3`, `AzureWebApp@1`).
* **Artifact (Artefacto)**: El resultado de un job (ej. un archivo binario, un ZIP) que se puede pasar a jobs o stages posteriores.
* **Variable**: Un valor que se puede usar en el pipeline.

### 4.2. Estructura de un Pipeline YAML (`azure-pipelines.yml`)

```yaml
# azure-pipelines.yml
trigger: # Disparador para CI
  branches:
    include:
      - main
      - develop

pr: # Disparador para PR
  branches:
    include:
      - main

pool: # Agente para ejecutar los trabajos
  vmImage: 'ubuntu-latest' # Microsoft-hosted agent

variables: # Variables
  buildConfiguration: 'Release'
  nodeVersion: '18.x'

stages: # Etapas del pipeline
- stage: Build
  displayName: 'Build and Test Stage'
  jobs:
  - job: BuildJob
    displayName: 'Build and Test Job'
    steps:
    - task: NodeTool@0 # Tarea para instalar Node.js
      inputs:
        versionSpec: $(nodeVersion)
      displayName: 'Install Node.js'

    - script: npm install # Paso de script
      displayName: 'Install dependencies'

    - script: npm run test
      displayName: 'Run tests'

    - script: npm run build --if-present
      displayName: 'Build application'

    - task: PublishBuildArtifacts@1 # Tarea para publicar artefactos
      inputs:
        PathtoPublish: 'build'
        ArtifactName: 'drop'
        publishLocation: 'Container'
      displayName: 'Publish artifact'

- stage: Deploy
  displayName: 'Deploy Stage'
  dependsOn: Build # Dependencia de la etapa anterior
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main')) # Condición para ejecutar la etapa
  jobs:
  - job: DeployJob
    displayName: 'Deploy to App Service'
    steps:
    - task: DownloadBuildArtifacts@0 # Tarea para descargar artefactos
      inputs:
        buildType: 'current'
        downloadType: 'single'
        artifactName: 'drop'
        downloadPath: '$(System.ArtifactsDirectory)'
      displayName: 'Download artifact'

    - task: AzureWebApp@1 # Tarea para desplegar a Azure App Service
      inputs:
        azureSubscription: 'MyAzureSubscription' # Conexión de servicio
        appType: 'webApp'
        appName: 'my-azure-web-app'
        package: '$(System.ArtifactsDirectory)/drop'
      displayName: 'Deploy to Azure App Service'
```

### 4.3. Environments y Approvals

* **Environments (Entornos)**: Representan un destino de despliegue (ej. `QA`, `Production`).
* **Approvals and Checks (Aprobaciones y Comprobaciones)**: Pausan el pipeline antes de desplegar a un entorno y requieren una aprobación manual.

---

## 5. 🧪 Azure Test Plans

* **Test Plans**: Contenedores para suites de pruebas y casos de prueba.
* **Test Suites**: Agrupaciones de casos de prueba.
* **Test Cases**: Pasos para probar una funcionalidad.
* **Test Runs**: Ejecución de casos de prueba y registro de resultados.
* **Exploratory Testing**: Herramientas para pruebas exploratorias.

---

## 6. 📦 Azure Artifacts

* **Feeds**: Repositorios para tus paquetes.
* **Upstream Sources**: Permite que un feed de Azure Artifacts actúe como proxy de registros públicos (npm, NuGet, Maven Central).
* **Views**: Promueve paquetes a diferentes vistas (`@local`, `@prerelease`, `@release`) para controlar la visibilidad.

---

## 7. 💡 Buenas Prácticas y Consejos

* **YAML para Pipelines**: Siempre prefiere los pipelines YAML sobre los "Classic" (UI). Son versionables, reutilizables y más potentes.
* **Templates**: Para pipelines complejos, usa plantillas YAML para reutilizar etapas, trabajos o pasos.
* **Service Connections**: Usa conexiones de servicio para autenticarte de forma segura con servicios externos (Azure, AWS, Docker Hub).
* **Variable Groups y Library**: Almacena variables y archivos seguros (secretos) en `Library` para reutilizarlos en múltiples pipelines.
* **Usa el Marketplace**: Explora el Azure DevOps Marketplace para encontrar miles de tareas y extensiones de terceros.
* **Políticas de Rama**: Protege tus ramas principales con políticas que requieran PRs y builds exitosos.
* **Infraestructura como Código (IaC)**: Despliega tu infraestructura (ARM Templates, Bicep, Terraform) como parte de tu pipeline.
* **Monitoreo y Dashboards**: Utiliza los dashboards de Azure Boards para mantener a tu equipo informado sobre el progreso del proyecto.
* **Seguridad**:
  * Protege tus conexiones de servicio y variables.
  * Usa herramientas de análisis de seguridad (SAST, DAST, SCA) en tus pipelines.

---

Este cheatsheet te proporciona una referencia completa de Azure DevOps, cubriendo sus servicios principales, conceptos clave y las mejores prácticas para gestionar todo el ciclo de vida de tu desarrollo de software de forma eficiente y automatizada.
