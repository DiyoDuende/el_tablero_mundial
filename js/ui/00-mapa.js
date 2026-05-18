// ============================================================
// MAPA MUNDIAL (Leaflet) + Datos reales del Banco Mundial
// ============================================================
const MapaMundial = {
  map: null,
  datosPaises: {},

  init: async function() {
    this.map = L.map('mapa-mundial').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    await this.cargarTodosLosDatos();
    await this.cargarMapa();
  },

  cargarMapa: async function() {
    const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
    const geojson = await response.json();
    L.geoJSON(geojson, {
      style: (feature) => this.estiloPais(feature),
      onEachFeature: (feature, layer) => this.onEachFeature(feature, layer)
    }).addTo(this.map);
  },

  cargarTodosLosDatos: async function() {
    const indicadores = {
      pib: 'NY.GDP.PCAP.PP.CD',
      poblacion: 'SP.POP.TOTL',
      desempleo: 'SL.UEM.TOTL.ZS',
      deuda: 'GC.DOD.TOTL.GD.ZS',
      co2: 'EN.ATM.CO2E.PC',
      energia: 'EG.USE.PCAP.KG.OE'
    };

    const paises = ['ESP', 'FRA', 'PRT', 'DEU', 'ITA', 'GBR', 'USA', 'CAN', 'MEX', 'BRA', 'ARG', 'CHN', 'JPN', 'IND', 'RUS', 'ZAF', 'AUS'];

    for (let code of paises) {
      this.datosPaises[code] = {};
      for (let [key, apiCode] of Object.entries(indicadores)) {
        let apiCountryCode = code;
        if (code === 'ESP') apiCountryCode = 'ES';
        const url = `https://api.allorigins.win/raw?url=https://api.worldbank.org/v2/country/${apiCountryCode}/indicator/${apiCode}?format=json`;
        try {
          const res = await fetch(url);
          const text = await res.text();
          const data = JSON.parse(text);
          const records = data[1] || [];
          const firstValid = records.find(r => r.valor !== null && r.valor !== undefined);
          const valor = firstValid?.valor;
          if (valor && !isNaN(parseFloat(valor))) {
            this.datosPaises[code][key] = parseFloat(valor);
            console.log(`✅ ${code} - ${key}: ${valor}`);
          } else {
            this.datosPaises[code][key] = null;
          }
        } catch(e) {
          this.datosPaises[code][key] = null;
        }
      }
      await new Promise(r => setTimeout(r, 100));
    }
    console.log("Datos cargados:", this.datosPaises);
  },

  estiloPais(feature) {
    const code = feature.properties?.ISO_A3;
    const pib = this.datosPaises[code]?.pib;
    let color = '#cccccc';
    if (pib) {
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
    const nombre = feature.properties?.NAME || code;
    layer.bindTooltip(nombre);
    layer.on('click', () => {
      if (window.UIPanelInfo) {
        window.UIPanelInfo.mostrarPais(code, nombre);
      }
    });
    const datos = this.datosPaises[code] || {};
    const pib = datos.pib ? `$${datos.pib.toLocaleString()}` : 'No disponible';
    layer.bindPopup(`<strong>${nombre}</strong><br>💰 PIB per cápita: ${pib}`);
  }
};

window.MapaMundial = MapaMundial;
