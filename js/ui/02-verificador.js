// js/ui/02-verificador.js
// ============================================
// INTERFAZ DEL VERIFICADOR CIUDADANO
// ============================================

const UIVerificador = {
    init: function() {
        console.log('✅ Verificador ciudadano inicializado');
        
        const btnVerificar = document.getElementById('btn-verificar');
        const inputPregunta = document.getElementById('verificador-pregunta');
        const btnCerrar = document.getElementById('btn-cerrar-verificador');
        const btnPanel = document.getElementById('btn-verificador-panel');
        const panel = document.getElementById('verificador-panel');
        
        if (btnVerificar && inputPregunta) {
            btnVerificar.addEventListener('click', () => this.verificar());
            inputPregunta.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.verificar();
            });
        }
        
        if (btnCerrar && panel) {
            btnCerrar.addEventListener('click', () => {
                panel.classList.remove('active');
                panel.style.display = 'none';
            });
        }
        
        if (btnPanel && panel) {
            btnPanel.addEventListener('click', () => {
                panel.classList.add('active');
                panel.style.display = 'block';
            });
        }
    },
    
    verificar: async function() {
        const input = document.getElementById('verificador-pregunta');
        const resultadoDiv = document.getElementById('verificador-respuesta');
        
        if (!input || !resultadoDiv) return;
        
        const pregunta = input.value.trim();
        if (!pregunta) return;
        
        // Mostrar loading
        resultadoDiv.innerHTML = '<div class="verificacion-loading">🔍 Verificando...</div>';
        
        // Llamar al verificador (ahora async)
        const resultado = await Verificador.verificar(pregunta);
        const html = Verificador.generarHTML(resultado);
        
        resultadoDiv.innerHTML = html;
    }
};

window.UIVerificador = UIVerificador;
