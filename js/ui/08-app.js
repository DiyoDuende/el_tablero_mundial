// js/ui/08-app.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Tablero Mundial');

    // Inicializar componentes (sin idioma por ahora para simplificar)
    if (window.MapaMundial) MapaMundial.init();
    if (window.UIPanelInfo) UIPanelInfo.init();
    if (window.UIVerificador) UIVerificador.init();
    if (window.UISimulador) UISimulador.init();

    // =========================================
    // PANELES: ASIGNACIÓN DIRECTA DE EVENTOS
    // =========================================
    const btnVerificador = document.getElementById('btn-verificador-panel');
    const panelVerificador = document.getElementById('verificador-panel');
    if (btnVerificador && panelVerificador) {
        btnVerificador.addEventListener('click', function() {
            panelVerificador.classList.toggle('active');
            console.log('Verificador toggled');
        });
    }

    const btnRelaciones = document.getElementById('btn-relaciones-globales');
    const panelRelaciones = document.getElementById('relaciones-globales-panel');
    if (btnRelaciones && panelRelaciones) {
        btnRelaciones.addEventListener('click', function() {
            panelRelaciones.classList.toggle('active');
            console.log('Relaciones toggled');
        });
    }

    const btnTimeline = document.getElementById('btn-timeline-panel');
    const panelTimeline = document.getElementById('timeline-panel');
    if (btnTimeline && panelTimeline) {
        btnTimeline.addEventListener('click', function() {
            panelTimeline.classList.toggle('active');
            console.log('Timeline toggled');
        });
    }

    const btnSimulador = document.getElementById('btn-modo-juego');
    const panelSimulador = document.getElementById('simulador-panel');
    if (btnSimulador && panelSimulador) {
        btnSimulador.addEventListener('click', function() {
            panelSimulador.classList.toggle('active');
            console.log('Simulador toggled');
        });
    }

    // Modo REAL / JUEGO (solo cambio de badge)
    const btnReal = document.getElementById('btn-modo-real');
    const btnJuego = document.getElementById('btn-modo-juego');
    const badge = document.getElementById('modo-badge');
    if (btnReal && btnJuego && badge) {
        btnReal.addEventListener('click', function() {
            window.CONFIG.modo = 'realidad';
            btnReal.classList.add('active');
            btnJuego.classList.remove('active');
            badge.textContent = '🌐 MODO REAL';
        });
        btnJuego.addEventListener('click', function() {
            window.CONFIG.modo = 'juego';
            btnJuego.classList.add('active');
            btnReal.classList.remove('active');
            badge.textContent = '🎮 MODO JUEGO';
        });
    }

    // Buscador rápido
    const buscador = document.getElementById('buscador-rapido');
    if (buscador && MapaMundial.buscarLugar) {
        buscador.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                MapaMundial.buscarLugar(buscador.value.trim());
            }
        });
    }

    // Capas (iconos)
    document.addEventListener('click', function(e) {
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
