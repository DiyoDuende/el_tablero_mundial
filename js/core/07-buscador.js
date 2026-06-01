// js/core/07-buscador.js
// ============================================
// BUSCADOR GLOBAL - Búsqueda de lugares
// ============================================

const BuscadorGlobal = {
    init: function() {
        console.log('🔍 Buscador global iniciado');
        
        const input = document.getElementById('buscador-global');
        const btn = document.getElementById('btn-buscar');
        
        if (!input) return;
        
        const buscar = () => {
            const texto = input.value.trim();
            if (!texto) return;
            
            console.log('🔍 Buscando:', texto);
            
            // Buscar en el mapa por nombre
            if (window.capaPaisesGlobal) {
                for (let layer of window.capaPaisesGlobal.getLayers()) {
                    const nombre = layer.feature?.properties?.name || '';
                    if (nombre.toLowerCase() === texto.toLowerCase() ||
                        nombre.toLowerCase().includes(texto.toLowerCase())) {
                        const iso3 = layer.feature?.properties?.['ISO3166-1-Alpha-3'];
                        if (iso3 && window.DashboardReal) {
                            window.DashboardReal.mostrar(iso3);
                            return;
                        }
                    }
                }
            }
            
            // Buscar por código ISO3
            if (texto.length === 3 && /^[A-Za-z]{3}$/.test(texto)) {
                const iso3 = texto.toUpperCase();
                if (window.APIBancoMundial && window.APIBancoMundial.isSoportado(iso3)) {
                    if (window.DashboardReal) window.DashboardReal.mostrar(iso3);
                    return;
                }
            }
            
            alert(`❌ No se encontró "${texto}"`);
        };
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscar();
        });
        
        if (btn) btn.addEventListener('click', buscar);
    }
};

window.BuscadorGlobal = BuscadorGlobal;
