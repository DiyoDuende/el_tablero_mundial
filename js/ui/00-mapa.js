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
// CAPA ECONÓMICA CON DATOS REALES (CON FALLBACK SIMULADO)
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
        let usandoSimulados = false;
        
        // 1. Intentar cargar datos reales
        try {
            if (window.DatosReales && typeof DatosReales.obtenerValoresParaCapa === 'function') {
                console.log('🔄 Intentando cargar datos reales...');
                pibData = await DatosReales.obtenerValoresParaCapa();
                console.log('📊 Datos recibidos:', pibData);
                console.log('📊 Número de países con datos:', Object.keys(pibData).length);
            } else {
                console.warn('⚠️ DatosReales no disponible');
                throw new Error('DatosReales no disponible');
            }
            
            // Verificar si los datos son válidos (al menos un país con dato)
            if (!pibData || Object.keys(pibData).length === 0) {
                console.warn('⚠️ Datos reales vacíos');
                throw new Error('Datos reales vacíos');
            }
            
            console.log('✅ Usando datos reales del Banco Mundial');
            
        } catch (error) {
            console.warn('⚠️ No se pudieron cargar datos reales, usando simulación', error);
            usandoSimulados = true;
            // Datos simulados de respaldo (con más países)
            pibData = {
                'Spain': 29800, 'France': 42000, 'Germany': 51000, 'Italy': 35000,
                'Portugal': 23000, 'United States': 70000, 'China': 12000, 'Russia': 11500,
                'Brazil': 7500, 'India': 2100, 'Japan': 40000, 'Canada': 43000,
                'Mexico': 9000, 'Australia': 52000, 'South Africa': 6000,
                'United Kingdom': 46000, 'Netherlands': 53000, 'Sweden': 52000,
                'Norway': 67000, 'Switzerland': 82000, 'Argentina': 11000,
                'Chile': 15000, 'Colombia': 6600, 'Peru': 6700, 'Venezuela': 5000,
                'Egypt': 3800, 'Nigeria': 2300, 'Kenya': 2000
            };
        }
        
        // 2. Calcular min y max para la escala de colores
        let minPIB = Infinity, maxPIB = -Infinity;
        for (const valor of Object.values(pibData)) {
            if (typeof valor === 'number' && !isNaN(valor)) {
                if (valor > maxPIB) maxPIB = valor;
                if (valor < minPIB) minPIB = valor;
            }
        }
        
        console.log(`📊 Rango PIB: ${minPIB} - ${maxPIB}`);
        
        // 3. Colorear cada país
        let paisesColoreados = 0;
        this.capaPaises.eachLayer(layer => {
            const nombre = layer.feature?.properties?.ADMIN;
            if (!nombre) return;
            
            const pib = pibData[nombre];
            if (pib && typeof pib === 'number') {
                const color = this.obtenerColorPIB(pib, minPIB, maxPIB);
                layer.setStyle({ fillColor: color, fillOpacity: 0.7, color: '#fff', weight: 1 });
                layer.unbindTooltip();
                layer.bindTooltip(`${nombre}<br>💰 PIB per cápita: ${pib.toLocaleString()} USD`);
                paisesColoreados++;
            }
        });
        
        console.log(`🎨 Países coloreados: ${paisesColoreados}`);
        
        // 4. Mostrar leyenda
        if (usandoSimulados) {
            this.mostrarLeyenda('simulado', { min: minPIB, max: maxPIB });
        } else {
            this.mostrarLeyenda('economico', { min: minPIB, max: maxPIB });
        }
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

    mostrarLeyenda: function(tipo, datos) {
        const leyendaExistente = document.querySelector('.mapa-leyenda');
        if (leyendaExistente) leyendaExistente.remove();
        
        if (tipo === 'cargando') {
            const leyenda = document.createElement('div');
            leyenda.className = 'mapa-leyenda';
            leyenda.innerHTML = `<div class="leyenda-titulo">🔄 ${datos}</div>`;
            document.querySelector('.mapa-container')?.appendChild(leyenda);
        } else if (tipo === 'economico' && datos) {
            const minUSD = Math.round(datos.min);
            const maxUSD = Math.round(datos.max);
            const medio1 = Math.round(minUSD + (maxUSD - minUSD) * 0.33);
            const medio2 = Math.round(minUSD + (maxUSD - minUSD) * 0.66);
            
            const leyenda = document.createElement('div');
            leyenda.className = 'mapa-leyenda';
            leyenda.innerHTML = `
                <div class="leyenda-titulo">💰 PIB per cápita (USD)</div>
                <div class="leyenda-escala">
                    <div class="leyenda-color" style="background: #e74c3c;"></div>
                    <div class="leyenda-color" style="background: #f39c12;"></div>
                    <div class="leyenda-color" style="background: #f1c40f;"></div>
                    <div class="leyenda-color" style="background: #2ecc71;"></div>
                </div>
                <div class="leyenda-valores">
                    <span>${minUSD.toLocaleString()}</span>
                    <span>${medio1.toLocaleString()}</span>
                    <span>${medio2.toLocaleString()}</span>
                    <span>${maxUSD.toLocaleString()}</span>
                </div>
                <div class="leyenda-fuente">Fuente: Banco Mundial</div>
            `;
            document.querySelector('.mapa-container')?.appendChild(leyenda);
        } else if (tipo === 'simulado') {
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
        }
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
            return this.interpolarColor('#e74c3c', '#f39c12', proporcion / 0.33);
        } else if (proporcion < 0.66) {
            return this.interpolarColor('#f39c12', '#f1c40f', (proporcion - 0.33) / 0.33);
        } else {
            return this.interpolarColor('#f1c40f', '#2ecc71', (proporcion - 0.66) / 0.34);
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
