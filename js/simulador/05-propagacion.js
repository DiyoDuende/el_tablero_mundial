// js/simulador/05-propagacion.js
// ============================================
// PROPAGACIÓN - Cómo se propagan los impactos
// ============================================

const PROPAGACION = {
    coeficientes: {
        local: 1.0,
        regional: 0.6,
        global: 0.3
    },
    
    propagar: function(impacto, ambito) {
        const coef = this.coeficientes[ambito] || 0.5;
        return impacto * coef;
    },
    
    alcance: function(paisOrigen, paisDestino) {
        // Simplificado: mismo continente = regional, diferente = global
        const mismaRegion = paisOrigen.region === paisDestino.region;
        return mismaRegion ? 'regional' : 'global';
    }
};

window.PROPAGACION = PROPAGACION;
