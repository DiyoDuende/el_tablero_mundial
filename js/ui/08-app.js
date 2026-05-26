// js/ui/08-app.js
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Tablero Mundial');

    window.CONFIG = window.CONFIG || {};
    if (!window.CONFIG.modo) window.CONFIG.modo = 'realidad';

    // Inicializar componentes
    if (window.MapaMundial) MapaMundial.init();
    if (window.UIPanelInfo) UIPanelInfo.init();
    if (window.UIVerificador) UIVerificador.init();
    if (window.UISimulador) UISimulador.init();
    if (window.UIRelacionesGlobales && UIRelacionesGlobales.init) UIRelacionesGlobales.init();
    if (window.UITimeline && UITimeline.init) UITimeline.init();

    // =============================================
    // ABRIR/CERRAR PANELES (solo con clase .active)
    // =============================================
    const paneles = {
        'btn-verificador-panel': 'verificador-panel',
        'btn-relaciones-globales': 'relaciones-globales-panel',
        'btn-timeline-panel': 'timeline-panel',
        'btn-modo-juego': 'simulador-panel'   // el botón "¿QUÉ PASARÍA SI?" abre el simulador
    };
    for (const [btnId, panelId] of Object.entries(paneles)) {
        const btn = document.getElementById(btnId);
        const panel = document.getElementById(panelId);
        if (btn && panel) {
            btn.addEventListener('click', () => {
                panel.classList.toggle('active');
            });
        }
    }

    // Botones de cerrar dentro de los paneles
    document.querySelectorAll('.btn-cerrar').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.verificador-container, .simulador-container, .relaciones-globales-container, .timeline-global-container');
            if (panel) panel.classList.remove('active');
        });
    });

    // Modo REAL / JUEGO (cambia el badge)
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

    // Buscador rápido
    const buscador = document.getElementById('buscador-rapido');
    if (buscador && MapaMundial.buscarLugar) {
        buscador.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                MapaMundial.buscarLugar(buscador.value.trim());
            }
        });
    }

    // Capas (iconos)
    document.addEventListener('click', (e) => {
        const capaBtn = e.target.closest('.capa-icon');
        if (capaBtn) {
            capaBtn.classList.toggle('activo');
            const capa = capaBtn.dataset.capa;
            const activa = capaBtn.classList.contains('activo');
            if (MapaMundial.activarCapa) MapaMundial.activarCapa(capa, activa);
        }
    });

    // Mostrar España por defecto
    if (window.UIPanelInfo) UIPanelInfo.mostrarPais('espana');

    console.log('✅ Tablero Mundial listo');
});
