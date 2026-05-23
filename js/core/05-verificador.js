// Verificador ciudadano con base de conocimiento ampliada
const Verificador = {
    baseConocimiento: {
        gasolina: {
            estado: 'verdadero',
            respuesta: 'El precio de la gasolina ha subido un 12% por tensiones geopolíticas.',
            factores: [
                { nombre: 'Energía global', porcentaje: 42, descripcion: 'Precio petróleo +15%' },
                { nombre: 'Geopolítica', porcentaje: 28, descripcion: 'Conflictos en rutas marítimas' },
                { nombre: 'Economía', porcentaje: 18, descripcion: 'Inflación +2.3%' },
                { nombre: 'Fiscalidad', porcentaje: 12, descripcion: 'IVA estable' }
            ],
            fuentes: ['IEA', 'Ministerio Transición Ecológica']
        },
        inflacion: {
            estado: 'verdadero',
            respuesta: 'La inflación actual del 2.8% se debe a precios energéticos y alimentos.',
            factores: [
                { nombre: 'Energía', porcentaje: 45, descripcion: 'Electricidad +8%' },
                { nombre: 'Alimentos', porcentaje: 30, descripcion: 'Materias primas +6%' },
                { nombre: 'Servicios', porcentaje: 15, descripcion: 'Hostelería +4%' },
                { nombre: 'Vivienda', porcentaje: 10, descripcion: 'Alquileres +2%' }
            ],
            fuentes: ['INE', 'Eurostat']
        }
    },
    normalizar: function(texto) {
        return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },
    verificar: function(duda) {
        const normal = this.normalizar(duda);
        for (let [clave, valor] of Object.entries(this.baseConocimiento)) {
            if (normal.includes(clave)) return { encontrado: true, ...valor, duda };
        }
        return { encontrado: false, respuesta: 'No hay información suficiente.', factores: [], fuentes: [] };
    },
    generarHTML: function(resultado) {
        if (!resultado.encontrado) return `<div><p>${resultado.respuesta}</p></div>`;
        let factoresHtml = '';
        resultado.factores.forEach(f => {
            factoresHtml += `<div><strong>${f.nombre}</strong> ${f.porcentaje}%: ${f.descripcion}</div>`;
        });
        return `<div><p>${resultado.respuesta}</p>${factoresHtml}<p>Fuentes: ${resultado.fuentes.join(', ')}</p></div>`;
    }
};
window.Verificador = Verificador;
