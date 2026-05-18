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

  // Obtiene todos los indicadores del Banco Mundial para cada país
  cargarTodosLosDatos: async function() {
    const indicadores = {
      pib: 'NY.GDP.PCAP.PP.CD',      // PIB per cápita (PPA)
      poblacion: 'SP.POP.TOTL',
      desempleo: 'SL.UEM.TOTL.ZS',
      deuda: 'GC.DOD.TOTL.GD.ZS',
      co2: 'EN.ATM.CO2E.PC',
      energia: 'EG.USE.PCAP.KG.OE'
    };

    // Obtener lista de países desde el GeoJSON (usamos la misma URL)
    const geojsonResp = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
    const geojson = await geojsonResp.json();
    const paises = geojson.features.map(f => f.properties.ISO_A3).filter(c => c && c !== '-99');

    for (let code of paises) {
      this.datosPaises[code] = {};
      for (let [key, apiCode] of Object.entries(indicadores)) {
        // Convertir código de país: la API espera "ES" para España, y para otros puede necesitar el código de 2 letras
        let apiCountryCode = code;
        if (code === 'ESP') apiCountryCode = 'ES';
        // También podrías añadir más mapeos si otros países fallan, pero por ahora solo España requiere ajuste
        
        const url = `https://api.worldbank.org/v2/country/${apiCountryCode}/indicator/${apiCode}?format=json`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          
          // La respuesta tiene estructura: [ {page:...}, [ { ... } ] ]
          const records = data[1] || [];
          // Buscar el primer valor no nulo (el más reciente, ya que vienen ordenados descendente)
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
      // Pequeña pausa para no saturar la API
      await new Promise(r => setTimeout(r, 50));
    }
    console.log("✅ Datos de todos los países cargados:", this.datosPaises);
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

  // Asocia eventos a cada país (tooltip, popup y clic para actualizar panel)
  onEachFeature(feature, layer) {
    const code = feature.properties?.ISO_A3;
    const datos = this.datosPaises[code] || {};
    const nombre = feature.properties?.NAME || code;

    // Tooltip con el nombre del país
    layer.bindTooltip(nombre);

    // Al hacer clic en el país, actualizar el panel lateral y preparar gráfico
    layer.on('click', async () => {
      if (window.UIPanelInfo) {
        window.UIPanelInfo.mostrarPais(code, nombre);
        // Obtener serie histórica del PIB (últimos 10 años) para el gráfico
        const seriePib = await this.obtenerSerieHistorica(code, 'NY.GDP.PCAP.PP.CD', 10);
        if (window.UIPanelInfo.mostrarGrafico) {
          window.UIPanelInfo.mostrarGrafico(seriePib);
        }
      }
    });

    // También mantenemos el popup clásico con todos los indicadores
    const pib = datos.pib ? `$${datos.pib.toLocaleString()}` : 'No disponible';
    const pob = datos.poblacion ? datos.poblacion.toLocaleString() : 'No disponible';
    const desempleo = datos.desempleo ? `${datos.desempleo}%` : 'No disponible';
    const deuda = datos.deuda ? `${datos.deuda}%` : 'No disponible';
    const co2 = datos.co2 ? `${datos.co2} t` : 'No disponible';
    const energia = datos.energia ? `${datos.energia.toLocaleString()} kg` : 'No disponible';
    
    layer.bindPopup(`
      <strong>${nombre}</strong><br>
      💰 PIB per cápita: ${pib}<br>
      👥 Población: ${pob}<br>
      📉 Desempleo: ${desempleo}<br>
      💸 Deuda pública (% PIB): ${deuda}<br>
      🌍 CO₂ per cápita: ${co2}<br>
      🔋 Energía per cápita: ${energia}<br>
      <em>Datos: Banco Mundial (último año disponible)</em>
    `);
  },

  // Obtiene la serie histórica de un indicador para un país
  async obtenerSerieHistorica(code, indicador, años = 10) {
    // Convertir código de país para la API
    let apiCountryCode = code;
    if (code === 'ESP') apiCountryCode = 'ES';
    const url = `https://api.worldbank.org/v2/country/${apiCountryCode}/indicator/${indicador}?format=json&per_page=${años}&sort=year%20desc`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const valores = data[1] || [];
      // Ordenar de más antiguo a más reciente
      const serie = valores.reverse().map(v => ({
        año: v.date,
        valor: v.value ? parseFloat(v.value) : null
      }));
      return serie.filter(p => p.valor !== null);
    } catch(e) {
      console.warn(`Error al cargar serie histórica para ${code}:`, e);
      return [];
    }
  }
};

window.MapaMundial = MapaMundial;
