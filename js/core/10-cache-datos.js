// js/core/10-cache-datos.js
// ============================================
// CACHÉ DE DATOS - Almacenamiento local
// ============================================

const CacheDatos = {
    // Guardar datos en localStorage
    guardar: function(iso3, datos) {
        const item = {
            datos: datos,
            timestamp: Date.now(),
            expira: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        };
        localStorage.setItem(`bm_${iso3}`, JSON.stringify(item));
        console.log(`💾 Datos de ${iso3} guardados en caché`);
    },
    
    // Recuperar datos del caché
    obtener: function(iso3) {
        const item = localStorage.getItem(`bm_${iso3}`);
        if (!item) return null;
        
        const datos = JSON.parse(item);
        
        // Comprobar si ha expirado
        if (Date.now() > datos.expira) {
            localStorage.removeItem(`bm_${iso3}`);
            console.log(`⏰ Caché de ${iso3} expirado`);
            return null;
        }
        
        console.log(`📦 Datos de ${iso3} recuperados de caché (${Math.round((Date.now() - datos.timestamp) / 1000 / 60)} min)`);
        return datos.datos;
    },
    
    // Obtener datos (con caché o API)
    async obtenerDatos(iso3, forzarActualizacion = false) {
        if (!forzarActualizacion) {
            const cache = this.obtener(iso3);
            if (cache) return cache;
        }
        
        // Si no hay caché, llamar a la API
        const datos = await APIBancoMundial.getTodosIndicadores(iso3);
        if (datos && datos.pib) {
            this.guardar(iso3, datos);
        }
        return datos;
    },
    
    // Limpiar toda la caché
    limpiar: function() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('bm_')) {
                localStorage.removeItem(key);
            }
        });
        console.log('🗑️ Caché del Banco Mundial limpiada');
    },
    
    // Obtener estado de la caché
    estado: function() {
        const items = [];
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('bm_')) {
                const item = JSON.parse(localStorage.getItem(key));
                items.push({
                    pais: key.replace('bm_', ''),
                    actualizado: new Date(item.timestamp).toLocaleString(),
                    expira: new Date(item.expira).toLocaleString()
                });
            }
        });
        return items;
    }
};

window.CacheDatos = CacheDatos;
