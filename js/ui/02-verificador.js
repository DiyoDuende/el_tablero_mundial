
// ============================================
// VERIFICADOR CIUDADANO (UI)
// ============================================

const UIVerificador = {
    
    visible: true,
    
    init: function() {
        document.getElementById('btn-verificar').addEventListener('click', () => {
            this.verificar();
        });
        
        document.getElementById('verificador-pregunta').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.verificar();
        });
        
        document.getElementById('btn-cerrar-verificador').addEventListener('click', () => {
            this.toggle();
        });
        
        document.getElementById('btn-verificador-panel').addEventListener('click', () => {
            this.mostrar();
        });
    },
    
    verificar: function() {
        const pregunta = document.getElementById('verificador-pregunta').value.trim();
        if (!pregunta) return;
        
        const resultado = Verificador.verificar(pregunta);
        const html = Verificador.generarHTML(resultado);
        
        // Buscar también cadena de impacto
        const cadenas = VisorCadena.buscar(pregunta);
        let cadenaHtml = '';
        
        if (cadenas.length > 0) {
            cadenaHtml = VisorCadena.generarHTML(cadenas[0].id);
        }
        
        document.getElementById('verificador-respuesta').innerHTML = html + cadenaHtml;
    },
    
    toggle: function() {
        const panel = document.getElementById('verificador-panel');
        this.visible = !this.visible;
        panel.style.display = this.visible ? 'block' : 'none';
    },
    
    mostrar: function() {
        const panel = document.getElementById('verificador-panel');
        this.visible = true;
        panel.style.display = 'block';
    }
};

window.UIVerificador = UIVerificador;
