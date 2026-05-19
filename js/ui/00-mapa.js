// js/ui/00-mapa.js
const MapaMundial = {
  mapa: null,
  capaPaises: null,

  init: function() {
    // Crear el mapa centrado en Europa (lat, lon, zoom)
    this.mapa = L.map('mapa-mundial').setView([40.0, -3.0], 4);
    
    // Capa de mosaicos (OpenStreetMap)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 19,
      minZoom: 2
    }).addTo(this.mapa);
    
    // Cargar GeoJSON de países
    this.cargarPaises();
  },

  cargarPaises: function() {
    const urlGeoJSON = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
    
    fetch(urlGeoJSON)
      .then(response => response.json())
      .then(data => {
        this.capaPaises = L.geoJSON(data, {
          style: {
            color: '#4fc3f7',
            weight: 1,
            fillColor: '#2c3e50',
            fillOpacity: 0.3,
            opacity: 0.8
          },
          onEachFeature: (feature, layer) => {
            // Obtener nombre del país
            const nombrePais = feature.properties.ADMIN || feature.properties.name;
            if (nombrePais) {
              // Evento click
              layer.on('click', () => {
                this.seleccionarPais(nombrePais);
              });
              // Tooltip al pasar el ratón
              layer.bindTooltip(nombrePais, { sticky: true });
            }
          }
        }).addTo(this.mapa);
      })
      .catch(error => {
        console.error('Error cargando GeoJSON:', error);
        // Fallback: mostrar un mensaje en el mapa
        this.mapa.getContainer().style.opacity = '0.7';
        this.mapa.getContainer().title = 'Error cargando los países. Recarga la página.';
      });
  },

  seleccionarPais: function(nombrePais) {
    // Normalizar nombre (minusculas, sin acentos simplificado)
    const idPais = nombrePais.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ /g, '_');
    
    // Buscar en TERRITORIOS
    let paisEncontrado = null;
    for (let id in TERRITORIOS) {
      const territorio = TERRITORIOS[id];
      if (territorio.nombre && territorio.nombre.toLowerCase() === nombrePais.toLowerCase()) {
        paisEncontrado = territorio;
        break;
      }
    }
    
    if (paisEncontrado) {
      console.log(`País seleccionado: ${nombrePais} (ID: ${paisEncontrado.id})`);
      if (typeof UIPanelInfo !== 'undefined' && UIPanelInfo.mostrarPais) {
        UIPanelInfo.mostrarPais(paisEncontrado.id);
      } else {
        console.warn('UIPanelInfo no está disponible');
        alert(`Has hecho clic en ${nombrePais}. El panel de información se cargará pronto.`);
      }
    } else {
      console.log(`País no reconocido en la base de datos: ${nombrePais}`);
      // Podemos mostrar un mensaje amigable
      const infoDiv = document.getElementById('dashboard-container');
      if (infoDiv) {
        infoDiv.innerHTML = `<div class="aviso">🌍 ${nombrePais} no está aún en nuestra base de datos. ¡Pronto lo añadiremos!</div>`;
      }
    }
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (typeof L !== 'undefined') {
    MapaMundial.init();
  } else {
    console.error('Leaflet no está cargado');
  }
});

window.MapaMundial = MapaMundial;
