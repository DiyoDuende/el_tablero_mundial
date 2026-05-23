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
        
        // Cargar marcadores (opcional, puedes mantenerlos)
        this.cargarMarcadores();
        
        // Cargar GeoJSON de países para las capas
        this.cargarGeoJSON();
        
        setTimeout(() => {
            this.irAPais('españa');
        }, 500);
    },
    
    cargarMarcadores: function() {
        const paises = [
            { name: 'España', coords: [40.4, -3.7] },
            { name: 'Barcelona', coords: [41.3851, 2.1734] },
            { name: 'Sevilla', coords: [37.3891, -5.9845] },
            { name: 'Valencia', coords: [39.4699, -0.3763] },
            { name: 'Bilbao', coords: [43.2630, -2.9350] },
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
    
    cargarGeoJSON: function() {
        // Usar un GeoJSON de países (dominio público)
        const url = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.capaPaises = L.geoJSON(data, {
                    style: {
                        color: '#4fc3f7',
                        weight: 1,
                        fillColor: '#2c3e50',
                        fillOpacity: 0.3
                    },
                    onEachFeature: (feature, layer) => {
                        const nombre = feature.properties.ADMIN;
                        if (nombre) {
                            layer.bindTooltip(nombre);
                            layer.on('click', () => {
                                // Buscar el id del país en TERRITORIOS (normalizando)
                                const id = this.normalizarId(nombre);
                                if (window.UIPanelInfo) {
                                    UIPanelInfo.mostrarPais(id);
                                }
                            });
                        }
                    }
                }).addTo(this.map);
            })
            .catch(error => console.error('Error cargando GeoJSON:', error));
    },
    
    normalizarId: function(nombre) {
        // Convertir "Spain" -> "españa", "France" -> "francia", etc.
        const mapa = {
            'Spain': 'españa',
            'France': 'francia',
            'Portugal': 'portugal',
            'Germany': 'alemania',
            'Italy': 'italia',
            'United States': 'eeuu',
            'China': 'china',
            'Russia': 'rusia'
        };
        return mapa[nombre] || nombre.toLowerCase();
    },
    
    irAPais: function(paisId) {
        const centros = {
            españa: [40.4, -3.7],
            barcelona: [41.3851, 2.1734],
            sevilla: [37.3891, -5.9845],
            valencia: [39.4699, -0.3763],
            bilbao: [43.2630, -2.9350],
            francia: [46.6, 2.4],
            portugal: [39.5, -8.0],
            alemania: [51.1, 10.5],
            italia: [41.9, 12.5],
            eeuu: [39.8, -98.5],
            china: [35.8, 104.1]
        };
        const centro = centros[paisId] || [20, 0];
        this.map.setView(centro, 6);
        if (window.UIPanelInfo) UIPanelInfo.mostrarPais(paisId);
    },
    
    // Función para colorear países según una capa (valores simulados)
    activarCapa: function(capa, activa) {
        if (!this.capaPaises) return;
        
        // Si ya había una capa activa y es la misma, la desactivamos
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
        
        // Valores simulados para cada país según la capa (0-1)
        const valores = this.obtenerValoresSimulados(capa);
        
        // Aplicar colores a cada feature
        this.capaPaises.eachLayer(layer => {
            const props = layer.feature.properties;
            const nombre = props.ADMIN;
            let valor = valores[nombre] || 0.5;
            // Escala de color: verde (bueno) a rojo (malo)
            const color = this.valorAColor(valor);
            layer.setStyle({
                fillColor: color,
                fillOpacity: 0.7,
                color: '#fff',
                weight: 1
            });
            // Actualizar tooltip con el valor
            const tooltip = `${nombre}<br>${capa}: ${Math.round(valor*100)}%`;
            layer.bindTooltip(tooltip);
        });
    },
    
    resetearColores: function() {
        if (!this.capaPaises) return;
        this.capaPaises.eachLayer(layer => {
            layer.setStyle({
                fillColor: '#2c3e50',
                fillOpacity: 0.3,
                color: '#4fc3f7',
                weight: 1
            });
            // Restaurar tooltip original
            const nombre = layer.feature.properties.ADMIN;
            layer.bindTooltip(nombre);
        });
    },
    
    obtenerValoresSimulados: function(capa) {
        // Aquí luego vendrán datos reales. Por ahora, valores fijos por país.
        const base = {
            'Spain': 0.7, 'France': 0.8, 'Germany': 0.9, 'Italy': 0.6,
            'Portugal': 0.5, 'United States': 0.9, 'China': 0.8,
            'Russia': 0.6, 'Brazil': 0.5, 'India': 0.4, 'Japan': 0.8
        };
        // Ajustar según capa: simular variación
        const valores = {};
        for (let [pais, v] of Object.entries(base)) {
            if (capa === 'economico') valores[pais] = Math.min(1, v * 1.2);
            else if (capa === 'social') valores[pais] = v * 0.9;
            else if (capa === 'clima') valores[pais] = 1 - v;
            else valores[pais] = v;
        }
        return valores;
    },
    
    valorAColor: function(valor) {
        // Gradiente: verde (0.3) -> amarillo (0.6) -> rojo (1)
        if (valor < 0.33) return '#2ecc71';
        if (valor < 0.66) return '#f1c40f';
        return '#e74c3c';
    },
    
    buscarLugar: function(texto) {
        if (!texto || texto.trim() === '') return;
        const buscarInput = document.getElementById('buscador-rapido');
        const placeholderOriginal = buscarInput ? buscarInput.placeholder : '';
        if (buscarInput) buscarInput.placeholder = '🔍 Buscando...';
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&limit=1&addressdetails=0`;
        fetch(url, {
            headers: { 'User-Agent': 'TableroMundial/1.0' }
        })
        .then(response => response.json())
        .then(data => {
            if (buscarInput) buscarInput.placeholder = placeholderOriginal;
            if (data && data.length > 0) {
                const lugar = data[0];
                const lat = parseFloat(lugar.lat);
                const lon = parseFloat(lugar.lon);
                this.map.setView([lat, lon], 10);
                const marker = L.marker([lat, lon]).addTo(this.map);
                marker.bindTooltip(lugar.display_name).openTooltip();
                setTimeout(() => this.map.removeLayer(marker), 5000);
            } else {
                alert(`No se encontró el lugar: "${texto}".`);
            }
        })
        .catch(error => {
            console.error('Error en Nominatim:', error);
            if (buscarInput) buscarInput.placeholder = placeholderOriginal;
            alert('Error al buscar.');
        });
    }
};

window.MapaMundial = MapaMundial;
