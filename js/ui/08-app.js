// ============================================
// APP PRINCIPAL - Inicialización de todos los módulos
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Tablero Mundial v3.0 iniciando...');
    
    // Inicializar mapa primero
    MapaMundial.init();
    
    // Inicializar idioma
    await Idioma.init();
    
    // Inicializar componentes UI
    UIPanelInfo.init();
    UIVerificador.init();
    UISimulador.init();
    UIDomino.init();
    UIRelaciones.init();
    UIRelacionesGlobales.init();
    UITimeline.init();
    
    // Mostrar España por defecto
    UIPanelInfo.mostrarPais('españa');
    
    // Configurar modos
    document.getElementById('btn-modo-real').addEventListener('click', () => {
        CONFIG.modo = 'realidad';
        document.getElementById('btn-modo-real').classList.add('active');
        document.getElementById('btn-modo-juego').classList.remove('active');
        document.getElementById('modo-badge').innerHTML = '🌐 MODO REAL';
        document.getElementById('modo-badge').style.background = '#2e7d32';
    });
    
    document.getElementById('btn-modo-juego').addEventListener('click', () => {
        CONFIG.modo = 'juego';
        document.getElementById('btn-modo-juego').classList.add('active');
        document.getElementById('btn-modo-real').classList.remove('active');
        document.getElementById('modo-badge').innerHTML = '🎮 MODO JUEGO';
        document.getElementById('modo-badge').style.background = '#b27c2c';
    });
    
    // Buscador rápido
    document.getElementById('buscador-rapido').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const busqueda = e.target.value.trim();
            if (busqueda) {
                const resultados = TERRITORIOS.buscar(busqueda);
                if (resultados.length > 0) {
                    MapaMundial.irAPais(resultados[0].id);
                }
            }
        }
    });
    
    console.log('✅ Tablero Mundial listo');
});
