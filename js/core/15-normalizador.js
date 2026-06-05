// js/core/15-normalizador.js
// ============================================
// NORMALIZADOR DE DATOS - Modelo único
// ============================================

var NormalizadorDatos = {
    
    normalizar: function(datosRaw, iso3, nivel, nombreLugar) {
        if (!datosRaw) return null;
        
        var nombre = nombreLugar || this.obtenerNombrePorISO(iso3);
        var esEstimacion = false;
        
        return {
            territorio: {
                nombre: nombre,
                nivel: nivel || 'pais',
                iso3: iso3,
                poblacion: {
                    valor: datosRaw.poblacion?.valor ?? null,
                    año: datosRaw.poblacion?.año ?? null,
                    unidad: 'habitantes',
                    fuente: 'Banco Mundial'
                }
            },
            economia: {
                pib_percapita: {
                    valor: datosRaw.pib?.valor ?? null,
                    año: datosRaw.pib?.año ?? null,
                    unidad: 'USD',
                    fuente: 'Banco Mundial'
                },
                inflacion: {
                    valor: datosRaw.inflacion?.valor ?? null,
                    año: datosRaw.inflacion?.año ?? null,
                    unidad: '%',
                    fuente: 'Banco Mundial'
                },
                desempleo: {
                    valor: datosRaw.desempleo?.valor ?? null,
                    año: datosRaw.desempleo?.año ?? null,
                    unidad: '%',
                    fuente: 'Banco Mundial'
                },
                deuda: {
                    valor: datosRaw.deuda?.valor ?? null,
                    año: datosRaw.deuda?.año ?? null,
                    unidad: '% PIB',
                    fuente: 'Banco Mundial'
                }
            },
            social: {
                densidad: {
                    valor: datosRaw.densidad?.valor ?? null,
                    año: datosRaw.densidad?.año ?? null,
                    unidad: 'hab/km²',
                    fuente: 'Banco Mundial'
                },
                esperanza_vida: {
                    valor: datosRaw.esperanzaVida?.valor ?? null,
                    año: datosRaw.esperanzaVida?.año ?? null,
                    unidad: 'años',
                    fuente: 'Banco Mundial'
                }
            },
            metadata: {
                es_estimacion: esEstimacion
            }
        };
    },
    
    formatearParaDashboard: function(datos) {
        if (!datos) return null;
        
        return {
            nombre: datos.territorio.nombre,
            nivel: datos.territorio.nivel,
            es_estimado: datos.metadata.es_estimacion,
            indicadores: {
                pib: this.formatearNumero(datos.economia.pib_percapita?.valor, 'moneda'),
                pib_anio: datos.economia.pib_percapita?.año ?? 'N/D',
                inflacion: this.formatearNumero(datos.economia.inflacion?.valor, 'porcentaje'),
                inflacion_anio: datos.economia.inflacion?.año ?? 'N/D',
                desempleo: this.formatearNumero(datos.economia.desempleo?.valor, 'porcentaje'),
                desempleo_anio: datos.economia.desempleo?.año ?? 'N/D',
                deuda: this.formatearNumero(datos.economia.deuda?.valor, 'porcentaje'),
                deuda_anio: datos.economia.deuda?.año ?? 'N/D',
                poblacion: this.formatearPoblacion(datos.territorio.poblacion?.valor),
                densidad: this.formatearNumero(datos.social.densidad?.valor, 'densidad'),
                densidad_anio: datos.social.densidad?.año ?? 'N/D',
                esperanza_vida: this.formatearNumero(datos.social.esperanza_vida?.valor, 'decimal'),
                esperanza_anio: datos.social.esperanza_vida?.año ?? 'N/D'
            }
        };
    },
    
    formatearPoblacion: function(valor) {
        if (valor === null || valor === undefined) return 'N/D';
        if (valor >= 1000000000) return (valor / 1000000000).toFixed(2) + ' B';
        if (valor >= 1000000) return (valor / 1000000).toFixed(1) + ' M';
        if (valor >= 1000) return (valor / 1000).toFixed(1) + ' k';
        return valor.toString();
    },
    
    formatearNumero: function(valor, tipo) {
        if (valor === null || valor === undefined) return 'N/D';
        switch(tipo) {
            case 'moneda':
                return Math.round(valor).toLocaleString() + ' $';
            case 'porcentaje':
                return valor.toFixed(1) + '%';
            case 'densidad':
                return Math.round(valor).toLocaleString() + ' hab/km²';
            case 'decimal':
                return valor.toFixed(1);
            default:
                return valor.toString();
        }
    },
    
    obtenerNombrePorISO: function(iso3) {
        if (window.APIBancoMundial && window.APIBancoMundial.paisesSoportados[iso3]) {
            return window.APIBancoMundial.paisesSoportados[iso3];
        }
        return iso3;
    }
};

window.NormalizadorDatos = NormalizadorDatos;
