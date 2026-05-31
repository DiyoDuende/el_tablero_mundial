// js/core/10-cache-datos.js
// ============================================
// CACHÉ DE DATOS - Almacenamiento local
// ============================================

const CacheDatos = {
    guardar: function(iso3, datos) {
        const item = {
            datos: datos,
            timestamp: Date.now(),
            expira: Date.now() + (24 * 60 * 60 * 1000)
        };
        localStorage.setItem(`bm_${iso3}`, JSON.stringify(item));
    },
    
    obtener: function(iso3) {
        const item = localStorage.getItem(`bm_${iso3}`);
        if (!item) return null;
        const datos = JSON.parse(item);
        if (Date.now() > datos.expira) {
            localStorage.removeItem(`bm_${iso3}`);
            return null;
        }
        return datos.datos;
    },
    
    async obtenerDatos(iso3) {
        const cache = this.obtener(iso3);
        if (cache) return cache;
        
        const datos = await APIBancoMundial.getTodosIndicadores(iso3);
        if (datos && datos.pib && datos.pib.valor) {
            this.guardar(iso3, datos);
        }
        return datos;
    },
    
    limpiar: function() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('bm_')) localStorage.removeItem(key);
        });
    }
};

window.CacheDatos = CacheDatos;
