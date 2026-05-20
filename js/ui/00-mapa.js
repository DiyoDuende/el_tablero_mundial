// ============================================
// MAPA MUNDIAL (Leaflet)
// ============================================

const MapaMundial = {
    
    map: null,
    capas: {},
    
    init: function() {
        this.map = L.map('mapa-mundial').setView([20, 0], 2);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
        
        this.cargarPaises();
        
        setTimeout(() => {
            this.irAPais('españa');
        }, 500);
    },
    
    cargarPaises: function() {
        // Simulación de países (en producción cargaría GeoJSON)
        const paises = [
            { name: 'España', coords: [40.4, -3.7] },
            { name: 'Francia', coords: [46.6, 2.4] },
            { name: 'Portugal', coords: [39.5, -8.0] },
            { name: 'Alemania', coords: [51.1, 10.5] },
            { name: 'Italia', coords: [41.9, 12.5] },
            { name: 'EEUU', coords: [39.8, -98.5] },
            { name: 'China', coords: [35.8, 104.1] }
        ];
        
        paises.forEach(pais => {
            const marker = L.circleMarker(pais.coords, {
                radius: 8,
                color: '#4fc3f7',
                fillColor: '#2a7faa',
                fillOpacity: 0.8
            }).addTo(this.map);
            
            marker.on('click', () => {
                this.irAPais(pais.name.toLowerCase());
            });
            
            marker.bindTooltip(pais.name);
        });
    },
    
    irAPais: function(paisId) {
        const centros = {
            españa: [40.4, -3.7],
            francia: [46.6, 2.4],
            portugal: [39.5, -8.0],
            alemania: [51.1, 10.5],
            italia: [41.9, 12.5],
            eeuu: [39.8, -98.5],
            china: [35.8, 104.1]
        };
        
        const centro = centros[paisId] || [20, 0];
        this.map.setView(centro, 6);
        
        if (window.UIPanelInfo) {
            UIPanelInfo.mostrarPais(paisId);
        }
    },
    
    activarCapa: function(capa, activa) {
        // Implementar cuando tengamos datos GeoJSON
        console.log(`Capa ${capa} ${activa ? 'activada' : 'desactivada'}`);
    }
};

window.MapaMundial = MapaMundial;
