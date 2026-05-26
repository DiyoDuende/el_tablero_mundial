// ============================================
// 🌍 TABLERO MUNDIAL
// 01-panel-info.js
// PANEL INFO ESTABLE V4
// ============================================

const UIPanelInfo = {

    paisActual: 'espana',

    init: function () {

        console.log(
            '✅ UIPanelInfo iniciado'
        );

        document.addEventListener(
            'click',
            (e) => {

                const btn =
                    e.target.closest(
                        '.info-btn'
                    );

                if (btn) {

                    const seccion =
                        btn.dataset.seccion;

                    this.mostrarSeccion(
                        seccion
                    );
                }

                const volver =
                    e.target.closest(
                        '#btn-volver'
                    );

                if (volver) {

                    this.mostrarPais(
                        this.paisActual
                    );
                }
            }
        );
    },

    mostrarPais: function (paisId) {

        this.paisActual = paisId;

        const panel =
            document.getElementById(
                'panel-info'
            );

        if (!panel) return;

        panel.innerHTML = `

            <div class="info-header">

                <h3>
                    🌍 ${paisId.toUpperCase()}
                </h3>

                <span class="pais-estado">
                    🟢 ESTABLE
                </span>

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

        `;
    },

    mostrarSeccion: function (seccion) {

        const panel =
            document.getElementById(
                'panel-info'
            );

        if (!panel) return;

        panel.innerHTML = `

            <div class="panel-seccion">

                <h3>
                    ${seccion.toUpperCase()}
                </h3>

                <p>
                    Información de ${seccion}
                </p>

                <button
                    id="btn-volver"
                >
                    ◀ Volver
                </button>

            </div>
        `;
    }
};

window.UIPanelInfo = UIPanelInfo;
