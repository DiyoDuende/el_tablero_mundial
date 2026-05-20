// js/ui/08-app.js
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Tablero Mundial...');

    if (window.Idioma && window.Idioma.init) await Idioma.init();

    // Inicializar componentes (el mapa se inicia solo en 00-mapa.js)
    if (window.UIPanelInfo && window.UIPanelInfo.init) UIPanelInfo.init();
    if (window.UIVerificador && window.UIVerificador.init) UIVerificador.init();
    if (window.UISimulador && window.UISimulador.init) UISimulador.init();
    if (window.UIRelacionesGlobales && window.UIRelacionesGlobales.init) UIRelacionesGlobales.init();
    if (window.UITimeline && window.UITimeline.init) UITimeline.init();

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

    if (window.UIPanelInfo && window.UIPanelInfo.mostrarPais) UIPanelInfo.mostrarPais('españa');
    console.log('✅ Tablero Mundial listo');
});
