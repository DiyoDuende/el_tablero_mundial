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
        
        // Cargar marcadores de ciudades principales (opcional, pero útiles como atajo)
        this.cargarMarcadores();
        
        // Cargar GeoJSON de países (para las capas de poder)
        this.cargarGeoJSON();
        
        // Centrar en España tras un breve retraso
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
                                const id = this.normalizarId(nombre);
                                if (window.UIPanelInfo) UIPanelInfo.mostrarPais(id);
                            });
                        }
                    }
                }).addTo(this.map);
            })
            .catch(error => console.error('Error cargando GeoJSON de países:', error));
    },
    
    normalizarId: function(nombre) {
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
    
    // Activar capa de poder con datos reales (asíncrono)
    activarCapa: async function(capa, activa) {
        if (!this.capaPaises) return;

        // Si ya estaba activa la misma capa, la desactivamos
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
        console.log(`🔄 Cargando capa: ${capa}`);

        let valores = {};
        // Intentar obtener datos reales si está disponible el módulo
        if (window.DatosReales && typeof DatosReales.obtenerValores === 'function') {
            valores = await DatosReales.obtenerValores(capa);
        }

        // Si no hay datos reales, usar simulación
        if (Object.keys(valores).length === 0) {
            console.warn(`⚠️ No se obtuvieron datos reales para ${capa}, usando simulación`);
            valores = this.obtenerValoresSimulados(capa);
        }

        // Aplicar colores a cada país
        this.capaPaises.eachLayer(layer => {
            const nombre = layer.feature?.properties?.ADMIN;
            if (!nombre) return;

            let valor = valores[nombre];
            if (valor === undefined) valor = 0.5;

            // Normalizar valor según la capa (para escala de color)
            let intensidad;
            if (capa === 'economico') {
                // GDP per cápita: escalamos suponiendo un máximo de 100.000 USD
                intensidad = Math.min(1, valor / 100000);
            } else {
                intensidad = valor; // asumimos que ya viene normalizado 0-1
            }

            const color = this.valorAColor(intensidad);
            layer.setStyle({
                fillColor: color,
                fillOpacity: 0.7,
                color: '#fff',
                weight: 1
            });

            // Tooltip personalizado según la capa
            let tooltipText = nombre;
            if (capa === 'economico' && valor !== undefined && valor !== 0.5) {
                tooltipText += `<br>💰 PIB per cápita: ${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(valor)}`;
            } else {
                tooltipText += `<br>${capa}: ${typeof valor === 'number' ? Math.round(valor * 100) : valor}%`;
            }
            layer.bindTooltip(tooltipText);
        });

        console.log(`✅ Capa ${capa} aplicada`);
    },
    
    // Función para desactivar todas las capas y restaurar colores originales
    resetearColores: function() {
        if (!this.capaPaises) return;
        this.capaPaises.eachLayer(layer => {
            layer.setStyle({
                fillColor: '#2c3e50',
                fillOpacity: 0.3,
                color: '#4fc3f7',
                weight: 1
            });
            const nombre = layer.feature?.properties?.ADMIN || '';
            layer.bindTooltip(nombre);
        });
    },
    
    // Fallback simulado para capas sin datos reales (o por si falla la API)
    obtenerValoresSimulados: function(capa) {
        const base = {
            'Spain': 0.7, 'France': 0.8, 'Germany': 0.9, 'Italy': 0.6,
            'Portugal': 0.5, 'United States': 0.9, 'China': 0.8, 'Russia': 0.6,
            'Brazil': 0.5, 'India': 0.4, 'Japan': 0.8
        };
        const valores = {};
        for (let [pais, v] of Object.entries(base)) {
            if (capa === 'economico') valores[pais] = Math.min(1, v * 1.2);
            else if (capa === 'social') valores[pais] = v * 0.9;
            else if (capa === 'clima') valores[pais] = 1 - v;
            else valores[pais] = v;
        }
        return valores;
    },
    
    // Escala de color: verde (bueno) -> amarillo -> rojo (malo)
    valorAColor: function(valor) {
        if (valor < 0.33) return '#2ecc71';  // verde
        if (valor < 0.66) return '#f1c40f';  // amarillo
        return '#e74c3c';                    // rojo
    },
    
    // Búsqueda global con Nominatim
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
                alert(`No se encontró el lugar: "${texto}". Intenta con otro nombre.`);
            }
        })
        .catch(error => {
            console.error('Error en Nominatim:', error);
            if (buscarInput) buscarInput.placeholder = placeholderOriginal;
            alert('Error al buscar. Revisa tu conexión o intenta más tarde.');
        });
    }
};

window.MapaMundial = MapaMundial;
