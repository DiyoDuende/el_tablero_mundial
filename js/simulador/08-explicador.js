// ============================================
// EXPLICADOR AUTOMÁTICO
// ============================================

const Explicador = {
    
    baseConocimiento: {
        'gasolina': {
            respuestaCorta: 'El precio de la gasolina ha subido un 12% en el último mes principalmente por tensiones en Oriente Medio que afectan al transporte marítimo y retrasan suministros en refinerías clave.',
            factores: [
                { nombre: 'Energía global', porcentaje: 42, descripcion: 'Precio del petróleo internacional +15%' },
                { nombre: 'Geopolítica', porcentaje: 28, descripcion: 'Conflictos en rutas marítimas' },
                { nombre: 'Economía', porcentaje: 18, descripcion: 'Inflación +2.3%, coste transporte +8%' },
                { nombre: 'Fiscalidad', porcentaje: 12, descripcion: 'IVA e impuestos estables' }
            ],
            fuentes: ['International Energy Agency', 'Ministerio Transición Ecológica', 'EFE']
        },
        'inflacion': {
            respuestaCorta: 'La inflación actual del 2.8% se debe principalmente al aumento de precios energéticos y al encarecimiento de alimentos procesados.',
            factores: [
                { nombre: 'Energía', porcentaje: 45, descripcion: 'Precio electricidad +8%, gas +12%' },
                { nombre: 'Alimentos', porcentaje: 30, descripcion: 'Materias primas +6%' },
                { nombre: 'Servicios', porcentaje: 15, descripcion: 'Hostelería +4%' },
                { nombre: 'Vivienda', porcentaje: 10, descripcion: 'Alquileres +2%' }
            ],
            fuentes: ['INE', 'Eurostat', 'Banco de España']
        }
    },
    
    explicar: function(pregunta) {
        const preguntaLower = pregunta.toLowerCase();
        
        for (let [clave, valor] of Object.entries(this.baseConocimiento)) {
            if (preguntaLower.includes(clave)) {
                return {
                    encontrado: true,
                    ...valor
                };
            }
        }
        
        return {
            encontrado: false,
            respuestaCorta: 'No hay suficiente información específica para responder a esta pregunta.',
            factores: [],
            fuentes: ['Consulta fuentes oficiales']
        };
    }
};

window.Explicador = Explicador;

