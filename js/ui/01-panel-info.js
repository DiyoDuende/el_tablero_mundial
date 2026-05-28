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
        
        this.vincularEventosBotones();
    },
    
    vincularEventosBotones: function() {
        document.querySelectorAll('.info-btn').forEach(btn => {
            btn.removeEventListener('click', this.manejadorClick);
            btn.addEventListener('click', this.manejadorClick.bind(this));
        });
    },
    
    manejadorClick: function(e) {
        const seccion = e.currentTarget.dataset.seccion;
        if (seccion) this.mostrarSeccion(seccion);
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
                        <p><strong>PIB:</strong> 1.420.000 M€</p>
                        <p><strong>Inflación:</strong> 2.8%</p>
                        <p><strong>Deuda/PIB:</strong> 118%</p>
                        <p><strong>Desempleo:</strong> 11.2%</p>
                        <button class="btn-volver">◀ Volver</button>
                    </div>
                `;
                break;
            case 'leyes':
                contenido = `
                    <div class="dashboard-seccion">
                        <h4>⚖️ Leyes destacadas de ${this.paisActual.toUpperCase()}</h4>
                        <ul>
                            <li>Ley de Transición Energética 2026</li>
                            <li>Reforma Sanitaria 2026</li>
                            <li>Ley de Soberanía Digital</li>
                        </ul>
                        <button class="btn-volver">◀ Volver</button>
                    </div>
                `;
                break;
            default:
                contenido = `
                    <div class="dashboard-seccion">
                        <h4>${seccion.toUpperCase()}</h4>
                        <p>Información de ejemplo para ${this.paisActual.toUpperCase()}</p>
                        <button class="btn-volver">◀ Volver</button>
                    </div>
                `;
        }
        
        container.innerHTML = contenido;
        
        const btnVolver = container.querySelector('.btn-volver');
        if (btnVolver) {
            btnVolver.addEventListener('click', () => {
                this.mostrarPais(this.paisActual);
            });
        }
    }
};

window.UIPanelInfo = UIPanelInfo;
