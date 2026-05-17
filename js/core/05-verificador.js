// ============================================
// VERIFICADOR CIUDADANO
// ============================================
const Verificador = {
  baseConocimiento: {
    'sueldo diputados': {
      estado: 'falso',
      explicacion: 'El sueldo base de los diputados es 3.050,68€/mes. La última subida fue del 2,5% (IPC 2025). No hay ninguna subida del 20%.',
      fuentes: ['Congreso.es', 'EFE']
    },
    'tropas ucrania': {
      estado: 'falso',
      explicacion: 'España NO ha enviado tropas de combate a Ucrania. SÍ ha enviado instructores militares para entrenamiento en países vecinos.',
      fuentes: ['Ministerio Defensa', 'Reuters']
    },
    'iva luz': {
      estado: 'falso',
      explicacion: 'El IVA de la luz sigue en el 10% (tipo reducido). No hay ningún proyecto de ley para subirlo al 21%.',
      fuentes: ['BOE', 'Ministerio Hacienda']
    },
    'inflacion': {
      estado: 'verdadero',
      explicacion: 'La inflación en España se sitúa en el 2,8% interanual, según el último dato del INE.',
      fuentes: ['INE']
    },
    'petróleo': {
      estado: 'verdadero',
      explicacion: 'El precio del petróleo ha subido un 12% en el último mes debido a tensiones geopolíticas.',
      fuentes: ['ICE', 'Reuters']
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
      explicacion: 'No hay información suficiente para verificar esta duda.',
      fuentes: []
    };
  },
  generarHTML: function(resultado) {
    if (!resultado.encontrado) {
      return `
        <div class="verificacion-no-encontrada">
          <p>${resultado.explicacion}</p>
        </div>
      `;
    }
    const color = resultado.estado === 'falso' ? 'var(--danger)' : 'var(--success)';
    const icono = resultado.estado === 'falso' ? '❌' : '✅';
    return `
      <div class="verificacion-resultado" style="border-left-color: ${color}">
        <div class="verificacion-icono">${icono}</div>
        <div class="verificacion-contenido">
          <p class="verificacion-estado">${resultado.estado.toUpperCase()}</p>
          <p class="verificacion-explicacion">${resultado.explicacion}</p>
          <p class="verificacion-fuentes">📚 Fuentes: ${resultado.fuentes.join(', ')}</p>
        </div>
      </div>
    `;
  }
};

window.Verificador = Verificador;
