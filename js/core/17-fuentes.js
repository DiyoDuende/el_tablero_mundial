// js/core/17-fuentes.js
// ============================================
// SISTEMA DE METADATOS PARA INDICADORES
// ============================================

var Fuentes = (function() {
    
    var registroFuentes = {
        // Globales
        "Banco Mundial": {
            nombre: "World Bank Open Data",
            url: "https://data.worldbank.org",
            fiabilidad_base: "muy_alta",
            tipo: "oficial_internacional",
            actualizacion: "anual"
        },
        "GADM": {
            nombre: "Global Administrative Areas Database",
            url: "https://gadm.org",
            fiabilidad_base: "alta",
            tipo: "academico",
            actualizacion: "versionada"
        },
        "IEA": {
            nombre: "International Energy Agency",
            url: "https://www.iea.org",
            fiabilidad_base: "alta",
            tipo: "organismo_internacional",
            actualizacion: "anual"
        },
        "UNData": {
            nombre: "United Nations Data",
            url: "https://data.un.org",
            fiabilidad_base: "muy_alta",
            tipo: "oficial_internacional",
            actualizacion: "variable"
        },
        
        // España / Europa
        "INE": {
            nombre: "Instituto Nacional de Estadística (España)",
            url: "https://www.ine.es",
            fiabilidad_base: "muy_alta",
            tipo: "oficial_nacional",
            actualizacion: "anual"
        },
        "Eurostat": {
            nombre: "Oficina de Estadística de la Unión Europea",
            url: "https://ec.europa.eu/eurostat",
            fiabilidad_base: "muy_alta",
            tipo: "oficial_internacional",
            actualizacion: "variable"
        },
        
        // América
        "IBGE": {
            nombre: "Instituto Brasileiro de Geografia e Estatística (Brasil)",
            url: "https://www.ibge.gov.br",
            fiabilidad_base: "muy_alta",
            tipo: "oficial_nacional",
            actualizacion: "anual"
        },
        "INEGI": {
            nombre: "Instituto Nacional de Estadística y Geografía (México)",
            url: "https://www.inegi.org.mx",
            fiabilidad_base: "muy_alta",
            tipo: "oficial_nacional",
            actualizacion: "anual"
        },
        "Statistics Canada": {
            nombre: "Statistics Canada",
            url: "https://www.statcan.gc.ca",
            fiabilidad_base: "muy_alta",
            tipo: "oficial_nacional",
            actualizacion: "anual"
        },
        "INDEC": {
            nombre: "Instituto Nacional de Estadística y Censos (Argentina)",
            url: "https://www.indec.gob.ar",
            fiabilidad_base: "muy_alta",
            tipo: "oficial_nacional",
            actualizacion: "anual"
        },
        
        // Asia
        "NBS": {
            nombre: "National Bureau of Statistics of China",
            url: "https://www.stats.gov.cn",
            fiabilidad_base: "media",
            tipo: "oficial_nacional",
            actualizacion: "anual"
        },
        "Statistics Japan": {
            nombre: "Statistics Bureau of Japan",
            url: "https://www.stat.go.jp",
            fiabilidad_base: "muy_alta",
            tipo: "oficial_nacional",
            actualizacion: "anual"
        },
        "KOSTAT": {
            nombre: "Statistics Korea",
            url: "https://kostat.go.kr",
            fiabilidad_base: "alta",
            tipo: "oficial_nacional",
            actualizacion: "anual"
        },
        
        // África
        "StatsSA": {
            nombre: "Statistics South Africa",
            url: "https://www.statssa.gov.za",
            fiabilidad_base: "media",
            tipo: "oficial_nacional",
            actualizacion: "anual"
        },
        "CAPMAS": {
            nombre: "Central Agency for Public Mobilization and Statistics (Egypt)",
            url: "https://www.capmas.gov.eg",
            fiabilidad_base: "media",
            tipo: "oficial_nacional",
            actualizacion: "anual"
        },
        
        // Oceanía
        "ABS": {
            nombre: "Australian Bureau of Statistics",
            url: "https://www.abs.gov.au",
            fiabilidad_base: "muy_alta",
            tipo: "oficial_nacional",
            actualizacion: "anual"
        }
    };
    
    function crearIndicador(valor, unidad, fuenteCodigo, fecha, metadatosExtra) {
        metadatosExtra = metadatosExtra || {};
        var fuente = registroFuentes[fuenteCodigo];
        
        if (!fuente) {
            console.warn("⚠️ Fuente no registrada: " + fuenteCodigo);
        }
        
        return {
            valor: valor,
            unidad: unidad,
            fuente: {
                codigo: fuenteCodigo,
                nombre: fuente?.nombre || fuenteCodigo,
                url: fuente?.url || null,
                fiabilidad: metadatosExtra.fiabilidad || fuente?.fiabilidad_base || "media",
                tipo: fuente?.tipo || "desconocida"
            },
            fecha: fecha,
            actualizado: new Date().toISOString().split('T')[0],
            descripcion: metadatosExtra.descripcion || null,
            metodo: metadatosExtra.metodo || null
        };
    }
    
    function poblacion(valor, fuente, año) {
        return crearIndicador(valor, "habitantes", fuente, año, {
            descripcion: "Población total",
            metodo: "censo / padrón"
        });
    }
    
    function pib(valor, fuente, año, moneda) {
        moneda = moneda || "USD";
        return crearIndicador(valor, moneda, fuente, año, {
            descripcion: "Producto Interior Bruto",
            metodo: "estimación oficial"
        });
    }
    
    function esFiable(indicador, umbral) {
        umbral = umbral || "alta";
        var niveles = { "muy_alta": 4, "alta": 3, "media": 2, "baja": 1 };
        var nivelIndicador = niveles[indicador.fuente.fiabilidad] || 0;
        var nivelUmbral = niveles[umbral] || 3;
        
        return nivelIndicador >= nivelUmbral;
    }
    
    function explicarOrigen(indicador) {
        var texto = "📊 Este dato proviene de " + indicador.fuente.nombre + ". ";
        texto += "Actualización: " + indicador.fecha + ". ";
        texto += "Fiabilidad: " + indicador.fuente.fiabilidad + ". ";
        
        if (indicador.descripcion) {
            texto += "(" + indicador.descripcion + ")";
        }
        
        if (indicador.fuente.url) {
            texto += "\n🔗 Fuente: " + indicador.fuente.url;
        }
        
        return texto;
    }
    
    return {
        crearIndicador: crearIndicador,
        poblacion: poblacion,
        pib: pib,
        esFiable: esFiable,
        explicarOrigen: explicarOrigen,
        registroFuentes: registroFuentes
    };
})();

window.Fuentes = Fuentes;
console.log("✅ Sistema de Fuentes cargado");
