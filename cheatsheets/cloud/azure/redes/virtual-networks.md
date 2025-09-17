
---

# 🌐 Azure Virtual Network (VNet) Cheatsheet Completo 🌐

**Azure Virtual Network (VNet)** es el servicio que proporciona los bloques de construcción fundamentales para tu red privada en Azure. Una VNet es una representación de tu propia red en la nube, un entorno lógicamente aislado donde puedes lanzar recursos de Azure.

---

## 1. 🌟 Conceptos Clave

* **VNet (Virtual Network)**: Una red virtual aislada dentro de una región de Azure.
* **Espacio de Direcciones (Address Space)**: Un rango de direcciones IP privadas (definido en notación CIDR) que tu VNet puede usar.
* **Subred (Subnet)**: Un rango de direcciones IP dentro de tu VNet. Puedes dividir una VNet en múltiples subredes. Los recursos de Azure se despliegan en subredes.
* **Grupo de Seguridad de Red (NSG - Network Security Group)**: Un firewall virtual que controla el tráfico de red de entrada y salida a nivel de subred o de interfaz de red (NIC).
* **Rutas Definidas por el Usuario (UDR - User-Defined Routes)**: Permiten controlar el flujo de tráfico de tu VNet, por ejemplo, para forzar el tráfico a través de un dispositivo de red virtual (NVA).
* **Endpoint de Servicio (Service Endpoint)**: Extiende tu VNet para que el tráfico a servicios de Azure específicos (ej. Azure Storage, SQL Database) permanezca dentro de la red de Azure.
* **Endpoint Privado (Private Endpoint)**: Una interfaz de red que utiliza una dirección IP privada de tu VNet, conectándote de forma privada y segura a un servicio de Azure (PaaS).
* **VNet Peering (Emparejamiento de VNet)**: Conecta dos VNets de Azure, permitiendo que se comuniquen como si fueran una sola red.
* **VPN Gateway**: Un tipo de puerta de enlace de red virtual que envía tráfico cifrado entre tu VNet y tu red local (on-premises) a través de la Internet pública (VPN Site-to-Site).
* **ExpressRoute**: Una conexión privada y dedicada entre tu centro de datos local y Azure.

---

## 2. 🛠️ Creación y Configuración

### 2.1. Crear una VNet (Portal / CLI / Bicep)

1. **Grupo de Recursos**: Selecciona o crea uno.
2. **Nombre**: Nombre de la VNet.
3. **Región**: Ubicación geográfica.
4. **Espacio de Direcciones**: Define el rango de IP (ej. `10.0.0.0/16`).
5. **Subredes**: Define una o más subredes (ej. `subnet1` con `10.0.1.0/24`).

### 2.2. Azure CLI

```bash
# Crear VNet
az network vnet create \
  --resource-group MyResourceGroup \
  --name MyVNet \
  --address-prefix 10.1.0.0/16

# Crear Subred
az network vnet subnet create \
  --resource-group MyResourceGroup \
  --vnet-name MyVNet \
  --name MySubnet \
  --address-prefix 10.1.0.0/24
```

---

## 3. 🔒 Seguridad en VNet

### 3.1. Grupos de Seguridad de Red (NSGs)

* **Reglas**: Un NSG contiene reglas de seguridad de entrada (inbound) y de salida (outbound) que permiten o deniegan el tráfico.
* **Prioridad**: Cada regla tiene una prioridad (100-4096). Las reglas se procesan en orden de prioridad.
* **Componentes de la Regla**:
  * **Fuente/Destino**: Any, IP Addresses, Service Tag, Application Security Group.
  * **Protocolo**: TCP, UDP, ICMP, Any.
  * **Rango de Puertos**: Puertos específicos.
  * **Acción**: Allow (Permitir) o Deny (Denegar).
* **Asociación**: Se pueden asociar a subredes o a NICs.

### 3.2. Azure Firewall

* Un servicio de firewall de red inteligente y totalmente gestionado que proporciona protección contra amenazas.
* Proporciona filtrado de tráfico de red, inteligencia de amenazas y soporte para DNAT/SNAT.
* Se despliega en su propia subred (`AzureFirewallSubnet`).

---

## 4. 🔗 Conectividad

### 4.1. VNet Peering

* Conecta dos VNets, permitiendo el tráfico entre ellas.
* El tráfico entre VNets emparejadas es privado y permanece en la red de Microsoft.
* **Global VNet Peering**: Para emparejar VNets en diferentes regiones de Azure.
* **No transitivo**: Si VNet A está emparejada con VNet B, y VNet B está emparejada con VNet C, VNet A no puede comunicarse con VNet C.

### 4.2. VPN Gateway

* Para conectar tu VNet a redes locales (on-premises) o a otras VNets.
* **Site-to-Site (S2S)**: Conexión a una red local.
* **Point-to-Site (P2S)**: Conexión de un cliente individual a la VNet.
* **VNet-to-VNet**: Conexión entre VNets (alternativa a VNet Peering).

### 4.3. ExpressRoute

* Una conexión privada y dedicada entre tu centro de datos y Azure, que no pasa por la Internet pública.
* Ofrece mayor ancho de banda, menor latencia y mayor fiabilidad que las conexiones VPN.

---

## 5. 💡 Buenas Prácticas y Consejos

* **Planifica tu Espacio de Direcciones**: Diseña tu espacio de direcciones de VNet para evitar superposiciones con otras redes.
* **Segmentación con Subredes**: Usa subredes para aislar recursos (ej. subred para web, subred para base de datos, subred para Azure Firewall).
* **Principio de Mínimo Privilegio con NSGs**: Configura NSGs para permitir solo el tráfico necesario.
* **Usa Endpoints Privados**: Para acceder a servicios PaaS de Azure de forma privada desde tu VNet.
* **DNS**: Azure proporciona DNS interno para los recursos en una VNet. Puedes usar Azure Private DNS Zones para la resolución de nombres entre VNets.
* **Monitoreo con Network Watcher**: Utiliza Azure Network Watcher para diagnosticar y visualizar problemas de red.
* **Infraestructura como Código (IaC)**: Define tus VNets y recursos de red usando Bicep, ARM Templates o Terraform.

---

Este cheatsheet te proporciona una referencia completa de Azure Virtual Network, cubriendo sus conceptos esenciales, configuración, seguridad, conectividad y las mejores prácticas para construir una red privada segura y escalable en Microsoft Azure.
