// ============================================
// EVENTOS - Catálogo
// ============================================

const EVENTOS = {
    
    catalogo: {
        crisis_energetica: {
            id: 'crisis_energetica',
            nombre: 'Crisis energética',
            tipo: 'económico',
            impactos: { energía: -0.4, económico: -0.2 },
            duracion: '12 meses',
            probabilidad_base: 0.1
        },
        huelga_general: {
            id: 'huelga_general',
            nombre: 'Huelga general',
            tipo: 'social',
            impactos: { social: -0.4, económico: -0.2 },
            duracion: '1 mes',
            probabilidad_base: 0.2
        },
        sequia: {
            id: 'sequia',
            nombre: 'Sequía prolongada',
            tipo: 'climático',
            impactos: { ecosistema: -0.3, agricultura: -0.5 },
            duracion: '24 meses',
            probabilidad_base: 0.15
        },
        sanciones: {
            id: 'sanciones',
            nombre: 'Sanciones internacionales',
            tipo: 'geopolítico',
            impactos: { económico: -0.3, comercial: -0.4 },
            duracion: 'variable',
            probabilidad_base: 0.1
        },
        subida_tipos: {
            id: 'subida_tipos',
            nombre: 'Subida de tipos de interés',
            tipo: 'financiero',
            impactos: { financiero: -0.2, económico: -0.1 },
            duracion: '6 meses',
            probabilidad_base: 0.2
        }
    },
    
    get: function(id) {
        return this.catalogo[id] || null;
    },
    
    aplicar: function(eventoId, territorioId) {
        const evento = this.get(eventoId);
        if (!evento) return null;
        
        return {
            ...evento,
            territorio: territorioId,
            timestamp: new Date().toISOString()
        };
    }
};

window.EVENTOS = EVENTOS;
