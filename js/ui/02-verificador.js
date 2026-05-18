// js/ui/02-verificador.js - Verificador ciudadano (versión segura)
const UIVerificador = {
  visible: true,
  init: function() {
    // Verificar que los elementos existen antes de añadir eventos
    const btnVerificar = document.getElementById('btn-verificar');
    const preguntaInput = document.getElementById('verificador-pregunta');
    const btnCerrar = document.getElementById('btn-cerrar-verificador');
    const btnPanel = document.getElementById('btn-verificador-panel');
    
    if (btnVerificar) btnVerificar.addEventListener('click', () => this.verificar());
    if (preguntaInput) preguntaInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.verificar(); });
    if (btnCerrar) btnCerrar.addEventListener('click', () => this.toggle());
    if (btnPanel) btnPanel.addEventListener('click', () => this.mostrar());
  },
  verificar: function() {
    const pregunta = document.getElementById('verificador-pregunta')?.value.trim();
    if (!pregunta) return;
    const resultado = Verificador.verificar(pregunta);
    const html = Verificador.generarHTML(resultado);
    const cadenas = VisorCadena.buscar(pregunta);
    let cadenaHtml = '';
    if (cadenas.length > 0) cadenaHtml = VisorCadena.generarHTML(cadenas[0].id);
    const respuestaDiv = document.getElementById('verificador-respuesta');
    if (respuestaDiv) respuestaDiv.innerHTML = html + cadenaHtml;
  },
  toggle: function() {
    const panel = document.getElementById('verificador-panel');
    if (panel) {
      this.visible = !this.visible;
      panel.style.display = this.visible ? 'block' : 'none';
    }
  },
  mostrar: function() {
    const panel = document.getElementById('verificador-panel');
    if (panel) {
      this.visible = true;
      panel.style.display = 'block';
    }
  }
};

window.UIVerificador = UIVerificador;
