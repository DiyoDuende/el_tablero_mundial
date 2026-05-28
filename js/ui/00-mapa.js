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
    // CAPAS ECONÓMICAS CON DATOS REALES
    // ============================================
    async colorearPorPIB() {
        if (!this.capaPaises) return;
        
        this.mostrarLeyenda('cargando', 'Cargando datos económicos...');
        
        const pibData = await DatosReales.obtenerValoresParaCapa();
        let minPIB = Infinity, maxPIB = -Infinity;
        
        for (const [pais, valor] of Object.entries(pibData)) {
            if (valor > maxPIB) maxPIB = valor;
            if (valor < minPIB) minPIB = valor;
        }
        
        this.capaPaises.eachLayer(layer => {
            const nombre = layer.feature?.properties?.ADMIN;
            if (!nombre) return;
            
            const pib = pibData[nombre] || 0;
            const color = this.obtenerColorPIB(pib, minPIB, maxPIB);
            
            layer.setStyle({
                fillColor: color,
                fillOpacity: 0.7,
                color: '#fff',
                weight: 1
            });
            
            layer.unbindTooltip();
            const pibFormateado = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(pib);
            layer.bindTooltip(`${nombre}<br>💰 PIB per cápita: ${pibFormateado}`);
        });
        
        this.mostrarLeyenda('económico', { min: minPIB, max: maxPIB });
    },
    
    obtenerColorPIB: function(pib, min, max) {
        if (pib <= 0 || !pib) return '#e74c3c';
        
        const minValor = min > 0 ? min : 1000;
        const maxValor = max > 0 ? max : 100000;
        
        const minLog = Math.log(minValor);
        const maxLog = Math.log(maxValor);
        const valorLog = Math.log(pib);
        
        let proporcion = (valorLog - minLog) / (maxLog - minLog);
        proporcion = Math.min(1, Math.max(0, proporcion));
        
        if (proporcion < 0.33) {
            const intensidad = proporcion / 0.33;
            return this.interpolarColor('#e74c3c', '#f39c12', intensidad);
        } else if (proporcion < 0.66) {
            const intensidad = (proporcion - 0.33) / 0.33;
            return this.interpolarColor('#f39c12', '#f1c40f', intensidad);
        } else {
            const intensidad = (proporcion - 0.66) / 0.34;
            return this.interpolarColor('#f1c40f', '#2ecc71', intensidad);
        }
    },
    
    interpolarColor: function(color1, color2, factor) {
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        const r = Math.round(c1.r + (c2.r - c1.r) * factor);
        const g = Math.round(c1.g + (c2.g - c1.g) * factor);
        const b = Math.round(c1.b + (c2.b - c1.b) * factor);
        return `rgb(${r}, ${g}, ${b})`;
    },
    
    hexToRgb: function(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    },
    
    mostrarLeyenda: function(tipo, datos) {
    const leyendaExistente = document.querySelector('.mapa-leyenda');
    if (leyendaExistente) leyendaExistente.remove();
    
    if (tipo === 'cargando') {
        const leyenda = document.createElement('div');
        leyenda.className = 'mapa-leyenda';
        leyenda.innerHTML = `<div class="leyenda-titulo">🔄 ${datos}</div>`;
        document.querySelector('.mapa-container')?.appendChild(leyenda);
    } else if (tipo === 'económico' && datos) {
        // ... tu código existente para PIB
    } else if (tipo === 'simulado') {
        const leyenda = document.createElement('div');
        leyenda.className = 'mapa-leyenda';
        leyenda.innerHTML = `
            <div class="leyenda-titulo">🎲 DATOS SIMULADOS</div>
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
            <div class="leyenda-fuente">Modo simulación · Sin datos reales</div>
        `;
        document.querySelector('.mapa-container')?.appendChild(leyenda);
    }
},
    
    ocultarLeyenda: function() {
        const leyenda = document.querySelector('.mapa-leyenda');
        if (leyenda) leyenda.remove();
    },

    activarCapa: async function(capa, activa) {
        if (!this.capaPaises) return;
        
        if (!activa) {
            this.resetearColores();
            this.ocultarLeyenda();
            return;
        }
        
        if (capa === 'economico') {
            await this.colorearPorPIB();
        } else {
            this.capaPaises.eachLayer(layer => {
                const valor = Math.random();
                let color = '#2ecc71';
                if (valor > 0.66) color = '#e74c3c';
                else if (valor > 0.33) color = '#f1c40f';
                layer.setStyle({ fillColor: color, fillOpacity: 0.7, color: '#fff', weight: 1 });
            });
            this.mostrarLeyenda('simulado');
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
