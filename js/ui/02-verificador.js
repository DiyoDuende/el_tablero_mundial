// js/ui/02-verificador.js
// ============================================
// VERIFICADOR CIUDADANO - Versión segura
// ============================================

const UIVerificador = {
    init: function() {
        console.log('✅ Inicializando UIVerificador');
        
        try {
            const btnVerificar = document.getElementById('btn-verificar');
            const inputPregunta = document.getElementById('verificador-pregunta');
            const btnCerrar = document.getElementById('btn-cerrar-verificador');
            const btnPanel = document.getElementById('btn-verificador-panel');
            const panel = document.getElementById('verificador-panel');
            
            // Botón verificar
            if (btnVerificar && inputPregunta) {
                btnVerificar.addEventListener('click', () => this.verificar());
                inputPregunta.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.verificar();
                });
                console.log('✅ Verificador: eventos configurados');
            } else {
                console.warn('⚠️ Verificador: elementos no encontrados');
            }
            
            // Botón cerrar
            if (btnCerrar && panel) {
                btnCerrar.addEventListener('click', () => {
                    panel.style.display = 'none';
                });
            }
            
            // Botón abrir panel
            if (btnPanel && panel) {
                btnPanel.addEventListener('click', () => {
                    panel.style.display = 'block';
                });
            }
            
            console.log('✅ UIVerificador inicializado correctamente');
        } catch(e) {
            console.error('❌ Error en UIVerificador.init():', e.message);
        }
    },
    
    verificar: function() {
        const input = document.getElementById('verificador-pregunta');
        const resultadoDiv = document.getElementById('verificador-resultado');
        
        if (!input || !resultadoDiv) return;
        
        const pregunta = input.value.trim();
        if (!pregunta) return;
        
        // Respuesta genérica (puedes expandir después)
        resultadoDiv.innerHTML = `
            <div class="verificacion-resultado">
                <h4>📋 Verificación ciudadana</h4>
                <p>Tu pregunta: "${pregunta}"</p>
                <p>🔍 Esta función está en desarrollo. Pronto podrás verificar noticias y datos en tiempo real.</p>
                <p class="fuente-datos">📚 Fuente: Sistema de verificación (beta)</p>
            </div>
        `;
    },
    
    toggle: function() {
        const panel = document.getElementById('verificador-panel');
        if (panel) {
            const isVisible = panel.style.display === 'block';
            panel.style.display = isVisible ? 'none' : 'block';
        }
    }
};

window.UIVerificador = UIVerificador;
