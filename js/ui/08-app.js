// Inicialización principal
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Tablero Mundial...');

    // Idioma
    if (window.Idioma && typeof Idioma.init === 'function') await Idioma.init();

    // Inicializar componentes UI (el mapa se inicia solo en 00-mapa.js)
    if (window.UIPanelInfo && typeof UIPanelInfo.init === 'function') UIPanelInfo.init();
    if (window.UIVerificador && typeof UIVerificador.init === 'function') UIVerificador.init();
    if (window.UISimulador && typeof UISimulador.init === 'function') UISimulador.init();
    if (window.UIRelacionesGlobales && typeof UIRelacionesGlobales.init === 'function') UIRelacionesGlobales.init();
    if (window.UITimeline && typeof UITimeline.init === 'function') UITimeline.init();

    // Botones de modo
    const btnReal = document.getElementById('btn-modo-real');
    const btnJuego = document.getElementById('btn-modo-juego');
    const badge = document.getElementById('modo-badge');
    if (btnReal && btnJuego && badge) {
        btnReal.addEventListener('click', () => {
            window.CONFIG.modo = 'realidad';
            btnReal.classList.add('active');
            btnJuego.classList.remove('active');
            badge.textContent = '🌐 MODO REAL';
        });
        btnJuego.addEventListener('click', () => {
            window.CONFIG.modo = 'juego';
            btnJuego.classList.add('active');
            btnReal.classList.remove('active');
            badge.textContent = '🎮 MODO JUEGO';
        });
    }

    // Mostrar España
    if (window.UIPanelInfo && typeof UIPanelInfo.mostrarPais === 'function') {
        UIPanelInfo.mostrarPais('españa');
    }

    console.log('✅ Tablero Mundial listo');
});
