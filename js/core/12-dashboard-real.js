// js/core/12-dashboard-real.js
// ============================================
// DASHBOARD REAL - Gestor de datos de países
// ============================================

const DashboardReal = {
    paisActual: null,
    datosCache: {},
    
    mostrar: function(iso3) {
        console.log(`📊 DashboardReal.mostrar(${iso3})`);
        this.paisActual = iso3;
        
        // Si existe UIPanelInfo, usarlo
        if (typeof UIPanelInfo !== 'undefined' && UIPanelInfo.mostrarPais) {
            UIPanelInfo.mostrarPais(iso3);
        } else {
            console.warn('⚠️ UIPanelInfo no disponible');
        }
    },
    
    obtenerDatos: async function(iso3) {
        if (this.datosCache[iso3]) {
            return this.datosCache[iso3];
        }
        
        // Datos simulados por defecto
        const datosDefault = {
            pib: { valor: 1400000, anio: 2024 },
            pib_per_capita: { valor: 30000, anio: 2024 },
            inflacion: { valor: 3.5, anio: 2024 },
            desempleo: { valor: 6.2, anio: 2024 },
            deuda: { valor: 60, anio: 2024 },
            poblacion: { valor: 47000000, anio: 2024 },
            esperanza_vida: { valor: 82, anio: 2024 }
        };
        
        this.datosCache[iso3] = datosDefault;
        return datosDefault;
    }
};

window.DashboardReal = DashboardReal;
console.log('✅ DashboardReal cargado');
