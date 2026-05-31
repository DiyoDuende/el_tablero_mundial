// js/simulador/00-poderes.js
// ============================================
// PODERES - Tipos de poder y valores base
// ============================================

const PODERES = {
    valores: {
        'político': 0.7,
        'económico': 0.8,
        'financiero': 0.75,
        'militar': 0.9,
        'judicial': 0.5,
        'social': 0.6,
        'mediático': 0.65,
        'religioso': 0.4,
        'criminal': 0.3,
        'científico': 0.55,
        'territorial': 0.6,
        'ecosistema': 0.5
    },
    
    get: function(poder) {
        const key = typeof poder === 'string' ? poder.toLowerCase() : poder;
        return this.valores[key] || 0.5;
    },
    
    set: function(poder, valor) {
        const key = typeof poder === 'string' ? poder.toLowerCase() : poder;
        this.valores[key] = Math.max(0, Math.min(1, valor));
    },
    
    listar: function() {
        return Object.keys(this.valores);
    }
};

window.PODERES = PODERES;
