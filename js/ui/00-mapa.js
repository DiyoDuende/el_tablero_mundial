// js/ui/00-mapa.js
const MapaMundial = {
    map: null,
    capaPaises: null,
    capaActiva: null,
    marcadorBusqueda: null,
    geoJsonCargado: false,

    init: function() {
    console.log('🗺️ Inicializando mapa...');
    this.map = L.map('mapa-mundial', {
    center: [0, 0],
    zoom: 1.5,
    minZoom: 1.5,
    maxZoom: 8,
    zoomControl: true,
    maxBounds: [[-90, -180], [90, 180]],
    maxBoundsViscosity: 0.5
});
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 1
    }).addTo(this.map);
    
    this.cargarGeoJSON();
    console.log('✅ Mapa inicializado');
},   // ← LA COMA ES LO ÚNICO QUE FALTA

obtenerNombrePais: function(properties) {
    return properties?.ADMIN || properties?.name || properties?.NAME || '';
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
    
    // NUEVO: Mostrar dashboard con datos reales si existe
    if (window.DashboardReal) {
        const iso3 = this.obtenerISO3(nombre);
        if (iso3) {
            DashboardReal.mostrar(iso3);
        }
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

obtenerISO3: function(nombre) {
    const mapa = {
        // Europa Occidental
        'Spain': 'ESP', 'France': 'FRA', 'Germany': 'DEU', 'Italy': 'ITA',
        'Portugal': 'PRT', 'United Kingdom': 'GBR', 'Ireland': 'IRL',
        'Netherlands': 'NLD', 'Belgium': 'BEL', 'Luxembourg': 'LUX',
        'Switzerland': 'CHE', 'Austria': 'AUT', 'Denmark': 'DNK',
        'Sweden': 'SWE', 'Norway': 'NOR', 'Finland': 'FIN', 'Iceland': 'ISL',
        
        // Europa del Este
        'Poland': 'POL', 'Czech Republic': 'CZE', 'Slovakia': 'SVK',
        'Hungary': 'HUN', 'Romania': 'ROU', 'Bulgaria': 'BGR',
        'Slovenia': 'SVN', 'Croatia': 'HRV', 'Lithuania': 'LTU',
        'Latvia': 'LVA', 'Estonia': 'EST', 'Greece': 'GRC',
        
        // Península Balcánica
        'Albania': 'ALB', 'North Macedonia': 'MKD', 'Bosnia and Herzegovina': 'BIH',
        'Serbia': 'SRB', 'Montenegro': 'MNE', 'Kosovo': 'XKX',
        
        // América del Norte
        'United States of America': 'USA', 'Canada': 'CAN', 'Mexico': 'MEX',
        
        // Centroamérica y Caribe
        'Guatemala': 'GTM', 'Belize': 'BLZ', 'Honduras': 'HND',
        'El Salvador': 'SLV', 'Nicaragua': 'NIC', 'Costa Rica': 'CRI',
        'Panama': 'PAN', 'Cuba': 'CUB', 'Dominican Republic': 'DOM',
        'Haiti': 'HTI', 'Jamaica': 'JAM', 'Bahamas': 'BHS',
        'Trinidad and Tobago': 'TTO', 'Barbados': 'BRB',
        
        // América del Sur
        'Brazil': 'BRA', 'Argentina': 'ARG', 'Chile': 'CHL',
        'Colombia': 'COL', 'Peru': 'PER', 'Venezuela': 'VEN',
        'Uruguay': 'URY', 'Paraguay': 'PRY', 'Bolivia': 'BOL',
        'Ecuador': 'ECU', 'Guyana': 'GUY', 'Suriname': 'SUR',
        
        // Asia Oriental
        'China': 'CHN', 'Japan': 'JPN', 'South Korea': 'KOR',
        'North Korea': 'PRK', 'Mongolia': 'MNG', 'Taiwan': 'TWN',
        
        // Sudeste Asiático
        'Indonesia': 'IDN', 'Malaysia': 'MYS', 'Thailand': 'THA',
        'Vietnam': 'VNM', 'Philippines': 'PHL', 'Singapore': 'SGP',
        'Myanmar': 'MMR', 'Cambodia': 'KHM', 'Laos': 'LAO',
        'Brunei': 'BRN', 'East Timor': 'TLS',
        
        // Asia del Sur
        'India': 'IND', 'Pakistan': 'PAK', 'Bangladesh': 'BGD',
        'Nepal': 'NPL', 'Sri Lanka': 'LKA', 'Bhutan': 'BTN',
        'Maldives': 'MDV',
        
        // Asia Central
        'Kazakhstan': 'KAZ', 'Uzbekistan': 'UZB', 'Turkmenistan': 'TKM',
        'Kyrgyzstan': 'KGZ', 'Tajikistan': 'TJK', 'Afghanistan': 'AFG',
        
        // Oriente Medio
        'Turkey': 'TUR', 'Saudi Arabia': 'SAU', 'Iran': 'IRN',
        'Iraq': 'IRQ', 'Syria': 'SYR', 'Jordan': 'JOR',
        'Lebanon': 'LBN', 'Israel': 'ISR', 'Palestine': 'PSE',
        'United Arab Emirates': 'ARE', 'Qatar': 'QAT', 'Kuwait': 'KWT',
        'Oman': 'OMN', 'Yemen': 'YEM', 'Bahrain': 'BHR',
        
        // África del Norte
        'Egypt': 'EGY', 'Morocco': 'MAR', 'Algeria': 'DZA',
        'Tunisia': 'TUN', 'Libya': 'LBY', 'Sudan': 'SDN',
        'South Sudan': 'SSD', 'Mauritania': 'MRT',
        
        // África Occidental
        'Nigeria': 'NGA', 'Ghana': 'GHA', 'Ivory Coast': 'CIV',
        'Senegal': 'SEN', 'Mali': 'MLI', 'Burkina Faso': 'BFA',
        'Niger': 'NER', 'Guinea': 'GIN', 'Guinea-Bissau': 'GNB',
        'Cabo Verde': 'CPV', 'Gambia': 'GMB', 'Benin': 'BEN',
        'Togo': 'TGO', 'Liberia': 'LBR', 'Sierra Leone': 'SLE',
        
        // África Central
        'Cameroon': 'CMR', 'Central African Republic': 'CAF',
        'Chad': 'TCD', 'Gabon': 'GAB', 'Republic of the Congo': 'COG',
        'Democratic Republic of the Congo': 'COD', 'Equatorial Guinea': 'GNQ',
        'São Tomé and Principe': 'STP',
        
        // África Oriental
        'Ethiopia': 'ETH', 'Kenya': 'KEN', 'Tanzania': 'TZA',
        'Uganda': 'UGA', 'Rwanda': 'RWA', 'Burundi': 'BDI',
        'Somalia': 'SOM', 'Djibouti': 'DJI', 'Eritrea': 'ERI',
        'South Africa': 'ZAF', 'Zambia': 'ZMB', 'Zimbabwe': 'ZWE',
        'Mozambique': 'MOZ', 'Malawi': 'MWI', 'Angola': 'AGO',
        'Botswana': 'BWA', 'Namibia': 'NAM', 'Eswatini': 'SWZ',
        'Lesotho': 'LSO', 'Madagascar': 'MDG', 'Seychelles': 'SYC',
        'Comoros': 'COM', 'Mauritius': 'MUS',
        
        // Oceanía
        'Australia': 'AUS', 'New Zealand': 'NZL', 'Papua New Guinea': 'PNG',
        'Fiji': 'FJI', 'Solomon Islands': 'SLB', 'Vanuatu': 'VUT',
        'Samoa': 'WSM', 'Tonga': 'TON', 'Kiribati': 'KIR',
        'Micronesia': 'FSM', 'Marshall Islands': 'MHL', 'Palau': 'PLW',
        'Nauru': 'NRU', 'Tuvalu': 'TUV',
        
        // Territorios especiales (sin datos económicos, pero los dejamos)
        'Greenland': 'GRL', 'Puerto Rico': 'PRI', 'Hong Kong': 'HKG',
        'Macao': 'MAC', 'New Caledonia': 'NCL', 'French Polynesia': 'PYF'
    };
    
    return mapa[nombre] || null;
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
    // CAPA ECONÓMICA (acepta tanto 'economia' como 'economico')
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
            
            // DATOS SIMULADOS DE PIB
            const pibData = {
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
                'Saudi Arabia': 23500, 'United Arab Emirates': 45000
            };
            
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
                
                console.log('🌍 País GeoJSON (económico):', nombreGeo);
                
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
                    layer.bindTooltip(`${nombreGeo}<br>💰 PIB per cápita: ${pib.toLocaleString()} USD`);
                    paisesColoreados++;
                }
            });
            
            console.log(`🎨 Capa económica: ${paisesColoreados} países coloreados`);
            this.mostrarLeyendaEconomica();
            
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

    mostrarLeyendaEconomica: function() {
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
            <div class="leyenda-fuente">Datos simulados</div>
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

// ============================================
// BUSCADOR GLOBAL CON NOMINATIM + GADM
// ============================================

/**
 * Busca cualquier lugar del mundo y centra el mapa
 * @param {string} texto - Nombre del lugar a buscar (ej: "Nerva", "Paris", "New York")
 */
async function buscarLugarGlobal(texto) {
    if (!texto || texto.trim() === "") return;
    
    console.log("🔍 Buscando lugar:", texto);
    
    var container = document.getElementById('dashboard-container');
    if (container) {
        container.innerHTML = '<div class="loading-spinner">🌐 Buscando ' + texto + '...</div>';
    }
    
    var info = await GADM.obtenerInfoLugar(texto);
    
    if (!info) {
        console.warn("❌ No se encontró:", texto);
        if (container) {
            container.innerHTML = '<div class="dashboard-error">⚠️ No se encontró el lugar: "' + texto + '"</div>';
        }
        alert("❌ No se encontró: " + texto);
        return;
    }
    
    console.log("📍 Lugar encontrado:", info);
    
    // Centrar mapa
    if (typeof mapaGlobal !== 'undefined' && mapaGlobal) {
        mapaGlobal.setView([info.lat, info.lon], 12);
        if (window.marcadorBusqueda) mapaGlobal.removeLayer(window.marcadorBusqueda);
        window.marcadorBusqueda = L.marker([info.lat, info.lon]).addTo(mapaGlobal)
            .bindTooltip(info.nombre).openTooltip();
    }
    
    // Construir jerarquía para mostrar
    var nombreMostrar = info.nombre;
    var nivel = 'lugar';
    
    if (info.municipio) {
        nivel = 'municipio';
        nombreMostrar = info.municipio;
    } else if (info.provincia) {
        nivel = 'provincia';
        nombreMostrar = info.provincia;
    } else if (info.region) {
        nivel = 'region';
        nombreMostrar = info.region;
    } else if (info.pais) {
        nivel = 'pais';
        nombreMostrar = info.pais;
    }
    
    // Mostrar en el dashboard
    if (window.DashboardReal && info.pais_codigo) {
        DashboardReal.mostrar(info.pais_codigo, nivel, nombreMostrar);
        
        // Añadir aviso de ubicación
        setTimeout(function() {
            var aviso = document.querySelector('.dashboard-real .aviso-estimacion');
            if (!aviso && container) {
                var avisoDiv = document.createElement('div');
                avisoDiv.className = 'aviso-estimacion';
                avisoDiv.innerHTML = '📍 Ubicación: ' + info.nombre + ' · Coordenadas: ' + info.lat.toFixed(4) + '°, ' + info.lon.toFixed(4) + '°';
                var header = container.querySelector('.dashboard-header');
                if (header) header.insertAdjacentElement('afterend', avisoDiv);
            }
        }, 100);
    } else if (info.pais) {
        if (container) {
            container.innerHTML = '<div class="dashboard-info">📍 ' + info.nombre + '<br>País: ' + info.pais + '<br>Lat: ' + info.lat.toFixed(4) + ', Lon: ' + info.lon.toFixed(4) + '</div>';
        }
    }
}

// ============================================
// CONECTAR EL BUSCADOR EXISTENTE
// ============================================

// Buscador rápido del panel lateral (id="buscador-rapido")
var buscadorRapido = document.getElementById('buscador-rapido');
if (buscadorRapido) {
    var nuevoBuscadorRapido = buscadorRapido.cloneNode(true);
    buscadorRapido.parentNode.replaceChild(nuevoBuscadorRapido, buscadorRapido);
    
    nuevoBuscadorRapido.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarLugarGlobal(e.target.value.trim());
        }
    });
    console.log("✅ Buscador rápido conectado a GADM");
}

// Buscador global superior (si existe)
var buscadorGlobal = document.getElementById('buscador-global');
if (buscadorGlobal) {
    var nuevoBuscadorGlobal = buscadorGlobal.cloneNode(true);
    buscadorGlobal.parentNode.replaceChild(nuevoBuscadorGlobal, buscadorGlobal);
    
    nuevoBuscadorGlobal.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarLugarGlobal(e.target.value.trim());
        }
    });
    
    var btnBuscar = document.getElementById('btn-buscar');
    if (btnBuscar) {
        var nuevoBtnBuscar = btnBuscar.cloneNode(true);
        btnBuscar.parentNode.replaceChild(nuevoBtnBuscar, btnBuscar);
        nuevoBtnBuscar.addEventListener('click', function() {
            var input = document.getElementById('buscador-global');
            if (input) buscarLugarGlobal(input.value.trim());
        });
    }
    console.log("✅ Buscador global conectado a GADM");
}

// Exportar función para uso global
window.buscarLugarGlobal = buscarLugarGlobal;

window.MapaMundial = MapaMundial;
