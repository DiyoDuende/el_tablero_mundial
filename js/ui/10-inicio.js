// js/ui/10-inicio.js
// ============================================
// INICIO - Carga inicial de la aplicación
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Tablero Mundial v4.0 iniciado');
    
    // Verificar que todos los componentes están cargados
    const componentes = {
        mapa: typeof MapaGlobal !== 'undefined',
        buscador: typeof BuscadorGlobal !== 'undefined',
        verificador: typeof UIVerificador !== 'undefined',
        simulador: typeof UISimulador !== 'undefined',
        dashboard: typeof DashboardReal !== 'undefined',
        motor: typeof MotorSimulacion !== 'undefined'
    };
    
    console.log('📊 Componentes cargados:', componentes);
    
    // Cargar España por defecto en el dashboard
    if (typeof DashboardReal !== 'undefined' && DashboardReal.mostrar) {
        setTimeout(() => {
            DashboardReal.mostrar('ESP');
        }, 1000);
    }
});
