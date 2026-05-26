// js/ui/08-app.js
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Tablero Mundial');

    if (window.Idioma) await Idioma.init();
    if (window.MapaMundial) MapaMundial.init();
    if (window.UIPanelInfo) UIPanelInfo.init();
    if (window.UIVerificador) UIVerificador.init();
    if (window.UISimulador) UISimulador.init();
    if (window.UIRelacionesGlobales && UIRelacionesGlobales.init) UIRelacionesGlobales.init();
    if (window.UITimeline && UITimeline.init) UITimeline.init();

    // =============================================
    // PANELES: ABRIR/CERRAR CON CLASE .active
    // =============================================
    const panels = {
        'btn-verificador-panel': 'verificador-panel',
        'btn-simulador-panel': 'simulador-panel',
        'btn-relaciones-globales': 'relaciones-globales-panel',
        'btn-timeline-panel': 'timeline-panel'
    };

    for (const [btnId, panelId] of Object.entries(panels)) {
        const btn = document.getElementById(btnId);
        const panel = document.getElementById(panelId);
        if (btn && panel) {
            btn.addEventListener('click', () => {
                panel.classList.toggle('active');
            });
        }
    }

    // Botones de cerrar dentro de paneles (si existen)
    const closeButtons = [
        'btn-cerrar-verificador',
        'btn-cerrar-simulador',
        'btn-cerrar-relaciones-globales',
        'btn-cerrar-timeline'
    ];
    closeButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                const panel = btn.closest('.verificador-container, .simulador-container, .relaciones-globales-container, .timeline-global-container');
                if (panel) panel.classList.remove('active');
            });
        }
    });

    // =============================================
    // MODO REAL / JUEGO
    // =============================================
    const btnReal = document.getElementById('btn-modo-real');
    const btnJuego = document.getElementById('btn-modo-juego');
    const badge = document.getElementById('modo-badge');
    const simuladorPanel = document.getElementById('simulador-panel');
    if (btnReal && btnJuego && badge && simuladorPanel) {
        btnReal.addEventListener('click', () => {
            window.CONFIG.modo = 'realidad';
            btnReal.classList.add('active');
            btnJuego.classList.remove('active');
            badge.textContent = '🌐 MODO REAL';
            simuladorPanel.classList.remove('active');
        });
        btnJuego.addEventListener('click', () => {
            window.CONFIG.modo = 'juego';
            btnJuego.classList.add('active');
            btnReal.classList.remove('active');
            badge.textContent = '🎮 MODO JUEGO';
            simuladorPanel.classList.add('active');
        });
    }

    // =============================================
    // BUSCADOR RÁPIDO
    // =============================================
    const buscador = document.getElementById('buscador-rapido');
    if (buscador && MapaMundial.buscarLugar) {
        buscador.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                MapaMundial.buscarLugar(buscador.value.trim());
            }
        });
    }

    // =============================================
    // DELEGACIÓN DE EVENTOS GLOBAL
    // =============================================
    document.addEventListener('click', (e) => {
        // Capas
        const capaBtn = e.target.closest('.capa-icon');
        if (capaBtn) {
            capaBtn.classList.toggle('activo');
            const capa = capaBtn.dataset.capa;
            const activa = capaBtn.classList.contains('activo');
            if (MapaMundial.activarCapa) MapaMundial.activarCapa(capa, activa);
            return;
        }
        // Botones de información (Economía, Leyes, etc.)
        const infoBtn = e.target.closest('.info-btn');
        if (infoBtn && UIPanelInfo) {
            e.preventDefault();
            const seccion = infoBtn.dataset.seccion;
            if (seccion) UIPanelInfo.mostrarSeccion(seccion);
            return;
        }
        // Botón Volver
        const volverBtn = e.target.closest('.btn-volver');
        if (volverBtn && UIPanelInfo) {
            UIPanelInfo.mostrarPais(UIPanelInfo.paisActual);
        }
    });

    // Mostrar España por defecto (sin tilde)
    if (UIPanelInfo) UIPanelInfo.mostrarPais('espana');

    console.log('✅ Inicialización completa');
});
