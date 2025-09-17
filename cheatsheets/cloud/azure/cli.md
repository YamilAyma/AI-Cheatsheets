
---

# 💻 Azure CLI Cheatsheet Completo 💻

**Azure CLI** es un conjunto de comandos de línea de comandos para crear y gestionar recursos de Azure. Es multiplataforma (Windows, macOS, Linux), open-source y está diseñado para ser fácil de aprender, con un enfoque en la automatización y la eficiencia.

---

## 1. 🌟 Conceptos Clave

* **Sintaxis**: La sintaxis general de un comando es `az <group> <subgroup> <command> [options]`.
  * Ej: `az vm create --name MyVM --resource-group MyRG`
* **Grupo (Group)**: Un servicio de Azure (ej. `vm`, `storage`, `webapp`).
* **Comando (Command)**: Una acción a realizar sobre un grupo (ej. `create`, `list`, `show`, `delete`).
* **Opciones (Options)**: Argumentos para el comando (ej. `--name`, `--resource-group`).
* **Salida (Output)**: Por defecto, los comandos devuelven una salida en formato JSON.
* **Idempotencia**: Muchos comandos `create` son idempotentes (ejecutarlos varias veces con los mismos parámetros produce el mismo resultado).

---

## 2. 🛠️ Configuración Inicial

### 2.1. Instalación

* Sigue la guía oficial de Microsoft para tu sistema operativo.
  * **Windows**: Con MSI.
  * **macOS**: `brew update && brew install azure-cli`
  * **Linux (apt)**: `sudo apt-get update && sudo apt-get install azure-cli`

### 2.2. Iniciar Sesión

* **Interactivo (recomendado)**:
  ```bash
  az login
  # Abre un navegador para que inicies sesión.
  ```
* **Service Principal (para automatización/CI-CD)**:
  ```bash
  az login --service-principal -u <app-id> -p <password-or-cert> --tenant <tenant-id>
  ```

### 2.3. Gestionar Suscripciones

* **Listar Suscripciones**:
  ```bash
  az account list --output table
  ```
* **Establecer Suscripción Activa**:
  ```bash
  az account set --subscription <subscription-id-or-name>
  ```
* **Cerrar Sesión**:
  ```bash
  az logout
  ```

### 2.4. Configuración Global

* **Establecer Valores por Defecto**:
  ```bash
  az configure --defaults location=eastus resource_group=MyDefaultRG
  # Ahora no necesitas especificar --location o --resource-group
  ```
* **Cambiar Formato de Salida por Defecto**:
  ```bash
  az configure --output table # O json, tsv, yaml
  ```

---

## 3. 📝 Comandos Comunes y Esenciales

### 3.1. Grupos de Recursos (`az group`)

* **Crear**:
  ```bash
  az group create --name MyResourceGroup --location eastus
  ```
* **Listar**:
  ```bash
  az group list --output table
  ```
* **Mostrar**:
  ```bash
  az group show --name MyResourceGroup
  ```
* **Eliminar**: **¡CUIDADO!** Elimina todos los recursos dentro del grupo.
  ```bash
  az group delete --name MyResourceGroup --yes --no-wait
  ```

### 3.2. Máquinas Virtuales (`az vm`)

* **Crear (Linux)**:
  ```bash
  az vm create \
    --resource-group MyResourceGroup \
    --name MyVM \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys
  ```
* **Crear (Windows)**:
  ```bash
  az vm create \
    --resource-group MyResourceGroup \
    --name MyWindowsVM \
    --image Win2019Datacenter \
    --admin-username azureuser \
    --admin-password "MyStrongPassword123!"
  ```
* **Listar**: `az vm list --output table`
* **Mostrar**: `az vm show --resource-group MyResourceGroup --name MyVM`
* **Iniciar/Detener/Reiniciar**:
  ```bash
  az vm start --resource-group MyResourceGroup --name MyVM
  az vm stop --resource-group MyResourceGroup --name MyVM
  az vm restart --resource-group MyResourceGroup --name MyVM
  ```
* **Desasignar (Detiene la facturación de cómputo)**:
  ```bash
  az vm deallocate --resource-group MyResourceGroup --name MyVM
  ```
* **Eliminar**: `az vm delete --resource-group MyResourceGroup --name MyVM --yes`
* **Abrir Puerto (ej. 80 para web)**:
  ```bash
  az vm open-port --port 80 --resource-group MyResourceGroup --name MyVM --priority 900
  ```

### 3.3. App Service (`az webapp`)

* **Crear un Plan de App Service**:
  ```bash
  az appservice plan create --name MyAppServicePlan --resource-group MyResourceGroup --sku B1 --is-linux
  ```
* **Crear una Web App**:
  ```bash
  az webapp create \
    --resource-group MyResourceGroup \
    --plan MyAppServicePlan \
    --name my-unique-webapp-name \
    --runtime "NODE:18-lts" # O "DOTNETCORE:7.0", "PYTHON:3.9", etc.
  ```
* **Desplegar desde un Repositorio Git**:
  ```bash
  az webapp deployment source config --name my-unique-webapp-name --resource-group MyResourceGroup --repo-url https://github.com/user/repo.git --branch main --manual-integration
  ```
* **Listar**: `az webapp list --output table`

### 3.4. Almacenamiento (`az storage`)

