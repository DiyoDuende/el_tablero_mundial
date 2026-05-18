// ============================================================
// MAPA MUNDIAL (Leaflet) + Datos reales del Banco Mundial
// ============================================================
const MapaMundial = {
  map: null,
  datosPaises: {},   // Almacena indicadores por código ISO3

  // Inicializa el mapa y carga los datos
  init: async function() {
    // Crear el mapa centrado en el mundo
    this.map = L.map('mapa-mundial').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Cargar datos económicos desde el Banco Mundial
    await this.cargarTodosLosDatos();
    // Cargar las fronteras de los países y dibujar el mapa
    await this.cargarMapa();
  },

  // Carga el GeoJSON de países (fuente externa confiable)
  cargarMapa: async function() {
    const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
    const geojson = await response.json();
    
    L.geoJSON(geojson, {
      style: (feature) => this.estiloPais(feature),
      onEachFeature: (feature, layer) => this.onEachFeature(feature, layer)
    }).addTo(this.map);
  },

  // Obtiene todos los indicadores del Banco Mundial para cada país (versión con proxy CORS)
  cargarTodosLosDatos: async function() {
    const indicadores = {
      pib: 'NY.GDP.PCAP.PP.CD',      // PIB per cápita (PPA)
      poblacion: 'SP.POP.TOTL',
      desempleo: 'SL.UEM.TOTL.ZS',
      deuda: 'GC.DOD.TOTL.GD.ZS',
      co2: 'EN.ATM.CO2E.PC',
      energia: 'EG.USE.PCAP.KG.OE'
    };

    // Lista de países principales (para no saturar la API)
    const paises = ['ESP', 'FRA', 'PRT', 'DEU', 'ITA', 'GBR', 'USA', 'CAN', 'MEX', 'BRA', 'ARG', 'CHN', 'JPN', 'IND', 'RUS', 'ZAF', 'AUS'];

    for (let code of paises) {
      this.datosPaises[code] = {};
      for (let [key, apiCode] of Object.entries(indicadores)) {
        // Convertir código para la API (ESP -> ES)
        let apiCountryCode = code;
        if (code === 'ESP') apiCountryCode = 'ES';
        
        // Usamos un proxy CORS para evitar bloqueos
        const url = `https://api.allorigins.win/raw?url=https://api.worldbank.org/v2/country/${apiCountryCode}/indicator/${apiCode}?format=json`;
        try {
          const res = await fetch(url);
          const text = await res.text();
          const data = JSON.parse(text);
          const records = data[1] || [];
          // Buscar el primer valor no nulo (la API devuelve las claves en español: "valor")
          const firstValid = records.find(r => r.valor !== null && r.valor !== undefined);
          const valor = firstValid?.valor;
          if (valor !== null && valor !== undefined && !isNaN(parseFloat(valor))) {
            this.datosPaises[code][key] = parseFloat(valor);
            console.log(`✅ ${code} - ${key}: ${valor}`);
          } else {
            this.datosPaises[code][key] = null;
            console.log(`⚠️ ${code} - ${key}: sin datos válidos`);
          }
        } catch(e) {
          this.datosPaises[code][key] = null;
          console.error(`❌ Error en ${code} - ${key}:`, e);
        }
      }
      await new Promise(r => setTimeout(r, 100));
    }
    console.log("✅ Datos cargados:", this.datosPaises);
  },

  // Define el color del país según su PIB per cápita
  estiloPais(feature) {
    const code = feature.properties?.ISO_A3;
    const pib = this.datosPaises[code]?.pib;
    let color = '#cccccc';
    if (pib !== null && pib !== undefined) {
      if (pib > 50000) color = '#1b5e20';
      else if (pib > 30000) color = '#2e7d32';
      else if (pib > 15000) color = '#4caf50';
      else if (pib > 5000) color = '#ff9800';
      else color = '#d32f2f';
    }
    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  },

  // Asocia eventos a cada país (tooltip y clic para actualizar panel)
  onEachFeature(feature, layer) {
    const code = feature.properties?.ISO_A3;
    const nombre = feature.properties?.NAME || code;
    
    // Tooltip con el nombre del país
    layer.bindTooltip(nombre);

    // Al hacer clic, actualizar el panel lateral
    layer.on('click', () => {
      if (window.UIPanelInfo) {
        // Llamar a mostrarPais con el código y el nombre
        window.UIPanelInfo.mostrarPais(code, nombre);
      }
    });

    // Popup opcional con el PIB (para información rápida)
    const datos = this.datosPaises[code] || {};
    const pib = datos.pib ? `$${datos.pib.toLocaleString()}` : 'No disponible';
    layer.bindPopup(`<strong>${nombre}</strong><br>💰 PIB per cápita: ${pib}<br><em>Banco Mundial</em>`);
  }
};

window.MapaMundial = MapaMundial;
