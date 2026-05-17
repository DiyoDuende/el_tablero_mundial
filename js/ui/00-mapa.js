// js/ui/00-mapa.js - Mapa con datos reales del Banco Mundial
const MapaMundial = {
  map: null,
  datosPaises: {}, // Almacenará PIB, población, etc.

  init: async function() {
    this.map = L.map('mapa-mundial').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Cargar datos económicos del Banco Mundial
    await this.cargarDatosMundo();

    // Cargar GeoJSON de países
    const response = await fetch('js/data/countries.geojson');
    const geojson = await response.json();
    
    // Colorear según PIB per cápita
    L.geoJSON(geojson, {
      style: (feature) => this.estiloPais(feature),
      onEachFeature: (feature, layer) => this.onEachFeature(feature, layer)
    }).addTo(this.map);
  },

  async cargarDatosMundo() {
    // Lista de códigos de país (ISO 3) para consultar. Usamos solo los principales.
    const paises = ['ESP', 'FRA', 'PRT', 'DEU', 'ITA', 'USA', 'CHN', 'BRA', 'ARG', 'MEX', 'CAN', 'GBR', 'RUS', 'IND', 'ZAF', 'AUS'];
    
    for (let code of paises) {
      // PIB per cápita (USD)
      const pibUrl = `https://api.worldbank.org/v2/country/${code}/indicator/NY.GDP.PCAP.PP.CD?format=json`;
      try {
        const res = await fetch(pibUrl);
        const data = await res.json();
        const pibValor = data[1]?.[0]?.value;
        this.datosPaises[code] = { pib: pibValor ? parseFloat(pibValor) : null };
      } catch(e) { console.warn(`Error PIB ${code}`); }
      
      // Población
      const pobUrl = `https://api.worldbank.org/v2/country/${code}/indicator/SP.POP.TOTL?format=json`;
      try {
        const res = await fetch(pobUrl);
        const data = await res.json();
        const pobValor = data[1]?.[0]?.value;
        if (pobValor) this.datosPaises[code].poblacion = parseInt(pobValor);
      } catch(e) { console.warn(`Error población ${code}`); }
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
    } else {
      color = '#9e9e9e'; // Sin datos
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
    
    layer.bindTooltip(feature.properties?.NAME || code);
    layer.bindPopup(`
      <strong>${feature.properties?.NAME || code}</strong><br>
      💰 PIB per cápita: ${pib}<br>
      👥 Población: ${pob}<br>
      <em>Datos: Banco Mundial</em>
    `);
  }
};

window.MapaMundial = MapaMundial;
