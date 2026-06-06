// js/core/16-gadm.js
// ============================================
// PROVEEDOR GLOBAL DE IDENTIDAD TERRITORIAL
// ============================================

var GADM = (function() {
    
    var cacheGeoJSON = new Map();
    var cacheJerarquias = new Map();
    
    var BASE_URL = "https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_";
    
    // Mapa de códigos ISO3 a nombres de archivo GADM
    var mapaPaisesGADM = {
        'ESP': 'ESP', 'FRA': 'FRA', 'DEU': 'DEU', 'ITA': 'ITA',
        'PRT': 'PRT', 'GBR': 'GBR', 'USA': 'USA', 'CAN': 'CAN',
        'MEX': 'MEX', 'BRA': 'BRA', 'ARG': 'ARG', 'CHL': 'CHL',
        'CHN': 'CHN', 'JPN': 'JPN', 'IND': 'IND', 'RUS': 'RUS',
        'AUS': 'AUS', 'ZAF': 'ZAF', 'EGY': 'EGY', 'TUR': 'TUR'
    };
    
    /**
     * Buscar cualquier lugar del mundo usando Nominatim (OpenStreetMap)
     * Devuelve: nombre, lat, lon, tipo, país, región, etc.
     */
    async function buscarLugar(texto) {
        if (!texto) return null;
        
        var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(texto) + '&limit=1&addressdetails=1';
        
        try {
            var response = await fetch(url);
            var data = await response.json();
            
            if (!data || data.length === 0) return null;
            
            var lugar = data[0];
            var address = lugar.address || {};
            
            return {
                nombre: lugar.display_name.split(',')[0],
                lat: parseFloat(lugar.lat),
                lon: parseFloat(lugar.lon),
                tipo: lugar.type,
                clase: lugar.class,
                pais: address.country || null,
                pais_codigo: address.country_code?.toUpperCase() || null,
                region: address.state || address.region || null,
                provincia: address.county || null,
                municipio: address.city || address.town || address.village || null,
                osm_id: lugar.osm_id,
                osm_type: lugar.osm_type
            };
        } catch (error) {
            console.error('Error en Nominatim:', error);
            return null;
        }
    }
    
    /**
     * Obtener jerarquía administrativa desde GADM por coordenadas
     */
    async function obtenerJerarquiaPorCoordenadas(lat, lon, iso3) {
        if (!iso3) return null;
        
        var cacheKey = iso3 + '_' + lat.toFixed(2) + '_' + lon.toFixed(2);
        if (cacheJerarquias.has(cacheKey)) return cacheJerarquias.get(cacheKey);
        
        var geojson = await cargarGeoJSONPais(iso3);
        if (!geojson || !geojson.features) return null;
        
        // Buscar el feature que contiene el punto
        for (var i = 0; i < geojson.features.length; i++) {
            var feature = geojson.features[i];
            if (contienePunto(feature, lat, lon)) {
                var props = feature.properties;
                var resultado = {
                    id: props.GID_0 + '.' + props.GID_1 + '.' + props.GID_2 + '.' + props.GID_3,
                    nombre: props.NAME_3 || props.NAME_2 || props.NAME_1 || props.NAME_0,
                    nivel: obtenerNivelDesdeProps(props),
                    pais: props.NAME_0,
                    pais_id: props.GID_0,
                    region: props.NAME_1,
                    region_id: props.GID_1,
                    provincia: props.NAME_2,
                    provincia_id: props.GID_2,
                    municipio: props.NAME_3,
                    municipio_id: props.GID_3
                };
                cacheJerarquias.set(cacheKey, resultado);
                return resultado;
            }
        }
        
        return null;
    }
    
    /**
     * Verificar si un punto está dentro de un polígono
     */
    function contienePunto(feature, lat, lon) {
        var geometry = feature.geometry;
        if (!geometry) return false;
        
        if (geometry.type === 'Polygon') {
            return puntoEnPoligono(lat, lon, geometry.coordinates[0]);
        } else if (geometry.type === 'MultiPolygon') {
            for (var i = 0; i < geometry.coordinates.length; i++) {
                if (puntoEnPoligono(lat, lon, geometry.coordinates[i][0])) return true;
            }
        }
        return false;
    }
    
    function puntoEnPoligono(lat, lon, anillo) {
        var inside = false;
        for (var i = 0, j = anillo.length - 1; i < anillo.length; j = i++) {
            var xi = anillo[i][1], yi = anillo[i][0];
            var xj = anillo[j][1], yj = anillo[j][0];
            var intersect = ((yi > lat) != (yj > lat)) && (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }
    
    function obtenerNivelDesdeProps(props) {
        if (props.NAME_3 && props.NAME_3 !== props.NAME_2) return "municipio";
        if (props.NAME_2 && props.NAME_2 !== props.NAME_1) return "provincia";
        if (props.NAME_1 && props.NAME_1 !== props.NAME_0) return "region";
        return "pais";
    }
    
    async function cargarGeoJSONPais(codigoISO) {
        var gadmCode = mapaPaisesGADM[codigoISO];
        if (!gadmCode) return null;
        
        if (cacheGeoJSON.has(gadmCode)) {
            return cacheGeoJSON.get(gadmCode);
        }
        
        var url = BASE_URL + gadmCode + '_3.json';
        
        try {
            var response = await fetch(url);
            var data = await response.json();
            cacheGeoJSON.set(gadmCode, data);
            console.log("✅ GeoJSON cargado para " + codigoISO);
            return data;
        } catch (error) {
            console.warn("⚠️ No se pudo cargar GADM para " + codigoISO);
            return null;
        }
    }
    
    /**
     * Obtener información completa de cualquier lugar (búsqueda por texto)
     */
    async function obtenerInfoLugar(texto) {
        var lugar = await buscarLugar(texto);
        if (!lugar) return null;
        
        var resultado = {
            nombre: lugar.nombre,
            lat: lugar.lat,
            lon: lugar.lon,
            tipo: lugar.tipo,
            pais: lugar.pais,
            pais_codigo: lugar.pais_codigo,
            region: lugar.region,
            provincia: lugar.provincia,
            municipio: lugar.municipio,
            jerarquia_gadm: null
        };
        
        // Si tenemos código de país, intentar obtener jerarquía GADM
        if (lugar.pais_codigo && lugar.lat && lugar.lon) {
            var jerarquia = await obtenerJerarquiaPorCoordenadas(lugar.lat, lugar.lon, lugar.pais_codigo);
            if (jerarquia) {
                resultado.jerarquia_gadm = jerarquia;
            }
        }
        
        return resultado;
    }
    
    return {
        buscarLugar: buscarLugar,
        obtenerInfoLugar: obtenerInfoLugar,
        obtenerJerarquiaPorCoordenadas: obtenerJerarquiaPorCoordenadas,
        cargarGeoJSONPais: cargarGeoJSONPais
    };
})();

window.GADM = GADM;
console.log("✅ GADM global cargado");
