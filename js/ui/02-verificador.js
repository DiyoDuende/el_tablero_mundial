const UIVerificador = {
    init: function() {
        document.getElementById('btn-verificar')?.addEventListener('click', () => this.verificar());
        document.getElementById('verificador-pregunta')?.addEventListener('keypress', e => { if (e.key === 'Enter') this.verificar(); });
        document.getElementById('btn-verificador-panel')?.addEventListener('click', () => this.toggle());
        document.getElementById('btn-cerrar-verificador')?.addEventListener('click', () => this.ocultar());
    },
    verificar: function() {
        const pregunta = document.getElementById('verificador-pregunta').value.trim();
        if (!pregunta) return;
        const res = Verificador.verificar(pregunta);
        const html = Verificador.generarHTML(res);
        document.getElementById('verificador-respuesta').innerHTML = html;
    },
    toggle: function() {
        const panel = document.getElementById('verificador-panel');
        if (panel.style.display === 'none') panel.style.display = 'block';
        else panel.style.display = 'none';
    },
    ocultar: function() {
        document.getElementById('verificador-panel').style.display = 'none';
    }
};
window.UIVerificador = UIVerificador;
