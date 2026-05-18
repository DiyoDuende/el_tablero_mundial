// ============================================
// CADENA DE IMPACTO - Relaciones automáticas
// ============================================

const CadenaImpacto = {
    
    relaciones: {
        'petróleo': {
            afecta: ['transporte', 'industria', 'inflación'],
            peso: 0.8,
            fuente: 'International Energy Agency'
        },
        'gas': {
            afecta: ['energía', 'industria', 'calefacción'],
            peso: 0.7,
            fuente: 'Eurogas'
        },
        'transporte': {
            afecta: ['logística', 'precios', 'inflación'],
            peso: 0.6,
            fuente: 'Ministerio Transporte'
        },
        'inflación': {
            afecta: ['salarios', 'consumo', 'pobreza'],
            peso: 0.5,
            fuente: 'INE'
        },
        'sequía': {
            afecta: ['agricultura', 'agua', 'alimentos'],
            peso: 0.9,
            fuente: 'AEMET'
        }
    },
    
    generar: function(evento, magnitud = 10) {
        const eventoLower = evento.toLowerCase();
        let indicadorPrincipal = 'petróleo';
        
        for (let key in this.relaciones) {
            if (eventoLower.includes(key)) {
                indicadorPrincipal = key;
                break;
            }
        }
        
        return this.generarCadena(indicadorPrincipal, magnitud);
    },
    
    generarCadena: function(indicador, magnitud) {
        const cadena = [];
        const visitados = new Set();
        
        cadena.push({
            nivel: 1,
            indicador,
            titulo: indicador.toUpperCase(),
            icono: this.getIcono(indicador),
            magnitud,
            fuente: this.relaciones[indicador]?.fuente || 'Datos oficiales'
        });
        
        visitados.add(indicador);
        
        let actual = indicador;
        let magnitudActual = magnitud;
        
        for (let nivel = 2; nivel <= 5; nivel++) {
            const relaciones = this.relaciones[actual]?.afecta || [];
            const posibles = relaciones.filter(r => !visitados.has(r));
            
            if (posibles.length === 0) break;
            
            const siguiente = posibles[0];
            visitados.add(siguiente);
            
            magnitudActual = magnitudActual * (this.relaciones[actual]?.peso || 0.5);
            
            if (Math.abs(magnitudActual) < 0.5) break;
            
            cadena.push({
                nivel,
                indicador: siguiente,
                titulo: siguiente.toUpperCase(),
                icono: this.getIcono(siguiente),
                magnitud: Math.round(magnitudActual * 10) / 10,
                fuente: this.relaciones[siguiente]?.fuente || 'Datos oficiales'
            });
            
            actual = siguiente;
        }
        
        return {
            evento: indicador,
            magnitud_inicial: magnitud,
            cadena
        };
    },
    
    getIcono: function(indicador) {
        const iconos = {
            'petróleo': '🛢️',
            'gas': '🔥',
            'transporte': '🚛',
            'inflación': '💰',
            'sequía': '🌞',
            'agricultura': '🌾',
            'agua': '💧',
            'alimentos': '🍎',
            'industria': '🏭',
            'logística': '📦',
            'salarios': '💶',
            'consumo': '🛒'
        };
        return iconos[indicador] || '📌';
    }
};

window.CadenaImpacto = CadenaImpacto;
