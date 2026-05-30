// js/ui/10-inicio.js
// ============================================
// INICIALIZACIÓN UNIFICADA - v4.1
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando Tablero Mundial v4.1');
    
    // Verificar que el mapa está listo
    const esperarMapa = setInterval(() => {
        if (window.capaPaisesGlobal) {
            clearInterval(esperarMapa);
            console.log('✅ Mapa listo');
            
            // Aplicar colores
            if (window.Coloreado) {
                window.Coloreado.aplicarColoresPIB();
            }
        }
    }, 500);
    
    // Configurar botones de capa (si existen en tu HTML)
    const btnPIB = document.querySelector('.capa-icon[title="PIB per cápita"]');
    const btnInflacion = document.querySelector('.capa-icon[title="Inflación"]');
    const btnDesempleo = document.querySelector('.capa-icon[title="Desempleo"]');
    const btnReset = document.querySelector('.capa-icon[title="Restablecer"]');
    
    if (btnPIB) btnPIB.onclick = () => window.Coloreado?.aplicarColoresPIB();
    if (btnInflacion) btnInflacion.onclick = () => window.Coloreado?.aplicarColoresInflacion();
    if (btnDesempleo) btnDesempleo.onclick = () => window.Coloreado?.aplicarColoresDesempleo();
    if (btnReset) btnReset.onclick = () => window.Coloreado?.resetearColores();
    
    // Cargar España por defecto
    setTimeout(() => {
        if (window.DashboardReal) {
            window.DashboardReal.mostrar('ESP');
        }
    }, 2000);
});
