// js/ui/08-app.js (Reemplaza el contenido con esto)
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Tablero Mundial v4.0 iniciando...');
    await Idioma.init();
    
    // MapaMundial.init(); // <--- ELIMINA ESTA LÍNEA para evitar el error "Map container is already initialized"
    UIPanelInfo.init();
    UIVerificador.init();
    UISimulador.init();
    UIDomino.init();
    UIRelaciones.init();
    UIRelacionesGlobales.init();
    UITimeline.init();
    
    UIPanelInfo.mostrarPais('españa');
    
    document.getElementById('btn-modo-real').addEventListener('click', () => {
        CONFIG.modo = 'realidad';
        document.getElementById('btn-modo-real').classList.add('active');
        document.getElementById('btn-modo-juego').classList.remove('active');
    });
    document.getElementById('btn-modo-juego').addEventListener('click', () => {
        CONFIG.modo = 'juego';
        document.getElementById('btn-modo-juego').classList.add('active');
        document.getElementById('btn-modo-real').classList.remove('active');
    });
    
    document.getElementById('buscador-global').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const busqueda = e.target.value.trim();
            if (busqueda) {
                const resultados = TERRITORIOS.buscar(busqueda);
                if (resultados.length > 0 && typeof MapaMundial.irAPais === 'function') {
                    MapaMundial.irAPais(resultados[0].id);
                }
            }
        }
    });
    
    console.log('✅ Tablero Mundial listo');
});
