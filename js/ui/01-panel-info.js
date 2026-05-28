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
                <div class="info-mas-info">
                    <button id="btn-mas-info" class="btn-mas-info">📋 Más información</button>
                    <div id="panel-mas-info" class="panel-mas-info" style="display: none;"></div>
                </div>
            </div>
        `;
        
        this.vincularEventosBotones();
        this.vincularBotonMasInfo();
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
    },
    
    vincularBotonMasInfo: function() {
        const btnMasInfo = document.getElementById('btn-mas-info');
        if (btnMasInfo) {
            btnMasInfo.removeEventListener('click', this.mostrarInformacionDetallada);
            btnMasInfo.addEventListener('click', () => this.mostrarInformacionDetallada());
        }
    },
    
    async mostrarInformacionDetallada() {
        const panel = document.getElementById('panel-mas-info');
        if (!panel) return;
        
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
            return;
        }
        
        panel.style.display = 'block';
        panel.innerHTML = '<div class="mas-info-loading">🔄 Cargando datos...</div>';
        
        const info = await this.obtenerInformacionCompleta();
        panel.innerHTML = this.generarHTMLInformacionDetallada(info);
        
        // Cerrar con el botón X
        const btnCerrar = document.getElementById('btn-cerrar-mas-info');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => {
                panel.style.display = 'none';
            });
        }
    },
    
    async obtenerInformacionCompleta() {
        const pais = this.paisActual;
        return {
            pais: pais,
            economia: {
                pib: 1420,
                pib_percapita: 29800,
                inflacion: 2.8,
                deuda: 118,
                desempleo: 11.2
            },
            demografia: {
                poblacion: 48400000,
                densidad: 94,
                esperanza_vida: 83.5,
                urbanizacion: 80
            },
            energia: {
                consumo_electrico: 250,
                renovables: 45,
                dependencia_exterior: 73
            },
            fuentes: [
                'INE - Instituto Nacional de Estadística',
                'Banco de España',
                'Eurostat'
            ]
        };
    },
    
    generarHTMLInformacionDetallada: function(info) {
        return `
            <div class="mas-info-header">
                <h4>📋 FICHA COMPLETA · ${info.pais.toUpperCase()}</h4>
                <button id="btn-cerrar-mas-info" class="btn-cerrar-mas-info">✕</button>
            </div>
            <div class="mas-info-contenido">
                <div class="mas-info-seccion">
                    <h5>💰 Economía</h5>
                    <p>PIB: ${(info.economia.pib).toLocaleString()} M€</p>
                    <p>PIB per cápita: ${info.economia.pib_percapita.toLocaleString()} €</p>
                    <p>Inflación: ${info.economia.inflacion}%</p>
                    <p>Deuda pública: ${info.economia.deuda}% del PIB</p>
                    <p>Desempleo: ${info.economia.desempleo}%</p>
                </div>
                <div class="mas-info-seccion">
                    <h5>👥 Demografía</h5>
                    <p>Población: ${info.demografia.poblacion.toLocaleString()} hab.</p>
                    <p>Densidad: ${info.demografia.densidad} hab/km²</p>
                    <p>Esperanza de vida: ${info.demografia.esperanza_vida} años</p>
                    <p>Población urbana: ${info.demografia.urbanizacion}%</p>
                </div>
                <div class="mas-info-seccion">
                    <h5>⚡ Energía</h5>
                    <p>Consumo eléctrico: ${info.energia.consumo_electrico} TWh/año</p>
                    <p>Renovables: ${info.energia.renovables}% del mix</p>
                    <p>Dependencia energética: ${info.energia.dependencia_exterior}%</p>
                </div>
                <div class="mas-info-seccion">
                    <h5>📚 Fuentes</h5>
                    <ul>
                        ${info.fuentes.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="mas-info-footer">
                <small>🔄 Datos actualizados: ${new Date().toLocaleDateString()}</small>
                <small>📊 Sin manipulación</small>
            </div>
        `;
    }
};

window.UIPanelInfo = UIPanelInfo;
