// ============================================
// 🌍 TABLERO MUNDIAL
// 01-panel-info.js
// PANEL DE INFORMACIÓN
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

        console.log(
            `🔘 Botones encontrados: ${botones.length}`
        );

        botones.forEach(btn => {

            btn.onclick = (e) => {

                const seccion =
                    e.currentTarget.dataset.seccion;

                console.log(
                    `🖱️ Click en botón: ${seccion}`
                );

                this.mostrarSeccion(seccion);
            };
        });
    },

    mostrarPais: function (paisId) {

        console.log(`📍 Mostrar país: ${paisId}`);

        this.paisActual = paisId;

        const territorio =
            window.TERRITORIOS?.[paisId];

        const nombre =
            territorio?.nombre || paisId;

        const poblacion =
            territorio?.poblacion
                ? territorio.poblacion.toLocaleString()
                : '—';

        const capital =
            territorio?.capital || '—';

        const panel =
            document.getElementById('panel-info');

        if (!panel) {

            console.warn(
                '⚠️ No existe #panel-info'
            );

            return;
        }

        panel.innerHTML = `
            <div class="info-header">

                <h3 id="pais-nombre">
                    🌍 ${nombre}
                </h3>

                <span class="pais-estado">
                    🟢 ESTABLE
                </span>

            </div>

            <div class="info-objetivos">
                <span>🎯 Objetivos:</span>
                <span>68%</span>
            </div>

            <div class="info-datos-basicos">

                <p>
                    <strong>Capital:</strong>
                    ${capital}
                </p>

                <p>
                    <strong>Población:</strong>
                    ${poblacion}
                </p>

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

            <div class="info-alertas">

                <h4>⚠️ Alertas</h4>

                <div class="alerta-item alerta-roja">
                    🔴 Seguridad energética
                </div>

                <div class="alerta-item alerta-amarilla">
                    🟡 Desempleo alto
                </div>

            </div>
        `;

        this.vincularBotones();
    },

    mostrarSeccion: function (seccion) {

        console.log(
            `📄 Mostrar sección: ${seccion}`
        );

        const panel =
            document.getElementById('panel-info');

        if (!panel) return;

        let contenido = '';

        switch (seccion) {

            case 'economia':

                contenido = `
                    <div class="panel-seccion">

                        <h3>
                            📊 Economía · ${this.paisActual}
                        </h3>

                        <p>PIB: +2.3%</p>
                        <p>Inflación: 2.1%</p>
                        <p>Deuda: 98%</p>
                        <p>Desempleo: 11.2%</p>

                        <button
                            class="btn-volver-panel"
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
                            ⚖️ Leyes · ${this.paisActual}
                        </h3>

                        <p>
                            Reformas activas:
                            4
                        </p>

                        <button
                            class="btn-volver-panel"
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
                            class="btn-volver-panel"
                        >
                            ◀ Volver
                        </button>

                    </div>
                `;
        }

        panel.innerHTML = contenido;

        const btnVolver =
            panel.querySelector('.btn-volver-panel');

        if (btnVolver) {

            btnVolver.onclick = () => {

                this.mostrarPais(this.paisActual);
            };
        }
    }
};

window.UIPanelInfo = UIPanelInfo;
