// SICPA - navegacion y llenado de vistas con los datos de ejemplo.

(function () {
    "use strict";

    const D = window.SICPA_DATOS;
    const esAdmin = D.rol === "admin";

    const VISTAS = {
        inicio: { titulo: "Inicio" },
        perfil: { titulo: "Mi perfil" },
        historial: { titulo: "Historial de pagos" },
        consumo: { titulo: "Consumo de agua" },
        soporte: { titulo: "Soporte" },
        medidores: { titulo: "Medidores", admin: true },
        tarifas: { titulo: "Tarifas y reportes", admin: true },
        usuarios: { titulo: "Usuarios", admin: true }
    };

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => Array.from(document.querySelectorAll(selector));

    // ---------- Formatos ----------

    const formatoColones = new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        maximumFractionDigits: 0,
        useGrouping: "always"
    });
    const formatoFecha = new Intl.DateTimeFormat("es-CR", { day: "numeric", month: "long", year: "numeric" });
    const formatoPeriodo = new Intl.DateTimeFormat("es-CR", { month: "long", year: "numeric" });
    const formatoMesCorto = new Intl.DateTimeFormat("es-CR", { month: "short" });
    const formatoDecimal = new Intl.NumberFormat("es-CR", { maximumFractionDigits: 1 });

    // "AAAA-MM-DD" o "AAAA-MM" como fecha local (new Date("AAAA-MM-DD") la toma
    // en UTC y en Costa Rica mostraria el dia anterior).
    function aFecha(texto) {
        const [anio, mes, dia] = texto.split("-").map(Number);
        return new Date(anio, mes - 1, dia || 1);
    }

    const colones = (monto) => formatoColones.format(monto);
    const fechaLarga = (texto) => formatoFecha.format(aFecha(texto));
    const periodoLargo = (texto) => formatoPeriodo.format(aFecha(texto));
    const mesCorto = (texto) => formatoMesCorto.format(aFecha(texto)).replace(".", "");

    function sinTildes(texto) {
        return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    }

    // ---------- Aviso flotante ----------

    let temporizadorAviso;
    function mostrarAviso(mensaje) {
        const aviso = $("#aviso");
        aviso.textContent = mensaje;
        aviso.hidden = false;
        clearTimeout(temporizadorAviso);
        temporizadorAviso = setTimeout(() => { aviso.hidden = true; }, 6000);
    }

    // ---------- Menu lateral (celulares) ----------

    const app = $("#app");
    const lateral = $("#lateral");
    const velo = $("#velo");
    const botonMenu = $("#boton-menu");
    const pantallaChica = window.matchMedia("(max-width: 900px)");

    function menuAbierto() {
        return app.classList.contains("menu-abierto");
    }

    // En celular, el menu cerrado queda fuera de la pantalla: "inert" evita
    // que el teclado o un lector de pantalla entren en el.
    function actualizarInert() {
        lateral.inert = pantallaChica.matches && !menuAbierto();
    }

    function abrirMenu() {
        app.classList.add("menu-abierto");
        velo.hidden = false;
        botonMenu.setAttribute("aria-expanded", "true");
        actualizarInert();
        const actual = lateral.querySelector('[aria-current="page"]');
        (actual || lateral.querySelector(".nav-enlace")).focus();
    }

    function cerrarMenu(devolverFoco) {
        if (!menuAbierto()) return;
        app.classList.remove("menu-abierto");
        velo.hidden = true;
        botonMenu.setAttribute("aria-expanded", "false");
        actualizarInert();
        if (devolverFoco) botonMenu.focus();
    }

    botonMenu.addEventListener("click", abrirMenu);
    $("#boton-cerrar-menu").addEventListener("click", () => cerrarMenu(true));
    velo.addEventListener("click", () => cerrarMenu(true));
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") cerrarMenu(true);
    });
    pantallaChica.addEventListener("change", () => {
        if (!pantallaChica.matches) cerrarMenu(false);
        actualizarInert();
    });

    // ---------- Navegacion entre vistas ----------

    function vistaDesdeHash() {
        const id = location.hash.slice(1);
        const vista = VISTAS[id];
        if (!vista || (vista.admin && !esAdmin)) return null;
        return id;
    }

    function mostrarVista(id, moverFoco) {
        $$(".vista").forEach((seccion) => {
            seccion.hidden = seccion.dataset.vista !== id;
        });
        $$(".nav-enlace[data-destino]").forEach((enlace) => {
            if (enlace.dataset.destino === id) {
                enlace.setAttribute("aria-current", "page");
            } else {
                enlace.removeAttribute("aria-current");
            }
        });

        const titulo = $("#titulo-vista");
        titulo.textContent = VISTAS[id].titulo;
        document.title = VISTAS[id].titulo + " | SICPA";

        cerrarMenu(false);
        window.scrollTo(0, 0);
        if (moverFoco) titulo.focus();
    }

    window.addEventListener("hashchange", () => {
        const id = vistaDesdeHash();
        // Un ancla que no es una vista (por ejemplo "Saltar al contenido") no cambia la vista.
        if (id) mostrarVista(id, true);
    });

    // ---------- Datos del usuario ----------

    function pintarCampos() {
        const u = D.usuario;
        const valores = {
            nombre: u.nombre,
            nombreCorto: u.nombre.split(" ")[0],
            cedula: u.cedula,
            medidor: u.medidor,
            direccion: u.direccion,
            whatsapp: u.whatsapp
        };
        $$("[data-campo]").forEach((el) => {
            el.textContent = valores[el.dataset.campo] ?? "";
        });

        const partes = u.nombre.split(" ");
        $("#avatar-iniciales").textContent = (partes[0][0] + (partes[1] ? partes[1][0] : "")).toUpperCase();
    }

    // ---------- Inicio ----------

    const pagosOrdenados = D.pagos.slice().sort((a, b) => b.fecha.localeCompare(a.fecha));

    function pintarInicio() {
        const recibo = D.reciboActual;
        const pagado = recibo.estado === "pagado";
        const tarjeta = $("#tarjeta-recibo");

        tarjeta.classList.toggle("recibo--al-dia", pagado);
        tarjeta.classList.toggle("recibo--pendiente", !pagado);
        $("#recibo-icono-uso").setAttribute("href", pagado ? "#i-check" : "#i-alert");
        $("#recibo-periodo").textContent = periodoLargo(recibo.periodo);
        $("#recibo-estado").textContent = pagado ? "Pagado: está al día" : "Pendiente de pago";
        $("#recibo-monto").textContent = colones(recibo.monto);
        $("#recibo-vence").textContent = pagado
            ? "Gracias por su pago."
            : "Vence el " + fechaLarga(recibo.vence) + ".";

        const ultimo = pagosOrdenados[0];
        if (ultimo) {
            $("#inicio-ultimo-monto").textContent = colones(ultimo.monto);
            $("#inicio-ultimo-fecha").textContent = "El " + fechaLarga(ultimo.fecha);
        } else {
            $("#inicio-ultimo-monto").textContent = "Sin pagos";
            $("#inicio-ultimo-fecha").textContent = "Todavía no hay pagos registrados.";
        }

        const lectura = D.consumo[D.consumo.length - 1];
        if (lectura) {
            $("#inicio-consumo").textContent = formatoDecimal.format(lectura.m3) + " m³";
            $("#inicio-consumo-detalle").textContent = "Lectura de " + periodoLargo(lectura.periodo);
        } else {
            $("#inicio-consumo").textContent = "Sin dato";
            $("#inicio-consumo-detalle").textContent = "La ASADA no ha registrado la lectura.";
        }
    }

    // ---------- Tablas ----------

    // celdas: [{ texto, etiqueta, clase, nodo }]. Se usa textContent para no
    // interpretar como HTML lo que venga de la base de datos.
    function crearFila(celdas) {
        const fila = document.createElement("tr");
        celdas.forEach((celda) => {
            const td = document.createElement("td");
            td.dataset.etiqueta = celda.etiqueta;
            if (celda.clase) td.className = celda.clase;
            if (celda.nodo) td.append(celda.nodo);
            else td.textContent = celda.texto;
            fila.append(td);
        });
        return fila;
    }

    function filaVacia(columnas, mensaje) {
        const fila = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = columnas;
        td.className = "tabla-vacia";
        td.textContent = mensaje;
        fila.append(td);
        return fila;
    }

    function crearEtiqueta(estado) {
        const span = document.createElement("span");
        span.className = "etiqueta etiqueta--" + estado;
        span.textContent = estado === "activo" ? "Activo" : "Inactivo";
        return span;
    }

    // ---------- Historial ----------

    function pintarHistorial(desde, hasta) {
        const lista = pagosOrdenados.filter((pago) =>
            (!desde || pago.fecha >= desde) && (!hasta || pago.fecha <= hasta));

        const cuerpo = $("#tabla-pagos");
        cuerpo.replaceChildren();

        if (lista.length === 0) {
            cuerpo.append(filaVacia(4, "No hay pagos registrados en esas fechas."));
            $("#historial-resumen").textContent = "No se encontraron pagos.";
            return;
        }

        lista.forEach((pago) => {
            cuerpo.append(crearFila([
                { etiqueta: "Fecha de pago", texto: fechaLarga(pago.fecha) },
                { etiqueta: "Recibo de", texto: periodoLargo(pago.periodo) },
                { etiqueta: "N.º de recibo", texto: pago.recibo },
                { etiqueta: "Monto", texto: colones(pago.monto), clase: "numero" }
            ]));
        });

        const total = lista.reduce((suma, pago) => suma + pago.monto, 0);
        const cantidad = lista.length === 1 ? "1 pago" : lista.length + " pagos";
        $("#historial-resumen").textContent = cantidad + " en total, que suman " + colones(total) + ".";
    }

    $("#form-filtro").addEventListener("submit", (evento) => {
        evento.preventDefault();
        const desde = $("#filtro-desde").value;
        const hasta = $("#filtro-hasta").value;
        const error = $("#error-filtro");

        if (desde && hasta && desde > hasta) {
            error.textContent = "La fecha \"Desde\" debe ser anterior a la fecha \"Hasta\".";
            error.hidden = false;
            return;
        }
        error.hidden = true;
        pintarHistorial(desde, hasta);
    });

    $("#filtro-limpiar").addEventListener("click", () => {
        $("#form-filtro").reset();
        $("#error-filtro").hidden = true;
        pintarHistorial("", "");
    });

    // ---------- Consumo ----------

    function pintarConsumo() {
        const lecturas = D.consumo.slice(-12);
        const grafico = $("#grafico-consumo");
        grafico.replaceChildren();

        if (lecturas.length === 0) {
            grafico.textContent = "La ASADA todavía no ha registrado lecturas de este medidor.";
            return;
        }

        const actual = lecturas[lecturas.length - 1];
        const anterior = lecturas[lecturas.length - 2];
        const promedio = lecturas.reduce((suma, l) => suma + l.m3, 0) / lecturas.length;

        $("#consumo-actual").textContent = formatoDecimal.format(actual.m3) + " m³";
        $("#consumo-actual-mes").textContent = periodoLargo(actual.periodo);
        $("#consumo-promedio").textContent = formatoDecimal.format(promedio) + " m³";

        if (anterior) {
            const diferencia = actual.m3 - anterior.m3;
            const mesAnterior = periodoLargo(anterior.periodo);
            if (diferencia === 0) {
                $("#consumo-diferencia").textContent = "Igual";
                $("#consumo-diferencia-detalle").textContent = "Mismo consumo que en " + mesAnterior;
            } else {
                const signo = diferencia > 0 ? "+" : "−";
                $("#consumo-diferencia").textContent = signo + formatoDecimal.format(Math.abs(diferencia)) + " m³";
                $("#consumo-diferencia-detalle").textContent = (diferencia > 0 ? "Más" : "Menos") + " que en " + mesAnterior;
            }
        } else {
            $("#consumo-diferencia").textContent = "Sin dato";
            $("#consumo-diferencia-detalle").textContent = "No hay lectura del mes anterior";
        }

        // La barra mas alta ocupa el 85 % para dejar espacio al numero de arriba.
        const maximo = Math.max(...lecturas.map((l) => l.m3));
        lecturas.forEach((lectura, i) => {
            const barra = document.createElement("div");
            barra.className = "barra" + (i === lecturas.length - 1 ? " barra--actual" : "");

            const pista = document.createElement("div");
            pista.className = "barra-pista";

            const valor = document.createElement("span");
            valor.className = "barra-valor";
            valor.textContent = formatoDecimal.format(lectura.m3);

            const relleno = document.createElement("span");
            relleno.className = "barra-relleno";
            relleno.style.height = (maximo ? (lectura.m3 / maximo) * 85 : 0) + "%";

            const mes = document.createElement("span");
            mes.className = "barra-mes";
            mes.textContent = mesCorto(lectura.periodo);

            pista.append(valor, relleno);
            barra.append(pista, mes);
            grafico.append(barra);
        });

        grafico.setAttribute("aria-label", "Consumo mensual: " + lecturas
            .map((l) => periodoLargo(l.periodo) + ", " + formatoDecimal.format(l.m3) + " metros cúbicos")
            .join("; ") + ".");
    }

    // ---------- Perfil ----------

    function marcarError(campo, mensaje) {
        const error = document.getElementById("error-" + campo.name);
        if (mensaje) {
            campo.setAttribute("aria-invalid", "true");
            error.textContent = mensaje;
            error.hidden = false;
        } else {
            campo.removeAttribute("aria-invalid");
            error.hidden = true;
        }
        return !mensaje;
    }

    function llenarFormularioPerfil() {
        $("#perfil-whatsapp").value = D.usuario.whatsapp;
        $("#perfil-correo").value = D.usuario.correo;
    }

    $("#form-perfil").addEventListener("submit", (evento) => {
        evento.preventDefault();
        const whatsapp = $("#perfil-whatsapp");
        const correo = $("#perfil-correo");

        const digitos = whatsapp.value.replace(/\D/g, "");
        const whatsappBien = marcarError(whatsapp,
            digitos.length === 8 ? "" : "Escriba un número de 8 dígitos, por ejemplo 8888-8888.");
        const correoBien = marcarError(correo,
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()) ? "" : "Escriba un correo válido, por ejemplo nombre@correo.com.");

        if (!whatsappBien) { whatsapp.focus(); return; }
        if (!correoBien) { correo.focus(); return; }

        D.usuario.whatsapp = digitos.slice(0, 4) + "-" + digitos.slice(4);
        D.usuario.correo = correo.value.trim();
        llenarFormularioPerfil();
        pintarCampos();
        mostrarAviso("Datos actualizados. (Demostración: todavía no se guardan en la base de datos.)");
    });

    // ---------- Soporte ----------

    function pintarSoporte() {
        $$("[data-asada]").forEach((el) => {
            el.textContent = D.asada[el.dataset.asada] || "Por definir";
        });
    }

    $("#form-soporte").addEventListener("submit", (evento) => {
        evento.preventDefault();
        const mensaje = $("#soporte-mensaje");
        const bien = marcarError(mensaje,
            mensaje.value.trim().length >= 10 ? "" : "Escriba su mensaje, con al menos 10 letras.");
        if (!bien) { mensaje.focus(); return; }

        evento.target.reset();
        mostrarAviso("Recibimos su mensaje. (Demostración: todavía no se envía a la ASADA.)");
    });

    // ---------- Administracion ----------

    function pintarMedidores(busqueda) {
        const termino = sinTildes(busqueda.trim());
        const lista = D.medidores.filter((m) => !termino ||
            sinTildes(m.numero + " " + m.dueno + " " + m.cedula).includes(termino));

        const cuerpo = $("#tabla-medidores");
        cuerpo.replaceChildren();
        if (lista.length === 0) {
            cuerpo.append(filaVacia(4, "Ningún medidor coincide con la búsqueda."));
            return;
        }
        lista.forEach((m) => {
            cuerpo.append(crearFila([
                { etiqueta: "Medidor", texto: m.numero },
                { etiqueta: "Dueño", texto: m.dueno },
                { etiqueta: "Cédula", texto: m.cedula },
                { etiqueta: "Estado", nodo: crearEtiqueta(m.estado) }
            ]));
        });
    }

    function pintarUsuarios() {
        const cuerpo = $("#tabla-usuarios");
        cuerpo.replaceChildren();
        D.usuariosRegistrados.forEach((u) => {
            cuerpo.append(crearFila([
                { etiqueta: "Nombre", texto: u.nombre },
                { etiqueta: "Cédula", texto: u.cedula },
                { etiqueta: "Medidor", texto: u.medidor },
                { etiqueta: "WhatsApp", texto: u.whatsapp },
                { etiqueta: "Registrado el", texto: fechaLarga(u.registro) }
            ]));
        });
    }

    $("#buscar-medidor").addEventListener("input", (evento) => pintarMedidores(evento.target.value));
    $("#boton-agregar-medidor").addEventListener("click", () =>
        mostrarAviso("Pendiente: el formulario para agregar medidores todavía no existe."));

    $("#boton-salir").addEventListener("click", () =>
        mostrarAviso("Pendiente: la pantalla de inicio de sesión todavía no existe."));

    // ---------- Arranque ----------

    if (!esAdmin) {
        $$("[data-solo-admin]").forEach((el) => { el.hidden = true; });
    }

    pintarCampos();
    pintarInicio();
    llenarFormularioPerfil();
    pintarHistorial("", "");
    pintarConsumo();
    pintarSoporte();
    if (esAdmin) {
        pintarMedidores("");
        pintarUsuarios();
    }

    actualizarInert();
    mostrarVista(vistaDesdeHash() || "inicio", false);
})();
