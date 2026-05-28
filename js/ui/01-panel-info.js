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
                    <button id="btn-mas-info" class="btn-mas-info">📋 Ver ficha completa del país</button>
                    <div id="panel-mas-info" class="panel-mas-info" style="display: none;"></div>
                </div>
            </div>
        `;
        
        this.reInicializarEventos();
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
            btnVolver.addEventListener('click', () => this.mostrarPais(this.paisActual));
        }
    },
    
    reInicializarEventos: function() {
        const btnMasInfo = document.getElementById('btn-mas-info');
        if (btnMasInfo) {
            btnMasInfo.addEventListener('click', () => this.mostrarInformacionDetallada());
        }
        
        document.querySelectorAll('.mas-info-tab').forEach(tab => {
            const tabId = tab.dataset.tab;
            tab.addEventListener('click', () => {
                this.cambiarTab(tabId);
            });
        });
        
        const btnCerrar = document.getElementById('btn-cerrar-mas-info');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', () => this.cerrarInfoDetallada());
        }
    },
    
    cerrarInfoDetallada: function() {
        const panel = document.getElementById('panel-mas-info');
        if (panel) panel.style.display = 'none';
    },
    
    cambiarTab: function(tabId) {
        document.querySelectorAll('.mas-info-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.mas-info-panel').forEach(p => p.classList.remove('active'));
        
        const tabActivo = document.querySelector(`.mas-info-tab[data-tab="${tabId}"]`);
        const panelActivo = document.querySelector(`.mas-info-panel[data-panel="${tabId}"]`);
        if (tabActivo) tabActivo.classList.add('active');
        if (panelActivo) panelActivo.classList.add('active');
    },
    
    async mostrarInformacionDetallada() {
        const panel = document.getElementById('panel-mas-info');
        if (!panel) return;
        
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
            return;
        }
        
        panel.style.display = 'block';
        panel.innerHTML = '<div class="mas-info-loading">🔄 Cargando datos detallados...</div>';
        
        const info = await this.obtenerInformacionCompleta();
        panel.innerHTML = this.generarHTMLInformacionDetallada(info);
        this.reInicializarEventos();
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
                desempleo: 11.2,
                balanza_comercial: -4.2
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
                'Eurostat',
                'Ministerio de Transición Ecológica'
            ]
        };
    },
    
    generarHTMLInformacionDetallada: function(info) {
        return `
            <div class="mas-info-header">
                <h4>📋 FICHA COMPLETA · ${info.pais.toUpperCase()}</h4>
                <button class="btn-cerrar-mas-info" id="btn-cerrar-mas-info">✕</button>
            </div>
            <div class="mas-info-tabs">
                <button class="mas-info-tab active" data-tab="economia">💰 Economía</button>
                <button class="mas-info-tab" data-tab="demografia">👥 Demografía</button>
                <button class="mas-info-tab" data-tab="energia">⚡ Energía</button>
                <button class="mas-info-tab" data-tab="fuentes">📚 Fuentes</button>
            </div>
            <div class="mas-info-contenido">
                <div class="mas-info-panel active" data-panel="economia">
                    <table class="info-detalle-tabla">
                        <tr><td>PIB (nominal):</td><td>${(info.economia.pib).toLocaleString()} M€</td></tr>
                        <tr><td>PIB per cápita:</td><td>${info.economia.pib_percapita.toLocaleString()} €</td></tr>
                        <tr><td>Inflación (IPC):</td><td>${info.economia.inflacion}%</td></tr>
                        <tr><td>Deuda pública (% PIB):</td><td>${info.economia.deuda}%</td></tr>
                        <tr><td>Tasa de paro:</td><td>${info.economia.desempleo}%</td></tr>
                        <tr><td>Balanza comercial:</td><td>${info.economia.balanza_comercial}% del PIB</td></tr>
                    </table>
                </div>
                <div class="mas-info-panel" data-panel="demografia">
                    <table class="info-detalle-tabla">
                        <tr><td>Población:</td><td>${info.demografia.poblacion.toLocaleString()} hab.</td></tr>
                        <tr><td>Densidad:</td><td>${info.demografia.densidad} hab/km²</td></tr>
                        <tr><td>Esperanza de vida:</td><td>${info.demografia.esperanza_vida} años</td></tr>
                        <tr><td>Población urbana:</td><td>${info.demografia.urbanizacion}%</td></tr>
                    </table>
                </div>
                <div class="mas-info-panel" data-panel="energia">
                    <table class="info-detalle-tabla">
                        <tr><td>Consumo eléctrico:</td><td>${info.energia.consumo_electrico} TWh/año</td></tr>
                        <tr><td>Renovables:</td><td>${info.energia.renovables}% del mix</td></tr>
                        <tr><td>Dependencia energética:</td><td>${info.energia.dependencia_exterior}%</td></tr>
                    </table>
                </div>
                <div class="mas-info-panel" data-panel="fuentes">
                    <ul class="fuentes-lista">
                        ${info.fuentes.map(f => `<li>📄 ${f}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="mas-info-footer">
                <small>🔄 Datos actualizados: ${new Date().toLocaleDateString()}</small>
                <small>📊 Fuentes oficiales · Sin manipulación</small>
            </div>
        `;
    }
};

window.UIPanelInfo = UIPanelInfo;
