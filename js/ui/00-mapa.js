Ñ// js/ui/00-mapa.js
const MapaMundial = {
  mapa: null,

  init: function() {
    // Inicializar mapa centrado en España
    this.mapa = L.map('mapa-mundial').setView([40.0, -3.0], 5);
    
    // Capa base (fondo)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 19,
      minZoom: 2
    }).addTo(this.mapa);
    
    // Cargar países
    this.cargarPaises();
  },

  cargarPaises: function() {
    // Usamos un GeoJSON más fiable y actualizado
    const urlGeoJSON = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
    
    fetch(urlGeoJSON)
      .then(response => response.json())
      .then(data => {
        L.geoJSON(data, {
          style: {
            color: '#4fc3f7',
            weight: 1.5,
            fillColor: '#2c3e50',
            fillOpacity: 0.2,
            opacity: 0.8
          },
          onEachFeature: (feature, layer) => {
            // El nombre del país puede estar en ADMIN o NAME
            let nombrePais = feature.properties.ADMIN || feature.properties.NAME || feature.properties.name;
            if (!nombrePais) {
              console.warn('País sin nombre:', feature.properties);
              return;
            }
            
            // Tooltip al pasar el ratón
            layer.bindTooltip(nombrePais, { sticky: true, className: 'tooltip-pais' });
            
            // Evento click
            layer.on('click', (e) => {
              console.log('Click en:', nombrePais);
              this.seleccionarPais(nombrePais);
              // Pequeño efecto visual
              e.target.setStyle({ weight: 3, fillOpacity: 0.5 });
              setTimeout(() => {
                this.capaPaises?.resetStyle(e.target);
              }, 300);
            });
          }
        }).addTo(this.mapa);
      })
      .catch(error => {
        console.error('Error cargando GeoJSON:', error);
        alert('No se pudo cargar el mapa de países. Revisa la consola.');
      });
  },

  seleccionarPais: function(nombrePais) {
    console.log('Seleccionado:', nombrePais);
    
    // Buscar en TERRITORIOS por nombre exacto o normalizado
    let paisEncontrado = null;
    const nombreNormalizado = nombrePais.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    for (let id in TERRITORIOS) {
      const t = TERRITORIOS[id];
      if (t.tipo !== 'pais') continue;
      const tNombreNormalizado = t.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (tNombreNormalizado === nombreNormalizado) {
        paisEncontrado = t;
        break;
      }
    }
    
    if (paisEncontrado) {
      console.log('País reconocido:', paisEncontrado.id);
      if (typeof UIPanelInfo !== 'undefined' && UIPanelInfo.mostrarPais) {
        UIPanelInfo.mostrarPais(paisEncontrado.id);
      } else {
        console.error('UIPanelInfo no está disponible');
      }
    } else {
      console.warn('País no reconocido:', nombrePais);
      const container = document.getElementById('dashboard-container');
      if (container) {
        container.innerHTML = `<div class="aviso">🌍 ${nombrePais} no está aún en nuestra base de datos. ¡Lo añadiremos pronto!</div>`;
      }
    }
  }
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (typeof L !== 'undefined') {
    MapaMundial.init();
  } else {
    console.error('Leaflet no cargado');
  }
});

window.MapaMundial = MapaMundial;
