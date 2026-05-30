// js/ui/08-app.js
// ============================================
// APP PRINCIPAL - Inicialización de todo el sistema
// ============================================

console.log('🚀 Iniciando Tablero Mundial');

// Inicializar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializar UI existente
    if (typeof UIPanelInfo !== 'undefined') UIPanelInfo.init();
    if (typeof UIVerificador !== 'undefined') UIVerificador.init();
    if (typeof UISimulador !== 'undefined') UISimulador.init();
    if (typeof Idioma !== 'undefined') Idioma.init();
    
    // Mostrar España por defecto cuando el mapa esté listo
    window.addEventListener('mapa-listos', () => {
        setTimeout(() => {
            if (typeof DashboardReal !== 'undefined') {
                DashboardReal.mostrar('ESP');
            } else if (typeof DashboardLugar !== 'undefined') {
                DashboardLugar.mostrar('espana');
            }
        }, 500);
    });
    
    // Configurar botones de modo
    const btnModoReal = document.getElementById('btn-modo-real');
    const btnModoJuego = document.getElementById('btn-modo-juego');
    const badgeModo = document.getElementById('modo-badge');
    
    if (btnModoReal && btnModoJuego && badgeModo) {
        btnModoReal.addEventListener('click', () => {
            if (typeof CONFIG !== 'undefined') CONFIG.modo = 'realidad';
            btnModoReal.classList.add('active');
            btnModoJuego.classList.remove('active');
            badgeModo.innerHTML = '🌐 MODO REAL';
            badgeModo.style.background = '#2e7d32';
        });
        
        btnModoJuego.addEventListener('click', () => {
            if (typeof CONFIG !== 'undefined') CONFIG.modo = 'juego';
            btnModoJuego.classList.add('active');
            btnModoReal.classList.remove('active');
            badgeModo.innerHTML = '🎮 MODO JUEGO';
            badgeModo.style.background = '#b27c2c';
        });
    }
    
    // Buscador rápido del panel lateral
    const buscadorRapido = document.getElementById('buscador-rapido');
    if (buscadorRapido) {
        buscadorRapido.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const texto = e.target.value.trim();
                if (texto && typeof BuscadorGlobal !== 'undefined') {
                    BuscadorGlobal.buscarTexto(texto);
                }
            }
        });
    }
    
    console.log('✅ Tablero Mundial listo');
});

// Exportar para uso global
window.appIniciada = true;
