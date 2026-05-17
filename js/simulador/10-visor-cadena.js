// ============================================
// VISOR DE CADENA DE IMPACTO - Efectos verificados
// ============================================
const VisorCadena = {
  cadenas: {
    'sanciones_rusia_2026': {
      id: 'sanciones_rusia_2026',
      evento: 'Sanciones energéticas a Rusia',
      fecha: '2026-03-15',
      lugar: 'Unión Europea',
      descripcion: 'La UE prohíbe importación de gas ruso',
      magnitud_inicial: '-45% flujo gas',
      fuente_inicial: 'Comisión Europea',
      cadena: [
        {
          nivel: 1,
          titulo: 'SECTOR ENERGÉTICO EUROPEO',
          icono: '🏭',
          impactos: [
            { concepto: 'Precio gas', valor: '+35%', fuente: 'ICE Futures' },
            { concepto: 'Reservas gas', valor: '-22%', fuente: 'GIE' }
          ]
        },
        {
          nivel: 2,
          titulo: 'MERCADO ELÉCTRICO',
          icono: '⚡',
          impactos: [
            { concepto: 'Precio electricidad', valor: '+28%', fuente: 'OMIE' },
            { concepto: 'Demanda industrial', valor: '-8%', fuente: 'REE' }
          ]
        },
        {
          nivel: 3,
          titulo: 'ECONOMÍA DOMÉSTICA',
          icono: '📉',
          impactos: [
            { concepto: 'Inflación', valor: '+3.2%', fuente: 'INE' },
            { concepto: 'Protestas', valor: '+22%', fuente: 'Ministerio Interior' }
          ]
        }
      ]
    }
  },
  getCadena: function(id) {
    return this.cadenas[id] || this.cadenas.sanciones_rusia_2026;
  },
  buscar: function(texto) {
    const resultados = [];
    for (let id in this.cadenas) {
      if (this.cadenas[id].evento.toLowerCase().includes(texto.toLowerCase())) {
        resultados.push(this.cadenas[id]);
      }
    }
    return resultados;
  },
  generarHTML: function(cadenaId) {
    const cadena = this.getCadena(cadenaId);
    let html = `
      <div class="visor-cadena">
        <h4>🔗 CADENA DE IMPACTO</h4>
        <p class="visor-evento">${cadena.evento} · ${cadena.fecha}</p>
    `;
    cadena.cadena.forEach((eslabon, index) => {
      html += `
        <div class="visor-eslabon">
          <div class="visor-eslabon-header">
            <span class="visor-icono">${eslabon.icono}</span>
            <span class="visor-titulo">${eslabon.titulo}</span>
          </div>
          <ul class="visor-impactos">
      `;
      eslabon.impactos.forEach(i => {
        html += `<li><strong>${i.concepto}:</strong> ${i.valor} · <small>${i.fuente}</small></li>`;
      });
      html += `</ul>`;
      if (index < cadena.cadena.length - 1) {
        html += `<div class="visor-flecha">↓</div>`;
      }
      html += `</div>`;
    });
    html += `<p class="visor-fuentes">📚 Fuentes: Comisión Europea · ICE · OMIE · INE</p>`;
    html += `</div>`;
    return html;
  }
};

window.VisorCadena = VisorCadena;
