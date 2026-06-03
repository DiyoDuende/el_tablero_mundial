// js/core/05-verificador.js
// ============================================
// VERIFICADOR CIUDADANO - Con datos reales del Banco Mundial
// ============================================

const Verificador = {
    // Mapa de palabras clave a indicadores
    palabrasClave: {
        pib: ['pib', 'producto interior bruto', 'economía', 'riqueza', 'gdp'],
        inflacion: ['inflación', 'precios', 'costo de vida', 'ipc'],
        desempleo: ['desempleo', 'paro', 'empleo', 'trabajo'],
        deuda: ['deuda', 'déficit', 'deuda pública']
    },
    
    // Mapa de nombres de país a ISO3 (para entender preguntas como "España")
    paisesDict: {
        'españa': 'ESP', 'espania': 'ESP', 'spain': 'ESP',
        'francia': 'FRA', 'france': 'FRA',
        'alemania': 'DEU', 'germany': 'DEU',
        'italia': 'ITA', 'italy': 'ITA',
        'portugal': 'PRT', 'portugal': 'PRT',
        'reino unido': 'GBR', 'uk': 'GBR', 'united kingdom': 'GBR',
        'eeuu': 'USA', 'usa': 'USA', 'estados unidos': 'USA',
        'china': 'CHN', 'china': 'CHN',
        'japon': 'JPN', 'japan': 'JPN',
        'india': 'IND', 'india': 'IND',
        'brasil': 'BRA', 'brazil': 'BRA',
        'canada': 'CAN', 'canada': 'CAN',
        'mexico': 'MEX', 'mexico': 'MEX'
    },
    
    // Normalizar texto (quitar tildes, minúsculas)
    normalizar: function(texto) {
        return texto.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[¿?¡!]/g, '');
    },
    
    // Extraer país de la pregunta
    extraerPais: function(texto) {
        const textoNorm = this.normalizar(texto);
        for (let [nombre, iso3] of Object.entries(this.paisesDict)) {
            if (textoNorm.includes(nombre)) {
                return { iso3, nombre: nombre };
            }
        }
        return { iso3: 'ESP', nombre: 'España' }; // Por defecto, España
    },
    
    // Extraer indicador de la pregunta
    extraerIndicador: function(texto) {
        const textoNorm = this.normalizar(texto);
        for (let [indicador, palabras] of Object.entries(this.palabrasClave)) {
            for (let palabra of palabras) {
                if (textoNorm.includes(palabra)) {
                    return indicador;
                }
            }
        }
        return null;
    },
    
    // Formatear número
    formatearNumero: function(valor, unidad) {
        if (!valor) return 'Dato no disponible';
        if (unidad === 'USD') return `${Math.round(valor).toLocaleString()} USD`;
        if (unidad === '%') return `${valor.toFixed(1)}%`;
        if (unidad === 'habitantes') return `${Math.round(valor / 1000000).toLocaleString()} millones`;
        return `${valor.toLocaleString()} ${unidad}`;
    },
    
    // Responder a una pregunta
    async verificar(duda) {
        if (!duda || duda.trim() === '') {
            return {
                encontrado: true,
                respuesta: 'Por favor, escribe una pregunta.',
                factores: [],
                fuentes: []
            };
        }
        
        const texto = duda.trim();
        const indicador = this.extraerIndicador(texto);
        const { iso3, nombre: nombrePais } = this.extraerPais(texto);
        
        // Si no se detecta un indicador, respuesta genérica
        if (!indicador) {
            return {
                encontrado: true,
                respuesta: `No he entendido tu pregunta. Puedes preguntar sobre: PIB, inflación, desempleo o deuda de algún país (ej: "¿Cuál es el PIB de Francia?").`,
                factores: [],
                fuentes: ['Sistema de verificación']
            };
        }
        
        // Obtener datos del país
        let datos = null;
        try {
            datos = await window.CacheDatos?.obtenerDatos(iso3);
        } catch(e) {
            console.error('Error obteniendo datos:', e);
        }
        
        if (!datos) {
            return {
                encontrado: true,
                respuesta: `Lo siento, no tengo datos económicos disponibles para ${nombrePais}.`,
                factores: [],
                fuentes: ['Banco Mundial (datos no disponibles)']
            };
        }
        
        // Construir respuesta según el indicador
        let respuesta = '';
        let valor = null;
        let año = null;
        let unidad = '';
        
        switch(indicador) {
            case 'pib':
                valor = datos.pib?.valor;
                año = datos.pib?.año;
                unidad = 'USD';
                respuesta = `El PIB per cápita de ${nombrePais} es de ${this.formatearNumero(valor, unidad)} (datos de ${año || 'último año disponible'}).`;
                break;
            case 'inflacion':
                valor = datos.inflacion?.valor;
                año = datos.inflacion?.año;
                unidad = '%';
                respuesta = `La inflación de ${nombrePais} es del ${this.formatearNumero(valor, unidad)} (datos de ${año || 'último año disponible'}).`;
                break;
            case 'desempleo':
                valor = datos.desempleo?.valor;
                año = datos.desempleo?.año;
                unidad = '%';
                respuesta = `El desempleo en ${nombrePais} es del ${this.formatearNumero(valor, unidad)} (datos de ${año || 'último año disponible'}).`;
                break;
            case 'deuda':
                valor = datos.deuda?.valor;
                año = datos.deuda?.año;
                unidad = '% PIB';
                respuesta = `La deuda pública de ${nombrePais} es del ${this.formatearNumero(valor, unidad)} (datos de ${año || 'último año disponible'}).`;
                break;
            default:
                respuesta = `No tengo información sobre eso. Puedes preguntar sobre PIB, inflación, desempleo o deuda.`;
        }
        
        return {
            encontrado: true,
            respuesta: respuesta,
            factores: [
                { nombre: 'País', porcentaje: 100, descripcion: nombrePais },
                { nombre: 'Indicador', porcentaje: 100, descripcion: indicador },
                { nombre: 'Fuente', porcentaje: 100, descripcion: 'Banco Mundial' }
            ],
            fuentes: ['Banco Mundial', `Datos de ${año || 'año reciente'}`]
        };
    },
    
    // Generar HTML para mostrar la respuesta (manteniendo el estilo existente)
    generarHTML: function(resultado) {
        if (!resultado.encontrado) {
            return `<div class="verificacion-resultado"><p>${resultado.respuesta}</p></div>`;
        }
        
        let factoresHtml = '';
        if (resultado.factores && resultado.factores.length > 0) {
            factoresHtml = '<div class="factores-lista">';
            for (let f of resultado.factores) {
                factoresHtml += `<div class="factor-item"><strong>${f.nombre}</strong> ${f.porcentaje}%: ${f.descripcion}</div>`;
            }
            factoresHtml += '</div>';
        }
        
        let fuentesHtml = '';
        if (resultado.fuentes && resultado.fuentes.length > 0) {
            fuentesHtml = `<div class="verificacion-fuentes">📚 Fuentes: ${resultado.fuentes.join(' · ')}</div>`;
        }
        
        return `
            <div class="verificacion-resultado">
                <div class="verificacion-respuesta">${resultado.respuesta}</div>
                ${factoresHtml}
                ${fuentesHtml}
            </div>
        `;
    }
};

window.Verificador = Verificador;
