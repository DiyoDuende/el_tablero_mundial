// js/simulador/01-sectores.js
// ============================================
// SECTORES - Sectores económicos y sociales
// ============================================

const SECTORES = {
    valores: {
        'educación': 0.5,
        'sanidad': 0.55,
        'energía': 0.8,
        'infraestructuras': 0.6,
        'industria': 0.7,
        'comercio': 0.65,
        'tecnología': 0.75,
        'agricultura': 0.5,
        'medio_ambiente': 0.5,
        'defensa': 0.85
    },
    
    get: function(sector) {
        const key = typeof sector === 'string' ? sector.toLowerCase() : sector;
        return this.valores[key] || 0.5;
    },
    
    set: function(sector, valor) {
        const key = typeof sector === 'string' ? sector.toLowerCase() : sector;
        this.valores[key] = Math.max(0, Math.min(1, valor));
    },
    
    listar: function() {
        return Object.keys(this.valores);
    }
};

window.SECTORES = SECTORES;
