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

## 10. Stack tecnológico

| Capa | Tecnología | Para qué |
|---|---|---|
| Frontend | HTML, CSS con [Tailwind](https://tailwindcss.com) y JavaScript | Pantallas; diseño rápido con clases utilitarias |
| Backend | Node.js con [NestJS](https://nestjs.com) | Lógica del sistema, autenticación y reglas de negocio |
| Comunicación | API REST | Conecta el frontend con el backend |
| Acceso a datos | [TypeORM](https://typeorm.io) | Comunicación entre el backend y la base de datos |
| Base de datos | MySQL, y MongoDB o Firebase | Guardar los datos |
| Herramientas | VS Code y GitHub | Desarrollo y control de versiones |

## 11. Pendientes por definir

- Si se usa MongoDB o Firebase junto a MySQL, y qué datos guarda cada una.
- Forma de integración con el sistema actual de la ASADA.
- Proveedor para el envío de mensajes por WhatsApp.
- Frecuencia o fecha de envío de los recordatorios.

## 12. Frontend (maquetación)

Maqueta navegable en HTML, [Tailwind CSS](https://tailwindcss.com) (por CDN) y JavaScript, sin paso de compilación. Por ahora usa datos de ejemplo; cuando exista el backend en NestJS (punto 10), los datos llegarán por la API REST. Se abre con doble clic en `ingresar.html` (o en `index.html`, que manda a ingresar si no hay sesión).

```
ingresar.html          Pantallas de ingreso y de creación de cuenta
index.html             Estructura: barra lateral, barra superior y una sección por vista
js/tailwind-config.js  Paleta azul y blanca de SICPA y estilos base (letra de 18 px, foco visible)
js/datos.js            Datos de ejemplo, ficticios; se reemplazan por la base de datos de la ASADA
js/sesion.js           Sesión del usuario (sessionStorage); la comparten las dos páginas
js/acceso.js           Validación de los formularios de ingreso y de creación de cuenta
js/app.js              Navegación entre vistas, llenado de datos y validación de formularios
```

**Ingreso y creación de cuenta (`ingresar.html`).**

- *Ingresar:* cédula (con o sin guiones) y contraseña. Si alguno de los dos datos está mal, el mensaje es el mismo, para no revelar qué cédulas tienen cuenta. "¿Olvidó su contraseña?" muestra el contacto de la ASADA, que es quien la restablece en v1.
- *Crear mi cuenta:* en tres pasos (su medidor, sus datos de contacto, su contraseña). Se pide el **número de medidor** además de la cédula, para comprobar que quien se registra es el dueño. La cuenta se crea solo si el medidor está a nombre de esa cédula, está activo y la cédula no tiene cuenta todavía.
- Los campos de contraseña tienen un botón "Mostrar" con texto, pensado para quien escribe despacio.

Cuentas de prueba (en `js/datos.js`):

| Cédula | Contraseña | Rol |
|---|---|---|
| 2-0733-0726 | agua2026 | Abonado |
| 4-0250-0618 | asada2026 | Personal de la ASADA (ve el grupo Administración) |

Para probar la creación de cuenta: cédula 5-0412-0987 con el medidor 2.

**Vistas.** Cada módulo de la barra lateral es una `<section data-vista="...">` en `index.html` y se abre con su ancla (`#inicio`, `#perfil`, `#historial`, `#consumo`, `#soporte`). El grupo Administración (`#medidores`, `#tarifas`, `#usuarios`) solo aparece si la sesión es de rol `"admin"`.

**Estilos.** Todo el diseño está hecho con clases de Tailwind en el HTML; no hay hoja de estilos propia. Los colores se usan por su nombre (`bg-azul-700`, `text-texto-suave`, `border-borde`, `bg-verde-fondo`...) y se definen una sola vez en `js/tailwind-config.js`. Lo que arma JavaScript (filas de las tablas, etiquetas, barras del gráfico) también lleva clases de Tailwind, en `js/app.js`.

**Decisiones de diseño para el público de la ASADA:**

- Letra base de 18 px, botones y campos de al menos 48 px de alto y textos en "usted".
- El estado del recibo actual es lo primero que se ve al entrar.
- En celular, la barra lateral se abre con un botón "Menú" que lleva texto, no solo el ícono.
- Las tablas se convierten en tarjetas en pantallas angostas.

**Todavía es demostración:** los formularios validan, pero no guardan ni envían nada. La sesión vive en el navegador y se borra al cerrar la pestaña; la cuenta creada no se guarda, y después de ingresar siempre se muestran los datos de ejemplo de Ana. En la versión final, la contraseña se revisa en el servidor y se guarda cifrada.

**Por definir con la ASADA:** si el correo es obligatorio al registrarse (muchos adultos mayores no tienen), cómo se registran los dueños con cédula de residencia (DIMEX, que no tiene 9 números) y cómo se restablece una contraseña olvidada.

Iconos: [Lucide](https://lucide.dev), licencia ISC.
