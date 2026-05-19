// 03-interacciones.js
// Asocia botones del HTML con las decisiones del simulador

document.addEventListener('DOMContentLoaded', function() {
    const btnSubir = document.getElementById("btn_subir_impuestos");
    const btnBajar = document.getElementById("btn_bajar_gasto");
    const btnTech = document.getElementById("btn_invertir_tech");
    const btnToggle = document.getElementById("btn_toggle_modo");

    if (btnSubir) btnSubir.onclick = () => window.procesarDecision("subir_impuestos");
    if (btnBajar) btnBajar.onclick = () => window.procesarDecision("bajar_gasto_social");
    if (btnTech) btnTech.onclick = () => window.procesarDecision("invertir_tecnologia");

    if (btnToggle) {
        btnToggle.onclick = () => {
            window.estadoJuego.modo = (window.estadoJuego.modo === "real") ? "simulacion" : "real";
            window.estadoJuego.mensajeFeedback = window.estadoJuego.modo === "real" 
                ? "🔒 Modo Real activado. Los datos vuelven a valores reales." 
                : "🎲 Modo Simulación. ¡Tus decisiones afectan el tablero!";
            window.dispatchEvent(new Event('estadoActualizado'));
        };
    }
});
