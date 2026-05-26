// js/ui/02-verificador.js
const UIVerificador = {
    init: function() {
        const btnVerificar = document.getElementById('btn-verificar');
        const preguntaInput = document.getElementById('verificador-pregunta');
        if (btnVerificar) btnVerificar.addEventListener('click', () => this.verificar());
        if (preguntaInput) preguntaInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.verificar(); });
    },

    verificar: function() {
        const pregunta = document.getElementById('verificador-pregunta').value.trim();
        if (!pregunta) return;
        const resultado = Verificador.verificar(pregunta);
        const html = Verificador.generarHTML(resultado);
        document.getElementById('verificador-respuesta').innerHTML = html;
    }
};

window.UIVerificador = UIVerificador;
