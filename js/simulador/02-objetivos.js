// js/simulador/02-objetivos.js
// ============================================
// OBJETIVOS - Metas estratégicas por actor
// ============================================

const OBJETIVOS = {
    porActor: {
        'espana': [
            { nombre: 'Estabilidad económica', prioridad: 0.9, cumplimiento: 0.68 },
            { nombre: 'Integración europea', prioridad: 0.8, cumplimiento: 0.82 },
            { nombre: 'Seguridad energética', prioridad: 0.7, cumplimiento: 0.45 }
        ],
        'default': [
            { nombre: 'Estabilidad', prioridad: 0.8, cumplimiento: 0.5 }
        ]
    },
    
    get: function(actor) {
        return this.porActor[actor] || this.porActor.default;
    },
    
    actualizarCumplimiento: function(actor, objetivo, valor) {
        const objetivos = this.porActor[actor];
        if (!objetivos) return;
        const obj = objetivos.find(o => o.nombre === objetivo);
        if (obj) obj.cumplimiento = Math.max(0, Math.min(1, valor));
    }
};

window.OBJETIVOS = OBJETIVOS;
