// js/simulador/06-decaimiento.js
// ============================================
// DECAIMIENTO - Cómo se disipan los efectos
// ============================================

const DECAIMIENTO = {
    factorPorTurno: 0.85,  // 15% de decaimiento por turno
    
    aplicar: function(valor, turnosTranscurridos) {
        let resultado = valor;
        for (let i = 0; i < turnosTranscurridos; i++) {
            resultado = resultado * this.factorPorTurno;
        }
        return Math.max(0, Math.round(resultado * 10) / 10);
    },
    
    tiempoVida: function(valorInicial, umbral = 1) {
        let turnos = 0;
        let valor = valorInicial;
        while (valor > umbral && turnos < 50) {
            valor = valor * this.factorPorTurno;
            turnos++;
        }
        return turnos;
    }
};

window.DECAIMIENTO = DECAIMIENTO;
