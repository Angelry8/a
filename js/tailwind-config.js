// SICPA - configuracion de Tailwind (CDN), compartida por todas las paginas.
// Se carga justo despues de https://cdn.tailwindcss.com y antes de pintar.

// La letra base es de 18 px, y Tailwind mide espacios y bordes en rem: p-6
// daria 27 px en vez de 24. Para que margenes, iconos y botones midan lo de
// siempre, la escala va en pixeles (cada unidad = 4 px). Los textos si siguen
// en rem, para que crezcan con la letra base.
const espaciadoEnPx = { px: "1px" };
[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24].forEach((n) => {
    espaciadoEnPx[String(n)] = n * 4 + "px";
});

tailwind.config = {
    theme: {
        extend: {
            spacing: espaciadoEnPx,
            borderRadius: {
                sm: "2px",
                DEFAULT: "4px",
                md: "6px",
                lg: "8px",
                xl: "12px",
                "2xl": "16px"
            },
            colors: {
                azul: {
                    950: "#081f3f",
                    900: "#0c2b55",
                    800: "#0f3f7a",
                    700: "#1456a8",
                    600: "#1e6bc6",
                    500: "#3b82d9",
                    200: "#bbd4f2",
                    100: "#e3eefb",
                    50: "#f2f7fd"
                },
                fondo: "#f4f8fc",
                texto: {
                    DEFAULT: "#0e213a",
                    suave: "#4a5d78"
                },
                borde: {
                    DEFAULT: "#d9e4f2",
                    fuerte: "#9db3cf"
                },
                verde: {
                    DEFAULT: "#146c43",
                    fondo: "#e2f4ea",
                    borde: "#b7e0c9"
                },
                ambar: {
                    DEFAULT: "#8a5300",
                    fondo: "#fff1d6",
                    borde: "#f3d9a4"
                },
                rojo: {
                    DEFAULT: "#b42318",
                    fondo: "#fde8e6"
                },
                // Textos de la barra lateral, sobre azul-950
                lateral: {
                    texto: "#d3e2f5",
                    grupo: "#8daad0"
                }
            },
            fontFamily: {
                sans: ["system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"]
            },
            boxShadow: {
                tarjeta: "0 1px 2px rgba(8, 31, 63, 0.06), 0 4px 12px rgba(8, 31, 63, 0.05)",
                aviso: "0 8px 24px rgba(8, 31, 63, 0.25)"
            },
            backgroundImage: {
                // Franja azul de arriba en la pantalla de ingreso
                franja: "linear-gradient(#0c2b55, #0c2b55)"
            }
        }
    },
    plugins: [
        function ({ addBase, theme }) {
            addBase({
                // Letra base grande: buena parte del publico son adultos mayores
                html: { fontSize: "18px" },
                // El atributo hidden tiene que ganarle a clases como "flex" o "grid"
                "[hidden]": { display: "none !important" },
                ":focus-visible": {
                    outline: "3px solid " + theme("colors.azul.500"),
                    outlineOffset: "2px"
                }
            });
        }
    ]
};
