// js/ui/00-mapa.js
const MapaMundial = {
    map: null,
    capaPaises: null,
    capaActiva: null,
    marcadorBusqueda: null,

    init: function() {
        console.log('🗺️ Inicializando mapa...');
        this.map = L.map('mapa-mundial').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
        this.cargarGeoJSON();
        console.log('✅ Mapa listo');
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
                                if (window.UIPanelInfo) {
                                    UIPanelInfo.mostrarPais(id);
                                }
                            });
                        }
                    }
                }).addTo(this.map);
            })
            .catch(error => console.error('❌ Error cargando GeoJSON:', error));
    },

    normalizarId: function(nombre) {
        return nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },

    irAPais: function(paisId) {
        if (!this.capaPaises) return;
        this.capaPaises.eachLayer(layer => {
            const nombre = this.normalizarId(layer.feature.properties.ADMIN);
            if (nombre === paisId) {
                this.map.fitBounds(layer.getBounds());
                if (window.UIPanelInfo) UIPanelInfo.mostrarPais(paisId);
            }
        });
    },

    // ============================================
// CAPA ECONÓMICA CON DATOS REALES
// ============================================
activarCapa: async function(capa, activa) {
    if (!this.capaPaises) return;
    
    if (!activa) {
        this.resetearColores();
        const leyenda = document.querySelector('.mapa-leyenda');
        if (leyenda) leyenda.remove();
        return;
    }
    
    if (capa === 'economico') {
        this.mostrarLeyenda('cargando', 'Cargando datos del Banco Mundial...');
        
        let pibData = {};
        try {
            if (window.DatosReales) {
                pibData = await DatosReales.obtenerValoresParaCapa();
            }
            if (Object.keys(pibData).length === 0) throw new Error('Sin datos');
        } catch (error) {
            console.warn('Usando datos simulados (API no disponible)');
            pibData = {
                'Spain': 29800, 'France': 42000, 'Germany': 51000, 'Italy': 35000,
                'Portugal': 23000, 'United States': 70000, 'China': 12000, 'Russia': 11500,
                'Brazil': 7500, 'India': 2100, 'Japan': 40000, 'Canada': 43000,
                'Mexico': 9000, 'Australia': 52000, 'South Africa': 6000
            };
        }
        
        let minPIB = Infinity, maxPIB = -Infinity;
        for (const valor of Object.values(pibData)) {
            if (valor > maxPIB) maxPIB = valor;
            if (valor < minPIB) minPIB = valor;
        }
        
        this.capaPaises.eachLayer(layer => {
            const nombre = layer.feature?.properties?.ADMIN;
            if (!nombre || !pibData[nombre]) return;
            
            const pib = pibData[nombre];
            const color = this.obtenerColorPIB(pib, minPIB, maxPIB);
            layer.setStyle({ fillColor: color, fillOpacity: 0.7, color: '#fff', weight: 1 });
            layer.unbindTooltip();
            layer.bindTooltip(`${nombre}<br>💰 PIB per cápita: ${pib.toLocaleString()} USD`);
        });
        this.mostrarLeyenda('economico', { min: minPIB, max: maxPIB });
    } else {
        // Resto de capas: comportamiento original con colores aleatorios
        this.mostrarLeyenda('simulado');
        this.capaPaises.eachLayer(layer => {
            const valor = Math.random();
            let color = '#2ecc71';
            if (valor > 0.66) color = '#e74c3c';
            else if (valor > 0.33) color = '#f1c40f';
            layer.setStyle({ fillColor: color, fillOpacity: 0.7, color: '#fff', weight: 1 });
        });
    }
},

    resetearColores: function() {
        if (!this.capaPaises) return;
        this.capaPaises.eachLayer(layer => {
            layer.setStyle({ fillColor: '#2c3e50', fillOpacity: 0.3, color: '#4fc3f7', weight: 1 });
            layer.unbindTooltip();
            const nombre = layer.feature?.properties?.ADMIN || '';
            layer.bindTooltip(nombre);
        });
    },

    mostrarLeyenda: function() {
        const leyendaExistente = document.querySelector('.mapa-leyenda');
        if (leyendaExistente) leyendaExistente.remove();
        
        const leyenda = document.createElement('div');
        leyenda.className = 'mapa-leyenda';
        leyenda.innerHTML = `
            <div class="leyenda-titulo">🎨 CAPA ACTIVA</div>
            <div class="leyenda-escala">
                <div class="leyenda-color" style="background: #2ecc71;"></div>
                <div class="leyenda-color" style="background: #f1c40f;"></div>
                <div class="leyenda-color" style="background: #e74c3c;"></div>
            </div>
            <div class="leyenda-valores">
                <span>Alto</span>
                <span>Medio</span>
                <span>Bajo</span>
            </div>
            <div class="leyenda-fuente">Datos simulados</div>
        `;
        document.querySelector('.mapa-container')?.appendChild(leyenda);
    },

    buscarLugar: async function(texto) {
        if (!texto) return;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&limit=1`);
            const data = await response.json();
            if (!data || !data[0]) {
                alert('No se encontró el lugar');
                return;
            }
            const lugar = data[0];
            const lat = parseFloat(lugar.lat);
            const lon = parseFloat(lugar.lon);
            this.map.setView([lat, lon], 10);
            if (this.marcadorBusqueda) this.map.removeLayer(this.marcadorBusqueda);
            this.marcadorBusqueda = L.marker([lat, lon]).addTo(this.map).bindTooltip(lugar.display_name).openTooltip();
        } catch (error) {
            console.error('❌ Error búsqueda:', error);
        }
    }
};

window.MapaMundial = MapaMundial;
