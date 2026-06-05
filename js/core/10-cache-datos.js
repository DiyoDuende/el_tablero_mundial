// js/core/10-cache-datos.js
var CacheDatos = {
    guardar: function(iso3, datos) {
        var item = {
            datos: datos,
            timestamp: Date.now(),
            expira: Date.now() + (24 * 60 * 60 * 1000)
        };
        localStorage.setItem('bm_' + iso3, JSON.stringify(item));
    },
    
    obtener: function(iso3) {
        var item = localStorage.getItem('bm_' + iso3);
        if (!item) return null;
        var datos = JSON.parse(item);
        if (Date.now() > datos.expira) {
            localStorage.removeItem('bm_' + iso3);
            return null;
        }
        return datos.datos;
    },
    
    async obtenerDatos(iso3) {
        var cache = this.obtener(iso3);
        if (cache) return cache;
        
        var datos = await window.APIBancoMundial.getTodosIndicadores(iso3);
        if (datos && datos.pib && datos.pib.valor) {
            this.guardar(iso3, datos);
        }
        return datos;
    },
    
    limpiar: function() {
        var claves = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key && key.startsWith('bm_')) {
                claves.push(key);
            }
        }
        claves.forEach(function(k) {
            localStorage.removeItem(k);
        });
        console.log('🗑️ Caché del Banco Mundial limpiada');
    }
};

window.CacheDatos = CacheDatos;
