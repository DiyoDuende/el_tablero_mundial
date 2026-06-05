// js/ui/00-mapa.js
// ============================================
// MAPA MUNDIAL - Versión estable
// ============================================

var mapaGlobal = null;
var capaPaisesGlobal = null;

var MapaMundial = {
    init: function() {
        if (mapaGlobal) return;
        
        // Configuración para ver todo el mundo (Groenlandia y Antártida incluidos)
        mapaGlobal = L.map('mapa-mundial', {
            center: [0, 0],        // Centro en el ecuador
            zoom: 1.5,             // Zoom para ver el mundo entero
            minZoom: 1.5,
            maxZoom: 8,
            zoomControl: true,
            maxBounds: [[-90, -180], [90, 180]],
            maxBoundsViscosity: 0.5
        });
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OSM & CartoDB',
            subdomains: 'abcd',
            maxZoom: 19,
            minZoom: 1
        }).addTo(mapaGlobal);
        
        this.cargarGeoJSON();
        console.log('🗺️ Mapa inicializado');
    },
    
    obtenerNombrePais: function(properties) {
        return properties?.ADMIN || properties?.name || properties?.NAME || '';
    },
    
    obtenerISO3: function(nombre) {
        var mapa = {
            'Spain': 'ESP', 'France': 'FRA', 'Germany': 'DEU', 'Italy': 'ITA',
            'Portugal': 'PRT', 'United Kingdom': 'GBR', 'United States of America': 'USA',
            'China': 'CHN', 'Russia': 'RUS', 'Brazil': 'BRA', 'India': 'IND',
            'Japan': 'JPN', 'Canada': 'CAN', 'Mexico': 'MEX', 'Australia': 'AUS',
            'South Africa': 'ZAF', 'Netherlands': 'NLD', 'Sweden': 'SWE', 'Norway': 'NOR',
            'Switzerland': 'CHE', 'Argentina': 'ARG', 'Chile': 'CHL', 'Colombia': 'COL',
            'Peru': 'PER', 'Venezuela': 'VEN', 'Egypt': 'EGY', 'Turkey': 'TUR',
            'South Korea': 'KOR', 'Poland': 'POL', 'Greece': 'GRC', 'Austria': 'AUT',
            'Belgium': 'BEL', 'Denmark': 'DNK', 'Finland': 'FIN', 'Hungary': 'HUN',
            'Ireland': 'IRL', 'Czech Republic': 'CZE', 'Romania': 'ROU'
        };
        return mapa[nombre] || null;
    },
    
    cargarGeoJSON: function() {
        var url = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
        
        fetch(url)
            .then(function(response) { return response.json(); })
            .then(function(data) {
                capaPaisesGlobal = L.geoJSON(data, {
                    style: {
                        fillColor: '#2c3e50',
                        fillOpacity: 0.3,
                        color: '#4fc3f7',
                        weight: 1
                    },
                    onEachFeature: function(feature, layer) {
                        var nombre = feature.properties?.ADMIN || feature.properties?.name || '';
                        if (nombre) {
                            layer.bindTooltip(nombre);
                            layer.on('click', function() {
                                var iso3 = MapaMundial.obtenerISO3(nombre);
                                if (window.DashboardReal && iso3) {
                                    DashboardReal.mostrar(iso3, 'pais', nombre);
                                }
                            });
                        }
                    }
                }).addTo(mapaGlobal);
                
                // IMPORTANTE: Actualizar la variable global para que Coloreado la encuentre
                window.capaPaisesGlobal = capaPaisesGlobal;
                
                console.log('✅ GeoJSON cargado');
                console.log('📊 Países en el mapa:', capaPaisesGlobal.getLayers().length);
                
                // Activar coloreado después de cargar
                setTimeout(function() {
                    if (window.Coloreado) {
                        console.log('🎨 Activando coloreado...');
                        Coloreado.aplicarColoresPIB();
                    } else {
                        console.warn('⚠️ Coloreado no disponible');
                    }
                }, 2000);
            })
            .catch(function(error) { console.error('Error cargando GeoJSON:', error); });
    }
};

window.MapaMundial = MapaMundial;
