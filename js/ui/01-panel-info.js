// js/ui/01-panel-info.js - Panel lateral con datos REALES del Banco Mundial
const UIPanelInfo = {
  // Actualiza todo el panel con la información del país
  mostrarPais: function(code, nombrePais) {
    const datos = (window.MapaMundial && MapaMundial.datosPaises[code]) || {};
    const nombre = nombrePais || code;

    // Actualizar cabecera
    document.getElementById('pais-nombre').innerHTML = `🌍 ${nombre}`;
    
    // Determinar estado según PIB per cápita
    let estado = 'DESCONOCIDO';
    let estadoColor = '#9e9e9e';
    if (datos.pib) {
      if (datos.pib > 30000) { estado = 'ESTABLE'; estadoColor = '#2e7d32'; }
      else if (datos.pib > 15000) { estado = 'INQUIETO'; estadoColor = '#f57c00'; }
      else { estado = 'CRÍTICO'; estadoColor = '#b71c1c'; }
    }
    const estadoSpan = document.getElementById('pais-estado');
    estadoSpan.innerHTML = `🟢 ${estado}`;
    estadoSpan.style.backgroundColor = estadoColor;
    
    // Objetivos (usaremos PIB per cápita como métrica temporal)
    const pibValor = datos.pib ? Math.round(datos.pib / 1000) : '?';
    document.getElementById('objetivos-valor').innerHTML = `${pibValor}`;
    
    // Alertas dinámicas basadas en datos reales
    let alertasHtml = '';
    if (datos.desempleo && datos.desempleo > 8) alertasHtml += `<div class="alerta-item alerta-roja">🔴 Desempleo alto (${datos.desempleo}%)</div>`;
    if (datos.deuda && datos.deuda > 90) alertasHtml += `<div class="alerta-item alerta-amarilla">🟡 Deuda elevada (${datos.deuda}% PIB)</div>`;
    if (datos.co2 && datos.co2 > 6) alertasHtml += `<div class="alerta-item alerta-roja">🌍 Emisiones CO₂ muy altas (${datos.co2} t/persona)</div>`;
    if (!alertasHtml) alertasHtml = '<div class="alerta-item alerta-verde">✅ No hay alertas destacadas</div>';
    document.getElementById('info-alertas').innerHTML = `<h4 data-i18n="alertas">⚠️ Alertas</h4>${alertasHtml}`;
    
    // Guardar datos para que las pestañas puedan usarlos
    this.datosActuales = datos;
  },

  // Mostrar sección detallada (economía, social, clima) en un alert de momento
  mostrarSeccion: function(seccion) {
    const datos = this.datosActuales || {};
    let mensaje = '';
    switch(seccion) {
      case 'economia':
        mensaje = `📊 Datos económicos (Banco Mundial)\n
        PIB per cápita: ${datos.pib ? `$${datos.pib.toLocaleString()}` : 'No disponible'}\n
        Desempleo: ${datos.desempleo ? `${datos.desempleo}%` : 'No disponible'}\n
        Deuda pública: ${datos.deuda ? `${datos.deuda}% PIB` : 'No disponible'}`;
        break;
      case 'clima':
        mensaje = `🌍 Datos climáticos\n
        CO₂ per cápita: ${datos.co2 ? `${datos.co2} toneladas` : 'No disponible'}\n
        Consumo energético: ${datos.energia ? `${datos.energia.toLocaleString()} kg` : 'No disponible'}`;
        break;
      case 'social':
        mensaje = `👥 Datos sociales\n
        Población: ${datos.poblacion ? datos.poblacion.toLocaleString() : 'No disponible'}\n
        Esperanza de vida: ${datos.esperanzaVida ? `${datos.esperanzaVida} años` : 'No disponible'}\n
        Paro juvenil: ${datos.paroJuvenil ? `${datos.paroJuvenil}%` : 'No disponible'}`;
        break;
      default:
        mensaje = 'Información no disponible para esta sección.';
    }
    alert(mensaje);
  },

  init: function() {
    // Asignar eventos a los botones del panel
    document.querySelectorAll('.info-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const seccion = e.target.dataset.seccion;
        this.mostrarSeccion(seccion);
      });
    });
  }
};

window.UIPanelInfo = UIPanelInfo;
