// ============================================
// EVENTOS FUTUROS - Proyecciones automáticas
// ============================================
const EventosFuturos = {
  generarParaAño: function(año) {
    const añoActual = new Date().getFullYear();
    const diferencia = año - añoActual;
    if (diferencia < 0) return [];
    const eventos = [];
    if (año % 4 === 0) {
      eventos.push({
        fecha: `${año}-05-15`,
        titulo: `Elecciones generales ${año}`,
        tipo: 'política',
        icono: '🗳️'
      });
    }
    eventos.push({
      fecha: `${año}-10-15`,
      titulo: `Presupuestos Generales ${año}`,
      tipo: 'economía',
      icono: '💰'
    });
    eventos.push({
      fecha: `${año}-11-15`,
      titulo: `Cumbre del G20 ${año}`,
      tipo: 'diplomacia',
      icono: '🌐'
    });
    return eventos;
  },
  proyectar: function(años = 5) {
    const añoActual = new Date().getFullYear();
    const proyecciones = [];
    for (let i = 1; i <= años; i++) {
      proyecciones.push({
        año: añoActual + i,
        eventos: this.generarParaAño(añoActual + i)
      });
    }
    return proyecciones;
  }
};

window.EventosFuturos = EventosFuturos;
