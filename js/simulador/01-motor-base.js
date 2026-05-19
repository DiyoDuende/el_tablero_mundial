// 01-motor-base.js - Motor de eventos y estabilidad base
window.SimuladorBase = {
    // Calcula estabilidad general en base a indicadores
    calcularEstabilidadGeneral: (indicadores) => {
        if (!indicadores) return 50;
        let salud = 100;
        salud -= (indicadores.desempleo || 0) * 0.8;
        salud -= (indicadores.indiceProtestas || 0) * 0.5;
        salud += (indicadores.apoyoGobierno || 0) * 0.3;
        salud = Math.min(100, Math.max(0, salud));
        return Math.floor(salud);
    },
    // Registrar eventos relevantes para el timeline
    registrarEvento: (tipo, descripcion, impacto) => {
        const evento = {
            id: Date.now(),
            tipo: tipo, // "economico", "social", "politico"
            descripcion: descripcion,
            impacto: impacto,
            timestamp: new Date().toISOString()
        };
        if (!window.eventosGlobales) window.eventosGlobales = [];
        window.eventosGlobales.unshift(evento);
        if (window.eventosGlobales.length > 30) window.eventosGlobales.pop();
        console.log("📢 Evento registrado:", evento);
    }
};
console.log("✅ 01-motor-base.js cargado");
