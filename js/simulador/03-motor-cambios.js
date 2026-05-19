// 03-motor-cambios.js
// Contiene las reglas de negocio: qué pasa cuando tomas una decisión

window.procesarDecision = function(decision) {
    if (window.estadoJuego.modo === "real") {
        window.estadoJuego.mensajeFeedback = "⚠️ Estás en MODO REAL. Cambia a SIMULACIÓN para experimentar.";
        window.dispatchEvent(new Event('estadoActualizado'));
        return;
    }

    // Copia de los indicadores actuales
    let nuevos = { ...window.estadoJuego.indicadores };
    let mensaje = "";

    // Reglas simples (ampliables después)
    switch (decision) {
        case "subir_impuestos":
            nuevos.apoyoGobierno = Math.min(100, nuevos.apoyoGobierno + 5);
            nuevos.indiceProtestas = Math.min(100, nuevos.indiceProtestas + 8);
            nuevos.desempleo = Math.max(0, nuevos.desempleo - 0.3);
            mensaje = "📈 Subiste impuestos. La recaudación mejora, pero aumenta el descontento.";
            break;
        case "bajar_gasto_social":
            nuevos.apoyoGobierno = Math.max(0, nuevos.apoyoGobierno - 7);
            nuevos.indiceProtestas = Math.min(100, nuevos.indiceProtestas + 12);
            nuevos.desempleo = Math.min(30, nuevos.desempleo + 1.2);
            mensaje = "📉 Bajaste gasto social. Protestas y paro aumentan.";
            break;
        case "invertir_tecnologia":
            nuevos.nivelTecnologico = Math.min(100, nuevos.nivelTecnologico + 10);
            nuevos.desempleo = Math.max(0, nuevos.desempleo - 0.8);
            nuevos.apoyoGobierno = Math.min(100, nuevos.apoyoGobierno + 3);
            mensaje = "💻 Inversión tecnológica: mejora empleo e imagen de gobierno.";
            break;
        default:
            mensaje = "❌ Decisión no reconocida.";
    }

    // Actualizar estado global
    window.actualizarIndicadores(nuevos);
    window.estadoJuego.ultimaDecision = decision;
    window.estadoJuego.mensajeFeedback = mensaje;
};
