document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Tablero Mundial');

    if (window.MapaMundial) MapaMundial.init();
    if (window.UIPanelInfo) UIPanelInfo.init();
    if (window.UIVerificador) UIVerificador.init();
    if (window.UISimulador) UISimulador.init();

    const paneles = {
        'btn-verificador-panel': 'verificador-panel',
        'btn-relaciones-globales': 'relaciones-globales-panel',
        'btn-timeline-panel': 'timeline-panel',
        'btn-modo-juego': 'simulador-panel'
    };
    for (const [btnId, panelId] of Object.entries(paneles)) {
        const btn = document.getElementById(btnId);
        const panel = document.getElementById(panelId);
        if (btn && panel) {
            btn.addEventListener('click', () => {
                panel.classList.toggle('active');
                console.log(`Toggle ${panelId}`);
            });
        }
    }

    document.querySelectorAll('.btn-cerrar').forEach(btn => {
        btn.addEventListener('click', function() {
            const panel = this.closest('.verificador-container, .simulador-container, .relaciones-globales-container, .timeline-global-container');
            if (panel) panel.classList.remove('active');
        });
    });

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

    const buscador = document.getElementById('buscador-rapido');
    if (buscador && MapaMundial.buscarLugar) {
        buscador.addEventListener('keypress', e => {
            if (e.key === 'Enter') MapaMundial.buscarLugar(buscador.value.trim());
        });
    }

    document.addEventListener('click', e => {
        const capa = e.target.closest('.capa-icon');
        if (capa) {
            capa.classList.toggle('activo');
            const capaId = capa.dataset.capa;
            const activa = capa.classList.contains('activo');
            if (MapaMundial.activarCapa) MapaMundial.activarCapa(capaId, activa);
        }
    });

    if (window.UIPanelInfo) UIPanelInfo.mostrarPais('espana');
    console.log('✅ Tablero Mundial listo');
});
