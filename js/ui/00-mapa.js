// js/ui/00-mapa.js
const MapaMundial = {
  mapa: null,

  // Mapeo de nombres en inglés (GeoJSON) -> IDs en español (TERRITORIOS)
  nombreInglesAId: {
    'Spain': 'españa',
    'France': 'francia',
    'Germany': 'alemania',
    'Portugal': 'portugal',
    'Italy': 'italia',
    'United Kingdom': 'reino_unido',
    'United States': 'eeuu',
    'China': 'china',
    'Russia': 'rusia'
    // Puedes añadir más según necesites
  },

  irAPais: function(paisId) {
    const pais = TERRITORIOS[paisId];
    if (pais && pais.geo) {
      this.mapa.setView([pais.geo.lat, pais.geo.lon], 6);
    }
  },
  init: function() {
  if (this.mapa) {
    console.log('Mapa ya inicializado, se omite');
    return;
  }
    // Crear mapa centrado en España
    this.mapa = L.map('mapa-mundial').setView([40.0, -3.0], 5);
    
    // Capa base de calles (fondo)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.mapa);
    
    // Cargar países
    this.cargarPaises();
  },

  cargarPaises: function() {
    const urlGeoJSON = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
    
    fetch(urlGeoJSON)
      .then(response => response.json())
      .then(data => {
        L.geoJSON(data, {
          style: {
            color: '#4fc3f7',
            weight: 1,
            fillColor: '#2c3e50',
            fillOpacity: 0.3
          },
          onEachFeature: (feature, layer) => {
            // El nombre en inglés (como viene del GeoJSON)
            let nombreIngles = feature.properties.ADMIN;
            if (!nombreIngles) return;
            
            // Traducir a ID español
            const idPais = this.nombreInglesAId[nombreIngles];
            
            // Tooltip con el nombre original (inglés)
            layer.bindTooltip(nombreIngles, { sticky: true });
            
            // Evento click
            layer.on('click', () => {
              console.log('Clic en:', nombreIngles, '-> ID:', idPais);
              if (idPais && TERRITORIOS[idPais]) {
                // Llamar al panel de información
                if (typeof UIPanelInfo !== 'undefined') {
                  UIPanelInfo.mostrarPais(idPais);
                } else {
                  console.error('UIPanelInfo no está definido');
                }
              } else {
                console.warn('País no reconocido en TERRITORIOS:', nombreIngles);
                // Mostrar mensaje en el dashboard
                const container = document.getElementById('dashboard-container');
                if (container) {
                  container.innerHTML = `<div class="aviso">🌍 ${nombreIngles} no está aún en nuestra base de datos. ¡Lo añadiremos pronto!</div>`;
                }
              }
            });
          }
        }).addTo(this.mapa);
      })
      .catch(error => {
        console.error('Error cargando el mapa de países:', error);
        alert('No se pudo cargar el mapa. Recarga la página o inténtalo más tarde.');
      });
  }
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (typeof L !== 'undefined') {
    MapaMundial.init();
  } else {
    console.error('Leaflet no se ha cargado correctamente');
  }
});

window.MapaMundial = MapaMundial;
