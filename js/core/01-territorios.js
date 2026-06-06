// ============================================
// TERRITORIOS - Jerarquía global
// ============================================

const TERRITORIOS = {
    mundo: { id: 'mundo', nombre: 'Mundo', nivel: 'mundo' },
    
    // Continentes
    europa: { id: 'europa', nombre: 'Europa', nivel: 'continente' },
    africa: { id: 'africa', nombre: 'África', nivel: 'continente' },
    asia: { id: 'asia', nombre: 'Asia', nivel: 'continente' },
    america: { id: 'america', nombre: 'América', nivel: 'continente' },
    oceania: { id: 'oceania', nombre: 'Oceanía', nivel: 'continente' },
    
    // Países principales
    españa: { 
        id: 'españa', nombre: 'España', nivel: 'pais', continente: 'europa',
        poblacion: 47000000, renta_percapita: 27000, infraestructura: 75 
    },
    francia: { 
        id: 'francia', nombre: 'Francia', nivel: 'pais', continente: 'europa',
        poblacion: 68000000, renta_percapita: 35000, infraestructura: 85 
    },
    portugal: { 
        id: 'portugal', nombre: 'Portugal', nivel: 'pais', continente: 'europa',
        poblacion: 10300000, renta_percapita: 22000, infraestructura: 70 
    },
    alemania: { 
        id: 'alemania', nombre: 'Alemania', nivel: 'pais', continente: 'europa',
        poblacion: 83000000, renta_percapita: 40000, infraestructura: 90 
    },
    italia: { 
        id: 'italia', nombre: 'Italia', nivel: 'pais', continente: 'europa',
        poblacion: 60000000, renta_percapita: 29000, infraestructura: 80 
    },
    eeuu: { 
        id: 'eeuu', nombre: 'Estados Unidos', nivel: 'pais', continente: 'america',
        poblacion: 331000000, renta_percapita: 63000, infraestructura: 85 
    },
    china: { 
        id: 'china', nombre: 'China', nivel: 'pais', continente: 'asia',
        poblacion: 1400000000, renta_percapita: 10000, infraestructura: 80 
    },
    
    // Regiones españolas (ejemplo)
    andalucia: { id: 'andalucia', nombre: 'Andalucía', nivel: 'region', pais: 'españa' },
    cataluna: { id: 'cataluna', nombre: 'Cataluña', nivel: 'region', pais: 'españa' },
    madrid: { id: 'madrid', nombre: 'Madrid', nivel: 'region', pais: 'españa' },
    
    // Provincias
    sevilla: { id: 'sevilla', nombre: 'Sevilla', nivel: 'provincia', region: 'andalucia' },
    barcelona: { id: 'barcelona', nombre: 'Barcelona', nivel: 'provincia', region: 'cataluna' },
    
    // Municipios
    sevilla_capital: { id: 'sevilla_capital', nombre: 'Sevilla', nivel: 'municipio', provincia: 'sevilla' },
    
    // Función de búsqueda
    buscar: function(texto) {
        const resultados = [];
        const textoLower = texto.toLowerCase();
        
        for (let id in this) {
            if (typeof this[id] === 'object' && this[id].nombre) {
                if (this[id].nombre.toLowerCase().includes(textoLower)) {
                    resultados.push(this[id]);
                }
            }
        }
        
        return resultados;
    },
    
    get: function(id) { return this[id] || null; }
};

// ============================================
// INTEGRACIÓN CON GADM (IDENTIDAD GLOBAL)
// ============================================

async function expandirConIdentidadGlobal(territorioLocal) {
    if (!territorioLocal) return territorioLocal;
    
    // Si el territorio tiene nombre y país, buscar en GADM
    if (territorioLocal.nombre && !territorioLocal.gadm_id) {
        var resultados = await GADM.buscarPorNombre(territorioLocal.nombre);
        if (resultados && resultados.length > 0) {
            territorioLocal.gadm_id = resultados[0].id;
            territorioLocal.nivel_gadm = resultados[0].nivel;
            
            // Si es un municipio, obtener jerarquía completa
            if (resultados[0].nivel === "municipio") {
                var jerarquia = await GADM.obtenerJerarquia(resultados[0].id);
                if (jerarquia) {
                    territorioLocal.jerarquia_global = jerarquia;
                }
            }
        }
    }
    
    return territorioLocal;
}

// Ejemplo de uso: expandir un territorio existente
async function obtenerTerritorioGlobal(idLocal) {
    var territorio = TERRITORIOS[idLocal];
    if (territorio) {
        return await expandirConIdentidadGlobal(territorio);
    }
    return null;
}

// Añadir al objeto TERRITORIOS
TERRITORIOS.expandirConIdentidadGlobal = expandirConIdentidadGlobal;
TERRITORIOS.obtenerTerritorioGlobal = obtenerTerritorioGlobal;

window.TERRITORIOS = TERRITORIOS;
