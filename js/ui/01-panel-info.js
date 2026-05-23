// ============================================
// UI PANEL INFO
// ============================================

const UIPanelInfo = {

    paisActual: 'espana',

    init: function () {

        console.log('✅ UIPanelInfo iniciado');

        this.vincularBotones();
    },

    vincularBotones: function () {

        const botones =
            document.querySelectorAll('.info-btn');

        console.log(`🔘 Botones encontrados: ${botones.length}`);

        botones.forEach(btn => {

            btn.removeEventListener(
                'click',
                this.clickHandler
            );

            btn.addEventListener(
                'click',
                this.clickHandler.bind(this)
            );
        });
    },

    clickHandler: function (e) {

        const seccion =
            e.currentTarget.dataset.seccion;

        console.log(`🖱️ Click en botón: ${seccion}`);

        this.mostrarSeccion(seccion);
    },

    mostrarPais: function (paisId) {

        console.log(`📍 Mostrar país: ${paisId}`);

        this.paisActual = paisId;

        const territorio =
            window.TERRITORIOS?.[paisId];

        if (!territorio) {

            console.warn(
                `⚠️ No existe TERRITORIOS.${paisId}`
            );

            return;
        }

        const poblacion =
            territorio.poblacion
                ? territorio.poblacion.toLocaleString()
                : '—';

        const capital =
            territorio.capital || '—';

        // ============================================
        // IMPORTANTE:
        // usar panel-info REAL del HTML
        // ============================================

        const container =
            document.getElementById('panel-info');

        if (!container) {

            console.error(
                '❌ No existe #panel-info'
            );

            return;
        }

        container.innerHTML = `
            <div class="dashboard-pais">

                <div class="info-header">

                    <h3>
                        🌍 ${territorio.nombre}
                    </h3>

                    <span class="pais-estado">
                        🟢 ESTABLE
                    </span>

                </div>

                <div class="info-objetivos">

                    🎯 Objetivos: 68%

                </div>

                <div class="info-botones">

                    <button
                        class="info-btn"
                        data-seccion="economia"
                    >
                        📊 Economía
                    </button>

                    <button
                        class="info-btn"
                        data-seccion="leyes"
                    >
                        ⚖️ Leyes
                    </button>

                    <button
                        class="info-btn"
                        data-seccion="geopolitica"
                    >
                        🏛️ Geopolítica
                    </button>

                    <button
                        class="info-btn"
                        data-seccion="social"
                    >
                        👥 Social
                    </button>

                    <button
                        class="info-btn"
                        data-seccion="clima"
                    >
                        🌍 Clima
                    </button>

                </div>

                <div class="info-datos-basicos">

                    <p>
                        <strong>Población:</strong>
                        ${poblacion}
                    </p>

                    <p>
                        <strong>Capital:</strong>
                        ${capital}
                    </p>

                </div>

                <div class="info-alertas">

                    <h4>⚠️ Alertas</h4>

                    <div class="alerta-item alerta-roja">
                        🔴 Seguridad energética
                    </div>

                    <div class="alerta-item alerta-amarilla">
                        🟡 Desempleo alto
                    </div>

                </div>

            </div>
        `;

        // IMPORTANTE:
        // reactivar eventos

        this.vincularBotones();
    },

    mostrarSeccion: function (seccion) {

        console.log(
            `📄 Mostrar sección: ${seccion}`
        );

        const container =
            document.getElementById('panel-info');

        if (!container) return;

        const nombre =
            this.paisActual.toUpperCase();

        let contenido = '';

        switch (seccion) {

            case 'economia':

                contenido = `
                    <div class="panel-seccion">

                        <h3>
                            📊 Economía de ${nombre}
                        </h3>

                        <p>PIB: +2.3%</p>

                        <p>Inflación: 2.1%</p>

                        <p>Deuda/PIB: 98%</p>

                        <p>Desempleo: 11.2%</p>

                        <button
                            class="info-btn volver-btn"
                            id="btn-volver"
                        >
                            ◀ Volver
                        </button>

                    </div>
                `;

                break;

            case 'leyes':

                contenido = `
                    <div class="panel-seccion">

                        <h3>
                            ⚖️ Leyes de ${nombre}
                        </h3>

                        <p>
                            Reforma laboral activa
                        </p>

                        <p>
                            Legislación climática en revisión
                        </p>

                        <button
                            class="info-btn volver-btn"
                            id="btn-volver"
                        >
                            ◀ Volver
                        </button>

                    </div>
                `;

                break;

            default:

                contenido = `
                    <div class="panel-seccion">

                        <h3>
                            🚧 ${seccion}
                        </h3>

                        <p>
                            Sección en construcción
                        </p>

                        <button
                            class="info-btn volver-btn"
                            id="btn-volver"
                        >
                            ◀ Volver
                        </button>

                    </div>
                `;
        }

        container.innerHTML = contenido;

        // ============================================
        // BOTÓN VOLVER
        // ============================================

        const btnVolver =
            document.getElementById('btn-volver');

        if (btnVolver) {

            btnVolver.addEventListener(
                'click',
                () => {

                    this.mostrarPais(
                        this.paisActual
                    );
                }
            );
        }
    }
};

window.UIPanelInfo = UIPanelInfo;
```0
