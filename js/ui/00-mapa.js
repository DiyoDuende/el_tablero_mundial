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
            .catch(error => {
                console.error('❌ Error cargando GeoJSON:', error);
            });
    },

    normalizarId: function(nombre) {
        return nombre
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    },

    // ============================================
    // NORMALIZAR NOMBRES ECONÓMICOS
    // ============================================
    normalizarNombreEconomico: function(nombre) {

        const mapa = {
            'United States of America': 'United States',
            'Russian Federation': 'Russia',
            'Czechia': 'Czech Republic',
            'Republic of Korea': 'South Korea',
            'Iran (Islamic Republic of)': 'Iran',
            'Viet Nam': 'Vietnam',
            'United Republic of Tanzania': 'Tanzania',
            'Syrian Arab Republic': 'Syria',
            'Venezuela (Bolivarian Republic of)': 'Venezuela',
            'Bolivia (Plurinational State of)': 'Bolivia'
        };

        return mapa[nombre] || nombre;
    },

    irAPais: function(paisId) {

        if (!this.capaPaises) return;

        this.capaPaises.eachLayer(layer => {

            const nombre = this.normalizarId(
                layer.feature.properties.ADMIN
            );

            if (nombre === paisId) {

                this.map.fitBounds(layer.getBounds());

                if (window.UIPanelInfo) {
                    UIPanelInfo.mostrarPais(paisId);
                }
            }
        });
    },

    // ============================================
    // CAPA ECONÓMICA
    // ============================================
    async colorearPorPIB() {

        if (!this.capaPaises) return;

        this.mostrarLeyenda('cargando', 'Cargando datos económicos...');

        let pibData = {};
        let usandoSimulados = false;

        try {

            if (
                window.DatosReales &&
                DatosReales.obtenerValoresParaCapa
            ) {

                pibData = await DatosReales.obtenerValoresParaCapa();
            }

            if (Object.keys(pibData).length === 0) {
                throw new Error('Sin datos');
            }

        } catch (error) {

            console.warn('⚠️ Usando datos simulados');

            usandoSimulados = true;

            pibData = {
                'Spain': 29800,
                'France': 42000,
                'Germany': 51000,
                'Italy': 35000,
                'Portugal': 23000,
                'United States': 70000,
                'China': 12000,
                'Russia': 11500,
                'Brazil': 7500,
                'India': 2100,
                'Japan': 40000,
                'Canada': 43000,
                'Mexico': 9000,
                'Australia': 52000,
                'South Africa': 6000
            };
        }

        // ============================================
        // OBTENER MIN Y MAX
        // ============================================
        let minPIB = Infinity;
        let maxPIB = -Infinity;

        for (const valor of Object.values(pibData)) {

            if (valor < minPIB) minPIB = valor;
            if (valor > maxPIB) maxPIB = valor;
        }

        // ============================================
        // COLOREAR PAÍSES
        // ============================================
        this.capaPaises.eachLayer(layer => {

            const nombreOriginal =
                layer.feature?.properties?.ADMIN;

            if (!nombreOriginal) return;

            const nombre =
                this.normalizarNombreEconomico(nombreOriginal);

            const pib = pibData[nombre] || 0;

            const color = this.obtenerColorPIB(
                pib,
                minPIB,
                maxPIB
            );

            layer.setStyle({
                fillColor: color,
                fillOpacity: 0.7,
                color: '#ffffff',
                weight: 1
            });

            layer.unbindTooltip();

            const pibFormateado =
                pib > 0
                    ? new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'USD'
                      }).format(pib)
                    : 'Sin datos';

            layer.bindTooltip(`
                <strong>${nombreOriginal}</strong><br>
                💰 PIB per cápita: ${pibFormateado}
            `);
        });

        // ============================================
        // LEYENDA
        // ============================================
        if (usandoSimulados) {

            this.mostrarLeyenda('simulado');

        } else {

            this.mostrarLeyenda('economico', {
                min: minPIB,
                max: maxPIB
            });
        }
    },

    // ============================================
    // COLOR SEGÚN PIB
    // ============================================
    obtenerColorPIB: function(pib, min, max) {

        if (!pib || pib <= 0) {
            return '#555555';
        }

        const minLog = Math.log(min);
        const maxLog = Math.log(max);
        const valorLog = Math.log(pib);

        let proporcion =
            (valorLog - minLog) / (maxLog - minLog);

        proporcion = Math.max(0, Math.min(1, proporcion));

        if (proporcion < 0.33) {

            return this.interpolarColor(
                '#e74c3c',
                '#f39c12',
                proporcion / 0.33
            );

        } else if (proporcion < 0.66) {

            return this.interpolarColor(
                '#f39c12',
                '#f1c40f',
                (proporcion - 0.33) / 0.33
            );

        } else {

            return this.interpolarColor(
                '#f1c40f',
                '#2ecc71',
                (proporcion - 0.66) / 0.34
            );
        }
    },

    interpolarColor: function(color1, color2, factor) {

        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);

        const r = Math.round(
            c1.r + (c2.r - c1.r) * factor
        );

        const g = Math.round(
            c1.g + (c2.g - c1.g) * factor
        );

        const b = Math.round(
            c1.b + (c2.b - c1.b) * factor
        );

        return `rgb(${r}, ${g}, ${b})`;
    },

    hexToRgb: function(hex) {

        const result =
            /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16)
              }
            : {
                  r: 0,
                  g: 0,
                  b: 0
              };
    },

    // ============================================
    // LEYENDA
    // ============================================
    mostrarLeyenda: function(tipo, datos) {

        const existente =
            document.querySelector('.mapa-leyenda');

        if (existente) {
            existente.remove();
        }

        const leyenda = document.createElement('div');

        leyenda.className = 'mapa-leyenda';

        // ============================================
        // CARGANDO
        // ============================================
        if (tipo === 'cargando') {

            leyenda.innerHTML = `
                <div class="leyenda-titulo">
                    🔄 ${datos}
                </div>
            `;
        }

        // ============================================
        // ECONÓMICO
        // ============================================
        else if (tipo === 'economico' && datos) {

            leyenda.innerHTML = `
                <div class="leyenda-titulo">
                    💰 PIB per cápita (USD)
                </div>

                <div class="leyenda-escala">
                    <div class="leyenda-color" style="background:#e74c3c;"></div>
                    <div class="leyenda-color" style="background:#f39c12;"></div>
                    <div class="leyenda-color" style="background:#f1c40f;"></div>
                    <div class="leyenda-color" style="background:#2ecc71;"></div>
                </div>

                <div class="leyenda-valores">
                    <span>${Math.round(datos.min).toLocaleString()}</span>
                    <span>${Math.round(datos.max).toLocaleString()}</span>
                </div>

                <div class="leyenda-fuente">
                    Fuente: Banco Mundial
                </div>
            `;
        }

        // ============================================
        // SIMULADO
        // ============================================
        else if (tipo === 'simulado') {

            leyenda.innerHTML = `
                <div class="leyenda-titulo">
                    🎲 DATOS SIMULADOS
                </div>

                <div class="leyenda-escala">
                    <div class="leyenda-color" style="background:#2ecc71;"></div>
                    <div class="leyenda-color" style="background:#f1c40f;"></div>
                    <div class="leyenda-color" style="background:#e74c3c;"></div>
                </div>

                <div class="leyenda-valores">
                    <span>Alto</span>
                    <span>Medio</span>
                    <span>Bajo</span>
                </div>

                <div class="leyenda-fuente">
                    Modo simulación
                </div>
            `;
        }

        document
            .querySelector('.mapa-container')
            ?.appendChild(leyenda);
    },

    ocultarLeyenda: function() {

        const leyenda =
            document.querySelector('.mapa-leyenda');

        if (leyenda) {
            leyenda.remove();
        }
    },

    // ============================================
    // ACTIVAR CAPAS
    // ============================================
    activarCapa: async function(capa, activa) {

        if (!this.capaPaises) return;

        // Desactivar
        if (!activa) {

            this.resetearColores();
            this.ocultarLeyenda();

            return;
        }

        // ECONOMÍA
        if (capa === 'economico') {

            await this.colorearPorPIB();

        }

        // RESTO
        else {

            this.capaPaises.eachLayer(layer => {

                const valor = Math.random();

                let color = '#2ecc71';

                if (valor > 0.66) {
                    color = '#e74c3c';
                }
                else if (valor > 0.33) {
                    color = '#f1c40f';
                }

                layer.setStyle({
                    fillColor: color,
                    fillOpacity: 0.7,
                    color: '#ffffff',
                    weight: 1
                });
            });

            this.mostrarLeyenda('simulado');
        }
    },

    // ============================================
    // RESET
    // ============================================
    resetearColores: function() {

        if (!this.capaPaises) return;

        this.capaPaises.eachLayer(layer => {

            layer.setStyle({
                fillColor: '#2c3e50',
                fillOpacity: 0.3,
                color: '#4fc3f7',
                weight: 1
            });

            layer.unbindTooltip();

            const nombre =
                layer.feature?.properties?.ADMIN || '';

            layer.bindTooltip(nombre);
        });
    },

    // ============================================
    // BUSCADOR
    // ============================================
    buscarLugar: async function(texto) {

        if (!texto) return;

        try {

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&limit=1`
            );

            const data = await response.json();

            if (!data || !data[0]) {

                alert('No se encontró el lugar');

                return;
            }

            const lugar = data[0];

            const lat = parseFloat(lugar.lat);
            const lon = parseFloat(lugar.lon);

            this.map.setView([lat, lon], 10);

            if (this.marcadorBusqueda) {
                this.map.removeLayer(this.marcadorBusqueda);
            }

            this.marcadorBusqueda = L.marker([lat, lon])
                .addTo(this.map)
                .bindTooltip(lugar.display_name)
                .openTooltip();

        } catch (error) {

            console.error('❌ Error búsqueda:', error);
        }
    }
};

window.MapaMundial = MapaMundial;
