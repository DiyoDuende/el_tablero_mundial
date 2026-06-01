// js/ui/00-mapa.js
// ============================================
// MAPA MUNDIAL - Inicialización y control
// ============================================

let mapaGlobal = null;
let capaPaisesGlobal = null;

const MapaGlobal = {
    config: {
        centro: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 10
    },
    
    init: function() {
        // Protección: comprobar que Leaflet está cargado
        if (typeof L === 'undefined') {
            console.error('❌ Leaflet no está cargado');
            return;
        }
        
        if (mapaGlobal) return;
        
        mapaGlobal = L.map('mapa-mundial').setView(this.config.centro, this.config.zoom);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
            subdomains: 'abcd',
            maxZoom: 19,
            minZoom: 1
        }).addTo(mapaGlobal);
        
        this.cargarGeoJSON();
        console.log('🗺️ Mapa inicializado');
    },
    
    cargarGeoJSON: function() {
        const geoJSONurl = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
        
        fetch(geoJSONurl)
            .then(response => response.json())
            .then(data => {
                capaPaisesGlobal = L.geoJSON(data, {
                    style: {
                        color: '#4fc3f7',
                        weight: 1,
                        fillColor: '#1a3a4a',
                        fillOpacity: 0.6
                    },
                    onEachFeature: this.onEachFeature.bind(this)
                }).addTo(mapaGlobal);
                
                window.capaPaisesGlobal = capaPaisesGlobal;
                
                console.log('✅ GeoJSON de países cargado');
                console.log('📊 Total de países en el mapa:', capaPaisesGlobal.getLayers().length);
                
                setTimeout(() => {
                    if (window.Coloreado) {
                        window.Coloreado.aplicarColoresPIB();
                    }
                }, 2000);
                
                window.dispatchEvent(new CustomEvent('mapa-listos'));
            })
            .catch(error => {
                console.error('❌ Error cargando GeoJSON:', error);
            });
    },
    
    onEachFeature: function(feature, layer) {
        const nombre = feature.properties?.name || feature.properties?.ADMIN || 'Desconocido';
        
        layer.bindTooltip(nombre, { sticky: true });
        
        layer.on('click', () => {
            const iso3 = feature.properties?.['ISO3166-1-Alpha-3'];
            if (iso3 && window.DashboardReal) {
                window.DashboardReal.mostrar(iso3);
            } else {
                console.log(`ℹ️ No hay datos para: ${nombre}`);
            }
        });
    },
    
    centrarEn: function(lat, lon, zoom = 6) {
        if (mapaGlobal) {
            mapaGlobal.setView([lat, lon], zoom);
        }
    },
    
    getMapa: function() {
        return mapaGlobal;
    }
};

// ============================================
// BUSCADOR GLOBAL
// ============================================

const BuscadorGlobal = {
    init: function() {
        const input = document.getElementById('buscador-global');
        const btn = document.getElementById('btn-buscar');
        
        if (!input) {
            console.log('⚠️ Buscador no encontrado');
            return;
        }
        
        const buscar = () => {
            const texto = input.value.trim();
            if (!texto) return;
            
            console.log('🔍 Buscando:', texto);
            
            // Buscar por código ISO3 directo
            if (texto.length === 3 && /^[A-Za-z]{3}$/.test(texto)) {
                const iso3 = texto.toUpperCase();
                if (window.APIBancoMundial && window.APIBancoMundial.isSoportado(iso3)) {
                    if (window.DashboardReal) window.DashboardReal.mostrar(iso3);
                    return;
                }
            }
            
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
            
            alert(`❌ No se encontró "${texto}"`);
        };
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscar();
        });
        
        if (btn) {
            btn.addEventListener('click', buscar);
        }
        
        console.log('🔍 Buscador global inicializado');
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    MapaGlobal.init();
    BuscadorGlobal.init();
});

// Exportar para uso global
window.MapaGlobal = MapaGlobal;
window.BuscadorGlobal = BuscadorGlobal;
