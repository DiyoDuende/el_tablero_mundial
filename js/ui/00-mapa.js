// js/ui/00-mapa.js
// ============================================
// MAPA MUNDIAL - Inicialización y control
// ============================================

var mapaGlobal = null;
var capaPaisesGlobal = null;

var MapaMundial = {
    init: function() {
        if (mapaGlobal) return;
        
        mapaGlobal = L.map('mapa-mundial', {
            center: [20, 0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 8,
            zoomControl: true,
            maxBounds: [[-70, -140], [70, 140]],
            maxBoundsViscosity: 0.8
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
            'South Africa': 'ZAF', 'Netherlands': 'NLD', 'Sweden': 'SWE', 'Norway': 'NOR'
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
                
                window.capaPaisesGlobal = capaPaisesGlobal;
                console.log('✅ GeoJSON cargado');
                
                // Disparar evento cuando el mapa esté listo
                window.dispatchEvent(new CustomEvent('mapa-listos'));
            })
            .catch(function(error) { console.error('Error:', error); });
    },
    
    activarCapa: function(capa, activa) {
        console.log("🎨 CAPA recibida:", capa, activa);
        
        if (!capaPaisesGlobal) {
            console.warn("⚠️ capaPaises no está listo todavía");
            return;
        }
        
        if (!activa) {
            this.resetearColores();
            return;
        }
        
        if (capa === 'economico') {
            console.log("🎨 Aplicando capa ECONÓMICA");
            if (window.Coloreado) {
                window.Coloreado.aplicarColoresPIB();
            }
        } else {
            console.log("🎨 Capa SIMULADA:", capa);
            // Colores aleatorios para otras capas
            capaPaisesGlobal.eachLayer(function(layer) {
                var colores = ['#2ecc71', '#f1c40f', '#e74c3c'];
                var color = colores[Math.floor(Math.random() * colores.length)];
                layer.setStyle({ fillColor: color, fillOpacity: 0.7 });
            });
        }
    },
    
    resetearColores: function() {
        if (!capaPaisesGlobal) return;
        capaPaisesGlobal.eachLayer(function(layer) {
            layer.setStyle({ fillColor: '#2c3e50', fillOpacity: 0.3 });
        });
        var leyenda = document.querySelector('.mapa-leyenda');
        if (leyenda) leyenda.remove();
    }
};

window.MapaMundial = MapaMundial;
