// Datos de ejemplo, ficticios, para maquetar la interfaz.
// Cuando exista el backend, este archivo se reemplaza por las consultas
// a la base de datos de la ASADA.

window.SICPA_DATOS = {
    // "admin" muestra el grupo Administración en el menú; "usuario" lo oculta.
    rol: "admin",

    usuario: {
        nombre: "Ana Rodríguez Solís",
        cedula: "2-0733-0726",
        medidor: "3",
        direccion: "Guayabal, 200 metros norte de la escuela, casa verde de portón blanco",
        whatsapp: "8888-1234",
        correo: "ana.rodriguez@correo.com"
    },

    // Recibo del periodo en curso. estado: "pendiente" o "pagado".
    reciboActual: {
        periodo: "2026-09",
        monto: 8450,
        vence: "2026-09-30",
        estado: "pendiente"
    },

    // Pagos registrados por la ASADA. Fechas en formato AAAA-MM-DD.
    pagos: [
        { fecha: "2026-09-08", periodo: "2026-08", recibo: "R-2026-0803", monto: 8120 },
        { fecha: "2026-08-11", periodo: "2026-07", recibo: "R-2026-0703", monto: 7910 },
        { fecha: "2026-07-09", periodo: "2026-06", recibo: "R-2026-0603", monto: 7700 },
        { fecha: "2026-06-15", periodo: "2026-05", recibo: "R-2026-0503", monto: 8330 },
        { fecha: "2026-05-12", periodo: "2026-04", recibo: "R-2026-0403", monto: 8960 },
        { fecha: "2026-04-10", periodo: "2026-03", recibo: "R-2026-0303", monto: 9380 },
        { fecha: "2026-03-09", periodo: "2026-02", recibo: "R-2026-0203", monto: 9170 },
        { fecha: "2026-02-16", periodo: "2026-01", recibo: "R-2026-0103", monto: 8540 },
        { fecha: "2026-01-13", periodo: "2025-12", recibo: "R-2025-1203", monto: 7910 },
        { fecha: "2025-12-10", periodo: "2025-11", recibo: "R-2025-1103", monto: 7490 },
        { fecha: "2025-11-12", periodo: "2025-10", recibo: "R-2025-1003", monto: 7700 },
        { fecha: "2025-10-08", periodo: "2025-09", recibo: "R-2025-0903", monto: 7910 }
    ],

    // Lecturas mensuales en metros cúbicos, de la más antigua a la más reciente.
    consumo: [
        { periodo: "2025-10", m3: 16 },
        { periodo: "2025-11", m3: 15 },
        { periodo: "2025-12", m3: 17 },
        { periodo: "2026-01", m3: 19 },
        { periodo: "2026-02", m3: 21 },
        { periodo: "2026-03", m3: 22 },
        { periodo: "2026-04", m3: 20 },
        { periodo: "2026-05", m3: 18 },
        { periodo: "2026-06", m3: 16 },
        { periodo: "2026-07", m3: 17 },
        { periodo: "2026-08", m3: 18 },
        { periodo: "2026-09", m3: 18 }
    ],

    // Datos de contacto de la ASADA: pendientes de confirmar.
    asada: {
        telefono: "Por definir",
        whatsapp: "Por definir",
        horario: "Por definir",
        direccion: "Por definir"
    },

    // Panel administrativo
    medidores: [
        { numero: "1", dueno: "Carlos Jiménez Mora", cedula: "1-0845-0321", estado: "activo" },
        { numero: "2", dueno: "María Fernanda Castro Ruiz", cedula: "5-0412-0987", estado: "activo" },
        { numero: "3", dueno: "Ana Rodríguez Solís", cedula: "2-0733-0726", estado: "activo" },
        { numero: "4", dueno: "José Pablo Vargas Araya", cedula: "2-0561-0214", estado: "inactivo" },
        { numero: "5", dueno: "Rosa Elena Chaves Méndez", cedula: "6-0198-0443", estado: "activo" },
        { numero: "6", dueno: "Luis Diego Quesada Rojas", cedula: "1-1204-0876", estado: "activo" }
    ],

    usuariosRegistrados: [
        { nombre: "Ana Rodríguez Solís", cedula: "2-0733-0726", medidor: "3", whatsapp: "8888-1234", registro: "2026-08-14" },
        { nombre: "Carlos Jiménez Mora", cedula: "1-0845-0321", medidor: "1", whatsapp: "8765-4321", registro: "2026-08-20" },
        { nombre: "Rosa Elena Chaves Méndez", cedula: "6-0198-0443", medidor: "5", whatsapp: "8321-0099", registro: "2026-09-02" }
    ]
};
