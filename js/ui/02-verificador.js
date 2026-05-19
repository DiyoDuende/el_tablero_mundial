// js/ui/02-verificador.js
const UIVerificador = {
  init: function() {
    const btnVerificar = document.getElementById('btn-verificar');
    const preguntaInput = document.getElementById('verificador-pregunta');
    
    if (btnVerificar) {
      btnVerificar.addEventListener('click', () => this.verificar());
    } else {
      console.warn('No se encontró el botón #btn-verificar');
    }
    
    if (preguntaInput) {
      preguntaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.verificar();
      });
    } else {
      console.warn('No se encontró el input #verificador-pregunta');
    }
  },

  verificar: function() {
    const preguntaInput = document.getElementById('verificador-pregunta');
    if (!preguntaInput) return;
    
    const pregunta = preguntaInput.value.trim();
    if (!pregunta) return;

    // Aquí puedes llamar a tu verificador (por ejemplo, Verificador.verificar)
    // Por ahora, una respuesta de ejemplo
    const resultadoDiv = document.getElementById('verificador-respuesta');
    if (resultadoDiv) {
      resultadoDiv.innerHTML = `<div class="verificacion-resultado">
        <p>🔍 Verificando: "${pregunta}"</p>
        <p>✅ No se han encontrado datos contradictorios.</p>
        <p><small>Fuente: Base de conocimiento local</small></p>
      </div>`;
    }
  }
};

window.UIVerificador = UIVerificador;
