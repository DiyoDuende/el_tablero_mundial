// js/core/07-buscador.js
// ============================================
// BUSCADOR GLOBAL - Versión corregida v4.1
// ============================================

const BuscadorGlobal = {
    init: function() {
        console.log('🔍 Inicializando BuscadorGlobal');
        
        // Buscar por múltiples IDs posibles (por si acaso)
        const input = document.getElementById('buscador-rapido') || 
                      document.getElementById('buscador-global');
        
        if (!input) {
            console.warn('⚠️ Buscador: input no encontrado');
            return;
        }
        
        const buscarHandler = () => {
            const texto = input.value.trim();
            if (texto) this.buscar(texto);
        };
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscarHandler();
        });
        
        const btnBuscar = document.getElementById('btn-buscar');
        if (btnBuscar) {
            btnBuscar.addEventListener('click', buscarHandler);
        }
        
        console.log('✅ BuscadorGlobal inicializado');
    },
    
    buscar: function(texto) {
        if (!texto) return;
        
        console.log(`🔍 Buscando: "${texto}"`);
        
        // 1. Buscar por código ISO3
        const iso3Match = texto.match(/^([A-Z]{3})$/i);
        if (iso3Match) {
            const iso3 = iso3Match[1].toUpperCase();
            if (window.DashboardReal && typeof window.DashboardReal.mostrar === 'function') {
                window.DashboardReal.mostrar(iso3);
                if (window.MapaGlobal && typeof window.MapaGlobal.centrarEnPais === 'function') {
                    window.MapaGlobal.centrarEnPais(iso3);
                }
                return;
            }
        }
        
        // 2. Buscar en el mapa por nombre
        if (window.capaPaisesGlobal) {
            let encontrado = false;
            window.capaPaisesGlobal.eachLayer(layer => {
                const nombrePais = layer.feature?.properties?.ADMIN || 
                                   layer.feature?.properties?.name;
                if (nombrePais && nombrePais.toLowerCase() === texto.toLowerCase()) {
                    layer.fireEvent('click');
                    if (window.MapaGlobal && typeof window.MapaGlobal.centrarEn === 'function') {
                        const latlng = layer.getBounds().getCenter();
                        window.MapaGlobal.centrarEn(latlng.lat, latlng.lng, 5);
                    }
                    encontrado = true;
                }
            });
            if (encontrado) return;
        }
        
        // 3. No encontrado
        this.mostrarNoEncontrado(texto);
    },
    
    mostrarNoEncontrado: function(texto) {
        const notificacion = document.createElement('div');
        notificacion.textContent = `❌ No se encontró "${texto}". Prueba con código ISO3 (ESP, FRA, USA) o nombre del país.`;
        notificacion.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #d32f2f;
            color: white;
            padding: 10px 20px;
            border-radius: 30px;
            z-index: 2000;
            font-size: 14px;
            animation: fadeOut 3s ease forwards;
        `;
        document.body.appendChild(notificacion);
        setTimeout(() => notificacion.remove(), 3000);
    }
};

// Inicialización
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BuscadorGlobal.init());
} else {
    setTimeout(() => BuscadorGlobal.init(), 100);
}

window.BuscadorGlobal = BuscadorGlobal;
