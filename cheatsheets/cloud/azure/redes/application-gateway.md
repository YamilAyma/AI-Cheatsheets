
---

# 🛡️ Azure Application Gateway Cheatsheet Completo 🛡️

**Azure Application Gateway** es un balanceador de carga de tráfico web (capa 7 - HTTP/HTTPS) que te permite gestionar el tráfico a tus aplicaciones web. A diferencia de un balanceador de carga estándar, Application Gateway puede tomar decisiones de enrutamiento basadas en atributos adicionales de una solicitud HTTP, como la ruta de la URI o los encabezados de host.

---

## 1. 🌟 Conceptos Clave

* **Balanceador de Carga de Capa 7**: Opera en la capa de aplicación del modelo OSI. Entiende el tráfico HTTP/HTTPS.
* **Listener (Receptor)**: Un componente que escucha las solicitudes entrantes en una combinación de protocolo, puerto, host y dirección IP.
* **Rule (Regla)**: Conecta un `Listener` a un `Backend Pool` y a una `HTTP Setting`. Define cómo se enruta el tráfico.
* **Backend Pool (Grupo de Backends)**: Una colección de recursos de backend a los que Application Gateway enruta el tráfico (VMs, Scale Sets, IPs, App Services).
* **HTTP Setting (Configuración HTTP)**: Define la configuración para el tráfico desde el Application Gateway hasta el backend (puerto, protocolo, afinidad de sesión, etc.).
* **Health Probe (Sondeo de Estado)**: Monitorea la salud de los recursos en el `Backend Pool` y solo envía tráfico a los backends saludables.
* **Web Application Firewall (WAF)**: Una característica opcional que proporciona protección centralizada contra vulnerabilidades web comunes (ej. inyección SQL, cross-site scripting), basada en las reglas de OWASP.
* **SSL/TLS Termination (Descarga de SSL)**: Application Gateway puede terminar la conexión SSL/TLS, desencriptando el tráfico antes de enviarlo a los backends. Esto reduce la carga de CPU en tus servidores web.
* **Autoscaling**: Escala automáticamente el número de instancias de Application Gateway en respuesta a la demanda de tráfico.

---

## 2. 🛠️ Tipos de Application Gateway (SKUs)

* **Standard v1 / WAF v1**: (Legado)
* **Standard v2 / WAF v2**: (Recomendado)
  * **Ventajas sobre v1**: Escalado automático, redundancia de zona, IPs públicas estáticas, reescritura de encabezados, mayor rendimiento.

---

## 3. 🚀 Creación y Configuración

### 3.1. Crear un Application Gateway (Portal / CLI / Bicep)

1. **Grupo de Recursos**: Selecciona o crea uno.
2. **Nombre**: Nombre del Application Gateway.
3. **Región**: Ubicación geográfica.
4. **Tier**: Standard v2 o WAF v2.
5. **Enable autoscaling**: (v2) Habilitar/deshabilitar.
6. **Instance count**: (v2) Número mínimo y máximo de instancias.
7. **Availability zone**: (v2) Zonas de disponibilidad.
8. **HTTP2**: Habilitar/deshabilitar.
9. **Virtual network**: Selecciona una VNet y una subred dedicada para el Application Gateway.
10. **Frontend IP configuration**: Configura una IP pública y/o privada.
11. **Listeners**: Configura los receptores (puerto, protocolo, host).
12. **Backend pools**: Define los grupos de backends.
13. **Routing rules**: Conecta los listeners a los backend pools.

### 3.2. Azure CLI

```bash
# Crear Application Gateway
az network application-gateway create \
  --name MyAppGateway \
  --location eastus \
  --resource-group MyResourceGroup \
  --sku WAF_v2 \
  --public-ip-address MyAppGateway-ip \
  --vnet-name MyVNet \
  --subnet MyAGSubnet

# Crear Frontend Port
az network application-gateway frontend-port create \
  --gateway-name MyAppGateway \
  --name myFrontendPort \
  --port 80 \
  --resource-group MyResourceGroup

# Crear Backend Pool
az network application-gateway address-pool create \
  --gateway-name MyAppGateway \
  --name myBackendPool \
  --resource-group MyResourceGroup \
  --servers 10.0.0.4 10.0.0.5

# Crear Listener
az network application-gateway http-listener create \
  --gateway-name MyAppGateway \
  --name myListener \
  --frontend-port myFrontendPort \
  --resource-group MyResourceGroup

# Crear Regla
az network application-gateway rule create \
  --gateway-name MyAppGateway \
  --name myRule \
  --resource-group MyResourceGroup \
  --http-listener myListener \
  --address-pool myBackendPool
```

