// SICPA - pantallas de ingreso y de creacion de cuenta.
//
// Demostracion: las cuentas y los medidores salen de datos.js. En la version
// final, la cedula y la contraseña se revisan en el servidor.

(function () {
    "use strict";

    const D = window.SICPA_DATOS;
    const SESION = window.SICPA_SESION;

    // Si ya hay sesion, no tiene sentido volver a ingresar.
    if (SESION.leer()) {
        location.replace("index.html");
        return;
    }

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => Array.from(document.querySelectorAll(selector));

    const TITULOS = {
        ingresar: "Ingresar",
        registro: "Crear mi cuenta",
        listo: "Cuenta creada"
    };

    // ---------- Formatos ----------

    // Acepta la cedula con o sin guiones: "207330726" -> "2-0733-0726".
    // Devuelve "" si no son 9 numeros.
    function normalizarCedula(texto) {
        const digitos = texto.replace(/\D/g, "");
        if (digitos.length !== 9) return "";
        return digitos[0] + "-" + digitos.slice(1, 5) + "-" + digitos.slice(5);
    }

    // ---------- Pantallas ----------

    function mostrarPantalla(id, moverFoco) {
        $$("[data-pantalla]").forEach((seccion) => {
            seccion.hidden = seccion.dataset.pantalla !== id;
        });
        document.title = TITULOS[id] + " | SICPA";
        window.scrollTo(0, 0);
        if (moverFoco) $("#titulo-" + id).focus();
    }

    // Solo "ingresar" y "registro" se abren con el ancla; "listo" aparece
    // unicamente despues de crear la cuenta.
    function pantallaDesdeHash() {
        return location.hash === "#registro" ? "registro" : "ingresar";
    }

    window.addEventListener("hashchange", () => mostrarPantalla(pantallaDesdeHash(), true));

    // ---------- Errores ----------

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

    // Error general del formulario, arriba de los campos.
    function errorGeneral(id, mensaje) {
        const error = $("#" + id);
        error.textContent = mensaje || "";
        error.hidden = !mensaje;
    }

    // Revisa los campos en orden y pone el foco en el primero que esta mal.
    function revisar(validaciones) {
        let primero = null;
        validaciones.forEach(([campo, mensaje]) => {
            if (!marcarError(campo, mensaje) && !primero) primero = campo;
        });
        if (primero) primero.focus();
        return !primero;
    }

    // ---------- Mostrar contraseña ----------

    $$("[data-ver]").forEach((boton) => {
        boton.setAttribute("aria-controls", boton.dataset.ver);
        boton.addEventListener("click", () => {
            const campo = document.getElementById(boton.dataset.ver);
            const ver = campo.type === "password";
            campo.type = ver ? "text" : "password";
            boton.textContent = ver ? "Ocultar" : "Mostrar";
            boton.setAttribute("aria-pressed", String(ver));
        });
    });

    // ---------- Ingresar ----------

    $("#form-ingresar").addEventListener("submit", (evento) => {
        evento.preventDefault();
        errorGeneral("error-ingresar", "");

        const cedula = $("#ingresar-cedula");
        const clave = $("#ingresar-clave");
        const cedulaNormal = normalizarCedula(cedula.value);

        const bien = revisar([
            [cedula, cedulaNormal ? "" : "Escriba su cédula de 9 números, por ejemplo 1-2345-6789."],
            [clave, clave.value ? "" : "Escriba su contraseña."]
        ]);
        if (!bien) return;

        // El mismo mensaje para cedula o contraseña equivocada: asi no se
        // revela que cedulas tienen cuenta.
        const cuenta = D.cuentasDemo.find((c) => c.cedula === cedulaNormal);
        if (!cuenta || cuenta.contrasena !== clave.value) {
            errorGeneral("error-ingresar", "La cédula o la contraseña no coinciden. Revíselas e intente de nuevo.");
            clave.value = "";
            clave.focus();
            return;
        }

        if (!SESION.iniciar(cuenta.cedula, cuenta.rol)) {
            errorGeneral("error-ingresar", "Su navegador no permitió iniciar la sesión. Pruebe con otro navegador o fuera del modo privado.");
            return;
        }
        location.replace("index.html");
    });

    // ---------- Crear cuenta ----------

    $("#form-registro").addEventListener("submit", (evento) => {
        evento.preventDefault();
        errorGeneral("error-registro", "");

        const cedula = $("#registro-cedula");
        const medidor = $("#registro-medidor");
        const whatsapp = $("#registro-whatsapp");
        const correo = $("#registro-correo");
        const direccion = $("#registro-direccion");
        const clave = $("#registro-clave");
        const clave2 = $("#registro-clave2");

        const cedulaNormal = normalizarCedula(cedula.value);
        const numeroMedidor = medidor.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
        const digitosWhatsapp = whatsapp.value.replace(/\D/g, "");

        const bien = revisar([
            [cedula, cedulaNormal ? "" : "Escriba su cédula de 9 números, por ejemplo 1-2345-6789."],
            [medidor, numeroMedidor ? "" : "Escriba el número de medidor que aparece en su recibo."],
            [whatsapp, digitosWhatsapp.length === 8 ? "" : "Escriba un número de 8 dígitos, por ejemplo 8888-8888."],
            [correo, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()) ? "" : "Escriba un correo válido, por ejemplo nombre@correo.com."],
            [direccion, direccion.value.trim().length >= 10 ? "" : "Escriba su dirección exacta, con al menos 10 letras."],
            [clave, clave.value.length >= 8 ? "" : "La contraseña debe tener al menos 8 letras o números."],
            [clave2, clave2.value === clave.value ? "" : "Las dos contraseñas no son iguales. Escríbala de nuevo."]
        ]);
        if (!bien) return;

        // El medidor tiene que estar a nombre de esa cedula. No se dice cual de
        // los dos datos fallo, para no revelar a quien pertenece cada medidor.
        const registro = D.medidores.find((m) => m.numero === numeroMedidor && m.cedula === cedulaNormal);
        if (!registro) {
            errorGeneral("error-registro", "No encontramos ese medidor a nombre de esa cédula. Revise los dos datos en su recibo o comuníquese con la ASADA.");
            cedula.focus();
            return;
        }
        if (registro.estado !== "activo") {
            errorGeneral("error-registro", "Ese medidor está inactivo. Comuníquese con la ASADA para activarlo.");
            cedula.focus();
            return;
        }
        if (D.usuariosRegistrados.some((u) => u.cedula === cedulaNormal)) {
            errorGeneral("error-registro", "Esta cédula ya tiene una cuenta. Ingrese con su contraseña.");
            cedula.focus();
            return;
        }

        if (!SESION.iniciar(cedulaNormal, "usuario")) {
            errorGeneral("error-registro", "Su navegador no permitió iniciar la sesión. Pruebe con otro navegador o fuera del modo privado.");
            return;
        }
        evento.target.reset();
        mostrarPantalla("listo", true);
    });

    // ---------- Olvido de contraseña ----------

    $$("[data-asada]").forEach((el) => {
        el.textContent = D.asada[el.dataset.asada] || "Por definir";
    });

    $("#boton-olvido").addEventListener("click", (evento) => {
        const ayuda = $("#ayuda-olvido");
        ayuda.hidden = !ayuda.hidden;
        evento.currentTarget.setAttribute("aria-expanded", String(!ayuda.hidden));
    });

    // ---------- Arranque ----------

    mostrarPantalla(pantallaDesdeHash(), false);
})();
