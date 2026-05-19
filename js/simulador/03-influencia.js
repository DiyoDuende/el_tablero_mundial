// ============================================
// INFLUENCIA - Relaciones entre actores
// ============================================

const INFLUENCIA = {
    
    matriz: {
        eeuu: { china: -0.7, rusia: -0.6, ue: 0.8, españa: 0.6, francia: 0.7, portugal: 0.5 },
        china: { rusia: 0.6, ue: -0.3, japon: -0.4, india: 0.1, brasil: 0.4 },
        rusia: { ue: -0.5, españa: -0.2, francia: -0.2, portugal: -0.1, alemania: -0.3 },
        ue: { españa: 0.8, francia: 0.9, portugal: 0.8, alemania: 0.9, italia: 0.7 },
        españa: { francia: 0.7, portugal: 0.9, italia: 0.6, alemania: 0.6 },
        francia: { portugal: 0.6, italia: 0.6, alemania: 0.7 },
        portugal: { brasil: 0.7, españa: 0.9 },
        otan: { rusia: -0.8, china: -0.5, eeuu: 0.9 }
    },
    
    relacion: function(actor1, actor2) {
        if (actor1 === actor2) return 1.0;
        const a = this.matriz[actor1]?.[actor2];
        const b = this.matriz[actor2]?.[actor1];
        return a ?? b ?? 0;
    },
    
    describirRelacion: function(valor) {
        if (valor > 0.7) return 'aliado estratégico';
        if (valor > 0.4) return 'aliado';
        if (valor > 0.1) return 'relación cordial';
        if (valor > -0.1) return 'relación neutral';
        if (valor > -0.4) return 'tensión';
        if (valor > -0.7) return 'rivalidad';
        return 'enemistad';
    },
    
    calcularInfluencia: function(actorOrigen, impacto) {
        const influencias = [];
        for (let actor in this.matriz) {
            if (actor === actorOrigen) continue;
            const rel = this.relacion(actorOrigen, actor);
            if (Math.abs(rel) > 0.1) {
                influencias.push({
                    actor,
                    relacion: rel,
                    impacto: impacto * rel * 0.5,
                    descripcion: this.describirRelacion(rel)
                });
            }
        }
        return influencias;
    }
};

window.INFLUENCIA = INFLUENCIA;
