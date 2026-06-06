// js/core/17-fuentes.js
// ============================================
// SISTEMA DE METADATOS PARA INDICADORES
// ============================================

var Fuentes = (function() {
    
    var registroFuentes = {
        "INE": {
            nombre: "Instituto Nacional de Estadística (España)",
            url: "https://www.ine.es",
            fiabilidad_base: "muy_alta",
            tipo: "oficial_nacional",
            actualizacion: "anual"
        },
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
        "Eurostat": {
            nombre: "Oficina de Estadística de la Unión Europea",
            url: "https://ec.europa.eu/eurostat",
            fiabilidad_base: "muy_alta",
            tipo: "oficial_internacional",
            actualizacion: "variable"
        },
        "IEA": {
            nombre: "International Energy Agency",
            url: "https://www.iea.org",
            fiabilidad_base: "alta",
            tipo: "organismo_internacional",
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
