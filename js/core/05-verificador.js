// js/core/05-verificador.js
const Verificador = {
    // Base de conocimiento ampliada
    baseConocimiento: {
        'gasolina': {
            estado: 'verdadero',
            respuesta: 'El precio de la gasolina ha subido un 12% en el último mes debido a tensiones geopolíticas que afectan al transporte marítimo y a la reducción de suministros en refinerías clave.',
            factores: [
                { nombre: 'Energía global', porcentaje: 42, descripcion: 'Precio del petróleo internacional +15%' },
                { nombre: 'Geopolítica', porcentaje: 28, descripcion: 'Conflictos en rutas marítimas, tensión en Irán' },
                { nombre: 'Economía', porcentaje: 18, descripcion: 'Inflación +2.3%, coste transporte +8%' },
                { nombre: 'Fiscalidad', porcentaje: 12, descripcion: 'IVA e impuestos estables, sin cambios' }
            ],
            fuentes: ['International Energy Agency', 'Ministerio Transición Ecológica', 'EFE']
        },
        'inflacion': {
            estado: 'verdadero',
            respuesta: 'La inflación actual del 2.8% se debe principalmente al aumento de precios energéticos y al encarecimiento de alimentos procesados por problemas en cadenas de suministro.',
            factores: [
                { nombre: 'Energía', porcentaje: 45, descripcion: 'Precio electricidad +8%, gas +12%' },
                { nombre: 'Alimentos', porcentaje: 30, descripcion: 'Materias primas +6%, transporte +5%' },
                { nombre: 'Servicios', porcentaje: 15, descripcion: 'Hostelería +4%, turismo +3%' },
                { nombre: 'Vivienda', porcentaje: 10, descripcion: 'Alquileres +2%, hipotecas +1%' }
            ],
            fuentes: ['INE', 'Eurostat', 'Banco de España']
        },
        'paro': {
            estado: 'verdadero',
            respuesta: 'El desempleo se sitúa en el 11.2%, con mejores datos en sector servicios pero empeorando en industria por la crisis energética.',
            factores: [
                { nombre: 'Servicios', porcentaje: 35, descripcion: 'Creación de empleo +2.1%' },
                { nombre: 'Industria', porcentaje: 28, descripcion: 'Pérdida de empleo -1.8%' },
                { nombre: 'Construcción', porcentaje: 20, descripcion: 'Estable, +0.3%' },
                { nombre: 'Agricultura', porcentaje: 17, descripcion: 'Trabajo estacional -0.5%' }
            ],
            fuentes: ['SEPE', 'INE', 'Ministerio Trabajo']
        },
        'cambio climatico': {
            estado: 'verdadero',
            respuesta: 'El cambio climático es un fenómeno real y acelerado. Las emisiones de CO2 han aumentado un 2% globalmente en el último año, y los eventos extremos se han multiplicado por 3 en la última década.',
            factores: [
                { nombre: 'Emisiones industriales', porcentaje: 60, descripcion: 'Aumento del 2% anual' },
                { nombre: 'Deforestación', porcentaje: 20, descripcion: 'Pérdida de sumideros de carbono' },
                { nombre: 'Transporte', porcentaje: 15, descripcion: 'Uso de combustibles fósiles' },
                { nombre: 'Agricultura', porcentaje: 5, descripcion: 'Metano y otros gases' }
            ],
            fuentes: ['IPCC', 'NASA', 'AEMET']
        },
        'guerra ucrania': {
            estado: 'verdadero',
            respuesta: 'El conflicto en Ucrania continúa. Las sanciones a Rusia han reducido las exportaciones de gas y petróleo, afectando los precios energéticos globales.',
            factores: [
                { nombre: 'Energía', porcentaje: 50, descripcion: 'Caída de suministro ruso' },
                { nombre: 'Geopolítica', porcentaje: 30, descripcion: 'Realineamiento de alianzas' },
                { nombre: 'Economía', porcentaje: 20, descripcion: 'Inflación y recesión en Europa' }
            ],
            fuentes: ['ICG', 'Reuters', 'Ministerio Defensa']
        }
    },

    verificar: function(duda) {
        const dudaLower = duda.toLowerCase();
        for (let [clave, valor] of Object.entries(this.baseConocimiento)) {
            if (dudaLower.includes(clave)) {
                return {
                    encontrado: true,
                    ...valor,
                    duda: duda
                };
            }
        }
        return {
            encontrado: false,
            duda: duda,
            respuesta: 'No hay suficiente información específica para responder a esta pregunta. Puedes probar con términos más generales o consultar las fuentes oficiales.',
            factores: [],
            fuentes: ['Consulta fuentes oficiales']
        };
    },

    generarHTML: function(resultado) {
        if (!resultado.encontrado) {
            return `<div class="verificacion-no-encontrada"><p>${resultado.respuesta}</p></div>`;
        }
        const color = resultado.estado === 'falso' ? 'var(--danger)' : 'var(--success)';
        const icono = resultado.estado === 'falso' ? '❌' : '✅';
        let factoresHtml = '';
        if (resultado.factores && resultado.factores.length) {
            factoresHtml = '<div class="factores"><h4>📊 Factores de impacto:</h4>';
            resultado.factores.forEach(f => {
                const porcentaje = f.porcentaje;
                const barra = '█'.repeat(Math.floor(porcentaje / 5)) + '░'.repeat(20 - Math.floor(porcentaje / 5));
                factoresHtml += `
                    <div class="factor-item">
                        <div><strong>${f.nombre}</strong> ${porcentaje}% · ${f.descripcion}</div>
                        <div class="factor-barra">
                            <span class="barra-fondo"><span class="barra-llena" style="width: ${porcentaje}%"></span></span>
                            <span>${porcentaje}%</span>
                        </div>
                    </div>
                `;
            });
            factoresHtml += '</div>';
        }
        return `
            <div class="verificacion-resultado" style="border-left-color: ${color}">
                <div class="verificacion-icono">${icono}</div>
                <div class="verificacion-contenido">
                    <p class="verificacion-estado">${resultado.estado.toUpperCase()}</p>
                    <p class="verificacion-respuesta">${resultado.respuesta}</p>
                    ${factoresHtml}
                    <p class="verificacion-fuentes">📚 Fuentes: ${resultado.fuentes.join(', ')}</p>
                </div>
            </div>
        `;
    }
};

window.Verificador = Verificador;
