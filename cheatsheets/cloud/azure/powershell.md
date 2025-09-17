
---

# 🔷 Azure PowerShell Cheatsheet Completo 🔷

**Azure PowerShell** es un conjunto de cmdlets (comandos) que te permite gestionar recursos de Azure directamente desde PowerShell. Proporciona funcionalidades para crear, gestionar y eliminar recursos de Azure, y es ideal para la automatización y la creación de scripts.

---

## 1. 🌟 Conceptos Clave

* **Cmdlet (Command-let)**: Un comando ligero de una sola función en PowerShell. Siguen la convención `Verbo-Sustantivo` (ej. `Get-AzVM`, `New-AzResourceGroup`).
* **Módulo Az**: El módulo principal de Azure PowerShell. Reemplazó al antiguo módulo AzureRM.
* **Contexto (Context)**: Almacena la información de autenticación, la suscripción y el tenant.
* **Piping (`|`)**: La salida de un cmdlet se puede "entubar" como entrada a otro cmdlet, lo que permite encadenar comandos de forma potente.
* **Objetos**: PowerShell trabaja con objetos .NET, no solo con texto. La salida de los cmdlets son objetos que puedes manipular.

---

## 2. 🛠️ Configuración Inicial

### 2.1. Instalación

* Abre PowerShell como Administrador.
  ```powershell
  # Instalar el módulo Az (recomendado)
  Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force

  # Actualizar el módulo Az
  Update-Module -Name Az
  ```

### 2.2. Iniciar Sesión

* **Interactivo (recomendado)**:
  ```powershell
  Connect-AzAccount
  # Abre un navegador para que inicies sesión.
  ```
* **Service Principal (para automatización/CI-CD)**:
  ```powershell
  $credential = Get-Credential
  Connect-AzAccount -ServicePrincipal -Credential $credential -Tenant <tenant-id>
  ```

### 2.3. Gestionar Suscripciones y Contextos

* **Listar Suscripciones**:
  ```powershell
  Get-AzSubscription
  ```
* **Establecer Suscripción Activa**:
  ```powershell
  Set-AzContext -Subscription <subscription-id-or-name>
  # O
  Get-AzSubscription -SubscriptionName "My Subscription" | Set-AzContext
  ```
* **Obtener Contexto Actual**:
  ```powershell
  Get-AzContext
  ```
* **Cerrar Sesión**:
  ```powershell
  Disconnect-AzAccount
  ```

---

## 3. 📝 Comandos Comunes y Esenciales

### 3.1. Grupos de Recursos (`*-AzResourceGroup`)

* **Crear**:
  ```powershell
  New-AzResourceGroup -Name "MyResourceGroup" -Location "East US"
  ```
* **Listar**:
  ```powershell
  Get-AzResourceGroup | Format-Table
  ```
* **Mostrar**:
  ```powershell
  Get-AzResourceGroup -Name "MyResourceGroup"
  ```
* **Eliminar**: **¡CUIDADO!** Elimina todos los recursos dentro del grupo.
  ```powershell
  Remove-AzResourceGroup -Name "MyResourceGroup" -Force
  ```

### 3.2. Máquinas Virtuales (`*-AzVM`)

* **Crear (Linux - Básico)**:
  ```powershell
  New-AzVm `
    -ResourceGroupName "MyResourceGroup" `
    -Name "MyVM" `
    -Location "East US" `
    -Image "UbuntuLTS" `
    -GenerateSshKey `
    -SshKeyName "myVM_key"
  ```
