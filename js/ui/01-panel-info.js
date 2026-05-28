// js/ui/01-panel-info.js
const UIPanelInfo = {
    paisActual: 'espana',

    init: function() {
        console.log('UIPanelInfo iniciado');
    },

    mostrarPais: function(paisId) {
        this.paisActual = paisId;
        const container = document.getElementById('panel-info');
        if (!container) return;
        const nombreMostrar = paisId === 'espana' ? 'España' : paisId.toUpperCase();
        
        container.innerHTML = `
            <div class="dashboard-pais">
                <div class="info-header">
                    <h3>🌍 ${nombreMostrar}</h3>
                    <span class="pais-estado">🟢 ESTABLE</span>
                </div>
                <div class="info-botones">
                    <button class="info-btn" data-seccion="economia">📊 Economía</button>
                    <button class="info-btn" data-seccion="leyes">⚖️ Leyes</button>
                    <button class="info-btn" data-seccion="geopolitica">🏛️ Geopolítica</button>
                    <button class="info-btn" data-seccion="social">👥 Social</button>
                    <button class="info-btn" data-seccion="clima">🌍 Clima</button>
                </div>
            </div>
        `;
    },

    mostrarSeccion: function(seccion) {
        const container = document.getElementById('panel-info');
        if (!container) return;
        
        let contenido = '';
        switch(seccion) {
            case 'economia':
                contenido = `
                    <div class="dashboard-seccion">
                        <h4>📊 Datos económicos de ${this.paisActual.toUpperCase()}</h4>
                        <p>PIB: +2.3%</p>
                        <p>Inflación: 2.1%</p>
                        <p>Deuda/PIB: 98%</p>
                        <p>Desempleo: 11.2%</p>
                        <button class="btn-volver">◀ Volver</button>
                    </div>
                `;
                break;
            case 'leyes':
                contenido = `
                    <div class="dashboard-seccion">
                        <h4>⚖️ Leyes destacadas de ${this.paisActual.toUpperCase()}</h4>
                        <ul><li>Ley de Transición Energética 2026</li><li>Reforma Sanitaria 2026</li></ul>
                        <button class="btn-volver">◀ Volver</button>
                    </div>
                `;
                break;
            default:
                contenido = `<div class="dashboard-seccion"><h4>${seccion}</h4><p>Información de ejemplo</p><button class="btn-volver">◀ Volver</button></div>`;
        }
        
        container.innerHTML = contenido;
        
        const btnVolver = container.querySelector('.btn-volver');
        if (btnVolver) {
            btnVolver.addEventListener('click', () => this.mostrarPais(this.paisActual));
        }
    }
};

window.UIPanelInfo = UIPanelInfo;
