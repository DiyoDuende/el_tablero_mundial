// js/ui/01-panel-info.js
const UIPanelInfo = {
    paisActual: 'españa',
    
    init: function() {
        console.log('UIPanelInfo.init() llamado');
        this.vincularBotones();
    },
    
    vincularBotones: function() {
        console.log('Vinculando botones del panel...');
        const botones = document.querySelectorAll('.info-btn');
        console.log(`Se encontraron ${botones.length} botones`);
        botones.forEach(btn => {
            // Eliminar eventos anteriores para evitar duplicados
            btn.removeEventListener('click', this.handleBotonClick);
            btn.addEventListener('click', this.handleBotonClick.bind(this));
        });
    },
    
    handleBotonClick: function(e) {
        const seccion = e.currentTarget.dataset.seccion;
        console.log(`Botón click: ${seccion}`);
        if (seccion) this.mostrarSeccion(seccion);
    },
    
    mostrarPais: function(paisId) {
        console.log(`Mostrar país: ${paisId}`);
        this.paisActual = paisId;
        const territorio = TERRITORIOS[paisId];
        if (!territorio) {
            console.error(`Territorio no encontrado: ${paisId}`);
            return;
        }
        
        const poblacion = territorio.poblacion ? territorio.poblacion.toLocaleString() : '—';
        const capital = territorio.capital || '—';
        
        this.mostrarPanelBasico(territorio.nombre, poblacion, capital);
    },
    
    mostrarPanelBasico: function(nombre, poblacion, capital) {
        const container = document.getElementById('dashboard-container');
        if (!container) {
            console.error('No se encontró #dashboard-container');
            return;
        }
        
        container.innerHTML = `
            <div class="dashboard-pais">
                <div class="info-header">
                    <h3>🇪🇸 ${nombre}</h3>
                    <span class="pais-estado">🟢 ESTABLE</span>
                </div>
                <div class="info-objetivos">
                    🎯 Objetivos: 68%
                </div>
                <div class="info-botones">
                    <button class="info-btn" data-seccion="economia">📊 Economía</button>
                    <button class="info-btn" data-seccion="leyes">⚖️ Leyes</button>
                    <button class="info-btn" data-seccion="geopolitica">🏛️ Geopolítica</button>
                    <button class="info-btn" data-seccion="social">👥 Social</button>
                    <button class="info-btn" data-seccion="clima">🌍 Clima</button>
                </div>
                <div class="info-datos-basicos">
                    <p><strong>Población:</strong> ${poblacion}</p>
                    <p><strong>Capital:</strong> ${capital}</p>
                </div>
                <div class="info-alertas">
                    <h4>⚠️ Alertas</h4>
                    <div class="alerta-item alerta-roja">🔴 Seguridad energética</div>
                    <div class="alerta-item alerta-amarilla">🟡 Desempleo alto</div>
                </div>
            </div>
        `;
        
        // Volver a vincular los botones (los antiguos fueron destruidos)
        this.vincularBotones();
    },
    
    mostrarSeccion: function(seccion) {
        console.log(`Mostrar sección: ${seccion} para país ${this.paisActual}`);
        const container = document.getElementById('dashboard-container');
        if (!container) return;
        
        let html = '';
        const nombrePais = this.paisActual.toUpperCase();
        
        // Datos simulados (puedes ampliarlos después)
        switch(seccion) {
            case 'economia':
                html = `
                    <div class="dashboard-seccion">
                        <h4>📊 Datos económicos de ${nombrePais}</h4>
                        <p>PIB: +2.3%</p>
                        <p>Inflación: 2.1%</p>
                        <p>Deuda/PIB: 98%</p>
                        <p>Desempleo: 11.2%</p>
                        <button class="btn-volver">◀ Volver</button>
                    </div>
                `;
                break;
            case 'leyes':
                html = `
                    <div class="dashboard-seccion">
                        <h4>⚖️ Leyes destacadas de ${nombrePais}</h4>
                        <ul><li>Ley de Transición Energética 2026</li><li>Reforma Sanitaria 2026</li></ul>
                        <button class="btn-volver">◀ Volver</button>
                    </div>
                `;
                break;
            // ... otros casos similares
            default:
                html = `<p>Información no disponible</p><button class="btn-volver">◀ Volver</button>`;
        }
        
        container.innerHTML = html;
        
        // Botón volver
        const btnVolver = container.querySelector('.btn-volver');
        if (btnVolver) {
            btnVolver.addEventListener('click', () => {
                this.mostrarPais(this.paisActual);
            });
        }
    }
};

window.UIPanelInfo = UIPanelInfo;
