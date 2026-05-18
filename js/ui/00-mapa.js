// ============================================================
// MAPA MUNDIAL (Leaflet) - Versión simplificada (sin datos externos)
// ============================================================
const MapaMundial = {
  map: null,

  init: async function() {
    this.map = L.map('mapa-mundial').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    await this.cargarMapa();
  },

  cargarMapa: async function() {
    const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
    const geojson = await response.json();
    L.geoJSON(geojson, {
      style: { color: '#4fc3f7', weight: 1, fillColor: '#2a7faa', fillOpacity: 0.5 },
      onEachFeature: (feature, layer) => {
        const nombre = feature.properties?.NAME || 'Sin nombre';
        layer.bindTooltip(nombre);
        layer.bindPopup(`<strong>${nombre}</strong><br>Datos no disponibles aún.`);
        layer.on('click', () => {
          if (window.UIPanelInfo) UIPanelInfo.mostrarPais(feature.properties?.ISO_A3, nombre);
        });
      }
    }).addTo(this.map);
  }
};

window.MapaMundial = MapaMundial;
