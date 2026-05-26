// ============================================
// 03-simulador.js
// ============================================

const UISimulador = {

    init: function () {

        console.log(
            '⚡ Inicializando simulador...'
        );

        const btn =
            document.getElementById(
                'btn-simular'
            );

        const input =
            document.getElementById(
                'simulador-pregunta'
            );

        if (btn) {

            btn.addEventListener(
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
            window.CONFIG.modo !==
            'juego'
        ) {

            alert(
                'Activa el modo JUEGO'
            );

            return;
        }

        const texto =
            document
                .getElementById(
                    'simulador-pregunta'
                )
                .value
                .trim();

        if (!texto) return;

        const resultado =
            MotorSimulacion.simular({

                poder: 0.6,
                sector: 0.5,
                mecanismo: 0.7
            });

        document.getElementById(
            'simulador-resultados'
        ).innerHTML = `

            <h4>
                📊 RESULTADOS
            </h4>

            <p>
                Impacto económico:
                ${resultado.impacto.economico}%
            </p>

            <p>
                Impacto geopolítico:
                ${resultado.impacto.geopolitico}%
            </p>

            <p>
                Impacto social:
                ${resultado.impacto.social}%
            </p>
        `;
    }
};

window.UISimulador =
    UISimulador;
