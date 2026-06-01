// js/ui/00-mapa.js
// ============================================
// MAPA MUNDIAL - Versión corregida v4.1
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
        
        console.log('🗺️ Inicializando mapa...');
        
        // Crear mapa
        mapaGlobal = L.map('mapa-mundial').setView(this.config.centro, this.config.zoom);
        
        // Añadir capa base
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
            subdomains: 'abcd',
            maxZoom: 19,
            minZoom: 1
        }).addTo(mapaGlobal);
        
        // Cargar GeoJSON
        this.cargarGeoJSON();
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
                
                // ============================================
                // FIX 3: Actualizar window.capaPaisesGlobal
                // ============================================
                window.capaPaisesGlobal = capaPaisesGlobal;
                
                console.log('✅ GeoJSON de países cargado');
                console.log('📊 Total de países:', capaPaisesGlobal.getLayers().length);
                
                // ============================================
                // FIX 2: Disparar evento 'mapa-listos'
                // ============================================
                window.dispatchEvent(new CustomEvent('mapa-listos'));
                
                // Aplicar coloreado si existe
                setTimeout(() => {
                    if (window.Coloreado && typeof window.Coloreado.aplicarColoresPIB === 'function') {
                        window.Coloreado.aplicarColoresPIB();
                    }
                }, 500);
            })
            .catch(error => {
                console.error('❌ Error cargando GeoJSON:', error);
                // Disparar evento incluso con error para no bloquear
                window.dispatchEvent(new CustomEvent('mapa-listos', { detail: { error: true } }));
            });
    },
    
    onEachFeature: function(feature, layer) {
        const nombre = feature.properties?.name || 
                      feature.properties?.ADMIN || 
                      'Desconocido';
        
        // Tooltip con nombre
        layer.bindTooltip(nombre, { sticky: true });
        
        // Click
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
        
        if (iso3 && iso3 !== '-99' && iso3.length === 3) {
            if (window.DashboardReal && typeof window.DashboardReal.mostrar === 'function') {
                window.DashboardReal.mostrar(iso3);
            }
        } else {
            const container = document.getElementById('dashboard-container');
            if (container) {
                container.innerHTML = `
                    <div class="dashboard-error">
                        <div class="error-icono">🌍</div>
                        <h3>${nombre}</h3>
                        <p>No tenemos datos económicos disponibles para este país.</p>
                    </div>
                `;
            }
        }
    },
    
    centrarEn: function(lat, lon, zoom = 6) {
        if (mapaGlobal) {
            mapaGlobal.setView([lat, lon], zoom);
        }
    },
    
    centrarEnPais: function(iso3) {
        if (!capaPaisesGlobal) return;
        
        let encontrado = false;
        capaPaisesGlobal.eachLayer(layer => {
            const layerIso3 = layer.feature?.properties?.['ISO3166-1-Alpha-3'];
            if (layerIso3 === iso3) {
                const latlng = layer.getBounds().getCenter();
                this.centrarEn(latlng.lat, latlng.lng, 5);
                layer.fireEvent('click');
                encontrado = true;
            }
        });
        
        if (!encontrado) {
            console.log(`⚠️ No se encontró el país con ISO3: ${iso3}`);
        }
    },
    
    getMapa: function() {
        return mapaGlobal;
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MapaGlobal.init());
} else {
    MapaGlobal.init();
}

window.MapaGlobal = MapaGlobal;
