// ============================================
// CADENA DE IMPACTO (UI)
// ============================================
const UIDomino = {
  init: function() {
    this.mostrarEjemplo();
  },
  mostrarEjemplo: function() {
    const cadena = CadenaImpacto.generar('petróleo', 12);
    this.render(cadena);
  },
  render: function(cadena) {
    let html = '<div class="domino-visual">';
    cadena.cadena.forEach((eslabon, index) => {
      html += `
        <div class="domino-eslabon">
          <div class="domino-icono">${eslabon.icono}</div>
          <div class="domino-contenido">
            <strong>${eslabon.titulo}</strong>
            <div class="domino-magnitud">${eslabon.magnitud > 0 ? '+' : ''}${eslabon.magnitud}%</div>
            <small>${eslabon.fuente}</small>
          </div>
        </div>
      `;
      if (index < cadena.cadena.length - 1) {
        html += '<div class="domino-flecha">↓</div>';
      }
    });
    html += '</div>';
    document.getElementById('cadena-contenido').innerHTML = html;
  }
};

window.UIDomino = UIDomino;
