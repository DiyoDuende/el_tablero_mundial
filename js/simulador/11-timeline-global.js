// ============================================
// TIMELINE GLOBAL - Línea temporal dinámica
// ============================================

const TimelineGlobal = {
    
    añoActual: new Date().getFullYear(),
    
    generarAños: function() {
        const años = [];
        const inicio = this.añoActual - 25;
        const fin = this.añoActual + 5;
        for (let año = inicio; año <= fin; año++) {
            años.push(año.toString());
        }
        return años;
    },
    
    eventos: {
        crisis_energetica: {
            id: 'crisis_energetica',
            nombre: 'Crisis energética global',
            tipo: 'energía',
            inicio: '2024-03-15',
            fin: '2026-12-31',
            hitos: [
                { fecha: '2024-03-15', titulo: 'Tensión diplomática', icono: '⚡' },
                { fecha: '2024-06-10', titulo: 'Sanciones económicas', icono: '💰' },
                { fecha: '2025-02-15', titulo: 'Subida petróleo +12%', icono: '🛢️' },
                { fecha: '2025-04-18', titulo: 'Subida electricidad +18%', icono: '⚡' },
                { fecha: '2026-01-20', titulo: 'Protestas sociales', icono: '👥' }
            ]
        }
    },
    
    getHitosPorAño: function(año) {
        const hitos = [];
        for (let id in this.eventos) {
            this.eventos[id].hitos.forEach(hito => {
                if (hito.fecha.startsWith(año)) {
                    hitos.push(hito);
                }
            });
        }
        return hitos.sort((a, b) => a.fecha.localeCompare(b.fecha));
    },
    
    generarHTML: function() {
        const años = this.generarAños();
        
        return `
            <div class="timeline">
                <h4>📅 TIMELINE GLOBAL (${años[0]} - ${años[años.length-1]})</h4>
                <p class="timeline-actualizacion">Año actual: ${this.añoActual}</p>
            </div>
        `;
    }
};

window.TimelineGlobal = TimelineGlobal;

