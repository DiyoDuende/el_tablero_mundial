// js/core/18-ine-api.js
// ============================================
// API DEL INSTITUTO NACIONAL DE ESTADÍSTICA (INE)
// Datos regionales reales para España
// ============================================

var INE_API = {
    baseURL: 'https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/',
    
    // Códigos de comunidades autónomas (según INE)
    codigosCCAA: {
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
    },
    
    // Tabla A31: PIB per cápita por comunidad autónoma
    async getPIBPerCapita(codigoCCAA) {
        var url = this.baseURL + 'A31?tip=AMBITOS&codigo=' + codigoCCAA;
        try {
            var response = await fetch(url);
            var data = await response.json();
            
            if (!data || !data.Datos) return null;
            
            // Buscar el valor más reciente
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
            
            return {
                valor: ultimoValor,
                año: ultimoAño,
                unidad: '€'
            };
        } catch(e) {
            console.warn('Error INE PIB:', e);
            return null;
        }
    },
    
    // Tabla A28: IPC por comunidad autónoma
    async getIPC(codigoCCAA) {
        var url = this.baseURL + 'A28?tip=AMBITOS&codigo=' + codigoCCAA;
        try {
            var response = await fetch(url);
            var data = await response.json();
            
            if (!data || !data.Datos) return null;
            
            // Buscar el valor más reciente
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
            
            return {
                valor: ultimoValor,
                año: ultimoAño,
                unidad: '%'
            };
        } catch(e) {
            console.warn('Error INE IPC:', e);
            return null;
        }
    },
    
    // Tabla A13: EPA (desempleo) por comunidad autónoma
    async getDesempleo(codigoCCAA) {
        var url = this.baseURL + 'A13?tip=AMBITOS&codigo=' + codigoCCAA;
        try {
            var response = await fetch(url);
            var data = await response.json();
            
            if (!data || !data.Datos) return null;
            
            var ultimoValor = null;
            var ultimoAño = null;
            
            for (var i = 0; i < data.Datos.length; i++) {
                var item = data.Datos[i];
                // Buscar tasa de paro total (código 1 o similar)
                if (item.Valor && !isNaN(parseFloat(item.Valor))) {
                    var año = parseInt(item.Periode);
                    if (!ultimoAño || año > ultimoAño) {
                        ultimoValor = parseFloat(item.Valor);
                        ultimoAño = año;
                    }
                }
            }
            
            return {
                valor: ultimoValor,
                año: ultimoAño,
                unidad: '%'
            };
        } catch(e) {
            console.warn('Error INE desempleo:', e);
            return null;
        }
    },
    
    // Obtener datos completos de una comunidad autónoma
    async getDatosCCAA(nombreCCAA) {
        var codigo = this.codigosCCAA[nombreCCAA];
        if (!codigo) return null;
        
        // Mostrar que estamos cargando
        console.log('📊 Cargando datos del INE para:', nombreCCAA);
        
        var [pib, ipc, desempleo] = await Promise.all([
            this.getPIBPerCapita(codigo),
            this.getIPC(codigo),
            this.getDesempleo(codigo)
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
    },
    
    // Obtener datos para cualquier nombre de lugar en España
    async getDatosPorNombre(nombreLugar) {
        // Intentar como comunidad autónoma
        for (var region in this.codigosCCAA) {
            if (region.toLowerCase() === nombreLugar.toLowerCase() ||
                region.toLowerCase().includes(nombreLugar.toLowerCase()) ||
                nombreLugar.toLowerCase().includes(region.toLowerCase())) {
                return await this.getDatosCCAA(region);
            }
        }
        
        // Si no se encuentra, devolver null
        return null;
    }
};

window.INE_API = INE_API;
console.log('✅ INE_API cargado');