---

## 4. 🔗 Funcionalidades de Enrutamiento

### 4.1. Enrutamiento Basado en Ruta (Path-based Routing)

* Enruta el tráfico a diferentes backend pools basándose en la ruta de la URL.

  * `example.com/images/*` -> `ImageBackendPool`
  * `example.com/video/*` -> `VideoBackendPool`
  * `example.com/*` -> `DefaultBackendPool`

### 4.2. Enrutamiento de Múltiples Sitios (Multi-site Hosting)

* Aloja múltiples sitios web en el mismo Application Gateway.
* Enruta el tráfico basándose en el nombre de host de la solicitud.

  * `contoso.com` -> `ContosoBackendPool`
  * `fabrikam.com` -> `FabrikamBackendPool`

### 4.3. Redirección

* Redirige el tráfico de un listener a otro, o a una URL externa.
* Útil para redirigir HTTP a HTTPS.

### 4.4. Reescritura de Encabezados y URL (Rewrite)

* Permite reescribir encabezados HTTP y la URL de la solicitud/respuesta.
* Útil para añadir encabezados de seguridad, eliminar información del backend, o enrutar a aplicaciones que esperan una estructura de URL diferente.

---

## 5. 🔒 Web Application Firewall (WAF)

* **Protección**: Protege contra vulnerabilidades web comunes como inyección SQL, cross-site scripting (XSS), etc., basándose en las reglas de OWASP (Open Web Application Security Project).
* **Modos**:
  * **Detection (Detección)**: Monitorea y registra las amenazas, pero no las bloquea.
  * **Prevention (Prevención)**: Bloquea activamente las amenazas detectadas.
* **Reglas**:
  * **Managed Rule Sets**: Conjuntos de reglas gestionados por Azure que se actualizan automáticamente.
  * **Custom Rules**: Reglas personalizadas que puedes definir.
* **Bot Protection**: Un conjunto de reglas gestionado para bloquear bots maliciosos.

---

## 6. 💡 Buenas Prácticas y Consejos

* **Usa la SKU v2**: Siempre prefiere la SKU v2 (Standard_v2 o WAF_v2) para nuevas implementaciones.
* **Subred Dedicada**: Despliega tu Application Gateway en una subred dedicada dentro de tu VNet.
* **Descarga de SSL**: Utiliza Application Gateway para la terminación SSL/TLS para reducir la carga en tus servidores de backend.
* **HTTPS End-to-End**: Para una máxima seguridad, cifra el tráfico tanto desde el cliente al Application Gateway como desde el Application Gateway a los backends.
* **Health Probes**: Configura sondeos de estado personalizados para asegurar que el tráfico solo se envíe a los backends saludables.
* **WAF en Modo Prevención**: En producción, ejecuta el WAF en modo de prevención.
* **Autoscaling**: Habilita el escalado automático en la SKU v2 para manejar las fluctuaciones del tráfico.
* **Monitoreo**: Utiliza Azure Monitor para rastrear métricas del Application Gateway (throughput, solicitudes fallidas, estado del backend) y configura alertas.
* **Logging**: Habilita los logs de diagnóstico para obtener información detallada sobre las solicitudes y el comportamiento del WAF.
* **Infraestructura como Código (IaC)**: Define tu Application Gateway usando Bicep, ARM Templates o Terraform.

---

Este cheatsheet te proporciona una referencia completa de Azure Application Gateway, cubriendo sus conceptos esenciales, SKUs, configuración, funcionalidades de enrutamiento, el Web Application Firewall (WAF) y las mejores prácticas para gestionar el tráfico de tus aplicaciones web de forma segura y eficiente en Microsoft Azure.
