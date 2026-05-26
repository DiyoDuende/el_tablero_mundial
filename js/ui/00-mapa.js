// js/ui/00-mapa.js
const MapaMundial = {
    map: null,
    capaPaises: null,
    capaActiva: null,

    init: function() {
        this.map = L.map('mapa-mundial').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
        this.cargarGeoJSON();
        // No hay cargarMarcadores() ni setTimeout centralizado
    },

    cargarGeoJSON: function() {
        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
            .then(r => r.json())
            .then(data => {
                this.capaPaises = L.geoJSON(data, {
                    style: { color: '#4fc3f7', weight: 1, fillColor: '#2c3e50', fillOpacity: 0.3 },
                    onEachFeature: (f, l) => {
                        const nombre = f.properties.ADMIN;
                        if (nombre) {
                            l.bindTooltip(nombre);
                            l.on('click', () => {
                                const id = this.normalizarId(nombre);
                                if (window.UIPanelInfo) UIPanelInfo.mostrarPais(id);
                            });
                        }
                    }
                }).addTo(this.map);
            });
    },

    normalizarId: function(nombre) {
        const mapa = {
            'Spain': 'espana',
            'France': 'francia',
            'Portugal': 'portugal',
            'Germany': 'alemania',
            'Italy': 'italia',
            'United States': 'eeuu'
        };
        return mapa[nombre] || nombre.toLowerCase();
    },

    irAPais: function(paisId) {
        const centros = {
            espana: [40.4, -3.7],
            francia: [46.6, 2.4],
            portugal: [39.5, -8.0],
            alemania: [51.1, 10.5],
            italia: [41.9, 12.5],
            eeuu: [39.8, -98.5]
        };
        const centro = centros[paisId] || [20, 0];
        this.map.setView(centro, 6);
        if (window.UIPanelInfo) UIPanelInfo.mostrarPais(paisId);
    },

    activarCapa: async function(capa, activa) {
        if (!this.capaPaises) return;
        if (this.capaActiva === capa && activa) {
            this.resetearColores();
            this.capaActiva = null;
            return;
        }
        if (!activa) {
            this.resetearColores();
            this.capaActiva = null;
            return;
        }
        this.capaActiva = capa;
        const valores = this.obtenerValoresSimulados(capa);
        this.capaPaises.eachLayer(layer => {
            const nombre = layer.feature?.properties?.ADMIN;
            const valor = valores[nombre] || 0.5;
            const color = this.valorAColor(valor);
            layer.setStyle({ fillColor: color, fillOpacity: 0.7, color: '#fff', weight: 1 });
            layer.bindTooltip(`${nombre}<br>${capa}: ${Math.round(valor * 100)}%`);
        });
    },

    resetearColores: function() {
        if (!this.capaPaises) return;
        this.capaPaises.eachLayer(layer => {
            layer.setStyle({ fillColor: '#2c3e50', fillOpacity: 0.3, color: '#4fc3f7', weight: 1 });
            const nombre = layer.feature?.properties?.ADMIN || '';
            layer.bindTooltip(nombre);
        });
        this.capaActiva = null;
    },

    obtenerValoresSimulados: function(capa) {
        const base = {
            'Spain': 0.7,
            'France': 0.8,
            'Germany': 0.9,
            'Italy': 0.6,
            'Portugal': 0.5,
            'United States': 0.9
        };
        const valores = {};
        for (let [p, v] of Object.entries(base)) {
            if (capa === 'economico') valores[p] = Math.min(1, v * 1.2);
            else if (capa === 'social') valores[p] = v * 0.9;
            else valores[p] = v;
        }
        return valores;
    },

    valorAColor: function(v) {
        if (v < 0.33) return '#2ecc71';
        if (v < 0.66) return '#f1c40f';
        return '#e74c3c';
    },

    buscarLugar: function(texto) {
    if (!texto) return;
    const input = document.getElementById('buscador-rapido');
    const orig = input?.placeholder;
    if (input) input.placeholder = '🔍 Buscando...';
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&limit=1`, {
        headers: { 'User-Agent': 'TableroMundial/1.0' }
    })
    .then(r => r.json())
    .then(data => {
        if (input) input.placeholder = orig;
        if (data && data[0]) {
            const { lat, lon, display_name } = data[0];
            const marker = L.marker([parseFloat(lat), parseFloat(lon)])
                .addTo(this.map)
                .bindTooltip(display_name)
                .openTooltip();
            setTimeout(() => {
                this.map.removeLayer(marker);
            }, 5000);
            this.map.setView([parseFloat(lat), parseFloat(lon)], 10);
        } else {
            alert('No se encontró el lugar');
        }
    })
    .catch(() => {
        if (input) input.placeholder = orig;
        alert('Error de búsqueda');
    });
}
};

window.MapaMundial = MapaMundial;
