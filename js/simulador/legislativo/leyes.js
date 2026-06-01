// js/simulador/legislativo/leyes.js
// ============================================
// LEYES - Base de datos de legislación
// ============================================

const LEYES = {
    porPais: {
        espana: [
            {
                id: 'ley-energia-2026',
                nombre: 'Ley de Transición Energética 2026',
                fecha: '2026-01-15',
                estado: 'activa',
                ambito: 'energía',
                textoOriginal: 'Ley para la transición energética y energías renovables.'
            },
            {
                id: 'reforma-laboral-2026',
                nombre: 'Reforma Laboral 2026',
                fecha: '2026-02-01',
                estado: 'tramitacion',
                ambito: 'economía',
                textoOriginal: 'Reforma del mercado laboral y contratación.'
            }
        ]
    },
    
    getLeyesPais: function(pais) {
        return this.porPais[pais] || [];
    },
    
    getLey: function(id) {
        for (let pais in this.porPais) {
            const ley = this.porPais[pais].find(l => l.id === id);
            if (ley) return ley;
        }
        return null;
    }
};

window.LEYES = LEYES;
