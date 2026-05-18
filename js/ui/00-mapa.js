// js/ui/00-mapa.js - Mapa con datos reales del Banco Mundial
const MapaMundial = {
  map: null,
  datosPaises: {},

  init: async function() {
    // Inicializar el mapa
    this.map = L.map('mapa-mundial').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Cargar datos económicos y luego el mapa
    await this.cargarTodosLosDatos();
    await this.cargarMapa();
  },

  async cargarMapa() {
    // Cargar GeoJSON de países desde una URL pública estable
    const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
    const geojson = await response.json();
    
    L.geoJSON(geojson, {
      style: (feature) => this.estiloPais(feature),
      onEachFeature: (feature, layer) => this.onEachFeature(feature, layer)
    }).addTo(this.map);
  },

  async cargarTodosLosDatos() {
    // Indicadores del Banco Mundial
    const indicadores = {
      pib: 'NY.GDP.PCAP.PP.CD',      // PIB per cápita (PPA)
      poblacion: 'SP.POP.TOTL',
      desempleo: 'SL.UEM.TOTL.ZS',
      deuda: 'GC.DOD.TOTL.GD.ZS',
      co2: 'EN.ATM.CO2E.PC',
      energia: 'EG.USE.PCAP.KG.OE'
    };

    // Obtener lista de códigos ISO3 desde el GeoJSON remoto
    const geojsonResp = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
    const geojson = await geojsonResp.json();
    const paises = geojson.features.map(f => f.properties.ISO_A3).filter(c => c && c !== '-99');

    for (let code of paises) {
      this.datosPaises[code] = {};
      for (let [key, apiCode] of Object.entries(indicadores)) {
        const url = `https://api.worldbank.org/v2/country/${code}/indicator/${apiCode}?format=json`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          const valor = data[1]?.[0]?.value;
          if (valor && !isNaN(parseFloat(valor))) {
            this.datosPaises[code][key] = parseFloat(valor);
          } else {
            this.datosPaises[code][key] = null;
          }
        } catch(e) {
          this.datosPaises[code][key] = null;
        }
      }
      await new Promise(r => setTimeout(r, 50));
    }
  },

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

  onEachFeature(feature, layer) {
    const code = feature.properties?.ISO_A3;
    const datos = this.datosPaises[code] || {};
    const pib = datos.pib ? `$${datos.pib.toLocaleString()}` : 'No disponible';
    const pob = datos.poblacion ? datos.poblacion.toLocaleString() : 'No disponible';
    const desempleo = datos.desempleo ? `${datos.desempleo}%` : 'No disponible';
    const deuda = datos.deuda ? `${datos.deuda}%` : 'No disponible';
    const co2 = datos.co2 ? `${datos.co2} t` : 'No disponible';
    const energia = datos.energia ? `${datos.energia.toLocaleString()} kg` : 'No disponible';
    
    layer.bindTooltip(feature.properties?.NAME || code);
    layer.bindPopup(`
      <strong>${feature.properties?.NAME || code}</strong><br>
      💰 PIB per cápita: ${pib}<br>
      👥 Población: ${pob}<br>
      📉 Desempleo: ${desempleo}<br>
      💸 Deuda pública (% PIB): ${deuda}<br>
      🌍 CO₂ per cápita: ${co2}<br>
      🔋 Energía per cápita: ${energia}<br>
      <em>Datos: Banco Mundial (último año disponible)</em>
    `);
  }
};

window.MapaMundial = MapaMundial;
