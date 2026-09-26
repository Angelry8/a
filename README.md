# SICPA — Sistema de Control de Pagos ASADA

Sistema web para que los abonados de la **ASADA Guayabal** verifiquen y controlen sus pagos del recibo de agua.

> Estado: fase de diseño y definición de requisitos (v1).

---

## 1. Objetivo

Permitir que los habitantes de Guayabal consulten el estado de sus pagos, su historial y su consumo de agua, y recibir recordatorios de pago por WhatsApp. **Los pagos no se realizan desde la página.**

## 2. Alcance

- **Plataforma:** página web. Una app móvil queda como posible mejora futura.
- **Integración:** se vinculará con la base de datos que ya usa la ASADA, donde cada medidor está asociado a su dueño (ej. medidor 3 → Ana, cédula 273387263).
- **Público:** incluye muchos adultos mayores (60–80 años) poco familiarizados con la tecnología, por lo que la interfaz debe ser lo más simple posible.

## 3. Roles

| Rol | Permisos |
|---|---|
| **Administrativo (ASADA)** | Altas y bajas de medidores, reportes de tarifas, consulta de usuarios, gestión general. |
| **Usuario** | Perfil, historial de pagos y consulta de consumo. |

## 4. Registro y acceso

- **Auto-registro:** el usuario crea su propio perfil.
- **Login:** cédula del dueño del medidor + contraseña tradicional (sin token especial).
- **Datos solicitados al registrarse:**
  - Teléfono de WhatsApp
  - Correo electrónico
  - Dirección exacta de residencia
- **Acceso de terceros:** no habrá delegación de acceso en v1. Se asume que familiares compartirán credenciales de forma informal (posible mejora futura).

## 5. Módulos del usuario

### 5.1 Perfil
Editar número de WhatsApp y correo electrónico.

### 5.2 Historial
Lista de pagos registrados por la ASADA, con filtro por rango de fechas.

### 5.3 Consumo
Consulta de consumo en m³, si la ASADA dispone de ese dato.

## 6. Reglas de negocio

### 6.1 Recordatorios
Se envía un mensaje por **WhatsApp** (canal que la ASADA ya usa) recordando al usuario pagar su recibo.

## 7. Panel administrativo (ASADA)

- Gestión de medidores (altas y bajas).
- Reportes de tarifas.
- Consulta de usuarios registrados.

## 8. Soporte

Canal de contacto con la ASADA para reportar problemas o hacer consultas.

## 9. Mejoras futuras

- App móvil.
- Delegación de acceso para familiares o terceros.
- Acceso simplificado para adultos mayores.

## 10. Pendientes por definir

- Stack tecnológico y arquitectura.
- Forma de integración con el sistema actual de la ASADA.
- Proveedor para el envío de mensajes por WhatsApp.
- Frecuencia o fecha de envío de los recordatorios.

## 11. Frontend (maquetación)

Maqueta navegable en HTML, CSS y JavaScript sin dependencias ni paso de compilación, para no amarrar el stack mientras se define (punto 10). Se abre con doble clic en `index.html`.

```
index.html       Estructura: barra lateral, barra superior y una sección por vista
css/estilos.css  Paleta azul y blanca, componentes y ajustes para celular
js/datos.js      Datos de ejemplo, ficticios; se reemplazan por la base de datos de la ASADA
js/app.js        Navegación entre vistas, llenado de datos y validación de formularios
```

**Vistas.** Cada módulo de la barra lateral es una `<section data-vista="...">` en `index.html` y se abre con su ancla (`#inicio`, `#perfil`, `#historial`, `#consumo`, `#soporte`). El grupo Administración (`#medidores`, `#tarifas`, `#usuarios`) solo aparece si `rol` es `"admin"` en `js/datos.js`.

**Decisiones de diseño para el público de la ASADA:**

- Letra base de 18 px, botones y campos de al menos 48 px de alto y textos en "usted".
- El estado del recibo actual es lo primero que se ve al entrar.
- En celular, la barra lateral se abre con un botón "Menú" que lleva texto, no solo el ícono.
- Las tablas se convierten en tarjetas en pantallas angostas.

**Todavía es demostración:** los formularios validan, pero no guardan ni envían nada, y aún no existen las pantallas de inicio de sesión y registro.

Iconos: [Lucide](https://lucide.dev), licencia ISC.
