// js/simulador/10-visor-cadena.js
const VisorCadena = {
    cadenas: {
        gasolina: {
            id: 'gasolina',
            evento: 'Aumento del precio de la gasolina',
            descripcion: 'Tensiones geopolíticas y recorte de suministros',
            cadena: [
                { nivel: 1, titulo: 'Precio del petróleo', icono: '🛢️', impacto: '+12%' },
                { nivel: 2, titulo: 'Coste de transporte', icono: '🚛', impacto: '+9%' },
                { nivel: 3, titulo: 'Inflación', icono: '💰', impacto: '+2.5%' },
                { nivel: 4, titulo: 'Poder adquisitivo', icono: '📉', impacto: '-1.5%' }
            ]
        },
        inflacion: {
            id: 'inflacion',
            evento: 'Aumento de la inflación',
            descripcion: 'Subida de precios energéticos y de alimentos',
            cadena: [
                { nivel: 1, titulo: 'Energía', icono: '⚡', impacto: '+12%' },
                { nivel: 2, titulo: 'Alimentos', icono: '🍎', impacto: '+8%' },
                { nivel: 3, titulo: 'Salarios reales', icono: '💶', impacto: '-2%' }
            ]
        }
    },
    
    buscarYMostrar: function(texto) {
        const textoLower = texto.toLowerCase();
        for (let clave in this.cadenas) {
            if (textoLower.includes(clave)) {
                return this.generarHTML(this.cadenas[clave].id);
            }
        }
        return '<div class="cadena-container"><p>🔗 No se encontró una cadena de impacto específica para esta consulta.</p></div>';
    },
    
    generarHTML: function(id) {
        const cadena = this.cadenas[id];
        if (!cadena) return '';
        let html = '<div class="cadena-container"><h4>🔗 Cadena de impacto</h4><div class="cadena-visual">';
        cadena.cadena.forEach((e, idx) => {
            html += `<div class="cadena-eslabon"><span class="cadena-icono">${e.icono}</span> <strong>${e.titulo}</strong> <span class="cadena-valor">${e.impacto}</span></div>`;
            if (idx < cadena.cadena.length - 1) html += '<div class="cadena-flecha">↓</div>';
        });
        html += '</div><p class="cadena-fuente">Fuentes: ICE, OMIE, INE</p></div>';
        return html;
    }
};

window.VisorCadena = VisorCadena;
