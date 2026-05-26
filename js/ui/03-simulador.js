// ============================================
// 🌍 TABLERO MUNDIAL
// 03-simulador.js
// ============================================

const UISimulador = {

    init: function () {

        console.log(
            '⚡ Inicializando simulador...'
        );

        const btnSimular =
            document.getElementById(
                'btn-simular'
            );

        const input =
            document.getElementById(
                'simulador-pregunta'
            );

        if (btnSimular) {

            btnSimular.addEventListener(
                'click',
                () => this.simular()
            );
        }

        if (input) {

            input.addEventListener(
                'keydown',
                (e) => {

                    if (e.key === 'Enter') {

                        this.simular();
                    }
                }
            );
        }

        console.log(
            '✅ Simulador listo'
        );
    },

    simular: function () {

        if (
            !window.CONFIG ||
            window.CONFIG.modo !== 'juego'
        ) {

            alert(
                '⚠️ Activa primero el modo JUEGO'
            );

            return;
        }

        const input =
            document.getElementById(
                'simulador-pregunta'
            );

        const resultados =
            document.getElementById(
                'simulador-resultados'
            );

        if (!input || !resultados)
            return;

        const texto =
            input.value.trim();

        if (!texto) {

            resultados.innerHTML = `
                <p>
                    ⚠️ Escribe un escenario
                </p>
            `;

            return;
        }

        // SIMULACIÓN BÁSICA

        const resultado =
            window.MotorSimulacion
            ?.simular({

                poder: 0.7,
                sector: 0.6,
                mecanismo: 0.5

            });

        if (!resultado) {

            resultados.innerHTML = `
                <p>
                    ❌ Error simulando
                </p>
            `;

            return;
        }

        resultados.innerHTML = `
            <div class="sim-result">

                <h3>
                    📊 Resultado
                </h3>

                <p>
                    <strong>
                        Escenario:
                    </strong>
                    ${texto}
                </p>

                <hr>

                <p>
                    💰 Impacto económico:
                    <strong>
                        ${resultado.impacto.económico}%
                    </strong>
                </p>

                <p>
                    🌍 Impacto geopolítico:
                    <strong>
                        ${resultado.impacto.geopolítico}%
                    </strong>
                </p>

                <p>
                    👥 Impacto social:
                    <strong>
                        ${resultado.impacto.social}%
                    </strong>
                </p>

            </div>
        `;
    }
};

window.UISimulador = UISimulador;
