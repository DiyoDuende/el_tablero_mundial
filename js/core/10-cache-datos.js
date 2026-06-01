// js/core/10-cache-datos.js
// ============================================
// CACHÉ DE DATOS - Versión corregida v4.1
// ============================================

const CacheDatos = {
    // Duración de la caché en milisegundos (24 horas)
    DURACION: 24 * 60 * 60 * 1000,
    
    // Guardar datos en localStorage
    guardar: function(iso3, datos) {
        try {
            const item = {
                datos: datos,
                timestamp: Date.now(),
                expira: Date.now() + this.DURACION
            };
            localStorage.setItem(`bm_${iso3}`, JSON.stringify(item));
            console.log(`💾 Caché guardado: ${iso3}`);
            return true;
        } catch(e) {
            console.error(`❌ Error guardando caché para ${iso3}:`, e);
            return false;
        }
    },
    
    // Obtener datos de localStorage
    obtener: function(iso3) {
        try {
            const itemRaw = localStorage.getItem(`bm_${iso3}`);
            if (!itemRaw) return null;
            
            const item = JSON.parse(itemRaw);
            if (Date.now() > item.expira) {
                localStorage.removeItem(`bm_${iso3}`);
                return null;
            }
            
            return item.datos;
        } catch(e) {
            console.error(`❌ Error leyendo caché para ${iso3}:`, e);
            return null;
        }
    },
    
    // Obtener datos (con caché o API)
    async obtenerDatos(iso3) {
        // Intentar caché primero
        const cache = this.obtener(iso3);
        if (cache) {
            console.log(`📦 Usando caché para ${iso3}`);
            return cache;
        }
        
        // Si no hay caché, consultar API
        console.log(`🌐 Consultando API para ${iso3}...`);
        try {
            if (typeof APIBancoMundial !== 'undefined' && APIBancoMundial.getTodosIndicadores) {
                const datos = await APIBancoMundial.getTodosIndicadores(iso3);
                if (datos && datos.pib && datos.pib.valor) {
                    this.guardar(iso3, datos);
                }
                return datos;
            } else {
                console.warn('⚠️ APIBancoMundial no disponible');
                return null;
            }
        } catch(e) {
            console.error(`❌ Error obteniendo datos para ${iso3}:`, e);
            return null;
        }
    },
    
    // Limpiar toda la caché
    limpiar: function() {
        const keys = Object.keys(localStorage);
        let eliminados = 0;
        keys.forEach(key => {
            if (key.startsWith('bm_')) {
                localStorage.removeItem(key);
                eliminados++;
            }
        });
        console.log(`🧹 Caché limpiada: ${eliminados} entradas eliminadas`);
    },
    
    // Obtener estadísticas de caché
    getEstadisticas: function() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('bm_'));
        let activos = 0;
        keys.forEach(key => {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                if (Date.now() < item.expira) activos++;
            } catch(e) {}
        });
        return {
            total: keys.length,
            activos: activos,
            expirados: keys.length - activos
        };
    }
};

window.CacheDatos = CacheDatos;
