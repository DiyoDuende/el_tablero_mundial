// ============================================
// 🌍 TABLERO MUNDIAL
// 08-app.js
// APP PRINCIPAL CORREGIDA - V4 ESTABLE
// ============================================

document.addEventListener('DOMContentLoaded', async () => {

    console.log('🚀 Iniciando Tablero Mundial...');

    window.CONFIG = window.CONFIG || {};
    if (!window.CONFIG.modo) window.CONFIG.modo = 'realidad';

    // =========================================
    // 1. INICIALIZAR COMPONENTES
    // =========================================

    if (window.MapaMundial) MapaMundial.init();

    [   window.UIPanelInfo,
        window.UIVerificador,
        window.UISimulador,
        window.UIRelacionesGlobales,
        window.UITimeline
    ].forEach(modulo => {
        if (modulo && typeof modulo.init === 'function') modulo.init();
    });

    // =========================================
    // 2. BOTONES DE MODO REAL / JUEGO
    // =========================================

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

    // =========================================
    // 3. APERTURA/CIERRE DE PANELES (solo con .active)
    // =========================================

    const paneles = [
        { btnId: 'btn-verificador-panel', panelId: 'verificador-panel' },
        { btnId: 'btn-relaciones-globales', panelId: 'relaciones-globales-panel' },
        { btnId: 'btn-timeline-panel', panelId: 'timeline-panel' }
    ];

    paneles.forEach(({ btnId, panelId }) => {
        const btn = document.getElementById(btnId);
        const panel = document.getElementById(panelId);
        if (btn && panel) {
            btn.addEventListener('click', () => {
                panel.classList.toggle('active');
            });
        }
    });

    // Botones de cierre dentro de cada panel (clase .btn-cerrar)
    document.querySelectorAll('.btn-cerrar').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.verificador-container, .simulador-container, .relaciones-globales-container, .timeline-global-container');
            if (panel) panel.classList.remove('active');
        });
    });

    // =========================================
    // 4. BUSCADOR RÁPIDO (Nominatim)
    // =========================================

    const buscador = document.getElementById('buscador-rapido');
    if (buscador && MapaMundial.buscarLugar) {
        buscador.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                MapaMundial.buscarLugar(buscador.value.trim());
            }
        });
    }

    // =========================================
    // 5. CAPAS (iconos)
    // =========================================

    document.addEventListener('click', (e) => {
        const capaBtn = e.target.closest('.capa-icon');
        if (capaBtn) {
            capaBtn.classList.toggle('activo');
            const capa = capaBtn.dataset.capa;
            const activa = capaBtn.classList.contains('activo');
            if (MapaMundial.activarCapa) MapaMundial.activarCapa(capa, activa);
        }
    });

    // =========================================
    // 6. MOSTRAR ESPAÑA POR DEFECTO
    // =========================================

    if (window.UIPanelInfo) UIPanelInfo.mostrarPais('espana');

    console.log('✅ Tablero Mundial listo');
});
