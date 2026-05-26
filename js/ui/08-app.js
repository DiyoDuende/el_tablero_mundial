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
    // PANELES: ABRIR/CERRAR CON CLASE .active
    // =============================================
    const botonesPaneles = {
        'btn-verificador-panel': 'verificador-panel',
        'btn-relaciones-globales': 'relaciones-globales-panel',
        'btn-timeline-panel': 'timeline-panel'
    };
    for (const [btnId, panelId] of Object.entries(botonesPaneles)) {
        const btn = document.getElementById(btnId);
        const panel = document.getElementById(panelId);
        if (btn && panel) {
            btn.addEventListener('click', () => {
                panel.classList.toggle('active');
            });
        }
    }

    // Simulador (modo juego) - además del botón superior, se controla aquí
    const btnSimulador = document.getElementById('btn-modo-juego');
    const simuladorPanel = document.getElementById('simulador-panel');
    if (btnSimulador && simuladorPanel) {
        btnSimulador.addEventListener('click', () => {
            simuladorPanel.classList.toggle('active');
        });
    }

    // Botones de cerrar dentro de cada panel
    document.querySelectorAll('.btn-cerrar').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.verificador-container, .simulador-container, .relaciones-globales-container, .timeline-global-container');
            if (panel) panel.classList.remove('active');
        });
    });

    // Modo REAL / JUEGO (cambia el badge y el estado global)
    const btnReal = document.getElementById('btn-modo-real');
    const btnJuego = document.getElementById('btn-modo-juego');
    const badge = document.getElementById('modo-badge');
    if (btnReal && btnJuego && badge) {
        btnReal.addEventListener('click', () => {
            window.CONFIG.modo = 'realidad';
            btnReal.classList.add('active');
            btnJuego.classList.remove('active');
            badge.textContent = '🌐 MODO REAL';
            if (simuladorPanel) simuladorPanel.classList.remove('active');
        });
        btnJuego.addEventListener('click', () => {
            window.CONFIG.modo = 'juego';
            btnJuego.classList.add('active');
            btnReal.classList.remove('active');
            badge.textContent = '🎮 MODO JUEGO';
            if (simuladorPanel) simuladorPanel.classList.add('active');
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
