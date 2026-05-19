1// js/core/01-territorios.js
const TERRITORIOS = {
  // Países
  españa: {
    id: 'españa',
    nombre: 'España',
    tipo: 'pais',
    poblacion: 48400000,
    capital: 'Madrid',
    continente: 'Europa',
    regiones: ['andalucia', 'catalunya', 'madrid', 'valencia', 'galicia'],
    geo: { lat: 40.4168, lon: -3.7038 }
  },
  francia: {
    id: 'francia',
    nombre: 'Francia',
    tipo: 'pais',
    poblacion: 67750000,
    capital: 'París',
    continente: 'Europa',
    geo: { lat: 46.603354, lon: 1.888334 }
  },
  alemania: {
    id: 'alemania',
    nombre: 'Alemania',
    tipo: 'pais',
    poblacion: 83200000,
    capital: 'Berlín',
    continente: 'Europa',
    geo: { lat: 51.1657, lon: 10.4515 }
  },
  // Añade más países si quieres...
  
  // Comunidades autónomas de España (ejemplo)
  madrid: {
    id: 'madrid',
    nombre: 'Comunidad de Madrid',
    tipo: 'region',
    pais: 'españa',
    poblacion: 6700000,
    capital: 'Madrid',
    geo: { lat: 40.4168, lon: -3.7038 }
  },
  andalucia: {
    id: 'andalucia',
    nombre: 'Andalucía',
    tipo: 'region',
    pais: 'españa',
    poblacion: 8460000,
    capital: 'Sevilla',
    geo: { lat: 37.3891, lon: -5.9845 }
  },
  catalunya: {
    id: 'catalunya',
    nombre: 'Cataluña',
    tipo: 'region',
    pais: 'españa',
    poblacion: 7700000,
    capital: 'Barcelona',
    geo: { lat: 41.3851, lon: 2.1734 }
  }
  // ... puedes añadir más
};

// Función de búsqueda (opcional)
TERRITORIOS.buscar = function(texto) {
  texto = texto.toLowerCase();
  return Object.values(this).filter(t => 
    t.nombre && t.nombre.toLowerCase().includes(texto)
  );
};

window.TERRITORIOS = TERRITORIOS;
