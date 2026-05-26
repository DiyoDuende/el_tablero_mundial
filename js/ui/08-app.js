// js/ui/08-app.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando Tablero Mundial');

    // Inicializar módulos
    if (window.MapaMundial) MapaMundial.init();
    if (window.UIPanelInfo) UIPanelInfo.init();
    if (window.UIVerificador) UIVerificador.init();
    if (window.UISimulador) UISimulador.init();

    // ============================================
    // 1. BOTONES DE PANELES (Verificador, Red Global, Timeline, Simulador)
    // ============================================
    const botonesPaneles = {
        'btn-verificador-panel': 'verificador-panel',
        'btn-relaciones-globales': 'relaciones-globales-panel',
        'btn-timeline-panel': 'timeline-panel',
        'btn-modo-juego': 'simulador-panel'
    };

    for (const [idBoton, idPanel] of Object.entries(botonesPaneles)) {
        const boton = document.getElementById(idBoton);
        const panel = document.getElementById(idPanel);
        if (boton && panel) {
            boton.addEventListener('click', () => {
                panel.classList.toggle('active');
                console.log(`Toggle panel: ${idPanel} -> active: ${panel.classList.contains('active')}`);
            });
        } else {
            console.warn(`No se encontró el botón ${idBoton} o el panel ${idPanel}`);
        }
    }

    // Botones de cierre dentro de los paneles (clase .btn-cerrar)
    document.querySelectorAll('.btn-cerrar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const panel = e.target.closest('.verificador-container, .simulador-container, .relaciones-globales-container, .timeline-global-container');
            if (panel) {
                panel.classList.remove('active');
                console.log(`Cerrar panel: ${panel.id}`);
            }
        });
    });

    // ============================================
    // 2. BOTONES DE MODO REAL / JUEGO
    // ============================================
    const btnReal = document.getElementById('btn-modo-real');
    const btnJuego = document.getElementById('btn-modo-juego');
    const badge = document.getElementById('modo-badge');
    if (btnReal && btnJuego && badge) {
        btnReal.addEventListener('click', () => {
            window.CONFIG.modo = 'realidad';
            btnReal.classList.add('active');
            btnJuego.classList.remove('active');
            badge.textContent = '🌐 MODO REAL';
            console.log('Modo REAL activado');
        });
        btnJuego.addEventListener('click', () => {
            window.CONFIG.modo = 'juego';
            btnJuego.classList.add('active');
            btnReal.classList.remove('active');
            badge.textContent = '🎮 MODO JUEGO';
            console.log('Modo JUEGO activado');
        });
    } else {
        console.warn('Botones de modo no encontrados');
    }

    // ============================================
    // 3. BUSCADOR RÁPIDO
    // ============================================
    const buscador = document.getElementById('buscador-rapido');
    if (buscador && MapaMundial.buscarLugar) {
        buscador.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                MapaMundial.buscarLugar(buscador.value.trim());
            }
        });
    }

    // ============================================
    // 4. CAPAS (iconos)
    // ============================================
    document.addEventListener('click', (e) => {
        const capaBtn = e.target.closest('.capa-icon');
        if (capaBtn) {
            capaBtn.classList.toggle('activo');
            const capa = capaBtn.dataset.capa;
            const activa = capaBtn.classList.contains('activo');
            if (MapaMundial.activarCapa) {
                MapaMundial.activarCapa(capa, activa);
                console.log(`Capa ${capa} activada: ${activa}`);
            }
        }
    });

    // Mostrar España por defecto
    if (window.UIPanelInfo) UIPanelInfo.mostrarPais('espana');

    console.log('✅ Tablero Mundial listo');
});
