// js/ui/08-app.js
import CONFIG from '../core/00-config.js'; // Ajusta la ruta si es necesario

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Tablero Mundial...');

    // 1. Inicializar idioma
    if (window.Idioma && window.Idioma.init) await Idioma.init();

    // 2. Inicializar componentes principales (que ya existen)
    if (window.MapaMundial && window.MapaMundial.init) MapaMundial.init();
    if (window.UIPanelInfo && window.UIPanelInfo.init) UIPanelInfo.init();
    if (window.UIVerificador && window.UIVerificador.init) UIVerificador.init();

    // 3. Inicializar módulos nuevos
    if (window.UIRelacionesGlobales && window.UIRelacionesGlobales.init) UIRelacionesGlobales.init();
    if (window.UITimeline && window.UITimeline.init) UITimeline.init();

    // 4. Configurar modo de juego (Realidad / Juego)
    const btnReal = document.getElementById('btn-modo-real');
    const btnJuego = document.getElementById('btn-modo-juego');
    const badge = document.getElementById('modo-badge');

    if (btnReal && btnJuego && badge) {
        btnReal.addEventListener('click', () => {
            CONFIG.modo = 'realidad';
            btnReal.classList.add('active');
            btnJuego.classList.remove('active');
            badge.textContent = '🌐 MODO REAL';
        });
        btnJuego.addEventListener('click', () => {
            CONFIG.modo = 'juego';
            btnJuego.classList.add('active');
            btnReal.classList.remove('active');
            badge.textContent = '🎮 MODO JUEGO';
        });
    }

    // Mostrar información de España por defecto
    if (window.UIPanelInfo && window.UIPanelInfo.mostrarPais) {
        UIPanelInfo.mostrarPais('españa');
    }

    console.log('✅ Tablero Mundial listo');
});
