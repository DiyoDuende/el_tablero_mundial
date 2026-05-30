// js/ui/00-mapa.js
const MapaMundial = {
    map: null,
    capaPaises: null,
    capaActiva: null,
    marcadorBusqueda: null,
    geoJsonCargado: false,

    init: function() {
        console.log('🗺️ Inicializando mapa...');
        this.map = L.map('mapa-mundial').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
        this.cargarGeoJSON();
        console.log('✅ Mapa listo');
    },

    // Función auxiliar para obtener el nombre del país de forma robusta
    obtenerNombrePais: function(properties) {
        return properties?.ADMIN || properties?.name || properties?.NAME || '';
    },

    cargarGeoJSON: function() {
        const url = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('📦 GeoJSON cargado, procesando países...');
                
                this.capaPaises = L.geoJSON(data, {
                    style: {
                        fill: true,
                        fillColor: '#2c3e50',
                        fillOpacity: 0.3,
                        color: '#4fc3f7',
                        weight: 1,
                        opacity: 1
                    },
                    onEachFeature: (feature, layer) => {
                        const nombre = this.obtenerNombrePais(feature.properties);
                        if (nombre) {
                            console.log('🌍 País GeoJSON (tooltip):', nombre);
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
                
                this.geoJsonCargado = true;
                console.log('✅ GeoJSON añadido al mapa');
            })
            .catch(error => console.error('❌ Error cargando GeoJSON:', error));
    },

    normalizarId: function(nombre) {
        return nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },

    irAPais: function(paisId) {
        if (!this.capaPaises) return;
        this.capaPaises.eachLayer(layer => {
            const nombre = this.normalizarId(this.obtenerNombrePais(layer.feature?.properties));
            if (nombre === paisId) {
                this.map.fitBounds(layer.getBounds());
                if (window.UIPanelInfo) UIPanelInfo.mostrarPais(paisId);
            }
        });
    },

    // ============================================
    // CAPA ECONÓMICA (con datos REALES + fallback simulado)
    // ============================================
    activarCapa: async function(capa, activa) {
        console.log(`🎨 CAPA recibida: "${capa}", activa: ${activa}`);
        
        if (!this.capaPaises) {
            console.warn('⚠️ capaPaises no está listo todavía');
            return;
        }
        
        if (!activa) {
            this.resetearColores();
            const leyenda = document.querySelector('.mapa-leyenda');
            if (leyenda) leyenda.remove();
            return;
        }
        
        // Aceptar tanto 'economia' como 'economico'
        if (capa === 'economia' || capa === 'economico') {
            console.log('🎨 Aplicando capa ECONÓMICA');
            
            this.mostrarLeyendaCargando('Cargando datos del Banco Mundial...');
            
            let pibData = null;
            let usandoReales = false;
            
            // 1. Intentar cargar datos reales
            try {
                if (window.DatosReales && typeof DatosReales.obtenerValoresParaCapa === 'function') {
                    const resultado = await DatosReales.obtenerValoresParaCapa();
                    if (resultado.esReal && resultado.datos && Object.keys(resultado.datos).length > 0) {
                        pibData = resultado.datos;
                        usandoReales = true;
                        console.log(`✅ Usando datos REALES: ${Object.keys(pibData).length} países`);
                    } else {
                        throw new Error('No se obtuvieron datos reales');
                    }
                } else {
                    throw new Error('DatosReales no disponible');
                }
            } catch (error) {
                console.warn('⚠️ Usando datos SIMULADOS (fallback):', error.message);
                usandoReales = false;
                // Datos simulados de respaldo
                pibData = {
                    'Spain': 29800, 'France': 42000, 'Germany': 51000, 'Italy': 35000,
                    'Portugal': 23000, 'United States': 70000, 'China': 12000, 'Russia': 11500,
                    'Brazil': 7500, 'India': 2100, 'Japan': 40000, 'Canada': 43000,
                    'Mexico': 9000, 'Australia': 52000, 'South Africa': 6000,
                    'United Kingdom': 46000, 'Netherlands': 53000, 'Sweden': 52000,
                    'Norway': 67000, 'Switzerland': 82000, 'Argentina': 11000,
                    'Chile': 15000, 'Colombia': 6600, 'Peru': 6700, 'Venezuela': 5000,
                    'Egypt': 3800, 'Nigeria': 2300, 'Kenya': 2000, 'Indonesia': 4300,
                    'Pakistan': 1500, 'Bangladesh': 2200, 'Vietnam': 3700, 'Thailand': 7200,
                    'Poland': 18000, 'Ukraine': 4800, 'Romania': 15000, 'Greece': 20000,
                    'Austria': 51000, 'Belgium': 48000, 'Czech Republic': 26000,
                    'Denmark': 61000, 'Finland': 49000, 'Hungary': 17000, 'Ireland': 89000,
                    'Lithuania': 20000, 'Luxembourg': 115000, 'Slovakia': 19000,
                    'Slovenia': 26000, 'Bulgaria': 10000, 'Croatia': 15000,
                    'Turkey': 9500, 'South Korea': 33000, 'Israel': 52000,
                    'Saudi Arabia': 23500, 'United Arab Emirates': 45000,
                    'New Zealand': 48000, 'Iceland': 67000, 'Morocco': 3800,
                    'Algeria': 4300, 'Tunisia': 3800, 'Serbia': 9200, 'Belarus': 7300,
                    'Estonia': 27000, 'Latvia': 21000, 'Uruguay': 17000, 'Paraguay': 5500,
                    'Bolivia': 3500, 'Ecuador': 6300, 'Costa Rica': 13000, 'Panama': 16000,
                    'Cuba': 8800, 'Dominican Republic': 8700, 'Jordan': 4400, 'Lebanon': 4600,
                    'Oman': 16000, 'Qatar': 61000, 'Kuwait': 32000, 'Bahrain': 24000,
                    'Cyprus': 31000, 'Malta': 30000, 'Albania': 5400, 'North Macedonia': 6700,
                    'Montenegro': 9200, 'Georgia': 5000, 'Armenia': 4900, 'Azerbaijan': 4800,
                    'Kazakhstan': 10000, 'Mongolia': 4500, 'Nepal': 1300, 'Sri Lanka': 3700,
                    'Myanmar': 1300, 'Cambodia': 1700, 'Laos': 2500, 'Fiji': 5800,
                    'Jamaica': 5200, 'Trinidad and Tobago': 16000, 'Bahamas': 34000,
                    'Barbados': 18000, 'Mauritius': 11000, 'Maldives': 11000
                };
            }
            
            // Calcular min y max para la escala de colores
            let minPIB = Infinity, maxPIB = -Infinity;
            for (const valor of Object.values(pibData)) {
                if (valor > maxPIB) maxPIB = valor;
                if (valor < minPIB) minPIB = valor;
            }
            
            console.log(`📊 Rango PIB: ${minPIB} - ${maxPIB}`);
            
            // Traducción de nombres del GeoJSON a nombres cortos
            const traduccionNombres = {
                'United States of America': 'United States',
                'Russian Federation': 'Russia',
                'Czechia': 'Czech Republic',
                'Korea, Republic of': 'South Korea',
                'Republic of Korea': 'South Korea',
                'Iran (Islamic Republic of)': 'Iran',
                'Viet Nam': 'Vietnam',
                'Syrian Arab Republic': 'Syria',
                'Lao PDR': 'Laos',
                'United Republic of Tanzania': 'Tanzania',
                'Moldova, Republic of': 'Moldova',
                'Bolivia (Plurinational State of)': 'Bolivia',
                'Venezuela (Bolivarian Republic of)': 'Venezuela',
                'Türkiye': 'Turkey',
                'Côte d\'Ivoire': 'Ivory Coast',
                "Democratic Republic of the Congo": "DR Congo",
                "Republic of the Congo": "Congo",
                "Bosnia and Herzegovina": "Bosnia and Herzegovina",
                "North Macedonia": "North Macedonia",
                "Equatorial Guinea": "Equatorial Guinea",
                "Central African Republic": "Central African Republic",
                "South Sudan": "South Sudan",
                "Western Sahara": "Western Sahara"
            };
            
            // Colorear cada país
            let paisesColoreados = 0;
            const self = this;
            
            this.capaPaises.eachLayer(function(layer) {
                const nombreGeo = self.obtenerNombrePais(layer.feature?.properties);
                if (!nombreGeo) return;
                
                const nombreNormalizado = traduccionNombres[nombreGeo] || nombreGeo;
                const pib = pibData[nombreNormalizado];
                
                if (typeof pib === 'number') {
                    const color = self.obtenerColorPIB(pib);
                    layer.setStyle({
                        fill: true,
                        fillColor: color,
                        fillOpacity: 0.85,
                        color: '#222',
                        weight: 0.5,
                        opacity: 1
                    });
                    layer.unbindTooltip();
                    const fuente = usandoReales ? '' : ' (simulado)';
                    layer.bindTooltip(`${nombreGeo}<br>💰 PIB per cápita: ${pib.toLocaleString()} USD${fuente}`);
                    paisesColoreados++;
                }
            });
            
            console.log(`🎨 Capa económica: ${paisesColoreados} países coloreados (${usandoReales ? 'REALES' : 'SIMULADOS'})`);
            
            // Mostrar leyenda con fuente correcta
            if (usandoReales) {
                this.mostrarLeyendaEconomicaReal();
            } else {
                this.mostrarLeyendaEconomicaSimulada();
            }
            
        } else {
            // Resto de capas: colores aleatorios
            console.log(`🎨 Aplicando capa SIMULADA: ${capa}`);
            this.mostrarLeyendaSimulada();
            this.capaPaises.eachLayer(layer => {
                const valor = Math.random();
                let color = '#2ecc71';
                if (valor > 0.66) color = '#e74c3c';
                else if (valor > 0.33) color = '#f1c40f';
                layer.setStyle({
                    fill: true,
                    fillColor: color,
                    fillOpacity: 0.85,
                    color: '#222',
                    weight: 0.5,
                    opacity: 1
                });
            });
        }
    },

    resetearColores: function() {
        if (!this.capaPaises) return;
        const self = this;
        this.capaPaises.eachLayer(layer => {
            const nombre = self.obtenerNombrePais(layer.feature?.properties);
            layer.setStyle({
                fill: true,
                fillColor: '#2c3e50',
                fillOpacity: 0.3,
                color: '#4fc3f7',
                weight: 1,
                opacity: 1
            });
            layer.unbindTooltip();
            layer.bindTooltip(nombre);
        });
    },

    // Escala de colores simplificada y muy visible
    obtenerColorPIB: function(pib) {
        if (pib > 60000) return '#00ff00';      // Verde brillante
        if (pib > 30000) return '#88ff00';      // Verde claro
        if (pib > 15000) return '#ffff00';      // Amarillo
        if (pib > 7000) return '#ff9900';       // Naranja
        return '#ff0000';                        // Rojo
    },

    mostrarLeyendaEconomicaReal: function() {
        const leyendaExistente = document.querySelector('.mapa-leyenda');
        if (leyendaExistente) leyendaExistente.remove();
        
        const leyenda = document.createElement('div');
        leyenda.className = 'mapa-leyenda';
        leyenda.innerHTML = `
            <div class="leyenda-titulo">💰 PIB per cápita (USD)</div>
            <div class="leyenda-escala">
                <div class="leyenda-color" style="background: #ff0000;"></div>
                <div class="leyenda-color" style="background: #ff9900;"></div>
                <div class="leyenda-color" style="background: #ffff00;"></div>
                <div class="leyenda-color" style="background: #88ff00;"></div>
                <div class="leyenda-color" style="background: #00ff00;"></div>
            </div>
            <div class="leyenda-valores">
                <span>< 7k</span>
                <span>7-15k</span>
                <span>15-30k</span>
                <span>30-60k</span>
                <span>> 60k</span>
            </div>
            <div class="leyenda-fuente">Fuente: Banco Mundial</div>
        `;
        document.getElementById('mapa-mundial')?.parentNode?.appendChild(leyenda);
    },

    mostrarLeyendaEconomicaSimulada: function() {
        const leyendaExistente = document.querySelector('.mapa-leyenda');
        if (leyendaExistente) leyendaExistente.remove();
        
        const leyenda = document.createElement('div');
        leyenda.className = 'mapa-leyenda';
        leyenda.innerHTML = `
            <div class="leyenda-titulo">💰 PIB per cápita (USD)</div>
            <div class="leyenda-escala">
                <div class="leyenda-color" style="background: #ff0000;"></div>
                <div class="leyenda-color" style="background: #ff9900;"></div>
                <div class="leyenda-color" style="background: #ffff00;"></div>
                <div class="leyenda-color" style="background: #88ff00;"></div>
                <div class="leyenda-color" style="background: #00ff00;"></div>
            </div>
            <div class="leyenda-valores">
                <span>< 7k</span>
                <span>7-15k</span>
                <span>15-30k</span>
                <span>30-60k</span>
                <span>> 60k</span>
            </div>
            <div class="leyenda-fuente">Datos simulados (fallback)</div>
        `;
        document.getElementById('mapa-mundial')?.parentNode?.appendChild(leyenda);
    },

    mostrarLeyendaSimulada: function() {
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
        document.getElementById('mapa-mundial')?.parentNode?.appendChild(leyenda);
    },

    mostrarLeyendaCargando: function(mensaje) {
        const leyendaExistente = document.querySelector('.mapa-leyenda');
        if (leyendaExistente) leyendaExistente.remove();
        
        const leyenda = document.createElement('div');
        leyenda.className = 'mapa-leyenda';
        leyenda.innerHTML = `<div class="leyenda-titulo">🔄 ${mensaje || 'Cargando datos...'}</div>`;
        document.getElementById('mapa-mundial')?.parentNode?.appendChild(leyenda);
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
