// js/ui/01-panel-info.js - Panel lateral con datos reales
const UIPanelInfo = {
  datosPaises: MapaMundial.datosPaises, // referencia

  init: function() {
    document.querySelectorAll('.info-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const seccion = e.target.dataset.seccion;
        this.mostrarSeccion(seccion);
      });
    });
  },

  mostrarPais: function(paisId) {
    const code = paisId?.toUpperCase();
    const datos = MapaMundial.datosPaises[code] || {};
    const nombre = TERRITORIOS[paisId]?.nombre || paisId;

    document.getElementById('pais-nombre').innerHTML = `🇪🇸 ${nombre}`;
    const estado = datos.pib ? (datos.pib > 30000 ? 'ESTABLE' : (datos.pib > 10000 ? 'INQUIETO' : 'TENSIÓN')) : 'DESCONOCIDO';
    document.getElementById('pais-estado').innerHTML = `🟢 ${estado}`;
    document.getElementById('objetivos-valor').innerHTML = datos.pib ? Math.round(datos.pib / 1000) : '?';

    let alertasHtml = '';
    if (datos.desempleo && datos.desempleo > 10) alertasHtml += `<div class="alerta-item alerta-roja">🔴 Desempleo alto (${datos.desempleo}%)</div>`;
    if (datos.deuda && datos.deuda > 100) alertasHtml += `<div class="alerta-item alerta-amarilla">🟡 Deuda excesiva (${datos.deuda}%)</div>`;
    if (!alertasHtml) alertasHtml = '<div class="alerta-item alerta-verde">✅ Sin alertas destacadas</div>';
    document.getElementById('info-alertas').innerHTML = `<h4 data-i18n="alertas">⚠️ Alertas</h4>${alertasHtml}`;
  },

  mostrarSeccion: function(seccion) {
    const paisId = document.getElementById('pais-nombre').innerText.split(' ')[1]?.toLowerCase();
    const code = paisId?.toUpperCase();
    const datos = MapaMundial.datosPaises[code] || {};
    let html = '';
    switch(seccion) {
      case 'economia':
        html = `
          <h5>📊 Datos económicos (Banco Mundial)</h5>
          <p>PIB per cápita: ${datos.pib ? `$${datos.pib.toLocaleString()}` : 'No disponible'}</p>
          <p>Desempleo: ${datos.desempleo ? `${datos.desempleo}%` : 'No disponible'}</p>
          <p>Deuda pública: ${datos.deuda ? `${datos.deuda}%` : 'No disponible'}</p>
        `;
        break;
      case 'social':
        html = `
          <h5>👥 Datos sociales</h5>
          <p>Población: ${datos.poblacion ? datos.poblacion.toLocaleString() : 'No disponible'}</p>
          <p>Esperanza de vida: ${datos.esperanzaVida ? `${datos.esperanzaVida} años` : 'No disponible'}</p>
          <p>Paro juvenil: ${datos.paroJuvenil ? `${datos.paroJuvenil}%` : 'No disponible'}</p>
        `;
        break;
      case 'clima':
        html = `
          <h5>🌍 Datos climáticos</h5>
          <p>CO₂ per cápita: ${datos.co2 ? `${datos.co2} t` : 'No disponible'}</p>
          <p>Energía per cápita: ${datos.energia ? `${datos.energia.toLocaleString()} kg` : 'No disponible'}</p>
        `;
        break;
      default:
        html = '<p>Información no disponible para esta sección.</p>';
    }
    alert(html.replace(/<[^>]*>/g, ' '));
  }
};

window.UIPanelInfo = UIPanelInfo;
