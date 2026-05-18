// ============================================================
// PANEL DE INFORMACIÓN DEL PAÍS (VERSIÓN CON DATOS REALES)
// ============================================================

const UIPanelInfo = {
  // Variable para guardar los datos del país actual (útil para las pestañas)
  datosActuales: {},

  init: function() {
    // Asignar eventos a los botones del panel
    document.querySelectorAll('.info-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const seccion = e.target.dataset.seccion;
        this.mostrarSeccion(seccion);
      });
    });
  },

  // Muestra la información del país en el panel lateral
  mostrarPais: function(code, nombrePais) {
    // Obtener los datos reales desde el mapa (ya cargados del Banco Mundial)
    const datos = (window.MapaMundial && MapaMundial.datosPaises[code]) || {};
    this.datosActuales = datos; // Guardar para las pestañas
    const nombre = nombrePais || code;

    // 1. Cabecera: nombre del país
    document.getElementById('pais-nombre').innerHTML = `🌍 ${nombre}`;

    // 2. Estado (según PIB per cápita)
    let estado = 'DESCONOCIDO';
    let estadoColor = '#9e9e9e';
    if (datos.pib) {
      if (datos.pib > 30000) {
        estado = 'ESTABLE';
        estadoColor = '#2e7d32';
      } else if (datos.pib > 15000) {
        estado = 'INQUIETO';
        estadoColor = '#f57c00';
      } else {
        estado = 'CRÍTICO';
        estadoColor = '#b71c1c';
      }
    }
    const estadoSpan = document.getElementById('pais-estado');
    estadoSpan.innerHTML = `🟢 ${estado}`;
    estadoSpan.style.backgroundColor = estadoColor;

    // 3. Objetivos (usamos PIB como métrica temporal, dividido entre 1000)
    const objetivosValor = datos.pib ? Math.round(datos.pib / 1000) : '?';
    document.getElementById('objetivos-valor').innerHTML = `${objetivosValor}`;

    // 4. Alertas dinámicas basadas en datos reales
    let alertasHtml = '';
    if (datos.desempleo && datos.desempleo > 8) {
      alertasHtml += `<div class="alerta-item alerta-roja">🔴 Desempleo alto (${datos.desempleo}%)</div>`;
    }
    if (datos.deuda && datos.deuda > 90) {
      alertasHtml += `<div class="alerta-item alerta-amarilla">🟡 Deuda elevada (${datos.deuda}% PIB)</div>`;
    }
    if (datos.co2 && datos.co2 > 6) {
      alertasHtml += `<div class="alerta-item alerta-roja">🌍 Emisiones CO₂ muy altas (${datos.co2} t/persona)</div>`;
    }
    if (!alertasHtml) {
      alertasHtml = '<div class="alerta-item alerta-verde">✅ Sin alertas destacadas</div>';
    }
    document.getElementById('info-alertas').innerHTML = `<h4 data-i18n="alertas">⚠️ Alertas</h4>${alertasHtml}`;
  },

  // Muestra información detallada según la pestaña seleccionada (por ahora con alert)
  mostrarSeccion: function(seccion) {
    const datos = this.datosActuales || {};
    let mensaje = '';

    switch (seccion) {
      case 'economia':
        mensaje = `📊 Datos económicos (Banco Mundial)\n
        PIB per cápita: ${datos.pib ? `$${datos.pib.toLocaleString()}` : 'No disponible'}\n
        Desempleo: ${datos.desempleo ? `${datos.desempleo}%` : 'No disponible'}\n
        Deuda pública: ${datos.deuda ? `${datos.deuda}% PIB` : 'No disponible'}`;
        break;
      case 'social':
        mensaje = `👥 Datos sociales\n
        Población: ${datos.poblacion ? datos.poblacion.toLocaleString() : 'No disponible'}\n
        Esperanza de vida: ${datos.esperanzaVida ? `${datos.esperanzaVida} años` : 'No disponible'}\n
        Paro juvenil: ${datos.paroJuvenil ? `${datos.paroJuvenil}%` : 'No disponible'}`;
        break;
      case 'clima':
        mensaje = `🌍 Datos climáticos\n
        CO₂ per cápita: ${datos.co2 ? `${datos.co2} toneladas` : 'No disponible'}\n
        Energía per cápita: ${datos.energia ? `${datos.energia.toLocaleString()} kg` : 'No disponible'}`;
        break;
      default:
        mensaje = 'Información en desarrollo para esta sección.';
    }
    alert(mensaje);
  }
};

window.UIPanelInfo = UIPanelInfo;
