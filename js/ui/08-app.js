document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Tablero Mundial');
    if (window.Idioma) await Idioma.init();
    if (window.MapaMundial) MapaMundial.init();
    if (window.UIPanelInfo) UIPanelInfo.init();
    if (window.UIVerificador) UIVerificador.init();
    if (window.UISimulador) UISimulador.init();
    // resto de inicializaciones (relaciones, timeline) si existen

    // Modo Real/Juego
    const btnReal = document.getElementById('btn-modo-real');
    const btnJuego = document.getElementById('btn-modo-juego');
    const badge = document.getElementById('modo-badge');
    if (btnReal && btnJuego && badge) {
        btnReal.onclick = () => {
            window.CONFIG.modo = 'realidad';
            btnReal.classList.add('active');
            btnJuego.classList.remove('active');
            badge.textContent = '🌐 MODO REAL';
            document.getElementById('simulador-panel').style.display = 'none';
        };
        btnJuego.onclick = () => {
            window.CONFIG.modo = 'juego';
            btnJuego.classList.add('active');
            btnReal.classList.remove('active');
            badge.textContent = '🎮 MODO JUEGO';
            document.getElementById('simulador-panel').style.display = 'block';
        };
    }

    // Cerrar paneles con botones de cierre
    const closeButtons = ['btn-cerrar-verificador', 'btn-cerrar-simulador', 'btn-cerrar-relaciones-globales', 'btn-cerrar-timeline'];
    closeButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => {
            const panel = btn.closest('.verificador-container, .simulador-container, .relaciones-globales-container, .timeline-global-container');
            if (panel) panel.style.display = 'none';
        });
    });

    // Abrir/cerrar paneles desde botones de la barra
    const botones = {
        'btn-verificador-panel': 'verificador-panel',
        'btn-simulador-panel': 'simulador-panel',
        'btn-relaciones-globales': 'relaciones-globales-panel',
        'btn-timeline-panel': 'timeline-panel'
    };
    for (const [btnId, panelId] of Object.entries(botones)) {
        const btn = document.getElementById(btnId);
        const panel = document.getElementById(panelId);
        if (btn && panel) {
            btn.addEventListener('click', () => {
                if (panel.style.display === 'none') panel.style.display = 'block';
                else panel.style.display = 'none';
            });
        }
    }

    // Buscador rápido
    const buscador = document.getElementById('buscador-rapido');
    if (buscador && MapaMundial.buscarLugar) {
        buscador.addEventListener('keypress', e => {
            if (e.key === 'Enter') MapaMundial.buscarLugar(buscador.value.trim());
        });
    }

    // Capas (delegación)
    document.addEventListener('click', e => {
        const capaBtn = e.target.closest('.capa-icon');
        if (!capaBtn) return;
        capaBtn.classList.toggle('activo');
        const capa = capaBtn.dataset.capa;
        const activa = capaBtn.classList.contains('activo');
        if (MapaMundial.activarCapa) MapaMundial.activarCapa(capa, activa);
    });

    console.log('✅ Inicialización completa');
});
