//// ============================================
// OBJETIVOS ESTRATÉGICOS
// ============================================

const OBJETIVOS = {
    
    porActor: {
        españa: [
            {
                nombre: 'estabilidad_economica',
                descripcion: 'Mantener crecimiento y empleo',
                peso: 0.8,
                prioridad: 1,
                metricas: { pib: 0.6, empleo: 0.5, deuda: 0.5 }
            },
            {
                nombre: 'seguridad_energetica',
                descripcion: 'Asegurar suministro energético',
                peso: 0.7,
                prioridad: 2,
                metricas: { dependencia: 0.4, renovables: 0.6 }
            },
            {
                nombre: 'integracion_europea',
                descripcion: 'Fortalecer posición en UE',
                peso: 0.6,
                prioridad: 3,
                metricas: { influencia: 0.5, fondos: 0.7 }
            }
        ],
        francia: [
            {
                nombre: 'liderazgo_europeo',
                descripcion: 'Liderar la Unión Europea',
                peso: 0.8,
                prioridad: 1,
                metricas: { influencia: 0.7, alianzas: 0.6 }
            },
            {
                nombre: 'independencia_energetica',
                descripcion: 'Reducir dependencia exterior',
                peso: 0.7,
                prioridad: 2,
                metricas: { nuclear: 0.8, renovables: 0.5 }
            }
        ],
        eeuu: [
            {
                nombre: 'hegemonia_global',
                descripcion: 'Mantener liderazgo mundial',
                peso: 0.9,
                prioridad: 1,
                metricas: { militar: 0.8, economico: 0.7 }
            }
        ]
    },
    
    progreso: function(actor, objetivo) {
        const def = this.porActor[actor]?.find(o => o.nombre === objetivo);
        if (!def) return 0.5;
        
        let total = 0, count = 0;
        for (let m in def.metricas) {
            total += def.metricas[m];
            count++;
        }
        return count ? total / count : 0.5;
    },
    
    brechasCriticas: function(actor) {
        const objetivos = this.porActor[actor] || [];
        return objetivos
            .map(o => ({ ...o, progreso: this.progreso(actor, o.nombre) }))
            .filter(o => o.progreso < 0.5);
    },
    
    satisfaccion: function(actor) {
        const objetivos = this.porActor[actor] || [];
        if (!objetivos.length) return 0.5;
        
        let total = 0, pesoTotal = 0;
        for (let o of objetivos) {
            total += this.progreso(actor, o.nombre) * o.peso;
            pesoTotal += o.peso;
        }
        return pesoTotal ? total / pesoTotal : 0.5;
    }
};

window.OBJETIVOS = OBJETIVOS;

