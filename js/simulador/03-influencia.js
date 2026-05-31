// js/simulador/03-influencia.js
// ============================================
// INFLUENCIA - Cálculo de influencia entre actores
// ============================================

const INFLUENCIA = {
    matriz: new Map(),
    
    set: function(desde, hacia, valor) {
        const key = `${desde}|${hacia}`;
        this.matriz.set(key, Math.max(0, Math.min(1, valor)));
    },
    
    get: function(desde, hacia) {
        const key = `${desde}|${hacia}`;
        return this.matriz.get(key) || 0;
    },
    
    calcularImpacto: function(desde, hacia, poderBase) {
        const influencia = this.get(desde, hacia);
        return poderBase * (0.5 + influencia * 0.5);
    }
};

window.INFLUENCIA = INFLUENCIA;
