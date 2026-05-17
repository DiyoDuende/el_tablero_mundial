// ============================================
// DECAIMIENTO - Efectos temporales
// ============================================
const Decaimiento = {
  lambda: 0.1,
  constantes: {
    militar: 0.05,
    económico: 0.1,
    social: 0.15,
    financiero: 0.2,
    político: 0.1,
    energético: 0.08
  },
  calcular: function(impactoInicial, tiempo, poder) {
    const lambda = this.constantes[poder] || this.lambda;
    return impactoInicial * Math.exp(-lambda * tiempo);
  },
  tiempoParaPorcentaje: function(porcentaje, poder) {
    const lambda = this.constantes[poder] || this.lambda;
    return -Math.log(porcentaje) / lambda;
  },
  aplicar: function(territorioId, tiempoTranscurrido) {
    if (CONFIG.modo !== 'juego') return;
    for (let poder of PODERES.lista) {
      const valorActual = EstadoTablero.obtenerPoder(territorioId, poder);
      const desviacion = valorActual - 0.5;
      const nuevaDesviacion = desviacion * Math.exp(-this.lambda * tiempoTranscurrido);
      const nuevoValor = 0.5 + nuevaDesviacion;
      EstadoTablero.setPoder(territorioId, poder, nuevoValor);
    }
  }
};

window.Decaimiento = Decaimiento;
