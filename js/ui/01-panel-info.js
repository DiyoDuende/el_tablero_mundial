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

                this.mostrarSeccion(seccion);
            };
        });
    },

    mostrarPais: function (paisId) {

        this.paisActual = paisId;

        const panel =
            document.getElementById('panel-info');

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
                    data-seccion="social"
                >
                    👥 Social
                </button>

            </div>
        `;

        this.vincularBotones();
    },

    mostrarSeccion: function (seccion) {

        const panel =
            document.getElementById('panel-info');

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
                    class="info-btn"
                    id="btn-volver"
                >
                    ◀ Volver
                </button>

            </div>
        `;

        const btn =
            document.getElementById('btn-volver');

        if (btn) {

            btn.onclick = () => {

                this.mostrarPais(
                    this.paisActual
                );
            };
        }
    }
};

window.UIPanelInfo = UIPanelInfo;
