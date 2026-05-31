// js/simulador/04-eventos.js
// ============================================
// EVENTOS - Catálogo de eventos globales
// ============================================

const EVENTOS_GLOBALES = {
    catalogo: {
        'crisis_energetica': {
            nombre: 'Crisis energética',
            impactos: { económico: -0.3, geopolítico: -0.2, social: -0.25 },
            duracion: 6,
            probabilidad: 0.1
        },
        'subida_petroleo': {
            nombre: 'Subida del petróleo',
            impactos: { económico: -0.2, social: -0.1 },
            duracion: 3,
            probabilidad: 0.15
        },
        'protestas': {
            nombre: 'Protestas sociales',
            impactos: { social: -0.3, político: -0.1 },
            duracion: 2,
            probabilidad: 0.2
        }
    },
    
    get: function(id) {
        return this.catalogo[id] || null;
    },
    
    listar: function() {
        return Object.keys(this.catalogo);
    }
};

window.EVENTOS_GLOBALES = EVENTOS_GLOBALES;
