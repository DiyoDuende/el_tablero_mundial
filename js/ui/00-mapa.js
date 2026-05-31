// js/ui/00-mapa.js
// ============================================
// MAPA MUNDIAL - Usando ISO3166-1-Alpha-3 del GeoJSON
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
                        console.log('🎨 Iniciando coloreado automático...');
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
        // Obtener nombre del país
        const nombre = feature.properties?.name || 
                      feature.properties?.ADMIN || 
                      'Desconocido';
        
        // Tooltip con nombre
        layer.bindTooltip(nombre, { sticky: true });
        
        // Click: pasar el feature completo (contiene ISO3)
        layer.on('click', () => {
            this.onPaisClick(feature);
        });
    },
    
    onPaisClick: function(feature) {
        const nombre = feature.properties?.name || 
                      feature.properties?.ADMIN || 
                      'Desconocido';
        
        const iso3 = feature.properties?.['ISO3166-1-Alpha-3'] || null;
        
        console.log(`🔍 Clic en país: ${nombre} (ISO3: ${iso3})`);
        
        // Validar ISO3
        if (iso3 && iso3 !== '-99' && iso3.length === 3) {
            if (window.APIBancoMundial && window.APIBancoMundial.isSoportado(iso3)) {
                if (window.DashboardReal) {
                    window.DashboardReal.mostrar(iso3);
                    return;
                }
            }
        }
        
        // Si no hay datos, mostrar mensaje amigable
        console.log(`ℹ️ No hay datos económicos para ${nombre} (${iso3})`);
        const container = document.getElementById('dashboard-container');
        if (container) {
            container.innerHTML = `
                <div class="dashboard-error">
                    <div class="error-icono">🌍</div>
                    <h3>${nombre}</h3>
                    <p>No tenemos datos económicos disponibles para este país.</p>
                    <p>Los datos del Banco Mundial están disponibles para la mayoría de los países.</p>
                </div>
            `;
        }
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
        const input = document.getElementById('buscador-rapido');
        const btn = document.getElementById('btn-buscar');
        
        if (!input) {
            console.log('⚠️ Buscador no encontrado (id="buscador-rapido")');
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
                    if (window.DashboardReal) {
                        window.DashboardReal.mostrar(iso3);
                        return;
                    }
                }
            }
            
            // Buscar en el mapa por nombre
            if (window.capaPaisesGlobal) {
                for (let layer of window.capaPaisesGlobal.getLayers()) {
                    const nombre = layer.feature?.properties?.name || '';
                    if (nombre.toLowerCase() === texto.toLowerCase()) {
                        // Simular clic en el país
                        layer.fireEvent('click');
                        return;
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
