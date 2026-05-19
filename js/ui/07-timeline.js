
// ============================================
// VISOR DE LÍNEA TEMPORAL (UI)
// ============================================

const UITimeline = {
    
    visible: false,
    
    init: function() {
        document.getElementById('btn-cerrar-timeline').addEventListener('click', () => {
            this.toggle();
        });
        
        document.getElementById('btn-timeline-panel').addEventListener('click', () => {
            this.mostrar();
            this.cargarTimeline();
        });
    },
    
    toggle: function() {
        const panel = document.getElementById('timeline-panel');
        this.visible = !this.visible;
        panel.style.display = this.visible ? 'block' : 'none';
    },
    
    mostrar: function() {
        const panel = document.getElementById('timeline-panel');
        this.visible = true;
        panel.style.display = 'block';
    },
    
    cargarTimeline: function() {
        const años = TimelineGlobal.generarAños();
        const hitos2025 = TimelineGlobal.getHitosPorAño('2025');
        
        let html = `
            <div class="timeline">
                <div class="timeline-header">
                    <h4>📅 Línea Temporal Global</h4>
                    <p>Años disponibles: ${años[0]} - ${años[años.length-1]}</p>
                </div>
                <div class="timeline-años">
                    ${años.slice(0, 5).map(año => `
                        <div class="timeline-año">
                            <strong>${año}</strong>
                            ${hitos2025.filter(h => h.fecha.startsWith(año)).map(h => `
                                <div class="timeline-hito">${h.icono} ${h.titulo}</div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.getElementById('timeline-contenido').innerHTML = html;
    }
};

window.UITimeline = UITimeline;
