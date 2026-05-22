// ============================================
// 🌍 TABLERO MUNDIAL
// 03-simulador.js
// UI SIMULADOR COMPLETA Y CORREGIDA
// ============================================

const UISimulador = {

    init: function () {

        console.log('⚡ Inicializando simulador...');

        this.cacheDOM();

        this.bindEvents();

        console.log('✅ Simulador listo');
    },

    // =====================================================
    // CACHE DOM
    // =====================================================

    cacheDOM: function () {

        this.panel =
            document.getElementById(
                'simulador-panel'
            );

        this.input =
            document.getElementById(
                'simulador-pregunta'
            );

        this.boton =
            document.getElementById(
                'btn-simular'
            );

        this.resultados =
            document.getElementById(
                'simulador-resultados'
            );
    },

    // =====================================================
    // EVENTS
    // =====================================================

    bindEvents: function () {

        if (this.boton) {

            this.boton.addEventListener(
                'click',
                () => {
                    this.simular();
                }
            );
        }

        if (this.input) {

            this.input.addEventListener(
                'keydown',
                (e) => {

                    if (e.key === 'Enter') {
                        this.simular();
                    }
                }
            );
        }
    },

    // =====================================================
    // SIMULACIÓN
    // =====================================================

    simular: async function () {

        try {

            // =========================================
            // VALIDAR MODO
            // =========================================

            if (
                !window.CONFIG ||
                window.CONFIG.modo !== 'juego'
            ) {

                this.mostrarError(
                    '⚠️ Debes activar el modo 🎮 ¿QUÉ PASARÍA SI?'
                );

                return;
            }

            // =========================================
            // VALIDAR INPUT
            // =========================================

            const pregunta =
                this.input.value.trim();

            if (!pregunta) {

                this.mostrarError(
                    '⚠️ Escribe un escenario'
                );

                return;
            }

            // =========================================
            // LOADING
            // =========================================

            this.resultados.innerHTML = `
                <p class="placeholder">
                    ⏳ Simulando escenario...
                </p>
            `;

            console.log(
                '🎲 Ejecutando simulación:',
                pregunta
            );

            // =========================================
            // MOTOR
            // =========================================

            let resultado = null;

            if (
                window.MotorSimulacion &&
                typeof MotorSimulacion.simular === 'function'
            ) {

                resultado =
                    await MotorSimulacion.simular(
                        pregunta
                    );
            }

            // =========================================
            // FALLBACK
            // =========================================

            if (!resultado) {

                resultado = {
                    resumen:
                        'El escenario generaría impacto económico y geopolítico moderado.',
                    riesgo: 62,
                    impacto: [
                        '📈 Subida de inflación',
                        '⚡ Tensión energética',
                        '🌍 Cambios diplomáticos'
                    ]
                };
            }

            // =========================================
            // RENDER
            // =========================================

            this.renderResultado(resultado);

        } catch (error) {

            console.error(
                '❌ Error simulando:',
                error
            );

            this.mostrarError(
                '❌ Error ejecutando simulación'
            );
        }
    },

    // =====================================================
    // RENDER RESULTADO
    // =====================================================

    renderResultado: function (resultado) {

        const impactoHtml =
            (resultado.impacto || [])
            .map(item => `<li>${item}</li>`)
            .join('');

        this.resultados.innerHTML = `
            <div class="sim-resultado">

                <h3>
                    🎲 Resultado de simulación
                </h3>

                <p style="margin-top:15px;">
                    ${resultado.resumen || ''}
                </p>

                <div style="margin-top:20px;">

                    <strong>
                        ⚠️ Riesgo global:
                    </strong>

                    ${resultado.riesgo || 0}%

                </div>

                <div style="margin-top:20px;">

                    <strong>
                        🌍 Impactos:
                    </strong>

                    <ul style="margin-top:10px; padding-left:20px;">
                        ${impactoHtml}
                    </ul>

                </div>

            </div>
        `;
    },

    // =====================================================
    // ERROR
    // =====================================================

    mostrarError: function (mensaje) {

        this.resultados.innerHTML = `
            <div class="alerta-item alerta-roja">
                ${mensaje}
            </div>
        `;
    }
};

window.UISimulador = UISimulador;
