// SICPA - sesion del usuario en el navegador.
//
// Demostracion: la sesion vive en sessionStorage y se borra al cerrar la
// pestaña. En la version final la sesion la da el servidor despues de revisar
// la contraseña; esto solo decide que pantalla mostrar.

(function () {
    "use strict";

    const CLAVE = "sicpa-sesion";

    // sessionStorage puede fallar (navegador en modo privado o con el
    // almacenamiento bloqueado); en ese caso se trata como "sin sesion".
    function leer() {
        try {
            const sesion = JSON.parse(sessionStorage.getItem(CLAVE));
            return sesion && sesion.cedula ? sesion : null;
        } catch (error) {
            return null;
        }
    }

    function iniciar(cedula, rol) {
        try {
            sessionStorage.setItem(CLAVE, JSON.stringify({ cedula: cedula, rol: rol }));
            return true;
        } catch (error) {
            return false;
        }
    }

    function cerrar() {
        try {
            sessionStorage.removeItem(CLAVE);
        } catch (error) {
            // nada que borrar
        }
    }

    window.SICPA_SESION = { leer: leer, iniciar: iniciar, cerrar: cerrar };
})();
