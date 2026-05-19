// 03-estado-global.js
// Estado único del juego (fuente de verdad)

window.estadoJuego = {
    modo: "real",       // "real" o "simulacion"
    paisActivo: "ES",
    indicadores: {
        desempleo: 11.4,       // %
        inflacion: 2.8,        // %
        apoyoGobierno: 32,     // % de aprobación
        indiceProtestas: 25,   // 0-100 (más alto = más protestas)
        deudaPublica: 109,     // % PIB
        consumoEnergia: 230,   // TWh anual (aprox)
        nivelTecnologico: 68   // 0-100
    },
    ultimaDecision: null,
    mensajeFeedback: ""
};

// Función para actualizar indicadores (solo números)
window.actualizarIndicadores = function(nuevosValores) {
    for (let clave in nuevosValores) {
        if (window.estadoJuego.indicadores[clave] !== undefined) {
            window.estadoJuego.indicadores[clave] = nuevosValores[clave];
        }
    }
    // Disparar evento para que la UI se refresque
    if (window.dispatchEvent) {
        window.dispatchEvent(new Event('estadoActualizado'));
    }
};
