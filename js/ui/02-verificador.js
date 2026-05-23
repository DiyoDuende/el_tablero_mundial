// js/ui/02-verificador.js
const UIVerificador = {
    visible: true,
    
    init: function() {
        const btnVerificar = document.getElementById('btn-verificar');
        const inputPregunta = document.getElementById('verificador-pregunta');
        const btnCerrar = document.getElementById('btn-cerrar-verificador');
        const btnPanel = document.getElementById('btn-verificador-panel');
        
        if (btnVerificar) btnVerificar.addEventListener('click', () => this.verificar());
        if (inputPregunta) inputPregunta.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.verificar(); });
        if (btnCerrar) btnCerrar.addEventListener('click', () => this.toggle());
        if (btnPanel) btnPanel.addEventListener('click', () => this.mostrar());
    },
    
    verificar: function() {
        const pregunta = document.getElementById('verificador-pregunta').value.trim();
        if (!pregunta) return;
        
        // Obtener respuesta del verificador
        const resultado = Verificador.verificar(pregunta);
        const htmlRespuesta = Verificador.generarHTML(resultado);
        
        // Buscar cadena de impacto relacionada (si existe)
        let htmlCadena = '';
        if (window.VisorCadena && typeof VisorCadena.buscarYMostrar === 'function') {
            htmlCadena = VisorCadena.buscarYMostrar(pregunta);
        } else {
            htmlCadena = '<div class="cadena-container" style="margin-top:20px;"><p>🔗 No se ha encontrado una cadena de impacto para esta consulta.</p></div>';
        }
        
        const htmlCompleto = `<div class="verificador-contenido-completo">${htmlRespuesta}${htmlCadena}</div>`;
        document.getElementById('verificador-respuesta').innerHTML = htmlCompleto;
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