* **Crear Cuenta de Almacenamiento**:
  ```bash
  az storage account create --name mystorageaccount123 --resource-group MyResourceGroup --location eastus --sku Standard_LRS
  ```
* **Obtener Cadenas de Conexión**:
  ```bash
  az storage account show-connection-string --name mystorageaccount123 --resource-group MyResourceGroup
  ```
* **Crear un Contenedor de Blob**:
  ```bash
  az storage container create --name mycontainer --account-name mystorageaccount123
  ```
* **Subir un Blob**:
  ```bash
  az storage blob upload --container-name mycontainer --file local_file.txt --name remote_file.txt --account-name mystorageaccount123
  ```

### 3.5. Azure SQL Database (`az sql`)

* **Crear un Servidor Lógico**:
  ```bash
  az sql server create --name mysqlserver123 --resource-group MyResourceGroup --location eastus --admin-user myadmin --admin-password "MyStrongPassword123!"
  ```
* **Configurar Regla de Firewall**:
  ```bash
  az sql server firewall-rule create --resource-group MyResourceGroup --server mysqlserver123 --name AllowMyIP --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0 # O tu IP específica
  ```
* **Crear una Base de Datos**:
  ```bash
  az sql db create --resource-group MyResourceGroup --server mysqlserver123 --name MyDatabase --service-objective S0
  ```

### 3.6. Azure Kubernetes Service (AKS) (`az aks`)

* **Crear un Clúster de AKS**:
  ```bash
  az aks create \
    --resource-group MyResourceGroup \
    --name MyAKSCluster \
    --node-count 1 \
    --enable-addons monitoring \
    --generate-ssh-keys
  ```
* **Obtener Credenciales (`kubectl`)**:
  ```bash
  az aks get-credentials --resource-group MyResourceGroup --name MyAKSCluster
  # Ahora puedes usar kubectl
  ```
* **Escalar Nodos**: `az aks scale --resource-group MyResourceGroup --name MyAKSCluster --node-count 3`

### 3.7. Azure Functions (`az functionapp`)

* **Crear una Cuenta de Almacenamiento (requerido)**: (ver `az storage`)
* **Crear una Function App**:
  ```bash
  az functionapp create \
    --resource-group MyResourceGroup \
    --consumption-plan-location eastus \
    --runtime node \
    --runtime-version 18 \
    --functions-version 4 \
    --name MyUniqueFunctionApp \
    --storage-account mystorageaccount123
  ```

---

## 4. 🧰 Opciones Globales y Trucos

* **`--output <format>` o `-o`**: Cambia el formato de salida.
  * `json`: (por defecto)
  * `jsonc`: JSON con colores.
  * `table`: Tabla legible.
  * `tsv`: Valores separados por tabuladores.
  * `yaml`: YAML.
  * `none`: Sin salida.
* **`--query <JMESPath>`**: Filtra la salida JSON usando el lenguaje de consulta JMESPath.
  ```bash
  # Obtener solo los nombres de las VMs
  az vm list --query "[].name" -o tsv

  # Obtener el estado de energía de una VM específica
  az vm show -g MyRG -n MyVM --query "powerState" -o tsv
  ```
* **`--verbose`**: Muestra información de depuración detallada.
* **`--debug`**: Aún más detallado, incluye trazas de la API REST.
* **`--help` o `-h`**: Muestra ayuda para cualquier comando, grupo o subgrupo.
  ```bash
  az vm -h
  az vm create -h
  ```
* **Modo Interactivo**:
  ```bash
  az interactive
  # Proporciona autocompletado, descripciones de comandos y ejemplos.
  ```
* **`--no-wait`**: No espera a que una operación de larga duración termine.
* **`--yes` o `-y`**: Confirma automáticamente las preguntas.

---

## 5. 💡 Buenas Prácticas y Consejos

* **Usa Grupos de Recursos**: Agrupa recursos con el mismo ciclo de vida en un mismo grupo de recursos para facilitar su gestión.
* **Automatiza con Scripts**: La CLI es ideal para escribir scripts de Bash o PowerShell para automatizar tareas repetitivas.
* **Utiliza `--query`**: Aprende JMESPath para filtrar y extraer la información que necesitas de la salida JSON.
* **Valores por Defecto**: Usa `az configure` para establecer valores por defecto (ubicación, grupo de recursos) y ahorrar tiempo.
* **Sé Específico**: Siempre que sea posible, especifica los recursos por su nombre o ID para evitar acciones accidentales en recursos equivocados.
* **Modo Interactivo para Aprender**: `az interactive` es una excelente herramienta para explorar y aprender comandos.
* **Infraestructura como Código (IaC)**: Para despliegues complejos y repetibles, considera herramientas de IaC como Bicep, ARM Templates o Terraform, que pueden ser invocadas desde scripts de la CLI.
* **Seguridad**:
  * Prefiere iniciar sesión interactivamente o con `az login --use-device-code`.
  * Para automatización, usa Service Principals con el principio de mínimo privilegio. Rota sus credenciales regularmente.

---

Este cheatsheet te proporciona una referencia completa de la Azure CLI, cubriendo su configuración inicial, los comandos más comunes para gestionar recursos clave, opciones globales y las mejores prácticas para una gestión eficiente y automatizada de tus recursos en Microsoft Azure.
