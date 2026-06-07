// js/core/18-ine-api.js
// ============================================
// API DEL INSTITUTO NACIONAL DE ESTADÍSTICA (INE)
// ============================================

var INE_API = (function() {
    
    var baseURL = 'https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/';
    
    var codigosCCAA = {
        'Comunidad de Madrid': 13,
        'Andalucía': 11,
        'Cataluña': 9,
        'Comunitat Valenciana': 10,
        'Galicia': 12,
        'Castilla y León': 7,
        'País Vasco': 16,
        'Castilla-La Mancha': 8,
        'Canarias': 5,
        'Región de Murcia': 15,
        'Aragón': 2,
        'Extremadura': 14,
        'Islas Baleares': 4,
        'Principado de Asturias': 3,
        'Comunidad Foral de Navarra': 18,
        'Cantabria': 6,
        'La Rioja': 17,
        'Ceuta': 19,
        'Melilla': 20
    };
    
    var mapaNombres = {
        'madrid': 'Comunidad de Madrid',
        'comunidad de madrid': 'Comunidad de Madrid',
        'andalucia': 'Andalucía',
        'andalucía': 'Andalucía',
        'sevilla': 'Andalucía',
        'cataluna': 'Cataluña',
        'cataluña': 'Cataluña',
        'valencia': 'Comunitat Valenciana',
        'galicia': 'Galicia',
        'pais vasco': 'País Vasco'
    };
    
    async function getPIBPerCapita(codigoCCAA) {
        var url = baseURL + 'A31?tip=AMBITOS&codigo=' + codigoCCAA;
        try {
            var response = await fetch(url);
            var data = await response.json();
            if (!data || !data.Datos) return null;
            var ultimoValor = null;
            var ultimoAño = null;
            for (var i = 0; i < data.Datos.length; i++) {
                var item = data.Datos[i];
                if (item.Valor && !isNaN(parseFloat(item.Valor))) {
                    var año = parseInt(item.Periode);
                    if (!ultimoAño || año > ultimoAño) {
                        ultimoValor = parseFloat(item.Valor);
                        ultimoAño = año;
                    }
                }
            }
            return { valor: ultimoValor, año: ultimoAño, unidad: '€' };
        } catch(e) {
            console.warn('Error INE PIB:', e);
            return null;
        }
    }
    
    async function getIPC(codigoCCAA) {
        var url = baseURL + 'A28?tip=AMBITOS&codigo=' + codigoCCAA;
        try {
            var response = await fetch(url);
            var data = await response.json();
            if (!data || !data.Datos) return null;
            var ultimoValor = null;
            var ultimoAño = null;
            for (var i = 0; i < data.Datos.length; i++) {
                var item = data.Datos[i];
                if (item.Valor && !isNaN(parseFloat(item.Valor))) {
                    var año = parseInt(item.Periode);
                    if (!ultimoAño || año > ultimoAño) {
                        ultimoValor = parseFloat(item.Valor);
                        ultimoAño = año;
                    }
                }
            }
            return { valor: ultimoValor, año: ultimoAño, unidad: '%' };
        } catch(e) {
            console.warn('Error INE IPC:', e);
            return null;
        }
    }
    
    async function getDesempleo(codigoCCAA) {
        var url = baseURL + 'A13?tip=AMBITOS&codigo=' + codigoCCAA;
        try {
            var response = await fetch(url);
            var data = await response.json();
            if (!data || !data.Datos) return null;
            var ultimoValor = null;
            var ultimoAño = null;
            for (var i = 0; i < data.Datos.length; i++) {
                var item = data.Datos[i];
                if (item.Valor && !isNaN(parseFloat(item.Valor))) {
                    var año = parseInt(item.Periode);
                    if (!ultimoAño || año > ultimoAño) {
                        ultimoValor = parseFloat(item.Valor);
                        ultimoAño = año;
                    }
                }
            }
            return { valor: ultimoValor, año: ultimoAño, unidad: '%' };
        } catch(e) {
            console.warn('Error INE desempleo:', e);
            return null;
        }
    }
    
    async function getDatosCCAA(nombreCCAA) {
        var codigo = codigosCCAA[nombreCCAA];
        if (!codigo) return null;
        console.log('📊 Cargando datos del INE para:', nombreCCAA);
        var [pib, ipc, desempleo] = await Promise.all([
            getPIBPerCapita(codigo),
            getIPC(codigo),
            getDesempleo(codigo)
        ]);
        return {
            nombre: nombreCCAA,
            pib_percapita: pib,
            inflacion: ipc,
            desempleo: desempleo,
            fuente: 'INE',
            nivel: 'region',
            ultima_actualizacion: new Date().toISOString()
        };
    }
    
    async function getDatosPorNombre(nombreLugar) {
        var nombreLower = nombreLugar.toLowerCase();
        var nombreOficial = mapaNombres[nombreLower];
        
        if (!nombreOficial) {
            for (var region in codigosCCAA) {
                if (region.toLowerCase() === nombreLower ||
                    region.toLowerCase().includes(nombreLower) ||
                    nombreLower.includes(region.toLowerCase())) {
                    nombreOficial = region;
                    break;
                }
            }
        }
        
        if (nombreOficial && codigosCCAA[nombreOficial]) {
            return await getDatosCCAA(nombreOficial);
        }
        
        return null;
    }
    
    return {
        getDatosPorNombre: getDatosPorNombre,
        getDatosCCAA: getDatosCCAA
    };
    
})();

window.INE_API = INE_API;
console.log("✅ INE_API cargado");
