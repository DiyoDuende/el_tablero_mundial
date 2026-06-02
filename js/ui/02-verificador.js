// ============================================
// 02-verificador.js
// ============================================

const UIVerificador = {

    init: function () {

        const btn =
            document.getElementById(
                'btn-verificar'
            );

        const input =
            document.getElementById(
                'verificador-pregunta'
            );

        if (btn) {

            btn.addEventListener(
                'click',
                () => this.verificar()
            );
        }

        if (input) {

            input.addEventListener(
                'keydown',
                (e) => {

                    if (e.key === 'Enter') {

                        this.verificar();
                    }
                }
            );
        }
    },

    verificar: function () {

        const pregunta =
            document
                .getElementById(
                    'verificador-pregunta'
                )
                .value
                .trim();

        if (!pregunta) return;

        const resultado =
            Verificador.verificar(
                pregunta
            );

        document.getElementById(
            'verificador-respuesta'
        ).innerHTML =
            Verificador.generarHTML(
                resultado
            );
    }
};

window.UIVerificador =
    UIVerificador;
