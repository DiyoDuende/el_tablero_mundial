// js/ui/01-panel-info.js
// ============================================
// PANEL INFO - Versión segura (no rompe nada)
// ============================================

const UIPanelInfo = {
    init: function() {
        console.log('📊 Inicializando UIPanelInfo');
        
        try {
            // Buscar elementos del panel
            const panelInfo = document.getElementById('panel-info');
            if (!panelInfo) {
                console.warn('⚠️ panel-info no encontrado en el DOM');
                return;
            }
            
            // Configurar botones de sección si existen
            const btnEconomia = document.querySelector('.info-btn[data-seccion="economia"]');
            const btnLeyes = document.querySelector('.info-btn[data-seccion="leyes"]');
            const btnGeopolitica = document.querySelector('.info-btn[data-seccion="geopolitica"]');
            
            if (btnEconomia) {
                btnEconomia.addEventListener('click', () => this.mostrarSeccion('economia'));
            }
            if (btnLeyes) {
                btnLeyes.addEventListener('click', () => this.mostrarSeccion('leyes'));
            }
            if (btnGeopolitica) {
                btnGeopolitica.addEventListener('click', () => this.mostrarSeccion('geopolitica'));
            }
            
            console.log('✅ UIPanelInfo inicializado correctamente');
        } catch(e) {
            console.error('❌ Error en UIPanelInfo.init():', e.message);
        }
    },
    
    mostrarPais: function(paisId) {
        console.log('📌 Mostrar país:', paisId);
        // Esta función se puede expandir más adelante
        // Por ahora solo es un placeholder seguro
    },
    
    mostrarSeccion: function(seccion) {
        console.log('📂 Mostrar sección:', seccion);
        // Placeholder para futuras implementaciones
    }
};

// Asegurar que existe en el scope global
if (typeof window.UIPanelInfo === 'undefined') {
    window.UIPanelInfo = UIPanelInfo;
}
