// js/ui/01-panel-info.js
const UIPanelInfo = {
    paisActual: 'españa',

    init: function() {
        console.log('✅ UIPanelInfo iniciado');
        this.vincularBotones();
    },

    vincularBotones: function() {
        const botones = document.querySelectorAll('.info-btn');
        console.log(`🔘 Botones encontrados: ${botones.length}`);
        botones.forEach(btn => {
            btn.removeEventListener('click', this.clickHandler);
            btn.addEventListener('click', this.clickHandler.bind(this));
        });
    },

    clickHandler: function(e) {
        const seccion = e.currentTarget.dataset.seccion;
        console.log(`🖱️ Click en botón: ${seccion}`);
        this.mostrarSeccion(seccion);
    },

    mostrarPais: function(paisId) {
        console.log(`📍 Mostrar país: ${paisId}`);
        this.paisActual = paisId;
        const territorio = TERRITORIOS[paisId];
        if (!territorio) return;

        const poblacion = territorio.poblacion ? territorio.poblacion.toLocaleString() : '—';
        const capital = territorio.capital || '—';

        const container = document.getElementById('dashboard-container');
        if (!container) return;

        container.innerHTML = `
            <div class="dashboard-pais">
                <div class="info-header">
                    <h3>🇪🇸 ${territorio.nombre}</h3>
                    <span class="pais-estado">🟢 ESTABLE</span>
                </div>
                <div class="info-objetivos">🎯 Objetivos: 68%</div>
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

        // Re-vincular porque el innerHTML ha destruido los botones anteriores
        this.vincularBotones();
    },

    mostrarSeccion: function(seccion) {
        console.log(`📄 Mostrar sección: ${seccion} para ${this.paisActual}`);
        const container = document.getElementById('dashboard-container');
        if (!container) return;

        const nombre = this.paisActual.toUpperCase();
        let contenido = '';

        switch(seccion) {
            case 'economia':
                contenido = `
                    <h4>📊 Datos económicos de ${nombre}</h4>
                    <p>PIB: +2.3%</p>
                    <p>Inflación: 2.1%</p>
                    <p>Deuda/PIB: 98%</p>
                    <p>Desempleo: 11.2%</p>
                    <button id="btnVolverEconomia">◀ Volver</button>
                `;
                break;
            default:
                contenido = `<p>Sección ${seccion} en construcción</p><button id="btnVolverDefault">◀ Volver</button>`;
        }

        container.innerHTML = contenido;

        // Botón volver (con evento único)
        const btnVolver = document.querySelector('#btnVolverEconomia, #btnVolverDefault');
        if (btnVolver) {
            btnVolver.addEventListener('click', () => {
                this.mostrarPais(this.paisActual);
            });
        }
    }
};

window.UIPanelInfo = UIPanelInfo;