* **Crear (Windows - Básico)**:
  ```powershell
  $cred = Get-Credential # Te pedirá usuario y contraseña
  New-AzVm `
    -ResourceGroupName "MyResourceGroup" `
    -Name "MyWindowsVM" `
    -Location "East US" `
    -Image "Win2019Datacenter" `
    -Credential $cred
  ```
* **Listar**:
  ```powershell
  Get-AzVM -Status | Format-Table -Property Name, ResourceGroupName, PowerState
  ```
* **Mostrar**:
  ```powershell
  Get-AzVM -ResourceGroupName "MyResourceGroup" -Name "MyVM"
  ```
* **Iniciar/Detener/Reiniciar**:
  ```powershell
  Start-AzVM -ResourceGroupName "MyResourceGroup" -Name "MyVM"
  Stop-AzVM -ResourceGroupName "MyResourceGroup" -Name "MyVM" -Force
  Restart-AzVM -ResourceGroupName "MyResourceGroup" -Name "MyVM"
  ```
* **Eliminar**:
  ```powershell
  Remove-AzVM -ResourceGroupName "MyResourceGroup" -Name "MyVM" -Force
  ```
* **Abrir Puerto (ej. 80 para web)**:
  ```powershell
  Get-AzVM -ResourceGroupName "MyResourceGroup" -Name "MyVM" |
  Get-AzNetworkSecurityGroup |
  Add-AzNetworkSecurityRuleConfig -Name "Allow-HTTP" -Access Allow -Protocol Tcp -Direction Inbound -Priority 100 -SourceAddressPrefix "*" -SourcePortRange "*" -DestinationAddressPrefix "*" -DestinationPortRange 80 |
  Set-AzNetworkSecurityGroup
  ```

### 3.3. App Service (`*-AzWebApp`)

* **Crear un Plan de App Service**:
  ```powershell
  New-AzAppServicePlan -Name "MyAppServicePlan" -ResourceGroupName "MyResourceGroup" -Location "East US" -Tier "Basic"
  ```
* **Crear una Web App**:
  ```powershell
  New-AzWebApp -Name "my-unique-webapp-name" -ResourceGroupName "MyResourceGroup" -Location "East US" -AppServicePlan "MyAppServicePlan"
  ```
* **Desplegar**:
  ```powershell
  Publish-AzWebApp -ResourceGroupName "MyResourceGroup" -Name "my-unique-webapp-name" -ArchivePath "./my-app.zip"
  ```
* **Listar**:
  ```powershell
  Get-AzWebApp | Format-Table
  ```

### 3.4. Almacenamiento (`*-AzStorage*`)

* **Crear Cuenta de Almacenamiento**:
  ```powershell
  New-AzStorageAccount -ResourceGroupName "MyResourceGroup" -Name "mystorageaccount123" -Location "East US" -SkuName "Standard_LRS"
  ```
* **Obtener Contexto de Almacenamiento**:
  ```powershell
  $storageContext = (Get-AzStorageAccount -ResourceGroupName "MyResourceGroup" -Name "mystorageaccount123").Context
  ```
* **Crear un Contenedor de Blob**:
  ```powershell
  New-AzStorageContainer -Name "mycontainer" -Context $storageContext
  ```
* **Subir un Blob**:
  ```powershell
  Set-AzStorageBlobContent -Container "mycontainer" -File "local_file.txt" -Blob "remote_file.txt" -Context $storageContext
  ```

### 3.5. Azure SQL Database (`*-AzSql*`)

* **Crear un Servidor Lógico**:
  ```powershell
  New-AzSqlServer -ResourceGroupName "MyResourceGroup" -ServerName "mysqlserver123" -Location "East US" -SqlAdministratorCredentials (Get-Credential)
  ```
* **Configurar Regla de Firewall**:
  ```powershell
  New-AzSqlServerFirewallRule -ResourceGroupName "MyResourceGroup" -ServerName "mysqlserver123" -FirewallRuleName "AllowMyIP" -StartIpAddress "0.0.0.0" -EndIpAddress "0.0.0.0"
  ```
* **Crear una Base de Datos**:
  ```powershell
  New-AzSqlDatabase -ResourceGroupName "MyResourceGroup" -ServerName "mysqlserver123" -DatabaseName "MyDatabase" -Edition "Standard" -RequestedServiceObjectiveName "S0"
  ```

---

## 4. 🧰 Opciones Globales y Trucos

* **`| Format-Table`**: Formatea la salida como una tabla legible.
  * `| Format-Table -Property Name, ResourceGroupName`
* **`| Format-List`**: Formatea la salida como una lista de propiedades.
  * `| Format-List *` (para ver todas las propiedades)
* **`| Select-Object`**: Selecciona propiedades específicas de un objeto.
  * `Get-AzVM | Select-Object -Property Name, Location`
* **`| Where-Object`**: Filtra objetos en la tubería.
  * `Get-AzVM | Where-Object { $_.PowerState -eq "VM running" }`
* **`| ForEach-Object`**: Itera sobre objetos en la tubería.
  * `Get-AzResourceGroup | ForEach-Object { Remove-AzResourceGroup -Name $_.ResourceGroupName -Force }`
* **`-Verbose`**: Muestra información detallada sobre la ejecución de un cmdlet.
* **`-Debug`**: Muestra información de depuración aún más detallada.
* **`-WhatIf`**: Muestra lo que sucedería si el cmdlet se ejecutara, sin ejecutarlo realmente.
* **`-Confirm`**: Pide confirmación antes de ejecutar un cmdlet que realiza cambios.
* **`Get-Help <cmdlet-name>`**: Muestra ayuda para un cmdlet.
  * `Get-Help New-AzVM -Full` (ayuda completa)
  * `Get-Help New-AzVM -Examples` (ejemplos)

---

## 5. 💡 Buenas Prácticas y Consejos

* **Usa la Tubería (`|`)**: Es la característica más potente de PowerShell. Encadena comandos para realizar operaciones complejas de forma concisa.
* **Variables**: Almacena los resultados de los cmdlets en variables para reutilizarlos.
  * `$vm = Get-AzVM -Name "MyVM" -ResourceGroupName "MyRG"`
* **Automatiza con Scripts**: La fortaleza de PowerShell reside en la creación de scripts `.ps1` para automatizar tareas repetitivas.
* **Manejo de Erros**: Usa `try-catch-finally` en tus scripts para un manejo de errores robusto.
* **Infraestructura como Código (IaC)**: Para despliegues complejos, considera Bicep, ARM Templates o Terraform, que pueden ser invocados desde scripts de PowerShell.
* **Seguridad**:
  * Prefiere iniciar sesión interactivamente.
  * Para automatización, usa Service Principals con el principio de mínimo privilegio.
  * Utiliza Azure Key Vault para gestionar secretos.

---

Este cheatsheet te proporciona una referencia completa de Azure PowerShell, cubriendo su configuración inicial, los cmdlets más comunes para gestionar recursos clave, opciones globales y las mejores prácticas para una gestión eficiente y automatizada de tus recursos en Microsoft Azure.
